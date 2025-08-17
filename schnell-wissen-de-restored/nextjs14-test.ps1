# Test with Next.js 14 - Complete article creation
Write-Host "Testing article creation with Next.js 14..." -ForegroundColor Green

$uri = "http://localhost:3000/api/test-article-creation"
$headers = @{ "Content-Type" = "application/json" }

$htmlContent = @"
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet</title>
  <meta name="description" content="Vier Tage arbeiten und Leistung halten. So funktioniert die 4-Tage-Woche in der Praxis. Modelle, Produktivität, Arbeitsrecht, KPIs, Beispiele, FAQ.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <link rel="preconnect" href="https://commons.wikimedia.org" crossorigin>
  <link rel="dns-prefetch" href="https://commons.wikimedia.org">
  <link rel="canonical" href="https://www.beispielseite.de/beruf-karriere/warum-4-tage-woche-nicht-gleich-weniger-arbeit-bedeutet">
  <style>
    :root { --maxw: 980px; --text: #111; --muted: #555; --bg: #fff; --soft: #f6f7f9; }
    html,body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.6; }
    article { max-width: var(--maxw); margin: 0 auto; padding: 1rem; }
    header p.meta { color: var(--muted); margin: .25rem 0; }
    h1, h2, h3 { line-height: 1.25; margin: 1rem 0 .5rem; }
    nav ol { display: grid; gap: .25rem .75rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); padding-left: 1.25rem; }
    figure { margin: 1rem 0; }
    img { width: 100%; height: auto; display: block; border-radius: 12px; }
    figcaption { font-size: .9rem; color: var(--muted); margin-top: .25rem; }
    .note { background: var(--soft); padding: .75rem 1rem; border-radius: 8px; border: 1px solid #e6e8eb; }
    table { width: 100%; border-collapse: collapse; margin: .5rem 0; }
    th, td { text-align: left; padding: .5rem; border-bottom: 1px solid #eaeaea; }
    ul, ol { padding-left: 1.25rem; }
    a { color: #0a63c2; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .grid { display: grid; gap: 1rem; grid-template-columns: 1fr; }
    @media (min-width: 780px){ .grid-2 { grid-template-columns: 1fr 1fr; } }
  </style>

  <!-- Article Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet",
    "datePublished": "2025-08-03",
    "dateModified": "2025-08-03",
    "author": { "@type": "Organization", "name": "Redaktion Beruf & Karriere" },
    "about": ["4 Tage Woche","Arbeitszeitmodell","Produktivität","New Work","Work Life Balance","Arbeitgeberattraktivität"],
    "image": ["https://commons.wikimedia.org/wiki/Special:FilePath/Desks%20in%20an%20open%20office%20space%20(Unsplash).jpg"],
    "mainEntityOfPage": "https://www.beispielseite.de/beruf-karriere/warum-4-tage-woche-nicht-gleich-weniger-arbeit-bedeutet"
  }
  </script>

  <!-- FAQ Schema -->
  <script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity":[
      {"@type":"Question","name":"Was bedeutet 4 Tage Woche konkret","acceptedAnswer":{"@type":"Answer","text":"Vier Arbeitstage pro Woche mit gleichbleibender Wochenarbeitszeit oder reduzierter Zeit. Unternehmen wählen Modelle wie 4x10, 4x9 oder 100 80 100. Ziel ist stabile Leistung bei weniger Kalendertagen."}},
      {"@type":"Question","name":"Steigt die Produktivität bei der 4 Tage Woche","acceptedAnswer":{"@type":"Answer","text":"Die Produktivität kann steigen, wenn Fokuszeiten, klare Ziele und weniger Meetings gelten. Teams kürzen Leerlauf und bündeln Arbeit in Zeitfenstern."}},
      {"@type":"Question","name":"Welche Modelle sind praxistauglich","acceptedAnswer":{"@type":"Answer","text":"Bewährt sind 4x10, 4x9 mit Ausgleichstagen und 100 80 100. Wichtig sind Dienstplanung, Erreichbarkeit und ein Betriebsvereinbarungskonzept."}},
      {"@type":"Question","name":"Welche KPIs sollte HR messen","acceptedAnswer":{"@type":"Answer","text":"Krankentage, Fluktuation, Time to Fill, NPS, Ticketdurchlauf, Umsatz pro Kopf. Vorher und nachher messen. Jede Änderung belegen."}},
      {"@type":"Question","name":"Für wen eignet sich die 4 Tage Woche nicht","acceptedAnswer":{"@type":"Answer","text":"Bei Schichtdienst, Notfalldiensten oder strengem Kundenbetrieb ist die Umstellung schwieriger. Hier braucht es Teamsplitting und feste Übergaben."}}
    ]
  }
  </script>
