// ==UserScript==
// @name         FanboxDL
// @namespace    meido-dev.dl-userscripts.fanbox
// @version      2.0
// @description  Batch download from Pixiv Fanbox Posts
// @author       MeidoDev
// @match        https://www.fanbox.cc/*/posts/*
// @icon         https://www.google.com/s2/favicons?domain=fanbox.cc
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Prevent the script running twice on the same page
    if (location.href.endsWith('proxy_storage')) {
        return;
    }

    /*
     * Due to the way the page is loaded ansynchronously, none of the
     * required DOM elements are present on `document.load`.
     * Thus, we delay the execution by a few seconds till everything is loaded.
     */
    window.setTimeout(function() {
        // Determine if there's any downloadable images
        const downloadLinkList = [];

        document
            .querySelectorAll('a[href^="https://downloads.fanbox.cc"]')
            .forEach(item => {
                if (item.href.match(/\.(png|jp.g)$/)) {
                    downloadLinkList.push(item.href);
                }
            })
        ;

        if (downloadLinkList.length > 0) {
            const title = document.querySelector('article h1');

            title.innerHTML = `<span data-fanboxdl-download style="cursor: pointer;">🔽</span> ${title.innerHTML}`;

            document
                .querySelector('[data-fanboxdl-download]')
                .addEventListener('click', function() {
                    const userName = location.href.match(/\/(@[^\/]+)\//)[1];
                    const postId = location.href.match(/\/(\d+)$/)[1];
                    const ajax = new XMLHttpRequest();
                    let ariaParams = [];

                    for (let i = 0; i < downloadLinkList.length; i++) {
                        const ext = downloadLinkList[i].substr(downloadLinkList[i].lastIndexOf('.'));

                        ariaParams.push({
                            jsonrpc: '2.0',
                            id: `${postId}-${i}`,
                            method: 'aria2.addUri',
                            params: [
                                [downloadLinkList[i]],
                                {out: `${userName}/${postId}/${postId}_${(i+1).toString().padStart(2, 0)}${ext}`}
                            ]
                        });
                    }

                    ariaParams = btoa(JSON.stringify(ariaParams));

                    ajax.open('GET', `http://localhost:6800/jsonrpc?params=${encodeURI(ariaParams)}`);
                    ajax.send();
                }, {once: true})
            ;
        }
    }, 3000);
})();
