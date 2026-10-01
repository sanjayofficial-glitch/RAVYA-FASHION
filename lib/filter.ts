import type { PriceTier, Product } from '@/data/products';

export interface FilterState {
  cat?: string;
  brand?: string;
  tier?: string;
}

export function filterProducts(
  items: Product[],
  { cat, brand, tier }: FilterState,
): Product[] {
  return items.filter(
    (p) =>
      (!cat || p.category === cat) &&
      (!brand || p.brand === brand) &&
      (!tier || tierOf(p) === tier),
  );
}

export function tierOf(p: Product): PriceTier {
  if (p.price < 999) return 'budget';
  if (p.price <= 2499) return 'mid';
  return 'premium';
}

export function activeFilterCount(s: FilterState): number {
  return [s.cat, s.brand, s.tier].filter(Boolean).length;
}
