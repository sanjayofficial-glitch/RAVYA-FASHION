export const site = {
  name: 'RAVYA FASHION',
  tagline: 'Curated style for Rourkela',
  description:
    'Ravya Fashion, Rourkela — a curated clothing store with casual, formal, denim and activewear from Ramraj, Killer, Sparky, Ignite, Jockey and Unibro. See what is on the racks today.',
  url: 'https://ravyafashion.in',
  locale: 'en-IN',

  /** Public social profiles — surfaced in the footer and schema.org sameAs. */
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61595523235766',
    instagram: 'https://www.instagram.com/ravyafashionrkl/',
  },

  /**
   * Address: sourced from public directory listings (Justdial, 2026-09):
   * "Above Radhika Jwellers, Uditnagar, Rourkela". Owner: confirm wording.
   */
  PLACEHOLDER_ADDRESS: 'Above Radhika Jwellers, Udit Nagar, Rourkela, Odisha 769001',
  PLACEHOLDER_PHONE: '+917008085440',
  PLACEHOLDER_WHATSAPP: '917008085440',
  /**
   * Exact pin from Google Maps (Ravya Style and Fashion, Rourkela).
   * Coordinates: 22.226790530930383, 84.83958553460019
   */
  PLACEHOLDER_GEO: { lat: 22.226790530930383, lng: 84.83958553460019 },

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
