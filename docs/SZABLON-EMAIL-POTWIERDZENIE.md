# Szablon e-mail potwierdzenia rejestracji (po polsku)

Aby maile wysyłane po rejestracji były **po polsku i przyjazne dzieciom**, wklej poniższą treść w Supabase.

**Ważne:** W mailu użytkownika widać **tylko** to, co jest wewnątrz bloku `html` poniżej – żadne nagłówki („Gdzie to ustawić”), znaki `##` ani instrukcje. Żeby zobaczyć dokładny wygląd maila, otwórz w przeglądarce plik **`email-potwierdzenie-podglad.html`** (w tym samym folderze).

## Gdzie to ustawić

1. Zaloguj się do **Supabase Dashboard**.
2. Wybierz projekt aplikacji.
3. W menu: **Authentication** → **Email Templates**.
4. Wybierz szablon **Confirm signup**.
5. Wklej **Temat** i **Treść** (Body) poniżej.

---

## Temat wiadomości (Subject)

```
Potwierdź swój adres email – History Master Online
```

---

## Treść wiadomości (Body) – wklej w pole HTML

Możesz użyć wersji **uproszczonej (tekst)** albo **z przyciskiem (HTML)**. Supabase przyjmuje HTML.

### Wersja z przyciskiem (zalecana – czytelna dla dzieci)

```html
<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #333;">
  <h1 style="color: #1a1a1a; font-size: 22px; margin-bottom: 16px;">Cześć! 👋</h1>
  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 12px;">
    Założyłeś lub założyłaś konto w <strong>History Master Online</strong> – aplikacji do nauki historii.
  </p>
  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    <strong>Co teraz zrobić?</strong><br>
    Kliknij w poniższy przycisk. Przeniesie Cię do aplikacji i aktywuje Twoje konto. Potem będziesz mógł lub mogła się zalogować i grać!
  </p>
  <p style="margin: 24px 0;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: #ffbd45; color: #0e1117; font-weight: bold; font-size: 16px; padding: 14px 28px; text-decoration: none; border-radius: 12px;">Potwierdź mój email</a>
  </p>
  <p style="font-size: 14px; color: #666; line-height: 1.5;">
    Jeśli przycisk nie działa, skopiuj i wklej ten link do przeglądarki:<br>
    <a href="{{ .ConfirmationURL }}" style="color: #ffbd45; word-break: break-all;">{{ .ConfirmationURL }}</a>
  </p>
  <p style="font-size: 13px; color: #888; margin-top: 24px;">
    Jeśli to nie Ty zakładałeś lub zakładałaś tego konta, po prostu zignoruj tę wiadomość.
  </p>
  <p style="font-size: 13px; color: #888; margin-top: 16px;">
    Do zobaczenia w grze! ⚔️<br>
    <strong>History Master Online</strong>
  </p>
</div>
```

---

### Wersja minimalistyczna (tylko tekst i link)

Jeśli wolisz krótszą wersję bez przycisku:

```html
<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #333;">
  <h2 style="color: #1a1a1a;">Potwierdź swój email</h2>
  <p style="font-size: 16px; line-height: 1.5;">
    Kliknij w link poniżej, żeby aktywować konto w History Master Online i móc się zalogować:
  </p>
  <p style="margin: 20px 0;">
    <a href="{{ .ConfirmationURL }}" style="color: #ffbd45; font-weight: bold;">{{ .ConfirmationURL }}</a>
  </p>
  <p style="font-size: 13px; color: #888;">
    Jeśli to nie Ty zakładałeś konta, zignoruj tę wiadomość.
  </p>
</div>
```

---

## Ważne

- **Nie usuwaj** fragmentu `{{ .ConfirmationURL }}` – to zmienna, którą Supabase wstawia (link do potwierdzenia).
- Po zapisaniu szablonu nowi użytkownicy będą dostawać maila po polsku.
- W **Authentication → URL Configuration** ustaw **Site URL** na adres swojej aplikacji (np. `https://twoja-domena.vercel.app`), żeby po kliknięciu w link użytkownik trafił do Twojej strony.
