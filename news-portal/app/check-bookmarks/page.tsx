import { sbServer } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CheckBookmarksPage() {
  const sb = await sbServer();
  const { data: { user } } = await sb.auth.getUser();
  
  if (!user) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Bookmarks Check</h1>
        <p className="text-red-600">Nicht angemeldet</p>
        <Link href="/login" className="text-blue-600 underline">Zur Anmeldung</Link>
      </div>
    );
  }
  
  // Try to query bookmarks table
  let tableExists = false;
  let bookmarks = null;
  let error = null;
  
  try {
    const { data, error: queryError } = await sb
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id);
    
    if (queryError) {
      error = queryError;
      if (queryError.message.includes('relation "public.bookmarks" does not exist')) {
        tableExists = false;
      }
    } else {
      tableExists = true;
      bookmarks = data;
    }
  } catch (e) {
    error = e;
  }
  
  // Also check articles for debugging
  const { data: articles } = await sb
    .from('articles')
    .select('id, title')
    .limit(5);
  
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bookmarks System Check</h1>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">User Status</h2>
          <p className="text-sm">User ID: {user.id}</p>
          <p className="text-sm">Email: {user.email}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Bookmarks Table</h2>
          <p className={`text-sm ${tableExists ? 'text-green-600' : 'text-red-600'}`}>
            Table exists: {tableExists ? 'Yes' : 'No'}
          </p>
          {error && (
            <p className="text-sm text-red-600 mt-2">
              Error: {error.message || JSON.stringify(error)}
            </p>
          )}
        </div>
        
        {tableExists && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Your Bookmarks ({bookmarks?.length || 0})</h2>
            {bookmarks && bookmarks.length > 0 ? (
              <pre className="text-xs overflow-auto">
                {JSON.stringify(bookmarks, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-gray-600">Keine Bookmarks gefunden</p>
            )}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Sample Articles (for testing)</h2>
          {articles && articles.length > 0 ? (
            <ul className="space-y-2">
              {articles.map(article => (
                <li key={article.id} className="text-sm">
                  <span className="font-mono text-xs">{article.id}</span> - {article.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">Keine Artikel gefunden</p>
          )}
        </div>
        
        {!tableExists && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h2 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
              Bookmarks Table muss erstellt werden
            </h2>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
              Die Bookmarks-Tabelle existiert noch nicht in der Datenbank. 
              Bitte führe das SQL-Script in Supabase aus.
            </p>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-yellow-800 dark:text-yellow-200">
                SQL Script anzeigen
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto">
{`-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, article_id)
);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "bookmarks_read_own" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "bookmarks_insert_own" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks_delete_own" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_article_id_idx ON bookmarks(article_id);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON bookmarks(created_at DESC);`}
              </pre>
            </details>
          </div>
        )}
        
        <div className="flex gap-4">
          <Link 
            href="/merken" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Zur Merkliste
          </Link>
          <Link 
            href="/" 
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Zur Hauptseite
          </Link>
        </div>
      </div>
    </div>
  );
}