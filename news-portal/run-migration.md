# View-Tracking Migration ausführen

## Schritte zur Migration:

1. Öffne die Supabase Dashboard SQL Editor
2. Kopiere den Inhalt von `supabase/migrations/002_view_tracking.sql`
3. Füge ihn in den SQL Editor ein und führe aus

## Alternativ via Supabase CLI:

```bash
npx supabase db push
```

## Umgebungsvariablen prüfen:

Stelle sicher, dass in `.env.local` folgende Variable gesetzt ist:
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Den Service Role Key findest du in deinem Supabase Dashboard unter:
Settings → API → Service Role Key (secret)

## Test in Development:

Um View-Counting auch in Development zu testen, setze:
```
NEXT_PUBLIC_COUNT_DEV_VIEWS=true
```

## Features nach Migration:

- ✅ Robustes View-Tracking mit Bot-Filterung
- ✅ 12-Stunden Deduplizierung pro Browser
- ✅ 30-Tage "Meistgelesen" Statistik
- ✅ Rate-Limiting (30 Requests/Minute)
- ✅ DSGVO-konform (keine personenbezogenen Daten)
- ✅ Automatische Bereinigung alter Tracking-Keys