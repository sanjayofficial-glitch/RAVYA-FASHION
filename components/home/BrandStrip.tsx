import Link from 'next/link';
import { brands } from '@/data/brands';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductImage } from '@/components/ui/ProductImage';

const STICKER = [
  'bg-accent/10 text-accent-ink',
  'bg-ochre-soft text-ochre',
  'bg-clay/10 text-clay',
];

export function BrandStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 md:px-8" aria-label="Our brands">
      <div className="rounded-xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)] md:p-8">
        <Reveal>
          <SectionHeading sub="Six authorized partners, one roof">Our Brands</SectionHeading>
        </Reveal>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((b, i) => (
            <Reveal as="li" key={b.id} delay={(i % 6) * 50}>
              <Link
                href={`/shop?brand=${b.id}`}
                className="pressable group flex min-h-[120px] flex-col items-center justify-center gap-1.5 rounded-lg bg-canvas px-3 py-3 text-center"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <ProductImage
                    src={b.image}
                    alt={`${b.name} brand`}
                    sizes="40px"
                    className="h-full w-full"
                  />
                </div>
                <span className="font-display text-base font-extrabold uppercase tracking-wide text-ink">{b.name}</span>
                <span className={`rounded-pill px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STICKER[i % STICKER.length]}`}>
                  {b.origin}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
