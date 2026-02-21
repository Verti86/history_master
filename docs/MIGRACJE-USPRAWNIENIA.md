# Migracje dla usprawnień (poziomy, streak, odznaki, słabe strony)

Aby działały **poziomy, streak, wyzwanie tygodnia, ranking „Ten tydzień”, odznaki i powtórka słabych stron**, w Supabase trzeba wykonać migracje z repozytorium `quiz-historia` (katalog `supabase/migrations/`):

1. **003_game_stats_category_created.sql** – dodaje `category_id` i `created_at` do `game_stats`
2. **004_profiles_theme_streak.sql** – dodaje `theme` i `last_activity_date` do `profiles`
3. **005_wrong_answers.sql** – tabela `quiz_wrong_answers` (tryb „Powtórka słabych stron”)
4. **006_user_achievements.sql** – tabela `user_achievements` (odznaki)

**Jak zastosować:** Supabase Dashboard → SQL Editor → wklej zawartość każdego pliku i uruchom.  
Albo: w projekcie z Supabase CLI – `supabase db push`.

Bez tych migracji aplikacja działa, ale m.in. streak, ranking „Ten tydzień” i powtórka słabych stron nie będą dostępne (lub menu/ranking może zgłosić błąd przy braku kolumn).
