import Link from 'next/link';
import Image from 'next/image';
import { getArticlePathFromArticle } from '@/lib/paths';
import BookmarkButton from './BookmarkButton';

// Optimiere Pexels-Bild-URLs für exakte mobile Dimensionen
function getOptimizedImageUrl(url: string): string {
  if (!url) return url;
  
  // Für Pexels-Bilder: Verwende exakte Größen für mobile Geräte (279x186)
  if (url.includes('pexels.com')) {
    // Entferne bestehende Größenparameter
    const baseUrl = url.split('?')[0];
    // Verwende exakte Dimensionen wie von PageSpeed empfohlen
    // Mit auto=compress&fm=webp für bessere Kompression
    return `${baseUrl}?w=279&h=186&fit=crop&auto=compress&fm=webp&q=80`;
  }
  
  return url;
}

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
  priority?: boolean; // Für LCP-Optimierung
}

export default function ArticleCard({ a, priority = false }: ArticleCardProps) {
  return (
    <article className="snap-center w-full relative group overflow-hidden rounded-xl bg-slate-800/80 ring-1 ring-white/5 hover:ring-white/10 transition-all">
      <Link href={getArticlePathFromArticle(a)} className="block">
        {/* Bildhöhe bewusst klein halten mit Gradient für besseren Kontrast */}
        {a.cover_image_url && (
          <div className="relative h-[136px] xs:h-[148px] sm:h-[160px] overflow-hidden bg-slate-700">
            <Image
              src={getOptimizedImageUrl(a.cover_image_url)}
              alt={a.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="279px"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              quality={80}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
            />
            {/* Gradient-Overlay für besseren Icon-Kontrast */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
          </div>
        )}
        
        {/* Sehr kompakter Content */}
        <div className="p-3 sm:p-4">
          {a.categories && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-500/10 text-blue-400 mb-1.5">
              {a.categories.name}
            </span>
          )}
          
          <h3 className="text-[15px] sm:text-base font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
            {a.title}
          </h3>
          
          {a.excerpt && (
            <p className="mt-1.5 text-[13px] sm:text-[14px] text-slate-300 leading-relaxed line-clamp-2">
              {a.excerpt}
            </p>
          )}
          
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
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
      
      {/* Bookmark button - sichtbar mit Glas-Effekt */}
      <BookmarkButton
        articleId={a.id}
        className="absolute right-2 top-2 z-20"
        showText={false}
      />
    </article>
  );
}