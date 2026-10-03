'use client';

import Link from 'next/link';
import { directionsUrl } from '@/lib/directions';
import { track } from '@/lib/track';
import { DirectionsIcon } from '@/components/ui/icons';
import { ProductImage } from '@/components/ui/ProductImage';
import { editorial } from '@/data/editorial';

const TRIPTYCH = [
  { key: 'home_highfashion-young-model-wearing-1', label: 'Casual' },
  { key: 'home_stylishly-tailored-male-model-2', label: 'Bright' },
  { key: 'home_bold-street-fashion-model-3', label: 'Extreme' },
];

export function Hero() {
  const portrait = editorial['home_macro-closeup-portrait-of-4']!;
  return (
    <section className="px-3 md:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-xl bg-white p-4 shadow-[0_20px_50px_rgba(0,104,93,0.06)] sm:p-6 md:p-8 lg:p-12">
        <div aria-hidden className="hero-glow pointer-events-none absolute -left-20 -top-32 h-80 w-80 rounded-full bg-pine/10 blur-3xl" />
        <div aria-hidden className="hero-glow pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-ochre-soft/60 blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col justify-between gap-6 lg:col-span-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-pill bg-canvas-alt px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Rourkela · Sector 5 Flagship
                </span>
                <span className="inline-flex items-center rounded-pill bg-ochre-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ochre">
                  Curated offline boutique
                </span>
                <span className="inline-flex items-center rounded-pill bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-ink">
                  Verified in stock
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Steel City vanguard style</p>
                <h1 className="display-campaign mt-2 text-ink">
                  Curated <span className="text-accent">style</span> for Rourkela
                </h1>
              </div>
              <div className="grid grid-cols-3 gap-2.5" aria-label="Featured moods">
                {TRIPTYCH.map((t) => {
                  const img = editorial[t.key]!;
                  return (
                    <div key={t.key} className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-canvas-alt">
                      <ProductImage
                        src={img.src}
                        alt={img.alt}
                        lqip={img.lqip}
                        sizes="(min-width: 1024px) 20vw, 30vw"
                        className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-pill bg-white/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink backdrop-blur-md">
                        {t.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="max-w-lg text-[15px] leading-relaxed text-ink-2 md:text-base">
                What you see online is on our physical racks. Browse curated fits, reserve the piece on
                WhatsApp, or try it on at our boutique store in Sector 5.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">
                Explore In-Store Catalog
              </Link>
              <a
                href={directionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('directions_tap', { surface: 'hero' })}
                className="btn btn-ghost"
              >
                <DirectionsIcon size={18} />
                Get Store Directions
              </a>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-canvas-alt lg:col-span-6">
            {/* priority stays: on mobile the grid is one column, so the h1 is
                ~500px tall worth of content above this — the portrait is still
                partly above the fold and is by far the largest element painted,
                which makes it the LCP, not the text. min-h reserves its box, so
                lazy-vs-eager costs no CLS. */}
            <ProductImage
              src={portrait.src}
              alt={portrait.alt}
              lqip={portrait.lqip}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="absolute inset-0 h-full w-full"
            />
            <span className="absolute left-4 top-4 rounded-pill bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink backdrop-blur-md">
              New season · in store now
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
