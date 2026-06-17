# Dear ANG｜分頁分區版

這版已改成：

- 分頁：首頁 / 照片分區 / 照片輪播 / 我們的歌 / 動態回憶 / 留言投稿
- 圖片縮小，點圖放大，不重新整理
- IG / Facebook / 九宮格可依資料夾名稱自動套樣式
- 影片列表縮小，使用原生 video，避免 Google Drive 預覽遮罩
- 主題曲循環播放

## Drive 資料夾建議

```txt
00_主題曲
01_我們的留影
  ├─ IG 回憶
  ├─ Facebook 照片
  ├─ 生活照片
  └─ 九宮格
02_我們的動態回憶
03_我們的歌
04_好友們的回憶
```

## 重要

這版 `Code.gs` 有新增讀取 `01_我們的留影` 子資料夾的能力，所以 GAS 也要覆蓋新版 `Code.gs`，再重新部署 Web App。

GAS URL 已填入：

```txt
https://script.google.com/macros/s/AKfycbzrduB_eXPk6OpqnGPXjNBNQCeUyarzAfki4IL-X_JIVQr7RS9sN5ayyvA2OEaXDXzv/exec
```


## 已匯入 LRC 彈幕歌詞

已匯入完整歌詞：

```txt
給安格.lrc
```

解析結果：

```txt
歌詞句數：61
第一句：6.33 秒
最後一句：257.45 秒
```

網頁會依照 LRC 時間軸，用彈幕方式浮現歌詞。
