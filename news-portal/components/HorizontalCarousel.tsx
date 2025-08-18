'use client';

import React from 'react';

interface HorizontalCarouselProps {
  children: React.ReactNode;
}

export default function HorizontalCarousel({ children }: HorizontalCarouselProps) {
  return (
    <div
      className="
        mt-4 flex gap-4 overflow-x-auto px-1 pb-2
        snap-x snap-mandatory
        scrollbar-hide
      "
    >
      {children}
    </div>
  );
}