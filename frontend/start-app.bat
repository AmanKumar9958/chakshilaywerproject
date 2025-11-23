@echo off
echo Starting Chakshi Legal Intelligence Platform...
echo.

echo [1/3] Testing webhook connectivity...
powershell -ExecutionPolicy Bypass -File "test-webhooks-simple.ps1"

echo.
echo [2/3] Starting React development server...
echo Opening browser at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

start http://localhost:3000
npm start