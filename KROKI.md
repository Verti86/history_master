# Co zrobić po stronie GitHub i lokalnie

Kod jest już wypchnięty do **https://github.com/Verti86/history_master** (branch `main`).

Aby wypchnąć kolejne zmiany:

```powershell
cd c:\quiz-historia\quiz-app-next
git add .
git commit -m "Opis zmian"
git push
```

## 3. Uruchom aplikację lokalnie

Wymagane: **Node.js** (https://nodejs.org).

```powershell
cd c:\quiz-historia\quiz-app-next
.\run.ps1
```

Albo ręcznie: `npm install`, potem `npm run dev`. Otwórz **http://localhost:3000**.

Plik **.env.local** jest już uzupełniony danymi Supabase z aplikacji Python – logowanie i rejestracja używają tej samej bazy.
