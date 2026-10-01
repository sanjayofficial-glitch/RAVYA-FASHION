'use client';

import { useEffect, useState } from 'react';

/** rAF-throttled passive scroll position. Returns a boolean past threshold. */
export function useScrolledPast(thresholdPx: number): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setPast(window.scrollY > thresholdPx);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [thresholdPx]);

  return past;
}
