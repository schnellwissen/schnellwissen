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
    <nav className="flex items-center flex-1">
      <div className="flex items-center gap-6 flex-1">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary dark:text-blue-400">
          <div className="w-10 h-10 bg-primary dark:bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">SW</span>
          </div>
          <span className="hidden sm:inline">Schnell Wissen</span>
        </Link>

        {/* Search Box */}
        <div className="flex-1 max-w-xl mx-4">
          <SearchBox />
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 font-medium px-3 py-2 rounded-md hover:bg-primary/10 dark:hover:bg-blue-900/20 transition-all">
            Startseite
          </Link>
          
          {isAdmin && (
            <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 font-medium px-3 py-2 rounded-md hover:bg-primary/10 dark:hover:bg-blue-900/20 transition-all">
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}