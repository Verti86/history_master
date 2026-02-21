# Panel administracyjny

## Dostęp

- Adres: **`/admin`** (np. `https://twoja-domena.vercel.app/admin`).
- Dostęp mają tylko użytkownicy z rolą **admin** w Supabase.

## Jak nadać rolę admina

1. **Supabase Dashboard** → Twój projekt.
2. **Authentication** → **Users**.
3. Kliknij użytkownika (np. swój email).
4. W sekcji **User Metadata** dodaj lub edytuj JSON, np.:
   ```json
   { "role": "admin" }
   ```
5. Zapisz.

Od teraz ten użytkownik w menu zobaczy link **„Panel administracyjny”** i wejdzie na `/admin`.

## Co można robić w panelu

- **Użytkownicy** – lista użytkowników (email, nick, XP, data rejestracji, ostatnie logowanie). Jeśli ustawisz klucz **service_role** (patrz niżej), tabela pokaże pełne dane z auth. Blokowanie/usuwanie kont nadal w Supabase (Authentication → Users).
- **Moderacja czatu** – lista ostatnich wiadomości, przycisk **Usuń** przy każdej. Usunięcie jest trwałe.

## Pełna lista użytkowników (email, daty)

Żeby w zakładce „Użytkownicy” widzieć **email**, **datę rejestracji** i **ostatnie logowanie**, dodaj w pliku **`.env.local`** (i na Vercel w Variables) zmienną:

- **`SUPABASE_SERVICE_ROLE_KEY`** – klucz „service_role” z Supabase (Project Settings → API → `service_role`).

**Uwaga:** Tego klucza **nie wolno** ujawniać w przeglądarce – używany jest tylko na serwerze (Server Components). Nie dodawaj go do `NEXT_PUBLIC_*`. Na Vercel dodaj go jako zwykłą zmienną środowiskową (bez prefiksu NEXT_PUBLIC).

## Migracja bazy

Żeby admin mógł usuwać wiadomości z czatu, w Supabase trzeba wykonać migrację:

**Supabase Dashboard** → **SQL Editor** → wklej i uruchom zawartość pliku  
`supabase/migrations/002_admin_chat_delete.sql`  
(z repozytorium quiz-historia w katalogu supabase).

Alternatywnie: jeśli używasz CLI Supabase, `supabase db push`.
