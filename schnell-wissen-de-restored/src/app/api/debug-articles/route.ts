import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Fetching all articles...')
    
    // Read articles directly from file
    const articlesPath = path.join(process.cwd(), 'data', 'articles.json')
    const categoriesPath = path.join(process.cwd(), 'data', 'categories.json')
    
    let articles = []
    let categories = []
    
    if (fs.existsSync(articlesPath)) {
      const articlesData = fs.readFileSync(articlesPath, 'utf8')
      articles = JSON.parse(articlesData)
    }
    
    if (fs.existsSync(categoriesPath)) {
      const categoriesData = fs.readFileSync(categoriesPath, 'utf8')
      categories = JSON.parse(categoriesData)
    }
    
    // Add category objects to articles
    const articlesWithCategories = articles.map(article => ({
      ...article,
      category: categories.find(cat => cat.id === article.category_id)
    }))
    
    console.log('📊 Debug: Found articles:', {
      total: articlesWithCategories.length,
      titles: articlesWithCategories.map(a => ({ id: a.id, title: a.title, slug: a.slug }))
    })
    console.log('📊 Current time:', new Date().toISOString())
    
    // Return full article objects for client-side use
    return NextResponse.json(articlesWithCategories)
  } catch (error) {
    console.error('❌ Debug error:', error)
    return NextResponse.json([], { status: 500 })
  }
}