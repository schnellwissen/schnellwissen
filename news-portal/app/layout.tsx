import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/Header";
import { ConsentProvider } from "@/lib/consent/context";
import ConsentManager from "@/components/consent/ConsentManager";
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
        <ConsentProvider version="1.0.0">
          <Header user={user ?? undefined} />
          {children}
          <ConsentManager />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#fff',
                color: '#333',
              },
            }}
          />
        </ConsentProvider>
      </body>
    </html>
  );
}
