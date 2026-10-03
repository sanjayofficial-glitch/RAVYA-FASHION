'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  HomeIconFilled,
  ShopIconFilled,
  BrandsIconFilled,
  MoreIconFilled,
  HomeIcon,
  ShopIcon,
  BrandsIcon,
  MoreIcon,
} from '@/components/ui/icons';
import { useConstraints } from '@/hooks/useConstraints';
import { startSpring, type SpringHandle } from '@/hooks/useSpring';

type Tab = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }> | null;
  FilledIcon: React.ComponentType<{ size?: number; className?: string }> | null;
  action?: boolean;
};

const TABS: Tab[] = [
  { href: '/', label: 'Home', Icon: HomeIcon, FilledIcon: HomeIconFilled },
  { href: '/shop', label: 'Shop', Icon: ShopIcon, FilledIcon: ShopIconFilled },
  { href: '/brands', label: 'Brands', Icon: BrandsIcon, FilledIcon: BrandsIconFilled },
  { href: '/visit', label: 'Visit', Icon: null, FilledIcon: null },
  { href: '#more', label: 'More', Icon: MoreIcon, FilledIcon: MoreIconFilled, action: true },
];

const baseTabClassName =
  'group flex h-11 w-11 flex-col items-center justify-center rounded-xl px-1 py-1 text-[10px] font-semibold tracking-wide transition-[color,background-color,transform] duration-120 ease-out text-ink-2 group-hover:text-ink';

const activeScale = 'active:scale-95';
const reducedActive = 'active:scale-100';

/** Apple move/reposition values: critically damped, no overshoot on a move. */
const INDICATOR_SPRING = { damping: 1.0, response: 0.4 };

export function BottomNav() {
  const pathname = usePathname();
  const { reducedMotion } = useConstraints();
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const xRef = useRef(0);
  const placedRef = useRef(false);
  const tokenRef = useRef(0);
  const pillSpringRef = useRef<SpringHandle | null>(null);

  useLayoutEffect(() => {
    let rafId = 0;
    const move = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const el = activeRef.current;
        const list = listRef.current;
        const pill = pillRef.current;
        if (!el || !list || !pill) return;
        const a = el.getBoundingClientRect();
        const l = list.getBoundingClientRect();
        // center the indicator within the active tab; 24px pill keeps neighbouring
        // labels readable and matches the 24px indicator in the motion spec.
        const x = a.left - l.left + a.width * 0.5 - 12;
        const from = xRef.current;
        xRef.current = x;
        setReady(true);

        pillSpringRef.current?.stop();
        pillSpringRef.current = null;
        // First placement is not a move, so it must not animate in from 0.
        if (!placedRef.current || reducedMotion) {
          placedRef.current = true;
          pill.style.transform = `translateX(${x}px)`;
          return;
        }
        placedRef.current = true;
        // Promote for the move only — same rule as .reveal: a permanent
        // compositor layer for a 5px pill is a bad trade on low-end devices.
        const token = ++tokenRef.current;
        pill.style.willChange = 'transform';
        const handle = startSpring({
          from,
          to: x,
          damping: INDICATOR_SPRING.damping,
          response: INDICATOR_SPRING.response,
          onUpdate: (v) => {
            pill.style.transform = `translateX(${v}px)`;
          },
        });
        // stop() resolves `finished` too, so a superseded spring can settle
        // after the new one has started — the token keeps it from demoting it.
        const demote = () => {
          if (tokenRef.current === token) pill.style.willChange = 'auto';
        };
        handle.finished.then(demote, demote);
        pillSpringRef.current = handle;
      });
    };
    move();
    window.addEventListener('resize', move, { passive: true });
    return () => {
      window.removeEventListener('resize', move);
      if (rafId) window.cancelAnimationFrame(rafId);
      tokenRef.current += 1;
      pillSpringRef.current?.stop();
      pillSpringRef.current = null;
    };
  }, [pathname, reducedMotion]);

  const tabScale = reducedMotion ? reducedActive : activeScale;

  const iconClassName =
    'text-ink-2 group-hover:text-ink ' + (reducedMotion ? '' : 'transition-colors duration-150');

  return (
    <nav aria-label="Bottom navigation" className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      {/* Dynamic Island bar: rounded pill, frosted glass, hairline + soft shadow for depth.
          Only the home-indicator buffer comes from the safe-area env(); the 68px pill band sits
          flush above it so the island never rides under the OS gesture bar. */}
      <div
        className="mx-auto flex max-w-[420px] flex-col"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div
          ref={listRef}
          className="relative mx-auto flex h-[68px] w-full items-center justify-around rounded-2xl bg-white/70 px-4 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.18),0_2px_6px_-2px_rgba(0,0,0,0.06)]"
        >
          {/* Bronze indicator pill: a constant 24px, positioned with
              translateX on a spring so it is the only animated property and it
              is actually composited. It used to transition left, width and
              box-shadow — two layout-triggering properties and a paint-only
              one, for a width that never changed. */}
          <span
            ref={pillRef}
            aria-hidden
            className="absolute left-0 top-[6px] h-[5px] w-6 rounded-full bg-accent shadow-[0_0_0_4px_rgba(197,160,89,0.18)]"
            style={{
              opacity: ready ? 1 : 0,
              transition: 'opacity 150ms ease-out',
            }}
          />

          {TABS.map((tab) => {
            const active = pathname === tab.href;
            const Icon = tab.Icon;
            const FilledIcon = tab.FilledIcon;

            if (tab.action) {
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('ravya:more'))}
                  aria-current={active ? 'page' : undefined}
                  className={`${baseTabClassName} ${tabScale}`}
                >
                  <span className="relative flex h-full w-full items-center justify-center">
                    {active && FilledIcon ? (
                      <FilledIcon size={22} className="text-accent-ink" />
                    ) : (
                      <span className="pointer-events-none">
                        {Icon ? (
                          <Icon size={22} className={iconClassName} />
                        ) : (
                          <VisitIcon size={22} className={iconClassName} />
                        )}
                      </span>
                    )}
                  </span>
                  <span
                    className={`mt-0.5 transition-colors duration-150 ${active ? 'text-accent-ink' : 'text-ink-2 group-hover:text-ink'}`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={tab.label}
                href={tab.href}
                ref={active ? activeRef : undefined}
                aria-current={active ? 'page' : undefined}
                className={`${baseTabClassName} ${tabScale}${reducedMotion ? '' : ' active:opacity-80'}`}
              >
                <span className="relative flex h-full w-full items-center justify-center">
                  {active && FilledIcon ? (
                    <FilledIcon size={22} className="text-accent-ink" />
                  ) : (
                    <span className="pointer-events-none">
                      {Icon ? (
                        <Icon size={22} className={iconClassName} />
                      ) : (
                        <VisitIcon size={22} className={iconClassName} />
                      )}
                    </span>
                  )}
                </span>
                <span
                  className={`mt-0.5 transition-colors duration-150 ${active ? 'text-accent-ink' : 'text-ink-2 group-hover:text-ink'}`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function VisitIcon({ size = 22, className }: { size?: number; className?: string }) {
  // Fixed radius so server/client emit identical attribute values.
  // Hard-coded for the default 22px size so there's no floating-point diff at all.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" />
      <circle cx="12" cy="10" r={size === 22 ? 2.6 : size === 20 ? 2.3 : Math.round((size * 0.115) * 100) / 100} />
    </svg>
  );
}
