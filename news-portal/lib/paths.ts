import { slugify } from '@/lib/slugify';

export const getArticlePath = (cat: string, slug: string) =>
  `/${slugify(cat)}/${slugify(slug)}`;

export function getArticlePathFromArticle(article: any): string {
  if (!article || !article.slug) return '/';
  
  const categorySlug = article.categories?.slug || article.category_slug || 'artikel';
  return getArticlePath(categorySlug, article.slug);
}

export function getCategoryPath(categorySlug: string): string {
  return `/kategorie/${slugify(categorySlug)}`;
}

// Keep the old normalizeSlug for backward compatibility, but use slugify internally
export function normalizeSlug(slug: string): string {
  return slugify(slug);
}