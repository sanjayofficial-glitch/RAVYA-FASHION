# Apple-grade motion across Ravya Fashion — with shared performance prerequisites

## Context

The site has 15 distinct animations and **zero springs**. Every one is a CSS transition,
`@keyframes`, or a one-shot `element.animate()` with a fixed duration. Against the Apple model
(*Designing Fluid Interfaces*, WWDC 2018) that means the single most important property —
**interruptibility** — is absent everywhere. Nothing can be grabbed mid-flight or reversed.

Three specific consequences on this codebase:

- `hooks/useFlip.ts:34` calls `el.animate(...)` and **never keeps or cancels the handle**. Two rapid
  filter changes leave two concurrent animations writing `transform` on the same element.
- `components/layout/MoreSheet.tsx` can only be dismissed by scrim tap, close button, or Escape.
  A bottom sheet with no swipe gesture is the surface where Apple behavior is most expected.
- `MoreSheet.tsx:35` and `QuickView.tsx:52` gate unmount on hardcoded `setTimeout(250)` / `200` that
  are coupled to CSS durations by coincidence, not by contract.

The master build doc (line 100) specifies *"Framer Motion ONLY for below-the-fold reveals & modals —
tree-shaken"*, but `package.json:17-20` has only `next`, `react`, `react-dom`. That stated approach was
never implemented.

### Decisions (locked with user)

1. **Hand-roll a minimal spring.** No new dependency. ~1KB, no impact on the 180KB first-load budget.
   Precedent: the codebase already hand-rolls FLIP in `hooks/useFlip.ts` and values that.
2. **Gesture scope: sheet drag-to-dismiss + QuickView anchored scale-from-source.** Not the carousel —
   it uses native `overflow-x` scroll, which already has platform momentum and rubber-banding. Adding
   JS projection on top would fight the browser.
3. **Combined plan including prerequisites.** The four fixes below are shared with the separate
   whole-site performance effort, so this plan owns them to give `globals.css` a single editor.

---

## Part A — Prerequisites

These are required by Part C/D and are shared with the performance plan. Do them first.

### A1. Fix constraint detection at first render

`hooks/useConstraints.ts:11-27` initializes `savedata`, `lowmem`, `reducedMotion` all to `false` and
only reads them in `useEffect`, which runs **after hydration**. But `app/layout.tsx:36-39` already
writes those attributes into the DOM pre-paint. The information is available synchronously and the hook
discards it.

Every JS-gated behavior is briefly wrong on exactly the devices it protects:
`ProductGrid.tsx:20` (FLIP runs on low-memory), `NewInStoreCarousel.tsx:13` (4s interval starts on
save-data), `MapEmbed.tsx:10` (map enabled in data-saver), `BottomNav.tsx:77` (wrong press scale),
`WhatsAppFab.tsx:18` (pulse starts then stops).

- Read the attributes in the `useState` initializer, not in an effect. These are client components that
  only render in the browser, so this matches the server HTML and is hydration-safe.
- Note the codebase has a third pattern already: `QuickView.tsx:46` reads
  `document.documentElement.dataset.motion` **synchronously** — that one is already correct.
  Consolidate on the sync read; prefer CSS media queries where no JS is needed.

### A2. Scope `will-change` to imminent motion

`app/globals.css:190` sets `will-change: opacity, transform` on **every** `.reveal` element for the
entire page lifetime. That is one permanent compositor layer per element across 28 client components —
the wrong trade on the low-end Android this site targets.

- Apply `will-change` at the moment the IntersectionObserver fires; remove it when `.is-visible` lands.
- `Reveal.tsx:35-36` is where to add/remove the class alongside `is-visible`.
- Gate the whole thing behind `html:not([data-lowmem='true'])`.

### A3. Stop animating `filter` on every image

`globals.css:227-236` transitions `filter: blur(12px)` → `blur(0)` over 500ms. `filter` is paint-only
and non-compositable, and this runs on **every image simultaneously** during page load.

`components/ui/ProductImage.tsx` also renders the placeholder twice — once via `next/image`'s
`placeholder="blur"` (line 66-67) and again as a manual `<img src={lqip}>` at line 51.

- Delete the manual `<img>` layer and the `loaded` state that drives it. `placeholder="blur"` already
  covers the whole job. This also removes 2 state hooks per image (60 on `/shop`, 30 in staff).
- Drop the `filter` transition. If a blur-up feel is still wanted, cross-fade opacity only.

### A4. Complete the reduced-motion signal set

§14 requires three independent signals. Only `prefers-reduced-motion` is handled anywhere.

- Add `@media (prefers-reduced-transparency: reduce)` — the site uses `backdrop-blur` in
  `Header.tsx:26`, `BottomNav.tsx:93`, and ~6 pill locations (`ProductCard.tsx:28`,
  `CategoryTiles.tsx:43`, `StoreSnapshot.tsx:35`, `Hero.tsx:56,93`). Frost them to solid.
