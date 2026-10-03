# Graph Report - D:\RAVYA FASHION  (2026-10-03)

## Corpus Check
- Large corpus: 259 files · ~1,132,563 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 529 nodes · 527 edges · 70 communities detected
- Extraction: 62% EXTRACTED · 34% INFERRED · 4% AMBIGUOUS · INFERRED: 179 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_API Routes & Inventory|API Routes & Inventory]]
- [[_COMMUNITY_Storefront UI Components|Storefront UI Components]]
- [[_COMMUNITY_Visit & Booking|Visit & Booking]]
- [[_COMMUNITY_Route Handlers & WhatsApp Notify|Route Handlers & WhatsApp Notify]]
- [[_COMMUNITY_Project Docs & Pages|Project Docs & Pages]]
- [[_COMMUNITY_Icon Library|Icon Library]]
- [[_COMMUNITY_Products & Staff Dashboard|Products & Staff Dashboard]]
- [[_COMMUNITY_Video Production & Storyboard|Video Production & Storyboard]]
- [[_COMMUNITY_MoreSheet Gestures|MoreSheet Gestures]]
- [[_COMMUNITY_WhatsApp Helpers|WhatsApp Helpers]]
- [[_COMMUNITY_Site Layout & SEO|Site Layout & SEO]]
- [[_COMMUNITY_Footer & Store Hours|Footer & Store Hours]]
- [[_COMMUNITY_Image Pipeline Scripts|Image Pipeline Scripts]]
- [[_COMMUNITY_Carousel & Scroll|Carousel & Scroll]]
- [[_COMMUNITY_Directions & Maps|Directions & Maps]]
- [[_COMMUNITY_Model Studio Portraits|Model Studio Portraits]]
- [[_COMMUNITY_Brands Editorial Portraits|Brands Editorial Portraits]]
- [[_COMMUNITY_Street & Studio References|Street & Studio References]]
- [[_COMMUNITY_Lifestyle Editorial Screenshots|Lifestyle Editorial Screenshots]]
- [[_COMMUNITY_Brand PNG Placeholders|Brand PNG Placeholders]]
- [[_COMMUNITY_Stock Product Photos|Stock Product Photos]]
- [[_COMMUNITY_Product & Lifestyle Flat Lays|Product & Lifestyle Flat Lays]]
- [[_COMMUNITY_Ignite Brand Placeholders|Ignite Brand Placeholders]]
- [[_COMMUNITY_Jockey Brand Placeholders|Jockey Brand Placeholders]]
- [[_COMMUNITY_Denim & Jacket Photos|Denim & Jacket Photos]]
- [[_COMMUNITY_Killer & Ramraj Products|Killer & Ramraj Products]]
- [[_COMMUNITY_Ramraj Placeholders & Photography|Ramraj Placeholders & Photography]]
- [[_COMMUNITY_Sportiq Placeholders|Sportiq Placeholders]]
- [[_COMMUNITY_Sportiq & Unibro Products|Sportiq & Unibro Products]]
- [[_COMMUNITY_Stitch Mobile Mockups|Stitch Mobile Mockups]]
- [[_COMMUNITY_Redesigned Page Screenshots|Redesigned Page Screenshots]]
- [[_COMMUNITY_Editorial Triptychs & Map|Editorial Triptychs & Map]]
- [[_COMMUNITY_Tracking API|Tracking API]]
- [[_COMMUNITY_Stock Image Fetch Script|Stock Image Fetch Script]]
- [[_COMMUNITY_Store Interior Photos|Store Interior Photos]]
- [[_COMMUNITY_Hero & Placeholder Stubs|Hero & Placeholder Stubs]]
- [[_COMMUNITY_Staff Dashboard Tracking|Staff Dashboard Tracking]]
- [[_COMMUNITY_Header & Scroll Hook|Header & Scroll Hook]]
- [[_COMMUNITY_Build & Service Worker|Build & Service Worker]]
- [[_COMMUNITY_Editorial Product Pages|Editorial Product Pages]]
- [[_COMMUNITY_Suits & Jacket Placeholders|Suits & Jacket Placeholders]]
- [[_COMMUNITY_Budget Check Script|Budget Check Script]]
- [[_COMMUNITY_Spring Motion Helpers|Spring Motion Helpers]]
- [[_COMMUNITY_Palette & Stitch Home|Palette & Stitch Home]]
- [[_COMMUNITY_Denim & Smoke Photos|Denim & Smoke Photos]]
- [[_COMMUNITY_Ramraj & KIIKI Products|Ramraj & KIIKI Products]]
- [[_COMMUNITY_Unibro Placeholders|Unibro Placeholders]]
- [[_COMMUNITY_Stock Nature Photos|Stock Nature Photos]]
- [[_COMMUNITY_Boutique Interior Photos|Boutique Interior Photos]]
- [[_COMMUNITY_Stitch Visit Pages|Stitch Visit Pages]]
- [[_COMMUNITY_Street Editorial Photos|Street Editorial Photos]]
- [[_COMMUNITY_Unibro & T-Shirt Photos|Unibro & T-Shirt Photos]]
- [[_COMMUNITY_Nature Stock Photos|Nature Stock Photos]]
- [[_COMMUNITY_Tote Product|Tote Product]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_OG Image|OG Image]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_Staff Page|Staff Page]]
- [[_COMMUNITY_Loading State|Loading State]]
- [[_COMMUNITY_Brand Strip|Brand Strip]]
- [[_COMMUNITY_Ticker|Ticker]]
- [[_COMMUNITY_Service Worker|Service Worker]]
- [[_COMMUNITY_Pill|Pill]]
- [[_COMMUNITY_Section Heading|Section Heading]]
- [[_COMMUNITY_normalizePhone|normalizePhone]]
- [[_COMMUNITY_Stitch About Page|Stitch About Page]]
- [[_COMMUNITY_Rourkela Map|Rourkela Map]]
- [[_COMMUNITY_Steaming Pot Photo|Steaming Pot Photo]]
- [[_COMMUNITY_Building Facade Photo|Building Facade Photo]]
- [[_COMMUNITY_Rocky Shoreline Photo|Rocky Shoreline Photo]]

