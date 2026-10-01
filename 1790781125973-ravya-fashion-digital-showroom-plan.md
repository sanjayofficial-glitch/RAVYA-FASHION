# RAVYA FASHION — Digital Showroom Build Plan

Source spec: `D:\RAVYA FASHION\Ravya_Fashion_Master_Build_Document.md` (v1.0, Parts 1–10).
Repo is currently empty apart from that document — greenfield build.

---

## 1. What this project is

A **non-e-commerce digital showroom** for a physical fashion store in Rourkela, Odisha.
Five SSG routes (`/`, `/shop`, `/brands`, `/about`, `/visit`) plus a Quick View modal.
No cart, no payments, no accounts. Two conversion engines only:

- **WhatsApp enquiries** — every product deep-links to `wa.me` with a prefilled message.
- **GPS directions** — one-tap maps deep-link to the store.

The real product goal is **footfall**, and the engineering goal is **speed on a ₹8,000
Android on 2G/3G** (≤180KB initial gzipped JS+CSS, Lighthouse mobile ≥95×4, zero CLS).

### Domain language (use these words consistently)

| Term | Meaning in this codebase |
|---|---|
| **Catalog** | The full in-store product list rendered at `/shop`. NOT purchasable. |
| **Product** | One row in `data/products.ts`. A real garment hanging in the store. |
| **Tier** | Price band derived from price: `budget` (<₹999), `mid` (₹999–2499), `premium` (>₹2499). |
| **Quick View** | Read-only product detail sheet opened from a card. Never adds to anything. |
| **Enquiry** | The single outbound action: opening a prefilled WhatsApp chat. |
| **Visit** | The `/visit` route — address, hours, live open/closed, directions, call. |
| **Brand partner** | One of the six authorized brands. Not a user account. |
| **Enabling / constraining** | `saveData`, `effectiveType`, `deviceMemory`, `prefers-reduced-motion`. |

Never introduce "cart", "checkout", "order", "user account", or "wishlist" — they are
explicitly out of scope (PRD 2.4).

---

## 2. Decisions resolved with the user

| # | Decision | Choice | Why |
|---|---|---|---|
| D1 | Product photography | **Self-host permissively-licensed stock photos** (Pexels/Unsplash licence), fetched once by a script into `raw/`, never hotlinked | Keeps the ≤35KB thumb budget, offline PWA, and LQIP pipeline intact |
| D2 | Store details (address, phone, WhatsApp, geo, hours) | **Not available now** → `PLACEHOLDER_*` constants in `config/site.ts`, owner fills later | One-file swap; every consumer already reads from config |
| D3 | Deploy target | **Vercel**, Next.js server (not `output: 'export'`) | Keeps `next/image` optimization + Cache-Control + middleware security headers |
| D4 | Measurement | **First-party counter only** — no third-party analytics, no cookies | Resolves the PART 2.2 vs PART 3.1 contradiction in favour of the PRD's success metrics |
| D5 | Brand marks | **Uppercase letter-spaced wordmarks** in the site typeface, with an optional owner-supplied SVG override path | No trademark reproduction, no missing-asset risk |
| D6 | Package manager | **pnpm** | Matches the existing toolchain |

### Default chosen where the spec is silent (reversible)

- **Next.js 15.x** App Router (spec says "14+"), TypeScript `strict`, Tailwind 3.4, Framer Motion.
- **Hand-rolled `sw.js` + `manifest.json`**, not `next-pwa` — avoids a dependency and
  keeps the service worker under our control for the save-data gate.
- **Sharp 0.33** as a devDependency for the image pipeline only (never bundled).
- **28 sample products** across 7 categories / 6 brands / 3 tiers, 8 marked `isNew`.

---

## 3. Contradictions found in the spec and how they are resolved

These are genuine conflicts in the document. Each resolution is deliberate.

**C1 — "filtered grid rendered server-side for SEO" vs "all routes SSG".**
Part 6.1 requires `/shop?cat=denim&brand=killer` to render the filtered grid server-side.
With static generation, `searchParams` is fixed at build time (always empty), so arbitrary
query-driven grids **cannot** be server-rendered.
→ **Resolution:** SSG the unfiltered grid. Filtered views read the same static catalog
chunk client-side with zero network round-trips. Filtered combinations get
`rel=canonical` → `/shop` and are `noindex,follow` so they don't create duplicate-content
issues. Bounded popular combinations (7 categories × 6 brands) are NOT pre-generated —
the payload saving is worth less than the index bloat.

**C2 — "Analytics: None by default" vs PRD 2.2 success metrics.**
→ **Resolved per D4:** a first-party `/api/track` counter. No cookies, no third-party
script, no consent banner, ~0KB on the critical path.

