import { supabaseServer } from '@/lib/supabase/server';

export default async function TestDB() {
  const sb = await supabaseServer();
  
  // Get table structure
  const { data: columns, error: columnsError } = await sb
    .from('articles')
    .select('*')
    .limit(1);
    
  // Get sample article
  const { data: articles, error: articlesError } = await sb
    .from('articles')
    .select('*')
    .limit(1);
    
  // Get categories
  const { data: categories, error: categoriesError } = await sb
    .from('categories')
    .select('*');
    
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Article Columns:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {columns ? Object.keys(columns[0] || {}).join(', ') : 'No articles found'}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sample Article:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(articles, null, 2)}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Categories:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(categories, null, 2)}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Errors:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify({ columnsError, articlesError, categoriesError }, null, 2)}
        </pre>
      </div>
    </div>
  );
}