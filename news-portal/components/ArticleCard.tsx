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
    <article className="relative group overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-white/5 hover:ring-white/10 transition-all">
      <Link href={getArticlePathFromArticle(a)} className="block">
        {/* Image with consistent aspect ratio */}
        {a.cover_image_url && (
          <div className="relative aspect-[16/9] overflow-hidden bg-slate-700">
            <Image
              src={a.cover_image_url}
              alt={a.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4">
          {a.categories && (
            <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 mb-3">
              {a.categories.name}
            </span>
          )}
          
          <h3 className="line-clamp-2 text-base font-semibold text-white group-hover:text-blue-400 transition-colors leading-tight sm:text-lg">
            {a.title}
          </h3>
          
          {a.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-300 leading-relaxed">
              {a.excerpt}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>
              {a.views_30d !== undefined && a.views_30d > 0 ? (
                `${a.views_30d.toLocaleString('de-DE')} Aufrufe`
              ) : (
                new Date(a.published_at).toLocaleDateString('de-DE', {
                  day: 'numeric',
                  month: 'short'
                })
              )}
            </span>
            <span>
              {new Date(a.published_at).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short'
              })}
            </span>
          </div>
        </div>
      </Link>
      
      {/* Bookmark button */}
      <button className="absolute right-3 top-3 h-9 w-9 rounded-full bg-slate-900/60 text-white/90 backdrop-blur hover:bg-slate-900/80 transition-all grid place-content-center">
        <BookmarkButton
          articleId={a.id}
          className="!p-0 !min-w-0 !min-h-0 !bg-transparent !shadow-none hover:!scale-100"
          showText={false}
        />
      </button>
    </article>
  );
}