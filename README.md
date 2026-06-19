# Dear ANG Memory World v3

## 這版修正
- GitHub Pages 主圖固定讀取 `assets/images/memory-world.png`。
- 第六棵樹圖固定讀取 `assets/images/sixth_tree.jpeg`。
- 主題曲優先讀 Google Drive / GAS；如果 GAS 沒回傳，會自動 fallback 到 `assets/audio/dear-ang-theme.mp3`。
- Google Drive 內容資料夾：00_主題曲、01_有你的時光、02_影音館、03_他的家、04_金嗓卡拉OK、05_美而美早餐店、06_通往他的路、07_好友投稿。

## GitHub 正確檔案位置
```
index.html
assets/images/memory-world.png
assets/images/sixth_tree.jpeg
assets/audio/dear-ang-theme.mp3   # 可選；如果 GAS 沒抓到主題曲就用這個
```

根目錄那些 `daya_*.jpeg`, `road_*.jpeg`, `memory-route.mp4` 如果目前版本沒有引用，可以先不用管；不要讓 index 寫 `assets/images/...` 但檔案放根目錄。
