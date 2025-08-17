'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit3, Trash2, Eye, Heart, Calendar, TrendingUp, BarChart3, PieChart, FileText, Settings, LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getArticles, getCategories, deleteArticle } from '@/lib/database'
import type { Article, Category } from '@/lib/types'

interface Stats {
  totalArticles: number
  totalCategories: number
  totalViews: number
  totalLikes: number
  publishedArticles: number
  draftArticles: number
  archivedArticles: number
}

interface AdminUser {
  username: string
  loginTime: number
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadData()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated) {
          setUser(data.user)
          return
        }
      }
      
      // If we get here, authentication failed
      console.log('Authentication failed, redirecting to login')
      router.push('/dashboard-xy934k2_admin/login')
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/dashboard-xy934k2_admin/login')
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [articlesResponse, categoriesData] = await Promise.all([
        getArticles({ limit: 50 }),
        getCategories()
      ])
      
      setArticles(articlesResponse.data)
      setCategories(categoriesData)
      
      // Calculate stats from articles data
      const stats: Stats = {
        totalArticles: articlesResponse.data.length,
        totalCategories: categoriesData.length,
        totalViews: articlesResponse.data.reduce((sum, article) => sum + article.view_count, 0),
        totalLikes: articlesResponse.data.reduce((sum, article) => sum + article.like_count, 0),
        publishedArticles: articlesResponse.data.filter(a => a.status === 'published').length,
        draftArticles: articlesResponse.data.filter(a => a.status === 'draft').length,
        archivedArticles: articlesResponse.data.filter(a => a.status === 'archived').length
      }
      setStats(stats)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Sind Sie sicher, dass Sie diesen Artikel löschen möchten?')) {
      try {
        const success = await deleteArticle(id)
        if (success) {
          setArticles(articles.filter(article => article.id !== id))
          // Update stats
          loadData()
        } else {
          alert('Fehler beim Löschen des Artikels')
        }
      } catch (error) {
        console.error('Error deleting article:', error)
        alert('Fehler beim Löschen des Artikels: ' + error)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/dashboard-xy934k2_admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/dashboard-xy934k2_admin/login')
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === '' || article.category?.name === selectedCategory
    const matchesStatus = selectedStatus === '' || article.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'published': return 'Veröffentlicht'
      case 'draft': return 'Entwurf'
      case 'archived': return 'Archiviert'
      default: return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard wird geladen...</p>
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
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 ml-2">
                Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Willkommen, {user?.username}
              </span>
              <Link href="/" className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Eye className="w-4 h-4 mr-2" />
                Website ansehen
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600"
                title="Abmelden"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-semibold">Menü</h2>
            <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-600">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <nav className="space-y-2">
              <Link href="/dashboard-xy934k2_admin" className="flex items-center px-3 py-2 text-gray-900 bg-blue-50 rounded-lg">
                <BarChart3 className="w-5 h-5 mr-3" />
                Übersicht
              </Link>
              <Link href="/dashboard-xy934k2_admin/artikel" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 mr-3" />
                Artikel verwalten
              </Link>
              <Link href="/dashboard-xy934k2_admin/artikel/neu" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                <Plus className="w-5 h-5 mr-3" />
                Neuer Artikel
              </Link>
              <Link href="/dashboard-xy934k2_admin/kategorien" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                <PieChart className="w-5 h-5 mr-3" />
                Kategorien
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-0">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Gesamt Artikel</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Eye className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Gesamt Aufrufe</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Heart className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Gesamt Likes</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <PieChart className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Kategorien</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard-xy934k2_admin/artikel/neu" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Neuer Artikel
              </Link>
              <Link href="/dashboard-xy934k2_admin/kategorien" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Plus className="w-4 h-4 mr-2" />
                Kategorien verwalten
              </Link>
              <button onClick={loadData} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <TrendingUp className="w-4 h-4 mr-2" />
                Daten aktualisieren
              </button>
            </div>
          </div>

          {/* Articles Management */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Artikel verwalten</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Artikel durchsuchen..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Alle Kategorien</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Alle Status</option>
                    <option value="published">Veröffentlicht</option>
                    <option value="draft">Entwurf</option>
                    <option value="archived">Archiviert</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artikel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statistiken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Datum
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {article.image_url && (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={article.image_url}
                                alt={article.title}
                              />
                            </div>
                          )}
                          <div className={article.image_url ? 'ml-4' : ''}>
                            <div className="text-sm font-medium text-gray-900">
                              {article.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {article.reading_time} Min. Lesezeit
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {article.category && (
                          <span 
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{ 
                              backgroundColor: article.category.color + '20', 
                              color: article.category.color 
                            }}
                          >
                            {article.category.name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(article.status)}`}>
                          {getStatusDisplay(article.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {article.view_count.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {article.like_count}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(article.created_at).toLocaleDateString('de-DE')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/artikel/${article.slug}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Artikel ansehen"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard-xy934k2_admin/artikel/${article.id}/bearbeiten`}
                            className="text-gray-600 hover:text-gray-900"
                            title="Artikel bearbeiten"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Artikel löschen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Keine Artikel gefunden
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || selectedCategory || selectedStatus
                    ? 'Ändern Sie Ihre Suchkriterien oder erstellen Sie einen neuen Artikel.'
                    : 'Erstellen Sie Ihren ersten Artikel.'}
                </p>
                <Link href="/dashboard-xy934k2_admin/artikel/neu" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Neuer Artikel
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}