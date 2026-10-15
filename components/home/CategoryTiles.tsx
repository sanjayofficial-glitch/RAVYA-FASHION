import Link from 'next/link';
import { categories } from '@/data/products';
import { ProductImage } from '@/components/ui/ProductImage';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const MOOD_IMAGE: Record<string, string> = {
  casual: '/moods/mood_casual.avif',
  formal: '/moods/mood_formal.avif',
  party: '/moods/mood_party.avif',
  denim: '/moods/mood_denim.avif',
  activewear: '/moods/mood_activewear.avif',
  outerwear: '/moods/mood_outerwear.avif',
  essentials: '/moods/mood_essentials.avif',
};

const MOOD_ALT: Record<string, string> = {
  casual: 'Casual wear — relaxed everyday fashion',
  formal: 'Formal wear — crisp business and occasion wear',
  party: 'Party wear — statement outfits for nights out',
  denim: 'Denim — jackets, jeans and street style',
  activewear: 'Activewear — training and performance gear',
  outerwear: 'Outerwear — layers, jackets and windcheaters',
  essentials: 'Essentials — innerwear, basics and everyday comfort',
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
        {categories.map((c, i) => (
            <Reveal as="li" key={c.id} delay={(i % 4) * 50}>
              <Link
                href={`/shop?cat=${c.id}`}
                className="pressable group relative block aspect-[4/5] overflow-hidden rounded-lg bg-canvas-alt"
              >
                <ProductImage
                  src={MOOD_IMAGE[c.id]!}
                  alt={MOOD_ALT[c.id]!}
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
        ))}
        <Reveal as="li" delay={200}>
          <Link
            href="/shop"
            className="pressable flex aspect-[4/5] flex-col items-start justify-end rounded-lg bg-ink p-4 text-white"
          >
            <span
              className="max-w-full font-display font-extrabold uppercase leading-none"
              style={{ fontSize: "clamp(17px, calc(8vw - 8.5px), 1.5rem)" }}
            >
              All racks
            </span>
            <span className="mt-2 inline-block rounded-pill bg-ochre-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-ink">
              Shop all →
            </span>
          </Link>
        </Reveal>
      </ul>
    </section>
  );
}
