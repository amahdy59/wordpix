/**
 * WordPix Curriculum Sequence — single source of truth for learning order.
 *
 * CURRICULUM_SEQUENCE lists all 200 vocabulary units in pedagogical A1→C1
 * order. It is the ground truth for:
 *   - the Learn tab (sequential, progress-aware learning path)
 *   - the Library tab (reference/search uses the same ordering)
 *   - the `LEARNING_PATH_UNIT_IDS` derived export in lessons.ts
 *
 * Ordering principles (Nation, 2001; Council of Europe CEFR 2020):
 *   1. Frequency-first — high-frequency words before rare/specialised ones
 *   2. Concrete before abstract — tangible objects before concepts
 *   3. Immediate environment outward — home → community → city → world → domain
 *   4. Spaced domain introduction — related topics spread across levels
 *   5. CEFR descriptors as the level anchor
 *
 * Note: hadith-niyyah is intentionally excluded — it belongs to the
 * Islamic Studies special curriculum (COURSE_MODULES isSpecialSection),
 * not the core vocabulary path.
 */

// ─── Stage 1: Pre-A1 Starter (22 units) ──────────────────────────────────────
// Goal: anchor concepts — numbers, home rooms, core emotions, basic actions.
// Learner can name their immediate world and perform the simplest transactions.

// ─── Stage 2: A1 Foundations (36 units) ──────────────────────────────────────
// Goal: neighbourhood, food, basic services, core descriptors.
// Learner can navigate a local environment and discuss everyday topics simply.

// ─── Stage 3: A2 Everyday Life (43 units) ────────────────────────────────────
// Goal: people, health, transport, personal life, arts & leisure.
// Learner can describe people and places and handle common social situations.

// ─── Stage 4: B1 Wider World (40 units) ──────────────────────────────────────
// Goal: nature, environment, culture, travel, media, civic life, science.
// Learner can deal with most situations likely to arise while travelling.

// ─── Stage 5: B2 Fluency & Work (38 units) ───────────────────────────────────
// Goal: professional, financial, technology, institutional domains.
// Learner can interact with a degree of fluency and spontaneity in professional contexts.

// ─── Stage 6: C1 Mastery (21 units) ──────────────────────────────────────────
// Goal: high-register, domain-specific, and cultural vocabulary.
// Learner can express themselves fluently and spontaneously in specialised fields.

export const CURRICULUM_SEQUENCE = [
  // ─── Stage 1: Pre-A1 Starter ─────────────────────────────────────────────
  "numbers-counting",
  "colors",
  "shapes-geometry",
  "basic-emotions",
  "family",
  "bedroom",
  "bathroom",
  "kitchen",
  "living-room",
  "fruits",
  "vegetables",
  "telling-time",
  "days-months",
  "daily-action-verbs",
  "prepositions-of-place",
  "daily-routines",
  "classroom",
  "toys-games",
  "market",
  "giving-directions",
  "movement-verbs",
  "hand-actions",

  // ─── Stage 2: A1 Foundations ─────────────────────────────────────────────
  "farm",
  "garden",
  "park",
  "playground",
  "pet-shop",
  "vet-clinic",
  "bakery",
  "coffee-shop",
  "ice-cream-shop",
  "pizza-shop",
  "restaurant",
  "supermarket",
  "meat-seafood",
  "grains-dairy",
  "beverages",
  "kitchen-utensils",
  "cooking-methods",
  "seasonings-condiments",
  "seasons-weather",
  "weather-station",
  "community-center",
  "police-station",
  "first-aid-room",
  "gas-station",
  "spatial-relations",
  "maps-navigation",
  "communication-verbs",
  "shades-tones",
  "materials",
  "patterns-textures",
  "measurements-units",
  "money-currency",
  "sports-equipment",
  "sports-center",
  "beach",
  "amusement-park",

  // ─── Stage 3: A2 Everyday Life ───────────────────────────────────────────
  "human-body-head-and-face",
  "human-body-upper-body",
  "human-body-lower-body",
  "human-body-hands-and-feet",
  "physical-appearance",
  "skin-hair",
  "ages-life-stages",
  "everyday-clothing",
  "accessories-jewelry",
  "footwear",
  "extended-family",
  "relationships-roles",
  "life-events",
  "birthday-party",
  "wedding",
  "graduation",
  "facial-expressions",
  "complex-feelings",
  "social-situations",
  "personality-character",
  "indoor-hobbies",
  "creative-hobbies",
  "shopping-mall",
  "hospital",
  "pharmacy",
  "dentist",
  "dental-clinic",
  "eye-doctor",
  "hair-salon",
  "barbershop",
  "spa",
  "gym",
  "bicycle-shop",
  "bus-station",
  "subway",
  "car-wash",
  "hotel",
  "laundromat",
  "library",
  "art-studio",
  "dance-studio",
  "photography-studio",
  "music-room",

  // ─── Stage 4: B1 Wider World ─────────────────────────────────────────────
  "five-senses",
  "internal-organs",
  "skeleton",
  "body-systems",
  "camping-site",
  "forest",
  "mountain",
  "river",
  "savanna",
  "coral-reef",
  "desert",
  "jungle",
  "volcano",
  "bird-sanctuary",
  "butterfly-garden",
  "insect-world",
  "reptile-house",
  "zoo",
  "aquarium",
  "train-station",
  "airport",
  "harbor",
  "theater",
  "orchestra",
  "cinema",
  "museum",
  "festival",
  "costume-shop",
  "pottery-studio",
  "tailor-shop",
  "computer-lab",
  "newspaper-office",
  "tv-studio",
  "radio-station",
  "post-office",
  "mechanic",
  "construction-site",
  "fire-station",
  "observatory",
  "science-lab",

  // ─── Stage 5: B2 Fluency & Work ──────────────────────────────────────────
  "office",
  "meeting-room",
  "office-supplies",
  "business-communication",
  "coworking-space",
  "startup-culture",
  "freelancing-remote-work",
  "formal-business-wear",
  "bank",
  "financial-services",
  "currency-payment",
  "stock-exchange",
  "university-campus",
  "academic-life",
  "research-study",
  "student-life",
  "property-types",
  "real-estate-agency",
  "home-features",
  "moving-settling-in",
  "car-types",
  "car-parts-mechanics",
  "auto-dealership",
  "driving-road-rules",
  "smart-home",
  "tech-gadgets",
  "data-center",
  "drone-workshop",
  "electric-vehicle-station",
  "3d-printer-lab",
  "robotics-lab",
  "solar-farm",
  "embassy",
  "courtroom",
  "laboratory",
  "submarine",
  "arctic",
  "space-station",

  // ─── Stage 6: C1 Mastery ─────────────────────────────────────────────────
  "law-firm",
  "courtroom-trial",
  "legal-documents",
  "rights-regulations",
  "architect-s-studio",
  "building-construction",
  "architecture-styles",
  "interior-design",
  "fashion-atelier",
  "fabrics-textiles",
  "fashion-design",
  "runway-show",
  "vineyard",
  "winemaking",
  "wine-tasting",
  "wine-cellar",
  "cocktail-bar",
  "spirits-liqueurs",
  "classic-cocktails",
  "bar-culture",
  "space-center",
] as const;

