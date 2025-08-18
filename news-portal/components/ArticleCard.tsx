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
    <article className="relative group overflow-hidden rounded-2xl bg-slate-800/80 ring-1 ring-white/5 hover:ring-white/10 transition-all">
      <Link href={getArticlePathFromArticle(a)} className="block">
        {/* Bild-Wrapper mit fester Aspect Ratio */}
        {a.cover_image_url && (
          <div className="relative aspect-[16/9] md:aspect-[4/3] overflow-hidden bg-slate-700">
            <Image
              src={a.cover_image_url}
              alt={a.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 82vw, (max-width: 1024px) 360px, 360px"
              priority={false}
              loading="lazy"
            />
          </div>
        )}
        
        {/* Kompakter Content */}
        <div className="p-4">
          {a.categories && (
            <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-500/10 text-blue-400 mb-2">
              {a.categories.name}
            </span>
          )}
          
          <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
            {a.title}
          </h3>
          
          {a.excerpt && (
            <p className="mt-2 text-[13px] md:text-sm text-slate-300 leading-relaxed line-clamp-2">
              {a.excerpt}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>
              {a.views_30d !== undefined && a.views_30d > 0 ? (
                `${a.views_30d.toLocaleString('de-DE')} Aufrufe`
              ) : (
                ''
              )}
            </span>
            <time dateTime={a.published_at}>
              {new Date(a.published_at).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short'
              })}
            </time>
          </div>
        </div>
      </Link>
      
      {/* Bookmark button - kleiner auf Mobile */}
      <button className="absolute right-2 top-2 h-8 w-8 rounded-full bg-slate-900/60 text-white/90 backdrop-blur hover:bg-slate-900/80 transition-all grid place-content-center">
        <BookmarkButton
          articleId={a.id}
          className="!p-0 !min-w-0 !min-h-0 !bg-transparent !shadow-none hover:!scale-100"
          showText={false}
        />
      </button>
    </article>
  );
}