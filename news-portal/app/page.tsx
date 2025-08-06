import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';

export default async function HomePage() {
  const sb = await supabaseServer();
  
  // Top 3 Artikel nach Views
  const { data: top } = await sb
    .from('articles')
    .select('title,slug,views')
    .eq('status','published')
    .order('views',{ascending:false})
    .limit(3);

  // Neueste 10 Artikel
  const { data: latest } = await sb
    .from('articles')
    .select('title,slug,published_at,excerpt')
    .eq('status','published')
    .order('published_at',{ascending:false})
    .limit(10);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 mb-12">
        <h1 className="text-5xl font-bold mb-4">Willkommen bei News Portal</h1>
        <p className="text-xl mb-8">
          Ihre zentrale Anlaufstelle für aktuelle Nachrichten und Artikel aus allen Bereichen
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Neueste Artikel */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Neueste Artikel</h2>
            {latest && latest.length > 0 ? (
              <div className="space-y-6">
                {latest.map(article => (
                  <div key={article.slug} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      <Link href={`/${article.slug}`} className="hover:text-blue-600">
                        {article.title}
                      </Link>
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 mb-2">{article.excerpt}...</p>
                    )}
                    <div className="text-sm text-gray-500">
                      {new Date(article.published_at).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                <p>Noch keine Artikel vorhanden.</p>
                <p className="mt-2">Melden Sie sich als Admin an, um Artikel zu erstellen.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Top Artikel */}
          {top && top.length > 0 && (
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Meistgelesen</h3>
              <ol className="space-y-3">
                {top.map((article, idx) => (
                  <li key={article.slug} className="flex items-start">
                    <span className="text-2xl font-bold text-blue-600 mr-3">
                      {idx + 1}
                    </span>
                    <div>
                      <Link 
                        href={`/${article.slug}`} 
                        className="font-medium hover:text-blue-600"
                      >
                        {article.title}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">
                        {article.views} Aufrufe
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Kategorien */}
          <section className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-xl font-bold mb-4">Kategorien</h3>
            <div className="space-y-2">
              {['Finanzen', 'Alltag', 'Gesundheit', 'Technologie', 'Karriere', 
                'Bildung', 'Reisen', 'Recht', 'Sport', 'Lifestyle', 'Auto', 'Wissenschaft'].map(cat => (
                <Link
                  key={cat}
                  href={`/kategorie/${cat.toLowerCase()}`}
                  className="block py-2 px-3 rounded hover:bg-gray-100"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