export type CurriculumUnitId = (typeof CURRICULUM_SEQUENCE)[number];

/**
 * CEFR stage definitions for the Learning Path UI.
 *
 * Each stage groups a contiguous slice of CURRICULUM_SEQUENCE by its
 * start index (inclusive) and end index (exclusive), matching standard
 * array slice semantics so `CURRICULUM_SEQUENCE.slice(stage.start, stage.end)`
 * always returns that stage's units.
 */
export interface CefrStage {
  id: string;
  label: string;
  /** Canonical CEFR level designation. */
  cefr: string;
  /** Inclusive start index into CURRICULUM_SEQUENCE. */
  start: number;
  /** Exclusive end index into CURRICULUM_SEQUENCE. */
  end: number;
}

export const CEFR_STAGES: CefrStage[] = [
  { id: "pre-a1", label: "Pre-A1 Starter", cefr: "Pre-A1", start: 0, end: 22 },
  { id: "a1", label: "A1 Foundations", cefr: "A1", start: 22, end: 58 },
  { id: "a2", label: "A2 Everyday Life", cefr: "A2", start: 58, end: 101 },
  { id: "b1", label: "B1 Wider World", cefr: "B1", start: 101, end: 141 },
  { id: "b2", label: "B2 Fluency & Work", cefr: "B2", start: 141, end: 179 },
  { id: "c1", label: "C1 Mastery", cefr: "C1", start: 179, end: 200 },
];

/**
 * @deprecated Use CURRICULUM_SEQUENCE for all new ordering work.
 *
 * FOUNDATION_SEQUENCE is the original 18-unit prerequisite-aware spine.
 * Every unit in this list has an authored communicative outcome and final
 * task in FOUNDATION_UNIT_DESIGNS (curriculumModel.ts). That contract must
 * be maintained: do not add units here without also adding them to
 * FOUNDATION_UNIT_DESIGNS.
 *
 * This is intentionally NOT derived from CURRICULUM_SEQUENCE via slice()
 * because the new pedagogical ordering places different units in positions
 * 1-18. The two constants are independent: CURRICULUM_SEQUENCE controls
 * the learning path order; FOUNDATION_SEQUENCE identifies authored-design
 * units for the curriculum engine and quality tests.
 */
export const FOUNDATION_SEQUENCE = [
  "numbers-counting",
  "colors",
  "prepositions-of-place",
  "daily-action-verbs",
  "days-months",
  "telling-time",
  "basic-emotions",
  "family",
  "bedroom",
  "bathroom",
  "kitchen",
  "living-room",
  "classroom",
  "fruits",
  "vegetables",
  "market",
  "daily-routines",
  "giving-directions",
] as const;
