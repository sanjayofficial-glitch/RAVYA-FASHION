# RAVYA FASHION — MASTER BUILD DOCUMENT
## Digital Showroom & Lookbook Portal (Non-E-Commerce)
### Complete Package: Master Prompt · PRD · TRD · UI/UX Spec · Animation Spec · Performance/Resilience Spec · Architecture · Folder Structure

**Version:** 1.0 | **Date:** 2026-09-30 | **Status:** Ready for Coding Agent

---

# PART 1 — THE MASTER PROMPT (paste this to your coding agent)

```
You are a senior product engineer + UI/UX designer. Build a production-grade,
mobile-first, Apple-quality website for RAVYA FASHION — a physical fashion
store in Rourkela, Odisha, India — that works as a LIVE DIGITAL SHOWROOM
(lookbook + inventory mirror). This is NOT an e-commerce site: NO cart,
NO payments, NO checkout. The site's only job is to show what's in the
physical store right now, at what prices, and drive footfall via WhatsApp
enquiries + GPS directions.

═══════════════════════════════════════════════
NON-NEGOTIABLE EXPERIENCE BAR (like apple.com)
═══════════════════════════════════════════════
1. FEELS LIKE APPLE: calm, confident, minimal. 60fps interactions, buttery
   spring physics, zero layout jank, zero unexpected jumps. Every scroll,
   tap, and transition feels intentional.
2. WORKS ON A ₹8,000 ANDROID PHONE ON 2G/3G: first meaningful paint < 1.5s
   on slow 4G, < 3s on 3G. Total initial payload ≤ 180KB (gzipped JS+CSS,
   excluding hero image). All images lazy-loaded with LQIP blur-up
   placeholders. Every animation degrades gracefully (reduced motion, low
   device memory, save-data mode).
3. ONE-THUMB MOBILE NAVIGATION: sticky bottom tab bar (Home, Shop, Brands,
   Visit Us, More) + collapsible top bar. Any page reachable in ≤ 2 taps.
   Active tab state is always obvious. Back behavior is never broken.
4. PIXEL-PERFECT RESPONSIVE: 320px → 4K. Mobile is the PRIMARY canvas,
   not an afterthought. Touch targets ≥ 44×44px. No horizontal scroll EVER.

═══════════════════════════════════════════════
DESIGN LANGUAGE: BRIGHT MINIMALIST LUXURY
═══════════════════════════════════════════════
- Canvas: pure white #FFFFFF, soft ivory sections #F9F9F9
- Text: deep charcoal #1A1A1A (primary), #6B6B6B (secondary)
- Accent: champagne bronze #C5A059 — hairlines, focus rings, hover states,
  active tab indicators. Used sparingly (<5% of screen).
- Typography: -apple-system / Inter stack. Display sizes fluid via clamp().
- Radius: 16px cards, 999px pills, 12px buttons. Hairline borders #EBEBEB.
- Photography: high-key, white-background product shots; editorial store
  photos. NO stock-y clutter. Whitespace is the luxury.
- Signature details (the "Apple touch"): content fades/rises 8px into view
  in 60ms staggered cascades; nav bar blurs (backdrop-filter) only when
  content scrolls beneath it; buttons have a subtle scale-0.98 press state;
  cards lift 4px with soft shadow on hover/touch.

═══════════════════════════════════════════════
PAGES & FLOW (5 routes + modal)
═══════════════════════════════════════════════
1. / (HOME): Hero (editorial image, headline "RAVYA FASHION: CURATED
   STYLE FOR ROURKELA", CTAs [Explore In-Store Catalog] + [Get Store
   Directions]) → brand/value ticker (auto-scrolling, pauses on touch) →
   6 category tiles + Essentials tile (7 tiles, staggered reveal) →
   "New This Week" horizontal snap carousel (in-store items) →
   brand partner logos strip (Ramraj, Killer, Sparky, Ignite, Jockey,
   Unibro) → store snapshot card (map thumbnail, hours, Open-Now status,
   directions CTA) → footer.
2. /shop (CATALOG): Sticky pill filter bar (Category / Brand) → responsive
   Budget · Mid · Premium) → responsive product grid (2 col mobile, 3–4
   desktop) → product cards: high-res photo w/ LQIP, name, brand, price or
   price-range, [IN-STORE: ROURKELA] live badge, dual buttons [Quick View]
   + [Enquire on WhatsApp]. Filters apply instantly client-side, with
   animated layout reflow. Empty state: friendly illustration + "Ask us on
   WhatsApp" CTA. URL params sync filters (?cat=denim&brand=killer) for
   shareability + back-button correctness.
3. /brands: One elegant card per authorized brand (Ramraj, Killer,
   Sportiq, Ignite, Jockey, Unibro) with category tags, tapping a brand
   deep-links into /shop?brand=X.
4. /about ("Our Story"): mission narrative, Rourkela community focus,
   "accessible luxury" positioning, Gen Z → Millennial range, store photos.
5. /visit (CONVERSION ENGINE): embedded map (lazy-loaded, static thumbnail
   first, interactive map on tap/intersection to save data), exact address,
   today's hours with live 🟢 Open Now / 🔴 Closed (computed from IST
   clock), phone tap-to-call, [Get Directions] GPS deep-link
   (geo: / Google Maps universal link), WhatsApp button.
6. QUICK VIEW MODAL (accessible): image, details, sizes, price, WhatsApp
   CTA with prefilled message, close on Esc/backdrop, focus-trapped,
   renders instantly from cached data.
7. Global: sticky header (logo, links, WhatsApp button) that collapses on
  scroll; WhatsApp floating button bottom-right (above bottom nav on mobile).

═══════════════════════════════════════════════
WHATSAPP INTEGRATION (the primary CTA)
═══════════════════════════════════════════════
Every product: wa.me link prefilled:
"Hi Ravya Fashion! I'm interested in [Product Name] (₹[Price]).
Is it available in my size at the Rourkela store?"
Global button: "Hi Ravya Fashion! I'd like to know what's new in store."

═══════════════════════════════════════════════
TECH STACK (fixed — do not substitute)
═══════════════════════════════════════════════
- Next.js 14+ (App Router) + TypeScript (strict) + Tailwind CSS
- Motion: hand-rolled spring primitive (hooks/useSpring.ts) for anything that
  must be interruptible — sheet drag-to-dismiss, QuickView materialization,
  FLIP grid reflow, the bottom-nav indicator. Pure CSS transitions/keyframes
  for everything fixed-duration and not gesture-driven. No animation library.
- next/image with blurDataURL LQIP; AVIF/WebP; explicit width/height to
  kill CLS
- State: React hooks + URL search params (no heavy store lib)
- Data: typed local JSON/MD catalog (products.ts) — decouple data from UI
  so the owner can edit inventory without touching components
- Fonts: Syne for display only; body copy on the platform system stack (§15)
- Deploy: static-first (SSG all routes, ISR optional for catalog)

═══════════════════════════════════════════════
RESILIENCE & PERFORMANCE CONTRACT (test all of these)
═══════════════════════════════════════════════
- next/image: priority only for hero; everything else lazy
- fonts: display=swap, subset, preconnect; system-font fallback stack
- route prefetch on intent (hover/touchstart) for instant nav
- skeletons for every async surface; never a blank white flash
- prefers-reduced-motion: all reveals/parallax/ticker disabled → simple
  fade only; sheet drag-to-dismiss degrades to an overshoot-free cross-fade
- prefers-reduced-transparency / prefers-contrast: frost goes solid, muted
  ink and hairlines darken
- navigator.connection.saveData OR effectiveType 2g → disable ticker
  animation, map interactivity, auto carousels; serve smallest images
- deviceMemory < 4 → reduce carousel to snap-scroll without transforms
- TTI target on mid-tier Android: < 2.5s. Lighthouse mobile ≥ 95
  (Perf, A11y, Best Practices, SEO).
- Graceful failure: if any image fails → elegant branded placeholder,
  never a broken-image icon. If JS partially fails, core content is
  server-rendered and readable.

═══════════════════════════════════════════════
ACCESSIBILITY (WCAG 2.1 AA)
═══════════════════════════════════════════════
Semantic HTML, alt text on every product image, visible focus rings
(bronze), full keyboard navigation, focus trap in modal, aria-live for
filter results count, contrast AA, no content conveyed by color alone.

═══════════════════════════════════════════════
DELIVERABLES
═══════════════════════════════════════════════
1. Full working codebase per the folder structure in the project doc
2. components/ documented with usage notes
3. README: setup, how to add/edit products (data/products.ts schema),
   how to change store hours/address (config)
4. Pass the Definition of Done checklist below before claiming done

DEFINITION OF DONE:
□ Lighthouse mobile 95+ on all 4 categories, on build output
□ Zero CLS on route change; no horizontal scroll at 320px
□ Full flow on 2G throttling: home → filter → quick view → WhatsApp
□ prefers-reduced-motion verified; save-data verified
□ Keyboard-only user can reach WhatsApp CTA from any product
□ No console errors/warnings; TypeScript strict clean
```

