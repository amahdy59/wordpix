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

// --- KITCHEN DATA ---

export const KITCHEN_TOPICS: TopicCategory[] = [
  { id: "large-appliances", name: "Large Appliances", itemsCount: 10 },
  { id: "cookware", name: "Cookware", itemsCount: 10 },
  { id: "utensils-tools", name: "Utensils Tools", itemsCount: 12 },
  { id: "dishes-containers", name: "Dishes Containers", itemsCount: 12 },
  { id: "kitchen-items", name: "Kitchen Items", itemsCount: 12 },
  { id: "basic-pantry", name: "Basic Pantry", itemsCount: 14 },
];

export const KITCHEN_GROUPS: Lesson[] = [
  {
    id: "large-appliances-1",
    name: "Large Appliances 1",
    topicId: "large-appliances",
    wordIds: [
      "refrigerator",
      "stove",
      "oven",
      "microwave",
      "dishwasher",
    ],
    description: "Learn about large appliances 1."
  },
  {
    id: "large-appliances-2",
    name: "Large Appliances 2",
    topicId: "large-appliances",
    wordIds: [
      "toaster",
      "blender",
      "kettle",
      "coffee-maker",
      "freezer",
    ],
    description: "Learn about large appliances 2."
  },
  {
    id: "cookware-1",
    name: "Cookware 1",
    topicId: "cookware",
    wordIds: [
      "pot",
      "pan",
      "frying-pan",
      "baking-tray",
      "saucepan",
    ],
    description: "Learn about cookware 1."
  },
  {
    id: "cookware-2",
    name: "Cookware 2",
    topicId: "cookware",
    wordIds: [
      "wok",
      "casserole-dish",
      "baking-dish",
      "steamer",
      "pressure-cooker",
    ],
    description: "Learn about cookware 2."
  },
  {
    id: "utensils-tools-1",
    name: "Utensils Tools 1",
    topicId: "utensils-tools",
    wordIds: [
      "fork",
      "knife",
      "spoon",
      "spatula",
      "ladle",
    ],
    description: "Learn about utensils tools 1."
  },
  {
    id: "utensils-tools-2",
    name: "Utensils Tools 2",
    topicId: "utensils-tools",
    wordIds: [
      "whisk",
      "tongs",
      "peeler",
      "grater",
      "rolling-pin",
    ],
    description: "Learn about utensils tools 2."
  },
  {
    id: "utensils-tools-3",
    name: "Utensils Tools 3",
    topicId: "utensils-tools",
    wordIds: [
      "can-opener",
      "corkscrew",
    ],
    description: "Learn about utensils tools 3."
  },
  {
    id: "dishes-containers-1",
    name: "Dishes Containers 1",
    topicId: "dishes-containers",
    wordIds: [
      "plate",
      "bowl",
      "mug",
      "glass",
      "cup",
    ],
    description: "Learn about dishes containers 1."
  },
  {
    id: "dishes-containers-2",
    name: "Dishes Containers 2",
    topicId: "dishes-containers",
    wordIds: [
      "saucer",
      "cutting-board",
      "colander",
      "measuring-cup",
      "measuring-spoon",
    ],
    description: "Learn about dishes containers 2."
  },
  {
    id: "dishes-containers-3",
    name: "Dishes Containers 3",
    topicId: "dishes-containers",
    wordIds: [
      "mixing-bowl",
      "pitcher",
    ],
    description: "Learn about dishes containers 3."
  },
  {
    id: "kitchen-items-1",
    name: "Kitchen Items 1",
    topicId: "kitchen-items",
    wordIds: [
      "dish-towel",
      "oven-mitt",
      "apron",
      "trash-can",
      "paper-towel",
    ],
    description: "Learn about kitchen items 1."
  },
  {
    id: "kitchen-items-2",
    name: "Kitchen Items 2",
    topicId: "kitchen-items",
    wordIds: [
      "plastic-wrap",
      "aluminum-foil",
      "food-container",
      "sponge",
      "dish-soap",
    ],
    description: "Learn about kitchen items 2."
  },
  {
    id: "kitchen-items-3",
    name: "Kitchen Items 3",
    topicId: "kitchen-items",
    wordIds: [
      "dish-rack",
      "cling-film",
    ],
    description: "Learn about kitchen items 3."
  },
  {
    id: "basic-pantry-1",
    name: "Basic Pantry 1",
    topicId: "basic-pantry",
    wordIds: [
      "bread",
      "butter",
      "milk",
      "egg",
      "cheese",
    ],
    description: "Learn about basic pantry 1."
  },
  {
    id: "basic-pantry-2",
    name: "Basic Pantry 2",
    topicId: "basic-pantry",
    wordIds: [
      "rice",
      "pasta",
      "cooking-oil",
      "salt",
      "sugar",
    ],
    description: "Learn about basic pantry 2."
  },
  {
    id: "basic-pantry-3",
    name: "Basic Pantry 3",
    topicId: "basic-pantry",
    wordIds: [
      "pepper",
      "flour",
      "vinegar",
      "honey",
    ],
    description: "Learn about basic pantry 3."
  },
];

