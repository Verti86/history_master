# Co zmienić, żeby Cursor (AI) mógł robić commit i push

## 1. Proxy Gita (ważne przy błędzie „127.0.0.1”)

Jeśli przy `git push` widać błąd z `127.0.0.1`, Git może używać proxy. Sprawdź:

```powershell
git config --global --get http.proxy
git config --global --get https.proxy
```

Jeśli coś zwraca (np. `127.0.0.1:port`) i **nie** używasz proxy, wyczyść:

```powershell
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 2. Zatwierdzanie uprawnień w Cursorze

Gdy AI uruchomi polecenie z `git push`:

- Pojawi się prośba o **„Run”** z uprawnieniami (np. **git_write**, **network** lub **all**).
- **Zatwierdź** (Allow / Uruchom), żeby commit i push mogły się wykonać.

Bez zatwierdzenia Cursor nie wykona pusha.

## 3. Unikanie blokady `.git/index.lock`

Zanim poprosisz AI o commit i push:

- Zamknij inne programy korzystające z tego repo (np. GitHub Desktop, drugie okno Cursor z tym samym projektem).
- Nie rób w tym samym momencie ręcznego `git commit` / `git push` w innym terminalu.

Dzięki temu AI będzie mógł normalnie użyć Gita.

## 4. Podsumowanie

| Co zrobić | Po co |
|-----------|--------|
| Wyczyścić proxy (jeśli nie używasz) | Żeby `git push` łączył się z GitHubem, a nie z 127.0.0.1 |
| Zatwierdzać uprawnienia przy poleceniu AI | Żeby Cursor mógł wykonać `git push` |
| Nie blokować Gita innymi programami | Żeby nie powstawał `.git/index.lock` |

Po tych krokach możesz pisać np. „zrób commit i push” lub „wyślij zmiany na GitHub” – AI wykona `git add`, `git commit` i `git push` za Ciebie.
