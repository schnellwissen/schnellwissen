'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Eye, Upload, X, Calendar, User, Clock, Tag } from 'lucide-react'
import Link from 'next/link'
import { getArticleById, updateArticle, getCategories, uploadFile, Category, Article } from '@/lib/api'
import RichTextEditor from '@/components/ui/RichTextEditor'

export default function EditArticle() {
  const router = useRouter()
  const params = useParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    readTime: 5,
    image: '',
    status: 'draft' as 'published' | 'draft' | 'archived'
  })

  useEffect(() => {
    loadArticle()
    loadCategories()
  }, [params.id])

  const loadArticle = async () => {
    try {
      setInitialLoading(true)
      const article = await getArticleById(params.id as string)
      if (article) {
        setFormData({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          author: article.author,
          readTime: article.readTime,
          image: article.image || '',
          status: article.status
        })
      } else {
        alert('Artikel nicht gefunden')
        router.push('/dashboard-xy934k2_admin')
      }
    } catch (error) {
      console.error('Error loading article:', error)
      alert('Fehler beim Laden des Artikels')
    } finally {
      setInitialLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.author) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.')
      return
    }

    setLoading(true)
    try {
      await updateArticle(params.id as string, formData)
      
      alert('Artikel wurde erfolgreich aktualisiert!')
      router.push('/dashboard-xy934k2_admin')
    } catch (error) {
      console.error('Error updating article:', error)
      alert('Fehler beim Aktualisieren des Artikels')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Bitte wählen Sie eine Bilddatei aus.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Die Datei ist zu groß. Maximale Größe: 5MB')
      return
    }

    setImageUploading(true)
    try {
      const imageUrl = await uploadFile(file, 'article-images')
      setFormData(prev => ({ ...prev, image: imageUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Fehler beim Hochladen des Bildes')
    } finally {
      setImageUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImageUpload(files[0])
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Artikel wird geladen...</p>
        </div>
      </div>
    )
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
                Artikel bearbeiten
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href={`/artikel/${params.id}`}
                className="btn btn-secondary"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vorschau
              </Link>
              <button
                type="submit"
                form="article-form"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Wird gespeichert...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Änderungen speichern
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
              <div className="card p-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Artikel Titel *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="form-input text-xl font-semibold"
                  placeholder="Geben Sie einen aussagekräftigen Titel ein..."
                  required
                />
              </div>

              {/* Excerpt */}
              <div className="card p-6">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Kurzbeschreibung *
                </label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="form-textarea"
                  placeholder="Eine kurze, ansprechende Beschreibung des Artikels..."
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  {formData.excerpt.length}/300 Zeichen
                </p>
              </div>

              {/* Featured Image */}
              <div className="card p-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Titelbild
                </label>
                
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Artikel Titelbild"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="upload-area"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    {imageUploading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner w-8 h-8 mr-3"></div>
                        <span>Bild wird hochgeladen...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-center">
                          Klicken Sie hier oder ziehen Sie ein Bild herein
                        </p>
                        <p className="text-sm text-gray-500 text-center mt-2">
                          PNG, JPG bis zu 5MB
                        </p>
                      </>
                    )}
                  </div>
                )}
                
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {/* Content Editor */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Artikel Inhalt *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const htmlExample = `<h2>Beispiel HTML Artikel</h2>
<p>Sie können komplette HTML-Artikel hier einfügen, inklusive:</p>
<ul>
  <li>Bilder mit &lt;img&gt; Tags</li>
  <li>Tabellen mit &lt;table&gt;</li>
  <li>Formatierte Listen</li>
  <li>Links und mehr</li>
</ul>
<figure>
  <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop" alt="Beispielbild" />
  <figcaption>Bildunterschrift</figcaption>
</figure>`
                      setFormData(prev => ({ ...prev, content: htmlExample }))
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded"
                  >
                    HTML Beispiel laden
                  </button>
                </div>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Schreiben Sie hier Ihren Artikel oder wechseln Sie zum HTML-Modus für erweiterte Formatierung..."
                />
                <div className="mt-3 text-xs text-gray-500">
                  <strong>Tipp:</strong> Klicken Sie auf "HTML" im Editor, um komplette HTML-Artikel mit Bildern, Tabellen und erweiterten Formatierungen einzufügen.
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="card p-6">
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
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="form-select"
                    >
                      <option value="draft">Entwurf</option>
                      <option value="published">Veröffentlicht</option>
                      <option value="archived">Archiviert</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Autor *
                    </label>
                    <input
                      type="text"
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      className="form-input"
                      placeholder="Autor Name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Lesezeit (Minuten)
                    </label>
                    <input
                      type="number"
                      id="readTime"
                      min="1"
                      max="60"
                      value={formData.readTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <Tag className="w-5 h-5 inline mr-2" />
                  Kategorie
                </h3>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Kategorie auswählen *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="form-select"
                    required
                  >
                    <option value="">Kategorie wählen...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.category && (
                  <div className="mt-4 p-3 rounded-lg" style={{ 
                    backgroundColor: categories.find(c => c.name === formData.category)?.color + '20',
                    color: categories.find(c => c.name === formData.category)?.color 
                  }}>
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {categories.find(c => c.name === formData.category)?.icon}
                      </span>
                      <span className="font-medium">{formData.category}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="card p-6">
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
                    <h4 className="font-semibold text-gray-900 text-sm">Beschreibung:</h4>
                    <p className="text-gray-600 text-sm">
                      {formData.excerpt ? formData.excerpt.substring(0, 100) + '...' : 'Noch keine Beschreibung eingegeben'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Kategorie:</h4>
                    <p className="text-gray-600 text-sm">
                      {formData.category || 'Keine Kategorie ausgewählt'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Status:</h4>
                    <p className="text-gray-600 text-sm">
                      {formData.status === 'published' ? 'Veröffentlicht' : 
                       formData.status === 'draft' ? 'Entwurf' : 'Archiviert'}
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