'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function BearbeitenPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    avatarUrl: ''
  });

  useEffect(() => {
    async function loadProfile() {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login?next=/konto/bearbeiten');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, bio, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setFormData({
          displayName: profile.display_name || '',
          bio: profile.bio || '',
          avatarUrl: profile.avatar_url || ''
        });
      }
      
      setIsLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setMessage({ type: 'error', text: 'Sie müssen angemeldet sein' });
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: formData.displayName || null,
        bio: formData.bio || null,
        avatar_url: formData.avatarUrl || null,
        updated_at: new Date().toISOString()
      });

    if (error) {
      setMessage({ type: 'error', text: 'Fehler beim Speichern des Profils' });
    } else {
      setMessage({ type: 'success', text: 'Profil erfolgreich aktualisiert' });
      setTimeout(() => {
        router.push('/konto');
      }, 1500);
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="card p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back Link */}
        <Link 
          href="/konto"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurück zum Profil
        </Link>

        <div className="card p-8">
          <h1 className="text-3xl font-bold text-text mb-8">Profil bearbeiten</h1>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-text-muted mb-2">
                Anzeigename
              </label>
              <input
                type="text"
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Ihr Name"
              />
              <p className="mt-1 text-sm text-text-muted">
                Dieser Name wird öffentlich angezeigt
              </p>
            </div>

            {/* Avatar URL */}
            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-text-muted mb-2">
                Profilbild-URL
              </label>
              <input
                type="url"
                id="avatarUrl"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="https://beispiel.de/ihr-bild.jpg"
              />
              <p className="mt-1 text-sm text-text-muted">
                URL zu Ihrem Profilbild (JPG, PNG)
              </p>
              
              {formData.avatarUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-text-muted mb-2">Vorschau:</p>
                  <img
                    src={formData.avatarUrl}
                    alt="Profilbild-Vorschau"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-text-muted mb-2">
                Über mich
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                placeholder="Erzählen Sie etwas über sich..."
                maxLength={500}
              />
              <p className="mt-1 text-sm text-text-muted">
                {formData.bio.length}/500 Zeichen
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Speichern...' : 'Änderungen speichern'}
              </button>
              <Link
                href="/konto"
                className="px-6 py-3 bg-gray-200 text-text rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Abbrechen
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}