## God Nodes (most connected - your core abstractions)
1. `base()` - 12 edges
2. `Reserve/Hold API Route` - 10 edges
3. `POST()` - 8 edges
4. `POST()` - 8 edges
5. `Stylist Booking API Route` - 7 edges
6. `MoreSheet` - 7 edges
7. `upstashCreds()` - 6 edges
8. `upstashPipeline()` - 6 edges
9. `main()` - 6 edges
10. `Inventory API Route` - 6 edges

## Surprising Connections (you probably didn't know these)
- `startSpring spring integrator` --semantically_similar_to--> `project/rubberband momentum helpers`  [INFERRED] [semantically similar]
  hooks/useSpring.ts → lib/motion.ts
- `pnpm workspace config` --enables-build-scripts-for--> `sharp AVIF/WebP + LQIP pipeline`  [INFERRED]
  pnpm-workspace.yaml → scripts/prepare-images.mjs
- `RAVYA FASHION README` --semantically_similar_to--> `Nike-design-analysis`  [INFERRED] [semantically similar]
  README.md → DESIGN-nike.md
- `Nike-design-analysis` --semantically_similar_to--> `Neo-Editorial Streetwear design system`  [INFERRED] [semantically similar]
  DESIGN-nike.md → stitch_ravya_luxury_parallax_showroom/neo_editorial_streetwear/DESIGN.md
- `Editorial Product Page: Ravya Denim Co Distressed Jacket` --semantically_similar_to--> `Ravya Fashion Redesigned Brands Page ("Our Brands")`  [INFERRED] [semantically similar]
  video/my-video/assets/brands_brands-editorial-1-1.jpg → stitch_ravya_luxury_parallax_showroom/ravya_fashion_redesigned_brands/screen.png

