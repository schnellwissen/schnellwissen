import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
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
      
      {/* Navigation Breadcrumb */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-primary dark:hover:text-blue-400">Home</Link>
          <span>/</span>
          <Link href={`/kategorie/${article.category_slug}`} className="hover:text-primary dark:hover:text-blue-400">
            {category?.name || article.category_slug}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 truncate">{article.title}</span>
        </nav>
      </div>

      {/* STAGE - Cover und Header */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cover Image */}
        {article.cover_image_url && (
          <div className="pt-6">
            <img 
              src={`/api/img?u=${encodeURIComponent(article.cover_image_url)}&kind=cover`}
              alt={article.title}
              className="w-full rounded-2xl object-cover shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* HEADLINE + EXCERPT + META zentriert */}
        <header className="mx-auto mt-8 max-w-3xl">
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              {category?.name || article.category_slug}
            </span>
          </div>
          
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              {article.excerpt}
            </p>
          )}
          
          <div className="mt-4">
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

      {/* CONTENT + SIDEBAR */}
      <section className="mx-auto mt-10 w-full px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1600px' }}>
        <div className="relative flex justify-center">
          {/* TEXTSPALTE - zentriert */}
          <div className="w-full max-w-3xl">
            <article className="prose dark:prose-invert prose-slate dark:prose-gray prose-p:leading-relaxed prose-headings:font-extrabold prose-a:text-primary max-w-none">
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

      {/* Mobile Sidebar - nur auf kleinen Bildschirmen */}
      <section className="lg:hidden mx-auto mt-8 w-full max-w-3xl px-4 sm:px-6">
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

      {/* Article Footer */}
      <footer className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="btn-secondary inline-flex items-center"
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