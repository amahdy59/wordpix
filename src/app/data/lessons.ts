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

/**
 * A themed collection of groups sharing one vocabulary set — "The Bedroom"
 * today, with room for more (`ExploreWorlds` already mocks up locked
 * "Bathroom"/"Kitchen" previews; this is the data shape they'd need to become
 * real).
 */
export interface LessonWorld {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  topics: TopicCategory[];
  groups: WordGroup[];
  vocabulary: VocabItem[];
}

const LOCAL_WORD_IMAGES = "./word-images";
const LOCAL_SCENE_IMAGES = "./scene-images";

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
    img: `${LOCAL_WORD_IMAGES}/wardrobe.jpg`,
  },
  {
    id: "desk",
    label: "Desk",
    phonetic: "desk",
    topic: "furniture",
    description: "A flat work surface on legs, where you sit to write or use a computer.",
    img: `${LOCAL_WORD_IMAGES}/desk.jpg`,
  },
  {
    id: "chair",
    label: "Chair",
    phonetic: "chair",
    topic: "furniture",
    description: "A single seat with a back and four legs, for one person.",
    img: `${LOCAL_WORD_IMAGES}/chair.jpg`,
  },
  {
    id: "bookshelf",
    label: "Bookshelf",
    phonetic: "book-shelf",
    topic: "furniture",
    description: "An upright frame of horizontal boards for storing reading material.",
    img: `${LOCAL_WORD_IMAGES}/bookshelf.jpg`,
  },
  {
    id: "mirror",
    label: "Mirror",
    phonetic: "mir-ror",
    topic: "furniture",
    description: "A flat glass panel that shows your own reflection.",
    img: `${LOCAL_WORD_IMAGES}/mirror.jpg`,
  },
  {
    id: "stool",
    label: "Stool",
    phonetic: "stool",
    topic: "furniture",
    description: "A small backless seat raised on three or four legs.",
    img: `${LOCAL_WORD_IMAGES}/stool.jpg`,
  },
  {
    id: "chest-of-drawers",
    label: "Chest of Drawers",
    phonetic: "chest-of-drawers",
    topic: "furniture",
    description: "A tall, narrow tower of stacked sliding compartments for storing clothes.",
    img: `${LOCAL_WORD_IMAGES}/chest-of-drawers.jpg`,
  },

  // ── Bedding & Linen ────────────────────────────────────────────────────────
  {
    id: "pillow",
    label: "Pillow",
    phonetic: "pil-low",
    topic: "bedding",
    description: "A soft rectangular pad that supports your head while you sleep.",
    img: `${LOCAL_WORD_IMAGES}/pillow.jpg`,
  },
  {
    id: "blanket",
    label: "Blanket",
    phonetic: "blan-ket",
    topic: "bedding",
    description: "A thick woven cover, often wool, laid over you for warmth.",
    img: `${LOCAL_WORD_IMAGES}/blanket.jpg`,
  },
  {
    id: "sheet",
    label: "Sheet",
    phonetic: "sheet",
    topic: "bedding",
    description: "A large, thin, flat piece of fabric that lies directly against your skin.",
    img: `${LOCAL_WORD_IMAGES}/sheet.jpg`,
  },
  {
    id: "mattress",
    label: "Mattress",
    phonetic: "mat-tress",
    topic: "bedding",
    description: "The thick padded slab you lie directly on top of.",
    img: `${LOCAL_WORD_IMAGES}/mattress.jpg`,
  },
  {
    id: "duvet",
    label: "Duvet",
    phonetic: "doo-vay",
    topic: "bedding",
    description: "A soft filled bag stuffed with feathers, used as a single thick top cover.",
    img: `${LOCAL_WORD_IMAGES}/duvet.jpg`,
  },
  {
    id: "pillowcase",
    label: "Pillowcase",
    phonetic: "pil-low-case",
    topic: "bedding",
    description: "A fabric sleeve that slips over the soft pad under your head.",
    img: `${LOCAL_WORD_IMAGES}/pillowcase.jpg`,
  },
  {
    id: "comforter",
    label: "Comforter",
    phonetic: "com-fort-er",
    topic: "bedding",
    description: "A thick fluffy top cover, stitched into sections, needing no separate cover.",
    img: `${LOCAL_WORD_IMAGES}/comforter.jpg`,
  },
  {
    id: "cushion",
    label: "Cushion",
    phonetic: "cush-ion",
    topic: "bedding",
    description: "A small soft square pad for sitting on or leaning against.",
    img: `${LOCAL_WORD_IMAGES}/cushion.jpg`,
  },
  {
    id: "bed-frame",
    label: "Bed Frame",
    phonetic: "bed-frame",
    topic: "bedding",
    description: "The wooden or metal structure that holds a mattress up off the floor.",
    img: `${LOCAL_WORD_IMAGES}/bed-frame.jpg`,
  },
  {
    id: "headboard",
    label: "Headboard",
    phonetic: "head-board",
    topic: "bedding",
    description: "The upright panel at the top end of a sleeping platform, behind your head.",
    img: `${LOCAL_WORD_IMAGES}/headboard.jpg`,
  },

  // ── Room Features ──────────────────────────────────────────────────────────
  {
    id: "lamp",
    label: "Lamp",
    phonetic: "lamp",
    topic: "features",
    description: "A small light on a base that stands on a table.",
    img: `${LOCAL_WORD_IMAGES}/lamp.jpg`,
  },
  {
    id: "curtain",
    label: "Curtain",
    phonetic: "cur-tain",
    topic: "features",
    description: "A long piece of hanging fabric drawn across a window at night.",
    img: `${LOCAL_WORD_IMAGES}/curtain.jpg`,
  },
  {
    id: "window",
    label: "Window",
    phonetic: "win-dow",
    topic: "features",
    description: "A glass opening in the wall that lets daylight into the room.",
    img: `${LOCAL_WORD_IMAGES}/window.jpg`,
  },
  {
    id: "door",
    label: "Door",
    phonetic: "door",
    topic: "features",
    description: "A hinged panel you open to enter or leave a room.",
    img: `${LOCAL_WORD_IMAGES}/door.jpg`,
  },
  {
    id: "rug",
    label: "Rug",
    phonetic: "rug",
    topic: "features",
    description: "A small soft floor covering that lies loose on top of the floor.",
    img: `${LOCAL_WORD_IMAGES}/rug.jpg`,
  },
  {
    id: "carpet",
    label: "Carpet",
    phonetic: "car-pet",
    topic: "features",
    description: "A soft floor covering fixed down permanently, reaching from wall to wall.",
    img: `${LOCAL_WORD_IMAGES}/carpet.jpg`,
  },
  {
    id: "ceiling-light",
    label: "Ceiling Light",
    phonetic: "cei-ling-light",
    topic: "features",
    description: "A fixture mounted overhead that brightens the whole room from above.",
    img: `${LOCAL_WORD_IMAGES}/ceiling-light.jpg`,
  },
  {
    id: "light-switch",
    label: "Light Switch",
    phonetic: "light-switch",
    topic: "features",
    description: "A small plate on the wall you press to make the room bright or dark.",
    img: `${LOCAL_WORD_IMAGES}/light-switch.jpg`,
  },
  {
    id: "blinds",
    label: "Blinds",
    phonetic: "blinds",
    topic: "features",
    description: "Horizontal slats across a window that tilt to control the daylight.",
    img: `${LOCAL_WORD_IMAGES}/blinds.jpg`,
  },
  {
    id: "outlet",
    label: "Outlet",
    phonetic: "out-let",
    topic: "features",
    description: "A small socket in the wall where you plug in electrical devices.",
    img: `${LOCAL_WORD_IMAGES}/outlet.jpg`,
  },

  // ── Bedroom Objects ────────────────────────────────────────────────────────
  {
    id: "alarm-clock",
    label: "Alarm Clock",
    phonetic: "a-larm-clock",
    topic: "objects",
    description: "A small bedside device that shows the time and wakes you with a sound.",
    img: `${LOCAL_WORD_IMAGES}/alarm-clock.jpg`,
  },
  {
    id: "picture-frame",
    label: "Picture Frame",
    phonetic: "pic-ture-frame",
    topic: "objects",
    description: "A decorative border that holds a photograph upright on a surface.",
    img: `${LOCAL_WORD_IMAGES}/picture-frame.jpg`,
  },
  {
    id: "clock",
    label: "Clock",
    phonetic: "clock",
    topic: "objects",
    description: "A round face with moving hands that shows the time.",
    img: `${LOCAL_WORD_IMAGES}/clock.jpg`,
  },
  {
    id: "plant",
    label: "Plant",
    phonetic: "plant",
    topic: "objects",
    description: "A living green thing growing in a pot of soil.",
    img: `${LOCAL_WORD_IMAGES}/plant.jpg`,
  },
  {
    id: "vase",
    label: "Vase",
    phonetic: "vase",
    topic: "objects",
    description: "A tall narrow container that holds cut flowers in water.",
    img: `${LOCAL_WORD_IMAGES}/vase.jpg`,
  },
  {
    id: "candle",
    label: "Candle",
    phonetic: "can-dle",
    topic: "objects",
    description: "A wax cylinder with a wick that gives light when it burns.",
    img: `${LOCAL_WORD_IMAGES}/candle.jpg`,
  },
  {
    id: "calendar",
    label: "Calendar",
    phonetic: "cal-en-dar",
    topic: "objects",
    description: "A grid of numbered days used to keep track of dates.",
    img: `${LOCAL_WORD_IMAGES}/calendar.jpg`,
  },
  {
    id: "tissue-box",
    label: "Tissue Box",
    phonetic: "tis-sue-box",
    topic: "objects",
    description: "A small carton that dispenses soft disposable paper, one sheet at a time.",
    img: `${LOCAL_WORD_IMAGES}/tissue-box.jpg`,
  },
  {
    id: "laundry-basket",
    label: "Laundry Basket",
    phonetic: "laun-dry-bas-ket",
    topic: "objects",
    description: "An open woven container holding dirty clothes waiting to be washed.",
    img: `${LOCAL_WORD_IMAGES}/laundry-basket.jpg`,
  },
  {
    id: "hanger",
    label: "Hanger",
    phonetic: "hang-er",
    topic: "objects",
    description: "A shaped hook that keeps a shirt or coat suspended in a cupboard.",
    img: `${LOCAL_WORD_IMAGES}/hanger.jpg`,
  },

  // ── Personal Items ─────────────────────────────────────────────────────────
  {
    id: "pajamas",
    label: "Pajamas",
    phonetic: "pa-ja-mas",
    topic: "personal",
    description: "Soft, loose two-piece clothing worn only for sleeping.",
    img: `${LOCAL_WORD_IMAGES}/pajamas.jpg`,
  },
  {
    id: "slippers",
    label: "Slippers",
    phonetic: "slip-pers",
    topic: "personal",
    description: "Soft indoor shoes you slide your feet into without fastening.",
    img: `${LOCAL_WORD_IMAGES}/slippers.jpg`,
  },
  {
    id: "robe",
    label: "Robe",
    phonetic: "robe",
    topic: "personal",
    description: "A loose belted garment worn over sleepwear, often after a bath.",
    img: `${LOCAL_WORD_IMAGES}/robe.jpg`,
  },
  {
    id: "poster",
    label: "Poster",
    phonetic: "pos-ter",
    topic: "personal",
    description: "A large printed sheet fixed flat against a wall for decoration.",
    img: `${LOCAL_WORD_IMAGES}/poster.jpg`,
  },
  {
    id: "books",
    label: "Books",
    phonetic: "books",
    topic: "personal",
    description: "Bound stacks of printed pages that you read.",
    img: `${LOCAL_WORD_IMAGES}/books.jpg`,
  },
  {
    id: "photo-album",
    label: "Photo Album",
    phonetic: "pho-to-al-bum",
    topic: "personal",
    description: "A bound book of pages holding printed family pictures behind plastic.",
    img: `${LOCAL_WORD_IMAGES}/photo-album.jpg`,
  },
  {
    id: "glasses",
    label: "Glasses",
    phonetic: "glas-ses",
    topic: "personal",
    description: "Two lenses held in a frame, worn on the face to see clearly.",
    img: `${LOCAL_WORD_IMAGES}/glasses.jpg`,
  },
  {
    id: "backpack",
    label: "Backpack",
    phonetic: "back-pack",
    topic: "personal",
    description: "A bag with two shoulder straps, carried on your back.",
    img: `${LOCAL_WORD_IMAGES}/backpack.jpg`,
  },

  // ── Electronics ───────────────────────────────────────────────────────────
  {
    id: "phone",
    label: "Phone",
    phonetic: "phone",
    topic: "electronics",
    description: "A small handheld device used for calls and messages.",
    img: `${LOCAL_WORD_IMAGES}/phone.jpg`,
  },
  {
    id: "charger",
    label: "Charger",
    phonetic: "char-ger",
    topic: "electronics",
    description: "A cable and plug that restores battery power to a device.",
    img: `${LOCAL_WORD_IMAGES}/charger.jpg`,
  },
  {
    id: "laptop",
    label: "Laptop",
    phonetic: "lap-top",
    topic: "electronics",
    description: "A portable computer that folds shut like a book.",
    img: `${LOCAL_WORD_IMAGES}/laptop.jpg`,
  },
  {
    id: "headphones",
    label: "Headphones",
    phonetic: "head-phones",
    topic: "electronics",
    description: "Two padded cups joined by a band, worn over the ears.",
    img: `${LOCAL_WORD_IMAGES}/headphones.jpg`,
  },
  {
    id: "tablet",
    label: "Tablet",
    phonetic: "tab-let",
    topic: "electronics",
    description: "A flat touchscreen slab, larger than a handheld, with no keyboard.",
    img: `${LOCAL_WORD_IMAGES}/tablet.jpg`,
  },
  {
    id: "speaker",
    label: "Speaker",
    phonetic: "speak-er",
    topic: "electronics",
    description: "A box that plays sound out loud into the room.",
    img: `${LOCAL_WORD_IMAGES}/speaker.jpg`,
  },
  {
    id: "reading-light",
    label: "Reading Light",
    phonetic: "read-ing-light",
    topic: "electronics",
    description: "A small adjustable lamp on a flexible arm, aimed down at a page.",
    img: `${LOCAL_WORD_IMAGES}/reading-light.jpg`,
  },
  {
    id: "remote-control",
    label: "Remote Control",
    phonetic: "re-mote-con-trol",
    topic: "electronics",
    description: "A handheld bar of buttons that operates a device from across the room.",
    img: `${LOCAL_WORD_IMAGES}/remote-control.jpg`,
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
    img: `${LOCAL_WORD_IMAGES}/quilt.jpg`,
  },
  {
    id: "bedspread",
    label: "Bedspread",
    phonetic: "bed-spread",
    topic: "bedding",
    description: "A large decorative cloth laid over everything, hanging down towards the floor.",
    img: `${LOCAL_WORD_IMAGES}/bedspread.jpg`,
  },
];

