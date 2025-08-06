'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

interface Category {
  id: number;
  name: string;
}

export default function NewForm({ categories }: { categories: Category[] }) {
  const sb = supabaseBrowser();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const title = fd.get('title') as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const { data: { user } } = await sb.auth.getUser();
    
    const { error } = await sb.from('articles').insert({
      title,
      slug,
      excerpt: (fd.get('content') as string).substring(0, 160),
      content_html: fd.get('content'),
      category_id: Number(fd.get('cat')),
      status: 'published',
      author_id: user?.id,
      published_at: new Date().toISOString()
    });
    
    setBusy(false);
    if (error) return alert(error.message);
    router.push(`/${slug}`);
  }

  return (
    <form onSubmit={save} className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titel
        </label>
        <input 
          name="title" 
          className="w-full border p-2 rounded" 
          placeholder="Artikel-Titel" 
          required 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategorie
        </label>
        <select name="cat" className="w-full border p-2 rounded" required>
          <option value="">– Kategorie wählen –</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Inhalt (HTML)
        </label>
        <textarea 
          name="content" 
          rows={14} 
          className="w-full border p-2 font-mono rounded text-sm"
          placeholder="<h2>Überschrift</h2>&#10;<p>Text...</p>&#10;<ul>&#10;  <li>Punkt 1</li>&#10;  <li>Punkt 2</li>&#10;</ul>" 
          required 
        />
        <p className="text-xs text-gray-500 mt-1">
          HTML-Tags erlaubt: h2, h3, p, ul, ol, li, strong, em, a, blockquote
        </p>
      </div>
      
      <button 
        disabled={busy}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {busy ? 'Speichere …' : 'Veröffentlichen'}
      </button>
    </form>
  );
}