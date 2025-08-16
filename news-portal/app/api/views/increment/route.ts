import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath, revalidateTag } from 'next/cache';

// Service-Role Client für erhöhte Rechte
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Bot-Detection Patterns
const BOT_HINTS = [
  'bot', 'spider', 'crawler', 'preview',
  'facebookexternalhit', 'slurp', 'duckduckbot',
  'bingbot', 'baiduspider', 'yandexbot',
  'ahrefsbot', 'semrushbot', 'mj12bot',
  'dotbot', 'applebot', 'twitterbot',
  'linkedinbot', 'whatsapp', 'telegram',
  'discord', 'slack', 'pinterest',
  'lighthouse', 'gtmetrix', 'pingdom',
  'headless', 'phantom', 'selenium', 'puppeteer'
];

export async function POST(req: NextRequest) {
  try {
    const { articleId, fingerprint } = await req.json();

    // Validate input
    if (!articleId || typeof articleId !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'invalid-articleId' },
        { status: 400 }
      );
    }

    if (!fingerprint || typeof fingerprint !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'invalid-fingerprint' },
        { status: 400 }
      );
    }

    // Bot detection via User-Agent
    const userAgent = (req.headers.get('user-agent') || '').toLowerCase();
    const isBot = BOT_HINTS.some(hint => userAgent.includes(hint));
    
    if (isBot) {
      console.log('[Views API] Bot detected, skipping:', userAgent.substring(0, 50));
      return NextResponse.json({ 
        ok: true, 
        skipped: 'bot',
        views_total: 0,
        views_30d: 0
      });
    }

    // Server-side deduplication (12 hours)
    const dedupeKey = `${articleId}:${fingerprint}`;
    const { data: canCount, error: dedupeError } = await supabase.rpc('dedupe_key', {
      p_key: dedupeKey,
      p_ttl_minutes: process.env.NODE_ENV === 'development' ? 1 : 720 // 1 min in dev, 12h in prod
    });

    if (dedupeError) {
      console.warn('[Views API] Dedupe error:', dedupeError.message);
    }

    // Get current views (even if not counting)
    if (canCount === false) {
      // Already counted within TTL window - return current values
      const { data: currentViews } = await supabase.rpc('get_article_views', {
        p_article_id: articleId
      });

      return NextResponse.json({ 
        ok: true, 
        skipped: 'already-counted',
        views_total: currentViews?.[0]?.views_total || 0,
        views_30d: currentViews?.[0]?.views_30d || 0
      });
    }

    // Increment view atomically with server timezone
    const { data: viewData, error: incError } = await supabase.rpc('inc_view', {
      p_article_id: articleId,
      p_tz: 'Europe/Berlin'
    });

    if (incError) {
      console.error('[Views API] Increment error:', incError);
      return NextResponse.json(
        { ok: false, error: incError.message },
        { status: 500 }
      );
    }

    const views_total = viewData?.[0]?.views_total || 0;
    const views_30d = viewData?.[0]?.views_30d || 0;

    // Also update legacy views column for backward compatibility
    await supabase
      .from('articles')
      .update({ views: views_total })
      .eq('id', articleId);

    // Revalidate caches for immediate updates
    try {
      revalidateTag('views');       // Tag-based revalidation
      revalidateTag(`article-${articleId}`);
      revalidatePath('/');           // Homepage
      revalidatePath('/kategorie/[slug]', 'page'); // Category pages
      
      console.log('[Views API] Revalidated caches for article:', articleId);
    } catch (revalidateError) {
      console.warn('[Views API] Revalidation error:', revalidateError);
    }

    return NextResponse.json({ 
      ok: true,
      counted: true,
      views_total,
      views_30d
    });

  } catch (error: any) {
    console.error('[Views API] Unexpected error:', error);
    
    return NextResponse.json(
      { ok: false, error: 'internal-error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    service: 'view-tracking-v2',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
}