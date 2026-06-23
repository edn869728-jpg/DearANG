<<<<<<< HEAD
# Dear ANG v29｜小世界中轉＋天氣同步版

## 這版完成

- 原本開場頁不動。
- 原本 opening-countdown.mp4 開場影片不動。
- 開場影片結束後，不直接進主街道，先進「木框小世界」。
- 點「點進這個世界」後，畫面放大淡出，才進入原本富宜路街道主頁。
- 小世界與主街道共用同一組天氣狀態。
- 右上角天氣按鈕可循環切換天氣。
- 小世界下方可直接點天氣：晴天、炎熱、多雲、陰天、雨天、暴雨、霧、霾、夜晚、夜雨。

## 覆蓋 GitHub Pages

把本 ZIP 內容解壓後，覆蓋 DearANG 專案根目錄：

```
index.html
assets/
```

建議網址加版本避免快取：

```
https://edn869728-jpg.github.io/DearANG/?v=29
```

## 重要檔案

- `assets/images/mini-world.png`：開場影片後的小世界畫面。
- `assets/images/memory-world.png`：原本主街道晴天版。
- `assets/images/weather/`：主街道天氣底圖。
- `assets/videos/opening-countdown.mp4`：原開場倒數影片。
- `assets/audio/dear-ang-theme.mp3`：主題曲。
=======
# Dear ANG v34｜指定天氣圖版本

本版沿用 v33 結構，更新為你最後指定的天氣底圖。

流程：

1. 原本開場頁不動
2. 原本開場倒數影片不動
3. 倒數影片結束後進入木框小世界
4. 木框小世界使用指定天氣圖
5. 點中間世界放大進入主街
6. 主街使用同一張天氣圖，與小世界同步
7. 天氣讀取座標：24.113978, 120.782379
8. 即時天氣讀不到時，先用台灣時間判斷早上 / 白天 / 晚上 / 半夜

## 天氣圖對應

- 晴天：assets/images/weather/day-sunny.png
- 炎熱：assets/images/weather/day-hot.png
- 多雲：assets/images/weather/day-cloudy.png
- 陰天：assets/images/weather/day-overcast.png
- 雨天：assets/images/weather/day-rain.png
- 暴雨：assets/images/weather/day-storm.png
- 霧：assets/images/weather/day-fog.png
- 霾：assets/images/weather/day-haze.png
- 夜晚：assets/images/weather/night-clear.png
- 夜雨：assets/images/weather/night-rain.png
- 下雪 / 深夜惡劣天氣：assets/images/weather/night-storm.png

## 上傳 GitHub Pages

覆蓋整包內容即可。

建議開啟：
https://edn869728-jpg.github.io/DearANG/?v=34
>>>>>>> 786473be995e5f2fb7a99e4ea5d91f004b17fadc
