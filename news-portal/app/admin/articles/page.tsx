import Link from 'next/link';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import DeleteButton from './DeleteButton';

export default async function ArticlesListPage() {
  const supabase = await supabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/');
  }

  const { data: articles } = await supabase
    .from('articles')
    .select(`
      id, 
      title, 
      slug, 
      category_slug,
      status, 
      views, 
      published_at,
      cover_image_url,
      categories (
        name,
        slug
      )
    `)
    .order('published_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Artikel verwalten</h1>
        <Link
          href="/admin/articles/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Neuer Artikel
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles?.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {article.cover_image_url && (
                      <img 
                        src={article.cover_image_url} 
                        alt="" 
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                    <Link href={`/${article.category_slug || article.categories?.[0]?.slug || 'uncategorized'}/${article.slug}`} className="text-blue-600 hover:underline">
                      {article.title}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.categories?.[0]?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.views}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.published_at 
                    ? new Date(article.published_at).toLocaleDateString('de-DE')
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Link 
                    href={`/admin/articles/${article.id}/edit`} 
                    className="text-blue-600 hover:underline"
                  >
                    Bearbeiten
                  </Link>
                  <DeleteButton id={article.id} title={article.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(!articles || articles.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            Noch keine Artikel vorhanden
          </div>
        )}
      </div>
    </div>
  );
}