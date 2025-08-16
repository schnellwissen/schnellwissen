"use client";
import { useState, useEffect } from "react";
import type { ConsentCategories } from "@/lib/consent/types";

export default function PreferencesModal({ 
  initial,
  onSave,
  onClose 
}: { 
  initial: ConsentCategories;
  onSave: (c: ConsentCategories) => void;
  onClose: () => void;
}) {
  const [consent, setConsent] = useState<ConsentCategories>(initial);

  useEffect(() => {
    setConsent(initial);
  }, [initial]);

  const handleSave = () => {
    onSave(consent);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text">Cookie-Einstellungen verwalten</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-text-muted mb-6">
              Hier können Sie Ihre Cookie-Einstellungen anpassen. Ihre Präferenzen werden für 6 Monate gespeichert. 
              Sie können diese Einstellungen jederzeit über den Link im Footer ändern.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    checked={true}
                    disabled
                    className="mt-1 mr-3 cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-text">Essenzielle Cookies</h3>
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Immer aktiv</span>
                    </div>
                    <p className="text-sm text-text-muted mt-2">
                      Diese Cookies sind für den Betrieb der Website unerlässlich und können nicht deaktiviert werden. 
                      Sie werden normalerweise als Reaktion auf von Ihnen durchgeführte Aktionen gesetzt, wie z.B. 
                      das Festlegen Ihrer Datenschutzeinstellungen oder das Ausfüllen von Formularen.
                    </p>
                    <details className="mt-3">
                      <summary className="text-xs text-primary cursor-pointer hover:underline">Details anzeigen</summary>
                      <ul className="mt-2 text-xs text-text-muted space-y-1">
                        <li>• sw_consent: Speichert Ihre Cookie-Einstellungen (6 Monate)</li>
                        <li>• session: Sitzungs-Cookie für sichere Authentifizierung</li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    checked={consent.functional}
                    onChange={(e) => setConsent(prev => ({ ...prev, functional: e.target.checked }))}
                    className="mt-1 mr-3 cursor-pointer"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-text">Funktionale Cookies</h3>
                    <p className="text-sm text-text-muted mt-2">
                      Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung. Sie können von uns oder 
                      von Drittanbietern gesetzt werden, deren Dienste wir auf unseren Seiten nutzen.
                    </p>
                    <details className="mt-3">
                      <summary className="text-xs text-primary cursor-pointer hover:underline">Details anzeigen</summary>
                      <ul className="mt-2 text-xs text-text-muted space-y-1">
                        <li>• YouTube: Für eingebettete Videos</li>
                        <li>• Google Maps: Für interaktive Karten</li>
                        <li>• Social Media: Für Teilen-Funktionen</li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    checked={consent.analytics}
                    onChange={(e) => setConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="mt-1 mr-3 cursor-pointer"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-text">Analyse-Cookies</h3>
                    <p className="text-sm text-text-muted mt-2">
                      Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren. 
                      Alle Daten werden anonymisiert erfasst und verarbeitet.
                    </p>
                    <details className="mt-3">
                      <summary className="text-xs text-primary cursor-pointer hover:underline">Details anzeigen</summary>
                      <ul className="mt-2 text-xs text-text-muted space-y-1">
                        <li>• Google Analytics 4: Anonymisierte Nutzungsstatistiken</li>
                        <li>• _ga: Unterscheidung von Besuchern (2 Jahre)</li>
                        <li>• _gid: Unterscheidung von Besuchern (24 Stunden)</li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    checked={consent.marketing}
                    onChange={(e) => setConsent(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="mt-1 mr-3 cursor-pointer"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-text">Marketing-Cookies</h3>
                    <p className="text-sm text-text-muted mt-2">
                      Diese Cookies werden verwendet, um Werbung relevanter für Sie und Ihre Interessen zu machen. 
                      Sie werden auch verwendet, um die Häufigkeit der Anzeigenschaltung zu begrenzen.
                    </p>
                    <details className="mt-3">
                      <summary className="text-xs text-primary cursor-pointer hover:underline">Details anzeigen</summary>
                      <ul className="mt-2 text-xs text-text-muted space-y-1">
                        <li>• Google Ads: Personalisierte Werbung</li>
                        <li>• Facebook Pixel: Remarketing</li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Ihre Privatsphäre ist uns wichtig</p>
                  <p className="text-xs">
                    Wir respektieren "Do Not Track" (DNT) und "Global Privacy Control" (GPC) Signale. 
                    Wenn aktiviert, werden automatisch nur essenzielle Cookies verwendet.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => onSave({ essential: true, functional: false, analytics: false, marketing: false })}
                className="px-4 py-2 bg-gray-200 text-text rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Alle ablehnen
              </button>
              <button
                onClick={() => onSave({ essential: true, functional: true, analytics: true, marketing: true })}
                className="px-4 py-2 bg-gray-200 text-text rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Alle akzeptieren
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Auswahl speichern
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}