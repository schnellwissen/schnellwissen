import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import ArticleForm from '../../ArticleForm';

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const sb = await supabaseServer();

  // Check authentication
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    notFound();
  }

  // Check if user is admin
  const { data: profile } = await sb
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    notFound();
  }

  // Get article
  const { data: article, error } = await sb
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !article) {
    notFound();
  }

  // Get categories
  const { data: categories } = await sb
    .from('categories')
    .select('id, name, slug')
    .order('name');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Artikel bearbeiten</h1>
      <ArticleForm categories={categories || []} article={article} />
    </div>
  );
}