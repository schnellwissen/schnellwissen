import Link from 'next/link';
import { redirect } from 'next/navigation';
import { sbServer } from '@/lib/supabase/server';
import { loadDisplayPrefs, saveDisplayPrefs } from './actions';
import { DisplayEnhance } from './DisplayEnhance';

export default async function DarstellungPage() {
  const sb = await sbServer();
  const { data: { user } } = await sb.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/konto/darstellung');
  }

  const prefs = await loadDisplayPrefs();

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
          <h1 className="text-3xl font-bold text-text mb-8">Darstellung</h1>
          
          <form action={saveDisplayPrefs as any} className="space-y-8">
            {/* Theme */}
            <fieldset>
              <legend className="text-lg font-semibold text-text mb-4">Theme</legend>
              <div className="grid grid-cols-3 gap-3">
                <label className={`relative cursor-pointer`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="light" 
                    defaultChecked={prefs.theme === 'light'}
                    className="sr-only peer"
                  />
                  <div className="px-4 py-3 text-center border-2 rounded-lg transition-all peer-checked:border-primary peer-checked:bg-primary/10 border-gray-300 hover:border-gray-400">
                    <svg className="w-6 h-6 mx-auto mb-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="font-medium">Hell</span>
                  </div>
                </label>
                
                <label className={`relative cursor-pointer`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="dark" 
                    defaultChecked={prefs.theme === 'dark'}
                    className="sr-only peer"
                  />
                  <div className="px-4 py-3 text-center border-2 rounded-lg transition-all peer-checked:border-primary peer-checked:bg-primary/10 border-gray-300 hover:border-gray-400">
                    <svg className="w-6 h-6 mx-auto mb-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="font-medium">Dunkel</span>
                  </div>
                </label>
                
                <label className={`relative cursor-pointer`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="system" 
                    defaultChecked={prefs.theme === 'system'}
                    className="sr-only peer"
                  />
                  <div className="px-4 py-3 text-center border-2 rounded-lg transition-all peer-checked:border-primary peer-checked:bg-primary/10 border-gray-300 hover:border-gray-400">
                    <svg className="w-6 h-6 mx-auto mb-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">System</span>
                  </div>
                </label>
              </div>
              <p className="mt-2 text-sm text-text-muted">
                Wählen Sie das Erscheinungsbild der Website
              </p>
            </fieldset>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button 
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Einstellungen speichern
              </button>
              <Link
                href="/konto"
                className="px-6 py-3 bg-gray-200 text-text rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Abbrechen
              </Link>
            </div>
            
            <DisplayEnhance />
          </form>
        </div>

        {/* Info Box */}
        <div className="card p-6 mt-6">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-text-muted">
                Ihre Darstellungseinstellungen werden {prefs.guest ? 'lokal in Ihrem Browser' : 'in Ihrem Profil'} gespeichert und automatisch auf {prefs.guest ? 'diesem Gerät' : 'allen Ihren Geräten'} angewendet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}