## Hyperedges (group relationships)
- **Upstash-or-memory dual persistence** — app/api/inventory/route.ts, app/api/reserve/route.ts, app/api/stylist-booking/route.ts, lib/store, memory-fallback, upstash-redis [INFERRED 0.90]
- **Track/Stats event counter pair** — app/api/track/route.ts, app/api/stats/route.ts, event-analytics [INFERRED 0.90]
- **180KB first-load budget constraint** — hooks/useSpring.ts, scripts/check-budget.mjs, scripts/prepare-images.mjs [INFERRED 0.85]
- **LQIP (base64 placeholder) pipeline** — scripts/prepare-images.mjs, scripts/pull-stitch-images.mjs, data/products [INFERRED 0.85]
- **Alternate design languages explored for the showroom** — DESIGN-nike.md, stitch_ravya_luxury_parallax_showroom/neo_editorial_streetwear/DESIGN.md, Ravya_Fashion_Master_Build_Document.md [INFERRED 0.70]
- **Stitch mobile mockups for About/Story, Brands, Catalog** — stitch_ravya_luxury_parallax_showroom/ravya_fashion_mobile_about_story/code.html, stitch_ravya_luxury_parallax_showroom/ravya_fashion_mobile_brands/code.html, stitch_ravya_luxury_parallax_showroom/ravya_fashion_mobile_catalog/code.html [INFERRED 0.90]
- **SVG Placeholder Image Stubs** — _hero_gen_placeholder, ignite_cargo_shorts_gen_placeholder, ignite_linen_shirt_gen_placeholder [EXTRACTED 1.00]
- **Identical SVG garment-placeholder template shared across RAVYA and SPORTIQ assets (differ only by wordmark)** — ravya-windcheater.gen_mockup, sportiq-gym-shorts.gen_mockup, sportiq-hoodie.gen_mockup [EXTRACTED 1.00]
- **Ravya Fashion redesigned website pages (home, brands, catalog, visit us)** — ravya_fashion_redesigned_home_home_page, ravya_fashion_redesigned_brands_our_brands_page, ravya_fashion_redesigned_catalog_catalog_page, ravya_fashion_redesigned_visit_us_store_locator_page [EXTRACTED 1.00]
- **Editorial fashion assets for Ravya Fashion video project** — brands_editorial_denim_jacket_product_page, catalog_editorial_white_khadi_outfit [INFERRED 0.80]
- **Ravya Fashion website/video image assets (same asset folder)** — catalog_catalog-editorial-2-2_denim_editorial_triptych, home_bold-street-fashion-model-3_street_fashion_dusk, home_boutique-storefront-exterior-of-16_rourkela_map, home_highfashion-young-model-wearing-1_pastel_tracksuit_triptych, home_macro-closeup-portrait-of-4_patterned_sunglasses_portrait, home_stylishly-tailored-male-model-2_ravya_summer_hero [INFERRED 0.70]

## Communities

### Community 0 - "API Routes & Inventory"
Cohesion: 0.07
Nodes (36): /api/track endpoint, Inventory API Route, Reserve/Hold API Route, Stats API Route, Stylist Booking API Route, Track API Route, ShopPage, products catalog (+28 more)

### Community 1 - "Storefront UI Components"
Cohesion: 0.09
Nodes (28): POST /api/reserve, Hero, NewInStoreCarousel, StoreSnapshot, BottomNav, Footer, Header, MoreSheet (+20 more)

### Community 2 - "Visit & Booking"
Cohesion: 0.09
Nodes (26): BookingForm, DirectionsButton, FilterSidebar, HoursTable, InStoreBadge, MapEmbed, Reveal, STORE_OPEN_WARN (+18 more)

### Community 3 - "Route Handlers & WhatsApp Notify"
Cohesion: 0.17
Nodes (16): authorized(), GET(), POST(), readAll(), staffToken(), notifyConfigured(), sendWhatsAppText(), normalizePhone() (+8 more)

### Community 4 - "Project Docs & Pages"
Cohesion: 0.14
Nodes (20): Digital Showroom Build Plan, Nike-design-analysis, RAVYA FASHION README, Master Build Document, AboutPage, BrandsPage, VisitPage, CategoryTiles (+12 more)

### Community 5 - "Icon Library"
Cohesion: 0.21
Nodes (17): base(), baseFilled(), BrandsIcon(), BrandsIconFilled(), ChevronRightIcon(), ClockIcon(), CloseIcon(), DirectionsIcon() (+9 more)

### Community 6 - "Products & Staff Dashboard"
Cohesion: 0.16
Nodes (15): NewBadge, ProductImage, ShopSort, StaffDashboard, /api/inventory, BrandId, brandMap, brands (+7 more)

### Community 7 - "Video Production & Storyboard"
Cohesion: 0.2
Nodes (12): HyperFrames Composition Project AGENTS.md, Product Launch Video Brief, HyperFrames Composition Project CLAUDE.md, Brand Range (Ramraj · Killer · Sportiq · Ignite · Jockey · Unibro), GSAP Paused Root Timeline, HyperFrames (HTML composition → MP4), Sample Catalog Honesty Gate ('AVAILABLE IN STORE*'), WhatsApp Reservation CTA (+4 more)

### Community 8 - "MoreSheet Gestures"
Cohesion: 0.22
Nodes (5): endDrag(), onPointerMove(), releaseVelocity(), project(), rubberband()

### Community 9 - "WhatsApp Helpers"
Cohesion: 0.36
Nodes (8): formatINR(), formatPrice(), generalEnquiry(), holdLink(), holdMessage(), productEnquiry(), waLink(), waNumber()

