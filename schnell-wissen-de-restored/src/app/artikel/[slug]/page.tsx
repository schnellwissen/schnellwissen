'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { Calendar, Clock, Eye, Heart, ArrowLeft, Share2, Tag } from 'lucide-react'
import Link from 'next/link'
import { getArticleBySlug, getCategories } from '@/lib/database'
import type { Article, Category } from '@/lib/types'
import AdminActions from '@/components/AdminActions'

export default function ArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [article, setArticle] = useState<Article | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadArticle()
  }, [slug])

  const loadArticle = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading article with slug:', slug)
      
      const [articleData, categoriesData] = await Promise.all([
        getArticleBySlug(slug),
        getCategories()
      ])
      
      console.log('Article data received:', articleData)
      
      if (!articleData) {
        console.log('Article not found')
        setError('Artikel nicht gefunden')
        return
      }

      if (articleData.status !== 'published') {
        console.log('Article not published, status:', articleData.status)
        setError('Artikel ist nicht veröffentlicht')
        return
      }
      
      setArticle(articleData)
      setCategories(categoriesData)
      
    } catch (error) {
      console.error('Error loading article:', error)
      setError('Fehler beim Laden des Artikels: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.meta_description,
          url: window.location.href,
        })
      } catch (error) {
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link wurde in die Zwischenablage kopiert!')
    }).catch(() => {
      alert('Link konnte nicht kopiert werden.')
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Artikel wird geladen...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Fehler</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Zur Startseite
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50"
            >
              Neu laden
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel nicht gefunden</h1>
          <p className="text-gray-600 mb-4">Der angeforderte Artikel existiert nicht oder wurde entfernt.</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Zur Startseite
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Zurück zur Startseite
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Teilen
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <article className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Featured Image */}
          {article.image_url && (
            <div className="aspect-video w-full">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Category Badge */}
            {article.category && (
              <div className="mb-4">
                <span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: article.category.color + '20', 
                    color: article.category.color 
                  }}
                >
                  <Tag className="w-4 h-4 mr-1" />
                  {article.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta Description */}
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.meta_description}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-between py-4 border-t border-b border-gray-200 mb-8">
              <div className="flex items-center space-x-6 mb-2 sm:mb-0">
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {new Date(article.created_at).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{article.reading_time} Min. Lesezeit</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-sm">{article.view_count.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-sm">{article.like_count}</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:text-gray-600 prose-blockquote:border-blue-500 prose-img:rounded-lg prose-img:shadow-md">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleShare}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Artikel teilen
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  Letzte Aktualisierung: {new Date(article.updated_at).toLocaleDateString('de-DE')}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Weitere Artikel</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Weitere Artikel werden hier angezeigt, sobald mehr Inhalte verfügbar sind.</p>
            <Link 
              href="/"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Zur Startseite
            </Link>
          </div>
        </section>
      </main>

      {/* Admin Actions - Only visible to logged-in admins */}
      <AdminActions 
        articleId={article.id} 
        articleSlug={article.slug} 
      />
    </div>
  )
}