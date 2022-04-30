// ==UserScript==
// @name         PixivDL
// @namespace    meido-dev.dl-userscripts.pixiv
// @version      1.0
// @description  Batch download from Pixiv Posts
// @author       You
// @match        https://www.pixiv.net/en/artworks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @run-at       document-body
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        /*
         * Since the page generates many sub-threads which invoke their own copy
         * of the userscript, check if the current instance operates on a document
         * which has actual content in the body.
         */
        if (document.body.innerHTML.length === 0) {
            return;
        }
        console.log('init');

        const ajax = new XMLHttpRequest();
        const postId = location.pathname.match(/\/(\d+)$/)[1];
        let imageData = [];

        ajax.open('GET', `//www.pixiv.net/ajax/illust/${postId}/pages`);
        ajax.onload = function() {
            const response = JSON.parse(ajax.response);

            if (response.error === false) {
                imageData = response.body;
            }

            if (imageData.length > 0) {
                const title = document.querySelector('h1');

                title.innerHTML = `<span data-pixivdl-download style="cursor: pointer;">🔽</span> ${title.innerHTML}`;

                document
                    .querySelector('[data-pixivdl-download]')
                    .addEventListener('click', function() {
                    // There's apparently no sane way to determine the user ID
                    const authorId = document.querySelector('[href^="/en/users/"]').href.match(/\/users\/(\d+)$/)[1];
                    let ariaParams = [];

                    for (let i = 0; i < imageData.length; i++) {
                        const fileUrl = imageData[i].urls.original;
                        const fileName = fileUrl.substr(fileUrl.lastIndexOf('/'));

                        ariaParams.push({
                            jsonrpc: '2.0',
                            id: fileName,
                            method: 'aria2.addUri',
                            params: [
                                [fileUrl],
                                {
                                    out: `PixivDL/${authorId}/${fileName}`,
                                    referer: 'https://www.pixiv.net/'
                                }
                            ]
                        });
                    }

                    ariaParams = btoa(JSON.stringify(ariaParams));

                    ajax.open('GET', `http://localhost:6800/jsonrpc?params=${encodeURI(ariaParams)}`);
                    ajax.send();
                })
                ;
            }
        };
        ajax.send();
    }, 1000);
})();
