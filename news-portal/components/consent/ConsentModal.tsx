'use client';

import { useState, useEffect } from 'react';
import { useConsent } from './ConsentProvider';
import { Consent } from '@/lib/consent';

export default function ConsentModal() {
  const { 
    consent, 
    isSettingsOpen, 
    closeSettings, 
    updateConsent 
  } = useConsent();

  const [localSettings, setLocalSettings] = useState({
    preferences: false,
    statistics: false,
    marketing: false
  });

  useEffect(() => {
    if (consent && isSettingsOpen) {
      setLocalSettings({
        preferences: consent.preferences,
        statistics: consent.statistics,
        marketing: consent.marketing
      });
    }
  }, [consent, isSettingsOpen]);

  if (!isSettingsOpen || !consent) return null;

  const handleSave = () => {
    const newConsent: Consent = {
      ...consent,
      ...localSettings,
      ts: Date.now()
    };
    updateConsent(newConsent);
    closeSettings();
  };

  const handleAcceptAll = () => {
    const newConsent: Consent = {
      ...consent,
      preferences: true,
      statistics: true,
      marketing: true,
      ts: Date.now()
    };
    updateConsent(newConsent);
    closeSettings();
  };

  const handleRejectAll = () => {
    const newConsent: Consent = {
      ...consent,
      preferences: false,
      statistics: false,
      marketing: false,
      ts: Date.now()
    };
    updateConsent(newConsent);
    closeSettings();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={closeSettings}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={closeSettings}
      >
        <div 
          className="
            w-full max-w-2xl max-h-[90vh] overflow-y-auto
            bg-white dark:bg-slate-900 
            rounded-2xl shadow-2xl
            ring-1 ring-black/5 dark:ring-white/10
            animate-in zoom-in-95 duration-200
          "
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-modal-title"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <h2 id="consent-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">
                Cookie-Einstellungen
              </h2>
              <button
                onClick={closeSettings}
                className="
                  p-2 rounded-lg
                  hover:bg-slate-100 dark:hover:bg-slate-800
                  transition-colors
                "
                aria-label="Schließen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Intro */}
            <div>
              <p className="text-slate-600 dark:text-slate-300">
                Wir verwenden Cookies und ähnliche Technologien, um deine Erfahrung auf unserer Website zu verbessern. 
                Du kannst deine Einstellungen jederzeit anpassen.
              </p>
            </div>

            {/* Cookie Categories */}
            <div className="space-y-4">
              {/* Notwendige Cookies */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                      Notwendige Cookies
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden. 
                      Sie speichern keine persönlichen Daten.
                    </p>
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                        Mehr erfahren
                      </summary>
                      <ul className="mt-2 text-sm text-slate-500 dark:text-slate-400 list-disc list-inside">
                        <li>Session-Management</li>
                        <li>Sicherheits-Token</li>
                        <li>Cookie-Einstellungen</li>
                      </ul>
                    </details>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400 mr-3">Immer aktiv</span>
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-5 h-5 rounded cursor-not-allowed opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Präferenz-Cookies */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Präferenz-Cookies
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Diese Cookies ermöglichen es der Website, sich an deine Einstellungen zu erinnern 
                      (z.B. Sprache, Region, Dark Mode).
                    </p>
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                        Mehr erfahren
                      </summary>
                      <ul className="mt-2 text-sm text-slate-500 dark:text-slate-400 list-disc list-inside">
                        <li>Dark/Light Mode Präferenz</li>
                        <li>Schriftgröße</li>
                        <li>Spracheinstellungen</li>
                      </ul>
                    </details>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.preferences}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, preferences: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Statistik-Cookies */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Statistik-Cookies
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, 
                      indem sie Informationen anonym sammeln und melden.
                    </p>
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                        Mehr erfahren
                      </summary>
                      <ul className="mt-2 text-sm text-slate-500 dark:text-slate-400 list-disc list-inside">
                        <li>Google Analytics (anonymisiert)</li>
                        <li>Besucherzählung</li>
                        <li>Seitenaufrufe</li>
                      </ul>
                    </details>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.statistics}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, statistics: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Marketing-Cookies */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Marketing-Cookies
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Diese Cookies werden verwendet, um Werbung zu liefern, die für dich relevanter ist. 
                      Sie können auch verwendet werden, um die Anzahl der Anzeigenaufrufe zu begrenzen.
                    </p>
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                        Mehr erfahren
                      </summary>
                      <ul className="mt-2 text-sm text-slate-500 dark:text-slate-400 list-disc list-inside">
                        <li>Personalisierte Werbung</li>
                        <li>Retargeting</li>
                        <li>Conversion-Tracking</li>
                      </ul>
                    </details>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.marketing}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, marketing: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium">Do-Not-Track erkannt</p>
                  <p className="mt-1">
                    Dein Browser hat Do-Not-Track aktiviert. Wir respektieren diese Einstellung und 
                    haben automatisch alle optionalen Cookies deaktiviert.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRejectAll}
                className="
                  flex-1 px-6 py-3 
                  bg-slate-200 hover:bg-slate-300 
                  dark:bg-slate-800 dark:hover:bg-slate-700
                  text-slate-900 dark:text-white font-semibold rounded-xl 
                  transition-all
                  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                "
              >
                Alle ablehnen
              </button>
              <button
                onClick={handleSave}
                className="
                  flex-1 px-6 py-3 
                  bg-blue-600 hover:bg-blue-700 
                  text-white font-semibold rounded-xl 
                  transition-all hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                "
              >
                Auswahl speichern
              </button>
              <button
                onClick={handleAcceptAll}
                className="
                  flex-1 px-6 py-3 
                  bg-green-600 hover:bg-green-700 
                  text-white font-semibold rounded-xl 
                  transition-all hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                "
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}