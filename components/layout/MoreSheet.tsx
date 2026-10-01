'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { site } from '@/config/site';
import { generalEnquiry } from '@/lib/whatsapp';
import { computeOpenStatus } from '@/lib/hours';
import { CloseIcon } from '@/components/ui/icons';

/**
 * Bottom sheet for the "More" tab. Enters via .sheet-in, exits via .sheet-exit
 * (same edge, symmetric paths), then unmounts after the 250ms exit.
 */
export default function MoreSheet() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);

  useEffect(() => {
    const onOpen = () => {
      closingRef.current = false;
      setClosing(false);
      setOpen(true);
    };
    const onClose = () => {
      if (closingRef.current) return;
      closingRef.current = true;
      setClosing(true);
      window.setTimeout(() => {
        closingRef.current = false;
        setOpen(false);
        setClosing(false);
      }, 250);
    };
    window.addEventListener('ravya:more', onOpen);
    window.addEventListener('ravya:more-close', onClose);
    return () => {
      window.removeEventListener('ravya:more', onOpen);
      window.removeEventListener('ravya:more-close', onClose);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;
  const status = computeOpenStatus();

  return (
    <div
      className={`fixed inset-0 z-[90] md:hidden ${closing ? 'opacity-0 transition-opacity duration-200' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="More menu"
    >
      <button
        aria-label="Close menu"
        className="absolute inset-0 bg-ink/50"
        onClick={() => window.dispatchEvent(new CustomEvent('ravya:more-close'))}
      />
      <div
        className={`absolute inset-x-0 bottom-0 rounded-t-card bg-canvas p-5 pb-safe shadow-lift ${
          closing ? 'sheet-exit' : 'sheet-in'
        }`}
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