- Add `@media (prefers-contrast: more)` — near-solid backgrounds with a defined contrasting border.
- Keep the existing `data-motion` mechanism; it is pre-paint and correct.

---

## Part B — Spring infrastructure

### B1. `hooks/useSpring.ts` (new)

Single primitive for the whole plan. ~40 lines.

**Parameters** — use Apple's designer-facing pair, not mass/stiffness/damping:

| Parameter | Meaning | Conversion |
|---|---|---|
| `damping` (ζ) | damping ratio. `1.0` = critically damped, no overshoot | — |
| `response` (s) | time to reach target. **Not duration** — settle time is emergent | — |

Derive for the integrator: `ω₀ = 2π / response`, `stiffness = ω₀²`, `damping = 2ζω₀`.

**Integrator:** semi-implicit Euler on a fixed substep (1/240s), accumulating the rAF delta and
substepping so behaviour is frame-rate independent. A plain per-frame Euler goes unstable at low
frame rates — exactly the low-end case this site targets.

**Contract:**
```ts
type SpringHandle = {
  stop(): void;                       // must be called before any re-target
  currentVelocity(): number;           // px/s, read for velocity handoff
  finished: Promise<void>;            // resolves on settle — replaces setTimeout unmounts
}
startSpring(opts: { from, to, velocity?, damping, response, onUpdate, onDone }): SpringHandle
```

- `stop()` must cancel the rAF loop **and** any competing `element.animate()` on the same target.
- `onUpdate` should write only `transform` / `opacity`.
- Expose a settle threshold so `finished` does not hang on sub-pixel asymptotes.

**House curve:** `cubic-bezier(0.22, 1, 0.36, 1)` is already the established easing
(`tailwind.config.ts:48` as `ease-swift`, reused by `.sheet-in`, `.qv-in`, `.enter-rise`, `.reveal`).
Keep it as the single non-spring curve. Springs replace it only where interruption or velocity matters.

### B2. Utility functions (new, colocate with B1 or `lib/motion.ts`)

Port these **verbatim** from the skill — they are the exact forms Apple ships:

```ts
// Momentum projection — exponential decay, NOT the v²/(2·decel) textbook form
project(initialVelocity: number, decelerationRate = 0.998): number

// Rubber-banding — progressive resistance, never a hard stop
rubberband(overshoot: number, dimension: number, constant = 0.55): number
```

### B3. Fix `hooks/useFlip.ts` interruptibility

- Keep the returned handles from `el.animate()` in the ref map. In `play()` (line 21), call
  `.cancel()` on any existing handle for that `data-flip-id` **before** starting a new one.
  This is the concrete "brick wall" bug: today two rapid filter changes stack two `transform` writers.
- Retarget with the measured `getBoundingClientRect()` (which already reflects the presentation
  value — keep this; do not switch to target values).
- Raise `useFlip`'s velocities from `cancel()` into `startSpring` so filter reflow inherits momentum.

---

## Part C — Gesture work

### C1. MoreSheet drag-to-dismiss — `components/layout/MoreSheet.tsx`

Highest-value change on the site. Apple defines this sheet by the swipe, not the close button.

**Parameters:** sheet = Apple drawer/sheet values — `damping 0.8`, `response 0.3`. The `0.8` gives
slight overshoot, which is correct here precisely because the dismissal is momentum-driven.

Implement, in order:

1. **Pointer Events with capture.** On `pointerdown` on the panel:
   `setPointerCapture(e.pointerId)`. Track `grabOffset = e.clientY - rect.top` so the panel stays glued
   to the finger from wherever it was grabbed (§2 — snapping to the element center breaks the illusion).
2. **Position + timestamp history** (last few `pointermove`s), not just the current point — velocity at
   release is needed for §5.
3. **1:1 tracking** via `translateY`, updating the spring's *target* continuously rather than
   restarting an animation, so the panel is grabbable at any instant (§1, §2).
4. **Rubber-band upward.** Dragging above the open position resists progressively via `rubberband()`
   instead of hard-stopping (§9). A hard stop reads as frozen.
5. **Release:** decide dismiss-vs-return from **velocity sign**, not position — dismiss if velocity is
   downward or the projected endpoint (§6) passes 50% of sheet height; otherwise spring back to 0
   carrying release velocity (§5).
6. **Tap vs. drag discrimination — do not skip this.** `SheetLink.onClick` (line 171) currently closes
   the sheet. Without a ~10px movement threshold (§10) a drag that ends over a link will both dismiss
   the sheet *and* fire the navigation. Add the hysteresis gate before committing to drag, and
   suppress the click when a drag was detected.
