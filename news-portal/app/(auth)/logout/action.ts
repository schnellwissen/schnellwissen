'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { sbServer } from '@/lib/supabase/server';

export async function signOutAction() {
  // Sign out from Supabase
  const sb = await sbServer();
  await sb.auth.signOut();
  
  // Clear all auth-related cookies
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // Clear auth cookies
  allCookies
    .filter(({ name }) => 
      name.startsWith('sb-') || 
      name.includes('supabase-auth-token') || 
      name.startsWith('sw_auth_')
    )
    .forEach(({ name }) => {
      cookieStore.set(name, '', { 
        path: '/', 
        maxAge: 0,
        expires: new Date(0)
      });
    });
  
  redirect('/login?signout=1');
}