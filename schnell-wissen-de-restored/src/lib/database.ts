import { supabase } from './supabase'
import { Article, Category, ArticleFilters, PaginatedResponse } from './types'

// Import server-side storage functions conditionally
let serverStorage: any = null
if (typeof window === 'undefined') {
  // Server-side only
  serverStorage = require('./server-storage')
}


// Categories CRUD operations
export async function getCategories(): Promise<Category[]> {
  // For client-side, use the fallback data directly
  if (typeof window !== 'undefined') {
    // Client-side: return default categories
    return [
      {
        id: "1",
        name: "Technologie",
        slug: "technologie",
        color: "#2563eb",
        description: "Artikel über Technologie und Innovation",
        created_at: "2025-08-05T21:00:37.929Z",
        updated_at: "2025-08-05T21:00:37.929Z"
      },
      {
        id: "2",
        name: "Gesundheit",
        slug: "gesundheit",
        color: "#10b981",
        description: "Gesundheitstipps und medizinische Erkenntnisse",
        created_at: "2025-08-05T21:00:37.929Z",
        updated_at: "2025-08-05T21:00:37.929Z"
      },
      {
        id: "3",
        name: "Wissenschaft",
        slug: "wissenschaft",
        color: "#8b5cf6",
        description: "Wissenschaftliche Entdeckungen und Forschung",
        created_at: "2025-08-05T21:00:37.929Z",
        updated_at: "2025-08-05T21:00:37.929Z"
      },
      {
        id: "4",
        name: "Business",
        slug: "business",
        color: "#f59e0b",
        description: "Business-Tipps und Karriereratschläge",
        created_at: "2025-08-05T21:00:37.929Z",
        updated_at: "2025-08-05T21:00:37.929Z"
      },
      {
        id: "5",
        name: "Lifestyle",
        slug: "lifestyle",
        color: "#ef4444",
        description: "Lifestyle und persönliche Entwicklung",
        created_at: "2025-08-05T21:00:37.929Z",
        updated_at: "2025-08-05T21:00:37.929Z"
      }
    ]
  }
  
  if (!supabase) {
    return serverStorage ? serverStorage.readCategoriesFromFile() : []
  }
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return serverStorage ? serverStorage.readCategoriesFromFile() : []
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (!supabase) {
    const categories = serverStorage ? serverStorage.readCategoriesFromFile() : []
    return categories.find(cat => cat.id === id) || null
  }
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching category:', error)
    const categories = serverStorage ? serverStorage.readCategoriesFromFile() : []
    return categories.find(cat => cat.id === id) || null
  }
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
  if (!supabase) {
    const categories = serverStorage ? serverStorage.readCategoriesFromFile() : []
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const updatedCategories = [...categories, newCategory]
    if (serverStorage) serverStorage.writeCategoriestoFile(updatedCategories)
    return newCategory
  }
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating category:', error)
    return null
  }
}