/**
 * Every lesson world the app knows about, keyed by id.
 *
 * Only one world is real today — the router, the PWA offline-readiness check,
 * and `LessonWorldEntry` used to hardcode the literal string "bedroom" instead
 * of reading it from here, which meant supporting a second world required
 * editing routing code rather than adding a registry entry. `BEDROOM_TOPICS`/
 * `BEDROOM_GROUPS`/`BEDROOM_VOCABULARY` stay exported as-is below — this is an
 * index over them, not a replacement.
 */
export const LESSON_WORLDS: Record<string, LessonWorld> = {
  bedroom: {
    id: "bedroom",
    name: "The Bedroom",
    description:
      "Explore real-life bedroom furniture, bedding, and accessories through 2D scene discovery, audio practice, recall matching, and sentence building.",
    heroImage: `${LOCAL_SCENE_IMAGES}/bedroom-hero.jpg`,
    topics: BEDROOM_TOPICS,
    groups: BEDROOM_GROUPS,
    vocabulary: BEDROOM_VOCABULARY,
  },
};

/** The world a learner lands in when nothing else specifies one. */
export const DEFAULT_WORLD_ID = "bedroom";

/** O(1) id lookup across every world's vocabulary, not just one. */
const VOCAB_BY_ID = new Map(
  Object.values(LESSON_WORLDS).flatMap((world) => world.vocabulary.map((item) => [item.id, item] as const))
);

