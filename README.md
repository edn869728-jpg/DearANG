# Dear ANG v35｜完整還原包

這包是你說「我把東西全刪」後可直接還原用的完整 ZIP。

## 已包含

- index.html
- script.js 備份
- config.js 備份
- assets/audio/dear-ang-theme.mp3
- assets/videos/opening-countdown.mp4
- assets/videos/mini-world-frame.mp4
- assets/images/mini-frame.jpg
- assets/images/ktv-stage.png
- assets/images/ktv-remote.png
- assets/images/weather/* 指定天氣圖
- 給安格.lrc / 給安格.srt

## 已修正

- 開場「想見你」靠左且等距拉開
- 開場影片結束後先進木框小世界
- 小世界與主街共用同一組天氣圖
- 天氣座標：24.113978, 120.782379
- 即時天氣讀取慢時，先依台灣時間顯示早上 / 白天 / 晚上 / 半夜
- 雲端資料讀取改成 fetch + JSONP 雙模式，並自動重試

## 上傳方式

解壓後，把所有內容直接覆蓋 GitHub Pages 的 DearANG 專案根目錄。

測試網址建議加版本：

https://edn869728-jpg.github.io/DearANG/?v=35
