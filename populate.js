/* global $ window document xhr alert XMLHttpRequest XDomainRequest */

$(document).ready(() => {

	var imageList = [];
	var allImages = [];
	var collections = {};
	var tags = {};
	const itemsPerPage = 20;

	function ImagePost(id, title, content, categories, tags, pageUrl, imgPostUrl) {
		this.id = id;
		this.title = title;
		var contentText = $(content).prop("innerText");;
		this.metadata = {
			date: (() => {
				try {
					return new Date(contentText.match(/Recorded:.(.*)/)[1])
				} catch (err) {
					return null
				}
			})(),
			location: (() => {
				try {
					return contentText.match(/Location:.(.*)/)[1]
				} catch (err) {
					return null
				}
			})(),
			desc: (() => {
				try {
					return contentText.match(/Description:.(.*)/)[1]
				} catch (err) {
					return null
				}
			})()
		}
		this.metadata.collections = categories;
		this.metadata.tags = tags;
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
				.then((data, status, jqXHR) => {
					console.log()
					resolve({
						data: data,
						status: status,
						total: jqXHR.getResponseHeader("X-WP-Total")
					});
				})
				.fail((jqXHR, status, error) => {
					reject(status);
				});
		});
	};

	function getAllImagesFrom(response) {
		return new Promise((resolve, reject) => {
			console.log(response.data);
			response.data.forEach((item, index) => {
				try {
					var imagePost = new ImagePost(`photo-${index}`, item.title.rendered, item.content.rendered, item.categories, item.tags, item.link, item._links["wp:featuredmedia"][0].href);
					allImages.push(imagePost);
				} catch (err) {
					console.error(err);
				}
			});
		});
	};

	function refreshGallery() {
		$("#photo-list").empty();
		imageList.forEach((item, index) => {
			$("#photo-list").append(createImageTile(item));
		})
		imageList.forEach((item, index) => {
			fillImageTile(item);
		})
	};

	function sortList(imageList, field, order) {

	}

	function filterList(field, keyword) {

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
		var info = $("<span>").addClass("info-content hidden");
		var title = $("<span>").addClass("image-title hidden");
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

	function getCategories(page) {
		fetchPosts(`https://wp.nyu.edu/mcc014f18_tw_miniarchive/wp-json/wp/v2/categories?page=${page}&per_page=${itemsPerPage}`)
			.then((response) => {
				response.data.forEach((item, index) => {
					if (item.parent === 5) {
						collections[`${item.id}`] = item.name;
					};
				});
				console.log(collections);
				if (page * itemsPerPage < response.total) {
					page++
					getCategories(page)
				} else {

                }
			});
	}
	getCategories(1);

	function getTags(page) {
		fetchPosts(`https://wp.nyu.edu/mcc014f18_tw_miniarchive/wp-json/wp/v2/tags?page=${page}&per_page=${itemsPerPage}`)
			.then((response) => {
				response.data.forEach((item, index) => {
					tags[`${item.id}`] = item.name;
				});
				console.log(tags);
				if (page * itemsPerPage < response.total) {
					page++
					getTags(page)
				} else {
                    Object.keys(tags).forEach((key, index) => {
                        $("div.filter div.menu-2").append(`<button class="btn">${tags[key]}</button>`)
                    })
                }
			});
	}
	getTags(1);

	function getPosts(page) {
		fetchPosts(`https://wp.nyu.edu/mcc014f18_tw_miniarchive/wp-json/wp/v2/posts?page=${page}&per_page=${itemsPerPage}`)
			.then((response) => {
				getAllImagesFrom(response);
				return Promise.resolve(response);
			})
			.then((response) => {
				if (page === 1) {
					imageList = allImages;
					refreshGallery();
				}
				return Promise.resolve(response);
			})
			.then((response) => {
				if (page * itemsPerPage < response.total) {
					page++
					getPosts(page)
				}
			})
	};
	getPosts(1);

    $("#photo-list").on("mouseover", ".tile-container", () => {
        $("#title-space").text($(event.target).closest(".tile-container").find(".image-title").text());
        $(event.target).closest(".tile-container").find(".info-content").clone().removeClass("hidden").appendTo("#details");
    }).on("mouseout", ".tile-container", () => {
        $("#title-space").text("-");
        $("#details").empty();
    });

});
