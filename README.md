# Procvičování matematiky

Webová aplikace pro procvičování početních operací s desetinnými čísly a se zlomky. Po dokončení cvičení zobrazí analýzu výsledků a umožní ji sdílet odkazem přes Supabase.

## Spuštění

```bash
cp supabase-config.example.js supabase-config.js
# doplň url a anonKey ze Supabase projektu

npx serve
```

Aplikaci otevři v prohlížeči na adrese, kterou vypíše server (např. `http://localhost:3000`). Odkazy na sdílené analýzy musí používat HTTP server, ne `file://`.

## Supabase

1. Vytvoř projekt na [supabase.com](https://supabase.com).
2. Spusť schéma z `supabase/schema.sql` (tabulka `analyses` pro sdílení analýz).
3. Zkopíruj `supabase-config.example.js` → `supabase-config.js` a doplň URL a anon klíč (soubor je v repozitáři pro nasazení na GitHub Pages; anon klíč je určený pro použití v prohlížeči).

Automatické nastavení (vyžaduje Supabase access token):

```bash
SUPABASE_ACCESS_TOKEN=... node setup-supabase.mjs
```

## Skripty

| Skript | Popis |
|--------|--------|
| `simulate-user.mjs` | Simulace procvičování desetinných čísel |
| `generate-fraction-add-analysis.mjs` | Fiktivní analýza – sčítání zlomků |
| `generate-fraction-subtract-analysis.mjs` | Fiktivní analýza – odčítání zlomků |
| `generate-fraction-add-subtract-analysis.mjs` | Fiktivní analýza – sčítání a odčítání |
| `generate-fraction-all-operations-analysis.mjs` | Fiktivní analýza – všechny operace se zlomky |
| `generate-worksheet.mjs` | Generování pracovního listu |
| `setup-supabase.mjs` | Nastavení Supabase a `supabase-config.js` |

Pro generování analýzy s vlastní URL aplikace:

```bash
APP_BASE_URL=http://localhost:3000 node generate-fraction-all-operations-analysis.mjs
```

## GitHub Pages

Repozitář obsahuje GitHub Actions workflow pro nasazení na Pages.

1. V repozitáři: **Settings → Pages → Build and deployment → GitHub Actions**.
2. Volitelně nastav secrets **Settings → Secrets and variables → Actions** (mají přednost před souborem v repozitáři):
   - `SUPABASE_URL` – URL Supabase projektu
   - `SUPABASE_ANON_KEY` – anon klíč
3. Po pushi na `main` se spustí workflow **Deploy GitHub Pages**.

Deploy použije `supabase-config.js` z repozitáře, pokud secrets nejsou nastavené. Bez platné konfigurace cvičení funguje, ukládání analýz ne.

Workflow **CI** při každém pushi kontroluje syntaxi `main.js` a skriptů `.mjs`.

## Struktura

- `index.html`, `main.js`, `styles.css` – aplikace
- `supabase/` – schéma databáze a migrace
- `supabase-config.example.js` – vzor konfigurace (skutečný soubor je v `.gitignore`)
