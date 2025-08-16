import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/user/getCurrentUser';

export default async function SicherheitPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?next=/konto/sicherheit');
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
          <h1 className="text-3xl font-bold text-text mb-8">Sicherheit & Datenschutz</h1>
          
          <div className="space-y-8">
            {/* Password Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-text mb-4">Passwort</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">Passwort ändern</p>
                    <p className="text-sm text-text-muted mt-1">
                      Verwenden Sie ein starkes Passwort mit mindestens 8 Zeichen
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    Ändern
                  </button>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tipp:</strong> Verwenden Sie einen Passwort-Manager, um sichere und eindeutige Passwörter zu erstellen.
                </p>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-text mb-4">Zwei-Faktor-Authentifizierung</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">2FA Status</p>
                    <p className="text-sm text-text-muted mt-1">
                      Zusätzliche Sicherheit für Ihr Konto
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Nicht aktiviert
                  </span>
                </div>
                
                <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  2FA aktivieren
                </button>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-text mb-4">Aktive Sitzungen</h2>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text">Aktuelle Sitzung</p>
                      <p className="text-sm text-text-muted">Windows • Chrome • Deutschland</p>
                      <p className="text-xs text-text-muted mt-1">Zuletzt aktiv: Gerade eben</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Aktiv
                    </span>
                  </div>
                </div>
                
                <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  Alle anderen Sitzungen beenden
                </button>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-text mb-4">Datenschutzeinstellungen</h2>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-text">Aktivitätsverlauf</p>
                    <p className="text-sm text-text-muted">Speichern Sie Ihre Leseaktivität</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                    defaultChecked={true}
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-text">Personalisierte Empfehlungen</p>
                    <p className="text-sm text-text-muted">Artikel basierend auf Ihrer Aktivität vorschlagen</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                    defaultChecked={true}
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-text">Anonyme Statistiken</p>
                    <p className="text-sm text-text-muted">Helfen Sie uns, die Plattform zu verbessern</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                    defaultChecked={false}
                  />
                </label>
              </div>
            </div>

            {/* Data Management */}
            <div className="pb-6">
              <h2 className="text-xl font-semibold text-text mb-4">Datenverwaltung</h2>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text">Daten herunterladen</p>
                      <p className="text-sm text-text-muted">Erhalten Sie eine Kopie Ihrer Daten</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Anfordern
                    </button>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text">Aktivitätsverlauf löschen</p>
                      <p className="text-sm text-text-muted">Löschen Sie Ihren gesamten Verlauf</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Löschen
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delete Account */}
            <div className="border-t border-red-200 pt-6">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Gefahrenzone</h2>
              
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">Konto dauerhaft löschen</p>
                    <p className="text-sm text-text-muted">Diese Aktion kann nicht rückgängig gemacht werden</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Konto löschen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}