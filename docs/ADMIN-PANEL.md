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

- **Użytkownicy** – lista użytkowników (email, nick, XP, rejestracja, ostatnie logowanie, status). Przy każdym użytkowniku: **Zablokuj** / **Odblokuj** oraz **Usuń konto**. Własnego konta nie można zablokować ani usunąć z panelu. Wymaga **SUPABASE_SERVICE_ROLE_KEY** (patrz niżej).
- **Moderacja czatu** – lista ostatnich wiadomości, przycisk **Usuń** przy każdej. Usunięcie jest trwałe (wykonywane z klucza service_role). Okienko czatu na stronie odświeża listę od razu po usunięciu, jeśli tabela jest w publikacji Realtime (patrz niżej).

## Pełna lista użytkowników (email, daty)

Żeby w zakładce „Użytkownicy” widzieć **email**, **datę rejestracji** i **ostatnie logowanie**, dodaj w pliku **`.env.local`** (i na Vercel w Variables) zmienną:

- **`SUPABASE_SERVICE_ROLE_KEY`** – klucz „service_role” z Supabase (Project Settings → API → `service_role`).

**Uwaga:** Tego klucza **nie wolno** ujawniać w przeglądarce – używany jest tylko na serwerze (Server Components). Nie dodawaj go do `NEXT_PUBLIC_*`. Na Vercel dodaj go jako zwykłą zmienną środowiskową (bez prefiksu NEXT_PUBLIC).

## Realtime a okienko czatu

Żeby po usunięciu wiadomości w panelu „Moderacja czatu” lista w okienku czatu na stronie odświeżała się od razu (bez przeładowania), tabela `chat_messages` musi być w publikacji **supabase_realtime**. W Supabase: **Database** → **Replication** (lub **Publications**) → publikacja `supabase_realtime` → dodaj tabelę `chat_messages`. Alternatywnie w SQL Editor:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
```

## Migracja bazy

Opcjonalnie – polityka RLS dla admina (usuwanie z poziomu klienta). Aplikacja i tak wykonuje usuwanie przez Server Action z **service_role**, więc migracja nie jest wymagana do działania:

**Supabase Dashboard** → **SQL Editor** → wklej i uruchom zawartość pliku  
`supabase/migrations/002_admin_chat_delete.sql`  
(z repozytorium quiz-historia w katalogu supabase).

Alternatywnie: jeśli używasz CLI Supabase, `supabase db push`.