---

# PART 2 — PRD (PRODUCT REQUIREMENTS DOCUMENT)

## 2.1 Problem Statement
Rourkela shoppers discover fashion through Instagram and word-of-mouth but
can't check what's actually in the Ravya Fashion store before visiting.
Ravya needs a premium-feeling digital window that (a) mirrors live
in-store inventory, (b) communicates price ranges honestly, (c) converts
browsing into store visits via WhatsApp and GPS directions — without the
cost/complexity of e-commerce (no payments, shipping, returns).

## 2.2 Goals & Success Metrics
| Goal | Metric |
|---|---|
| Drive footfall | WhatsApp enquiry clicks / week; directions taps / week |
| Reduce "do you have X?" calls | Quick View + filter usage |
| Premium brand perception | Time on site, return visits |
| Inclusivity | Works fully on low-end Android + 2G/3G |

## 2.3 Target Users
- **Gen Z (18–26):** streetwear, denim, trends; mobile-only; impatient;
  expects TikTok-grade snappiness on a budget phone.
- **Millennial professionals (27–40):** formal/office wear; values trust
  (authorized brands), clarity (prices, hours), speed.
- **Existing local customers:** check stock before the trip.

## 2.4 Scope
**IN:** 5 routes, quick-view modal, pill filters, WhatsApp deep-links,
directions deep-link, live open/closed status, brand directory, about,
SEO metadata, PWA-lite (manifest + offline shell for cached pages).
**OUT:** cart, checkout, payments, shipping, user accounts, reviews,
blog/CMS backend, email capture.

