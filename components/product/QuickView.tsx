'use client';

import { useEffect, useRef, useState } from 'react';
import { products } from '@/data/products';
import { brandMap } from '@/data/brands';
import { formatPrice } from '@/lib/format';
import { productEnquiry, holdLink } from '@/lib/whatsapp';
import { track } from '@/lib/track';
import { ProductImage } from '@/components/ui/ProductImage';
import { InStoreBadge } from '@/components/ui/Badge';
import { CloseIcon } from '@/components/ui/icons';
import type { Product } from '@/data/products';

export function QuickView() {
  const [product, setProduct] = useState<Product | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pushGuard = useRef(false);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const p = products.find((x) => x.id === id);
      if (!p || !dialogRef.current) return;
      setProduct(p);
      dialogRef.current.showModal();
      if (!pushGuard.current) {
        pushGuard.current = true;
        history.pushState({ qv: true }, '');
      }
    };
    const onPop = () => {
      pushGuard.current = false;
      if (dialogRef.current?.open) dialogRef.current.close();
    };
    window.addEventListener('ravya:qv', onOpen);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('ravya:qv', onOpen);
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  const close = () => {
    const el = dialogRef.current;
    if (!el) return;
    const reduced = document.documentElement.dataset.motion === 'reduced';
    if (reduced || !el.open) {
      el.close();
      return;
    }
    el.classList.add('qv-exit');
    window.setTimeout(() => {
      el.classList.remove('qv-exit');
      if (el.open) el.close();
    }, 200);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setProduct(null)}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
      aria-label={product ? `Quick view: ${product.name}` : 'Quick view'}
      className="qv rounded-card bg-canvas p-0 backdrop:bg-ink/50"
      style={{ maxWidth: 560 }}
    >
      {product ? <QuickViewBody product={product} onClose={close} /> : null}
    </dialog>
  );
}

function QuickViewBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const brand = brandMap[product.brand];
  const [size, setSize] = useState<string | null>(null);
  const [reserve, setReserve] = useState<
    | { state: 'idle' }
    | { state: 'sending' }
    | { state: 'done'; ticketId: string; expiresAt: string }
    | { state: 'error'; message: string }
  >({ state: 'idle' });

  const createHold = async () => {
    if (reserve.state === 'sending') return;
    setReserve({ state: 'sending' });
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId: product.id, size }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        ticket?: { id: string; expiresAt: string };
        error?: string;
      };
      if (!res.ok || !json.ok || !json.ticket) {
        throw new Error(json.error ?? 'reserve_failed');
      }
      track('hold_created', { id: product.id });
      setReserve({ state: 'done', ticketId: json.ticket.id, expiresAt: json.ticket.expiresAt });
    } catch {
      setReserve({ state: 'error', message: 'Could not place the hold. Please try again or enquire on WhatsApp.' });
    }
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto">
      <div className="relative aspect-[4/5] w-full bg-canvas-alt">
        <ProductImage src={product.image} alt={product.name} lqip={product.lqip} sizes="560px" className="h-full w-full" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-pill bg-canvas text-ink shadow-lift"
        >
          <CloseIcon size={18} />
        </button>
      </div>
      <div className="p-5 md:p-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-2">{brand?.name ?? product.brand}</p>
        <h2 className="mt-1 text-xl font-semibold text-ink">{product.name}</h2>
        <p className="mt-1 text-lg font-semibold text-ink">{formatPrice(product.price, product.priceTo)}</p>
        <div className="mt-2">
          <InStoreBadge />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">{product.description}</p>
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.1em] text-ink-2">Sizes</p>
          <ul className="flex flex-wrap gap-2" aria-label="Available sizes">
            {product.sizes.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => setSize((cur) => (cur === s ? null : s))}
                  aria-pressed={size === s}
                  className={`min-h-[44px] min-w-[44px] rounded-pill border px-3 text-[13px] transition-colors ${
                    size === s ? 'border-accent bg-accent/10 font-semibold text-ink' : 'border-line text-ink'
                  }`}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {product.colors ? (
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.1em] text-ink-2">Colours</p>
            <ul className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <li key={c} className="rounded-pill border border-line px-3 py-1 text-[13px] text-ink">{c}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <a
          href={productEnquiry(product)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('whatsapp_click', { id: product.id, surface: 'quick_view' })}
          className="btn btn-primary mt-5 w-full"
        >
          Enquire on WhatsApp
        </a>
        {reserve.state === 'done' ? (
          <div className="mt-3 rounded-card border border-accent/40 bg-accent/5 p-4" role="status">
            <p className="text-sm font-semibold text-ink">On hold for 3 hours</p>
            <p className="mt-1 text-sm text-ink-2">
              Ticket <span className="font-mono font-semibold text-ink">{reserve.ticketId}</span>
              {' · '}valid until{' '}
              {new Date(reserve.expiresAt).toLocaleTimeString('en-IN', {
                hour: 'numeric',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata',
              })}{' '}
              IST. Show this at our Sector 5 store.
            </p>
            <a
              href={holdLink(product, size ?? undefined, undefined, reserve.ticketId)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { id: product.id, surface: 'hold_confirm' })}
              className="btn btn-secondary mt-3 w-full"
            >
              Confirm on WhatsApp
            </a>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={createHold}
              disabled={reserve.state === 'sending'}
              className="btn btn-secondary mt-3 w-full disabled:opacity-60"
            >
              {reserve.state === 'sending' ? 'Placing hold…' : 'Reserve 3-hour hold'}
            </button>
            {reserve.state === 'error' ? (
              <p className="mt-2 text-sm text-sale" role="alert">
                {reserve.message}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
