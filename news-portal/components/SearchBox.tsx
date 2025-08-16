'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import Link from 'next/link';

export default function SearchBox() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    query,
    setQuery,
    searchNow,
    clearSearch,
    results,
    suggestions,
    isLoading,
    error,
    count
  } = useSearch();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setIsOpen(false);
      router.push(`/suche?q=${encodeURIComponent(query)}`);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (query.length >= 2) setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Suche nach Artikeln..."
          className="w-full px-4 py-2 pr-10 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text placeholder:text-text-muted"
          aria-label="Suche"
          autoComplete="off"
        />
        
        {/* Search Icon / Clear Button */}
        {query.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              clearSearch();
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Suche löschen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-label="Suchen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-text-muted">
              Suche läuft...
            </div>
          ) : error ? (
            <div className="px-4 py-3 text-sm text-red-500">
              {typeof error === 'string' ? error : 'Fehler bei der Suche'}
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="px-4 py-2 text-xs text-text-muted bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                {count} Ergebnis{count !== 1 ? 'se' : ''} gefunden
              </div>
              <div className="py-2">
                {results.slice(0, 5).map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {result.image && (
                        <img
                          src={`/api/img?u=${encodeURIComponent(result.image)}&kind=thumb`}
                          alt=""
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-text truncate">
                          {result.title}
                        </h4>
                        {result.excerpt && (
                          <p className="text-xs text-text-muted line-clamp-2 mt-1">
                            {result.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-primary">
                            {result.category}
                          </span>
                          {result.score?.prefix && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 rounded">
                              Exakt
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {count > 5 && (
                <Link
                  href={`/suche?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-center text-primary hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700"
                >
                  Alle {count} Ergebnisse anzeigen →
                </Link>
              )}
            </>
          ) : query.length >= 2 ? (
            <div className="px-4 py-3">
              <p className="text-sm text-text-muted mb-3">
                Keine Ergebnisse für "{query}"
              </p>
              {suggestions.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted mb-2">Beliebte Themen:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setQuery(suggestion);
                          searchNow(suggestion);
                        }}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-text"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}