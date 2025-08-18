'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  Consent, 
  defaultConsent, 
  readConsentCookie, 
  writeConsentCookie,
  checkDoNotTrack 
} from '@/lib/consent';

type ConsentContextType = {
  consent: Consent | null;
  hasUserConsented: boolean;
  updateConsent: (consent: Consent) => void;
  acceptAll: () => void;
  acceptNecessary: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  isSettingsOpen: boolean;
};

const ConsentContext = createContext<ConsentContextType | null>(null);

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        'useConsent called outside of <ConsentProvider>. ' +
        'Make sure your component is wrapped in RootProviders. ' +
        'Check your component tree!'
      );
    }
    // Fallback verhindert Crash, aber bitte NICHT drauf verlassen
    return {
      consent: null,
      hasUserConsented: false,
      updateConsent: () => {},
      acceptAll: () => {},
      acceptNecessary: () => {},
      openSettings: () => {},
      closeSettings: () => {},
      isSettingsOpen: false
    } as ConsentContextType;
  }
  return context;
};

interface ConsentProviderProps {
  children: ReactNode;
  initialConsent?: Consent | null;
}

export default function ConsentProvider({ children, initialConsent }: ConsentProviderProps) {
  const [consent, setConsentState] = useState<Consent | null>(initialConsent || null);
  const [hasUserConsented, setHasUserConsented] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Client-side: Cookie lesen
    const existingConsent = readConsentCookie();
    
    if (existingConsent) {
      setConsentState(existingConsent);
      setHasUserConsented(true);
    } else {
      // Neuer Besucher - Check Do-Not-Track
      const dnt = checkDoNotTrack();
      const newConsent = defaultConsent();
      
      if (dnt) {
        // Bei DNT: nur notwendige Cookies
        newConsent.preferences = false;
        newConsent.statistics = false;
        newConsent.marketing = false;
      }
      
      setConsentState(newConsent);
      setHasUserConsented(false);
    }
  }, []);

  const updateConsent = (newConsent: Consent) => {
    writeConsentCookie(newConsent);
    setConsentState(newConsent);
    setHasUserConsented(true);
    
    // Bei Änderungen ggf. Seite neu laden um Scripts zu aktualisieren
    // window.location.reload();
  };

  const acceptAll = () => {
    const newConsent: Consent = {
      ...defaultConsent(),
      preferences: true,
      statistics: true,
      marketing: true,
      ts: Date.now()
    };
    updateConsent(newConsent);
  };

  const acceptNecessary = () => {
    const newConsent: Consent = {
      ...defaultConsent(),
      ts: Date.now()
    };
    updateConsent(newConsent);
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConsentContext.Provider 
      value={{
        consent,
        hasUserConsented,
        updateConsent,
        acceptAll,
        acceptNecessary,
        openSettings,
        closeSettings,
        isSettingsOpen
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}