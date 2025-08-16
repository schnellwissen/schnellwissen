'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  cover_image: string | null;
  author_name: string;
  created_at: string;
}

interface ReadingProgress {
  id: string;
  progress_percent: number;
  last_read_at: string;
  reading_time_seconds: number;
  article: Article;
}

interface Bookmark {
  id: string;
  created_at: string;
  article: Article;
}

interface ReadingListClientProps {
  initialReadingHistory: ReadingProgress[];
  initialBookmarks: Bookmark[];
  userId: string;
}

export default function ReadingListClient({
  initialReadingHistory,
  initialBookmarks,
  userId
}: ReadingListClientProps) {
  const [activeTab, setActiveTab] = useState<'reading' | 'bookmarks'>('reading');
  const [readingHistory] = useState(initialReadingHistory);
  const [bookmarks] = useState(initialBookmarks);

  const formatReadingTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} Sek.`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} Min.`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} Std. ${remainingMinutes} Min.`;
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('reading')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'reading'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Zuletzt gelesen ({readingHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'bookmarks'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Gespeicherte Artikel ({bookmarks.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'reading' ? (
        <div className="space-y-4">
          {readingHistory.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-text-muted text-lg">Noch keine gelesenen Artikel</p>
              <p className="text-text-muted text-sm mt-2">Artikel, die Sie lesen, werden hier angezeigt</p>
            </div>
          ) : (
            readingHistory.map((item) => (
              <article key={item.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  {item.article.cover_image && (
                    <img
                      src={item.article.cover_image}
                      alt={item.article.title}
                      className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link
                          href={`/${item.article.category}/${item.article.slug}`}
                          className="text-lg font-semibold text-text hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.article.title}
                        </Link>
                        <p className="text-sm text-text-muted mt-1 line-clamp-2">
                          {item.article.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDistanceToNow(new Date(item.last_read_at), { locale: de, addSuffix: true })}
                          </span>
                          {item.progress_percent > 0 && (
                            <span className="flex items-center gap-1">
                              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${item.progress_percent}%` }}
                                />
                              </div>
                              <span>{item.progress_percent}%</span>
                            </span>
                          )}
                          {item.reading_time_seconds > 0 && (
                            <span>{formatReadingTime(item.reading_time_seconds)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-text-muted text-lg">Keine gespeicherten Artikel</p>
              <p className="text-text-muted text-sm mt-2">Speichern Sie Artikel, um sie später zu lesen</p>
            </div>
          ) : (
            bookmarks.map((bookmark) => (
              <article key={bookmark.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  {bookmark.article.cover_image && (
                    <img
                      src={bookmark.article.cover_image}
                      alt={bookmark.article.title}
                      className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link
                          href={`/${bookmark.article.category}/${bookmark.article.slug}`}
                          className="text-lg font-semibold text-text hover:text-primary transition-colors line-clamp-2"
                        >
                          {bookmark.article.title}
                        </Link>
                        <p className="text-sm text-text-muted mt-1 line-clamp-2">
                          {bookmark.article.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                          <span>{bookmark.article.author_name}</span>
                          <span>•</span>
                          <span>
                            Gespeichert {formatDistanceToNow(new Date(bookmark.created_at), { locale: de, addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}