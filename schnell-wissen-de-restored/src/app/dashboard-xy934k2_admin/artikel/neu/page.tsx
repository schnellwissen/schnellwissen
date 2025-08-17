'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Upload, X, Calendar, User, Clock, Tag, Code, Monitor } from 'lucide-react'
import Link from 'next/link'
import { getCategories, generateSlug, calculateReadingTime } from '@/lib/database'
import type { Category, ArticleFormData } from '@/lib/types'
import ImageUpload from '@/components/ui/ImageUpload'

// Raw HTML Editor Component
function RawHTMLEditor({ value, onChange, placeholder }: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  const [previewMode, setPreviewMode] = useState(false)
  const [sanitizedHTML, setSanitizedHTML] = useState('')

  useEffect(() => {
    // Simple client-side preview without sanitization - just show raw HTML
    setSanitizedHTML(value)
  }, [value])

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-300 px-4 py-2">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Raw HTML Editor</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            className={`px-3 py-1 text-sm rounded ${!previewMode ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Code className="w-4 h-4 inline mr-1" />
            HTML
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className={`px-3 py-1 text-sm rounded ${previewMode ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Monitor className="w-4 h-4 inline mr-1" />
            Vorschau
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[300px]">
        {!previewMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-96 p-4 border-0 resize-none font-mono text-sm focus:outline-none focus:ring-0"
            style={{ minHeight: '300px' }}
          />
        ) : (
          <div className="p-4 prose max-w-none">
            {sanitizedHTML ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
            ) : (
              <p className="text-gray-500 italic">Keine Inhalte zur Vorschau verfügbar</p>
            )}
          </div>
        )}
      </div>

      {/* Editor Footer */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-600">
        {!previewMode && (
          <div>
            Unterstützte HTML-Tags: p, br, strong, em, u, h1-h6, ul, ol, li, a, img, figure, figcaption, blockquote, table, section, div
          </div>
        )}
        {previewMode && (
          <div>
            ⚠️ Vorschau des HTML-Inhalts. Gefährliche Inhalte werden beim Speichern entfernt.
          </div>
        )}
      </div>
    </div>
  )
}

export default function NewArticle() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    category_id: '',
    image_url: '',
    status: 'draft'
  })

  const [autoSlug, setAutoSlug] = useState(true)

  useEffect(() => {
    checkAuth()
    loadCategories()
  }, [])

  useEffect(() => {
    if (autoSlug && formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }))
    }
  }, [formData.title, autoSlug])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify')
      if (!response.ok) {
        router.push('/dashboard-xy934k2_admin/login')
      }
    } catch (error) {
      router.push('/dashboard-xy934k2_admin/login')
    }
  }

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories()
      console.log('Loaded categories:', categoriesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.category_id) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.')
      return
    }

    if (formData.meta_description.length > 160) {
      alert('Die Meta-Beschreibung darf maximal 160 Zeichen lang sein.')
      return
    }

    setLoading(true)
    try {
      // Simple HTML sanitization by removing script tags and dangerous attributes
      const sanitizedContent = formData.content
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')

      const articleData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        content: sanitizedContent,
        reading_time: calculateReadingTime(sanitizedContent)
      }

      // Use the working API route instead of direct database call
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
        alert('Artikel wurde erfolgreich erstellt!')
        // Redirect to the created article for immediate viewing
        if (formData.status === 'published') {
          router.push(`/artikel/${result.slug}`)
        } else {
          // If it's a draft, go to dashboard
          router.push('/dashboard-xy934k2_admin')
        }
      } else {
        alert('Fehler beim Erstellen des Artikels: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating article:', error)
      alert('Fehler beim Erstellen des Artikels: ' + error)
    } finally {
      setLoading(false)
    }
  }


  const insertHtmlExample = () => {
    const htmlExample = `<section>
  <h2>Beispiel HTML Artikel</h2>
  <p>Sie können vollständige HTML-Artikel hier einfügen, inklusive:</p>
  <ul>
    <li>Überschriften (h1-h6)</li>
    <li>Formatierte Listen (ul, ol)</li>
    <li>Links mit <a href="https://example.com">href Attributen</a></li>
    <li>Bilder mit alt-Text</li>
  </ul>
  
  <figure>
    <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop" alt="Beispielbild" />
    <figcaption>Bildunterschrift für bessere Zugänglichkeit</figcaption>
  </figure>
  
  <blockquote>
    <p>Dies ist ein Zitat-Beispiel für wichtige Aussagen im Artikel.</p>
  </blockquote>
  
  <p><strong>Wichtiger Hinweis:</strong> Der HTML-Inhalt wird automatisch sanitized, um XSS-Angriffe zu verhindern.</p>
</section>`
    setFormData(prev => ({ ...prev, content: htmlExample }))
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
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Neuen Artikel erstellen
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Als Entwurf speichern
              </button>
              <button
                type="submit"
                form="article-form"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Wird gespeichert...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {formData.status === 'published' ? 'Artikel veröffentlichen' : 'Artikel speichern'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="article-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    URL-Slug *
                  </label>
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className={`text-xs px-2 py-1 rounded ${autoSlug ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {autoSlug ? 'Auto' : 'Manual'}
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm">/artikel/</span>
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => {
                      setAutoSlug(false)
                      setFormData(prev => ({ ...prev, slug: e.target.value }))
                    }}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ml-1"
                    placeholder="artikel-url-slug"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Die URL wird automatisch aus dem Titel generiert, kann aber manuell angepasst werden.
                </p>
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

              {/* Featured Image */}
              <div className="bg-white shadow rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Titelbild
                </label>
                
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  onRemove={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                  placeholder="Klicken Sie hier oder ziehen Sie ein Bild für den Artikel herein"
                />
              </div>

              {/* Content Editor */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Artikel Inhalt (Raw HTML) *
                  </label>
                  <button
                    type="button"
                    onClick={insertHtmlExample}
                    className="text-sm text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded"
                  >
                    HTML Beispiel laden
                  </button>
                </div>
                
                <RawHTMLEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Fügen Sie hier Ihren HTML-Artikel-Inhalt ein. Unterstützte Tags: p, br, strong, em, u, h1-h6, ul, ol, li, a, img, figure, figcaption, blockquote, table, section, div..."
                />
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <div className="text-yellow-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Sicherheitshinweis:</strong> HTML-Inhalte werden automatisch bereinigt. Script-Tags und gefährliche Attribute werden entfernt. 
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Veröffentlichung
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' | 'archived' }))}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">Entwurf</option>
                      <option value="published">Veröffentlicht</option>
                      <option value="archived">Archiviert</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <Tag className="w-5 h-5 inline mr-2" />
                  Kategorie
                </h3>
                
                <div>
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
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.category_id && (
                  <div className="mt-4">
                    {(() => {
                      const selectedCategory = categories.find(c => c.id === formData.category_id)
                      if (!selectedCategory) return null
                      
                      return (
                        <div className="p-3 rounded-lg" style={{ 
                          backgroundColor: selectedCategory.color + '20',
                          color: selectedCategory.color 
                        }}>
                          <div className="flex items-center">
                            <span className="font-medium">{selectedCategory.name}</span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <Eye className="w-5 h-5 inline mr-2" />
                  Vorschau
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Titel:</h4>
                    <p className="text-gray-600 text-sm">
                      {formData.title || 'Noch kein Titel eingegeben'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">URL:</h4>
                    <p className="text-gray-600 text-sm font-mono">
                      /artikel/{formData.slug || 'artikel-slug'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Meta-Beschreibung:</h4>
                    <p className="text-gray-600 text-sm">
                      {formData.meta_description ? formData.meta_description.substring(0, 100) + (formData.meta_description.length > 100 ? '...' : '') : 'Noch keine Beschreibung eingegeben'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Kategorie:</h4>
                    <p className="text-gray-600 text-sm">
                      {formData.category_id ? categories.find(c => c.id === formData.category_id)?.name : 'Keine Kategorie ausgewählt'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Lesezeit:</h4>
                    <p className="text-gray-600 text-sm">
                      {calculateReadingTime(formData.content)} Minuten (geschätzt)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}