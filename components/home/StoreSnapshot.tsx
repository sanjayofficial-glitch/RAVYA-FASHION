import Link from 'next/link';
import { site } from '@/config/site';
import { directionsUrl } from '@/lib/directions';
import { weeklyHours } from '@/lib/hours';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductImage } from '@/components/ui/ProductImage';
import { DirectionsIcon, ClockIcon } from '@/components/ui/icons';
import { StoreStatus } from '@/components/visit/StoreStatus';
import { editorial } from '@/data/editorial';

const WAYFINDING = [
  { label: 'Rourkela Station', time: '12 min' },
  { label: 'NIT Campus', time: '8 min' },
  { label: 'VIP Chowk', time: '5 min' },
];

export function StoreSnapshot() {
  const storefront = editorial['home_boutique-storefront-exterior-of-16']!;
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16" aria-label="Visit the store">
      <Reveal>
        <SectionHeading sub="Walk in — we would love to see you">The Store</SectionHeading>
      </Reveal>
      <Reveal delay={60}>
        <div className="grid overflow-hidden rounded-xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] md:grid-cols-2">
          <div className="relative min-h-[240px] bg-canvas-alt">
            <ProductImage
              src={storefront.src}
              alt={storefront.alt}
              lqip={storefront.lqip}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="absolute inset-0 h-full w-full"
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-pill bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink backdrop-blur-md">
              <ClockIcon size={14} />
              <StoreStatus />
            </span>
          </div>
          <div className="flex flex-col justify-center p-6 md:p-8">
            <p className="font-display text-xl font-extrabold uppercase text-ink">{site.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">{site.PLACEHOLDER_ADDRESS}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Getting here">
              {WAYFINDING.map((w) => (
                <li key={w.label} className="rounded-pill bg-canvas px-3 py-1.5 text-xs font-semibold text-ink-2">
                  {w.label} · <span className="text-ink">{w.time}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-4 grid max-w-xs gap-0.5 text-xs text-ink-2" aria-label="Opening hours">
              {weeklyHours().slice(0, 7).map((d) => (
                <li key={d.dayIndex} className="flex justify-between gap-6">
                  <span>{d.label.slice(0, 3)}</span>
                  <span>{d.range ? d.range : 'Closed'}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={directionsUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-[44px] !px-6">
                <DirectionsIcon size={16} />
                Get Directions
              </a>
              <Link href="/visit" className="btn btn-secondary !min-h-[44px] !px-6">
                Visit page
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
