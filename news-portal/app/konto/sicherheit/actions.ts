'use server';

import { supabaseServer, sbServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function changePasswordAction(formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  
  // Validate inputs
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Alle Felder sind erforderlich' };
  }
  
  if (newPassword !== confirmPassword) {
    return { error: 'Die neuen Passwörter stimmen nicht überein' };
  }
  
  if (newPassword.length < 6) {
    return { error: 'Das neue Passwort muss mindestens 6 Zeichen lang sein' };
  }
  
  try {
    const sb = await supabaseServer();
    
    // Get current user
    const { data: { user }, error: userError } = await sb.auth.getUser();
    if (userError || !user) {
      return { error: 'Nicht angemeldet' };
    }
    
    // Verify current password by attempting to sign in
    const { error: signInError } = await sb.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });
    
    if (signInError) {
      return { error: 'Das aktuelle Passwort ist falsch' };
    }
    
    // Update password
    const { error: updateError } = await sb.auth.updateUser({
      password: newPassword
    });
    
    if (updateError) {
      console.error('Password update error:', updateError);
      return { error: 'Fehler beim Ändern des Passworts' };
    }
    
    // KRITISCH: Session refresh nach Token-Rotation
    // Dies verhindert inkonsistente Session-States
    const { data: { session }, error: sessionError } = await sb.auth.getSession();
    
    if (sessionError) {
      console.error('Session refresh error:', sessionError);
    }
    
    // Revalidate the page to ensure fresh data
    revalidatePath('/konto/sicherheit');
    
    return { 
      success: true, 
      message: 'Passwort erfolgreich geändert' 
    };
    
  } catch (error) {
    console.error('Unexpected error changing password:', error);
    return { error: 'Ein unerwarteter Fehler ist aufgetreten' };
  }
}

export async function enable2FAAction() {
  try {
    const sb = await supabaseServer();
    
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) {
      return { error: 'Nicht angemeldet' };
    }
    
    // Enable 2FA logic would go here
    // For now, just return a placeholder
    return { 
      error: '2FA ist derzeit noch nicht verfügbar' 
    };
    
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    return { error: 'Fehler beim Aktivieren der 2FA' };
  }
}

export async function deleteAccountAction() {
  try {
    const sb = await supabaseServer();
    
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) {
      return { error: 'Nicht angemeldet' };
    }
    
    // Account deletion would require additional confirmation
    // For safety, we're not implementing immediate deletion
    return { 
      error: 'Kontolöschung muss über den Support angefordert werden' 
    };
    
  } catch (error) {
    console.error('Error deleting account:', error);
    return { error: 'Fehler beim Löschen des Kontos' };
  }
}