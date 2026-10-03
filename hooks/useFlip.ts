'use client';

import { useRef } from 'react';
import { startSpring, type SpringHandle } from '@/hooks/useSpring';

/** A card can only have one writer on `transform` at a time. */
type FlipRun = {
  anim?: Animation;
  /** Set only for transform runs, so an opacity fade is never read as momentum. */
  origin?: { x: number; y: number };
  springs: SpringHandle[];
};

/**
 * Hand-rolled FLIP for grid reflow: measure -> invert -> play.
 * Animates transform only. Skips entirely when constrained.
 */
export function useFlip(containerRef: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const rects = useRef<Map<string, DOMRect>>(new Map());
  const runs = useRef<Map<string, FlipRun>>(new Map());

  const stop = (id: string) => {
    const run = runs.current.get(id);
    if (!run) return;
    run.anim?.cancel();
    for (const s of run.springs) s.stop();
    runs.current.delete(id);
  };

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
      if (!id) return;
      // Two rapid filter changes used to stack two `transform` writers on the
      // same card. Whatever is in flight is cancelled first, and its velocity
      // is inherited so the reflow carries the momentum of the interruption.
      const run = runs.current.get(id);
      const first = rects.current.get(id);
      const last = el.getBoundingClientRect();

      if (!first) {
        stop(id);
        const anim = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' });
        const entry: FlipRun = { anim, springs: [] };
        runs.current.set(id, entry);
        const drop = () => {
          if (runs.current.get(id) === entry) runs.current.delete(id);
        };
        anim.finished.then(drop, drop);
        return;
      }

      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        stop(id);
        return;
      }

      let vx = 0;
      let vy = 0;
      const origin = run?.origin;
      if (run?.anim && origin) {
        // Recover the interrupted animation's presented offset and speed, so
        // the spring starts exactly where the eye last saw the card.
        const t = typeof run.anim.currentTime === 'number' ? run.anim.currentTime : 0;
        const timing = run.anim.effect?.getComputedTiming() as
          | (ComputedEffectTiming & { transformedProgress?: number })
          | undefined;
        const raw = timing?.transformedProgress ?? timing?.progress ?? 0;
        const p = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        if (t > 0) {
          vx = ((origin.x * (1 - p) - origin.x) / (t / 1000)) || 0;
          vy = ((origin.y * (1 - p) - origin.y) / (t / 1000)) || 0;
        }
      }
      stop(id);

      const cur = { x: dx, y: dy };
      const write = () => {
        const on = cur.x !== 0 || cur.y !== 0;
        el.style.transform = on ? `translate(${cur.x}px, ${cur.y}px)` : '';
      };
      const springs: SpringHandle[] = [];
      // One spring per active axis; both write the same transform, so each
      // onUpdate reads both current values rather than owning one.
      if (Math.abs(dx) >= 1) {
        springs.push(
          startSpring({
            from: cur.x,
            to: 0,
            velocity: vx,
            damping: 1.0,
            response: 0.4,
            onUpdate: (v) => {
              cur.x = v;
              write();
            },
          }),
        );
      }
      if (Math.abs(dy) >= 1) {
        springs.push(
          startSpring({
            from: cur.y,
            to: 0,
            velocity: vy,
            damping: 1.0,
            response: 0.4,
            onUpdate: (v) => {
              cur.y = v;
              write();
            },
          }),
        );
      }
      const entry: FlipRun = { origin: { x: dx, y: dy }, springs };
      runs.current.set(id, entry);
      for (const s of springs) {
        s.finished.then(
          () => {
            if (runs.current.get(id) !== entry) return;
            runs.current.delete(id);
            el.style.transform = '';
          },
          () => undefined,
        );
      }
    });
    rects.current.clear();
  };

  return { measure, play };
}
