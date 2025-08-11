import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { slugify } from '@/lib/slugify';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  
  // Skip API routes, static files, and special paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }
  
  // Canonical Redirects für Artikel-URLs
  const articleMatch = pathname.match(/^\/([^\/]+)\/([^\/]+)\/?$/);
  if (articleMatch) {
    const [, rawCat, rawSlug] = articleMatch;
    // Skip if it's an admin or special route
    if (rawCat === 'admin' || rawCat === 'login' || rawCat === 'test-' || rawCat.startsWith('test-')) {
      return NextResponse.next();
    }
    
    const cat = slugify(decodeURIComponent(rawCat || ''));
    const slug = slugify(decodeURIComponent(rawSlug || ''));
    
    const canonical = `/${cat}/${slug}`;
    if (canonical !== pathname) {
      url.pathname = canonical;
      // 308 Permanent Redirect für SEO
      return NextResponse.redirect(url, 308);
    }
  }
  
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const sub = host.split('.')[0];
  const res = NextResponse.next();
  
  if (sub && sub !== 'localhost') {
    res.headers.set('x-subdomain', sub);
  }
  
  // Add Content Security Policy for images
  // Allow images from self, https, and data URLs
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' https: data: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );
  
  // Additional security headers
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return res;
}