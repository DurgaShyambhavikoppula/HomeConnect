@echo off
cd /d "%~dp0"
echo ======================================
echo       HomeConnect - Start Project
echo ======================================
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)
echo Starting HomeConnect on http://localhost:3000
call npm run dev
pause
