"use client";
import { useEffect, useState } from "react";
import { useConsent } from "@/lib/consent/context";

/**
 * ScriptGate - Lädt Komponenten/Scripts nur wenn die entsprechende Kategorie freigegeben ist
 * 
 * Usage:
 * <ScriptGate category="analytics">
 *   <GA4 measurementId="G-XXXX" />
 * </ScriptGate>
 */
export default function ScriptGate({
  category,
  children,
  fallback = null,
}: {
  category: "functional" | "analytics" | "marketing";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { consent, hasDecision } = useConsent();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Warte bis eine Entscheidung getroffen wurde
    if (!hasDecision) {
      setShouldRender(false);
      return;
    }

    // Prüfe ob die Kategorie freigegeben ist
    switch (category) {
      case "functional":
        setShouldRender(consent.functional);
        break;
      case "analytics":
        setShouldRender(consent.analytics);
        break;
      case "marketing":
        setShouldRender(consent.marketing);
        break;
      default:
        setShouldRender(false);
    }
  }, [category, consent, hasDecision]);

  // Zeige Fallback während auf Entscheidung gewartet wird
  if (!hasDecision) {
    return <>{fallback}</>;
  }

  // Rendere Kinder nur wenn Kategorie freigegeben
  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}