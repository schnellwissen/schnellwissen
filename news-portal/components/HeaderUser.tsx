'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';
import { signOutAction } from '@/app/auth/signout/action';

export type UserProfile = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
};

export function getInitials(displayName: string | null, email: string): string {
  const source = displayName || email;
  const base = source.includes('@') ? source.split('@')[0] : source;
  const parts = base.trim().split(/[\s._-]+/);
  const initials = parts
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .filter(Boolean)
    .join('');
  return initials || 'U';
}

export function getDisplayLabel(displayName: string | null, email: string): string {
  return displayName || email.split('@')[0];
}

interface HeaderUserProps {
  initialUser: UserProfile | null;
}

export default function HeaderUser({ initialUser }: HeaderUserProps) {
  const [user, setUser] = useState<UserProfile | null>(initialUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  // Check auth state on mount and listen for changes
  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        const supabase = supabaseBrowser();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, avatar_url, bio')
            .eq('id', session.user.id)
            .single();
          
          if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email ?? '',
              displayName: profile?.display_name ?? null,
              avatarUrl: profile?.avatar_url ?? null,
              bio: profile?.bio ?? null,
            });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    
    // Check auth state
    checkAuth();
    
    // Listen for auth changes
    const supabase = supabaseBrowser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, avatar_url, bio')
            .eq('id', session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email ?? '',
            displayName: profile?.display_name ?? null,
            avatarUrl: profile?.avatar_url ?? null,
            bio: profile?.bio ?? null,
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          router.refresh();
        }
      }
    );
    
    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  // Navigation handlers with debugging
  const handleLoginClick = () => {
    console.log('Login button clicked!');
    window.location.href = '/auth/login';
  };

  const handleRegisterClick = () => {
    console.log('Register button clicked!');
    window.location.href = '/auth/register';
  };

  // Not logged in - show login/register buttons
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <a
          href="/auth/login"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 inline-block"
        >
          Anmelden
        </a>
        <a
          href="/auth/register"
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Registrieren
        </a>
      </div>
    );
  }

  const displayLabel = getDisplayLabel(user.displayName, user.email);
  const initials = getInitials(user.displayName, user.email);

  // Logged in - show user menu
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-2 py-1 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all"
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-label="Benutzermenü"
      >
        {/* Avatar */}
        {user.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt={displayLabel} 
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="grid h-8 w-8 place-content-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white">
            {initials}
          </span>
        )}
        
        {/* Display name/email - hidden on mobile */}
        <span className="hidden sm:block max-w-[150px] truncate text-sm font-medium text-gray-700">
          {displayLabel}
        </span>
        
        {/* Dropdown arrow */}
        <svg 
          className={`h-4 w-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <path 
            d="M6 9l6 6 6-6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700"
        >
          {/* User info in dropdown (visible on mobile) */}
          <div className="sm:hidden px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
            <p className="text-sm font-medium text-gray-900 truncate">{displayLabel}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          
          <button
            onClick={() => {
              setIsMenuOpen(false);
              router.push('/konto');
            }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mein Profil
          </button>
          
          <button
            onClick={() => {
              setIsMenuOpen(false);
              router.push('/leseliste');
            }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Leseliste
          </button>
          
          <button
            onClick={() => {
              setIsMenuOpen(false);
              router.push('/konto/darstellung');
            }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Einstellungen
          </button>
          
          <div className="my-2 border-t border-gray-100 dark:border-gray-700"></div>
          
          <form 
            action={async () => {
              setIsLoading(true);
              setIsMenuOpen(false);
              await signOutAction();
            }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isLoading ? 'Abmelden...' : 'Abmelden'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}