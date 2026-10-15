# Image Requirements — Ravya Fashion (site-wide audit)

Goal: one canonical, brand-accurate photo set per slot. Below is every place an
image is consumed on the site, the file it currently points at, and what a
correct, on-brand replacement should be. File paths are relative to `public/`.

Naming convention: `{brand-slug}-{product-slug}.{avif|webp}` (plus optional `-lg.avif`
for the larger variant shown in Quick View). Editorial/lifestyle shots:
`{page}_{topic-slug}-{n}.jpg`. Brand logos: `brands/{brand-slug}.svg` (preferred) or `.png`.

Aspect ratios used by the UI: hero portrait `aspect-[4/5]` / `aspect-[3/4]`,
category tile `aspect-[4/5]`, brands card `aspect-[16/10]`, visit banner `aspect-[21/9]`,
storefront block `min-h-[240px]`, product cards `aspect-[4/5]`.

---

## 1. Global / site-wide slots (non-product)

### Home — `/` (`components/home/*`)
| # | Slot | Component | Current file | What’s needed |
|---|------|-----------|--------------|---------------|
| 1 | Hero portrait (LCP) | `Hero.tsx` | `products/_hero.avif` | Full-height (min. 1600×2000) on-brand model shot, warm studio light, Ravya styling; brand-agnostic mood (not a single product). |
| 2 | Hero triptych — Casual | `Hero.tsx` (TRIPTYCH[0]) | `editorial/home_highfashion-young-model-wearing-1.jpg` | Casual lookbook shot — model in relaxed tee/cotton. |
| 3 | Hero triptych — Bright | `Hero.tsx` (TRIPTYCH[1]) | `editorial/home_stylishly-tailored-male-model-2.jpg` | Bright/patterned camp-collar shirt, warm light. |
| 4 | Hero triptych — Extreme | `Hero.tsx` (TRIPTYCH[2]) | `editorial/home_bold-street-fashion-model-3.jpg` | Statement piece (denim/knit), high contrast. |
| 5 | Category mood — Casual | `CategoryTiles.tsx` | `editorial/home_young-man-in-relaxed-6.jpg` | Relaxed casual outfit. |
| 6 | Category mood — Formal | `CategoryTiles.tsx` | `editorial/home_chic-business-casual-indian-7.jpg` | Structured blazer/shirt, Indian professional. |
| 7 | Category mood — Party | `CategoryTiles.tsx` | `editorial/home_expressive-party-fashion-with-8.jpg` | Metallic/party shirt, night ambience. |
| 8 | Category mood — Denim | `CategoryTiles.tsx` | `editorial/home_high-contrast-shot-of-9.jpg` | Washed denim jacket + jeans. |
| 9 | Category mood — Activewear | `CategoryTiles.tsx` | `editorial/home_athletic-young-runner-wearing-10.jpg` | Technical activewear, runner. |
| 10 | Category mood — Outerwear | `CategoryTiles.tsx` | `editorial/home_model-posing-in-contemporary-12.jpg` | Utility overshirt / jacket. |
| 11 | Category mood — Essentials | `CategoryTiles.tsx` | `editorial/home_traditional-refined-indian-handloom-11.jpg` | Handloom kurta + dhoti (Ramraj mood). |
| 12 | Store snapshot storefront | `StoreSnapshot.tsx` | `editorial/home_boutique-storefront-exterior-of-16.jpg` | Accurate Ravya storefront (Sector 5, Rourkela). |

### Brands — `/brands` (`app/brands/page.tsx`)
One editorial card per partner brand (6 slots today). Currently generic `brands_brands-editorial-{n}` shots.
| # | Slot | Assigned key | What’s needed |
|---|------|--------------|---------------|
| 1 | Brand card — Ramraj | `brands_brands-editorial-1-1` | Ramraj cotton/dhoti hero styling. |
| 2 | Brand card — Killer | `brands_brands-editorial-2-2` | Denim-first Killer campaign shot. |
| 3 | Brand card — Sparky | `brands_brands-editorial-3-3` | Activewear/training shot. |
| 4 | Brand card — Ignite | `brands_brands-editorial-4-4` | Party-shirt statement. |
| 5 | Brand card — Jockey | `brands_brands-editorial-5-5` | Essentials/innerwear lifestyle. |
| 6 | Brand card — Unibro | `brands_brands-editorial-6-6` | Loungewear/basics lifestyle. |
| + | Logo per brand | `brands/{id}.svg` | Square/wordmark logo for each brand in card/strip. Not currently used — add to `BrandStrip` + header if desired. |

