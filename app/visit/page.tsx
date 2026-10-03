import type { Metadata } from 'next';
import { site } from '@/config/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductImage } from '@/components/ui/ProductImage';
import { editorial } from '@/data/editorial';
import { MapEmbed } from '@/components/visit/MapEmbed';
import { HoursTable } from '@/components/visit/HoursTable';
import { DirectionsButton } from '@/components/visit/DirectionsButton';
import { VisitActions } from '@/components/visit/VisitActions';
import { BookingForm } from '@/components/visit/BookingForm';

export const metadata: Metadata = {
  title: 'Visit Us',
  alternates: { canonical: '/visit' },
  description: 'Address, hours, live open/closed status, GPS directions and WhatsApp for Ravya Fashion, Rourkela.',
};

const AMENITIES = ['Private fitting suites', 'Garment steam', '30-min master tailor', 'Valet parking'];

export default function VisitPage() {
  const banner = editorial['visit_modern-high-street-boutique-2'];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <SectionHeading as="h1" sub="Address, hours and one-tap directions">Visit Us</SectionHeading>
      {banner ? (
        <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-xl bg-canvas-alt">
          <ProductImage
            src={banner.src}
            alt={banner.alt}
            lqip={banner.lqip}
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="absolute inset-0 h-full w-full"
          />
          <span className="absolute bottom-3 left-3 rounded-pill bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink backdrop-blur-md">
            Sector 5 Commercial Promenade
          </span>
        </div>
      ) : null}
      <ul className="mb-8 flex flex-wrap gap-2" aria-label="Showroom amenities">
        {AMENITIES.map((a) => (
          <li key={a} className="rounded-pill bg-ochre-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ochre">
            {a}
          </li>
        ))}
      </ul>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <MapEmbed />
        </div>
        <div className="flex flex-col gap-5">
          <section aria-label="Address">
            <h2 className="mb-1 text-sm font-medium uppercase tracking-[0.1em] text-ink-2">Address</h2>
            <p className="text-[15px] leading-relaxed text-ink">{site.PLACEHOLDER_ADDRESS}</p>
          </section>
          <section aria-label="Opening hours">
            <h2 className="mb-1 text-sm font-medium uppercase tracking-[0.1em] text-ink-2">Hours</h2>
            <HoursTable />
          </section>
          <DirectionsButton />
          <VisitActions />
        </div>
      </div>
      <div className="mt-8 max-w-xl">
        <BookingForm />
      </div>
    </div>
  );
}
