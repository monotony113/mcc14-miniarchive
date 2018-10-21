/* global $ window document */

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}

var xhr = createCORSRequest('GET', 'https://wp.nyu.edu/mcc014f18_tw_miniarchive/wp-json/wp/v2/posts?category=photos');
if (!xhr) {
    throw new Error('CORS not supported');
}

xhr.withCredentials = true;

xhr.onload = function () {
    var responseText = xhr.responseText;
    alert(responseText);
    // process the response.
};

xhr.onerror = function () {
    alert('There was an error!');
};

xhr.send();
