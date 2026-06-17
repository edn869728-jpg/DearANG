# Dear ANG｜親愛的安格｜確認修正版

這版修正重點：

```txt
1. LRC 彈幕歌詞已匯入 index.html
2. 已補上 setupLyricDanmaku() 啟動呼叫
3. 主題曲 loop 循環播放
4. 照片分頁 / 分區 / 點圖放大
5. 影片列表縮小
6. 投稿通知寄到 chihhao128@gmail.com 與 edn869728@gmail.com
7. 投稿資料夾：04_好友們的回憶
```

## 很重要

請上傳這包裡的：

```txt
index.html → GitHub Pages
Code.gs → Google Apps Script
```

如果只換 index.html、不換 Code.gs，照片子資料夾分區可能不會正常顯示。
如果只換 Code.gs、不換 index.html，彈幕歌詞不會出現。

## 歌詞

彈幕歌詞在 `index.html` 裡：

```js
const LYRIC_LINES = [...]
```

已匯入完整歌詞。
