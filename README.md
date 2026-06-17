# Dear ANG｜親愛的安格

Dear ANG（親愛的安格），是一個為了紀念我們最摯愛的朋友安格 ANG 所建立的回憶網頁。

```txt
1989.06.03 — 2026.03.09
網頁主題曲：〈給安格〉
作詞：Enden & OpenAI
作曲：Enden & Suno AI
```

## 資料夾規則

Google Drive 主資料夾：

```txt
1n-QRIullfAUIYCyJVwf0--KvjGG-8kQJ
```

裡面使用這些資料夾：

```txt
00_主題曲
01_我們的留影
02_我們的動態回憶
03_我們的歌
04_好友們的回憶
```

主題曲請放：

```txt
00_主題曲 / 00_給安格(庚明).wav
```

## 這版功能

- 點「進入我們的回憶」後播放主題曲
- 照片自動輪播
- 影片分兩區：
  - 我們的動態回憶
  - 我們的歌
- 匿名留言板
- 投稿區：照片、影片、音檔都可以
- 有投稿會寄信通知：

```txt
chihhao128@gmail.com
edn869728@gmail.com
```

- 投稿紀錄會寫進試算表
- 投稿檔案會放到 Drive 的：

```txt
04_好友們的回憶
```

## GAS 設定

1. 開 Google Apps Script
2. 貼上 `Code.gs`
3. 執行：

```js
setupAngMemorialSystem()
```

4. 部署 Web App：
   - 執行身分：我
   - 誰可以存取：任何知道連結的人
5. 複製 `/exec` 網址

## 前端設定

打開 `index.html`，找到：

```js
GAS_API_URL: 'PASTE_YOUR_MEMORIAL_GAS_EXEC_URL_HERE'
```

改成你的 GAS `/exec` 網址。

再把 `index.html` 上傳 GitHub Pages。

## 投稿提醒文字

網頁投稿區已提醒投稿者：

```txt
投稿不會直接公開，會先送到 04_好友們的回憶，也會 Email 通知管理者。
請留下聯絡方式，方便之後整理到專區。
```


## 投稿檔案提醒

建議單檔小於 35MB。影片太大可以先壓縮或分段，或直接寄到：chihhao128@gmail.com、edn869728@gmail.com。


## 主題曲放 GitHub 的設定

建議把主題曲轉成 MP3，放在：

```txt
assets/audio/dear-ang-theme.mp3
```

網頁播放順序：

```txt
第一優先：GitHub 的 assets/audio/dear-ang-theme.mp3
第二備用：Google Drive / 00_主題曲 / 00_給安格(庚明).wav
```

手機瀏覽器仍然需要先點「進入我們的回憶」，才會播放音樂。


## 主視覺照片設定

目前主視覺照片優先順序：

```txt
IMG_4130.jpg
IMG_2818.JPG
```

請把這兩張照片放在：

```txt
01_我們的留影
```

網頁載入時會優先把 `IMG_4130.jpg` 作為首頁右側主視覺，`IMG_2818.JPG` 會排在照片輪播前段。若找不到指定照片，會自動使用其他照片。


## 已填入 GAS Web App 網址

```txt
https://script.google.com/macros/s/AKfycbzrduB_eXPk6OpqnGPXjNBNQCeUyarzAfki4IL-X_JIVQr7RS9sN5ayyvA2OEaXDXzv/exec
```

`index.html` 已經把 `GAS_API_URL` 改成上面這個 `/exec` 網址。


## 手機跳動與音樂中斷修正

這版修正：

```txt
1. 照片輪播高度改用 svh，減少手機網址列收合造成頁面跳動
2. 音樂播放後不再重新指定 src，避免幾秒後被切換音源而停止
3. 影片區改成「點播放影片才載入 Google Drive iframe」
4. 頁面初次載入不再一次塞入所有影片 iframe，減少手機卡頓與音樂被中斷
```
