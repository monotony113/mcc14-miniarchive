/* global $ window document xhr alert XMLHttpRequest XDomainRequest */

$(document).ready(() => {

	"use strict";

	var imageList = [];
	var collections = {};
	var tags = {};

	function ImagePost(id, title, content, categories, tags, pageUrl, imgPostUrl) {
		this.id = id;
		this.title = title;
        var contentText = $(content).prop("innerText");;
        this.metadata = {
            date: (() => { try { return new Date(contentText.match(/Recorded:.(.*)/)[1]) } catch(err) { return null } } )(),
            location: (() => { try { return contentText.match(/Location:.(.*)/)[1] } catch(err) { return null } } )(),
            desc: (() => { try { return contentText.match(/Description:.(.*)/)[1] } catch(err) { return null } } )()
        }
		this.metadata.collections = categories;
		this.metadata.tags = tags;
		this.pageUrl = pageUrl;
		this.imgPostUrl = imgPostUrl;
	};

	function refresh(url) {
		fetchPosts(url)
			.then((data) => {
				makeImageListFrom(data);
			})
			.then(() => {
				$("#photo-list").empty();
				imageList.forEach((item, index) => {
					$("#photo-list").append(createImageTile(item));
				})
				imageList.forEach((item, index) => {
					fillImageTile(item);
				})
			});
	};

	function fetchPosts(url) {
		return new Promise((resolve, reject) => {
			$.ajax({
					method: "GET",
					url: url,
					contentType: "text/plain",
					xhrFields: {
						withCredentials: true
					}
				})
				.then((data, status) => {
					resolve(data);
				})
				.fail((jqXHR, status, error) => {
					reject(status);
				});
		});
	};

	function makeImageListFrom(data) {
		return new Promise((resolve, reject) => {
			console.log(data);
			data.forEach((item, index) => {
				try {
					var imagePost = new ImagePost(`photo-${index}`, item.title.rendered, item.content.rendered, item.categories, item.tags, item.link, item._links["wp:featuredmedia"][0].href);
					imageList.push(imagePost);
				} catch (err) {
					console.error(err);
				}
			});
		});
	}

	function getThumbnailUrl(imagePost) {
		return new Promise((resolve, reject) => {
			$.ajax({
					method: "GET",
					url: imagePost.imgPostUrl,
					contentType: "text/plain",
					xhrFields: {
						withCredentials: true
					}
				})
				.then((data, status) => {
					resolve(data.media_details.sizes.large.source_url);
				})
				.fail((jqXHR, status, error) => {
					reject(status);
				});
		})
	};

	function createImageTile(imagePost) {
		var tileContainer = $("<div>").addClass("tile-container").attr('id', imagePost.id);
		var image = $("<img>").addClass("image-content");
		var info = $("<span>").addClass("info-content");
		var title = $("<span>").addClass("image-title");
		var tile = $(tileContainer).append(title).append(info).append(image);
		return tile;
	};

	function fillImageTile(imagePost) {
        $(`#${imagePost.id} .image-title`).text(imagePost.title);
        var dateString = imagePost.metadata.date ? imagePost.metadata.date.toDateString() : "Unknown date";
        var locationString = imagePost.metadata.location || "Unknown location";
        var descString = imagePost.metadata.desc || "No description";
        $(`#${imagePost.id} .info-content`).append(`<p>${dateString}<br>${locationString}<br>${descString}</p>`);
		getThumbnailUrl(imagePost).then((thumbnailUrl) => {
			imagePost.thumbnailUrl = thumbnailUrl;
			$(`#${imagePost.id} .image-content`).attr("src", thumbnailUrl);
		})
	}

	fetchPosts("https://wp.nyu.edu/mcc014f18_tw_miniarchive/wp-json/wp/v2/categories")
		.then((data) => {
			data.forEach((item, index) => {
				if (item.parent === 5) {
					collections[`${item.id}`] = item.name;
				};
			});
			console.log(collections);
		});
	fetchPosts("https://wp.nyu.edu/mcc014f18_tw_miniarchive/wp-json/wp/v2/tags")
		.then((data) => {
			data.forEach((item, index) => {
				tags[`${item.id}`] = item.name;
			});
			console.log(tags);
		});


	refresh("https://wp.nyu.edu/mcc014f18_tw_miniarchive/wp-json/wp/v2/posts?categories=5&per_page=20");

});
