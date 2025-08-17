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
      {/* Modern Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white p-10 md:p-16 shadow-soft">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 max-w-3xl leading-tight tracking-tight">
            Deine tägliche Dosis Wissen – kompakt & fundiert
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 opacity-90">
            Expertenartikel zu Gesundheit, Finanzen, Technologie und mehr.
          </p>
          <form action="/suche" method="get" className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input 
              type="search"
              name="q"
              className="flex-1 rounded-lg px-5 py-3 text-text placeholder:text-text-muted focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              placeholder="Artikel suchen …" 
              minLength={2}
              required
            />
            <button type="submit" className="bg-white text-primary hover:bg-gray-100 font-semibold rounded-lg px-8 py-3 transition-all shadow-md hover:shadow-lg">
              Suchen
            </button>
          </form>
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-primary-light opacity-20 rotate-45 rounded-3xl"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
          
          {/* Main Feed */}
          <div className="xl:col-span-3">
            {/* Meistgelesene Artikel - identisch zu Neueste Artikel */}
            {mostRead && mostRead.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text tracking-tight">Meistgelesene Artikel</h2>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>Letzte 30 Tage</span>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {mostRead.map((article: any, idx: number) => (
                    <div key={article.id} className="relative">
                      {/* Kleines Rank-Badge als Overlay */}
                      {idx < 3 && (
                        <div className="absolute top-4 left-4 z-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          #{idx + 1}
                        </div>
                      )}
                      <ArticleCard a={article} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Articles Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text tracking-tight">Neueste Artikel</h2>
                <Link href="/alle" className="link text-sm font-medium">
                  Alle anzeigen →
                </Link>
              </div>
              
              {latest && latest.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {latest.map(article => (
                    <ArticleCard key={article.id} a={article} />
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Categories */}
            <section className="card p-6">
              <h3 className="text-lg font-bold text-text mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="py-2 px-3 text-sm rounded-lg bg-gray-50 dark:bg-gray-700 text-text hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-200 text-center font-medium"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </section>

            {/* Newsletter */}
            <section className="bg-gradient-to-br from-accent to-accent/80 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">
                Newsletter
              </h3>
              <p className="text-white/90 mb-4 text-sm">
                Erhalten Sie wöchentlich die besten Artikel direkt in Ihr Postfach
              </p>
              <form className="space-y-3">
                <input 
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  className="w-full px-4 py-2 rounded-lg bg-white text-text placeholder-text-muted focus:ring-2 focus:ring-white"
                />
                <button 
                  type="submit"
                  className="w-full py-2 px-4 bg-white text-accent font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Abonnieren
                </button>
              </form>
            </section>

            {/* Quick Links */}
            <section className="card p-6">
              <h3 className="text-lg font-bold text-text mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/ueber-uns" className="text-text-muted hover:text-primary text-sm">Über uns</Link></li>
                <li><Link href="/kontakt" className="text-text-muted hover:text-primary text-sm">Kontakt</Link></li>
                <li><Link href="/impressum" className="text-text-muted hover:text-primary text-sm">Impressum</Link></li>
                <li><Link href="/datenschutz" className="text-text-muted hover:text-primary text-sm">Datenschutz</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-text-muted">
            <div className="mb-2">
              © 2024 SchnellWissen. Alle Rechte vorbehalten.
            </div>
            <div className="flex justify-center items-center gap-4">
              <Link href="/impressum" className="hover:text-primary transition-colors">Impressum</Link>
              <span className="text-gray-400">•</span>
              <Link href="/datenschutz" className="hover:text-primary transition-colors">Datenschutz</Link>
              <span className="text-gray-400">•</span>
              <FooterConsentLink />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}