export const KITCHEN_VOCABULARY: VocabularyItem[] = [
  {
    id: "refrigerator",
    label: "Refrigerator",
    phonetic: "refrigerator", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as refrigerator.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/refrigerator.webp`,
  },
  {
    id: "stove",
    label: "Stove",
    phonetic: "stove", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as stove.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/stove.webp`,
  },
  {
    id: "oven",
    label: "Oven",
    phonetic: "oven", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as oven.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/oven.webp`,
  },
  {
    id: "microwave",
    label: "Microwave",
    phonetic: "microwave", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as microwave.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/microwave.webp`,
  },
  {
    id: "dishwasher",
    label: "Dishwasher",
    phonetic: "dishwasher", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as dishwasher.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/dishwasher.webp`,
  },
  {
    id: "toaster",
    label: "Toaster",
    phonetic: "toaster", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as toaster.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/toaster.webp`,
  },
  {
    id: "blender",
    label: "Blender",
    phonetic: "blender", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as blender.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/blender.webp`,
  },
  {
    id: "kettle",
    label: "Kettle",
    phonetic: "kettle", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as kettle.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/kettle.webp`,
  },
  {
    id: "coffee-maker",
    label: "Coffee Maker",
    phonetic: "coffee maker", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as coffee maker.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/coffee-maker.webp`,
  },
  {
    id: "freezer",
    label: "Freezer",
    phonetic: "freezer", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as freezer.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/freezer.webp`,
  },
  {
    id: "pot",
    label: "Pot",
    phonetic: "pot", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as pot.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pot.webp`,
  },
  {
    id: "pan",
    label: "Pan",
    phonetic: "pan", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as pan.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pan.webp`,
  },
  {
    id: "frying-pan",
    label: "Frying Pan",
    phonetic: "frying pan", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as frying pan.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/frying-pan.webp`,
  },
  {
    id: "baking-tray",
    label: "Baking Tray",
    phonetic: "baking tray", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as baking tray.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/baking-tray.webp`,
  },
  {
    id: "saucepan",
    label: "Saucepan",
    phonetic: "saucepan", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as saucepan.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/saucepan.webp`,
  },
  {
    id: "wok",
    label: "Wok",
    phonetic: "wok", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as wok.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/wok.webp`,
  },
  {
    id: "casserole-dish",
    label: "Casserole Dish",
    phonetic: "casserole dish", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as casserole dish.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/casserole-dish.webp`,
  },
  {
    id: "baking-dish",
    label: "Baking Dish",
    phonetic: "baking dish", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as baking dish.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/baking-dish.webp`,
  },
  {
    id: "steamer",
    label: "Steamer",
    phonetic: "steamer", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as steamer.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/steamer.webp`,
  },
  {
    id: "pressure-cooker",
    label: "Pressure Cooker",
    phonetic: "pressure cooker", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as pressure cooker.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pressure-cooker.webp`,
  },
  {
    id: "fork",
    label: "Fork",
    phonetic: "fork", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as fork.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/fork.webp`,
  },
  {
    id: "knife",
    label: "Knife",
    phonetic: "knife", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as knife.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/knife.webp`,
  },
  {
    id: "spoon",
    label: "Spoon",
    phonetic: "spoon", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as spoon.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/spoon.webp`,
  },
  {
    id: "spatula",
    label: "Spatula",
    phonetic: "spatula", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as spatula.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/spatula.webp`,
  },
  {
    id: "ladle",
    label: "Ladle",
    phonetic: "ladle", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as ladle.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/ladle.webp`,
  },
  {
    id: "whisk",
    label: "Whisk",
    phonetic: "whisk", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as whisk.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/whisk.webp`,
  },
  {
    id: "tongs",
    label: "Tongs",
    phonetic: "tongs", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as tongs.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/tongs.webp`,
  },
  {
    id: "peeler",
    label: "Peeler",
    phonetic: "peeler", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as peeler.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/peeler.webp`,
  },
  {
    id: "grater",
    label: "Grater",
    phonetic: "grater", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as grater.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/grater.webp`,
  },
  {
    id: "rolling-pin",
    label: "Rolling Pin",
    phonetic: "rolling pin", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as rolling pin.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/rolling-pin.webp`,
  },
  {
    id: "can-opener",
    label: "Can Opener",
    phonetic: "can opener", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as can opener.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/can-opener.webp`,
  },
  {
    id: "corkscrew",
    label: "Corkscrew",
    phonetic: "corkscrew", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as corkscrew.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/corkscrew.webp`,
  },
  {
    id: "plate",
    label: "Plate",
    phonetic: "plate", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as plate.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/plate.webp`,
  },
  {
    id: "bowl",
    label: "Bowl",
    phonetic: "bowl", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as bowl.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/bowl.webp`,
  },
  {
    id: "mug",
    label: "Mug",
    phonetic: "mug", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as mug.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/mug.webp`,
  },
  {
    id: "glass",
    label: "Glass",
    phonetic: "glass", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as glass.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/glass.webp`,
  },
  {
    id: "cup",
    label: "Cup",
    phonetic: "cup", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as cup.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/cup.webp`,
  },
  {
    id: "saucer",
    label: "Saucer",
    phonetic: "saucer", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as saucer.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/saucer.webp`,
  },
  {
    id: "cutting-board",
    label: "Cutting Board",
    phonetic: "cutting board", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as cutting board.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/cutting-board.webp`,
  },
  {
    id: "colander",
    label: "Colander",
    phonetic: "colander", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as colander.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/colander.webp`,
  },
  {
    id: "measuring-cup",
    label: "Measuring Cup",
    phonetic: "measuring cup", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as measuring cup.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/measuring-cup.webp`,
  },
  {
    id: "measuring-spoon",
    label: "Measuring Spoon",
    phonetic: "measuring spoon", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as measuring spoon.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/measuring-spoon.webp`,
  },
  {
    id: "mixing-bowl",
    label: "Mixing Bowl",
    phonetic: "mixing bowl", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as mixing bowl.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/mixing-bowl.webp`,
  },
  {
    id: "pitcher",
    label: "Pitcher",
    phonetic: "pitcher", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as pitcher.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pitcher.webp`,
  },
  {
    id: "dish-towel",
    label: "Dish Towel",
    phonetic: "dish towel", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as dish towel.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/dish-towel.webp`,
  },
  {
    id: "oven-mitt",
    label: "Oven Mitt",
    phonetic: "oven mitt", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as oven mitt.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/oven-mitt.webp`,
  },
  {
    id: "apron",
    label: "Apron",
    phonetic: "apron", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as apron.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/apron.webp`,
  },
  {
    id: "trash-can",
    label: "Trash Can",
    phonetic: "trash can", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as trash can.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/trash-can.webp`,
  },
  {
    id: "paper-towel",
    label: "Paper Towel",
    phonetic: "paper towel", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as paper towel.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/paper-towel.webp`,
  },
  {
    id: "plastic-wrap",
    label: "Plastic Wrap",
    phonetic: "plastic wrap", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as plastic wrap.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/plastic-wrap.webp`,
  },
  {
    id: "aluminum-foil",
    label: "Aluminum Foil",
    phonetic: "aluminum foil", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as aluminum foil.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/aluminum-foil.webp`,
  },
  {
    id: "food-container",
    label: "Food Container",
    phonetic: "food container", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as food container.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/food-container.webp`,
  },
  {
    id: "sponge",
    label: "Sponge",
    phonetic: "sponge", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as sponge.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/sponge.webp`,
  },
  {
    id: "dish-soap",
    label: "Dish Soap",
    phonetic: "dish soap", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as dish soap.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/dish-soap.webp`,
  },
  {
    id: "dish-rack",
    label: "Dish Rack",
    phonetic: "dish rack", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as dish rack.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/dish-rack.webp`,
  },
  {
    id: "cling-film",
    label: "Cling Film",
    phonetic: "cling film", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as cling film.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/cling-film.webp`,
  },
  {
    id: "bread",
    label: "Bread",
    phonetic: "bread", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as bread.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/bread.webp`,
  },
  {
    id: "butter",
    label: "Butter",
    phonetic: "butter", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as butter.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/butter.webp`,
  },
  {
    id: "milk",
    label: "Milk",
    phonetic: "milk", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as milk.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/milk.webp`,
  },
  {
    id: "egg",
    label: "Egg",
    phonetic: "egg", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as egg.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/egg.webp`,
  },
  {
    id: "cheese",
    label: "Cheese",
    phonetic: "cheese", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as cheese.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/cheese.webp`,
  },
  {
    id: "rice",
    label: "Rice",
    phonetic: "rice", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as rice.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/rice.webp`,
  },
  {
    id: "pasta",
    label: "Pasta",
    phonetic: "pasta", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as pasta.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pasta.webp`,
  },
  {
    id: "cooking-oil",
    label: "Cooking Oil",
    phonetic: "cooking oil", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as cooking oil.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/cooking-oil.webp`,
  },
  {
    id: "salt",
    label: "Salt",
    phonetic: "salt", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as salt.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/salt.webp`,
  },
  {
    id: "sugar",
    label: "Sugar",
    phonetic: "sugar", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as sugar.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/sugar.webp`,
  },
  {
    id: "pepper",
    label: "Pepper",
    phonetic: "pepper", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as pepper.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pepper.webp`,
  },
  {
    id: "flour",
    label: "Flour",
    phonetic: "flour", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as flour.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/flour.webp`,
  },
  {
    id: "vinegar",
    label: "Vinegar",
    phonetic: "vinegar", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as vinegar.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/vinegar.webp`,
  },
  {
    id: "honey",
    label: "Honey",
    phonetic: "honey", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as honey.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/honey.webp`,
  },
];


