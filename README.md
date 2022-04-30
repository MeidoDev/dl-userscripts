# dl-userscripts

Various userscripts used to automate downloads from PIXIV, Fanbox, etc.

Setup
---

Other than installing the userscript(s) in [Tampermonkey](https://www.tampermonkey.net) or any other compatible userscript extension, you will also need to set up a local instance of [aria2](https://github.com/aria2/aria2), which will be in charge of actually downloading the files.


```bash
aria2c[.exe] -d "<downloadDir>" --enable-rpc --rpc-allow-origin-all --header="Cookie: FANBOXSESSID=<fanboxSessionID"
```

- **downloadDir** should point to the root directory where all downloads will be stored. Note that each script will create a subfolder (i.e. `<downloadDir>/PixivDL`).

- **fanboxSessionID** is needed if you want to download images from subscriber Fanbox posts. You can determine the ID from your browser cookies.

