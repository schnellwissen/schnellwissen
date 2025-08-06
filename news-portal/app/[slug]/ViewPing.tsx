'use client';
import { useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export function ViewPing({ id }: { id: string }) {
  useEffect(() => {
    const incrementViews = async () => {
      try {
        await supabaseBrowser().rpc('increment_article_views', { p_id: id });
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    };
    
    incrementViews();
  }, [id]);
  
  return null;
}