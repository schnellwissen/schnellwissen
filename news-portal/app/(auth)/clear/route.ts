import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Temporary route for clearing all cookies during development
export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // Clear ALL auth-related cookies
  allCookies.forEach(cookie => {
    if (
      cookie.name.startsWith('sb-') ||
      cookie.name.includes('supabase') ||
      cookie.name.includes('auth') ||
      cookie.name.startsWith('sw_')
    ) {
      cookieStore.set(cookie.name, '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0)
      });
    }
  });
  
  return NextResponse.json({ 
    message: 'All auth cookies cleared',
    clearedCount: allCookies.filter(c => 
      c.name.startsWith('sb-') || 
      c.name.includes('supabase') || 
      c.name.includes('auth') ||
      c.name.startsWith('sw_')
    ).length
  });
}