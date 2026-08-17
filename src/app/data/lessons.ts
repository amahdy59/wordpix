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
  story?: string;
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
    id: "furniture",
    name: "Furniture",
    topicId: "furniture",
    wordIds: ['bed','nightstand','dresser','wardrobe','desk','chair','bookshelf','mirror','stool','chest-of-drawers'],
    description: "Learn about furniture.",
    story: "When moving into the new bedroom, the heavy bed was placed first. Next to it went the small nightstand for a lamp. The tall dresser was moved near the wall, while the large wardrobe held all the hanging clothes. Finally, a sturdy desk was added in the corner for studying. Sarah sat on her comfortable chair by the window. She organized her favorite novels on the wooden bookshelf. Glancing at the shiny mirror on the wall, she decided to pull up a small stool to reach the top shelf of the old chest-of-drawers."
  },
  {
    id: "bedding",
    name: "Bedding & Linen",
    topicId: "bedding",
    wordIds: ['pillow','blanket','sheet','mattress','duvet','pillowcase','comforter','cushion','bed-frame','headboard'],
    description: "Learn about bedding & linen.",
    story: "Before sleeping, he fluffed his soft pillow and pulled up the warm blanket. The fresh, crisp sheet felt wonderful after a long day. The thick duvet kept the winter chill away, and the patterned bedspread added a pop of color to the room. She washed the pillowcase along with the rest of the laundry. The new mattress was incredibly supportive, and the soft mattress-pad made it even cozier. She draped a decorative throw-blanket over the edge and added a fluffy cushion for extra comfort."
  },
  {
    id: "features",
    name: "Room Features",
    topicId: "features",
    wordIds: ['lamp','curtain','window','door','rug','carpet','ceiling-light','light-switch','blinds','outlet'],
    description: "Learn about room features.",
    story: "Sunlight streamed through the open window, warming the wooden floor. The thick door was closed for privacy. A bright light illuminated the space, reflecting off the white wall. The smooth ceiling was painted white to make the room look taller. A small rug covered the center of the room. The cozy carpet was soft underfoot, and the closed curtain kept the streetlights out at night. He reached for the switch to turn off the overhead light."
  },
  {
    id: "objects",
    name: "Bedroom Objects",
    topicId: "objects",
    wordIds: ['alarm-clock','picture-frame','clock','plant','vase','candle','calendar','tissue-box','wastebasket','hanger'],
    description: "Learn about bedroom objects.",
    story: "In the Bedroom Objects 1 lesson, we learned about some very useful things. For example, we saw the alarm-clock and the picture-frame. We also explored how the clock works. Finally, we looked at the plant and the vase to complete our understanding. In the Bedroom Objects 2 lesson, we learned about some very useful things. For example, we saw the candle and the calendar. We also explored how the tissue-box works. Finally, we looked at the wastebasket and the hanger to complete our understanding."
  },
  {
    id: "personal",
    name: "Personal Items",
    topicId: "personal",
    wordIds: ['pajamas','slippers','robe','teddy-bear','poster','books','photo-album','glasses','backpack','jewelry-box'],
    description: "Learn about personal items.",
    story: "He tossed his heavy backpack onto the floor. The new clothes were neatly folded. A warm sweater was left on the chair, next to a clean shirt and a pair of blue jeans. His left shoe was missing, so he checked under the bed. He found a clean sock and a warm jacket hanging in the closet. His winter coat was draped over a chair, next to a comfortable hat."
  },
  {
    id: "electronics",
    name: "Electronics",
    topicId: "electronics",
    wordIds: ['phone','charger','laptop','headphones','tablet','speaker','reading-light','remote-control'],
    description: "Learn about electronics.",
    story: "The television was turned on to watch the morning news. His laptop was charging on the desk. He answered the ringing phone while listening to the radio and adjusting his loud alarm. He plugged his charger into the wall socket. The small fan kept the room cool during the summer. A bright lightbulb illuminated the desk, and he left his tablet next to his favorite video-game."
  },
];

