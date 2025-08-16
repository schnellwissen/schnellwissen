'use server';

import { sbServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function loadDisplayPrefs() {
  const sb = await sbServer();
  const { data: { user } } = await sb.auth.getUser();
  
  // Get theme from cookie
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('sw_theme')?.value || 'system';
  
  if (!user) {
    return { 
      theme: themeCookie, 
      guest: true 
    };
  }

  const { data } = await sb
    .from('profiles')
    .select('theme')
    .eq('id', user.id)
    .maybeSingle();

  return {
    theme: data?.theme || themeCookie || 'system',
    guest: false
  };
}

export async function saveDisplayPrefs(formData: FormData) {
  const theme = (formData.get('theme') as string) || 'system';

  // Save theme to cookie for immediate effect
  const cookieStore = await cookies();
  cookieStore.set('sw_theme', theme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  const sb = await sbServer();
  const { data: { user } } = await sb.auth.getUser();

  // Persist for logged-in users in database
  if (user) {
    await sb.from('profiles').upsert({
      id: user.id,
      theme,
      updated_at: new Date().toISOString()
    });
  }

  // Revalidate pages to update server components
  revalidatePath('/', 'layout');
  
  // Redirect to home page
  redirect('/');
}