**C3 — `hooks/useSaveData.ts` as a hook returning a boolean.**
Any value derived from `navigator.connection` / `deviceMemory` must not be read during
render — it causes a hydration mismatch (server has no `navigator`).
→ **Resolution:** a tiny blocking inline script in `<head>` writes
`data-savedata="true"` / `data-lowmem="true"` onto `<html>` before first paint. All CSS
and presentation key off **attribute selectors** (works pre-hydration, zero JS). Hooks
mirror the attributes in `useEffect` for logic that genuinely needs JS (e.g. disabling the
carousel auto-advance interval).

**C4 — "zero CLS on route change" + Framer Motion layout animations.**
→ **Resolution:** the filter FLIP animation is a small hand-rolled `useFlip` hook
(measure → invert → play with `transform` only), not Framer Motion's `layout` prop, which
pulls in measurement machinery. Skipped entirely under `prefers-reduced-motion`,
`data-savedata` or `data-lowmem`.

**C5 — Quick View "closes on back" + focus trap.**
→ **Resolution:** native `<dialog>` + `showModal()` gives a free focus trap, Esc handling
and top-layer stacking. Opening pushes a history entry; `popstate` closes the dialog so
Android back never traps the user.

---

## 4. Folder structure (spec §7 + additions)

```
ravya-fashion/
├── app/
│   ├── layout.tsx              # metadata, inline constraint script, Header/BottomNav/FAB/Footer
│   ├── page.tsx                # home
│   ├── globals.css             # tokens, base, constraint-gated utilities
│   ├── shop/page.tsx           # Suspense-wrapped client grid
│   ├── brands/page.tsx
│   ├── about/page.tsx
│   ├── visit/page.tsx
│   ├── api/track/route.ts      # first-party counter ingest  (NEW)
│   ├── api/stats/route.ts      # counter readout            (NEW)
│   ├── manifest.ts             # or public/manifest.json    (NEW)
│   ├── robots.ts  /  sitemap.ts                            (NEW)
│   └── opengraph-image.tsx     # 1200x630 ivory/bronze      (NEW)
├── components/                 # exactly as spec §7
├── config/site.ts              # PLACEHOLDER_* values, hours, sampleCatalog flag
├── data/
│   ├── products.ts             # 28 products
│   ├── brands.ts               # 6 brands + category tags
│   ├── lqip.generated.json     # (NEW) written by the image script
│   └── image-credits.json      # (NEW) source URL + licence per photo
├── hooks/                      # as spec §7 (+ useFlip.ts NEW)
├── lib/                        # as spec §7 (+ filter.ts NEW, track.ts NEW)
├── public/{products,brands,icons,placeholders}/  + manifest.json, sw.js
├── scripts/                    # (NEW, dev-only, never bundled)
│   ├── fetch-images.mjs        # Pexels/Unsplash → raw/
│   ├── prepare-images.mjs      # sharp → AVIF/WebP + 16px LQIP
│   └── check-budget.mjs        # gzip .next/static, assert §3.4 budgets
├── docs/{ADD-PRODUCTS,UPDATE-STORE-INFO,BRAND-ASSETS,DESIGN-TOKENS}.md
├── next.config.mjs  tailwind.config.ts  tsconfig.json  README.md
```

`raw/` is gitignored. `data/image-credits.json` **is** committed — licence provenance.

---

## 5. Implementation tasks (ordered)

### Phase 1 — Scaffold and contracts
1. `pnpm create next-app` (TS, Tailwind, App Router, no ESLint-flat prompt noise), then
   pin `next@15`, add `framer-motion`, `sharp` (dev).
2. `tsconfig.json`: `strict: true`, `noUncheckedIndexedAccess: true`.
3. `tailwind.config.ts` — map every §4.1 token to CSS vars (`--canvas`, `--ink`, `--accent`, …).
4. `config/site.ts` — the single source of truth:
   ```ts
   export const site = {
     name: 'RAVYA FASHION',
     PLACEHOLDER_ADDRESS: '',
     PLACEHOLDER_PHONE: '',
     PLACEHOLDER_WHATSAPP: '91XXXXXXXXXX',   // digits only, no +
     PLACEHOLDER_GEO: { lat: 0, lng: 0 },
     hours: { /* 7-day record, "HH:MM" 24h IST */ },
     sampleCatalog: true,   // see §8 honesty gate
   } as const;
   ```
