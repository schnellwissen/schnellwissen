"use client";
import { useConsent } from "@/lib/consent/context";

export default function FooterConsentLink() {
  const { openPreferences } = useConsent();
  
  return (
    <button 
      onClick={openPreferences}
      className="text-text-muted hover:text-primary text-sm transition-colors"
    >
      Datenschutz & Cookies
    </button>
  );
}