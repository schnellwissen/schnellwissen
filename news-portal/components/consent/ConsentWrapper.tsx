'use client';

import { ReactNode } from 'react';
import ConsentProvider from './ConsentProvider';
import ConsentBanner from './ConsentBanner';
import ConsentModal from './ConsentModal';
import Analytics from '@/components/analytics/Analytics';

interface ConsentWrapperProps {
  children: ReactNode;
}

export default function ConsentWrapper({ children }: ConsentWrapperProps) {
  return (
    <ConsentProvider>
      {children}
      <ConsentBanner />
      <ConsentModal />
      <Analytics />
    </ConsentProvider>
  );
}