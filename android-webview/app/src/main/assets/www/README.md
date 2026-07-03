# Dear ANG v36｜完整還原＋訪客名片版

這包已經整合：

- 使用你上傳的目前版 index.html 文字。
- 倒數後進入直式 1080×1920 木框影片。
- 木框影片檔：`assets/videos/mini-frame.mp4`。
- 框內小世界位置：left 50 / top 667 / width 976 / height 553。
- 點進世界後主街直接使用新的天氣圖，不再用舊圖背景切法。
- 免密碼訪客名片：名字 / 城市 / 行政區 / 留言。
- 有填名字：同一瀏覽器之後不再跳。
- 沒填名字：下次進來還會再問。
- 背景私人訪客紀錄，前台不公開顯示。

## 上傳 GitHub Pages

把 ZIP 解壓後，整包內容上傳到 DearANG repo 根目錄。

## GAS 訪客紀錄

請打開 `GAS_訪客紀錄_加入原本Code.gs`，把裡面的程式碼照說明貼到你原本 GAS。
貼完後重新部署 GAS 新版本。

## 城市自動預填

預設不會自動抓城市。若你要自動預填城市：

1. 部署 `geo-worker.js` 到 Cloudflare Worker。
2. 把 Worker `/geo` 網址填到 `index.html` 裡的 `GEO_WORKER_URL`。

