'use client';

import { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';
import ConsentProvider from './ConsentProvider';

// Dynamically import consent components to prevent SSR issues
const ConsentBanner = dynamic(() => import('./ConsentBanner'), { ssr: false });
const ConsentModal = dynamic(() => import('./ConsentModal'), { ssr: false });
const Analytics = dynamic(() => import('@/components/analytics/Analytics'), { ssr: false });

interface ConsentWrapperProps {
  children: ReactNode;
}

export default function ConsentWrapper({ children }: ConsentWrapperProps) {
  return (
    <ConsentProvider>
      {children}
      <Suspense fallback={null}>
        <ConsentBanner />
        <ConsentModal />
        <Analytics />
      </Suspense>
    </ConsentProvider>
  );
}