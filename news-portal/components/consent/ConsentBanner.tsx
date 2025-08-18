'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useConsent } from './ConsentProvider';

export default function ConsentBanner() {
  const { 
    consent, 
    hasUserConsented, 
    acceptAll, 
    acceptNecessary, 
    openSettings 
  } = useConsent();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Banner zeigen, wenn noch keine explizite Zustimmung erfolgt ist
    if (isMounted && !hasUserConsented && consent) {
      // Kleine Verzögerung für sanfte Animation
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [hasUserConsented, consent, isMounted]);

  if (!isMounted || !isVisible) return null;

  return (
    <>
      {/* Backdrop für Mobile */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={(e) => e.stopPropagation()}
        aria-hidden="true"
      />
      
      {/* Banner */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-50 
        transform transition-all duration-500 ease-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        p-4 sm:p-6
      `}>
        <div className="mx-auto max-w-7xl">
          <div className="
            rounded-2xl shadow-2xl overflow-hidden
            bg-white dark:bg-slate-900
            ring-1 ring-black/5 dark:ring-white/10
            backdrop-blur-xl
          ">
            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="sm:flex sm:items-start sm:gap-8">
                {/* Text Content */}
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    🍪 Cookies & Datenschutz
                  </h2>
                  
                  <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    Wir verwenden Cookies, um deine Erfahrung auf unserer Website zu verbessern. 
                    Notwendige Cookies sind für den Betrieb der Seite erforderlich. 
                    Mit deiner Zustimmung verwenden wir zusätzliche Cookies für Präferenzen, 
                    Statistiken und Marketing.
                  </p>
                  
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Weitere Informationen findest du in unserer{' '}
                    <Link 
                      href="/datenschutz" 
                      className="underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Datenschutzerklärung
                    </Link>
                    .
                  </p>
                </div>

                {/* Actions - Mobile: Stack, Desktop: Side */}
                <div className="mt-6 sm:mt-0 sm:ml-8 flex flex-col gap-3 sm:w-auto">
                  {/* Alle akzeptieren - Primary */}
                  <button
                    onClick={acceptAll}
                    className="
                      w-full sm:w-auto px-6 py-3 
                      bg-blue-600 hover:bg-blue-700 
                      text-white font-semibold rounded-xl 
                      transition-all hover:shadow-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      active:scale-[0.98]
                    "
                  >
                    Alle akzeptieren
                  </button>
                  
                  {/* Nur notwendige - Secondary */}
                  <button
                    onClick={acceptNecessary}
                    className="
                      w-full sm:w-auto px-6 py-3 
                      bg-slate-200 hover:bg-slate-300 
                      dark:bg-slate-800 dark:hover:bg-slate-700
                      text-slate-900 dark:text-white font-semibold rounded-xl 
                      transition-all
                      focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                      active:scale-[0.98]
                    "
                  >
                    Nur notwendige
                  </button>
                  
                  {/* Einstellungen - Ghost */}
                  <button
                    onClick={openSettings}
                    className="
                      w-full sm:w-auto px-6 py-3 
                      text-slate-600 dark:text-slate-400 
                      hover:text-slate-900 dark:hover:text-white
                      font-medium rounded-xl 
                      hover:bg-slate-100 dark:hover:bg-slate-800
                      transition-all
                      focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                      active:scale-[0.98]
                    "
                  >
                    Einstellungen anpassen
                  </button>
                </div>
              </div>

              {/* Cookie-Kategorien Preview */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-slate-600 dark:text-slate-400">Notwendig</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                    <span className="text-slate-600 dark:text-slate-400">Präferenzen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                    <span className="text-slate-600 dark:text-slate-400">Statistik</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                    <span className="text-slate-600 dark:text-slate-400">Marketing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}