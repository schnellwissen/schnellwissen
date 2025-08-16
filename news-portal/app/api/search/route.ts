import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

// Rate limiting (optional)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 requests
const RATE_WINDOW = 5000; // per 5 seconds

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim();
    
    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    // Check rate limit
    const now = Date.now();
    const clientData = requestCounts.get(clientIp);
    if (clientData) {
      if (now < clientData.resetTime) {
        if (clientData.count >= RATE_LIMIT) {
          console.warn(`[search] Rate limit exceeded for ${clientIp}`);
          return NextResponse.json({ 
            items: [],
            query,
            error: 'rate_limit',
            suggestions: []
          }, { status: 200 }); // Return 200 to avoid red errors in UI
        }
        clientData.count++;
      } else {
        clientData.count = 1;
        clientData.resetTime = now + RATE_WINDOW;
      }
    } else {
      requestCounts.set(clientIp, { count: 1, resetTime: now + RATE_WINDOW });
    }
    
    // Clean up old entries periodically
    if (requestCounts.size > 1000) {
      for (const [ip, data] of requestCounts.entries()) {
        if (now > data.resetTime) {
          requestCounts.delete(ip);
        }
      }
    }
    
    // Return empty if no query
    if (!query) {
      return NextResponse.json({ 
        items: [],
        query: '',
        suggestions: []
      }, { status: 200 });
    }

    // Minimum query length
    if (query.length < 2) {
      return NextResponse.json({ 
        items: [],
        query,
        error: 'min_length',
        suggestions: []
      }, { status: 200 });
    }

    const sb = await supabaseServer();

    // Use advanced search function with fuzzy matching and ranking
    const { data: searchResults, error: searchError } = await sb
      .rpc('search_articles', { q_raw: query, limit_n: 24 });

    if (searchError) {
      console.error('[search] Advanced search error:', searchError.message, searchError.details);
      
      // Try fallback search
      const { data: fallbackResults, error: fallbackError } = await sb
        .rpc('search_articles_fallback', { q_raw: query, limit_n: 24 });
      
      if (fallbackError) {
        console.error('[search] Fallback search error:', fallbackError.message);
        // Never return 500 to frontend - return empty results instead
        return NextResponse.json({ 
          items: [],
          query,
          error: 'search_unavailable',
          suggestions: []
        }, { status: 200 });
      }

      return NextResponse.json({
        items: fallbackResults?.map((article: any) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          image: article.cover_image_url,
          category: article.category_slug,
          publishedAt: article.published_at,
          views: article.views,
          url: `/${article.category_slug}/${article.slug}?utm_source=search&utm_medium=internal&utm_campaign=search_results`
        })) || [],
        query,
        fallback: true,
        suggestions: []
      }, { status: 200 });
    }

    // Get search suggestions if no results
    let suggestions: string[] = [];
    if (!searchResults || searchResults.length === 0) {
      const { data: suggestionData } = await sb
        .rpc('get_search_suggestions');
      suggestions = suggestionData?.map((s: any) => s.tag) || [];
    }

    // Format results with scoring information
    const items = searchResults?.map((article: any) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      image: article.cover_image_url,
      category: article.category_slug,
      publishedAt: article.published_at,
      views: article.views,
      url: `/${article.category_slug}/${article.slug}?utm_source=search&utm_medium=internal&utm_campaign=search_results`,
      score: {
        prefix: article.prefix_match,
        trigram: article.trigram_score,
        fulltext: article.ft_score
      }
    })) || [];

    return NextResponse.json({
      items,
      query,
      suggestions,
      count: items.length
    }, { status: 200 });

  } catch (error) {
    console.error('[search] Unexpected error:', error instanceof Error ? error.message : error);
    // Never return 500 - always return 200 with empty results
    return NextResponse.json({ 
      items: [],
      query: searchParams.get('q') || '',
      error: 'search_error',
      suggestions: []
    }, { status: 200 });
  }
}