'use client';

import { useEffect, useRef, useState } from 'react';

// Get or create a unique client ID (stored in localStorage)
function getClientId(): string {
  if (typeof window === 'undefined') return '';
  
  const CLIENT_ID_KEY = 'cid';
  let clientId = localStorage.getItem(CLIENT_ID_KEY);
  
  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }
  
  return clientId;
}

// Generate SHA-256 hash
async function generateFingerprint(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface ViewCounts {
  total: number;
  d30: number;
}

/**
 * Hook to count article views with deduplication and bot protection
 * - React Strict Mode safe (only fires once)
 * - Returns current view counts
 * - Client-side deduplication (12h in prod, 1min in dev)
 */
export function useCountView(articleId: string | null | undefined): ViewCounts {
  const hasCountedRef = useRef(false); // Strict Mode guard
  const [counts, setCounts] = useState<ViewCounts>({ total: 0, d30: 0 });

  useEffect(() => {
    // Skip if no articleId or already counted (Strict Mode protection)
    if (!articleId || hasCountedRef.current) return;

    const incrementView = async () => {
      try {
        // Client-side deduplication check
        const VIEW_KEY = `view:${articleId}`;
        const lastViewTime = localStorage.getItem(VIEW_KEY);
        const now = Date.now();
        const DEDUPE_WINDOW = process.env.NODE_ENV === 'development' 
          ? 60 * 1000      // 1 minute in development
          : 12 * 60 * 60 * 1000; // 12 hours in production

        if (lastViewTime) {
          const timeSinceLastView = now - Number(lastViewTime);
          if (timeSinceLastView < DEDUPE_WINDOW) {
            console.log('[useCountView] Client-side dedupe: already counted within window');
            // Still fetch current counts even if not incrementing
            try {
              const response = await fetch('/api/views/increment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  articleId,
                  fingerprint: 'fetch-only'
                }),
              });
              if (response.ok) {
                const data = await response.json();
                setCounts({ 
                  total: data.views_total || 0, 
                  d30: data.views_30d || 0 
                });
              }
            } catch (error) {
              console.error('[useCountView] Error fetching current views:', error);
            }
            return;
          }
        }

        // Generate fingerprint for server-side deduplication
        const clientId = getClientId();
        const fingerprint = await generateFingerprint(`${articleId}:${clientId}`);

        // Send view increment request
        const response = await fetch('/api/views/increment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            articleId,
            fingerprint,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('[useCountView] Response:', data);
          
          // Update counts with server response
          setCounts({ 
            total: data.views_total || 0, 
            d30: data.views_30d || 0 
          });
          
          // Mark as counted (Strict Mode guard)
          hasCountedRef.current = true;
          
          // Store timestamp for client-side deduplication
          if (data.counted) {
            localStorage.setItem(VIEW_KEY, String(now));
          }
        } else {
          console.error('[useCountView] Failed to track view:', response.status);
        }
      } catch (error) {
        console.error('[useCountView] Error tracking view:', error);
      }
    };

    // Only count when page is visible (avoid pre-renders)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !hasCountedRef.current) {
        // Small delay to avoid counting previews/pre-renders
        setTimeout(incrementView, 400);
      }
    };

    // Check if page is already visible
    if (document.visibilityState === 'visible') {
      setTimeout(incrementView, 400);
    } else {
      // Wait for page to become visible
      document.addEventListener('visibilitychange', handleVisibility, { once: true });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [articleId]);

  return counts;
}