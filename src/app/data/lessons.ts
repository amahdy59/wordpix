// Centralized Lesson Vocabulary Data Layer for WordPix
// Synchronized from Figma Design (Node 44:2 — The Bedroom)

export interface VocabItem {
  id: string;
  label: string;
  phonetic: string;
  img: string;
  topic: string;
  /**
   * What the picture shows, described WITHOUT naming the word.
   *
   * This is what makes image-selection exercises answerable without sight. The
   * assessment alt text previously read "Picture option A", which stops the
   * answer leaking but leaves a screen reader user with nothing to reason
   * about — "which picture shows a lamp?" was unanswerable by design.
   *
   * Required, not optional: a missing description silently degrades an
   * exercise back to unanswerable, so the compiler should catch it.
   *
   * Rule enforced by lessons_content.test.ts: the description must never
   * contain its own label or a stem of it.
   */
  description: string;
  hotspot?: { x: string; y: string };
}

export interface TopicCategory {
  id: string;
  name: string;
  itemsCount: number;
}

export interface WordGroup {
  id: string;
  name: string;
  topicId: string;
  wordIds: string[];
  description: string;
}

const LOCAL_WORD_IMAGES = "./word-images";

export const BEDROOM_TOPICS: TopicCategory[] = [
  { id: "furniture", name: "Furniture", itemsCount: 10 },
  { id: "bedding", name: "Bedding & Linen", itemsCount: 12 },
  { id: "features", name: "Room Features", itemsCount: 10 },
  { id: "objects", name: "Bedroom Objects", itemsCount: 10 },
  { id: "personal", name: "Personal Items", itemsCount: 8 },
  { id: "electronics", name: "Electronics", itemsCount: 8 },
];

export const BEDROOM_GROUPS: WordGroup[] = [
  {
    id: "essential-furniture",
    name: "Essential Furniture",
    topicId: "furniture",
    wordIds: ["bed", "nightstand", "dresser", "wardrobe", "desk"],
    description: "Core furniture pieces found in every bedroom.",
  },
  {
    id: "bedding-comfort",
    name: "Bedding & Comfort",
    topicId: "bedding",
    wordIds: ["pillow", "blanket", "sheet", "mattress", "duvet"],
    description: "Linens and bedding items for a cozy sleep.",
  },
  {
    id: "lighting-objects",
    name: "Lighting & Objects",
    topicId: "objects",
    wordIds: ["lamp", "chair", "mirror", "bookshelf", "stool"],
    description: "Essential bedroom accessories and furniture.",
  },
  {
    id: "bedding-linens-2",
    name: "Pillows & Covers",
    topicId: "bedding",
    wordIds: ["pillowcase", "comforter", "cushion", "quilt", "bedspread"],
    description: "Bed covers, cushions, and pillowcases.",
  },
];

