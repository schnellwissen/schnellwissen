import { supabaseServer } from '@/lib/supabase/server';

export type UserProfile = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
};

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const sb = await supabaseServer();
    
    // Get current user from auth
    const { data: { user }, error: authError } = await sb.auth.getUser();
    
    if (authError || !user) {
      return null;
    }

    // Get profile data - use maybeSingle to avoid errors if profile doesn't exist
    const { data: profile } = await sb
      .from('profiles')
      .select('display_name, avatar_url, bio')
      .eq('id', user.id)
      .maybeSingle();

    // If profile doesn't exist yet, try to create it
    if (!profile) {
      const { data: newProfile } = await sb
        .from('profiles')
        .insert({ id: user.id })
        .select()
        .maybeSingle();
      
      return {
        id: user.id,
        email: user.email ?? '',
        displayName: newProfile?.display_name ?? null,
        avatarUrl: newProfile?.avatar_url ?? null,
        bio: newProfile?.bio ?? null,
      };
    }

    return {
      id: user.id,
      email: user.email ?? '',
      displayName: profile.display_name ?? null,
      avatarUrl: profile.avatar_url ?? null,
      bio: profile.bio ?? null,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function getInitials(displayName: string | null, email: string): string {
  const source = displayName || email;
  
  // If it's an email, use the part before @
  const base = source.includes('@') ? source.split('@')[0] : source;
  
  // Split by spaces or special characters
  const parts = base.trim().split(/[\s._-]+/);
  
  // Take first letter of first two parts
  const initials = parts
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .filter(Boolean)
    .join('');
  
  return initials || 'U';
}

export function getDisplayLabel(displayName: string | null, email: string): string {
  return displayName || email.split('@')[0];
}