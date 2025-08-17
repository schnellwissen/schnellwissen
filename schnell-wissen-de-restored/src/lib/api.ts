import { supabase, isSupabaseConfigured } from './supabase'

// Types
export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  readTime: number
  views: number
  likes: number
  comments: number
  image?: string
  status: 'published' | 'draft' | 'archived'
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  color: string
  icon: string
  count: number
  created_at?: string
}

// Mock data for fallback
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Die Zukunft der Künstlichen Intelligenz in 2024',
    excerpt: 'Entdecken Sie die neuesten Entwicklungen in der KI-Technologie und wie sie unser Leben verändern wird. Von ChatGPT bis zu autonomen Systemen.',
    content: `
      <h2>Einführung in die KI-Entwicklung</h2>
      <p>Künstliche Intelligenz (KI) entwickelt sich rasant weiter und wird 2024 neue Meilensteine erreichen...</p>
      
      <h3>Hauptentwicklungen 2024</h3>
      <ul>
        <li><strong>Generative KI</strong>: ChatGPT und ähnliche Modelle werden noch leistungsfähiger</li>
        <li><strong>KI in der Medizin</strong>: Durchbrüche bei der Diagnose und Behandlung</li>
        <li><strong>Autonome Systeme</strong>: Selbstfahrende Autos erreichen neue Level</li>
      </ul>
    `,
    category: 'Technologie',
    author: 'Max Mustermann',
    date: '2024-01-15',
    readTime: 5,
    views: 2431,
    likes: 89,
    comments: 23,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    status: 'published'
  },
  {
    id: '2',
    title: 'Gesunde Ernährung im digitalen Zeitalter',
    excerpt: 'Wie Sie trotz Homeoffice und digitalem Stress eine gesunde Ernährung beibehalten können. Praktische Tipps für den Alltag.',
    content: `
      <h2>Gesund leben trotz Digitalisierung</h2>
      <p>Das digitale Zeitalter bringt viele Herausforderungen für eine gesunde Ernährung mit sich...</p>
      
      <h3>Die größten Herausforderungen</h3>
      <ul>
        <li><strong>Zeitmangel</strong>: Schnelle Snacks statt ausgewogener Mahlzeiten</li>
        <li><strong>Stress-Essen</strong>: Ungesunde Gewohnheiten bei hoher Arbeitsbelastung</li>
        <li><strong>Bewegungsmangel</strong>: Weniger Kalorienverbrauch bei gleicher Nahrungsaufnahme</li>
      </ul>
    `,
    category: 'Gesundheit',
    author: 'Dr. Sarah Weber',
    date: '2024-01-14',
    readTime: 7,
    views: 1876,
    likes: 76,
    comments: 31,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop',
    status: 'published'
  },
  {
    id: '3',
    title: 'Quantencomputing: Revolution der Rechenleistung',
    excerpt: 'Was Quantencomputer können und wie sie die Zukunft der Technologie beeinflussen werden. Ein Blick in die Zukunft.',
    content: `
      <h2>Was ist Quantencomputing?</h2>
      <p>Quantencomputer nutzen die Prinzipien der Quantenmechanik...</p>
      
      <h3>Grundlagen der Quantentechnologie</h3>
      <p>Im Gegensatz zu klassischen Bits verwenden Quantencomputer Qubits...</p>
    `,
    category: 'Wissenschaft',
    author: 'Prof. Michael Klein',
    date: '2024-01-13',
    readTime: 6,
    views: 1523,
    likes: 92,
    comments: 18,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
    status: 'published'
  },
  {
    id: '4',
    title: 'Remote Work: Tipps für mehr Produktivität',
    excerpt: 'Effektive Strategien für das Arbeiten von zu Hause. Wie Sie produktiv bleiben und Work-Life-Balance bewahren.',
    content: `
      <h2>Produktiv im Homeoffice</h2>
      <p>Remote Work ist zur neuen Normalität geworden...</p>
    `,
    category: 'Business',
    author: 'Lisa Schmidt',
    date: '2024-01-12',
    readTime: 4,
    views: 1334,
    likes: 64,
    comments: 27,
    image: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800&h=400&fit=crop',
    status: 'published'
  },
  {
    id: '5',
    title: 'Minimalismus: Weniger ist mehr',
    excerpt: 'Wie Sie mit weniger mehr Lebensqualität erreichen. Der Weg zu einem bewussteren Leben.',
    content: `
      <h2>Die Philosophie des Minimalismus</h2>
      <p>Minimalismus bedeutet mehr als nur weniger Besitz...</p>
    `,
    category: 'Lifestyle',
    author: 'Anna Müller',
    date: '2024-01-11',
    readTime: 3,
    views: 987,
    likes: 45,
    comments: 12,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
    status: 'published'
  },
  {
    id: '6',
    title: 'Effektive Lernmethoden für Erwachsene',
    excerpt: 'Wissenschaftlich bewährte Techniken für lebenslanges Lernen. Wie Sie auch im Erwachsenenalter neue Fähigkeiten entwickeln.',
    content: `
      <h2>Lernen im Erwachsenenalter</h2>
      <p>Erwachsene lernen anders als Kinder...</p>
    `,
    category: 'Bildung',
    author: 'Dr. Thomas Wagner',
    date: '2024-01-10',
    readTime: 8,
    views: 2156,
    likes: 118,
    comments: 35,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
    status: 'published'
  }
]