export const BEDROOM_VOCABULARY: VocabItem[] = [
  // ── Furniture ─────────────────────────────────────────────────────────────
  {
    id: "bed",
    label: "Bed",
    phonetic: "bed",
    topic: "furniture",
    description: "A large rectangular platform with a soft top, where a person lies down to sleep.",
    img: `${LOCAL_WORD_IMAGES}/bed.jpg`,
    hotspot: { x: "28%", y: "58%" },
  },
  {
    id: "nightstand",
    label: "Nightstand",
    phonetic: "night-stand",
    topic: "furniture",
    description: "A small low table beside the place you sleep, holding a lamp or a book.",
    img: `${LOCAL_WORD_IMAGES}/nightstand.jpg`,
  },
  {
    id: "dresser",
    label: "Dresser",
    phonetic: "dres-ser",
    topic: "furniture",
    description: "A wide, low piece of furniture with several sliding compartments for folded clothes.",
    img: `${LOCAL_WORD_IMAGES}/dresser.jpg`,
  },
  {
    id: "wardrobe",
    label: "Wardrobe",
    phonetic: "ward-robe",
    topic: "furniture",
    description: "A tall cupboard with doors, where clothes hang from a rail inside.",
    img: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=85",
    hotspot: { x: "72%", y: "36%" },
  },
  {
    id: "desk",
    label: "Desk",
    phonetic: "desk",
    topic: "furniture",
    description: "A flat work surface on legs, where you sit to write or use a computer.",
    img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "chair",
    label: "Chair",
    phonetic: "chair",
    topic: "furniture",
    description: "A single seat with a back and four legs, for one person.",
    img: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "bookshelf",
    label: "Bookshelf",
    phonetic: "book-shelf",
    topic: "furniture",
    description: "An upright frame of horizontal boards for storing reading material.",
    img: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "mirror",
    label: "Mirror",
    phonetic: "mir-ror",
    topic: "furniture",
    description: "A flat glass panel that shows your own reflection.",
    img: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "stool",
    label: "Stool",
    phonetic: "stool",
    topic: "furniture",
    description: "A small backless seat raised on three or four legs.",
    img: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "chest-of-drawers",
    label: "Chest of Drawers",
    phonetic: "chest-of-drawers",
    topic: "furniture",
    description: "A tall, narrow tower of stacked sliding compartments for storing clothes.",
    img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=85",
  },

  // ── Bedding & Linen ────────────────────────────────────────────────────────
  {
    id: "pillow",
    label: "Pillow",
    phonetic: "pil-low",
    topic: "bedding",
    description: "A soft rectangular pad that supports your head while you sleep.",
    img: "https://images.unsplash.com/photo-1623944436679-5412c658a358?auto=format&fit=crop&w=800&q=85",
    hotspot: { x: "44%", y: "66%" },
  },
  {
    id: "blanket",
    label: "Blanket",
    phonetic: "blan-ket",
    topic: "bedding",
    description: "A thick woven cover, often wool, laid over you for warmth.",
    img: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "sheet",
    label: "Sheet",
    phonetic: "sheet",
    topic: "bedding",
    description: "A large, thin, flat piece of fabric that lies directly against your skin.",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "mattress",
    label: "Mattress",
    phonetic: "mat-tress",
    topic: "bedding",
    description: "The thick padded slab you lie directly on top of.",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "duvet",
    label: "Duvet",
    phonetic: "doo-vay",
    topic: "bedding",
    description: "A soft filled bag stuffed with feathers, used as a single thick top cover.",
    img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "pillowcase",
    label: "Pillowcase",
    phonetic: "pil-low-case",
    topic: "bedding",
    description: "A fabric sleeve that slips over the soft pad under your head.",
    img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "comforter",
    label: "Comforter",
    phonetic: "com-fort-er",
    topic: "bedding",
    description: "A thick fluffy top cover, stitched into sections, needing no separate cover.",
    img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "cushion",
    label: "Cushion",
    phonetic: "cush-ion",
    topic: "bedding",
    description: "A small soft square pad for sitting on or leaning against.",
    img: "https://images.unsplash.com/photo-1579656592043-a2e727a0062a?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "bed-frame",
    label: "Bed Frame",
    phonetic: "bed-frame",
    topic: "bedding",
    description: "The wooden or metal structure that holds a mattress up off the floor.",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "headboard",
    label: "Headboard",
    phonetic: "head-board",
    topic: "bedding",
    description: "The upright panel at the top end of a sleeping platform, behind your head.",
    img: "https://images.unsplash.com/photo-1613940512699-fc9150817bb2?auto=format&fit=crop&w=800&q=85",
  },

  // ── Room Features ──────────────────────────────────────────────────────────
  {
    id: "lamp",
    label: "Lamp",
    phonetic: "lamp",
    topic: "features",
    description: "A small light on a base that stands on a table.",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85",
    hotspot: { x: "72%", y: "62%" },
  },
  {
    id: "curtain",
    label: "Curtain",
    phonetic: "cur-tain",
    topic: "features",
    description: "A long piece of hanging fabric drawn across a window at night.",
    img: "https://images.unsplash.com/photo-1528822855841-e8bf3134cdc9?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "window",
    label: "Window",
    phonetic: "win-dow",
    topic: "features",
    description: "A glass opening in the wall that lets daylight into the room.",
    img: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "door",
    label: "Door",
    phonetic: "door",
    topic: "features",
    description: "A hinged panel you open to enter or leave a room.",
    img: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "rug",
    label: "Rug",
    phonetic: "rug",
    topic: "features",
    description: "A small soft floor covering that lies loose on top of the floor.",
    img: "https://images.unsplash.com/photo-1652634213812-f0deeb1de78e?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "carpet",
    label: "Carpet",
    phonetic: "car-pet",
    topic: "features",
    description: "A soft floor covering fixed down permanently, reaching from wall to wall.",
    img: "https://images.unsplash.com/photo-1562584082-823908f972b2?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "ceiling-light",
    label: "Ceiling Light",
    phonetic: "cei-ling-light",
    topic: "features",
    description: "A fixture mounted overhead that brightens the whole room from above.",
    img: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "light-switch",
    label: "Light Switch",
    phonetic: "light-switch",
    topic: "features",
    description: "A small plate on the wall you press to make the room bright or dark.",
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "blinds",
    label: "Blinds",
    phonetic: "blinds",
    topic: "features",
    description: "Horizontal slats across a window that tilt to control the daylight.",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "outlet",
    label: "Outlet",
    phonetic: "out-let",
    topic: "features",
    description: "A small socket in the wall where you plug in electrical devices.",
    img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=85",
  },

  // ── Bedroom Objects ────────────────────────────────────────────────────────
  {
    id: "alarm-clock",
    label: "Alarm Clock",
    phonetic: "a-larm-clock",
    topic: "objects",
    description: "A small bedside device that shows the time and wakes you with a sound.",
    img: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "picture-frame",
    label: "Picture Frame",
    phonetic: "pic-ture-frame",
    topic: "objects",
    description: "A decorative border that holds a photograph upright on a surface.",
    img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "clock",
    label: "Clock",
    phonetic: "clock",
    topic: "objects",
    description: "A round face with moving hands that shows the time.",
    img: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "plant",
    label: "Plant",
    phonetic: "plant",
    topic: "objects",
    description: "A living green thing growing in a pot of soil.",
    img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "vase",
    label: "Vase",
    phonetic: "vase",
    topic: "objects",
    description: "A tall narrow container that holds cut flowers in water.",
    img: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "candle",
    label: "Candle",
    phonetic: "can-dle",
    topic: "objects",
    description: "A wax cylinder with a wick that gives light when it burns.",
    img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "calendar",
    label: "Calendar",
    phonetic: "cal-en-dar",
    topic: "objects",
    description: "A grid of numbered days used to keep track of dates.",
    img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "tissue-box",
    label: "Tissue Box",
    phonetic: "tis-sue-box",
    topic: "objects",
    description: "A small carton that dispenses soft disposable paper, one sheet at a time.",
    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "laundry-basket",
    label: "Laundry Basket",
    phonetic: "laun-dry-bas-ket",
    topic: "objects",
    description: "An open woven container holding dirty clothes waiting to be washed.",
    img: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "hanger",
    label: "Hanger",
    phonetic: "hang-er",
    topic: "objects",
    description: "A shaped hook that keeps a shirt or coat suspended in a cupboard.",
    img: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=85",
  },

  // ── Personal Items ─────────────────────────────────────────────────────────
  {
    id: "pajamas",
    label: "Pajamas",
    phonetic: "pa-ja-mas",
    topic: "personal",
    description: "Soft, loose two-piece clothing worn only for sleeping.",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "slippers",
    label: "Slippers",
    phonetic: "slip-pers",
    topic: "personal",
    description: "Soft indoor shoes you slide your feet into without fastening.",
    img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "robe",
    label: "Robe",
    phonetic: "robe",
    topic: "personal",
    description: "A loose belted garment worn over sleepwear, often after a bath.",
    img: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "poster",
    label: "Poster",
    phonetic: "pos-ter",
    topic: "personal",
    description: "A large printed sheet fixed flat against a wall for decoration.",
    img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "books",
    label: "Books",
    phonetic: "books",
    topic: "personal",
    description: "Bound stacks of printed pages that you read.",
    img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "photo-album",
    label: "Photo Album",
    phonetic: "pho-to-al-bum",
    topic: "personal",
    description: "A bound book of pages holding printed family pictures behind plastic.",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "glasses",
    label: "Glasses",
    phonetic: "glas-ses",
    topic: "personal",
    description: "Two lenses held in a frame, worn on the face to see clearly.",
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "backpack",
    label: "Backpack",
    phonetic: "back-pack",
    topic: "personal",
    description: "A bag with two shoulder straps, carried on your back.",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",
  },

  // ── Electronics ───────────────────────────────────────────────────────────
  {
    id: "phone",
    label: "Phone",
    phonetic: "phone",
    topic: "electronics",
    description: "A small handheld device used for calls and messages.",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "charger",
    label: "Charger",
    phonetic: "char-ger",
    topic: "electronics",
    description: "A cable and plug that restores battery power to a device.",
    img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "laptop",
    label: "Laptop",
    phonetic: "lap-top",
    topic: "electronics",
    description: "A portable computer that folds shut like a book.",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "headphones",
    label: "Headphones",
    phonetic: "head-phones",
    topic: "electronics",
    description: "Two padded cups joined by a band, worn over the ears.",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "tablet",
    label: "Tablet",
    phonetic: "tab-let",
    topic: "electronics",
    description: "A flat touchscreen slab, larger than a handheld, with no keyboard.",
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "speaker",
    label: "Speaker",
    phonetic: "speak-er",
    topic: "electronics",
    description: "A box that plays sound out loud into the room.",
    img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "reading-light",
    label: "Reading Light",
    phonetic: "read-ing-light",
    topic: "electronics",
    description: "A small adjustable lamp on a flexible arm, aimed down at a page.",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "remote-control",
    label: "Remote Control",
    phonetic: "re-mote-con-trol",
    topic: "electronics",
    description: "A handheld bar of buttons that operates a device from across the room.",
    img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=85",
  },

  // ── Bedding, continued ────────────────────────────────────────────────────
  // The "Pillows & Covers" group referenced these two ids and neither existed,
  // so starting that lesson silently dropped it from five words to three.
  {
    id: "quilt",
    label: "Quilt",
    phonetic: "kwilt",
    topic: "bedding",
    description: "A cover made from small fabric patches sewn together in a repeating pattern.",
    img: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "bedspread",
    label: "Bedspread",
    phonetic: "bed-spread",
    topic: "bedding",
    description: "A large decorative cloth laid over everything, hanging down towards the floor.",
    img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=85",
  },
];

