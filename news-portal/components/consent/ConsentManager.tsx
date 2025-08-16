"use client";
import { useConsent } from "@/lib/consent/context";
import CookieBanner from "./Banner";
import PreferencesModal from "./PreferencesModal";

export default function ConsentManager() {
  const { 
    consent, 
    showBanner, 
    showPreferences, 
    save, 
    closePreferences 
  } = useConsent();

  return (
    <>
      {showBanner && (
        <CookieBanner 
          onSave={(categories) => save(categories, "banner")} 
        />
      )}
      
      {showPreferences && (
        <PreferencesModal
          initial={consent}
          onSave={(categories) => save(categories, "modal")}
          onClose={closePreferences}
        />
      )}
    </>
  );
}