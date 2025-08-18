// Cookie consent types and utilities
export type Consent = {
  v: number;
  ts: number;
  necessary: true;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
};

export const CONSENT_COOKIE = 'sw_consent_v1';
export const CONSENT_VERSION = 1;
export const CONSENT_DURATION = 60 * 60 * 24 * 365; // 1 Jahr in Sekunden

export const defaultConsent = (): Consent => ({
  v: CONSENT_VERSION,
  ts: Date.now(),
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
});

export function readConsentCookie(): Consent | null {
  if (typeof document === 'undefined') return null;
  
  try {
    const match = document.cookie.match(new RegExp('(^| )' + CONSENT_COOKIE + '=([^;]+)'));
    if (!match) return null;
    
    const consent = JSON.parse(decodeURIComponent(match[2]));
    
    // Version check - falls sich das Format ändert
    if (consent.v !== CONSENT_VERSION) return null;
    
    return consent;
  } catch {
    return null;
  }
}

export function writeConsentCookie(consent: Consent) {
  const value = encodeURIComponent(JSON.stringify(consent));
  const expires = new Date(Date.now() + CONSENT_DURATION * 1000).toUTCString();
  
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_DURATION}; Path=/; SameSite=Lax; expires=${expires}`;
}

export function deleteConsentCookie() {
  document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export function checkDoNotTrack(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  return (
    navigator.doNotTrack === '1' ||
    (window as any).doNotTrack === '1' ||
    (navigator as any).msDoNotTrack === '1'
  );
}

// Server-side cookie reading für SSR
export function readConsentFromCookieString(cookieString: string): Consent | null {
  try {
    const match = cookieString.match(new RegExp('(^| )' + CONSENT_COOKIE + '=([^;]+)'));
    if (!match) return null;
    
    const consent = JSON.parse(decodeURIComponent(match[2]));
    if (consent.v !== CONSENT_VERSION) return null;
    
    return consent;
  } catch {
    return null;
  }
}