'use client';

import { supabaseBrowser } from '@/lib/supabase/client';

/**
 * Client-side logout helper that clears local storage and session
 */
export async function clientLogout() {
  try {
    // Clear any client-side storage
    if (typeof window !== 'undefined') {
      // Clear localStorage items related to auth
      localStorage.removeItem('supabase.auth.token');
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Signal logout to all tabs
      const bc = new BroadcastChannel('auth');
      bc.postMessage({ type: 'logout' });
      bc.close();
    }
    
    // Also sign out from client-side Supabase
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error('Client logout error:', error);
  }
}

/**
 * Listen for logout signals across tabs
 */
export function listenForLogout(callback: () => void) {
  if (typeof window === 'undefined') return;
  
  const bc = new BroadcastChannel('auth');
  bc.onmessage = (event) => {
    if (event.data?.type === 'logout') {
      callback();
    }
  };
  
  // Also check for logout signal cookie
  const checkLogoutSignal = () => {
    const cookies = document.cookie.split(';');
    const hasLogoutSignal = cookies.some(c => c.trim().startsWith('sw_logout_signal='));
    
    if (hasLogoutSignal) {
      // Clear the signal cookie
      document.cookie = 'sw_logout_signal=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      callback();
    }
  };
  
  // Check periodically for logout signal
  const interval = setInterval(checkLogoutSignal, 1000);
  
  return () => {
    bc.close();
    clearInterval(interval);
  };
}