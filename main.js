/* global $ window document xhr alert XMLHttpRequest XDomainRequest */

$(document).ready(() => {

	"use strict";

	var imageList = [];

	function ImagePost(id, pageUrl, imgPostUrl) {
		this.id = id;
		this.pageUrl = pageUrl;
		this.imgPostUrl = imgPostUrl;
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
                var imagePost = new ImagePost(`photo-${index}`, item.link, item._links["wp:featuredmedia"][0].href);
                imageList.push(imagePost);
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
		var info = $("<span>").addClass("info-content").attr("display", "none");
		var tile = $(tileContainer).append(image).append(info);
		return tile;
	};

    function fillImageTile(imagePost) {
        getThumbnailUrl(imagePost).then((thumbnailUrl) => {
            imagePost.thumbnailUrl = thumbnailUrl;
            $(`#${imagePost.id} img`).attr("src", thumbnailUrl);
        })
    }

	fetchPosts("https://wp.nyu.edu/mcc014f18_tw_miniarchive/wp-json/wp/v2/posts?categories=5&per_page=20")
		.then((data) => {
            makeImageListFrom(data);
        })
        .then(() => {
            imageList.forEach((item, index) => {
                $("#photo-list").append(createImageTile(item));
            })
            imageList.forEach((item, index) => {
                fillImageTile(item);
            })
        });

});
