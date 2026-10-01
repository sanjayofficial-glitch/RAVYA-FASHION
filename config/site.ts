export const site = {
  name: 'RAVYA FASHION',
  tagline: 'Curated style for Rourkela',
  description:
    'Ravya Fashion, Rourkela — a curated in-store catalog of casual, formal, denim and activewear from Ramraj, Killer, Sportiq, Ignite, Jockey and Unibro. Check what is in store, then enquire on WhatsApp.',
  url: 'https://ravyafashion.in',
  locale: 'en-IN',

  /**
   * Address: sourced from public directory listings (Justdial, 2026-09):
   * "Above Radhika Jwellers, Uditnagar, Rourkela". Owner: confirm wording.
   */
  PLACEHOLDER_ADDRESS: 'Above Radhika Jwellers, Udit Nagar, Rourkela, Odisha 769001',
  /** Owner: still needed — see docs/UPDATE-STORE-INFO.md */
  PLACEHOLDER_PHONE: '+910000000000',
  PLACEHOLDER_WHATSAPP: '910000000000',
  /**
   * Approximate pin: Udit Nagar neighborhood centroid (OpenStreetMap).
   * Owner: replace with the exact Radhika Jwellers pin from Google Maps
   * (right-click the building > copy coordinates).
   */
  PLACEHOLDER_GEO: { lat: 22.2279, lng: 84.8380 },

  /**
   * Weekly hours, 24h IST. 0 = Sunday. Empty string = closed.
   * Close time verified via directory listings; 10:00 open confirmed by owner.
   */
  hours: {
    0: '10:00-21:00',
    1: '10:00-21:00',
    2: '10:00-21:00',
    3: '10:00-21:00',
    4: '10:00-21:00',
    5: '10:00-21:00',
    6: '10:00-21:30',
  } as Readonly<Record<number, string>>,

  /**
   * Honesty gate: while true, the catalog is sample data and badges read
   * "AVAILABLE IN STORE*". Flip to false once real inventory is loaded.
   */
  sampleCatalog: true,
} as const;

export const STORE_OPEN_WARN = site.PLACEHOLDER_WHATSAPP.includes('0000');
