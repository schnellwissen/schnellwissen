import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { getArticlePath } from "@/lib/paths";

export default async function DebugRouting() {
  const sb = await supabaseServer();
  const { data: cats } = await sb.from('categories').select('id,name,slug').order('name');
  const { data: arts } = await sb.from('articles')
    .select('id,title,slug,category_slug,status')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Debug Routing</h1>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Kategorien:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(cats, null, 2)}
        </pre>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Artikel:</h2>
        <ul className="space-y-2">
          {arts?.map(a => (
            <li key={a.id} className="flex items-center gap-2">
              {a.status === 'published' ? '✅' : '⛔'} 
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {a.category_slug}/{a.slug}
              </code>
              —
              <span className="text-gray-600">{a.title}</span>
              —
              <Link 
                className="text-blue-600 underline hover:text-blue-800" 
                href={getArticlePath(a.category_slug || '', a.slug || '')}
              >
                testen →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}