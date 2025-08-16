'use client';

import { useFormState } from 'react-dom';
import { registerAction } from './action';
import Link from 'next/link';

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, null);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form action={formAction} className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registrieren</h1>
          <p className="mt-2 text-sm text-gray-600">
            Erstelle dein kostenloses SchnellWissen-Konto
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail-Adresse
            </label>
            <input 
              name="email" 
              type="email" 
              id="email"
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="deine@email.de"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Passwort
            </label>
            <input 
              name="password" 
              type="password" 
              id="password"
              required 
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Mindestens 6 Zeichen"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Passwort bestätigen
            </label>
            <input 
              name="confirmPassword" 
              type="password" 
              id="confirmPassword"
              required 
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Passwort wiederholen"
            />
          </div>
        </div>

        {state?.message && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {state.message}
          </div>
        )}

        <button 
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Konto erstellen
        </button>

        <div className="text-center text-sm text-gray-600">
          Bereits ein Konto?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Jetzt anmelden
          </Link>
        </div>
      </form>
    </div>
  );
}