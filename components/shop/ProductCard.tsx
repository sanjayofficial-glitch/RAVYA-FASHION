'use client';

import { memo } from 'react';
import { products } from '@/data/products';
import { PRODUCT_LQIP } from '@/data/lqip';
import { brandMap } from '@/data/brands';
import { productEnquiry } from '@/lib/whatsapp';
import { track } from '@/lib/track';
import { ProductImage } from '@/components/ui/ProductImage';
import { InStoreBadge, NewBadge } from '@/components/ui/Badge';
import type { Product } from '@/data/products';

export function openQuickView(id: string) {
  window.dispatchEvent(new CustomEvent('ravya:qv', { detail: id }));
}

function ProductCardImpl({ product }: { product: Product }) {
  const brand = brandMap[product.brand];

  return (
    <article data-flip-id={product.id} className="pressable group flex h-full flex-col rounded-lg bg-white p-2.5 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <a
        href={productEnquiry(product)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('whatsapp_click', { id: product.id, surface: 'card' })}
        className="flex flex-1 flex-col"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-canvas-alt">
          <ProductImage src={product.image} alt={product.name} lqip={PRODUCT_LQIP[product.id]} className="h-full w-full" />
          {product.isNew ? (
            <span className="absolute left-2 top-2">
              <NewBadge />
            </span>
          ) : null}
          <span className="absolute bottom-2 right-2 rounded-pill bg-white/85 px-2.5 py-1 text-xs font-bold text-ink backdrop-blur-md">
            Tap to enquire
          </span>
        </div>
        <div className="flex flex-col gap-0.5 px-1 pb-1 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">{brand?.name ?? product.brand}</p>
          {/*
            Exactly two lines (2.75em at leading-snug) are reserved whether the
            name wraps or not: the in-store badge and the action row below then
            land on the same y in every card, so each grid row stays one straight
            lineup (long names are clamped rather than pushed out of alignment).
          */}
          <p className="line-clamp-2 min-h-[2.75em] text-[15px] font-semibold leading-snug text-ink">{product.name}</p>
          <div className="mt-0.5">
            <InStoreBadge />
          </div>
        </div>
      </a>
      {/*
        Actions live outside the enquiry anchor: interactive elements
        (buttons/links) nested inside an <a> are invalid HTML and trigger
        a hydration error. Stacked full-width (not a 2-column grid) so the
        labels can never wrap or overflow the pill at narrow card widths —
        both buttons stay single-line and flush with the card edges.
      */}
      <div className="mt-2 flex flex-col gap-2 px-1 pb-1">
        <button
          type="button"
          onClick={() => {
            track('quick_view_open', { id: product.id });
            openQuickView(product.id);
          }}
          className="inline-flex min-h-[44px] w-full items-center justify-center whitespace-nowrap rounded-pill border border-line px-3 text-[13px] font-semibold text-ink transition-colors hover:border-ink"
        >
          Quick View
        </button>
        <a
          href={productEnquiry(product)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('whatsapp_click', { id: product.id, surface: 'card' })}
          className="inline-flex min-h-[44px] w-full items-center justify-center whitespace-nowrap rounded-pill bg-ink px-3 text-[13px] font-bold text-white transition-transform duration-150 active:scale-[0.98]"
        >
          WhatsApp
        </a>
      </div>
    </article>
  );
}

/**
 * A filter change re-renders every card in the grid and none of them change:
 * the product object is stable and there is no local state. Memoising turns 29
 * re-renders per tap into 0 for the cards that stayed put.
 */
export const ProductCard = memo(ProductCardImpl);

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}