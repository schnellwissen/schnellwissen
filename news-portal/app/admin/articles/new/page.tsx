import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import NewForm from './NewForm';

export default async function NewArticle() {
  const sb = await supabaseServer();
  
  const { data: { user } } = await sb.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  const { data: prof } = await sb
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
    
  if (!prof?.is_admin) redirect('/');

  const { data: cats } = await sb.from('categories').select('id,name');
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Neuer Artikel</h1>
      <NewForm categories={cats ?? []} />
    </div>
  );
}