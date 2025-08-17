'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Completely fixed version without any problematic dependencies
export default function FixedArticleCreation() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState({
    title: 'Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet',
    slug: 'warum-4-tage-woche-nicht-gleich-weniger-arbeit-bedeutet-fixed',
    content: `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet</title>
  <meta name="description" content="Vier Tage arbeiten und Leistung halten. So funktioniert die 4-Tage-Woche in der Praxis. Modelle, Produktivität, Arbeitsrecht, KPIs, Beispiele, FAQ.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <style>
    :root { --maxw: 980px; --text: #111; --muted: #555; --bg: #fff; --soft: #f6f7f9; }
    html,body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.6; }
    article { max-width: var(--maxw); margin: 0 auto; padding: 1rem; }
    header p.meta { color: var(--muted); margin: .25rem 0; }
    h1, h2, h3 { line-height: 1.25; margin: 1rem 0 .5rem; }
    figure { margin: 1rem 0; }
    img { width: 100%; height: auto; display: block; border-radius: 12px; }
    figcaption { font-size: .9rem; color: var(--muted); margin-top: .25rem; }
    .note { background: var(--soft); padding: .75rem 1rem; border-radius: 8px; border: 1px solid #e6e8eb; }
    table { width: 100%; border-collapse: collapse; margin: .5rem 0; }
    th, td { text-align: left; padding: .5rem; border-bottom: 1px solid #eaeaea; }
    ul, ol { padding-left: 1.25rem; }
    a { color: #0a63c2; text-decoration: none; }
    a:hover { text-decoration: underline; }
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
  <section id="modelle">
    <h2>Modelle der 4 Tage Woche</h2>
    <p>Unternehmen wählen ein Modell, das zu Markt, Kundschaft und Teamgröße passt. Drei Varianten sind verbreitet.</p>
    <h3>4x10</h3>
    <p>Vier Tage zu je zehn Stunden. Vorteil sind lange Fokusblöcke. Nachteil kann die Länge des Tages sein. Einsatz geeignet in Projekten mit wenig Kundenkontakt am Nachmittag.</p>
    <h3>4x9 mit Ausgleich</h3>
    <p>Vier Tage zu neun Stunden. Ein Ausgleichstag im zwei Wochen Rhythmus. Vorteil ist die moderate Tageslänge. Planung bleibt flexibel.</p>
    <h3>100 80 100</h3>
    <p>100 Prozent Lohn, 80 Prozent Zeit, 100 Prozent Zielerreichung. Teams definieren Output sauber. Fokuszeiten und Meetingregeln sind Pflicht.</p>
  </section>
</article>
</body>
</html>`,
    meta_description: '4-Tage-Woche: Mehr Fokus, gleiche Leistung. Entdecke Modelle, Produktivitätskennzahlen, rechtliche Rahmenbedingungen und Tipps für die erfolgreiche Umsetzung.',
    category_id: '4',
    image_url: '/uploads/1754393386477-7dd1iovs79s.png',
    status: 'published'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      // Simple HTML sanitization
      const sanitizedContent = formData.content
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')

      const articleData = {
        ...formData,
        content: sanitizedContent,
        reading_time: Math.max(1, Math.ceil(sanitizedContent.replace(/<[^>]*>/g, '').split(/\s+/).length / 200))
      }

      // Use the working API route
      const response = await fetch('/api/test-article-creation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setMessage(`✅ Artikel wurde erfolgreich erstellt! ID: ${result.id}`)
        // Redirect to the created article for immediate viewing
        setTimeout(() => {
          if (formData.status === 'published') {
            router.push(`/artikel/${result.slug}`)
          } else {
            router.push('/dashboard-xy934k2_admin')
          }
        }, 2000)
      } else {
        setMessage(`❌ Fehler beim Erstellen des Artikels: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating article:', error)
      setMessage(`❌ Fehler beim Erstellen des Artikels: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                href="/dashboard-xy934k2_admin"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                ← Zurück
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Fixed Artikel Erstellung
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white shadow rounded-lg p-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Artikel Titel *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xl font-semibold"
              placeholder="Geben Sie einen aussagekräftigen Titel ein..."
              required
            />
          </div>

          {/* URL Slug */}
          <div className="bg-white shadow rounded-lg p-6">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              URL-Slug *
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">/artikel/</span>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ml-1"
                placeholder="artikel-url-slug"
                required
              />
            </div>
          </div>

          {/* Meta Description */}
          <div className="bg-white shadow rounded-lg p-6">
            <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
              Meta-Beschreibung (SEO) *
            </label>
            <textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              rows={3}
              maxLength={160}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Eine kurze, ansprechende Beschreibung für Suchmaschinen und Social Media..."
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.meta_description.length}/160 Zeichen
            </p>
          </div>

          {/* Content Editor */}
          <div className="bg-white shadow rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Artikel Inhalt (HTML) *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full h-96 p-4 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Fügen Sie hier Ihren HTML-Artikel-Inhalt ein..."
              required
            />
          </div>

          {/* Category */}
          <div className="bg-white shadow rounded-lg p-6">
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
              Kategorie auswählen *
            </label>
            <select
              id="category_id"
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Kategorie wählen...</option>
              <option value="1">Technologie</option>
              <option value="2">Gesundheit</option>
              <option value="3">Wissenschaft</option>
              <option value="4">Business</option>
              <option value="5">Lifestyle</option>
            </select>
          </div>

          {/* Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Entwurf</option>
              <option value="published">Veröffentlicht</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="bg-white shadow rounded-lg p-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Wird erstellt...
                </div>
              ) : (
                'Artikel erstellen'
              )}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`rounded-lg p-4 ${message.startsWith('✅') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}