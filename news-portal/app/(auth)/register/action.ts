'use server';

import { redirect } from 'next/navigation';
import { sbServer } from '@/lib/supabase/server';

export async function registerAction(_: any, formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  if (!email || !password) {
    return { ok: false, message: 'Bitte alle Felder ausfüllen' };
  }

  if (password !== confirmPassword) {
    return { ok: false, message: 'Passwörter stimmen nicht überein' };
  }

  if (password.length < 6) {
    return { ok: false, message: 'Passwort muss mindestens 6 Zeichen lang sein' };
  }

  const sb = await sbServer();
  
  const { error } = await sb.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    }
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect('/login?registered=1');
}