export const BEDROOM_VOCABULARY: VocabularyItem[] = [
  {
    id: "bed",
    label: "Bed",
    phonetic: "bɛd",
    topic: "furniture",
    description: "A large rectangular platform with a soft top, where a person lies down to sleep.",
    img: `${LOCAL_WORD_IMAGES}/bed.webp`,
  },
  {
    id: "nightstand",
    label: "Nightstand",
    phonetic: "ˈnaɪtˌstænd",
    topic: "furniture",
    description: "A small low table beside the place you sleep, holding a lamp or a book.",
    img: `${LOCAL_WORD_IMAGES}/nightstand.webp`,
  },
  {
    id: "dresser",
    label: "Dresser",
    phonetic: "ˈdɹɛsɚ",
    topic: "furniture",
    description: "A wide, low piece of furniture with several sliding compartments for folded clothes.",
    img: `${LOCAL_WORD_IMAGES}/dresser.webp`,
  },
  {
    id: "wardrobe",
    label: "Wardrobe",
    phonetic: " ˈwɔːdɹəʊb",
    topic: "furniture",
    description: "A tall cupboard with doors, where clothes hang from a rail inside.",
    img: `${LOCAL_WORD_IMAGES}/wardrobe.webp`,
  },
  {
    id: "desk",
    label: "Desk",
    phonetic: "dɛsk",
    topic: "furniture",
    description: "A flat work surface on legs, where you sit to write or use a computer.",
    img: `${LOCAL_WORD_IMAGES}/desk.webp`,
  },
  {
    id: "chair",
    label: "Chair",
    phonetic: "tʃɛɹ",
    topic: "furniture",
    description: "A single seat with a back and four legs, for one person.",
    img: `${LOCAL_WORD_IMAGES}/chair.webp`,
  },
  {
    id: "bookshelf",
    label: "Bookshelf",
    phonetic: "ˈbʊkˌʃɛlf",
    topic: "furniture",
    description: "An upright frame of horizontal boards for storing reading material.",
    img: `${LOCAL_WORD_IMAGES}/bookshelf.webp`,
  },
  {
    id: "mirror",
    label: "Mirror",
    phonetic: "ˈmɘ.ɹɘ",
    topic: "furniture",
    description: "A flat glass panel that shows your own reflection.",
    img: `${LOCAL_WORD_IMAGES}/mirror.webp`,
  },
  {
    id: "stool",
    label: "Stool",
    phonetic: "stul",
    topic: "furniture",
    description: "A small backless seat raised on three or four legs.",
    img: `${LOCAL_WORD_IMAGES}/stool.webp`,
  },
  {
    id: "chest-of-drawers",
    label: "Chest Of Drawers",
    phonetic: "tʃɛst ʌv dɹɔɹz",
    topic: "furniture",
    description: "A tall, narrow tower of stacked sliding compartments for storing clothes.",
    img: `${LOCAL_WORD_IMAGES}/chest-of-drawers.webp`,
  },
  {
    id: "pillow",
    label: "Pillow",
    phonetic: "ˈpɪloʊ",
    topic: "bedding",
    description: "A soft rectangular pad that supports your head while you sleep.",
    img: `${LOCAL_WORD_IMAGES}/pillow.webp`,
  },
  {
    id: "blanket",
    label: "Blanket",
    phonetic: "ˈblæŋkɪt",
    topic: "bedding",
    description: "A thick woven cover, often wool, laid over you for warmth.",
    img: `${LOCAL_WORD_IMAGES}/blanket.webp`,
  },
  {
    id: "sheet",
    label: "Sheet",
    phonetic: "ʃiːt",
    topic: "bedding",
    description: "A large, thin, flat piece of fabric that lies directly against your skin.",
    img: `${LOCAL_WORD_IMAGES}/sheet.webp`,
  },
  {
    id: "mattress",
    label: "Mattress",
    phonetic: "ˈmætɹəs",
    topic: "bedding",
    description: "The thick padded slab you lie directly on top of.",
    img: `${LOCAL_WORD_IMAGES}/mattress.webp`,
  },
  {
    id: "duvet",
    label: "Duvet",
    phonetic: "ˈduːveɪ",
    topic: "bedding",
    description: "A soft filled bag stuffed with feathers, used as a single thick top cover.",
    img: `${LOCAL_WORD_IMAGES}/duvet.webp`,
  },
  {
    id: "pillowcase",
    label: "Pillowcase",
    phonetic: "ˈpɪloʊˌkeɪs",
    topic: "bedding",
    description: "A fabric sleeve that slips over the soft pad under your head.",
    img: `${LOCAL_WORD_IMAGES}/pillowcase.webp`,
  },
  {
    id: "comforter",
    label: "Comforter",
    phonetic: "ˈkʌmfɚtɚ",
    topic: "bedding",
    description: "A thick fluffy top cover, stitched into sections, needing no separate cover.",
    img: `${LOCAL_WORD_IMAGES}/comforter.webp`,
  },
  {
    id: "cushion",
    label: "Cushion",
    phonetic: "ˈkʊʃən",
    topic: "bedding",
    description: "A small soft square pad for sitting on or leaning against.",
    img: `${LOCAL_WORD_IMAGES}/cushion.webp`,
  },
  {
    id: "bed-frame",
    label: "Bed Frame",
    phonetic: "bɛd fɹeɪm",
    topic: "bedding",
    description: "The wooden or metal structure that holds a mattress up off the floor.",
    img: `${LOCAL_WORD_IMAGES}/bed-frame.webp`,
  },
  {
    id: "headboard",
    label: "Headboard",
    phonetic: "ˈhɛdˌbɔɹd",
    topic: "bedding",
    description: "The upright panel at the top end of a sleeping platform, behind your head.",
    img: `${LOCAL_WORD_IMAGES}/headboard.webp`,
  },
  {
    id: "lamp",
    label: "Lamp",
    phonetic: "læmp",
    topic: "features",
    description: "A small light on a base that stands on a table.",
    img: `${LOCAL_WORD_IMAGES}/lamp.webp`,
  },
  {
    id: "curtain",
    label: "Curtain",
    phonetic: "ˈkɝtən",
    topic: "features",
    description: "A long piece of hanging fabric drawn across a window at night.",
    img: `${LOCAL_WORD_IMAGES}/curtain.webp`,
  },
  {
    id: "window",
    label: "Window",
    phonetic: "ˈwɪndəʊ",
    topic: "features",
    description: "A glass opening in the wall that lets daylight into the room.",
    img: `${LOCAL_WORD_IMAGES}/window.webp`,
  },
  {
    id: "door",
    label: "Door",
    phonetic: "dɔː",
    topic: "features",
    description: "A hinged panel you open to enter or leave a room.",
    img: `${LOCAL_WORD_IMAGES}/door.webp`,
  },
  {
    id: "rug",
    label: "Rug",
    phonetic: "ɹʌɡ",
    topic: "features",
    description: "A small soft floor covering that lies loose on top of the floor.",
    img: `${LOCAL_WORD_IMAGES}/rug.webp`,
  },
  {
    id: "carpet",
    label: "Carpet",
    phonetic: "ˈkɑː(ɹ)pɪt",
    topic: "features",
    description: "A soft floor covering fixed down permanently, reaching from wall to wall.",
    img: `${LOCAL_WORD_IMAGES}/carpet.webp`,
  },
  {
    id: "ceiling-light",
    label: "Ceiling Light",
    phonetic: "ˈsilɪŋ laɪt",
    topic: "features",
    description: "A fixture mounted overhead that brightens the whole room from above.",
    img: `${LOCAL_WORD_IMAGES}/ceiling-light.webp`,
  },
  {
    id: "light-switch",
    label: "Light Switch",
    phonetic: "laɪt swɪtʃ",
    topic: "features",
    description: "A small plate on the wall you press to make the room bright or dark.",
    img: `${LOCAL_WORD_IMAGES}/light-switch.webp`,
  },
  {
    id: "blinds",
    label: "Blinds",
    phonetic: "blaɪndz",
    topic: "features",
    description: "Horizontal slats across a window that tilt to control the daylight.",
    img: `${LOCAL_WORD_IMAGES}/blinds.webp`,
  },
  {
    id: "outlet",
    label: "Outlet",
    phonetic: "ˈaʊtlət",
    topic: "features",
    description: "A small socket in the wall where you plug in electrical devices.",
    img: `${LOCAL_WORD_IMAGES}/outlet.webp`,
  },
  {
    id: "alarm-clock",
    label: "Alarm Clock",
    phonetic: "əˈlɑːm klɒk",
    topic: "objects",
    description: "A small bedside device that shows the time and wakes you with a sound.",
    img: `${LOCAL_WORD_IMAGES}/alarm-clock.webp`,
  },
  {
    id: "picture-frame",
    label: "Picture Frame",
    phonetic: "ˈpɪktʃɚ fɹeɪm",
    topic: "objects",
    description: "A decorative border that holds a photograph upright on a surface.",
    img: `${LOCAL_WORD_IMAGES}/picture-frame.webp`,
  },
  {
    id: "clock",
    label: "Clock",
    phonetic: "klɒk",
    topic: "objects",
    description: "A round face with moving hands that shows the time.",
    img: `${LOCAL_WORD_IMAGES}/clock.webp`,
  },
  {
    id: "plant",
    label: "Plant",
    phonetic: "plænt",
    topic: "objects",
    description: "A living green thing growing in a pot of soil.",
    img: `${LOCAL_WORD_IMAGES}/plant.webp`,
  },
  {
    id: "vase",
    label: "Vase",
    phonetic: "veɪs",
    topic: "objects",
    description: "A tall narrow container that holds cut flowers in water.",
    img: `${LOCAL_WORD_IMAGES}/vase.webp`,
  },
  {
    id: "candle",
    label: "Candle",
    phonetic: "ˈkændl̩",
    topic: "objects",
    description: "A wax cylinder with a wick that gives light when it burns.",
    img: `${LOCAL_WORD_IMAGES}/candle.webp`,
  },
  {
    id: "calendar",
    label: "Calendar",
    phonetic: "ˈkæləndɚ",
    topic: "objects",
    description: "A grid of numbered days used to keep track of dates.",
    img: `${LOCAL_WORD_IMAGES}/calendar.webp`,
  },
  {
    id: "tissue-box",
    label: "Tissue Box",
    phonetic: "ˈtɪʃu bɑks",
    topic: "objects",
    description: "A small carton that dispenses soft disposable paper, one sheet at a time.",
    img: `${LOCAL_WORD_IMAGES}/tissue-box.webp`,
  },
  {
    id: "wastebasket",
    label: "Wastebasket",
    phonetic: "ˈweɪstˌbæskɪt",
    topic: "objects",
    description: "A small open container for discarding paper and light trash.",
    img: `${LOCAL_WORD_IMAGES}/wastebasket.webp`,
  },
  {
    id: "hanger",
    label: "Hanger",
    phonetic: "ˈhæŋɚ",
    topic: "objects",
    description: "A shaped hook that keeps a shirt or coat suspended in a cupboard.",
    img: `${LOCAL_WORD_IMAGES}/hanger.webp`,
  },
  {
    id: "pajamas",
    label: "Pajamas",
    phonetic: "pəˈdʒɑməz",
    topic: "personal",
    description: "Soft, loose two-piece clothing worn only for sleeping.",
    img: `${LOCAL_WORD_IMAGES}/pajamas.webp`,
  },
  {
    id: "slippers",
    label: "Slippers",
    phonetic: "ˈslɪpɚz",
    topic: "personal",
    description: "Soft indoor shoes you slide your feet into without fastening.",
    img: `${LOCAL_WORD_IMAGES}/slippers.webp`,
  },
  {
    id: "robe",
    label: "Robe",
    phonetic: "ɹoʊb",
    topic: "personal",
    description: "A loose belted garment worn over sleepwear, often after a bath.",
    img: `${LOCAL_WORD_IMAGES}/robe.webp`,
  },
  {
    id: "teddy-bear",
    label: "Teddy Bear",
    phonetic: "ˈtɛdi bɛɹ",
    topic: "personal",
    description: "A soft, stuffed toy animal shaped like a small cub.",
    img: `${LOCAL_WORD_IMAGES}/teddy-bear.webp`,
  },
  {
    id: "poster",
    label: "Poster",
    phonetic: "ˈpoʊstɚ",
    topic: "personal",
    description: "A large printed sheet fixed flat against a wall for decoration.",
    img: `${LOCAL_WORD_IMAGES}/poster.webp`,
  },
  {
    id: "books",
    label: "Books",
    phonetic: "bʊks",
    topic: "personal",
    description: "Bound stacks of printed pages that you read.",
    img: `${LOCAL_WORD_IMAGES}/books.webp`,
  },
  {
    id: "photo-album",
    label: "Photo Album",
    phonetic: "ˈfoʊˌtoʊ ˈælbəm",
    topic: "personal",
    description: "A bound book of pages holding printed family pictures behind plastic.",
    img: `${LOCAL_WORD_IMAGES}/photo-album.webp`,
  },
  {
    id: "glasses",
    label: "Glasses",
    phonetic: "ˈglæsəz",
    topic: "personal",
    description: "Two lenses held in a frame, worn on the face to see clearly.",
    img: `${LOCAL_WORD_IMAGES}/glasses.webp`,
  },
  {
    id: "backpack",
    label: "Backpack",
    phonetic: "ˈbækˌpæk",
    topic: "personal",
    description: "A bag with two shoulder straps, carried on your back.",
    img: `${LOCAL_WORD_IMAGES}/backpack.webp`,
  },
  {
    id: "jewelry-box",
    label: "Jewelry Box",
    phonetic: "ˈdʒuəlɹi bɑks",
    topic: "personal",
    description: "A small decorative container for storing rings, necklaces, and valuables.",
    img: `${LOCAL_WORD_IMAGES}/jewelry-box.webp`,
  },
  {
    id: "phone",
    label: "Phone",
    phonetic: "foʊn",
    topic: "electronics",
    description: "A small handheld device used for calls and messages.",
    img: `${LOCAL_WORD_IMAGES}/phone.webp`,
  },
  {
    id: "charger",
    label: "Charger",
    phonetic: "ˈtʃɑɹdʒɚ",
    topic: "electronics",
    description: "A cable and plug that restores battery power to a device.",
    img: `${LOCAL_WORD_IMAGES}/charger.webp`,
  },
  {
    id: "laptop",
    label: "Laptop",
    phonetic: "ˈlæpˌtɑp",
    topic: "electronics",
    description: "A portable computer that folds shut like a book.",
    img: `${LOCAL_WORD_IMAGES}/laptop.webp`,
  },
  {
    id: "headphones",
    label: "Headphones",
    phonetic: "ˈhɛdˌfoʊnz",
    topic: "electronics",
    description: "Two padded cups joined by a band, worn over the ears.",
    img: `${LOCAL_WORD_IMAGES}/headphones.webp`,
  },
  {
    id: "tablet",
    label: "Tablet",
    phonetic: "ˈtæblət",
    topic: "electronics",
    description: "A flat touchscreen slab, larger than a handheld, with no keyboard.",
    img: `${LOCAL_WORD_IMAGES}/tablet.webp`,
  },
  {
    id: "speaker",
    label: "Speaker",
    phonetic: "ˈspikɚ",
    topic: "electronics",
    description: "A box that plays sound out loud into the room.",
    img: `${LOCAL_WORD_IMAGES}/speaker.webp`,
  },
  {
    id: "reading-light",
    label: "Reading Light",
    phonetic: "ˈɹɛdɪŋ laɪt",
    topic: "electronics",
    description: "A small adjustable lamp on a flexible arm, aimed down at a page.",
    img: `${LOCAL_WORD_IMAGES}/reading-light.webp`,
  },
  {
    id: "remote-control",
    label: "Remote Control",
    phonetic: "ɹɪˈmoʊt kənˈtɹoʊl",
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
    id: "large-appliances",
    name: "Large Appliances",
    topicId: "large-appliances",
    wordIds: ['refrigerator','stove','oven','microwave','dishwasher','toaster','blender','kettle','coffee-maker','freezer'],
    description: "Learn about large appliances.",
    story: "In the Large Appliances lesson, we learned about some very useful things. For example, we saw the refrigerator and the stove. We also explored how the oven works. Finally, we looked at the microwave and the dishwasher to complete our understanding. In the Large Appliances 2 lesson, we learned about some very useful things. For example, we saw the toaster and the blender. We also explored how the kettle works. Finally, we looked at the coffee-maker and the freezer to complete our understanding."
  },
  {
    id: "cookware",
    name: "Cookware",
    topicId: "cookware",
    wordIds: ['pot','pan','frying-pan','baking-tray','saucepan','wok','casserole-dish','baking-dish','steamer','pressure-cooker'],
    description: "Learn about cookware.",
    story: "She placed the heavy pot on the stove to boil water. A large pan was perfect for frying eggs, while a deep saucepan held the simmering tomato sauce. The curved wok was ready for a quick stir-fry, and the iron skillet gave the steak a perfect sear. The deep baking-dish was filled with a rich lasagna. Cookies were arranged on the flat baking-tray before entering the oven. She used a round cake-pan for the birthday dessert, a versatile roasting-pan for the Sunday chicken, and a large casserole-dish for the family dinner."
  },
  {
    id: "utensils-tools",
    name: "Utensils Tools",
    topicId: "utensils-tools",
    wordIds: ['fork','knife','spoon','spatula','ladle','whisk','tongs','peeler','grater','rolling-pin','can-opener','corkscrew'],
    description: "Learn about utensils tools.",
    story: "In the Utensils Tools 1 lesson, we learned about some very useful things. For example, we saw the fork and the knife. We also explored how the spoon works. Finally, we looked at the spatula and the ladle to complete our understanding. In the Utensils Tools 2 lesson, we learned about some very useful things. For example, we saw the whisk and the tongs. We also explored how the peeler works. Finally, we looked at the grater and the rolling-pin to complete our understanding. In the Utensils Tools 3 lesson, we learned about some very useful things. For example, we saw the can-opener and the corkscrew. We also explored how the undefined works. Finally, we looked at the undefined and the undefined to complete our understanding."
  },
  {
    id: "dishes-containers",
    name: "Dishes Containers",
    topicId: "dishes-containers",
    wordIds: ['plate','bowl','mug','glass','cup','saucer','cutting-board','colander','measuring-cup','measuring-spoon','mixing-bowl','pitcher'],
    description: "Learn about dishes containers.",
    story: "In the Dishes Containers 1 lesson, we learned about some very useful things. For example, we saw the plate and the bowl. We also explored how the mug works. Finally, we looked at the glass and the cup to complete our understanding. In the Dishes Containers 2 lesson, we learned about some very useful things. For example, we saw the saucer and the cutting-board. We also explored how the colander works. Finally, we looked at the measuring-cup and the measuring-spoon to complete our understanding. In the Dishes Containers 3 lesson, we learned about some very useful things. For example, we saw the mixing-bowl and the pitcher. We also explored how the undefined works. Finally, we looked at the undefined and the undefined to complete our understanding."
  },
  {
    id: "kitchen-items",
    name: "Kitchen Items",
    topicId: "kitchen-items",
    wordIds: ['dish-towel','oven-mitt','apron','trash-can','paper-towel','plastic-wrap','aluminum-foil','food-container','sponge','dish-soap','dish-rack','cling-film'],
    description: "Learn about kitchen items.",
    story: "In the Kitchen Items 1 lesson, we learned about some very useful things. For example, we saw the dish-towel and the oven-mitt. We also explored how the apron works. Finally, we looked at the trash-can and the paper-towel to complete our understanding. In the Kitchen Items 2 lesson, we learned about some very useful things. For example, we saw the plastic-wrap and the aluminum-foil. We also explored how the food-container works. Finally, we looked at the sponge and the dish-soap to complete our understanding. In the Kitchen Items 3 lesson, we learned about some very useful things. For example, we saw the dish-rack and the cling-film. We also explored how the undefined works. Finally, we looked at the undefined and the undefined to complete our understanding."
  },
  {
    id: "basic-pantry",
    name: "Basic Pantry",
    topicId: "basic-pantry",
    wordIds: ['bread','butter','milk','egg','cheese','rice','pasta','cooking-oil','salt','sugar','pepper','flour','vinegar','honey'],
    description: "Learn about basic pantry.",
    story: "In the Basic Pantry 1 lesson, we learned about some very useful things. For example, we saw the bread and the butter. We also explored how the milk works. Finally, we looked at the egg and the cheese to complete our understanding. In the Basic Pantry 2 lesson, we learned about some very useful things. For example, we saw the rice and the pasta. We also explored how the cooking-oil works. Finally, we looked at the salt and the sugar to complete our understanding. In the Basic Pantry 3 lesson, we learned about some very useful things. For example, we saw the pepper and the flour. We also explored how the vinegar works. Finally, we looked at the honey and the undefined to complete our understanding."
  },
];

