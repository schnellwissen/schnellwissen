'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slugify';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleFormProps {
  categories: Category[];
  article?: any;
}

export default function ArticleForm({ categories, article }: ArticleFormProps) {
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [categoryId, setCategoryId] = useState(article?.category_id || '');
  const [coverImageUrl, setCoverImageUrl] = useState(article?.cover_image_url || '');
  const [content, setContent] = useState(article?.content_html || article?.html || article?.content || '');
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !article) {
      setSlug(slugify(title));
    }
  }, [title, article]);

  // Live preview of cover image
  useEffect(() => {
    if (coverImageUrl) {
      setPreviewImage(`/api/img?u=${encodeURIComponent(coverImageUrl)}&kind=cover`);
    } else {
      setPreviewImage('');
    }
  }, [coverImageUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Find the selected category's slug
      const selectedCategory = categories.find(cat => cat.id === categoryId);
      
      const articleData = {
        title,
        slug,
        excerpt,
        category_id: categoryId,
        category_slug: selectedCategory?.slug,
        cover_image_url: coverImageUrl,
        content,
        status: 'published'
      };

      const url = article ? `/api/articles/${article.id}` : '/api/articles';
      const method = article ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });

      if (response.ok) {
        router.push('/admin/articles');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Fehler beim Speichern des Artikels');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Fehler beim Speichern des Artikels');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titel*
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug (URL)*
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <p className="text-sm text-gray-500">Automatisch generiert, kann angepasst werden</p>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Kategorie*
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Kategorie wählen...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          Kurzbeschreibung
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      {/* Cover Image URL */}
      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
          Cover-Bild URL
        </label>
        <input
          type="url"
          id="coverImage"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="https://images.pexels.com/..."
        />
        <p className="text-sm text-gray-500">
          Erlaubte Domains: images.pexels.com, picsum.photos, *.supabase.co
        </p>
        
        {/* Live Preview */}
        {previewImage && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Live-Vorschau:</p>
            <img
              src={previewImage}
              alt="Cover Preview"
              className="w-full max-w-md rounded-lg shadow-md"
              onError={() => setPreviewImage('')}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Inhalt (HTML)*
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={12}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 font-mono text-sm"
          placeholder="<p>Hier HTML-Inhalt eingeben...</p>"
        />
        <p className="text-sm text-gray-500">
          HTML wird 1:1 gerendert. Bitte sicherheitsgeprüftes HTML verwenden.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Speichere...' : (article ? 'Aktualisieren' : 'Erstellen')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}