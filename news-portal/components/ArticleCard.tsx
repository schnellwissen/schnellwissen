import Link from 'next/link';
import Image from 'next/image';
import { getArticlePathFromArticle } from '@/lib/paths';
import BookmarkButton from './BookmarkButton';

interface ArticleCardProps {
  a: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    cover_image_url?: string;
    published_at: string;
    views_30d?: number; // Konsistente Metrik: 30-Tage-Views
    categories?: {
      slug: string;
      name: string;
    };
    authors?: {
      name: string;
      image_path: string;
    };
  };
}

export default function ArticleCard({ a }: ArticleCardProps) {
  return (
    <div className="relative group">
      <article className="card overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 rounded-2xl">
        <Link href={getArticlePathFromArticle(a)} className="block">
          {a.cover_image_url && (
            <div className="aspect-[16/9] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image 
                src={a.cover_image_url}
                alt={a.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
        
        <div className="p-4 sm:p-5">
          {a.categories && (
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-3">
              {a.categories.name}
            </span>
          )}
          
          <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
            {a.title}
          </h3>
          
          {a.excerpt && (
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 sm:line-clamp-3 mb-4 leading-relaxed">
              {a.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(a.published_at).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            {a.views_30d !== undefined && a.views_30d > 0 && (
              <div className="flex items-center" title="Aufrufe in den letzten 30 Tagen">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{a.views_30d.toLocaleString('de-DE')}</span>
              </div>
            )}
          </div>
        </div>
        </Link>
      </article>
      
      {/* Bookmark button positioned outside the link */}
      <div className="absolute top-3 right-3 z-20">
        <BookmarkButton 
          articleId={a.id} 
          className="!p-2.5 !min-w-[44px] !min-h-[44px] !rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-110 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          showText={false}
        />
      </div>
    </div>
  );
}