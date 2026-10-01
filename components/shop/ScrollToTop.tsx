'use client';

import { useEffect, useState } from 'react';
import { useConstraints } from '@/hooks/useConstraints';

/** Scroll-to-top pill. Appears past 1.5 viewports; hidden on save-data. */
export function ScrollToTop() {
  const { savedata } = useConstraints();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (savedata) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setVisible(window.scrollY > window.innerHeight * 1.5);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [savedata]);

  if (savedata || !visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="enter-rise fixed bottom-[calc(148px+env(safe-area-inset-bottom,0px))] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-pill border border-line bg-canvas text-ink shadow-lift md:bottom-20"
    >
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
