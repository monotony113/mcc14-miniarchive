/* global $ window document xhr alert XMLHttpRequest XDomainRequest */

var list = undefined

$(document).ready(() => {

    $.ajax({
        method: 'GET',
        url: 'https://wp.nyu.edu/mcc014f18_tw_miniarchive/wp-json/wp/v2/posts?categories=5&per_page=20',
        contentType: 'text/plain',
        xhrFields: {
            withCredentials: true
        },
        success: (data, status) => {
            console.log(data)
            data.forEach((item, index) => {
                var newLi = document.createElement('li')
                var newP = document.createElement('p')
                var newA = document.createElement('a')
                var imgsrc = item._links["wp:featuredmedia"][0].href
                newA.setAttribute('href', item.link)
                newA.setAttribute('target', '_blank')
                var newText = document.createTextNode(item.title.rendered)
                newA.appendChild(newText)
                newP.appendChild(newA)
                newLi.appendChild(newP)
                document.getElementById('photo-list').appendChild(newLi)
                $.ajax({
                    method: 'GET',
                    url: imgsrc,
                    contentType: 'text/plain',
                    xhrFields: {
                        withCredentials: true
                    },
                    success: (data, status) => {
                        var imgsrc = data.media_details.sizes.medium.source_url
                        var newIMG = document.createElement('img')
                        newIMG.setAttribute('src', imgsrc)
                        newLi.appendChild(newIMG)
                    }
                })
            })
        },
        error: (jqXHR, status, error) => {
            alert(status)
        }
    })

})
