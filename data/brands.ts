export type BrandId = 'ramraj' | 'killer' | 'sportiq' | 'ignite' | 'jockey' | 'unibro' | 'ravya';

export interface Brand {
  id: BrandId;
  name: string;
  origin: string;
  blurb: string;
  categories: string[];
  /** Optional owner-supplied logo override: /brands/<id>.svg */
  logo?: string;
}

export const brands: Brand[] = [
  {
    id: 'ramraj',
    name: 'Ramraj',
    origin: 'Tiruppur, TN',
    blurb: 'The dhoti and cotton specialist. Everyday comfort with a formal spine.',
    categories: ['Essentials', 'Formal'],
  },
  {
    id: 'killer',
    name: 'Killer',
    origin: 'Bengaluru',
    blurb: 'Denim-first street attitude — jeans, jackets and bold casuals.',
    categories: ['Denim', 'Casual'],
  },
  {
    id: 'sportiq',
    name: 'Sportiq',
    origin: 'India',
    blurb: 'Performance-minded activewear built for daily training.',
    categories: ['Activewear', 'Essentials'],
  },
  {
    id: 'ignite',
    name: 'Ignite',
    origin: 'India',
    blurb: 'Party-ready shirts and statement casuals at sharp prices.',
    categories: ['Party', 'Casual'],
  },
  {
    id: 'jockey',
    name: 'Jockey',
    origin: 'USA / India',
    blurb: 'Innerwear and essentials with a fit for everybody.',
    categories: ['Essentials', 'Activewear'],
  },
  {
    id: 'unibro',
    name: 'Unibro',
    origin: 'India',
    blurb: 'Innerwear, loungewear and everyday basics done honestly.',
    categories: ['Essentials', 'Casual'],
  },
];

// Ravya is the in-house label (not a partner card), but its products need a display name.
const inHouseBrand: Brand = {
  id: 'ravya',
  name: 'Ravya',
  origin: 'In-house',
  blurb: 'Ravya in-house tailoring and essentials.',
  categories: ['Formal', 'Party'],
};

export const brandMap: Record<BrandId, Brand> = Object.fromEntries(
  [...brands, inHouseBrand].map((b) => [b.id, b]),
) as Record<BrandId, Brand>;