## 2.5 User Stories (key)
1. As a student on 3G, I open the site and see products within 3 seconds.
2. As a shopper, I filter to "Killer + Denim + Budget" and see matching
   in-store items instantly, and can share that filtered view via URL.
3. As anyone, one tap on a product drafts a WhatsApp message with the
   product name and price already filled in.
4. As a first-time visitor, I see today's hours and whether the store is
   open right now, and get GPS directions in one tap.
5. As a keyboard/low-vision user, I can do stories 1–4 without a mouse.

## 2.6 Release Criteria
Definition of Done (from Master Prompt) fully passed + content populated
with ≥ 24 realistic sample products across all 6 categories + essentials,
covering all 6 brand partners and all 3 price tiers.

---

# PART 3 — TRD / TECHNICAL ARCHITECTURE

## 3.1 Stack & Rationale
| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 App Router (SSG) | Static = instant + cheap + offline-capable; server-rendered HTML means content survives JS failure |
| Language | TypeScript strict | Safety on a growing catalog |
| Styling | Tailwind CSS | Small payload, design-token consistency |
| Motion | CSS transforms above fold; Framer Motion tree-shaken below | 60fps without JS cost on critical path |
| Images | next/image AVIF/WebP + LQIP blurDataURL | Largest perf lever on fashion imagery |
| Data | `data/products.ts` typed schema | Owner-editable, zero backend cost |
| Config | `config/site.ts` (address, hours, phone, WhatsApp number, socials) | Single source of truth |
| Icons | Inline SVG only | No icon-font blocking |
| Analytics | None by default (privacy, weight); hooks ready | Optional |

