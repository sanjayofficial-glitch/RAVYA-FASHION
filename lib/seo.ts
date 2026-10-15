import type { Metadata } from 'next';
import { site } from '@/config/site';
import { weeklyHours } from './hours';
import { editorial } from '@/data/editorial';

/**
 * Split the single-line PLACEHOLDER_ADDRESS into PostalAddress fields.
 * Expected format (docs/UPDATE-STORE-INFO.md): "street, area, City, State PIN".
 */
function postalAddress() {
  const parts = site.PLACEHOLDER_ADDRESS.split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length < 3) {
    return {
      '@type': 'PostalAddress',
      streetAddress: site.PLACEHOLDER_ADDRESS,
      addressLocality: 'Rourkela',
      addressRegion: 'Odisha',
      addressCountry: 'IN',
    };
  }

  const tail = parts[parts.length - 1] ?? ''; // e.g. "Odisha 769001"
  const postalCode = tail.match(/\d{6}/)?.[0];
  return {
    '@type': 'PostalAddress',
    streetAddress: parts.slice(0, -2).join(', '),
    addressLocality: parts[parts.length - 2] ?? 'Rourkela',
    addressRegion: tail.replace(/\d{6}/, '').trim() || 'Odisha',
    ...(postalCode ? { postalCode } : {}),
    addressCountry: 'IN',
  };
}

/** Group days that share the same open–close range into one spec (schema.org shape). */
function openingHoursSpecs() {
  const byRange = new Map<string, string[]>();
  for (const day of weeklyHours()) {
    if (!day.range) continue;
    byRange.set(day.range, [...(byRange.get(day.range) ?? []), day.label]);
  }
  return [...byRange.entries()].map(([range, days]) => {
    const [opens, closes] = range.split('-');
    return { '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens, closes };
  });
}

/** ClothingStore entity — the local-SEO anchor referenced by every page. */
export function generateStoreJsonLd() {
  const storefront = editorial['visit_ravya-showroom-interior'];
  const { lat, lng } = site.PLACEHOLDER_GEO;
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': `${site.url}/#store`,
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    telephone: site.PLACEHOLDER_PHONE,
    image: storefront ? new URL(storefront.src, site.url).href : undefined,
    logo: new URL('/icons/icon-512.png', site.url).href,
    address: postalAddress(),
    geo: lat && lng ? { '@type': 'GeoCoordinates', latitude: lat, longitude: lng } : undefined,
    hasMap: lat && lng ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : undefined,
    openingHoursSpecification: openingHoursSpecs(),
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    areaServed: { '@type': 'City', name: 'Rourkela' },
    sameAs: [site.social.facebook, site.social.instagram],
  };
}

/** Site-level entity — helps Google show the brand name in search results. */
export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: 'en-IN',
    publisher: { '@id': `${site.url}/#store` },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

/** Breadcrumb trail (Home → page) for sub-pages. */
export function generateBreadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: new URL(crumb.path, site.url).href,
    })),
  };
}

/** Shared per-page metadata: canonical + matching OG/Twitter tags (titles follow the root template). */
export function pageMetadata(opts: { title: string; description: string; path: string }): Metadata {
  const title = `${opts.title} | ${site.name}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'en_IN',
      url: opts.path,
      title,
      description: opts.description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: opts.description,
    },
  };
}
