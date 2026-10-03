'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { site } from '@/config/site';
import { generalEnquiry } from '@/lib/whatsapp';
import { computeOpenStatus } from '@/lib/hours';
import { CloseIcon } from '@/components/ui/icons';
import { startSpring, type SpringHandle } from '@/hooks/useSpring';
import { project, rubberband } from '@/lib/motion';
import { useConstraints } from '@/hooks/useConstraints';

/**
 * Bottom sheet for the "More" tab.
 *
 * A sheet is defined by the swipe, not the close button, so the panel follows
 * the finger 1:1 and the dismissal decision is made from momentum. One spring
 * owns the panel translate *and* the scrim opacity — a single value with two
 * consumers, which is what keeps them in step (§13 Harmony). Unmounting waits
 * on that spring's `finished` promise, not a hardcoded 250ms that only ever
 * matched the CSS duration by coincidence.
 */

/** Apple drawer/sheet values. 0.8 gives slight overshoot, correct for a
 *  momentum-driven dismissal; plain mode drops to critical so nothing bounces. */
const SHEET = { damping: 0.8, response: 0.3 };
const PLAIN = { damping: 1.0, response: 0.25 };
/** A flick faster than this commits regardless of where the finger landed. */
const FLING = 400;
/** Movement before a press becomes a drag (§10) — below this, taps still fire. */
const DRAG_THRESHOLD = 10;
/** Pointer samples kept for release velocity; the oldest inside the window wins. */
const VELOCITY_WINDOW_MS = 100;

type Sample = { t: number; y: number };

function releaseVelocity(samples: Sample[]): number {
  const last = samples[samples.length - 1];
  if (!last || samples.length < 2) return 0;
  let first = samples[0] as Sample;
  for (const s of samples) {
    if (last.t - s.t <= VELOCITY_WINDOW_MS) {
      first = s;
      break;
    }
  }
  const dt = last.t - first.t;
  if (dt <= 0) return 0;
  return ((last.y - first.y) / dt) * 1000;
}

