/**
 * Queues one or more downloads.
 * Expected format for `downloadJobs`:
 *
 * [[url1, out1, uid1], [url2, out2, uid2], ...]
 *
 * @param {Array} downloadJobs
 */
function queueDownload(downloadJobs) {
    let ariaParams = [];
    
    for (let i = 0; i < downloadJobs.length; i++) {
        ariaParams.push({
            jsonrpc: '2.0',
            id: downloadJobs[i][2],
            method: 'aria2.addUri',
            params: [
                [downloadJobs[i][0]],
                {out: downloadJobs[i][1]}
            ]
        });
    }
    
    ariaParams = btoa(JSON.stringify(ariaParams));

    ajax.open('GET', `http://localhost:6800/jsonrpc?params=${encodeURI(ariaParams)}`);
    ajax.send();
}
