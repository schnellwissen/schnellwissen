// Test script to create article directly
const { createArticle, getCategories, generateSlug, calculateReadingTime } = require('./src/lib/database');

const htmlContent = `<!doctype html>
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
    <h1 itemprop="headline">Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet</h1>
    <p itemprop="description">Vier Tage, gleiche Wirkung. Die 4 Tage Woche kann Leistung halten oder steigern, wenn Planung, Fokuszeiten und klare Ziele greifen.</p>
  </header>
  <section>
    <h2>Warum weniger Tage nicht weniger Arbeit sind</h2>
    <p>Leistung entsteht durch Fokus. Nicht durch Sitzzeit. Die 4 Tage Woche bündelt Arbeit in klare Blöcke.</p>
  </section>
</article>
</body>
</html>`;

async function testArticleCreation() {
  try {
    console.log('Testing article creation...');
    
    // Simple HTML sanitization
    const sanitizedContent = htmlContent
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');

    const articleData = {
      title: 'Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet',
      slug: generateSlug('Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet'),
      content: sanitizedContent,
      meta_description: '4-Tage-Woche: Mehr Fokus, gleiche Leistung. Entdecke Modelle, Produktivitätskennzahlen, rechtliche Rahmenbedingungen und Tipps für die erfolgreiche Umsetzung.',
      category_id: '4', // Business category
      image_url: '/uploads/1754393386477-7dd1iovs79s.png',
      status: 'published',
      reading_time: calculateReadingTime(sanitizedContent)
    };

    console.log('Article data prepared:', {
      title: articleData.title,
      slug: articleData.slug,
      contentLength: articleData.content.length,
      reading_time: articleData.reading_time
    });

    const result = await createArticle(articleData);
    
    if (result) {
      console.log('✅ Article created successfully!');
      console.log('Article ID:', result.id);
      console.log('Article URL: /artikel/' + result.slug);
    } else {
      console.log('❌ Failed to create article');
    }
  } catch (error) {
    console.error('❌ Error during article creation:', error);
  }
}

testArticleCreation();