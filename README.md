# Dear ANG v6｜下一層資料夾 + 歌詞提前 7 秒

這版修正兩件事：

1. Google Drive 的 `00`～`07` 主資料夾底下，可以再分子資料夾。
   網站會遞迴讀取下一層與更深層，並在頁面中依子資料夾分區顯示。

2. 歌詞彈幕固定提前 7 秒：

```js
const LYRIC_OFFSET_SECONDS = -7;
```

歌詞檔仍照你原本 GitHub 根目錄，不改名、不搬家：

- `./給安格.lrc`
- `./給安格.srt`
- `./lyrics_embedded.js.txt`

主題曲備用路徑維持：

- `assets/audio/dear-ang-theme.mp3`

照片、影片、他唱的歌、好友投稿仍全部走 Google Drive / GAS，不需要搬到 GitHub。

注意：如果 GAS 後端目前只回傳第一層資料夾，前端已支援遞迴，但 GAS 也要回傳子資料夾資料才會顯示更深層內容。
