'use server';

import { supabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function changePassword(formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Alle Felder müssen ausgefüllt werden' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Die neuen Passwörter stimmen nicht überein' };
  }

  if (newPassword.length < 6) {
    return { error: 'Das neue Passwort muss mindestens 6 Zeichen lang sein' };
  }

  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Nicht angemeldet' };
  }

  // For authenticated users, Supabase allows password update without verifying the old password
  // If you want to verify the old password, you would need to create a custom RPC function in Supabase
  
  // Update password directly
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (updateError) {
    // If there's an error, it might be because the session is invalid
    if (updateError.message.includes('not authenticated')) {
      return { error: 'Sitzung abgelaufen. Bitte melde dich erneut an.' };
    }
    return { error: 'Fehler beim Ändern des Passworts: ' + updateError.message };
  }

  revalidatePath('/konto');
  return { success: 'Passwort erfolgreich geändert' };
}