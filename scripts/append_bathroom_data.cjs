const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, '..', 'src', 'app', 'data', 'lessons.ts');
let content = fs.readFileSync(lessonsPath, 'utf8');

const bathroomData = \`n// ==========================================
// THE BATHROOM
// ==========================================

export const BATHROOM_TOPICS: Topic[] = [
  {
    id: "plumbing-fixtures",
    name: "Plumbing Fixtures",
    description: "Built-in fixtures for washing and waste.",
    icon: "bath",
  },
  {
    id: "toiletries",
    name: "Toiletries",
    description: "Products for personal hygiene and grooming.",
    icon: "spray-can",
  },
  {
    id: "bathroom-linens",
    name: "Bathroom Linens",
    description: "Towels and cloth items used for drying off.",
    icon: "shirt",
  },
  {
    id: "bathroom-accessories",
    name: "Bathroom Accessories",
    description: "Tools and objects that assist with bathroom routines.",
    icon: "brush",
  },
];

export const BATHROOM_GROUPS: Lesson[] = [
  {
    id: "plumbing-fixtures",
    name: "Plumbing Fixtures",
    topicId: "plumbing-fixtures",
    description: "Learn the core built-in fixtures of a bathroom.",
    wordIds: ["toilet", "sink", "bathtub", "shower", "faucet", "drain", "bidet", "showerhead"],
  },
  {
    id: "daily-toiletries",
    name: "Daily Toiletries",
    topicId: "toiletries",
    description: "Learn the everyday products used for keeping clean.",
    wordIds: ["soap", "shampoo", "conditioner", "toothpaste", "toothbrush", "deodorant", "lotion", "mouthwash"],
  },
  {
    id: "bathroom-linens",
    name: "Linens & Textiles",
    topicId: "bathroom-linens",
    description: "Learn about the fabrics used to dry off and stay warm.",
    wordIds: ["bath-towel", "hand-towel", "washcloth", "bath-mat", "bathrobe", "shower-curtain"],
  },
  {
    id: "grooming-tools",
    name: "Grooming Tools",
    topicId: "bathroom-accessories",
    description: "Learn the items used for personal care and styling.",
    wordIds: ["mirror", "comb", "hairbrush", "hairdryer", "razor", "tweezers", "nail-clippers", "cotton-swab"],
  },
  {
    id: "bathroom-utilities",
    name: "Bathroom Utilities",
    topicId: "bathroom-accessories",
    description: "Learn about the practical supplies and tools for bathroom maintenance.",
    wordIds: ["toilet-paper", "plunger", "toilet-brush", "trash-can", "scale", "laundry-basket", "sponge", "loofah"],
  },
];

export const BATHROOM_VOCABULARY: VocabularyItem[] = [
  // Plumbing Fixtures
  {
    id: "toilet",
    label: "Toilet",
    phonetic: "'t??l?t",
    img: \"\\\/bathroom/toilet.webp\\"\,
    topic: "plumbing-fixtures",
    description: "A ceramic bowl connected to a drain for disposing of human waste.",
  },
  {
    id: "sink",
    label: "Sink",
    phonetic: "s??k",
    img: \"\\\/bathroom/sink.webp\\"\,
    topic: "plumbing-fixtures",
    description: "A basin equipped with a water supply and drain for washing hands and face.",
  },
  {
    id: "bathtub",
    label: "Bathtub",
    phonetic: "'bæ?t?b",
    img: \"\\\/bathroom/bathtub.webp\\"\,
    topic: "plumbing-fixtures",
    description: "A large container for holding water in which a person may bathe.",
  },
  {
    id: "shower",
    label: "Shower",
    phonetic: "'?a??r",
    img: \"\\\/bathroom/shower.webp\\"\,
    topic: "plumbing-fixtures",
    description: "An enclosure where a person stands under a spray of water to wash.",
  },
  {
    id: "faucet",
    label: "Faucet",
    phonetic: "'f??s?t",
    img: \"\\\/bathroom/faucet.webp\\"\,
    topic: "plumbing-fixtures",
    description: "A valve controlling the release of a liquid, such as water, into a sink.",
  },
  {
    id: "drain",
    label: "Drain",
    phonetic: "dre?n",
    img: \"\\\/bathroom/drain.webp\\"\,
    topic: "plumbing-fixtures",
    description: "A pipe or channel that carries away wastewater from a basin or tub.",
  },
  {
    id: "bidet",
    label: "Bidet",
    phonetic: "b?'de?",
    img: \"\\\/bathroom/bidet.webp\\"\,
    topic: "plumbing-fixtures",
    description: "A low oval basin used for washing one's lower body.",
  },
  {
    id: "showerhead",
    label: "Showerhead",
    phonetic: "'?a??rh?d",
    img: \"\\\/bathroom/showerhead.webp\\"\,
    topic: "plumbing-fixtures",
    description: "The perforated nozzle that distributes water in a shower.",
  },

  // Toiletries
  {
    id: "soap",
    label: "Soap",
    phonetic: "so?p",
    img: \"\\\/bathroom/soap.webp\\"\,
    topic: "toiletries",
    description: "A substance used with water for washing and cleaning.",
  },
  {
    id: "shampoo",
    label: "Shampoo",
    phonetic: "?æm'pu?",
    img: \"\\\/bathroom/shampoo.webp\\"\,
    topic: "toiletries",
    description: "A liquid preparation containing soap for washing hair.",
  },
  {
    id: "conditioner",
    label: "Conditioner",
    phonetic: "k?n'd???n?r",
    img: \"\\\/bathroom/conditioner.webp\\"\,
    topic: "toiletries",
    description: "A liquid applied to hair after washing to improve its texture and manageability.",
  },
  {
    id: "toothpaste",
    label: "Toothpaste",
    phonetic: "'tu??pe?st",
    img: \"\\\/bathroom/toothpaste.webp\\"\,
    topic: "toiletries",
    description: "A paste used on a brush for cleaning the teeth.",
  },
  {
    id: "toothbrush",
    label: "Toothbrush",
    phonetic: "'tu??br??",
    img: \"\\\/bathroom/toothbrush.webp\\"\,
    topic: "toiletries",
    description: "A small brush with a long handle, used for cleaning the teeth.",
  },
  {
    id: "deodorant",
    label: "Deodorant",
    phonetic: "di'o?d?r?nt",
    img: \"\\\/bathroom/deodorant.webp\\"\,
    topic: "toiletries",
    description: "A substance applied to the body to prevent or mask body odor.",
  },
  {
    id: "lotion",
    label: "Lotion",
    phonetic: "'lo???n",
    img: \"\\\/bathroom/lotion.webp\\"\,
    topic: "toiletries",
    description: "A thick, smooth liquid preparation designed to be applied to the skin.",
  },
  {
    id: "mouthwash",
    label: "Mouthwash",
    phonetic: "'ma??w???",
    img: \"\\\/bathroom/mouthwash.webp\\"\,
    topic: "toiletries",
    description: "An antiseptic liquid preparation for cleaning the mouth and teeth.",
  },

  // Linens
  {
    id: "bath-towel",
    label: "Bath Towel",
    phonetic: "bæ? 'ta??l",
    img: \"\\\/bathroom/bath-towel.webp\\"\,
    topic: "bathroom-linens",
    description: "A large piece of absorbent cloth used for drying the body after a bath or shower.",
  },
  {
    id: "hand-towel",
    label: "Hand Towel",
    phonetic: "hænd 'ta??l",
    img: \"\\\/bathroom/hand-towel.webp\\"\,
    topic: "bathroom-linens",
    description: "A small towel used primarily for drying the hands.",
  },
  {
    id: "washcloth",
    label: "Washcloth",
    phonetic: "'w???kl???",
    img: \"\\\/bathroom/washcloth.webp\\"\,
    topic: "bathroom-linens",
    description: "A small square of cloth used for washing the face or body.",
  },
  {
    id: "bath-mat",
    label: "Bath Mat",
    phonetic: "bæ? mæt",
    img: \"\\\/bathroom/bath-mat.webp\\"\,
    topic: "bathroom-linens",
    description: "A small rug placed on the floor outside a bathtub or shower to absorb water.",
  },
  {
    id: "bathrobe",
    label: "Bathrobe",
    phonetic: "'bæ?ro?b",
    img: \"\\\/bathroom/bathrobe.webp\\"\,
    topic: "bathroom-linens",
    description: "A loose-fitting outer garment worn by people before or after washing.",
  },
  {
    id: "shower-curtain",
    label: "Shower Curtain",
    phonetic: "'?a??r 'k?rt?n",
    img: \"\\\/bathroom/shower-curtain.webp\\"\,
    topic: "bathroom-linens",
    description: "A waterproof drape hung around a shower to prevent water from splashing out.",
  },

  // Accessories & Tools
  {
    id: "mirror",
    label: "Mirror",
    phonetic: "'m?r?r",
    img: \"\\\/bathroom/mirror.webp\\"\,
    topic: "bathroom-accessories",
    description: "A reflective surface, typically of glass coated with a metal amalgam, that reflects a clear image.",
  },
  {
    id: "comb",
    label: "Comb",
    phonetic: "ko?m",
    img: \"\\\/bathroom/comb.webp\\"\,
    topic: "bathroom-accessories",
    description: "A strip of plastic, metal, or wood with a row of narrow teeth, used for untangling or arranging the hair.",
  },
  {
    id: "hairbrush",
    label: "Hairbrush",
    phonetic: "'h??rbr??",
    img: \"\\\/bathroom/hairbrush.webp\\"\,
    topic: "bathroom-accessories",
    description: "A brush for smoothing, styling, or detangling human hair.",
  },
  {
    id: "hairdryer",
    label: "Hairdryer",
    phonetic: "'h??rdra??r",
    img: \"\\\/bathroom/hairdryer.webp\\"\,
    topic: "bathroom-accessories",
    description: "An electrical device that blows warm air to dry hair.",
  },
  {
    id: "razor",
    label: "Razor",
    phonetic: "'re?z?r",
    img: \"\\\/bathroom/razor.webp\\"\,
    topic: "bathroom-accessories",
    description: "An instrument with a sharp blade or combination of blades, used to remove unwanted hair from the face or body.",
  },
  {
    id: "tweezers",
    label: "Tweezers",
    phonetic: "'twi?z?rz",
    img: \"\\\/bathroom/tweezers.webp\\"\,
    topic: "bathroom-accessories",
    description: "A small instrument like a pair of pincers for plucking out hairs and picking up small objects.",
  },
  {
    id: "nail-clippers",
    label: "Nail Clippers",
    phonetic: "ne?l 'kl?p?rz",
    img: \"\\\/bathroom/nail-clippers.webp\\"\,
    topic: "bathroom-accessories",
    description: "A small mechanical device used to trim fingernails and toenails.",
  },
  {
    id: "cotton-swab",
    label: "Cotton Swab",
    phonetic: "'k??t?n sw??b",
    img: \"\\\/bathroom/cotton-swab.webp\\"\,
    topic: "bathroom-accessories",
    description: "A small wad of cotton wool on a short rod, used for cleaning or applying cosmetics.",
  },
  {
    id: "toilet-paper",
    label: "Toilet Paper",
    phonetic: "'t??l?t 'pe?p?r",
    img: \"\\\/bathroom/toilet-paper.webp\\"\,
    topic: "bathroom-accessories",
    description: "Soft paper, usually in rolls, for wiping oneself after using the toilet.",
  },
  {
    id: "plunger",
    label: "Plunger",
    phonetic: "'pl?nd??r",
    img: \"\\\/bathroom/plunger.webp\\"\,
    topic: "bathroom-accessories",
    description: "A device consisting of a rubber cup on a long handle, used to clear blocked pipes by suction.",
  },
  {
    id: "toilet-brush",
    label: "Toilet Brush",
    phonetic: "'t??l?t br??",
    img: \"\\\/bathroom/toilet-brush.webp\\"\,
    topic: "bathroom-accessories",
    description: "A specialized brush used to scrub the inside of a toilet bowl.",
  },
  {
    id: "trash-can",
    label: "Trash Can",
    phonetic: "træ? kæn",
    img: \"\\\/bathroom/trash-can.webp\\"\,
    topic: "bathroom-accessories",
    description: "A container for holding waste materials until they are disposed of.",
  },
  {
    id: "scale",
    label: "Scale",
    phonetic: "ske?l",
    img: \"\\\/bathroom/scale.webp\\"\,
    topic: "bathroom-accessories",
    description: "An instrument or machine for weighing people or objects.",
  },
  {
    id: "laundry-basket",
    label: "Laundry Basket",
    phonetic: "'l??ndri 'bæsk?t",
    img: \"\\\/bathroom/laundry-basket.webp\\"\,
    topic: "bathroom-accessories",
    description: "A hamper or basket used to hold dirty clothes until they are washed.",
  },
  {
    id: "sponge",
    label: "Sponge",
    phonetic: "sp?nd?",
    img: \"\\\/bathroom/sponge.webp\\"\,
    topic: "bathroom-accessories",
    description: "A porous piece of material used for washing and cleaning.",
  },
  {
    id: "loofah",
    label: "Loofah",
    phonetic: "'lu?f?",
    img: \"\\\/bathroom/loofah.webp\\"\,
    topic: "bathroom-accessories",
    description: "A coarse, fibrous sponge used for scrubbing the body during a bath or shower.",
  },
];
\;

const courseUnitEntry = \  bathroom: {
    id: "bathroom",
    name: "The Bathroom",
    description:
      "Explore real-life plumbing fixtures, toiletries, linens, and accessories through 2D scene discovery, audio practice, recall matching, and sentence building.",
    heroImage: \\\\\\\\/bathroom-hero.webp\\\,
    topics: BATHROOM_TOPICS,
    groups: BATHROOM_GROUPS,
    vocabulary: BATHROOM_VOCABULARY,
  },\n};\;

if (!content.includes('BATHROOM_TOPICS')) {
  content = content.replace('export const COURSE_UNITS: Record<string, CourseUnit> = {', bathroomData + '\nexport const COURSE_UNITS: Record<string, CourseUnit> = {');
  content = content.replace(/\n\s*garden:\s*\{[\s\S]*?\n\s*\},\n\};/, (m) => m.replace(/\n\};/, ',\n' + courseUnitEntry));
  fs.writeFileSync(lessonsPath, content, 'utf8');
  console.log('Successfully updated lessons.ts with Bathroom unit data!');
} else {
  console.log('Bathroom unit data already in lessons.ts');
}
