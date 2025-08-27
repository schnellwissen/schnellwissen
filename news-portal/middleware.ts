import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Protected routes that require authentication
const PROTECTED_PATHS = [
  '/admin',
  '/konto',
  '/leseliste',
];

// Auth routes that should redirect if already logged in
const AUTH_PATHS = [
  '/login',
  '/register',
];

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  
  // Skip static files and internal routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Create response that will be modified
  let response = NextResponse.next();
  
  // Performance & Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Cache-Control Headers für bessere Performance
  if (pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|ico|svg)$/i)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (!pathname.includes('.') && !pathname.startsWith('/api/')) {
    // HTML pages - kurzer Cache mit stale-while-revalidate
    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
  } else if (pathname.startsWith('/api/')) {
    // API responses - kein Cache
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
  
  // Check if path requires protection
  const isProtectedPath = PROTECTED_PATHS.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  const isAuthPath = AUTH_PATHS.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // Only check auth for protected or auth routes
  if (isProtectedPath || isAuthPath) {
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    // Handle protected routes
    if (isProtectedPath && !user) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Handle auth routes - redirect if already logged in
    // Skip redirect if signout parameter is present (user just logged out)
    if (isAuthPath && user && !url.searchParams.has('signout')) {
      const redirectTo = url.searchParams.get('redirectTo') || '/';
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};