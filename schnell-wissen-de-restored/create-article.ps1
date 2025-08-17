# PowerShell script to create article via web interface
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName Microsoft.VisualBasic

Write-Host "Creating article via web interface..."

# Launch browser and navigate to article creation page
Start-Process "http://localhost:3000/dashboard-xy934k2_admin/artikel/neu"

# Wait for browser to load
Start-Sleep -Seconds 5

Write-Host "Browser launched. Please wait while we attempt to fill the form programmatically..."

# We'll use REST API approach since browser automation is complex
$uri = "http://localhost:3000/api/test-article-creation"
$headers = @{
    "Content-Type" = "application/json"
}

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
</head>
<body>
<article itemscope itemtype="https://schema.org/Article">
  <header>
    <p class="meta">Kategorie Beruf &amp; Karriere • Aktualisiert am 03.08.2025 • Lesezeit 10 Minuten</p>
    <h1 itemprop="headline">Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet</h1>
    <p itemprop="description">Vier Tage, gleiche Wirkung. Die 4 Tage Woche kann Leistung halten oder steigern, wenn Planung, Fokuszeiten und klare Ziele greifen. Hier steht, wie du das sauber aufsetzt.</p>
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
</article>
</body>
</html>
"@

$body = @{
    title = "Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet"
    slug = "warum-4-tage-woche-nicht-gleich-weniger-arbeit-bedeutet"
    content = $htmlContent
    meta_description = "4-Tage-Woche: Mehr Fokus, gleiche Leistung. Entdecke Modelle, Produktivitätskennzahlen, rechtliche Rahmenbedingungen und Tipps für die erfolgreiche Umsetzung."
    category_id = "4"
    image_url = "/uploads/1754393386477-7dd1iovs79s.png"
    status = "published"
    reading_time = 10
} | ConvertTo-Json

Write-Host "Attempting to create article via API..."

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $body -Headers $headers
    Write-Host "SUCCESS! Article created:" -ForegroundColor Green
    Write-Host "ID: $($response.id)" -ForegroundColor Green
    Write-Host "Slug: $($response.slug)" -ForegroundColor Green
    Write-Host "Message: $($response.message)" -ForegroundColor Green
    
    # Open the created article
    Start-Process "http://localhost:3000/artikel/$($response.slug)"
    Write-Host "Opening created article in browser..." -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: Failed to create article" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseText = $reader.ReadToEnd()
        Write-Host "Response: $responseText" -ForegroundColor Red
    }
}

Write-Host "Script completed."