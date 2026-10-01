'use client';

import { products } from '@/data/products';
import { brandMap } from '@/data/brands';
import { formatPrice } from '@/lib/format';
import { productEnquiry } from '@/lib/whatsapp';
import { track } from '@/lib/track';
import { ProductImage } from '@/components/ui/ProductImage';
import { InStoreBadge, NewBadge } from '@/components/ui/Badge';
import type { Product } from '@/data/products';

export function openQuickView(id: string) {
  window.dispatchEvent(new CustomEvent('ravya:qv', { detail: id }));
}

export function ProductCard({ product }: { product: Product }) {
  const brand = brandMap[product.brand];

  return (
    <article data-flip-id={product.id} className="pressable group flex flex-col rounded-lg bg-white p-2.5 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-canvas-alt">
        <ProductImage src={product.image} alt={product.name} lqip={product.lqip} className="h-full w-full" />
        {product.isNew ? (
          <span className="absolute left-2 top-2">
            <NewBadge />
          </span>
        ) : null}
        <span className="absolute bottom-2 right-2 rounded-pill bg-white/85 px-2.5 py-1 text-xs font-bold text-ink backdrop-blur-md">
          {formatPrice(product.price, product.priceTo)}
        </span>
      </div>
      <div className="flex flex-col gap-0.5 px-1 pb-1 pt-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">{brand?.name ?? product.brand}</p>
        <p className="text-[15px] font-semibold leading-snug text-ink">{product.name}</p>
        <div className="mt-0.5">
          <InStoreBadge />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              track('quick_view_open', { id: product.id });
              openQuickView(product.id);
            }}
            className="inline-flex min-h-[44px] items-center justify-center rounded-pill border border-line px-3 text-[13px] font-semibold text-ink transition-colors hover:border-ink"
          >
            Quick View
          </button>
          <a
            href={productEnquiry(product)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', { id: product.id, surface: 'card' })}
            className="inline-flex min-h-[44px] items-center justify-center rounded-pill bg-ink px-3 text-[13px] font-bold text-white transition-transform duration-150 active:scale-[0.98]"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
