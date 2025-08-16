import type { ConsentRecord } from './types';

const KEY = "sw_consent_v1";
const MAX_AGE_DAYS = 180; // 6 Monate

export function getConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const rec = JSON.parse(raw) as ConsentRecord;
    
    // Gültigkeit prüfen
    const age = (Date.now() - Date.parse(rec.timestamp)) / (1000 * 60 * 60 * 24);
    return age > MAX_AGE_DAYS ? null : rec;
  } catch { 
    return null; 
  }
}

export function setConsent(rec: ConsentRecord) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(KEY, JSON.stringify(rec));
  // zusätzlich: knapper Cookie zur SSR-Erkennung (nur Flag, keine Kategorien)
  document.cookie = `sw_consent=1; Max-Age=${MAX_AGE_DAYS*24*3600}; Path=/; SameSite=Lax`;
  
  // Optional: Log to server (Supabase)
  logConsentToServer(rec);
}

export function clearConsent() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(KEY);
  document.cookie = "sw_consent=; Max-Age=0; Path=/; SameSite=Lax";
}

// Optional: Server-Logging
async function logConsentToServer(rec: ConsentRecord) {
  try {
    // Hier könnte Supabase-Integration erfolgen
    console.log('Consent recorded:', rec);
  } catch (e) {
    console.error('Failed to log consent:', e);
  }
}