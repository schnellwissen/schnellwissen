'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle({ userId }: { userId?: string }) {
  const [theme, setTheme] = useState<string>('system');
  
  useEffect(() => {
    // Get initial theme from localStorage or cookie
    const storedTheme = localStorage.getItem('sw_theme');
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // Check cookie
      const cookieTheme = document.cookie
        .split('; ')
        .find(row => row.startsWith('sw_theme='))
        ?.split('=')[1];
      if (cookieTheme) {
        setTheme(cookieTheme);
      }
    }
  }, []);

  function applyTheme(next: string) {
    setTheme(next);
    localStorage.setItem('sw_theme', next);
    
    // Update HTML class
    const html = document.documentElement;
    if (next === 'dark') {
      html.classList.add('dark');
    } else if (next === 'light') {
      html.classList.remove('dark');
    } else {
      // System - check preference
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      html.classList.toggle('dark', mql.matches);
    }
    
    // Set cookie for SSR
    document.cookie = `sw_theme=${next}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div className="inline-flex rounded-lg ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800">
      {['light', 'dark', 'system'].map(t => (
        <button
          key={t}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            theme === t 
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          } ${
            t === 'light' ? 'rounded-l-lg' : t === 'system' ? 'rounded-r-lg' : ''
          }`}
          onClick={() => applyTheme(t)}
        >
          {t === 'light' ? (
            <>
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Hell
            </>
          ) : t === 'dark' ? (
            <>
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Dunkel
            </>
          ) : (
            <>
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              System
            </>
          )}
        </button>
      ))}
    </div>
  );
}