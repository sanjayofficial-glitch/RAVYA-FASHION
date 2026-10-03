import type { Metadata } from 'next';
import Link from 'next/link';
import { brands } from '@/data/brands';
import { editorial } from '@/data/editorial';
import { ProductImage } from '@/components/ui/ProductImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { ChevronRightIcon } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Our Brands',
  alternates: { canonical: '/brands' },
  description: 'Ramraj, Killer, Sportiq, Ignite, Jockey and Unibro — the six authorized brand partners stocked at Ravya Fashion, Rourkela.',
};

export default function BrandsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <SectionHeading as="h1" sub="Six authorized partners, one roof">Our Brands</SectionHeading>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b, i) => {
          const img = editorial[`brands_brands-editorial-${(i % 6) + 1}-${(i % 6) + 1}`];
          return (
            <Reveal as="li" key={b.id} delay={(i % 3) * 60}>
              <Link
                href={`/shop?brand=${b.id}`}
                className="pressable group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-[0_1px_8px_rgba(0,0,0,0.05)]"
              >
                {img ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-canvas-alt">
                    <ProductImage
                      src={img.src}
                      alt={`${b.name} curation — ${img.alt}`}
                      lqip={img.lqip}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-pill bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                      Authorized
                    </span>
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  <span className="font-display text-lg font-extrabold uppercase tracking-wide text-ink">{b.name}</span>
                  <span className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-2">{b.origin}</span>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-2">{b.blurb}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {b.categories.map((c) => (
                      <span key={c} className="rounded-pill bg-canvas px-2.5 py-0.5 text-[11px] font-semibold text-ink-2">{c}</span>
                    ))}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-accent">
                    View items <ChevronRightIcon size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
