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
        {/* Resource Hints für externe Domains */}
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <link rel="preconnect" href="https://uabmwhtoimelqpuhyluz.supabase.co" />
        <link rel="dns-prefetch" href="https://uabmwhtoimelqpuhyluz.supabase.co" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        
        {/* Critical CSS inline to prevent render blocking */}
        <style dangerouslySetInnerHTML={{ __html: `
          *{margin:0;padding:0;box-sizing:border-box}html{-webkit-text-size-adjust:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif}body{margin:0;min-height:100vh;background:#0f172a;color:#e2e8f0;line-height:1.5;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.min-h-screen{min-height:100vh}.bg-bg{background-color:var(--bg,#0f172a)}.mx-auto{margin-left:auto;margin-right:auto}.max-w-screen-xl{max-width:1280px}header{position:sticky;top:0;z-index:50;background:rgba(15,23,42,0.9);backdrop-filter:blur(12px)}img[loading="lazy"]{opacity:0;transition:opacity .3s}img[loading="lazy"].loaded{opacity:1}.h-\\[136px\\]{height:136px}@media(prefers-color-scheme:dark){:root{--bg:#0f172a;--text:#e2e8f0}}.dark{--bg:#0f172a;--text:#e2e8f0}
        ` }} />
        
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
