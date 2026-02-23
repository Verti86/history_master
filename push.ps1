# Wysyła zmiany na GitHub (Streamlit Cloud).
# Uruchom w PowerShell w katalogu projektu: .\push.ps1 "opis zmian"

param(
    [Parameter(Mandatory = $false)]
    [string]$Message = "Aktualizacja aplikacji"
)

$ErrorActionPreference = "Stop"
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue

git add -A
$status = git status --porcelain
if (-not $status) {
    Write-Host "Brak zmian do wysłania." -ForegroundColor Yellow
    exit 0
}

git commit -m $Message
git push origin main
Write-Host "Gotowe. Za chwilę zobaczysz zmiany na share.streamlit.io" -ForegroundColor Green
