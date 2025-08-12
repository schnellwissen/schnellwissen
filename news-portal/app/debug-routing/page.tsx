import { supabaseServer } from '@/lib/supabase/server';
import { getArticlePath } from '@/lib/paths';
import Link from 'next/link';

export default async function DebugRouting() {
  const sb = await supabaseServer();
  
  const { data: articles } = await sb
    .from('articles')
    .select('id, title, slug, category_slug, status')
    .eq('status', 'published')
    .limit(10);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debug: Routing Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Published Articles (First 10)</h2>
        {articles?.length ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="border p-4 rounded">
                <h3 className="font-medium">{article.title}</h3>
                <p className="text-sm text-gray-600">
                  Category: {article.category_slug} | Slug: {article.slug}
                </p>
                <div className="mt-2">
                  <Link 
                    href={getArticlePath(article.category_slug, article.slug)}
                    className="text-blue-600 hover:underline"
                  >
                    → {getArticlePath(article.category_slug, article.slug)}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No articles found.</p>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Test Slug Normalization</h2>
        <div className="space-y-2 text-sm">
          <p>Test URLs (should redirect to canonical):</p>
          <ul className="list-disc list-inside space-y-1">
            <li><Link href="/FINANZEN/Test-Artikel" className="text-blue-600">/FINANZEN/Test-Artikel</Link> → /finanzen/test-artikel</li>
            <li><Link href="/auto/BMW-Test%20Fahrt" className="text-blue-600">/auto/BMW-Test%20Fahrt</Link> → /auto/bmw-test-fahrt</li>
            <li><Link href="/gesundheit/Gesund%C3%A4ß-Leben" className="text-blue-600">/gesundheit/Gesund%C3%A4ß-Leben</Link> → /gesundheit/gesund-leben</li>
          </ul>
        </div>
      </div>
    </div>
  );
}