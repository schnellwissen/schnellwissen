'use client';

import { useEffect, useState } from 'react';
import { useConsent } from '@/components/consent/ConsentProvider';
import Script from 'next/script';

export default function Analytics() {
  const { consent } = useConsent();
  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(false);
  const [shouldLoadMarketing, setShouldLoadMarketing] = useState(false);

  useEffect(() => {
    // Nur laden wenn explizit zugestimmt wurde
    if (consent) {
      setShouldLoadAnalytics(consent.statistics === true);
      setShouldLoadMarketing(consent.marketing === true);
    }
  }, [consent]);

  // Google Analytics ID aus Umgebungsvariable
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  // Beispiel: Facebook Pixel ID
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  return (
    <>
      {/* Google Analytics - nur bei Statistik-Consent */}
      {shouldLoadAnalytics && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
                anonymize_ip: true,
                cookie_flags: 'SameSite=Lax;Secure'
              });
            `}
          </Script>
        </>
      )}

      {/* Umami Analytics Alternative (Privacy-friendly) - nur bei Statistik-Consent */}
      {shouldLoadAnalytics && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
        <Script
          src={process.env.NEXT_PUBLIC_UMAMI_URL || "https://analytics.umami.is/script.js"}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}

      {/* Facebook Pixel - nur bei Marketing-Consent */}
      {shouldLoadMarketing && fbPixelId && (
        <>
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img 
              height="1" 
              width="1" 
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* Weitere Marketing-Tools können hier ergänzt werden */}
      {shouldLoadMarketing && (
        <>
          {/* Google Ads Conversion Tracking */}
          {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
            <Script id="google-ads" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');
              `}
            </Script>
          )}
        </>
      )}
    </>
  );
}