'use client';

import { useConsent } from './ConsentProvider';

export default function FooterConsentLink() {
  const { openSettings } = useConsent();
  
  return (
    <button 
      onClick={openSettings}
      className="hover:text-white transition-colors"
      type="button"
    >
      Cookie-Einstellungen
    </button>
  );
}