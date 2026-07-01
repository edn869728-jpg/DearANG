@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"Add-Type -AssemblyName Microsoft.VisualBasic; ^
$from = [Microsoft.VisualBasic.Interaction]::InputBox('要把哪個副檔名改掉？例如 gs', '來源副檔名', 'gs'); ^
if ([string]::IsNullOrWhiteSpace($from)) { exit }; ^
$to = [Microsoft.VisualBasic.Interaction]::InputBox('要改成什麼副檔名？例如 js', '目標副檔名', 'js'); ^
if ([string]::IsNullOrWhiteSpace($to)) { exit }; ^
$from = $from.TrimStart('.'); ^
$to = $to.TrimStart('.'); ^
Get-ChildItem -Path '%cd%' -File -Filter ('*.' + $from) | Rename-Item -NewName { $_.BaseName + '.' + $to }; ^
[System.Windows.Forms.MessageBox]::Show('完成：' + $from + ' → ' + $to, '批次改副檔名')"
pause