# Naprawa: wymuszenie braku proxy dla GitHub (często rozwiązuje błąd 127.0.0.1)
# Uruchom w PowerShell w katalogu projektu: .\fix_git_push.ps1

Write-Host "Ustawiam: dla github.com Git NIE używa proxy..." -ForegroundColor Cyan
git config --global http.https://github.com.proxy ""
git config --global https.https://github.com.proxy ""

Write-Host "Sprawdzenie:" -ForegroundColor Cyan
git config --global --get http.https://github.com.proxy
git config --global --get https.https://github.com.proxy

Write-Host "`nGotowe. Uruchom: git push origin main" -ForegroundColor Green
Write-Host "Jesli nadal blad, uruchom najpierw: .\debug_git_push.ps1" -ForegroundColor Yellow
