import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import RootProviders from "./RootProviders";
import { sbServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schnell Wissen",
  description: "Ihre zentrale Anlaufstelle für aktuelle Nachrichten und Wissen",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  other: {
    "google-adsense-account": "ca-pub-5441629263234394"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get user and theme
  const sb = await sbServer();
  const { data: { user } } = await sb.auth.getUser();
  
  // Get theme from cookie
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("sw_theme")?.value ?? "system";
  
  return (
    <html lang="de" className={themeCookie === "dark" ? "dark" : ""} suppressHydrationWarning>
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5441629263234394"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const p = JSON.parse(localStorage.getItem('sw_prefs')||'{}');
            const html = document.documentElement;
            
            // Theme
            const theme = p.theme || 'system';
            const mql = window.matchMedia('(prefers-color-scheme: dark)');
            const wantDark = theme==='dark' || (theme==='system' && mql.matches);
            html.classList.toggle('dark', !!wantDark);
          } catch(e) {}
        `}} />
        <RootProviders>
          <Header user={user ?? undefined} />
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
