# Audyt bezpieczeństwa – History Master Online

## Wdrożone poprawki

### 1. Nagłówki HTTP (next.config.ts)
- **X-Frame-Options: DENY** – ochrona przed clickjacking (osadzanie strony w iframe).
- **X-Content-Type-Options: nosniff** – zapobiega MIME sniffing.
- **Referrer-Policy: strict-origin-when-cross-origin** – ogranicza ujawnianie referrera.
- **Permissions-Policy** – wyłączenie kamerki, mikrofonu, geolokalizacji.

### 2. Autentykacja i enumeracja użytkowników
- **Logowanie / Rejestracja** – generyczne komunikaty błędów zamiast treści z Supabase (np. „Nieprawidłowy email lub hasło”), żeby nie ułatwiać sprawdzania, czy email jest w bazie.
- **Czat** – użytkownik widzi tylko ogólne komunikaty („Nie udało się wysłać wiadomości”), szczegóły błędów są tylko w konsoli deweloperskiej.

### 3. Hasła
- **Rejestracja** – minimalna długość hasła zwiększona do 8 znaków (walidacja po stronie klienta).
- **autocomplete** – ustawione `current-password` / `new-password` dla lepszej współpracy z menedżerami haseł.

### 4. Przekierowanie po wylogowaniu
- **auth/signout** – redirect zawsze na `getBaseUrl()` (Twoja domena), a nie na `request.nextUrl.origin`, żeby uniknąć otwartego przekierowania po wylogowaniu.

### 5. Dane wejściowe (już wcześniej)
- **Nick** – walidacja regex, max 32 znaki, sprawdzenie unikalności.
- **Czat** – treść wiadomości ograniczona do 500 znaków (maxLength).
- **React** – treść czatu i nicki renderowane jako tekst (domyślne escapowanie React), brak `dangerouslySetInnerHTML` dla danych użytkownika.

---

## Zalecenia po stronie Supabase (baza i auth)

1. **RLS (Row Level Security)**  
   Upewnij się, że na tabelach (`profiles`, `game_stats`, `chat_messages`) włączone są polityki RLS i że użytkownicy mają dostęp tylko do własnych danych lub do odczytu treści czatu zgodnie z założeniami.

2. **Hasła w Supabase Auth**  
   Domyślne ustawienia pozwalają na hasła od 6 znaków. W **Authentication → Settings** w Supabase możesz ustawić minimalną długość hasła (np. 8), żeby było spójne z walidacją w aplikacji.

3. **Zmienne środowiskowe**  
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` i `NEXT_PUBLIC_SUPABASE_URL` są przeznaczone do użytku w przeglądarce (publiczne).  
   - Nie umieszczaj w repozytorium ani w buildzie klucza **service_role** ani innych tajnych kluczy – używaj tylko w bezpiecznym środowisku (np. backend, cron).

4. **Rate limiting**  
   Supabase Auth ma wbudowane ograniczenia (np. liczba logowań). Dla własnych tras (np. API) rozważ rate limiting (np. Vercel, osobny serwis lub Supabase Edge Functions).

---

## Nie wymagające zmian

- **JSON-LD w layout** – budowany wyłącznie ze stałych i `getBaseUrl()` (env), bez danych użytkownika – brak ryzyka XSS.
- **Middleware** – odświeża sesję Supabase, nie eksponuje wrażliwych danych.
- **Redirecty w aplikacji** – używają wyłącznie wewnętrznych ścieżek (`/login`, `/menu` itd.) lub bezpiecznego `getBaseUrl()`.
