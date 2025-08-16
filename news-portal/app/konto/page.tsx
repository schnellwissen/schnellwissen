import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/user/getCurrentUser';
import PasswordChangeForm from './PasswordChangeForm';

export default async function KontoPageServer() {
  const user = await getCurrentUser();

  if (!user) {
    // Not logged in - redirect to login
    redirect('/login?next=/konto');
  }

  return (
    <div className="min-h-screen bg-bg py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-text mb-8">Mein Profil</h1>
          
          <div className="space-y-6">
            {/* Profile Info */}
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  E-Mail-Adresse
                </label>
                <p className="text-lg text-text">{user.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Anzeigename
                </label>
                <p className="text-lg text-text">
                  {user.displayName || <span className="text-text-muted italic">Nicht festgelegt</span>}
                </p>
              </div>
              
              {user.bio && (
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    Über mich
                  </label>
                  <p className="text-text">{user.bio}</p>
                </div>
              )}
              
              {user.avatarUrl && (
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    Profilbild
                  </label>
                  <img
                    src={user.avatarUrl}
                    alt="Profilbild"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/konto/bearbeiten"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Profil bearbeiten
              </Link>
              <Link
                href="/konto/darstellung"
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-text rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Einstellungen
              </Link>
            </div>
          </div>
        </div>

        {/* Password Change Card */}
        <div className="card p-8 mt-6">
          <h2 className="text-xl font-semibold text-text mb-6">Passwort ändern</h2>
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
}