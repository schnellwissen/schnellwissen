# News Portal

Ein modernes News-Portal mit Next.js 14 und Supabase.

## Technische Anforderungen

- **Node.js:** v22.17.0 (getestet)
- **Next.js:** 14.2.5 (fixiert)
- **React:** 18.3.1

> **Wichtiger Hinweis (Stand 01/2025):** Next.js 15 verursacht unter Windows Compiler-Crashes (Jest worker errors). Daher verwenden wir die stabile Version 14.2.5 mit deaktiviertem SWC-Minifier.

## Bilder in Artikeln

### Unterstützte Bildquellen
- **Direkte URLs:** Unsplash, Picsum, Placeholder-Services
- **Supabase Storage:** Upload über das Admin-Interface
- **Data-URLs:** Base64-encodierte Bilder

### Wichtige Hinweise zu Bildern
1. **Unsplash-URLs** müssen die Parameter `?w=800&q=80` enthalten (nicht nur die Basis-URL)
2. **HTML-Sanitization:** Für Admin-Content ist DOMPurify deaktiviert, damit Bilder angezeigt werden
3. **Next.js Images:** `unoptimized: true` in der Config, um externe Bilder zuzulassen

### Fehlersuche bei nicht angezeigten Bildern
1. Browser-Konsole öffnen (F12) - Debug-Output zeigt alle gefundenen Bilder
2. Netzwerk-Tab prüfen: 403/404 bedeutet die Bildquelle blockiert Hotlinking
3. Alternative Bildquellen verwenden: Picsum.photos oder via.placeholder.com

## Homepage Layout

### Artikel-Cards
- **Komponente:** `components/ArticleCard.tsx` für einheitliche Darstellung
- **Bildgrößen:** Desktop: h-48 (≈190px), Mobile: h-32 (≈130px)
- **Text-Truncation:** 
  - Titel: max. 2 Zeilen (line-clamp-2)
  - Excerpt: max. 120 Zeichen aus DB-Feld `excerpt`
- **Kein HTML-Rendering:** Nur Plain-Text aus DB, keine `dangerouslySetInnerHTML` im Feed

### Meistgelesen Sidebar
- **Thumbnail:** h-16 w-28 (64x112px) mit object-cover
- **Kompaktes Layout:** Nummer, Thumbnail und Titel nebeneinander
- **Fallback-Bild:** Placeholder wenn kein Cover vorhanden

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
