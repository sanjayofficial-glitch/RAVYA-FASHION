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
          <div className="grid content-start gap-2">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-white/50">Follow Us</p>
            <div className="flex items-center gap-3">
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-white/50">
          © {new Date().getFullYear()} {site.name}, Rourkela. Prices available on request via WhatsApp.
        </p>
      </div>
    </footer>
  );
}