### Community 10 - "Site Layout & SEO"
Cohesion: 0.2
Nodes (10): RootLayout, Robots, Sitemap, site config, Updating store info guide, directions/maps URL builders, weeklyHours/computeOpenStatus, generateLocalBusinessJsonLd (+2 more)

### Community 11 - "Footer & Store Hours"
Cohesion: 0.29
Nodes (5): Footer(), computeOpenStatus(), parseRange(), weeklyHours(), generateLocalBusinessJsonLd()

### Community 12 - "Image Pipeline Scripts"
Cohesion: 0.46
Nodes (6): buildLqip(), buildThumb(), ensurePlaceholder(), main(), patchLqip(), placeholderSvg()

### Community 13 - "Carousel & Scroll"
Cohesion: 0.29
Nodes (3): NewInStoreCarousel(), useConstraints(), ScrollToTop()

### Community 14 - "Directions & Maps"
Cohesion: 0.29
Nodes (2): directionsUrl(), DirectionsButton()

### Community 15 - "Model Studio Portraits"
Cohesion: 0.29
Nodes (7): Model in Sage Overshirt & Jeans (Studio Editorial), Woman in Relaxed-Fit Vintage Jeans & White Tank, Man in Cream Kurta with Gold Dhoti (Festive Studio), Summer Vibes Hero Banner (Printed Camp-Collar Shirt), Man in Handloom Kurta Walking Heritage Courtyard, Young Man in Beige Tee & Relaxed Jeans (Bright Interior), Ravya Fashion Brand

### Community 16 - "Brands Editorial Portraits"
Cohesion: 0.4
Nodes (6): Brands Editorial 5: Sage Loungewear Interior Portrait, Brands Editorial 6: Menswear Office Portrait, Catalog Editorial 1: Womens Linen Studio Portrait, Catalog Editorial 2: Denim Vintage Studio Portrait, Catalog Editorial 3: Athletic Coastal Running Shot, Catalog Editorial 4: Resort Menswear Portrait

### Community 17 - "Street & Studio References"
Cohesion: 0.33
Nodes (6): Young Runner in Athletic Wear, Street Fashion Homepage Screenshot, Google Maps Screenshot of Raurkela, Studio Portrait: Woman in Beige Blazer, Men's Casual Blazer in Concrete Loft, Indian Business Casual Woman in Mint Blazer

### Community 18 - "Lifestyle Editorial Screenshots"
Cohesion: 0.53
Nodes (6): Expressive Party Fashion at Rooftop Night Party, Denim Street Style on Cobblestone Street, Ravya Fashion Redesigned Home UI Screenshot, Colorful Summer Editorial on City Rooftop, Macro Portrait with Colorful Sunglasses, Ravya E-commerce Product Page UI

### Community 19 - "Brand PNG Placeholders"
Cohesion: 0.4
Nodes (6): Ravya Fashion Maskable App Icon (Black Square with Gold Bar and White R), Rocky Shoreline with Wooden Post and Calm Water (placeholder stock photo), Folded Snugglemade Button-Down Shirts (Blue Patterned, White, Burgundy) on Wooden Table, Neutral-Toned Knitwear and Shirts Hanging on a Clothing Rack with Pampas Grass, Green T-Shirts on Wooden Hangers with Grace's Brand Label, Row of Colorful T-Shirts (White, Red, Black, Yellow, Maroon, Tan) on Black Hangers

### Community 20 - "Stock Product Photos"
Cohesion: 0.4
Nodes (6): White crew-neck t-shirt on model, Man in white t-shirt portrait, Cloudscape above clouds at sunset, Red Istanbul tram on a pedestrian street, Black leather biker jacket on bed, Patched ripped denim jeans on model

### Community 21 - "Product & Lifestyle Flat Lays"
Cohesion: 0.33
Nodes (6): Blue Windowpane Three-Piece Suit, Dark Jacket with Wristwatch, Orange Woven Top-Handle Bag, Rust Bomber Jacket on Hanger, MacBook Air Laptop on Wooden Desk, Person in Gray Hoodie Watching Drone

### Community 22 - "Ignite Brand Placeholders"
Cohesion: 0.4
Nodes (6): Lifestyle photo of neutral-toned garments (beige knits, snake-print top, fleece) hanging on a clothing rack with pampas grass, IGNITE brand placeholder SVG: line-art t-shirt icon on light gray background, Close-up photo of sage-green t-shirts on wooden hangers with visible brand labels, IGNITE brand placeholder SVG: line-art t-shirt icon on light gray background, Photo of multicolor t-shirts (white, red, black, yellow, maroon) hanging on black hangers along a rack, JOCKEY brand placeholder SVG: line-art t-shirt icon on light gray background

