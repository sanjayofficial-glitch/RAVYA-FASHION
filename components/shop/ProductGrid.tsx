'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import { filterProducts } from '@/lib/filter';
import { useConstraints } from '@/hooks/useConstraints';
import { useFlip } from '@/hooks/useFlip';
import type { Product } from '@/data/products';
import { ProductCard } from './ProductCard';
import { generalEnquiry } from '@/lib/whatsapp';

export function ProductGrid() {
  const params = useSearchParams();
  const cat = params.get('cat') ?? undefined;
  const brand = params.get('brand') ?? undefined;
  const tier = params.get('tier') ?? undefined;
  const sort = params.get('sort') ?? '';
  const containerRef = useRef<HTMLDivElement>(null);
  const { lowmem, reducedMotion } = useConstraints();
  const flipEnabled = !lowmem && !reducedMotion;
  const { measure, play } = useFlip(containerRef, flipEnabled);

  // Memoised: this is a pure derivation of search params, but it was rebuilding
  // (and re-allocating) a fresh array on every render, which defeats React.memo
  // on the cards below even when the filter has not changed.
  const items = useMemo(() => {
    const list = filterProducts(products, { cat, brand, tier });
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    if (sort === 'new') return [...list].sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false));
    return list;
  }, [cat, brand, tier, sort]);

  const [rendered, setRendered] = useState<Product[]>(items);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      setRendered(items);
      return;
    }
    measure();
    setRendered(items);
  }, [cat, brand, tier, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const raf = requestAnimationFrame(() => play());
    return () => cancelAnimationFrame(raf);
  }, [rendered]); // eslint-disable-line react-hooks/exhaustive-deps

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <p aria-live="polite" className="mb-3 text-[13px] text-ink-2">
        {items.length} item{items.length === 1 ? '' : 's'}
      </p>
      <div ref={containerRef} className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
      {rendered.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="enter-rise flex flex-col items-center py-16 text-center">
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden className="text-line">
        <rect x="18" y="14" width="60" height="68" rx="6" stroke="currentColor" strokeWidth="2.5" />
        <path d="M34 38h28M34 50h28M34 62h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <p className="mt-4 max-w-xs text-[15px] text-ink-2">
        Nothing matches those filters right now — new stock lands daily. Ask us on WhatsApp.
      </p>
      <a
        href={generalEnquiry()}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary mt-5"
      >
        Ask us on WhatsApp
      </a>
    </div>
  );
}