## 3.2 Data Schema
```ts
// data/products.ts
type PriceTier = 'budget' | 'mid' | 'premium';
type Category = 'casual'|'formal'|'party'|'denim'|'activewear'|'outerwear'|'essentials';

interface Product {
  id: string;               // slug, e.g. 'killer-slim-denim-01'
  name: string;
  brand: 'ramraj'|'killer'|'sportiq'|'ignite'|'jockey'|'unibro'|'ravya';
  category: Category;
  price: number;            // or priceFrom/priceTo if range
  priceTo?: number;
  tier: PriceTier;          // derived: <999 budget, 999–2499 mid, >2499 premium
  sizes: string[];          // e.g. ['S','M','L','XL'] or ['30','32','34']
  colors?: string[];
  image: string;            // /public/products/xxx.avif
  lqip: string;             // 16px base64 blurDataURL
  isNew?: boolean;
  inStore: boolean;         // always true today; schema future-proofs
  description: string;      // 1–2 lines, WhatsApp-friendly
}
```

## 3.3 Route & State Architecture
- All routes prerendered (SSG). Catalog filtering is client-side against a
  code-split JSON chunk (~<20KB gz for 100 products), so filters are
  instant with zero network round-trips.
- Filter state lives in URL search params (`useSearchParams`) → shareable,
  back-button safe, SSR-friendly.
- Quick View modal state is local; opens instantly from already-loaded data.
- Open/closed status computed client-side from `config/site.ts` hours vs.
  Asia/Kolkata time.

## 3.4 Performance Budget (enforced)
| Item | Budget |
|---|---|
| Initial JS+CSS (gz) | ≤ 180KB |
| Hero image (AVIF, LCP) | ≤ 120KB |
| Each product thumb | ≤ 35KB |
| Full catalog chunk | ≤ 25KB gz |
| Fonts | ≤ 60KB (2 subsets, swap) |
| Lighthouse mobile | ≥ 95 × 4 |

## 3.5 Resilience Matrix
| Scenario | Behavior |
|---|---|
| Slow 3G/2G | LQIP blur-up everywhere; ticker becomes static; map = thumbnail + "Tap to load map" |
| `Save-Data` header | Same as 2G + skip auto carousels |
| Low memory device | No transform-based carousel; native CSS scroll-snap |
| `prefers-reduced-motion` | All reveals → 150ms opacity fade; no parallax, no ticker |
| Image 404/CDN fail | Branded ivory placeholder card, product still usable |
| JS disabled/broken | All content SSR'd; filters degrade to anchor links per category |
| Offline (visited before) | Service worker serves cached shell + last catalog |

---

# PART 4 — UI/UX DESIGN SYSTEM

## 4.1 Tokens
```
--canvas: #FFFFFF      --canvas-alt: #F9F9F9
--ink: #1A1A1A        --ink-2: #6B6B6B      --line: #EBEBEB
--accent: #C5A059     --accent-ink: #8C6D33 (text on white for AA)
--radius-card: 16px   --radius-pill: 999px  --radius-btn: 12px
--shadow-lift: 0 8px 24px rgba(26,26,26,.08)
Font stack: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif
Type scale (fluid): display clamp(2rem,6vw,3.5rem) / h2 clamp(1.5rem,4vw,2.25rem) / body 1rem / small .875rem
Spacing: 4px base grid; section padding clamp(48px, 8vw, 96px)
```

## 4.2 Components (anatomy)
- **Header:** 64px, white→ `rgba(255,255,255,.82)` + `backdrop-blur` only
  after 24px scroll; logo left; nav links center (desktop); WhatsApp pill
  right. Mobile: logo + WhatsApp; links live in bottom tab bar.
- **Bottom Tab Bar (mobile, fixed):** 5 tabs — Home, Shop, Brands, Visit,
  More (More = About + contact + hours sheet). 56px tall + safe-area inset;
  active tab = bronze icon+label with 24px animated indicator pill that
  slides between tabs (CSS transform, 200ms spring curve).
- **Product Card:** image 4:5 (LQIP), brand eyebrow (10px uppercase,
  tracking), name, price "₹1,299" or "₹1,299–1,799", green dot + "IN-STORE:
  ROURKELA" badge, two ghost buttons. Press state: scale(.98).
- **Pill Filter Bar:** horizontally scrollable snap pills; selected =
  bronze hairline + tint; shows active count; "Clear all" appears when
  filters active; results count via aria-live.
- **Ticker:** seamless CSS marquee (duplicated content, translateX loop);
  pauses on hover/touch; static wrap on reduced-motion/save-data.
