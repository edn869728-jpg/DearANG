# Dear ANG｜想見你地點註解區版

這版新增首頁區塊：

```txt
想見你.想見你..想見你...了.....
```

## 區塊內容

```txt
1. 使用你上傳的座標截圖
2. 做成「影片註解感」地點回憶卡片
3. 顯示座標：
   24°06'50.3"N 120°46'56.6"E
4. 換算座標：
   24.1139722, 120.7823889
5. 放 Google Maps 按鈕
6. 放嘗試開啟街景按鈕
```

## 檢查

```txt
index.html 主 script 語法檢查：通過
```

## 上傳

這次只要換 GitHub Pages：

```txt
index.html
assets/images/want-to-see-you-location.png
```

如果你直接上傳 ZIP 內容，就整包覆蓋即可。

GAS 不用重弄，除非你還沒換照片留言雪花版 Code.gs。


---

# 2026-06-18｜街景導航紀念版

這包保留原本 `index.html` 內容，並在首頁新增完整街景導航區塊，沒有砍掉原本照片分區、九宮格、留言板、照片雪花留言、歌曲彈幕、投稿區。

## 新增檔案

```txt
assets/media/memory-route.mp4
assets/images/weather-scenes.png
```

## 新增功能

```txt
1. 首頁「想見你．想見你．．想見你．．．了．．．．．」街景導航區塊
2. 使用你上傳的街景錄影作為導航影片
3. 點「開始街景導航」後全螢幕播放
4. 左上角距離目的地會依影片進度慢慢倒數
5. 留言像雪花慢慢飄落
6. 影片結束後顯示：數第六棵樹，是你長眠的位置
7. 使用 Open-Meteo 依長眠地座標讀取即時天氣，顯示天黑 / 天亮 / 天雨 / 天晴 / 天冷 / 天熱 / 暴風 / 暴風雨
```

## 覆蓋方式

整包上傳到 GitHub Pages，直接覆蓋原檔即可：

```txt
index.html
Code.gs
assets/media/memory-route.mp4
assets/images/weather-scenes.png
```

GAS 如果你原本已經是照片留言雪花版，`Code.gs` 可不用重部署；這包仍保留原檔一起附上，避免漏檔。