### Community 23 - "Jockey Brand Placeholders"
Cohesion: 0.4
Nodes (6): JOCKEY SVG T-Shirt Outline Placeholder, White Crew-Neck T-Shirt Product Photo, JOCKEY SVG T-Shirt Outline Placeholder, Bearded Man Wearing White T-Shirt, JOCKEY SVG T-Shirt Outline Placeholder, Aerial Cloudscape Sky Photo

### Community 24 - "Denim & Jacket Photos"
Cohesion: 0.47
Nodes (6): SVG Wireframe Garment Placeholder (Cargo Pants), Street Photograph of Red Tram in Istanbul, SVG Wireframe Garment Placeholder (Denim Jacket), Black Leather Biker Jacket Flat Lay, SVG Wireframe Garment Placeholder (Relaxed Taper), Person Wearing Patched Blue Jeans Street Style

### Community 25 - "Killer & Ramraj Products"
Cohesion: 0.33
Nodes (6): Photograph of light-wash skinny jeans worn with white shirt outdoors, Killer brand placeholder SVG (T-shirt outline, KILLER text), Flat-lay photograph of three folded Killer denim jeans (light blue, indigo, black), Killer brand placeholder SVG (T-shirt outline, KILLER text), Product shot of a blue patterned Ramraj button-up shirt on a hanger against grey backdrop, Ramraj brand placeholder SVG (shirt outline, RAMRAJ text)

### Community 26 - "Ramraj Placeholders & Photography"
Cohesion: 0.4
Nodes (6): Ramraj Daily Tee (SVG wireframe placeholder),  beige graphic T-shirt with blue cat print, Ramraj Dhoti Set (SVG wireframe placeholder), Cream knitted poncho on wooden hanger, Ramraj Formal Trousers (SVG wireframe placeholder), Dark silhouette exhaling smoke

### Community 27 - "Sportiq Placeholders"
Cohesion: 0.47
Nodes (6): RAVYA Windcheater SVG Placeholder Mockup, Rust Bomber Windcheater Jacket on Hanger, SPORTIQ Gym Shorts SVG Placeholder Mockup, MacBook Air Workspace Photo (mismatched gym shorts asset), SPORTIQ Hoodie SVG Placeholder Mockup, Person in Grey Hoodie Watching Drone at Dusk

### Community 28 - "Sportiq & Unibro Products"
Cohesion: 0.4
Nodes (6): Sportiq Track Pants (placeholder SVG, .png ext), Sportiq Track Pants (product photo), Sportiq Training Tee (placeholder SVG, .png ext), Sportiq Training Tee flat-lay (white sweatshirt + jeans + sneakers), Unibro Lounge Set (placeholder SVG, .png ext), Unibro Lounge Set (black t-shirt on hanger, 705 logo)

### Community 29 - "Stitch Mobile Mockups"
Cohesion: 0.53
Nodes (6): Ravya Fashion Mobile About Story, Ravya Fashion Mobile Brands, Ravya Fashion Mobile Catalog, Ravya Fashion Mobile Home, Ravya Fashion Mobile Visit Us, Ravya Fashion Redesigned About Story

### Community 30 - "Redesigned Page Screenshots"
Cohesion: 0.53
Nodes (6): Editorial Product Page: Ravya Denim Co Distressed Jacket, Editorial Photo: Woman in White Khadi Shirt and Trousers, Ravya Fashion Redesigned Brands Page ("Our Brands"), Ravya Fashion Redesigned Catalog Page ("The Catalog"), Ravya Fashion Redesigned Home Page, Ravya Fashion Redesigned Visit Us Page

### Community 31 - "Editorial Triptychs & Map"
Cohesion: 0.4
Nodes (6): Denim Editorial Fashion Triptych, Bold Street Fashion Model Walking at Dusk, Rourkela Region Map Screenshot (Google Maps), Pastel Tracksuit High-Fashion Street Triptych, Macro Close-Up Portrait with Multicolor Patterned Sunglasses, Ravya Fashion 'Summer Vibes' Homepage Hero Screenshot

### Community 32 - "Tracking API"
Cohesion: 0.7
Nodes (4): creds(), dayKey(), incr(), POST()

### Community 33 - "Stock Image Fetch Script"
Cohesion: 0.7
Nodes (4): fetchBuffer(), main(), one(), urlsFor()

