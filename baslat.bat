@echo off
echo BookMark baslatiliyor...
cd /d "%~dp0final_package"
start "" "http://localhost:8000"
echo BookMark yerel sunucuda acildi. Kapatmak icin bu pencereyi kapatabilirsiniz.
python -m http.server 8000
pause