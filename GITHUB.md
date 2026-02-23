# Wysyłanie zmian na GitHub

## Co zrobić w terminalu (dodanie, commit, push)

W katalogu projektu (`c:\quiz-historia`) wykonaj:

### 1. Usuń blokadę gita (jeśli wcześniej coś się wyłączyło)
```powershell
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
```

### 2. Ustaw tożsamość Gita (jeśli jeszcze nie)
```powershell
git config --global user.email "twoj@email.com"
git config --global user.name "Twoje Imię"
```

### 3. Dodaj wszystkie zmiany i zrób commit
```powershell
git add web_quiz.py auth.py config.py db.py games.py GITHUB.md
git commit -m "Refaktoryzacja: moduły config/db/auth/games, stałe, obsługa błędów, instrukcja GitHub"
```

### 4. Wyślij na GitHub
```powershell
git push origin main
```
(Jeśli główna gałąź to `master`: `git push origin master`.)

### 5. Logowanie do GitHub
- **HTTPS:** przy pierwszym pushu użyj **Personal Access Token** zamiast hasła (GitHub → Settings → Developer settings → Personal access tokens).
- **SSH:** upewnij się, że klucz jest dodany do konta GitHub.

## Struktura po refaktoryzacji

- `web_quiz.py` – punkt wejścia (Streamlit)
- `config.py` – stałe, tryby, nazwy działów (opcjonalnie `config/nazwy_dzialow.json`)
- `db.py` – Supabase (profile, wyniki, ranking), logowanie błędów
- `auth.py` – logowanie, wylogowanie, walidacja
- `games.py` – quiz, fiszki, oś czasu, skojarzenia, ładowanie pytań

Uruchomienie: `streamlit run web_quiz.py`
