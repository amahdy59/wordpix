/**
 * How to say a vocabulary label inside a sentence.
 *
 * Every spoken and written "this is …" line in the app used to be built the
 * same way: lowercase the label, put `a` in front of it unless it started with
 * a vowel letter, done. That is right for `Lamp` and wrong for most of the
 * corpus. It produced "This is a pliers", "This is a scissors", "This is a
 * water", "This is a run", "This is a happy", "This is a Monday" and "This is
 * a hour" — several thousand ungrammatical sentences read aloud to people who
 * are learning English from them.
 *
 * So a label is classified before it is spoken, and each class gets a frame
 * that is grammatical for it:
 *
 * | kind     | example label | phrase           | sentence                  |
 * | -------- | ------------- | ---------------- | ------------------------- |
 * | `count`  | Lamp          | a lamp           | This is a lamp.           |
 * | `pair`   | Pliers        | a pair of pliers | This is a pair of pliers. |
 * | `plural` | Eggs          | eggs             | These are eggs.           |
 * | `mass`   | Water         | water            | This is water.            |
 * | `proper` | Monday        | Monday           | This is Monday.           |
 * | `term`   | Run           | "run"            | The word is "run".        |
 *
 * ## Why `term` is the default for anything doubtful
 *
 * A label is not always a noun. Whole units are verbs (`Run`, `Whisk`,
 * `Clench Jaw`), adjectives (`Happy`, `Striped`, `Crimson`) or function words
 * (`Under`, `Between`). There is no article frame that fits those, and no
 * amount of morphology invents one — "This is a under" is not recoverable.
 *
 * The `term` frame is. "The word is “under”." is correct English for every
 * label in the corpus, whatever its part of speech. That makes it the right
 * thing to fall back to whenever a topic is not reliably made of countable
 * nouns: misclassifying a noun as a `term` costs a little richness, while
 * misclassifying a verb as a noun produces a sentence that teaches a mistake.
 * The tables below are therefore deliberately asymmetric — generous with
 * `term`, conservative with `count`.
 *
 * ## Where the classification comes from
 *
 * In priority order: an exact label override, the label's head word, the
 * topic's default, then morphology. Head words carry most of the weight
 * because English compounds are head-final — `Running Shoes`, `Olive Oil` and
 * `Hair Dryer` inherit their grammar from `shoes`, `oil` and `dryer` — so one
 * entry settles every compound built on it.
 */

export type LabelKind = "count" | "pair" | "plural" | "mass" | "proper" | "term";

/* ────────────────────────────────────────────────────────────────────────────
   Normalisation helpers
   ──────────────────────────────────────────────────────────────────────── */

