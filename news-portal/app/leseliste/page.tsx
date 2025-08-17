import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import ReadingListClient from './ReadingListClient';

async function getReadingHistory(userId: string) {
  const supabase = await supabaseServer();
  
  const { data: readingProgress, error: readingError } = await supabase
    .from('reading_progress')
    .select(`
      id,
      progress_percent,
      last_read_at,
      reading_time_seconds,
      article:articles!inner (
        id,
        title,
        slug,
        category,
        excerpt,
        cover_image,
        author_name,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('last_read_at', { ascending: false })
    .limit(20);

  if (readingError) {
    console.error('Error fetching reading history:', readingError);
    return [];
  }

  return readingProgress || [];
}

async function getBookmarks(userId: string) {
  const supabase = await supabaseServer();
  
  const { data: bookmarks, error: bookmarksError } = await supabase
    .from('bookmarks')
    .select(`
      id,
      created_at,
      article:articles!inner (
        id,
        title,
        slug,
        category,
        excerpt,
        cover_image,
        author_name,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (bookmarksError) {
    console.error('Error fetching bookmarks:', bookmarksError);
    return [];
  }

  return bookmarks || [];
}

export default async function LeseListe() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/leseliste');
  }

  const [readingHistory, bookmarks] = await Promise.all([
    getReadingHistory(user.id),
    getBookmarks(user.id)
  ]);

  return (
    <div className="min-h-screen bg-bg py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-text mb-8">Meine Leseliste</h1>
        
        <ReadingListClient
          initialReadingHistory={readingHistory as any}
          initialBookmarks={bookmarks as any}
          userId={user.id}
        />
      </div>
    </div>
  );
}