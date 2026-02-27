@echo off
REM Quick Setup Script for Portfolio

echo.
echo ===============================================
echo   PORTFOLIO SETUP SCRIPT
echo ===============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version
echo.

REM Check if npm is available
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not available!
    pause
    exit /b 1
)

echo ✅ npm found
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Setup complete!
echo.
echo ===============================================
echo   NEXT STEPS:
echo ===============================================
echo.
echo 1. Development server:
echo    npm run dev
echo.
echo 2. Build for production:
echo    npm run build
echo.
echo 3. For deployment guide, read:
echo    DEPLOYMENT_GUIDE.md
echo.
echo ===============================================
echo.

pause
