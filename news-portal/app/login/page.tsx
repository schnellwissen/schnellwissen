'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('schnellwissen5@gmail.com');
  const [password, setPassword] = useState('IboHimoPaul1!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const sb = supabaseBrowser();
    
    const { data, error } = await sb.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    
    // Check if admin
    const { data: profile } = await sb
      .from('profiles')
      .select('is_admin')
      .eq('id', data.user?.id || '')
      .single();
    
    console.log('Login successful:', { user: data.user, isAdmin: profile?.is_admin });
    
    setLoading(false);
    router.push('/admin/articles');
  }
  
  async function checkCurrentUser() {
    const sb = supabaseBrowser();
    const { data: { user } } = await sb.auth.getUser();
    
    if (user) {
      const { data: profile } = await sb
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      alert(`Current user: ${user.email}\nIs Admin: ${profile?.is_admin || false}`);
    } else {
      alert('No user logged in');
    }
  }
  
  async function logout() {
    const sb = supabaseBrowser();
    await sb.auth.signOut();
    alert('Logged out');
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={checkCurrentUser}
              className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Check User
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </form>
        
        <div className="mt-4 p-4 bg-yellow-50 rounded">
          <p className="text-sm text-gray-600">
            Default admin credentials are pre-filled.
            <br />
            Email: schnellwissen5@gmail.com
            <br />
            Password: IboHimoPaul1!
          </p>
        </div>
      </div>
    </div>
  );
}