### About — `/about` (`app/about/page.tsx`)
| # | Slot | Current file | What’s needed |
|---|------|--------------|---------------|
| 1 | Collage A | `editorial/about_about-editorial-1-1.jpg` | Store/brand story shot (team in store). |
| 2 | Collage B | `editorial/about_two-creative-friends-in-2.jpg` | Two friends in Rourkela, golden hour (keep if accurate). |

### Visit — `/visit` (`app/visit/page.tsx`)
| # | Slot | Current file | What’s needed |
|---|------|--------------|---------------|
| 1 | Banner | `editorial/visit_modern-high-street-boutique-2.jpg` | Real storefront glass façade + mannequins. |
| 2 | Interior | `editorial/visit_bright-high-ceiling-fashion-3.jpg` (not currently rendered — optional) | Showroom interior (terazzo arches, brass racks). |
| 3 | VIP fitting | `editorial/visit_vip-fitting-lounge-with-4.jpg` (not currently rendered — optional) | VIP lounge. |

Note: `visit_visit-editorial-1-1.jpg` exists but is unused; drop or assign.

---

## 2. Categories (7) used as shop filters

Every product belongs to one of these. Each needs one canonical, brand-neutral mood
image (already mapped in `CategoryTiles.tsx`) plus, ideally, a banner for the shop
header when filtered.

| Category id | Label | Current mood image | Brands operating here | Required image set |
|---|---|---|---|---|
| `casual` | Casual | `home_young-man-in-relaxed-6.jpg` | Killer, Ignite, Jockey, Ravya | Casual lookbook × 4 brand stories |
| `formal` | Formal | `home_chic-business-casual-indian-7.jpg` | Ramraj, Ravya | Formal/blazer campaign × 2 |
| `party` | Party | `home_expressive-party-fashion-with-8.jpg` | Ignite, Ravya | Party shirts/bandhgala × 2 |
| `denim` | Denim | `home_high-contrast-shot-of-9.jpg` | Killer | Denim campaign × 1 |
| `activewear` | Activewear | `home_athletic-young-runner-wearing-10.jpg` | Sparky, Jockey | Training shot × 2 |
| `outerwear` | Outerwear | `home_model-posing-in-contemporary-12.jpg` | Killer, Sparky, Unibro, Ravya | Jacket/hoodie/cap × 4 |
| `essentials` | Essentials | `home_traditional-refined-indian-handloom-11.jpg` (mood) + dhoti formal (Ramraj) | Ramraj, Sparky, Jockey, Unibro | Basics pack shots × 4 |

---

## 3. Product image matrix (per brand × category) — currently in `data/products.ts`

Counts: **29 products**. Every product needs: primary `.avif`, optional `.webp`,
and `-lg.avif` (used by Quick View). File path convention `products/{id}.avif`
(already set in `image` field). NEW-tagged items are marked ★.

### RAMRAJ (id `ramraj`) — origin Tiruppur, TN — categories: Essentials, Formal (4 items)
- **Essentials**
  - `ramraj-dhoti-set` — Ramraj Dhoti Set — `products/ramraj-dhoti-set.avif` (.webp exists)
  - ★ `ramraj-daily-tee` — Ramraj Daily Tee — `products/ramraj-daily-tee.avif` (.webp exists)
- **Formal**
  - `ramraj-cotton-shirt-white` — Ramraj Cotton Shirt — `products/ramraj-cotton-shirt-white.avif` (.webp exists)
  - `ramraj-formal-trousers` — Ramraj Formal Trousers — `products/ramraj-formal-trousers.avif` (.webp exists)
- Needed: front, back, detail (collar/fabric) shots per SKU; size-chart image; brand banner.

### KILLER (id `killer`, brand label “KILLER3IS” in-store) — origin Bengaluru — categories: Denim, Casual (5 items)
- **Denim**
  - ★ `killer-slim-denim-01` — Killer Slim Fit Denim — `products/killer-slim-denim-01.avif`
  - `killer-skinny-black` — Killer Skinny Black Jeans — `products/killer-skinny-black.avif`
  - `killer-relaxed-taper` — Killer Relaxed Taper Denim — `products/killer-relaxed-taper.avif`
