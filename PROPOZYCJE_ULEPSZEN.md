# Propozycje ulepszeń – History Master Online

## Już wdrożone
- **Quiz:** losowa kolejność odpowiedzi przy każdym pytaniu (A–D nie zawsze w tej samej kolejności).
- **Quiz:** po błędnej odpowiedzi pokazujemy poprawną odpowiedź i wyjaśnienie; przycisk „Dalej” przechodzi do następnego pytania (błąd trafia do powtórki).

---

## UX i nauka

| Ulepszenie | Opis | Trudność |
|------------|------|----------|
| **Podsumowanie rundy w Osi Czasu** | Po np. 5 starciach pokazać „Zdobyte XP: X”, przycisk „Jeszcze rundę” / „Menu”. | Niska |
| **Więcej szans w Skojarzeniach** | Po pierwszej błędnej odpowiedzi: „Spróbuj jeszcze raz” zamiast od razu blokować; po 2–3 błędach pokazać poprawną odpowiedź. | Niska |
| **Statystyki osobiste** | W sidebarze: XP z ostatnich 7 dni, breakdown po trybach (Quiz / Fiszki / Oś / Skojarzenia), „Ostatnia aktywność”. Wymaga zapisywania `game_mode` i ewentualnie daty w `game_stats`. | Średnia |
| **Limit pytań w Quizie/Fiszkach** | Wybór: „10 pytań” / „20 pytań” / „Wszystkie” – szybsze sesje dla uczniów. | Niska |
| **Animacja odwracania fiszki** | CSS 3D flip zamiast zwykłej zamiany treści – przyjemniejsza wizualnie. | Średnia |

## Techniczne i treść

| Ulepszenie | Opis | Trudność |
|------------|------|----------|
| **Odpowiedź na „Zapomniałem hasła”** | Link na ekranie logowania → Supabase `resetPasswordForEmail`. | Niska |
| **Oś Czasu z bazy** | Wydarzenia z plików JSON (gdy pytanie ma pole `year` lub osobny plik `os_czasu.json`) zamiast tylko stałej listy w config. | Średnia |
| **Więcej skojarzeń i wydarzeń** | Rozszerzenie `ASSOCIATIONS_DB` i `TIMELINE_DB` lub ładowanie z JSON. | Niska (treść) |
| **Walidacja plików JSON** | Przy `load_files()` sprawdzać wymagane pola (`question`, `answers`, `correct_index`); błędne pliki pomijać z komunikatem w logu. | Niska |
| **Tryb ciemny/jasny** | Plik `.streamlit/config.toml` z `theme.base = "dark"` lub przełącznik w aplikacji (session state + CSS). | Niska |

## Na później

- **Powiadomienia / przypomnienia:** „Nie byłeś od 3 dni – wróć do nauki!” (wymaga przechowywania ostatniego logowania).
- **Odznaki / osiągnięcia:** np. „10 quizów z rzędu”, „Oś Czasu bez błędu” – zapis w Supabase, wyświetlanie w profilu.
- **Tryb rywalizacji:** krótki quiz na czas, wyniki na żywo (bardziej złożone).

---

Które punkty wdrożyć w pierwszej kolejności, zależy od priorytetu: szybkie „quick wins” (podsumowanie Osi Czasu, limit pytań, zapomniałem hasła) vs. większe (statystyki, więcej treści).
