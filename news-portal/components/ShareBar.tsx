"use client";
import { useState } from "react";
import { getCanonicalUrl, withUtm, shareTargets } from "@/lib/share";

type Props = { path: string; title: string };

export default function ShareBar({ path, title }: Props) {
  const [copied, setCopied] = useState(false);
  const canonical = getCanonicalUrl(path);
  const shareUrl = withUtm(canonical, "native");

  async function onNativeShare() {
    if (typeof navigator === "undefined" || !("share" in navigator)) return false;
    try {
      await (navigator as any).share({ title, url: shareUrl });
      return true;
    } catch {
      return false;
    }
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(withUtm(canonical, "copy"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  const targets = shareTargets(withUtm(canonical, "social"), title);

  return (
    <div className="flex items-center justify-end gap-2 flex-wrap">
      <span className="text-sm text-slate-600 mr-2">Artikel teilen:</span>

      {/* Native Share (mobil) */}
      <button
        type="button"
        onClick={onNativeShare}
        aria-label="Teilen (Geräte-Menü)"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 hover:bg-slate-50 transition-colors"
        title="Teilen"
      >
        {/* Share-Icon */}
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 12v6a2 2 0 0 0 2 2h8M7 12 17 4m0 0h-4m4 0v4" />
        </svg>
      </button>

      {/* Fallback: Social Links */}
      {targets.map(t => (
        <a
          key={t.key}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Teilen auf ${t.label}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 hover:bg-slate-50 transition-colors"
          title={`Auf ${t.label} teilen`}
        >
          {/* Icons */}
          {t.key === "x" && <span className="font-bold text-lg">𝕏</span>}
          {t.key === "facebook" && (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M13 20v-7h2.5l.5-3H13V8.5c0-.9.3-1.5 1.6-1.5H16V4.1C15.7 4 14.8 4 13.8 4 11.5 4 10 5.3 10 8v2H7.5v3H10v7h3z"/>
            </svg>
          )}
          {t.key === "linkedin" && (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M6 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM5 10h2v8H5zM10 10h2v1.2c.6-.9 1.5-1.4 2.8-1.4 2 0 3.2 1.3 3.2 3.7V18h-2v-3.9c0-1.4-.6-2.1-1.7-2.1-1 0-1.7.7-1.7 2.1V18h-2z"/>
            </svg>
          )}
          {t.key === "whatsapp" && (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M20 12a8 8 0 0 1-11.9 7l-3.1 1 1-3.1A8 8 0 1 1 20 12Zm-8-6a6 6 0 0 0-5.2 9l.3.5-1 3.2 3.3-1 .5.3A6 6 0 1 0 12 6Zm3.3 9.6c-.2.1-.9.4-1 .4s-.4.1-1-.1-1.9-.6-3.2-1.9-1.9-2.6-2.1-3.2 0-.8.1-1 .2-.3.4-.5.4-.3.6-.2c.2 0 .5.8.6 1s.5 1 .6 1.1.1.2 0 .4-.2.3-.4.5-.4.3-.6.5c-.2.1-.1.3 0 .5.1.2.7 1.2 1.6 2 .9.8 2 .1 2.2 0s.4-.1.6.1.8.6.9.8c.1.2.1.3.1.4Z"/>
            </svg>
          )}
          {t.key === "telegram" && (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M9.4 14.6 9 18l2.3-1.9 3.9 2.9c.7.4 1.2.2 1.4-.7l2.6-11.9c.3-1-.3-1.4-1.1-1.1L3.6 9.7c-1 .4-1 1 0 1.2l4.1 1.2 9.5-6.2-7.8 8.7Z"/>
            </svg>
          )}
        </a>
      ))}

      {/* Copy-Link */}
      <button
        type="button"
        onClick={onCopy}
        aria-label="Link kopieren"
        className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-300 px-3 hover:bg-slate-50 transition-colors"
        title="Link kopieren"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 9h8a2 2 0 0 1 2 2v8M6 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/>
        </svg>
        <span className="text-sm">{copied ? "Kopiert!" : "Link kopieren"}</span>
      </button>
    </div>
  );
}