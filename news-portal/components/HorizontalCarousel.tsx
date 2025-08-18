'use client';

import React from 'react';

interface HorizontalCarouselProps {
  children: React.ReactNode;
}

export default function HorizontalCarousel({ children }: HorizontalCarouselProps) {
  return (
    <>
      <div
        className="
          relative mt-4
          overflow-x-auto overscroll-x-contain
          grid grid-flow-col auto-cols-[72%] xs:auto-cols-[70%] sm:auto-cols-[300px]
          gap-3 px-4 py-1 -mx-4
          snap-x snap-mandatory scroll-px-4
          scrollbar-hide
        "
      >
        {children}
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}