'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';
import { HomeIcon, ShopIcon, BrandsIcon, MoreIcon } from '@/components/ui/icons';

type Tab = { href: string; label: string; Icon: React.ComponentType<{ size?: number }> | null; action?: boolean };

const TABS: Tab[] = [
  { href: '/', label: 'Home', Icon: HomeIcon },
  { href: '/shop', label: 'Shop', Icon: ShopIcon },
  { href: '/brands', label: 'Brands', Icon: BrandsIcon },
  { href: '/visit', label: 'Visit', Icon: null },
  { href: '#more', label: 'More', Icon: MoreIcon, action: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const move = () => {
      const el = activeRef.current;
      const list = listRef.current;
      if (!el || !list) return;
      const a = el.getBoundingClientRect();
      const l = list.getBoundingClientRect();
      setIndicator({ left: a.left - l.left + a.width * 0.2, width: a.width * 0.6, ready: true });
    };
    move();
    window.addEventListener('resize', move, { passive: true });
    return () => window.removeEventListener('resize', move);
  }, [pathname]);

  return (
    <nav aria-label="Bottom navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/92 backdrop-blur-md md:hidden">
      <div ref={listRef} className="relative mx-auto grid max-w-md grid-cols-5 px-2 pt-1 pb-safe">
        <span
          aria-hidden
          className="absolute top-0 h-[3px] rounded-pill bg-accent transition-[left,width] duration-200 ease-swift"
          style={{ left: indicator.left, width: indicator.width, opacity: indicator.ready ? 1 : 0 }}
        />
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.Icon;
          if (tab.action) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('ravya:more'))}
                className="relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-1 py-1 text-[10px] font-medium text-ink-2"
              >
                {Icon ? <Icon size={20} /> : null}
                <span>{tab.label}</span>
              </button>
            );
          }
          return (
            <Link
              key={tab.label}
              href={tab.href}
              ref={active ? activeRef : undefined}
              aria-current={active ? 'page' : undefined}
              className={`relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-1 py-1 text-[10px] font-medium ${active ? 'text-accent-ink' : 'text-ink-2'}`}
            >
              {Icon ? <Icon size={20} /> : <VisitIcon />}
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function VisitIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}
