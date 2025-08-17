import { cookies } from 'next/headers';
import { sbServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TestAuthPage() {
  const sb = await sbServer();
  const { data: { user }, error } = await sb.auth.getUser();
  const { data: { session } } = await sb.auth.getSession();
  
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => ({ 
    name: c.name, 
    value: (c.value || '').slice(0, 20) + '...'
  }));
  
  const authCookies = allCookies.filter(c => 
    c.name.startsWith('sb-') || 
    c.name.includes('supabase') || 
    c.name.includes('auth') ||
    c.name.startsWith('sw_')
  );
  
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Test Page</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">User Status</h2>
          <pre className="text-xs overflow-auto bg-gray-50 p-4 rounded">
            {user ? JSON.stringify(user, null, 2) : 'Not logged in'}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Session</h2>
          <pre className="text-xs overflow-auto bg-gray-50 p-4 rounded">
            {session ? 'Active session' : 'No session'}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Auth Error</h2>
          <pre className="text-xs overflow-auto bg-gray-50 p-4 rounded">
            {error ? error.message : 'No errors'}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Auth Cookies ({authCookies.length})</h2>
          <pre className="text-xs overflow-auto bg-gray-50 p-4 rounded">
            {JSON.stringify(authCookies, null, 2)}
          </pre>
        </div>
        
        <div className="flex gap-4">
          <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
            Go to Login
          </a>
          <a href="/register" className="px-4 py-2 bg-green-600 text-white rounded">
            Go to Register
          </a>
          <a href="/clear" className="px-4 py-2 bg-red-600 text-white rounded">
            Clear All Cookies
          </a>
        </div>
      </div>
    </div>
  );
}