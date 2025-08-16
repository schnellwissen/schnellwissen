import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID format' },
        { status: 400 }
      );
    }

    // Call the related_articles function
    const { data: relatedArticles, error } = await supabase
      .rpc('related_articles', {
        article_id: id,
        max_results: 3
      });

    if (error) {
      console.error('Error fetching related articles:', error);
      return NextResponse.json(
        { error: 'Failed to fetch related articles' },
        { status: 500 }
      );
    }

    // If we have less than 3 articles, fetch more from the same category
    if (relatedArticles && relatedArticles.length < 3) {
      // Get the current article's category
      const { data: currentArticle } = await supabase
        .from('articles')
        .select('category_slug')
        .eq('id', id)
        .single();

      if (currentArticle?.category_slug) {
        const existingIds = relatedArticles.map((a: any) => a.id);
        
        // Fetch additional articles from the same category
        const { data: categoryArticles } = await supabase
          .from('articles')
          .select('id, slug, title, cover_image_url, category_slug')
          .eq('category_slug', currentArticle.category_slug)
          .neq('id', id)
          .not('id', 'in', `(${existingIds.join(',')})`)
          .order('published_at', { ascending: false })
          .limit(3 - relatedArticles.length);

        if (categoryArticles) {
          relatedArticles.push(...categoryArticles);
        }
      }
    }

    // Format the response
    const formattedArticles = relatedArticles?.map((article: any) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      cover_image_url: article.cover_image_url,
      category_slug: article.category_slug
    })) || [];

    return NextResponse.json(formattedArticles);
    
  } catch (error) {
    console.error('Unexpected error in related articles API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}