// Articles CRUD operations
export async function getArticles(filters: ArticleFilters = {}): Promise<PaginatedResponse<Article>> {
  // For client-side, read from the JSON file through an API endpoint
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/debug-articles')
      if (response.ok) {
        const articles = await response.json()
        return {
          data: articles,
          total: articles.length,
          page: 1,
          pageSize: articles.length
        }
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
    return { data: [], total: 0, page: 1, pageSize: 10 }
  }
  
  if (!supabase) {
    let filteredArticles = serverStorage ? serverStorage.readArticlesFromFile() : []
    
    // Apply filters
    if (filters.status) {
      filteredArticles = filteredArticles.filter(article => article.status === filters.status)
    }
    if (filters.category_id) {
      filteredArticles = filteredArticles.filter(article => article.category_id === filters.category_id)
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm)
      )
    }
    
    // Apply sorting
    const sortField = filters.sort || 'created_at'
    const sortOrder = filters.order || 'desc'
    filteredArticles.sort((a, b) => {
      const aValue = a[sortField as keyof Article]
      const bValue = b[sortField as keyof Article]
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    // Apply pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)
    
    return {
      data: paginatedArticles,
      total: filteredArticles.length,
      page,
      limit,
      totalPages: Math.ceil(filteredArticles.length / limit)
    }
  }
  
  try {
    let query = supabase
      .from('articles')
      .select(`
        *,
        category:categories(*)
      `)
    
    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id)
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
    }
    
    // Apply sorting
    const sortField = filters.sort || 'created_at'
    const sortOrder = filters.order || 'desc'
    query = query.order(sortField, { ascending: sortOrder === 'asc' })
    
    // Apply pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit - 1
    
    const { data, error, count } = await query
      .range(startIndex, endIndex)
      .returns<Article>()
    
    if (error) throw error
    
    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    return getArticles(filters) // Fallback to mock data
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (!supabase) {
    const articles = readArticlesFromFile()
    return articles.find(article => article.id === id) || null
  }
  
  try {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching article:', error)
    const articles = readArticlesFromFile()
    return articles.find(article => article.id === id) || null
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // For client-side, fetch from API
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/debug-articles')
      if (response.ok) {
        const articles = await response.json()
        const article = articles.find((a: Article) => a.slug === slug)
        return article || null
      }
    } catch (error) {
      console.error('Error fetching article by slug:', error)
    }
    return null
  }
  
  if (!supabase) {
    const articles = serverStorage ? serverStorage.readArticlesFromFile() : []
    return articles.find(article => article.slug === slug) || null
  }
  
  try {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching article by slug:', error)
    const articles = serverStorage ? serverStorage.readArticlesFromFile() : []
    return articles.find(article => article.slug === slug) || null
  }
}

export async function createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'like_count' | 'category'>): Promise<Article | null> {
  if (!supabase) {
    const categories = serverStorage ? serverStorage.readCategoriesFromFile() : []
    const existingArticles = serverStorage ? serverStorage.readArticlesFromFile() : []
    
    // Ensure HTML content is properly preserved
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      view_count: 0,
      like_count: 0,
      category: categories.find(cat => cat.id === article.category_id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Insert at the beginning of the array for latest-first ordering
    const updatedArticles = [newArticle, ...existingArticles]
    if (serverStorage) serverStorage.writeArticlesToFile(updatedArticles)
    
    // Log the creation for debugging
    console.log('✅ Created new article:', {
      id: newArticle.id,
      title: newArticle.title,
      slug: newArticle.slug,
      contentLength: newArticle.content.length,
      status: newArticle.status
    })
    
    return newArticle
  }
  
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        ...article,
        view_count: 0,
        like_count: 0
      }])
      .select(`
        *,
        category:categories(*)
      `)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating article:', error)
    return null
  }
}

export async function updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'created_at' | 'category'>>): Promise<Article | null> {
  if (!supabase) {
    const articles = readArticlesFromFile()
    const categories = readCategoriesFromFile()
    const articleIndex = articles.findIndex(article => article.id === id)
    if (articleIndex === -1) return null
    
    const updatedArticle = {
      ...articles[articleIndex],
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    // Re-attach category object if category_id was updated
    if (updates.category_id) {
      updatedArticle.category = categories.find(cat => cat.id === updates.category_id)
    }
    
    articles[articleIndex] = updatedArticle
    writeArticlesToFile(articles)
    return updatedArticle
  }
  
  try {
    const { data, error } = await supabase
      .from('articles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating article:', error)
    return null
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  if (!supabase) {
    const articles = readArticlesFromFile()
    const articleIndex = articles.findIndex(article => article.id === id)
    if (articleIndex === -1) return false
    
    articles.splice(articleIndex, 1)
    writeArticlesToFile(articles)
    return true
  }
  
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting article:', error)
    return false
  }
}

// Utility functions
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äöüß]/g, match => {
      const replacements: { [key: string]: string } = {
        'ä': 'ae',
        'ö': 'oe',
        'ü': 'ue',
        'ß': 'ss'
      }
      return replacements[match]
    })
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}