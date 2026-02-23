# Diagnostyka: dlaczego git push łączy się przez 127.0.0.1
# Uruchom: .\debug_git_push.ps1

Write-Host "=== 1. Git proxy (global) ===" -ForegroundColor Cyan
$g = git config --global --get https.proxy; if ($g) { Write-Host "https.proxy = $g" } else { Write-Host "(nie ustawione)" }
$g = git config --global --get http.proxy; if ($g) { Write-Host "http.proxy = $g" } else { Write-Host "(nie ustawione)" }

Write-Host "`n=== 2. Git proxy (repo – ten katalog) ===" -ForegroundColor Cyan
$l = git config --local --get https.proxy; if ($l) { Write-Host "https.proxy = $l" } else { Write-Host "(nie ustawione)" }
$l = git config --local --get http.proxy; if ($l) { Write-Host "http.proxy = $l" } else { Write-Host "(nie ustawione)" }

Write-Host "`n=== 3. Zmienne środowiskowe PROXY ===" -ForegroundColor Cyan
foreach ($v in @('HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy','ALL_PROXY','all_proxy')) {
    $val = [Environment]::GetEnvironmentVariable($v, 'Process')
    if (-not $val) { $val = [Environment]::GetEnvironmentVariable($v, 'User') }
    if (-not $val) { $val = [Environment]::GetEnvironmentVariable($v, 'Machine') }
    if ($val) { Write-Host "$v = $val" } else { Write-Host "$v = (nie ustawione)" }
}

Write-Host "`n=== 4. Adres zdalny (origin) ===" -ForegroundColor Cyan
git remote -v

Write-Host "`n=== 5. Test połączenia z GitHub (port 443) ===" -ForegroundColor Cyan
try {
    $t = New-Object System.Net.Sockets.TcpClient('github.com', 443)
    $t.Close()
    Write-Host "OK – port 443 jest osiągalny." -ForegroundColor Green
} catch {
    Write-Host "Błąd: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 6. Czy 127.0.0.1 nasłuchuje na typowym porcie proxy? ===" -ForegroundColor Cyan
$ports = 7890, 8080, 3128, 1080, 8888
foreach ($p in $ports) {
    try {
        $t = New-Object System.Net.Sockets.TcpClient('127.0.0.1', $p)
        $t.Close()
        Write-Host "Port $p na 127.0.0.1 OTWARTY (może to proxy)" -ForegroundColor Yellow
    } catch { }
}

Write-Host "`n=== Koniec diagnostyki ===" -ForegroundColor Cyan
