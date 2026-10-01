# Brand assets

By default every partner is shown as an **uppercase letter-spaced wordmark**
in the site typeface — no trademark reproduction, no missing-asset risk.

## Optional logo override

1. Get the official logo (SVG preferred) and confirm you have the right to use it.
2. Save it as `public/brands/<id>.svg` where `<id>` is:
   `ramraj`, `killer`, `sportiq`, `ignite`, `jockey`, `unibro`.
3. In `data/brands.ts`, set `logo: '/brands/<id>.svg'` on that brand's entry.
4. Where a brand is displayed, render the SVG when `logo` is present and fall
   back to the wordmark otherwise.

Only monochrome or dark-on-light marks are recommended; the site chrome is
black/white/gray and the accent is champagne bronze `#C5A059`.
