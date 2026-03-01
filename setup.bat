@echo off
REM BookRsell - Quick Start Script for Windows
REM This script sets up and starts both frontend and backend

echo.
echo 🚀 Starting BookRsell Setup...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version

REM Create uploads directory if not exists
if not exist "server\uploads" (
    mkdir server\uploads
)

REM Backend Setup
echo.
echo 📦 Setting up Backend...
cd server

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo ✅ Dependencies already installed
)

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating with defaults...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/bookrsell
        echo JWT_SECRET=bookrsell_secret_key_change_in_production
        echo NODE_ENV=development
    ) > .env
    echo ✅ .env created. Please update MONGODB_URI if needed.
)

cd ..

REM Frontend Setup
echo.
echo ⚛️  Setting up Frontend...
cd client

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo ✅ Dependencies already installed
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5000/api
    ) > .env
    echo ✅ .env created
)

cd ..

echo.
echo ✅ Setup Complete!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎯 Next Steps:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 1. Make sure MongoDB is running
echo.
echo 2. In one terminal, start the backend:
echo    cd server ^&^& npm run dev
echo.
echo 3. In another terminal, start the frontend:
echo    cd client ^&^& npm start
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📚 For more info, read:
echo    - README.md ^(Main documentation^)
echo    - SETUP_GUIDE.md ^(Detailed setup^)
echo    - ARCHITECTURE.md ^(System design^)
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