</head>
<body>

<article itemscope itemtype="https://schema.org/Article">
  <header>
    <p class="meta">Kategorie Beruf &amp; Karriere • Aktualisiert am 03.08.2025 • Lesezeit 10 Minuten</p>
    <h1 itemprop="headline">Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet</h1>
    <p itemprop="description">Vier Tage, gleiche Wirkung. Die 4 Tage Woche kann Leistung halten oder steigern, wenn Planung, Fokuszeiten und klare Ziele greifen. Hier steht, wie du das sauber aufsetzt.</p>

    <figure>
      <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Desks%20in%20an%20open%20office%20space%20(Unsplash).jpg"
           alt="Offenes Büro mit Schreibtischen und Laptops als Symbol für 4 Tage Woche und New Work"
           width="1200" height="800" loading="eager" decoding="async">
      <figcaption>Arbeitszeit neu denken, Leistung klar messen. Foto via Wikimedia Commons</figcaption>
    </figure>

    <nav aria-label="Inhalt">
      <ol>
        <li><a href="#warum">Warum weniger Tage nicht weniger Arbeit sind</a></li>
        <li><a href="#modelle">Modelle der 4 Tage Woche</a></li>
        <li><a href="#produktivitaet">Produktivität messen und sichern</a></li>
        <li><a href="#planung">Dienstplanung, Erreichbarkeit, Recht</a></li>
        <li><a href="#umsetzung">Umsetzung in 6 Schritten</a></li>
        <li><a href="#praxis">Praxisbeispiele und Rechenideen</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#quellen">Weiterführende Informationen</a></li>
      </ol>
    </nav>
  </header>

  <section id="warum">
    <h2>Warum weniger Tage nicht weniger Arbeit sind</h2>
    <p>Leistung entsteht durch Fokus. Nicht durch Sitzzeit. Die 4 Tage Woche bündelt Arbeit in klare Blöcke. Teams reduzieren Leerlauf und Meetingzeiten. Sie planen Übergaben sauber. Sie definieren Output. So bleibt Arbeit messbar.</p>
    <div class="note">
      <strong>Kernidee.</strong> Weniger Kalendertage, gleiche oder bessere Wirkung. Möglich durch klare Ziele, Fokuszeiten, weniger Kontextwechsel, schlanke Meetings.
    </div>
    <ul>
      <li>Weniger Unterbrechungen, mehr Tiefe</li>
      <li>Fixe Fokusfenster mit Teamregeln</li>
      <li>Meetingzeit hart begrenzen</li>
      <li>Asynchrone Updates statt Statusrunden</li>
    </ul>
  </section>

  <section id="modelle">
    <h2>Modelle der 4 Tage Woche</h2>
    <p>Unternehmen wählen ein Modell, das zu Markt, Kundschaft und Teamgröße passt. Drei Varianten sind verbreitet.</p>
    <h3>4x10</h3>
    <p>Vier Tage zu je zehn Stunden. Vorteil sind lange Fokusblöcke. Nachteil kann die Länge des Tages sein. Einsatz geeignet in Projekten mit wenig Kundenkontakt am Nachmittag.</p>
    <h3>4x9 mit Ausgleich</h3>
    <p>Vier Tage zu neun Stunden. Ein Ausgleichstag im zwei Wochen Rhythmus. Vorteil ist die moderate Tageslänge. Planung bleibt flexibel.</p>
    <h3>100 80 100</h3>
    <p>100 Prozent Lohn, 80 Prozent Zeit, 100 Prozent Zielerreichung. Teams definieren Output sauber. Fokuszeiten und Meetingregeln sind Pflicht.</p>

    <figure>
      <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Calendar%20(close-up,%20shallow%20depth%20of%20field).jpg"
           alt="Kalenderausschnitt als Symbol für Dienstplanung in der 4 Tage Woche"
           width="1200" height="800" loading="lazy" decoding="async">
      <figcaption>Planung entscheidet über Erfolg. Foto via Wikimedia Commons</figcaption>
    </figure>

    <table aria-label="Modellvergleich 4 Tage Woche">
      <thead>
        <tr>
          <th>Modell</th>
          <th>Vorteile</th>
          <th>Risiken</th>
          <th>Passt zu</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>4x10</td>
          <td>Lange Fokusblöcke, wenige Übergaben</td>
          <td>Langer Tag, Ermüdung möglich</td>
          <td>Projektarbeit, Entwicklung, interne Services</td>
        </tr>
        <tr>
          <td>4x9 mit Ausgleich</td>
          <td>Gute Balance, planbar</td>
          <td>Komplexere Dienstpläne</td>
          <td>Teams mit Kundenkontakt und Kernzeiten</td>
        </tr>
        <tr>
          <td>100 80 100</td>
          <td>Starker Fokus auf Output</td>
          <td>Hoher Reifegrad nötig</td>
          <td>Erfahrene Teams mit klaren KPIs</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section id="produktivitaet">
    <h2>Produktivität messen und sichern</h2>
    <p>Ohne Kennzahlen kein Vergleich. Lege vor der Umstellung eine Baseline fest. Messe danach die gleichen Werte. Nutze einfache Kennzahlen, die jeder versteht.</p>
  </section>

  <section id="faq">
    <h2>FAQ</h2>
    <h3>Wie starte ich einen Pilot</h3>
    <p>Suche ein motiviertes Team. Setze auf klare Ziele, Fokuszeiten und kurze Meetings. Miss vorher und nachher. Plane acht bis zwölf Wochen Testdauer.</p>

    <h3>Wie halte ich Servicezeiten ein</h3>
    <p>Plane Schichten. Teile das Team auf zwei freie Tage. Sichere Übergaben und Rufbereitschaft. Kläre Kundenerwartungen früh.</p>

    <h3>Was passiert mit Überstunden</h3>
    <p>Überstunden müssen geregelt sein. Plane Puffer. Rolle Engpässe nicht in die Freizeit. Melde Auslastung wöchentlich.</p>

    <h3>Welche Tools helfen</h3>
    <p>Ticket System, Kalender mit Fokusfenstern, Kanban Board, asynchrone Status Updates. Halte den Stack schlank.</p>
  </section>

  <section id="quellen">
    <h2>Weiterführende Informationen</h2>
    <ul>
      <li><a href="https://www.bmas.de" rel="nofollow">BMAS Grundinfos zu Arbeitszeit und Recht</a></li>
      <li><a href="https://www.ilo.org" rel="nofollow">ILO Ressourcen zu Arbeitszeit und Produktivität</a></li>
      <li><a href="https://www.eurofound.europa.eu" rel="nofollow">Eurofound Studien zu Arbeitszeitmodellen</a></li>
      <li><a href="https://www.baua.de" rel="nofollow">BAuA Hinweise zu Arbeitsgestaltung und Gesundheit</a></li>
    </ul>
  </section>

  <footer>
    <p>Hinweis. Dieser Beitrag ersetzt keine Rechtsberatung. Prüfe deine Situation und Regeln im Betrieb.</p>
    <p><strong>SEO Keywords.</strong> 4 Tage Woche, Arbeitszeitmodell, Produktivität, New Work, Work Life Balance, Dienstplanung, Betriebsvereinbarung, Teammeeting, Fokuszeit, Meetingzeit reduzieren</p>
  </footer>
