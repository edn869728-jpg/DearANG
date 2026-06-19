# Dear ANG｜街景入口 Drive 修正版

這版重點：
- GitHub Pages 只放入口 UI、街景主圖、CSS/JS。
- 照片、影片、歌曲、食物照片都從 Google Drive + GAS 讀取，不要搬到 GitHub。
- 已加入 `<base href="/DearANG/">`，避免 `https://edn869728-jpg.github.io/DearANG` 少斜線時資源路徑跑掉。
- 已移除我之前亂補的故事文字，只保留分類入口與資料夾提示。

## GitHub Pages 上傳
把本 ZIP 解壓後，將這些放到 DearANG repo 根目錄：

- index.html
- assets/images/memory-world.png
- assets/images/sixth_tree.jpeg
- 其他 assets/images 內圖片

不要只上傳 index.html，assets 資料夾也要一起上傳。

## Google Drive 資料夾對應

- 01_有你的時光 → 華光相館／一般照片
- 02_影音館 → 新時代影音館／影片
- 03_他的家 → 中間公寓／他個人的照片
- 04_金嗓卡拉OK → 他唱的歌、音檔、唱歌影片
- 05_美而美早餐店 → 一起吃過的、他喜歡吃的、他推薦吃的
- 06_通往他的路 → 公路局／導航、街景、第六棵樹相關照片

## 注意
若畫面破圖，通常是 GitHub 上沒有一起上傳 assets/images/。
若照片沒有出現，通常是 Google Drive 資料夾名稱沒有對到，或 GAS getMemorialData 沒有回傳 photoGroups / memories / songs。
