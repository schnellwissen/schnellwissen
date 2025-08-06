import DOMPurify from 'isomorphic-dompurify';
import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { ViewPing } from './ViewPing';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function Article({ params }: ArticlePageProps) {
  const sb = await supabaseServer();
  const { data: art } = await sb
    .from('articles')
    .select('id,title,content_html,views,published_at,category_id,categories(name)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();
    
  if (!art) return notFound();

  const safe = DOMPurify.sanitize(art.content_html || '');
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose lg:prose-lg mx-auto max-w-none">
        <div className="mb-4">
          <span className="text-sm text-gray-500">
            {art.categories?.name} • {new Date(art.published_at).toLocaleDateString('de-DE')}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-6">{art.title}</h1>
        <div 
          className="prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-ul:list-disc prose-ol:list-decimal"
          dangerouslySetInnerHTML={{ __html: safe }} 
        />
        <div className="mt-8 pt-4 border-t">
          <span className="text-sm text-gray-500">{art.views} Aufrufe</span>
        </div>
      </article>
      <ViewPing id={art.id} />
    </div>
  );
}