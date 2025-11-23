# Quick Start Script for Chakshi Legal Intelligence Platform

Write-Host "🚀 Starting Chakshi Legal Intelligence Platform..." -ForegroundColor Cyan
Write-Host ""

# Test webhooks first
Write-Host "📡 Testing webhook connectivity..." -ForegroundColor Yellow
& ".\test-webhooks-simple.ps1"

Write-Host ""
Write-Host "🌐 Opening application in browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "⚡ Starting React development server..." -ForegroundColor Blue
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start React app
npm start