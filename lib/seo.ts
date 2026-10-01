import { site } from '@/config/site';
import { weeklyHours } from './hours';

export function generateLocalBusinessJsonLd() {
  const openingHours = weeklyHours()
    .filter((d) => d.range)
    .map((d) => `${d.label} ${d.open}-${d.close}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.PLACEHOLDER_PHONE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.PLACEHOLDER_ADDRESS,
      addressLocality: 'Rourkela',
      addressRegion: 'Odisha',
      postalCode: '769001',
      addressCountry: 'IN',
    },
    geo: site.PLACEHOLDER_GEO.lat
      ? { '@type': 'GeoCoordinates', latitude: site.PLACEHOLDER_GEO.lat, longitude: site.PLACEHOLDER_GEO.lng }
      : undefined,
    openingHoursSpecification: openingHours.map((h) => ({ '@type': 'OpeningHoursSpecification', description: h })),
    priceRange: '₹₹',
  };
}
