import { NextRequest, NextResponse } from 'next/server'
import { createArticle } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const articleData = await request.json()
    
    console.log('Testing article creation with data:', {
      title: articleData.title,
      slug: articleData.slug,
      contentLength: articleData.content?.length || 0,
      status: articleData.status
    })

    // Attempt to create the article
    const result = await createArticle(articleData)
    
    if (result) {
      console.log('✅ Article created successfully:', result.id)
      return NextResponse.json({ 
        success: true, 
        id: result.id,
        slug: result.slug,
        message: 'Article created successfully'
      })
    } else {
      console.log('❌ Article creation failed')
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create article' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ Error in test-article-creation API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}