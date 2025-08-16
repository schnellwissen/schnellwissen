"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ConsentCategories, ConsentRecord } from "./types";
import { getConsent, setConsent, clearConsent } from "./storage";

const DEFAULT: ConsentCategories = { 
  essential: true, 
  functional: false, 
  analytics: false, 
  marketing: false 
};

type ConsentContextType = {
  consent: ConsentCategories;
  hasDecision: boolean;
  showBanner: boolean;
  showPreferences: boolean;
  save: (c: ConsentCategories, source: ConsentRecord["source"]) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  reset: () => void;
};

const ConsentContext = createContext<ConsentContextType | null>(null);

export function ConsentProvider({ 
  children, 
  version = "1.0.0" 
}: { 
  children: React.ReactNode; 
  version?: string;
}) {
  const [consent, setConsentState] = useState<ConsentCategories>(DEFAULT);
  const [hasDecision, setHasDecision] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // DNT/GPC respektieren
  const dnt = typeof navigator !== "undefined" && (navigator as any).doNotTrack === "1";
  const gpc = typeof navigator !== "undefined" && (navigator as any).globalPrivacyControl === true;

  useEffect(() => {
    const existing = getConsent();
    
    if (existing) {
      setConsentState(existing.granted);
      setHasDecision(true);
      setShowBanner(false);
    } else if (dnt || gpc) {
      // Automatisch ablehnen (außer essential) bei DNT/GPC
      const auto = { ...DEFAULT };
      setConsentState(auto);
      setHasDecision(true);
      setShowBanner(false);
      setConsent({ 
        granted: auto, 
        timestamp: new Date().toISOString(), 
        version, 
        source: "auto_dnt_gpc" 
      });
    } else {
      // Zeige Banner für neue Besucher
      setShowBanner(true);
    }
  }, [dnt, gpc, version]);

  const save = useCallback((granted: ConsentCategories, source: ConsentRecord["source"]) => {
    setConsentState(granted);
    setHasDecision(true);
    setShowBanner(false);
    setShowPreferences(false);
    setConsent({ 
      granted, 
      timestamp: new Date().toISOString(), 
      version, 
      source 
    });
  }, [version]);

  const openPreferences = useCallback(() => {
    setShowPreferences(true);
  }, []);

  const closePreferences = useCallback(() => {
    setShowPreferences(false);
  }, []);

  const reset = useCallback(() => {
    clearConsent();
    setConsentState(DEFAULT);
    setHasDecision(false);
    setShowBanner(true);
    setShowPreferences(false);
  }, []);

  return (
    <ConsentContext.Provider value={{
      consent,
      hasDecision,
      showBanner,
      showPreferences,
      save,
      openPreferences,
      closePreferences,
      reset
    }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}