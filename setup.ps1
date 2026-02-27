# Portfolio Quick Setup Script (PowerShell)

Write-Host "==============================================="
Write-Host "   PORTFOLIO SETUP SCRIPT" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
$nodeExists = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeExists) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Node.js found" -ForegroundColor Green
node --version
Write-Host ""

# Check if npm is available
Write-Host "Checking for npm..." -ForegroundColor Yellow
$npmExists = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmExists) {
    Write-Host "❌ npm is not available!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ npm found" -ForegroundColor Green
npm --version
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "==============================================="
Write-Host "   NEXT STEPS:" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start development server:"
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Build for production:"
Write-Host "   npm run build" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. For deployment guide, read:"
Write-Host "   DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "==============================================="
Write-Host ""

Read-Host "Press Enter to continue"
