'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getArticles } from '@/lib/database'
import type { Article } from '@/lib/types'

export default function TestArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const articlesResponse = await getArticles({ limit: 10 })
      setArticles(articlesResponse.data)
      console.log('Test articles loaded:', articlesResponse.data)
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading articles...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Articles</h1>
      <div className="space-y-4">
        {articles.map(article => (
          <div key={article.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-600 mb-2">ID: {article.id}</p>
            <p className="text-sm text-gray-600 mb-2">Slug: {article.slug}</p>
            <p className="text-sm text-gray-600 mb-4">Status: {article.status}</p>
            
            <div className="space-x-4">
              <Link 
                href={`/artikel/${article.slug}`}
                className="text-blue-600 hover:underline"
              >
                View Article (by slug)
              </Link>
              <Link 
                href={`/artikel/${article.id}`}
                className="text-green-600 hover:underline"
              >
                View Article (by ID)
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Direct Links Test:</h2>
        <div className="space-y-2">
          <Link href="/artikel/die-zukunft-der-kuenstlichen-intelligenz-in-2024" className="block text-blue-600 hover:underline">
            /artikel/die-zukunft-der-kuenstlichen-intelligenz-in-2024
          </Link>
          <Link href="/artikel/gesunde-ernaehrung-im-digitalen-zeitalter" className="block text-blue-600 hover:underline">
            /artikel/gesunde-ernaehrung-im-digitalen-zeitalter
          </Link>
          <Link href="/artikel/quantencomputing-revolution-der-rechenleistung" className="block text-blue-600 hover:underline">
            /artikel/quantencomputing-revolution-der-rechenleistung
          </Link>
        </div>
      </div>
    </div>
  )
}