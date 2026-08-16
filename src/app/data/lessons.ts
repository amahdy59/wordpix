// Centralized Lesson Vocabulary Data Layer for WordPix
// Synchronized from Figma Design (Node 44:2 — The Bedroom)

export interface VocabularyItem {
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
  hasWoman?: boolean;
}

export interface TopicCategory {
  id: string;
  name: string;
  itemsCount: number;
}

export interface Lesson {
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
export interface CourseUnit {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  topics: TopicCategory[];
  groups: Lesson[];
  vocabulary: VocabularyItem[];
}

const LOCAL_WORD_IMAGES = "./word-images";
const LOCAL_SCENE_IMAGES = "./scene-images";

export const BEDROOM_TOPICS: TopicCategory[] = [
  { id: "furniture", name: "Furniture", itemsCount: 10 },
  { id: "bedding", name: "Bedding & Linen", itemsCount: 10 },
  { id: "features", name: "Room Features", itemsCount: 10 },
  { id: "objects", name: "Bedroom Objects", itemsCount: 10 },
  { id: "personal", name: "Personal Items", itemsCount: 10 },
  { id: "electronics", name: "Electronics", itemsCount: 8 },
];

export const BEDROOM_GROUPS: Lesson[] = [
  {
    id: "furniture-1",
    name: "Furniture 1",
    topicId: "furniture",
    wordIds: [
      "bed",
      "nightstand",
      "dresser",
      "wardrobe",
      "desk",
    ],
    description: "Learn about furniture 1."
  },
  {
    id: "furniture-2",
    name: "Furniture 2",
    topicId: "furniture",
    wordIds: [
      "chair",
      "bookshelf",
      "mirror",
      "stool",
      "chest-of-drawers",
    ],
    description: "Learn about furniture 2."
  },
  {
    id: "bedding-linen-1",
    name: "Bedding & Linen 1",
    topicId: "bedding",
    wordIds: [
      "pillow",
      "blanket",
      "sheet",
      "mattress",
      "duvet",
    ],
    description: "Learn about bedding & linen 1."
  },
  {
    id: "bedding-linen-2",
    name: "Bedding & Linen 2",
    topicId: "bedding",
    wordIds: [
      "pillowcase",
      "comforter",
      "cushion",
      "bed-frame",
      "headboard",
    ],
    description: "Learn about bedding & linen 2."
  },
  {
    id: "room-features-1",
    name: "Room Features 1",
    topicId: "features",
    wordIds: [
      "lamp",
      "curtain",
      "window",
      "door",
      "rug",
    ],
    description: "Learn about room features 1."
  },
  {
    id: "room-features-2",
    name: "Room Features 2",
    topicId: "features",
    wordIds: [
      "carpet",
      "ceiling-light",
      "light-switch",
      "blinds",
      "outlet",
    ],
    description: "Learn about room features 2."
  },
  {
    id: "bedroom-objects-1",
    name: "Bedroom Objects 1",
    topicId: "objects",
    wordIds: [
      "alarm-clock",
      "picture-frame",
      "clock",
      "plant",
      "vase",
    ],
    description: "Learn about bedroom objects 1."
  },
  {
    id: "bedroom-objects-2",
    name: "Bedroom Objects 2",
    topicId: "objects",
    wordIds: [
      "candle",
      "calendar",
      "tissue-box",
      "wastebasket",
      "hanger",
    ],
    description: "Learn about bedroom objects 2."
  },
  {
    id: "personal-items-1",
    name: "Personal Items 1",
    topicId: "personal",
    wordIds: [
      "pajamas",
      "slippers",
      "robe",
      "teddy-bear",
      "poster",
    ],
    description: "Learn about personal items 1."
  },
  {
    id: "personal-items-2",
    name: "Personal Items 2",
    topicId: "personal",
    wordIds: [
      "books",
      "photo-album",
      "glasses",
      "backpack",
      "jewelry-box",
    ],
    description: "Learn about personal items 2."
  },
  {
    id: "electronics-1",
    name: "Electronics 1",
    topicId: "electronics",
    wordIds: [
      "phone",
      "charger",
      "laptop",
      "headphones",
      "tablet",
    ],
    description: "Learn about electronics 1."
  },
  {
    id: "electronics-2",
    name: "Electronics 2",
    topicId: "electronics",
    wordIds: [
      "speaker",
      "reading-light",
      "remote-control",
      "phone",
      "charger",
    ],
    description: "Learn about electronics 2."
  },
];

export const BEDROOM_VOCABULARY: VocabularyItem[] = [
  {
    id: "bed",
    label: "Bed",
    phonetic: "bed",
    topic: "furniture",
    description: "A large rectangular platform with a soft top, where a person lies down to sleep.",
    img: `${LOCAL_WORD_IMAGES}/bed.webp`,
  },
  {
    id: "nightstand",
    label: "Nightstand",
    phonetic: "nightstand",
    topic: "furniture",
    description: "A small low table beside the place you sleep, holding a lamp or a book.",
    img: `${LOCAL_WORD_IMAGES}/nightstand.webp`,
  },
  {
    id: "dresser",
    label: "Dresser",
    phonetic: "dresser",
    topic: "furniture",
    description: "A wide, low piece of furniture with several sliding compartments for folded clothes.",
    img: `${LOCAL_WORD_IMAGES}/dresser.webp`,
  },
  {
    id: "wardrobe",
    label: "Wardrobe",
    phonetic: "wardrobe",
    topic: "furniture",
    description: "A tall cupboard with doors, where clothes hang from a rail inside.",
    img: `${LOCAL_WORD_IMAGES}/wardrobe.webp`,
  },
  {
    id: "desk",
    label: "Desk",
    phonetic: "desk",
    topic: "furniture",
    description: "A flat work surface on legs, where you sit to write or use a computer.",
    img: `${LOCAL_WORD_IMAGES}/desk.webp`,
  },
  {
    id: "chair",
    label: "Chair",
    phonetic: "chair",
    topic: "furniture",
    description: "A single seat with a back and four legs, for one person.",
    img: `${LOCAL_WORD_IMAGES}/chair.webp`,
  },
  {
    id: "bookshelf",
    label: "Bookshelf",
    phonetic: "bookshelf",
    topic: "furniture",
    description: "An upright frame of horizontal boards for storing reading material.",
    img: `${LOCAL_WORD_IMAGES}/bookshelf.webp`,
  },
  {
    id: "mirror",
    label: "Mirror",
    phonetic: "mirror",
    topic: "furniture",
    description: "A flat glass panel that shows your own reflection.",
    img: `${LOCAL_WORD_IMAGES}/mirror.webp`,
  },
  {
    id: "stool",
    label: "Stool",
    phonetic: "stool",
    topic: "furniture",
    description: "A small backless seat raised on three or four legs.",
    img: `${LOCAL_WORD_IMAGES}/stool.webp`,
  },
  {
    id: "chest-of-drawers",
    label: "Chest Of Drawers",
    phonetic: "chest of drawers",
    topic: "furniture",
    description: "A tall, narrow tower of stacked sliding compartments for storing clothes.",
    img: `${LOCAL_WORD_IMAGES}/chest-of-drawers.webp`,
  },
  {
    id: "pillow",
    label: "Pillow",
    phonetic: "pillow",
    topic: "bedding",
    description: "A soft rectangular pad that supports your head while you sleep.",
    img: `${LOCAL_WORD_IMAGES}/pillow.webp`,
  },
  {
    id: "blanket",
    label: "Blanket",
    phonetic: "blanket",
    topic: "bedding",
    description: "A thick woven cover, often wool, laid over you for warmth.",
    img: `${LOCAL_WORD_IMAGES}/blanket.webp`,
  },
  {
    id: "sheet",
    label: "Sheet",
    phonetic: "sheet",
    topic: "bedding",
    description: "A large, thin, flat piece of fabric that lies directly against your skin.",
    img: `${LOCAL_WORD_IMAGES}/sheet.webp`,
  },
  {
    id: "mattress",
    label: "Mattress",
    phonetic: "mattress",
    topic: "bedding",
    description: "The thick padded slab you lie directly on top of.",
    img: `${LOCAL_WORD_IMAGES}/mattress.webp`,
  },
  {
    id: "duvet",
    label: "Duvet",
    phonetic: "duvet",
    topic: "bedding",
    description: "A soft filled bag stuffed with feathers, used as a single thick top cover.",
    img: `${LOCAL_WORD_IMAGES}/duvet.webp`,
  },
  {
    id: "pillowcase",
    label: "Pillowcase",
    phonetic: "pillowcase",
    topic: "bedding",
    description: "A fabric sleeve that slips over the soft pad under your head.",
    img: `${LOCAL_WORD_IMAGES}/pillowcase.webp`,
  },
  {
    id: "comforter",
    label: "Comforter",
    phonetic: "comforter",
    topic: "bedding",
    description: "A thick fluffy top cover, stitched into sections, needing no separate cover.",
    img: `${LOCAL_WORD_IMAGES}/comforter.webp`,
  },
  {
    id: "cushion",
    label: "Cushion",
    phonetic: "cushion",
    topic: "bedding",
    description: "A small soft square pad for sitting on or leaning against.",
    img: `${LOCAL_WORD_IMAGES}/cushion.webp`,
  },
  {
    id: "bed-frame",
    label: "Bed Frame",
    phonetic: "bed frame",
    topic: "bedding",
    description: "The wooden or metal structure that holds a mattress up off the floor.",
    img: `${LOCAL_WORD_IMAGES}/bed-frame.webp`,
  },
  {
    id: "headboard",
    label: "Headboard",
    phonetic: "headboard",
    topic: "bedding",
    description: "The upright panel at the top end of a sleeping platform, behind your head.",
    img: `${LOCAL_WORD_IMAGES}/headboard.webp`,
  },
  {
    id: "lamp",
    label: "Lamp",
    phonetic: "lamp",
    topic: "features",
    description: "A small light on a base that stands on a table.",
    img: `${LOCAL_WORD_IMAGES}/lamp.webp`,
  },
  {
    id: "curtain",
    label: "Curtain",
    phonetic: "curtain",
    topic: "features",
    description: "A long piece of hanging fabric drawn across a window at night.",
    img: `${LOCAL_WORD_IMAGES}/curtain.webp`,
  },
  {
    id: "window",
    label: "Window",
    phonetic: "window",
    topic: "features",
    description: "A glass opening in the wall that lets daylight into the room.",
    img: `${LOCAL_WORD_IMAGES}/window.webp`,
  },
  {
    id: "door",
    label: "Door",
    phonetic: "door",
    topic: "features",
    description: "A hinged panel you open to enter or leave a room.",
    img: `${LOCAL_WORD_IMAGES}/door.webp`,
  },
  {
    id: "rug",
    label: "Rug",
    phonetic: "rug",
    topic: "features",
    description: "A small soft floor covering that lies loose on top of the floor.",
    img: `${LOCAL_WORD_IMAGES}/rug.webp`,
  },
  {
    id: "carpet",
    label: "Carpet",
    phonetic: "carpet",
    topic: "features",
    description: "A soft floor covering fixed down permanently, reaching from wall to wall.",
    img: `${LOCAL_WORD_IMAGES}/carpet.webp`,
  },
  {
    id: "ceiling-light",
    label: "Ceiling Light",
    phonetic: "ceiling light",
    topic: "features",
    description: "A fixture mounted overhead that brightens the whole room from above.",
    img: `${LOCAL_WORD_IMAGES}/ceiling-light.webp`,
  },
  {
    id: "light-switch",
    label: "Light Switch",
    phonetic: "light switch",
    topic: "features",
    description: "A small plate on the wall you press to make the room bright or dark.",
    img: `${LOCAL_WORD_IMAGES}/light-switch.webp`,
  },
  {
    id: "blinds",
    label: "Blinds",
    phonetic: "blinds",
    topic: "features",
    description: "Horizontal slats across a window that tilt to control the daylight.",
    img: `${LOCAL_WORD_IMAGES}/blinds.webp`,
  },
  {
    id: "outlet",
    label: "Outlet",
    phonetic: "outlet",
    topic: "features",
    description: "A small socket in the wall where you plug in electrical devices.",
    img: `${LOCAL_WORD_IMAGES}/outlet.webp`,
  },
  {
    id: "alarm-clock",
    label: "Alarm Clock",
    phonetic: "alarm clock",
    topic: "objects",
    description: "A small bedside device that shows the time and wakes you with a sound.",
    img: `${LOCAL_WORD_IMAGES}/alarm-clock.webp`,
  },
  {
    id: "picture-frame",
    label: "Picture Frame",
    phonetic: "picture frame",
    topic: "objects",
    description: "A decorative border that holds a photograph upright on a surface.",
    img: `${LOCAL_WORD_IMAGES}/picture-frame.webp`,
  },
  {
    id: "clock",
    label: "Clock",
    phonetic: "clock",
    topic: "objects",
    description: "A round face with moving hands that shows the time.",
    img: `${LOCAL_WORD_IMAGES}/clock.webp`,
  },
  {
    id: "plant",
    label: "Plant",
    phonetic: "plant",
    topic: "objects",
    description: "A living green thing growing in a pot of soil.",
    img: `${LOCAL_WORD_IMAGES}/plant.webp`,
  },
  {
    id: "vase",
    label: "Vase",
    phonetic: "vase",
    topic: "objects",
    description: "A tall narrow container that holds cut flowers in water.",
    img: `${LOCAL_WORD_IMAGES}/vase.webp`,
  },
  {
    id: "candle",
    label: "Candle",
    phonetic: "candle",
    topic: "objects",
    description: "A wax cylinder with a wick that gives light when it burns.",
    img: `${LOCAL_WORD_IMAGES}/candle.webp`,
  },
  {
    id: "calendar",
    label: "Calendar",
    phonetic: "calendar",
    topic: "objects",
    description: "A grid of numbered days used to keep track of dates.",
    img: `${LOCAL_WORD_IMAGES}/calendar.webp`,
  },
  {
    id: "tissue-box",
    label: "Tissue Box",
    phonetic: "tissue box",
    topic: "objects",
    description: "A small carton that dispenses soft disposable paper, one sheet at a time.",
    img: `${LOCAL_WORD_IMAGES}/tissue-box.webp`,
  },
  {
    id: "wastebasket",
    label: "Wastebasket",
    phonetic: "wastebasket",
    topic: "objects",
    description: "A small open container for discarding paper and light trash.",
    img: `${LOCAL_WORD_IMAGES}/wastebasket.webp`,
  },
  {
    id: "hanger",
    label: "Hanger",
    phonetic: "hanger",
    topic: "objects",
    description: "A shaped hook that keeps a shirt or coat suspended in a cupboard.",
    img: `${LOCAL_WORD_IMAGES}/hanger.webp`,
  },
  {
    id: "pajamas",
    label: "Pajamas",
    phonetic: "pajamas",
    topic: "personal",
    description: "Soft, loose two-piece clothing worn only for sleeping.",
    img: `${LOCAL_WORD_IMAGES}/pajamas.webp`,
  },
  {
    id: "slippers",
    label: "Slippers",
    phonetic: "slippers",
    topic: "personal",
    description: "Soft indoor shoes you slide your feet into without fastening.",
    img: `${LOCAL_WORD_IMAGES}/slippers.webp`,
  },
  {
    id: "robe",
    label: "Robe",
    phonetic: "robe",
    topic: "personal",
    description: "A loose belted garment worn over sleepwear, often after a bath.",
    img: `${LOCAL_WORD_IMAGES}/robe.webp`,
  },
  {
    id: "teddy-bear",
    label: "Teddy Bear",
    phonetic: "teddy bear",
    topic: "personal",
    description: "A soft, stuffed toy animal shaped like a small cub.",
    img: `${LOCAL_WORD_IMAGES}/teddy-bear.webp`,
  },
  {
    id: "poster",
    label: "Poster",
    phonetic: "poster",
    topic: "personal",
    description: "A large printed sheet fixed flat against a wall for decoration.",
    img: `${LOCAL_WORD_IMAGES}/poster.webp`,
  },
  {
    id: "books",
    label: "Books",
    phonetic: "books",
    topic: "personal",
    description: "Bound stacks of printed pages that you read.",
    img: `${LOCAL_WORD_IMAGES}/books.webp`,
  },
  {
    id: "photo-album",
    label: "Photo Album",
    phonetic: "photo album",
    topic: "personal",
    description: "A bound book of pages holding printed family pictures behind plastic.",
    img: `${LOCAL_WORD_IMAGES}/photo-album.webp`,
  },
  {
    id: "glasses",
    label: "Glasses",
    phonetic: "glasses",
    topic: "personal",
    description: "Two lenses held in a frame, worn on the face to see clearly.",
    img: `${LOCAL_WORD_IMAGES}/glasses.webp`,
  },
  {
    id: "backpack",
    label: "Backpack",
    phonetic: "backpack",
    topic: "personal",
    description: "A bag with two shoulder straps, carried on your back.",
    img: `${LOCAL_WORD_IMAGES}/backpack.webp`,
  },
  {
    id: "jewelry-box",
    label: "Jewelry Box",
    phonetic: "jewelry box",
    topic: "personal",
    description: "A small decorative container for storing rings, necklaces, and valuables.",
    img: `${LOCAL_WORD_IMAGES}/jewelry-box.webp`,
  },
  {
    id: "phone",
    label: "Phone",
    phonetic: "phone",
    topic: "electronics",
    description: "A small handheld device used for calls and messages.",
    img: `${LOCAL_WORD_IMAGES}/phone.webp`,
  },
  {
    id: "charger",
    label: "Charger",
    phonetic: "charger",
    topic: "electronics",
    description: "A cable and plug that restores battery power to a device.",
    img: `${LOCAL_WORD_IMAGES}/charger.webp`,
  },
  {
    id: "laptop",
    label: "Laptop",
    phonetic: "laptop",
    topic: "electronics",
    description: "A portable computer that folds shut like a book.",
    img: `${LOCAL_WORD_IMAGES}/laptop.webp`,
  },
  {
    id: "headphones",
    label: "Headphones",
    phonetic: "headphones",
    topic: "electronics",
    description: "Two padded cups joined by a band, worn over the ears.",
    img: `${LOCAL_WORD_IMAGES}/headphones.webp`,
  },
  {
    id: "tablet",
    label: "Tablet",
    phonetic: "tablet",
    topic: "electronics",
    description: "A flat touchscreen slab, larger than a handheld, with no keyboard.",
    img: `${LOCAL_WORD_IMAGES}/tablet.webp`,
  },
  {
    id: "speaker",
    label: "Speaker",
    phonetic: "speaker",
    topic: "electronics",
    description: "A box that plays sound out loud into the room.",
    img: `${LOCAL_WORD_IMAGES}/speaker.webp`,
  },
  {
    id: "reading-light",
    label: "Reading Light",
    phonetic: "reading light",
    topic: "electronics",
    description: "A small adjustable lamp on a flexible arm, aimed down at a page.",
    img: `${LOCAL_WORD_IMAGES}/reading-light.webp`,
  },
  {
    id: "remote-control",
    label: "Remote Control",
    phonetic: "remote control",
    topic: "electronics",
    description: "A handheld bar of buttons that operates a device from across the room.",
    img: `${LOCAL_WORD_IMAGES}/remote-control.webp`,
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
export const COURSE_UNITS: Record<string, CourseUnit> = {
  bedroom: {
    id: "bedroom",
    name: "The Bedroom",
    description:
      "Explore real-life bedroom furniture, bedding, and accessories through 2D scene discovery, audio practice, recall matching, and sentence building.",
    heroImage: `${LOCAL_SCENE_IMAGES}/bedroom-hero.webp`,
    topics: BEDROOM_TOPICS,
    groups: BEDROOM_GROUPS,
    vocabulary: BEDROOM_VOCABULARY,
  },
};

/** The world a learner lands in when nothing else specifies one. */
export const DEFAULT_UNIT_ID = "bedroom";

/** O(1) id lookup across every world's vocabulary, not just one. */
const VOCAB_BY_ID = new Map(
  Object.values(COURSE_UNITS).flatMap((world) => world.vocabulary.map((item) => [item.id, item] as const))
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
const ALL_GROUPS = Object.values(COURSE_UNITS).flatMap((world) => world.groups);

/**
 * Resolves a group id to the group it names, searching every world rather
 * than just one.
 *
 * The `?? ALL_GROUPS[0]` fallback that used to be inlined at four separate
 * call sites is the reason every lesson claimed to be "Essential Furniture":
 * an absent or unknown id silently became the first group instead of failing
 * loudly. It survives here as a single last resort, but `lessonId` is now
 * required on START_LESSON so nothing reaches it by omission.
 */
export function resolveGroup(lessonId: string, wordIds: string[] = []): Lesson {
  if (lessonId === REVIEW_GROUP_ID) {
    return {
      id: REVIEW_GROUP_ID,
      name: "Daily Review",
      topicId: "review",
      wordIds,
      description: "Words your memory schedule says are due today.",
    };
  }
  const group = ALL_GROUPS.find((g) => g.id === lessonId);
  if (!group) {
    if (import.meta.env?.DEV) {
      throw new Error(`UNKNOWN_GROUP: Could not resolve group ID "${lessonId}"`);
    }
    return ALL_GROUPS[0];
  }
  return group;
}

/**
 * The world that owns a given group id, for building a world-scoped route or
 * label from state that only carries a `lessonId`. Falls back to the default
 * world, mirroring `resolveGroup`'s fallback posture.
 */
export function resolveUnitForLesson(lessonId: string): CourseUnit {
  const owner = Object.values(COURSE_UNITS).find((world) => world.groups.some((g) => g.id === lessonId));
  return owner ?? COURSE_UNITS[DEFAULT_UNIT_ID];
}

/** Looks up vocabulary items by id, preserving the order of `wordIds`. */
export function getWords(wordIds: string[]): VocabularyItem[] {
  return wordIds
    .map((id) => VOCAB_BY_ID.get(id))
    .filter((item): item is VocabularyItem => Boolean(item));
}

/**
 * The group a learner should be taken to when they ask to carry on.
 *
 * The Home dashboard used to hardcode `BEDROOM_GROUPS[0]`, so "Continue
 * Bedroom" replayed Essential Furniture forever however much progress had been
 * made. Picks the first group with any word not yet strong, and falls back to
 * the last group once everything is mastered.
 */
export function nextGroupToStudy(isMastered: (wordId: string) => boolean): Lesson {
  return (
    ALL_GROUPS.find((g) => g.wordIds.some((id) => !isMastered(id))) ??
    ALL_GROUPS[ALL_GROUPS.length - 1]
  );
}

/**
 * Returns the strictly next group in the curriculum sequence after the given lessonId.
 * Used when a user explicitly requests to move to the next group.
 */
export function getNextGroupChronological(lessonId: string): Lesson {
  const currentIndex = ALL_GROUPS.findIndex((g) => g.id === lessonId);
  if (currentIndex === -1 || currentIndex === ALL_GROUPS.length - 1) {
    return ALL_GROUPS[ALL_GROUPS.length - 1]; // stay on the last group if there's no next
  }
  return ALL_GROUPS[currentIndex + 1];
}