### Community 34 - "Store Interior Photos"
Cohesion: 0.5
Nodes (5): Ravya Fashion App Icon 192px, Ravya Fashion App Icon 512px, Bright High-Ceiling Fashion Boutique Interior, Modern High-Street Boutique Storefront at Dusk, VIP Fitting Lounge with Espresso Bar

### Community 35 - "Hero & Placeholder Stubs"
Cohesion: 0.5
Nodes (5): Placeholder Image Stub (_hero), Clothing Store Interior Hero Photo, Placeholder Image Stub (ignite-cargo-shorts), Folded Linen Shirts On Wooden Table, Placeholder Image Stub (ignite-linen-shirt)

### Community 37 - "Staff Dashboard Tracking"
Cohesion: 0.5
Nodes (2): track(), setStatus()

### Community 39 - "Header & Scroll Hook"
Cohesion: 0.5
Nodes (2): useScrolledPast(), Header()

### Community 41 - "Build & Service Worker"
Cohesion: 0.5
Nodes (4): .next build output, service worker offline shell + catalog cache, performance budget guard, safe dev-server restart

### Community 42 - "Editorial Product Pages"
Cohesion: 0.67
Nodes (4): Brands Product Page - Distressed Denim Co Jacket, Brands Product Page - White Shirt and Mundu Model, Athlete Running on Track Editorial Photo, Brands Product Page - The Artisan Edit Abstract Camp Shirt

### Community 43 - "Suits & Jacket Placeholders"
Cohesion: 0.5
Nodes (4): Bandhgala Placeholder SVG, Three-Piece Suit Photograph, Blazer Navy Placeholder SVG, Casual Jacket Photograph

### Community 46 - "Budget Check Script"
Cohesion: 1.0
Nodes (2): gzipSize(), main()

### Community 48 - "Spring Motion Helpers"
Cohesion: 0.67
Nodes (3): useScrolledPast hook, startSpring spring integrator, project/rubberband momentum helpers

### Community 49 - "Palette & Stitch Home"
Cohesion: 0.67
Nodes (3): Warm Ivory/Pine/Ochre Site Palette, Ravya Fashion Redesigned Home (Stitch), Ravya Fashion Mobile Home

### Community 50 - "Denim & Smoke Photos"
Cohesion: 1.0
Nodes (3): Light Blue Skinny Jeans Worn Outdoors, Folded Levi's Denim Stack (Light, Dark, Black), Backlit Smoke and Vapor Silhouette Portrait

### Community 51 - "Ramraj & KIIKI Products"
Cohesion: 1.0
Nodes (3): Blue Heart-Print Cotton Shirt on Hanger (Ramraj), Cream KIIKI Japanese Cat Graphic T-Shirt, Cream Crochet Knit Fringe Poncho on Wooden Hanger

### Community 52 - "Unibro Placeholders"
Cohesion: 1.0
Nodes (3): UNIBRO product-image placeholder SVG (vest line-art template), UNIBRO product-image placeholder SVG (vest line-art template), UNIBRO product-image placeholder SVG (vest line-art template)

### Community 53 - "Stock Nature Photos"
Cohesion: 1.0
Nodes (3): Bamboo forest viewed upward with tall tree trunk, Backlit woman in skirt standing in tall grass at sunset, Low-angle view of modern high-rise building corner facade

### Community 54 - "Boutique Interior Photos"
Cohesion: 1.0
Nodes (3): Bright High-Ceiling Boutique Interior, Modern High-Street Boutique Storefront, VIP Fitting Lounge with Espresso Bar

### Community 78 - "Stitch Visit Pages"
Cohesion: 1.0
Nodes (2): Ravya Fashion Mobile Visit Us, Ravya Fashion Redesigned Visit Us

### Community 79 - "Street Editorial Photos"
Cohesion: 1.0
Nodes (2): About Page Editorial Look Photo, Two Creative Friends on Street Editorial Photo

### Community 80 - "Unibro & T-Shirt Photos"
Cohesion: 1.0
Nodes (2): White Sweatshirt, Black 705 Five T-Shirt on Hanger

### Community 81 - "Nature Stock Photos"
Cohesion: 1.0
Nodes (2): Bamboo Forest, Woman in Sunset Field

### Community 82 - "Tote Product"
Cohesion: 1.0
Nodes (2): Tote Placeholder SVG, Woven Tote Handbag Photograph

### Community 114 - "Home Page"
Cohesion: 1.0
Nodes (1): HomePage

### Community 115 - "OG Image"
Cohesion: 1.0
Nodes (1): OG Image

