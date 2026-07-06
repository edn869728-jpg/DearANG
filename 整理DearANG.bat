@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

if not exist "index.html" (
  echo.
  echo [找不到 index.html]
  echo 請把這個 BAT、dearang_simplify.py、目前最新版 index.html 放在同一個資料夾。
  echo.
  pause
  exit /b 2
)

where py >nul 2>nul
if %errorlevel%==0 (
  py -3 dearang_simplify.py index.html --output index_simplified.html --lean
) else (
  where python >nul 2>nul
  if errorlevel 1 (
    echo.
    echo [找不到 Python]
    echo 請先安裝 Python，或在終端機確認 python 指令可用。
    echo.
    pause
    exit /b 3
  )
  python dearang_simplify.py index.html --output index_simplified.html --lean
)

echo.
echo 已產生 index_simplified.html
echo 原本 index.html 不會被覆蓋，並會建立 .before_simplify.bak 備份。
echo.
pause