export const LIVING_ROOM_TOPICS: TopicCategory[] = [
  {
    id: "seating-tables",
    name: "Seating & Tables",
    itemsCount: 10,
  },
  {
    id: "storage-display",
    name: "Storage & Display",
    itemsCount: 10,
  },
  {
    id: "electronics-media",
    name: "Electronics & Media",
    itemsCount: 10,
  },
  {
    id: "lighting-decor",
    name: "Lighting & Decor",
    itemsCount: 10,
  },
  {
    id: "soft-furnishings",
    name: "Soft & Furnishings",
    itemsCount: 10,
  },
  {
    id: "living-room-objects",
    name: "Living Room Objects",
    itemsCount: 9,
  },
];

export const LIVING_ROOM_GROUPS: Lesson[] = [
  {
    id: "living-room-seating-tables",
    name: "Seating & Tables",
    topicId: "seating-tables",
    description: "Learn vocabulary related to seating & tables.",
    wordIds: [
      "sofa",
      "armchair",
      "coffee-table",
      "side-table",
      "ottoman",
      "rocking-chair",
      "dining-table",
      "dining-chair",
      "bench",
      "stool",
    ],
  },
  {
    id: "living-room-storage-display",
    name: "Storage & Display",
    topicId: "storage-display",
    description: "Learn vocabulary related to storage & display.",
    wordIds: [
      "bookshelf",
      "tv-stand",
      "cabinet",
      "sideboard",
      "shelf",
      "drawer",
      "magazine-rack",
      "display-case",
      "coat-rack",
      "shoe-rack",
    ],
  },
  {
    id: "living-room-electronics-media",
    name: "Electronics & Media",
    topicId: "electronics-media",
    description: "Learn vocabulary related to electronics & media.",
    wordIds: [
      "television",
      "remote-control",
      "speaker",
      "game-console",
      "dvd-player",
      "sound-bar",
      "wi-fi-router",
      "power-strip",
      "cable",
      "plug",
    ],
  },
  {
    id: "living-room-lighting-decor",
    name: "Lighting & Decor",
    topicId: "lighting-decor",
    description: "Learn vocabulary related to lighting & decor.",
    wordIds: [
      "floor-lamp",
      "table-lamp",
      "ceiling-light",
      "chandelier",
      "light-bulb",
      "candle",
      "candle-holder",
      "string-lights",
      "picture-frame",
      "wall-clock",
    ],
  },
  {
    id: "living-room-soft-furnishings",
    name: "Soft & Furnishings",
    topicId: "soft-furnishings",
    description: "Learn vocabulary related to soft & furnishings.",
    wordIds: [
      "cushion",
      "throw-blanket",
      "rug",
      "carpet",
      "curtain",
      "tablecloth",
      "placemat",
      "coaster",
      "doormat",
      "tapestry",
    ],
  },
  {
    id: "living-room-living-room-objects",
    name: "Living Room Objects",
    topicId: "living-room-objects",
    description: "Learn vocabulary related to living room objects.",
    wordIds: [
      "plant",
      "vase",
      "photo-frame",
      "painting",
      "book",
      "magazine",
      "newspaper",
      "board-game",
      "puzzle",
    ],
  },
];

