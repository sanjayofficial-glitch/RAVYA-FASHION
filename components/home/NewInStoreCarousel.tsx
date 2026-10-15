'use client';

import { useEffect } from 'react';
import { products } from '@/data/products';
import { PRODUCT_LQIP } from '@/data/lqip';
import { brandMap } from '@/data/brands';
import { ProductImage } from '@/components/ui/ProductImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useConstraints } from '@/hooks/useConstraints';


export function NewInStoreCarousel() {
  const { lowmem, reducedMotion, savedata } = useConstraints();
  const constrained = lowmem || reducedMotion || savedata;
  const items = products.filter((p) => p.isNew).slice(0, 8);

  useEffect(() => {
    if (constrained) return;
    const el = document.getElementById('new-in-store');
    if (!el) return;
    const id = window.setInterval(() => {
      if (el.matches(':hover')) return;
      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft >= max - 8 ? 0 : el.scrollLeft + el.clientWidth * 0.6;
      el.scrollTo({ left: next, behavior: 'smooth' });
    }, 4000);
    return () => window.clearInterval(id);
  }, [constrained]);

  return (
    <section className="py-12 md:py-16" aria-label="New in store">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <SectionHeading sub="Fresh on the racks this week">New In-Store</SectionHeading>
      </div>
      <div id="new-in-store" className="carousel px-4 md:px-8">
        {items.map((p) => (
          <a
            key={p.id}
            href={`/shop?brand=${p.brand}`}
            className="pressable block w-[200px] rounded-lg bg-white p-2.5 shadow-[0_1px_8px_rgba(0,0,0,0.05)] md:w-[240px]"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-canvas-alt">
              <ProductImage src={p.image} alt={p.name} lqip={PRODUCT_LQIP[p.id]} sizes="240px" className="h-full w-full" />
              <span className="absolute left-2 top-2 rounded-pill bg-ochre-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                New
              </span>
            </div>
            <p className="mt-2 px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
              {brandMap[p.brand]?.name ?? p.brand}
            </p>
            <p className="px-1 text-[13px] font-semibold leading-snug text-ink">{p.name}</p>
            <p className="px-1 pb-1 text-[13px] text-ink-2">Tap to enquire on WhatsApp</p>
          </a>
        ))}
      </div>
    </section>
  );
}
