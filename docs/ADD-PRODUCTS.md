# Adding products

All inventory lives in `data/products.ts`. No component changes needed.

## Schema

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique slug, used for FLIP keys & Quick View. Pattern `brand-name-##`. |
| `name` | string | Shown on cards + in the WhatsApp prefill. |
| `brand` | BrandId | `ramraj \| killer \| sportiq \| ignite \| jockey \| unibro \| ravya` |
| `category` | Category | `casual \| formal \| party \| denim \| activewear \| outerwear \| essentials` |
| `price` | number | INR. Tier derives from this: <999 budget, 999–2499 mid, >2499 premium. |
| `priceTo?` | number | Optional upper bound → renders "₹1,299–1,799". |
| `sizes` | string[] | Letter or waist sizes, e.g. `['S','M','L']` / `['30','32']`. |
| `colors?` | string[] | Colour names for Quick View chips. |
| `image` | string | `/products/<id>.avif` — the pipeline generates it. |
| `lqip` | string | Leave as `'PLACEHOLDER_LQIP'`; `pnpm images` patches the real blur. |
| `isNew?` | boolean | Shows the black NEW badge + home carousel eligibility. |
| `inStore` | boolean | Always `true` today; future-proofs the schema. |
| `description` | string | 1–2 lines; reads naturally inside the WhatsApp prefill. |

## Worked example

```ts
{
  id: 'killer-baggy-jeans-04',
  name: 'Killer Baggy Jeans',
  brand: 'killer',
  category: 'denim',
  price: 1599,
  sizes: ['30', '32', '34', '36'],
  colors: ['Washed Blue'],
  image: '/products/killer-baggy-jeans-04.avif',
  lqip: 'PLACEHOLDER_LQIP',
  inStore: true,
  isNew: true,
  description: 'Full-width baggy with a stacked hem — the silhouette of the season.',
}
```

Then run:

```bash
pnpm images     # builds the AVIF/WebP + LQIP for the new rows
```

Add a photo at `raw/killer-baggy-jeans-04.jpg` first (see
`scripts/fetch-images.mjs`) — otherwise a branded placeholder is generated.

When the catalog becomes real inventory, set `sampleCatalog: false` in
`config/site.ts` (badges and the footer preview line update automatically).
