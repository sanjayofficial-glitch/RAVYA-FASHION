export type BrandId = 'ramraj' | 'killer' | 'sparky' | 'ignite' | 'jockey' | 'unibro' | 'ravya';

export interface Brand {
  id: BrandId;
  name: string;
  origin: string;
  blurb: string;
  categories: string[];
  /** High-quality brand card image — partner cards only. */
  image: string;
  /** Optional owner-supplied logo override: /brands/<id>.svg */
  logo?: string;
}

/** In-house label — shown by name only, no partner card image. */
type InHouseBrand = Omit<Brand, 'image'>;

export const brands: Brand[] = [
  {
    id: 'ramraj',
    name: 'Ramraj',
    origin: 'Tiruppur, TN',
    blurb: 'The dhoti and cotton specialist. Everyday comfort with a formal spine.',
    categories: ['Essentials', 'Formal'],
    image: '/brands/brand_ramraj.avif',
  },
  {
    id: 'killer',
    name: 'Killer',
    origin: 'Bengaluru',
    blurb: 'Denim-first street attitude — jeans, jackets and bold casuals.',
    categories: ['Denim', 'Casual'],
    image: '/brands/brand_killer.avif',
  },
  {
    id: 'sparky',
    name: 'Sparky',
    origin: 'India',
    blurb: 'Performance-minded activewear built for daily training.',
    categories: ['Activewear', 'Essentials'],
    image: '/brands/brand_sparky.avif',
  },
  {
    id: 'ignite',
    name: 'Ignite',
    origin: 'India',
    blurb: 'Party-ready shirts and statement casuals at sharp prices.',
    categories: ['Party', 'Casual'],
    image: '/brands/brand_ignite.avif',
  },
  {
    id: 'jockey',
    name: 'Jockey',
    origin: 'USA / India',
    blurb: 'Innerwear and essentials with a fit for everybody.',
    categories: ['Essentials', 'Activewear'],
    image: '/brands/brand_jockey.avif',
  },
  {
    id: 'unibro',
    name: 'Unibro',
    origin: 'India',
    blurb: 'Innerwear, loungewear and everyday basics done honestly.',
    categories: ['Essentials', 'Casual'],
    image: '/brands/brand_unibro.avif',
  },
];

// Ravya is the in-house label (not a partner card), but its products need a display name.
const inHouseBrand: InHouseBrand = {
  id: 'ravya',
  name: 'Ravya',
  origin: 'In-house',
  blurb: 'Ravya in-house tailoring and essentials.',
  categories: ['Formal', 'Party'],
};

export const brandMap: Record<BrandId, Brand | InHouseBrand> = Object.fromEntries(
  [...brands, inHouseBrand].map((b) => [b.id, b]),
) as Record<BrandId, Brand | InHouseBrand>;