- **Quick View Modal:** bottom-sheet on mobile (slides up, drag-to-dismiss),
  centered dialog on desktop; focus-trapped; product + WhatsApp CTA.
- **Empty state:** centered, 96px illustration SVG, copy "Nothing matches
  those filters right now — new stock lands daily. Ask us on WhatsApp."
- **Skeletons:** shimmer in ivory/gray hairlines for grids/carousels during
  any async paint.

## 4.3 Page Wireframes (text)
```
HOME     [Header] [Hero: image right / headline left, 2 CTAs] [Ticker]
         [H2 "Shop by Mood" + 7 tiles 2×4] [H2 "New In-Store" + snap carousel]
         [H2 "Our Brands" + 6 logos] [Store snapshot: map thumb | hours | CTA]
         [Footer]
SHOP     [Header] [Title + count] [Sticky pill bar] [Grid 2/3/4] [Footer]
BRANDS   [Header] [Hero mini] [6 brand cards: logo, tags, "View items →"]
VISIT    [Header] [Map thumbnail → interactive on tap] [Address card]
         [Hours table w/ today highlighted + live status] [Call] [Directions] [Footer]
```

---

# PART 5 — MOTION & ANIMATION SPEC

## 5.1 Principles (Apple-like)
Motion is information, not decoration. Every animation answers "where did
this come from / where did it go." Duration: micro 120–180ms, reveals
400–500ms, page 200–300ms. Easing: spring-ish `[0.22,1,0.36,1]` for
reveals; `ease-out` for presses. Everything animates ONLY transform and
opacity (compositor-only → 60fps).

## 5.2 Inventory
| Element | Motion | Trigger | Fallback |
|---|---|---|---|
| Page load (above fold) | None/CSS only | — | — |
| Below-fold sections | fade + translateY(8px), 60ms stagger | IntersectionObserver (once) | instant if reduced-motion/low-data |
| Category tiles | staggered rise, stagger=50ms | in view | same fallback |
| Header | blur+shrink on scroll (>24px) | scroll listener (passive, rAF-throttled) | solid bar if no backdrop-filter |
| Bottom tab indicator | slide 200ms spring | tab change | — |
| Card press | scale(.98) 120ms | :active | — |
| Quick view | sheet: translateY 100%→0, 300ms spring; backdrop fade 200ms | tap | instant open if reduced-motion |
| Filter reflow | FLIP layout animation 250ms | filter change | instant on low memory |
| Ticker | translateX loop 30s linear | auto | static, wrap, no loop |
| WhatsApp FAB | gentle 1.0→1.03 pulse every 4s, stops after first tap or reduced-motion | idle | — |
| Route transition | none (keep it instant like Apple) | — | — |

## 5.3 Hard Rules
- `will-change` only on actively animating elements; removed after.
- No JS scroll handlers without rAF throttle + passive:true.
- No parallax on hero for low-memory; optional subtle scale 1→1.04 on
  desktop scroll (transform only).
- All Framer Motion usage dynamically imported / below the fold.
- Test matrix: normal / reduced-motion / save-data / 2G CPU-throttled —
  experience must remain dignified in all four.

---

# PART 6 — NAVIGATION & IA SPEC

- **Global:** any destination ≤ 2 taps from anywhere. Home tiles deep-link
  to filtered catalog. Brand cards deep-link to filtered catalog. Footer
  repeats all links (SEO + catch-all).
- **Mobile primary nav = bottom tab bar** (Home, Shop, Brands, Visit, More).
  "More" opens a sheet with About, Contact, Hours, Socials.
- **Breadcrumbs** on Shop when filters active: Home / Shop / Denim / Killer.
- **Back-button integrity:** filters in URL → back restores previous
  filter set; modal closes on back (history API) without trapping.
- **Deep links:** `/shop?cat=denim&brand=killer&tier=budget` must render
  the filtered grid server-side for SEO + instant paint.
- **Focus order:** header → content → CTA; skip-to-content link for a11y.

---

# PART 7 — FOLDER STRUCTURE

