import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { slugify } from '@/lib/slugify';
import ArticleViewTracker from './ArticleViewTracker';
import ShareBar from '@/components/ShareBar';
import ArticleMeta from '@/components/ArticleMeta';
import RelatedSidebar from '@/components/RelatedSidebar';
import BookmarkButton from '@/components/BookmarkButton';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface ArticlePageProps {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const sb = await supabaseServer();
  
  const normalizedSlug = slugify(params.slug);
  const normalizedCategory = slugify(params.category);
  
  const { data: article } = await sb
    .from('articles')
    .select('*')
    .eq('category_slug', normalizedCategory)
    .eq('slug', normalizedSlug)
    .eq('status', 'published')
    .single();

  if (!article) {
    return {
      title: 'Artikel nicht gefunden',
      description: 'Der angeforderte Artikel konnte nicht gefunden werden.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://schnell-wissen.de';
  const url = `${siteUrl}/${article.category_slug}/${article.slug}`;
  const imageUrl = article.cover_image_url || `${siteUrl}/default-og-image.jpg`;

  return {
    title: article.title,
    description: article.excerpt || article.title,
    alternates: { 
      canonical: url 
    },
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      url,
      type: 'article',
      publishedTime: article.published_at,
      authors: article.author ? [article.author] : undefined,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      siteName: 'Schnell Wissen',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.title,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const sb = await supabaseServer();
  
  // Use slugify for normalization
  const normalizedSlug = slugify(params.slug);
  const normalizedCategory = slugify(params.category);
  
  // Try to get article with author info
  const { data: article, error } = await sb
    .from('articles')
    .select(`
      *,
      authors (
        id,
        name,
        image_path,
        bio
      )
    `)
    .eq('category_slug', normalizedCategory)
    .eq('slug', normalizedSlug)
    .eq('status', 'published')
    .single();

  if (error || !article) {
    console.error('DETAIL_NOT_FOUND', { params, normalizedCategory, normalizedSlug, error });
    notFound();
  }

  // Get category information
  const { data: category } = await sb
    .from('categories')
    .select('name,slug')
    .eq('slug', article.category_slug)
    .single();

  // Get consistent view counts from unified source
  const { data: viewCounts } = await sb
    .rpc('get_article_views', { p_article_id: article.id });

  const totalViews = viewCounts?.[0]?.views_total || article.views || 0;
  const views30d = viewCounts?.[0]?.views_30d || 0;

  // Fetch related articles with robust error handling
  let relatedArticles = [];
  try {
    // Use internal API call for server-side fetching
    const { data: relatedData, error: relatedError } = await sb
      .rpc('related_articles', {
        article_id: article.id,
        max_results: 3
      });
    
    if (!relatedError && relatedData) {
      relatedArticles = relatedData.slice(0, 3);
    } else {
      // Fallback: Get articles from same category
      const { data: categoryArticles } = await sb
        .from('articles')
        .select('id, slug, title, cover_image_url, category_slug')
        .eq('category_slug', article.category_slug)
        .neq('id', article.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);
      
      relatedArticles = categoryArticles || [];
    }
  } catch (error) {
    console.error('Failed to fetch related articles:', error);
    relatedArticles = [];
  }

  return (
    <main className="min-h-screen bg-bg">
      <ArticleViewTracker articleId={article.id} />
      
      {/* Navigation Breadcrumb - Mobile-First */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <nav className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-primary dark:hover:text-blue-400">Home</Link>
          <span>/</span>
          <Link href={`/kategorie/${article.category_slug}`} className="hover:text-primary dark:hover:text-blue-400">
            {category?.name || article.category_slug}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 truncate">{article.title}</span>
        </nav>
      </div>

      {/* STAGE - Cover und Header - Mobile-First */}
      <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Cover Image - Responsive with Next/Image */}
        {article.cover_image_url && (
          <div className="pt-4 sm:pt-6">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[400px] sm:max-h-[500px] overflow-hidden rounded-xl sm:rounded-2xl">
              <Image
                src={`/api/img?u=${encodeURIComponent(article.cover_image_url)}&kind=cover`}
                alt={article.title}
                fill
                className="object-cover shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1200px"
                priority
              />
            </div>
          </div>
        )}

        {/* HEADLINE + EXCERPT + META - Harmonisierte Typografie */}
        <header className="mx-auto mt-6 sm:mt-8 max-w-3xl">
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
              {category?.name || article.category_slug}
            </span>
          </div>
          
          <h1 className="font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight" style={{ fontSize: 'var(--sw-h1)' }}>
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="mt-3 sm:mt-4 lead text-gray-600 dark:text-slate-300">
              {article.excerpt}
            </p>
          )}
          
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <ArticleMeta
              date={article.published_at ? new Date(article.published_at).toLocaleDateString('de-DE') : ''}
              viewsLabel={`${views30d.toLocaleString('de-DE')} Aufrufe (30 Tage)`}
              author={article.authors ? {
                name: article.authors.name,
                image: article.authors.image_path
              } : undefined}
            />
          </div>
          
          {/* Bookmark Button */}
          <div className="mt-6">
            <BookmarkButton articleId={article.id} showText={true} />
          </div>
        </header>
      </section>

      {/* CONTENT + SIDEBAR - Mobile-First Layout */}
      <section className="mx-auto mt-8 sm:mt-10 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-center">
          {/* TEXTSPALTE - Harmonisierte Prose-Styles */}
          <div className="w-full max-w-3xl">
            <article className="prose prose-lg prose-gray dark:prose-invert mt-8 max-w-none
                             prose-p:leading-relaxed prose-headings:tracking-tight
                             prose-h2:[font-size:var(--sw-h2)] prose-h2:leading-tight prose-h2:text-gray-900 dark:prose-h2:text-white
                             prose-h3:[font-size:var(--sw-h3)] prose-h3:leading-snug prose-h3:text-gray-900 dark:prose-h3:text-white
                             prose-p:text-gray-700 dark:prose-p:text-slate-300
                             prose-strong:text-gray-900 dark:prose-strong:text-white
                             prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                             prose-img:rounded-xl prose-img:shadow-lg
                             prose-blockquote:border-l-blue-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-slate-800/50
                             prose-blockquote:rounded-r-xl prose-blockquote:px-6 prose-blockquote:py-4
                             prose-li:text-gray-700 dark:prose-li:text-slate-300">
              <div dangerouslySetInnerHTML={{ __html: article.content_html || article.content || article.html || '' }} />
            </article>
          </div>

          {/* SIDEBAR (absolut positioniert ganz rechts) */}
          <div className="hidden xl:block absolute right-0 top-0 w-52">
            <div className="sticky top-24">
              {relatedArticles && relatedArticles.length > 0 ? (
                <RelatedSidebar articles={relatedArticles} />
              ) : (
                <div className="rounded-lg bg-card p-3 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
                  <h3 className="mb-2 text-sm font-semibold text-text">
                    Das könnte Sie auch interessieren
                  </h3>
                  <p className="text-xs text-text-muted">Keine verwandten Artikel gefunden.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sidebar - Mobile-First Container */}
      <section className="xl:hidden mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {relatedArticles && relatedArticles.length > 0 && (
          <RelatedSidebar articles={relatedArticles} />
        )}
      </section>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.excerpt,
            "author": article.authors ? {
              "@type": "Person",
              "name": article.authors.name
            } : {
              "@type": "Organization",
              "name": "Schnell Wissen Redaktion"
            },
            "datePublished": article.published_at,
            "dateModified": article.updated_at || article.published_at,
            "image": article.cover_image_url,
            "publisher": {
              "@type": "Organization",
              "name": "Schnell Wissen",
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://schnell-wissen.de'}/logo.png`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://schnell-wissen.de'}/${article.category_slug}/${article.slug}`
            }
          })
        }}
      />

      {/* Article Footer with Safe Area */}
      <footer className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12" style={{ paddingBottom: 'calc(3rem + env(safe-area-inset-bottom))' }}>
        <div className="max-w-4xl mx-auto">
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="btn-secondary inline-flex items-center min-h-[44px] px-4 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Zurück zur Startseite
              </Link>
              
              <ShareBar 
                path={`/${article.category_slug}/${article.slug}`} 
                title={article.title} 
              />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Remove generateStaticParams to avoid cookies error in development
// This function would be used for static generation in production