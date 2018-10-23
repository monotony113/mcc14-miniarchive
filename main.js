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
                newA.setAttribute('href', item.link)

                var newText = document.createTextNode(item.title.rendered)
                newA.appendChild(newText)
                newP.appendChild(newA)
                newLi.appendChild(newP)
                document.getElementById('photo-list').appendChild(newLi)
            })
        },
        error: (jqXHR, status, error) => {
            alert(status)
        }
    })

})
