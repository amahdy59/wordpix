# Image Replacement Audit

Audit date: 2026-09-20

The following files are confirmed replacement candidates. The audit covered 11,858 distinct curriculum image references, 201 unit files, and 216 scene-image files.

## Broken word image reference

- `public/word-images/music-room/conductor.avif` — expected replacement filename; the curriculum currently references `conductor` without an extension and no image resolves at that path.

## Irrelevant duplicated word images

These seven files contain the exact same pixels as `public/word-images/3d-printer-lab/3d-software.avif`, so their visuals are unrelated to their vocabulary terms.

- `public/word-images/islamic-studies/gain.avif`
- `public/word-images/islamic-studies/intend.avif`
- `public/word-images/islamic-studies/judged.avif`
- `public/word-images/islamic-studies/marry.avif`
- `public/word-images/islamic-studies/migration.avif`
- `public/word-images/islamic-studies/motive.avif`
- `public/word-images/islamic-studies/worldly.avif`

## Blank scene hero images

These 135 AVIF files are blank placeholder canvases, not usable or photorealistic hero images.

### Blank placeholder group A (100 files)

- `academic-life-hero.avif`
- `accessories-jewelry-hero.avif`
- `ages-life-stages-hero.avif`
- `architect-s-studio-hero.avif`
- `architecture-styles-hero.avif`
- `auto-dealership-hero.avif`
- `bank-hero.avif`
- `bar-culture-hero.avif`
- `basic-emotions-hero.avif`
- `beverages-hero.avif`
- `body-systems-hero.avif`
- `building-construction-hero.avif`
- `business-communication-hero.avif`
- `car-parts-mechanics-hero.avif`
- `car-types-hero.avif`
- `classic-cocktails-hero.avif`
- `cocktail-bar-hero.avif`
- `colors-hero.avif`
- `communication-verbs-hero.avif`
- `complex-feelings-hero.avif`
- `cooking-methods-hero.avif`
- `courtroom-trial-hero.avif`
- `coworking-space-hero.avif`
- `creative-hobbies-hero.avif`
- `currency-payment-hero.avif`
- `daily-action-verbs-hero.avif`
- `daily-routines-hero.avif`
- `days-months-hero.avif`
- `driving-road-rules-hero.avif`
- `everyday-clothing-hero.avif`
- `extended-family-hero.avif`
- `fabrics-textiles-hero.avif`
- `facial-expressions-hero.avif`
- `family-hero.avif`
- `fashion-atelier-hero.avif`
- `fashion-design-hero.avif`
- `financial-services-hero.avif`
- `five-senses-hero.avif`
- `footwear-hero.avif`
- `formal-business-wear-hero.avif`
- `freelancing-remote-work-hero.avif`
- `fruits-hero.avif`
- `giving-directions-hero.avif`
- `grains-dairy-hero.avif`
- `hand-actions-hero.avif`
- `home-features-hero.avif`
- `human-body-hands-and-feet-hero.avif`
- `human-body-head-and-face-hero.avif`
- `human-body-lower-body-hero.avif`
- `human-body-upper-body-hero.avif`
- `indoor-hobbies-hero.avif`
- `interior-design-hero.avif`
- `internal-organs-hero.avif`
- `kitchen-utensils-hero.avif`
- `law-firm-hero.avif`
- `legal-documents-hero.avif`
- `life-events-hero.avif`
- `maps-navigation-hero.avif`
- `materials-hero.avif`
- `measurements-units-hero.avif`
- `meat-seafood-hero.avif`
- `meeting-room-hero.avif`
- `money-currency-hero.avif`
- `movement-verbs-hero.avif`
- `moving-settling-in-hero.avif`
- `numbers-counting-hero.avif`
- `office-hero.avif`
- `office-supplies-hero.avif`
- `patterns-textures-hero.avif`
- `personality-character-hero.avif`
- `physical-appearance-hero.avif`
- `prepositions-of-place-hero.avif`
- `property-types-hero.avif`
- `real-estate-agency-hero.avif`
- `relationships-roles-hero.avif`
- `research-study-hero.avif`
- `rights-regulations-hero.avif`
- `runway-show-hero.avif`
- `seasonings-condiments-hero.avif`
- `seasons-weather-hero.avif`
- `shades-tones-hero.avif`
- `shapes-geometry-hero.avif`
- `skeleton-hero.avif`
- `skin-hair-hero.avif`
- `social-situations-hero.avif`
- `spatial-relations-hero.avif`
- `spirits-liqueurs-hero.avif`
- `sports-equipment-hero.avif`
- `startup-culture-hero.avif`
- `stock-exchange-hero.avif`
- `student-life-hero.avif`
- `tech-gadgets-hero.avif`
- `telling-time-hero.avif`
- `toys-games-hero.avif`
- `university-campus-hero.avif`
- `vegetables-hero.avif`
- `vineyard-hero.avif`
- `wine-cellar-hero.avif`
- `wine-tasting-hero.avif`
- `winemaking-hero.avif`

### Blank placeholder group B (35 files)

- `barbershop-hero.avif`
- `bicycle-shop-hero.avif`
- `bird-sanctuary-hero.avif`
- `birthday-party-hero.avif`
- `bus-station-hero.avif`
- `butterfly-garden-hero.avif`
- `car-wash-hero.avif`
- `coffee-shop-hero.avif`
- `community-center-hero.avif`
- `data-center-hero.avif`
- `dental-clinic-hero.avif`
- `drone-workshop-hero.avif`
- `electric-vehicle-station-hero.avif`
- `eye-doctor-hero.avif`
- `forest-hero.avif`
- `gas-station-hero.avif`
- `graduation-hero.avif`
- `hair-salon-hero.avif`
- `hotel-hero.avif`
- `ice-cream-shop-hero.avif`
- `insect-world-hero.avif`
- `laundromat-hero.avif`
- `mechanic-hero.avif`
- `mountain-hero.avif`
- `pizza-shop-hero.avif`
- `police-station-hero.avif`
- `reptile-house-hero.avif`
- `river-hero.avif`
- `savanna-hero.avif`
- `shopping-mall-hero.avif`
- `smart-home-hero.avif`
- `spa-hero.avif`
- `subway-hero.avif`
- `vet-clinic-hero.avif`
- `wedding-hero.avif`

## Text-only placeholders

- `public/scene-images/revision-5-hero.webp` — flat background with the text “Revision 5 Hero.”
- `public/scene-images/bank-hero.webp` — flat red background with the text “Bank Hero.” The canonical `bank-hero.avif` is also blank and already appears above.

## Replacement specifications

- Word images: square, single unambiguous subject/action, photorealistic, minimal background clutter, no embedded text, and clear at card size.
- Scene heroes: 1920 × 842 preferred, photorealistic wide composition, recognizable topic, safe crop area, no embedded text, logos, watermarks, or UI chrome.
- Preserve the exact filenames above. Scene AVIF files belong in `public/scene-images/`; word AVIF files belong in their listed `public/word-images/` folders.
