'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import SearchBox from '@/components/SearchBox';

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = supabaseBrowser();
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.is_admin || false);
          });
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className="flex items-center flex-1 min-w-0">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {/* Logo - kompakter auf Mobile */}
        <Link href="/" className="flex items-center flex-shrink-0 text-white">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-xl">SW</span>
          </div>
          <span className="hidden lg:inline ml-2 text-lg font-bold">Schnell Wissen</span>
        </Link>

        {/* Search Box - nur auf größeren Screens */}
        <div className="hidden md:block flex-1 max-w-xl mx-2">
          <SearchBox />
        </div>

        {/* Navigation Items - auf Mobile ausblenden oder kleiner */}
        <div className="hidden sm:flex items-center">
          <Link href="/" className="text-white/80 hover:text-white font-medium px-2 sm:px-3 py-1 sm:py-2 text-sm rounded-md hover:bg-white/10 transition-all">
            Startseite
          </Link>
          
          {isAdmin && (
            <Link href="/admin" className="text-white/80 hover:text-white font-medium px-2 sm:px-3 py-1 sm:py-2 text-sm rounded-md hover:bg-white/10 transition-all">
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}