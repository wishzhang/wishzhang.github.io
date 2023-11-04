@echo off
git pull
git add .
timeout /t 1 /nobreak >nul
git commit -m "update"
timeout /t 1 /nobreak >nul
git push
timeout /t 1 /nobreak >nul
echo Done!
pause
