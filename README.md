# Dear ANG v33｜真正木框小世界 + 天氣圖同步版

流程：

1. 原本開場頁不動。
2. 原本開場倒數影片不動。
3. 倒數影片結束後，先進入「兩個人趴在木框上的小世界」。
4. 木框中間的小世界會直接使用 `assets/images/weather/` 裡面的天氣底圖。
5. 點中間小世界後，放大淡出並進入原本富宜路主街。
6. 進入後的主街也使用同一張天氣底圖，而且是取中間橫幅比例裁切，不再用舊的 memory-world 當晴天底圖。
7. 天氣仍以 `24.113978, 120.782379` 即時天氣自動判斷；讀取慢時先用台灣時間判斷早上 / 白天 / 晚上 / 半夜。

## 主要修改

- `assets/images/mini-frame.jpg`：真正的小世界外框。
- `assets/images/weather/day-sunny.png`：晴天 / 炎熱。
- `assets/images/weather/day-cloudy.png`：多雲 / 陰天。
- `assets/images/weather/day-rain.png`：雨天。
- `assets/images/weather/day-storm.png`：暴雨 / 霧 / 霾。
- `assets/images/weather/night-clear.png`：夜晚。
- `assets/images/weather/night-cloudy.png`：夜雨 / 下雪。

## 覆蓋方式

整包上傳到 GitHub Pages 專案根目錄覆蓋即可。

建議測試網址加版本參數：

`https://edn869728-jpg.github.io/DearANG/?v=33`
