'use server';

import { sbServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleBookmark(articleId: string) {
  const sb = await sbServer();
  const { data: { user } } = await sb.auth.getUser();
  
  if (!user) {
    throw new Error('Nicht angemeldet');
  }

  // Check if bookmark exists
  const { data: existing } = await sb
    .from('bookmarks')
    .select('article_id')
    .eq('user_id', user.id)
    .eq('article_id', articleId)
    .maybeSingle();

  if (existing) {
    // Remove bookmark
    const { error } = await sb
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('article_id', articleId);
      
    if (error) throw error;
    
    revalidatePath('/merken');
    return { bookmarked: false };
  } else {
    // Add bookmark
    const { error } = await sb
      .from('bookmarks')
      .insert({ 
        user_id: user.id, 
        article_id: articleId 
      });
      
    if (error) throw error;
    
    revalidatePath('/merken');
    return { bookmarked: true };
  }
}

export async function isBookmarked(articleId: string): Promise<boolean> {
  const sb = await sbServer();
  const { data: { user } } = await sb.auth.getUser();
  
  if (!user) return false;

  const { data } = await sb
    .from('bookmarks')
    .select('article_id')
    .eq('user_id', user.id)
    .eq('article_id', articleId)
    .maybeSingle();

  return !!data;
}