import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Auth middleware helper for protecting routes and refreshing sessions
 */
export async function withAuth(
  request: NextRequest,
  response: NextResponse = NextResponse.next()
) {
  // Create a Supabase client configured for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if exists
  const { data: { user }, error } = await supabase.auth.getUser();
  
  return { user, response, error };
}

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = [
    '/admin',
    '/konto',
    '/leseliste',
  ];
  
  return protectedPaths.some(path => pathname.startsWith(path));
}

/**
 * Check if a route is auth-related (login, register, etc)
 */
export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth/') || pathname === '/login';
}