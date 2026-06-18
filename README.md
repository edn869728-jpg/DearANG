# Dear ANG｜Memory Navigation 修正版

本版保留原檔並修正：

1. 九宮格上下左右相反：已反向排列 09 → 01。
2. 長眠地天氣同步：下雨網頁跟著下雨，陰天跟著陰天，暴雨/暴風雨/天冷/天熱/天黑/天晴依即時天氣切換。
3. 歌詞再快 2 秒：LYRIC_OFFSET_SECONDS 從 -5 改成 -7。

## 覆蓋檔案

直接把整包上傳 GitHub Pages 覆蓋：

- index.html
- Code.gs
- README.md
- assets/media/memory-route.mp4
- assets/images/weather-scenes.png

## 注意

Code.gs 保留你上傳的原檔內容。若要讓照片留言功能可用，GAS 需要部署到最新版。
