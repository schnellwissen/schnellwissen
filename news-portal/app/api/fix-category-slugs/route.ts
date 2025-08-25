import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const sb = await supabaseServer();
    
    // Check authentication
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await sb
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get all articles without category_slug
    const { data: articlesWithoutSlug, error: articlesError } = await sb
      .from('articles')
      .select('id, title, category_id')
      .or('category_slug.is.null,category_slug.eq.""');
    
    if (articlesError) {
      return NextResponse.json({ error: articlesError.message }, { status: 500 });
    }
    
    // Get all categories
    const { data: categories, error: categoriesError } = await sb
      .from('categories')
      .select('id, slug');
    
    if (categoriesError) {
      return NextResponse.json({ error: categoriesError.message }, { status: 500 });
    }
    
    // Create a map of category IDs to slugs
    const categoryMap = new Map(categories?.map(cat => [cat.id, cat.slug]) || []);
    
    // Update articles with missing category_slug
    const updates = [];
    for (const article of articlesWithoutSlug || []) {
      if (article.category_id) {
        const categorySlug = categoryMap.get(article.category_id);
        if (categorySlug) {
          const { error } = await sb
            .from('articles')
            .update({ category_slug: categorySlug })
            .eq('id', article.id);
          
          if (error) {
            console.error(`Failed to update article ${article.id}:`, error);
            updates.push({ id: article.id, title: article.title, status: 'error', error: error.message });
          } else {
            updates.push({ id: article.id, title: article.title, status: 'success', category_slug: categorySlug });
          }
        } else {
          updates.push({ id: article.id, title: article.title, status: 'no_category' });
        }
      }
    }
    
    return NextResponse.json({
      message: 'Category slugs update completed',
      totalArticles: articlesWithoutSlug?.length || 0,
      updates: updates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Fix category slugs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}