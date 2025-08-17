import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { getArticlePathFromArticle } from '@/lib/paths';

const categories = {
  'gesundheit': { name: 'Gesundheit', description: 'Artikel über Wellness, Medizin und gesundes Leben' },
  'finanzen': { name: 'Finanzen', description: 'Tipps zu Geld, Investitionen und Wirtschaft' },
  'technologie': { name: 'Technologie', description: 'Neueste Trends und Entwicklungen in der Tech-Welt' },
  'lifestyle': { name: 'Lifestyle', description: 'Inspiration für ein erfülltes Leben' },
  'ernaehrung': { name: 'Ernährung', description: 'Gesunde Rezepte und Ernährungstipps' },
  'sport': { name: 'Sport', description: 'Training, Fitness und Sportevents' },
  'psychologie': { name: 'Psychologie', description: 'Mentale Gesundheit und persönliche Entwicklung' },
  'karriere': { name: 'Karriere', description: 'Berufliche Entwicklung und Erfolg' }
};

function pluralize(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

function CategoryHero({ title, description }: { title: string; description: string }) {
  return (
    <section className="border-b bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="text-sm mb-3">
          <Link href="/" className="text-white/90 hover:text-white transition-colors">Home</Link>
          <span className="mx-2 text-white/60">/</span>
          <Link href="/" className="text-white/90 hover:text-white transition-colors">Kategorien</Link>
          <span className="mx-2 text-white/60">/</span>
          <span className="text-white font-medium">{title}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">{title}</h1>
        {description && (
          <p className="text-base text-white/90 max-w-2xl">{description}</p>
        )}
      </div>
    </section>
  );
}

function SectionHeader({ count }: { count: number }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-xl md:text-2xl font-semibold">Artikel</h2>
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm text-slate-700 bg-white shadow-sm">
          {count} {pluralize(count, "Artikel", "Artikel")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="sort">Sortieren</label>
        <select
          id="sort"
          className="rounded-md border px-3 py-2 text-sm"
          defaultValue="newest"
        >
          <option value="newest">Neueste zuerst</option>
          <option value="popular">Beliebteste</option>
          <option value="updated">Kürzlich aktualisiert</option>
        </select>
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: any }) {
  const href = getArticlePathFromArticle(article);
  const displayDate = new Date(article.published_at).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  const categoryDisplay = categories[article.category_slug as keyof typeof categories]?.name || article.category_slug;
  
  return (
    <Link href={href} className="group block rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
      <div className="aspect-video overflow-hidden bg-slate-100">
        {article.cover_image_url ? (
          <img 
            src={article.cover_image_url} 
            alt={article.title}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition" 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
            {categoryDisplay}
          </span>
          <span aria-hidden="true">•</span>
          <time dateTime={article.published_at}>{displayDate}</time>
        </div>
        <h3 className="text-base font-semibold leading-snug line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-slate-700 line-clamp-3">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

function WidgetCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="rounded-2xl border bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">{title}</h3>
      {children}
    </aside>
  );
}

function EmptyState({ categoryName }: { categoryName: string }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm p-12 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
        </svg>
      </div>
      <p className="text-lg font-medium text-slate-900 mb-2">
        Noch keine Artikel in {categoryName}
      </p>
      <p className="text-sm text-slate-600 mb-6">
        Schauen Sie später wieder vorbei oder erkunden Sie andere Kategorien.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Zur Startseite
      </Link>
    </div>
  );
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categorySlug = params.slug.toLowerCase();
  const category = categories[categorySlug as keyof typeof categories];
  
  if (!category) {
    notFound();
  }

  const sb = await supabaseServer();
  
  // Artikel dieser Kategorie abrufen
  const { data: articles } = await sb
    .from('articles')
    .select('id,title,slug,category_slug,excerpt,cover_image_url,published_at,views')
    .eq('status', 'published')
    .eq('category_slug', categorySlug)
    .order('published_at', { ascending: false });

  // Top 3 Artikel der Kategorie
  const { data: topArticles } = await sb
    .from('articles')
    .select('id,title,slug,category_slug,views')
    .eq('status', 'published')
    .eq('category_slug', categorySlug)
    .order('views', { ascending: false })
    .limit(3);

  // Statistiken
  const totalViews = articles?.reduce((sum, a) => sum + (a.views || 0), 0) || 0;
  
  // Andere Kategorien mit Artikel-Count (vereinfacht)
  const otherCategories = Object.entries(categories)
    .filter(([slug]) => slug !== categorySlug)
    .map(([slug, cat]) => ({
      slug,
      name: cat.name,
      count: 0 // Würde normalerweise aus DB kommen
    }));

  return (
    <div className="min-h-screen bg-slate-50">
      <CategoryHero title={category.name} description={category.description} />
      
      <SectionHeader count={articles?.length || 0} />
      
      <div className="mx-auto max-w-6xl px-4 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Content */}
        <div>
          {!articles || articles.length === 0 ? (
            <EmptyState categoryName={category.name} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-6 space-y-6 h-fit">
          {/* Top in Kategorie */}
          {topArticles && topArticles.length > 0 && (
            <WidgetCard title={`Top in ${category.name}`}>
              <ol className="space-y-2">
                {topArticles.map((article, i) => (
                  <li key={article.id} className="flex items-start gap-2">
                    <span className="w-6 text-right font-semibold text-slate-500 text-sm">
                      {i + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={getArticlePathFromArticle(article)}
                        className="line-clamp-1 hover:underline text-sm text-slate-900"
                      >
                        {article.title}
                      </Link>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {article.views.toLocaleString('de-DE')} Aufrufe
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </WidgetCard>
          )}

          {/* Andere Kategorien */}
          <WidgetCard title="Andere Kategorien">
            <div className="flex flex-wrap gap-2">
              {otherCategories.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/kategorie/${cat.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-slate-50 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </WidgetCard>

          {/* Statistiken */}
          <WidgetCard title="Statistiken">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Artikel</dt>
                <dd className="font-medium text-slate-900">{articles?.length || 0}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Gesamt Views</dt>
                <dd className="font-medium text-slate-900">
                  {totalViews.toLocaleString('de-DE')}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Autoren</dt>
                <dd className="font-medium text-slate-900">-</dd>
              </div>
              <div>
                <dt className="text-slate-500">Letzter Artikel</dt>
                <dd className="font-medium text-slate-900">
                  {articles && articles[0] 
                    ? new Date(articles[0].published_at).toLocaleDateString('de-DE', {
                        day: 'numeric',
                        month: 'short'
                      })
                    : '-'
                  }
                </dd>
              </div>
            </dl>
          </WidgetCard>

          {/* Newsletter Widget */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">
              Newsletter
            </h3>
            <p className="text-white/90 mb-4 text-sm">
              Erhalten Sie die neuesten {category.name}-Artikel direkt in Ihr Postfach
            </p>
            <form className="space-y-3">
              <input 
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button 
                type="submit"
                className="w-full py-2 px-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition"
              >
                Abonnieren
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({
    slug: slug,
  }));
}

// Metadata für SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = categories[params.slug as keyof typeof categories];
  
  if (!category) {
    return {
      title: 'Kategorie nicht gefunden',
    };
  }

  return {
    title: `${category.name} - Artikel und News | Schnell Wissen`,
    description: category.description,
    openGraph: {
      title: `${category.name} - Artikel und News`,
      description: category.description,
      type: 'website',
    },
  };
}