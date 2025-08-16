'use client';

import Link from 'next/link';
import Image from 'next/image';

interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  cover_image_url?: string;
  category_slug?: string;
}

interface RelatedSidebarProps {
  articles: RelatedArticle[];
}

export default function RelatedSidebar({ articles }: RelatedSidebarProps) {
  // Robuste Prüfung und Sicherstellung max 3 Artikel
  const items = Array.isArray(articles) ? articles.slice(0, 3) : [];
  
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-lg bg-white p-2.5 shadow-sm ring-1 ring-slate-200">
      <h3 className="mb-2 text-xs font-semibold text-slate-900">
        Das könnte Sie auch interessieren
      </h3>
      
      <ul className="space-y-2">
        {items.map((article) => (
          <li key={article.id} className="group">
            <Link 
              href={article.category_slug ? `/${article.category_slug}/${article.slug}` : `/${article.slug}`} 
              className="block cursor-pointer hover:opacity-90 transition-opacity"
            >
              {/* Nur Thumbnail oben */}
              {article.cover_image_url ? (
                <div className="relative h-24 w-full mb-1.5 overflow-hidden rounded">
                  <Image
                    src={article.cover_image_url}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="200px"
                  />
                </div>
              ) : (
                <div className="h-24 w-full mb-1.5 rounded bg-slate-100" />
              )}
              
              {/* Title darunter */}
              <span className="line-clamp-2 text-xs leading-snug text-slate-700 group-hover:text-blue-600">
                {article.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}