</article>

</body>
</html>
"@

$body = @{
    title = "Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet"
    slug = "warum-4-tage-woche-nicht-gleich-weniger-arbeit-bedeutet-nextjs14"
    content = $htmlContent
    meta_description = "4-Tage-Woche: Mehr Fokus, gleiche Leistung. Entdecke Modelle, Produktivitätskennzahlen, rechtliche Rahmenbedingungen und Tipps für die erfolgreiche Umsetzung."
    category_id = "4"
    image_url = "/uploads/1754393386477-7dd1iovs79s.png"
    status = "published"
    reading_time = 10
} | ConvertTo-Json

try {
    Write-Host "Creating full article with Next.js 14..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $body -Headers $headers
    
    Write-Host "🎉 SUCCESS! Article created with Next.js 14:" -ForegroundColor Green
    Write-Host "   ID: $($response.id)" -ForegroundColor Green
    Write-Host "   Slug: $($response.slug)" -ForegroundColor Green
    Write-Host "   Message: $($response.message)" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "✅ JEST WORKER PROBLEM SOLVED WITH NEXT.JS 14 DOWNGRADE!" -ForegroundColor Green -BackgroundColor Black
    Write-Host ""
    
    # Open the created article
    Start-Process "http://localhost:3000/artikel/$($response.slug)"
    Write-Host "Opening article: http://localhost:3000/artikel/$($response.slug)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "Next.js 14 test completed!" -ForegroundColor Yellow