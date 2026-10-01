'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScrolledPast } from '@/hooks/useScrollY';
import { generalEnquiry } from '@/lib/whatsapp';
import { track } from '@/lib/track';
import { WhatsAppIcon } from '@/components/ui/icons';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/brands', label: 'Brands' },
  { href: '/about', label: 'About' },
  { href: '/visit', label: 'Visit' },
];

export function Header() {
  const scrolled = useScrolledPast(24);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6">
      <div
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-pill border border-line/70 pl-5 pr-2 transition-[background-color,box-shadow] duration-300 ease-swift ${
          scrolled ? 'bg-white/85 shadow-lift backdrop-blur-md' : 'bg-white/60 backdrop-blur-sm'
        }`}
      >
        <Link href="/" className="font-display text-base font-extrabold uppercase tracking-wide text-ink" aria-label="Ravya Fashion home">
          Ravya<span className="text-accent">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-pill px-4 py-2 text-sm font-semibold transition-colors ${
                  active ? 'bg-ink text-white' : 'text-ink-2 hover:bg-canvas-alt hover:text-ink'
                }`}
              >
                {item.label}
                {active ? <span className="sr-only">(current page)</span> : null}
              </Link>
            );
          })}
        </nav>

        <a
          href={generalEnquiry()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('whatsapp_click', { surface: 'header' })}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-pill bg-ink px-5 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.98]"
        >
          <WhatsAppIcon size={16} />
          WhatsApp
        </a>
      </div>
    </header>
  );
}