/**
 * The group id used by a spaced-repetition session, whose words are chosen by
 * the review schedule rather than by a fixed thematic group.
 *
 * Review sessions used to start with no group id at all, which meant the
 * reducer fell back to BEDROOM_GROUPS[0] and every review was labelled
 * "Essential Furniture" no matter which words it actually contained.
 */
export const REVIEW_GROUP_ID = "daily-review";

/** Every group across every registered world. */
const ALL_GROUPS = Object.values(LESSON_WORLDS).flatMap((world) => world.groups);

/**
 * Resolves a group id to the group it names, searching every world rather
 * than just one.
 *
 * The `?? ALL_GROUPS[0]` fallback that used to be inlined at four separate
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
  const group = ALL_GROUPS.find((g) => g.id === groupId);
  if (!group) {
    // @ts-ignore
    if (import.meta.env?.DEV) {
      throw new Error(`UNKNOWN_GROUP: Could not resolve group ID "${groupId}"`);
    }
    return ALL_GROUPS[0];
  }
  return group;
}

/**
 * The world that owns a given group id, for building a world-scoped route or
 * label from state that only carries a `groupId`. Falls back to the default
 * world, mirroring `resolveGroup`'s fallback posture.
 */
export function resolveWorldForGroup(groupId: string): LessonWorld {
  const owner = Object.values(LESSON_WORLDS).find((world) => world.groups.some((g) => g.id === groupId));
  return owner ?? LESSON_WORLDS[DEFAULT_WORLD_ID];
}

/** Looks up vocabulary items by id, preserving the order of `wordIds`. */
export function getWords(wordIds: string[]): VocabItem[] {
  return wordIds
    .map((id) => VOCAB_BY_ID.get(id))
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
    ALL_GROUPS.find((g) => g.wordIds.some((id) => !isMastered(id))) ??
    ALL_GROUPS[ALL_GROUPS.length - 1]
  );
}
