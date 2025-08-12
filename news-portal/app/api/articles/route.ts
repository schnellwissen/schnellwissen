import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const sb = await supabaseServer();
    const body = await request.json();

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

    // Get category slug for the selected category
    let category_slug = body.category_slug;
    if (body.category_id && !category_slug) {
      const { data: category } = await sb
        .from('categories')
        .select('slug')
        .eq('id', body.category_id)
        .single();
      category_slug = category?.slug;
    }

    // Check if slug already exists globally and make it unique if needed
    let finalSlug = body.slug;
    const { data: existingArticles } = await sb
      .from('articles')
      .select('id')
      .eq('slug', finalSlug);
    
    if (existingArticles && existingArticles.length > 0) {
      // Add a number to make it unique
      finalSlug = `${body.slug}-${existingArticles.length + 1}`;
    }

    // Prepare article data - be flexible with column names
    const articleData: any = {
      title: body.title,
      slug: finalSlug,
      excerpt: body.excerpt,
      category_id: body.category_id,
      category_slug: category_slug,
      cover_image_url: body.cover_image_url,
      status: body.status || 'published',
      created_at: new Date().toISOString(),
      published_at: new Date().toISOString()
    };

    // Add content with correct column name
    if (body.content) {
      articleData.content_html = body.content;
    }

    // Insert article
    const { data, error } = await sb
      .from('articles')
      .insert(articleData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      // Handle specific database errors
      if (error.code === '23505') {
        // Duplicate key error
        if (error.message.includes('slug')) {
          return NextResponse.json({ 
            error: 'Ein Artikel mit diesem Slug existiert bereits. Bitte ändern Sie den Titel oder Slug.' 
          }, { status: 400 });
        }
        return NextResponse.json({ 
          error: 'Dieser Artikel existiert bereits.' 
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: error.message || 'Datenbankfehler beim Speichern' 
      }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}