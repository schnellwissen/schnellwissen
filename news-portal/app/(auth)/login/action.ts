'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { sbServer } from '@/lib/supabase/server';

export async function loginAction(_: any, formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const remember = formData.get('remember') === 'on';

  if (!email || !password) {
    return { ok: false, message: 'Bitte E-Mail und Passwort eingeben' };
  }

  const sb = await sbServer();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  
  if (error) {
    return { ok: false, message: error.message };
  }

  // Set remember-me cookie
  const maxAge = remember ? 60 * 60 * 24 * 30 : undefined; // 30 days
  const cookieStore = await cookies();
  
  cookieStore.set('sw_auth_remember', remember ? '1' : '0', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    ...(remember ? { maxAge } : {})
  });

  redirect('/');
}