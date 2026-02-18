# History Master Online – wersja Next.js

Aplikacja w **Next.js 15 + Supabase** – ta sama baza i auth co wersja Python (Streamlit). Quiz, fiszki, oś czasu i skojarzenia (do rozbudowy).

---

## 1. Nowe repozytorium na GitHubie

1. Wejdź na **https://github.com/new**
2. **Repository name:** `quiz-historia-app` (lub inna nazwa)
3. **Public**, **bez** inicjalizacji (bez README, .gitignore – już są w projekcie)
4. Kliknij **Create repository**
5. Repozytorium: **https://github.com/Verti86/history_master** – kod jest już tam wypchnięty. Kolejne zmiany: `git push`.

---

## 2. Supabase (ta sama baza co aplikacja Python)

Nie zakładasz nowego projektu – używasz **tego samego** Supabase co w `quiz-historia` (Streamlit).

**Skąd wziąć URL i klucz:**

- **Opcja A:** Z repozytorium Pythona – plik `.streamlit/secrets.toml` (sekcja `[supabase]`):
  - `url` → `NEXT_PUBLIC_SUPABASE_URL`
  - `key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Opcja B:** Supabase Dashboard → Twój projekt → **Project Settings** → **API**:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Tabele (`profiles`, `game_stats`, `chat_messages`) są współdzielone – logowanie i ranking działają w obu aplikacjach.

**Redirect URL dla auth (opcjonalnie):**  
W Supabase: **Authentication** → **URL Configuration** → **Redirect URLs** – dodaj:
- `http://localhost:3000/**` (lokalnie)
- `https://twoja-domena.vercel.app/**` (po wdrożeniu)

---

## 3. Uruchomienie lokalne

Projekt leży w folderze **`quiz-app-next`** (obok lub wewnątrz repozytorium Pythona). Aby był osobnym repo:

### A) Folder jest obok `quiz-historia` (np. `c:\quiz-historia-app`)

```bash
cd c:\quiz-historia-app
npm install
cp .env.local.example .env.local
# Edytuj .env.local – wklej NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Otwórz **http://localhost:3000**

### B) Folder jest wewnątrz `quiz-historia` (np. `c:\quiz-historia\quiz-app-next`)

1. **Skopiuj** cały folder `quiz-app-next` w inne miejsce, np. `c:\quiz-historia-app`
2. W nowym folderze:
   ```bash
   cd c:\quiz-historia-app
   git init
   git add .
   git commit -m "Initial commit – Next.js + Supabase"
   git branch -M main
   git remote add origin https://github.com/Verti86/quiz-historia-app.git
   git push -u origin main
   ```
   (Zamień `quiz-historia-app` na nazwę repo z kroku 1.)
3. Potem:
   ```bash
   npm install
   cp .env.local.example .env.local
   # Uzupełnij .env.local (Supabase URL i anon key)
   npm run dev
   ```

---

## 4. Wdrożenie (Vercel)

1. **https://vercel.com** → zaloguj się przez GitHub
2. **Add New** → **Project** → wybierz repozytorium `quiz-historia-app`
3. W **Environment Variables** dodaj:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL z Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = klucz anon
4. **Deploy**

Po wdrożeniu dodaj w Supabase (Redirect URLs) adres typu:  
`https://twoja-app.vercel.app/**`

---

## Skrypt npm

| Polecenie   | Opis              |
|------------|-------------------|
| `npm run dev`   | Serwer deweloperski (Turbopack) |
| `npm run build` | Build produkcyjny  |
| `npm run start` | Uruchomienie po buildzie |

---

## Co jest w projekcie

- **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**
- **Supabase** – klient przeglądarka (`lib/supabase/client.ts`), serwer (`lib/supabase/server.ts`), middleware do odświeżania sesji
- Strony: `/` (strona główna), `/login`, `/rejestracja`
- Dalsza rozbudowa: menu, quiz, fiszki, oś czasu, skojarzenia, ranking, czat (te same dane co wersja Python)
