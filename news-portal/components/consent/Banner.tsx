"use client";
import { useState } from "react";
import Link from "next/link";
import type { ConsentCategories } from "@/lib/consent/types";

export default function CookieBanner({ 
  onSave 
}: { 
  onSave: (c: ConsentCategories) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [customConsent, setCustomConsent] = useState<ConsentCategories>({ 
    essential: true, 
    functional: false, 
    analytics: false, 
    marketing: false 
  });

  const acceptAll = () => {
    onSave({ 
      essential: true, 
      functional: true, 
      analytics: true, 
      marketing: true 
    });
  };

  const acceptEssential = () => {
    onSave({ 
      essential: true, 
      functional: false, 
      analytics: false, 
      marketing: false 
    });
  };

  const saveCustom = () => {
    onSave(customConsent);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
      <div className="container mx-auto max-w-7xl p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text mb-2">
              🍪 Cookie-Einstellungen
            </h3>
            <p className="text-sm text-text-muted mb-2">
              Wir verwenden Cookies, um unsere Website sicher zu betreiben (essentiell) sowie – wenn Sie zustimmen – 
              für erweiterte Funktionen, anonyme Statistiken und Marketing. Sie können Ihre Einstellungen jederzeit ändern.
            </p>
            <p className="text-xs text-text-muted">
              Weitere Informationen finden Sie in unserer{' '}
              <Link href="/datenschutz" className="text-primary hover:underline">
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={acceptAll}
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Alle akzeptieren
            </button>
            <button
              onClick={acceptEssential}
              className="px-6 py-2.5 bg-gray-200 text-text rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Nur erforderliche
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-6 py-2.5 border-2 border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Einstellungen
            </button>
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-text mb-4">Cookie-Kategorien anpassen</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-start cursor-not-allowed opacity-75">
                  <input 
                    type="checkbox" 
                    checked={true}
                    disabled
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium text-text">Essenziell</div>
                    <p className="text-xs text-text-muted mt-1">
                      Notwendige Cookies für den sicheren Betrieb der Website. Diese können nicht deaktiviert werden.
                    </p>
                  </div>
                </label>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={customConsent.functional}
                    onChange={(e) => setCustomConsent(prev => ({ ...prev, functional: e.target.checked }))}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium text-text">Funktional</div>
                    <p className="text-xs text-text-muted mt-1">
                      Erweiterte Funktionen wie eingebettete Videos, Karten und Social-Media-Integrationen.
                    </p>
                  </div>
                </label>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={customConsent.analytics}
                    onChange={(e) => setCustomConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium text-text">Analytik</div>
                    <p className="text-xs text-text-muted mt-1">
                      Anonyme Statistiken zur Verbesserung unserer Website (z.B. Google Analytics mit IP-Anonymisierung).
                    </p>
                  </div>
                </label>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={customConsent.marketing}
                    onChange={(e) => setCustomConsent(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium text-text">Marketing</div>
                    <p className="text-xs text-text-muted mt-1">
                      Personalisierte Werbung und Remarketing-Funktionen.
                    </p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-text hover:bg-gray-100 rounded-lg transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={saveCustom}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Auswahl speichern
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}