import fs from 'fs'
import path from 'path'
import { Article, Category } from './types'

// File paths for JSON storage
const articlesPath = path.join(process.cwd(), 'data', 'articles.json')
const categoriesPath = path.join(process.cwd(), 'data', 'categories.json')

// Helper functions for JSON file operations
export function readArticlesFromFile(): Article[] {
  try {
    if (fs.existsSync(articlesPath)) {
      const data = fs.readFileSync(articlesPath, 'utf8')
      const articles = JSON.parse(data)
      // Add category objects to articles
      const categories = readCategoriesFromFile()
      return articles.map((article: any) => ({
        ...article,
        category: categories.find(cat => cat.id === article.category_id)
      }))
    }
  } catch (error) {
    console.error('Error reading articles from file:', error)
  }
  return []
}

export function writeArticlesToFile(articles: Article[]): void {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(articlesPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    // Remove category objects before saving (only store category_id)
    const articlesForStorage = articles.map(({ category, ...article }) => article)
    fs.writeFileSync(articlesPath, JSON.stringify(articlesForStorage, null, 2))
  } catch (error) {
    console.error('Error writing articles to file:', error)
  }
}

export function readCategoriesFromFile(): Category[] {
  try {
    if (fs.existsSync(categoriesPath)) {
      const data = fs.readFileSync(categoriesPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading categories from file:', error)
  }
  return []
}

export function writeCategoriestoFile(categories: Category[]): void {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(categoriesPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2))
  } catch (error) {
    console.error('Error writing categories to file:', error)
  }
}