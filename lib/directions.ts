import { site } from '@/config/site';

/** Universal Google Maps directions link with geo: fallback intent. */
export function directionsUrl(): string {
  const { lat, lng } = site.PLACEHOLDER_GEO;
  if (lat && lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.PLACEHOLDER_ADDRESS)}`;
}

export function geoFallback(): string {
  const { lat, lng } = site.PLACEHOLDER_GEO;
  if (lat && lng) return `geo:${lat},${lng}`;
  return `geo:0,0?q=${encodeURIComponent(site.PLACEHOLDER_ADDRESS)}`;
}

export function mapEmbedUrl(): string {
  const { lat, lng } = site.PLACEHOLDER_GEO;
  if (lat && lng) {
    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(site.PLACEHOLDER_ADDRESS)}&z=15&output=embed`;
}

export function staticMapThumbUrl(): string {
  // Static map APIs need keys; we render a branded CSS placeholder instead
  // and load the interactive embed only on tap. Kept for future swap-in.
  return '';
}