7. **Scrim must move in sync (§13 Harmony).** Today the scrim gets
   `opacity-0 transition-opacity duration-200` (line 120) while the panel slides over 250ms, and on
   **open** the scrim pops in with no transition at all. Drive scrim opacity from the same spring
   progress as the panel translate — one value, two consumers.
8. **Replace the `setTimeout(250)`** at line 35 with the spring's `finished` promise. Same for
   QuickView C2.
9. **Keyboard/Escape path must be untouched** — the existing focus trap (lines 57-112) and
   `inert` handling are good. Only replace the unmount timing mechanism.
10. Keep `html[data-motion='reduced']` and `html[data-savedata='true']` fallbacks
    (`globals.css:286-294`): under reduced motion, cross-fade opacity only, no translate.

### C2. QuickView anchored materialization — `components/product/QuickView.tsx`

§7 (anchor to source) and §12 (materialize, don't fade). Today `qv-in` (`globals.css:250-256`) is
opacity + a flat 24px translate — it slides up from nowhere, unrelated to the card that opened it.

- On open, read the trigger rect. The infrastructure already exists: `ProductCard.tsx:20` renders
  `data-flip-id={product.id}` and `openQuickView(id)` (line 12-14) passes the id. Query
  `[data-flip-id="<id>"]` and `getBoundingClientRect()` at open time (it reflects current scroll —
  do **not** scroll the source into view).
- Set `transform-origin` on the dialog to the trigger's position relative to the dialog box, and
  scale from `~0.92` → `1` with the spring, alongside opacity.
- **Parameters:** this is a modality change, not a momentum gesture — use critically damped
  (`damping 1.0`, `response 0.3-0.4`). §4 is explicit that overshoot on something that merely
  faded in feels wrong.
- Desktop keeps `qv-in` semantics; `@media (max-width: 768px)` (`globals.css:260-267`) makes it a
  bottom sheet, so there use the sheet values (`damping 0.8`, `response 0.3`).
- Mirror the curve on exit: `qv-out` is currently `200ms ease-in` against `qv-in`'s
  `300ms cubic-bezier(.22,1,.36,1)`. §7 requires mirrored easing — same curve, matched duration.

---

## Part D — Motion defect fixes

### D1. BottomNav indicator animates three wrong properties

`BottomNav.tsx:34-35` and `98-107`. The comment on line 95 claims *"slides between tabs on transform
only (compositor-friendly)"* — **the code does not do this.** It transitions `left`, `width`, and
`box-shadow`. `left`/`width` are layout-triggering; `box-shadow` is expensive paint-only (§11).

The width is a **constant 24** (line 66), so animating it is pure waste.

- Position with `left: 0` + `transform: translateX(<px>)`, drop the width transition, drop the
  `box-shadow` transition. One animated property, actually composited — and the comment becomes true.
- Move to a spring, `damping 1.0`, `response 0.4` (Apple's move/reposition values).
- Remove `will-change-[left,width]` (line 99) — it does nothing useful for layout properties.
- `move()` reads two `getBoundingClientRect()` per resize (lines 60-61); rAF-throttle is already there
  and fine.

### D2. Header: hard divider where §12 wants a scroll-edge mask

`Header.tsx:23-28`. Already uses `backdrop-blur`, but has `border border-line/70` — a hard 1px divider,
which §12 explicitly calls out. Also transitions `box-shadow` (paint-only).

- Replace the border with an edge mask: a small gradient/blur fade where content meets the floating
  chrome, only where they actually overlap.
- Keep `bg-white/60` → `bg-white/85` + blur transition. Optional: animate blur radius rather than
  only background-color, so it reads as a material arriving (§12 "materialize").

### D3. Remove over-feedback (§13 Utility)

Three permanent infinite animations on the home page alone:

- `.fab-pulse` (`globals.css:239-241`, `WhatsAppFab.tsx:18`) — a 4s infinite scale pulse on a
  permanently visible element. §13: over-feedback trains users to ignore it. **Remove it.** If the
  FAB needs attention, make it event-driven (e.g. one pulse on catalog change). Also fix its gating:
  it currently reads `useConstraints` in JS; it should be CSS-gated like the ticker.
- `.skeleton::after` shimmer (`globals.css:210`) — keep, but it is a paint-heavy infinite animation on
  a low-end target. Consider 1 pulse then static, or gate on `data-lowmem`.
- `.ticker-track` (`globals.css:133-137`) — 30s infinite linear translate. §14 warns against slow
  looping oscillations. It is correctly gated on save-data/reduced-motion but **not** on
  `data-lowmem`. Add that gate.

### D4. `.reveal` and `.enter-rise`

`globals.css:181-196` (450ms) and `315-321` (300ms) are fixed-duration CSS transitions. They are not
gesture-driven, so CSS is acceptable here and they can stay — but retune `.reveal` to a spring-equivalent
curve once B1 exists if convenient. Lowest priority in this section; do it only if B1 makes it trivial.

---

## Part E — Typography (§15)

§15: *"Default to the platform's system font... Override only with a reason."*

`app/layout.tsx:41-47` loads **six** font files — Syne 700/800 plus Plus Jakarta Sans 400/500/700/800 —
against the project's own ≤60KB font budget (master build doc line 259). Six preloads compete with the
hero image, and `display: 'swap'` on a large `h1` causes a visible reflow inside the LCP window.

- Keep **Syne** for display only — it is the brand voice and there is a real reason.
- Move **body/sans to the system stack** (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto` are
  already in `tailwind.config.ts:24-31` behind the webfont). This removes 4 of 6 font files and gives
  body copy Apple's optical sizing and tracking tables for free (§15).
- Add `font-optical-sizing: auto` globally.
- Fix size-specific tracking: `.display-section` (`globals.css:83-90`) sets `letter-spacing: 0` at up to
  2.5rem — §15 wants large text tightened, so use ~`-0.015em`. `.display-campaign` (line 64) at
  `-0.01em` for up to 3rem is mild; ~`-0.02em` is closer to Apple's large-display guidance.
- Verify Jakarta 500 is referenced anywhere before assuming it is used.

---

## Out of scope — stays with the performance effort

Explicitly **not** in this plan, so the two efforts do not collide:

- Splitting `data/products.ts` / `data/editorial.ts` so base64 LQIPs leave the client JS bundle.
- Service worker: adding `/_next/image` + `/editorial/` to cache-first, trimming `SHELL`,
  build-hash versioning.
- Enforcing the unused `catalogChunkKB` budget in `scripts/check-budget.mjs`.
- `ProductCard` memoization and the FLIP layout-read reduction.

`.hero-glow` is correctly gated on `data-lowmem` and `data-motion='reduced'`
(`globals.css:226-229`) — no change needed. (An earlier performance note claimed otherwise; that was
incorrect.)

---

## Risks

| Risk | Mitigation |
|---|---|
| Hand-rolled spring misbehaves at low frame rates | Fixed 1/240s substep, not per-frame Euler. Test under CPU throttling. |
| Drag gesture fires link navigation | 10px hysteresis (§10) + suppress click when drag detected. Explicit task C1.6. |
| Spring + existing CSS animations fight over `transform` | C1/C2 must remove the corresponding `.sheet-in`/`.qv-in` animation, not layer on top. One writer per property. |
| Sheet drag fights `body { overflow: hidden }` (line 50) | Mobile-only sheet, overlay scrollbars — verify on real device, not just desktop emulation. |
| Font swap to system stack changes brand feel | Syne display face is retained; body copy is where the change lands. Visual check before merge. |
| Breaking existing focus trap / inert behavior | C1 changes timing only, not the trap logic. Re-verify Escape, Tab cycle, focus restore. |

---

## Validation

There is **no test harness** in this project — `package.json` defines no `test` script and no test
runner is installed. Adding one is out of scope unless requested. Validation is therefore:

1. **Existing gates, all must pass:**
   ```
   pnpm typecheck
   pnpm lint
   pnpm verify        # runs the budget check — must stay green
   ```
2. **Constraint correctness:** DevTools → Rendering → *Emulate CSS prefers-reduced-motion*, plus
   reload with `data-savedata`/`data-lowmem` forced true in the console. Confirm the carousel interval
   never starts, FLIP never engages, the FAB does not pulse.
3. **Interruptibility (the core claim — must be demonstrated, not assumed):** open MoreSheet, start
   dragging, release mid-flight, immediately drag back. The panel must follow the finger with no jump
   and no queued animation. Then rapid-tap three different filters in `/shop` and confirm only one
   animation runs per card (DevTools Performance — no stacked `transform` writers).
4. **Compositor-only confirmation:** DevTools → Rendering → *Paint flashing*, move the BottomNav
   indicator between tabs. No paint flash means the `left`/`width` fix worked.
5. **Reduced transparency:** DevTools → Rendering → *Emulate prefers-reduced-transparency*. Header,
   bottom nav, and all pills must go solid with no legibility loss.
6. **Real device, not just emulation:** one low-end Android on mobile data, per the project's own
   Definition of Done. Specifically the sheet swipe and the carousel — both are touch-path behaviors
   that desktop emulation will not exercise.
7. **Budget:** confirm `pnpm build` still reports the heaviest route within 180KB gz, since Part E
   removes font weight but Part B/C/D add JS.

---

## Suggested execution order

A1, A2, A3, A4 (prerequisites, independent) → B1, B2 (spring core) → B3 (FLIP interruptibility) →
C1 (sheet gesture) → C2 (QuickView anchor) → D1, D2, D3 (defect fixes) → E (typography).

D1 is a five-line change with the clearest correctness win in the plan and can be pulled forward
independently if the gesture work needs to land separately.