const mockCategories: Category[] = [
  { id: '1', name: 'Technologie', slug: 'technologie', color: '#3B82F6', icon: '💻', count: 42 },
  { id: '2', name: 'Gesundheit', slug: 'gesundheit', color: '#10B981', icon: '🏥', count: 38 },
  { id: '3', name: 'Wissenschaft', slug: 'wissenschaft', color: '#8B5CF6', icon: '🧬', count: 29 },
  { id: '4', name: 'Business', slug: 'business', color: '#F59E0B', icon: '💼', count: 24 },
  { id: '5', name: 'Lifestyle', slug: 'lifestyle', color: '#EF4444', icon: '🎨', count: 31 },
  { id: '6', name: 'Bildung', slug: 'bildung', color: '#06B6D4', icon: '📚', count: 27 }
]

// API Functions

// Articles
export async function getArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return mockArticles
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || mockArticles
  } catch (error) {
    console.error('Error fetching articles:', error)
    return mockArticles
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return mockArticles.find(article => article.id === id) || null
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching article:', error)
    return mockArticles.find(article => article.id === id) || null
  }
}

export async function createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article> {
  if (!isSupabaseConfigured() || !supabase) {
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return newArticle
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating article:', error)
    throw error
  }
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
  if (!isSupabaseConfigured() || !supabase) {
    const existingArticle = mockArticles.find(a => a.id === id)
    if (!existingArticle) throw new Error('Article not found')
    
    return {
      ...existingArticle,
      ...updates,
      updated_at: new Date().toISOString()
    }
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating article:', error)
    throw error
  }
}

export async function deleteArticle(id: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    return Promise.resolve()
  }

  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting article:', error)
    throw error
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return mockCategories
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || mockCategories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return mockCategories
  }
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  if (!isSupabaseConfigured() || !supabase) {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
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
    throw error
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  if (!isSupabaseConfigured() || !supabase) {
    const existingCategory = mockCategories.find(c => c.id === id)
    if (!existingCategory) throw new Error('Category not found')
    
    return {
      ...existingCategory,
      ...updates
    }
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    return Promise.resolve()
  }

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

// Statistics
export async function getStats() {
  const articles = await getArticles()
  const categories = await getCategories()
  
  return {
    totalArticles: articles.length,
    totalCategories: categories.length,
    totalViews: articles.reduce((sum, article) => sum + article.views, 0),
    totalLikes: articles.reduce((sum, article) => sum + article.likes, 0),
    publishedArticles: articles.filter(a => a.status === 'published').length,
    draftArticles: articles.filter(a => a.status === 'draft').length,
    archivedArticles: articles.filter(a => a.status === 'archived').length
  }
}

// Search
export async function searchArticles(query: string): Promise<Article[]> {
  const articles = await getArticles()
  
  if (!query.trim()) return articles
  
  const searchTerm = query.toLowerCase()
  return articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.excerpt.toLowerCase().includes(searchTerm) ||
    article.content.toLowerCase().includes(searchTerm) ||
    article.category.toLowerCase().includes(searchTerm) ||
    article.author.toLowerCase().includes(searchTerm)
  )
}

// File upload function
export async function uploadFile(file: File, bucket: string = 'images'): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    // Return a mock URL for development
    return `https://images.unsplash.com/photo-${Date.now()}?w=800&h=400&fit=crop`
  }

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${bucket}/${fileName}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}