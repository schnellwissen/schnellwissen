import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import { normalizeSlug } from '@/lib/paths';

interface ArticlePageProps {
  params: {
    category: string;
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const sb = await supabaseServer();
  
  const normalizedSlug = normalizeSlug(params.slug);
  const normalizedCategory = normalizeSlug(params.category);
  
  const { data: article, error } = await sb
    .from('articles')
    .select('id,title,slug,category_slug,cover_image_url,excerpt,content,status')
    .eq('category_slug', normalizedCategory)
    .eq('slug', normalizedSlug)
    .eq('status', 'published')
    .single();

  if (error || !article) {
    console.error('Article not found:', error);
    notFound();
  }

  // Get category information
  const { data: category } = await sb
    .from('categories')
    .select('name,slug')
    .eq('slug', article.category_slug)
    .single();

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center space-x-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href={`/kategorie/${article.category_slug}`} className="hover:text-primary">
            {category?.name || article.category_slug}
          </Link>
          <span>/</span>
          <span className="text-text">{article.title}</span>
        </nav>
      </div>

      {/* Article Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <span className="badge-primary">{category?.name || article.category_slug}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-text mb-6 leading-tight">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="text-xl text-text-muted mb-6">
              {article.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-text-muted border-y border-gray-200 py-4 mb-8">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                Veröffentlicht
              </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {article.cover_image_url && (
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <img 
              src={`/api/img?u=${encodeURIComponent(article.cover_image_url)}&kind=cover`}
              alt={article.title}
              className="w-full rounded-xl shadow-soft"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg max-w-none text-text"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>

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
              
              <div className="flex items-center space-x-4">
                <span className="text-text-muted text-sm">Artikel teilen:</span>
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function generateStaticParams() {
  const sb = await supabaseServer();
  
  const { data: articles } = await sb
    .from('articles')
    .select('slug, category_slug')
    .eq('status', 'published');

  return articles?.map((article) => ({
    category: article.category_slug || 'artikel',
    slug: article.slug,
  })) || [];
}