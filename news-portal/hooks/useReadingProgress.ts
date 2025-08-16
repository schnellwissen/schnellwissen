'use client';

import { useEffect, useRef, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { debounce } from 'lodash';

interface UseReadingProgressProps {
  articleId: string;
  userId?: string | null;
}

export function useReadingProgress({ articleId, userId }: UseReadingProgressProps) {
  const startTimeRef = useRef<number>(Date.now());
  const readingTimeRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const calculateProgress = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    
    const totalScrollableHeight = documentHeight - windowHeight;
    const progressPercent = totalScrollableHeight > 0 
      ? Math.min(100, Math.round((scrollTop / totalScrollableHeight) * 100))
      : 0;

    return {
      progressPercent,
      scrollPosition: Math.round(scrollTop)
    };
  }, []);

  const updateProgress = useCallback(
    debounce(async () => {
      if (!userId || !articleId) return;

      const now = Date.now();
      const sessionTime = Math.floor((now - startTimeRef.current) / 1000);
      const totalTime = readingTimeRef.current + sessionTime;
      
      const { progressPercent, scrollPosition } = calculateProgress();

      // Only update if significant time has passed (5 seconds) or progress changed significantly (10%)
      const timeSinceLastUpdate = now - lastUpdateRef.current;
      if (timeSinceLastUpdate < 5000 && Math.abs(progressPercent - 0) < 10) {
        return;
      }

      const supabase = supabaseBrowser();
      
      try {
        const { error } = await supabase
          .from('reading_progress')
          .upsert({
            user_id: userId,
            article_id: articleId,
            progress_percent: progressPercent,
            scroll_position: scrollPosition,
            reading_time_seconds: totalTime,
            last_read_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,article_id'
          });

        if (!error) {
          lastUpdateRef.current = now;
        }
      } catch (err) {
        console.error('Error updating reading progress:', err);
      }
    }, 1000),
    [userId, articleId, calculateProgress]
  );

  // Load existing progress on mount
  useEffect(() => {
    async function loadProgress() {
      if (!userId || !articleId) return;

      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('reading_progress')
        .select('reading_time_seconds, scroll_position')
        .eq('user_id', userId)
        .eq('article_id', articleId)
        .single();

      if (data && !error) {
        readingTimeRef.current = data.reading_time_seconds || 0;
        
        // Restore scroll position if available
        if (data.scroll_position > 0) {
          setTimeout(() => {
            window.scrollTo({
              top: data.scroll_position,
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    }

    loadProgress();
  }, [userId, articleId]);

  // Track scroll and time
  useEffect(() => {
    if (!userId) return;

    const handleScroll = () => {
      updateProgress();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Save progress when user leaves the page
        updateProgress.flush();
      } else {
        // Reset start time when user returns
        startTimeRef.current = Date.now();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial update
    updateProgress();

    return () => {
      // Save final progress when unmounting
      updateProgress.flush();
      
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, updateProgress]);

  // Save progress on page unload
  useEffect(() => {
    if (!userId) return;

    const handleBeforeUnload = () => {
      updateProgress.flush();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userId, updateProgress]);

  return null;
}