export const KITCHEN_VOCABULARY: VocabularyItem[] = [
  {
    id: "refrigerator",
    label: "Refrigerator",
    phonetic: "ɹɪˈfɹɪdʒəˌɹeɪtɚ", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as refrigerator.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/refrigerator.webp`,
  },
  {
    id: "stove",
    label: "Stove",
    phonetic: "stoʊv", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as stove.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/stove.webp`,
  },
  {
    id: "oven",
    label: "Oven",
    phonetic: "ˈʌvən", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as oven.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/oven.webp`,
  },
  {
    id: "microwave",
    label: "Microwave",
    phonetic: "ˈmaɪkɹəˌweɪv", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as microwave.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/microwave.webp`,
  },
  {
    id: "dishwasher",
    label: "Dishwasher",
    phonetic: "ˈdɪʃˌwɑʃɚ", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as dishwasher.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/dishwasher.webp`,
  },
  {
    id: "toaster",
    label: "Toaster",
    phonetic: "ˈtoʊstɚ", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as toaster.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/toaster.webp`,
  },
  {
    id: "blender",
    label: "Blender",
    phonetic: "ˈblɛndɚ", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as blender.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/blender.webp`,
  },
  {
    id: "kettle",
    label: "Kettle",
    phonetic: "ˈkɛtəl", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as kettle.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/kettle.webp`,
  },
  {
    id: "coffee-maker",
    label: "Coffee Maker",
    phonetic: "ˈkɑfi ˈmeɪkɚ", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as coffee maker.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/coffee-maker.webp`,
  },
  {
    id: "freezer",
    label: "Freezer",
    phonetic: "ˈfɹizɚ", // Using label as phonetic placeholder
    topic: "large-appliances",
    description: "A kitchen item known as freezer.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/freezer.webp`,
  },
  {
    id: "pot",
    label: "Pot",
    phonetic: "pɑt", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as pot.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pot.webp`,
  },
  {
    id: "pan",
    label: "Pan",
    phonetic: "pæn", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as pan.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pan.webp`,
  },
  {
    id: "frying-pan",
    label: "Frying Pan",
    phonetic: "ˈfɹaɪɪŋ pæn", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as frying pan.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/frying-pan.webp`,
  },
  {
    id: "baking-tray",
    label: "Baking Tray",
    phonetic: "ˈbeɪkɪŋ tɹeɪ", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as baking tray.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/baking-tray.webp`,
  },
  {
    id: "saucepan",
    label: "Saucepan",
    phonetic: "ˈsɔsˌpæn", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as saucepan.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/saucepan.webp`,
  },
  {
    id: "wok",
    label: "Wok",
    phonetic: "wɑk", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as wok.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/wok.webp`,
  },
  {
    id: "casserole-dish",
    label: "Casserole Dish",
    phonetic: "ˈkæsəˌɹoʊl dɪʃ", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as casserole dish.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/casserole-dish.webp`,
  },
  {
    id: "baking-dish",
    label: "Baking Dish",
    phonetic: "ˈbeɪkɪŋ dɪʃ", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as baking dish.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/baking-dish.webp`,
  },
  {
    id: "steamer",
    label: "Steamer",
    phonetic: "ˈstimɚ", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as steamer.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/steamer.webp`,
  },
  {
    id: "pressure-cooker",
    label: "Pressure Cooker",
    phonetic: "ˈpɹɛʃɚ ˈkʊkɚ", // Using label as phonetic placeholder
    topic: "cookware",
    description: "A kitchen item known as pressure cooker.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pressure-cooker.webp`,
  },
  {
    id: "fork",
    label: "Fork",
    phonetic: "fɔɹk", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as fork.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/fork.webp`,
  },
  {
    id: "knife",
    label: "Knife",
    phonetic: "naɪf", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as knife.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/knife.webp`,
  },
  {
    id: "spoon",
    label: "Spoon",
    phonetic: "spun", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as spoon.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/spoon.webp`,
  },
  {
    id: "spatula",
    label: "Spatula",
    phonetic: "ˈspætʃələ", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as spatula.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/spatula.webp`,
  },
  {
    id: "ladle",
    label: "Ladle",
    phonetic: "ˈleɪdəl", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as ladle.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/ladle.webp`,
  },
  {
    id: "whisk",
    label: "Whisk",
    phonetic: "wɪsk", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as whisk.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/whisk.webp`,
  },
  {
    id: "tongs",
    label: "Tongs",
    phonetic: "tɑŋz", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as tongs.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/tongs.webp`,
  },
  {
    id: "peeler",
    label: "Peeler",
    phonetic: "ˈpilɚ", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as peeler.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/peeler.webp`,
  },
  {
    id: "grater",
    label: "Grater",
    phonetic: "ˈgɹeɪtɚ", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as grater.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/grater.webp`,
  },
  {
    id: "rolling-pin",
    label: "Rolling Pin",
    phonetic: "ˈɹoʊlɪŋ pɪn", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as rolling pin.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/rolling-pin.webp`,
  },
  {
    id: "can-opener",
    label: "Can Opener",
    phonetic: "kæn ˈoʊpənɚ", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as can opener.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/can-opener.webp`,
  },
  {
    id: "corkscrew",
    label: "Corkscrew",
    phonetic: "ˈkɔɹkˌskɹu", // Using label as phonetic placeholder
    topic: "utensils-tools",
    description: "A kitchen item known as corkscrew.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/corkscrew.webp`,
  },
  {
    id: "plate",
    label: "Plate",
    phonetic: "pleɪt", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as plate.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/plate.webp`,
  },
  {
    id: "bowl",
    label: "Bowl",
    phonetic: "boʊl", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as bowl.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/bowl.webp`,
  },
  {
    id: "mug",
    label: "Mug",
    phonetic: "mʌg", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as mug.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/mug.webp`,
  },
  {
    id: "glass",
    label: "Glass",
    phonetic: "glæs", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as glass.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/glass.webp`,
  },
  {
    id: "cup",
    label: "Cup",
    phonetic: "kʌp", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as cup.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/cup.webp`,
  },
  {
    id: "saucer",
    label: "Saucer",
    phonetic: "ˈsɔsɚ", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as saucer.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/saucer.webp`,
  },
  {
    id: "cutting-board",
    label: "Cutting Board",
    phonetic: "ˈkʌtɪŋ bɔɹd", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as cutting board.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/cutting-board.webp`,
  },
  {
    id: "colander",
    label: "Colander",
    phonetic: "ˈkɑləndɚ", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as colander.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/colander.webp`,
  },
  {
    id: "measuring-cup",
    label: "Measuring Cup",
    phonetic: "ˈmɛʒɚɪŋ kʌp", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as measuring cup.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/measuring-cup.webp`,
  },
  {
    id: "measuring-spoon",
    label: "Measuring Spoon",
    phonetic: "ˈmɛʒɚɪŋ spun", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as measuring spoon.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/measuring-spoon.webp`,
  },
  {
    id: "mixing-bowl",
    label: "Mixing Bowl",
    phonetic: "ˈmɪksɪŋ boʊl", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as mixing bowl.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/mixing-bowl.webp`,
  },
  {
    id: "pitcher",
    label: "Pitcher",
    phonetic: "ˈpɪtʃɚ", // Using label as phonetic placeholder
    topic: "dishes-containers",
    description: "A kitchen item known as pitcher.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pitcher.webp`,
  },
  {
    id: "dish-towel",
    label: "Dish Towel",
    phonetic: "dɪʃ ˈtaʊəl", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as dish towel.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/dish-towel.webp`,
  },
  {
    id: "oven-mitt",
    label: "Oven Mitt",
    phonetic: "ˈʌvən mɪt", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as oven mitt.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/oven-mitt.webp`,
  },
  {
    id: "apron",
    label: "Apron",
    phonetic: "ˈeɪpɹən", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as apron.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/apron.webp`,
  },
  {
    id: "trash-can",
    label: "Trash Can",
    phonetic: "tɹæʃ kæn", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as trash can.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/trash-can.webp`,
  },
  {
    id: "paper-towel",
    label: "Paper Towel",
    phonetic: "ˈpeɪpɚ ˈtaʊəl", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as paper towel.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/paper-towel.webp`,
  },
  {
    id: "plastic-wrap",
    label: "Plastic Wrap",
    phonetic: "ˈplæstɪk ɹæp", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as plastic wrap.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/plastic-wrap.webp`,
  },
  {
    id: "aluminum-foil",
    label: "Aluminum Foil",
    phonetic: "əˈlumənəm fɔɪl", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as aluminum foil.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/aluminum-foil.webp`,
  },
  {
    id: "food-container",
    label: "Food Container",
    phonetic: "fud kənˈteɪnɚ", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as food container.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/food-container.webp`,
  },
  {
    id: "sponge",
    label: "Sponge",
    phonetic: "spʌndʒ", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as sponge.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/sponge.webp`,
  },
  {
    id: "dish-soap",
    label: "Dish Soap",
    phonetic: "dɪʃ soʊp", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as dish soap.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/dish-soap.webp`,
  },
  {
    id: "dish-rack",
    label: "Dish Rack",
    phonetic: "dɪʃ ɹæk", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as dish rack.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/dish-rack.webp`,
  },
  {
    id: "cling-film",
    label: "Cling Film",
    phonetic: "klɪŋ fɪlm", // Using label as phonetic placeholder
    topic: "kitchen-items",
    description: "A kitchen item known as cling film.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/cling-film.webp`,
  },
  {
    id: "bread",
    label: "Bread",
    phonetic: "bɹɛd", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as bread.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/bread.webp`,
  },
  {
    id: "butter",
    label: "Butter",
    phonetic: "ˈbʌtɚ", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as butter.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/butter.webp`,
  },
  {
    id: "milk",
    label: "Milk",
    phonetic: "mɪlk", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as milk.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/milk.webp`,
  },
  {
    id: "egg",
    label: "Egg",
    phonetic: "ɛg", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as egg.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/egg.webp`,
  },
  {
    id: "cheese",
    label: "Cheese",
    phonetic: "tʃiz", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as cheese.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/cheese.webp`,
  },
  {
    id: "rice",
    label: "Rice",
    phonetic: "ɹaɪs", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as rice.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/rice.webp`,
  },
  {
    id: "pasta",
    label: "Pasta",
    phonetic: "ˈpɑstə", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as pasta.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pasta.webp`,
  },
  {
    id: "cooking-oil",
    label: "Cooking Oil",
    phonetic: "ˈkʊkɪŋ ɔɪl", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as cooking oil.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/cooking-oil.webp`,
  },
  {
    id: "salt",
    label: "Salt",
    phonetic: "sɔlt", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as salt.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/salt.webp`,
  },
  {
    id: "sugar",
    label: "Sugar",
    phonetic: "ˈʃʊgɚ", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as sugar.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/sugar.webp`,
  },
  {
    id: "pepper",
    label: "Pepper",
    phonetic: "ˈpɛpɚ", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as pepper.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/pepper.webp`,
  },
  {
    id: "flour",
    label: "Flour",
    phonetic: "ˈflaʊɚ", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as flour.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/flour.webp`,
  },
  {
    id: "vinegar",
    label: "Vinegar",
    phonetic: "ˈvɪnəgɚ", // Using label as phonetic placeholder
    topic: "basic-pantry",
    description: "A kitchen item known as vinegar.", // Needs manual/AI description
    img: `${LOCAL_WORD_IMAGES}/vinegar.webp`,
  },
  {
    id: "honey",
    label: "Honey",
    phonetic: "ˈhʌni", // Using label as phonetic placeholder
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
    id: "seating-tables",
    name: "Seating & Tables",
    topicId: "seating-tables",
    wordIds: ['sofa','armchair','coffee-table','side-table','ottoman','rocking-chair','dining-table','dining-chair','bench','stool'],
    description: "Learn about seating & tables.",
    story: undefined
  },
  {
    id: "storage-display",
    name: "Storage & Display",
    topicId: "storage-display",
    wordIds: ['bookshelf','tv-stand','cabinet','sideboard','shelf','drawer','magazine-rack','display-case','coat-rack','shoe-rack'],
    description: "Learn about storage & display.",
    story: "In the Seating & Tables lesson, we learned about some very useful things. For example, we saw the sofa and the armchair. We also explored how the coffee-table works. Finally, we looked at the side-table and the ottoman to complete our understanding."
  },
  {
    id: "electronics-media",
    name: "Electronics & Media",
    topicId: "electronics-media",
    wordIds: ['television','remote-control','speaker','game-console','dvd-player','sound-bar','wi-fi-router','power-strip','cable','plug'],
    description: "Learn about electronics & media.",
    story: undefined
  },
  {
    id: "lighting-decor",
    name: "Lighting & Decor",
    topicId: "lighting-decor",
    wordIds: ['floor-lamp','table-lamp','ceiling-light','chandelier','light-bulb','candle','candle-holder','string-lights','picture-frame','wall-clock'],
    description: "Learn about lighting & decor.",
    story: "In the Electronics & Media lesson, we learned about some very useful things. For example, we saw the television and the remote-control. We also explored how the speaker works. Finally, we looked at the game-console and the dvd-player to complete our understanding."
  },
  {
    id: "soft-furnishings",
    name: "Soft & Furnishings",
    topicId: "soft-furnishings",
    wordIds: ['cushion','throw-blanket','rug','carpet','curtain','tablecloth','placemat','coaster','doormat','tapestry'],
    description: "Learn about soft & furnishings.",
    story: undefined
  },
  {
    id: "living-room-objects",
    name: "Living Room Objects",
    topicId: "living-room-objects",
    wordIds: ['plant','vase','photo-frame','painting','book','magazine','newspaper','board-game','puzzle'],
    description: "Learn about living room objects.",
    story: "In the Soft & Furnishings lesson, we learned about some very useful things. For example, we saw the cushion and the throw-blanket. We also explored how the rug works. Finally, we looked at the carpet and the curtain to complete our understanding."
  },
];