function normalise(label: string): string {
  return label.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * The word that decides a compound's grammar.
 *
 * Head-final for ordinary compounds (`Running Shoes` → `shoes`), head-initial
 * across a prepositional tail (`Chest of Drawers` → `chest`, which is why that
 * one is "a chest of drawers" and not "these are drawers"; `Clock with Time
 * Zones` → `clock` for the same reason).
 */
export function headWord(label: string): string {
  const base = normalise(label).split(/ (?:of|with|for) /)[0] ?? "";
  const words = base.split(" ").filter(Boolean);
  return words[words.length - 1] ?? base;
}

/** The head word as the content author cased it, so acronyms stay detectable. */
function rawHead(label: string): string {
  const base =
    label
      .replace(/\s+/g, " ")
      .trim()
      .split(/ (?:of|with|for) /i)[0] ?? "";
  const words = base.split(" ").filter(Boolean);
  return words[words.length - 1] ?? base;
}

/** Tokens that are acronyms or model numbers keep their case: `USB`, `3D`, `USB-C`. */
function isShoutedToken(token: string): boolean {
  return /^[A-Z0-9][A-Z0-9.-]*$/.test(token) && /[A-Z0-9].*[A-Z0-9]/.test(token);
}

/**
 * The label as it should appear mid-sentence: lowercased, except for acronyms
 * and proper nouns, which keep the case the content author gave them.
 */
export function spokenLabel(label: string, kind?: LabelKind): string {
  const trimmed = label.replace(/\s+/g, " ").trim();
  if (kind === "proper") return trimmed;
  return trimmed
    .split(" ")
    .map((token) => (isShoutedToken(token) ? token : token.toLowerCase()))
    .join(" ");
}

/* ────────────────────────────────────────────────────────────────────────────
   a / an
   ──────────────────────────────────────────────────────────────────────── */

/** Letters whose *names* open on a vowel sound: an MRI, an SUV, an X-ray. */
const VOWEL_SOUNDING_LETTERS = new Set([
  "a",
  "e",
  "f",
  "h",
  "i",
  "l",
  "m",
  "n",
  "o",
  "r",
  "s",
  "x",
]);

/** Acronyms said as words rather than spelled out, so the letter rule is wrong. */
const SPOKEN_AS_WORD = new Set(["nasdaq", "lasik", "hiit", "nato", "scuba", "radar", "laser"]);

/** Consonant letter, vowel sound: an hour, an honest answer. */
const SILENT_H = /^(hour|honest|honou?r|heir|herb)/;

/**
 * Vowel letter, consonant sound. Almost all of these are the "yoo" glide
 * (`uniform`, `user`, `euro`) plus `one`, whose /w/ onset does the same job.
 */
const CONSONANT_ONSET_VOWEL = /^(uni|use|usu|uti|ute|uro|ure|uri|ura|uvu|ufo|ukul|u-|eu|one|ewe)/;

/**
 * Chooses `a` or `an` from how the word *sounds*, not how it is spelled.
 *
 * The spelling-only rule this replaces got "a hour", "an uniform" and "a MRI
 * scan" wrong — and the corpus has all three shapes in it.
 */
export function articleFor(label: string): "a" | "an" {
  const firstToken = label.replace(/\s+/g, " ").trim().split(" ")[0] ?? "";
  if (!firstToken) return "a";

  // Numerals are read out, so the article follows the spoken number: an 8-ball,
  // an 1100 series, but a 24/7 pass and a 401k.
  if (/^\d/.test(firstToken)) {
    return /^(8|11|18)/.test(firstToken) ? "an" : "a";
  }

  // Spelled-out acronyms take the article of their first letter's *name*.
  const letters = firstToken.replace(/[^A-Za-z]/g, "");
  if (
    letters.length >= 2 &&
    letters === letters.toUpperCase() &&
    !SPOKEN_AS_WORD.has(letters.toLowerCase())
  ) {
    return VOWEL_SOUNDING_LETTERS.has(letters[0].toLowerCase()) ? "an" : "a";
  }

  // Strip diacritics so `Éclair` is treated as the `e` word it is.
  const word = firstToken.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (SILENT_H.test(word)) return "an";
  if (CONSONANT_ONSET_VOWEL.test(word)) return "a";
  return /^[aeiou]/.test(word) ? "an" : "a";
}

/* ────────────────────────────────────────────────────────────────────────────
   Plural morphology
   ──────────────────────────────────────────────────────────────────────── */

/**
 * Singular words that end in `s` and would otherwise read as plurals.
 *
 * `-ss`, `-us` and `-is` endings are ruled out wholesale below, so this list
 * only has to carry what those patterns miss. `-as` is *not* ruled out
 * wholesale, because `Peas` and `Maracas` live in the corpus and outnumber the
 * handful of `-as` singulars named here.
 */
const SINGULAR_ENDING_IN_S = new Set([
  "lens",
  "thermos",
  "summons",
  "corps",
  "series",
  "species",
  "news",
  "molasses",
  "couscous",
  "rhinoceros",
  "apparatus",
  "biceps",
  "triceps",
  "atlas",
  "canvas",
  "pancreas",
  "christmas",
  "paris",
  "gas",
  "alias",
  "bias",
  // Acronyms the content pipeline lower-cased, so the shape rule cannot see them.
  "dns",
  "bms",
  "ups",
  "nas",
]);

/** `-ics` words are singular mass nouns: aerobics, ergonomics, electronics. */
const ICS_MASS = /[a-z]{2}ics$/;

/**
 * Whether a head word is a plural.
 *
 * `raw` is the head as the author cased it. An all-capital head is an acronym
 * — `ABS`, `GPS`, `NDA` — and its trailing `S` is a letter, not a plural.
 */
function looksPlural(head: string, raw = head): boolean {
  if (SINGULAR_ENDING_IN_S.has(head)) return false;
  if (!/s$/.test(head)) return false;
  if (/'s$/.test(head)) return false; // a bachelor's, an editor's desk
  if (/(ss|us|is)$/.test(head)) return false;
  if (ICS_MASS.test(head) && head !== "comics") return false;
  if (raw.length >= 2 && raw === raw.toUpperCase() && /^[A-Z]+$/.test(raw)) return false;
  return true;
}

/* ────────────────────────────────────────────────────────────────────────────
   Suffix families
   ──────────────────────────────────────────────────────────────────────── */

/**
 * `-ing` heads that really are nouns.
 *
 * Nearly two hundred labels in the corpus are gerunds naming an activity —
 * `Swimming`, `Knitting`, `Voting`, `Fainting`. None of them takes an article,
 * so `-ing` defaults to the `term` frame and this table names the exceptions:
 * the ordinary nouns that merely happen to end the same way.
 */
const ING_NOUNS: Record<string, LabelKind> = {
  building: "count",
  ring: "count",
  wing: "count",
  earring: "count",
  wedding: "count",
  spring: "count",
  sting: "count",
  string: "count",
  drawstring: "count",
  swing: "count",
  sling: "count",
  seedling: "count",
  starling: "count",
  lemming: "count",
  hamstring: "count",
  ceiling: "count",
  railing: "count",
  awning: "count",
  bunting: "count",
  riesling: "count",
  pudding: "count",
  drawing: "count",
  painting: "count",
  meeting: "count",
  morning: "count",
  evening: "count",
  warning: "count",
  setting: "count",
  briefing: "count",
  gathering: "count",
  clearing: "count",
  listing: "count",
  recording: "count",
  opening: "count",
  ending: "count",
  crossing: "count",
  blessing: "count",
  casting: "count",
  rendering: "count",
  piercing: "count",
  fitting: "count",
  coating: "count",
  molding: "count",
  lining: "count",
  filling: "count",
  ruling: "count",
  hearing: "count",
  landing: "count",
  offering: "count",
  siding: "count",
  lighting: "mass",
  flooring: "mass",
  roofing: "mass",
  framing: "mass",
  scaffolding: "mass",
  plumbing: "mass",
  housekeeping: "mass",
  financing: "mass",
  parking: "mass",
  webbing: "mass",
  interfacing: "mass",
  smocking: "mass",
  bedding: "mass",
  icing: "mass",
  wiring: "mass",
  piping: "mass",
  clothing: "mass",
  seating: "mass",
  housing: "mass",
  lightning: "mass",
  aging: "mass",
  thanksgiving: "proper",
};

/* ────────────────────────────────────────────────────────────────────────────
   Kind tables
   ──────────────────────────────────────────────────────────────────────── */

/**
 * Things that come as a pair and have no singular: "a pair of pliers".
 *
 * Listed by head word, so every compound built on one is covered — `Running
 * Shoes`, `Steel-Toe Boots` and `Safety Goggles` all resolve through this.
 * Ambiguous heads (`slides`, `pads`, `braces`) are deliberately absent; they
 * are handled by topic or by exact label instead.
 */
const PAIR_HEADS = new Set([
  // footwear
  "shoes",
  "boots",
  "booties",
  "sneakers",
  "sandals",
  "slippers",
  "loafers",
  "brogues",
  "espadrilles",
  "moccasins",
  "huaraches",
  "clogs",
  "stilettos",
  "cleats",
  "heels",
  "high-tops",
  "low-tops",
  "flip-flops",
  "cross-trainers",
  "snowshoes",
  "waders",
  "skates",
  "skis",
  "trainers",
  // legwear and other paired garments
  "pants",
  "jeans",
  "shorts",
  "trousers",
  "leggings",
  "tights",
  "culottes",
  "khakis",
  "capris",
  "chinos",
  "sweatpants",
  "overalls",
  "coveralls",
  "dungarees",
  "pajamas",
  "pyjamas",
  "briefs",
  "boxers",
  "socks",
  "gloves",
  "mittens",
  "mitts",
  "suspenders",
  "cufflinks",
  // eyewear and earwear
  "glasses",
  "sunglasses",
  "goggles",
  "bifocals",
  "binoculars",
  "spectacles",
  "headphones",
  "earphones",
  "earbuds",
  // two-armed tools
  "pliers",
  "scissors",
  "shears",
  "tongs",
  "tweezers",
  "forceps",
  "pincers",
  "clippers",
  "snips",
  "nippers",
  "handcuffs",
  "chopsticks",
  "crutches",
  "maracas",
]);

/** Pairs whose head word is too ambiguous to list on its own. */
const PAIR_LABELS = new Set([
  "elbow pads",
  "knee pads",
  "knee sleeves",
  "shin guards",
  "arm warmers",
  "leg warmers",
  "wrist wraps",
  "progressive lenses",
  "transition lenses",
  "roller skates",
]);

/**
 * Uncountable nouns, by head word. "This is water", never "a water".
 *
 * Heads that are countable in another sense are left out on purpose — `glass`,
 * `light`, `stone`, `paper`, `hair`, `chicken` — because `Wine Glass` and
 * `Traffic Light` must stay countable. Those topics set a `mass` default
 * instead, which scopes the reading to where it is right.
 */
const MASS_HEADS = new Set([
  // drink
  "water",
  "milk",
  "juice",
  "tea",
  "coffee",
  "espresso",
  "beer",
  "wine",
  "champagne",
  "whiskey",
  "whisky",
  "vodka",
  "gin",
  "rum",
  "tequila",
  "brandy",
  "soda",
  "cola",
  "lemonade",
  "kombucha",
  "cider",
  "sake",
  "liqueur",
  "brew",
  // larder
  "oil",
  "vinegar",
  "sauce",
  "syrup",
  "honey",
  "jam",
  "jelly",
  "marmalade",
  "butter",
  "cream",
  "cheese",
  "yogurt",
  "yoghurt",
  "chocolate",
  "sugar",
  "salt",
  "pepper",
  "flour",
  "rice",
  "wheat",
  "barley",
  "quinoa",
  "millet",
  "buckwheat",
  "rye",
  "bulgur",
  "bread",
  "pasta",
  "dough",
  "batter",
  "cereal",
  "oatmeal",
  "granola",
  "tofu",
  "tempeh",
  "seitan",
  "beef",
  "pork",
  "lamb",
  "veal",
  "bacon",
  "ham",
  "salami",
  "prosciutto",
  "pepperoni",
  "chorizo",
  "pastrami",
  "jerky",
  "seafood",
  "produce",
  "broth",
  // materials
  "sand",
  "soil",
  "mud",
  "clay",
  "concrete",
  "cement",
  "plaster",
  "drywall",
  "grout",
  "mortar",
  "lumber",
  "plywood",
  "wood",
  "hardwood",
  "steel",
  "aluminum",
  "aluminium",
  "copper",
  "bronze",
  "brass",
  "titanium",
  "platinum",
  "marble",
  "granite",
  "slate",
  "limestone",
  "plastic",
  "rubber",
  "foam",
  "resin",
  "silicone",
  "vinyl",
  "acrylic",
  "nylon",
  "polyester",
  "spandex",
  "lycra",
  "rayon",
  "microfiber",
  "neoprene",
  "cotton",
  "silk",
  "wool",
  "linen",
  "denim",
  "velvet",
  "satin",
  "leather",
  "suede",
  "fleece",
  "hemp",
  "jute",
  "cashmere",
  "mohair",
  "felt",
  "lace",
  "tulle",
  "chiffon",
  "organza",
  "taffeta",
  "brocade",
  "jacquard",
  "crepe",
  "insulation",
  "fiberglass",
  "asphalt",
  "gravel",
  "mulch",
  "compost",
  // substances and abstractions
  "air",
  "oxygen",
  "hydrogen",
  "nitrogen",
  "steam",
  "smoke",
  "dust",
  "ash",
  "ice",
  "snow",
  "rain",
  "fog",
  "hail",
  "sunshine",
  "electricity",
  "energy",
  "humidity",
  "traffic",
  "weather",
  "money",
  "cash",
  "jewelry",
  "jewellery",
  "luggage",
  "baggage",
  "furniture",
  "equipment",
  "software",
  "hardware",
  "information",
  "advice",
  "homework",
  "research",
  "knowledge",
  "mail",
  "paperwork",
  "laundry",
  "trash",
  "garbage",
  "waste",
  "blood",
  "urine",
  "saliva",
  "sweat",
  "plasma",
  "melanin",
  "keratin",
  "collagen",
  "calcium",
  "hydration",
  "metabolism",
  "wisdom",
  "longevity",
  "respect",
  "honesty",
  "kindness",
  "patience",
  "tolerance",
  "empathy",
  "peace",
  // Named by the audit: heads that only ever appear uncountably in the corpus.
  "grass",
  "seagrass",
  "lemongrass",
  "moss",
  "cress",
  "watercress",
  "floss",
  "debris",
  "access",
  "hummus",
  "asparagus",
  "tennis",
  "chess",
  "emphasis",
  "dialysis",
  "photosynthesis",
  "osteoporosis",
  "conjunctivitis",
  "keratoconus",
]);

/** Uncountables whose head word is shared with countable compounds. */
const MASS_LABELS = new Set([
  "glass",
  "stone",
  "iron",
  "gold",
  "silver",
  "hay",
  "grass",
  "underwear",
  "news",
  "breaking news",
  "nutrition facts",
  "aerobics",
  "ergonomics",
  "molasses",
  "thunder",
  "lightning",
  "sunlight",
  "moonlight",
  "oxygen",
  "umami",
]);

/** Names. Spoken with their capital letter and no article. */
const PROPER_LABELS = new Set([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
  "easter",
  "earth",
  "mars",
  "uranus",
  "dow jones",
  "nasdaq",
  "nyse",
  "ethereum",
  "nutella",
  "baileys",
  "tom collins",
  "gore-tex",
  "kevlar",
  "christmas",
  "thanksgiving",
  "paris",
  "venus",
  "beaux-arts",
]);

/**
 * Topics whose labels are not reliably countable nouns.
 *
 * Everything here defaults to the `term` frame. A topic earns a place either
 * because it is wholly non-nominal (`movement-verbs`, `prepositions-of-place`)
 * or because it mixes parts of speech so freely that no noun frame is safe
 * across it (`five-senses` runs `Retina`, `Bitter` and `Savor` together).
 */
const TERM_TOPICS = new Set([
  "movement-verbs",
  "hand-actions",
  "communication-verbs",
  "daily-action-verbs",
  "daily-routines",
  "cooking-methods",
  "prepositions-of-place",
  "spatial-relations",
  "personality-character",
  "physical-appearance",
  "patterns-textures",
  "basic-emotions",
  "complex-feelings",
  "colors",
  "shades-tones",
  "architecture-styles",
  "social-situations",
  "giving-directions",
  "five-senses",
  "facial-expressions",
  "telling-time",
  "seasons-weather",
  "life-events",
  "ages-life-stages",
  "measurements-units",
  "driving-road-rules",
  "numbers-counting",
  "days-months",
  "fashion-design",
  "business-communication",
  "freelancing-remote-work",
  "moving-settling-in",
  "rights-regulations",
  "startup-culture",
  "maps-navigation",
  "currency-payment",
]);

/** Topics where the default reading is uncountable. */
const MASS_TOPICS = new Set(["materials", "fabrics-textiles"]);

/** Topics where a plural label means a pair rather than a heap. */
const PAIR_TOPICS = new Set(["footwear"]);

/**
 * Per-label escapes from a topic default, in both directions.
 *
 * Kept small on purpose. Only entries that appear often enough to be worth the
 * maintenance are here; anything else is left to fall back on `term`, which is
 * duller but never wrong.
 */
const LABEL_KIND_OVERRIDES: Record<string, LabelKind> = {
  // Countable nouns inside `term` topics.
  compass: "count",
  intersection: "count",
  crosswalk: "count",
  roundabout: "count",
  sidewalk: "count",
  highway: "count",
  bridge: "count",
  monument: "count",
  fountain: "count",
  statue: "count",
  tower: "count",
  church: "count",
  school: "count",
  hospital: "count",
  building: "count",
  block: "count",
  corner: "count",
  clock: "count",
  watch: "count",
  sundial: "count",
  hourglass: "count",
  stopwatch: "count",
  "alarm clock": "count",
  "digital clock": "count",
  "clock face": "count",
  "hour hand": "count",
  "minute hand": "count",
  "second hand": "count",
  calendar: "count",
  planner: "count",
  diary: "count",
  agenda: "count",
  deadline: "count",
  reminder: "count",
  appointment: "count",
  schedule: "count",
  tornado: "count",
  hurricane: "count",
  blizzard: "count",
  flood: "count",
  drought: "count",
  "heat wave": "count",
  "ice storm": "count",
  monsoon: "count",
  equinox: "count",
  solstice: "count",
  thermometer: "count",
  barometer: "count",
  "weather vane": "count",
  "rain gauge": "count",
  anemometer: "count",
  "weather map": "count",
  forecast: "count",
  satellite: "count",
  radar: "count",
  "weather app": "count",
  ruler: "count",
  scale: "count",
  degree: "count",
  ponytail: "count",
  braid: "count",
  bun: "count",
  afro: "count",
  "bob cut": "count",
  "crew cut": "count",
  "double chin": "count",
  "cleft chin": "count",
  dome: "count",
  arch: "count",
  vault: "count",
  cantilever: "count",
  facade: "count",
  atrium: "count",
  skylight: "count",
  colonnade: "count",
  portico: "count",
  minaret: "count",
  birthday: "count",
  wedding: "count",
  anniversary: "count",
  graduation: "count",
  funeral: "count",
  divorce: "count",
  award: "count",
  certificate: "count",
  diploma: "count",
  medal: "count",
  trophy: "count",
  scholarship: "count",
  patent: "count",
  memorial: "count",
  smile: "count",
  grin: "count",
  smirk: "count",
  laugh: "count",
  giggle: "count",
  frown: "count",
  pout: "count",
  tear: "count",
  dimple: "count",
  wink: "count",
  yawn: "count",
  blink: "count",
  shrug: "count",
  nod: "count",
  eye: "count",
  pupil: "count",
  retina: "count",
  cornea: "count",
  nose: "count",
  nostril: "count",
  tongue: "count",
  "taste bud": "count",
  ear: "count",
  eardrum: "count",
  cochlea: "count",
  nerve: "count",
  echo: "count",
  newborn: "count",
  baby: "count",
  infant: "count",
  toddler: "count",
  preschooler: "count",
  child: "count",
  kid: "count",
  teenager: "count",
  adolescent: "count",
  teen: "count",
  adult: "count",
  retiree: "count",
  grandparent: "count",
  elder: "count",
  senior: "count",

  // Plurals inside `term` topics, and other labels the morphology would miss.
  dimples: "plural",
  freckles: "plural",
  wrinkles: "plural",
  bangs: "plural",
  sideburns: "plural",
  pigtails: "plural",
  highlights: "plural",
  lowlights: "plural",
  dreadlocks: "plural",
  cornrows: "plural",
  braids: "plural",
  "golden years": "plural",
  "first steps": "plural",
  "first words": "plural",
  "human rights": "plural",
  "autumn leaves": "plural",
  "arts and crafts": "plural",

  // Uncountables the head-word table cannot see.
  vision: "mass",
  sound: "mass",
  pressure: "mass",
  temperature: "mass",
  texture: "mass",
  pain: "mass",
  flavor: "mass",
  aroma: "mass",
  fragrance: "mass",
  odor: "mass",
  scent: "mass",
  stench: "mass",
  growth: "mass",
  puberty: "mass",
  aging: "mass",
  retirement: "mass",
  loss: "mass",
  grief: "mass",
  recovery: "mass",

  // Singular despite a plural-looking head.
  "chest of drawers": "count",
  "round of drinks": "count",
  "hit and run": "count",
  "one-way": "term",
  "on the rocks": "term",
  "old fashioned": "count",
  "associate's": "count",
  "bachelor's": "count",
  "master's": "count",
  alumni: "plural",
  peas: "plural",
  comics: "plural",

  // Verb phrases sitting inside otherwise nominal units. Each one would
  // otherwise be read as a plural noun: "These are blow candles."
  "blow candles": "term",
  "open gifts": "term",
  "feed ducks": "term",
  "laying eggs": "term",
  "filling tires": "term",
  "play games": "term",
  "play sports": "term",
  "meet neighbors": "term",
  "put on pajamas": "term",
  "wash hands": "term",
  "wash dishes": "term",
  "take notes": "term",
  "visit friends": "term",
  "skipping stones": "term",
  "musical chairs": "term",
  "keep off grass": "term",
  "pumping gas": "term",
  "apply lotion": "term",
  "apply pressure": "term",
  "apply for loan": "term",
  "eat before": "term",
  "open account": "term",
  "online refill": "term",

  // Bare verbs and adjectives the topic tables cannot reach, because they sit
  // in units that are otherwise made of things.
  discuss: "term",
  adjourn: "term",
  adopt: "term",
  advise: "term",
  analyze: "term",
  approve: "term",
  assign: "term",
  edit: "term",
  elevate: "term",
  emerge: "term",
  explore: "term",
  extract: "term",
  immobilize: "term",
  unload: "term",
  unmute: "term",
  upload: "term",
  excited: "term",
  infused: "term",
  overruled: "term",
  undercover: "term",
  abdominal: "term",
  affordable: "term",
  "acne-prone": "term",
  ancient: "term",
  elderly: "term",
  electrical: "term",
  elliptical: "term",
  expensive: "term",
  earthy: "term",
  oaky: "term",
  organic: "term",
  industrial: "term",
  oblique: "term",
  esc: "term",
  browse: "term",
  choose: "term",
  compare: "term",
  click: "term",
  deposit: "term",
  dial: "term",
  export: "term",
  recycle: "term",
  refill: "term",
  reject: "term",
  relax: "term",
  repeat: "term",
  rescue: "term",
  rinse: "term",
  scrub: "term",
  weigh: "term",
  mute: "term",
  present: "term",
  vote: "term",
  "check out": "term",
  "wait in line": "term",
  "screen share": "term",
  fresh: "term",
  frozen: "term",
  "low-fat": "term",
  "gluten-free": "term",
  "sugar-free": "term",
  "non-gmo": "term",
  vegan: "term",
  grateful: "term",
  nostalgic: "term",
  proud: "term",
  "cum laude": "term",
  "best before": "term",
  "on sale": "term",
  "buy 1 get 1 free": "term",
  used: "term",
  autumn: "mass",
  focus: "mass",
  music: "mass",
  macrame: "mass",
  "digital art": "mass",
  "graphic design": "mass",
  "music production": "mass",
  zoom: "proper",
};

/* ────────────────────────────────────────────────────────────────────────────
   Classification
   ──────────────────────────────────────────────────────────────────────── */

/**
 * Which frame a label belongs in.
 *
 * `topic` is the vocabulary item's unit id. It is optional so that callers
 * holding only a label still get the head-word and morphology rules, but
 * passing it is strongly preferred: the topic is what keeps `Slides` a pair of
 * sandals in `footwear` and a stack of glass plates in `laboratory`.
 */
export function classifyLabel(label: string, topic?: string): LabelKind {
  const key = normalise(label);
  if (!key) return "term";

  const override = LABEL_KIND_OVERRIDES[key];
  if (override) return override;

  // Whole utterances and quantity phrases. The corpus carries shopping lines
  // ("Is this on sale?", "I need a refund") and measure phrases ("A Loaf Of");
  // neither is a noun that an article can be bolted onto.
  if (key.includes("?") || /^an? /.test(key)) return "term";
  if (
    /^(i|you|we|they|he|she|it|is|are|do|does|can|could|would|will|how|what|where|when|why|who|please|let|may|there) /.test(
      key
    )
  ) {
    return "term";
  }

  if (PROPER_LABELS.has(key)) return "proper";
  if (MASS_LABELS.has(key)) return "mass";
  if (PAIR_LABELS.has(key)) return "pair";

  const head = headWord(key);
  const plural = looksPlural(head, rawHead(label));

  // No plural guard here: a pair head is inherently plural even when the
  // spelling hides it (`khakis`, `capris` and `skis` all end in `-is`).
  if (PAIR_HEADS.has(head)) return "pair";
  if (MASS_HEADS.has(head)) return "mass";
  if (ICS_MASS.test(head) && head !== "comics") return "mass";

  // Suffix families, checked before the topic default so that a gerund inside
  // an otherwise nominal unit (`Knitting` in creative-hobbies) still lands in
  // the frame that fits it.
  if (/ing$/.test(head)) return ING_NOUNS[head] ?? "term";
  if (/[a-z]{3}ness$/.test(head)) return "mass";
  if (/[a-z]{3}(less|ous)$/.test(head)) return "term";

  if (topic) {
    // A pair topic only makes pairs out of labels that are already plural:
    // `Wedges` is a pair of shoes, `Monk Strap` is one shoe.
    if (PAIR_TOPICS.has(topic)) return plural ? "pair" : "count";
    if (MASS_TOPICS.has(topic)) return plural ? "plural" : "mass";
    // `term` topics are unconditional. They are full of verb phrases whose
    // head happens to be a plural noun — `Wash Dishes`, `Put On Pajamas` —
    // and reading those as nouns is exactly the mistake this module exists to
    // stop. The nouns worth rescuing are listed in LABEL_KIND_OVERRIDES.
    if (TERM_TOPICS.has(topic)) return "term";
  }

  return plural ? "plural" : "count";
}

/* ────────────────────────────────────────────────────────────────────────────
   Phrases and sentences
   ──────────────────────────────────────────────────────────────────────── */

/** The quotation marks that set a non-noun label apart in running text. */
const OPEN_QUOTE = "“";
const CLOSE_QUOTE = "”";

/**
 * The label as a noun phrase: `a lamp`, `a pair of pliers`, `eggs`, `water`,
 * `Monday`, `“run”`.
 */
export function namePhrase(label: string, topic?: string): string {
  const kind = classifyLabel(label, topic);
  const spoken = spokenLabel(label, kind);

  switch (kind) {
    case "count":
      // The article is chosen from the *original* label: lowercasing would hide
      // that `USB-C Hub` opens on an acronym, and hand back "an usb-c hub".
      return `${articleFor(label)} ${spoken}`;
    case "pair":
      return `a pair of ${spoken}`;
    case "plural":
    case "mass":
    case "proper":
      return spoken;
    case "term":
      return `${OPEN_QUOTE}${spoken}${CLOSE_QUOTE}`;
  }
}

/** True when the label takes a plural verb: "These are eggs". */
export function isPluralPhrase(label: string, topic?: string): boolean {
  return classifyLabel(label, topic) === "plural";
}

/**
 * Names the thing in the picture: "This is a lamp." / "These are eggs." /
 * "The word is “run”."
 */
export function identifySentence(label: string, topic?: string): string {
  const kind = classifyLabel(label, topic);
  const phrase = namePhrase(label, topic);
  if (kind === "term") return `The word is ${phrase}.`;
  if (kind === "plural") return `These are ${phrase}.`;
  return `This is ${phrase}.`;
}

/**
 * `identifySentence` split around the label, for callers that want to give the
 * word itself a different colour or weight.
 *
 * Returning the pieces beats letting a screen search the finished string for
 * the label: the label is not always in the sentence verbatim (`Pliers` comes
 * back as `pliers` inside `a pair of pliers`), and a substring hunt would miss
 * it or highlight the wrong run of characters.
 */
export function identifyParts(
  label: string,
  topic?: string
): { before: string; word: string; after: string } {
  const kind = classifyLabel(label, topic);
  const word = spokenLabel(label, kind);
  switch (kind) {
    case "count":
      return { before: `This is ${articleFor(label)} `, word, after: "." };
    case "pair":
      return { before: "This is a pair of ", word, after: "." };
    case "plural":
      return { before: "These are ", word, after: "." };
    case "term":
      return { before: `The word is ${OPEN_QUOTE}`, word, after: `${CLOSE_QUOTE}.` };
    default:
      return { before: "This is ", word, after: "." };
  }
}

/**
 * Names what the learner picked instead: "That's a mirror." / "Those are eggs."
 *
 * Deliberately a different deictic from `identifySentence` so the two can sit
 * in one line — "That's a mirror. This is a faucet." — and still be told apart
 * by ear.
 */
export function contrastSentence(label: string, topic?: string): string {
  const kind = classifyLabel(label, topic);
  const phrase = namePhrase(label, topic);
  if (kind === "plural") return `Those are ${phrase}.`;
  return `That's ${phrase}.`;
}
