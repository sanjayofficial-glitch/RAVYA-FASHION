import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { ProductImage } from '@/components/ui/ProductImage';
import { editorial } from '@/data/editorial';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Why Ravya Fashion exists: accessible luxury for Rourkela — curated brands, honest prices, and a store that treats every customer like a regular.',
};

const CHAPTERS = [
  {
    title: 'Why Ravya',
    body: 'We opened Ravya Fashion with one belief: Rourkela deserves a store that curates as carefully as any metro boutique. Every piece on our racks is chosen, tried and priced by us — nothing is here by accident.',
  },
  {
    title: 'Accessible Luxury',
    body: 'Luxury is not a price tag. It is the fit, the fabric, the finish — and the feeling of being looked after. From Jockey essentials to our in-house tailoring, we stock the full range so everyone finds their level.',
  },
  {
    title: 'Our Rourkela',
    body: 'We are from here. Our customers are students, engineers, families and friends — Gen Z to Millennial and beyond. What you see on this site is what we have in store today. Walk in; we will take it from there.',
  },
];

const METRICS = [
  { value: '6', label: 'Authorized brands' },
  { value: '29', label: 'Pieces on racks' },
  { value: '7', label: 'Style moods' },
];

export default function AboutPage() {
  const collageA = editorial['about_about-editorial-1-1'];
  const collageB = editorial['about_two-creative-friends-in-2'];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <SectionHeading sub="Three things you should know about us">Our Story</SectionHeading>
      {(collageA || collageB) && (
        <div className="mb-10 grid gap-3 sm:grid-cols-5">
          {collageA ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-canvas-alt sm:col-span-3">
              <ProductImage
                src={collageA.src}
                alt={collageA.alt}
                lqip={collageA.lqip}
                sizes="(min-width: 640px) 60vw, 100vw"
                className="absolute inset-0 h-full w-full"
              />
              <span className="absolute bottom-3 left-3 rounded-pill bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink backdrop-blur-md">
                Sector 5 · Rourkela
              </span>
            </div>
          ) : null}
          {collageB ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-canvas-alt sm:col-span-2">
              <ProductImage
                src={collageB.src}
                alt={collageB.alt}
                lqip={collageB.lqip}
                sizes="(min-width: 640px) 40vw, 100vw"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : null}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {CHAPTERS.map((c, i) => (
          <Reveal key={c.title} delay={i * 60}>
            <section className="h-full rounded-lg bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
              <p className="mb-2 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-accent">0{i + 1}</p>
              <h2 className="font-display text-lg font-extrabold uppercase text-ink">{c.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{c.body}</p>
            </section>
          </Reveal>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3" aria-label="Store metrics">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-pill bg-ochre-soft px-5 py-2.5 text-ink">
            <span className="font-display text-lg font-extrabold">{m.value}</span>{' '}
            <span className="text-xs font-bold uppercase tracking-wider">{m.label}</span>
          </div>
        ))}
      </div>
      <Reveal delay={100}>
        <div className="mt-8 rounded-xl bg-ink p-8 text-white md:p-12">
          <h2 className="display-section !text-white">See it in person</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
            The catalog online is only half the story. Visit the store for the full range, fitting and honest advice.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/visit" className="btn btn-on-image">Plan your visit</Link>
            <Link href="/shop" className="btn btn-secondary">Browse the catalog</Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
