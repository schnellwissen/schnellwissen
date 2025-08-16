import Link from 'next/link';
import Image from 'next/image';
import { sbServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function MerkenPage() {
  const sb = await sbServer();
  const { data: { user } } = await sb.auth.getUser();
  
  if (!user) {
    redirect('/login?redirectTo=/merken');
  }

  // Get bookmarked articles with proper join
  const { data: bookmarks, error } = await sb
    .from('bookmarks')
    .select(`
      created_at,
      article_id,
      articles (
        id,
        slug,
        title,
        excerpt,
        cover_image_url,
        category_slug,
        published_at
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const hasBookmarks = bookmarks && bookmarks.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gespeicherte Artikel
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {hasBookmarks 
              ? `${bookmarks.length} Artikel in deiner Leseliste`
              : 'Noch keine Artikel gespeichert'
            }
          </p>
        </div>

        {!hasBookmarks ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <svg 
              className="w-16 h-16 mx-auto mb-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Keine gespeicherten Artikel
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Speichere interessante Artikel, um sie später zu lesen
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Artikel entdecken
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((bookmark: any) => {
                const article = bookmark.articles;
                if (!article) {
                  return null;
                }

                return (
                  <article 
                    key={article.id} 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                  <Link href={`/${article.category_slug}/${article.slug}`}>
                    {article.cover_image_url ? (
                      <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-700">
                        <Image 
                          src={article.cover_image_url} 
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-gradient-to-br from-blue-500 to-purple-600" />
                    )}
                    
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">
                          {article.category_slug}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          •
                        </span>
                        <time className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(article.published_at).toLocaleDateString('de-DE')}
                        </time>
                      </div>
                      
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {article.title}
                      </h2>
                      
                      {article.excerpt && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}