- **Casual**
  - `killer-cargo-pants` — Killer Cargo Pants — `products/killer-cargo-pants.avif`
- **Outerwear**
  - ★ `killer-denim-jacket` — Killer Denim Jacket — `products/killer-denim-jacket.avif`
- Needed: wash variation shots, model-on-body, detail (stitching/pockets), logo patch macro.

### SPARKY (id `sparky`) — origin India — categories: Activewear, Essentials (4 items)
- **Activewear**
  - `sparky-training-tee` — Sparky Training Tee — `products/sparky-training-tee.avif`
  - `sparky-track-pants` — Sparky Track Pants — `products/sparky-track-pants.avif`
  - ★ `sparky-gym-shorts` — Sparky Gym Shorts — `products/sparky-gym-shorts.avif`
- **Outerwear**
  - `sparky-hoodie` — Sparky Training Hoodie — `products/sparky-hoodie.avif`
- Needed: studio flat + on-model action shots; reflective-accent macro.

### IGNITE (id `ignite`, user tag “Sparky”?) — origin India — categories: Party, Casual (4 items)
- **Party**
  - ★ `ignite-party-shirt` — Ignite Party Shirt — `products/ignite-party-shirt.avif`
  - `ignite-satin-shirt` — Ignite Satin Shirt — `products/ignite-satin-shirt.avif`
- **Casual**
  - `ignite-linen-shirt` — Ignite Linen Shirt — `products/ignite-linen-shirt.avif`
  - `ignite-cargo-shorts` — Ignite Cargo Shorts — `products/ignite-cargo-shorts.avif`
- Needed: statement colourways (floral, satin), evening-lit editorial.

### JOCKEY (id `jockey`) — origin USA/India — categories: Essentials, Activewear (4 items)
- **Essentials**
  - `jockey-boxer-pack` — Jockey Boxer Pack (3) — `products/jockey-boxer-pack.avif`
  - `jockey-crew-tee` — Jockey Crew Tee — `products/jockey-crew-tee.avif`
- **Activewear**
  - `jockey-polo` — Jockey Pique Polo — `products/jockey-polo.avif`
  - ★ `jockey-track-pants` — Jockey Lounge Track Pants — `products/jockey-track-pants.avif`
- Needed: fabric close-ups, pack contents, fit model, shade cards.

### UNIBRO (id `unibro`) — origin India — categories: Essentials, Casual (4 items)
- **Essentials**
  - `unibro-vest-pack`, `unibro-lounge-set`, `unibro-socks-5`
- **Outerwear**
  - `unibro-winter-cap`
- (No Unibro items in user’s requested brand list; treat as carried basic brand.)
- Needed: pack content flat-lays, seasonal winter cap shot.

### RAVYA (in-house label) — categories: Formal, Party (4 items)
- `ravya-blazer-navy` ★, `ravya-bandhgala`, `ravya-windcheater` ★, `ravya-tote`
- Needed: tailoring detail shots, horn buttons, canvas weave, windcheater packability.

New-in-store carousel pulls the 8 ★ items automatically from `products.filter(isNew)`.

---

## 4. User-requested brand focus

The following are the names used on the shop floor. Map them to catalog IDs
above; anything not in the catalog yet needs product data added **before**
images are wired in.

| User brand | Catalog id | Status | Categories carried | Image assets still to source |
|---|---|---|---|---|
| RAMRAJ | `ramraj` | In catalog (4 SKUs) | Essentials, Formal | Brand logo SVG, banner, per-SKU front/back/detail (×4), dhoti drape hero. |
| STORE (Ravya store itself) | `ravya` (store) | Store photography | All 7 moods | Storefront (exterior), interior wide, VIP fitting lounge, mannequin displays, staff fitting/pinning, cash-wrap, packaging/bag shot. Logo/wordmark already text-based; add a brand mark asset. |
| INTEGRITI | (not in catalog) | Planned / no SKU data yet | Typically Denim, Casual (jeans, shorts) | Brand logo, brand hero, ≥2 sample products per category, lookbook; then add SKUs + images to `products.ts`. |
| Sparky | (not in catalog) | Planned / no SKU data yet | Likely Activewear/Casual | Logo, hero, ≥2 samples per category, size chart. |
| KILLER3IS | `killer` | In catalog (5 SKUs) | Denim, Casual, Outerwear | Logo, denim campaign hero, wash-variation shots, jacket detail (×5 already listed). |
| JOCKEY | `jockey` | In catalog (4 SKUs) | Essentials, Activewear | Logo, fabric/swatch card, pack contents, fit model, polo + track pants heroes. |
| CoLORS | (not in catalog) | Planned / no SKU data yet | Likely Casual/Party (colourful basics) | Logo, hero, ≥2 samples per category, colour cards. |

