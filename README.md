# RAVYA FASHION — Digital Showroom

A **non-e-commerce** digital showroom for Ravya Fashion, Rourkela (Odisha):
what's on the racks, at what price, with two conversion engines — **WhatsApp
enquiries** and **GPS directions**. No cart, no payments, no accounts.

Built with Next.js 15 (App Router, static) + TypeScript strict + Tailwind.
Design language: Nike-style typographic discipline (flat cards, pill CTAs,
towering uppercase display) with a champagne-bronze accent reserved for
selection, focus and the active tab.

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build + budget check (postbuild)
pnpm verify     # typecheck + lint + budget
pnpm images     # regenerate product images + LQIP from raw/ (or placeholders)
```

## The catalog is sample data

`data/products.ts` ships **29 invented SKUs with placeholder prices**. While
`config/site.ts` has `sampleCatalog: true`:

- badges read "AVAILABLE IN STORE*" (asterisked),
- the footer shows "Preview catalog — please confirm availability on WhatsApp."

Load real inventory (see `docs/ADD-PRODUCTS.md`), then flip
`sampleCatalog: false` to restore the exact "IN-STORE: ROURKELA" copy.

## Adding products / changing store info

- Products: `docs/ADD-PRODUCTS.md` — edit `data/products.ts`, run `pnpm images`.
- Store details: `docs/UPDATE-STORE-INFO.md` — every `PLACEHOLDER_*` lives in `config/site.ts`.
- Brand logos: `docs/BRAND-ASSETS.md` — drop optional SVGs into `public/brands/`.
- Design tokens: `docs/DESIGN-TOKENS.md`.

## Measurement (first-party only)

No cookies, no third-party analytics. `lib/track.ts` sends allowlisted events
(`whatsapp_click`, `directions_tap`, …) via `sendBeacon` to `/api/track`,
which increments per-day counters. Without env vars the site runs with zero
configuration (events are logged server-side). For persistence, set:

```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
STATS_TOKEN=...        # then GET /api/stats?token=...
```

## Resilience (built in)

- Blocking inline script sets `data-savedata` / `data-lowmem` / `data-motion`
  on `<html>` before paint; CSS + hooks degrade animation, maps, tickers.
- LQIP blur-up on every product image; branded SVG fallback on error.
- Service worker: offline shell + cache-first statics; skipped on save-data.
- Open/closed status computed against `Asia/Kolkata`, never the device clock.
