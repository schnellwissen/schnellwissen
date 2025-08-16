'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Profile page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-text mb-2">
            Etwas ist schiefgelaufen
          </h2>
          
          <p className="text-text-muted mb-6">
            Beim Laden Ihres Profils ist ein Fehler aufgetreten.
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Erneut versuchen
            </button>
            <Link
              href="/"
              className="px-6 py-2 bg-gray-200 text-text rounded-lg hover:bg-gray-300 transition-colors"
            >
              Zur Startseite
            </Link>
          </div>
          
          {error.digest && (
            <p className="text-xs text-text-muted mt-4">
              Fehler-ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}