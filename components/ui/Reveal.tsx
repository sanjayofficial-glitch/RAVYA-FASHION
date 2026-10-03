'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
}

/** Paths already animated this session (client-side navigations only; a full
    reload clears the set so first-time visitors still get the entrance). */
const animatedPaths = new Set<string>();

/** IntersectionObserver reveal: 8px rise + fade, fires once per path. */
export function Reveal({ children, delay = 0, className = '', as = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;

    // Promote the element to its own compositor layer for the duration of the
    // entrance only. Doing this for the whole page lifetime is a permanent
    // layer per reveal (28+ client components) and costs more than it saves.
    const promote = () => el.classList.add('will-reveal');
    const release = () => {
      if (timer) window.clearTimeout(timer);
      timer = 0;
      el.classList.remove('will-reveal');
    };
    // Release on a timer sized from the element's own computed transition, so
    // the layer is dropped exactly when the entrance ends — and the reduced-
    // motion/save-data overrides (150ms, no transform) release just as early.
    const releaseAfterTransition = () => {
      const cs = window.getComputedStyle(el);
      const toMs = (v: string) => {
        const first = v.split(',')[0]?.trim() ?? '';
        return first.endsWith('ms') ? parseFloat(first) : parseFloat(first) * 1000;
      };
      const total = toMs(cs.transitionDuration) + toMs(cs.transitionDelay);
      const ms = Number.isFinite(total) && total > 0 ? total : 600;
      timer = window.setTimeout(release, ms + 50);
    };

    // Returning to an already-animated route: show immediately, no observer,
    // so tab re-visits don't wait on a fade-in that has already played.
    if (animatedPaths.has(pathname)) {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            promote();
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
            animatedPaths.add(pathname);
            releaseAfterTransition();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      release();
    };
  }, [pathname]);

  const Tag = as as 'div';
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
