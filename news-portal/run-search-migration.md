# Anleitung: Zuverlässige Suche aktivieren

## Migration in Supabase ausführen

1. Öffne das Supabase Dashboard
2. Gehe zu SQL Editor
3. Führe die Migration `005_reliable_search.sql` aus

## Was die Migration bewirkt:

### Normalisierte Spalten
- `title_norm`: Titel ohne Bindestriche/Sonderzeichen für bessere Präfix-Suche
- `excerpt_norm`: Normalisierter Excerpt  
- `tags_norm`: Normalisierte Tags
- Beispiel: "ETF-Sparplan" wird zu "etf sparplan"

### Verbesserte Indizes
- GIN-Index für Volltext-Suche
- Trigram-Indizes für Fuzzy-Matching
- Optimiert für schnelle Präfix-Suchen

### Robuste Such-Funktionen
- `search_articles()`: Hauptfunktion mit Präfix, Fuzzy und Ranking
- `search_articles_fallback()`: Einfacher Fallback bei Fehlern

## Test-Checkliste

Nach der Migration teste folgende Szenarien:

### 1. Präfix-Suche
- [ ] "ETF" findet "ETF-Sparplan" als ersten Treffer
- [ ] "Spar" findet "ETF-Sparplan"
- [ ] "plan" findet "ETF-Sparplan"

### 2. Case-Insensitive
- [ ] "etf" liefert gleiche Ergebnisse wie "ETF"
- [ ] "EtF" funktioniert auch

### 3. Tippfehler (Fuzzy)
- [ ] "EFT" findet trotzdem ETF-Artikel
- [ ] "Sparpln" findet "Sparplan"

### 4. Bindestriche
- [ ] "ETF Sparplan" findet "ETF-Sparplan"
- [ ] Suche ignoriert Bindestriche korrekt

### 5. Umlaute
- [ ] "Ruckzahlung" findet "Rückzahlung"
- [ ] "über" und "ueber" liefern gleiche Ergebnisse

### 6. Performance
- [ ] Suchergebnisse in < 120ms
- [ ] Keine roten Fehler in der UI
- [ ] Fallback funktioniert bei DB-Problemen

## Verbesserungen gegenüber vorheriger Version:

1. **Normalisierte Spalten**: Bindestriche/Sonderzeichen werden für Suche entfernt
2. **Robustere API**: Keine 500er Fehler mehr, immer 200 mit leeren Ergebnissen
3. **Rate Limiting**: 10 Anfragen pro 5 Sekunden pro IP
4. **Besseres Präfix-Matching**: Findet auch Wörter in der Mitte des Titels
5. **Substring-Fallback**: Falls andere Methoden fehlschlagen
6. **Freundliche Fehlermeldungen**: Keine roten Fehler, sondern graue Info-Texte

## Troubleshooting

Falls "ETF" nicht "ETF-Sparplan" findet:

1. Prüfe ob Migration erfolgreich war:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND column_name LIKE '%_norm';
```

2. Prüfe Indizes:
```sql
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'articles' 
AND indexname LIKE '%trgm%';
```

3. Teste direkt in SQL:
```sql
SELECT title, title_norm 
FROM articles 
WHERE title_norm ILIKE 'etf%' 
LIMIT 5;
```

4. Prüfe Trigram-Threshold:
```sql
SHOW pg_trgm.similarity_threshold;
-- Sollte 0.2 oder niedriger sein
```