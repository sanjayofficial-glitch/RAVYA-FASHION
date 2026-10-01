# Design tokens

System: **Nike-style discipline + champagne bronze accent.**
Photography speaks; the chrome stays neutral. Accent < 5% of any screen.

## Color

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#FFFFFF` | Page background |
| `--canvas-alt` | `#F5F5F5` | Image stage, secondary buttons, skeletons |
| `--ink` | `#111111` | Primary text, primary CTA pill, active chips |
| `--ink-2` | `#707072` | Secondary text, captions |
| `--line` | `#E5E5E5` | Hairlines, card borders |
| `--accent` | `#C5A059` | Bronze — tab indicator, focus rings, selected tint |
| `--accent-ink` | `#8C6D33` | AA-safe bronze for text on white |
| `--sale` | `#D30005` | Price reductions only |
| `--ok` | `#007D48` | In-stock dot, open-now status |

## Type

- Display/campaign: Archivo Black (fallback Inter 900), uppercase,
  line-height 0.9, fluid `clamp(2.75rem, 9vw, 6rem)` — hero + section heads.
- UI/body: system stack (`-apple-system, Inter, Segoe UI, Roboto`).
  Cards 15px/500, captions 13px, eyebrows 10–11px uppercase tracked.

## Geometry

- Buttons: **pill** `999px`, min-height 48px (44px in dense contexts),
  press state `scale(0.98)`. One primary (ink) per viewport; ghost/secondary otherwise.
- Cards: `16px` radius, flat, hairline border, no shadows on product cards.
- Motion: only `transform` + `opacity`; reveals 450ms `cubic-bezier(.22,1,.36,1)`
  with 60ms stagger; FLIP reflow 250ms; route transitions none.
- Constraints: `prefers-reduced-motion`, `saveData` and low memory disable
  ticker/carousel/FLIP and collapse reveals to 150ms fades.