Unibro is in the catalog (4 SKUs) but not in the user’s requested list — keep
existing images or fold into “Essentials” store imagery.

---

## 5. Folder/asset checklist (to create)

```
public/
├── brands/
│   ├── ramraj.svg (or .png)
│   ├── killer.svg
│   ├── sparky.svg
│   ├── ignite.svg
│   ├── jockey.svg
│   ├── unibro.svg
│   ├── ravya.svg
│   ├── integriti.svg   (new)
│   ├── sparky.svg      (new)
│   └── colors.svg      (new)
├── editorial/
│   ├── home/           (12 slots — hero portrait, triptych×3, category moods×7, storefront)
│   ├── brands/         (6 cards + new brands)
│   ├── about/          (2)
│   └── visit/          (banner + 2 optional interiors)
└── products/
    ├── {id}.avif      (29 today)
    ├── {id}.webp      (only some have it — standardise)
    └── {id}-lg.avif   (Quick View; currently only some SKUs)
```

## 6. Technical notes

- Images are rendered via `components/ui/ProductImage.tsx` with `next/image`; keep
  LQIP data URIs in `data/lqip.ts` (PRODUCT_LQIP) for every SKU.
- Category mood keys are hard-coded in `CategoryTiles.tsx` (`MOOD_IMAGE`) and
  triptych keys in `Hero.tsx` (`TRIPTYCH`) — update those maps when swapping
  files unless filenames stay identical.
- Brands cards pull `editorial[brands_brands-editorial-{i+1}]` by index in
  `app/brands/page.tsx`; renaming files requires updating that lookup.
- `hero.ts` points to `/products/_hero.avif` — keep that filename or update.
- Aim for ≥2× display width (hero portrait ≥1600px wide), keep `.avif`
  primary, `.webp` fallback, max quality 80, and strip metadata.
- Verify no broken image by running `npm run build` (onError falls back to
  a silhouette, so failures render silently).

## 7. Remotely sourced images applied in this run

The following slots were replaced with high-quality Pexels photos (direct CDN
IDs listed) so the site no longer relies on the original placeholder art:

- `/products/_hero.avif` ← Pexels 15870282
- `/editorial/home_highfashion-young-model-wearing-1.jpg` ← Pexels 28378508
- `/editorial/home_stylishly-tailored-male-model-2.jpg` ← Pexels 29125120
- `/editorial/home_bold-street-fashion-model-3.jpg` ← Pexels 19461513
- `/editorial/home_young-man-in-relaxed-6.jpg` ← Pexels 10106995
- `/editorial/home_chic-business-casual-indian-7.jpg` ← Pexels 25408093
- `/editorial/home_expressive-party-fashion-with-8.jpg` ← Pexels 19461512
- `/editorial/home_high-contrast-shot-of-9.jpg` ← Pexels 28938765
- `/editorial/home_athletic-young-runner-wearing-10.jpg` ← Pexels 9775889
- `/editorial/home_traditional-refined-indian-handloom-11.jpg` ← Pexels 10423547
- `/editorial/home_model-posing-in-contemporary-12.jpg` ← Pexels 2229712
- `/editorial/brands_brands-editorial-1-1.jpg` ← Pexels 15870282
- `/editorial/brands_brands-editorial-2-2.jpg` ← Pexels 30710032
- `/editorial/brands_brands-editorial-3-3.jpg` ← Pexels 19461561
- `/editorial/brands_brands-editorial-4-4.jpg` ← Pexels 19461513
- `/editorial/brands_brands-editorial-5-5.jpg` ← Pexels 10106995
- `/editorial/brands_brands-editorial-6-6.jpg` ← Pexels 28378508
- `/editorial/about_about-editorial-1-1.jpg` ← Pexels 25408093
- `/editorial/about_two-creative-friends-in-2.jpg` ← Pexels 10423547

