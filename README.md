# Dear ANG｜不卡住修正版

這版修正「卡在進入畫面、按了進不去」的問題。

## 修正內容

```txt
1. 修掉 index.html 裡壞掉的 JavaScript escape 函式
2. 加上入口 fallback，按「進入我們的回憶」就算音樂或資料還沒讀好，也會先進頁面
3. APP_VERSION 更新，避免瀏覽器吃舊快取
4. ZIP 內附新版 Code.gs，GAS 仍然請整份覆蓋
```

## 檢查結果

```txt
index.html 主 script 語法檢查：通過
```

## 上傳方式

```txt
index.html → 覆蓋 GitHub Pages 的 index.html
Code.gs → GAS 整份覆蓋，不要加在舊程式下面
```