export const BEDROOM_HOTSPOT_WORDS = BEDROOM_VOCABULARY.filter((v) => v.hotspot);

/**
 * The group id used by a spaced-repetition session, whose words are chosen by
 * the review schedule rather than by a fixed thematic group.
 *
 * Review sessions used to start with no group id at all, which meant the
 * reducer fell back to BEDROOM_GROUPS[0] and every review was labelled
 * "Essential Furniture" no matter which words it actually contained.
 */
export const REVIEW_GROUP_ID = "daily-review";

/**
 * Resolves a group id to the group it names.
 *
 * The `?? BEDROOM_GROUPS[0]` fallback that used to be inlined at four separate
 * call sites is the reason every lesson claimed to be "Essential Furniture":
 * an absent or unknown id silently became the first group instead of failing
 * loudly. It survives here as a single last resort, but `groupId` is now
 * required on START_LESSON so nothing reaches it by omission.
 */
export function resolveGroup(groupId: string, wordIds: string[] = []): WordGroup {
  if (groupId === REVIEW_GROUP_ID) {
    return {
      id: REVIEW_GROUP_ID,
      name: "Daily Review",
      topicId: "review",
      wordIds,
      description: "Words your memory schedule says are due today.",
    };
  }
  return BEDROOM_GROUPS.find((g) => g.id === groupId) ?? BEDROOM_GROUPS[0];
}

/** Looks up vocabulary items by id, preserving the order of `wordIds`. */
export function getWords(wordIds: string[]): VocabItem[] {
  return wordIds
    .map((id) => BEDROOM_VOCABULARY.find((item) => item.id === id))
    .filter((item): item is VocabItem => Boolean(item));
}

/**
 * The group a learner should be taken to when they ask to carry on.
 *
 * The Home dashboard used to hardcode `BEDROOM_GROUPS[0]`, so "Continue
 * Bedroom" replayed Essential Furniture forever however much progress had been
 * made. Picks the first group with any word not yet strong, and falls back to
 * the last group once everything is mastered.
 */
export function nextGroupToStudy(isMastered: (wordId: string) => boolean): WordGroup {
  return (
    BEDROOM_GROUPS.find((g) => g.wordIds.some((id) => !isMastered(id))) ??
    BEDROOM_GROUPS[BEDROOM_GROUPS.length - 1]
  );
}
