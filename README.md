# Dear ANG 單一化整理器

這份工具針對目前 `index.html` 裡「同一功能被多個版本反覆覆蓋」的狀況。

## 它會做什麼

- 保留頁面與場館的原排列順序。
- 保留 Gate → Opening → Mini World → Street 的流程。
- 保留影音館、住家、KTV、早餐店、公路局與相館區塊。
- 保留素材路徑、GAS URL、訪客紀錄、歌詞資料和天氣判斷值。
- 移除已被 v75 取代的 v66 / v68 / v71 / v72 / v73 舊覆蓋。
- 移除主程式裡舊的 v55 / v56 天氣影片重複邏輯。
- 清空「另存網頁」留下的重複摩天輪輪輻與車廂，讓原初始化只生成一次。
- 不直接覆蓋原始 `index.html`。

## 最簡單用法

1. 把以下三個檔案放在目前 DearANG 網站資料夾最上層：
   - `index.html`
   - `dearang_simplify.py`
   - `整理DearANG.bat`
2. 雙擊 `整理DearANG.bat`。
3. 會得到：
   - `index_simplified.html`
   - `index.html.before_simplify.bak`
   - `index_simplified.html.report.txt`
4. 先用瀏覽器測試 `index_simplified.html`，確認後再改名為 `index.html`。

## 為什麼不能只再加一段補丁

目前檔案裡同一個功能多次被重新指定，例如：

- `startOpeningMemoryCountdown`
- `finishOpeningMemoryCountdown`
- `setupMiniFrameVideo`
- `setMemoryWeather`
- `showMiniWorld`
- `openPage / closePage`

再往最下面加新規則，會繼續形成「修 A、壞 B」。這個整理器採用相反方向：保留最後定案，拿掉前面已失效的覆蓋層。