export const LIVING_ROOM_VOCABULARY: VocabularyItem[] = [
  {
    id: "sofa",
    label: "Sofa",
    phonetic: "ˈsəʊfə",
    img: `${LOCAL_WORD_IMAGES}/living-room/sofa.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "armchair",
    label: "Armchair",
    phonetic: "ˈɑɹmˌtʃɛɹ",
    img: `${LOCAL_WORD_IMAGES}/living-room/armchair.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "coffee-table",
    label: "Coffee Table",
    phonetic: "ˈkɑfi ˈteɪbəl",
    img: `${LOCAL_WORD_IMAGES}/living-room/coffee-table.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "side-table",
    label: "Side Table",
    phonetic: "saɪd ˈteɪbəl",
    img: `${LOCAL_WORD_IMAGES}/living-room/side-table.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "ottoman",
    label: "Ottoman",
    phonetic: "ˈɑtəmən",
    img: `${LOCAL_WORD_IMAGES}/living-room/ottoman.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "rocking-chair",
    label: "Rocking Chair",
    phonetic: "ˈɹɑkɪŋ tʃɛɹ",
    img: `${LOCAL_WORD_IMAGES}/living-room/rocking-chair.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "dining-table",
    label: "Dining Table",
    phonetic: "ˈdaɪnɪŋ(ɡ) ˈteɪbəl",
    img: `${LOCAL_WORD_IMAGES}/living-room/dining-table.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "dining-chair",
    label: "Dining Chair",
    phonetic: "ˈdaɪnɪŋ(ɡ) t͡ʃɛə(ɹ)",
    img: `${LOCAL_WORD_IMAGES}/living-room/dining-chair.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "bench",
    label: "Bench",
    phonetic: "bɛntʃ",
    img: `${LOCAL_WORD_IMAGES}/living-room/bench.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "stool",
    label: "Stool",
    phonetic: "stuːl",
    img: `${LOCAL_WORD_IMAGES}/living-room/stool.webp`,
    topic: "seating-tables",
    description: "An object found in the living room.",
  },
  {
    id: "bookshelf",
    label: "Bookshelf",
    phonetic: "ˈbʊkˌʃɛlf",
    img: `${LOCAL_WORD_IMAGES}/living-room/bookshelf.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "tv-stand",
    label: "TV Stand",
    phonetic: "ti-vi stænd",
    img: `${LOCAL_WORD_IMAGES}/living-room/tv-stand.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "cabinet",
    label: "Cabinet",
    phonetic: "ˈkæbənət",
    img: `${LOCAL_WORD_IMAGES}/living-room/cabinet.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "sideboard",
    label: "Sideboard",
    phonetic: "ˈsaɪdˌbɔɹd",
    img: `${LOCAL_WORD_IMAGES}/living-room/sideboard.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "shelf",
    label: "Shelf",
    phonetic: "ʃɛlf",
    img: `${LOCAL_WORD_IMAGES}/living-room/shelf.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "drawer",
    label: "Drawer",
    phonetic: "dɹɔː(ɹ)",
    img: `${LOCAL_WORD_IMAGES}/living-room/drawer.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "magazine-rack",
    label: "Magazine Rack",
    phonetic: "mæɡəˈziːn ɹæk",
    img: `${LOCAL_WORD_IMAGES}/living-room/magazine-rack.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "display-case",
    label: "Display Case",
    phonetic: "dɪsˈpleɪ keɪs",
    img: `${LOCAL_WORD_IMAGES}/living-room/display-case.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "coat-rack",
    label: "Coat Rack",
    phonetic: "koʊt ɹæk",
    img: `${LOCAL_WORD_IMAGES}/living-room/coat-rack.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "shoe-rack",
    label: "Shoe Rack",
    phonetic: "ʃuː ɹæk",
    img: `${LOCAL_WORD_IMAGES}/living-room/shoe-rack.webp`,
    topic: "storage-display",
    description: "An object found in the living room.",
  },
  {
    id: "television",
    label: "Television",
    phonetic: "ˈtɛləˌvɪʒən",
    img: `${LOCAL_WORD_IMAGES}/living-room/television.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "remote-control",
    label: "Remote Control",
    phonetic: "ɹɪˈmoʊt kənˈtɹoʊl",
    img: `${LOCAL_WORD_IMAGES}/living-room/remote-control.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "speaker",
    label: "Speaker",
    phonetic: "ˈspikɚ",
    img: `${LOCAL_WORD_IMAGES}/living-room/speaker.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "game-console",
    label: "Game Console",
    phonetic: "geɪm kənˈsoʊl",
    img: `${LOCAL_WORD_IMAGES}/living-room/game-console.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "dvd-player",
    label: "DVD Player",
    phonetic: "di-vi-di ˈpleɪɚ",
    img: `${LOCAL_WORD_IMAGES}/living-room/dvd-player.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "sound-bar",
    label: "Sound Bar",
    phonetic: "saʊnd bɑɹ",
    img: `${LOCAL_WORD_IMAGES}/living-room/sound-bar.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "wi-fi-router",
    label: "Wi-Fi Router",
    phonetic: "waɪ-faɪ ˈɹaʊtɚ",
    img: `${LOCAL_WORD_IMAGES}/living-room/wi-fi-router.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "power-strip",
    label: "Power Strip",
    phonetic: "ˈpaʊɚ stɹɪp",
    img: `${LOCAL_WORD_IMAGES}/living-room/power-strip.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "cable",
    label: "Cable",
    phonetic: "ˈkeɪbəl",
    img: `${LOCAL_WORD_IMAGES}/living-room/cable.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "plug",
    label: "Plug",
    phonetic: "plʌg",
    img: `${LOCAL_WORD_IMAGES}/living-room/plug.webp`,
    topic: "electronics-media",
    description: "An object found in the living room.",
  },
  {
    id: "floor-lamp",
    label: "Floor Lamp",
    phonetic: "flɔɹ læmp",
    img: `${LOCAL_WORD_IMAGES}/living-room/floor-lamp.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "table-lamp",
    label: "Table Lamp",
    phonetic: "ˈteɪbəl læmp",
    img: `${LOCAL_WORD_IMAGES}/living-room/table-lamp.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "ceiling-light",
    label: "Ceiling Light",
    phonetic: "ˈsilɪŋ laɪt",
    img: `${LOCAL_WORD_IMAGES}/living-room/ceiling-light.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "chandelier",
    label: "Chandelier",
    phonetic: "ˌʃændəˈlɪɹ",
    img: `${LOCAL_WORD_IMAGES}/living-room/chandelier.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "light-bulb",
    label: "Light Bulb",
    phonetic: "laɪt bʌlb",
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
    phonetic: "ˈkændəl ˈhoʊldɚ",
    img: `${LOCAL_WORD_IMAGES}/living-room/candle-holder.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "string-lights",
    label: "String Lights",
    phonetic: "stɹɪŋ laɪts",
    img: `${LOCAL_WORD_IMAGES}/living-room/string-lights.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "picture-frame",
    label: "Picture Frame",
    phonetic: "ˈpɪktʃɚ fɹeɪm",
    img: `${LOCAL_WORD_IMAGES}/living-room/picture-frame.webp`,
    topic: "lighting-decor",
    description: "An object found in the living room.",
  },
  {
    id: "wall-clock",
    label: "Wall Clock",
    phonetic: "wɔl klɑk",
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
    phonetic: "θɹoʊ ˈblæŋkɪt",
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
    phonetic: "ˈkɝtən",
    img: `${LOCAL_WORD_IMAGES}/living-room/curtain.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "tablecloth",
    label: "Tablecloth",
    phonetic: "ˈteɪbəlˌklɔθ",
    img: `${LOCAL_WORD_IMAGES}/living-room/tablecloth.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "placemat",
    label: "Placemat",
    phonetic: "ˈpleɪsˌmæt",
    img: `${LOCAL_WORD_IMAGES}/living-room/placemat.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "coaster",
    label: "Coaster",
    phonetic: "ˈkoʊstɚ",
    img: `${LOCAL_WORD_IMAGES}/living-room/coaster.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "doormat",
    label: "Doormat",
    phonetic: "ˈdɔɹˌmæt",
    img: `${LOCAL_WORD_IMAGES}/living-room/doormat.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "tapestry",
    label: "Tapestry",
    phonetic: "ˈtæpəstɹi",
    img: `${LOCAL_WORD_IMAGES}/living-room/tapestry.webp`,
    topic: "soft-furnishings",
    description: "An object found in the living room.",
  },
  {
    id: "plant",
    label: "Plant",
    phonetic: "plænt",
    img: `${LOCAL_WORD_IMAGES}/living-room/plant.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "vase",
    label: "Vase",
    phonetic: "veɪs",
    img: `${LOCAL_WORD_IMAGES}/living-room/vase.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "photo-frame",
    label: "Photo Frame",
    phonetic: "ˈfoʊˌtoʊ fɹeɪm",
    img: `${LOCAL_WORD_IMAGES}/living-room/photo-frame.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "painting",
    label: "Painting",
    phonetic: "ˈpeɪntɪŋ",
    img: `${LOCAL_WORD_IMAGES}/living-room/painting.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "book",
    label: "Book",
    phonetic: "bʊk",
    img: `${LOCAL_WORD_IMAGES}/living-room/book.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "magazine",
    label: "Magazine",
    phonetic: "ˈmægəˌzin",
    img: `${LOCAL_WORD_IMAGES}/living-room/magazine.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "newspaper",
    label: "Newspaper",
    phonetic: "ˈnuzˌpeɪpɚ",
    img: `${LOCAL_WORD_IMAGES}/living-room/newspaper.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "board-game",
    label: "Board Game",
    phonetic: "bɔɹd geɪm",
    img: `${LOCAL_WORD_IMAGES}/living-room/board-game.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
  {
    id: "puzzle",
    label: "Puzzle",
    phonetic: "ˈpʌzəl",
    img: `${LOCAL_WORD_IMAGES}/living-room/puzzle.webp`,
    topic: "living-room-objects",
    description: "An object found in the living room.",
  },
];

export const FARM_VOCABULARY: VocabularyItem[] = [
  {
    id: 'cow',
    label: 'Cow',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/cow.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'pig',
    label: 'Pig',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/pig.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'sheep',
    label: 'Sheep',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/sheep.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'chicken',
    label: 'Chicken',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/chicken.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'horse',
    label: 'Horse',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/horse.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'goat',
    label: 'Goat',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/goat.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'duck',
    label: 'Duck',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/duck.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'rooster',
    label: 'Rooster',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/rooster.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'turkey',
    label: 'Turkey',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/turkey.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'donkey',
    label: 'Donkey',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/donkey.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'rabbit',
    label: 'Rabbit',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/rabbit.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'goose',
    label: 'Goose',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/goose.webp`,
    topic: 'farm-farm-animals',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'barn',
    label: 'Barn',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/barn.webp`,
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'farmhouse',
    label: 'Farmhouse',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/farmhouse.webp`,
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'stable',
    label: 'Stable',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/stable.webp`,
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'hen-house',
    label: 'Hen House',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/hen-house.webp`,
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'silo',
    label: 'Silo',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/silo.webp`,
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'greenhouse',
    label: 'Greenhouse',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/greenhouse.webp`,
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'shed',
    label: 'Shed',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/shed.webp`,
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'windmill',
    label: 'Windmill',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/windmill.webp`,
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'well',
    label: 'Well',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/well.webp`,
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'fence',
    label: 'Fence',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/fence.webp`,
    topic: 'farm-farm-buildings',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'tractor',
    label: 'Tractor',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/tractor.webp`,
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'plow',
    label: 'Plow',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/plow.webp`,
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'trailer',
    label: 'Trailer',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/trailer.webp`,
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'wheelbarrow',
    label: 'Wheelbarrow',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/wheelbarrow.webp`,
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'pitchfork',
    label: 'Pitchfork',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/pitchfork.webp`,
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'shovel',
    label: 'Shovel',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/shovel.webp`,
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'hoe',
    label: 'Hoe',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/hoe.webp`,
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'rake',
    label: 'Rake',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/rake.webp`,
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'bucket',
    label: 'Bucket',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/bucket.webp`,
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'watering-can',
    label: 'Watering Can',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/watering-can.webp`,
    topic: 'farm-farm-equipment',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'milk',
    label: 'Milk',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/milk.webp`,
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'egg',
    label: 'Egg',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/egg.webp`,
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'wool',
    label: 'Wool',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/wool.webp`,
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'cheese',
    label: 'Cheese',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/cheese.webp`,
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'butter',
    label: 'Butter',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/butter.webp`,
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'honey',
    label: 'Honey',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/honey.webp`,
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'hay',
    label: 'Hay',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/hay.webp`,
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'straw',
    label: 'Straw',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/straw.webp`,
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'flour',
    label: 'Flour',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/flour.webp`,
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'jam',
    label: 'Jam',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/jam.webp`,
    topic: 'farm-farm-products',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'farmer',
    label: 'Farmer',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/farmer.webp`,
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'scarecrow',
    label: 'Scarecrow',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/scarecrow.webp`,
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'dog',
    label: 'Dog',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/dog.webp`,
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'cat',
    label: 'Cat',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/cat.webp`,
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'pond',
    label: 'Pond',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/pond.webp`,
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'mud',
    label: 'Mud',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/mud.webp`,
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'sunrise',
    label: 'Sunrise',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/sunrise.webp`,
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'sunset',
    label: 'Sunset',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/sunset.webp`,
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'rain',
    label: 'Rain',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/rain.webp`,
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
  {
    id: 'harvest',
    label: 'Harvest',
    phonetic: '',
    img: `${LOCAL_WORD_IMAGES}/farm/harvest.webp`,
    topic: 'farm-farm-life',
    description: 'An entity found in the agricultural area.'
  },
];

export const FARM_TOPICS: TopicCategory[] = [
  {
    id: 'farm-farm-animals',
    name: 'Farm Animals',
    itemsCount: 12
  },
  {
    id: 'farm-farm-buildings',
    name: 'Farm Buildings',
    itemsCount: 10
  },
  {
    id: 'farm-farm-equipment',
    name: 'Farm Equipment',
    itemsCount: 10
  },
  {
    id: 'farm-farm-products',
    name: 'Farm Products',
    itemsCount: 10
  },
  {
    id: 'farm-farm-life',
    name: 'Farm Life',
    itemsCount: 10
  },
];

export const FARM_GROUPS: Lesson[] = [
  {
    id: "farm-farm-animals",
    name: "Farm Animals",
    topicId: "farm-farm-animals",
    wordIds: ['cow','pig','sheep','chicken','horse','goat','duck','rooster','turkey','donkey','rabbit','goose'],
    description: "Learn about farm animals.",
    story: "The farmer milked the cow early in the morning while the muddy pig rolled in the pen. A fluffy sheep grazed peacefully in the meadow. A loud chicken pecked at the ground, and a fast horse galloped across the open field. A curious goat chewed on the wooden fence. The white duck swam across the pond, followed by a proud rooster that crowed loudly. A large turkey strutted proudly near the barn, and a stubborn donkey refused to move. A quick rabbit hopped past the vegetable garden. The white goose chased away the stray dog that wandered too close to the nest."
  },
  {
    id: "farm-farm-buildings",
    name: "Farm Buildings",
    topicId: "farm-farm-buildings",
    wordIds: ['barn','farmhouse','stable','hen-house','silo','greenhouse','shed','windmill','well','fence'],
    description: "Learn about farm buildings.",
    story: "The animals slept safely in the large red barn. The farmer's family lived in the cozy farmhouse nearby. The horses were kept warm in the stable, the hens laid eggs in the hen-house, and the tall silo stored all the winter grain. Delicate plants thrived inside the warm greenhouse. Tools were locked safely in the wooden shed. The spinning windmill pumped water from the deep well, and a sturdy fence kept the animals from wandering away."
  },
  {
    id: "farm-farm-equipment",
    name: "Farm Equipment",
    topicId: "farm-farm-equipment",
    wordIds: ['tractor','plow','trailer','wheelbarrow','pitchfork','shovel','hoe','rake','bucket','watering-can'],
    description: "Learn about farm equipment.",
    story: "The heavy green tractor rumbled across the field, pulling a sharp plow to turn the soil. A loaded trailer carried the harvest back to the barn. He pushed a full wheelbarrow of dirt and used a pitchfork to move the hay. A sturdy shovel was used to dig the deep holes. She grabbed the hoe to clear the weeds and a rake to gather the fallen leaves. The heavy metal bucket was filled with water from the well using a small watering-can."
  },
  {
    id: "farm-farm-products",
    name: "Farm Products",
    topicId: "farm-farm-products",
    wordIds: ['milk','egg','wool','cheese','butter','honey','hay','straw','flour','jam'],
    description: "Learn about farm products.",
    story: "Every morning, fresh milk was collected from the cows. The children gathered a brown egg from the coop. Warm wool was sheared from the sheep, then processed to make cheese and churned into creamy butter. Sweet golden honey was harvested from the buzzing hives. The dry hay was stacked high for winter feed. Bundles of straw were used for animal bedding, while fresh flour was milled and sweet fruit jam was preserved in jars."
  },
  {
    id: "farm-farm-life",
    name: "Farm Life",
    topicId: "farm-farm-life",
    wordIds: ['farmer','scarecrow','dog','cat','pond','mud','sunrise','sunset','rain','harvest'],
    description: "Learn about farm life.",
    story: "The hardworking farmer woke up before dawn. A scary scarecrow stood guard in the cornfield. The loyal dog herded the sheep while a sleepy cat napped in the barn. Frogs croaked loudly from the muddy pond. Thick mud covered the tractor tires after the storm. The beautiful sunrise marked the beginning of a long day, and the colorful sunset signaled time for rest. The heavy rain nourished the crops, ensuring a plentiful harvest."
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
    heroImage: `${LOCAL_SCENE_IMAGES}/living-room-hero.webp`,
    topics: LIVING_ROOM_TOPICS,
    groups: LIVING_ROOM_GROUPS,
    vocabulary: LIVING_ROOM_VOCABULARY,
  },
  farm: {
    id: "farm",
    name: "The Farm",
    description: "Explore real-life farm animals, tools, and elements through 2D scene discovery, audio practice, recall matching, and sentence building.",
    heroImage: `${LOCAL_SCENE_IMAGES}/farm-hero.webp`,
    topics: FARM_TOPICS,
    groups: FARM_GROUPS,
    vocabulary: FARM_VOCABULARY,
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