```
ravya-fashion/
├── app/
│   ├── layout.tsx               # fonts, header, bottom-nav, FAB, footer, metadata
│   ├── page.tsx                 # home
│   ├── shop/page.tsx            # catalog (reads searchParams)
│   ├── brands/page.tsx
│   ├── about/page.tsx
│   ├── visit/page.tsx
│   └── globals.css              # tokens, base, utilities
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   ├── MoreSheet.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppFab.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── Ticker.tsx
│   │   ├── CategoryTiles.tsx
│   │   ├── NewInStoreCarousel.tsx
│   │   ├── BrandStrip.tsx
│   │   └── StoreSnapshot.tsx
│   ├── shop/
│   │   ├── FilterBar.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   └── EmptyState.tsx
│   ├── product/
│   │   ├── QuickView.tsx        # bottom-sheet modal
│   │   └── Price.tsx
│   ├── visit/
│   │   ├── MapEmbed.tsx         # lazy: thumb → interactive
│   │   ├── HoursTable.tsx       # live open/closed
│   │   └── DirectionsButton.tsx
│   └── ui/
│       ├── Pill.tsx
│       ├── Badge.tsx            # IN-STORE: ROURKELA
│       ├── Skeleton.tsx
│       ├── SectionHeading.tsx
│       └── Reveal.tsx           # IntersectionObserver wrapper
├── lib/
│   ├── products.ts              # types + helpers (tier calc, filtering)
│   ├── whatsapp.ts              # message builders (encodeURIComponent)
│   ├── hours.ts                 # open/closed logic (Asia/Kolkata)
│   ├── motion.ts                # shared variants + reduced-motion helpers
│   └── format.ts                # INR price formatting
├── data/
│   ├── products.ts              # ≥24 sample products (schema above)
│   └── brands.ts
├── config/
│   └── site.ts                  # name, address, hours, phone, whatsapp, mapUrl
├── public/
│   ├── products/                # avif/webp + lqip
│   ├── brands/
│   ├── icons/                   # svg
│   ├── manifest.json
│   └── sw.js (or next-pwa)      # offline shell
├── hooks/
│   ├── useReducedMotion.ts
│   ├── useSaveData.ts
│   ├── useIsMobile.ts
│   └── useScrollY.ts            # rAF-throttled passive
├── middleware.ts                # (optional) headers: cache, security
├── next.config.mjs              # images, AVIF, headers, bundle analyzer
├── tailwind.config.ts
├── tsconfig.json
├── README.md
└── docs/
    ├── ADD-PRODUCTS.md          # owner guide: edit data/products.ts
    ├── UPDATE-STORE-INFO.md     # edit config/site.ts
    └── DESIGN-TOKENS.md
```

---

# PART 8 — CONTENT REQUIREMENTS
- Hero headline/sub as specified; CTAs labeled exactly.
- Ticker items: "Gen-Z to Millennial Styles · Everyday Value to Premium
  Curation · 100% In-Store Verified · Authorized: Ramraj · Killer ·
  Sportiq · Ignite · Jockey · Unibro".
- About: 3 short chapters (Why Ravya / Accessible Luxury / Our Rourkela).
- ≥24 products: every category ≥3 items; every brand ≥3 items; every tier
  well represented; 6+ marked isNew; realistic INR pricing.
- Product descriptions written so the WhatsApp prefilled message reads
  naturally when sent.

---

# PART 9 — SEO / META / PWA
- Per-route metadata (title, description, OG image 1200×630 ivory/bronze).
- Product structured data (ItemList) optional; LocalBusiness JSON-LD on
  Home/Visit with address, geo, openingHours, telephone — critical for a
  local store.
- manifest.json (name, theme #FFFFFF, bronze accents, icons maskable).
- Clean URLs, sitemap, robots.

---

# PART 10 — TEST PLAN (coding agent must run)
1. Lighthouse CI ×5 runs on build, mobile preset — all ≥95.
2. Chrome DevTools: throttle 3G + 4× CPU → flow home→filter→quick view→
   WhatsApp link correct.
3. Emulate: Moto G4 / 320×568 / iPhone SE; check no horizontal scroll,
   tab bar safe-area, 44px targets.
4. prefers-reduced-motion, Save-Data on → verify fallbacks.
5. Keyboard-only full flow; screen-reader pass (VoiceOver) on Home + Shop.
6. Offline reload after first visit → shell + catalog render.
7. Image kill-switch test: block CDN → placeholders, no broken icons.
