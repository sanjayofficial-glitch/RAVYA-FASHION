'use client';

import { useRef } from 'react';

/**
 * Hand-rolled FLIP for grid reflow: measure -> invert -> play.
 * Animates transform only. Skips entirely when constrained.
 */
export function useFlip(containerRef: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const rects = useRef<Map<string, DOMRect>>(new Map());

  const measure = () => {
    if (!enabled || !containerRef.current) return;
    rects.current.clear();
    containerRef.current.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((el) => {
      const id = el.dataset.flipId;
      if (id) rects.current.set(id, el.getBoundingClientRect());
    });
  };

  const play = () => {
    if (!enabled || !containerRef.current || rects.current.size === 0) return;
    containerRef.current.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((el) => {
      const id = el.dataset.flipId;
      const first = id ? rects.current.get(id) : undefined;
      const last = el.getBoundingClientRect();
      if (!first) {
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' });
        return;
      }
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: 'translate(0, 0)' },
        ],
        { duration: 250, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    });
    rects.current.clear();
  };

  return { measure, play };
}
