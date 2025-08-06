# News Portal

Ein modernes News-Portal mit Next.js 14 und Supabase.

## Setup

### 1. ENV-Variablen in Vercel eintragen

Erstellen Sie eine `.env.local` Datei und tragen Sie folgende Variablen ein:

```
NEXT_PUBLIC_SUPABASE_URL=https://<projekt>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_WEBSITE_URL=https://deine-domain.tld
```

### 2. SQL-Script in Supabase-Abfrageeditor ausführen

Führen Sie das SQL-Script aus `supabase-schema.sql` in Ihrem Supabase-Dashboard aus:
1. Gehen Sie zu SQL Editor
2. Kopieren Sie den Inhalt von `supabase-schema.sql`
3. Führen Sie das Script aus

### 3. Development Server starten

```bash
npm install
npm run dev
```

Der Server läuft dann auf http://localhost:3000

## Features

- ✅ Supabase Auth (E-Mail/Passwort)
- ✅ Admin-Flag in Profiles
- ✅ 12 vordefinierte Kategorien
- ✅ Row-Level-Security für Artikel
- ✅ Navigation mit Login-Button und Admin-Badge
- ✅ Subdomain-Handling via Middleware
- ✅ Windows-optimierte Konfiguration (SWC Minifier deaktiviert)

## Seiten

- `/` - Homepage mit Kategorien-Dropdown
- `/login` - Admin Login
- `/admin` - Admin Dashboard (nur für Admins zugänglich)

## Datenbank-Struktur

### Tabellen
- `profiles` - Benutzerprofile mit Admin-Flag
- `categories` - 12 vordefinierte Kategorien
- `articles` - Artikel mit RLS (nur published oder für Admins sichtbar)

### Row-Level-Security
- Nicht-angemeldete Nutzer sehen nur veröffentlichte Artikel
- Admins können alle Artikel sehen und bearbeiten
