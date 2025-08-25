import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const sb = await supabaseServer();
    
    // Get all articles
    const { data: articles, error } = await sb
      .from('articles')
      .select('id, title, slug, category_slug, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Get categories
    const { data: categories } = await sb
      .from('categories')
      .select('id, name, slug');
    
    return NextResponse.json({
      articles: articles || [],
      categories: categories || [],
      articlesCount: articles?.length || 0,
      info: {
        message: 'Debug info for articles',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}