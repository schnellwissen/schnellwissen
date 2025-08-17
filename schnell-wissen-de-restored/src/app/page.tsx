'use client'

import { useEffect, useState } from 'react'
import { Star, Clock, TrendingUp, Search, Menu, X, Eye, Heart, Tag } from 'lucide-react'
import Link from 'next/link'
import { getArticles, getCategories } from '@/lib/database'
import type { Article, Category } from '@/lib/types'
import AdminActions, { InlineAdminActions } from '@/components/AdminActions'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [articlesResponse, categoriesData] = await Promise.all([
        getArticles({ limit: 20, status: 'published' }),
        getCategories()
      ])
      
      setArticles(articlesResponse.data)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.meta_description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === '' || article.category?.name === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const topArticles = articles.sort((a, b) => b.view_count - a.view_count).slice(0, 3)
  const recentArticles = articles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-8">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                SchnellWissen
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 font-medium">Home</Link>
              <a href="#kategorien" className="text-gray-700 hover:text-blue-600 font-medium">Kategorien</a>
              <a href="#artikel" className="text-gray-700 hover:text-blue-600 font-medium">Artikel</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-blue-600 transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Willkommen bei <span className="text-blue-200">SchnellWissen</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Deine tägliche Quelle für interessante Artikel zu Technologie, Wissenschaft, 
              Gesundheit und vielem mehr. Schnell informiert, fundiert erklärt.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Nach Artikeln suchen..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Alle Kategorien</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="text-sm text-gray-600">
                  {filteredArticles.length} Artikel gefunden
                </div>
              </div>

              {/* Top 3 Articles */}
              {topArticles.length > 0 && (
                <section id="artikel">
                  <div className="flex items-center mb-6">
                    <Star className="w-6 h-6 text-yellow-500 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900">Top 3 Artikel des Monats</h2>
                  </div>
                  <div className="space-y-4">
                    {topArticles.map((article, index) => (
                      <article key={article.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          {article.image_url && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={article.image_url} 
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                              {article.category && (
                                <span 
                                  className="px-2 py-1 rounded-full text-xs font-medium"
                                  style={{ 
                                    backgroundColor: article.category.color + '20', 
                                    color: article.category.color 
                                  }}
                                >
                                  {article.category.name}
                                </span>
                              )}
                              <span>•</span>
                              <span>{article.reading_time} Min. Lesezeit</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                            <p className="text-gray-600 mb-4">{article.meta_description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  <span>{article.view_count.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center">
                                  <Heart className="w-4 h-4 mr-1" />
                                  <span>{article.like_count}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <InlineAdminActions articleId={article.id} />
                                <Link href={`/artikel/${article.slug}`} className="text-blue-600 hover:text-blue-700 font-medium">
                                  Weiterlesen →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Recent Articles */}
              <section>
                <div className="flex items-center mb-6">
                  <Clock className="w-6 h-6 text-blue-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">Neueste Artikel</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.slice(0, 6).map((article) => (
                    <article key={article.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      {article.image_url && (
                        <div className="h-48">
                          <img 
                            src={article.image_url} 
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                          {article.category && (
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: article.category.color + '20', 
                                color: article.category.color 
                              }}
                            >
                              {article.category.name}
                            </span>
                          )}
                          <span>•</span>
                          <span>{article.reading_time} Min.</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{article.meta_description.substring(0, 100)}...</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              <span>{article.view_count}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              <span>{article.like_count}</span>
                            </div>
                          </div>
                          <Link href={`/artikel/${article.slug}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            Weiterlesen →
                          </Link>
                        </div>
                        <div className="mt-3">
                          <InlineAdminActions articleId={article.id} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="text-lg mb-2">Keine Artikel gefunden</p>
                      <p>Versuchen Sie eine andere Suche oder Kategorie.</p>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Categories */}
              <div id="kategorien" className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Kategorien</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
                      className={`flex items-center justify-between w-full text-left p-2 rounded-lg transition ${
                        selectedCategory === category.name 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-2" />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {articles.filter(a => a.category?.id === category.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  <TrendingUp className="w-5 h-5 inline mr-2 text-green-500" />
                  Trending
                </h3>
                <div className="space-y-4">
                  {topArticles.slice(0, 3).map((article) => (
                    <article key={`trending-${article.id}`} className="border-b border-gray-100 pb-4 last:border-0">
                      <Link href={`/artikel/${article.slug}`}>
                        <h4 className="text-sm font-medium text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {article.view_count.toLocaleString()} Aufrufe • vor {Math.floor((Date.now() - new Date(article.created_at).getTime()) / (1000 * 60 * 60))} Stunden
                        </p>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>

              {/* Admin Dashboard Access */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Admin Dashboard</h3>
                <p className="text-blue-100 text-sm mb-4">Verwalten Sie Artikel, Kategorien und Benutzer</p>
                <Link 
                  href="/dashboard-xy934k2_admin"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition inline-block"
                >
                  Zum Dashboard
                </Link>
              </div>

              {/* Statistics */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Statistiken</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gesamt Artikel:</span>
                    <span className="font-semibold">{articles.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kategorien:</span>
                    <span className="font-semibold">{categories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gesamt Aufrufe:</span>
                    <span className="font-semibold">{articles.reduce((sum, article) => sum + article.view_count, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gesamt Likes:</span>
                    <span className="font-semibold">{articles.reduce((sum, article) => sum + article.like_count, 0)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SchnellWissen</h3>
              <p className="text-gray-400">Deine tägliche Quelle für interessante und fundierte Artikel.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kategorien</h4>
              <ul className="space-y-2 text-gray-400">
                {categories.slice(0, 4).map(category => (
                  <li key={category.id}>
                    <button 
                      onClick={() => setSelectedCategory(category.name)}
                      className="hover:text-white transition"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Impressum</a></li>
                <li><a href="#" className="hover:text-white transition">Datenschutz</a></li>
                <li><a href="#" className="hover:text-white transition">AGB</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Über uns</a></li>
                <li><a href="#" className="hover:text-white transition">Kontakt</a></li>
                <li><a href="#" className="hover:text-white transition">Newsletter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SchnellWissen. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-96" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Artikel durchsuchen</h3>
                <button onClick={() => setIsSearchOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Suchbegriff eingeben..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
                autoFocus
              />
              <div className="max-h-64 overflow-y-auto">
                {filteredArticles.slice(0, 5).map(article => (
                  <Link
                    key={article.id}
                    href={`/artikel/${article.slug}`}
                    className="block p-3 hover:bg-gray-50 rounded-lg transition"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <h4 className="font-medium text-gray-900">{article.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{article.meta_description.substring(0, 100)}...</p>
                  </Link>
                ))}
                {filteredArticles.length === 0 && searchQuery && (
                  <p className="text-gray-500 text-center py-4">Keine Artikel gefunden</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Actions - Only visible to logged-in admins */}
      <AdminActions />
    </div>
  )
}