Dear ANG WebView APK 打包方式

這包是 Android Studio 專案，不是直接產出的 APK。

使用方式：
1. 用 Android Studio 開啟 DearANG_WebView_APK_Project 這個資料夾。
2. 先把你要預先包進 App 的資源放到：
   app/src/main/assets/www/assets/
3. 建議至少放：
   - assets/videos/opening-countdown.mp4
   - assets/videos/mini-frame.mp4
   - assets/audio/dear-ang-theme.mp3
   - assets/audio/aming-message.mp3
   - assets/images/memory-world.webp
   - assets/images/weather/day-sunny.webp
   - assets/images/mini-frame-poster.webp
   - assets/images/ktv-stage.webp
   - assets/images/ktv-remote.webp
4. Android Studio 上方選 Build > Build Bundle(s) / APK(s) > Build APK(s)。
5. Debug APK 會在：
   app/build/outputs/apk/debug/app-debug.apk

已處理：
- WebView 直接讀取 app/src/main/assets/www/index.html
- 相館入口改為 gallery-wheel.html
- gallery-wheel.html / gallery-wheel-manifest.js 已放入 assets/www
- index.html 的 <base> 已改成 ./，適合 Android APK 本機 assets 路徑
- WebView 已開 JavaScript、DOM Storage、快取、影音播放、檔案選擇

注意：
- 這包只先放網頁檔，沒有放你的大型照片/影片/音樂實體檔。
- 大量相簿、影片館、KTV 歌曲建議不要全包進 APK，會太大。
- 需要上架 Play 商店時，建議之後再改成 release keystore 簽章與版本號管理。


【v73 修正重點】
- 開場影片不再用固定 10/12 秒切掉，會等 opening-countdown.mp4 的 ended 事件才進 Mini World。
- Mini Frame 進場時會強制重新指定 assets/videos/mini-frame.mp4 並播放，避免 WebView 先前載入失敗後不重試。
- 如果 opening-countdown.mp4 或 mini-frame.mp4 沒有真的放進 assets，仍然無法播放；請依 assets/videos 裡的 README 放檔。
- 影片建議使用 MP4 / H.264，不建議 HEVC 或 MOV 直接改副檔名。
