import Link from 'next/link';
import { getArticlePathFromArticle } from '@/lib/paths';

interface ArticleCardProps {
  a: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    cover_image_url?: string;
    published_at: string;
    categories?: {
      slug: string;
      name: string;
    };
  };
}

export default function ArticleCard({ a }: ArticleCardProps) {
  return (
    <Link href={getArticlePathFromArticle(a)} className="group block">
      <article className="card overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
        {a.cover_image_url && (
          <div className="aspect-video relative overflow-hidden bg-gray-100">
            <img 
              src={a.cover_image_url}
              alt={a.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
        
        <div className="p-5">
          {a.categories && (
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-3">
              {a.categories.name}
            </span>
          )}
          
          <h3 className="font-bold text-lg text-text mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {a.title}
          </h3>
          
          {a.excerpt && (
            <p className="text-text-muted text-sm line-clamp-3 mb-4">
              {a.excerpt}
            </p>
          )}
          
          <div className="flex items-center text-xs text-text-muted">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(a.published_at).toLocaleDateString('de-DE', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </div>
        </div>
      </article>
    </Link>
  );
}