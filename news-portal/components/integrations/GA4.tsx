"use client";
import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Google Analytics 4 mit IP-Anonymisierung
 * Wird nur geladen wenn Analytics-Consent erteilt wurde
 */
export default function GA4({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    // Initialisiere dataLayer falls noch nicht vorhanden
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    
    // Konfiguriere GA4 mit IP-Anonymisierung
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      'anonymize_ip': true,
      'allow_google_signals': false,
      'allow_ad_personalization_signals': false,
      'restricted_data_processing': true
    });
    
    // Log Consent Mode
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
    
    console.log('GA4 initialized with IP anonymization:', measurementId);
  }, [measurementId]);

  return (
    <>
      <Script
        id="gtag-js"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
    </>
  );
}