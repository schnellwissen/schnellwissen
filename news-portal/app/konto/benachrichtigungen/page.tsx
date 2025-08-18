import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/user/getCurrentUser';

export default async function BenachrichtigungenPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?next=/konto/benachrichtigungen');
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
          <h1 className="text-3xl font-bold text-text mb-2">Benachrichtigungen</h1>
          <p className="text-text-muted mb-8">Verwalten Sie, wie und wann Sie von uns hören möchten</p>
          
          <div className="space-y-8">
            {/* Email Notifications */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-text mb-4">E-Mail-Benachrichtigungen</h2>
              
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                    defaultChecked={true}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-text">Breaking News</p>
                    <p className="text-sm text-text-muted">Sofortige Benachrichtigung bei wichtigen Eilmeldungen</p>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                    defaultChecked={false}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-text">Tägliche Zusammenfassung</p>
                    <p className="text-sm text-text-muted">Die wichtigsten Artikel des Tages</p>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                    defaultChecked={false}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-text">Personalisierte Empfehlungen</p>
                    <p className="text-sm text-text-muted">Artikel basierend auf Ihren Interessen</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Category Subscriptions */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-text mb-4">Kategorie-Abonnements</h2>
              <p className="text-sm text-text-muted mb-4">Erhalten Sie Benachrichtigungen für neue Artikel in diesen Kategorien</p>
              
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    defaultChecked={true}
                  />
                  <span className="text-text">Politik</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    defaultChecked={false}
                  />
                  <span className="text-text">Wirtschaft</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    defaultChecked={true}
                  />
                  <span className="text-text">Technologie</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    defaultChecked={false}
                  />
                  <span className="text-text">Sport</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    defaultChecked={false}
                  />
                  <span className="text-text">Kultur</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    defaultChecked={true}
                  />
                  <span className="text-text">Wissenschaft</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    defaultChecked={false}
                  />
                  <span className="text-text">Gesundheit</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    defaultChecked={false}
                  />
                  <span className="text-text">Lifestyle</span>
                </label>
              </div>
            </div>

            {/* Notification Frequency */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-text mb-4">Häufigkeit</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="frequency" 
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    defaultChecked={true}
                  />
                  <div>
                    <p className="font-medium text-text">Sofort</p>
                    <p className="text-sm text-text-muted">Benachrichtigungen in Echtzeit erhalten</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="frequency" 
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium text-text">Täglich</p>
                    <p className="text-sm text-text-muted">Eine Zusammenfassung pro Tag</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="frequency" 
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium text-text">Wöchentlich</p>
                    <p className="text-sm text-text-muted">Eine Zusammenfassung pro Woche</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Marketing Communications */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-text mb-4">Marketing & Angebote</h2>
              
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                    defaultChecked={false}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-text">Sonderangebote</p>
                    <p className="text-sm text-text-muted">Exklusive Angebote und Rabatte für Premium-Inhalte</p>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                    defaultChecked={false}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-text">Partner-Angebote</p>
                    <p className="text-sm text-text-muted">Angebote von unseren vertrauenswürdigen Partnern</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Unsubscribe All */}
            <div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                    defaultChecked={false}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-text">Alle E-Mail-Benachrichtigungen deaktivieren</p>
                    <p className="text-sm text-text-muted">Sie erhalten keine E-Mails mehr von uns (außer wichtige Kontoinformationen)</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                Einstellungen speichern
              </button>
              <button className="px-6 py-3 bg-gray-200 text-text rounded-lg hover:bg-gray-300 transition-colors font-medium">
                Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}