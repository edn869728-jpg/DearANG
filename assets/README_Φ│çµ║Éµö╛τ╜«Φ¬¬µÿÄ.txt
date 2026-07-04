Dear ANG WebView APK｜資源打包建議

這包已經先把以下網頁放進 APK：
- assets/www/index.html
- assets/www/gallery-wheel.html
- assets/www/gallery-wheel-manifest.js

建議先打包在 App 內的資源：
1. assets/videos/opening-countdown.mp4
   - Gate 後第一個要播放，最不適合等網路。
2. assets/videos/mini-frame.mp4 或 assets/videos/weather-mini/*.mp4
   - Mini World frame 會直接影響進場體驗。
3. assets/audio/dear-ang-theme.mp3
   - 主題曲建議放本機，減少第一次播放延遲。
4. assets/audio/aming-message.mp3
   - 收音機留言音檔可以先包。
5. assets/images/memory-world.webp
   - 街道主圖建議包。
6. assets/images/weather/day-sunny.webp
   - 街道預設圖建議包。
7. assets/images/mini-frame-poster.webp
   - Mini frame poster 建議包。
8. assets/images/ktv-stage.webp、assets/images/ktv-remote.webp
   - KTV 外觀圖建議包。
9. gallery-wheel.html 會用到的 assets/photos/photo-01.jpg ~ photo-08.jpg
   - 若要離線可看，請放到 assets/photos/。

不建議全部先包進 APK 的資源：
- 大量相簿照片
- 大量影片館影片
- 大量 KTV 歌曲 / 錄音
這些會讓 APK 很大，也會拖慢安裝與更新。建議仍保留雲端/GitHub/Drive/R2 懶載入。

目前 HTML 偵測到的相對資源路徑如下，缺哪個就把檔案放到 app/src/main/assets/www/ 對應位置：
- assets/audio/aming-message.mp3
- assets/audio/dear-ang-theme.mp3
- assets/images/ktv-remote.webp
- assets/images/ktv-stage.webp
- assets/images/memory-world.webp
- assets/images/mini-frame-poster.webp
- assets/images/mini-frame.webp
- assets/images/sixth_tree.webp
- assets/images/treasure_map_bg.webp
- assets/images/weather/day-cloudy.webp
- assets/images/weather/day-fog.webp
- assets/images/weather/day-haze.webp
- assets/images/weather/day-hot.webp
- assets/images/weather/day-overcast.webp
- assets/images/weather/day-rain.webp
- assets/images/weather/day-storm.webp
- assets/images/weather/day-sunny.webp
- assets/images/weather/night-clear.webp
- assets/images/weather/night-rain.webp
- assets/images/weather/night-storm.webp
- assets/photos/photo-01.jpg
- assets/photos/photo-02.jpg
- assets/photos/photo-03.jpg
- assets/photos/photo-04.jpg
- assets/photos/photo-05.jpg
- assets/photos/photo-06.jpg
- assets/photos/photo-07.jpg
- assets/photos/photo-08.jpg
- assets/video/mini-frame.mp4
- assets/videos/mini-frame.mp4
- assets/videos/opening-countdown.mp4
- assets/videos/weather-mini/01-night-rain.mp4
- assets/videos/weather-mini/02-deep-night-rain.mp4
- assets/videos/weather-mini/03-cloudy.mp4
- assets/videos/weather-mini/04-overcast.mp4
- assets/videos/weather-mini/05-sunny.mp4
- assets/videos/weather-mini/06-fog.mp4
- assets/videos/weather-mini/07-thunderstorm.mp4
- assets/videos/weather-mini/08-night-shower.mp4
- assets/videos/weather-mini/09-hot-sunny.mp4
- assets/videos/weather-mini/10-day-rain.mp4
- assets/videos/weather-mini/11-clear-night.mp4
- assets/videos/weather-mini/day-cloudy.mp4
- assets/videos/weather-mini/day-fog.mp4
- assets/videos/weather-mini/day-haze.mp4
- assets/videos/weather-mini/day-overcast.mp4
- assets/videos/weather-mini/day-storm.mp4