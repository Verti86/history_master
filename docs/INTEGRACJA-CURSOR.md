# Integracja narzędzi z Cursor

Przewodnik krok po kroku: Supabase, Vercel, Sentry, Superpowers, Parallel.

---

## 1. Supabase

**Cel:** Cursor (i asystent) może korzystać z Twojego projektu Supabase – tabele, RLS, zapytania.

### Kroki

1. W Cursorze otwórz **Command Palette**: `Ctrl+Shift+P` (Windows) lub `Cmd+Shift+P` (Mac).
2. Wpisz: **Supabase** lub **MCP** – wybierz polecenie typu „Supabase: Connect” / „Authenticate Supabase MCP” (nazwa zależy od wtyczki).
3. Otworzy się przeglądarka – **zaloguj się na konto Supabase** i zatwierdź dostęp.
4. Po powrocie do Cursor sprawdź, czy wtyczka pokazuje status „Connected” (np. na pasku bocznym lub w ustawieniach).
5. **Opcjonalnie:** W ustawieniach wtyczki Supabase upewnij się, że wybrany jest **właściwy projekt** (ten sam, którego używa History Master – `NEXT_PUBLIC_SUPABASE_URL` z `.env.local`).

### Weryfikacja

- W Command Palette wpisz „Supabase” – powinny być dostępne polecenia (np. list tables, open dashboard).
- W czacie z asystentem możesz napisać: „Sprawdź tabele w Supabase” – jeśli MCP jest zalogowany, asystent będzie mógł z nich skorzystać.

---

## 2. Vercel

**Cel:** Deploy, logi i ustawienia projektu z poziomu Cursor.

### Kroki

1. `Ctrl+Shift+P` → wpisz **Vercel**.
2. Wybierz **„Vercel: Sign In”** (lub podobnie) i zaloguj się w przeglądarce.
3. Po zalogowaniu: **„Vercel: Link Project”** (lub „Add project”) – wskaż repozytorium **history_master** (lub to, z którego deploy’ujesz).
4. Upewnij się, że **Root Directory** to `quiz-app-next` (jeśli aplikacja jest w podfolderze).

### Co zyskujesz

- Deploy z Command Palette.
- Podgląd logów i statusu deploya.
- Szybki dostęp do projektu na vercel.com.

---

## 3. Sentry (monitoring błędów)

Są **dwa** elementy: wtyczka w Cursorze + kod w projekcie.

### A) Konto i projekt Sentry

1. Wejdź na [sentry.io](https://sentry.io) i załóż konto (jest darmowy plan).
2. Utwórz projekt typu **Next.js**.
3. Skopiuj **DSN** (klucz do wysyłania błędów) z ustawień projektu.

### B) Wtyczka Sentry w Cursorze

**Uwaga:** W Command Palette wpisanie **„Sentry”** zwykle nie pokazuje poleceń wtyczki (Cursor może pokazać np. „Debug: Start Debugging…”). Użyj poniższych sposobów.

1. **Logowanie / autoryzacja**
   - Otwórz **Extensions** (ikona puzzla na pasku bocznym) → znajdź **Sentry** → kliknij kartę wtyczki. Na stronie wtyczki szukaj przycisku **„Sign In”**, **„Connect”** lub **„Authenticate”** (często u góry obok „Project”). Kliknij i zaloguj się w przeglądarce.
   - Alternatywnie: `Ctrl+Shift+P` → wpisz **„Seer”** lub **„MCP”** – czasem tam jest polecenie połączenia z Sentry.
2. **Polecenie Seer (pytania do Sentry)**
   - `Ctrl+Shift+P` → wpisz **Seer** (nie „Sentry”). Powinna się pojawić komenda w stylu „Ask natural language questions about your Sentry environment…”. Uruchom ją – otworzy się czat/prompt do Sentry; przy pierwszym użyciu może poprosić o logowanie.
3. **MCP i Skills**
   - **MCP** – po zalogowaniu asystent w zwykłym czacie może korzystać z Sentry (np. „Pokaż ostatnie błędy z Sentry”).
   - **Skills** – na stronie wtyczki Sentry użyj **„Try in Chat”** albo w czacie napisz np. „Użyj sentry-setup-logging”.
4. **Project** (dropdown przy wtyczce) – po zalogowaniu wybierz właściwy projekt/organizacja Sentry (ten sam co w sentry.io dla History Master).

### C) Kod w projekcie Next.js

1. W katalogu `quiz-app-next` w terminalu:
   ```bash
   npm install @sentry/nextjs
   ```
2. Uruchom konfigurator Sentry (albo dodaj pliki ręcznie):
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```
   Wizard zapyta o DSN – wklej skopiowany z Sentry. Powstaną m.in.:
   - `sentry.client.config.ts`
   - `sentry.server.config.ts`
   - `sentry.edge.config.ts`
   - `instrumentation.ts`
   - wpis w `next.config.ts`.
3. W **Vercel** (Settings → Environment Variables) dodaj:
   - `SENTRY_DSN` = Twój DSN (można ustawić też w `.env.local` na development).

Po deployu błędy z aplikacji będą w Sentry; w Cursorze możesz je przeglądać przez wtyczkę (jeśli jest połączona z tym samym projektem).

---

## 4. Superpowers

**Cel:** TDD, debugging, lepsza współpraca z asystentem.

### Kroki

1. Wtyczka po instalacji jest **włączona** – nie wymaga logowania.
2. `Ctrl+Shift+P` → wpisz **Superpowers** – zobaczysz listę poleceń (np. uruchom testy, debug).
3. Używasz ich, gdy piszesz testy lub debugujesz; asystent może sugerować ich użycie.

Nie trzeba nic „łączyć” z projektem – działa od razu.

---

## 5. Parallel

**Cel:** Wyszukiwanie w sieci i pogłębiony research w Cursorze.

### Kroki

1. Po instalacji wtyczka jest gotowa do użycia.
2. Szukaj w Command Palette: **Parallel** – np. „Parallel: Search” lub „Research”.
3. Używasz, gdy potrzebujesz aktualnej dokumentacji, artykułów lub informacji z internetu.

Również bez konfiguracji projektu.

---

## Podsumowanie

| Narzędzie   | Logowanie        | Konfiguracja w projekcie |
|------------|------------------|---------------------------|
| Supabase   | Tak (przeglądarka) | Już masz (.env.local)     |
| Vercel     | Tak (przeglądarka) | Root Dir = quiz-app-next  |
| Sentry     | Tak + konto Sentry | DSN + `@sentry/nextjs`    |
| Superpowers| Nie              | Nie                       |
| Parallel   | Nie              | Nie                       |

Jeśli coś w Cursorze wygląda inaczej (np. inne nazwy poleceń), sprawdź dokumentację danej wtyczki w Cursor Marketplace lub w ustawieniach wtyczki.
