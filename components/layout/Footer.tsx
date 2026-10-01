import Link from 'next/link';
import { site } from '@/config/site';
import { weeklyHours } from '@/lib/hours';
import { generalEnquiry } from '@/lib/whatsapp';

export function Footer() {
  return (
    <footer className="mt-16 px-3 pb-6 md:px-6">
      <div className="mx-auto max-w-6xl rounded-xl bg-ink px-5 py-10 text-white md:px-10">
        {site.sampleCatalog ? (
          <p className="mb-8 text-center text-xs text-white/60">
            Preview catalog — please confirm availability on WhatsApp.
          </p>
        ) : null}
        <div className="grid gap-8 text-sm md:grid-cols-4">
          <div>
            <p className="mb-2 font-display text-xl font-extrabold uppercase">Ravya<span className="text-ochre-soft">.</span></p>
            <p className="text-white/60">Curated offline boutique — Sector 5, Rourkela.</p>
            <p className="mt-2 text-white/60">{site.PLACEHOLDER_ADDRESS}</p>
          </div>
          <nav aria-label="Footer navigation" className="grid content-start gap-2">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-white/50">Explore</p>
            <Link className="text-white/80 hover:text-white" href="/shop">Catalog</Link>
            <Link className="text-white/80 hover:text-white" href="/brands">Brands</Link>
            <Link className="text-white/80 hover:text-white" href="/about">Our Story</Link>
            <Link className="text-white/80 hover:text-white" href="/visit">Visit Us</Link>
          </nav>
          <div className="grid content-start gap-2">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-white/50">Hours</p>
            {weeklyHours().map((d) => (
              <p key={d.dayIndex} className="text-white/80">
                {d.label.slice(0, 3)} {d.range ? d.range : 'Closed'}
              </p>
            ))}
          </div>
          <div className="grid content-start gap-2">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-white/50">Enquiries</p>
            <a className="text-white/80 hover:text-white" href={`tel:${site.PLACEHOLDER_PHONE}`}>{site.PLACEHOLDER_PHONE}</a>
            <a className="text-white/80 hover:text-white" href={generalEnquiry()} target="_blank" rel="noopener noreferrer">
              WhatsApp concierge
            </a>
          </div>
        </div>
        <p className="mt-10 text-xs text-white/50">
          © {new Date().getFullYear()} {site.name}, Rourkela. All prices are indicative in-store prices in INR.
        </p>
      </div>
    </footer>
  );
}
