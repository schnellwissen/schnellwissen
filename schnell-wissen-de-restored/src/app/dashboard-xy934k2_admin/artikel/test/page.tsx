'use client'

import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { generateSlug, calculateReadingTime } from '@/lib/database'

// Simple test page for article creation without DOMPurify
export default function TestArticleCreation() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const testData = {
    title: 'Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet',
    meta_description: '4-Tage-Woche: Mehr Fokus, gleiche Leistung. Entdecke Modelle, Produktivitätskennzahlen, rechtliche Rahmenbedingungen und Tipps für die erfolgreiche Umsetzung.',
    category_id: '4',
    image_url: '/uploads/1754393386477-7dd1iovs79s.png',
    content: `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet</title>
</head>
<body>
<article>
  <header>
    <h1>Warum 4-Tage-Woche nicht gleich weniger Arbeit bedeutet</h1>
    <p>Vier Tage, gleiche Wirkung. Die 4 Tage Woche kann Leistung halten oder steigern, wenn Planung, Fokuszeiten und klare Ziele greifen.</p>
  </header>
  <section>
    <h2>Warum weniger Tage nicht weniger Arbeit sind</h2>
    <p>Leistung entsteht durch Fokus. Nicht durch Sitzzeit. Die 4 Tage Woche bündelt Arbeit in klare Blöcke.</p>
  </section>
</article>
</body>
</html>`
  }

  const handleTestCreation = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      // Simple HTML sanitization (same as implemented in the main page)
      const sanitizedContent = testData.content
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')

      const articleData = {
        ...testData,
        slug: generateSlug(testData.title),
        content: sanitizedContent,
        reading_time: calculateReadingTime(sanitizedContent),
        status: 'published'
      }

      // Use fetch to call the database function indirectly via a test API
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
        setMessage(`✅ Artikel erfolgreich erstellt! ID: ${result.id}`)
      } else {
        setMessage(`❌ Fehler: ${result.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage(`❌ Fehler beim Erstellen des Artikels: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                href="/dashboard-xy934k2_admin"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Test Artikel Erstellung
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Jest Worker Test</h2>
          <p className="text-gray-600 mb-6">
            Dieser Test erstellt einen Artikel ohne DOMPurify, um das Jest Worker Problem zu umgehen.
          </p>
          
          <div className="space-y-4">
            <div>
              <strong>Titel:</strong> {testData.title}
            </div>
            <div>
              <strong>Meta-Beschreibung:</strong> {testData.meta_description}
            </div>
            <div>
              <strong>Kategorie ID:</strong> {testData.category_id}
            </div>
            <div>
              <strong>Bildpfad:</strong> {testData.image_url}
            </div>
            <div>
              <strong>Content Länge:</strong> {testData.content.length} Zeichen
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleTestCreation}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Erstelle Artikel...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Test Artikel erstellen
                </>
              )}
            </button>
          </div>

          {message && (
            <div className="mt-4 p-4 rounded-lg bg-gray-50 border">
              <p className="text-sm">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}