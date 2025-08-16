'use client';

import { useSearchParams } from 'next/navigation';
import { useSearch, useHighlight } from '@/hooks/useSearch';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import { useEffect } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const {
    query,
    setQuery,
    searchNow,
    results,
    suggestions,
    isLoading,
    error,
    count,
    isFallback
  } = useSearch(initialQuery);

  // Update search when URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchQuery = formData.get('q') as string;
    if (searchQuery?.trim().length >= 2) {
      window.history.pushState({}, '', `/suche?q=${encodeURIComponent(searchQuery)}`);
      searchNow(searchQuery);
    }
  };

  // Highlight helper for displaying results
  const HighlightedText = ({ text, className }: { text: string; className?: string }) => {
    const highlighted = useHighlight(text, query);
    return (
      <span 
        className={className} 
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Header */}
      <section className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Artikel suchen</h1>
          
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="flex gap-3">
              <input
                type="search"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 rounded-lg px-4 py-2.5 border border-gray-300 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nach Artikeln suchen... (z.B. ETF, Steuern)"
                autoFocus
                minLength={2}
              />
              <button
                type="submit"
                disabled={query.trim().length < 2}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium rounded-lg px-6 py-2.5 transition-colors"
              >
                Suchen
              </button>
            </div>
            {query.length > 0 && query.length < 2 && (
              <p className="text-sm text-amber-600 mt-2">
                Bitte geben Sie mindestens 2 Zeichen ein.
              </p>
            )}
          </form>

          {/* Search quality indicator */}
          {results.length > 0 && !isLoading && !isFallback && (
            <div className="mt-3 flex items-center gap-3 text-sm">
              {results[0]?.score?.prefix && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  ✓ Exakte Übereinstimmung
                </span>
              )}
              {results[0]?.score?.trigram && results[0].score.trigram > 0.5 && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  ~ Ähnliche Treffer
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600">Suche läuft...</p>
          </div>
        ) : error ? (
          <div className="card p-8 text-center max-w-2xl mx-auto">
            <p className="text-lg text-slate-600">
              {error === 'min_length' ? 'Bitte geben Sie mindestens 2 Zeichen ein.' :
               error === 'rate_limit' ? 'Zu viele Suchanfragen. Bitte warten Sie einen Moment.' :
               error === 'search_unavailable' ? 'Die Suche ist momentan nicht verfügbar. Bitte versuchen Sie es später erneut.' :
               error === 'search_error' ? 'Bei der Suche ist ein Fehler aufgetreten.' :
               'Keine Ergebnisse gefunden.'}
            </p>
          </div>
        ) : query && query.length >= 2 ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {count > 0 
                  ? `${count} ${count === 1 ? 'Ergebnis' : 'Ergebnisse'} für "${query}"`
                  : `Keine Ergebnisse für "${query}"`
                }
              </h2>
            </div>

            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map((article) => (
                  <Link
                    key={article.id}
                    href={article.url}
                    className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                  >
                    <div className="flex gap-4">
                      {article.image && (
                        <img
                          src={`/api/img?u=${encodeURIComponent(article.image)}&kind=thumb`}
                          alt=""
                          className="w-32 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            <HighlightedText text={article.title} />
                          </h3>
                          {article.score && (
                            <div className="flex gap-1 ml-2 flex-shrink-0">
                              {article.score.prefix && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded" title="Präfix-Treffer">
                                  ✓
                                </span>
                              )}
                              {article.score.trigram && article.score.trigram > 0.5 && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded" title={`Ähnlichkeit: ${Math.round(article.score.trigram * 100)}%`}>
                                  ~{Math.round(article.score.trigram * 100)}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {article.excerpt && (
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                            <HighlightedText text={article.excerpt} />
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="text-primary font-medium">{article.category}</span>
                          {article.publishedAt && (
                            <span>{new Date(article.publishedAt).toLocaleDateString('de-DE')}</span>
                          )}
                          {article.views > 0 && (
                            <span>{article.views.toLocaleString('de-DE')} Aufrufe</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border bg-white shadow-sm p-12 text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-slate-900 mb-2">
                  Keine Artikel gefunden
                </p>
                <p className="text-sm text-slate-600 mb-6">
                  Versuchen Sie es mit anderen Suchbegriffen oder durchsuchen Sie unsere Kategorien.
                </p>
                
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-slate-500 mb-3">Beliebte Themen:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setQuery(suggestion);
                            searchNow(suggestion);
                            window.history.pushState({}, '', `/suche?q=${encodeURIComponent(suggestion)}`);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <Link 
                    href="/" 
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Zur Startseite
                  </Link>
                  <Link 
                    href="/kategorie/finanzen" 
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-gray-50"
                  >
                    Kategorien durchsuchen
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : query && query.length < 2 ? (
          <div className="card p-8 text-center max-w-2xl mx-auto">
            <p className="text-lg text-slate-900">
              Bitte geben Sie mindestens 2 Zeichen ein.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border bg-white shadow-sm p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-900 mb-2">
              Wonach suchen Sie?
            </p>
            <p className="text-sm text-slate-600">
              Geben Sie mindestens 2 Zeichen ein, um die Suche zu starten.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}