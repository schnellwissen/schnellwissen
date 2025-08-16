'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
  articleId: string;
  className?: string;
  showText?: boolean;
}

export default function BookmarkButton({ articleId, className = '', showText = false }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Check if article is bookmarked on mount
  useEffect(() => {
    async function checkBookmark() {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setUserId(null);
        return;
      }
      
      setUserId(user.id);
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('article_id', articleId)
        .single();
      
      if (data && !error) {
        setIsBookmarked(true);
      }
    }
    
    checkBookmark();
  }, [articleId]);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    // Prevent any parent link from being triggered
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      toast.error('Bitte melden Sie sich an, um Artikel zu speichern');
      router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsLoading(true);
    const supabase = supabaseBrowser();

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('article_id', articleId);

        if (error) throw error;
        
        setIsBookmarked(false);
        toast.success('Artikel aus Leseliste entfernt');
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: userId,
            article_id: articleId
          });

        if (error) {
          // Check if it's a duplicate error
          if (error.code === '23505') {
            setIsBookmarked(true);
            return;
          }
          throw error;
        }
        
        setIsBookmarked(true);
        toast.success('Artikel zur Leseliste hinzugefügt');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Fehler beim Speichern des Artikels');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
        showText 
          ? `px-4 py-2 rounded-lg ${
              isBookmarked 
                ? 'bg-primary text-white hover:bg-primary-dark' 
                : 'bg-gray-100 dark:bg-gray-800 text-text hover:bg-gray-200 dark:hover:bg-gray-700'
            }`
          : `p-2 rounded-full ${
              isBookmarked 
                ? 'text-amber-500 hover:text-amber-600' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`
      } ${className}`}
      aria-label={isBookmarked ? 'Artikel aus Leseliste entfernen' : 'Artikel zur Leseliste hinzufügen'}
    >
      {isBookmarked ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )}
      {showText && (
        <span className="font-medium">
          {isBookmarked ? 'Gespeichert' : 'Speichern'}
        </span>
      )}
    </button>
  );
}