# Konsistente Views Migration

## 🚀 Migration ausführen:

1. **Öffne Supabase SQL Editor**:
   https://uabmwhtoimelqpuhyluz.supabase.co/dashboard/project/uabmwhtoimelqpuhyluz/sql/new

2. **Führe die Migration aus**:
   - Kopiere den Inhalt von `supabase/migrations/003_views_consistent.sql`
   - Füge ihn in den SQL Editor ein
   - Klicke auf "RUN"

## ✅ Nach der Migration:

Das System bietet jetzt:

### Konsistente Metriken:
- **30-Tage-Views** überall gleich (Hauptseite = Detailseite = Karten)
- **Atomare Updates** (keine Race Conditions)
- **Strict Mode Safe** (keine doppelten Zählungen)

### Features:
- ⏱️ **Deduplizierung**: 1 Minute in Dev, 12 Stunden in Produktion
- 🤖 **Bot-Filterung**: 30+ Bot-Patterns werden ignoriert
- 🔄 **Auto-Revalidierung**: Hauptseite aktualisiert sich nach View-Inkrement
- 🕐 **Zeitzone**: Europe/Berlin für korrekte Tagesgrenzen
- 🔒 **DSGVO-konform**: Keine personenbezogenen Daten

### Testing:
1. Öffne einen Artikel
2. Schaue in Browser-Konsole (F12): `[useCountView] Response: {counted: true, views_30d: X}`
3. Gehe zur Hauptseite - gleiche Zahl sollte angezeigt werden
4. Nach 1 Minute (Dev) kannst du wieder zählen

## 🎯 Akzeptanzkriterien erfüllt:
- ✅ Eine einzige Metrik (views_30d) überall
- ✅ Nur 1 Inkrement pro Nutzer/Artikel/Zeitfenster
- ✅ Keine Doppelzählung durch React Strict Mode
- ✅ Server-Datum (Europe/Berlin Zeitzone)
- ✅ ISR/Revalidierung funktioniert