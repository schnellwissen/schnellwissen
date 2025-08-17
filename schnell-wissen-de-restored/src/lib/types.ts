// Database types for Supabase
export interface Category {
  id: string
  name: string
  slug: string
  color: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string // Raw HTML content
  meta_description: string
  category_id: string
  category?: Category // Joined category data
  image_url?: string
  status: 'draft' | 'published' | 'archived'
  view_count: number
  like_count: number
  reading_time: number // in minutes
  created_at: string
  updated_at: string
}

// Frontend types
export interface ArticleFormData {
  title: string
  slug: string
  content: string
  meta_description: string
  category_id: string
  image_url?: string
  status: 'draft' | 'published' | 'archived'
}

export interface CategoryFormData {
  name: string
  slug: string
  color: string
  description?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Search and filter types
export interface ArticleFilters {
  status?: 'draft' | 'published' | 'archived'
  category_id?: string
  search?: string
  sort?: 'created_at' | 'updated_at' | 'title' | 'view_count'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface MediaFile {
  id: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  url: string
  created_at: string
}