export default function MoreSheet() {
  const [open, setOpen] = useState(false);
  const closingRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Reduced motion and save-data take the cross-fade path: no translate on the
  // enter/exit, opacity only, and a critically damped spring so the unmount
  // promise still resolves on the same mechanism.
  const { reducedMotion, savedata } = useConstraints();
  const plain = reducedMotion || savedata;

  /** Current panel offset in px. 0 = fully open, height = fully dismissed. */
  const offsetRef = useRef(0);
  const heightRef = useRef(0);
  const velocityRef = useRef(0);
  const springRef = useRef<SpringHandle | null>(null);
  const dragRef = useRef<{ startY: number; startOffset: number; moved: number; samples: Sample[] } | null>(null);
  const suppressClickRef = useRef(false);
  const exitTokenRef = useRef(0);

  const paint = useCallback(
    (offset: number) => {
      offsetRef.current = offset;
      const h = heightRef.current;
      const p = h > 0 ? Math.min(1, Math.max(0, 1 - offset / h)) : 1;
      const scrim = scrimRef.current;
      const panel = panelRef.current;
      if (scrim) scrim.style.opacity = String(p);
      if (panel) {
        if (plain) {
          panel.style.transform = 'translateY(0px)';
          panel.style.opacity = String(p);
        } else {
          panel.style.transform = `translateY(${offset}px)`;
          panel.style.opacity = '1';
        }
      }
    },
    [plain],
  );

  /** Spring the panel to `to`, carrying `velocity` (px/s) into the new motion. */
  const springTo = useCallback(
    (to: number, velocity: number) => {
      springRef.current?.stop();
      const curve = plain ? PLAIN : SHEET;
      const handle = startSpring({
        from: offsetRef.current,
        to,
        velocity,
        damping: curve.damping,
        response: curve.response,
        onUpdate: (v, vel) => {
          velocityRef.current = vel;
          paint(v);
        },
      });
      springRef.current = handle;
      return handle;
    },
    [paint, plain],
  );

  const beginClose = useCallback(
    (velocity = 0) => {
      if (closingRef.current) return;
      closingRef.current = true;
      const token = ++exitTokenRef.current;
      springTo(heightRef.current, velocity).finished.then(() => {
        if (exitTokenRef.current !== token) return;
        closingRef.current = false;
        setOpen(false);
      });
    },
    [springTo],
  );

  useEffect(() => {
    const onOpen = () => {
      const ae = document.activeElement;
      restoreFocusRef.current =
        ae && ae !== document.body && ae !== document.documentElement ? (ae as HTMLElement) : null;
      closingRef.current = false;
      setOpen(true);
    };
    const onClose = () => beginClose(velocityRef.current);
    window.addEventListener('ravya:more', onOpen);
    window.addEventListener('ravya:more-close', onClose);
    return () => {
      window.removeEventListener('ravya:more', onOpen);
      window.removeEventListener('ravya:more-close', onClose);
    };
  }, [beginClose]);

  // Enter: one spring from fully-off-screen to open. Also re-seeds the height,
  // which is what every drag decision is measured against.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    heightRef.current = panel.offsetHeight;
    velocityRef.current = 0;
    paint(heightRef.current);
    const curve = plain ? PLAIN : SHEET;
    const handle = startSpring({
      from: heightRef.current,
      to: 0,
      damping: curve.damping,
      response: curve.response,
      onUpdate: (v, vel) => {
        velocityRef.current = vel;
        paint(v);
      },
    });
    springRef.current = handle;
    return () => {
      handle.stop();
      if (springRef.current === handle) springRef.current = null;
    };
  }, [open, paint, plain]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape closes the sheet; Tab/Shift+Tab cycle focus within it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('ravya:more-close'));
        return;
      }
      if (e.key !== 'Tab') return;
      const root = rootRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => el.getClientRects().length > 0);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      const inside = active instanceof Node && root.contains(active);
      if (e.shiftKey) {
        if (!inside || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Inert everything behind the sheet, move focus into it, then hand focus back
  // to the trigger on close (inert is lifted before the restore runs).
  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const inerted: HTMLElement[] = [];
    if (root) {
      for (const child of Array.from(document.body.children)) {
        if (child === root || !(child instanceof HTMLElement)) continue;
        if (child.hasAttribute('inert')) continue;
        child.setAttribute('inert', '');
        inerted.push(child);
      }
    }
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      for (const el of inerted) el.removeAttribute('inert');
      const back = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (back && document.contains(back)) back.focus({ preventScroll: true });
    };
  }, [open]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const panel = panelRef.current;
    if (!panel) return;
    heightRef.current = panel.offsetHeight;
    // Grabbing cancels whatever is in flight, including a dismissal that has
    // already started — otherwise the sheet would be un-grabbable mid-exit.
    springRef.current?.stop();
    springRef.current = null;
    exitTokenRef.current += 1;
    closingRef.current = false;
    suppressClickRef.current = false;
    panel.setPointerCapture(e.pointerId);
    // The offset is tracked as a delta from the grab point, so the panel stays
    // glued to the finger wherever it was grabbed rather than snapping to centre.
    dragRef.current = {
      startY: e.clientY,
      startOffset: offsetRef.current,
      moved: 0,
      samples: [{ t: e.timeStamp, y: e.clientY }],
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dy = e.clientY - drag.startY;
    const h = heightRef.current || 1;
    let next = drag.startOffset + dy;
    if (next < 0) {
      // Upward past the open position: progressive resistance instead of a
      // hard stop, capped so a long drag cannot fling the sheet off the top.
      next = -Math.min(rubberband(-next, h), h * 0.25);
    }
    drag.moved = Math.max(drag.moved, Math.abs(dy));
    drag.samples.push({ t: e.timeStamp, y: e.clientY });
    if (drag.samples.length > 6) drag.samples.shift();
    paint(next);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    const panel = panelRef.current;
    if (panel?.hasPointerCapture(e.pointerId)) panel.releasePointerCapture(e.pointerId);
    // A drag that ended over a link must not also navigate.
    suppressClickRef.current = drag.moved > DRAG_THRESHOLD;
    if (cancelled) {
      springTo(0, 0);
      return;
    }
    const h = heightRef.current || 1;
    const v = releaseVelocity(drag.samples);
    velocityRef.current = v;
    // Dismiss or return from momentum, not from where the finger happened to
    // land: a fast flick commits, a slow drag is judged on its projected rest.
    const projected = offsetRef.current + project(v);
    const dismiss = v > FLING || (v > -FLING && projected > h * 0.5);
    if (dismiss) beginClose(v);
    else springTo(0, v);
  };

  if (!open) return null;
  const status = computeOpenStatus();

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="More menu"
    >
      <button
        ref={scrimRef}
        aria-label="Close menu"
        className="absolute inset-0 bg-ink/50"
        style={{ opacity: 0 }}
        onClick={() => window.dispatchEvent(new CustomEvent('ravya:more-close'))}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e, false)}
        onPointerCancel={(e) => endDrag(e, true)}
        onClickCapture={(e) => {
          if (!suppressClickRef.current) return;
          e.preventDefault();
          e.stopPropagation();
        }}
        className="absolute inset-x-0 bottom-0 cursor-grab touch-none select-none rounded-t-card bg-canvas p-5 pb-safe shadow-lift outline-none active:cursor-grabbing"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-pill bg-line" />
        <div className="mb-4 flex items-center justify-between">
          <p className="display-section !text-lg">More</p>
          <button
            aria-label="Close"
            onClick={() => window.dispatchEvent(new CustomEvent('ravya:more-close'))}
            className="flex h-11 w-11 items-center justify-center rounded-pill bg-canvas-alt text-ink"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <p className="mb-4 text-sm text-ink-2">
          {status.label} · {status.detail}
        </p>
        <nav aria-label="More" className="grid gap-1">
          <SheetLink href="/about" label="Our Story" />
          <SheetLink href="/visit" label="Visit Us — address & hours" />
          <SheetLink href="/brands" label="Brand Directory" />
          <a className="btn btn-primary mt-2 w-full" href={generalEnquiry()} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
          <p className="mt-3 text-center text-xs text-ink-2">
            {site.name} · {site.PLACEHOLDER_ADDRESS}
          </p>
        </nav>
      </div>
    </div>
  );
}

function SheetLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      onClick={() => window.dispatchEvent(new CustomEvent('ravya:more-close'))}
      className="flex min-h-[48px] items-center justify-between rounded-btn px-3 text-[15px] font-medium text-ink hover:bg-canvas-alt"
    >
      {label}
      <span aria-hidden className="text-ink-2">
        →
      </span>
    </Link>
  );
}