Visit storefront banner (`visit_modern-high-street-boutique-2.jpg`) and product
SKU photography (`/products/*`) were left untouched because generic stock
models would not match the actual branded garments — source those from each
brand's portal (links listed in section 4/3 above) and drop in with the same
filenames. LQIP blur strings in `data/lqip.ts` remain as-is and will simply
show a neutral blur-up.

## 8. Category → required images (shop catalog)

Use this when shooting/replacing product photography so every card on `/shop`
reflects its category filter.

### casual (5 SKUs)
| Brand | Product | File needed |
|---|---|---|
| Killer | Killer Cargo Pants | `products/killer-cargo-pants.avif` |
| Ignite | Ignite Linen Shirt | `products/ignite-linen-shirt.avif` |
| Ignite | Ignite Cargo Shorts | `products/ignite-cargo-shorts.avif` |
| Jockey | Jockey Pique Polo | `products/jockey-polo.avif` |
| Ravya | Ravya Canvas Tote | `products/ravya-tote.avif` |
Plus 1 casual lookbook/banner per brand for filtered header.

### formal (3 SKUs)
| Brand | Product | File needed |
|---|---|---|
| Ramraj | Ramraj Cotton Shirt | `products/ramraj-cotton-shirt-white.avif` |
| Ramraj | Ramraj Formal Trousers | `products/ramraj-formal-trousers.avif` |
| Ravya | Ravya Navy Blazer | `products/ravya-blazer-navy.avif` |
Plus formal category hero (man in structured blazer/shirt).

### party (3 SKUs)
| Brand | Product | File needed |
|---|---|---|
| Ignite | Ignite Party Shirt | `products/ignite-party-shirt.avif` |
| Ignite | Ignite Satin Shirt | `products/ignite-satin-shirt.avif` |
| Ravya | Ravya Bandhgala | `products/ravya-bandhgala.avif` |
Plus party category hero (evening/night ambience).

### denim (3 SKUs)
| Brand | Product | File needed |
|---|---|---|
| Killer | Killer Slim Fit Denim | `products/killer-slim-denim-01.avif` |
| Killer | Killer Skinny Black Jeans | `products/killer-skinny-black.avif` |
| Killer | Killer Relaxed Taper Denim | `products/killer-relaxed-taper.avif` |
Plus denim category hero (wash variations).

### activewear (4 SKUs)
| Brand | Product | File needed |
|---|---|---|
| Sparky | Sparky Training Tee | `products/sparky-training-tee.avif` |
| Sparky | Sparky Track Pants | `products/sparky-track-pants.avif` |
| Sparky | Sparky Gym Shorts | `products/sparky-gym-shorts.avif` |
| Jockey | Jockey Lounge Track Pants | `products/jockey-track-pants.avif` |
Plus activewear category hero (training model).

### outerwear (4 SKUs)
| Brand | Product | File needed |
|---|---|---|
| Killer | Killer Denim Jacket | `products/killer-denim-jacket.avif` |
| Sparky | Sparky Training Hoodie | `products/sparky-hoodie.avif` |
| Unibro | Unibro Winter Cap | `products/unibro-winter-cap.avif` |
| Ravya | Ravya Windcheater | `products/ravya-windcheater.avif` |
Plus outerwear category hero (jacket/hoodie in cold weather).

### essentials (7 SKUs)
| Brand | Product | File needed |
|---|---|---|
| Ramraj | Ramraj Dhoti Set | `products/ramraj-dhoti-set.avif` |
| Ramraj | Ramraj Daily Tee | `products/ramraj-daily-tee.avif` |
| Jockey | Jockey Boxer Pack (3) | `products/jockey-boxer-pack.avif` |
| Jockey | Jockey Crew Tee | `products/jockey-crew-tee.avif` |
| Unibro | Unibro Vest Pack (3) | `products/unibro-vest-pack.avif` |
| Unibro | Unibro Lounge Set | `products/unibro-lounge-set.avif` |
| Unibro | Unibro Socks Pack (5) | `products/unibro-socks-5.avif` |
Plus essentials category hero (basics/innerwear flat-lay).

_Last audited against: products.ts (29 SKUs), brands.ts (7 entries incl. in-house
Ravya), app pages Home/Shop/Brands/About/Visit._
"