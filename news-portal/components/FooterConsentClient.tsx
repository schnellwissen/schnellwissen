'use client';

import dynamic from 'next/dynamic';

// Dynamically import the FooterConsentLink to ensure it's only rendered on client
const FooterConsentLink = dynamic(
  () => import('@/components/consent/FooterConsentLink'),
  { 
    ssr: false,
    loading: () => (
      <button className="hover:text-white transition-colors opacity-50 cursor-not-allowed" disabled>
        Cookie-Einstellungen
      </button>
    )
  }
);

export default function FooterConsentClient() {
  return <FooterConsentLink />;
}