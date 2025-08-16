import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Creates a Supabase server client with proper cookie handling for SSR
 * This is the ONLY server client we use - no duplicates!
 */
export async function sbServer() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // ANON key only, never service role!
    {
      cookies: {
        get: (name: string) => {
          return cookieStore.get(name)?.value;
        },
        set: (name: string, value: string, options: any) => {
          cookieStore.set(name, value, options);
        },
        remove: (name: string, options: any) => {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
}

// Compatibility alias for existing code
export const supabaseServer = sbServer;

/**
 * Helper to clear ALL auth-related cookies properly
 * This is critical for logout to work correctly
 */
export const clearAllAuthCookies = async () => {
  const cookieStore = await cookies();
  
  // Get ALL cookies
  const allCookies = cookieStore.getAll();
  
  // Project ref from Supabase URL
  const projectRef = 'uabmwhtoimelqpuhyluz';
  
  // Clear each auth-related cookie
  const authCookiePatterns = [
    'sb-',
    'supabase',
    'auth',
    'sw_auth_remember',
    'sw_logout_signal'
  ];
  
  allCookies.forEach(cookie => {
    // Check if this is an auth cookie
    if (authCookiePatterns.some(pattern => cookie.name.includes(pattern))) {
      try {
        // Use set with maxAge 0 to delete
        cookieStore.set(cookie.name, '', {
          path: '/',
          maxAge: 0,
          expires: new Date(0),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      } catch (e) {
        console.error(`Failed to clear cookie ${cookie.name}:`, e);
      }
    }
  });
  
  // Explicitly clear known Supabase patterns
  const knownPatterns = [
    `sb-${projectRef}-auth-token`,
    `sb-${projectRef}-auth-token-code-verifier`,
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token'
  ];
  
  knownPatterns.forEach(name => {
    try {
      cookieStore.set(name, '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0)
      });
    } catch (e) {
      // Cookie might not exist
    }
  });
};