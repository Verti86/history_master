# Debug: git push – błąd „127.0.0.1” / Could not connect to server

## Krok 1: Diagnostyka

W PowerShell przejdź do projektu i uruchom skrypt **jedną** z poniższych metod:

**Metoda 1 (pełna ścieżka):**
```powershell
cd c:\quiz-historia
& "C:\quiz-historia\debug_git_push.ps1"
```

**Metoda 2 (jeśli nadal błąd „nie rozpoznano”):**
```powershell
cd c:\quiz-historia
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\debug_git_push.ps1
```

Skrypt pokaże:
- ustawienia proxy w Git (global i w repo),
- zmienne środowiskowe PROXY (mogą być ustawione przez Cursor, VPN, system),
- czy da się połączyć z github.com:443,
- czy na localhost działa jakiś proxy (porty 7890, 8080, itd.).

**Zachowaj wynik** (skopiuj lub zrzut ekranu) – na tej podstawie wiadomo, co wymusza 127.0.0.1.

---

## Krok 2: Wymuszenie „brak proxy” dla GitHub

Często pomaga jawne powiedzenie Gitowi: **dla github.com nie używaj proxy**. Uruchom (w `c:\quiz-historia`):

```powershell
& "C:\quiz-historia\fix_git_push.ps1"
```
Albo po `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`: `.\fix_git_push.ps1`

To ustawia:
- `http.https://github.com.proxy` = pusty
- `https.https://github.com.proxy` = pusty  

Następnie spróbuj:

```powershell
git push origin main
```

Jeśli push przejdzie – problem był w proxy (np. z Cursor/VS Code lub systemu).

---

## Krok 3: Jeśli nadal błąd – zmienne środowiskowe

Jeśli w diagnostyce widać np. `HTTPS_PROXY=127.0.0.1:...`:

1. **Tylko w tej sesji PowerShell** (bez proxy dla tej sesji):
   ```powershell
   $env:HTTPS_PROXY = ""
   $env:HTTP_PROXY = ""
   git push origin main
   ```

2. **Na stałe** – usuń zmienne w systemie:
   - Windows: Wyszukaj „zmienne środowiskowe” → Edytuj zmienne środowiskowe konta → usuń `HTTP_PROXY`, `HTTPS_PROXY` (jeśli są).
   - Albo w Cursor/VS Code sprawdź, czy w konfiguracji terminala nie ustawiają tych zmiennych.

---

## Krok 4: Obejście – użycie SSH zamiast HTTPS

Jeśli HTTPS nadal idzie przez 127.0.0.1, **GitHub przez SSH** często omija proxy (port 22).

1. **Masz już klucz SSH** (np. `id_ed25519` lub `id_rsa` w `~/.ssh/`)?
   - Tak → przejdź do 2.
   - Nie → wygeneruj:
     ```powershell
     ssh-keygen -t ed25519 -C "lukasz.mandziej@gmail.com" -f "$env:USERPROFILE\.ssh\id_ed25519" -N '""'
     ```
     Skopiuj zawartość `~/.ssh/id_ed25519.pub` i dodaj w GitHub: Settings → SSH and GPG keys → New SSH key.

2. **Przełącz remote na SSH:**
   ```powershell
   git remote set-url origin git@github.com:Verti86/quiz-historia.git
   git remote -v
   ```

3. **Pierwsze połączenie:** `git push origin main` – Windows może zapytać o potwierdzenie hosta; wpisz `yes`.

Od tego momentu push/pull będzie szedł przez SSH, bez HTTP/HTTPS i bez proxy.

---

## Krok 5: Gdzie może ustawiać proxy „127.0.0.1”

| Źródło | Co sprawdzić |
|--------|----------------|
| **Cursor / VS Code** | Ustawienia terminala, rozszerzenia (np. „Proxy”) |
| **NordVPN / inny VPN** | Wyłączyć na czas pusha lub split tunneling |
| **Antywirus / firewall** | Czasem nakładają „local proxy” do skanowania – wyjątek dla Git lub port 443 |
| **Firmowy proxy** | Jeśli jest w pracy – użyć SSH (Krok 4) |

---

## Podsumowanie

1. Uruchom **`.\debug_git_push.ps1`** i zobacz wynik.
2. Uruchom **`.\fix_git_push.ps1`** i zrób **`git push origin main`**.
3. Jeśli dalej błąd – wyzeruj `HTTPS_PROXY` w tej sesji lub przejdź na **SSH** (Krok 4).

Po ustaleniu przyczyny (np. Cursor ustawia proxy) możesz na stałe wyłączyć to ustawienie, wtedy push będzie działał także gdy uruchamia go AI.