5. `lib/format.ts` (`₹` grouping, `₹1,299–1,799` ranges, Indian digit grouping),
   `lib/whatsapp.ts` (message builders + `encodeURIComponent`, per Part 1),
   `lib/hours.ts` (open/closed from `config.hours` vs `Asia/Kolkata` via
   `Intl.DateTimeFormat` with `timeZone` — never the machine's local clock),
   `lib/filter.ts` (pure `filterProducts(products, {cat,brand,tier})`).

### Phase 2 — Asset pipeline
6. `scripts/fetch-images.mjs` — reads `data/products.ts`, pulls one matching flat-lay
   photo per product into `raw/` via the Pexels/Unsplash API (`PEXELS_API_KEY`),
   writes `data/image-credits.json`. Skips any file already present. Documented as
   **one-time content production** — the site build never calls it.
7. `scripts/prepare-images.mjs` — sharp pipeline per source photo:
   - 4:5 crop → `900×1125` → AVIF q50 + WebP q72 (grid thumb, assert ≤35KB)
   - `1600×2000` → AVIF q55 (quick-view, hero)
   - 16px-wide WebP q20 → base64 → `data/lqip.generated.json`
   Exits non-zero if any thumb breaches 35KB so the budget can't silently rot.

### Phase 3 — Primitives and layout shell
8. `app/globals.css` — tokens, type scale via `clamp()`, 4px spacing grid,
   `prefers-reduced-motion` block, and the attribute-gated utilities:
   ```css
   @media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation: none !important; transition-duration: 150ms !important; } }
   html[data-savedata="true"] .ticker-track { animation: none; flex-wrap: wrap; }
   html[data-lowmem="true"] .carousel { scroll-snap-type: x mandatory; }
   ```
9. `app/layout.tsx` — the **blocking inline constraint script** (C3), placed in `<head>`
   before paint:
   ```js
   var c=navigator.connection||{};var d=document.documentElement;
   if(c.saveData||/2g/.test(c.effectiveType||''))d.dataset.savedata='true';
   if((navigator.deviceMemory||8)<4)d.dataset.lowmem='true';
   if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.dataset.motion='reduced';
   ```
   Plus: skip-to-content link, `LocalBusiness` JSON-LD, `viewport` with
   `viewportFit=cover`, manifest + theme-color.
10. `components/ui/`: `Pill`, `Badge`, `Skeleton`, `SectionHeading`, `Reveal`
    (`IntersectionObserver`, fires once, `rootMargin: '0px 0px -10% 0px'`),
    `ProductImage` (LQIP blur-up + branded ivory SVG fallback on error — never a
    broken-image icon, per the resilience matrix).
11. `components/layout/`: `Header` (64px, blur+shrink only after 24px scroll, scroll
    listener `passive` + rAF-throttled), `BottomNav` (5 tabs, 56px + safe-area,
    bronze indicator pill positioned by measured tab rect), `MoreSheet`,
    `Footer`, `WhatsAppFab` (above the bottom nav on mobile; pulse stops after first
    tap and under `data-motion="reduced"`).

### Phase 4 — Home
12. `Hero.tsx` — image right / headline left, CTAs labelled exactly
    "Explore In-Store Catalog" and "Get Store Directions". Only `priority` image in the app.
13. `Ticker.tsx` — pure CSS marquee, duplicated content, `translateX` 30s linear loop,
    `animation-play-state: paused` on `:hover`/`:focus-within`/active touch.
    Static wrapped fallback via CSS (C3).
14. `CategoryTiles.tsx` (7 tiles, 50ms stagger), `NewInStoreCarousel.tsx`
    (CSS scroll-snap; JS auto-advance only when not constrained),
    `BrandStrip.tsx` (wordmarks, D5), `StoreSnapshot.tsx` (map thumbnail + hours +
    live status + directions).

### Phase 5 — Shop
15. `lib/filter.ts` + `shop/page.tsx`. **The page must wrap the grid in `<Suspense>`**
    because `useSearchParams` opts the subtree into client rendering.
16. `FilterBar.tsx` — three scroll-snap pill rows (Category / Brand / Tier), bronze hairline
    on selection, active count, "Clear all", and `aria-live="polite"` results count.
    State lives in the URL → shareable, back-button safe.
17. `ProductGrid.tsx` + `useFlip` reflow animation (C4), `ProductCard.tsx`
    (4:5 LQIP image, brand eyebrow, name, price/range, IN-STORE badge, dual ghost buttons,
    `:active` scale(.98)), `EmptyState.tsx` (96px inline SVG + WhatsApp CTA).
18. `QuickView.tsx` — native `<dialog>`, bottom sheet ≤768px / centred dialog above,
    focus trap + Esc from the element, `popstate` close (C5), instant render from
    already-loaded data, prefilled WhatsApp CTA.

### Phase 6 — Brands / About / Visit
19. `brands/page.tsx` — 6 cards, wordmarks, category tags, deep-link
    `/shop?brand=<id>`.
20. `about/page.tsx` — 3 chapters (Why Ravya / Accessible Luxury / Our Rourkela),
    Gen-Z → Millennial positioning, editorial store imagery.
21. `visit/page.tsx` — `MapEmbed.tsx` (static thumbnail first, interactive embed only on
    tap **and** when not `data-savedata`; `loading="lazy"`), `HoursTable.tsx`
    (today highlighted, live 🟢/🔴 computed in `Asia/Kolkata`; renders a neutral state
    until mounted to avoid a clock-based hydration mismatch), `DirectionsButton.tsx`
    (universal `https://www.google.com/maps/dir/?api=1&destination=…` with a `geo:`
    fallback), tap-to-call.

### Phase 7 — Measurement, PWA, SEO
22. `lib/track.ts` — `track(event, props)` using `navigator.sendBeacon` to `/api/track`.
    Allowlisted events: `whatsapp_click`, `directions_tap`, `call_tap`,
    `quick_view_open`, `filter_apply`, `store_page_view`. No cookies, no PII, no IP
    persistence. No-ops when `data-savedata` is set.
23. `app/api/track/route.ts` — validate against the allowlist, then `INCR`
    `rf:{YYYY-MM-DD}:{event}` with a 90-day `EXPIRE` via **Upstash REST using plain
    `fetch`** (no SDK). If `UPSTASH_REDIS_REST_URL`/`_TOKEN` are unset, log the event
    and return 204 — the site must work with zero env vars.
24. `app/api/stats/route.ts` — returns the per-day counter table. Guarded by
    `STATS_TOKEN` in the query string; 404s when the token env var is unset.
25. `public/sw.js` + `public/manifest.json`. SW precaches the app shell and last catalog
    JSON; navigation = network-first with cache fallback; `/_next/static` and
    `/products/*` = cache-first. **Registration is skipped entirely when
    `navigator.connection.saveData` is true**, and happens on `load`.
26. Per-route `metadata`, `opengraph-image.tsx` (1200×630 ivory/bronze),
    `robots.ts`, `sitemap.ts`.

### Phase 8 — Verification harness
27. `scripts/check-budget.mjs` — gzip every chunk in `.next/static`, fail on:
    initial JS+CSS >180KB, catalog chunk >25KB, any product AVIF >35KB, fonts >60KB.
    Run from `pnpm verify`, and as a `postbuild` guard.
28. `lighthouserc.json` — mobile preset, 5 runs, assert ≥95 on all four categories.
    `pnpm verify` = typecheck → lint → budget → lhci.

### Phase 9 — Docs
29. `README.md` (setup, `pnpm dev|build|verify`, deployment, and an explicit
    "the catalog is sample data" callout), `docs/ADD-PRODUCTS.md` (schema table + a
    worked example + "run `pnpm images` after adding rows"),
    `docs/UPDATE-STORE-INFO.md` (every `PLACEHOLDER_*`, where each value surfaces),
    `docs/BRAND-ASSETS.md` (optional SVG override into `public/brands/<id>.svg`,
    wordmark fallback when absent).

---

## 6. Design system reference (spec §4.1)

```
--canvas #FFFFFF   --canvas-alt #F9F9F9   --ink #1A1A1A   --ink-2 #6B6B6B
--line #EBEBEB     --accent #C5A059       --accent-ink #8C6D33
--radius-card 16px --radius-pill 999px    --radius-btn 12px
--shadow-lift 0 8px 24px rgba(26,26,26,.08)
accent stays under 5% of any screen
```

Motion rules (§5.3) are hard requirements, not guidance:
- animate **only** `transform` and `opacity`;
- `will-change` applied on animation start and **removed** on completion;
- every scroll listener is `passive: true` + rAF-throttled;
- reveals = 8px rise + fade, 400–500ms, 60ms stagger, `cubic-bezier(.22,1,.36,1)`;
- route transitions are **none** (instant, like Apple).

---

## 7. Performance budget (spec §3.4, enforced by `check-budget.mjs`)

| Item | Budget |
|---|---|
| Initial JS+CSS (gzip) | ≤ 180KB |
| Hero AVIF (LCP) | ≤ 120KB |
| Each product thumb AVIF | ≤ 35KB |
| Catalog chunk | ≤ 25KB gz |
| Fonts | ≤ 60KB (2 subsets, swap) |
| Lighthouse mobile | ≥ 95 × 4 categories |

---

## 8. Honesty gate — important, and easy to get wrong

The catalog ships as **illustrative sample data** (28 invented SKUs, placeholder prices,
stock photos of garments that are not in the store). A live site that badges invented
products "IN-STORE: ROURKELA" misrepresents real stock to real customers.

→ `config/site.ts` exposes `sampleCatalog: true` until the owner loads real inventory.
While it is true:
- the badge copy becomes "AVAILABLE IN STORE*" with an asterisk,
- the footer carries one discreet line: "Preview catalog — please confirm availability on WhatsApp.",
- `README.md` and `docs/ADD-PRODUCTS.md` both state the data is sample.

Flipping the flag to `false` restores the exact copy from the spec. Nothing else changes.

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| Stock-photo licences / attribution | Only Pexels/Unsplash-licensed images; `data/image-credits.json` records source + licence per photo; `raw/` gitignored but credits committed |
| Lighthouse 95+ while shipping Framer Motion | Framer Motion is dynamically imported and below-the-fold only; everything above the fold is CSS. If the budget is breached, drop to the hand-rolled `Reveal` (IntersectionObserver + CSS classes) and remove the dependency entirely — `useFlip` already establishes that pattern |
| 2G/3G verification can't be automated by Lighthouse CI | Manual DevTools throttle pass is a required step in the validation plan; LHCI covers the automated half |
| Owner never supplies real store details | `PLACEHOLDER_*` values fail loudly: a `docs/UPDATE-STORE-INFO.md` checklist plus a `console.warn` in dev when any placeholder is still present. wa.me links are built from config, so a wrong number is a one-line fix |
| Indian-market font subsetting (Devanagari + Latin) | Two `next/font` subsets, `display: swap`, system-font fallback stack; if the 60KB font budget breaks, drop the display face and rely on the system stack |

---

## 10. Validation plan

Run in this order before claiming done:

1. `pnpm typecheck` and `pnpm lint` — clean, zero warnings, strict TS.
2. `pnpm build` then `pnpm budget` — every §7 budget asserted.
3. `pnpm verify` (LHCI, mobile preset, 5 runs) — all four categories ≥95.
4. **320px viewport**: walk all five routes, assert `documentElement.scrollWidth <= 320`,
   every interactive target ≥44×44px, bottom tab bar respects `env(safe-area-inset-bottom)`.
5. **3G throttle + 4× CPU throttle**: home → filter to Killer + Denim + Budget →
   Quick View → confirm the WhatsApp href contains the right product name and price.
6. **Constraint matrix** — verify in all four states: default, DevTools
   `prefers-reduced-motion: reduce`, `Save-Data` on, `deviceMemory` < 4. Confirm ticker
   stops, map stays a thumbnail, carousel becomes snap-scroll, reveals become plain fades.
7. **Keyboard-only**: from any product card, reach the WhatsApp CTA without a mouse;
   focus trap holds in Quick View; Esc closes it; focus returns to the invoking card.
8. **Image kill-switch**: block `/_next/image` and `public/products` — assert branded
   placeholders everywhere and zero broken-image icons.
9. **Offline**: load once, go offline, reload — app shell and last catalog render.
10. **Back-button integrity**: apply filters → open Quick View → press back. Expect the
    modal to close; a second back restores the previous filter set.
11. **Hydration**: zero hydration warnings in the console on every route.

### Definition of Done (spec Part 1, to be checked off literally)

- [ ] Lighthouse mobile ≥95 × 4 on build output
- [ ] Zero CLS on route change; no horizontal scroll at 320px
- [ ] Full flow works on 2G throttling: home → filter → quick view → WhatsApp
- [ ] `prefers-reduced-motion` and Save-Data fallbacks verified
- [ ] Keyboard-only user can reach the WhatsApp CTA from any product
- [ ] No console errors/warnings; TypeScript strict clean
- [ ] ≥24 products across 7 categories, 6 brands, 3 tiers

---

## 11. Open items for the owner (not blocking the build)

1. **Store details** — address, phone, WhatsApp number (digits + country code, no `+`),
   map pin, and the real weekly hours. Replaces every `PLACEHOLDER_*`.
2. **Official brand logos** — optional SVGs into `public/brands/<id>.svg`; wordmarks are
   the default and stay in place if they never arrive.
3. **Real inventory** — replaces the 28 sample products, then flip `sampleCatalog: false`.
4. **A `PEXELS_API_KEY`** for the one-time image fetch. Absent it, the pipeline skips
   fetching and `prepare-images.mjs` still runs over whatever is in `raw/`.
5. **Optional `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`** for real counter
   persistence. Absent them, `/api/track` still accepts events and just logs them.