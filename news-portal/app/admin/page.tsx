import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';

export default async function AdminPage() {
  const supabase = await supabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Willkommen im Admin-Bereich</h2>
        <p className="text-gray-600 mb-6">
          Hier können Sie Artikel verwalten, Kategorien bearbeiten und die Seite administrieren.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/articles" className="block bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition">
            <h3 className="font-semibold text-lg mb-2">Artikel verwalten</h3>
            <p className="text-gray-600 mb-4">Erstellen, bearbeiten und löschen Sie Artikel</p>
            <span className="text-blue-600 hover:underline">Artikel verwalten →</span>
          </Link>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Kategorien</h3>
            <p className="text-gray-600 mb-4">Verwalten Sie die Artikel-Kategorien</p>
            <button className="text-green-600 hover:underline">Kategorien anzeigen →</button>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Statistiken</h3>
            <p className="text-gray-600 mb-4">Sehen Sie Besucherzahlen und Trends</p>
            <button className="text-purple-600 hover:underline">Statistiken anzeigen →</button>
          </div>
        </div>
      </div>
    </div>
  );
}