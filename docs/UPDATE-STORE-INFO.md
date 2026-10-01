# Updating store info

Every editable constant lives in **`config/site.ts`** — the single source of truth.
After editing, redeploy; nothing else needs to change.

| Constant | Where it surfaces | Notes |
|---|---|---|
| `PLACEHOLDER_ADDRESS` | Visit page, footer, Store snapshot card, JSON-LD, maps links | Full street address incl. city + PIN |
| `PLACEHOLDER_PHONE` | Visit page (tap-to-call), footer, JSON-LD | Format `+91XXXXXXXXXX` |
| `PLACEHOLDER_WHATSAPP` | Every wa.me deep link (cards, FAB, header, quick view, empty state) | **Digits only with country code, no `+`** — e.g. `919876543210` |
| `PLACEHOLDER_GEO` | Directions link, map embed, JSON-LD geo | `{ lat: 22.2604, lng: 84.8536 }` for Rourkela |
| `hours` | Hours table, open/closed status, JSON-LD | 24h IST ranges, `0` = Sunday, `''` = closed |
| `sampleCatalog` | Badge copy + footer preview line | Flip to `false` when real inventory loads |

While any placeholder is still set, `pnpm dev` prints a console warning.

## Checklist

1. Fill address, phone, WhatsApp digits, geo pin.
2. Correct the weekly `hours`.
3. Load real products (`docs/ADD-PRODUCTS.md`).
4. Set `sampleCatalog: false`.
5. Deploy and verify: a product's WhatsApp button opens a chat addressed to
   the real number with the product name + price prefilled.

## Concierge backend (Phases 4–5, optional)

Zero-config by default: holds, bookings and inventory edits work in demo
memory mode. Set these env vars to go live:

| Variable | Enables | Notes |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Real persistence for counters, holds, bookings, inventory | Absent: events only logged, state is process-local |
| `WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` | Cloud-API confirmations for holds/bookings | Meta dashboard → permanent system-user token + phone-number ID; sends are best-effort and never fail a ticket |
| `STAFF_TOKEN` | Inventory mutations (`POST /api/inventory` + `/staff?token=…`) | Absent: dashboard is view-only, writes 404 |
| `STATS_TOKEN` | Read access to `/api/stats?token=…` | Absent: endpoint 404s |

Verify: `POST /api/reserve` with a real `productId` returns a ticket;
`POST /api/stylist-booking` with name/phone/date/slot/focus returns a
booking; `/staff?token=…` flips a piece to Sold and the counts update.
