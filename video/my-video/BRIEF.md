---
subject: Ravya Fashion, Sector 5 Rourkela
workflow: product-launch-video
destination: Instagram Reels (9:16)
length: 60s
format: text-only cards + music bed, no VO
engine: Hyperframes (HTML composition → MP4)
capture_mode: no-capture (use existing site assets in public/)
aspect: 1080x1920
---

## Intent
Demo for Instagram Reels: a single 60s 9:16 product clip for Ravya Fashion covering the full brand — in-stock promise, new arrivals, brand range, store experience, close with CTA. Text cards over editorial/product imagery, music bed, no AI VO.

## Angle
What you see online is on our racks today — online catalog = physical stock, reserve via WhatsApp, visit the Sector 5 flagship.

## Customizations
- Assets: `public/editorial` + `public/products` + `public/brands` images (already optimized avif/webp via next/image → use the -sm/-md jpg/webp variants in-place).
- No AI-generated footage, no avatar. Text overlays carry the message.
- Client quote: catalog badges read "AVAILABLE IN STORE*" until inventory flips — keep copy honest ("sample catalog" honesty gate preserved).
- One_Hyperframes pass end-to-end; Remotion not used — it added no value once we picked HTML composition (client asked for "Remotion and Hyperframes mixed"; recommendation was Hyperframes-primary; Remotion deferred unless a motion-graphics beat demands it).

## Assets
- editorial/home_boutique-storefront-exterior-of-16.jpg — hook / store shot
- editorial/home_macro-closeup-portrait-of-4.jpg — LCP portrait hero
- editorial/home_athletic-young-runner-wearing-10.jpg, home_stylishly-tailored-male-model-2.jpg — triptych moods
- editorial/catalog_catalog-editorial-* / brands_brands-editorial-* — brand range montage
- editorial/visit_modern-high-street-boutique-2.jpg, visit_vip-fitting-lounge-with-4.jpg — store experience
- products/*.avif / -sm — product card inserts
- Logo/wordmark: text "RAVYA FASHION" (no file asset found in public/icons — confirm)

## Run shape
- storyboard: yes → this document + STORYBOARD.md are the review artifact; no render until approved.
- flow: automation → once approved I render end-to-end.

## Notes
- Syne 800 for display cards, Plus Jakarta Sans 400/500/700 for body (site fonts).
- Keep within safe Instagram crop (~80px top/bottom padding on text).
- Instagram wants 9:16 MP4, ≤90s, H.264.