### Community 116 - "Next Config"
Cohesion: 1.0
Nodes (1): Next Config

### Community 117 - "Staff Page"
Cohesion: 1.0
Nodes (1): StaffPage

### Community 118 - "Loading State"
Cohesion: 1.0
Nodes (1): VisitLoading

### Community 119 - "Brand Strip"
Cohesion: 1.0
Nodes (1): BrandStrip

### Community 120 - "Ticker"
Cohesion: 1.0
Nodes (1): Ticker

### Community 121 - "Service Worker"
Cohesion: 1.0
Nodes (1): ServiceWorker

### Community 122 - "Pill"
Cohesion: 1.0
Nodes (1): Pill

### Community 123 - "Section Heading"
Cohesion: 1.0
Nodes (1): SectionHeading

### Community 124 - "normalizePhone"
Cohesion: 1.0
Nodes (1): normalizePhone

### Community 125 - "Stitch About Page"
Cohesion: 1.0
Nodes (1): Ravya Fashion Redesigned About Story

### Community 126 - "Rourkela Map"
Cohesion: 1.0
Nodes (1): Map of Rourkela, Odisha

### Community 127 - "Steaming Pot Photo"
Cohesion: 1.0
Nodes (1): Steaming Pot

### Community 128 - "Building Facade Photo"
Cohesion: 1.0
Nodes (1): Building Facade

### Community 129 - "Rocky Shoreline Photo"
Cohesion: 1.0
Nodes (1): Rocky Shoreline With Wooden Post

## Ambiguous Edges - Review These
- `ShopSort` → `products`  [AMBIGUOUS]
   · relation: semantically_similar_to
- `NewBadge` → `products`  [AMBIGUOUS]
   · relation: semantically_similar_to
- `Reveal` → `Asia/Kolkata IST handling`  [AMBIGUOUS]
   · relation: semantically_similar_to
- `useConstraints` → `Asia/Kolkata IST handling`  [AMBIGUOUS]
   · relation: semantically_similar_to
- `useFlip` → `Asia/Kolkata IST handling`  [AMBIGUOUS]
   · relation: semantically_similar_to
- `Master Build Document` → `sampleCatalog honesty gate`  [AMBIGUOUS]
  Ravya_Fashion_Master_Build_Document.md · relation: implicit-in
- `Brands Product Page - Distressed Denim Co Jacket` → `Athlete Running on Track Editorial Photo`  [AMBIGUOUS]
  public/editorial/brands_brands-editorial-3-3.jpg · relation: conceptually_related_to
- `Men's Casual Blazer in Concrete Loft` → `Young Runner in Athletic Wear`  [AMBIGUOUS]
  public/editorial/home_athletic-young-runner-wearing-10.jpg · relation: conceptually_related_to
- `Street Fashion Homepage Screenshot` → `Indian Business Casual Woman in Mint Blazer`  [AMBIGUOUS]
  public/editorial/home_bold-street-fashion-model-3.jpg · relation: conceptually_related_to
- `Street Fashion Homepage Screenshot` → `Google Maps Screenshot of Raurkela`  [AMBIGUOUS]
  public/editorial/home_boutique-storefront-exterior-of-16.jpg · relation: shares_data_with
- `Expressive Party Fashion at Rooftop Night Party` → `Ravya E-commerce Product Page UI`  [AMBIGUOUS]
  public/editorial/home_model-in-sportiq-seamless-14.jpg · relation: shares_data_with
- `Rocky Shoreline with Wooden Post and Calm Water (placeholder stock photo)` → `Folded Snugglemade Button-Down Shirts (Blue Patterned, White, Burgundy) on Wooden Table`  [AMBIGUOUS]
  public/products/ignite-cargo-shorts.webp · relation: conceptually_related_to
- `White crew-neck t-shirt on model` → `Cloudscape above clouds at sunset`  [AMBIGUOUS]
  public/products/jockey-crew-tee.webp · relation: conceptually_related_to
- `Cloudscape above clouds at sunset` → `Red Istanbul tram on a pedestrian street`  [AMBIGUOUS]
  public/products/jockey-track-pants.webp · relation: conceptually_related_to
- `Red Istanbul tram on a pedestrian street` → `Patched ripped denim jeans on model`  [AMBIGUOUS]
  public/products/killer-cargo-pants.webp · relation: conceptually_related_to
- `Light Blue Skinny Jeans Worn Outdoors` → `Backlit Smoke and Vapor Silhouette Portrait`  [AMBIGUOUS]
  public/products/ramraj-formal-trousers.webp · relation: conceptually_related_to
