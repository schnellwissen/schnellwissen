import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import ArticleCard from '@/components/ArticleCard';
import { getArticlePathFromArticle } from '@/lib/paths';
import FooterConsentLink from '@/components/consent/FooterConsentLink';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const sb = await supabaseServer();
  
  // Top 6 meistgelesene Artikel (30 Tage) - konsistente Metrik
  const { data: topArticleIds } = await sb
    .rpc('get_top_articles_by_views_30d', { p_limit: 6 });

  let mostRead = null;
  if (topArticleIds && topArticleIds.length > 0) {
    // Get full article data for top articles
    const { data } = await sb
      .from('articles')
      .select('id,title,slug,category_slug,excerpt,cover_image_url,published_at')
      .in('id', topArticleIds.map((a: any) => a.article_id))
      .eq('status', 'published');
    
    // Sort by the order from the RPC function and add views_30d
    if (data) {
      mostRead = topArticleIds.map((top: any) => {
        const article = data.find(a => a.id === top.article_id);
        return article ? { ...article, views_30d: top.views_30d } : null;
      }).filter(Boolean);
    }
  }

  // Fallback: get articles with their 30-day views and authors
  if (!mostRead || mostRead.length === 0) {
    const { data: articles } = await sb
      .from('articles')
      .select(`
        id,title,slug,category_slug,excerpt,cover_image_url,published_at,
        authors (
          name,
          image_path
        )
      `)
      .eq('status','published')
      .limit(6);
    
    // Add 30-day views to each article
    if (articles) {
      const articlesWithViews = await Promise.all(
        articles.map(async (article) => {
          const { data: viewCounts } = await sb
            .rpc('get_article_views', { p_article_id: article.id });
          return {
            ...article,
            views_30d: viewCounts?.[0]?.views_30d || 0
          };
        })
      );
      mostRead = articlesWithViews.sort((a, b) => b.views_30d - a.views_30d);
    }
  }

  // Featured Artikel (neuester mit cover_image) mit Autor
  const { data: featured } = await sb
    .from('articles')
    .select(`
      id,title,slug,category_slug,excerpt,cover_image_url,published_at,
      authors (
        name,
        image_path
      )
    `)
    .eq('status','published')
    .not('cover_image_url', 'is', null)
    .order('published_at',{ascending:false})
    .limit(1);

  // Neueste 6 Artikel mit 30-Tage Views und Autoren
  const { data: latestArticles } = await sb
    .from('articles')
    .select(`
      id,title,slug,category_slug,excerpt,cover_image_url,published_at,
      authors (
        name,
        image_path
      )
    `)
    .eq('status','published')
    .order('published_at',{ascending:false})
    .limit(6);

  // Add 30-day views to latest articles
  let latest = latestArticles;
  if (latestArticles) {
    const articlesWithViews = await Promise.all(
      latestArticles.map(async (article) => {
        const { data: viewCounts } = await sb
          .rpc('get_article_views', { p_article_id: article.id });
        return {
          ...article,
          views_30d: viewCounts?.[0]?.views_30d || 0
        };
      })
    );
    latest = articlesWithViews;
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section - Mobile-First, zentriert & kompakt */}
      <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-black/10">
          <div className="mx-auto max-w-screen-md px-4 py-10 sm:py-12 md:py-16 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl leading-tight">
              Deine tägliche Dosis Wissen – kompakt & fundiert
            </h1>
            <p className="mt-3 text-sm text-white/90 sm:mt-4 sm:text-base md:text-lg leading-relaxed">
              Expertenartikel zu Gesundheit, Finanzen, Technologie und mehr.
            </p>
            
            {/* Suche: mobil stack, ab md inline */}
            <form action="/suche" method="get" className="mx-auto mt-6 grid gap-3 sm:max-w-lg md:grid-cols-[1fr_auto]">
              <input
                type="search"
                name="q"
                placeholder="Artikel suchen …"
                className="h-12 w-full rounded-xl bg-white/95 px-4 text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-white backdrop-blur"
                minLength={2}
                required
              />
              <button
                type="submit"
                className="h-12 rounded-xl bg-white/20 px-6 font-semibold text-white backdrop-blur hover:bg-white/30 transition-all md:justify-self-start"
              >
                Suchen
              </button>
            </form>
          </div>
          {/* Decorative Elements */}
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-white/5 blur-2xl"></div>
        </div>
      </section>

      {/* Main Content Area - Mobile-First Container */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
          
          {/* Main Feed */}
          <div className="xl:col-span-3">
            {/* Meistgelesene Artikel - Horizontal Scroll auf Mobile */}
            {mostRead && mostRead.length > 0 && (
              <section className="mb-10">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-xl font-bold sm:text-2xl text-text">Meistgelesene Artikel</h2>
                  <span className="text-sm text-slate-400">Letzte 30 Tage</span>
                </div>
                {/* Mobile: Horizontal Scroll, Desktop: Grid */}
                <div className="sm:hidden">
                  <div className="flex gap-4 overflow-x-auto px-1 pb-4 snap-x snap-mandatory scrollbar-hide">
                    {mostRead.map((article: any, idx: number) => (
                      <div key={article.id} className="relative snap-start min-w-[85%] sm:min-w-[360px]">
                        {idx < 3 && (
                          <div className="absolute top-3 left-3 z-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold h-7 w-7 grid place-content-center rounded-full shadow-lg">
                            {idx + 1}
                          </div>
                        )}
                        <ArticleCard a={article} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Desktop: Grid */}
                <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {mostRead.map((article: any, idx: number) => (
                    <div key={article.id} className="relative">
                      {idx < 3 && (
                        <div className="absolute top-3 left-3 z-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold h-7 w-7 grid place-content-center rounded-full shadow-lg">
                          {idx + 1}
                        </div>
                      )}
                      <ArticleCard a={article} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Latest Articles - Responsive Grid */}
            <section>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-xl font-bold sm:text-2xl text-text">Neueste Artikel</h2>
                <Link href="/alle" className="text-sm font-medium text-blue-500 hover:text-blue-600">
                  Alle anzeigen →
                </Link>
              </div>
              
              {latest && latest.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {latest.map(article => (
                    <ArticleCard key={article.id} a={article as any} />
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
                    </svg>
                  </div>
                  <p className="text-text-muted text-lg mb-2">Noch keine Artikel vorhanden.</p>
                  <p className="text-text-muted text-sm mb-6">Melden Sie sich als Admin an, um Artikel zu erstellen.</p>
                  <Link href="/admin" className="btn-primary inline-flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Zum Admin-Bereich
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="xl:col-span-1 space-y-6">
            {/* Categories */}
            <section className="rounded-2xl bg-slate-800 p-6 ring-1 ring-white/5">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Kategorien
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {['Gesundheit', 'Finanzen', 'Technologie', 'Lifestyle', 
                  'Ernährung', 'Sport', 'Psychologie', 'Karriere'].map(cat => (
                  <Link
                    key={cat}
                    href={`/kategorie/${cat.toLowerCase()}`}
                    className="py-2.5 px-3 text-sm rounded-lg bg-white/5 text-slate-300 hover:bg-blue-500/20 hover:text-white transition-all text-center font-medium"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </section>

            {/* Newsletter */}
            <section className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">
                Newsletter
              </h3>
              <p className="text-white/90 mb-4 text-sm leading-relaxed">
                Erhalten Sie wöchentlich die besten Artikel direkt in Ihr Postfach
              </p>
              <form className="space-y-3">
                <input 
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  className="h-12 w-full px-4 rounded-xl bg-white/95 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-white"
                />
                <button 
                  type="submit"
                  className="h-12 w-full px-4 bg-white/20 text-white font-semibold rounded-xl backdrop-blur hover:bg-white/30 transition-all"
                >
                  Abonnieren
                </button>
              </form>
            </section>

            {/* Quick Links */}
            <section className="rounded-2xl bg-slate-800 p-6 ring-1 ring-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/ueber-uns" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">Über uns</Link></li>
                <li><Link href="/kontakt" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">Kontakt</Link></li>
                <li><Link href="/impressum" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">Impressum</Link></li>
                <li><Link href="/datenschutz" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">Datenschutz</Link></li>
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {/* Footer with Safe Area Support */}
      <footer className="mt-16 border-t border-white/10 bg-slate-900">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}>
          <div className="text-center text-sm text-slate-400">
            <div className="mb-3">
              © 2024 SchnellWissen. Alle Rechte vorbehalten.
            </div>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
              <span className="text-slate-600">•</span>
              <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
              <span className="text-slate-600">•</span>
              <FooterConsentLink />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}