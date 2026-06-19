# Dear ANG v8：已寫入 Drive 主資料夾 ID

這版修正：

- Google Drive 主資料夾 ID 已寫死：`1n-QRIullfAUIYCyJVwf0--KvjGG-8kQJ`
- 01～07 底下的子資料夾會遞迴讀取
- 子資料夾名稱不用固定 ABC，照你在 Drive 裡取的名稱顯示
- 歌詞仍讀根目錄：`./給安格.lrc`、`./給安格.srt`、`./lyrics_embedded.js.txt`
- 歌詞彈幕固定提前 7 秒：`LYRIC_OFFSET_SECONDS = -7`

## 上傳/更新方式

1. GitHub Pages：上傳 `index.html`。
2. Apps Script：打開 `Code_gs_子資料夾遞迴_已寫入DriveID.gs`，整段貼到 Code.gs 最底部。
3. Apps Script 按儲存。
4. 重新部署 Web App：部署 → 管理部署作業 → 編輯 → 新版本 → 部署。

不要改 Drive 資料夾名稱也沒關係，但最外層建議保持：

```text
00_主題曲
01_有你的時光
02_影音館
03_他的家
04_金嗓卡拉OK
05_美而美早餐店
06_通往他的路
07_好友投稿
```
