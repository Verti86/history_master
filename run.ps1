# Uruchomienie aplikacji Next.js (History Master)
# Wymaga: Node.js i npm (https://nodejs.org)

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Brak Node.js. Zainstaluj z https://nodejs.org" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "node_modules")) {
    Write-Host "Instalowanie zaleznosci (npm install)..." -ForegroundColor Yellow
    npm install
}

Write-Host "Uruchamiam serwer deweloperski (http://localhost:3000)..." -ForegroundColor Green
npm run dev
