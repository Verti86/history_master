# Co zrobić po stronie GitHub i lokalnie

## 1. Utwórz puste repozytorium na GitHubie

1. Wejdź na **https://github.com/new**
2. **Repository name:** `quiz-historia-app`
3. **Public**, **bez** README / .gitignore / licence (projekt już je ma)
4. Kliknij **Create repository**

## 2. Wypchnij kod (w tym folderze)

W terminalu (PowerShell), w folderze `quiz-app-next`:

```powershell
cd c:\quiz-historia\quiz-app-next
git push -u origin main
```

(Adres `origin` jest już ustawiony na `https://github.com/Verti86/quiz-historia-app.git`.)

Jeśli zmienisz nazwę repo na GitHubie, popraw remote:

```powershell
git remote set-url origin https://github.com/Verti86/TWOJA-NAZWA-REPO.git
git push -u origin main
```

## 3. Uruchom aplikację lokalnie

Wymagane: **Node.js** (https://nodejs.org).

```powershell
cd c:\quiz-historia\quiz-app-next
.\run.ps1
```

Albo ręcznie: `npm install`, potem `npm run dev`. Otwórz **http://localhost:3000**.

Plik **.env.local** jest już uzupełniony danymi Supabase z aplikacji Python – logowanie i rejestracja używają tej samej bazy.
