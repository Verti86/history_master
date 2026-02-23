# Uruchomienie History Master Online lokalnie (Streamlit)
# Użycie: .\run_local.ps1   lub   & ".\run_local.ps1"
# Otwiera domyślną przeglądarkę z adresem aplikacji.

Set-Location $PSScriptRoot
$proc = Start-Process -FilePath "streamlit" -ArgumentList "run", "web_quiz.py" -WorkingDirectory $PSScriptRoot -PassThru
Start-Sleep -Seconds 4
Start-Process "http://localhost:8501"
$proc.WaitForExit()
