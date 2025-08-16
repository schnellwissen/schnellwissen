export function getCanonicalUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  
  // Ensure base is not empty
  if (!base) {
    return path;
  }
  
  try {
    return new URL(path, base).toString();
  } catch (error) {
    console.error('Invalid URL in getCanonicalUrl:', { path, base, error });
    return base + path;
  }
}

export function withUtm(url: string, source: string, campaign = "share") {
  const u = new URL(url);
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", "social");
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

export function shareTargets(url: string, title: string) {
  const eT = encodeURIComponent(title);
  const eU = encodeURIComponent(url);
  return [
    { key: "x",        label: "X (Twitter)", href: `https://twitter.com/intent/tweet?text=${eT}&url=${eU}` },
    { key: "facebook", label: "Facebook",    href: `https://www.facebook.com/sharer/sharer.php?u=${eU}` },
    { key: "linkedin", label: "LinkedIn",    href: `https://www.linkedin.com/sharing/share-offsite/?url=${eU}` },
    { key: "whatsapp", label: "WhatsApp",    href: `https://api.whatsapp.com/send?text=${eT}%20${eU}` },
    { key: "telegram", label: "Telegram",    href: `https://t.me/share/url?url=${eU}&text=${eT}` },
  ];
}