- `Folded Levi's Denim Stack (Light, Dark, Black)` → `Backlit Smoke and Vapor Silhouette Portrait`  [AMBIGUOUS]
  public/products/ramraj-formal-trousers.webp · relation: conceptually_related_to
- `JOCKEY SVG T-Shirt Outline Placeholder` → `Aerial Cloudscape Sky Photo`  [AMBIGUOUS]
  raw/jockey-track-pants.gen.png · relation: shares_data_with
- `Photograph of light-wash skinny jeans worn with white shirt outdoors` → `Product shot of a blue patterned Ramraj button-up shirt on a hanger against grey backdrop`  [AMBIGUOUS]
  raw/ramraj-cotton-shirt-white.jpg · relation: conceptually_related_to
- `SPORTIQ Gym Shorts SVG Placeholder Mockup` → `MacBook Air Workspace Photo (mismatched gym shorts asset)`  [AMBIGUOUS]
  raw/sportiq-gym-shorts.gen.png · relation: shares_data_with
- `Editorial Product Page: Ravya Denim Co Distressed Jacket` → `Editorial Photo: Woman in White Khadi Shirt and Trousers`  [AMBIGUOUS]
  video/my-video/assets/brands_brands-editorial-1-1.jpg · relation: semantically_similar_to
- `Rourkela Region Map Screenshot (Google Maps)` → `Ravya Fashion 'Summer Vibes' Homepage Hero Screenshot`  [AMBIGUOUS]
  video/my-video/assets/home_boutique-storefront-exterior-of-16.jpg · relation: conceptually_related_to

## Knowledge Gaps
- **86 isolated node(s):** `HomePage`, `ShopPage`, `AboutPage`, `Sitemap`, `Robots` (+81 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Directions & Maps`** (7 nodes): `DirectionsButton.tsx`, `directionsUrl()`, `geoFallback()`, `mapEmbedUrl()`, `staticMapThumbUrl()`, `directions.ts`, `DirectionsButton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Staff Dashboard Tracking`** (4 nodes): `StaffDashboard.tsx`, `track()`, `track.ts`, `setStatus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Header & Scroll Hook`** (4 nodes): `Header.tsx`, `useScrollY.ts`, `useScrolledPast()`, `Header()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Budget Check Script`** (3 nodes): `gzipSize()`, `main()`, `check-budget.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Stitch Visit Pages`** (2 nodes): `Ravya Fashion Mobile Visit Us`, `Ravya Fashion Redesigned Visit Us`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Street Editorial Photos`** (2 nodes): `About Page Editorial Look Photo`, `Two Creative Friends on Street Editorial Photo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Unibro & T-Shirt Photos`** (2 nodes): `White Sweatshirt`, `Black 705 Five T-Shirt on Hanger`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Nature Stock Photos`** (2 nodes): `Bamboo Forest`, `Woman in Sunset Field`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tote Product`** (2 nodes): `Tote Placeholder SVG`, `Woven Tote Handbag Photograph`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Home Page`** (1 nodes): `HomePage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `OG Image`** (1 nodes): `OG Image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Config`** (1 nodes): `Next Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Staff Page`** (1 nodes): `StaffPage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Loading State`** (1 nodes): `VisitLoading`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Brand Strip`** (1 nodes): `BrandStrip`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Ticker`** (1 nodes): `Ticker`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Service Worker`** (1 nodes): `ServiceWorker`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pill`** (1 nodes): `Pill`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Section Heading`** (1 nodes): `SectionHeading`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `normalizePhone`** (1 nodes): `normalizePhone`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Stitch About Page`** (1 nodes): `Ravya Fashion Redesigned About Story`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Rourkela Map`** (1 nodes): `Map of Rourkela, Odisha`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Steaming Pot Photo`** (1 nodes): `Steaming Pot`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Building Facade Photo`** (1 nodes): `Building Facade`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Rocky Shoreline Photo`** (1 nodes): `Rocky Shoreline With Wooden Post`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `ShopSort` and `products`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `NewBadge` and `products`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Reveal` and `Asia/Kolkata IST handling`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `useConstraints` and `Asia/Kolkata IST handling`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `useFlip` and `Asia/Kolkata IST handling`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Master Build Document` and `sampleCatalog honesty gate`?**
  _Edge tagged AMBIGUOUS (relation: implicit-in) - confidence is low._
- **What is the exact relationship between `Brands Product Page - Distressed Denim Co Jacket` and `Athlete Running on Track Editorial Photo`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._