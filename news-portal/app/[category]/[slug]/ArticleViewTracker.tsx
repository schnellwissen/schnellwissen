'use client';

import { useCountView } from '@/hooks/useCountView';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

interface ArticleViewTrackerProps {
  articleId: string;
}

export default function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);
  
  useCountView(articleId);
  useReadingProgress({ articleId, userId });
  
  return null; // This component doesn't render anything
}