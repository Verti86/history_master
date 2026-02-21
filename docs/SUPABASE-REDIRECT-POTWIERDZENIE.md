# Przekierowanie po potwierdzeniu emaila – dlaczego wyskakuje błąd Streamlit

## Co się dzieje

Użytkownik klika w mailu link „Potwierdź mój email”. Supabase **poprawnie** potwierdza konto (dlatego logowanie potem działa), ale **przekierowuje** przeglądarkę na adres skonfigurowany w projekcie. Jeśli tam jest stary adres **Streamlit** (np. `*.streamlit.app`), użytkownik widzi błąd „Błąd podczas uruchamiania aplikacji” – bo ta aplikacja już nie obsługuje tego adresu albo nie działa.

## Co zrobić (jednorazowo w Supabase)

1. Wejdź do **Supabase Dashboard** → swój projekt.
2. **Authentication** → **URL Configuration**.
3. Ustaw:
   - **Site URL:** adres Twojej aplikacji **Next.js** (np. `https://history-master.vercel.app` albo Twoja domena na Vercel).
   - **Redirect URLs:** dodaj dokładnie:
     - `https://history-master.vercel.app/**`  
       (albo `https://TWOJA-DOMENA.vercel.app/**` jeśli masz inną).
4. Zapisz zmiany.

Dzięki temu po kliknięciu w link w mailu użytkownik trafi na **Next.js**, a nie na Streamlit. Konto jest i tak potwierdzone w Supabase, więc od razu może się zalogować.

## Opcjonalnie

Jeśli na liście **Redirect URLs** jest wpis z `streamlit.app`, możesz go usunąć, żeby nic nie przekierowywało już na starą aplikację.
