'use client';

import { ReactNode } from 'react';
import ConsentProvider from '@/components/consent/ConsentProvider';
import ConsentBanner from '@/components/consent/ConsentBanner';
import ConsentModal from '@/components/consent/ConsentModal';
import Analytics from '@/components/analytics/Analytics';
import { Toaster } from 'sonner';

interface RootProvidersProps {
  children: ReactNode;
}

export default function RootProviders({ children }: RootProvidersProps) {
  return (
    <ConsentProvider>
      {children}
      {/* Alle Components die useConsent verwenden MÜSSEN hier sein */}
      <ConsentBanner />
      <ConsentModal />
      <Analytics />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: '#333',
          },
          classNames: {
            toast: 'dark:bg-slate-800 dark:text-white',
          }
        }}
      />
    </ConsentProvider>
  );
}