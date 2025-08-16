import useSWR from 'swr';
import { useState, useEffect, useCallback } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
  views: number;
  url: string;
  score?: {
    prefix: boolean;
    trigram: number;
    fulltext: number;
  };
}

export interface SearchResponse {
  items: SearchResult[];
  query: string;
  suggestions: string[];
  count: number;
  error?: string;
  fallback?: boolean;
}

export function useSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Only search if query is at least 2 characters
  const shouldFetch = debouncedQuery.trim().length >= 2;
  
  const { data, error, isLoading, mutate } = useSWR<SearchResponse>(
    shouldFetch ? `/api/search?q=${encodeURIComponent(debouncedQuery)}` : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  // Immediate search function (bypasses debounce)
  const searchNow = useCallback((searchQuery: string) => {
    if (searchQuery.trim().length >= 2) {
      setQuery(searchQuery);
      setDebouncedQuery(searchQuery);
      mutate();
    }
  }, [mutate]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    setQuery,
    searchNow,
    clearSearch,
    results: data?.items || [],
    suggestions: data?.suggestions || [],
    isLoading,
    error: error || data?.error,
    count: data?.count || 0,
    isFallback: data?.fallback || false
  };
}

// Hook for highlighting search terms in text
export function useHighlight(text: string, query: string): string {
  if (!query || query.length < 2) return text;
  
  const terms = query.split(/\s+/).filter(t => t.length > 0);
  let highlightedText = text;
  
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  });
  
  return highlightedText;
}