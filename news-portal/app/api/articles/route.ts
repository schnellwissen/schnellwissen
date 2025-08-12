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

    // Insert article
    const { data, error } = await sb
      .from('articles')
      .insert({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        category_id: body.category_id,
        cover_image_url: body.cover_image_url,
        content: body.content,
        status: body.status || 'published',
        created_at: new Date().toISOString(),
        published_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}