export const LIVING_ROOM_VOCABULARY: VocabularyItem[] = [
  {
    id: "sofa",
    label: "Sofa",
    phonetic: "sofa",
    img: `${LOCAL_WORD_IMAGES}/living-room/sofa.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "armchair",
    label: "Armchair",
    phonetic: "armchair",
    img: `${LOCAL_WORD_IMAGES}/living-room/armchair.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "coffee-table",
    label: "Coffee Table",
    phonetic: "coffee table",
    img: `${LOCAL_WORD_IMAGES}/living-room/coffee-table.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "side-table",
    label: "Side Table",
    phonetic: "side table",
    img: `${LOCAL_WORD_IMAGES}/living-room/side-table.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "ottoman",
    label: "Ottoman",
    phonetic: "ottoman",
    img: `${LOCAL_WORD_IMAGES}/living-room/ottoman.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "rocking-chair",
    label: "Rocking Chair",
    phonetic: "rocking chair",
    img: `${LOCAL_WORD_IMAGES}/living-room/rocking-chair.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "dining-table",
    label: "Dining Table",
    phonetic: "dining table",
    img: `${LOCAL_WORD_IMAGES}/living-room/dining-table.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "dining-chair",
    label: "Dining Chair",
    phonetic: "dining chair",
    img: `${LOCAL_WORD_IMAGES}/living-room/dining-chair.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "bench",
    label: "Bench",
    phonetic: "bench",
    img: `${LOCAL_WORD_IMAGES}/living-room/bench.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "stool",
    label: "Stool",
    phonetic: "stool",
    img: `${LOCAL_WORD_IMAGES}/living-room/stool.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "bookshelf",
    label: "Bookshelf",
    phonetic: "bookshelf",
    img: `${LOCAL_WORD_IMAGES}/living-room/bookshelf.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "tv-stand",
    label: "TV Stand",
    phonetic: "tv stand",
    img: `${LOCAL_WORD_IMAGES}/living-room/tv-stand.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "cabinet",
    label: "Cabinet",
    phonetic: "cabinet",
    img: `${LOCAL_WORD_IMAGES}/living-room/cabinet.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "sideboard",
    label: "Sideboard",
    phonetic: "sideboard",
    img: `${LOCAL_WORD_IMAGES}/living-room/sideboard.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "shelf",
    label: "Shelf",
    phonetic: "shelf",
    img: `${LOCAL_WORD_IMAGES}/living-room/shelf.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "drawer",
    label: "Drawer",
    phonetic: "drawer",
    img: `${LOCAL_WORD_IMAGES}/living-room/drawer.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "magazine-rack",
    label: "Magazine Rack",
    phonetic: "magazine rack",
    img: `${LOCAL_WORD_IMAGES}/living-room/magazine-rack.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "display-case",
    label: "Display Case",
    phonetic: "display case",
    img: `${LOCAL_WORD_IMAGES}/living-room/display-case.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "coat-rack",
    label: "Coat Rack",
    phonetic: "coat rack",
    img: `${LOCAL_WORD_IMAGES}/living-room/coat-rack.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "shoe-rack",
    label: "Shoe Rack",
    phonetic: "shoe rack",
    img: `${LOCAL_WORD_IMAGES}/living-room/shoe-rack.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "television",
    label: "Television",
    phonetic: "television",
    img: `${LOCAL_WORD_IMAGES}/living-room/television.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "remote-control",
    label: "Remote Control",
    phonetic: "remote control",
    img: `${LOCAL_WORD_IMAGES}/living-room/remote-control.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "speaker",
    label: "Speaker",
    phonetic: "speaker",
    img: `${LOCAL_WORD_IMAGES}/living-room/speaker.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "game-console",
    label: "Game Console",
    phonetic: "game console",
    img: `${LOCAL_WORD_IMAGES}/living-room/game-console.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "dvd-player",
    label: "DVD Player",
    phonetic: "dvd player",
    img: `${LOCAL_WORD_IMAGES}/living-room/dvd-player.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "sound-bar",
    label: "Sound Bar",
    phonetic: "sound bar",
    img: `${LOCAL_WORD_IMAGES}/living-room/sound-bar.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "wi-fi-router",
    label: "Wi-Fi Router",
    phonetic: "wi-fi router",
    img: `${LOCAL_WORD_IMAGES}/living-room/wi-fi-router.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "power-strip",
    label: "Power Strip",
    phonetic: "power strip",
    img: `${LOCAL_WORD_IMAGES}/living-room/power-strip.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "cable",
    label: "Cable",
    phonetic: "cable",
    img: `${LOCAL_WORD_IMAGES}/living-room/cable.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "plug",
    label: "Plug",
    phonetic: "plug",
    img: `${LOCAL_WORD_IMAGES}/living-room/plug.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "floor-lamp",
    label: "Floor Lamp",
    phonetic: "floor lamp",
    img: `${LOCAL_WORD_IMAGES}/living-room/floor-lamp.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "table-lamp",
    label: "Table Lamp",
    phonetic: "table lamp",
    img: `${LOCAL_WORD_IMAGES}/living-room/table-lamp.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "ceiling-light",
    label: "Ceiling Light",
    phonetic: "ceiling light",
    img: `${LOCAL_WORD_IMAGES}/living-room/ceiling-light.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "chandelier",
    label: "Chandelier",
    phonetic: "chandelier",
    img: `${LOCAL_WORD_IMAGES}/living-room/chandelier.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "light-bulb",
    label: "Light Bulb",
    phonetic: "light bulb",
    img: `${LOCAL_WORD_IMAGES}/living-room/light-bulb.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "candle",
    label: "Candle",
    phonetic: "candle",
    img: `${LOCAL_WORD_IMAGES}/living-room/candle.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "candle-holder",
    label: "Candle Holder",
    phonetic: "candle holder",
    img: `${LOCAL_WORD_IMAGES}/living-room/candle-holder.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "string-lights",
    label: "String Lights",
    phonetic: "string lights",
    img: `${LOCAL_WORD_IMAGES}/living-room/string-lights.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "picture-frame",
    label: "Picture Frame",
    phonetic: "picture frame",
    img: `${LOCAL_WORD_IMAGES}/living-room/picture-frame.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "wall-clock",
    label: "Wall Clock",
    phonetic: "wall clock",
    img: `${LOCAL_WORD_IMAGES}/living-room/wall-clock.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "cushion",
    label: "Cushion",
    phonetic: "cushion",
    img: `${LOCAL_WORD_IMAGES}/living-room/cushion.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "throw-blanket",
    label: "Throw Blanket",
    phonetic: "throw blanket",
    img: `${LOCAL_WORD_IMAGES}/living-room/throw-blanket.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "rug",
    label: "Rug",
    phonetic: "rug",
    img: `${LOCAL_WORD_IMAGES}/living-room/rug.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "carpet",
    label: "Carpet",
    phonetic: "carpet",
    img: `${LOCAL_WORD_IMAGES}/living-room/carpet.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "curtain",
    label: "Curtain",
    phonetic: "curtain",
    img: `${LOCAL_WORD_IMAGES}/living-room/curtain.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "tablecloth",
    label: "Tablecloth",
    phonetic: "tablecloth",
    img: `${LOCAL_WORD_IMAGES}/living-room/tablecloth.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "placemat",
    label: "Placemat",
    phonetic: "placemat",
    img: `${LOCAL_WORD_IMAGES}/living-room/placemat.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "coaster",
    label: "Coaster",
    phonetic: "coaster",
    img: `${LOCAL_WORD_IMAGES}/living-room/coaster.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "doormat",
    label: "Doormat",
    phonetic: "doormat",
    img: `${LOCAL_WORD_IMAGES}/living-room/doormat.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "tapestry",
    label: "Tapestry",
    phonetic: "tapestry",
    img: `${LOCAL_WORD_IMAGES}/living-room/tapestry.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "plant",
    label: "Plant",
    phonetic: "plant",
    img: `${LOCAL_WORD_IMAGES}/living-room/plant.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "vase",
    label: "Vase",
    phonetic: "vase",
    img: `${LOCAL_WORD_IMAGES}/living-room/vase.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "photo-frame",
    label: "Photo Frame",
    phonetic: "photo frame",
    img: `${LOCAL_WORD_IMAGES}/living-room/photo-frame.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "painting",
    label: "Painting",
    phonetic: "painting",
    img: `${LOCAL_WORD_IMAGES}/living-room/painting.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "book",
    label: "Book",
    phonetic: "book",
    img: `${LOCAL_WORD_IMAGES}/living-room/book.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "magazine",
    label: "Magazine",
    phonetic: "magazine",
    img: `${LOCAL_WORD_IMAGES}/living-room/magazine.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "newspaper",
    label: "Newspaper",
    phonetic: "newspaper",
    img: `${LOCAL_WORD_IMAGES}/living-room/newspaper.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "board-game",
    label: "Board Game",
    phonetic: "board game",
    img: `${LOCAL_WORD_IMAGES}/living-room/board-game.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "puzzle",
    label: "Puzzle",
    phonetic: "puzzle",
    img: `${LOCAL_WORD_IMAGES}/living-room/puzzle.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
];

export const FARM_VOCABULARY: Record<string, VocabularyItem> = {
  'cow': {
    id: 'cow',
    label: 'Cow',
    phonetic: '',
    img: '/word-images/farm/cow.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'pig': {
    id: 'pig',
    label: 'Pig',
    phonetic: '',
    img: '/word-images/farm/pig.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'sheep': {
    id: 'sheep',
    label: 'Sheep',
    phonetic: '',
    img: '/word-images/farm/sheep.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'chicken': {
    id: 'chicken',
    label: 'Chicken',
    phonetic: '',
    img: '/word-images/farm/chicken.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'horse': {
    id: 'horse',
    label: 'Horse',
    phonetic: '',
    img: '/word-images/farm/horse.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'goat': {
    id: 'goat',
    label: 'Goat',
    phonetic: '',
    img: '/word-images/farm/goat.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'duck': {
    id: 'duck',
    label: 'Duck',
    phonetic: '',
    img: '/word-images/farm/duck.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'rooster': {
    id: 'rooster',
    label: 'Rooster',
    phonetic: '',
    img: '/word-images/farm/rooster.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'turkey': {
    id: 'turkey',
    label: 'Turkey',
    phonetic: '',
    img: '/word-images/farm/turkey.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'donkey': {
    id: 'donkey',
    label: 'Donkey',
    phonetic: '',
    img: '/word-images/farm/donkey.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'rabbit': {
    id: 'rabbit',
    label: 'Rabbit',
    phonetic: '',
    img: '/word-images/farm/rabbit.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'goose': {
    id: 'goose',
    label: 'Goose',
    phonetic: '',
    img: '/word-images/farm/goose.webp',
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  'barn': {
    id: 'barn',
    label: 'Barn',
    phonetic: '',
    img: '/word-images/farm/barn.webp',
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  'farmhouse': {
    id: 'farmhouse',
    label: 'Farmhouse',
    phonetic: '',
    img: '/word-images/farm/farmhouse.webp',
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  'stable': {
    id: 'stable',
    label: 'Stable',
    phonetic: '',
    img: '/word-images/farm/stable.webp',
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  'hen-house': {
    id: 'hen-house',
    label: 'Hen House',
    phonetic: '',
    img: '/word-images/farm/hen-house.webp',
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  'silo': {
    id: 'silo',
    label: 'Silo',
    phonetic: '',
    img: '/word-images/farm/silo.webp',
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  'greenhouse': {
    id: 'greenhouse',
    label: 'Greenhouse',
    phonetic: '',
    img: '/word-images/farm/greenhouse.webp',
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  'shed': {
    id: 'shed',
    label: 'Shed',
    phonetic: '',
    img: '/word-images/farm/shed.webp',
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  'windmill': {
    id: 'windmill',
    label: 'Windmill',
    phonetic: '',
    img: '/word-images/farm/windmill.webp',
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  'well': {
    id: 'well',
    label: 'Well',
    phonetic: '',
    img: '/word-images/farm/well.webp',
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  'fence': {
    id: 'fence',
    label: 'Fence',
    phonetic: '',
    img: '/word-images/farm/fence.webp',
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  'tractor': {
    id: 'tractor',
    label: 'Tractor',
    phonetic: '',
    img: '/word-images/farm/tractor.webp',
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  'plow': {
    id: 'plow',
    label: 'Plow',
    phonetic: '',
    img: '/word-images/farm/plow.webp',
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  'trailer': {
    id: 'trailer',
    label: 'Trailer',
    phonetic: '',
    img: '/word-images/farm/trailer.webp',
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  'wheelbarrow': {
    id: 'wheelbarrow',
    label: 'Wheelbarrow',
    phonetic: '',
    img: '/word-images/farm/wheelbarrow.webp',
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  'pitchfork': {
    id: 'pitchfork',
    label: 'Pitchfork',
    phonetic: '',
    img: '/word-images/farm/pitchfork.webp',
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  'shovel': {
    id: 'shovel',
    label: 'Shovel',
    phonetic: '',
    img: '/word-images/farm/shovel.webp',
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  'hoe': {
    id: 'hoe',
    label: 'Hoe',
    phonetic: '',
    img: '/word-images/farm/hoe.webp',
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  'rake': {
    id: 'rake',
    label: 'Rake',
    phonetic: '',
    img: '/word-images/farm/rake.webp',
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  'bucket': {
    id: 'bucket',
    label: 'Bucket',
    phonetic: '',
    img: '/word-images/farm/bucket.webp',
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  'watering-can': {
    id: 'watering-can',
    label: 'Watering Can',
    phonetic: '',
    img: '/word-images/farm/watering-can.webp',
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  'milk': {
    id: 'milk',
    label: 'Milk',
    phonetic: '',
    img: '/word-images/farm/milk.webp',
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  'egg': {
    id: 'egg',
    label: 'Egg',
    phonetic: '',
    img: '/word-images/farm/egg.webp',
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  'wool': {
    id: 'wool',
    label: 'Wool',
    phonetic: '',
    img: '/word-images/farm/wool.webp',
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  'cheese': {
    id: 'cheese',
    label: 'Cheese',
    phonetic: '',
    img: '/word-images/farm/cheese.webp',
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  'butter': {
    id: 'butter',
    label: 'Butter',
    phonetic: '',
    img: '/word-images/farm/butter.webp',
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  'honey': {
    id: 'honey',
    label: 'Honey',
    phonetic: '',
    img: '/word-images/farm/honey.webp',
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  'hay': {
    id: 'hay',
    label: 'Hay',
    phonetic: '',
    img: '/word-images/farm/hay.webp',
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  'straw': {
    id: 'straw',
    label: 'Straw',
    phonetic: '',
    img: '/word-images/farm/straw.webp',
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  'flour': {
    id: 'flour',
    label: 'Flour',
    phonetic: '',
    img: '/word-images/farm/flour.webp',
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  'jam': {
    id: 'jam',
    label: 'Jam',
    phonetic: '',
    img: '/word-images/farm/jam.webp',
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  'farmer': {
    id: 'farmer',
    label: 'Farmer',
    phonetic: '',
    img: '/word-images/farm/farmer.webp',
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  'scarecrow': {
    id: 'scarecrow',
    label: 'Scarecrow',
    phonetic: '',
    img: '/word-images/farm/scarecrow.webp',
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  'dog': {
    id: 'dog',
    label: 'Dog',
    phonetic: '',
    img: '/word-images/farm/dog.webp',
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  'cat': {
    id: 'cat',
    label: 'Cat',
    phonetic: '',
    img: '/word-images/farm/cat.webp',
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  'pond': {
    id: 'pond',
    label: 'Pond',
    phonetic: '',
    img: '/word-images/farm/pond.webp',
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  'mud': {
    id: 'mud',
    label: 'Mud',
    phonetic: '',
    img: '/word-images/farm/mud.webp',
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  'sunrise': {
    id: 'sunrise',
    label: 'Sunrise',
    phonetic: '',
    img: '/word-images/farm/sunrise.webp',
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  'sunset': {
    id: 'sunset',
    label: 'Sunset',
    phonetic: '',
    img: '/word-images/farm/sunset.webp',
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  'rain': {
    id: 'rain',
    label: 'Rain',
    phonetic: '',
    img: '/word-images/farm/rain.webp',
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  'harvest': {
    id: 'harvest',
    label: 'Harvest',
    phonetic: '',
    img: '/word-images/farm/harvest.webp',
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
};

export const FARM_TOPICS: Record<string, TopicCategory> = {
  'farm-farm-animals': {
    id: 'farm-farm-animals',
    name: 'Farm Animals',
    itemsCount: 12
  },
  'farm-farm-buildings': {
    id: 'farm-farm-buildings',
    name: 'Farm Buildings',
    itemsCount: 10
  },
  'farm-farm-equipment': {
    id: 'farm-farm-equipment',
    name: 'Farm Equipment',
    itemsCount: 10
  },
  'farm-farm-products': {
    id: 'farm-farm-products',
    name: 'Farm Products',
    itemsCount: 10
  },
  'farm-farm-life': {
    id: 'farm-farm-life',
    name: 'Farm Life',
    itemsCount: 10
  },
};

export const FARM_GROUPS: Lesson[] = [
  {
    id: 'farm-farm-animals-1',
    name: 'Farm Animals 1',
    topicId: 'farm-farm-animals',
    wordIds: ['cow', 'pig', 'sheep', 'chicken', 'horse'],
    description: 'Learn about farm animals 1.'
  },
  {
    id: 'farm-farm-animals-2',
    name: 'Farm Animals 2',
    topicId: 'farm-farm-animals',
    wordIds: ['goat', 'duck', 'rooster', 'turkey', 'donkey'],
    description: 'Learn about farm animals 2.'
  },
  {
    id: 'farm-farm-animals-3',
    name: 'Farm Animals 3',
    topicId: 'farm-farm-animals',
    wordIds: ['rabbit', 'goose'],
    description: 'Learn about farm animals 3.'
  },
  {
    id: 'farm-farm-buildings-1',
    name: 'Farm Buildings 1',
    topicId: 'farm-farm-buildings',
    wordIds: ['barn', 'farmhouse', 'stable', 'hen-house', 'silo'],
    description: 'Learn about farm buildings 1.'
  },
  {
    id: 'farm-farm-buildings-2',
    name: 'Farm Buildings 2',
    topicId: 'farm-farm-buildings',
    wordIds: ['greenhouse', 'shed', 'windmill', 'well', 'fence'],
    description: 'Learn about farm buildings 2.'
  },
  {
    id: 'farm-farm-equipment-1',
    name: 'Farm Equipment 1',
    topicId: 'farm-farm-equipment',
    wordIds: ['tractor', 'plow', 'trailer', 'wheelbarrow', 'pitchfork'],
    description: 'Learn about farm equipment 1.'
  },
  {
    id: 'farm-farm-equipment-2',
    name: 'Farm Equipment 2',
    topicId: 'farm-farm-equipment',
    wordIds: ['shovel', 'hoe', 'rake', 'bucket', 'watering-can'],
    description: 'Learn about farm equipment 2.'
  },
  {
    id: 'farm-farm-products-1',
    name: 'Farm Products 1',
    topicId: 'farm-farm-products',
    wordIds: ['milk', 'egg', 'wool', 'cheese', 'butter'],
    description: 'Learn about farm products 1.'
  },
  {
    id: 'farm-farm-products-2',
    name: 'Farm Products 2',
    topicId: 'farm-farm-products',
    wordIds: ['honey', 'hay', 'straw', 'flour', 'jam'],
    description: 'Learn about farm products 2.'
  },
  {
    id: 'farm-farm-life-1',
    name: 'Farm Life 1',
    topicId: 'farm-farm-life',
    wordIds: ['farmer', 'scarecrow', 'dog', 'cat', 'pond'],
    description: 'Learn about farm life 1.'
  },
  {
    id: 'farm-farm-life-2',
    name: 'Farm Life 2',
    topicId: 'farm-farm-life',
    wordIds: ['mud', 'sunrise', 'sunset', 'rain', 'harvest'],
    description: 'Learn about farm life 2.'
  },
];

export const COURSE_UNITS: Record<string, CourseUnit> = {
  kitchen: {
    id: "kitchen",
    name: "The Kitchen",
    description: "Explore real-life kitchen appliances, cookware, and accessories through 2D scene discovery, audio practice, recall matching, and sentence building.",
    heroImage: `${LOCAL_SCENE_IMAGES}/kitchen-scene.webp`,
    topics: KITCHEN_TOPICS,
    groups: KITCHEN_GROUPS,
    vocabulary: KITCHEN_VOCABULARY,
  },
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

  "living-room": {
    id: "living-room",
    name: "The Living Room",
    description: "Explore real-life living room furniture and electronics through 2D scene discovery, audio practice, recall matching, and sentence building.",
    heroImage: `${LOCAL_SCENE_IMAGES}/kitchen-scene.webp`, // Reusing image since we don't have a hero image for living room yet
    topics: LIVING_ROOM_TOPICS,
    groups: LIVING_ROOM_GROUPS,
    vocabulary: LIVING_ROOM_VOCABULARY,
  },
};

/** The world a learner lands in when nothing else specifies one. */
export const DEFAULT_UNIT_ID = "bedroom";

/** O(1) id lookup across every world's vocabulary, not just one. */
export const ALL_VOCABULARY = Object.values(COURSE_UNITS).flatMap((world) => world.vocabulary);
export const VOCAB_BY_ID = new Map(
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
export const ALL_GROUPS = Object.values(COURSE_UNITS).flatMap((world) => world.groups);

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
