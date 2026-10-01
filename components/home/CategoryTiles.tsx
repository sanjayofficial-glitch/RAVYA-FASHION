import Link from 'next/link';
import { categories } from '@/data/products';
import { editorial } from '@/data/editorial';
import { ProductImage } from '@/components/ui/ProductImage';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const MOOD_IMAGE: Record<string, string> = {
  casual: 'home_young-man-in-relaxed-6',
  formal: 'home_chic-business-casual-indian-7',
  party: 'home_expressive-party-fashion-with-8',
  denim: 'home_high-contrast-shot-of-9',
  activewear: 'home_athletic-young-runner-wearing-10',
  outerwear: 'home_model-posing-in-contemporary-12',
  essentials: 'home_traditional-refined-indian-handloom-11',
};

export function CategoryTiles() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <Reveal>
        <SectionHeading sub="Seven ways to walk the racks">
          Shop by Mood
        </SectionHeading>
      </Reveal>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => {
          const img = editorial[MOOD_IMAGE[c.id]!]!;
          return (
            <Reveal as="li" key={c.id} delay={(i % 4) * 50}>
              <Link
                href={`/shop?cat=${c.id}`}
                className="pressable group relative block aspect-[4/5] overflow-hidden rounded-lg bg-canvas-alt"
              >
                <ProductImage
                  src={img.src}
                  alt={`${c.label} mood — ${img.alt}`}
                  lqip={img.lqip}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 pt-10">
                  <span className="inline-block rounded-pill bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-ink backdrop-blur-md">
                    {c.label}
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
        <Reveal as="li" delay={200}>
          <Link
            href="/shop"
            className="pressable flex aspect-[4/5] flex-col items-start justify-end rounded-lg bg-ink p-4 text-white"
          >
            <span className="font-display text-2xl font-extrabold uppercase leading-none">All racks</span>
            <span className="mt-2 inline-block rounded-pill bg-ochre-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-ink">
              Shop all →
            </span>
          </Link>
        </Reveal>
      </ul>
    </section>
  );
}
