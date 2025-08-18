import Link from "next/link";
import Navigation from "./Navigation";
import { signOutAction } from "@/app/(auth)/logout/action";

export interface HeaderProps {
  user?: { 
    id: string;
    email?: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const initials = user?.email?.[0]?.toUpperCase() ?? "S";
  
  return (
    <header className="sticky z-50 bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-white/10" style={{ top: 'env(safe-area-inset-top)' }}>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4 py-3">
          <Navigation />
          
          {!user ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="h-10 px-4 flex items-center text-sm font-medium text-white/90 hover:text-white transition-colors border border-white/20 rounded-lg hover:bg-white/10 backdrop-blur"
              >
                Anmelden
              </Link>
              <Link 
                href="/register" 
                className="h-10 px-4 flex items-center text-sm font-semibold bg-white/20 text-white rounded-lg hover:bg-white/30 backdrop-blur transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              >
                Registrieren
              </Link>
            </div>
          ) : (
            <div className="relative group">
              <button className="flex items-center gap-2 h-10 rounded-full px-2 ring-1 ring-white/20 bg-white/10 hover:bg-white/20 backdrop-blur transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50">
                <span className="grid h-8 w-8 place-content-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                  {initials}
                </span>
                <span className="hidden sm:block max-w-[180px] truncate text-sm text-white/90">
                  {user.email}
                </span>
                <svg className="h-4 w-4 text-white/70 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              <div className="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                            absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-200">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                </div>
                
                <Link 
                  href="/konto" 
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mein Profil
                </Link>
                
                <Link 
                  href="/konto/darstellung" 
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Einstellungen
                </Link>
                
                <Link 
                  href="/merken" 
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Gespeicherte Artikel
                </Link>
                
                <div className="my-2 border-t border-gray-100 dark:border-gray-700" />
                
                <form action={signOutAction as any}>
                  <button 
                    type="submit"
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 dark:text-red-400 text-left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Abmelden
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}