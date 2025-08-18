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
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? 'Artikel aus Leseliste entfernen' : 'Artikel zur Leseliste hinzufügen'}
      className={`${
        showText 
          ? `inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all disabled:opacity-50 ${
              isBookmarked 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : 'bg-gray-100 dark:bg-gray-800 text-text hover:bg-gray-200 dark:hover:bg-gray-700'
            }`
          : [
              // Tap-Ziel mindestens 44x44px
              'h-11 w-11 min-h-[44px] min-w-[44px]',
              'flex items-center justify-center',
              // Glas-Badge für Kontrast auf JEDEM Bild
              'rounded-full backdrop-blur-md shadow-lg ring-1 ring-white/25',
              // Klare States: grün wenn aktiv, dunkel wenn inaktiv
              isBookmarked
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-black/55 text-white hover:bg-black/65 dark:bg-black/60',
              // Fokus & Interaktion
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/90',
              'transition-all active:scale-[0.98]',
              'disabled:opacity-50'
            ].join(' ')
      } ${className}`}
    >
      {/* Icon mit festen Farben, kein currentColor */}
      <svg 
        viewBox="0 0 24 24" 
        className={`${showText ? 'w-5 h-5' : 'w-6 h-6'} ${isBookmarked && !showText ? 'animate-[pop_140ms_ease-out]' : ''}`}
        aria-hidden="true"
      >
        {isBookmarked ? (
          // Gefülltes Lesezeichen (immer weiß)
          <path
            d="M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1z"
            className="fill-white"
          />
        ) : (
          // Outline Lesezeichen (immer weiß)
          <path
            d="M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1z"
            className="fill-transparent stroke-white"
            strokeWidth={1.9}
            strokeLinejoin="round"
          />
        )}
      </svg>
      {showText && (
        <span className="font-medium">
          {isBookmarked ? 'Gespeichert' : 'Speichern'}
        </span>
      )}
      <style jsx>{`
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </button>
  );
}