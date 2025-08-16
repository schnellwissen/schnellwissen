'use client';

import { useEffect } from 'react';
import { useFormStatus } from 'react-dom';

export function DisplayEnhance() {
  const { pending } = useFormStatus();

  useEffect(() => {
    // Apply changes immediately when form is submitted
    if (pending) {
      const theme = (document.querySelector('input[name="theme"]:checked') as HTMLInputElement)?.value || 'system';

      // Apply theme
      const html = document.documentElement;
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const wantDark = theme === 'dark' || (theme === 'system' && mql.matches);
      html.classList.toggle('dark', wantDark);

      // Persist to localStorage for next visit
      localStorage.setItem('sw_prefs', JSON.stringify({ theme }));
    }
  }, [pending]);

  // Also apply changes when radio buttons change (for instant preview)
  useEffect(() => {
    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.matches('input[type="radio"][name="theme"]')) return;

      const theme = target.value;

      // Apply theme
      const html = document.documentElement;
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const wantDark = theme === 'dark' || (theme === 'system' && mql.matches);
      html.classList.toggle('dark', wantDark);

      // Don't persist to localStorage yet (wait for save)
    };

    document.addEventListener('change', handleChange);
    return () => document.removeEventListener('change', handleChange);
  }, []);

  return null;
}