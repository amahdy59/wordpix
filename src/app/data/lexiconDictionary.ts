// Centralized Lexicon Dictionary for WordPix
// Rich vocabulary data researched from Cambridge Advanced Learner's Dictionary,
// Oxford Advanced Learner's Dictionary, and Merriam-Webster.
// Language level strictly capped at CEFR B2 for clarity and learner accessibility.

export interface LexiconSentence {
  context?: string;
  en: string;
  ar: string;
}

export interface LexiconPhrasalVerb {
  phrase: string;
  meaning: string;
  arabic: string;
  example: string;
}

export interface LexiconEntry {
  id: string;
  arabic: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "phrase";
  phonetic?: string;
  pronunciationTip?: string;
  audio?: string;
  meanings?: { en: string; ar: string; sentences: { en: string; ar: string }[] }[];
  collocations: string[];
  phrasalVerbs?: LexiconPhrasalVerb[];
  sentences: LexiconSentence[];
  exampleSentence?: string;
  exampleArabic?: string;
}

export const LEXICON_DICTIONARY: Record<string, LexiconEntry> = {
  toilet: {
    id: "toilet",
    arabic: "مرحاض",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the toilet now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The toilet is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new toilet.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the toilet", "clean the toilet", "buy a toilet"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/toilet.mp3",
    meanings: [
      {
        en: "A bowl fitted with a water supply and a drain, used for urination and defecation.",
        ar: "مرحاض",
        sentences: [
          {
            en: "The toilet is clean.",
            ar: "المرحاض نظيف.",
          },
        ],
      },
    ],
  },
  sink: {
    id: "sink",
    arabic: "حوض",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the sink now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The sink is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new sink.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the sink", "clean the sink", "buy a sink"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/sink.mp3",
    meanings: [
      {
        en: "A bowl attached to the wall or floor, with pipes to supply and carry away water.",
        ar: "حوض",
        sentences: [
          {
            en: "The sink is clean.",
            ar: "الحوض نظيف.",
          },
        ],
      },
    ],
  },
  bathtub: {
    id: "bathtub",
    arabic: "حوض الاستحمام",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the bathtub now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The bathtub is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new bathtub.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the bathtub", "clean the bathtub", "buy a bathtub"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/bathtub.mp3",
    meanings: [
      {
        en: "A long plastic or metal container that you fill with water to sit in and wash yourself.",
        ar: "حوض الاستحمام",
        sentences: [
          {
            en: "The bathtub is clean.",
            ar: "الحوض الاستحمام نظيف.",
          },
        ],
      },
    ],
  },
  shower: {
    id: "shower",
    arabic: "دش",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the shower now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The shower is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new shower.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the shower", "clean the shower", "buy a shower"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/shower.mp3",
    meanings: [
      {
        en: "A piece of equipment that sprays water over you so you can wash your whole body.",
        ar: "دش",
        sentences: [
          {
            en: "The shower is clean.",
            ar: "الدش نظيف.",
          },
        ],
      },
    ],
  },
  faucet: {
    id: "faucet",
    arabic: "صنبور",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the faucet now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The faucet is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new faucet.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the faucet", "clean the faucet", "buy a faucet"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/faucet.mp3",
    meanings: [
      {
        en: "A device that controls the flow of liquid, especially water, from a pipe.",
        ar: "صنبور",
        sentences: [
          {
            en: "The faucet is clean.",
            ar: "الصنبور نظيف.",
          },
        ],
      },
    ],
  },
  drain: {
    id: "drain",
    arabic: "بالوعة",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the drain now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The drain is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new drain.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the drain", "clean the drain", "buy a drain"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/drain.mp3",
    meanings: [
      {
        en: "A hole or pipe through which liquid is carried away.",
        ar: "بالوعة",
        sentences: [
          {
            en: "The drain is clean.",
            ar: "البالوعة نظيف.",
          },
        ],
      },
    ],
  },
  bidet: {
    id: "bidet",
    arabic: "شطاف",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the bidet now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The bidet is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new bidet.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the bidet", "clean the bidet", "buy a bidet"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/bidet.mp3",
    meanings: [
      {
        en: "A small low bath in which a person can wash their lower body.",
        ar: "شطاف",
        sentences: [
          {
            en: "The bidet is clean.",
            ar: "الشطاف نظيف.",
          },
        ],
      },
    ],
  },
  showerhead: {
    id: "showerhead",
    arabic: "رأس الدش",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the showerhead now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The showerhead is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new showerhead.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the showerhead", "clean the showerhead", "buy a showerhead"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/showerhead.mp3",
    meanings: [
      {
        en: "The part of a shower that water flows out of.",
        ar: "رأس الدش",
        sentences: [
          {
            en: "The showerhead is clean.",
            ar: "الرأس الدش نظيف.",
          },
        ],
      },
    ],
  },
  soap: {
    id: "soap",
    arabic: "صابون",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the soap now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The soap is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new soap.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the soap", "clean the soap", "buy a soap"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/soap.mp3",
    meanings: [
      {
        en: "A substance used for washing the body or other things.",
        ar: "صابون",
        sentences: [
          {
            en: "The soap is clean.",
            ar: "الصابون نظيف.",
          },
        ],
      },
    ],
  },
  shampoo: {
    id: "shampoo",
    arabic: "شامبو",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the shampoo now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The shampoo is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new shampoo.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the shampoo", "clean the shampoo", "buy a shampoo"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/shampoo.mp3",
    meanings: [
      {
        en: "A liquid soap used for washing your hair.",
        ar: "شامبو",
        sentences: [
          {
            en: "The shampoo is clean.",
            ar: "الشامبو نظيف.",
          },
        ],
      },
    ],
  },
  conditioner: {
    id: "conditioner",
    arabic: "بلسم الشعر",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the conditioner now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The conditioner is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new conditioner.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the conditioner", "clean the conditioner", "buy a conditioner"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/conditioner.mp3",
    meanings: [
      {
        en: "A liquid used after washing hair to make it soft and shiny.",
        ar: "بلسم الشعر",
        sentences: [
          {
            en: "The conditioner is clean.",
            ar: "البلسم الشعر نظيف.",
          },
        ],
      },
    ],
  },
  toothpaste: {
    id: "toothpaste",
    arabic: "معجون أسنان",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the toothpaste now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The toothpaste is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new toothpaste.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the toothpaste", "clean the toothpaste", "buy a toothpaste"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/toothpaste.mp3",
    meanings: [
      {
        en: "A paste used with a toothbrush to clean your teeth.",
        ar: "معجون أسنان",
        sentences: [
          {
            en: "The toothpaste is clean.",
            ar: "المعجون أسنان نظيف.",
          },
        ],
      },
    ],
  },
  toothbrush: {
    id: "toothbrush",
    arabic: "فرشاة أسنان",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the toothbrush now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The toothbrush is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new toothbrush.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the toothbrush", "clean the toothbrush", "buy a toothbrush"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/toothbrush.mp3",
    meanings: [
      {
        en: "A small brush with a long handle used to clean teeth.",
        ar: "فرشاة أسنان",
        sentences: [
          {
            en: "The toothbrush is clean.",
            ar: "الفرشاة أسنان نظيف.",
          },
        ],
      },
    ],
  },
  deodorant: {
    id: "deodorant",
    arabic: "مزيل عرق",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the deodorant now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The deodorant is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new deodorant.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the deodorant", "clean the deodorant", "buy a deodorant"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/deodorant.mp3",
    meanings: [
      {
        en: "A substance applied to the skin to prevent body odor.",
        ar: "مزيل عرق",
        sentences: [
          {
            en: "The deodorant is clean.",
            ar: "المزيل عرق نظيف.",
          },
        ],
      },
    ],
  },
  lotion: {
    id: "lotion",
    arabic: "لوشن",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the lotion now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The lotion is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new lotion.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the lotion", "clean the lotion", "buy a lotion"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/lotion.mp3",
    meanings: [
      {
        en: "A thick smooth liquid applied to the skin for medicinal or cosmetic purposes.",
        ar: "لوشن",
        sentences: [
          {
            en: "The lotion is clean.",
            ar: "اللوشن نظيف.",
          },
        ],
      },
    ],
  },
  mouthwash: {
    id: "mouthwash",
    arabic: "غسول الفم",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the mouthwash now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The mouthwash is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new mouthwash.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the mouthwash", "clean the mouthwash", "buy a mouthwash"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/mouthwash.mp3",
    meanings: [
      {
        en: "A liquid used to clean the mouth and make the breath smell fresh.",
        ar: "غسول الفم",
        sentences: [
          {
            en: "The mouthwash is clean.",
            ar: "الغسول الفم نظيف.",
          },
        ],
      },
    ],
  },
  "bath-towel": {
    id: "bath-towel",
    arabic: "منشفة استحمام",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the bath towel now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The bath towel is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new bath towel.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the bath towel", "clean the bath towel", "buy a bath towel"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/bath-towel.mp3",
    meanings: [
      {
        en: "A large towel used to dry the body after taking a bath or shower.",
        ar: "منشفة استحمام",
        sentences: [
          {
            en: "The bath towel is clean.",
            ar: "المنشفة استحمام نظيف.",
          },
        ],
      },
    ],
  },
  "hand-towel": {
    id: "hand-towel",
    arabic: "منشفة يد",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the hand towel now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The hand towel is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new hand towel.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the hand towel", "clean the hand towel", "buy a hand towel"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/hand-towel.mp3",
    meanings: [
      {
        en: "A small towel used for drying the hands.",
        ar: "منشفة يد",
        sentences: [
          {
            en: "The hand towel is clean.",
            ar: "المنشفة يد نظيف.",
          },
        ],
      },
    ],
  },
  washcloth: {
    id: "washcloth",
    arabic: "منشفة وجه",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the washcloth now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The washcloth is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new washcloth.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the washcloth", "clean the washcloth", "buy a washcloth"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/washcloth.mp3",
    meanings: [
      {
        en: "A small cloth used to wash the face and body.",
        ar: "منشفة وجه",
        sentences: [
          {
            en: "The washcloth is clean.",
            ar: "المنشفة وجه نظيف.",
          },
        ],
      },
    ],
  },
  "bath-mat": {
    id: "bath-mat",
    arabic: "سجادة حمام",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the bath mat now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The bath mat is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new bath mat.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the bath mat", "clean the bath mat", "buy a bath mat"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/bath-mat.mp3",
    meanings: [
      {
        en: "A small rug placed on the floor next to a bathtub or shower to stand on.",
        ar: "سجادة حمام",
        sentences: [
          {
            en: "The bath mat is clean.",
            ar: "السجادة حمام نظيف.",
          },
        ],
      },
    ],
  },
  bathrobe: {
    id: "bathrobe",
    arabic: "روب استحمام",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the bathrobe now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The bathrobe is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new bathrobe.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the bathrobe", "clean the bathrobe", "buy a bathrobe"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/bathrobe.mp3",
    meanings: [
      {
        en: "A loose piece of clothing worn before or after taking a bath.",
        ar: "روب استحمام",
        sentences: [
          {
            en: "The bathrobe is clean.",
            ar: "الروب استحمام نظيف.",
          },
        ],
      },
    ],
  },
  "shower-curtain": {
    id: "shower-curtain",
    arabic: "ستارة الدش",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the shower curtain now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The shower curtain is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new shower curtain.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the shower curtain", "clean the shower curtain", "buy a shower curtain"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/shower-curtain.mp3",
    meanings: [
      {
        en: "A curtain hung around a shower to keep water from splashing out.",
        ar: "ستارة الدش",
        sentences: [
          {
            en: "The shower curtain is clean.",
            ar: "الستارة الدش نظيف.",
          },
        ],
      },
    ],
  },
  mirror: {
    id: "mirror",
    arabic: "مرآة",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the mirror now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The mirror is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new mirror.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the mirror", "clean the mirror", "buy a mirror"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/mirror.mp3",
    meanings: [
      {
        en: "A piece of glass with a shiny metallic backing that reflects images.",
        ar: "مرآة",
        sentences: [
          {
            en: "The mirror is clean.",
            ar: "المرآة نظيف.",
          },
        ],
      },
    ],
  },
  comb: {
    id: "comb",
    arabic: "مشط",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the comb now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The comb is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new comb.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the comb", "clean the comb", "buy a comb"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/comb.mp3",
    meanings: [
      {
        en: "A tool with a row of teeth used for untangling or arranging hair.",
        ar: "مشط",
        sentences: [
          {
            en: "The comb is clean.",
            ar: "المشط نظيف.",
          },
        ],
      },
    ],
  },
  hairbrush: {
    id: "hairbrush",
    arabic: "فرشاة شعر",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the hairbrush now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The hairbrush is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new hairbrush.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the hairbrush", "clean the hairbrush", "buy a hairbrush"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/hairbrush.mp3",
    meanings: [
      {
        en: "A brush used for grooming and smoothing hair.",
        ar: "فرشاة شعر",
        sentences: [
          {
            en: "The hairbrush is clean.",
            ar: "الفرشاة شعر نظيف.",
          },
        ],
      },
    ],
  },
  hairdryer: {
    id: "hairdryer",
    arabic: "مجفف شعر",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the hairdryer now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The hairdryer is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new hairdryer.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the hairdryer", "clean the hairdryer", "buy a hairdryer"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/hairdryer.mp3",
    meanings: [
      {
        en: "An electrical machine used to dry hair by blowing warm air over it.",
        ar: "مجفف شعر",
        sentences: [
          {
            en: "The hairdryer is clean.",
            ar: "المجفف شعر نظيف.",
          },
        ],
      },
    ],
  },
  razor: {
    id: "razor",
    arabic: "شفرة حلاقة",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the razor now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The razor is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new razor.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the razor", "clean the razor", "buy a razor"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/razor.mp3",
    meanings: [
      {
        en: "An instrument with a sharp blade used to remove hair from the skin.",
        ar: "شفرة حلاقة",
        sentences: [
          {
            en: "The razor is clean.",
            ar: "الشفرة حلاقة نظيف.",
          },
        ],
      },
    ],
  },
  tweezers: {
    id: "tweezers",
    arabic: "ملقط",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the tweezers now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The tweezers is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new tweezers.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the tweezers", "clean the tweezers", "buy a tweezers"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/tweezers.mp3",
    meanings: [
      {
        en: "A small tool consisting of two pointed arms used for picking up small objects or plucking hairs.",
        ar: "ملقط",
        sentences: [
          {
            en: "The tweezers is clean.",
            ar: "الملقط نظيف.",
          },
        ],
      },
    ],
  },
  "nail-clippers": {
    id: "nail-clippers",
    arabic: "قصافة أظافر",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the nail clippers now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The nail clippers is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new nail clippers.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the nail clippers", "clean the nail clippers", "buy a nail clippers"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/nail-clippers.mp3",
    meanings: [
      {
        en: "A tool used for trimming fingernails and toenails.",
        ar: "قصافة أظافر",
        sentences: [
          {
            en: "The nail clippers is clean.",
            ar: "القصافة أظافر نظيف.",
          },
        ],
      },
    ],
  },
  "cotton-swab": {
    id: "cotton-swab",
    arabic: "عود قطن",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the cotton swab now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The cotton swab is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new cotton swab.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the cotton swab", "clean the cotton swab", "buy a cotton swab"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/cotton-swab.mp3",
    meanings: [
      {
        en: "A small stick with cotton on each end, used for cleaning or applying makeup.",
        ar: "عود قطن",
        sentences: [
          {
            en: "The cotton swab is clean.",
            ar: "العود قطن نظيف.",
          },
        ],
      },
    ],
  },
  "toilet-paper": {
    id: "toilet-paper",
    arabic: "ورق تواليت",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the toilet paper now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The toilet paper is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new toilet paper.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the toilet paper", "clean the toilet paper", "buy a toilet paper"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/toilet-paper.mp3",
    meanings: [
      {
        en: "Soft paper in a long roll used for cleaning oneself after using the toilet.",
        ar: "ورق تواليت",
        sentences: [
          {
            en: "The toilet paper is clean.",
            ar: "الورق تواليت نظيف.",
          },
        ],
      },
    ],
  },
  plunger: {
    id: "plunger",
    arabic: "مكبس",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the plunger now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The plunger is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new plunger.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the plunger", "clean the plunger", "buy a plunger"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/plunger.mp3",
    meanings: [
      {
        en: "A tool with a rubber cup on a handle, used to unblock pipes.",
        ar: "مكبس",
        sentences: [
          {
            en: "The plunger is clean.",
            ar: "المكبس نظيف.",
          },
        ],
      },
    ],
  },
  "toilet-brush": {
    id: "toilet-brush",
    arabic: "فرشاة مرحاض",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the toilet brush now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The toilet brush is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new toilet brush.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the toilet brush", "clean the toilet brush", "buy a toilet brush"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/toilet-brush.mp3",
    meanings: [
      {
        en: "A brush used for cleaning the inside of a toilet bowl.",
        ar: "فرشاة مرحاض",
        sentences: [
          {
            en: "The toilet brush is clean.",
            ar: "الفرشاة مرحاض نظيف.",
          },
        ],
      },
    ],
  },
  "trash-can": {
    id: "trash-can",
    arabic: "سلة مهملات",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the trash can now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The trash can is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new trash can.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the trash can", "clean the trash can", "buy a trash can"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/trash-can.mp3",
    meanings: [
      {
        en: "A container used for holding waste.",
        ar: "سلة مهملات",
        sentences: [
          {
            en: "The trash can is clean.",
            ar: "السلة مهملات نظيف.",
          },
        ],
      },
    ],
  },
  scale: {
    id: "scale",
    arabic: "ميزان",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the scale now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The scale is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new scale.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the scale", "clean the scale", "buy a scale"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/scale.mp3",
    meanings: [
      {
        en: "A device used for weighing people or objects.",
        ar: "ميزان",
        sentences: [
          {
            en: "The scale is clean.",
            ar: "الميزان نظيف.",
          },
        ],
      },
    ],
  },
  "laundry-basket": {
    id: "laundry-basket",
    arabic: "سلة غسيل",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the laundry basket now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The laundry basket is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new laundry basket.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the laundry basket", "clean the laundry basket", "buy a laundry basket"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/laundry-basket.mp3",
    meanings: [
      {
        en: "A basket used to hold dirty clothes before they are washed.",
        ar: "سلة غسيل",
        sentences: [
          {
            en: "The laundry basket is clean.",
            ar: "السلة غسيل نظيف.",
          },
        ],
      },
    ],
  },
  sponge: {
    id: "sponge",
    arabic: "إسفنجة",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the sponge now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The sponge is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new sponge.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the sponge", "clean the sponge", "buy a sponge"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/sponge.mp3",
    meanings: [
      {
        en: "A piece of soft, porous material used for washing or cleaning.",
        ar: "إسفنجة",
        sentences: [
          {
            en: "The sponge is clean.",
            ar: "الإسفنجة نظيف.",
          },
        ],
      },
    ],
  },
  loofah: {
    id: "loofah",
    arabic: "ليفة",
    sentences: [
      {
        context: "Daily Needs",
        en: "I need to use the loofah now.",
        ar: "أحتاج إلى استخدام ذلك الآن.",
      },
      { context: "Cleaning", en: "The loofah is very clean.", ar: "إنه نظيف جداً." },
      { context: "Shopping", en: "Please buy a new loofah.", ar: "يرجى شراء واحد جديد." },
    ],
    collocations: ["use the loofah", "clean the loofah", "buy a loofah"],
    phrasalVerbs: [],
    partOfSpeech: "noun",
    audio: "/audio/en-US/loofah.mp3",
    meanings: [
      {
        en: "A rough object used for rubbing and washing the body.",
        ar: "ليفة",
        sentences: [
          {
            en: "The loofah is clean.",
            ar: "الليفة نظيف.",
          },
        ],
      },
    ],
  },

  "alarm-clock": {
    id: "alarm-clock",
    arabic: "سَاعَةُ المُنَبِّه (مُنَبِّه)",
    partOfSpeech: "noun",
    phonetic: "əˈlɑːrm ˌklɑːk",
    pronunciationTip: "Second syllable of 'alarm' and 'clock' carry strong primary vowels.",
    collocations: [
      "set the alarm clock",
      "alarm clock rings",
      "digital alarm clock",
      "turn off the alarm clock",
      "snooze the alarm",
      "bedside alarm clock",
    ],
    phrasalVerbs: [
      {
        phrase: "go off",
        meaning: "ring or sound an alarm",
        arabic: "يَرِنُّ المُنَبِّه",
        example: "My alarm clock goes off at 6:30 every weekday morning.",
      },
      {
        phrase: "wake up",
        meaning: "stop sleeping due to an alarm",
        arabic: "يَسْتَيْقِظُ",
        example: "I woke up immediately when the alarm clock buzzed.",
      },
    ],
    sentences: [
      {
        context: "Morning Routine",
        en: "He set his alarm clock for six o'clock to catch the early train.",
        ar: "ضَبَطَ سَاعَةَ المُنَبِّهِ عَلَى السَّادِسَةِ صَبَاحاً لِيَلْحَقَ بِالقِطَارِ المُبَكِّرِ.",
      },
      {
        context: "Waking Up",
        en: "The alarm clock rang loudly on the nightstand, waking everyone up.",
        ar: "رَنَّ المُنَبِّهُ بِصَوْتٍ عَالٍ عَلَى طَاوِلَةِ السَّرِيرِ، مُوقِظاً الجَمِيعَ.",
      },
      {
        context: "Modern Living",
        en: "She prefers a sunrise alarm clock that gradually fills the room with light.",
        ar: "تُفَضِّلُ مُنَبِّهاً يُحَاكِي الشُّرُوقَ حَيْثُ يَمْلَأُ الغُرْفَةَ بِالضَّوْءِ تَدْرِيجِيّاً.",
      },
    ],
    exampleSentence: "He set his alarm clock for six o'clock to catch the early train.",
    exampleArabic:
      "ضَبَطَ سَاعَةَ المُنَبِّهِ عَلَى السَّادِسَةِ صَبَاحاً لِيَلْحَقَ بِالقِطَارِ المُبَكِّرِ.",
  },
  "aluminum-foil": {
    id: "aluminum-foil",
    arabic: "وَرَقُ أَلُومِنْيُوم (سُولِيفَان / وَرَقُ قَصْدِير)",
    partOfSpeech: "noun",
    phonetic: "əˈluː.mɪ.nəm ˌfɔɪl",
    pronunciationTip: "American: /əˈluː.mɪ.nəm/ (stress on 'LU'). Diphthong 'oil' (/ɔɪl/) in foil.",
    collocations: [
      "roll of aluminum foil",
      "wrap in aluminum foil",
      "line with foil",
      "heavy-duty foil",
      "cover with foil",
      "baking foil",
    ],
    phrasalVerbs: [
      {
        phrase: "wrap up in",
        meaning: "enclose food in foil for baking or grilling",
        arabic: "يَلُفُّ فِي القَصْدِير",
        example: "Wrap up baked potatoes in foil before roasting them in hot coals.",
      },
      {
        phrase: "cover with",
        meaning: "shield food with foil",
        arabic: "يُغَطِّي بِالقَصْدِير",
        example: "Cover the turkey with foil so the breast meat stays moist.",
      },
    ],
    sentences: [
      {
        context: "Roasting Meat",
        en: "She covered the roasting pan with aluminum foil to keep the roast juicy and tender.",
        ar: "غَطَّتْ صِينِيَّةَ الشَّيِّ بِوَرَقِ الأَلُومِنْيُوم لِلْحِفَاظِ عَلَى طَرَاوَةِ اللَّحْمِ.",
      },
      {
        context: "Easy Cleanup",
        en: "Line your baking sheet with heavy-duty aluminum foil for quick post-dinner cleanup.",
        ar: "بَطِّنْ صِينِيَّةَ الخَبْزِ بِوَرَقِ القَصْدِيرِ السَّمِيكِ لِتَسْهِيلِ التَّنْظِيفِ بَعْدَ العَشَاءِ.",
      },
      {
        context: "Outdoor Grilling",
        en: "Wrap corn on the cob in buttered foil and place it directly on the hot grill.",
        ar: "لُفَّ عِرْنَاسَ الذُّرَةِ المَدْهُونَ بِالزُّبْدَةِ فِي القَصْدِيرِ وَضَعْهُ عَلَى الشِّوَايَةِ.",
      },
    ],
    exampleSentence:
      "She covered the roasting pan with aluminum foil to keep the roast juicy and tender.",
    exampleArabic:
      "غَطَّتْ صِينِيَّةَ الشَّيِّ بِوَرَقِ الأَلُومِنْيُوم لِلْحِفَاظِ عَلَى طَرَاوَةِ اللَّحْمِ.",
  },
  apron: {
    id: "apron",
    arabic: "مِرْيَلَةُ مَطْبَخ (مِرْيَلَة)",
    partOfSpeech: "noun",
    phonetic: "ˈeɪ.prən",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'April', followed by soft /prən/.",
    collocations: [
      "wear an apron",
      "tie an apron",
      "chef's apron",
      "cotton apron",
      "linen apron",
      "apron pockets",
    ],
    phrasalVerbs: [
      {
        phrase: "put on",
        meaning: "wear an apron",
        arabic: "يَرْتَدِي المِرْيَلَة",
        example: "He put on his striped chef apron before preparing dinner.",
      },
      {
        phrase: "tie up",
        meaning: "fasten apron strings behind back",
        arabic: "يَرْبِطُ حِبَالَ المِرْيَلَة",
        example: "She tied up the apron straps neatly around her waist.",
      },
    ],
    sentences: [
      {
        context: "Cooking Preparation",
        en: "She tied on a heavy cotton apron to protect her clothes from flour and sauce.",
        ar: "رَبَطَتْ مِرْيَلَةَ مَطْبَخٍ قُطْنِيَّةً سَمِيكَةً لِحِمَايَةِ مَلابِسِهَا مِنَ الطَّحِينِ وَالصَّلْصَةِ.",
      },
      {
        context: "Professional Kitchen",
        en: "All restaurant chefs wear clean white aprons with deep front utility pockets.",
        ar: "يَرْتَدِي جَمِيعُ طُهَاةِ المَطْعَمِ مَرَايِلَ بَيْضَاءَ نَظِيفَةً ذَاتَ جُيُوبٍ أَمَامِيَّةٍ عَمِيقَةٍ.",
      },
      {
        context: "Baking with Kids",
        en: "The children wore mini aprons while decorating cupcakes on Saturday afternoon.",
        ar: "ارْتَدَى الأَطْفَالُ مَرَايِلَ صَغِيرَةً أَثْنَاءَ تَزْيِينِ الكَبْ كِيك بَعْدَ ظُهْرِ السَّبْتِ.",
      },
    ],
    exampleSentence:
      "She tied on a heavy cotton apron to protect her clothes from flour and sauce.",
    exampleArabic:
      "رَبَطَتْ مِرْيَلَةَ مَطْبَخٍ قُطْنِيَّةً سَمِيكَةً لِحِمَايَةِ مَلابِسِهَا مِنَ الطَّحِينِ وَالصَّلْصَةِ.",
  },
  armchair: {
    id: "armchair",
    arabic: "كُرْسِيٌّ بِذِرَاعَيْن (فُوتِيه)",
    partOfSpeech: "noun",
    phonetic: "ˈɑːrm.tʃɛər",
    pronunciationTip: "Compound noun: 'ARM' (/ɑːrm/) + 'CHAIR' (/tʃɛər/).",
    collocations: [
      "cozy armchair",
      "leather armchair",
      "sit in an armchair",
      "reading armchair",
      "armchair by the window",
      "wingback armchair",
    ],
    phrasalVerbs: [
      {
        phrase: "settle into",
        meaning: "sit comfortably in an armchair",
        arabic: "يَسْتَقِرُّ بِرَاحَة",
        example: "He settled into the leather armchair with a warm cup of coffee.",
      },
    ],
    sentences: [
      {
        context: "Reading Corner",
        en: "She curled up in the velvet armchair beside the window with an absorbing novel.",
        ar: "جَلَسَتْ مُسْتَرْخِيَةً فِي الكُرْسِيِّ المَخْمَلِيِّ بِجِوَارِ النَّافِذَةِ مَعَ رِوَايَةٍ شَيِّقَةٍ.",
      },
      {
        context: "Home Styling",
        en: "A pair of mid-century leather armchairs frames the living room fireplace.",
        ar: "يُحِيطُ زَوْجٌ مِنْ الكَرَاسِي الجِلْدِيَّةِ الأَنِيقَةِ بِمِدْفَأَةِ غُرْفَةِ المَعِيشَةِ.",
      },
      {
        context: "Comfort",
        en: "The ergonomic high-back armchair provides exceptional lumbar support.",
        ar: "يُوَفِّرُ الكُرْسِيُّ ذُو الذِّرَاعَيْنِ العَالِي دَعْماً مُمْتَازاً لِأَسْفَلِ الظَّهْرِ.",
      },
    ],
    exampleSentence:
      "She curled up in the velvet armchair beside the window with an absorbing novel.",
    exampleArabic:
      "جَلَسَتْ مُسْتَرْخِيَةً فِي الكُرْسِيِّ المَخْمَلِيِّ بِجِوَارِ النَّافِذَةِ مَعَ رِوَايَةٍ شَيِّقَةٍ.",
  },
  backpack: {
    id: "backpack",
    arabic: "حَقِيبَةُ ظَهْر",
    partOfSpeech: "noun",
    phonetic: "ˈbæk.pæk",
    pronunciationTip: "Both syllables have the short 'a' vowel /æ/ as in 'back' and 'pack'.",
    collocations: [
      "school backpack",
      "pack your backpack",
      "heavy backpack",
      "zip up the backpack",
      "wear a backpack",
      "leather backpack",
    ],
    phrasalVerbs: [
      {
        phrase: "pack up",
        meaning: "fill a backpack with supplies",
        arabic: "يَحْزِمُ الحَقِيبَة",
        example: "Pack up your textbooks and notebook into the backpack.",
      },
      {
        phrase: "strap on",
        meaning: "fasten a backpack onto your shoulders",
        arabic: "يَشُدُّ حَقِيبَةَ الظَّهْر",
        example: "He strapped on his backpack and headed out for the hike.",
      },
    ],
    sentences: [
      {
        context: "School Routine",
        en: "The boy packed his notebook, pencil case, and lunchbox into his backpack.",
        ar: "حَزَمَ الفَتَى دَفْتَرَهُ وَمِقْلَمَتَهُ وَعُلْبَةَ غَدَائِهِ فِي حَقِيبَةِ ظَهْرِهِ.",
      },
      {
        context: "Travel & Commute",
        en: "A water-resistant backpack is perfect for daily commuting on a bicycle.",
        ar: "حَقِيبَةُ الظَّهْرِ المُقَاوِمَةُ لِلْمَاءِ مِثَالِيَّةٌ لِلتَّنَقُّلِ اليَوْمِيِّ عَلَى الدَّرَّاجَةِ الهَوَائِيَّةِ.",
      },
      {
        context: "Ergonomics",
        en: "Adjust both shoulder straps evenly so the heavy backpack doesn't strain your back.",
        ar: "اضْبِطْ حِزَامَيِ الكَتِفِ بِالتَّسَاوِي حَتَّى لا تُجْهِدَ الحَقِيبَةُ الثَّقِيلَةُ ظَهْرَكَ.",
      },
    ],
    exampleSentence: "The boy packed his notebook, pencil case, and lunchbox into his backpack.",
    exampleArabic:
      "حَزَمَ الفَتَى دَفْتَرَهُ وَمِقْلَمَتَهُ وَعُلْبَةَ غَدَائِهِ فِي حَقِيبَةِ ظَهْرِهِ.",
  },
  "baking-dish": {
    id: "baking-dish",
    arabic: "صِينِيَّةُ طَهْيٍ بِالفُرْن (بَايْرِكْس)",
    partOfSpeech: "noun",
    phonetic: "ˈbeɪ.kɪŋ ˌdɪʃ",
    pronunciationTip: "Primary stress on 'BAKING' (/ˈbeɪ.kɪŋ/).",
    collocations: [
      "glass baking dish",
      "rectangular baking dish",
      "grease the baking dish",
      "ovenproof baking dish",
      "ceramic baking dish",
      "deep baking dish",
    ],
    phrasalVerbs: [
      {
        phrase: "pour into",
        meaning: "transfer liquid mix into baking dish",
        arabic: "يَصُبُّ فِي الصِّينِيَّة",
        example: "Pour the seasoned vegetables into the baking dish.",
      },
    ],
    sentences: [
      {
        context: "Home Cooking",
        en: "Grease the rectangular glass baking dish with butter before adding potatoes.",
        ar: "ادْهَنِ الصِّينِيَّةَ الزُّجَاجِيَّةَ المُسْتَطِيلَةَ بِالزُّبْدَةِ قَبْلَ وَضْعِ البَطَاطِسِ.",
      },
      {
        context: "Oven Roasting",
        en: "He roasted seasoned chicken breasts and root vegetables in a ceramic baking dish.",
        ar: "شَوَى صُدُورَ الدَّجَاجِ المُتَبَّلَةَ مَعَ الخُضْرَاوَاتِ فِي صِينِيَّةِ فُرْنٍ خَزَفِيَّةٍ.",
      },
      {
        context: "Cleaning",
        en: "Soak the stubborn baking dish in hot soapy water before scrubbing.",
        ar: "انْقَعْ صِينِيَّةَ الفُرْنِ فِي مَاءٍ سَاخِنٍ وَصَابُونٍ قَبْلَ فَرْكِهَا.",
      },
    ],
    exampleSentence: "Grease the rectangular glass baking dish with butter before adding potatoes.",
    exampleArabic:
      "ادْهَنِ الصِّينِيَّةَ الزُّجَاجِيَّةَ المُسْتَطِيلَةَ بِالزُّبْدَةِ قَبْلَ وَضْعِ البَطَاطِسِ.",
  },
  "baking-tray": {
    id: "baking-tray",
    arabic: "صِينِيَّةُ خَبْز (صَاج)",
    partOfSpeech: "noun",
    phonetic: "ˈbeɪ.kɪŋ ˌtreɪ",
    pronunciationTip: "Compound noun with primary stress on 'BAKING' (/ˈbeɪ.kɪŋ/).",
    collocations: [
      "line the baking tray",
      "baking tray in the oven",
      "grease the baking tray",
      "non-stick baking tray",
      "cookies on a baking tray",
      "hot baking tray",
    ],
    phrasalVerbs: [
      {
        phrase: "line with",
        meaning: "cover a baking tray with parchment",
        arabic: "يُبَطِّنُ بِوَرَقِ الزِّبْدَة",
        example: "Line the baking tray with parchment paper before placing cookie dough.",
      },
    ],
    sentences: [
      {
        context: "Baking Cookies",
        en: "She arranged twelve scoops of chocolate chip dough across the baking tray.",
        ar: "رَتَّبَتِ اثْنَتَيْ عَشْرَةَ قِطْعَةً مِنْ عَجِينَةِ الكُوكِيز بِالشُّوكُولاتَةِ عَلَى صِينِيَّةِ الخَبْزِ.",
      },
      {
        context: "Roasting Vegetables",
        en: "Toss carrots and zucchini with olive oil and spread them on the baking tray.",
        ar: "تَبِّلِ الجَزَرَ وَالكُوسَا بِزَيْتِ الزَّيْتُونِ وَافْرِدْهُمَا عَلَى صِينِيَّةِ الخَبْزِ لِلشَّيِّ.",
      },
      {
        context: "Safety",
        en: "Always wear heavy insulated oven mitts when carrying a hot metal baking tray.",
        ar: "ارْتَدِ دَائِماً قُفَّازَاتِ الفُرْنِ العَازِلَةَ عِنْدَ حَمْلِ صِينِيَّةِ الخَبْزِ المَعْدَنِيَّةِ السَّاخِنَةِ.",
      },
    ],
    exampleSentence: "She arranged twelve scoops of chocolate chip dough across the baking tray.",
    exampleArabic:
      "رَتَّبَتِ اثْنَتَيْ عَشْرَةَ قِطْعَةً مِنْ عَجِينَةِ الكُوكِيز بِالشُّوكُولاتَةِ عَلَى صِينِيَّةِ الخَبْزِ.",
  },
  barn: {
    id: "barn",
    arabic: "حَظِيرَة (زَرِيبَة)",
    partOfSpeech: "noun",
    phonetic: "bɑːrn",
    pronunciationTip: "Broad 'ar' vowel /ɑːr/ as in 'car' or 'farm'.",
    collocations: [
      "red barn",
      "inside the barn",
      "hay in the barn",
      "barn doors",
      "dairy barn",
      "wooden barn",
    ],
    phrasalVerbs: [
      {
        phrase: "lead into",
        meaning: "guide animals into the barn",
        arabic: "يُدْخِلُ إِلَى الحَظِيرَة",
        example: "Lead the milk cows into the barn before it begins to rain.",
      },
    ],
    sentences: [
      {
        context: "Farm Landmark",
        en: "The classic red wooden barn stores golden hay bales and shelters cattle in winter.",
        ar: "تَحْفَظُ الحَظِيرَةُ الخَشَبِيَّةُ الحَمْرَاءُ بَالاتِ القَشِّ وَتَأْوِي المَاشِيَةَ فِي الشِّتَاءِ.",
      },
      {
        context: "Evening Chores",
        en: "They closed the heavy wooden barn doors securely after feeding the animals.",
        ar: "أَغْلَقُوا أَبْوَابَ الحَظِيرَةِ الخَشَبِيَّةِ الثَّقِيلَةَ بِإِحْكَامٍ بَعْدَ إِطْعَامِ الحَيَوَانَاتِ.",
      },
      {
        context: "Hay Loft",
        en: "Pigeons nested high up in the rafters of the historic timber barn.",
        ar: "عَشَّشَ الحَمَامُ فِي الأَعَالِي بَيْنَ عَوَارِضِ الحَظِيرَةِ الخَشَبِيَّةِ التَّارِيخِيَّةِ.",
      },
    ],
    exampleSentence:
      "The classic red wooden barn stores golden hay bales and shelters cattle in winter.",
    exampleArabic:
      "تَحْفَظُ الحَظِيرَةُ الخَشَبِيَّةُ الحَمْرَاءُ بَالاتِ القَشِّ وَتَأْوِي المَاشِيَةَ فِي الشِّتَاءِ.",
  },
  bed: {
    id: "bed",
    arabic: "سَرِير",
    partOfSpeech: "noun",
    phonetic: "bɛd",
    pronunciationTip: "Short 'e' vowel sound, exactly as in 'red' or 'pen'.",
    collocations: [
      "make the bed",
      "go to bed",
      "double bed",
      "single bed",
      "comfortable bed",
      "get into bed",
    ],
    phrasalVerbs: [
      {
        phrase: "turn in",
        meaning: "go to bed for the night",
        arabic: "يَخْلُدُ إِلَى النَّوْم",
        example: "I am exhausted, so I will turn in early tonight.",
      },
      {
        phrase: "sleep in",
        meaning: "sleep later than usual",
        arabic: "يَنَامُ لِوَقْتٍ مُتَأَخِّر",
        example: "On weekends, I love to sleep in until nine.",
      },
      {
        phrase: "tuck in",
        meaning: "cover someone comfortably in bed",
        arabic: "يُدَثِّرُ فِي السَّرِير",
        example: "The mother tucked her child in with a warm blanket.",
      },
    ],
    sentences: [
      {
        context: "Daily Routine",
        en: "She makes her bed neatly every morning after waking up.",
        ar: "تُرَتِّبُ سَرِيرَهَا بِعِنَايَةٍ كُلَّ صَبَاحٍ بَعْدَ الاِسْتِيقَاظِ.",
      },
      {
        context: "Evening Habit",
        en: "After a long working day, he was happy to get into bed.",
        ar: "بَعْدَ يَوْمِ عَمَلٍ طَوِيلٍ، كَانَ سَعِيداً بِالدُّخُولِ إِلَى السَّرِيرِ.",
      },
      {
        context: "Furniture Choice",
        en: "They bought a comfortable double bed for the master bedroom.",
        ar: "اشْتَرَوْا سَرِيراً مُزْدَوَجاً مُرِيحاً لِغُرْفَةِ النَّوْمِ الرَّئِيسِيَّةِ.",
      },
    ],
    exampleSentence: "She makes her bed neatly every morning after waking up.",
    exampleArabic: "تُرَتِّبُ سَرِيرَهَا بِعِنَايَةٍ كُلَّ صَبَاحٍ بَعْدَ الاِسْتِيقَاظِ.",
  },
  "bed-frame": {
    id: "bed-frame",
    arabic: "هَيْكَلُ السَّرِير (شَاسِيه السَّرِير)",
    partOfSpeech: "noun",
    phonetic: "ˈbɛd.freɪm",
    pronunciationTip: "Compound noun with primary stress on 'BED'.",
    collocations: [
      "wooden bed frame",
      "metal bed frame",
      "sturdy bed frame",
      "assemble the bed frame",
      "king-size bed frame",
      "platform bed frame",
    ],
    phrasalVerbs: [
      {
        phrase: "put together",
        meaning: "assemble the parts of a bed frame",
        arabic: "يُجَمِّعُ / يُرَكِّبُ",
        example: "It took them two hours to put together the wooden bed frame.",
      },
      {
        phrase: "take apart",
        meaning: "disassemble for moving",
        arabic: "يُفَكِّكُ",
        example: "They had to take apart the bed frame before moving houses.",
      },
    ],
    sentences: [
      {
        context: "Assembly",
        en: "The solid oak bed frame supports the heavy mattress without squeaking.",
        ar: "يَدْعَمُ هَيْكَلُ السَّرِيرِ المَصْنُوعُ مِنْ خَشَبِ البَلُّوطِ المَرْتَبَةَ الثَّقِيلَةَ دُونَ صَرِيرٍ.",
      },
      {
        context: "Modern Living",
        en: "Platform bed frames with built-in storage drawers save valuable space.",
        ar: "تُوَفِّرُ هَيَاكِلُ الأَسِرَّةِ المِنَصِّيَّةُ ذَاتُ أَدْرَاجِ التَّخْزِينِ المَسَاحَةَ بِفَعَالِيَّةٍ.",
      },
      {
        context: "Design",
        en: "A matte black metal bed frame creates a clean industrial aesthetic.",
        ar: "يَخْلُقُ هَيْكَلُ السَّرِيرِ المَعْدَنِيُّ الأَسْوَدُ المَطْفِيُّ طَابَعاً صِنَاعِيّاً عَصْرِيّاً.",
      },
    ],
    exampleSentence: "The solid oak bed frame supports the heavy mattress without squeaking.",
    exampleArabic:
      "يَدْعَمُ هَيْكَلُ السَّرِيرِ المَصْنُوعُ مِنْ خَشَبِ البَلُّوطِ المَرْتَبَةَ الثَّقِيلَةَ دُونَ صَرِيرٍ.",
  },
  bench: {
    id: "bench",
    arabic: "مَقْعَدٌ طَوِيل (دِكَّة / بَانْك)",
    partOfSpeech: "noun",
    phonetic: "bɛntʃ",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'ten', ending in crisp 'ch' (/tʃ/).",
    collocations: [
      "wooden bench",
      "sit on a bench",
      "dining bench",
      "entryway bench",
      "garden bench",
      "padded bench",
    ],
    phrasalVerbs: [
      {
        phrase: "sit down on",
        meaning: "take a seat on a bench",
        arabic: "يَجْلِسُ عَلَى المَقْعَد",
        example: "They sat down on the wooden bench to tie their running shoes.",
      },
    ],
    sentences: [
      {
        context: "Entryway Seating",
        en: "An upholstered entryway bench gives guests a convenient spot to remove shoes.",
        ar: "يَمْنَحُ المَقْعَدُ المُبَطَّنُ فِي المَدْخَلِ الضُّيُوفَ مَكَاناً مُرِيحاً لِخَلْعِ الأَحْذِيَةِ.",
      },
      {
        context: "Dining Setup",
        en: "Replacing three chairs with a long wooden bench saves space along the wall.",
        ar: "يُوَفِّرُ اسْتِبْدَالُ ثَلاثَةِ كَرَاسٍ بِمَقْعَدٍ خَشَبِيٍّ طَوِيلٍ مَسَاحَةً مُمْتَازَةً.",
      },
      {
        context: "Outdoor Park",
        en: "They sat on a park bench under a blooming cherry blossom tree.",
        ar: "جَلَسُوا عَلَى مَقْعَدِ الحَدِيقَةِ تَحْتَ شَجَرَةِ كَرَزٍ مُزْهِرَةٍ.",
      },
    ],
    exampleSentence:
      "An upholstered entryway bench gives guests a convenient spot to remove shoes.",
    exampleArabic:
      "يَمْنَحُ المَقْعَدُ المُبَطَّنُ فِي المَدْخَلِ الضُّيُوفَ مَكَاناً مُرِيحاً لِخَلْعِ الأَحْذِيَةِ.",
  },
  blanket: {
    id: "blanket",
    arabic: "بَطَّانِيَّة",
    partOfSpeech: "noun",
    phonetic: "ˈblæŋ.kɪt",
    pronunciationTip: "Contains the 'ng' sound (/ŋ/) followed by 'kit'.",
    collocations: [
      "warm blanket",
      "wool blanket",
      "wrap in a blanket",
      "pull up the blanket",
      "heavy blanket",
      "throw blanket",
    ],
    phrasalVerbs: [
      {
        phrase: "wrap up",
        meaning: "cover oneself completely in a blanket",
        arabic: "يَلْتَفُّ بِالبَطَّانِيَّة",
        example: "On cold winter nights, we wrap up in thick blankets.",
      },
      {
        phrase: "cover up",
        meaning: "place a blanket over someone",
        arabic: "يُغَطِّي",
        example: "The father covered up his sleeping son with a warm quilt.",
      },
    ],
    sentences: [
      {
        context: "Cold Weather",
        en: "She pulled the warm wool blanket up to her chin on the chilly night.",
        ar: "سَحَبَتِ البَطَّانِيَّةَ الصُّوفِيَّةَ الدَّافِئَةَ حَتَّى ذَقْنِهَا فِي تِلْكَ اللَّيْلَةِ البَارِدَةِ.",
      },
      {
        context: "Living Room",
        en: "A soft knit throw blanket is draped over the arm of the sofa.",
        ar: "بَطَّانِيَّةٌ خَفِيفَةٌ نَاعِمَةٌ مُلْقَاةٌ عَلَى مِسْنَدِ الأَرِيكَةِ.",
      },
      {
        context: "Hospitality",
        en: "The hotel provided an extra blanket in the wardrobe for guests.",
        ar: "وَفَّرَ الفُنْدُقُ بَطَّانِيَّةً إِضَافِيَّةً فِي الخِزَانَةِ لِلنُّزَلاءِ.",
      },
    ],
    exampleSentence: "She pulled the warm wool blanket up to her chin on the chilly night.",
    exampleArabic:
      "سَحَبَتِ البَطَّانِيَّةَ الصُّوفِيَّةَ الدَّافِئَةَ حَتَّى ذَقْنِهَا فِي تِلْكَ اللَّيْلَةِ البَارِدَةِ.",
  },
  blender: {
    id: "blender",
    arabic: "خَلَّاطٌ كَهْرَبَائِيّ",
    partOfSpeech: "noun",
    phonetic: "ˈblɛn.dər",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'blend' or 'bend'.",
    collocations: [
      "smoothie in the blender",
      "blend on high speed",
      "blender jar",
      "electric blender",
      "crush ice in a blender",
      "clean the blender",
    ],
    phrasalVerbs: [
      {
        phrase: "blend up",
        meaning: "mix ingredients until smooth",
        arabic: "يَخْلِطُ جَيِّداً",
        example: "Blend up fresh strawberries, yogurt, and bananas.",
      },
      {
        phrase: "whip up",
        meaning: "prepare a drink quickly",
        arabic: "يُحَضِّرُ سَرِيعاً",
        example: "She whipped up a protein shake in the blender.",
      },
    ],
    sentences: [
      {
        context: "Healthy Drinks",
        en: "She blended fresh spinach, frozen mango, and almond milk for breakfast.",
        ar: "خَلَطَتِ السَّبَانِخَ الطَّازَجَةَ وَالمَانْجُو المُجَمَّدَ وَحَلِيبَ اللَّوْزِ لِفُطُورٍ صِحِّيٍّ.",
      },
      {
        context: "Soup Preparation",
        en: "Purée cooked pumpkin and vegetable broth in the blender until creamy.",
        ar: "اخْفِقِ اليَقْطِينَ المَطْبُوخَ مَعَ مَرَقِ الخُضَارِ فِي الخَلَّاطِ حَتَّى يُصْبِحَ كَرِيمِيّاً.",
      },
      {
        context: "Appliance Care",
        en: "Add warm water and a drop of dish soap, then run the blender to clean it.",
        ar: "أَضِفْ مَاءً دَافِئاً وَقَطْرَةَ صَابُونٍ ثُمَّ شَغِّلِ الخَلَّاطَ لِتَنْظِيفِهِ بِسُهُولَةٍ.",
      },
    ],
    exampleSentence: "She blended fresh spinach, frozen mango, and almond milk for breakfast.",
    exampleArabic:
      "خَلَطَتِ السَّبَانِخَ الطَّازَجَةَ وَالمَانْجُو المُجَمَّدَ وَحَلِيبَ اللَّوْزِ لِفُطُورٍ صِحِّيٍّ.",
  },
  blinds: {
    id: "blinds",
    arabic: "سَتَائِرُ النَّافِذَة (شِيش / سَتَائِر مَعْدَنِيَّة)",
    partOfSpeech: "noun",
    phonetic: "blaɪndz",
    pronunciationTip:
      "Long 'i' diphthong /aɪ/ as in 'find' or 'mind'. Always plural in this meaning.",
    collocations: [
      "draw the blinds",
      "open the blinds",
      "close the blinds",
      "roller blinds",
      "venetian blinds",
      "pull down the blinds",
    ],
    phrasalVerbs: [
      {
        phrase: "pull down",
        meaning: "lower the blinds to block daylight",
        arabic: "يُنْزِلُ الشِّيشَ لِحَجْبِ الضَّوْء",
        example: "Pull down the blinds to keep the afternoon sun out.",
      },
      {
        phrase: "roll up",
        meaning: "raise roller blinds",
        arabic: "يَرْفَعُ السَّتَائِرَ المَلْفُوفَة",
        example: "She rolled up the blinds to let in the morning breeze.",
      },
      {
        phrase: "let in",
        meaning: "allow light through by opening blinds",
        arabic: "يَسْمَحُ بِدُخُولِ الضَّوْء",
        example: "Adjust the slat angle to let in more daylight.",
      },
    ],
    sentences: [
      {
        context: "Privacy & Light",
        en: "She closed the window blinds to block the harsh afternoon sun.",
        ar: "أَغْلَقَتْ سَتَائِرَ النَّافِذَةِ لِحَجْبِ ضَوْءِ شَمْسِ الظَّهِيرَةِ الحَارِقِ.",
      },
      {
        context: "Morning Routine",
        en: "He pulled up the wooden blinds and looked out at the garden.",
        ar: "رَفَعَ الشِّيشَ الخَشَبِيَّ وَنَظَرَ إِلَى الحَدِيقَةِ فِي الخَارِجِ.",
      },
      {
        context: "Home Styling",
        en: "Modern roller blinds offer clean lines and excellent light control.",
        ar: "تُوَفِّرُ السَّتَائِرُ المَعْدَنِيَّةُ المَلْفُوفَةُ مَظْهَراً أَنِيقاً وَتَحَكُّماً مُمْتَازاً فِي الإِضَاءَةِ.",
      },
    ],
    exampleSentence: "She closed the window blinds to block the harsh afternoon sun.",
    exampleArabic:
      "أَغْلَقَتْ سَتَائِرَ النَّافِذَةِ لِحَجْبِ ضَوْءِ شَمْسِ الظَّهِيرَةِ الحَارِقِ.",
  },
  "board-game": {
    id: "board-game",
    arabic: "لُعْبَةُ أَلْوَاح (لُعْبَةُ طَاوِلَة)",
    partOfSpeech: "noun",
    phonetic: "ˈbɔːrd ˌɡeɪm",
    pronunciationTip: "Compound noun: 'BOARD' (/bɔːrd/) + 'GAME' (/ɡeɪm/).",
    collocations: [
      "play a board game",
      "strategy board game",
      "family board game",
      "board game pieces",
      "roll the dice in a board game",
      "board game night",
    ],
    phrasalVerbs: [
      {
        phrase: "set up",
        meaning: "arrange board game pieces on table",
        arabic: "يُرَتِّبُ قِطَعَ اللُّعْبَة",
        example: "Set up the board game on the coffee table so we can begin playing.",
      },
      {
        phrase: "pack away",
        meaning: "store game pieces back into the box",
        arabic: "يَحْفَظُ اللُّعْبَةَ فِي العُلْبَة",
        example: "Pack away all the dice and tokens after finishing the game.",
      },
    ],
    sentences: [
      {
        context: "Family Game Night",
        en: "Every Friday evening, the family gathers around the table to play a fun board game.",
        ar: "تَجْتَمِعُ العَائِلَةُ مَسَاءَ كُلِّ جُمْعَةٍ حَوْلَ الطَّاوِلَةِ لِلَعِبِ لُعْبَةِ أَلْوَاحٍ مُسَلِّيَةٍ.",
      },
      {
        context: "Strategy Fun",
        en: "Strategic board games challenge your critical thinking and tactical planning skills.",
        ar: "تَتَحَدَّى أَلْعَابُ الأَلْوَاحِ الاِسْتِرَاتِيجِيَّةُ التَّفْكِيرَ النَّقْدِيَّ وَمَهَارَاتِ التَّخْطِيطِ.",
      },
      {
        context: "Rules",
        en: "Read through the instruction booklet carefully before starting a new board game.",
        ar: "اقْرَأْ كُتَيِّبَ التَّعْلِيمَاتِ بِعِنَايَةٍ قَبْلَ بَدْءِ لُعْبَةِ أَلْوَاحٍ جَدِيدَةٍ.",
      },
    ],
    exampleSentence:
      "Every Friday evening, the family gathers around the table to play a fun board game.",
    exampleArabic:
      "تَجْتَمِعُ العَائِلَةُ مَسَاءَ كُلِّ جُمْعَةٍ حَوْلَ الطَّاوِلَةِ لِلَعِبِ لُعْبَةِ أَلْوَاحٍ مُسَلِّيَةٍ.",
  },
  book: {
    id: "book",
    arabic: "كِتَاب",
    partOfSpeech: "noun",
    phonetic: "bʊk",
    pronunciationTip: "Short 'oo' vowel /ʊ/ as in 'look' or 'took'.",
    collocations: [
      "read a book",
      "open a book",
      "close the book",
      "hardcover book",
      "favorite book",
      "book on the table",
    ],
    phrasalVerbs: [
      {
        phrase: "look through",
        meaning: "browse pages of a book",
        arabic: "يَتَصَفَّحُ الكِتَاب",
        example: "She looked through the art book while waiting.",
      },
      {
        phrase: "read through",
        meaning: "read from beginning to end",
        arabic: "يَقْرَأُ حَتَّى النِّهَايَة",
        example: "He read through the entire novel in a single weekend.",
      },
    ],
    sentences: [
      {
        context: "Reading Habit",
        en: "He loves curling up with an inspiring history book on quiet Sunday afternoons.",
        ar: "يَعْشَقُ الاِسْتِرْخَاءَ مَعَ كِتَابِ تَارِيخٍ مُلْهِمٍ فِي أَمْسِيَاتِ الأَحَدِ الهَادِئَةِ.",
      },
      {
        context: "Library & Study",
        en: "She borrowed three fascinating science books from the city public library.",
        ar: "اسْتَعَارَتْ ثَلاثَةَ كُتُبٍ عِلْمِيَّةٍ شَيِّقَةٍ مِنْ مَكْتَبَةِ المَدِينَةِ العَامَّةِ.",
      },
      {
        context: "Coffee Table Decor",
        en: "A large hardcover photography book adds elegance to the living room coffee table.",
        ar: "يُضِيفُ كِتَابُ صُوَرٍ فُوتُوغرَافِيَّةٍ فَاخِرٌ أَنَاقَةً عَلَى طَاوِلَةِ القَهْوَةِ.",
      },
    ],
    exampleSentence:
      "He loves curling up with an inspiring history book on quiet Sunday afternoons.",
    exampleArabic:
      "يَعْشَقُ الاِسْتِرْخَاءَ مَعَ كِتَابِ تَارِيخٍ مُلْهِمٍ فِي أَمْسِيَاتِ الأَحَدِ الهَادِئَةِ.",
  },
  books: {
    id: "books",
    arabic: "كُتُب",
    partOfSpeech: "noun",
    phonetic: "bʊks",
    pronunciationTip: "Short 'oo' vowel sound /ʊ/ as in 'look' or 'took'.",
    collocations: [
      "stack of books",
      "read books",
      "shelf of books",
      "pile of books",
      "open the book",
      "fascinating books",
    ],
    phrasalVerbs: [
      {
        phrase: "look through",
        meaning: "browse or flip through books",
        arabic: "يَتَصَفَّحُ الكُتُب",
        example: "He looked through several art books at the library.",
      },
      {
        phrase: "read up on",
        meaning: "learn about a topic by reading books",
        arabic: "يَقْرَأُ لِيَسْتَفِيدَ عَنْ مَوْضُوع",
        example: "She read up on astronomy before visiting the planetarium.",
      },
    ],
    sentences: [
      {
        context: "Reading Habit",
        en: "She enjoys reading historical and science books for an hour before bedtime.",
        ar: "تَسْتَمْتِعُ بِقِرَاءَةِ الكُتُبِ التَّارِيخِيَّةِ وَالعِلْمِيَّةِ لِمُدَّةِ سَاعَةٍ قَبْلَ النَّوْمِ.",
      },
      {
        context: "Organization",
        en: "A neat stack of hardback books is arranged alphabetically on the shelf.",
        ar: "تَمَّ تَرْتِيبُ مَجْمُوعَةٍ أَنِيقَةٍ مِنَ الكُتُبِ ذَاتِ الأَغْلِفَةِ المُقَوَّاةِ أَبْجَدِيّاً عَلَى الرَّفِّ.",
      },
      {
        context: "Learning",
        en: "Good books open up new perspectives and expand your vocabulary.",
        ar: "تَفْتَحُ الكُتُبُ الجَيِّدَةُ آفَاقاً جَدِيدَةً وَتُثْرِي حَصِيلَتَكَ اللُّغَوِيَّةَ.",
      },
    ],
    exampleSentence: "She enjoys reading historical and science books for an hour before bedtime.",
    exampleArabic:
      "تَسْتَمْتِعُ بِقِرَاءَةِ الكُتُبِ التَّارِيخِيَّةِ وَالعِلْمِيَّةِ لِمُدَّةِ سَاعَةٍ قَبْلَ النَّوْمِ.",
  },
  bookshelf: {
    id: "bookshelf",
    arabic: "رَفُّ الكُتُب / مَكْتَبَةٌ حَائِطِيَّة",
    partOfSpeech: "noun",
    phonetic: "ˈbʊk.ʃɛlf",
    pronunciationTip: "Compound word: 'BOOK' + 'SHELF'. Plural is 'bookshelves'.",
    collocations: [
      "fill the bookshelf",
      "wooden bookshelf",
      "on the bookshelf",
      "organize the bookshelf",
      "tall bookshelf",
      "dust the bookshelf",
    ],
    phrasalVerbs: [
      {
        phrase: "look through",
        meaning: "browse books on a shelf",
        arabic: "يَتَصَفَّحُ",
        example: "She looked through the bookshelf to find a dictionary.",
      },
      {
        phrase: "take down",
        meaning: "remove an item from a high shelf",
        arabic: "يُنْزِلُ شَيْئاً مِنْ مَكَانٍ عَالٍ",
        example: "He took down a heavy encyclopedia from the top bookshelf.",
      },
    ],
    sentences: [
      {
        context: "Reading Corner",
        en: "The tall bookshelf holds hundreds of historical and science novels.",
        ar: "تَحْمِلُ خِزَانَةُ الكُتُبِ الطَّوِيلَةُ مِئَاتِ الرِّوَايَاتِ التَّارِيخِيَّةِ وَالعِلْمِيَّةِ.",
      },
      {
        context: "Maintenance",
        en: "She spent Sunday afternoon dusting and organizing her bookshelf.",
        ar: "قَضَتْ بَعْدَ ظُهْرِ يَوْمِ الأَحَدِ فِي تَنْظِيفِ وَتَرْتِيبِ رَفِّ الكُتُبِ.",
      },
      {
        context: "Decor",
        en: "A small green plant looks lovely sitting on the middle bookshelf.",
        ar: "تَبْدُو النَّبْتَةُ الخَضْرَاءُ الصَّغِيرَةُ جَمِيلَةً عَلَى الرَّفِّ الأَوْسَطِ لِلْكُتُبِ.",
      },
    ],
    exampleSentence: "The tall bookshelf holds hundreds of historical and science novels.",
    exampleArabic:
      "تَحْمِلُ خِزَانَةُ الكُتُبِ الطَّوِيلَةُ مِئَاتِ الرِّوَايَاتِ التَّارِيخِيَّةِ وَالعِلْمِيَّةِ.",
  },
  bowl: {
    id: "bowl",
    arabic: "زَبْدِيَّة / سُلْطَانِيَّة (وِعَاء / طَاسَة)",
    partOfSpeech: "noun",
    phonetic: "boʊl",
    pronunciationTip: "Long 'o' vowel /oʊ/ as in 'grow' or 'soul'.",
    collocations: [
      "soup bowl",
      "salad bowl",
      "cereal bowl",
      "mixing bowl",
      "wooden bowl",
      "deep bowl",
    ],
    phrasalVerbs: [
      {
        phrase: "fill up",
        meaning: "fill a bowl to the top",
        arabic: "يَمْلَأُ الوِعَاء",
        example: "Fill up the bowl with fresh crunchy strawberries.",
      },
    ],
    sentences: [
      {
        context: "Breakfast",
        en: "He poured crispy oat cereal and cold milk into a ceramic breakfast bowl.",
        ar: "سَكَبَ رَقَائِقَ الشُّوفَانِ المُقَرْمَشَةَ وَالحَلِيبَ البَارِدَ فِي زَبْدِيَّةِ الإِفْطَارِ الخَزَفِيَّةِ.",
      },
      {
        context: "Soup Serving",
        en: "A steaming bowl of chicken noodle soup is comforting on a rainy day.",
        ar: "زَبْدِيَّةُ حَسَاءِ الدَّجَاجِ بِالشَّعْرِيَّةِ السَّاخِنَةُ مَبْعَثٌ لِلدِّفْءِ فِي الأَيَّامِ المَاطِرَةِ.",
      },
      {
        context: "Salad Prep",
        en: "Toss the fresh garden greens in a large wooden salad bowl.",
        ar: "قَلِّبِ الخُضَارَ الطَّازَجَةَ فِي سُلْطَانِيَّةِ سَلَطَةٍ خَشَبِيَّةٍ كَبِيرَةٍ.",
      },
    ],
    exampleSentence: "He poured crispy oat cereal and cold milk into a ceramic breakfast bowl.",
    exampleArabic:
      "سَكَبَ رَقَائِقَ الشُّوفَانِ المُقَرْمَشَةَ وَالحَلِيبَ البَارِدَ فِي زَبْدِيَّةِ الإِفْطَارِ الخَزَفِيَّةِ.",
  },
  bread: {
    id: "bread",
    arabic: "خُبْز (عَيْش)",
    partOfSpeech: "noun",
    phonetic: "brɛd",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'red' or 'head'.",
    collocations: [
      "loaf of bread",
      "slice of bread",
      "fresh bread",
      "whole wheat bread",
      "crusty bread",
      "bake bread",
    ],
    phrasalVerbs: [
      {
        phrase: "cut off",
        meaning: "slice off a portion of a loaf",
        arabic: "يَقْطَعُ شَرِيحَة",
        example: "He cut off a thick slice of warm sourdough bread.",
      },
    ],
    sentences: [
      {
        context: "Bakery",
        en: "The aroma of freshly baked sourdough bread filled the entire kitchen.",
        ar: "مَلَأَتْ رَائِحَةُ خُبْزِ السَّاوَرْدُو الطَّازَجِ المَخْبُوزِ المَطْبَخَ بِأَكْمَلِهِ.",
      },
      {
        context: "Breakfast",
        en: "She toasted two slices of whole grain bread and spread strawberry jam on top.",
        ar: "حَمَّصَتْ شَرِيحَتَيْنِ مِنْ خُبْزِ الحُبُوبِ الكَامِلَةِ وَدَهَنَتْ فَوْقَهُمَا مُرَبَّى الفَرَاوِلَةِ.",
      },
      {
        context: "Dinner Accompaniment",
        en: "Serve warm crusty French bread alongside the homemade tomato soup.",
        ar: "قَدِّمِ الخُبْزَ الفَرَنْسِيَّ المُقَرْمَشَ السَّاخِنَ بِجَانِبِ شُورْبَةِ الطَّمَاطِمِ المَنْزِلِيَّةِ.",
      },
    ],
    exampleSentence: "The aroma of freshly baked sourdough bread filled the entire kitchen.",
    exampleArabic:
      "مَلَأَتْ رَائِحَةُ خُبْزِ السَّاوَرْدُو الطَّازَجِ المَخْبُوزِ المَطْبَخَ بِأَكْمَلِهِ.",
  },
  bucket: {
    id: "bucket",
    arabic: "دَلْو (جَرْدَل)",
    partOfSpeech: "noun",
    phonetic: "ˈbʌk.ɪt",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'cup', followed by short /ɪt/.",
    collocations: [
      "bucket of water",
      "metal bucket",
      "plastic bucket",
      "fill the bucket",
      "carry a bucket",
      "milking bucket",
    ],
    phrasalVerbs: [
      {
        phrase: "fill up",
        meaning: "fill a bucket with water or feed",
        arabic: "يَمْلَأُ الدَّلْو",
        example: "Fill up the bucket with clean tap water for the calves.",
      },
      {
        phrase: "pour out",
        meaning: "empty liquid from bucket",
        arabic: "يَسْكُبُ مِنَ الجَرْدَل",
        example: "Pour out the soapy water after washing the floor.",
      },
    ],
    sentences: [
      {
        context: "Feeding Animals",
        en: "She carried two heavy plastic buckets filled with nutritious grain to the horse stalls.",
        ar: "حَمَلَتْ دَلْوَيْنِ بَلاسْتِيكِيَّيْنِ ثَقِيلَيْنِ مَلِيئَيْنِ بِالحُبُوبِ المُغَذِّيَةِ لِلْخُيُولِ.",
      },
      {
        context: "Milking",
        en: "The farmer sat on a low stool and squeezed fresh milk into a stainless steel bucket.",
        ar: "جَلَسَ المُزَارِعُ عَلَى مَقْعَدٍ قَصِيرٍ وَحَلَبَ الحَلِيبَ الطَّازَجَ فِي دَلْوٍ سْتَانْلِس.",
      },
      {
        context: "Washing Vehicles",
        en: "Fill the bucket with warm water and car soap to wash down the farm truck.",
        ar: "امْلَأِ الدَّلْوَ بِمَاءٍ دَافِئٍ وَصَابُونٍ لِغَسْلِ شَاحِنَةِ المَزْرَعَةِ.",
      },
    ],
    exampleSentence:
      "She carried two heavy plastic buckets filled with nutritious grain to the horse stalls.",
    exampleArabic:
      "حَمَلَتْ دَلْوَيْنِ بَلاسْتِيكِيَّيْنِ ثَقِيلَيْنِ مَلِيئَيْنِ بِالحُبُوبِ المُغَذِّيَةِ لِلْخُيُولِ.",
  },
  butter: {
    id: "butter",
    arabic: "زُبْدَة",
    partOfSpeech: "noun",
    phonetic: "ˈbʌt.ər",
    pronunciationTip: "Short 'u' vowel /ʌ/ followed by 'ter' (/ˈbʌt.ər/).",
    collocations: [
      "spread butter",
      "melted butter",
      "salted butter",
      "unsalted butter",
      "stick of butter",
      "softened butter",
    ],
    phrasalVerbs: [
      {
        phrase: "melt down",
        meaning: "liquefy butter in a pan",
        arabic: "يُذِيبُ الزُّبْدَة",
        example: "Melt down two tablespoons of unsalted butter over low heat.",
      },
      {
        phrase: "spread on",
        meaning: "apply butter over bread",
        arabic: "يَدْهَنُ عَلَى الخُبْز",
        example: "Spread softened butter evenly across the warm toast.",
      },
    ],
    sentences: [
      {
        context: "Breakfast",
        en: "He spread rich creamy butter across a warm slice of toasted bread.",
        ar: "دَهَنَ زُبْدَةً كَرِيمِيَّةً غَنِيَّةً عَلَى شَرِيحَةِ خُبْزٍ مُحَمَّصٍ دَافِئَةٍ.",
      },
      {
        context: "Baking",
        en: "Cream room-temperature unsalted butter and white sugar together until pale and fluffy.",
        ar: "اخْفِقِ الزُّبْدَةَ غَيْرَ المُمَلَّحَةِ فِي دَرَجَةِ حَرَارَةِ الغُرْفَةِ مَعَ السُّكَّرِ حَتَّى تُصْبِحَ هَشَّةً.",
      },
      {
        context: "Cooking Sauce",
        en: "Swirl a tablespoon of cold butter into the sauce right before serving for gloss.",
        ar: "قَلِّبْ مِلْعَقَةً مِنْ الزُّبْدَةِ البَارِدَةِ فِي الصَّلْصَةِ قَبْلَ التَّقْدِيمِ لِإِعْطَائِهَا لَمَعَاناً.",
      },
    ],
    exampleSentence: "He spread rich creamy butter across a warm slice of toasted bread.",
    exampleArabic:
      "دَهَنَ زُبْدَةً كَرِيمِيَّةً غَنِيَّةً عَلَى شَرِيحَةِ خُبْزٍ مُحَمَّصٍ دَافِئَةٍ.",
  },
  cabinet: {
    id: "cabinet",
    arabic: "دُولابٌ صَغِير (خِزَانَة)",
    partOfSpeech: "noun",
    phonetic: "ˈkæb.ə.nət",
    pronunciationTip: "Three syllables: 'CAB-i-net' (/ˈkæb.ə.nət/).",
    collocations: [
      "kitchen cabinet",
      "wooden cabinet",
      "medicine cabinet",
      "store in the cabinet",
      "cabinet doors",
      "lock the cabinet",
    ],
    phrasalVerbs: [
      {
        phrase: "put away in",
        meaning: "store items inside a cabinet",
        arabic: "يَحْفَظُ فِي الخِزَانَة",
        example: "Put away the clean mugs and plates inside the kitchen cabinet.",
      },
    ],
    sentences: [
      {
        context: "Kitchen Storage",
        en: "She organized all spices and canned beans inside the upper kitchen cabinet.",
        ar: "رَتَّبَتِ البَهَارَاتِ وَالبُقُولِيَّاتِ المُعَلَّبَةَ دَاخِلَ خِزَانَةِ المَطْبَخِ العُلْوِيَّةِ.",
      },
      {
        context: "Living Room Accent",
        en: "An antique display cabinet with glass doors showcases vintage porcelain tea sets.",
        ar: "تَعْرِضُ خِزَانَةُ عَرْضٍ كِلاسِيكِيَّةٌ ذَاتُ أَبْوَابٍ زُجَاجِيَّةٍ أَطْقُمَ شَايٍ خَزَفِيَّةً.",
      },
      {
        context: "Safety",
        en: "Keep medicines securely locked inside the wall-mounted bathroom cabinet.",
        ar: "احْفَظِ الأَدْوِيَةَ مُقْفَلَةً بِأَمَانٍ دَاخِلَ خِزَانَةِ الحَمَّامِ الجِدَارِيَّةِ.",
      },
    ],
    exampleSentence: "She organized all spices and canned beans inside the upper kitchen cabinet.",
    exampleArabic:
      "رَتَّبَتِ البَهَارَاتِ وَالبُقُولِيَّاتِ المُعَلَّبَةَ دَاخِلَ خِزَانَةِ المَطْبَخِ العُلْوِيَّةِ.",
  },
  cable: {
    id: "cable",
    arabic: "كَابِل / سِلْكُ كَهْرَبَاء",
    partOfSpeech: "noun",
    phonetic: "ˈkeɪ.bəl",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'able', followed by soft /bəl/.",
    collocations: [
      "HDMI cable",
      "charging cable",
      "power cable",
      "tangled cables",
      "connect the cable",
      "cable management",
    ],
    phrasalVerbs: [
      {
        phrase: "plug in",
        meaning: "connect a cable end to a port",
        arabic: "يَصِلُ الكَابِل",
        example: "Plug in the HDMI cable between the television and the console.",
      },
      {
        phrase: "untangle",
        meaning: "straighten knotted cords",
        arabic: "يَفُكُّ تَشَابُكَ الأَسْلاك",
        example: "He spent ten minutes untangling the mess of headphone cables.",
      },
    ],
    sentences: [
      {
        context: "Audio-Visual",
        en: "Connect the high-speed HDMI cable between the game console and the television.",
        ar: "صِلْ كَابِلَ HDMI عَالِي السُّرْعَةِ بَيْنَ جِهَازِ الأَلْعَابِ وَشَاشَةِ التِّلْفَازِ.",
      },
      {
        context: "Cable Organization",
        en: "Use Velcro cable ties to bundle computer wires neatly behind the desk.",
        ar: "اسْتَخْدِمْ رَوَابِطَ الأَسْلاكِ لِتَجْمِيعِ كَابِلاتِ الكُمْبِيُوتَرِ بِتَرْتِيبٍ خَلْفَ المَكْتَبِ.",
      },
      {
        context: "Wear & Tear",
        en: "Replace any electrical cable immediately if the protective insulation becomes frayed.",
        ar: "اسْتَبْدِلْ أَيَّ كَابِلٍ كَهْرَبَائِيٍّ فَوْراً إِذَا تَعَرَّضَ عَازِلُهُ لِلتَّآكُلِ أَوِ التَّلَفِ.",
      },
    ],
    exampleSentence:
      "Connect the high-speed HDMI cable between the game console and the television.",
    exampleArabic:
      "صِلْ كَابِلَ HDMI عَالِي السُّرْعَةِ بَيْنَ جِهَازِ الأَلْعَابِ وَشَاشَةِ التِّلْفَازِ.",
  },
  calendar: {
    id: "calendar",
    arabic: "تَقْوِيم (نَتِيجَة)",
    partOfSpeech: "noun",
    phonetic: "ˈkæl.ən.dər",
    pronunciationTip: "Three syllables with primary stress on 'CAL' (/ˈkæl.ən.dər/).",
    collocations: [
      "wall calendar",
      "check the calendar",
      "mark on the calendar",
      "desk calendar",
      "monthly calendar",
      "turn the calendar page",
    ],
    phrasalVerbs: [
      {
        phrase: "mark off",
        meaning: "cross off dates on a calendar",
        arabic: "يَشْطُبُ أَيَّاماً فِي التَّقْوِيم",
        example: "He marked off each day on the calendar until his holiday started.",
      },
      {
        phrase: "write down",
        meaning: "record an event on a calendar",
        arabic: "يُسَجِّلُ مَوْعِداً",
        example: "Write down the doctor's appointment on the kitchen calendar.",
      },
    ],
    sentences: [
      {
        context: "Scheduling",
        en: "She marked her upcoming vacation dates in red on the wall calendar.",
        ar: "حَدَّدَتْ مَوَاعِيدَ إِجَازَتِهَا القَادِمَةِ بِاللَّوْنِ الأَحْمَرِ عَلَى تَقْوِيمِ الحَائِطِ.",
      },
      {
        context: "Daily Check",
        en: "Check your calendar every morning to stay organized with meetings.",
        ar: "تَفَقَّدْ تَقْوِيمَكَ كُلَّ صَبَاحٍ لِتَبْقَى مُنَظَّماً فِي مَوَاعِيدِ اجْتِمَاعَاتِكَ.",
      },
      {
        context: "New Year",
        en: "They hung a scenic photography calendar on the study room wall.",
        ar: "عَلَّقُوا تَقْوِيماً يَحْمِلُ صُوَراً طَبِيعِيَّةً خَلابَةً عَلَى جِدَارِ غُرْفَةِ الدِّرَاسَةِ.",
      },
    ],
    exampleSentence: "She marked her upcoming vacation dates in red on the wall calendar.",
    exampleArabic:
      "حَدَّدَتْ مَوَاعِيدَ إِجَازَتِهَا القَادِمَةِ بِاللَّوْنِ الأَحْمَرِ عَلَى تَقْوِيمِ الحَائِطِ.",
  },
  "can-opener": {
    id: "can-opener",
    arabic: "فَتَّاحَةُ عُلَب",
    partOfSpeech: "noun",
    phonetic: "ˈkæn ˌoʊ.pən.ər",
    pronunciationTip: "Compound noun: 'CAN' (/kæn/) + 'OPENER' (/ˈoʊ.pən.ər/).",
    collocations: [
      "manual can opener",
      "electric can opener",
      "open with a can opener",
      "turn the can opener",
      "can opener wheel",
      "kitchen can opener",
    ],
    phrasalVerbs: [
      {
        phrase: "open up",
        meaning: "puncture and cut open a tin can",
        arabic: "يَفْتَحُ العُلْبَة",
        example: "Open up the can of crushed tomatoes for the sauce.",
      },
    ],
    sentences: [
      {
        context: "Canned Goods",
        en: "He used the manual can opener to open a tin of tuna and sweet corn.",
        ar: "اسْتَخْدَمَ فَتَّاحَةَ العُلَبِ اليَدَوِيَّةَ لِفَتْحِ عُلْبَةِ تَرْنَةٍ وَذُرَةٍ حُلْوَةٍ.",
      },
      {
        context: "Smooth Edge",
        en: "Modern safety can openers cut the outside rim leaving no sharp edges.",
        ar: "تَقْطَعُ فَتَّاحَاتُ العُلَبِ الحَدِيثَةُ الحَافَّةَ الخَارِجِيَّةَ دُونَ تَرْكِ حَوَافَّ حَادَّةٍ.",
      },
      {
        context: "Drawer Tool",
        en: "Keep the can opener in the top kitchen utensil drawer for easy access.",
        ar: "احْتَفِظْ بِفَتَّاحَةِ العُلَبِ فِي الدُّرْجِ العُلْوِيِّ لِأَدَوَاتِ المَطْبَخِ لِتَصِلَ إِلَيْهَا بِسُهُولَةٍ.",
      },
    ],
    exampleSentence: "He used the manual can opener to open a tin of tuna and sweet corn.",
    exampleArabic:
      "اسْتَخْدَمَ فَتَّاحَةَ العُلَبِ اليَدَوِيَّةَ لِفَتْحِ عُلْبَةِ تَرْنَةٍ وَذُرَةٍ حُلْوَةٍ.",
  },
  candle: {
    id: "candle",
    arabic: "شَمْعَة",
    partOfSpeech: "noun",
    phonetic: "ˈkæn.dəl",
    pronunciationTip: "Short 'a' as in 'can' (/ˈkæn/), followed by a soft syllabic 'l'.",
    collocations: [
      "light a candle",
      "scented candle",
      "blow out the candle",
      "candle flame",
      "flickering candle",
      "beeswax candle",
    ],
    phrasalVerbs: [
      {
        phrase: "blow out",
        meaning: "extinguish a candle by blowing air",
        arabic: "يُطْفِئُ الشَّمْعَةَ بِالنَّفْخ",
        example: "He blew out the candle before going to sleep.",
      },
      {
        phrase: "light up",
        meaning: "ignite a candle to illuminate a room",
        arabic: "يُشْعِلُ",
        example: "She lit up three scented candles for a cozy evening.",
      },
    ],
    sentences: [
      {
        context: "Cozy Ambiance",
        en: "She lit a vanilla scented candle to create a relaxing evening atmosphere.",
        ar: "أَشْعَلَتْ شَمْعَةً مُعَطَّرَةً بِالفَانِيلْيَا لِخَلْقِ أَجْوَاءِ اسْتِرْخَاءٍ مَسَائِيَّةٍ.",
      },
      {
        context: "Safety",
        en: "Always blow out burning candles before leaving the house or going to bed.",
        ar: "احْرِصْ دَائِماً عَلَى إِطْفَاءِ الشُّمُوعِ المُشْتَعِلَةِ قَبْلَ مُغَادَرَةِ المَنْزِلِ أَوِ النَّوْمِ.",
      },
      {
        context: "Emergency",
        en: "When the power went out during the storm, they used candles for light.",
        ar: "عِنْدَمَا انْقَطَعَتِ الكَهْرَبَاءُ خِلالَ العَاصِفَةِ، اسْتَخْدَمُوا الشُّمُوعَ لِلإِضَاءَةِ.",
      },
    ],
    exampleSentence: "She lit a vanilla scented candle to create a relaxing evening atmosphere.",
    exampleArabic:
      "أَشْعَلَتْ شَمْعَةً مُعَطَّرَةً بِالفَانِيلْيَا لِخَلْقِ أَجْوَاءِ اسْتِرْخَاءٍ مَسَائِيَّةٍ.",
  },
  "candle-holder": {
    id: "candle-holder",
    arabic: "شَمْعَدَان (حَامِلُ الشُّمُوع)",
    partOfSpeech: "noun",
    phonetic: "ˈkæn.dəl ˌhoʊl.dər",
    pronunciationTip: "Compound noun: 'CANDLE' (/ˈkæn.dəl/) + 'HOLDER' (/ˈhoʊl.dər/).",
    collocations: [
      "brass candle holder",
      "glass candle holder",
      "pair of candle holders",
      "taper candle holder",
      "place on a candle holder",
      "ceramic candle holder",
    ],
    phrasalVerbs: [
      {
        phrase: "set in",
        meaning: "insert candle into holder securely",
        arabic: "يُثَبِّتُ الشَّمْعَةَ فِي الشَّمْعَدَان",
        example: "Set the tall beeswax candle securely into the brass holder.",
      },
    ],
    sentences: [
      {
        context: "Table Decor",
        en: "A pair of antique brass candle holders framed the floral centerpiece on the dining table.",
        ar: "أَحَاطَ زَوْجٌ مِنْ الشَّمْعَدَانَاتِ النُّحَاسِيَّةِ الأَثَرِيَّةِ بِبَاقَةِ الزُّهُورِ عَلَى الطَّاوِلَةِ.",
      },
      {
        context: "Safety",
        en: "Heavy glass candle holders catch melting wax drips and prevent fire hazards.",
        ar: "تَمْنَعُ حَوَامِلُ الشُّمُوعِ الزُّجَاجِيَّةُ الثَّقِيلَةُ تَقَاطُرَ الشَّمْعِ المُذَابِ وَتُحَقِّقُ الأَمَانَ.",
      },
      {
        context: "Mantel Styling",
        en: "She arranged three pillar candle holders of varying heights along the fireplace mantel.",
        ar: "رَتَّبَتْ ثَلاثَةَ حَوَامِلِ شُمُوعٍ بِارْتِفَاعَاتٍ مُتَفَاوِتَةٍ عَلَى رَفِّ المِدْفَأَةِ.",
      },
    ],
    exampleSentence:
      "A pair of antique brass candle holders framed the floral centerpiece on the dining table.",
    exampleArabic:
      "أَحَاطَ زَوْجٌ مِنْ الشَّمْعَدَانَاتِ النُّحَاسِيَّةِ الأَثَرِيَّةِ بِبَاقَةِ الزُّهُورِ عَلَى الطَّاوِلَةِ.",
  },
  carpet: {
    id: "carpet",
    arabic: "مَوْكِيت / سَجَّادٌ شَامِل",
    partOfSpeech: "noun",
    phonetic: "ˈkɑːr.pɪt",
    pronunciationTip: "First syllable has the broad 'ar' sound as in 'car' or 'park'.",
    collocations: [
      "wall-to-wall carpet",
      "vacuum the carpet",
      "clean carpet",
      "plush carpet",
      "stain on the carpet",
      "thick carpet",
    ],
    phrasalVerbs: [
      {
        phrase: "clean up",
        meaning: "remove spills from carpet",
        arabic: "يُنَظِّفُ",
        example: "Clean up that coffee spill immediately so it doesn't stain the carpet.",
      },
      {
        phrase: "rip up",
        meaning: "remove old carpeting",
        arabic: "يَقْلَعُ المَوْكِيت القَدِيم",
        example: "They decided to rip up the old carpet and install hardwood.",
      },
    ],
    sentences: [
      {
        context: "Comfort & Acoustics",
        en: "The plush bedroom carpet absorbs footsteps and keeps the room quiet.",
        ar: "يَمْتَصُّ مَوْكِيتُ غُرْفَةِ النَّوْمِ الفَاخِرُ صَوْتَ الخُطُوَاتِ وَيُحَافِظُ عَلَى هُدُوءِ الغُرْفَةِ.",
      },
      {
        context: "Cleaning Routine",
        en: "He vacuums the living room carpet thoroughly every Saturday morning.",
        ar: "يُنَظِّفُ سَجَّادَ غُرْفَةِ المَعِيشَةِ بِالمِكْنَسَةِ الكَهْرَبَائِيَّةِ كُلَّ صَبَاحِ سَبْتٍ.",
      },
      {
        context: "Home Renovation",
        en: "They chose a stain-resistant beige carpet for the children's playroom.",
        ar: "اخْتَارُوا مَوْكِيتاً بَيْجِيّاً مُقَاوِماً لِلْبُقَعِ لِغُرْفَةِ أَلْعَابِ الأَطْفَالِ.",
      },
    ],
    exampleSentence: "The plush bedroom carpet absorbs footsteps and keeps the room quiet.",
    exampleArabic:
      "يَمْتَصُّ مَوْكِيتُ غُرْفَةِ النَّوْمِ الفَاخِرُ صَوْتَ الخُطُوَاتِ وَيُحَافِظُ عَلَى هُدُوءِ الغُرْفَةِ.",
  },
  "casserole-dish": {
    id: "casserole-dish",
    arabic: "طَاجِنُ فُرْن (صِينِيَّةُ بَايْرِكْس / كَاسَرُول)",
    partOfSpeech: "noun",
    phonetic: "ˈkæs.ə.roʊl ˌdɪʃ",
    pronunciationTip: "Three syllables in 'casserole' (/ˈkæs.ə.roʊl/) + 'dish'.",
    collocations: [
      "ceramic casserole dish",
      "glass casserole dish",
      "bake in a casserole dish",
      "covered casserole dish",
      "casserole recipe",
      "deep casserole dish",
    ],
    phrasalVerbs: [
      {
        phrase: "layer up",
        meaning: "arrange ingredients in layers in dish",
        arabic: "يُرَتِّبُ طَبَقَاتٍ",
        example: "Layer up lasagna noodles, meat sauce, and cheese in the dish.",
      },
    ],
    sentences: [
      {
        context: "Baking Lasagna",
        en: "She layered meat sauce and ricotta cheese in a deep ceramic casserole dish.",
        ar: "رَتَّبَتْ صَلْصَةَ اللَّحْمِ وَجُبْنَ الرِّيكُوتَا فِي طَاجِنِ فُرْنٍ خَزَفِيٍّ عَمِيقٍ.",
      },
      {
        context: "Comfort Food",
        en: "Bake the creamy potato casserole dish until the cheese topping bubbles.",
        ar: "اخْبِزْ صِينِيَّةَ البَطَاطِسِ بِالكْرِيمَةِ فِي الفُرْنِ حَتَّى تَفُورَ طَبَقَةُ الجُبْنِ.",
      },
      {
        context: "Serving",
        en: "The elegant glazed casserole dish can go straight from oven to dining table.",
        ar: "يُمْكِنُ تَقْدِيمُ طَاجِنِ الفُرْنِ الأَنِيقِ مُبَاشَرَةً مِنَ الفُرْنِ إِلَى طَاوِلَةِ الطَّعَامِ.",
      },
    ],
    exampleSentence: "She layered meat sauce and ricotta cheese in a deep ceramic casserole dish.",
    exampleArabic:
      "رَتَّبَتْ صَلْصَةَ اللَّحْمِ وَجُبْنَ الرِّيكُوتَا فِي طَاجِنِ فُرْنٍ خَزَفِيٍّ عَمِيقٍ.",
  },
  cat: {
    id: "cat",
    arabic: "قِطَّة (بِسَّة)",
    partOfSpeech: "noun",
    phonetic: "kæt",
    pronunciationTip: "Short 'a' vowel /æ/ as in 'hat', 'mat', or 'bat'.",
    collocations: [
      "barn cat",
      "purring cat",
      "pet the cat",
      "curled-up cat",
      "catch mice",
      "kitten",
    ],
    phrasalVerbs: [
      {
        phrase: "curl up",
        meaning: "sleep in a rounded cozy ball",
        arabic: "يَلْتَفُّ لِلنَّوْم",
        example: "The tabby cat curled up in a sunny patch on the porch.",
      },
    ],
    sentences: [
      {
        context: "Barn Patrol",
        en: "The nimble barn cat keeps the grain storage barn free of mice and rodents.",
        ar: "تُحَافِظُ قِطَّةُ الحَظِيرَةِ الرَّشِيقَةُ عَلَى مَخْزَنِ الحُبُوبِ خَالِياً مِنَ القَوَارِضِ.",
      },
      {
        context: "Sunny Spot",
        en: "She smiled as the ginger cat purred softly while basking in the warm morning sun.",
        ar: "ابْتَسَمَتْ بَيْنَمَا كَانَتِ القِطَّةُ تَخْرْخِرُ بِهُدُوءٍ تَحْتَ أَشِعَّةِ شَمْسِ الصَّبَاحِ.",
      },
      {
        context: "Agility",
        en: "The cat leaped gracefully onto the high wooden fence without making a sound.",
        ar: "قَفَزَتِ القِطَّةُ بِرَشَاقَةٍ فَوْقَ السِّيَاجِ الخَشَبِيِّ العَالِي دُونَ إِصْدَارِ أَيِّ صَوْتٍ.",
      },
    ],
    exampleSentence: "The nimble barn cat keeps the grain storage barn free of mice and rodents.",
    exampleArabic:
      "تُحَافِظُ قِطَّةُ الحَظِيرَةِ الرَّشِيقَةُ عَلَى مَخْزَنِ الحُبُوبِ خَالِياً مِنَ القَوَارِضِ.",
  },
  "ceiling-light": {
    id: "ceiling-light",
    arabic: "إِضَاءَةُ السَّقْف (نَجَفَة / مِصْبَاحُ السَّقْف)",
    partOfSpeech: "noun",
    phonetic: "ˈsiː.lɪŋ ˌlaɪt",
    pronunciationTip: "Primary stress on 'CEIL' in ceiling (/ˈsiː.lɪŋ/), secondary on 'light'.",
    collocations: [
      "turn on the ceiling light",
      "bright ceiling light",
      "dim the ceiling light",
      "flush ceiling light",
      "replace the ceiling light",
      "ceiling light fixture",
    ],
    phrasalVerbs: [
      {
        phrase: "turn on",
        meaning: "switch on overhead lighting",
        arabic: "يُضِيءُ نُورَ السَّقْف",
        example: "Turn on the ceiling light so we can see the whole room clearly.",
      },
      {
        phrase: "dim down",
        meaning: "reduce brightness",
        arabic: "يُخَفِّفُ حِدَّةَ الإِضَاءَة",
        example: "Dim down the ceiling light when it's time to watch a movie.",
      },
    ],
    sentences: [
      {
        context: "Illumination",
        en: "The modern LED ceiling light brightens the entire bedroom evenly.",
        ar: "يُضِيءُ مِصْبَاحُ السَّقْفِ الحَدِيثُ الغُرْفَةَ بِأَكْمَلِهَا بِشَكْلٍ مُتَجَانِسٍ.",
      },
      {
        context: "Maintenance",
        en: "He climbed the step stool to replace the burnt-out bulb in the ceiling light.",
        ar: "صَعِدَ عَلَى المَقْعَدِ لِيَسْتَبْدِلَ اللَّمْبَةَ التَّالِفَةَ فِي إِضَاءَةِ السَّقْفِ.",
      },
      {
        context: "Atmosphere",
        en: "The dimmable ceiling light lets you adjust brightness to suit your mood.",
        ar: "تُتِيحُ لَكَ إِضَاءَةُ السَّقْفِ القَابِلَةُ لِلتَّخْفِيفِ ضَبْطَ السُّطُوعِ حَسَبَ رَغْبَتِكَ.",
      },
    ],
    exampleSentence: "The modern LED ceiling light brightens the entire bedroom evenly.",
    exampleArabic:
      "يُضِيءُ مِصْبَاحُ السَّقْفِ الحَدِيثُ الغُرْفَةَ بِأَكْمَلِهَا بِشَكْلٍ مُتَجَانِسٍ.",
  },
  chair: {
    id: "chair",
    arabic: "كُرْسِيّ",
    partOfSpeech: "noun",
    phonetic: "tʃɛər",
    pronunciationTip: "Begins with the 'ch' sound as in 'church', rhyming with 'air'.",
    collocations: [
      "comfortable chair",
      "sit on a chair",
      "desk chair",
      "pull up a chair",
      "wooden chair",
      "swivel chair",
    ],
    phrasalVerbs: [
      {
        phrase: "sit back",
        meaning: "relax in a seated position",
        arabic: "يَسْتَنِدُ لِلخَلْفِ مُسْتَرْخِياً",
        example: "Sit back in your chair and take a deep breath.",
      },
      {
        phrase: "get up",
        meaning: "rise from a seated position",
        arabic: "يَقُومُ / يَنْهَضُ",
        example: "She got up from the desk chair to stretch her legs.",
      },
    ],
    sentences: [
      {
        context: "Ergonomics",
        en: "An ergonomic desk chair helps prevent back pain while working.",
        ar: "يُسَاعِدُ كُرْسِيُّ المَكْتَبِ المُرِيحُ فِي مَنْعِ آلامِ الظَّهْرِ أَثْنَاءَ العَمَلِ.",
      },
      {
        context: "Hospitality",
        en: "Please pull up a chair and join us for dinner.",
        ar: "تَفَضَّلْ بِسَحْبِ كُرْسِيٍّ وَانْضَمَّ إِلَيْنَا لِتَنَاوُلِ العَشَاءِ.",
      },
      {
        context: "Relaxation",
        en: "He sat in the soft armchair beside the window with a good book.",
        ar: "جَلَسَ عَلَى الكُرْسِيِّ المُرِيحِ بِجَانِبِ النَّافِذَةِ مَعَ كِتَابٍ شَيِّقٍ.",
      },
    ],
    exampleSentence: "An ergonomic desk chair helps prevent back pain while working.",
    exampleArabic:
      "يُسَاعِدُ كُرْسِيُّ المَكْتَبِ المُرِيحُ فِي مَنْعِ آلامِ الظَّهْرِ أَثْنَاءَ العَمَلِ.",
  },
  chandelier: {
    id: "chandelier",
    arabic: "نَجَفَةٌ فَاخِرَة (ثُرَيَّا)",
    partOfSpeech: "noun",
    phonetic: "ˌʃæn.dəˈlɪər",
    pronunciationTip:
      "Begins with 'sh' sound (/ʃæn/), stress on the final syllable 'LIER' (/ˈlɪər/).",
    collocations: [
      "crystal chandelier",
      "dining room chandelier",
      "sparkling chandelier",
      "hang a chandelier",
      "chandelier lights",
      "modern chandelier",
    ],
    phrasalVerbs: [
      {
        phrase: "hang down from",
        meaning: "suspend chandelier from ceiling",
        arabic: "يَتَدَلَّى مِنَ السَّقْف",
        example: "A grand crystal chandelier hung down from the high cathedral ceiling.",
      },
    ],
    sentences: [
      {
        context: "Formal Dining",
        en: "A glittering crystal chandelier hangs gracefully above the long dining room table.",
        ar: "تَتَدَلَّى ثُرَيَّا كِرِيسْتَالِيَّةٌ بَرَّاقَةٌ بِأَنَاقَةٍ فَوْقَ طَاوِلَةِ غُرْفَةِ الطَّعَامِ الطَّوِيلَةِ.",
      },
      {
        context: "Visual Impact",
        en: "The modern geometric brass chandelier makes a bold statement in the entryway.",
        ar: "تُشَكِّلُ النَّجَفَةُ النُّحَاسِيَّةُ الهَنْدَسِيَّةُ العَصْرِيَّةُ لَمْسَةً بَصَرِيَّةً قَوِيَّةً فِي المَدْخَلِ.",
      },
      {
        context: "Cleaning Care",
        en: "Dust each delicate crystal drop on the chandelier carefully with a lint-free cloth.",
        ar: "نَظِّفْ حَبَّاتِ الكِرِيسْتَالِ الرَّقِيقَةَ فِي النَّجَفَةِ بِعِنَايَةٍ بِاسْتِخْدَامِ قُمَاشٍ خَالٍ مِنَ الوَبَرِ.",
      },
    ],
    exampleSentence:
      "A glittering crystal chandelier hangs gracefully above the long dining room table.",
    exampleArabic:
      "تَتَدَلَّى ثُرَيَّا كِرِيسْتَالِيَّةٌ بَرَّاقَةٌ بِأَنَاقَةٍ فَوْقَ طَاوِلَةِ غُرْفَةِ الطَّعَامِ الطَّوِيلَةِ.",
  },
  charger: {
    id: "charger",
    arabic: "شَاحِن",
    partOfSpeech: "noun",
    phonetic: "ˈtʃɑːr.dʒər",
    pronunciationTip: "Starts with 'ch' (/tʃ/), broad 'ar' (/ɑːr/), and soft 'ger' (/dʒər/).",
    collocations: [
      "phone charger",
      "plug in the charger",
      "fast charger",
      "wireless charger",
      "laptop charger",
      "portable charger",
    ],
    phrasalVerbs: [
      {
        phrase: "plug in",
        meaning: "connect a charger to an outlet",
        arabic: "يَصِلُ الشَّاحِنَ بِالكَهْرَبَاء",
        example: "Plug in the charger so your tablet battery does not die.",
      },
      {
        phrase: "unplug",
        meaning: "disconnect a charger from power",
        arabic: "يَفْصِلُ الشَّاحِن",
        example: "Unplug the charger once the device reaches one hundred percent.",
      },
    ],
    sentences: [
      {
        context: "Daily Use",
        en: "He forgot his phone charger at the office and had to borrow one.",
        ar: "نَسِيَ شَاحِنَ هَاتِفِهِ فِي المَكْتَبِ وَاضْطُرَّ إِلَى اسْتِعَارَةِ وَاحِدٍ.",
      },
      {
        context: "Technology",
        en: "A fast USB-C charger can power up your battery in under thirty minutes.",
        ar: "يُمْكِنُ لِشَاحِنِ USB-C السَّرِيعِ شَحْنَ بَطَّارِيَّتِكَ فِي أَقَلَّ مِنْ ثَلاثِينَ دَقِيقَةً.",
      },
      {
        context: "Travel Checklist",
        en: "Always pack an international travel adapter and your laptop charger.",
        ar: "احْرِصْ دَائِماً عَلَى حَزْمِ مُحَوِّلِ قَابِسٍ دَوْلِيٍّ وَشَاحِنِ حَاسُوبِكَ المَحْمُولِ.",
      },
    ],
    exampleSentence: "He forgot his phone charger at the office and had to borrow one.",
    exampleArabic: "نَسِيَ شَاحِنَ هَاتِفِهِ فِي المَكْتَبِ وَاضْطُرَّ إِلَى اسْتِعَارَةِ وَاحِدٍ.",
  },
  cheese: {
    id: "cheese",
    arabic: "جُبْن / جُبْنَة",
    partOfSpeech: "noun",
    phonetic: "tʃiːz",
    pronunciationTip: "Starts with 'ch' (/tʃ/), long 'ee' vowel /iː/, ending in voiced 'z'.",
    collocations: [
      "grated cheese",
      "slice of cheese",
      "melted cheese",
      "cheddar cheese",
      "goat cheese",
      "block of cheese",
    ],
    phrasalVerbs: [
      {
        phrase: "melt down",
        meaning: "liquefy cheese over food",
        arabic: "يَذُوبُ الجُبْن",
        example: "The mozzarella melted down over the crispy pizza crust.",
      },
    ],
    sentences: [
      {
        context: "Snack & Sandwiches",
        en: "She prepared a grilled cheese sandwich using thick slices of mature cheddar.",
        ar: "أَعَدَّتْ شَطِيرَةَ جُبْنٍ مَشْوِيَّةً بِاسْتِخْدَامِ شَرَائِحَ سَمِيكَةٍ مِنْ جُبْنِ التِّشِيدَرْ المُعَتَّقِ.",
      },
      {
        context: "Pasta Topping",
        en: "Sprinkle freshly grated Parmesan cheese over the hot bowl of spaghetti bolognese.",
        ar: "رُشَّ جُبْنَ البَارْمِيزَان المَبْشُورَ طَازَجاً فَوْقَ طَبَقِ المَعْكَرُونَةِ السَّاخِنِ.",
      },
      {
        context: "Entertaining",
        en: "A gourmet cheese board featuring brie, gouda, and grapes impressed the dinner guests.",
        ar: "أَبْهَرَتْ صِينِيَّةُ الأَجْبَانِ الفَاخِرَةُ المُحْتَوِيَةُ عَلَى البْرِي وَالجَوْدَا الضُّيُوفَ.",
      },
    ],
    exampleSentence: "She prepared a grilled cheese sandwich using thick slices of mature cheddar.",
    exampleArabic:
      "أَعَدَّتْ شَطِيرَةَ جُبْنٍ مَشْوِيَّةً بِاسْتِخْدَامِ شَرَائِحَ سَمِيكَةٍ مِنْ جُبْنِ التِّشِيدَرْ المُعَتَّقِ.",
  },
  "chest-of-drawers": {
    id: "chest-of-drawers",
    arabic: "خِزَانَةُ أَدْرَاج",
    partOfSpeech: "noun",
    phonetic: "ˌtʃɛst əv ˈdrɔːrz",
    pronunciationTip: "Pronounce 'of' as a weak unstressed schwa /əv/.",
    collocations: [
      "wooden chest of drawers",
      "top drawer",
      "slide open",
      "bedroom chest of drawers",
      "deep drawers",
      "solid oak chest",
    ],
    phrasalVerbs: [
      {
        phrase: "pull out",
        meaning: "open a drawer outward",
        arabic: "يَسْحَبُ الدُّرْجَ لِلْخَارِج",
        example: "He pulled out the top drawer to find his passport.",
      },
      {
        phrase: "sort through",
        meaning: "examine items in a drawer",
        arabic: "يَفْرِزُ وَيُفَتِّشُ",
        example: "She sorted through the chest of drawers for warm socks.",
      },
    ],
    sentences: [
      {
        context: "Storage",
        en: "The wooden chest of drawers holds all their winter sweaters.",
        ar: "تَتَّسِعُ خِزَانَةُ الأَدْرَاجِ الخَشَبِيَّةُ لِجَمِيعِ كَنْزَاتِهِمُ الشَّتْوِيَّةِ.",
      },
      {
        context: "Organization",
        en: "Keep important documents safely in the locked top drawer.",
        ar: "احْتَفِظْ بِالوِثَائِقِ الهَامَّةِ بِأَمَانٍ فِي الدُّرْجِ العُلْوِيِّ المُقْفَلِ.",
      },
      {
        context: "Craftsmanship",
        en: "This vintage chest of drawers was handcrafted from solid pine.",
        ar: "صُنِعَتْ خِزَانَةُ الأَدْرَاجِ الكِلاسِيكِيَّةُ هَذِهِ يَدَوِيّاً مِنْ خَشَبِ الصَّنَوْبَرِ الصُّلْبِ.",
      },
    ],
    exampleSentence: "The wooden chest of drawers holds all their winter sweaters.",
    exampleArabic:
      "تَتَّسِعُ خِزَانَةُ الأَدْرَاجِ الخَشَبِيَّةُ لِجَمِيعِ كَنْزَاتِهِمُ الشَّتْوِيَّةِ.",
  },
  chicken: {
    id: "chicken",
    arabic: "دَجَاجَة",
    partOfSpeech: "noun",
    phonetic: "ˈtʃɪk.ɪn",
    pronunciationTip: "Begins with 'ch' sound (/tʃ/), short 'i' in both syllables (/ˈtʃɪk.ɪn/).",
    collocations: [
      "chicken coop",
      "free-range chicken",
      "feed the chickens",
      "lay eggs",
      "clucking chicken",
      "roast chicken",
    ],
    phrasalVerbs: [
      {
        phrase: "chicken out",
        meaning: "(idiom) decide not to do something out of fear",
        arabic: "يَتَرَاجَعُ جُبْناً",
        example: "He was going to dive into the lake, but chickened out at the last second.",
      },
    ],
    sentences: [
      {
        context: "Egg Gathering",
        en: "The children collect fresh brown eggs from the chicken coop every morning.",
        ar: "يَجْمَعُ الأَطْفَالُ البَيْضَ البُنِّيَّ الطَّازَجَ مِنْ خُمِّ الدَّجَاجِ كُلَّ صَبَاحٍ.",
      },
      {
        context: "Free-Range Life",
        en: "Free-range chickens roam around the farmyard pecking at grass seeds and grains.",
        ar: "تَتَجَوَّلُ الدَّجَاجَاتُ المَطْلُوقَةُ فِي فِنَاءِ المَزْرَعَةِ تَنْقُرُ الحُبُوبَ وَالأَعْشَابَ.",
      },
      {
        context: "Farm Sounds",
        en: "The cheerful clucking of hens echoed outside the barn at sunrise.",
        ar: "تَرَدَّدَ صَوْتُ قَوْقَأَةِ الدَّجَاجِ البَهِيجِ خَارِجَ الحَظِيرَةِ عِنْدَ شُرُوقِ الشَّمْسِ.",
      },
    ],
    exampleSentence: "The children collect fresh brown eggs from the chicken coop every morning.",
    exampleArabic:
      "يَجْمَعُ الأَطْفَالُ البَيْضَ البُنِّيَّ الطَّازَجَ مِنْ خُمِّ الدَّجَاجِ كُلَّ صَبَاحٍ.",
  },
  "cling-film": {
    id: "cling-film",
    arabic: "غِلَافٌ بَلاسْتِيكِيٌّ لَاصِق (كْلِينْغ فِيلْم)",
    partOfSpeech: "noun",
    phonetic: "ˈklɪŋ ˌfɪlm",
    pronunciationTip: "Compound noun: 'CLING' (/klɪŋ/) + 'FILM' (/fɪlm/).",
    collocations: [
      "roll of cling film",
      "wrap in cling film",
      "seal with cling film",
      "transparent cling film",
      "stretch cling film",
      "cover food with cling film",
    ],
    phrasalVerbs: [
      {
        phrase: "wrap up in",
        meaning: "enclose food tightly in cling film",
        arabic: "يَلُفُّ بِالغِلافِ اللّاصِق",
        example: "Wrap up the cheese tightly in cling film to stop it drying out.",
      },
    ],
    sentences: [
      {
        context: "Cheese Storage",
        en: "Wrap the block of cheddar tightly in cling film to preserve its moisture.",
        ar: "لُفَّ قِطْعَةَ جُبْنِ التِّشِيدَرْ بِإِحْكَامٍ فِي الغِلافِ البَلاسْتِيكِيِّ لِلْحِفَاظِ عَلَى رُطُوبَتِهَا.",
      },
      {
        context: "Party Prep",
        en: "Cover sandwich platters with transparent cling film until guests arrive.",
        ar: "غَطِّ صَوَانِي السَّنْدَوِيتْشَاتِ بِالغِلافِ اللّاصِقِ الشَّفَّافِ حَتَّى يَصِلَ الضُّيُوفُ.",
      },
      {
        context: "Baking",
        en: "Cover the rising yeast dough bowl with cling film and place it in a warm spot.",
        ar: "غَطِّ وِعَاءَ عَجِينِ الخَمِيرَةِ بِالغِلافِ البَلاسْتِيكِيِّ وَضَعْهُ فِي مَكَانٍ دَافِئٍ لِيَخْتَمِرَ.",
      },
    ],
    exampleSentence: "Wrap the block of cheddar tightly in cling film to preserve its moisture.",
    exampleArabic:
      "لُفَّ قِطْعَةَ جُبْنِ التِّشِيدَرْ بِإِحْكَامٍ فِي الغِلافِ البَلاسْتِيكِيِّ لِلْحِفَاظِ عَلَى رُطُوبَتِهَا.",
  },
  clock: {
    id: "clock",
    arabic: "سَاعَةُ حَائِط / سَاعَة",
    partOfSpeech: "noun",
    phonetic: "klɑːk",
    pronunciationTip: "Short open 'o' sound /ɑː/ as in 'sock' or 'lock'.",
    collocations: [
      "wall clock",
      "check the clock",
      "tick of the clock",
      "digital clock",
      "clock on the wall",
      "set the clock",
    ],
    phrasalVerbs: [
      {
        phrase: "look at",
        meaning: "check the time on a clock",
        arabic: "يَنْظُرُ إِلَى السَّاعَة",
        example: "He looked at the clock and realized he was late.",
      },
    ],
    sentences: [
      {
        context: "Timekeeping",
        en: "She glanced at the wall clock to check how much time remained.",
        ar: "أَلْقَتْ نَظْرَةً عَلَى سَاعَةِ الحَائِطِ لِمَعْرِفَةِ الوَقْتِ المُتَبَقِّي.",
      },
      {
        context: "Quiet Night",
        en: "In the quiet bedroom, the gentle ticking of the clock was comforting.",
        ar: "فِي غُرْفَةِ النَّوْمِ الهَادِئَةِ، كَانَتْ دَقَّاتُ السَّاعَةِ اللَّطِيفَةُ مَبْعَثاً لِلطُّمَأْنِينَةِ.",
      },
      {
        context: "Decor",
        en: "A vintage wooden clock hangs prominently in the kitchen area.",
        ar: "تُعَلَّقُ سَاعَةٌ خَشَبِيَّةٌ أَنِيقَةٌ بِشَكْلٍ بَارِزٍ فِي مِسَاحَةِ المَطْبَخِ.",
      },
    ],
    exampleSentence: "She glanced at the wall clock to check how much time remained.",
    exampleArabic: "أَلْقَتْ نَظْرَةً عَلَى سَاعَةِ الحَائِطِ لِمَعْرِفَةِ الوَقْتِ المُتَبَقِّي.",
  },
  coaster: {
    id: "coaster",
    arabic: "قَاعِدَةُ كُوب (كُوسْتَر)",
    partOfSpeech: "noun",
    phonetic: "ˈkoʊ.stər",
    pronunciationTip: "Long 'o' vowel /oʊ/ as in 'coast' or 'toast'.",
    collocations: [
      "cork coaster",
      "wooden coaster",
      "set of coasters",
      "put your mug on a coaster",
      "marble coaster",
      "absorbent coaster",
    ],
    phrasalVerbs: [
      {
        phrase: "set down on",
        meaning: "place a glass on a protective coaster",
        arabic: "يَضَعُ الكُوبَ عَلَى الكُوسْتَر",
        example: "Always set down your cold iced drink on a coaster.",
      },
    ],
    sentences: [
      {
        context: "Protecting Furniture",
        en: "Always place cold drinks on a coaster to prevent water condensation rings on the wood.",
        ar: "ضَعِ المَشْرُوبَاتِ البَارِدَةَ دَائِماً عَلَى قَاعِدَةِ كُوبٍ لِمَنْعِ آثَارِ الرُّطُوبَةِ عَلَى الخَشَبِ.",
      },
      {
        context: "Tabletop Accessories",
        en: "A neat stack of four marble and brass coasters rests on the coffee table.",
        ar: "تَسْتَقِرُّ مَجْمُوعَةٌ أَنِيقَةٌ مِنْ 4 قَوَاعِدِ أَكْوَابٍ رُخَامِيَّةٍ عَلَى طَاوِلَةِ القَهْوَةِ.",
      },
      {
        context: "Absorbency",
        en: "Natural cork coasters absorb drips quickly without scratching delicate surfaces.",
        ar: "تَمْتَصُّ قَوَاعِدُ الفِلِّينِ الطَّبِيعِيَّةُ القَطَرَاتِ سَرِيعاً دُونَ خَدْشِ الأَسْطُحِ الرَّقِيقَةِ.",
      },
    ],
    exampleSentence:
      "Always place cold drinks on a coaster to prevent water condensation rings on the wood.",
    exampleArabic:
      "ضَعِ المَشْرُوبَاتِ البَارِدَةَ دَائِماً عَلَى قَاعِدَةِ كُوبٍ لِمَنْعِ آثَارِ الرُّطُوبَةِ عَلَى الخَشَبِ.",
  },
  "coat-rack": {
    id: "coat-rack",
    arabic: "شَمَّاعَةُ مَعَاطِف (عَلَّاقَةُ مَعَاطِف)",
    partOfSpeech: "noun",
    phonetic: "ˈkoʊt ˌræk",
    pronunciationTip: "Compound noun: 'COAT' (/koʊt/) + 'RACK' (/ræk/).",
    collocations: [
      "wooden coat rack",
      "hang coats on the rack",
      "entryway coat rack",
      "standing coat rack",
      "coat rack hooks",
      "hallway coat rack",
    ],
    phrasalVerbs: [
      {
        phrase: "hang up on",
        meaning: "place a coat on a rack hook",
        arabic: "يُعَلِّقُ عَلَى الشَّمَّاعَة",
        example: "Hang up your wet raincoat on the entryway coat rack.",
      },
    ],
    sentences: [
      {
        context: "Entryway Welcome",
        en: "Guests hung their heavy winter coats and wool scarves on the entryway coat rack.",
        ar: "عَلَّقَ الضُّيُوفُ مَعَاطِفَهُمُ الشَّتْوِيَّةَ الثَّقِيلَةَ وَأَوْشِحَتَهُمْ عَلَى شَمَّاعَةِ المَدْخَلِ.",
      },
      {
        context: "Hallway Organization",
        en: "A freestanding wooden coat rack keeps jackets and umbrellas neatly organized.",
        ar: "تُحَافِظُ شَمَّاعَةُ المَعَاطِفِ الخَشَبِيَّةُ القَائِمَةُ عَلَى تَرْتِيبِ السُّتْرَاتِ وَالمَظَلاَّتِ.",
      },
      {
        context: "Space Saving",
        en: "Wall-mounted coat racks with sturdy cast iron hooks save floor space.",
        ar: "تُوَفِّرُ شَمَّاعَاتُ المَعَاطِفِ الجِدَارِيَّةُ ذَاتُ الخَطَّافَاتِ المَتِينَةِ مَسَاحَةَ الأَرْضِيَّةِ.",
      },
    ],
    exampleSentence:
      "Guests hung their heavy winter coats and wool scarves on the entryway coat rack.",
    exampleArabic:
      "عَلَّقَ الضُّيُوفُ مَعَاطِفَهُمُ الشَّتْوِيَّةَ الثَّقِيلَةَ وَأَوْشِحَتَهُمْ عَلَى شَمَّاعَةِ المَدْخَلِ.",
  },
  "coffee-maker": {
    id: "coffee-maker",
    arabic: "مَاكِينَةُ القَهْوَة",
    partOfSpeech: "noun",
    phonetic: "ˈkɑː.fi ˌmeɪ.kər",
    pronunciationTip: "Compound noun: 'COFFEE' (/ˈkɑː.fi/) + 'MAKER' (/ˈmeɪ.kər/).",
    collocations: [
      "brew in the coffee maker",
      "drip coffee maker",
      "program the coffee maker",
      "espresso coffee maker",
      "clean the coffee maker",
      "fresh coffee maker",
    ],
    phrasalVerbs: [
      {
        phrase: "brew up",
        meaning: "prepare fresh coffee",
        arabic: "يُعِدُّ / يُخَمِّرُ القَهْوَة",
        example: "The automatic machine brewed up a rich pot of coffee.",
      },
      {
        phrase: "pour out",
        meaning: "dispense coffee into a cup",
        arabic: "يَسْكُبُ القَهْوَة",
        example: "She poured out a steaming mug of coffee.",
      },
    ],
    sentences: [
      {
        context: "Morning Routine",
        en: "The programmable coffee maker starts brewing fresh coffee at seven every morning.",
        ar: "تَبْدَأُ مَاكِينَةُ القَهْوَةِ المُبَرْمَجَةُ فِي إِعْدَادِ القَهْوَةِ الطَّازَجَةِ فِي السَّابِعَةِ صَبَاحاً.",
      },
      {
        context: "Workplace",
        en: "The office kitchen coffee maker is always busy during morning hours.",
        ar: "مَاكِينَةُ قَهْوَةِ مَطْبَخِ المَكْتَبِ مُزْدَحِمَةٌ دَائِماً خِلالَ سَاعَاتِ الصَّبَاحِ.",
      },
      {
        context: "Maintenance",
        en: "Descale your coffee maker with vinegar solution every three months.",
        ar: "قُمْ بِإِزَالَةِ التَّرَسُّبَاتِ الكِلْسِيَّةِ مِنْ مَاكِينَةِ القَهْوَةِ كُلَّ ثَلاثَةِ أَشْهُرٍ.",
      },
    ],
    exampleSentence:
      "The programmable coffee maker starts brewing fresh coffee at seven every morning.",
    exampleArabic:
      "تَبْدَأُ مَاكِينَةُ القَهْوَةِ المُبَرْمَجَةُ فِي إِعْدَادِ القَهْوَةِ الطَّازَجَةِ فِي السَّابِعَةِ صَبَاحاً.",
  },
  "coffee-table": {
    id: "coffee-table",
    arabic: "طَاوِلَةُ قَهْوَة (تَرَابِيزَةُ الصَّالُون)",
    partOfSpeech: "noun",
    phonetic: "ˈkɑː.fi ˌteɪ.bəl",
    pronunciationTip: "Compound noun: 'COFFEE' (/ˈkɑː.fi/) + 'TABLE' (/ˈteɪ.bəl/).",
    collocations: [
      "wooden coffee table",
      "glass coffee table",
      "on the coffee table",
      "round coffee table",
      "coffee table book",
      "clear the coffee table",
    ],
    phrasalVerbs: [
      {
        phrase: "set down on",
        meaning: "place drinks or books on the table",
        arabic: "يَضَعُ عَلَى الطَّاوِلَة",
        example: "Set down your teacup on a coaster on the coffee table.",
      },
    ],
    sentences: [
      {
        context: "Living Room Center",
        en: "A handcrafted oak coffee table sits conveniently in front of the sofa.",
        ar: "تَسْتَقِرُّ طَاوِلَةُ قَهْوَةٍ خَشَبِيَّةٌ يَدَوِيَّةُ الصُّنْعِ أَمَامَ الأَرِيكَةِ مُبَاشَرَةً.",
      },
      {
        context: "Tabletop Styling",
        en: "She arranged a decorative candle, a vase of tulips, and an art book on the coffee table.",
        ar: "رَتَّبَتْ شَمْعَةً أَنِيقَةً وَزَهْرِيَّةَ تِيُولِيب وَكِتَابَ فَنٍّ عَلَى طَاوِلَةِ القَهْوَةِ.",
      },
      {
        context: "Coaster Use",
        en: "Always use wooden or cork coasters to prevent water rings on the coffee table.",
        ar: "اسْتَخْدِمْ دَائِماً قَوَاعِدَ الأَكْوَابِ لِمَنْعِ آثَارِ المَاءِ عَلَى طَاوِلَةِ القَهْوَةِ.",
      },
    ],
    exampleSentence: "A handcrafted oak coffee table sits conveniently in front of the sofa.",
    exampleArabic:
      "تَسْتَقِرُّ طَاوِلَةُ قَهْوَةٍ خَشَبِيَّةٌ يَدَوِيَّةُ الصُّنْعِ أَمَامَ الأَرِيكَةِ مُبَاشَرَةً.",
  },
  colander: {
    id: "colander",
    arabic: "مِصْفَاة (مِصْفَاةُ مَعْكَرُونَة)",
    partOfSpeech: "noun",
    phonetic: "ˈkɑː.lən.dər",
    pronunciationTip: "Three syllables: 'COL-an-der' (/ˈkɑː.lən.dər/).",
    collocations: [
      "drain in a colander",
      "pasta colander",
      "rinse in a colander",
      "stainless steel colander",
      "mesh colander",
      "colander in the sink",
    ],
    phrasalVerbs: [
      {
        phrase: "drain off",
        meaning: "pour off water using a colander",
        arabic: "يُصَفِّي المَاء",
        example: "Drain off the boiling cooking water through the colander.",
      },
      {
        phrase: "rinse out",
        meaning: "wash fruit with water in a colander",
        arabic: "يَشْطُفُ",
        example: "Rinse out the fresh berries under cold tap water in the colander.",
      },
    ],
    sentences: [
      {
        context: "Cooking Pasta",
        en: "He poured the cooked spaghetti into a stainless steel colander in the sink to drain.",
        ar: "سَكَبَ المَعْكَرُونَةَ المَطْبُوخَةَ فِي مِصْفَاةِ سْتَانْلِس دَاخِلَ الحَوْضِ لِتَصْفِيَتِهَا.",
      },
      {
        context: "Washing Produce",
        en: "Wash fresh spinach and grapes thoroughly under cold running water in the colander.",
        ar: "اغْسِلِ السَّبَانِخَ وَالعِنَبَ جَيِّداً تَحْتَ مَاءِ الصَّنْبُورِ البَارِدِ فِي المِصْفَاةِ.",
      },
      {
        context: "Storage",
        en: "Rest the colander over a large bowl to collect drained vegetable broth.",
        ar: "ضَعِ المِصْفَاةَ فَوْقَ وِعَاءٍ كَبِيرٍ لِتَجْمِيعِ مَرَقِ الخُضَارِ المُصَفَّى.",
      },
    ],
    exampleSentence:
      "He poured the cooked spaghetti into a stainless steel colander in the sink to drain.",
    exampleArabic:
      "سَكَبَ المَعْكَرُونَةَ المَطْبُوخَةَ فِي مِصْفَاةِ سْتَانْلِس دَاخِلَ الحَوْضِ لِتَصْفِيَتِهَا.",
  },
  comforter: {
    id: "comforter",
    arabic: "لِحَافٌ مَحْشُوّ (كُوڤِرْتَه / لِحَاف)",
    partOfSpeech: "noun",
    phonetic: "ˈkʌm.fər.tər",
    pronunciationTip: "First syllable has the short 'u' sound /ʌ/ as in 'come'.",
    collocations: [
      "warm comforter",
      "fluffy comforter",
      "wash the comforter",
      "bed comforter",
      "quilted comforter",
      "cozy comforter",
    ],
    phrasalVerbs: [
      {
        phrase: "pull over",
        meaning: "draw a comforter over yourself",
        arabic: "يَسْحَبُ اللِّحَافَ فَوْقَهُ",
        example: "He pulled the thick comforter over his shoulders.",
      },
      {
        phrase: "snuggle in",
        meaning: "get cozy under a comforter",
        arabic: "يَسْتَكِينُ بِدِفْء",
        example: "The children snuggled in under their soft comforter.",
      },
    ],
    sentences: [
      {
        context: "Bed Setup",
        en: "The quilted comforter gives the guest bed a welcoming, plush look.",
        ar: "يَمْنَحُ اللِّحَافُ المَحْشُوُّ سَرِيرَ الضُّيُوفِ مَظْهَراً جَذَّاباً وَمُرِيحاً.",
      },
      {
        context: "Comfort",
        en: "A lightweight cotton comforter is ideal for warm summer evenings.",
        ar: "اللِّحَافُ القُطْنِيُّ الخَفِيفُ مِثَالِيٌّ لِأَمْسِيَاتِ الصَّيْفِ الدَّافِئَةِ.",
      },
      {
        context: "Care",
        en: "Always check the label before washing your down comforter.",
        ar: "تَحَقَّقْ دَائِماً مِنْ تَعْلِيمَاتِ الغَسِيلِ قَبْلَ غَسْلِ لِحَافِ الرِّيشِ.",
      },
    ],
    exampleSentence: "The quilted comforter gives the guest bed a welcoming, plush look.",
    exampleArabic:
      "يَمْنَحُ اللِّحَافُ المَحْشُوُّ سَرِيرَ الضُّيُوفِ مَظْهَراً جَذَّاباً وَمُرِيحاً.",
  },
  "cooking-oil": {
    id: "cooking-oil",
    arabic: "زَيْتُ الطَّهْي (زَيْت)",
    partOfSpeech: "noun",
    phonetic: "ˈkʊk.ɪŋ ˌɔɪl",
    pronunciationTip: "Compound noun: 'COOKING' (/ˈkʊk.ɪŋ/) + 'OIL' (/ɔɪl/).",
    collocations: [
      "tablespoon of cooking oil",
      "heat cooking oil",
      "vegetable cooking oil",
      "canola cooking oil",
      "sunflower cooking oil",
      "bottle of cooking oil",
    ],
    phrasalVerbs: [
      {
        phrase: "heat up",
        meaning: "bring oil to frying temperature",
        arabic: "يُسَخِّنُ الزَّيْت",
        example: "Heat up the cooking oil in the wok before adding the spices.",
      },
    ],
    sentences: [
      {
        context: "Frying Prep",
        en: "Heat two tablespoons of sunflower cooking oil in the frying pan over medium heat.",
        ar: "سَخِّنْ مِلْعَقَتَيْنِ مِنْ زَيْتِ عَبَّادِ الشَّمْسِ لِلطَّهْيِ فِي المِقْلاةِ عَلَى نَارٍ مُتَوَسِّطَةٍ.",
      },
      {
        context: "High Heat Cooking",
        en: "Canola and avocado cooking oils have high smoke points, making them safe for searing.",
        ar: "تَتَمَيَّزُ زُيُوتُ الكَانُولا وَالأَفُوكَادُو بِنُقْطَةِ دُخَانٍ عَالِيَةٍ مِمَّا يَجْعَلُهَا مِثَالِيَّةً لِلتَّحْمِيرِ.",
      },
      {
        context: "Baking Substitute",
        en: "You can substitute melted butter with vegetable cooking oil in most muffin recipes.",
        ar: "يُمْكِنُكَ اسْتِبْدَالُ الزُّبْدَةِ المُذَابَةِ بِزَيْتِ الطَّهْيِ النَّبَاتِيِّ فِي مُعْظَمِ وَصَفَاتِ الكَعْكِ.",
      },
    ],
    exampleSentence:
      "Heat two tablespoons of sunflower cooking oil in the frying pan over medium heat.",
    exampleArabic:
      "سَخِّنْ مِلْعَقَتَيْنِ مِنْ زَيْتِ عَبَّادِ الشَّمْسِ لِلطَّهْيِ فِي المِقْلاةِ عَلَى نَارٍ مُتَوَسِّطَةٍ.",
  },
  corkscrew: {
    id: "corkscrew",
    arabic: "فَتَّاحَةُ زُجَاجَات (مِفْتَاحُ الفِلِّين)",
    partOfSpeech: "noun",
    phonetic: "ˈkɔːrk.skruː",
    pronunciationTip: "Compound noun: 'CORK' (/kɔːrk/) + 'SCREW' (/skruː/).",
    collocations: [
      "waiter's corkscrew",
      "pull the cork with a corkscrew",
      "screw the corkscrew",
      "wine corkscrew",
      "bottle corkscrew",
      "lever corkscrew",
    ],
    phrasalVerbs: [
      {
        phrase: "pull out",
        meaning: "extract cork from bottle",
        arabic: "يَسْحَبُ الفِلِّينَة",
        example: "Twist the screw in and pull out the cork smoothly.",
      },
    ],
    sentences: [
      {
        context: "Dinner Party",
        en: "He twisted the corkscrew into the wine bottle and pulled the cork smoothly.",
        ar: "لَفَّ فَتَّاحَةَ الفِلِّينِ دَاخِلَ الزُّجَاجَةِ وَسَحَبَ السِّدَادَةَ بِسَلاسَةٍ.",
      },
      {
        context: "Tool Quality",
        en: "A waiter's corkscrew with a built-in foil cutter is reliable and compact.",
        ar: "تُعَدُّ فَتَّاحَةُ الفِلِّينِ المُمَيَّزَةُ بِقَاطِعِ قَصْدِيرٍ عَمَلِيَّةً وَمَوْثُوقَةً جِدّاً.",
      },
      {
        context: "Kitchen Drawer",
        en: "She retrieved the corkscrew from the drawer to open a bottle of sparkling juice.",
        ar: "أَخْرَجَتْ مِفْتَاحَ الفِلِّينِ مِنَ الدُّرْجِ لِفَتْحِ زُجَاجَةِ عَصِيرٍ فَوَّارٍ.",
      },
    ],
    exampleSentence: "He twisted the corkscrew into the wine bottle and pulled the cork smoothly.",
    exampleArabic:
      "لَفَّ فَتَّاحَةَ الفِلِّينِ دَاخِلَ الزُّجَاجَةِ وَسَحَبَ السِّدَادَةَ بِسَلاسَةٍ.",
  },
  cow: {
    id: "cow",
    arabic: "بَقَرَة",
    partOfSpeech: "noun",
    phonetic: "kaʊ",
    pronunciationTip: "Diphthong 'ow' sound /aʊ/ as in 'now' or 'how'.",
    collocations: [
      "dairy cow",
      "milk a cow",
      "herd of cows",
      "graze in the pasture",
      "cow bell",
      "spotted cow",
    ],
    phrasalVerbs: [
      {
        phrase: "milk",
        meaning: "extract milk from a cow",
        arabic: "يَحْلِبُ البَقَرَة",
        example: "The farmer milks the dairy cows at dawn every day.",
      },
    ],
    sentences: [
      {
        context: "Dairy Farming",
        en: "The dairy cow produces over twenty liters of fresh milk each morning.",
        ar: "تُنْتِجُ بَقَرَةُ الحَلِيبِ أَكْثَرَ مِنْ عِشْرِينَ لِتْراً مِنَ الحَلِيبِ الطَّازَجِ كُلَّ صَبَاحٍ.",
      },
      {
        context: "Pasture Grazing",
        en: "A peaceful herd of black-and-white cows grazed quietly across the green hillside.",
        ar: "رَعَى قَطِيعٌ هَادِئٌ مِنَ الأَبْقَارِ ذَاتِ اللَّوْنَيْنِ الأَبْيَضِ وَالأَسْوَدِ عَلَى التَّلِّ الأَخْضَرِ.",
      },
      {
        context: "Farm Routine",
        en: "The farmer leads the cows back into the warm barn as the sun sets.",
        ar: "يَقُودُ المُزَارِعُ الأَبْقَارَ إِلَى الحَظِيرَةِ الدَّافِئَةِ مَعَ غُرُوبِ الشَّمْسِ.",
      },
    ],
    exampleSentence: "The dairy cow produces over twenty liters of fresh milk each morning.",
    exampleArabic:
      "تُنْتِجُ بَقَرَةُ الحَلِيبِ أَكْثَرَ مِنْ عِشْرِينَ لِتْراً مِنَ الحَلِيبِ الطَّازَجِ كُلَّ صَبَاحٍ.",
  },
  cup: {
    id: "cup",
    arabic: "فِنْجَان",
    partOfSpeech: "noun",
    phonetic: "kʌp",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'up' or 'cut'.",
    collocations: [
      "cup of tea",
      "teacup and saucer",
      "coffee cup",
      "measuring cup",
      "paper cup",
      "sip from a cup",
    ],
    phrasalVerbs: [
      {
        phrase: "pour out",
        meaning: "pour tea or coffee into a cup",
        arabic: "يَسْكُبُ فِي الفِنْجَان",
        example: "She poured out a delicate cup of English breakfast tea.",
      },
    ],
    sentences: [
      {
        context: "Afternoon Tea",
        en: "She offered her guest a delicate porcelain cup of aromatic Earl Grey tea.",
        ar: "قَدَّمَتْ لِضَيْفِهَا فِنْجَانَ خَزَفٍ أَنِيقاً مِنْ شَايِ إِيرْل جْرِي العَطِرِ.",
      },
      {
        context: "Recipe Measurement",
        en: "Add exactly one cup of granulated sugar and half a cup of melted butter.",
        ar: "أَضِفْ كُوباً وَاحِداً تَمَاماً مِنْ السُّكَّرِ وَنِصْفَ كُوبٍ مِنْ الزُّبْدَةِ المُذَابَةِ.",
      },
      {
        context: "Morning Routine",
        en: "A hot cup of black coffee gives him the energy to start his workday.",
        ar: "يَمْنَحُهُ فِنْجَانُ قَهْوَةٍ سَوْدَاءَ سَاخِنٌ الطَّاقَةَ لِبَدْءِ يَوْمِ عَمَلِهِ.",
      },
    ],
    exampleSentence: "She offered her guest a delicate porcelain cup of aromatic Earl Grey tea.",
    exampleArabic:
      "قَدَّمَتْ لِضَيْفِهَا فِنْجَانَ خَزَفٍ أَنِيقاً مِنْ شَايِ إِيرْل جْرِي العَطِرِ.",
  },
  curtain: {
    id: "curtain",
    arabic: "سِتَارَة",
    partOfSpeech: "noun",
    phonetic: "ˈkɜːr.tən",
    pronunciationTip: "First syllable has the 'ur' vowel /ɜːr/, second is a weak schwa /tən/.",
    collocations: [
      "open the curtains",
      "close the curtains",
      "draw the curtains",
      "sheer curtains",
      "heavy curtains",
      "window curtains",
    ],
    phrasalVerbs: [
      {
        phrase: "draw back",
        meaning: "open curtains to let light in",
        arabic: "يَفْتَحُ / يُزِيحُ السَّتَائِر",
        example: "He drew back the curtains to let the morning sun flood the room.",
      },
      {
        phrase: "pull shut",
        meaning: "close curtains completely",
        arabic: "يُغْلِقُ السَّتَائِرَ بِإِحْكَام",
        example: "Pull the curtains shut to block the bright streetlights outside.",
      },
      {
        phrase: "hang up",
        meaning: "mount curtains on a rod",
        arabic: "يُعَلِّقُ السَّتَائِر",
        example: "They hung up new linen curtains in the guest room.",
      },
    ],
    sentences: [
      {
        context: "Morning Routine",
        en: "She opened the bedroom curtains to enjoy the beautiful sunny view.",
        ar: "فَتَحَتْ سَتَائِرَ غُرْفَةِ النَّوْمِ لِتَسْتَمْتِعَ بِالمَنْظَرِ المُشْمِسِ الجَمِيلِ.",
      },
      {
        context: "Privacy & Sleep",
        en: "Blackout curtains help block morning sunlight for shift workers.",
        ar: "تُسَاعِدُ سَتَائِرُ التَّعْتِيمِ فِي حَجْبِ ضَوْءِ الصَّبَاحِ لِمَنْ يَعْمَلُونَ بِنِظَامِ النَّوْبَاتِ.",
      },
      {
        context: "Interior Design",
        en: "Long velvet curtains add elegance and warmth to the living area.",
        ar: "تُضِيفُ السَّتَائِرُ المَخْمَلِيَّةُ الطَّوِيلَةُ أَنَاقَةً وَدِفْئاً عَلَى مِسَاحَةِ المَعِيشَةِ.",
      },
    ],
    exampleSentence: "She opened the bedroom curtains to enjoy the beautiful sunny view.",
    exampleArabic:
      "فَتَحَتْ سَتَائِرَ غُرْفَةِ النَّوْمِ لِتَسْتَمْتِعَ بِالمَنْظَرِ المُشْمِسِ الجَمِيلِ.",
  },
  cushion: {
    id: "cushion",
    arabic: "وِسَادَةُ زِينَة (خُدَّادِيَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈkʊʃ.ən",
    pronunciationTip: "Short 'oo' sound /ʊ/ as in 'push' or 'book'.",
    collocations: [
      "soft cushion",
      "velvet cushion",
      "plump the cushion",
      "decorative cushion",
      "sofa cushion",
      "seat cushion",
    ],
    phrasalVerbs: [
      {
        phrase: "lean against",
        meaning: "rest your back against a cushion",
        arabic: "يَسْتَنِدُ عَلَى",
        example: "She leaned against the soft velvet cushion while watching TV.",
      },
      {
        phrase: "plump up",
        meaning: "fluff up a cushion",
        arabic: "يَنْفُشُ الوِسَادَة",
        example: "He plumped up the sofa cushions before the guests arrived.",
      },
    ],
    sentences: [
      {
        context: "Living Room Decor",
        en: "Colorful velvet cushions brighten up the neutral grey sofa.",
        ar: "تُضْفِي الخُدَّادِيَّاتُ المَخْمَلِيَّةُ المُلَوَّنَةُ حَيَوِيَّةً عَلَى الأَرِيكَةِ الرَّمَادِيَّةِ.",
      },
      {
        context: "Comfort",
        en: "Add a lumbar cushion to your office chair to relieve lower back pressure.",
        ar: "أَضِفْ وِسَادَةَ دَعْمِ الظَّهْرِ إِلَى كُرْسِيِّ المَكْتَبِ لِتَخْفِيفِ ضَغْطِ العَمُودِ الفِقْرِيِّ.",
      },
      {
        context: "Hospitality",
        en: "He arranged the embroidered cushions neatly across the daybed.",
        ar: "رَتَّبَ الوِسَادَاتِ المُطَرَّزَةَ بِأَنَاقَةٍ عَلَى سَرِيرِ الجُلُوسِ النَّهَارِيِّ.",
      },
    ],
    exampleSentence: "Colorful velvet cushions brighten up the neutral grey sofa.",
    exampleArabic:
      "تُضْفِي الخُدَّادِيَّاتُ المَخْمَلِيَّةُ المُلَوَّنَةُ حَيَوِيَّةً عَلَى الأَرِيكَةِ الرَّمَادِيَّةِ.",
  },
  "cutting-board": {
    id: "cutting-board",
    arabic: "لَوْحُ التَّقْطِيع (قَرْمَة)",
    partOfSpeech: "noun",
    phonetic: "ˈkʌt.ɪŋ ˌbɔːrd",
    pronunciationTip: "Compound noun: 'CUTTING' (/ˈkʌt.ɪŋ/) + 'BOARD' (/bɔːrd/).",
    collocations: [
      "wooden cutting board",
      "plastic cutting board",
      "chop on a cutting board",
      "clean the cutting board",
      "bamboo cutting board",
      "food prep cutting board",
    ],
    phrasalVerbs: [
      {
        phrase: "chop up on",
        meaning: "cut food on a cutting board",
        arabic: "يُقَطِّعُ عَلَى اللَّوْح",
        example: "Chop up the onions and garlic on the wooden cutting board.",
      },
      {
        phrase: "wipe down",
        meaning: "sanitize the board surface",
        arabic: "يُعَقِّمُ وَيَمْسَح",
        example: "Wipe down the cutting board with lemon juice and coarse salt.",
      },
    ],
    sentences: [
      {
        context: "Food Prep",
        en: "He sliced fresh red bell peppers and crisp celery on the heavy wooden cutting board.",
        ar: "قَطَّعَ الفُلْفُلَ الرُّومِيَّ الأَحْمَرَ وَالكَرَفْسَ عَلَى لَوْحِ التَّقْطِيعِ الخَشَبِيِّ الثَّقِيلِ.",
      },
      {
        context: "Food Safety",
        en: "Use separate cutting boards for raw poultry and fresh vegetables to prevent cross-contamination.",
        ar: "اسْتَخْدِمْ أَلْوَاحَ تَقْطِيعٍ مُنْفَصِلَةً لِلدَّوَاجِنِ النِّيئَةِ وَالخُضْرَاوَاتِ مَنْعاً لِلتَّلَوُّثِ.",
      },
      {
        context: "Maintenance",
        en: "Oil your wooden cutting boards periodically with mineral oil to prevent cracking.",
        ar: "ادْهَنْ أَلْوَاحَ التَّقْطِيعِ الخَشَبِيَّةَ دَوْرِيّاً بِزَيْتٍ مُخَصَّصٍ لِمَنْعِ تَشَقُّقِهَا.",
      },
    ],
    exampleSentence:
      "He sliced fresh red bell peppers and crisp celery on the heavy wooden cutting board.",
    exampleArabic:
      "قَطَّعَ الفُلْفُلَ الرُّومِيَّ الأَحْمَرَ وَالكَرَفْسَ عَلَى لَوْحِ التَّقْطِيعِ الخَشَبِيِّ الثَّقِيلِ.",
  },
  desk: {
    id: "desk",
    arabic: "مَكْتَب",
    partOfSpeech: "noun",
    phonetic: "dɛsk",
    pronunciationTip: "Pronounce the final 'sk' cluster clearly without adding a vowel.",
    collocations: [
      "study desk",
      "sit at the desk",
      "desk lamp",
      "clear your desk",
      "wooden desk",
      "computer desk",
    ],
    phrasalVerbs: [
      {
        phrase: "sit down",
        meaning: "take a seat at a desk",
        arabic: "يَجْلِسُ",
        example: "He sat down at his desk to begin writing.",
      },
      {
        phrase: "clear off",
        meaning: "remove items from the surface",
        arabic: "يُخْلِي السَّطْحَ",
        example: "Please clear off your desk before leaving the room.",
      },
    ],
    sentences: [
      {
        context: "Studying",
        en: "The student spends three hours every evening working at her desk.",
        ar: "تَقْضِي الطَّالِبَةُ ثَلاثَ سَاعَاتٍ كُلَّ مَسَاءٍ فِي الدِّرَاسَةِ عِنْدَ مَكْتَبِهَا.",
      },
      {
        context: "Workspace Setup",
        en: "He positioned his study desk next to the window for natural light.",
        ar: "وَضَعَ مَكْتَبَ الدِّرَاسَةِ بِجِوَارِ النَّافِذَةِ لِلاِسْتِفَادَةِ مِنَ الضَّوْءِ الطَّبِيعِيِّ.",
      },
      {
        context: "Organization",
        en: "A bright desk lamp and a laptop sit on the wooden desk.",
        ar: "يَسْتَقِرُّ مِصْبَاحُ مَكْتَبٍ سَاطِعٌ وَحَاسُوبٌ مَحْمُولٌ عَلَى المَكْتَبِ الخَشَبِيِّ.",
      },
    ],
    exampleSentence: "The student spends three hours every evening working at her desk.",
    exampleArabic:
      "تَقْضِي الطَّالِبَةُ ثَلاثَ سَاعَاتٍ كُلَّ مَسَاءٍ فِي الدِّرَاسَةِ عِنْدَ مَكْتَبِهَا.",
  },
  "dining-chair": {
    id: "dining-chair",
    arabic: "كُرْسِيُّ طَعَام (كُرْسِيُّ سُفْرَة)",
    partOfSpeech: "noun",
    phonetic: "ˈdaɪ.nɪŋ ˌtʃɛər",
    pronunciationTip: "Compound noun: 'DINING' + 'CHAIR'.",
    collocations: [
      "upholstered dining chair",
      "set of dining chairs",
      "wooden dining chair",
      "comfortable dining chair",
      "pull out a dining chair",
      "high-back dining chair",
    ],
    phrasalVerbs: [
      {
        phrase: "pull out",
        meaning: "slide a chair away from table to sit",
        arabic: "يَسْحَبُ الكُرْسِيّ",
        example: "He pulled out the dining chair politely for his guest.",
      },
      {
        phrase: "push in",
        meaning: "tuck chair back under table",
        arabic: "يُدْخِلُ الكُرْسِيّ",
        example: "Remember to push in your dining chair when leaving the table.",
      },
    ],
    sentences: [
      {
        context: "Dining Set",
        en: "Six upholstered wooden dining chairs surround the rectangular dining table.",
        ar: "تُحِيطُ سِتَّةُ كَرَاسِي سُفْرَةٍ خَشَبِيَّةٍ مُنَجَّدَةٍ بِطَاوِلَةِ الطَّعَامِ المُسْتَطِيلَةِ.",
      },
      {
        context: "Comfort & Style",
        en: "Padded fabric dining chairs make long dinner conversations relaxing and enjoyable.",
        ar: "تَجْعَلُ كَرَاسِي السُّفْرَةِ القُمَاشِيَّةُ المُبَطَّنَةُ الأَحَادِيثَ الطَّوِيلَةَ مُرِيحَةً وَمُمْتِعَةً.",
      },
      {
        context: "Table Courtesy",
        en: "Always push your dining chair neatly under the table after finishing your meal.",
        ar: "ادْفَعْ كُرْسِيَّ السُّفْرَةِ بِعِنَايَةٍ تَحْتَ الطَّاوِلَةِ بَعْدَ الاِنْتِهَاءِ مِنْ تَنَاوُلِ الطَّعَامِ.",
      },
    ],
    exampleSentence: "Six upholstered wooden dining chairs surround the rectangular dining table.",
    exampleArabic:
      "تُحِيطُ سِتَّةُ كَرَاسِي سُفْرَةٍ خَشَبِيَّةٍ مُنَجَّدَةٍ بِطَاوِلَةِ الطَّعَامِ المُسْتَطِيلَةِ.",
  },
  "dining-table": {
    id: "dining-table",
    arabic: "طَاوِلَةُ الطَّعَام (سُفْرَة)",
    partOfSpeech: "noun",
    phonetic: "ˈdaɪ.nɪŋ ˌteɪ.bəl",
    pronunciationTip: "Compound noun: 'DINING' (/ˈdaɪ.nɪŋ/) + 'TABLE' (/ˈteɪ.bəl/).",
    collocations: [
      "wooden dining table",
      "sit at the dining table",
      "set the dining table",
      "extendable dining table",
      "clear the dining table",
      "round dining table",
    ],
    phrasalVerbs: [
      {
        phrase: "sit around",
        meaning: "gather around the table",
        arabic: "يَلْتَفُّ حَوْلَ الطَّاوِلَة",
        example: "The family sat around the dining table to celebrate the holiday.",
      },
      {
        phrase: "clear off",
        meaning: "remove dishes from dining table",
        arabic: "يُخْلِي السُّفْرَة",
        example: "Help clear off the dining table after everyone has finished.",
      },
    ],
    sentences: [
      {
        context: "Family Dinner",
        en: "They sat together at the large solid oak dining table to share Sunday lunch.",
        ar: "جَلَسُوا مَعاً حَوْلَ طَاوِلَةِ الطَّعَامِ المَصْنُوعَةِ مِنْ خَشَبِ البَلُّوطِ لِتَنَاوُلِ الغَدَاءِ.",
      },
      {
        context: "Holiday Hosting",
        en: "The extendable dining table expands easily to seat up to twelve dinner guests.",
        ar: "تَمْتَدُّ طَاوِلَةُ السُّفْرَةِ القَابِلَةُ لِلتَّوْسِعَةِ بِسُهُولَةٍ لِتَسْتَوْعِبَ 12 ضَيْفاً.",
      },
      {
        context: "Table Setting",
        en: "She laid a white linen runner and fresh flowers across the center of the dining table.",
        ar: "فَرَشَتْ مَفْرَشاً كَتَّانِيّاً أَبْيَضَ وَأَزْهَاراً طَازَجَةً عَلَى طَاوِلَةِ الطَّعَامِ.",
      },
    ],
    exampleSentence: "They sat together at the large solid oak dining table to share Sunday lunch.",
    exampleArabic:
      "جَلَسُوا مَعاً حَوْلَ طَاوِلَةِ الطَّعَامِ المَصْنُوعَةِ مِنْ خَشَبِ البَلُّوطِ لِتَنَاوُلِ الغَدَاءِ.",
  },
  "dish-rack": {
    id: "dish-rack",
    arabic: "مُجَفِّفُ الأَطْبَاق (مَطْبَقِيَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈdɪʃ ˌræk",
    pronunciationTip: "Compound noun: 'DISH' (/dɪʃ/) + 'RACK' (/ræk/).",
    collocations: [
      "stainless steel dish rack",
      "air-dry in the dish rack",
      "foldable dish rack",
      "drain on the dish rack",
      "dish rack tray",
      "over-the-sink dish rack",
    ],
    phrasalVerbs: [
      {
        phrase: "stack up in",
        meaning: "arrange washed plates in the rack",
        arabic: "يَرُصُّ فِي المَطْبَقِيَّة",
        example: "Stack up the clean plates in the dish rack to dry.",
      },
    ],
    sentences: [
      {
        context: "Air Drying",
        en: "She stacked the clean plates and bowls neatly in the dish rack to air dry.",
        ar: "رَصَّتِ الأَطْبَاقَ وَالأَوْعِيَةَ النَّظِيفَةَ فِي مَطْبَقِيَّةِ التَّجْفِيفِ لِتَجِفَّ فِي الهَوَاءِ.",
      },
      {
        context: "Sink Space",
        en: "The compact stainless steel dish rack drains directly into the kitchen sink.",
        ar: "تَصْرِفُ مَطْبَقِيَّةُ السْتَانْلِس المُرِيحَةُ المِيَاهَ مُبَاشَرَةً إِلَى حَوْضِ المَطْبَخِ.",
      },
      {
        context: "Utensil Holder",
        en: "Place forks and spoons standing upright in the dish rack's cutlery basket.",
        ar: "ضَعِ الشُّوَكَ وَالمَلاعِقَ وَاقِفَةً فِي سَلَّةِ أَدَوَاتِ المَائِدَةِ المُلْحَقَةِ بِمُجَفِّفِ الصُّحُونِ.",
      },
    ],
    exampleSentence: "She stacked the clean plates and bowls neatly in the dish rack to air dry.",
    exampleArabic:
      "رَصَّتِ الأَطْبَاقَ وَالأَوْعِيَةَ النَّظِيفَةَ فِي مَطْبَقِيَّةِ التَّجْفِيفِ لِتَجِفَّ فِي الهَوَاءِ.",
  },
  "dish-soap": {
    id: "dish-soap",
    arabic: "صَابُونُ غَسِيلِ الأَطْبَاق (سَائِلُ جَلِي)",
    partOfSpeech: "noun",
    phonetic: "ˈdɪʃ ˌsoʊp",
    pronunciationTip: "Compound noun: 'DISH' (/dɪʃ/) + 'SOAP' (/soʊp/).",
    collocations: [
      "bottle of dish soap",
      "liquid dish soap",
      "squirt dish soap",
      "degreasing dish soap",
      "citrus dish soap",
      "gentle dish soap",
    ],
    phrasalVerbs: [
      {
        phrase: "suds up",
        meaning: "form foaming bubbles with water",
        arabic: "يُرْغِي",
        example: "The dish soap suds up quickly under warm running tap water.",
      },
      {
        phrase: "cut through",
        meaning: "dissolve grease easily",
        arabic: "يُذِيبُ الدُّهُون",
        example: "This concentrated dish soap cuts through thick cooking grease instantly.",
      },
    ],
    sentences: [
      {
        context: "Hand Washing",
        en: "A small squirt of concentrated liquid dish soap easily cuts through greasy pans.",
        ar: "قَطْرَةٌ صَغِيرَةٌ مِنْ سَائِلِ الجَلِي المُرَكَّزِ تُذِيبُ دُهُونَ المَقَالِي بِسُهُولَةٍ.",
      },
      {
        context: "Skin Care",
        en: "Choose a dish soap formulated with aloe vera to keep your hands soft while washing.",
        ar: "اخْتَرْ صَابُونَ أَطْبَاقٍ مُدَعَّماً بِالصَّبَّارِ لِلْحِفَاظِ عَلَى نُعُومَةِ يَدَيْكَ أَثْنَاءَ الجَلِي.",
      },
      {
        context: "Refill Routine",
        en: "She refilled the ceramic sink soap dispenser from a large economy bottle of dish soap.",
        ar: "أَعَادَتْ مَلْءَ مِضَخَّةِ الصَّابُونِ عَلَى الحَوْضِ مِنْ عَبْوَةِ سَائِلِ الجَلِي الكَبِيرَةِ.",
      },
    ],
    exampleSentence:
      "A small squirt of concentrated liquid dish soap easily cuts through greasy pans.",
    exampleArabic:
      "قَطْرَةٌ صَغِيرَةٌ مِنْ سَائِلِ الجَلِي المُرَكَّزِ تُذِيبُ دُهُونَ المَقَالِي بِسُهُولَةٍ.",
  },
  "dish-towel": {
    id: "dish-towel",
    arabic: "فُوطَةُ مَطْبَخ (مِنْشَفَةُ صُحُون)",
    partOfSpeech: "noun",
    phonetic: "ˈdɪʃ ˌtaʊ.əl",
    pronunciationTip: "Compound noun: 'DISH' (/dɪʃ/) + 'TOWEL' (/ˈtaʊ.əl/).",
    collocations: [
      "dry with a dish towel",
      "clean dish towel",
      "cotton dish towel",
      "hang the dish towel",
      "linen dish towel",
      "damp dish towel",
    ],
    phrasalVerbs: [
      {
        phrase: "wipe dry",
        meaning: "dry clean dishes with a towel",
        arabic: "يُجَفِّفُ بِالفُوطَة",
        example: "She wiped dry all the wine glasses with a soft dish towel.",
      },
      {
        phrase: "hang up",
        meaning: "hang a dish towel to dry",
        arabic: "يُعَلِّقُ الفُوطَة",
        example: "Hang up the damp dish towel on the oven handle.",
      },
    ],
    sentences: [
      {
        context: "Drying Dishes",
        en: "He dried the freshly washed porcelain plates using a clean cotton dish towel.",
        ar: "جَفَّفَ الأَطْبَاقَ الخَزَفِيَّةَ المَغْسُولَةَ حَدِيثاً بِاسْتِخْدَامِ فُوطَةِ مَطْبَخٍ قُطْنِيَّةٍ نَظِيفَةٍ.",
      },
      {
        context: "Kitchen Cleanliness",
        en: "Replace dish towels daily to maintain strict hygiene standards in the kitchen.",
        ar: "اسْتَبْدِلْ فُوَطَ المَطْبَخِ يَوْمِيّاً لِلْحِفَاظِ عَلَى أَعْلَى مَعَايِيرِ النَّظَافَةِ.",
      },
      {
        context: "Baking Cover",
        en: "Cover the resting bread dough with a damp dish towel to keep it moist.",
        ar: "غَطِّ عَجِينَةَ الخُبْزِ بِفُوطَةِ مَطْبَخٍ رَطْبَةٍ لِلْحِفَاظِ عَلَى طَرَاوَتِهَا أَثْنَاءَ التَّخَمُّرِ.",
      },
    ],
    exampleSentence:
      "He dried the freshly washed porcelain plates using a clean cotton dish towel.",
    exampleArabic:
      "جَفَّفَ الأَطْبَاقَ الخَزَفِيَّةَ المَغْسُولَةَ حَدِيثاً بِاسْتِخْدَامِ فُوطَةِ مَطْبَخٍ قُطْنِيَّةٍ نَظِيفَةٍ.",
  },
  dishwasher: {
    id: "dishwasher",
    arabic: "غَسَّالَةُ الصُّحُون (جَلَّايَة)",
    partOfSpeech: "noun",
    phonetic: "ˈdɪʃˌwɑː.ʃər",
    pronunciationTip: "Compound word: 'DISH' + 'WASHER'.",
    collocations: [
      "load the dishwasher",
      "unload the dishwasher",
      "dishwasher detergent",
      "run the dishwasher",
      "dishwasher cycle",
      "dishwasher safe",
    ],
    phrasalVerbs: [
      {
        phrase: "load up",
        meaning: "fill dishwasher with dirty plates",
        arabic: "يَمْلَأُ غَسَّالَةَ الصُّحُون",
        example: "Load up all the dirty bowls into the dishwasher rack.",
      },
      {
        phrase: "empty out",
        meaning: "take out clean dishes",
        arabic: "يُفْرِغُ الغَسَّالَة",
        example: "He emptied out the clean dishes and put them in the cupboard.",
      },
    ],
    sentences: [
      {
        context: "Chore Routine",
        en: "She loaded the dirty plates and cutlery into the dishwasher after dinner.",
        ar: "وَضَعَتِ الأَطْبَاقَ وَأَدَوَاتِ المَائِدَةِ المُتَّسِخَةَ فِي غَسَّالَةِ الصُّحُونِ بَعْدَ العَشَاءِ.",
      },
      {
        context: "Eco Living",
        en: "Modern dishwashers use less water than washing dishes by hand.",
        ar: "تَسْتَهْلِكُ غَسَّالاتُ الصُّحُونِ الحَدِيثَةُ مِيَاهاً أَقَلَّ مِنْ غَسِيلِ الأَطْبَاقِ يَدَوِيّاً.",
      },
      {
        context: "Care Instructions",
        en: "Make sure delicate crystal glasses are marked as dishwasher safe before loading.",
        ar: "تَأَكَّدْ مِنْ أَنَّ الكُؤُوسَ الكِرِيسْتَالِيَّةَ آمِنَةٌ لِلْغَسِيلِ فِي الغَسَّالَةِ قَبْلَ وَضْعِهَا.",
      },
    ],
    exampleSentence: "She loaded the dirty plates and cutlery into the dishwasher after dinner.",
    exampleArabic:
      "وَضَعَتِ الأَطْبَاقَ وَأَدَوَاتِ المَائِدَةِ المُتَّسِخَةَ فِي غَسَّالَةِ الصُّحُونِ بَعْدَ العَشَاءِ.",
  },
  "display-case": {
    id: "display-case",
    arabic: "خِزَانَةُ عَرْض (فَتْرِينَة)",
    partOfSpeech: "noun",
    phonetic: "dɪˈspleɪ ˌkeɪs",
    pronunciationTip: "Compound noun: 'DISPLAY' (/dɪˈspleɪ/) + 'CASE' (/keɪs/).",
    collocations: [
      "glass display case",
      "lighted display case",
      "show in a display case",
      "antique display case",
      "trophy display case",
      "lockable display case",
    ],
    phrasalVerbs: [
      {
        phrase: "show off",
        meaning: "exhibit prized items in a display case",
        arabic: "يَعْرِضُ بِفَخْر",
        example: "The museum showed off ancient pottery in glass display cases.",
      },
    ],
    sentences: [
      {
        context: "Collectibles",
        en: "He proudly displayed his vintage ceramic teacups inside the glass display case.",
        ar: "عَرَضَ فَنَاجِينَ الشَّايِ الخَزَفِيَّةَ الكِلاسِيكِيَّةَ دَاخِلَ فَتْرِينَةِ العَرْضِ الزُّجَاجِيَّةِ.",
      },
      {
        context: "Trophy Cabinet",
        en: "All school athletic awards and gold trophies are secured in the illuminated display case.",
        ar: "تُحْفَظُ جَمِيعُ الجَوَائِزِ وَالكُؤُوسِ الرِّيَاضِيَّةِ دَاخِلَ خِزَانَةِ عَرْضٍ مُضَاءَةٍ.",
      },
      {
        context: "Dust Protection",
        en: "Glass doors on the display case protect delicate porcelain figurines from dust.",
        ar: "تَحْمِي الأَبْوَابُ الزُّجَاجِيَّةُ لِلْفَتْرِينَةِ التَّمَاثِيلَ الخَزَفِيَّةَ الرَّقِيقَةَ مِنَ الغُبَارِ.",
      },
    ],
    exampleSentence:
      "He proudly displayed his vintage ceramic teacups inside the glass display case.",
    exampleArabic:
      "عَرَضَ فَنَاجِينَ الشَّايِ الخَزَفِيَّةَ الكِلاسِيكِيَّةَ دَاخِلَ فَتْرِينَةِ العَرْضِ الزُّجَاجِيَّةِ.",
  },
  dog: {
    id: "dog",
    arabic: "كَلْب (كَلْبُ حِرَاسَة)",
    partOfSpeech: "noun",
    phonetic: "dɔːɡ",
    pronunciationTip: "Open 'aw' vowel /ɔː/ in American English, short 'o' /ɒ/ in British English.",
    collocations: [
      "farm dog",
      "barking dog",
      "loyal dog",
      "walk the dog",
      "guard dog",
      "wag its tail",
    ],
    phrasalVerbs: [
      {
        phrase: "bark at",
        meaning: "sound alarm at strangers",
        arabic: "يَنْبَحُ عَلَى",
        example: "The loyal farm dog barked at the delivery van.",
      },
      {
        phrase: "fetch",
        meaning: "run and retrieve a thrown object",
        arabic: "يَجْلِبُ الشَّيْء",
        example: "The golden retriever loved to fetch sticks from the pond.",
      },
    ],
    sentences: [
      {
        context: "Faithful Companion",
        en: "The loyal sheepdog accompanied the farmer on his daily rounds across the fields.",
        ar: "رَافَقَ كَلْبُ الرِّعَايَةِ المُخْلِصُ المُزَارِعَ فِي جَوْلاتِهِ اليَوْمِيَّةِ عَبْرَ الحُقُولِ.",
      },
      {
        context: "Herding Skill",
        en: "With keen intelligence and speed, the farm dog safely gathered the stray lambs.",
        ar: "بِذَكَاءٍ حَادٍّ وَسُرْعَةٍ خَاطِفَةٍ، جَمَعَ كَلْبُ المَزْرَعَةِ الحُمْلانَ الشَّارِدَةَ بِأَمَانٍ.",
      },
      {
        context: "Welcoming Home",
        en: "The golden retriever wagged its tail excitedly when the children returned from school.",
        ar: "هَزَّ الكَلْبُ ذَيْلَهُ بِحَمَاسٍ كَبِيرٍ عِنْدَمَا عَادَ الأَطْفَالُ مِنَ المَدْرَسَةِ.",
      },
    ],
    exampleSentence:
      "The loyal sheepdog accompanied the farmer on his daily rounds across the fields.",
    exampleArabic:
      "رَافَقَ كَلْبُ الرِّعَايَةِ المُخْلِصُ المُزَارِعَ فِي جَوْلاتِهِ اليَوْمِيَّةِ عَبْرَ الحُقُولِ.",
  },
  donkey: {
    id: "donkey",
    arabic: "حِمَار",
    partOfSpeech: "noun",
    phonetic: "ˈdɑːŋ.ki",
    pronunciationTip: "First syllable has /dɑːŋ/ in American English, /ˈdɒŋ/ in British English.",
    collocations: [
      "bray of a donkey",
      "stubborn donkey",
      "pack donkey",
      "gentle donkey",
      "donkey cart",
      "pet a donkey",
    ],
    phrasalVerbs: [
      {
        phrase: "carry on",
        meaning: "transport loads steadily",
        arabic: "يَحْمِلُ الأَثْقَالَ",
        example: "The loyal donkey carried on with the heavy pack up the mountain.",
      },
    ],
    sentences: [
      {
        context: "Hard Worker",
        en: "The sturdy donkey patiently carried baskets of harvested apples up the hillside.",
        ar: "حَمَلَ الحِمَارُ المَتِينُ سِلالَ التُّفَّاحِ المَحْصُودِ بِصَبْرٍ صُعُوداً عَلَى التَّلِّ.",
      },
      {
        context: "Gentle Nature",
        en: "The friendly grey donkey loved having its long ears gently scratched by visitors.",
        ar: "أَحَبَّ الحِمَارُ الرَّمَادِيُّ اللَّطِيفُ أَنْ يَمْسَحَ الزُّوَّارُ عَلَى أُذُنَيْهِ الطَّوِيلَتَيْنِ.",
      },
      {
        context: "Farm Protection",
        en: "Farmers often keep guard donkeys to protect vulnerable sheep from coyotes.",
        ar: "يُرَبِّي المُزَارِعُونَ الحَمِيرَ لِحِرَاسَةِ الأَغْنَامِ وَحِمَايَتِهَا مِنَ الذِّئَابِ البَرِّيَّةِ.",
      },
    ],
    exampleSentence:
      "The sturdy donkey patiently carried baskets of harvested apples up the hillside.",
    exampleArabic:
      "حَمَلَ الحِمَارُ المَتِينُ سِلالَ التُّفَّاحِ المَحْصُودِ بِصَبْرٍ صُعُوداً عَلَى التَّلِّ.",
  },
  door: {
    id: "door",
    arabic: "بَاب",
    partOfSpeech: "noun",
    phonetic: "dɔːr",
    pronunciationTip: "Rhymes with 'more', 'floor', and 'four'.",
    collocations: [
      "open the door",
      "close the door",
      "lock the door",
      "knock on the door",
      "bedroom door",
      "front door",
    ],
    phrasalVerbs: [
      {
        phrase: "walk in",
        meaning: "enter through a door",
        arabic: "يَدْخُلُ",
        example: "She knocked gently before walking in through the door.",
      },
      {
        phrase: "lock up",
        meaning: "secure doors with keys",
        arabic: "يُقْفِلُ بِالمِفْتَاح",
        example: "Don't forget to lock up the front door before going to sleep.",
      },
    ],
    sentences: [
      {
        context: "Privacy",
        en: "Please close the bedroom door quietly so you don't wake the baby.",
        ar: "يُرْجَى إِغْلاقُ بَابِ غُرْفَةِ النَّوْمِ بِهُدُوءٍ حَتَّى لا تُوقِظَ الرَّضِيعَ.",
      },
      {
        context: "Security",
        en: "Always lock the entrance door when leaving the house unattended.",
        ar: "اقْفِلْ دَائِماً بَابَ المَدْخَلِ عِنْدَ مُغَادَرَةِ المَنْزِلِ دُونَ رَقِيبٍ.",
      },
      {
        context: "Etiquette",
        en: "He knocked three times on the office door and waited for an answer.",
        ar: "طَرَقَ بَابَ المَكْتَبِ ثَلاثَ مَرَّاتٍ وَانْتَظَرَ الإِذْنَ بِالدُّخُولِ.",
      },
    ],
    exampleSentence: "Please close the bedroom door quietly so you don't wake the baby.",
    exampleArabic:
      "يُرْجَى إِغْلاقُ بَابِ غُرْفَةِ النَّوْمِ بِهُدُوءٍ حَتَّى لا تُوقِظَ الرَّضِيعَ.",
  },
  doormat: {
    id: "doormat",
    arabic: "دَوَّاسَةُ بَاب (مَمْسَحَةُ أَرْجُل)",
    partOfSpeech: "noun",
    phonetic: "ˈdɔːr.mæt",
    pronunciationTip: "Compound noun: 'DOOR' (/dɔːr/) + 'MAT' (/mæt/).",
    collocations: [
      "welcome doormat",
      "wipe feet on the doormat",
      "coir doormat",
      "outdoor doormat",
      "front door mat",
      "rubber doormat",
    ],
    phrasalVerbs: [
      {
        phrase: "wipe off",
        meaning: "clean shoe soles on a doormat",
        arabic: "يَمْسَحُ قَدَمَيْهِ فِي الدَّوَّاسَة",
        example: "Wipe off your muddy boots thoroughly on the heavy doormat.",
      },
    ],
    sentences: [
      {
        context: "Home Entrance",
        en: "A natural coconut coir doormat with 'Welcome' printed on it greets visitors at the door.",
        ar: "تَسْتَقْبِلُ دَوَّاسَةُ بَابٍ مَصْنُوعَةٌ مِنْ أَلْيَافِ جَوْزِ الهِنْدِ الزُّوَّارَ عِنْدَ المَدْخَلِ.",
      },
      {
        context: "Cleanliness",
        en: "Please wipe your boots on the outdoor rubber doormat before stepping inside the house.",
        ar: "يُرْجَى مَسْحُ الأَحْذِيَةِ فِي مَمْسَحَةِ الأَرْجُلِ المَطَّاطِيَّةِ قَبْلَ الدُّخُولِ إِلَى المَنْزِلِ.",
      },
      {
        context: "Weather Durability",
        en: "Heavy-duty outdoor doormats withstand rain and trap mud before it reaches indoor floors.",
        ar: "تَتَحَمَّلُ دَوَّاسَاتُ الأَبْوَابِ الخَارِجِيَّةُ الأَمْطَارَ وَتَحْتَجِزُ الطِّينَ عَنِ الأَرْضِيَّاتِ الدَّاخِلِيَّةِ.",
      },
    ],
    exampleSentence:
      "A natural coconut coir doormat with 'Welcome' printed on it greets visitors at the door.",
    exampleArabic:
      "تَسْتَقْبِلُ دَوَّاسَةُ بَابٍ مَصْنُوعَةٌ مِنْ أَلْيَافِ جَوْزِ الهِنْدِ الزُّوَّارَ عِنْدَ المَدْخَلِ.",
  },
  drawer: {
    id: "drawer",
    arabic: "دُرْج",
    partOfSpeech: "noun",
    phonetic: "drɔːr",
    pronunciationTip:
      "Single syllable in standard English /drɔːr/, rhyming with 'door' and 'four'.",
    collocations: [
      "pull out a drawer",
      "open the drawer",
      "close the drawer",
      "top drawer",
      "locked drawer",
      "desk drawer",
    ],
    phrasalVerbs: [
      {
        phrase: "pull out",
        meaning: "slide a drawer open",
        arabic: "يَسْحَبُ الدُّرْج",
        example: "He pulled out the desk drawer to look for a pen.",
      },
      {
        phrase: "slide shut",
        meaning: "close a drawer smoothly",
        arabic: "يُغْلِقُ الدُّرْجَ بِسَلاسَة",
        example: "The soft-close drawer slid shut silently.",
      },
    ],
    sentences: [
      {
        context: "Organization",
        en: "He pulled open the top drawer to find his passport and house keys.",
        ar: "فَتَحَ الدُّرْجَ العُلْوِيَّ لِلْعُثُورِ عَلَى جَوَازِ سَفَرِهِ وَمَفَاتِيحِ المَنْزِلِ.",
      },
      {
        context: "Kitchen Storage",
        en: "The cutlery drawer is divided into sections for spoons, forks, and knives.",
        ar: "يَنْقَسِمُ دُرْجُ أَدَوَاتِ المَائِدَةِ إِلَى أَقْسَامٍ مُخَصَّصَةٍ لِلْمَلاعِقِ وَالشُّوَكِ وَالسَّكَاكِينِ.",
      },
      {
        context: "Quality Furniture",
        en: "Solid wood dovetail drawers glide smoothly on ball-bearing metal runners.",
        ar: "تَنْزَلِقُ أَدْرَاجُ الخَشَبِ الصُّلْبِ بِسَلاسَةٍ عَلَى مَجَارٍ مَعْدَنِيَّةٍ عَالِيَةِ الجَوْدَةِ.",
      },
    ],
    exampleSentence: "He pulled open the top drawer to find his passport and house keys.",
    exampleArabic:
      "فَتَحَ الدُّرْجَ العُلْوِيَّ لِلْعُثُورِ عَلَى جَوَازِ سَفَرِهِ وَمَفَاتِيحِ المَنْزِلِ.",
  },
  dresser: {
    id: "dresser",
    arabic: "خِزَانَةُ الأَدْرَاج (تَسْرِيحَة)",
    partOfSpeech: "noun",
    phonetic: "ˈdrɛs.ər",
    pronunciationTip: "Starts with a blended 'dr' sound followed by a soft 'er'.",
    collocations: [
      "dresser drawer",
      "oak dresser",
      "top of the dresser",
      "mirror on the dresser",
      "fill the dresser",
      "bedroom dresser",
    ],
    phrasalVerbs: [
      {
        phrase: "put away",
        meaning: "store items in their proper place",
        arabic: "يَضَعُ الشَّيْءَ فِي مَكَانِهِ",
        example: "She put away all the clean laundry into the dresser.",
      },
      {
        phrase: "fold up",
        meaning: "fold clothes neatly",
        arabic: "يَطْوِي المَلابِسَ",
        example: "Fold up your t-shirts before placing them in the dresser.",
      },
    ],
    sentences: [
      {
        context: "Organizing",
        en: "He arranged his socks and shirts neatly inside the dresser.",
        ar: "رَتَّبَ جَوَارِبَهُ وَقُمْصَانَهُ بِعِنَايَةٍ دَاخِلَ خِزَانَةِ الأَدْرَاجِ.",
      },
      {
        context: "Decor",
        en: "She placed a jewelry box and a family photo on top of the dresser.",
        ar: "وَضَعَتْ صُنْدُوقَ مَجَوْهَرَاتٍ وَصُورَةً عَائِلِيَّةً فَوْقَ التَّسْرِيحَةِ.",
      },
      {
        context: "Purchasing",
        en: "The vintage wooden dresser adds a classic charm to the bedroom.",
        ar: "تُضِيفُ خِزَانَةُ الأَدْرَاجِ الخَشَبِيَّةُ الكِلاسِيكِيَّةُ سِحْراً عَلَى غُرْفَةِ النَّوْمِ.",
      },
    ],
    exampleSentence: "He arranged his socks and shirts neatly inside the dresser.",
    exampleArabic: "رَتَّبَ جَوَارِبَهُ وَقُمْصَانَهُ بِعِنَايَةٍ دَاخِلَ خِزَانَةِ الأَدْرَاجِ.",
  },
  duck: {
    id: "duck",
    arabic: "بَطَّة",
    partOfSpeech: "noun",
    phonetic: "dʌk",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'luck' or 'truck'.",
    collocations: [
      "duck pond",
      "quacking duck",
      "feed the ducks",
      "swim like a duck",
      "duckling",
      "duck feathers",
    ],
    phrasalVerbs: [
      {
        phrase: "duck out",
        meaning: "(idiom) leave quietly or quickly",
        arabic: "يَنْسَلُّ بِهُدُوء",
        example: "He ducked out of the meeting ten minutes early.",
      },
    ],
    sentences: [
      {
        context: "Pond Life",
        en: "A mother duck led her six fluffy ducklings across the calm pond.",
        ar: "قَادَتْ أُمُّ البَطِّ صِغَارَهَا السِّتَّةَ ذَوِي الزَّغَبِ النَّاعِمِ عَبْرَ البِرْكَةِ الهَادِئَةِ.",
      },
      {
        context: "Feeding Birds",
        en: "The children threw chopped oats and lettuce leaves to the quacking ducks.",
        ar: "أَلْقَى الأَطْفَالُ حُبُوبَ الشُّوفَانِ وَأَوْرَاقَ الخَسِّ لِلْبَطِّ المُتَجَمِّعِ.",
      },
      {
        context: "Waterproofing",
        en: "Duck feathers have a natural oil coating that keeps them dry while swimming.",
        ar: "تَحْتَوِي رِيشَاتُ البَطِّ عَلَى زُيُوتٍ طَبِيعِيَّةٍ تَجْعَلُهَا مَانِعَةً لِلْمَاءِ أَثْنَاءَ السِّبَاحَةِ.",
      },
    ],
    exampleSentence: "A mother duck led her six fluffy ducklings across the calm pond.",
    exampleArabic:
      "قَادَتْ أُمُّ البَطِّ صِغَارَهَا السِّتَّةَ ذَوِي الزَّغَبِ النَّاعِمِ عَبْرَ البِرْكَةِ الهَادِئَةِ.",
  },
  duvet: {
    id: "duvet",
    arabic: "لِحَاف (دُوفِيه)",
    partOfSpeech: "noun",
    phonetic: "ˈduː.veɪ",
    pronunciationTip: "French loanword: silent 't' at the end, pronounced /duːveɪ/.",
    collocations: [
      "thick duvet",
      "duvet cover",
      "feather duvet",
      "warm duvet",
      "wash the duvet",
      "sleep under a duvet",
    ],
    phrasalVerbs: [
      {
        phrase: "slip into",
        meaning: "insert a duvet into its cover",
        arabic: "يُدْخِلُ اللِّحَافَ فِي الغِطَاء",
        example: "It takes patience to slip the thick duvet into its clean cover.",
      },
      {
        phrase: "crawl under",
        meaning: "get underneath a warm duvet",
        arabic: "يَخْلُدُ تَحْتَ اللِّحَاف",
        example: "She crawled under the duvet and fell asleep instantly.",
      },
    ],
    sentences: [
      {
        context: "Winter Comfort",
        en: "The down-filled duvet kept them perfectly warm during the winter blizzard.",
        ar: "أَبْقَاهُمُ اللِّحَافُ المَحْشُوُّ بِالرِّيشِ دَافِئِينَ خِلالَ العَاصِفَةِ الشَّتْوِيَّةِ.",
      },
      {
        context: "Linen Care",
        en: "She selected a blue floral duvet cover to brighten the bedroom.",
        ar: "اخْتَارَتْ غِطَاءَ لِحَافٍ مُزَيَّناً بِزُهُورٍ زَرْقَاءَ لِإِضْفَاءِ بَهْجَةٍ عَلَى الغُرْفَةِ.",
      },
      {
        context: "Everyday Use",
        en: "Shake the duvet each morning to restore its natural fluffiness.",
        ar: "انْفُضِ اللِّحَافَ كُلَّ صَبَاحٍ لِيَسْتَعِيدَ انْتِفَاخَهُ وَنُعُومَتَهُ الطَّبِيعِيَّةَ.",
      },
    ],
    exampleSentence: "The down-filled duvet kept them perfectly warm during the winter blizzard.",
    exampleArabic:
      "أَبْقَاهُمُ اللِّحَافُ المَحْشُوُّ بِالرِّيشِ دَافِئِينَ خِلالَ العَاصِفَةِ الشَّتْوِيَّةِ.",
  },
  "dvd-player": {
    id: "dvd-player",
    arabic: "مُشَغِّلُ أَقْرَاصِ الدِّي فِي دِي",
    partOfSpeech: "noun",
    phonetic: "ˌdiː.viːˈdiː ˌpleɪ.ər",
    pronunciationTip: "Letters D-V-D spoken individually + 'PLAYER' (/ˈpleɪ.ər/).",
    collocations: [
      "insert into the DVD player",
      "compact DVD player",
      "play on the DVD player",
      "connect the DVD player",
      "DVD player remote",
      "eject from the DVD player",
    ],
    phrasalVerbs: [
      {
        phrase: "pop in",
        meaning: "insert a disc into a player",
        arabic: "يُدْخِلُ القُرْص",
        example: "Pop in the classic animated movie into the DVD player.",
      },
    ],
    sentences: [
      {
        context: "Movie Night",
        en: "He inserted a classic film disc into the DVD player and dimmed the living room lights.",
        ar: "أَدْخَلَ قُرْصَ فِيلْمٍ كِلاسِيكِيٍّ فِي مُشَغِّلِ الأَقْرَاصِ وَخَفَّضَ إِضَاءَةَ الغُرْفَةِ.",
      },
      {
        context: "Home Cinema",
        en: "Connect the high-definition DVD player to the receiver for surround audio.",
        ar: "صِلْ مُشَغِّلَ الأَقْرَاصِ بِجِهَازِ الاِسْتِقْبَالِ لِلْحُصُولِ عَلَى صَوْتٍ مُحِيطِيٍّ مُجَسَّمٍ.",
      },
      {
        context: "Preserving Classics",
        en: "They still use their reliable DVD player to watch family home video recordings.",
        ar: "لا يَزَالُونَ يَسْتَخْدِمُونَ مُشَغِّلَ الأَقْرَاصِ لِمُشَاهَدَةِ تَسْجِيلاتِ فِيدْيُو العَائِلَةِ القَدِيمَةِ.",
      },
    ],
    exampleSentence:
      "He inserted a classic film disc into the DVD player and dimmed the living room lights.",
    exampleArabic:
      "أَدْخَلَ قُرْصَ فِيلْمٍ كِلاسِيكِيٍّ فِي مُشَغِّلِ الأَقْرَاصِ وَخَفَّضَ إِضَاءَةَ الغُرْفَةِ.",
  },
  egg: {
    id: "egg",
    arabic: "بَيْضَة (بَيْض)",
    partOfSpeech: "noun",
    phonetic: "ɛɡ",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'leg' or 'beg'.",
    collocations: [
      "scrambled eggs",
      "boiled egg",
      "fried egg",
      "crack an egg",
      "carton of eggs",
      "fresh eggs",
    ],
    phrasalVerbs: [
      {
        phrase: "crack open",
        meaning: "break the shell of an egg",
        arabic: "يَكْسِرُ البَيْضَة",
        example: "Crack open two large eggs into the mixing bowl.",
      },
      {
        phrase: "whip up",
        meaning: "beat eggs quickly",
        arabic: "يَخْفِقُ",
        example: "Whip up the eggs with a pinch of salt for a light omelet.",
      },
    ],
    sentences: [
      {
        context: "Breakfast Cooking",
        en: "He cracked two farm-fresh eggs into the hot buttered pan for sunny-side-up eggs.",
        ar: "كَسَرَ بَيْضَتَيْنِ طَازَجَتَيْنِ فِي المِقْلاةِ المَدْهُونَةِ بِالزُّبْدَةِ لِقَلْيِهِمَا.",
      },
      {
        context: "Baking Role",
        en: "Eggs provide structure, richness, and moisture to baked cakes and pastries.",
        ar: "يَمْنَحُ البَيْضُ القِوَامَ وَالغِنَى وَالرُّطُوبَةَ لِلْكَعْكِ وَالمَخْبُوزَاتِ.",
      },
      {
        context: "Healthy Eating",
        en: "Boiled eggs make a protein-packed, nutritious afternoon snack on the go.",
        ar: "يُعَدُّ البَيْضُ المَسْلُوقُ وَجْبَةً خَفِيفَةً مُغَذِّيَةً وَغَنِيَّةً بِالبْرُوتِينِ.",
      },
    ],
    exampleSentence:
      "He cracked two farm-fresh eggs into the hot buttered pan for sunny-side-up eggs.",
    exampleArabic:
      "كَسَرَ بَيْضَتَيْنِ طَازَجَتَيْنِ فِي المِقْلاةِ المَدْهُونَةِ بِالزُّبْدَةِ لِقَلْيِهِمَا.",
  },
  farmer: {
    id: "farmer",
    arabic: "مُزَارِع (فَلَّاح)",
    partOfSpeech: "noun",
    phonetic: "ˈfɑːr.mər",
    pronunciationTip: "Broad 'ar' vowel /ɑːr/ in first syllable (/ˈfɑːr.mər/).",
    collocations: [
      "local farmer",
      "organic farmer",
      "dairy farmer",
      "farmer's market",
      "hardworking farmer",
      "farmer in the field",
    ],
    phrasalVerbs: [
      {
        phrase: "work on",
        meaning: "cultivate the land continuously",
        arabic: "يَعْمَلُ فِي الأَرْض",
        example: "The dedicated farmer worked on the land from dawn to dusk.",
      },
    ],
    sentences: [
      {
        context: "Daily Dedication",
        en: "The hardworking farmer rises before sunrise every day to tend his crops and livestock.",
        ar: "يَسْتَيْقِظُ المُزَارِعُ المُجِدُّ قَبْلَ شُرُوقِ الشَّمْسِ لِرِعَايَةِ مَحَاصِيلِهِ وَحَيَوَانَاتِهِ.",
      },
      {
        context: "Local Market",
        en: "Local farmers sell fresh organic vegetables and artisanal cheeses at the weekend market.",
        ar: "يَبِيعُ المُزَارِعُونَ المَحَلِّيُّونَ خُضْرَاوَاتٍ عُضْوِيَّةً طَازَجَةً فِي سُوقِ عُطْلَةِ الأُسْبُوعِ.",
      },
      {
        context: "Agricultural Expertise",
        en: "Generations of knowledge help the farmer read soil health, rainfall, and seasonal weather patterns.",
        ar: "تُمَكِّنُ الخِبْرَةُ المُتَوَارَثَةُ الفَلَّاحَ مِنْ مَعْرِفَةِ خُصُوبَةِ التُّرْبَةِ وَمَوَاعِيدِ الأَمْطَارِ.",
      },
    ],
    exampleSentence:
      "The hardworking farmer rises before sunrise every day to tend his crops and livestock.",
    exampleArabic:
      "يَسْتَيْقِظُ المُزَارِعُ المُجِدُّ قَبْلَ شُرُوقِ الشَّمْسِ لِرِعَايَةِ مَحَاصِيلِهِ وَحَيَوَانَاتِهِ.",
  },
  farmhouse: {
    id: "farmhouse",
    arabic: "بَيْتُ المَزْرَعَة (مَنْزِلٌ رِيفِيّ)",
    partOfSpeech: "noun",
    phonetic: "ˈfɑːrm.haʊs",
    pronunciationTip: "Compound noun: 'FARM' (/fɑːrm/) + 'HOUSE' (/haʊs/).",
    collocations: [
      "historic farmhouse",
      "cozy farmhouse",
      "farmhouse porch",
      "farmhouse kitchen",
      "white farmhouse",
      "brick farmhouse",
    ],
    phrasalVerbs: [
      {
        phrase: "live in",
        meaning: "reside in a country farmhouse",
        arabic: "يَعِيشُ فِي بَيْتِ المَزْرَعَة",
        example: "Three generations of farmers lived in the stone farmhouse.",
      },
    ],
    sentences: [
      {
        context: "Rural Home",
        en: "Smoke drifted gently from the chimney of the cozy two-story white farmhouse.",
        ar: "تَصَاعَدَ الدُّخَانُ بِرِفْقٍ مِنْ مَدْخَنَةِ بَيْتِ المَزْرَعَةِ الأَبْيَضِ المُؤَلَّفِ مِنْ طَابَقَيْنِ.",
      },
      {
        context: "Country Kitchen",
        en: "The spacious farmhouse kitchen features a large rustic table and stone hearth.",
        ar: "يَتَمَيَّزُ مَطْبَخُ البَيْتِ الرِّيفِيِّ بِطَاوِلَةٍ رِيفِيَّةٍ ضَخْمَةٍ وَمَوْقِدٍ حَجَرِيٍّ دَافِئٍ.",
      },
      {
        context: "Porch View",
        en: "From the welcoming front porch of the farmhouse, one can overlook rolling wheat fields.",
        ar: "مِنْ شُرْفَةِ بَيْتِ المَزْرَعَةِ الرَّئِيسِيَّةِ، يُمْكِنُكَ الإِطْلالُ عَلَى حُقُولِ القَمْحِ المُمْتَدَّةِ.",
      },
    ],
    exampleSentence: "Smoke drifted gently from the chimney of the cozy two-story white farmhouse.",
    exampleArabic:
      "تَصَاعَدَ الدُّخَانُ بِرِفْقٍ مِنْ مَدْخَنَةِ بَيْتِ المَزْرَعَةِ الأَبْيَضِ المُؤَلَّفِ مِنْ طَابَقَيْنِ.",
  },
  fence: {
    id: "fence",
    arabic: "سِيَاج (سُور)",
    partOfSpeech: "noun",
    phonetic: "fɛns",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'pen', ending in soft 's' sound.",
    collocations: [
      "wooden fence",
      "white picket fence",
      "wire fence",
      "build a fence",
      "fence around the pasture",
      "jump the fence",
    ],
    phrasalVerbs: [
      {
        phrase: "fence in",
        meaning: "enclose an area with a fence",
        arabic: "يُحِيطُ بِسِيَاج",
        example: "The farmer fenced in the north pasture to keep the sheep safe.",
      },
      {
        phrase: "mend",
        meaning: "repair broken fence sections",
        arabic: "يُصْلِحُ السِّيَاج",
        example: "He spent Saturday mending broken fence rails along the road.",
      },
    ],
    sentences: [
      {
        context: "Pasture Boundary",
        en: "A sturdy wooden split-rail fence encircles the entire thirty-acre horse pasture.",
        ar: "يُحِيطُ سِيَاجٌ خَشَبِيٌّ مَتِينٌ بِمَرْعَى الخُيُولِ المُتَمَدِّدِ عَلَى 30 فَدَّاناً.",
      },
      {
        context: "Cottage Charm",
        en: "A classic white picket fence and flowering roses frame the front garden.",
        ar: "يُؤَطِّرُ سِيَاجٌ أَبْيَضُ أَنِيقٌ مَعَ زُهُورِ الجُورِي حَدِيقَةَ المَنْزِلِ الأَمَامِيَّةَ.",
      },
      {
        context: "Security",
        en: "Regularly inspect the perimeter wire fence to prevent livestock from wandering onto roads.",
        ar: "افْحَصِ السِّيَاجَ السِّلْكِيَّ بِانْتِظَامٍ لِمَنْعِ خُرُوجِ المَاشِيَةِ إِلَى الطَّرِيقِ.",
      },
    ],
    exampleSentence:
      "A sturdy wooden split-rail fence encircles the entire thirty-acre horse pasture.",
    exampleArabic:
      "يُحِيطُ سِيَاجٌ خَشَبِيٌّ مَتِينٌ بِمَرْعَى الخُيُولِ المُتَمَدِّدِ عَلَى 30 فَدَّاناً.",
  },
  "floor-lamp": {
    id: "floor-lamp",
    arabic: "مِصْبَاحٌ أَرْضِيّ (أَبَاجُورَةٌ طَوِيلَة / أَبَاجُورَةُ أَرْضِيَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈflɔːr ˌlæmp",
    pronunciationTip: "Compound noun: 'FLOOR' (/flɔːr/) + 'LAMP' (/læmp/).",
    collocations: [
      "standing floor lamp",
      "arc floor lamp",
      "turn on the floor lamp",
      "dimmable floor lamp",
      "modern floor lamp",
      "corner floor lamp",
    ],
    phrasalVerbs: [
      {
        phrase: "turn on",
        meaning: "power on floor lamp",
        arabic: "يُشْعِلُ المِصْبَاحَ الأَرْضِيّ",
        example: "Turn on the floor lamp to illuminate the dark reading corner.",
      },
      {
        phrase: "dim down",
        meaning: "lower floor lamp light level",
        arabic: "يُخَفِّفُ الإِضَاءَة",
        example: "Dim down the floor lamp for a relaxing evening ambiance.",
      },
    ],
    sentences: [
      {
        context: "Living Room Lighting",
        en: "A graceful arched floor lamp stands behind the sofa, casting light over the coffee table.",
        ar: "يَقِفُ مِصْبَاحٌ أَرْضِيٌّ مُنْحَنٍ أَنِيقٌ خَلْفَ الأَرِيكَةِ لِيُضِيءَ طَاوِلَةَ القَهْوَةِ.",
      },
      {
        context: "Reading Corner",
        en: "The adjustable standing floor lamp provides glare-free light for evening book reading.",
        ar: "يُوَفِّرُ المِصْبَاحُ الأَرْضِيُّ القَابِلُ لِلتَّعْدِيلِ إِضَاءَةً مُمَيَّزَةً لِقِرَاءَةِ الكُتُبِ.",
      },
      {
        context: "Interior Ambiance",
        en: "Pairing a floor lamp with table lamps creates layered, welcoming living room illumination.",
        ar: "يَخْلُقُ تَنْسِيقُ المِصْبَاحِ الأَرْضِيِّ مَعَ مَصَابِيحِ الطَّاوِلَةِ إِضَاءَةً دَافِئَةً مُتَعَدِّدَةَ المُسْتَوَيَاتِ.",
      },
    ],
    exampleSentence:
      "A graceful arched floor lamp stands behind the sofa, casting light over the coffee table.",
    exampleArabic:
      "يَقِفُ مِصْبَاحٌ أَرْضِيٌّ مُنْحَنٍ أَنِيقٌ خَلْفَ الأَرِيكَةِ لِيُضِيءَ طَاوِلَةَ القَهْوَةِ.",
  },
  flour: {
    id: "flour",
    arabic: "طَحِين (دَقِيق)",
    partOfSpeech: "noun",
    phonetic: "flaʊ.ər",
    pronunciationTip: "Pronounced identically to the word 'flower' (/flaʊ.ər/).",
    collocations: [
      "all-purpose flour",
      "cup of flour",
      "sift the flour",
      "bread flour",
      "whole wheat flour",
      "flour the counter",
    ],
    phrasalVerbs: [
      {
        phrase: "sift in",
        meaning: "strain flour to aerate and remove lumps",
        arabic: "يَنْخُلُ الطَّحِينَ",
        example: "Sift in the flour and baking powder together into the batter.",
      },
      {
        phrase: "dust with",
        meaning: "sprinkle flour over work surface",
        arabic: "يَرُشُّ بِالطَّحِين",
        example: "Dust the marble counter with flour before kneading the dough.",
      },
    ],
    sentences: [
      {
        context: "Baking Bread",
        en: "High-protein unbleached bread flour gives the sourdough loaf a chewy texture.",
        ar: "يَمْنَحُ طَحِينُ الخُبْزِ عَالِي البْرُوتِينِ رَغِيفَ الخُبْزِ قِوَاماً مَرِناً وَمُمَيَّزاً.",
      },
      {
        context: "Cake Prep",
        en: "Sift two cups of fine cake flour to ensure a light and tender crumb.",
        ar: "انْخُلْ كُوبَيْنِ مِنْ طَحِينِ الكَعْكِ النَّاعِمِ لِضَمَانِ قِوَامٍ خَفِيفٍ وَهَشٍّ.",
      },
      {
        context: "Thickening Sauces",
        en: "Whisk two tablespoons of all-purpose flour into melted butter to thicken the stew.",
        ar: "اخْفِقْ مِلْعَقَتَيْنِ مِنْ الطَّحِينِ فِي الزُّبْدَةِ المُذَابَةِ لِتَكْثِيفِ قِوَامِ اليَخْنَةِ.",
      },
    ],
    exampleSentence:
      "High-protein unbleached bread flour gives the sourdough loaf a chewy texture.",
    exampleArabic:
      "يَمْنَحُ طَحِينُ الخُبْزِ عَالِي البْرُوتِينِ رَغِيفَ الخُبْزِ قِوَاماً مَرِناً وَمُمَيَّزاً.",
  },
  "food-container": {
    id: "food-container",
    arabic: "حَافِظَةُ طَعَام (عُلْبَةُ ثَلَّاجَة)",
    partOfSpeech: "noun",
    phonetic: "ˈfuːd kənˌteɪ.nər",
    pronunciationTip: "Compound noun: 'FOOD' (/fuːd/) + 'CONTAINER' (/kənˈteɪ.nər/).",
    collocations: [
      "airtight food container",
      "glass food container",
      "plastic food container",
      "meal prep container",
      "leak-proof container",
      "stackable container",
    ],
    phrasalVerbs: [
      {
        phrase: "pack away",
        meaning: "store leftovers in food containers",
        arabic: "يَحْفَظُ فِي الحَافِظَات",
        example: "Pack away the leftover dinner into glass food containers.",
      },
      {
        phrase: "snap shut",
        meaning: "secure a container lid tightly",
        arabic: "يُقْفِلُ بِإِحْكَام",
        example: "Snap shut the four locking tabs on the food container.",
      },
    ],
    sentences: [
      {
        context: "Meal Prep",
        en: "He packed five balanced lunches into glass food containers for the work week.",
        ar: "حَضَّرَ خَمْسَ وَجَبَاتِ غَدَاءٍ مُتَوَازِنَةٍ فِي حَافِظَاتِ طَعَامٍ زُجَاجِيَّةٍ لِأُسْبُوعِ العَمَلِ.",
      },
      {
        context: "Leak Prevention",
        en: "A leak-proof silicone seal ensures your food container won't spill in your bag.",
        ar: "يَضْمَنُ خَتْمُ السِّيلِيكُون المَانِعُ لِلتَّسَرُّبِ عَدَمَ انْسِكَابِ الطَّعَامِ فِي حَقِيبَتِكَ.",
      },
      {
        context: "Storage Efficiency",
        en: "Stackable rectangular food containers maximize available shelf space in the fridge.",
        ar: "تُسَاعِدُ حَافِظَاتُ الطَّعَامِ المُسْتَطِيلَةُ القَابِلَةُ لِلرَّصِّ فِي تَوْفِيرِ مَسَاحَةِ الثَّلَّاجَةِ.",
      },
    ],
    exampleSentence:
      "He packed five balanced lunches into glass food containers for the work week.",
    exampleArabic:
      "حَضَّرَ خَمْسَ وَجَبَاتِ غَدَاءٍ مُتَوَازِنَةٍ فِي حَافِظَاتِ طَعَامٍ زُجَاجِيَّةٍ لِأُسْبُوعِ العَمَلِ.",
  },
  fork: {
    id: "fork",
    arabic: "شَوْكَة",
    partOfSpeech: "noun",
    phonetic: "fɔːrk",
    pronunciationTip: "Rhymes with 'cork', 'pork', and 'park'.",
    collocations: [
      "dinner fork",
      "knife and fork",
      "dessert fork",
      "salad fork",
      "pick up with a fork",
      "stainless steel fork",
    ],
    phrasalVerbs: [
      {
        phrase: "pick at",
        meaning: "eat small amounts without appetite using a fork",
        arabic: "يَنْقُرُ فِي الطَّعَام",
        example: "He picked at his food with his fork.",
      },
    ],
    sentences: [
      {
        context: "Dining Table",
        en: "Place the dinner fork to the left of the plate according to formal etiquette.",
        ar: "ضَعْ شَوْكَةَ الطَّعَامِ إِلَى يَسَارِ الطَّبَقِ وِفْقاً لِقَوَاعِدِ الإِتِيكِيت.",
      },
      {
        context: "Eating",
        en: "She twirled the spaghetti around her fork before taking a bite.",
        ar: "لَفَّتِ المَعْكَرُونَةَ الإِسْبَاغِيتِي حَوْلَ شَوْكَتِهَا قَبْلَ تَنَاوُلِ اللُّقْمَةِ.",
      },
      {
        context: "Baking Prep",
        en: "Prick the bottom of the pie crust with a fork to prevent air bubbles.",
        ar: "اثْقُبْ قَاعِدَةَ الفَطِيرَةِ بِالشَّوْكَةِ لِمَنْعِ تَكَوُّنِ فَقَاعَاتِ الهَوَاءِ.",
      },
    ],
    exampleSentence:
      "Place the dinner fork to the left of the plate according to formal etiquette.",
    exampleArabic:
      "ضَعْ شَوْكَةَ الطَّعَامِ إِلَى يَسَارِ الطَّبَقِ وِفْقاً لِقَوَاعِدِ الإِتِيكِيت.",
  },
  freezer: {
    id: "freezer",
    arabic: "مُجَمِّد (فِرِيزَر)",
    partOfSpeech: "noun",
    phonetic: "ˈfriː.zər",
    pronunciationTip: "Long 'ee' vowel /iː/ followed by voiced 'z' (/zər/).",
    collocations: [
      "deep freezer",
      "keep in the freezer",
      "freeze in the freezer",
      "freezer bags",
      "ice in the freezer",
      "defrost the freezer",
    ],
    phrasalVerbs: [
      {
        phrase: "freeze up",
        meaning: "become solid through freezing",
        arabic: "يَتَجَمَّدُ",
        example: "The homemade stock froze up into solid ice blocks.",
      },
      {
        phrase: "thaw out",
        meaning: "defrost frozen items",
        arabic: "يُذِيبُ التَّجْمِيد",
        example: "Take the chicken out of the freezer to thaw out before cooking.",
      },
    ],
    sentences: [
      {
        context: "Food Preservation",
        en: "Store homemade soup and tomato sauce in airtight containers in the freezer.",
        ar: "احْفَظِ الحَسَاءَ المَنْزِلِيَّ وَصَلْصَةَ الطَّمَاطِمِ فِي أَوْعِيَةٍ مُحْكَمَةٍ دَاخِلَ الفِرِيزَر.",
      },
      {
        context: "Cool Treats",
        en: "There is always a tub of creamy vanilla ice cream stored in the top freezer drawer.",
        ar: "تُوجَدُ دَائِماً عُلْبَةُ آيْس كْرِيم بِالفَانِيلْيَا فِي الدُّرْجِ العُلْوِيِّ لِلْمُجَمِّدِ.",
      },
      {
        context: "Meal Prep",
        en: "Freezing fresh berries allows you to enjoy smoothies all year round.",
        ar: "يُتِيحُ لَكَ تَجْمِيدُ التُّوتِ الطَّازَجِ الاِسْتِمْتَاعَ بِالعَصَائِرِ طَوَالَ العَامِ.",
      },
    ],
    exampleSentence: "Store homemade soup and tomato sauce in airtight containers in the freezer.",
    exampleArabic:
      "احْفَظِ الحَسَاءَ المَنْزِلِيَّ وَصَلْصَةَ الطَّمَاطِمِ فِي أَوْعِيَةٍ مُحْكَمَةٍ دَاخِلَ الفِرِيزَر.",
  },
  "frying-pan": {
    id: "frying-pan",
    arabic: "مِقْلَاةُ القَلْي (طَاسَةُ قَلْي)",
    partOfSpeech: "noun",
    phonetic: "ˈfraɪ.ɪŋ ˌpæn",
    pronunciationTip: "Compound noun: 'FRYING' (/ˈfraɪ.ɪŋ/) + 'PAN' (/pæn/).",
    collocations: [
      "non-stick frying pan",
      "sizzle in the frying pan",
      "heavy frying pan",
      "cast-iron frying pan",
      "heat the frying pan",
      "oil in the frying pan",
    ],
    phrasalVerbs: [
      {
        phrase: "fry up",
        meaning: "cook food by frying",
        arabic: "يَقْلِي",
        example: "He fried up some crispy bacon and eggs.",
      },
      {
        phrase: "flip over",
        meaning: "turn food over in a frying pan",
        arabic: "يَقْلِبُ عَلَى الوَجْهِ الآخَر",
        example: "Carefully flip over the pancake when bubbles appear.",
      },
    ],
    sentences: [
      {
        context: "Breakfast Prep",
        en: "He melted a knob of golden butter in the frying pan for the omelet.",
        ar: "أَذَابَ قِطْعَةً مِنْ الزُّبْدَةِ الذَّهَبِيَّةِ فِي مِقْلاةِ القَلْيِ لِإِعْدَادِ الأُومْلِيت.",
      },
      {
        context: "Cooking Fish",
        en: "Sear the salmon fillet skin-side down in a smoking hot frying pan.",
        ar: "قُمْ بِتَحْمِيرِ شَرِيحَةِ السَّلَمُونِ بِوَضْعِ الجِلْدِ لِأَسْفَلَ فِي مِقْلاةٍ سَاخِنَةٍ جِدّاً.",
      },
      {
        context: "Utensil Care",
        en: "Use wooden or silicone spatulas to avoid scratching the non-stick frying pan.",
        ar: "اسْتَخْدِمْ مَلاعِقَ خَشَبِيَّةً أَوْ سِيلِيكُون لِتَفَادِي خَدْشِ مِقْلاةِ القَلْيِ.",
      },
    ],
    exampleSentence: "He melted a knob of golden butter in the frying pan for the omelet.",
    exampleArabic:
      "أَذَابَ قِطْعَةً مِنْ الزُّبْدَةِ الذَّهَبِيَّةِ فِي مِقْلاةِ القَلْيِ لِإِعْدَادِ الأُومْلِيت.",
  },
  "game-console": {
    id: "game-console",
    arabic: "جِهَازُ أَلْعَابِ فِيدْيُو (بْلَايْ سْتِيشِن / كُونْسُول)",
    partOfSpeech: "noun",
    phonetic: "ˈɡeɪm kənˌsoʊl",
    pronunciationTip: "Compound noun: 'GAME' (/ɡeɪm/) + 'CONSOLE' (/kənˈsoʊl/).",
    collocations: [
      "video game console",
      "play on a game console",
      "connect the game console",
      "game console controller",
      "latest game console",
      "multiplayer game console",
    ],
    phrasalVerbs: [
      {
        phrase: "hook up",
        meaning: "connect console to TV and power",
        arabic: "يَصِلُ الجِهَازَ بِالشَّاشَة",
        example: "Hook up the new game console to the HDMI port on the TV.",
      },
      {
        phrase: "turn off",
        meaning: "shut down console safely",
        arabic: "يُغْلِقُ الجِهَاز",
        example: "Save your game progress before turning off the console.",
      },
    ],
    sentences: [
      {
        context: "Gaming Fun",
        en: "The teenagers played a thrilling cooperative adventure game on the new game console.",
        ar: "لَعِبَ المُرَاهِقُونَ لُعْبَةَ مُغَامَرَاتٍ تَعَاوُنِيَّةً مُثِيرَةً عَلَى جِهَازِ الأَلْعَابِ الجَدِيدِ.",
      },
      {
        context: "Media Center Setup",
        en: "The game console sits neatly inside the ventilated compartment of the TV stand.",
        ar: "يَسْتَقِرُّ جِهَازُ الأَلْعَابِ فِي القِسْمِ جَيِّدِ التَّهْوِيَةِ دَاخِلَ طَاوِلَةِ التِّلْفَازِ.",
      },
      {
        context: "Controllers",
        en: "Remember to place wireless game controllers on their charging dock after playing.",
        ar: "تَذَكَّرْ وَضْعَ أَيْدِي التَّحَكُّمِ اللّاسِلْكِيَّةِ فِي قَاعِدَةِ الشَّحْنِ بَعْدَ اللَّعِبِ.",
      },
    ],
    exampleSentence:
      "The teenagers played a thrilling cooperative adventure game on the new game console.",
    exampleArabic:
      "لَعِبَ المُرَاهِقُونَ لُعْبَةَ مُغَامَرَاتٍ تَعَاوُنِيَّةً مُثِيرَةً عَلَى جِهَازِ الأَلْعَابِ الجَدِيدِ.",
  },
  glass: {
    id: "glass",
    arabic: "كَأْسُ زُجَاج (كُوبُ مَاء)",
    partOfSpeech: "noun",
    phonetic: "ɡlæs",
    pronunciationTip:
      "Short 'a' vowel /æ/ in American English, broad 'ah' /ɑː/ in British English.",
    collocations: [
      "glass of water",
      "drinking glass",
      "tall glass",
      "fill the glass",
      "crystal glass",
      "shatter the glass",
    ],
    phrasalVerbs: [
      {
        phrase: "fill up",
        meaning: "pour liquid into a glass until full",
        arabic: "يَمْلَأُ الكَأْس",
        example: "Fill up the glass with ice cubes and sparkling mineral water.",
      },
      {
        phrase: "drink down",
        meaning: "finish the drink in a glass",
        arabic: "يَشْرَبُ حَتَّى القَاع",
        example: "He drank down the entire glass of fresh orange juice.",
      },
    ],
    sentences: [
      {
        context: "Hydration",
        en: "Doctors recommend drinking a tall glass of fresh water upon waking up.",
        ar: "يُوصِي الأَطِبَّاءُ بِشُرْبِ كَأْسٍ كَبِيرٍ مِنَ المَاءِ النَّقِيِّ عِنْدَ الاِسْتِيقَاظِ.",
      },
      {
        context: "Dining Setup",
        en: "Set a water glass above the dinner knife on the right side of the placemat.",
        ar: "ضَعْ كَأْسَ المَاءِ فَوْقَ سِكِّينِ الطَّعَامِ عَلَى الجَانِبِ الأَيْمَنِ لِمَفْرَشِ الطَّاوِلَةِ.",
      },
      {
        context: "Safety",
        en: "Be careful when handling thin glassware to prevent chipping the delicate rim.",
        ar: "احْرِصْ عِنْدَ التَّعَامُلِ مَعَ الأَوَانِي الزُّجَاجِيَّةِ الرَّقِيقَةِ لِمَنْعِ كَسْرِ الحَافَّةِ.",
      },
    ],
    exampleSentence: "Doctors recommend drinking a tall glass of fresh water upon waking up.",
    exampleArabic:
      "يُوصِي الأَطِبَّاءُ بِشُرْبِ كَأْسٍ كَبِيرٍ مِنَ المَاءِ النَّقِيِّ عِنْدَ الاِسْتِيقَاظِ.",
  },
  glasses: {
    id: "glasses",
    arabic: "نَظَّارَات (نَظَّارَة)",
    partOfSpeech: "noun",
    phonetic: "ˈɡlæs.ɪz",
    pronunciationTip:
      "Short 'a' vowel in American English (/ɡlæs/), ending in /ɪz/. Always plural.",
    collocations: [
      "reading glasses",
      "wear glasses",
      "put on glasses",
      "clean your glasses",
      "prescription glasses",
      "pair of glasses",
    ],
    phrasalVerbs: [
      {
        phrase: "put on",
        meaning: "wear glasses on your face",
        arabic: "يَرْتَدِي النَّظَّارَة",
        example: "He put on his reading glasses to inspect the fine print.",
      },
      {
        phrase: "take off",
        meaning: "remove glasses",
        arabic: "يَخْلَعُ النَّظَّارَة",
        example: "She took off her glasses and rubbed her tired eyes.",
      },
    ],
    sentences: [
      {
        context: "Reading",
        en: "He cannot read small text clearly without his prescription reading glasses.",
        ar: "لا يَسْتَطِيعُ قِرَاءَةَ النُّصُوصِ الصَّغِيرَةِ بِوُضُوحٍ دُونَ نَظَّارَةِ القِرَاءَةِ الطِّبِّيَّةِ.",
      },
      {
        context: "Care & Maintenance",
        en: "Use a soft microfiber cloth to clean smudges from your glasses lenses.",
        ar: "اسْتَخْدِمْ قِطْعَةَ قُمَاشٍ نَاعِمَةً لِمَسْحِ البُقَعِ عَنْ عَدَسَاتِ نَظَّارَتِكَ.",
      },
      {
        context: "Bedside Habit",
        en: "She always places her glasses safely inside a hard case on the nightstand.",
        ar: "تَضَعُ نَظَّارَتَهَا دَائِماً دَاخِلَ عُلْبَةٍ صَلْبَةٍ عَلَى طَاوِلَةِ السَّرِيرِ قَبْلَ النَّوْمِ.",
      },
    ],
    exampleSentence: "He cannot read small text clearly without his prescription reading glasses.",
    exampleArabic:
      "لا يَسْتَطِيعُ قِرَاءَةَ النُّصُوصِ الصَّغِيرَةِ بِوُضُوحٍ دُونَ نَظَّارَةِ القِرَاءَةِ الطِّبِّيَّةِ.",
  },
  goat: {
    id: "goat",
    arabic: "مَاعِز (عَنْزَة)",
    partOfSpeech: "noun",
    phonetic: "ɡoʊt",
    pronunciationTip: "Long 'o' vowel /oʊ/ as in 'boat' or 'coat'.",
    collocations: [
      "goat cheese",
      "goat milk",
      "herd of goats",
      "curious goat",
      "mountain goat",
      "horns of a goat",
    ],
    phrasalVerbs: [
      {
        phrase: "butt in",
        meaning: "interrupt (like a goat using horns)",
        arabic: "يَتَدَخَّلُ بِفُضُول",
        example: "Please don't butt into our conversation.",
      },
    ],
    sentences: [
      {
        context: "Farm Dairy",
        en: "Fresh goat milk is crafted into delicious, tangy artisan cheeses.",
        ar: "يُسْتَخْدَمُ حَلِيبُ المَاعِزِ الطَّازَجُ فِي صِنَاعَةِ أَجْبَانٍ شَهِيَّةٍ وَمُمَيَّزَةٍ.",
      },
      {
        context: "Playful Nature",
        en: "The playful young goats leaped playfully onto wooden bales of straw.",
        ar: "قَفَزَتْ صِغَارُ المَاعِزِ بِمَرَحٍ فَوْقَ بَالاتِ القَشِّ الخَشَبِيَّةِ فِي المَزْرَعَةِ.",
      },
      {
        context: "Agility",
        en: "Goats are remarkably sure-footed and can easily climb steep rocky hillsides.",
        ar: "يَتَمَيَّزُ المَاعِزُ بِثَبَاتِ خُطُوَاتِهِ وَقُدْرَتِهِ الفَائِقَةِ عَلَى تَسَلُّقِ المُنْحَدَرَاتِ الصَّخْرِيَّةِ.",
      },
    ],
    exampleSentence: "Fresh goat milk is crafted into delicious, tangy artisan cheeses.",
    exampleArabic:
      "يُسْتَخْدَمُ حَلِيبُ المَاعِزِ الطَّازَجُ فِي صِنَاعَةِ أَجْبَانٍ شَهِيَّةٍ وَمُمَيَّزَةٍ.",
  },
  goose: {
    id: "goose",
    arabic: "إِوَزَّة (إِوَزّ)",
    partOfSpeech: "noun",
    phonetic: "ɡuːs",
    pronunciationTip: "Long 'oo' vowel /uː/. Plural is 'geese' (/ɡiːs/).",
    collocations: [
      "flock of geese",
      "honking goose",
      "white goose",
      "goose feathers",
      "guard goose",
      "goose down",
    ],
    phrasalVerbs: [
      {
        phrase: "fly south",
        meaning: "migrate during autumn in V-formation",
        arabic: "يُهَاجِرُ جَنُوباً",
        example: "Flocks of Canada geese fly south for the winter.",
      },
    ],
    sentences: [
      {
        context: "Farm Sentry",
        en: "The vocal white goose honked loudly whenever unfamiliar visitors arrived at the gate.",
        ar: "صَاحَتِ الإِوَزَّةُ البَيْضَاءُ بِصَوْتٍ عَالٍ كُلَّمَا وَصَلَ زُوَّارٌ جُدُدٌ إِلَى البَوَّابَةِ.",
      },
      {
        context: "Migration",
        en: "A majestic V-formation of wild geese soared high across the crisp autumn sky.",
        ar: "حَلَّقَ سِرْبٌ بَدِيعٌ مِنَ الإِوَزِّ البَرِّيِّ عَلَى شَكْلِ حَرْفِ V فِي سَمَاءِ الخَرِيفِ.",
      },
      {
        context: "Soft Down",
        en: "High-quality winter parkas and pillows are insulated with ultra-soft goose down.",
        ar: "تُبَطَّنُ السُّتْرَاتُ الشَّتْوِيَّةُ الفَاخِرَةُ وَالوِسَادَاتُ بِزَغَبِ الإِوَزِّ النَّاعِمِ جِدّاً.",
      },
    ],
    exampleSentence:
      "The vocal white goose honked loudly whenever unfamiliar visitors arrived at the gate.",
    exampleArabic:
      "صَاحَتِ الإِوَزَّةُ البَيْضَاءُ بِصَوْتٍ عَالٍ كُلَّمَا وَصَلَ زُوَّارٌ جُدُدٌ إِلَى البَوَّابَةِ.",
  },
  grater: {
    id: "grater",
    arabic: "مِبْشَرَة",
    partOfSpeech: "noun",
    phonetic: "ˈɡreɪ.tər",
    pronunciationTip: "Long 'a' sound /eɪ/, exactly like the word 'greater'.",
    collocations: [
      "cheese grater",
      "box grater",
      "fine grater",
      "grate on a grater",
      "grate cheese",
      "stainless steel grater",
    ],
    phrasalVerbs: [
      {
        phrase: "grate up",
        meaning: "shred into small pieces",
        arabic: "يَبْشُرُ",
        example: "Grate up two cups of sharp cheddar for the macaroni.",
      },
    ],
    sentences: [
      {
        context: "Cheese Grating",
        en: "He grated a block of Parmesan cheese over the steaming bowl of pasta.",
        ar: "بَشَرَ قِطْعَةً مِنْ جُبْنِ البَارْمِيزَان فَوْقَ طَبَقِ المَعْكَرُونَةِ السَّاخِنِ.",
      },
      {
        context: "Baking Prep",
        en: "Use the fine side of the box grater to zest fresh orange and lemon peel.",
        ar: "اسْتَخْدِمِ الجَانِبَ النَّاعِمَ لِلْمِبْشَرَةِ لِبَشْرِ قِشْرِ البُرْتُقَالِ وَاللَّيْمُونِ.",
      },
      {
        context: "Salad Making",
        en: "Grate fresh carrots and cabbage on the coarse grater for homemade coleslaw.",
        ar: "ابْشُرِ الجَزَرَ وَالمَلْفُوفَ الطَّازَجَ عَلَى المِبْشَرَةِ الخَشِنَةِ لِإِعْدَادِ سَلَطَةِ الكُولْسْلُو.",
      },
    ],
    exampleSentence: "He grated a block of Parmesan cheese over the steaming bowl of pasta.",
    exampleArabic:
      "بَشَرَ قِطْعَةً مِنْ جُبْنِ البَارْمِيزَان فَوْقَ طَبَقِ المَعْكَرُونَةِ السَّاخِنِ.",
  },
  greenhouse: {
    id: "greenhouse",
    arabic: "صَوْبَةٌ زِرَاعِيَّة (بَيْتٌ زُجَاجِيّ / دَفِيئَة)",
    partOfSpeech: "noun",
    phonetic: "ˈɡriːn.haʊs",
    pronunciationTip: "Compound noun with primary stress on 'GREEN' (/ˈɡriːn.haʊs/).",
    collocations: [
      "glass greenhouse",
      "grow in a greenhouse",
      "warm greenhouse",
      "greenhouse tomatoes",
      "commercial greenhouse",
      "greenhouse temperature",
    ],
    phrasalVerbs: [
      {
        phrase: "grow in",
        meaning: "cultivate plants inside a greenhouse",
        arabic: "يَزْرَعُ فِي الصَّوْبَة",
        example: "They grow organic seedlings and herbs in the greenhouse all year.",
      },
    ],
    sentences: [
      {
        context: "Year-Round Growing",
        en: "Tomatoes, cucumbers, and tender herbs thrive inside the warm, sunny glass greenhouse.",
        ar: "تَزْدَهِرُ الطَّمَاطِمُ وَالخِيَارُ وَالأَعْشَابُ الرَّقِيقَةُ دَاخِلَ الصَّوْبَةِ الزُّجَاجِيَّةِ الدَّافِئَةِ.",
      },
      {
        context: "Seedling Starting",
        en: "In late February, the gardener starts pepper seeds in seedling trays in the greenhouse.",
        ar: "يَبْدَأُ البُسْتَانِيُّ زِرَاعَةَ بُذُورِ الفُلْفُلِ دَاخِلَ الصَّوْبَةِ فِي أَوَاخِرِ فِبْرَايِر.",
      },
      {
        context: "Climate Control",
        en: "Automatic roof vents open to regulate internal humidity and temperature.",
        ar: "تُفْتَحُ فَتَحَاتُ التَّهْوِيَةِ السَّقْفِيَّةُ تِلْقَائِيّاً لِضَبْطِ الرُّطُوبَةِ وَالحَرَارَةِ دَاخِلَ الدَّفِيئَةِ.",
      },
    ],
    exampleSentence:
      "Tomatoes, cucumbers, and tender herbs thrive inside the warm, sunny glass greenhouse.",
    exampleArabic:
      "تَزْدَهِرُ الطَّمَاطِمُ وَالخِيَارُ وَالأَعْشَابُ الرَّقِيقَةُ دَاخِلَ الصَّوْبَةِ الزُّجَاجِيَّةِ الدَّافِئَةِ.",
  },
  hanger: {
    id: "hanger",
    arabic: "شَمَّاعَةُ مَلابِس",
    partOfSpeech: "noun",
    phonetic: "ˈhæŋ.ər",
    pronunciationTip: "Soft 'ng' sound (/ŋ/) without a hard 'g' sound.",
    collocations: [
      "clothes hanger",
      "wooden hanger",
      "coat hanger",
      "hang on a hanger",
      "plastic hanger",
      "wardrobe hanger",
    ],
    phrasalVerbs: [
      {
        phrase: "hang up",
        meaning: "put clothes on a hanger in a closet",
        arabic: "يُعَلِّقُ المَلابِس",
        example: "Hang up your freshly ironed shirt on a wooden hanger.",
      },
      {
        phrase: "take off",
        meaning: "remove an item from a hanger",
        arabic: "يَنْزِعُ عَنِ الشَّمَّاعَة",
        example: "She took her favorite dress off the hanger.",
      },
    ],
    sentences: [
      {
        context: "Laundry Care",
        en: "Hang your jackets on sturdy wooden hangers to preserve their shoulder shape.",
        ar: "عَلِّقْ سُتْرَاتِكَ عَلَى شَمَّاعَاتٍ خَشَبِيَّةٍ مَتِينَةٍ لِلْحِفَاظِ عَلَى شَكْلِ الأَكْتَافِ.",
      },
      {
        context: "Closet Organization",
        en: "She bought a pack of non-slip velvet hangers for her silk blouses.",
        ar: "اشْتَرَتْ مَجْمُوعَةً مِنْ شَمَّاعَاتِ المَخْمَلِ المَانِعَةِ لِلاِنْزِلاقِ لِقُمْصَانِهَا الحَرِيرِيَّةِ.",
      },
      {
        context: "Wardrobe Tidiness",
        en: "Keep spare empty hangers neatly grouped at one side of the wardrobe.",
        ar: "احْتَفِظْ بِالشَّمَّاعَاتِ الفَارِغَةِ مُرَتَّبَةً فِي جَانِبٍ وَاحِدٍ مِنْ خِزَانَةِ المَلابِسِ.",
      },
    ],
    exampleSentence: "Hang your jackets on sturdy wooden hangers to preserve their shoulder shape.",
    exampleArabic:
      "عَلِّقْ سُتْرَاتِكَ عَلَى شَمَّاعَاتٍ خَشَبِيَّةٍ مَتِينَةٍ لِلْحِفَاظِ عَلَى شَكْلِ الأَكْتَافِ.",
  },
  harvest: {
    id: "harvest",
    arabic: "حَصَاد (مَوْسِمُ الحَصَاد)",
    partOfSpeech: "noun",
    phonetic: "ˈhɑːr.vɪst",
    pronunciationTip: "Two syllables: 'HAR-vest' (/ˈhɑːr.vɪst/).",
    collocations: [
      "bountiful harvest",
      "autumn harvest",
      "harvest season",
      "reap the harvest",
      "harvest celebration",
      "corn harvest",
    ],
    phrasalVerbs: [
      {
        phrase: "gather in",
        meaning: "collect harvested crops for winter storage",
        arabic: "يَجْمَعُ المَحْصُول",
        example: "They worked late into the night to gather in the wheat harvest.",
      },
    ],
    sentences: [
      {
        context: "Bountiful Season",
        en: "The community celebrated a bountiful autumn harvest with pumpkin pies and fresh apple cider.",
        ar: "احْتَفَلَ أَهْلُ القَرْيَةِ بِمَوْسِمِ الحَصَادِ الوَفِيرِ بِفَطَائِرِ اليَقْطِينِ وَعَصِيرِ التُّفَّاحِ.",
      },
      {
        context: "Combine Harvesting",
        en: "Giant combine harvesters rolled through the golden wheat fields from morning till night.",
        ar: "تَحَرَّكَتْ حَصَّادَاتُ القَمْحِ العِمْلاقَةُ عَبْرَ الحُقُولِ الذَّهَبِيَّةِ طَوَالَ النَّهَارِ.",
      },
      {
        context: "Fruit Picking",
        en: "Orchard workers hand-picked thousands of ripe red apples during the peak apple harvest.",
        ar: "قَطَفَ عُمَّالُ البَسَاتِينِ آلافَ التُّفَّاحِ الأَحْمَرِ النَّاضِجِ فِي ذِرْوَةِ مَوْسِمِ الحَصَادِ.",
      },
    ],
    exampleSentence:
      "The community celebrated a bountiful autumn harvest with pumpkin pies and fresh apple cider.",
    exampleArabic:
      "احْتَفَلَ أَهْلُ القَرْيَةِ بِمَوْسِمِ الحَصَادِ الوَفِيرِ بِفَطَائِرِ اليَقْطِينِ وَعَصِيرِ التُّفَّاحِ.",
  },
  hay: {
    id: "hay",
    arabic: "قَشّ / دْرِيس (عَلَفٌ مُجَفَّف)",
    partOfSpeech: "noun",
    phonetic: "heɪ",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'day' or 'say'.",
    collocations: [
      "bale of hay",
      "hay stack",
      "feed hay",
      "fresh hay",
      "sweet alfalfa hay",
      "hay loft",
    ],
    phrasalVerbs: [
      {
        phrase: "bale up",
        meaning: "compress dry grass into tight bales",
        arabic: "يَحْزِمُ القَشَّ فِي بَالات",
        example: "The baler baled up the cut grass into hundred-pound rectangular hay bales.",
      },
      {
        phrase: "hit the hay",
        meaning: "(idiom) go to bed for sleep",
        arabic: "يَذْهَبُ لِلنَّوْم",
        example: "I am exhausted after the harvest, so I'm going to hit the hay.",
      },
    ],
    sentences: [
      {
        context: "Livestock Feed",
        en: "The horses happily munched on sweet, fragrant alfalfa hay inside the warm barn.",
        ar: "تَنَاوَلَتِ الخُيُولُ بِسَعَادَةٍ دْرِيسَ البَرْسِيمِ الحِجَازِيِّ العَطِرَ فِي الحَظِيرَةِ.",
      },
      {
        context: "Summer Harvesting",
        en: "Farmers cut, sun-dry, and bale nutritious meadow hay during warm sunny July weeks.",
        ar: "يَقُومُ المُزَارِعُونَ بِحَصْدِ وَتَجْفِيفِ وَحَزْمِ قَشِّ المُرُوجِ فِي شَهْرِ يُولْيُو المُشْمِسِ.",
      },
      {
        context: "Storage",
        en: "Keep hay stacked tightly in dry, ventilated lofts to prevent dampness and mold.",
        ar: "احْفَظِ القَشَّ مَرْصُوصاً فِي أَمَاكِنَ جَافَّةٍ وَمُهَوَّاةٍ لِمَنْعِ العُفُونَةِ.",
      },
    ],
    exampleSentence:
      "The horses happily munched on sweet, fragrant alfalfa hay inside the warm barn.",
    exampleArabic:
      "تَنَاوَلَتِ الخُيُولُ بِسَعَادَةٍ دْرِيسَ البَرْسِيمِ الحِجَازِيِّ العَطِرَ فِي الحَظِيرَةِ.",
  },
  headboard: {
    id: "headboard",
    arabic: "خَلْفِيَّةُ السَّرِير (ظَهْرُ السَّرِير)",
    partOfSpeech: "noun",
    phonetic: "ˈhɛd.bɔːrd",
    pronunciationTip: "Compound word: 'HEAD' + 'BOARD'.",
    collocations: [
      "upholstered headboard",
      "wooden headboard",
      "padded headboard",
      "lean against the headboard",
      "tufted headboard",
      "bed headboard",
    ],
    phrasalVerbs: [
      {
        phrase: "lean on",
        meaning: "rest against the headboard while reading",
        arabic: "يَسْتَنِدُ عَلَى ظَهْرِ السَّرِير",
        example: "She propped a pillow to lean on the headboard while studying.",
      },
    ],
    sentences: [
      {
        context: "Bedtime Reading",
        en: "She leaned against the padded headboard to read her book comfortably.",
        ar: "اسْتَنَدَتْ إِلَى ظَهْرِ السَّرِيرِ المَحْشُوِّ لِتَقْرَأَ كِتَابَهَا بِكُلِّ رَاحَةٍ.",
      },
      {
        context: "Bedroom Decor",
        en: "A tall velvet tufted headboard serves as the room's main focal point.",
        ar: "تُعَدُّ خَلْفِيَّةُ السَّرِيرِ المَخْمَلِيَّةُ الطَّوِيلَةُ نُقْطَةَ الجَذْبِ الرَّئِيسِيَّةِ فِي الغُرْفَةِ.",
      },
      {
        context: "Installation",
        en: "The wooden headboard was securely bolted to the bed frame.",
        ar: "تَمَّ تَثْبِيتُ ظَهْرِ السَّرِيرِ الخَشَبِيِّ بِإِحْكَامٍ فِي هَيْكَلِ السَّرِيرِ.",
      },
    ],
    exampleSentence: "She leaned against the padded headboard to read her book comfortably.",
    exampleArabic:
      "اسْتَنَدَتْ إِلَى ظَهْرِ السَّرِيرِ المَحْشُوِّ لِتَقْرَأَ كِتَابَهَا بِكُلِّ رَاحَةٍ.",
  },
  headphones: {
    id: "headphones",
    arabic: "سَمَّاعَاتُ الرَّأْس (هَيْدْفُونْز)",
    partOfSpeech: "noun",
    phonetic: "ˈhɛd.foʊnz",
    pronunciationTip: "Compound noun: 'HEAD' + 'PHONES'. Always plural for over-ear units.",
    collocations: [
      "wear headphones",
      "wireless headphones",
      "noise-canceling headphones",
      "put on headphones",
      "listen with headphones",
      "take off headphones",
    ],
    phrasalVerbs: [
      {
        phrase: "put on",
        meaning: "place headphones over your ears",
        arabic: "يَرْتَدِي السَّمَّاعَات",
        example: "He put on his noise-canceling headphones to concentrate on work.",
      },
      {
        phrase: "take off",
        meaning: "remove headphones from head",
        arabic: "يَنْزِعُ السَّمَّاعَات",
        example: "She took off her headphones when her colleague spoke to her.",
      },
    ],
    sentences: [
      {
        context: "Studying & Focus",
        en: "He wore wireless headphones to listen to classical music while studying.",
        ar: "ارْتَدَى سَمَّاعَاتِ رَأْسٍ لاسِلْكِيَّةٍ لِلاِسْتِمَاعِ إِلَى المَسِيقَى الكِلاسِيكِيَّةِ أَثْنَاءَ الدِّرَاسَةِ.",
      },
      {
        context: "Travel",
        en: "Noise-canceling headphones make long airplane flights much more peaceful.",
        ar: "تَجْعَلُ سَمَّاعَاتُ الرَّأْسِ العَازِلَةُ لِلضَّوْضَاءِ رِحَلاتِ الطَّيَرَانِ الطَّوِيلَةَ أَكْثَرَ هُدُوءاً.",
      },
      {
        context: "Hearing Safety",
        en: "Keep the headphone volume at a moderate level to protect your hearing.",
        ar: "احْرِصْ عَلَى ضَبْطِ صَوْتِ السَّمَّاعَاتِ عِنْدَ مُسْتَوًى مُعْتَدِلٍ لِحِمَايَةِ سَمْعِكَ.",
      },
    ],
    exampleSentence: "He wore wireless headphones to listen to classical music while studying.",
    exampleArabic:
      "ارْتَدَى سَمَّاعَاتِ رَأْسٍ لاسِلْكِيَّةٍ لِلاِسْتِمَاعِ إِلَى المَسِيقَى الكِلاسِيكِيَّةِ أَثْنَاءَ الدِّرَاسَةِ.",
  },
  "hen-house": {
    id: "hen-house",
    arabic: "خُمُّ الدَّجَاج (قُنُّ الدَّجَاج)",
    partOfSpeech: "noun",
    phonetic: "ˈhɛn ˌhaʊs",
    pronunciationTip: "Compound noun: 'HEN' (/hɛn/) + 'HOUSE' (/haʊs/).",
    collocations: [
      "wooden hen house",
      "clean the hen house",
      "eggs in the hen house",
      "hen house perch",
      "lock the hen house",
      "backyard hen house",
    ],
    phrasalVerbs: [
      {
        phrase: "lock up",
        meaning: "secure hen house doors against predators",
        arabic: "يُقْفِلُ الخُمَّ لَيْلاً",
        example: "Always lock up the hen house at night to protect the chickens from foxes.",
      },
    ],
    sentences: [
      {
        context: "Daily Chores",
        en: "The girl checked the nesting boxes inside the wooden hen house for fresh morning eggs.",
        ar: "تَفَقَّدَتِ الفَتَاةُ صَنَادِيقَ الأَعْشَاشِ فِي خُمِّ الدَّجَاجِ لِجَمْعِ البَيْضِ الصَّبَاحِيِّ.",
      },
      {
        context: "Night Security",
        en: "The farmer securely latched the hen house door to keep out prowling night predators.",
        ar: "أَقْفَلَ المُزَارِعُ بَابَ خُمِّ الدَّجَاجِ بِإِحْكَامٍ لِحِمَايَةِ الطُّيُورِ مِنَ الثَّعَالِبِ.",
      },
      {
        context: "Cleaning",
        en: "Spread fresh dry sawdust and straw across the floor of the hen house weekly.",
        ar: "افْرِشْ نُشَارَةَ الخَشَبِ وَالقَشَّ النَّظِيفَ عَلَى أَرْضِيَّةِ خُمِّ الدَّجَاجِ أُسْبُوعِيّاً.",
      },
    ],
    exampleSentence:
      "The girl checked the nesting boxes inside the wooden hen house for fresh morning eggs.",
    exampleArabic:
      "تَفَقَّدَتِ الفَتَاةُ صَنَادِيقَ الأَعْشَاشِ فِي خُمِّ الدَّجَاجِ لِجَمْعِ البَيْضِ الصَّبَاحِيِّ.",
  },
  hoe: {
    id: "hoe",
    arabic: "مِسْحَاة (فَأْسٌ زِرَاعِيَّة / مِعْزَقَة)",
    partOfSpeech: "noun",
    phonetic: "hoʊ",
    pronunciationTip: "Long 'o' vowel /oʊ/ as in 'toe' or 'go'.",
    collocations: [
      "garden hoe",
      "weed with a hoe",
      "draw hoe",
      "sharp hoe",
      "hoe between rows",
      "metal hoe blade",
    ],
    phrasalVerbs: [
      {
        phrase: "chop down",
        meaning: "sever weed roots with a hoe",
        arabic: "يَعْزِقُ الحَشَائِش",
        example: "Chop down stubborn weeds between the tomato rows with a sharp hoe.",
      },
    ],
    sentences: [
      {
        context: "Weeding Crops",
        en: "She used a sharp garden hoe to clear unwanted weeds between the vegetable rows.",
        ar: "اسْتَخْدَمَتْ مِعْزَقَةَ حَدِيقَةٍ حَادَّةً لِإِزَالَةِ الحَشَائِشِ الضَّارَّةِ بَيْنَ صُفُوفِ الخُضَارِ.",
      },
      {
        context: "Soil Loosening",
        en: "Hoeing the topsoil prevents weed germination and aerates the root zone.",
        ar: "يَمْنَعُ عَزْقُ التُّرْبَةِ السَّطْحِيَّةِ نُمُوَّ الحَشَائِشِ وَيُهَوِّي جُذُورَ النَّبَاتَاتِ.",
      },
      {
        context: "Making Furrows",
        en: "Use the corner of the hoe blade to draw straight furrows for planting carrot seeds.",
        ar: "اسْتَخْدِمْ طَرَفَ شَفْرَةِ الفَأْسِ لِرَسْمِ خُطُوطٍ مُسْتَقِيمَةٍ لِبَذْرِ الجَزَرِ.",
      },
    ],
    exampleSentence:
      "She used a sharp garden hoe to clear unwanted weeds between the vegetable rows.",
    exampleArabic:
      "اسْتَخْدَمَتْ مِعْزَقَةَ حَدِيقَةٍ حَادَّةً لِإِزَالَةِ الحَشَائِشِ الضَّارَّةِ بَيْنَ صُفُوفِ الخُضَارِ.",
  },
  honey: {
    id: "honey",
    arabic: "عَسَل (عَسَلُ نَحْل)",
    partOfSpeech: "noun",
    phonetic: "ˈhʌn.i",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'love' or 'money'.",
    collocations: [
      "raw honey",
      "spoonful of honey",
      "jar of honey",
      "drizzle honey",
      "pure honey",
      "honeycomb",
    ],
    phrasalVerbs: [
      {
        phrase: "drizzle over",
        meaning: "pour thin stream of honey over food",
        arabic: "يَسْكُبُ خَيْطاً مِنَ العَسَل",
        example: "Drizzle pure honey over warm Greek yogurt and walnuts.",
      },
    ],
    sentences: [
      {
        context: "Sweetening Drinks",
        en: "She stirred a golden spoonful of raw wildflower honey into her chamomile tea.",
        ar: "قَلَّبَتْ مِلْعَقَةً ذَهَبِيَّةً مِنْ عَسَلِ الزُّهُورِ البَرِّيَّةِ النَّقِيِّ فِي شَايِ البَابُونِجِ.",
      },
      {
        context: "Breakfast Topping",
        en: "Drizzle amber honey over a warm bowl of morning oatmeal and sliced almonds.",
        ar: "اسْكُبْ خُيُوطاً مِنْ العَسَلِ الصَّافِي فَوْقَ الشُّوفَانِ الصَّبَاحِيِّ السَّاخِنِ وَاللَّوْزِ.",
      },
      {
        context: "Baking & Glazing",
        en: "A honey-mustard glaze gives roasted chicken wings a caramelized golden crust.",
        ar: "يَمْنَحُ تَغْلِيفُ العَسَلِ وَالخَرْدَلِ أَجْنِحَةَ الدَّجَاجِ المَشْوِيَّةِ قِشْرَةً مُكَرْمَلَةً شَهِيَّةً.",
      },
    ],
    exampleSentence:
      "She stirred a golden spoonful of raw wildflower honey into her chamomile tea.",
    exampleArabic:
      "قَلَّبَتْ مِلْعَقَةً ذَهَبِيَّةً مِنْ عَسَلِ الزُّهُورِ البَرِّيَّةِ النَّقِيِّ فِي شَايِ البَابُونِجِ.",
  },
  horse: {
    id: "horse",
    arabic: "حِصَان (خَيْل)",
    partOfSpeech: "noun",
    phonetic: "hɔːrs",
    pronunciationTip: "Broad 'or' sound /ɔːr/ as in 'door' or 'force'.",
    collocations: [
      "ride a horse",
      "gallop of a horse",
      "horse stable",
      "brush the horse",
      "wild horse",
      "saddle a horse",
    ],
    phrasalVerbs: [
      {
        phrase: "horse around",
        meaning: "(idiom) play roughly or foolishly",
        arabic: "يَمْزَحُ بِخُشُونَة",
        example: "Stop horsing around in the living room before you break the vase.",
      },
      {
        phrase: "saddle up",
        meaning: "put a saddle on a horse for riding",
        arabic: "يُسْرِجُ الخَيْل",
        example: "They saddled up their horses for an early morning trail ride.",
      },
    ],
    sentences: [
      {
        context: "Horseback Riding",
        en: "She rode her chestnut horse along the scenic forest trail at dawn.",
        ar: "رَكِبَتْ حِصَانَهَا الكَسْتَنَائِيَّ عَلَى طُولِ مَسَارِ الغَابَةِ الخَلابِ عِنْدَ الفَجْرِ.",
      },
      {
        context: "Stable Care",
        en: "The groom brushed the horse's glossy coat and cleaned its hooves thoroughly.",
        ar: "نَظَّفَ السَّائِسُ فَرْوَةَ الحِصَانِ اللّامِعَةَ وَعَقَّمَ حَوَافِرَهُ بِعِنَايَةٍ.",
      },
      {
        context: "Power & Grace",
        en: "The magnificent black stallion galloped effortlessly across the open pasture.",
        ar: "رَكَضَ الفَحْلُ الأَسْوَدُ البَدِيعُ بِسُرْعَةٍ وَرَشَاقَةٍ عَبْرَ المَرْعَى المَفْتُوحِ.",
      },
    ],
    exampleSentence: "She rode her chestnut horse along the scenic forest trail at dawn.",
    exampleArabic:
      "رَكِبَتْ حِصَانَهَا الكَسْتَنَائِيَّ عَلَى طُولِ مَسَارِ الغَابَةِ الخَلابِ عِنْدَ الفَجْرِ.",
  },
  jam: {
    id: "jam",
    arabic: "مُرَبَّى",
    partOfSpeech: "noun",
    phonetic: "dʒæm",
    pronunciationTip: "Short 'a' vowel /æ/ as in 'ham' or 'slam'.",
    collocations: [
      "strawberry jam",
      "spread jam",
      "jar of jam",
      "homemade jam",
      "sweet raspberry jam",
      "toast with butter and jam",
    ],
    phrasalVerbs: [
      {
        phrase: "spread on",
        meaning: "apply jam over bread or scones",
        arabic: "يَدْهَنُ المُرَبَّى",
        example: "Spread sweet blackberry jam over fresh warm scones.",
      },
      {
        phrase: "jam-packed",
        meaning: "(idiom) completely full",
        arabic: "مُمْتَلِئٌ عَنْ آخِرِهِ",
        example: "The farmer's market was jam-packed with shoppers.",
      },
    ],
    sentences: [
      {
        context: "Breakfast Treat",
        en: "She spread a generous spoonful of homemade strawberry jam onto her buttered toast.",
        ar: "دَهَنَتْ مِلْعَقَةً وَفِيرَةً مِنْ مُرَبَّى الفَرَاوِلَةِ المَنْزِلِيِّ عَلَى خُبْزِهَا المَحْمُوصِ بِالزُّبْدَةِ.",
      },
      {
        context: "Canning & Preserves",
        en: "Every summer, grandmother simmers fresh ripe berries and cane sugar into glossy jars of jam.",
        ar: "فِي كُلِّ صَيْفٍ، تَطْبُخُ الجَدَّةُ التُّوتَ النَّاضِجَ مَعَ السُّكَّرِ لِعَمَلِ بَرَاِطِيمَ مُرَبَّى لامِعَةٍ.",
      },
      {
        context: "Baking",
        en: "Warm apricot jam is brushed over fruit tarts to give them a professional glossy finish.",
        ar: "تُدْهَنُ فَطَائِرُ الفَوَاكِهِ بِمُرَبَّى المِشْمِشِ الدَّافِئِ لِإِعْطَائِهَا لَمَعَاناً رَائِعاً.",
      },
    ],
    exampleSentence:
      "She spread a generous spoonful of homemade strawberry jam onto her buttered toast.",
    exampleArabic:
      "دَهَنَتْ مِلْعَقَةً وَفِيرَةً مِنْ مُرَبَّى الفَرَاوِلَةِ المَنْزِلِيِّ عَلَى خُبْزِهَا المَحْمُوصِ بِالزُّبْدَةِ.",
  },
  "jewelry-box": {
    id: "jewelry-box",
    arabic: "صُنْدُوقُ المَجَوْهَرَات",
    partOfSpeech: "noun",
    phonetic: "ˈdʒuː.əl.ri ˌbɑːks",
    pronunciationTip: "Primary stress on 'JEW' (/ˈdʒuː.əl.ri/), followed by 'box'.",
    collocations: [
      "wooden jewelry box",
      "open the jewelry box",
      "velvet jewelry box",
      "store rings in a jewelry box",
      "antique jewelry box",
      "lock the jewelry box",
    ],
    phrasalVerbs: [
      {
        phrase: "put away",
        meaning: "store jewelry in its box",
        arabic: "يَحْفَظُ فِي الصُّنْدُوق",
        example: "She put away her gold necklace inside the velvet jewelry box.",
      },
      {
        phrase: "take out",
        meaning: "remove an item from a box",
        arabic: "يُخْرِجُ مِنَ الصُّنْدُوق",
        example: "He took out the diamond ring to prepare for the proposal.",
      },
    ],
    sentences: [
      {
        context: "Storage & Care",
        en: "She organized her silver earrings and bracelets inside the velvet jewelry box.",
        ar: "رَتَّبَتْ أَقْرَاطَهَا وَأَسَاوِرَهَا الفِضِّيَّةَ دَاخِلَ صُنْدُوقِ المَجَوْهَرَاتِ المَخْمَلِيِّ.",
      },
      {
        context: "Heirloom",
        en: "The antique wooden jewelry box was passed down from her great-grandmother.",
        ar: "تَوَارَثَتْ صُنْدُوقَ المَجَوْهَرَاتِ الخَشَبِيَّ الأَثَرِيَّ عَنْ جَدَّتِهَا الكُبْرَى.",
      },
      {
        context: "Security",
        en: "Keep precious rings and necklaces securely locked inside a sturdy jewelry box.",
        ar: "احْتَفِظْ بِالخَوَاتِمِ وَالقَلائِدِ الثَّمِينَةِ مُقْفَلَةً بِأَمَانٍ دَاخِلَ صُنْدُوقِ مَجَوْهَرَاتٍ مَتِينٍ.",
      },
    ],
    exampleSentence:
      "She organized her silver earrings and bracelets inside the velvet jewelry box.",
    exampleArabic:
      "رَتَّبَتْ أَقْرَاطَهَا وَأَسَاوِرَهَا الفِضِّيَّةَ دَاخِلَ صُنْدُوقِ المَجَوْهَرَاتِ المَخْمَلِيِّ.",
  },
  kettle: {
    id: "kettle",
    arabic: "غَلَّايَةُ مَاء (كَاتِل)",
    partOfSpeech: "noun",
    phonetic: "ˈkɛt.əl",
    pronunciationTip: "Short 'e' vowel /ɛ/, followed by a soft syllabic 'l'.",
    collocations: [
      "electric kettle",
      "boil the kettle",
      "fill the kettle",
      "kettle whistle",
      "kettle of water",
      "tea kettle",
    ],
    phrasalVerbs: [
      {
        phrase: "boil up",
        meaning: "heat water to boiling point",
        arabic: "يَغْلِي المَاء",
        example: "Boil up some water in the kettle to make fresh peppermint tea.",
      },
      {
        phrase: "switch on",
        meaning: "activate the electric kettle",
        arabic: "يُشَغِّلُ الغَلَّايَة",
        example: "She filled the kettle and switched it on.",
      },
    ],
    sentences: [
      {
        context: "Morning Tea",
        en: "He filled the electric kettle with filtered water to brew morning green tea.",
        ar: "مَلَأَ غَلَّايَةَ المَاءِ الكَهْرَبَائِيَّةَ بِمَاءٍ مُفَلْتَرٍ لِتَحْضِيرِ الشَّايِ الأَخْضَرِ الصَّبَاحِيِّ.",
      },
      {
        context: "Rapid Heating",
        en: "The cordless stainless steel kettle boils a liter of water in two minutes.",
        ar: "تَغْلِي الغَلَّايَةُ اللّاسِلْكِيَّةُ لِتْراً مِنَ المَاءِ فِي دَقِيقَتَيْنِ فَقَطْ.",
      },
      {
        context: "Hospitality",
        en: "She boiled the kettle to serve hot herbal tea to her visiting neighbors.",
        ar: "غَلَتِ المَاءَ فِي الغَلَّايَةِ لِتُقَدِّمَ شَايَ الأَعْشَابِ السَّاخِنَ لِجِيرَانِهَا الزَّائِرِينَ.",
      },
    ],
    exampleSentence: "He filled the electric kettle with filtered water to brew morning green tea.",
    exampleArabic:
      "مَلَأَ غَلَّايَةَ المَاءِ الكَهْرَبَائِيَّةَ بِمَاءٍ مُفَلْتَرٍ لِتَحْضِيرِ الشَّايِ الأَخْضَرِ الصَّبَاحِيِّ.",
  },
  knife: {
    id: "knife",
    arabic: "سِكِّين",
    partOfSpeech: "noun",
    phonetic: "naɪf",
    pronunciationTip: "Silent 'k' at the start: pronounced /naɪf/. Plural is 'knives' (/naɪvz/).",
    collocations: [
      "sharp knife",
      "butter knife",
      "chef's knife",
      "bread knife",
      "cut with a knife",
      "sharpen the knife",
    ],
    phrasalVerbs: [
      {
        phrase: "cut up",
        meaning: "divide food into smaller pieces",
        arabic: "يُقَطِّعُ",
        example: "Cut up the vegetables with a sharp chef's knife.",
      },
      {
        phrase: "slice through",
        meaning: "cut cleanly through food",
        arabic: "يَشُقُّ بِسُهُولَة",
        example: "The sharp blade sliced through the roast beef effortlessly.",
      },
    ],
    sentences: [
      {
        context: "Food Prep",
        en: "A sharp chef's knife makes chopping onions and herbs fast and safe.",
        ar: "تَجْعَلُ سِكِّينُ الطَّاهِي الحَادَّةُ تَقْطِيعَ البَصَلِ وَالأَعْشَابِ سَرِيعاً وَآمِناً.",
      },
      {
        context: "Table Setting",
        en: "Set the dinner knife on the right side of the plate with the blade facing in.",
        ar: "ضَعْ سِكِّينَ الطَّعَامِ عَلَى يَمِينِ الطَّبَقِ مَعَ تَوْجِيهِ الحَدِّ لِلدَّاخِلِ.",
      },
      {
        context: "Kitchen Safety",
        en: "Never catch a falling knife; step back and let it hit the floor.",
        ar: "لا تُحَاوِلْ أَبَداً الإِمْسَاكَ بِسِكِّينٍ سَاقِطٍ؛ بَلْ تَفَادَهُ وَدَعْهُ يَقَعُ عَلَى الأَرْضِ.",
      },
    ],
    exampleSentence: "A sharp chef's knife makes chopping onions and herbs fast and safe.",
    exampleArabic:
      "تَجْعَلُ سِكِّينُ الطَّاهِي الحَادَّةُ تَقْطِيعَ البَصَلِ وَالأَعْشَابِ سَرِيعاً وَآمِناً.",
  },
  ladle: {
    id: "ladle",
    arabic: "مِغْرَفَة",
    partOfSpeech: "noun",
    phonetic: "ˈleɪ.dəl",
    pronunciationTip: "Long 'a' sound /eɪ/ as in 'table', followed by soft /dəl/.",
    collocations: [
      "soup ladle",
      "deep ladle",
      "ladle of soup",
      "stainless steel ladle",
      "serve with a ladle",
      "wooden ladle",
    ],
    phrasalVerbs: [
      {
        phrase: "ladle out",
        meaning: "serve soup or liquid with a ladle",
        arabic: "يَغْرِفُ بِالمِغْرَفَة",
        example: "She ladled out hot vegetable soup into ceramic bowls.",
      },
    ],
    sentences: [
      {
        context: "Serving Soup",
        en: "The chef used a deep stainless steel ladle to fill every soup bowl evenly.",
        ar: "اسْتَخْدَمَ الطَّاهِي مِغْرَفَةً سْتَانْلِسْ عَمِيقَةً لِمَلْءِ أَطْبَاقِ الحَسَاءِ بِالتَّسَاوِي.",
      },
      {
        context: "Punch Bowl",
        en: "Guests used the crystal ladle to serve fruit punch at the party.",
        ar: "اسْتَخْدَمَ الضُّيُوفُ مِغْرَفَةَ الكِرِيسْتَالِ لِسَكْبِ عَصِيرِ الفَوَاكِهِ فِي الحَفْلَةِ.",
      },
      {
        context: "Kitchen Organization",
        en: "Hang your soup ladle on the wall hook near the cooking stove.",
        ar: "عَلِّقْ مِغْرَفَةَ الشُّورْبَةِ عَلَى خَطَّافِ الجِدَارِ بِالقُرْبِ مِنْ مَوْقِدِ الطَّهْيِ.",
      },
    ],
    exampleSentence: "The chef used a deep stainless steel ladle to fill every soup bowl evenly.",
    exampleArabic:
      "اسْتَخْدَمَ الطَّاهِي مِغْرَفَةً سْتَانْلِسْ عَمِيقَةً لِمَلْءِ أَطْبَاقِ الحَسَاءِ بِالتَّسَاوِي.",
  },
  lamp: {
    id: "lamp",
    arabic: "مِصْبَاح (أَبَاجُورَة)",
    partOfSpeech: "noun",
    phonetic: "læmp",
    pronunciationTip: "Short 'a' vowel as in 'map' or 'cat', ending in crisp 'mp'.",
    collocations: [
      "table lamp",
      "bedside lamp",
      "desk lamp",
      "turn on the lamp",
      "turn off the lamp",
      "dim the lamp",
    ],
    phrasalVerbs: [
      {
        phrase: "turn on",
        meaning: "activate lighting",
        arabic: "يُشْعِلُ / يُضِيءُ",
        example: "Turn on the lamp so you don't strain your eyes in the dark.",
      },
      {
        phrase: "turn off",
        meaning: "switch off lighting",
        arabic: "يُطْفِئُ",
        example: "Remember to turn off the bedside lamp before you fall asleep.",
      },
      {
        phrase: "switch on",
        meaning: "press the switch to activate",
        arabic: "يَضْغَطُ زِرَّ التَّشْغِيل",
        example: "She switched on the desk lamp to start working.",
      },
    ],
    sentences: [
      {
        context: "Night Reading",
        en: "He turned on the bedside lamp to read a few pages before sleeping.",
        ar: "أَشْعَلَ أَبَاجُورَةَ السَّرِيرِ لِيَقْرَأَ بِضْعَ صَفَحَاتٍ قَبْلَ أَنْ يَنَامَ.",
      },
      {
        context: "Ambiance",
        en: "The ceramic table lamp casts a warm, soothing glow across the room.",
        ar: "يَنْشُرُ مِصْبَاحُ الطَّاوِلَةِ الخَزَفِيُّ تَوَهُّجاً دَافِئاً وَمُرِيحاً فِي الغُرْفَةِ.",
      },
      {
        context: "Energy Saving",
        en: "Always turn off the lamp when leaving the study room.",
        ar: "احْرِصْ دَائِماً عَلَى إِطْفَاءِ المِصْبَاحِ عِنْدَ مُغَادَرَةِ غُرْفَةِ الدِّرَاسَةِ.",
      },
    ],
    exampleSentence: "He turned on the bedside lamp to read a few pages before sleeping.",
    exampleArabic:
      "أَشْعَلَ أَبَاجُورَةَ السَّرِيرِ لِيَقْرَأَ بِضْعَ صَفَحَاتٍ قَبْلَ أَنْ يَنَامَ.",
  },
  laptop: {
    id: "laptop",
    arabic: "حَاسُوبٌ مَحْمُول (لَابْتُوب)",
    partOfSpeech: "noun",
    phonetic: "ˈlæp.tɑːp",
    pronunciationTip: "Compound word: 'LAP' (/læp/) + 'TOP' (/tɑːp/).",
    collocations: [
      "open the laptop",
      "work on a laptop",
      "laptop screen",
      "close the laptop",
      "portable laptop",
      "powerful laptop",
    ],
    phrasalVerbs: [
      {
        phrase: "boot up",
        meaning: "start a laptop operating system",
        arabic: "يُقْلِعُ / يُشَغِّلُ الجِهَاز",
        example: "Wait a few seconds for the laptop to boot up.",
      },
      {
        phrase: "shut down",
        meaning: "turn off a laptop completely",
        arabic: "يُغْلِقُ الحَاسُوب",
        example: "Remember to shut down your laptop before putting it in your bag.",
      },
      {
        phrase: "log into",
        meaning: "enter credentials to access computer",
        arabic: "يُسَجِّلُ الدُّخُول",
        example: "She logged into her laptop to join the morning video meeting.",
      },
    ],
    sentences: [
      {
        context: "Remote Work",
        en: "She opened her laptop at the desk to review the project report.",
        ar: "فَتَحَتْ حَاسُوبَهَا المَحْمُولَ عَلَى المَكْتَبِ لِمُرَاجَعَةِ تَقْرِيرِ المَشْرُوعِ.",
      },
      {
        context: "Mobility",
        en: "A lightweight laptop allows students to study easily anywhere on campus.",
        ar: "يُتِيحُ الحَاسُوبُ المَحْمُولُ الخَفِيفُ لِلْطُّلاَّبِ الدِّرَاسَةَ بِسُهُولَةٍ فِي أَيِّ مَكَانٍ.",
      },
      {
        context: "Maintenance",
        en: "Close your laptop lid gently and keep liquids away from the keyboard.",
        ar: "أَغْلِقْ غِطَاءَ حَاسُوبِكَ المَحْمُولِ بِرِفْقٍ وَأَبْعِدِ السَّوَائِلَ عَنْ لَوْحَةِ المَفَاتِيحِ.",
      },
    ],
    exampleSentence: "She opened her laptop at the desk to review the project report.",
    exampleArabic:
      "فَتَحَتْ حَاسُوبَهَا المَحْمُولَ عَلَى المَكْتَبِ لِمُرَاجَعَةِ تَقْرِيرِ المَشْرُوعِ.",
  },
  "light-bulb": {
    id: "light-bulb",
    arabic: "مِصْبَاحٌ كَهْرَبَائِيّ (لَمْبَة)",
    partOfSpeech: "noun",
    phonetic: "ˈlaɪt ˌbʌlb",
    pronunciationTip: "Compound noun: 'LIGHT' (/laɪt/) + 'BULB' (/bʌlb/).",
    collocations: [
      "LED light bulb",
      "change the light bulb",
      "energy-saving light bulb",
      "burnt-out light bulb",
      "screw in a light bulb",
      "warm light bulb",
    ],
    phrasalVerbs: [
      {
        phrase: "screw in",
        meaning: "install a new light bulb by turning",
        arabic: "يَرْبِطُ / يُرَكِّبُ اللَّمْبَة",
        example: "Screw in a warm white LED bulb into the desk lamp.",
      },
      {
        phrase: "burn out",
        meaning: "stop functioning after long use",
        arabic: "تَحْتَرِقُ اللَّمْبَة",
        example: "The old hallway light bulb burned out after two years of use.",
      },
    ],
    sentences: [
      {
        context: "Home Maintenance",
        en: "He unscrewed the burnt-out incandescent bulb and installed an energy-efficient LED light bulb.",
        ar: "فَكَّ اللَّمْبَةَ القَدِيمَةَ التَّالِفَةَ وَرَكَّبَ مِصْبَاحَ LED مُوَفِّراً لِلطَّاقَةِ.",
      },
      {
        context: "Color Temperature",
        en: "Warm white light bulbs create a cozy, welcoming atmosphere in living spaces.",
        ar: "تَخْلُقُ المَصَابِيحُ ذَاتُ الضَّوْءِ الأَبْيَضِ الدَّافِئِ أَجْوَاءً مَنْزِلِيَّةً مُرِيحَةً وَجَذَّابَةً.",
      },
      {
        context: "Safety",
        en: "Always make sure the lamp is unplugged and cool before touching the light bulb.",
        ar: "تَأَكَّدْ دَائِماً مِنْ فَصْلِ المِصْبَاحِ وَبُرُودَتِهِ قَبْلَ لَمْسِ اللَّمْبَةِ الكَهْرَبَائِيَّةِ.",
      },
    ],
    exampleSentence:
      "He unscrewed the burnt-out incandescent bulb and installed an energy-efficient LED light bulb.",
    exampleArabic:
      "فَكَّ اللَّمْبَةَ القَدِيمَةَ التَّالِفَةَ وَرَكَّبَ مِصْبَاحَ LED مُوَفِّراً لِلطَّاقَةِ.",
  },
  "light-switch": {
    id: "light-switch",
    arabic: "مِفْتَاحُ الإِضَاءَة (زِرُّ النُّور)",
    partOfSpeech: "noun",
    phonetic: "ˈlaɪt ˌswɪtʃ",
    pronunciationTip:
      "Compound noun: Primary stress on 'LIGHT', secondary stress on 'SWITCH'. Crisp 'ch' ending.",
    collocations: [
      "flip the light switch",
      "turn on the light switch",
      "wall light switch",
      "dimmer switch",
      "flick the switch",
      "locate the light switch",
    ],
    phrasalVerbs: [
      {
        phrase: "turn on",
        meaning: "flip the switch to produce light",
        arabic: "يُشْعِلُ النُّور",
        example: "Flip the switch to turn on the room lights.",
      },
      {
        phrase: "turn off",
        meaning: "flip the switch to darken the room",
        arabic: "يُطْفِئُ النُّور",
        example: "Don't forget to turn off the lights before leaving.",
      },
      {
        phrase: "switch off",
        meaning: "deactivate the electrical switch",
        arabic: "يَفْصِلُ المِفْتَاح",
        example: "He switched off the hallway light from the wall panel.",
      },
    ],
    sentences: [
      {
        context: "Entering a Room",
        en: "She reached out in the dark and flipped the light switch beside the door.",
        ar: "مَدَّتْ يَدَهَا فِي الظَّلامِ وَضَغَطَتْ مِفْتَاحَ الإِضَاءَةِ بِجِوَارِ البَابِ.",
      },
      {
        context: "Energy Conservation",
        en: "Turn off the light switch whenever you leave an empty room.",
        ar: "أَطْفِئْ زِرَّ النُّورِ دَائِماً عِنْدَمَا تُغَادِرُ غُرْفَةً فَارِغَةً.",
      },
      {
        context: "Modern Home",
        en: "The smart light switch connects to Wi-Fi so you can control it with your phone.",
        ar: "يَتَّصِلُ مِفْتَاحُ الإِضَاءَةِ الذَّكِيُّ بِالشَّبَكَةِ لِلتَّحَكُّمِ فِيهِ عَبْرَ هَاتِفِكَ.",
      },
    ],
    exampleSentence: "She reached out in the dark and flipped the light switch beside the door.",
    exampleArabic:
      "مَدَّتْ يَدَهَا فِي الظَّلامِ وَضَغَطَتْ مِفْتَاحَ الإِضَاءَةِ بِجِوَارِ البَابِ.",
  },
  magazine: {
    id: "magazine",
    arabic: "مَجَلَّة",
    partOfSpeech: "noun",
    phonetic: "ˌmæɡ.əˈziːn",
    pronunciationTip: "Primary stress on the final syllable 'ZINE' (/ˌmæɡ.əˈziːn/).",
    collocations: [
      "read a magazine",
      "glossy magazine",
      "monthly magazine",
      "flip through a magazine",
      "magazine cover",
      "fashion magazine",
    ],
    phrasalVerbs: [
      {
        phrase: "flip through",
        meaning: "turn pages quickly",
        arabic: "يُقَلِّبُ صَفَحَاتِ المَجَلَّة",
        example: "She flipped through the interior design magazine for decoration ideas.",
      },
    ],
    sentences: [
      {
        context: "Leisure Reading",
        en: "She flipped through a glossy architecture magazine while sipping her morning cappuccino.",
        ar: "تَصَفَّحَتْ مَجَلَّةَ عِمَارَةٍ أَنِيقَةً وَهِيَ تَرْشُفُ الكَابُوتْشِينُو الصَّبَاحِيَّ.",
      },
      {
        context: "Subscription",
        en: "He subscribes to a monthly science magazine delivered directly to his door.",
        ar: "يَشْتَرِكُ فِي مَجَلَّةٍ عِلْمِيَّةٍ شَهْرِيَّةٍ تَصِلُهُ مُبَاشَرَةً إِلَى بَابِ مَنْزِلِهِ.",
      },
      {
        context: "Waiting Room",
        en: "A selection of travel and lifestyle magazines rests on the waiting room table.",
        ar: "تَسْتَقِرُّ تَشْكِيلَةٌ مِنْ مَجَلاَّتِ السَّفَرِ وَأَسْلُوبِ الحَيَاةِ عَلَى طَاوِلَةِ الاِنْتِظَارِ.",
      },
    ],
    exampleSentence:
      "She flipped through a glossy architecture magazine while sipping her morning cappuccino.",
    exampleArabic:
      "تَصَفَّحَتْ مَجَلَّةَ عِمَارَةٍ أَنِيقَةً وَهِيَ تَرْشُفُ الكَابُوتْشِينُو الصَّبَاحِيَّ.",
  },
  "magazine-rack": {
    id: "magazine-rack",
    arabic: "حَامِلُ مَجَلَّات",
    partOfSpeech: "noun",
    phonetic: "ˌmæɡ.əˈziːn ˌræk",
    pronunciationTip: "Stress on 'ZINE' in magazine (/ˌmæɡ.əˈziːn/) + 'RACK' (/ræk/).",
    collocations: [
      "wooden magazine rack",
      "leather magazine rack",
      "magazines in the rack",
      "bedside magazine rack",
      "freestanding magazine rack",
      "modern magazine rack",
    ],
    phrasalVerbs: [
      {
        phrase: "flip through",
        meaning: "browse magazines from the rack",
        arabic: "يُقَلِّبُ المَجَلاَّت",
        example: "He selected a design magazine from the rack to flip through.",
      },
    ],
    sentences: [
      {
        context: "Living Room Corner",
        en: "A stylish brass and leather magazine rack keeps reading materials organized by the sofa.",
        ar: "يُحَافِظُ حَامِلُ المَجَلاَّتِ النُّحَاسِيُّ الجِلْدِيُّ عَلَى تَرْتِيبِ الكُتُبِ بِجِوَارِ الأَرِيكَةِ.",
      },
      {
        context: "Waiting Area",
        en: "Current issues of news and architecture periodicals are neatly stored in the magazine rack.",
        ar: "تُحْفَظُ الأَعْدَادُ الجَدِيدَةُ مِنْ مَجَلاَّتِ الأَخْبَارِ وَالعِمَارَةِ فِي حَامِلِ المَجَلاَّتِ.",
      },
      {
        context: "Tidiness",
        en: "Keep newspapers and magazines off the coffee table by returning them to the rack.",
        ar: "حَافِظْ عَلَى نَظَافَةِ الطَّاوِلَةِ بِإِعَادَةِ الجَرَائِدِ إِلَى حَامِلِ المَجَلاَّتِ.",
      },
    ],
    exampleSentence:
      "A stylish brass and leather magazine rack keeps reading materials organized by the sofa.",
    exampleArabic:
      "يُحَافِظُ حَامِلُ المَجَلاَّتِ النُّحَاسِيُّ الجِلْدِيُّ عَلَى تَرْتِيبِ الكُتُبِ بِجِوَارِ الأَرِيكَةِ.",
  },
  mattress: {
    id: "mattress",
    arabic: "مَرْتَبَة",
    partOfSpeech: "noun",
    phonetic: "ˈmæt.rəs",
    pronunciationTip: "First syllable has the short 'a' sound as in 'cat'.",
    collocations: [
      "firm mattress",
      "memory foam mattress",
      "comfortable mattress",
      "spring mattress",
      "flip the mattress",
      "lie on the mattress",
    ],
    phrasalVerbs: [
      {
        phrase: "lie down on",
        meaning: "recline on a mattress",
        arabic: "يَسْتَلْقِي عَلَى المَرْتَبَة",
        example: "He lay down on the new mattress to test its firmness.",
      },
    ],
    sentences: [
      {
        context: "Sleep Quality",
        en: "A supportive mattress is essential for getting a good night of sleep.",
        ar: "المَرْتَبَةُ المُرِيحَةُ وَالدَّاعِمَةُ ضَرُورِيَّةٌ لِلْحُصُولِ عَلَى نَوْمٍ هَانِئٍ.",
      },
      {
        context: "Care",
        en: "Manufacturers recommend rotating your mattress every six months.",
        ar: "يُوصِي المُصَنِّعُونَ بِتَدْوِيرِ المَرْتَبَةِ كُلَّ سِتَّةِ أَشْهُرٍ.",
      },
      {
        context: "Shopping",
        en: "They tried several mattresses at the store before picking a firm one.",
        ar: "جَرَّبُوا عِدَّةَ مَرَاتِبَ فِي المَتْجَرِ قَبْلَ اخْتِيَارِ مَرْتَبَةٍ مَتِينَةٍ.",
      },
    ],
    exampleSentence: "A supportive mattress is essential for getting a good night of sleep.",
    exampleArabic:
      "المَرْتَبَةُ المُرِيحَةُ وَالدَّاعِمَةُ ضَرُورِيَّةٌ لِلْحُصُولِ عَلَى نَوْمٍ هَانِئٍ.",
  },
  "measuring-cup": {
    id: "measuring-cup",
    arabic: "كُوبُ المِعْيَار (كُوبُ قِيَاس)",
    partOfSpeech: "noun",
    phonetic: "ˈmɛʒ.ər.ɪŋ ˌkʌp",
    pronunciationTip: "Compound noun: 'MEASURING' (/ˈmɛʒ.ər.ɪŋ/) + 'CUP' (/kʌp/).",
    collocations: [
      "glass measuring cup",
      "liquid measuring cup",
      "fill the measuring cup",
      "measuring cup lines",
      "pyrex measuring cup",
      "dry measuring cup",
    ],
    phrasalVerbs: [
      {
        phrase: "measure out",
        meaning: "gauge the exact volume of an ingredient",
        arabic: "يَقِيسُ الكَمِّيَّة",
        example: "Measure out two cups of whole milk for the pancake batter.",
      },
    ],
    sentences: [
      {
        context: "Baking Precision",
        en: "She measured out exactly two cups of all-purpose flour using a clear glass measuring cup.",
        ar: "قَاسَتْ كُوبَيْنِ تَمَاماً مِنَ الطَّحِينِ بِاسْتِخْدَامِ كُوبِ القِيَاسِ الزُّجَاجِيِّ الشَّفَّافِ.",
      },
      {
        context: "Liquid Ingredients",
        en: "Check liquid measurements at eye level on the markings of the measuring cup.",
        ar: "تَحَقَّقْ مِنْ قِيَاسِ السَّوَائِلِ عِنْدَ مُسْتَوَى العَيْنِ عَلَى تَدْرِيجِ كُوبِ القِيَاسِ.",
      },
      {
        context: "Microwave Use",
        en: "A heatproof glass measuring cup is ideal for melting butter in the microwave.",
        ar: "كُوبُ المِعْيَارِ الزُّجَاجِيُّ المُقَاوِمُ لِلْحَرَارَةِ مِثَالِيٌّ لِإِذَابَةِ الزُّبْدَةِ فِي المَايكْرُووِيفِ.",
      },
    ],
    exampleSentence:
      "She measured out exactly two cups of all-purpose flour using a clear glass measuring cup.",
    exampleArabic:
      "قَاسَتْ كُوبَيْنِ تَمَاماً مِنَ الطَّحِينِ بِاسْتِخْدَامِ كُوبِ القِيَاسِ الزُّجَاجِيِّ الشَّفَّافِ.",
  },
  "measuring-spoon": {
    id: "measuring-spoon",
    arabic: "مِلْعَقَةُ قِيَاس (مِلْعَقَةٌ مِعْيَارِيَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈmɛʒ.ər.ɪŋ ˌspuːn",
    pronunciationTip: "Compound noun: 'MEASURING' + 'SPOON'.",
    collocations: [
      "set of measuring spoons",
      "tablespoon measuring spoon",
      "teaspoon measuring spoon",
      "stainless steel measuring spoon",
      "level measuring spoon",
      "measure with a spoon",
    ],
    phrasalVerbs: [
      {
        phrase: "level off",
        meaning: "smooth flat the top of a dry measuring spoon",
        arabic: "يُسَوِّي السَّطْح",
        example: "Level off the baking powder with the back of a knife.",
      },
    ],
    sentences: [
      {
        context: "Baking Accuracy",
        en: "Use a precise measuring spoon to add one teaspoon of baking powder to the dough.",
        ar: "اسْتَخْدِمْ مِلْعَقَةَ قِيَاسٍ دَقِيقَةً لِإِضَافَةِ مِلْعَقَةِ شَايٍ مِنْ خَمِيرَةِ الحَلْوَيَاتِ.",
      },
      {
        context: "Spices",
        en: "Measure out half a teaspoon of ground cinnamon and ground nutmeg.",
        ar: "قِسْ نِصْفَ مِلْعَقَةِ شَايٍ مِنْ القِرْفَةِ المَطْحُونَةِ وَجَوْزَةِ الطِّيبِ.",
      },
      {
        context: "Kitchen Sets",
        en: "A nested ring set of stainless steel measuring spoons keeps all sizes together.",
        ar: "تُحَافِظُ حَلْقَةُ مَلاعِقِ القِيَاسِ المَعْدَنِيَّةِ عَلَى اجْتِمَاعِ كُلِّ الأَحْجَامِ مَعاً.",
      },
    ],
    exampleSentence:
      "Use a precise measuring spoon to add one teaspoon of baking powder to the dough.",
    exampleArabic:
      "اسْتَخْدِمْ مِلْعَقَةَ قِيَاسٍ دَقِيقَةً لِإِضَافَةِ مِلْعَقَةِ شَايٍ مِنْ خَمِيرَةِ الحَلْوَيَاتِ.",
  },
  microwave: {
    id: "microwave",
    arabic: "مَايكْرُووِيف (فُرْنُ المَوْجَات)",
    partOfSpeech: "noun",
    phonetic: "ˈmaɪ.krə.weɪv",
    pronunciationTip: "Three syllables: 'MI-cro-wave'. Primary stress on 'MI'.",
    collocations: [
      "microwave oven",
      "heat in the microwave",
      "microwave safe",
      "reheat food in the microwave",
      "microwave timer",
      "microwave door",
    ],
    phrasalVerbs: [
      {
        phrase: "heat up",
        meaning: "warm food quickly in a microwave",
        arabic: "يُسَخِّنُ فِي المَايكْرُووِيف",
        example: "Heat up the leftover soup for two minutes in the microwave.",
      },
      {
        phrase: "warm over",
        meaning: "reheat food",
        arabic: "يُعِيدُ التَّسْخِين",
        example: "She warmed over the coffee in the microwave.",
      },
    ],
    sentences: [
      {
        context: "Reheating",
        en: "He heated up leftover rice in the microwave for a quick lunch.",
        ar: "سَخَّنَ الأَرُزَّ المُتَبَقِّيَ فِي المَايكْرُووِيفِ لِتَنَاوُلِ وَجْبَةِ غَدَاءٍ سَرِيعَةٍ.",
      },
      {
        context: "Safety",
        en: "Never place metallic containers or aluminum foil inside a microwave.",
        ar: "لا تَضَعْ أَبَداً أَوْعِيَةً مَعْدَنِيَّةً أَوْ وَرَقَ أَلُومِنْيُوم دَاخِلَ المَايكْرُووِيفِ.",
      },
      {
        context: "Convenience",
        en: "Defrost frozen meat quickly using the microwave's defrost setting.",
        ar: "أَذِبْ تَجْمِيدَ اللُّحُومِ سَرِيعاً بِاسْتِخْدَامِ خَاصِّيَّةِ إِذَابَةِ التَّجْمِيدِ فِي المَايكْرُووِيفِ.",
      },
    ],
    exampleSentence: "He heated up leftover rice in the microwave for a quick lunch.",
    exampleArabic:
      "سَخَّنَ الأَرُزَّ المُتَبَقِّيَ فِي المَايكْرُووِيفِ لِتَنَاوُلِ وَجْبَةِ غَدَاءٍ سَرِيعَةٍ.",
  },
  milk: {
    id: "milk",
    arabic: "حَلِيب (لَبَن)",
    partOfSpeech: "noun",
    phonetic: "mɪlk",
    pronunciationTip: "Short 'i' sound /ɪ/ as in 'silk' or 'hill'.",
    collocations: [
      "glass of milk",
      "cold milk",
      "whole milk",
      "skim milk",
      "carton of milk",
      "pour milk",
    ],
    phrasalVerbs: [
      {
        phrase: "pour in",
        meaning: "add milk to tea, coffee, or recipe",
        arabic: "يَصُبُّ الحَلِيب",
        example: "Pour in a splash of warm milk into your morning coffee.",
      },
    ],
    sentences: [
      {
        context: "Breakfast Routine",
        en: "The children drank a tall glass of cold whole milk with their morning pancakes.",
        ar: "شَرِبَ الأَطْفَالُ كَأْساً كَبِيراً مِنْ الحَلِيبِ الكَامِلِ الدَّسَمِ مَعَ البَانْ كِيك.",
      },
      {
        context: "Baking",
        en: "Warm one cup of whole milk gently before dissolving the active dry yeast.",
        ar: "دَفِّئْ كُوباً مِنَ الحَلِيبِ الكَامِلِ بِرِفْقٍ قَبْلَ إِذَابَةِ خَمِيرَةِ الخَبْزِ فِيهِ.",
      },
      {
        context: "Coffee Making",
        en: "Steam whole milk until smooth microfoam forms for a creamy latte.",
        ar: "سَخِّنِ الحَلِيبَ بِالبُخَارِ لِتَكْوِينِ رَغْوَةٍ نَاعِمَةٍ لِإِعْدَادِ قَهْوَةِ اللّاتِيه الكَرِيمِيَّةِ.",
      },
    ],
    exampleSentence:
      "The children drank a tall glass of cold whole milk with their morning pancakes.",
    exampleArabic:
      "شَرِبَ الأَطْفَالُ كَأْساً كَبِيراً مِنْ الحَلِيبِ الكَامِلِ الدَّسَمِ مَعَ البَانْ كِيك.",
  },
  "mixing-bowl": {
    id: "mixing-bowl",
    arabic: "وِعَاءُ الخَلْط (طَاسَةُ عَجْن)",
    partOfSpeech: "noun",
    phonetic: "ˈmɪk.sɪŋ ˌboʊl",
    pronunciationTip: "Compound noun: 'MIXING' (/ˈmɪk.sɪŋ/) + 'BOWL' (/boʊl/).",
    collocations: [
      "large mixing bowl",
      "stainless steel mixing bowl",
      "glass mixing bowl",
      "whisk in a mixing bowl",
      "ceramic mixing bowl",
      "batter in the mixing bowl",
    ],
    phrasalVerbs: [
      {
        phrase: "mix up",
        meaning: "combine ingredients thoroughly in a bowl",
        arabic: "يَخْلِطُ جَيِّداً",
        example: "Mix up the flour, sugar, and cocoa in the large mixing bowl.",
      },
    ],
    sentences: [
      {
        context: "Cake Batter",
        en: "She combined flour, sugar, and baking cocoa inside the large stainless steel mixing bowl.",
        ar: "خَلَطَتِ الطَّحِينَ وَالسُّكَّرَ وَالكَاكَاوَ دَاخِلَ وِعَاءِ الخَلْطِ السْتَانْلِس الكَبِيرِ.",
      },
      {
        context: "Salad Tossing",
        en: "A deep mixing bowl prevents lettuce leaves and dressing from spilling over.",
        ar: "يَمْنَعُ وِعَاءُ الخَلْطِ العَمِيقُ تَنَاثُرَ أَوْرَاقِ الخَسِّ وَالتَّتْبِيلَةِ إِلَى الخَارِجِ.",
      },
      {
        context: "Bread Making",
        en: "Knead the yeast dough inside the oiled ceramic mixing bowl and cover it to rise.",
        ar: "اعْجِنِ العَجِينَةَ دَاخِلَ وِعَاءِ الخَلْطِ المَدْهُونِ بِالزَّيْتِ وَغَطِّهَا لِتَخْتَمِرَ.",
      },
    ],
    exampleSentence:
      "She combined flour, sugar, and baking cocoa inside the large stainless steel mixing bowl.",
    exampleArabic:
      "خَلَطَتِ الطَّحِينَ وَالسُّكَّرَ وَالكَاكَاوَ دَاخِلَ وِعَاءِ الخَلْطِ السْتَانْلِس الكَبِيرِ.",
  },
  mud: {
    id: "mud",
    arabic: "طِين (وَحْل)",
    partOfSpeech: "noun",
    phonetic: "mʌd",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'bud' or 'cup'.",
    collocations: [
      "thick mud",
      "stuck in the mud",
      "mud puddle",
      "caked with mud",
      "walk through mud",
      "boots covered in mud",
    ],
    phrasalVerbs: [
      {
        phrase: "get stuck in",
        meaning: "be trapped in deep mud",
        arabic: "يَعْلَقُ فِي الوَحْل",
        example: "The tractor tires got stuck in the wet spring mud.",
      },
    ],
    sentences: [
      {
        context: "Wet Weather",
        en: "Heavy spring rains turned the farmyard dirt pathways into thick, slippery brown mud.",
        ar: "حَوَّلَتْ أَمْطَارُ الرَّبِيعِ الغَزِيرَةُ مَسَارَاتِ المَزْرَعَةِ إِلَى طِينٍ بُنِّيٍّ لَزِجٍ وَزَلِقٍ.",
      },
      {
        context: "Pigs Cooling",
        en: "Pigs wallow in the cool wet mud to regulate their body temperature during hot summer days.",
        ar: "تَتَمَرَّغُ الخَنَازِيرُ فِي الوَحْلِ البَارِدِ لِتَعْدِيلِ حَرَارَةِ أَجْسَامِهَا فِي أَيَّامِ الصَّيْفِ.",
      },
      {
        context: "Boots",
        en: "Rinse the caked mud off your rubber boots with the garden hose before entering the house.",
        ar: "اغْسِلِ الطِّينَ الجَافَّ عَنْ حِذَائِكَ المَطَّاطِيِّ بِخُرْطُومِ المِيَاهِ قَبْلَ دُخُولِ المَنْزِلِ.",
      },
    ],
    exampleSentence:
      "Heavy spring rains turned the farmyard dirt pathways into thick, slippery brown mud.",
    exampleArabic:
      "حَوَّلَتْ أَمْطَارُ الرَّبِيعِ الغَزِيرَةُ مَسَارَاتِ المَزْرَعَةِ إِلَى طِينٍ بُنِّيٍّ لَزِجٍ وَزَلِقٍ.",
  },
  mug: {
    id: "mug",
    arabic: "كُوبٌ كَبِير (مَجّ)",
    partOfSpeech: "noun",
    phonetic: "mʌɡ",
    pronunciationTip: "Short 'u' vowel /ʌ/ as in 'hug', 'plug', or 'cup'.",
    collocations: [
      "coffee mug",
      "ceramic mug",
      "steaming mug",
      "hot chocolate in a mug",
      "large mug",
      "travel mug",
    ],
    phrasalVerbs: [
      {
        phrase: "sip from",
        meaning: "drink slowly from a mug",
        arabic: "يَرْشُفُ مِنَ الكُوب",
        example: "She sat by the window and sipped from her hot coffee mug.",
      },
    ],
    sentences: [
      {
        context: "Morning Coffee",
        en: "He held the warm ceramic mug with both hands to savor the freshly brewed coffee.",
        ar: "أَمْسَكَ الكُوبَ الخَزَفِيَّ الدَّافِئَ بِكِلْتَا يَدَيْهِ لِيَسْتَمْتِعَ بِالقَهْوَةِ الطَّازَجَةِ.",
      },
      {
        context: "Winter Drink",
        en: "The kids enjoyed hot chocolate topped with marshmallows in festive holiday mugs.",
        ar: "اسْتَمْتَعَ الأَطْفَالُ بِالشُّوكُولاتَةِ السَّاخِنَةِ مَعَ المَارْشْمِيلُو فِي أَكْوَابِ الحَفَلاتِ.",
      },
      {
        context: "Commute",
        en: "Pour your morning tea into an insulated travel mug to keep it piping hot.",
        ar: "اصْبُبْ شَايَكَ الصَّبَاحِيَّ فِي مَجٍّ حَرَارِيٍّ لِلتَّنَقُّلِ لِيَبْقَى سَاخِناً جِدّاً.",
      },
    ],
    exampleSentence:
      "He held the warm ceramic mug with both hands to savor the freshly brewed coffee.",
    exampleArabic:
      "أَمْسَكَ الكُوبَ الخَزَفِيَّ الدَّافِئَ بِكِلْتَا يَدَيْهِ لِيَسْتَمْتِعَ بِالقَهْوَةِ الطَّازَجَةِ.",
  },
  newspaper: {
    id: "newspaper",
    arabic: "جَرِيدَة (صَحِيفَة)",
    partOfSpeech: "noun",
    phonetic: "ˈnuːzˌpeɪ.pər",
    pronunciationTip: "Compound noun: 'NEWS' (/nuːz/) + 'PAPER' (/ˈpeɪ.pər/).",
    collocations: [
      "daily newspaper",
      "read the newspaper",
      "morning newspaper",
      "newspaper headline",
      "fold the newspaper",
      "Sunday newspaper",
    ],
    phrasalVerbs: [
      {
        phrase: "read through",
        meaning: "read newspaper articles",
        arabic: "يَقْرَأُ الجَرِيدَة",
        example: "He read through the business section of the daily newspaper.",
      },
      {
        phrase: "glance over",
        meaning: "skim headlines quickly",
        arabic: "يُلْقِي نَظْرَةً عَلَى العَنَاوِين",
        example: "She glanced over the morning newspaper headlines before commuting.",
      },
    ],
    sentences: [
      {
        context: "Morning Routine",
        en: "He sits at the breakfast table every morning reading the daily newspaper.",
        ar: "يَجْلِسُ عِنْدَ طَاوِلَةِ الإِفْطَارِ كُلَّ صَبَاحٍ يَقْرَأُ الجَرِيدَةَ اليَوْمِيَّةَ.",
      },
      {
        context: "Current Affairs",
        en: "The front-page headline of the Sunday newspaper reported major economic developments.",
        ar: "عَرَضَ المَانْشِيتُ الرَّئِيسِيُّ لِصَحِيفَةِ الأَحَدِ تَطَوُّرَاتٍ اقْتِصَادِيَّةً بَارِزَةً.",
      },
      {
        context: "Delivery",
        en: "The morning newspaper arrives fresh on the front doorstep before six o'clock.",
        ar: "تَصِلُ جَرِيدَةُ الصَّبَاحِ طَازَجَةً إِلَى عَتَبَةِ البَابِ قَبْلَ السَّاعَةِ السَّادِسَةِ.",
      },
    ],
    exampleSentence: "He sits at the breakfast table every morning reading the daily newspaper.",
    exampleArabic:
      "يَجْلِسُ عِنْدَ طَاوِلَةِ الإِفْطَارِ كُلَّ صَبَاحٍ يَقْرَأُ الجَرِيدَةَ اليَوْمِيَّةَ.",
  },
  nightstand: {
    id: "nightstand",
    arabic: "طَاوِلَةُ السَّرِير (كُمودِينَة)",
    partOfSpeech: "noun",
    phonetic: "ˈnaɪt.stænd",
    pronunciationTip: "Compound noun with primary stress on the first syllable 'NIGHT'.",
    collocations: [
      "on the nightstand",
      "beside the bed",
      "wooden nightstand",
      "reach for the nightstand",
      "bedside nightstand",
      "clear the nightstand",
    ],
    phrasalVerbs: [
      {
        phrase: "put down",
        meaning: "place an object on a surface",
        arabic: "يَضَعُ شَيْئاً عَلَى سَطْح",
        example: "He put down his book on the nightstand.",
      },
      {
        phrase: "reach for",
        meaning: "extend your hand to take something",
        arabic: "يَمُدُّ يَدَهُ لِيَتَنَاوَلَ شَيْئاً",
        example: "She reached for her glasses on the nightstand.",
      },
    ],
    sentences: [
      {
        context: "Bedtime Habit",
        en: "I always keep a bottle of fresh water on my nightstand.",
        ar: "أَحْتَفِظُ دَائِماً بِزُجَاجَةِ مَاءٍ عِذْبٍ عَلَى طَاوِلَةِ السَّرِيرِ.",
      },
      {
        context: "Room Layout",
        en: "The small wooden nightstand matches the bedroom wardrobe.",
        ar: "طَاوِلَةُ السَّرِيرِ الخَشَبِيَّةُ الصَّغِيرَةُ تَتَنَاسَقُ مَعَ خِزَانَةِ غُرْفَةِ النَّوْمِ.",
      },
      {
        context: "Morning Routine",
        en: "Her alarm clock buzzed loudly from the top of the nightstand.",
        ar: "رَنَّ مُنَبِّهُهَا بِصَوْتٍ عَالٍ مِنْ أَعْلَى طَاوِلَةِ السَّرِيرِ.",
      },
    ],
    exampleSentence: "I always keep a bottle of fresh water on my nightstand.",
    exampleArabic: "أَحْتَفِظُ دَائِماً بِزُجَاجَةِ مَاءٍ عِذْبٍ عَلَى طَاوِلَةِ السَّرِيرِ.",
  },
  ottoman: {
    id: "ottoman",
    arabic: "مَقْعَدُ قَدَمَيْن (بَفّ / عُثْمَانِيَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈɑː.tə.mən",
    pronunciationTip: "Three syllables: 'OT-to-man' (/ˈɑː.tə.mən/).",
    collocations: [
      "leather ottoman",
      "storage ottoman",
      "rest feet on the ottoman",
      "fabric ottoman",
      "plush ottoman",
      "round ottoman",
    ],
    phrasalVerbs: [
      {
        phrase: "put up",
        meaning: "rest feet on an ottoman",
        arabic: "يَرْفَعُ قَدَمَيْهِ عَلَى البَفّ",
        example: "He sat back and put his feet up on the soft leather ottoman.",
      },
    ],
    sentences: [
      {
        context: "Relaxation",
        en: "He rested his feet comfortably on the tufted leather ottoman while reading the newspaper.",
        ar: "أَرَاحَ قَدَمَيْهِ عَلَى مَقْعَدِ القَدَمَيْنِ الجِلْدِيِّ أَثْنَاءَ قِرَاءَةِ الجَرِيدَةِ.",
      },
      {
        context: "Extra Seating",
        en: "The large round ottoman doubles as extra seating when entertaining guests.",
        ar: "يُسْتَخْدَمُ البَفُّ الدَّائِرِيُّ الكَبِيرُ كَمَقْعَدٍ إِضَافِيٍّ عِنْدَ اسْتِقْبَالِ الضُّيُوفِ.",
      },
      {
        context: "Hidden Storage",
        en: "The hinged storage ottoman provides plenty of space to tuck away spare blankets.",
        ar: "يُوَفِّرُ مَقْعَدُ التَّخْزِينِ ذُو الغِطَاءِ المَفْصِلِيِّ مَسَاحَةً وَاسِعَةً لِحِفْظِ البَطَّانِيَّاتِ.",
      },
    ],
    exampleSentence:
      "He rested his feet comfortably on the tufted leather ottoman while reading the newspaper.",
    exampleArabic:
      "أَرَاحَ قَدَمَيْهِ عَلَى مَقْعَدِ القَدَمَيْنِ الجِلْدِيِّ أَثْنَاءَ قِرَاءَةِ الجَرِيدَةِ.",
  },
  outlet: {
    id: "outlet",
    arabic: "مِقْبَسُ الكَهْرَبَاء (فِيشَة / بَرِيزَة)",
    partOfSpeech: "noun",
    phonetic: "ˈaʊt.lɛt",
    pronunciationTip: "Primary stress on 'OUT' (/ˈaʊt/).",
    collocations: [
      "wall outlet",
      "plug into the outlet",
      "electrical outlet",
      "power outlet",
      "unplug from the outlet",
      "safety outlet",
    ],
    phrasalVerbs: [
      {
        phrase: "plug in",
        meaning: "insert a plug into an electrical outlet",
        arabic: "يَصِلُ بِالكَهْرَبَاء",
        example: "Plug in your phone charger to the wall outlet.",
      },
      {
        phrase: "unplug from",
        meaning: "disconnect a device from an outlet",
        arabic: "يَفْصِلُ عَنِ المِقْبَس",
        example: "Unplug the iron from the outlet as soon as you finish.",
      },
    ],
    sentences: [
      {
        context: "Charging Devices",
        en: "He plugged his laptop charger into the electrical wall outlet.",
        ar: "وَصَلَ شَاحِنَ حَاسُوبِهِ المَحْمُولِ بِمِقْبَسِ الكَهْرَبَاءِ الجِدَارِيِّ.",
      },
      {
        context: "Child Safety",
        en: "Install plastic safety covers over all exposed low outlets.",
        ar: "قُمْ بِتَرْكِيبِ أَغْطِيَةِ أَمَانٍ بَلاسْتِيكِيَّةٍ عَلَى مَقَابِسِ الكَهْرَبَاءِ المُنْخَفِضَةِ.",
      },
      {
        context: "Convenience",
        en: "The hotel room has convenient USB outlets right next to the bed.",
        ar: "تَحْتَوِي غُرْفَةُ الفُنْدُقِ عَلَى مَقَابِسِ شَحْنٍ عَصْرِيَّةٍ بِجَانِبِ السَّرِيرِ مُبَاشَرَةً.",
      },
    ],
    exampleSentence: "He plugged his laptop charger into the electrical wall outlet.",
    exampleArabic: "وَصَلَ شَاحِنَ حَاسُوبِهِ المَحْمُولِ بِمِقْبَسِ الكَهْرَبَاءِ الجِدَارِيِّ.",
  },
  oven: {
    id: "oven",
    arabic: "فُرْن",
    partOfSpeech: "noun",
    phonetic: "ˈʌv.ən",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'love' or 'up', not /oʊ/.",
    collocations: [
      "preheat the oven",
      "bake in the oven",
      "oven mitts",
      "roast in the oven",
      "oven temperature",
      "gas oven",
    ],
    phrasalVerbs: [
      {
        phrase: "put in",
        meaning: "place a baking tray into the oven",
        arabic: "يُدْخِلُ فِي الفُرْن",
        example: "Put the cake batter in the preheated oven.",
      },
      {
        phrase: "take out",
        meaning: "remove hot food from the oven",
        arabic: "يُخْرِجُ مِنَ الفُرْن",
        example: "Use thick oven mitts to take out the hot roasting pan.",
      },
    ],
    sentences: [
      {
        context: "Baking",
        en: "Preheat the oven to 180 degrees before baking the apple pie.",
        ar: "سَخِّنِ الفُرْنَ مُسْبَقاً إِلَى 180 دَرَجَةٍ قَبْلَ خَبْزِ فَطِيرَةِ التُّفَّاحِ.",
      },
      {
        context: "Roasting",
        en: "The roasted chicken turned golden brown and crispy in the oven.",
        ar: "تَحَوَّلَ الدَّجَاجُ المَشْوِيُّ إِلَى اللَّوْنِ الذَّهَبِيِّ المُقَرْمَشِ فِي الفُرْنِ.",
      },
      {
        context: "Safety",
        en: "Always wear heat-resistant mitts when reaching inside a hot oven.",
        ar: "ارْتَدِ دَائِماً قُفَّازَاتٍ مُقَاوِمَةً لِلْحَرَارَةِ عِنْدَ التَّعَامُلِ مَعَ الفُرْنِ السَّاخِنِ.",
      },
    ],
    exampleSentence: "Preheat the oven to 180 degrees before baking the apple pie.",
    exampleArabic:
      "سَخِّنِ الفُرْنَ مُسْبَقاً إِلَى 180 دَرَجَةٍ قَبْلَ خَبْزِ فَطِيرَةِ التُّفَّاحِ.",
  },
  "oven-mitt": {
    id: "oven-mitt",
    arabic: "قُفَّازُ الفُرْن (مَاسِكُ حَرَارَة)",
    partOfSpeech: "noun",
    phonetic: "ˈʌv.ən ˌmɪt",
    pronunciationTip: "Compound noun: 'OVEN' (/ˈʌv.ən/) + 'MITT' (/mɪt/).",
    collocations: [
      "wear oven mitts",
      "heat-resistant oven mitts",
      "silicone oven mitts",
      "pair of oven mitts",
      "quilted oven mitts",
      "hot pan with oven mitts",
    ],
    phrasalVerbs: [
      {
        phrase: "put on",
        meaning: "wear protective mitts",
        arabic: "يَلْبَسُ قُفَّازَاتِ الفُرْن",
        example: "Put on thick oven mitts before handling the hot cast-iron skillet.",
      },
    ],
    sentences: [
      {
        context: "Kitchen Safety",
        en: "Always wear insulated silicone oven mitts when removing hot trays from the oven.",
        ar: "ارْتَدِ دَائِماً قُفَّازَاتِ فُرْنٍ سِيلِيكُونِيَّةً عَازِلَةً عِنْدَ إِخْرَاجِ الصَّوَانِي السَّاخِنَةِ.",
      },
      {
        context: "Handling Hot Pots",
        en: "She gripped the hot casserole handles securely with padded quilted oven mitts.",
        ar: "أَمْسَكَتْ بِمَقَابِضِ الطَّاجِنِ السَّاخِنِ بِإِحْكَامٍ بِاسْتِخْدَامِ قُفَّازَاتِ الفُرْنِ المُبَطَّنَةِ.",
      },
      {
        context: "Storage",
        en: "Hang the colorful oven mitts on hooks beside the stove for quick access.",
        ar: "عَلِّقْ قُفَّازَاتِ الفُرْنِ المُلَوَّنَةَ عَلَى خَطَّافَاتٍ بِجَانِبِ المَوْقِدِ لِسُرْعَةِ تَنَاوُلِهَا.",
      },
    ],
    exampleSentence:
      "Always wear insulated silicone oven mitts when removing hot trays from the oven.",
    exampleArabic:
      "ارْتَدِ دَائِماً قُفَّازَاتِ فُرْنٍ سِيلِيكُونِيَّةً عَازِلَةً عِنْدَ إِخْرَاجِ الصَّوَانِي السَّاخِنَةِ.",
  },
  painting: {
    id: "painting",
    arabic: "لَوْحَةٌ فَنِّيَّة (رَسْمَة)",
    partOfSpeech: "noun",
    phonetic: "ˈpeɪn.tɪŋ",
    pronunciationTip: "Two syllables: 'PAINT-ing' (/ˈpeɪn.tɪŋ/).",
    collocations: [
      "oil painting",
      "framed painting",
      "hang a painting",
      "landscape painting",
      "abstract painting",
      "original painting",
    ],
    phrasalVerbs: [
      {
        phrase: "hang up",
        meaning: "mount an art piece on a wall",
        arabic: "يُعَلِّقُ اللَّوْحَة",
        example: "They hung up the original oil painting above the living room sofa.",
      },
    ],
    sentences: [
      {
        context: "Art in the Home",
        en: "A vibrant abstract oil painting in shades of blue and gold brightens the white wall.",
        ar: "تُضْفِي لَوْحَةٌ زَيْتِيَّةٌ تَجْرِيدِيَّةٌ بَدِيعَةٌ بِدَرَجَاتِ الأَزْرَقِ وَالذَّهَبِ حَيَوِيَّةً عَلَى الجِدَارِ.",
      },
      {
        context: "Gallery Exhibition",
        en: "The art gallery displayed famous landscape paintings by local Impressionist artists.",
        ar: "عَرَضَتْ صَالَةُ الفَنِّ لَوْحَاتٍ طَبِيعِيَّةً شَهِيرَةً لِفَنَّانِينَ تَأَثُّرِيِّينَ مَحَلِّيِّينَ.",
      },
      {
        context: "Lighting Art",
        en: "Install a dedicated brass picture light above the painting to highlight its brushstrokes.",
        ar: "ثَبِّتْ إِضَاءَةً نُحَاسِيَّةً مُخَصَّصَةً فَوْقَ اللَّوْحَةِ لِإِبْرَازِ تَفَاصِيلِ رَسْمِهَا.",
      },
    ],
    exampleSentence:
      "A vibrant abstract oil painting in shades of blue and gold brightens the white wall.",
    exampleArabic:
      "تُضْفِي لَوْحَةٌ زَيْتِيَّةٌ تَجْرِيدِيَّةٌ بَدِيعَةٌ بِدَرَجَاتِ الأَزْرَقِ وَالذَّهَبِ حَيَوِيَّةً عَلَى الجِدَارِ.",
  },
  pajamas: {
    id: "pajamas",
    arabic: "بِي جَامَة / مَلابِسُ النَّوْم",
    partOfSpeech: "noun",
    phonetic: "pəˈdʒɑː.məz",
    pronunciationTip: "Stress is on the middle syllable 'JA' (/ˈdʒɑː/).",
    collocations: [
      "put on pajamas",
      "wear pajamas",
      "cotton pajamas",
      "silk pajamas",
      "comfortable pajamas",
      "change into pajamas",
    ],
    phrasalVerbs: [
      {
        phrase: "put on",
        meaning: "dress in pajamas",
        arabic: "يَرْتَدِي مَلابِسَ النَّوْم",
        example: "He put on his warm flannel pajamas before climbing into bed.",
      },
      {
        phrase: "change into",
        meaning: "switch into pajamas",
        arabic: "يُبَدِّلُ إِلَى مَلابِسِ النَّوْم",
        example: "After a hot shower, she changed into clean cotton pajamas.",
      },
    ],
    sentences: [
      {
        context: "Nighttime Routine",
        en: "After taking a warm bath, the children changed into their cozy pajamas.",
        ar: "بَعْدَ أَخْذِ حَمَّامٍ دَافِئٍ، ارْتَدَى الأَطْفَالُ بِي جَامَاتِهِمُ المُرِيحَةَ.",
      },
      {
        context: "Comfort",
        en: "Soft breathable cotton pajamas help you sleep comfortably through the night.",
        ar: "تُسَاعِدُ مَلابِسُ النَّوْمِ القُطْنِيَّةُ النَّاعِمَةُ عَلَى النَّوْمِ بِرَاحَةٍ طَوَالَ اللَّيْلِ.",
      },
      {
        context: "Weekend Morning",
        en: "On lazy Sunday mornings, they enjoy breakfast while still wearing pajamas.",
        ar: "فِي صَبَاحِ الأَحَدِ الهَادِئِ، يَسْتَمْتِعُونَ بِالإِفْطَارِ وَهُمْ لا يَزَالُونَ بِمَلابِسِ النَّوْمِ.",
      },
    ],
    exampleSentence: "After taking a warm bath, the children changed into their cozy pajamas.",
    exampleArabic:
      "بَعْدَ أَخْذِ حَمَّامٍ دَافِئٍ، ارْتَدَى الأَطْفَالُ بِي جَامَاتِهِمُ المُرِيحَةَ.",
  },
  pan: {
    id: "pan",
    arabic: "مِقْلَاة / طَاسَة",
    partOfSpeech: "noun",
    phonetic: "pæn",
    pronunciationTip: "Short 'a' vowel /æ/ as in 'man' or 'can'.",
    collocations: [
      "frying pan",
      "sauté pan",
      "hot pan",
      "non-stick pan",
      "heat oil in the pan",
      "cast iron pan",
    ],
    phrasalVerbs: [
      {
        phrase: "sizzle up",
        meaning: "fry loudly in a hot pan",
        arabic: "يَفِحُّ فِي المِقْلاة",
        example: "The garlic and onions sizzled up in the hot olive oil.",
      },
      {
        phrase: "toss in",
        meaning: "add ingredients into a pan",
        arabic: "يُضِيفُ فِي المِقْلاة",
        example: "Toss in the sliced bell peppers to sauté.",
      },
    ],
    sentences: [
      {
        context: "Sautéing",
        en: "Heat olive oil in a wide pan before adding garlic and diced mushrooms.",
        ar: "سَخِّنْ زَيْتَ الزَّيْتُونِ فِي مِقْلاةٍ وَاسِعَةٍ قَبْلَ إِضَافَةِ الثَّوْمِ وَالفِطْرِ.",
      },
      {
        context: "Breakfast",
        en: "She cooked two fluffy fried eggs in the non-stick pan.",
        ar: "طَبَخَتْ بَيْضَتَيْنِ مَقْلِيَّتَيْنِ فِي المِقْلاةِ غَيْرِ اللّاصِقَةِ.",
      },
      {
        context: "Pan Care",
        en: "Season your cast-iron pan with vegetable oil after washing and drying.",
        ar: "امْسَحْ مِقْلاتَكَ الزَّهْرِيَّةَ بِزَيْتٍ نَبَاتِيٍّ بَعْدَ غَسْلِهَا وَتَجْفِيفِهَا.",
      },
    ],
    exampleSentence: "Heat olive oil in a wide pan before adding garlic and diced mushrooms.",
    exampleArabic:
      "سَخِّنْ زَيْتَ الزَّيْتُونِ فِي مِقْلاةٍ وَاسِعَةٍ قَبْلَ إِضَافَةِ الثَّوْمِ وَالفِطْرِ.",
  },
  "paper-towel": {
    id: "paper-towel",
    arabic: "مَنَادِيلُ مَطْبَخ (مَحَارِمُ وَرَقِيَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈpeɪ.pər ˌtaʊ.əl",
    pronunciationTip: "Compound noun: 'PAPER' (/ˈpeɪ.pər/) + 'TOWEL' (/ˈtaʊ.əl/).",
    collocations: [
      "roll of paper towels",
      "tear a paper towel",
      "absorbent paper towel",
      "wipe with a paper towel",
      "paper towel holder",
      "clean spills with paper towels",
    ],
    phrasalVerbs: [
      {
        phrase: "wipe up",
        meaning: "clean liquid spills quickly",
        arabic: "يَمْسَحُ السَّوَائِلَ بِالمَحَارِم",
        example: "Wipe up the spilled milk with an absorbent paper towel.",
      },
      {
        phrase: "tear off",
        meaning: "detach a sheet from the roll",
        arabic: "يَفْصِلُ مَنْدِيلاً وَرَقِيّاً",
        example: "Tear off two sheets of paper towel to drain the fried bacon.",
      },
    ],
    sentences: [
      {
        context: "Spill Cleanup",
        en: "She tore off two sheets of absorbent paper towels to clean up the spilled juice.",
        ar: "فَصَلَتْ مَنْدِيلَيْنِ وَرَقِيَّيْنِ مَاصَّيْنِ لِمَسْحِ العَصِيرِ المَسْكُوبِ عَنِ الطَّاوِلَةِ.",
      },
      {
        context: "Draining Oil",
        en: "Place freshly fried onion rings on a paper towel to absorb excess cooking oil.",
        ar: "ضَعْ حَلَقَاتِ البَصَلِ المَقْلِيَّةَ عَلَى مِنْدِيلٍ وَرَقِيٍّ لاِمْتِصَاصِ الزَّيْتِ الزَّائِدِ.",
      },
      {
        context: "Kitchen Organization",
        en: "The wall-mounted holder keeps the paper towel roll clean and easy to reach.",
        ar: "يُحَافِظُ الحَامِلُ الجِدَارِيُّ عَلَى بَكْرَةِ مَنَادِيلِ المَطْبَخِ نَظِيفَةً وَسَهْلَةَ المَنَالِ.",
      },
    ],
    exampleSentence:
      "She tore off two sheets of absorbent paper towels to clean up the spilled juice.",
    exampleArabic:
      "فَصَلَتْ مَنْدِيلَيْنِ وَرَقِيَّيْنِ مَاصَّيْنِ لِمَسْحِ العَصِيرِ المَسْكُوبِ عَنِ الطَّاوِلَةِ.",
  },
  pasta: {
    id: "pasta",
    arabic: "مَعْكَرُونَة (بَاسْتَا)",
    partOfSpeech: "noun",
    phonetic: "ˈpɑː.stə",
    pronunciationTip:
      "First syllable has the broad 'ah' sound /ɑː/ in American English, short 'a' /æ/ in British English.",
    collocations: [
      "cook pasta",
      "fresh pasta",
      "pasta sauce",
      "drain the pasta",
      "bowl of pasta",
      "al dente pasta",
    ],
    phrasalVerbs: [
      {
        phrase: "boil up",
        meaning: "cook pasta in salted boiling water",
        arabic: "يَسْلُقُ المَعْكَرُونَة",
        example: "Boil up the penne pasta for exactly nine minutes.",
      },
      {
        phrase: "toss with",
        meaning: "mix pasta thoroughly with sauce",
        arabic: "يُقَلِّبُ مَعَ الصَّلْصَة",
        example: "Toss the hot fettuccine with creamy Alfredo sauce.",
      },
    ],
    sentences: [
      {
        context: "Italian Cooking",
        en: "Cook the spaghetti in well-salted boiling water until it is perfectly al dente.",
        ar: "اطْبُخِ الإِسْبَاغِيتِي فِي مَاءٍ مُمَلَّحٍ يَغْلِي حَتَّى تَنْضَجَ بِقِوَامٍ مُتَمَاسِكٍ.",
      },
      {
        context: "Dinner Service",
        en: "She tossed the penne pasta with homemade basil pesto and toasted pine nuts.",
        ar: "قَلَّبَتْ مَعْكَرُونَةَ البِنِّي مَعَ صَلْصَةِ الرَّيْحَانِ المَنْزِلِيَّةِ وَالصَّنَوْبَرِ المُحَمَّصِ.",
      },
      {
        context: "Comfort Food",
        en: "Baked pasta with ground meat and bubbling melted mozzarella is a family favorite.",
        ar: "تُعَدُّ طَاجِنُ المَعْكَرُونَةِ بِاللَّحْمِ المَفْرُومِ وَالمُوزَارِيلّا المُذَابَةِ وَجْبَةَ العَائِلَةِ المُفَضَّلَةَ.",
      },
    ],
    exampleSentence:
      "Cook the spaghetti in well-salted boiling water until it is perfectly al dente.",
    exampleArabic:
      "اطْبُخِ الإِسْبَاغِيتِي فِي مَاءٍ مُمَلَّحٍ يَغْلِي حَتَّى تَنْضَجَ بِقِوَامٍ مُتَمَاسِكٍ.",
  },
  peeler: {
    id: "peeler",
    arabic: "قَشَّارَةُ خُضْرَاوَات",
    partOfSpeech: "noun",
    phonetic: "ˈpiː.lər",
    pronunciationTip: "Long 'ee' vowel /iː/ as in 'peel'.",
    collocations: [
      "potato peeler",
      "vegetable peeler",
      "sharp peeler",
      "swivel peeler",
      "Y-peeler",
      "peel with a peeler",
    ],
    phrasalVerbs: [
      {
        phrase: "peel off",
        meaning: "remove the skin of a fruit or vegetable",
        arabic: "يُقَشِّرُ القِشْرَة",
        example: "Peel off the skin of the apples before slicing them for the pie.",
      },
    ],
    sentences: [
      {
        context: "Prepping Potatoes",
        en: "She peeled five large russet potatoes quickly using a sharp swivel peeler.",
        ar: "قَشَّرَتْ خَمْسَ حَبَّاتِ بَطَاطِسَ كَبِيرَةٍ سَرِيعاً بِاسْتِخْدَامِ قَشَّارَةٍ حَادَّةٍ.",
      },
      {
        context: "Carrot Ribbons",
        en: "Use a vegetable peeler to shave thin, elegant ribbons of carrot for salads.",
        ar: "اسْتَخْدِمْ قَشَّارَةَ الخُضَارِ لِعَمَلِ شَرَائِطَ جَزَرٍ رَفِيعَةٍ وَأَنِيقَةٍ لِلسَّلَطَاتِ.",
      },
      {
        context: "Citrus Zest",
        en: "Remove wide strips of lemon peel with a peeler to infuse the syrup.",
        ar: "انْزِعْ شَرَائِطَ عَرِيضَةً مِنْ قِشْرِ اللَّيْمُونِ بِالقَشَّارَةِ لِتَنْكِيهِ القَطْرِ.",
      },
    ],
    exampleSentence: "She peeled five large russet potatoes quickly using a sharp swivel peeler.",
    exampleArabic:
      "قَشَّرَتْ خَمْسَ حَبَّاتِ بَطَاطِسَ كَبِيرَةٍ سَرِيعاً بِاسْتِخْدَامِ قَشَّارَةٍ حَادَّةٍ.",
  },
  pepper: {
    id: "pepper",
    arabic: "فُلْفُل (فُلْفُلٌ أَسْوَد)",
    partOfSpeech: "noun",
    phonetic: "ˈpɛp.ər",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'pen', followed by soft /ər/.",
    collocations: [
      "black pepper",
      "ground pepper",
      "freshly cracked pepper",
      "pepper mill",
      "season with pepper",
      "bell pepper",
    ],
    phrasalVerbs: [
      {
        phrase: "grind on",
        meaning: "crush whole peppercorns over food",
        arabic: "يَطْحَنُ الفُلْفُلَ فَوْقَ الطَّعَام",
        example: "Grind fresh black pepper over the creamy Caesar salad.",
      },
    ],
    sentences: [
      {
        context: "Seasoning",
        en: "Season the chicken breast evenly with fine sea salt and freshly cracked black pepper.",
        ar: "تَبِّلْ صَدْرَ الدَّجَاجِ بِالتَّسَاوِي بِمِلْحِ البَحْرِ النَّاعِمِ وَالفُلْفُلِ الأَسْوَدِ المَطْحُونِ طَازَجاً.",
      },
      {
        context: "Tabletop Mill",
        en: "The tall wooden pepper mill grinds whole peppercorns with ease.",
        ar: "تَطْحَنُ مَطْحَنَةُ الفُلْفُلِ الخَشَبِيَّةُ الطَّوِيلَةُ حَبَّاتِ الفُلْفُلِ الكَامِلَةِ بِسُهُولَةٍ.",
      },
      {
        context: "Salad Ingredient",
        en: "Dice crisp red and yellow bell peppers to add sweetness and crunch to the salad.",
        ar: "قَطِّعِ الفُلْفُلَ الرُّومِيَّ الأَحْمَرَ وَالأَصْفَرَ لِإِضْفَاءِ حَلاوَةٍ وَقَرْمَشَةٍ عَلَى السَّلَطَةِ.",
      },
    ],
    exampleSentence:
      "Season the chicken breast evenly with fine sea salt and freshly cracked black pepper.",
    exampleArabic:
      "تَبِّلْ صَدْرَ الدَّجَاجِ بِالتَّسَاوِي بِمِلْحِ البَحْرِ النَّاعِمِ وَالفُلْفُلِ الأَسْوَدِ المَطْحُونِ طَازَجاً.",
  },
  phone: {
    id: "phone",
    arabic: "هَاتِف (مُوبَايِل)",
    partOfSpeech: "noun",
    phonetic: "foʊn",
    pronunciationTip: "Begins with 'f' sound, followed by long 'o' /oʊ/ as in 'bone'.",
    collocations: [
      "smartphone",
      "answer the phone",
      "check your phone",
      "charge your phone",
      "phone screen",
      "phone call",
    ],
    phrasalVerbs: [
      {
        phrase: "pick up",
        meaning: "answer an incoming call",
        arabic: "يَرُدُّ عَلَى الهَاتِف",
        example: "Please pick up the phone when your manager calls.",
      },
      {
        phrase: "hang up",
        meaning: "end a telephone conversation",
        arabic: "يُغْلِقُ الخَطّ",
        example: "He said goodbye and hung up the phone.",
      },
      {
        phrase: "call back",
        meaning: "return a missed telephone call",
        arabic: "يُعَاوِدُ الاِتِّصَال",
        example: "I will call you back as soon as my meeting finishes.",
      },
    ],
    sentences: [
      {
        context: "Communication",
        en: "She checked her phone for new messages as soon as she woke up.",
        ar: "تَفَقَّدَتْ هَاتِفَهَا لِمَعْرِفَةِ الرَّسَائِلِ الجَدِيدَةِ بِمُجَرَّدِ اسْتِيقَاظِهَا.",
      },
      {
        context: "Battery Care",
        en: "Plug your phone into the charger overnight so the battery is full tomorrow.",
        ar: "صِلْ هَاتِفَكَ بِالشَّاحِنِ طَوَالَ اللَّيْلِ لِتَكُونَ البَطَّارِيَّةُ مُمْتَلِئَةً غَداً.",
      },
      {
        context: "Courtesy",
        en: "Please silence your phone during the conference presentation.",
        ar: "يُرْجَى كَتْمُ صَوْتِ هَاتِفِكَ أَثْنَاءَ عَرْضِ المُؤْتَمَرِ.",
      },
    ],
    exampleSentence: "She checked her phone for new messages as soon as she woke up.",
    exampleArabic:
      "تَفَقَّدَتْ هَاتِفَهَا لِمَعْرِفَةِ الرَّسَائِلِ الجَدِيدَةِ بِمُجَرَّدِ اسْتِيقَاظِهَا.",
  },
  "photo-album": {
    id: "photo-album",
    arabic: "أَلْبُومُ صُوَر",
    partOfSpeech: "noun",
    phonetic: "ˈfoʊ.toʊ ˌæl.bəm",
    pronunciationTip: "Compound word: 'PHOTO' (/ˈfoʊ.toʊ/) + 'ALBUM' (/ˈæl.bəm/).",
    collocations: [
      "family photo album",
      "look through a photo album",
      "wedding photo album",
      "flip through the album",
      "keepsake photo album",
      "old photo album",
    ],
    phrasalVerbs: [
      {
        phrase: "look back on",
        meaning: "remember past memories through photos",
        arabic: "يَسْتَعِيدُ الذِّكْرَيَات",
        example: "They looked back on their wedding day while viewing the photo album.",
      },
      {
        phrase: "flip through",
        meaning: "turn pages quickly",
        arabic: "يُقَلِّبُ الصَّفَحَات",
        example: "She flipped through the photo album to show her childhood pictures.",
      },
    ],
    sentences: [
      {
        context: "Family Memories",
        en: "Grandmother pulled out the leather photo album to share old family stories.",
        ar: "أَخْرَجَتِ الجَدَّةُ أَلْبُومَ الصُّوَرِ الجِلْدِيَّ لِتُشَارِكَ قِصَصَ العَائِلَةِ القَدِيمَةَ.",
      },
      {
        context: "Preserving Moments",
        en: "They created a beautiful photo album documenting their European holiday.",
        ar: "صَنَعُوا أَلْبُومَ صُوَرٍ رَائِعاً يُوَثِّقُ عُطْلَتَهُمُ الأُورُوبِّيَّةَ.",
      },
      {
        context: "Sentimental Keepsake",
        en: "Keep precious printed photographs safely inside an acid-free photo album.",
        ar: "احْفَظِ الصُّوَرَ المَطْبُوعَةَ الثَّمِينَةَ بِأَمَانٍ دَاخِلَ أَلْبُومِ صُوَرٍ مُخَصَّصٍ.",
      },
    ],
    exampleSentence: "Grandmother pulled out the leather photo album to share old family stories.",
    exampleArabic:
      "أَخْرَجَتِ الجَدَّةُ أَلْبُومَ الصُّوَرِ الجِلْدِيَّ لِتُشَارِكَ قِصَصَ العَائِلَةِ القَدِيمَةَ.",
  },
  "photo-frame": {
    id: "photo-frame",
    arabic: "إِطَارُ صُورَة (بِرْوَازُ صُوَر)",
    partOfSpeech: "noun",
    phonetic: "ˈfoʊ.toʊ ˌfreɪm",
    pronunciationTip: "Compound noun: 'PHOTO' (/ˈfoʊ.toʊ/) + 'FRAME' (/freɪm/).",
    collocations: [
      "silver photo frame",
      "wooden photo frame",
      "display in a photo frame",
      "desk photo frame",
      "hanging photo frame",
      "digital photo frame",
    ],
    phrasalVerbs: [
      {
        phrase: "put in",
        meaning: "insert a photograph into a frame",
        arabic: "يَضَعُ الصُّورَةَ فِي البِرْوَاز",
        example: "She put her favorite holiday portrait in a silver photo frame.",
      },
    ],
    sentences: [
      {
        context: "Sentimental Decor",
        en: "A collection of silver photo frames showcasing family milestones lines the fireplace mantel.",
        ar: "تَصْطَفُّ مَجْمُوعَةٌ مِنْ إِطَارَاتِ الصُّوَرِ الفِضِّيَّةِ التَّذْكَارِيَّةِ عَلَى رَفِّ المِدْفَأَةِ.",
      },
      {
        context: "Modern Tech",
        en: "A Wi-Fi digital photo frame displays rotating slideshows of recent vacation pictures.",
        ar: "يَعْرِضُ إِطَارُ الصُّوَرِ الرَّقْمِيُّ شَرَائِحَ مُتَغَيِّرَةً لِصُوَرِ العُطْلَةِ الحَدِيثَةِ عَبْرَ الشَّبَكَةِ.",
      },
      {
        context: "Gift Giving",
        en: "He gifted his parents a custom engraved wooden photo frame for their wedding anniversary.",
        ar: "أَهْدَى وَالِدَيْهِ إِطَارَ صُورَةٍ خَشَبِيّاً مَحْفُوراً خِصِّيصاً بِمُنَاسَبَةِ ذِكْرَى زَوَاجِهِمَا.",
      },
    ],
    exampleSentence:
      "A collection of silver photo frames showcasing family milestones lines the fireplace mantel.",
    exampleArabic:
      "تَصْطَفُّ مَجْمُوعَةٌ مِنْ إِطَارَاتِ الصُّوَرِ الفِضِّيَّةِ التَّذْكَارِيَّةِ عَلَى رَفِّ المِدْفَأَةِ.",
  },
  "picture-frame": {
    id: "picture-frame",
    arabic: "إِطَارُ الصُّورَة (بِرْوَاز)",
    partOfSpeech: "noun",
    phonetic: "ˈpɪk.tʃər ˌfreɪm",
    pronunciationTip: "Clear 'ch' sound in 'picture' (/ˈpɪk.tʃər/), stress on first word.",
    collocations: [
      "wooden picture frame",
      "family picture frame",
      "hang a picture frame",
      "silver picture frame",
      "photo frame on desk",
      "glass picture frame",
    ],
    phrasalVerbs: [
      {
        phrase: "hang up",
        meaning: "mount a framed picture on a wall",
        arabic: "يُعَلِّقُ الإِطَارَ عَلَى الجِدَار",
        example: "They hung up the picture frame above the fireplace.",
      },
      {
        phrase: "put in",
        meaning: "insert a photograph into a frame",
        arabic: "يَضَعُ الصُّورَةَ فِي البِرْوَاز",
        example: "She put her graduation photo in a silver picture frame.",
      },
    ],
    sentences: [
      {
        context: "Family Memories",
        en: "A silver picture frame holding a family portrait sits on the mantel.",
        ar: "يَسْتَقِرُّ إِطَارُ صُورَةٍ فِضِّيٌّ يَحْمِلُ صُورَةً عَائِلِيَّةً عَلَى رَفِّ المِدْفَأَةِ.",
      },
      {
        context: "Wall Decoration",
        en: "She hung three matching black picture frames along the hallway wall.",
        ar: "عَلَّقَتْ ثَلاثَةَ إِطَارَاتِ صُوَرٍ سَوْدَاءَ مُتَطَابِقَةٍ عَلَى جِدَارِ المَمَرِّ.",
      },
      {
        context: "Gifting",
        en: "He gave his grandmother a handcrafted wooden picture frame for her birthday.",
        ar: "أَهْدَى جَدَّتَهُ إِطَارَ صُورَةٍ خَشَبِيّاً مَصْنُوعاً يَدَوِيّاً فِي عِيدِ مِيلادِهَا.",
      },
    ],
    exampleSentence: "A silver picture frame holding a family portrait sits on the mantel.",
    exampleArabic:
      "يَسْتَقِرُّ إِطَارُ صُورَةٍ فِضِّيٌّ يَحْمِلُ صُورَةً عَائِلِيَّةً عَلَى رَفِّ المِدْفَأَةِ.",
  },
  pig: {
    id: "pig",
    arabic: "خِنْزِير",
    partOfSpeech: "noun",
    phonetic: "pɪɡ",
    pronunciationTip: "Short 'i' vowel /ɪ/ as in 'big' or 'dig'.",
    collocations: ["pig pen", "muddy pig", "feed the pigs", "piglet", "pig snout", "sow and pigs"],
    phrasalVerbs: [
      {
        phrase: "pig out",
        meaning: "(idiom) eat a large amount of food greedily",
        arabic: "يَأْكُلُ بِشَرَاهَة",
        example: "We pigged out on pizza and ice cream after the match.",
      },
    ],
    sentences: [
      {
        context: "Farm Life",
        en: "The cheerful pig rolled happily in the cool mud to protect its skin from the sun.",
        ar: "تَمَرَّغَ الخِنْزِيرُ فِي الطِّينِ البَارِدِ لِحِمَايَةِ جِلْدِهِ مِنْ حَرَارَةِ الشَّمْسِ.",
      },
      {
        context: "Feeding Chores",
        en: "The farmer poured a bucket of fresh grain and chopped vegetables into the pig pen.",
        ar: "سَكَبَ المُزَارِعُ دَلْواً مِنَ الحُبُوبِ وَالخُضْرَاوَاتِ المَفْرُومَةِ فِي حَظِيرَةِ الخَنَازِيرِ.",
      },
      {
        context: "Animal Behavior",
        en: "Pigs are highly intelligent animals with a keen sense of curiosity and smell.",
        ar: "تُعَدُّ الخَنَازِيرُ حَيَوَانَاتٍ ذَكِيَّةً جِدّاً وَتَمْتَلِكُ حَاسَّةَ شَمٍّ حَادَّةً.",
      },
    ],
    exampleSentence:
      "The cheerful pig rolled happily in the cool mud to protect its skin from the sun.",
    exampleArabic:
      "تَمَرَّغَ الخِنْزِيرُ فِي الطِّينِ البَارِدِ لِحِمَايَةِ جِلْدِهِ مِنْ حَرَارَةِ الشَّمْسِ.",
  },
  pillow: {
    id: "pillow",
    arabic: "وِسَادَة / مِخَدَّة",
    partOfSpeech: "noun",
    phonetic: "ˈpɪl.oʊ",
    pronunciationTip: "Short 'i' sound followed by a soft 'low' (/oʊ/).",
    collocations: [
      "soft pillow",
      "fluff the pillow",
      "pillow fight",
      "feather pillow",
      "memory foam pillow",
      "rest on a pillow",
    ],
    phrasalVerbs: [
      {
        phrase: "rest on",
        meaning: "place one's head comfortably on a pillow",
        arabic: "يَسْتَرِيحُ عَلَى",
        example: "He rested his tired head on the soft feather pillow.",
      },
      {
        phrase: "prop up",
        meaning: "support with pillows",
        arabic: "يَسْنِدُ بِالوِسَادَة",
        example: "She propped herself up with two cushions to read in bed.",
      },
    ],
    sentences: [
      {
        context: "Bedtime Comfort",
        en: "He fluffed his pillow to get comfortable before falling asleep.",
        ar: "نَفَشَ وِسَادَتَهُ لِيَشْعُرَ بِالرَّاحَةِ قَبْلَ أَنْ يَسْتَغْرِقَ فِي النَّوْمِ.",
      },
      {
        context: "Sleep Health",
        en: "An orthopedic memory foam pillow supports neck alignment.",
        ar: "تُسَاعِدُ وِسَادَةُ الفُومِ الطِّبِّيَّةُ فِي دَعْمِ اسْتِقَامَةِ الرَّقَبَةِ.",
      },
      {
        context: "Bed Dressing",
        en: "Four decorative cushions and two sleeping pillows adorn the bed.",
        ar: "تُزَيِّنُ السَّرِيرَ أَرْبَعُ وِسَادَاتِ زِينَةٍ وَوِسَادَتَا نَوْمٍ مَرِيحَتَانِ.",
      },
    ],
    exampleSentence: "He fluffed his pillow to get comfortable before falling asleep.",
    exampleArabic:
      "نَفَشَ وِسَادَتَهُ لِيَشْعُرَ بِالرَّاحَةِ قَبْلَ أَنْ يَسْتَغْرِقَ فِي النَّوْمِ.",
  },
  pillowcase: {
    id: "pillowcase",
    arabic: "غِطَاءُ الوِسَادَة (كِيسُ المِخَدَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈpɪl.oʊ.keɪs",
    pronunciationTip: "Compound word: 'PILLOW' + 'CASE'.",
    collocations: [
      "cotton pillowcase",
      "silk pillowcase",
      "change the pillowcase",
      "matching pillowcase",
      "clean pillowcase",
      "wash the pillowcase",
    ],
    phrasalVerbs: [
      {
        phrase: "slip on",
        meaning: "put a pillowcase onto a pillow",
        arabic: "يُلْبِسُ الغِطَاءَ لِلْوِسَادَة",
        example: "She slipped a clean silk pillowcase onto her pillow.",
      },
      {
        phrase: "pull off",
        meaning: "remove the pillowcase",
        arabic: "يَنْزِعُ كِيسَ الوِسَادَة",
        example: "He pulled off the dirty pillowcase to wash it with the laundry.",
      },
    ],
    sentences: [
      {
        context: "Skincare & Sleep",
        en: "Using a pure silk pillowcase is gentle on your hair and skin.",
        ar: "اسْتِخْدَامُ كِيسِ وِسَادَةٍ حَرِيرِيٍّ نَقِيٍّ لَطِيفٌ جِدّاً عَلَى الشَّعْرِ وَالبَشَرَةِ.",
      },
      {
        context: "Cleaning Routine",
        en: "She washes her pillowcases every week in warm soapy water.",
        ar: "تَغْسِلُ أَكْيَاسَ الوِسَادَاتِ أُسْبُوعِيّاً فِي مَاءٍ دَافِئٍ وَصَابُونٍ.",
      },
      {
        context: "Bedding Set",
        en: "The bed set includes a fitted sheet and two matching pillowcases.",
        ar: "يَشْمَلُ طَقْمُ السَّرِيرِ شَرْشَفاً مُلائِمِاً وَغِطَاءَيْنِ مُتَطَابِقَيْنِ لِلْوِسَادَاتِ.",
      },
    ],
    exampleSentence: "Using a pure silk pillowcase is gentle on your hair and skin.",
    exampleArabic:
      "اسْتِخْدَامُ كِيسِ وِسَادَةٍ حَرِيرِيٍّ نَقِيٍّ لَطِيفٌ جِدّاً عَلَى الشَّعْرِ وَالبَشَرَةِ.",
  },
  pitcher: {
    id: "pitcher",
    arabic: "إِبْرِيق (دَوْرَقُ مَاء / شَفْشَق)",
    partOfSpeech: "noun",
    phonetic: "ˈpɪtʃ.ər",
    pronunciationTip: "Short 'i' sound /ɪ/ followed by crisp 'ch' (/ˈpɪtʃ.ər/).",
    collocations: [
      "water pitcher",
      "glass pitcher",
      "pitcher of iced tea",
      "pour from a pitcher",
      "lemonade pitcher",
      "fill the pitcher",
    ],
    phrasalVerbs: [
      {
        phrase: "pour out",
        meaning: "dispense drink from a pitcher",
        arabic: "يَصُبُّ مِنَ الإِبْرِيق",
        example: "He poured out cool lemonade from the pitcher into four glasses.",
      },
    ],
    sentences: [
      {
        context: "Summer Refreshment",
        en: "She placed a glass pitcher filled with iced lemonade and mint leaves on the table.",
        ar: "وَضَعَتْ دَوْرَقاً زُجَاجِيّاً مَمْلُوءاً بِاللَّيْمُونَادَةِ المُثَلَّجَةِ وَأَوْرَاقِ النَّعْنَاعِ عَلَى الطَّاوِلَةِ.",
      },
      {
        context: "Dining Service",
        en: "The waiter refilled all water glasses from a chilled stainless steel pitcher.",
        ar: "أَعَادَ النَّادِلُ مَلْءَ كُؤُوسِ المَاءِ مِنْ دَوْرَقٍ سْتَانْلِس مُبَرَّدٍ.",
      },
      {
        context: "Breakfast Table",
        en: "A ceramic pitcher of freshly squeezed orange juice complements the morning brunch.",
        ar: "يُتَمِّمُ إِبْرِيقُ عَصِيرِ البُرْتُقَالِ الطَّازَجِ الخَزَفِيُّ مَائِدَةَ الإِفْطَارِ الصَّبَاحِيَّةِ.",
      },
    ],
    exampleSentence:
      "She placed a glass pitcher filled with iced lemonade and mint leaves on the table.",
    exampleArabic:
      "وَضَعَتْ دَوْرَقاً زُجَاجِيّاً مَمْلُوءاً بِاللَّيْمُونَادَةِ المُثَلَّجَةِ وَأَوْرَاقِ النَّعْنَاعِ عَلَى الطَّاوِلَةِ.",
  },
  pitchfork: {
    id: "pitchfork",
    arabic: "مِذْرَاة (مِذْرَاةُ قَشّ)",
    partOfSpeech: "noun",
    phonetic: "ˈpɪtʃ.fɔːrk",
    pronunciationTip: "Compound noun: 'PITCH' (/pɪtʃ/) + 'FORK' (/fɔːrk/).",
    collocations: [
      "steel pitchfork",
      "lift hay with a pitchfork",
      "three-prong pitchfork",
      "pitchfork handle",
      "toss with a pitchfork",
      "barn pitchfork",
    ],
    phrasalVerbs: [
      {
        phrase: "pitch up",
        meaning: "toss hay or straw using a pitchfork",
        arabic: "يَرْفَعُ القَشَّ بِالمِذْرَاة",
        example: "Pitch up the dry straw into the animal bedding stalls.",
      },
    ],
    sentences: [
      {
        context: "Hay Handling",
        en: "He used a long-handled steel pitchfork to toss fresh golden hay into the cattle mangers.",
        ar: "اسْتَخْدَمَ مِذْرَاةً فُولاذِيَّةً طَوِيلَةَ المِقْبَضِ لِرَفْعِ القَشِّ الذَّهَبِيِّ لِمَعَالِفِ الأَبْقَارِ.",
      },
      {
        context: "Barn Cleaning",
        en: "The farmhand gathered loose straw across the barn floor with a four-prong pitchfork.",
        ar: "جَمَعَ عَامِلُ المَزْرَعَةِ القَشَّ المُتَنَاثِرَ بِاسْتِخْدَامِ مِذْرَاةٍ رُبَاعِيَّةِ الأَسْنَانِ.",
      },
      {
        context: "Tool Safety",
        en: "Always stand pitchforks securely upright in tool racks when not in use.",
        ar: "ثَبِّتِ المَذَارِيَ دَائِماً بِأَمَانٍ فِي حَوَامِلِ الأَدَوَاتِ عِنْدَ الاِنْتِهَاءِ مِنْهَا.",
      },
    ],
    exampleSentence:
      "He used a long-handled steel pitchfork to toss fresh golden hay into the cattle mangers.",
    exampleArabic:
      "اسْتَخْدَمَ مِذْرَاةً فُولاذِيَّةً طَوِيلَةَ المِقْبَضِ لِرَفْعِ القَشِّ الذَّهَبِيِّ لِمَعَالِفِ الأَبْقَارِ.",
  },
  placemat: {
    id: "placemat",
    arabic: "مَفْرَشُ طَبَق (مَفْرَشٌ فَرْدِيّ)",
    partOfSpeech: "noun",
    phonetic: "ˈpleɪs.mæt",
    pronunciationTip: "Compound noun: 'PLACE' (/pleɪs/) + 'MAT' (/mæt/).",
    collocations: [
      "woven placemat",
      "wipe-clean placemat",
      "set the placemat",
      "bamboo placemat",
      "fabric placemat",
      "placemat and coaster",
    ],
    phrasalVerbs: [
      {
        phrase: "set out",
        meaning: "arrange placemats at each table setting",
        arabic: "يُرَتِّبُ مَفَارِشَ الأَطْبَاق",
        example: "Set out four woven placemats for the dinner guests.",
      },
    ],
    sentences: [
      {
        context: "Table Setting",
        en: "She set a round woven jute placemat under each dinner plate to protect the wood.",
        ar: "وَضَعَتْ مَفْرَشاً فَرْدِيّاً دَائِرِيّاً مَصْنُوعاً مِنَ الخَيْشِ تَحْتَ كُلِّ طَبَقٍ لِحِمَايَةِ الخَشَبِ.",
      },
      {
        context: "Easy Cleanup",
        en: "Waterproof wipe-clean placemats are ideal for daily family meals with young children.",
        ar: "تُعَدُّ مَفَارِشُ الأَطْبَاقِ المُقَاوِمَةُ لِلْمَاءِ وَسَهْلَةُ المَسْحِ مِثَالِيَّةً لِوَجَبَاتِ الأَطْفَالِ.",
      },
      {
        context: "Decor Harmony",
        en: "Neutral grey placemats contrast beautifully against the warm tones of the oak table.",
        ar: "تَتَنَاغَمُ مَفَارِشُ الأَطْبَاقِ الرَّمَادِيَّةُ الهَادِئَةُ بِشَكْلٍ رَائِعٍ مَعَ خَشَبِ البَلُّوطِ الدَّافِئِ.",
      },
    ],
    exampleSentence:
      "She set a round woven jute placemat under each dinner plate to protect the wood.",
    exampleArabic:
      "وَضَعَتْ مَفْرَشاً فَرْدِيّاً دَائِرِيّاً مَصْنُوعاً مِنَ الخَيْشِ تَحْتَ كُلِّ طَبَقٍ لِحِمَايَةِ الخَشَبِ.",
  },
  plant: {
    id: "plant",
    arabic: "نَبْتَة مَنْزِلِيَّة (زَرْع)",
    partOfSpeech: "noun",
    phonetic: "plænt",
    pronunciationTip:
      "Short 'a' vowel in American English (/plænt/), broad 'ah' in British English (/plɑːnt/).",
    collocations: [
      "water the plant",
      "potted plant",
      "green indoor plant",
      "windowsill plant",
      "care for a plant",
      "healthy plant",
    ],
    phrasalVerbs: [
      {
        phrase: "grow up",
        meaning: "develop and increase in size",
        arabic: "يَنْمُو وَيَكْبُر",
        example: "The climbing plant grew up along the balcony railing.",
      },
      {
        phrase: "look after",
        meaning: "care for a houseplant",
        arabic: "يَعْتَنِي بِـ",
        example: "Can you look after my indoor plants while I am away on vacation?",
      },
    ],
    sentences: [
      {
        context: "Plant Care",
        en: "Remember to water the potted plant twice a week and keep it in sunlight.",
        ar: "تَذَكَّرْ أَنْ تَرْوِيَ النَّبْتَةَ فِي الأَصِيصِ مَرَّتَيْنِ أُسْبُوعِيّاً مَعَ تَعْرِيضِهَا لِلشَّمْسِ.",
      },
      {
        context: "Room Ambiance",
        en: "A lush green plant on the desk makes the study space feel fresh and lively.",
        ar: "تَجْعَلُ النَّبْتَةُ الخَضْرَاءُ النَّضِرَةُ عَلَى المَكْتَبِ مَكَانَ الدِّرَاسَةِ مُفْعَماً بِالحَيَوِيَّةِ.",
      },
      {
        context: "Air Quality",
        en: "Indoor plants help purify the air and enhance overall well-being.",
        ar: "تُسَاعِدُ النَّبَاتَاتُ المَنْزِلِيَّةُ فِي تَنْقِيَةِ الهَوَاءِ وَتَحْسِينِ المِزَاجِ العَامِّ.",
      },
    ],
    exampleSentence: "Remember to water the potted plant twice a week and keep it in sunlight.",
    exampleArabic:
      "تَذَكَّرْ أَنْ تَرْوِيَ النَّبْتَةَ فِي الأَصِيصِ مَرَّتَيْنِ أُسْبُوعِيّاً مَعَ تَعْرِيضِهَا لِلشَّمْسِ.",
  },
  "plastic-wrap": {
    id: "plastic-wrap",
    arabic: "نَايْلُون تَغْلِيف (بَلاسْتِيك غِذَائِيّ)",
    partOfSpeech: "noun",
    phonetic: "ˈplæs.tɪk ˌræp",
    pronunciationTip: "Silent 'w' in 'wrap' (/ræp/), rhyming with 'cap' or 'tap'.",
    collocations: [
      "roll of plastic wrap",
      "cover with plastic wrap",
      "cling plastic wrap",
      "seal with plastic wrap",
      "stretch plastic wrap",
      "food plastic wrap",
    ],
    phrasalVerbs: [
      {
        phrase: "wrap up",
        meaning: "cover food completely for storage",
        arabic: "يُغَلِّفُ بِالنَّايْلُون",
        example: "Wrap up the leftover lasagna tightly with plastic wrap.",
      },
      {
        phrase: "seal up",
        meaning: "make airtight with plastic wrap",
        arabic: "يُحْكِمُ الإِغْلاق",
        example: "Seal up the salad bowl to keep the greens crisp.",
      },
    ],
    sentences: [
      {
        context: "Food Freshness",
        en: "Cover the cut watermelon with plastic wrap to keep it juicy in the fridge.",
        ar: "غَطِّ البِطِّيخَ المُقَطَّعَ بِنَايْلُونِ التَّغْلِيفِ لِيَبْقَى طَازَجاً وَرَطْباً فِي الثَّلَّاجَةِ.",
      },
      {
        context: "Dough Resting",
        en: "Wrap the cookie dough ball in plastic wrap and chill it for thirty minutes.",
        ar: "غَلِّفْ كُرَةَ عَجِينِ الكُوكِيز بِالبَلاسْتِيكِ الغِذَائِيِّ وَاتْرُكْهَا تَبْرُدُ 30 دَقِيقَةً.",
      },
      {
        context: "Kitchen Dispenser",
        en: "Use the sharp sliding cutter on the box to slice plastic wrap cleanly.",
        ar: "اسْتَخْدِمْ شَفْرَةَ القَطْعِ المُنْزَلِقَةَ عَلَى العُلْبَةِ لِقَطْعِ النَّايْلُونِ بِدِقَّةٍ.",
      },
    ],
    exampleSentence: "Cover the cut watermelon with plastic wrap to keep it juicy in the fridge.",
    exampleArabic:
      "غَطِّ البِطِّيخَ المُقَطَّعَ بِنَايْلُونِ التَّغْلِيفِ لِيَبْقَى طَازَجاً وَرَطْباً فِي الثَّلَّاجَةِ.",
  },
  plate: {
    id: "plate",
    arabic: "طَبَق / صَحْن",
    partOfSpeech: "noun",
    phonetic: "pleɪt",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'late' or 'gate'.",
    collocations: [
      "dinner plate",
      "empty plate",
      "pile food on a plate",
      "ceramic plate",
      "clear the plates",
      "side plate",
    ],
    phrasalVerbs: [
      {
        phrase: "plate up",
        meaning: "arrange food artfully on plates to serve",
        arabic: "يَسْكُبُ وَيُزَيِّنُ الطَّبَق",
        example: "The chef plated up the grilled fish with lemon slices.",
      },
      {
        phrase: "clean off",
        meaning: "eat everything on your plate",
        arabic: "يُنْهِي طَبَقَهُ",
        example: "The hungry boy cleaned off his entire plate in minutes.",
      },
    ],
    sentences: [
      {
        context: "Serving Dinner",
        en: "She served the steaming roast chicken on a large white ceramic plate.",
        ar: "قَدَّمَتِ الدَّجَاجَ المَشْوِيَّ السَّاخِنَ عَلَى طَبَقٍ خَزَفِيٍّ أَبْيَضَ كَبِيرٍ.",
      },
      {
        context: "Table Setting",
        en: "Set the dinner plate in the center, flanked by the fork, knife, and napkin.",
        ar: "ضَعْ طَبَقَ الطَّعَامِ فِي المُنْتَصَفِ، مُحَاطاً بِالشَّوْكَةِ وَالسِّكِّينِ وَالمَنْدِيلِ.",
      },
      {
        context: "Clearing the Table",
        en: "The children helped clear the dirty plates and carried them to the sink.",
        ar: "سَاعَدَ الأَطْفَالُ فِي رَفْعِ الأَطْبَاقِ المُتَّسِخَةِ وَحَمْلِهَا إِلَى حَوْضِ الجَلِي.",
      },
    ],
    exampleSentence: "She served the steaming roast chicken on a large white ceramic plate.",
    exampleArabic:
      "قَدَّمَتِ الدَّجَاجَ المَشْوِيَّ السَّاخِنَ عَلَى طَبَقٍ خَزَفِيٍّ أَبْيَضَ كَبِيرٍ.",
  },
  plow: {
    id: "plow",
    arabic: "مِحْرَاث",
    partOfSpeech: "noun",
    phonetic: "plaʊ",
    pronunciationTip:
      "Diphthong 'ow' sound /aʊ/ as in 'now' or 'how'. Also spelled 'plough' in British English.",
    collocations: [
      "tractor plow",
      "plow the field",
      "heavy plow",
      "sharp plow blade",
      "horse-drawn plow",
      "turn soil with a plow",
    ],
    phrasalVerbs: [
      {
        phrase: "plow through",
        meaning: "move forcefully through soil or work",
        arabic: "يَشُقُّ طَرِيقَهُ",
        example: "The tractor plowed through the tough dry soil with ease.",
      },
    ],
    sentences: [
      {
        context: "Soil Preparation",
        en: "The steel plow turned over the dark rich soil, preparing the ground for spring planting.",
        ar: "قَلَّبَ المِحْرَاثُ الفُولاذِيُّ التُّرْبَةَ الخَصْبَةَ لِتَجْهِيزِ الأَرْضِ لِزِرَاعَةِ الرَّبِيعِ.",
      },
      {
        context: "Historical Farming",
        en: "Centuries ago, farmers used pairs of strong oxen to pull heavy wooden plows.",
        ar: "قَبْلَ قُرُونٍ، اسْتَخْدَمَ المُزَارِعُونَ الثِّيرَانَ القَوِيَّةَ لِسَحْبِ المَحَارِيثِ الخَشَبِيَّةِ.",
      },
      {
        context: "Modern Implements",
        en: "Multi-furrow hydraulic plows allow one tractor to cultivate dozens of acres daily.",
        ar: "تُتِيحُ المَحَارِيثُ الهَيْدْرُولِيكِيَّةُ الحَدِيثَةُ حِرَاثَةَ عَشَرَاتِ الأَفْدِنَةِ يَوْمِيّاً.",
      },
    ],
    exampleSentence:
      "The steel plow turned over the dark rich soil, preparing the ground for spring planting.",
    exampleArabic:
      "قَلَّبَ المِحْرَاثُ الفُولاذِيُّ التُّرْبَةَ الخَصْبَةَ لِتَجْهِيزِ الأَرْضِ لِزِرَاعَةِ الرَّبِيعِ.",
  },
  plug: {
    id: "plug",
    arabic: "قَابِسُ كَهْرَبَاء (فِيشَة)",
    partOfSpeech: "noun",
    phonetic: "plʌɡ",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'cup' or 'rug'.",
    collocations: [
      "electric plug",
      "insert the plug",
      "pull the plug",
      "three-pin plug",
      "plug into the socket",
      "grounded plug",
    ],
    phrasalVerbs: [
      {
        phrase: "plug in",
        meaning: "insert plug into an electrical outlet",
        arabic: "يَصِلُ بِالقَابِس",
        example: "Plug in the vacuum cleaner to the hallway outlet.",
      },
      {
        phrase: "pull out",
        meaning: "remove plug by holding the plastic casing",
        arabic: "يَنْزِعُ الفِيشَة",
        example: "Always grip the plug head when pulling it out of the wall.",
      },
    ],
    sentences: [
      {
        context: "Electrical Connection",
        en: "She inserted the three-prong electric plug firmly into the grounded wall outlet.",
        ar: "أَدْخَلَتْ قَابِسَ الكَهْرَبَاءِ الثُّلاثِيَّ بِإِحْكَامٍ فِي مِقْبَسِ الجِدَارِ المُؤَرَّضِ.",
      },
      {
        context: "Safety",
        en: "Never pull a plug out by tugging on the cord; always grip the solid plug casing.",
        ar: "لا تَنْزِعِ الفِيشَةَ أَبَداً بِشَدِّ السِّلْكِ؛ بَلْ أَمْسِكْ بِجِسْمِ القَابِسِ نَفْسِهِ.",
      },
      {
        context: "Travel Adapters",
        en: "Pack a universal adapter plug when traveling internationally across Europe.",
        ar: "احْزِمْ قَابِسَ مُحَوِّلٍ شَامِلاً عِنْدَ السَّفَرِ دَوْلِيّاً عَبْرَ الدُّوَلِ الأُورُوبِّيَّةِ.",
      },
    ],
    exampleSentence:
      "She inserted the three-prong electric plug firmly into the grounded wall outlet.",
    exampleArabic:
      "أَدْخَلَتْ قَابِسَ الكَهْرَبَاءِ الثُّلاثِيَّ بِإِحْكَامٍ فِي مِقْبَسِ الجِدَارِ المُؤَرَّضِ.",
  },
  pond: {
    id: "pond",
    arabic: "بِرْكَةُ مَاء (غَدِير)",
    partOfSpeech: "noun",
    phonetic: "pɑːnd",
    pronunciationTip: "Short open 'o' vowel /ɑː/ as in 'pond' or 'bond'.",
    collocations: [
      "duck pond",
      "swim in the pond",
      "calm pond",
      "lily pads on the pond",
      "fish pond",
      "farm pond",
    ],
    phrasalVerbs: [
      {
        phrase: "swim across",
        meaning: "paddle through the water",
        arabic: "يَسْبَحُ عَبْرَ البِرْكَة",
        example: "The mallard ducks swam across the lily-covered farm pond.",
      },
    ],
    sentences: [
      {
        context: "Wildlife Oasis",
        en: "Green bullfrogs croaked peacefully along the muddy banks of the willow-shaded farm pond.",
        ar: "نَقَّتِ الضَّفَادِعُ الخَضْرَاءُ بِهُدُوءٍ عَلَى ضِفَافِ بِرْكَةِ المَزْرَعَةِ المُظَلَّلَةِ بِالصَّفْصَافِ.",
      },
      {
        context: "Water Lily",
        en: "Pink and white water lilies bloomed beautifully across the calm surface of the fish pond.",
        ar: "تَفَتَّحَتْ زَنَابِقُ المَاءِ الوَرْدِيَّةُ وَالبَيْضَاءُ بِرَوْعَةٍ عَلَى سَطْحِ البِرْكَةِ الهَادِئَةِ.",
      },
      {
        context: "Livestock Water",
        en: "Cattle gather near the deep farm pond during hot summer afternoons to drink and cool off.",
        ar: "تَجْتَمِعُ المَاشِيَةُ قُرْبَ بِرْكَةِ المَاءِ فِي أَيَّامِ الصَّيْفِ لِلشُّرْبِ وَالتَّبَرُّدِ.",
      },
    ],
    exampleSentence:
      "Green bullfrogs croaked peacefully along the muddy banks of the willow-shaded farm pond.",
    exampleArabic:
      "نَقَّتِ الضَّفَادِعُ الخَضْرَاءُ بِهُدُوءٍ عَلَى ضِفَافِ بِرْكَةِ المَزْرَعَةِ المُظَلَّلَةِ بِالصَّفْصَافِ.",
  },
  poster: {
    id: "poster",
    arabic: "مُلْصَقٌ جِدَارِيّ (بُوسْتَر)",
    partOfSpeech: "noun",
    phonetic: "ˈpoʊ.stər",
    pronunciationTip: "Long 'o' sound /oʊ/ as in 'post' or 'most'.",
    collocations: [
      "wall poster",
      "hang a poster",
      "colorful poster",
      "movie poster",
      "bedroom poster",
      "framed poster",
    ],
    phrasalVerbs: [
      {
        phrase: "put up",
        meaning: "attach a poster to a wall",
        arabic: "يُعَلِّقُ مُلْصَقاً عَلَى الجِدَار",
        example: "He put up a poster of his favorite band in his bedroom.",
      },
      {
        phrase: "take down",
        meaning: "remove a poster from a wall",
        arabic: "يُنْزِلُ المُلْصَق",
        example: "They took down the old posters before repainting the room.",
      },
    ],
    sentences: [
      {
        context: "Teen Bedroom",
        en: "His bedroom walls are covered with colorful posters of classic vintage cars.",
        ar: "جُدْرَانُ غُرْفَةِ نَوْمِهِ مُغَطَّاةٌ بِمُلْصَقَاتٍ مُلَوَّنَةٍ لِسَيَّارَاتٍ كِلاسِيكِيَّةٍ قَدِيمَةٍ.",
      },
      {
        context: "Wall Art",
        en: "She framed a scenic travel poster to hang above her study desk.",
        ar: "وَضَعَتْ مُلْصَقَ سَفَرٍ طَبِيعِيّاً فِي إِطَارٍ لِتُعَلِّقَهُ فَوْقَ مَكْتَبِ الدِّرَاسَةِ.",
      },
      {
        context: "Education",
        en: "The teacher displayed an educational world map poster in the study area.",
        ar: "عَرَضَ المُعَلِّمُ مُلْصَقَ خَرِيطَةِ العَالَمِ التَّعْلِيمِيَّ فِي مِسَاحَةِ الدِّرَاسَةِ.",
      },
    ],
    exampleSentence: "His bedroom walls are covered with colorful posters of classic vintage cars.",
    exampleArabic:
      "جُدْرَانُ غُرْفَةِ نَوْمِهِ مُغَطَّاةٌ بِمُلْصَقَاتٍ مُلَوَّنَةٍ لِسَيَّارَاتٍ كِلاسِيكِيَّةٍ قَدِيمَةٍ.",
  },
  pot: {
    id: "pot",
    arabic: "قِدْر / حَلَّة",
    partOfSpeech: "noun",
    phonetic: "pɑːt",
    pronunciationTip: "Short open 'o' sound /ɑː/ as in 'hot' or 'not'.",
    collocations: [
      "cooking pot",
      "pot of soup",
      "heavy pot",
      "pot lid",
      "boil in a pot",
      "stainless steel pot",
    ],
    phrasalVerbs: [
      {
        phrase: "simmer away",
        meaning: "cook slowly in a pot",
        arabic: "يَنْضَجُ عَلَى نَارٍ هَادِئَة",
        example: "The beef stew simmered away in the large pot for three hours.",
      },
      {
        phrase: "stir up",
        meaning: "mix contents of a pot",
        arabic: "يُقَلِّبُ القِدْر",
        example: "Stir up the soup to prevent it from sticking to the bottom.",
      },
    ],
    sentences: [
      {
        context: "Family Dinner",
        en: "She simmered a large pot of aromatic lentil soup for the whole family.",
        ar: "طَبَخَتْ قِدْراً كَبِيراً مِنْ شُورْبَةِ العَدَسِ الشَّهِيَّةِ لِجَمِيعِ أَفْرَادِ العَائِلَةِ.",
      },
      {
        context: "Pasta Cooking",
        en: "Fill the deep pot with salted water and bring it to a rolling boil.",
        ar: "امْلَأِ القِدْرَ العَمِيقَ بِمَاءٍ مُمَلَّحٍ وَدَعْهُ يَصِلُ إِلَى دَرَجَةِ الغَلَيَانِ.",
      },
      {
        context: "Kitchen Equipment",
        en: "A cast-iron Dutch oven pot distributes heat evenly for slow braising.",
        ar: "يُوَزِّعُ قِدْرُ الزَّهْرِ الثَّقِيلُ الحَرَارَةَ بِالتَّسَاوِي لِلطَّهْيِ البَطِيءِ.",
      },
    ],
    exampleSentence: "She simmered a large pot of aromatic lentil soup for the whole family.",
    exampleArabic:
      "طَبَخَتْ قِدْراً كَبِيراً مِنْ شُورْبَةِ العَدَسِ الشَّهِيَّةِ لِجَمِيعِ أَفْرَادِ العَائِلَةِ.",
  },
  "power-strip": {
    id: "power-strip",
    arabic: "مُشْتَرَكُ كَهْرَبَاء (تَوْصِيلَة)",
    partOfSpeech: "noun",
    phonetic: "ˈpaʊ.ər ˌstrɪp",
    pronunciationTip: "Compound noun: 'POWER' (/ˈpaʊ.ər/) + 'STRIP' (/strɪp/).",
    collocations: [
      "surge protector power strip",
      "plug into the power strip",
      "multi-outlet power strip",
      "switch on the power strip",
      "overloaded power strip",
      "power strip cord",
    ],
    phrasalVerbs: [
      {
        phrase: "plug into",
        meaning: "connect plugs into strip outlets",
        arabic: "يَصِلُ بِالمُشْتَرَك",
        example: "Plug your laptop and phone charger into the power strip.",
      },
      {
        phrase: "switch off",
        meaning: "cut power using master switch",
        arabic: "يَفْصِلُ التَّيَّار",
        example: "Switch off the power strip before going on vacation to prevent vampire draw.",
      },
    ],
    sentences: [
      {
        context: "Workstation",
        en: "He plugged his desktop monitor, speakers, and lamp into a surge-protected power strip.",
        ar: "وَصَلَ شَاشَةَ الكُمْبِيُوتَرِ وَالسَّمَّاعَاتِ وَالمِصْبَاحَ بِمُشْتَرَكِ كَهْرَبَاءٍ مَحْمِيٍّ مِنَ التَّذَبْذُبِ.",
      },
      {
        context: "Electrical Safety",
        en: "Never daisy-chain multiple power strips together to avoid electrical fire hazards.",
        ar: "لا تَصِلْ أَبَداً عِدَّةَ مُشْتَرَكَاتِ كَهْرَبَاءٍ بِبَعْضِهَا تَفَادِياً لِمَخَاطِرِ الحَرِيقِ.",
      },
      {
        context: "Master Switch",
        en: "The illuminated red rocker switch shows clearly when the power strip is active.",
        ar: "يُوَضِّحُ المِفْتَاحُ الأَحْمَرُ المُضِيءُ مَتَى يَكُونُ مُشْتَرَكُ الكَهْرَبَاءِ فِي وَضْعِ التَّشْغِيلِ.",
      },
    ],
    exampleSentence:
      "He plugged his desktop monitor, speakers, and lamp into a surge-protected power strip.",
    exampleArabic:
      "وَصَلَ شَاشَةَ الكُمْبِيُوتَرِ وَالسَّمَّاعَاتِ وَالمِصْبَاحَ بِمُشْتَرَكِ كَهْرَبَاءٍ مَحْمِيٍّ مِنَ التَّذَبْذُبِ.",
  },
  "pressure-cooker": {
    id: "pressure-cooker",
    arabic: "قِدْرُ الضَّغْط (حَلَّةُ بَرِيسْتُو)",
    partOfSpeech: "noun",
    phonetic: "ˈprɛʃ.ər ˌkʊk.ər",
    pronunciationTip: "Compound noun: 'PRESSURE' (/ˈprɛʃ.ər/) + 'COOKER' (/ˈkʊk.ər/).",
    collocations: [
      "electric pressure cooker",
      "cook in a pressure cooker",
      "pressure cooker valve",
      "release pressure",
      "pressure cooker lid",
      "instant pot",
    ],
    phrasalVerbs: [
      {
        phrase: "build up",
        meaning: "accumulate steam pressure",
        arabic: "يَتَرَاكَمُ الضَّغْط",
        example: "Wait for steam pressure to build up inside the cooker.",
      },
      {
        phrase: "release pressure",
        meaning: "vent steam safely",
        arabic: "يُفَرِّغُ البُخَار",
        example: "Safely release the steam valve before opening the lid.",
      },
    ],
    sentences: [
      {
        context: "Speed Cooking",
        en: "A modern electric pressure cooker cooks tough beef cuts tender in forty minutes.",
        ar: "يَطْبُخُ قِدْرُ الضَّغْطِ الكَهْرَبَائِيُّ الحَدِيثُ اللَّحْمَ لِيُصْبِحَ طَرِيّاً فِي 40 دَقِيقَةً.",
      },
      {
        context: "Cooking Beans",
        en: "Dried beans cook thoroughly in a pressure cooker without needing overnight soaking.",
        ar: "تَنْضَجُ البُقُولِيَّاتُ الجَافَّةُ فِي قِدْرِ الضَّغْطِ دُونَ الحَاجَةِ لِنَقْعِهَا طَوَالَ اللَّيْلِ.",
      },
      {
        context: "Safety",
        en: "Always check the rubber sealing ring and safety valve before securing the lid.",
        ar: "افْحَصْ دَائِماً حَلْقَةَ السِّيلِيكُون وَصِمَامَ الأَمَانِ قَبْلَ إِحْكَامِ إِغْلاقِ الغِطَاءِ.",
      },
    ],
    exampleSentence:
      "A modern electric pressure cooker cooks tough beef cuts tender in forty minutes.",
    exampleArabic:
      "يَطْبُخُ قِدْرُ الضَّغْطِ الكَهْرَبَائِيُّ الحَدِيثُ اللَّحْمَ لِيُصْبِحَ طَرِيّاً فِي 40 دَقِيقَةً.",
  },
  puzzle: {
    id: "puzzle",
    arabic: "لُغْز / أُحْجِيَّة (بَازِل / أَلْعَابُ تَرْكِيب)",
    partOfSpeech: "noun",
    phonetic: "ˈpʌz.əl",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'buzz', followed by soft syllabic /əl/.",
    collocations: [
      "jigsaw puzzle",
      "solve a puzzle",
      "crossword puzzle",
      "puzzle piece",
      "thousand-piece puzzle",
      "put together a puzzle",
    ],
    phrasalVerbs: [
      {
        phrase: "put together",
        meaning: "assemble puzzle pieces",
        arabic: "يُرَكِّبُ البَازِل",
        example: "They put together a thousand-piece landscape puzzle over the weekend.",
      },
      {
        phrase: "figure out",
        meaning: "solve a challenging puzzle",
        arabic: "يَحُلُّ اللُّغْز",
        example: "It took him an hour to figure out the wooden logic puzzle.",
      },
    ],
    sentences: [
      {
        context: "Family Activity",
        en: "They spent the rainy weekend putting together a challenging thousand-piece jigsaw puzzle.",
        ar: "قَضَوْا عُطْلَةَ نِهَايَةِ الأُسْبُوعِ المَاطِرَةَ فِي تَرْكِيبِ بَازِل أَلْفِ قِطْعَةٍ.",
      },
      {
        context: "Brain Exercise",
        en: "Solving daily crossword and Sudoku puzzles helps keep your mind sharp and active.",
        ar: "يُسَاعِدُ حَلُّ الكَلِمَاتِ المُتَقَاطِعَةِ وَالسُّودُوكُو اليَوْمِيِّ فِي تَنْشِيطِ الذِّهْنِ.",
      },
      {
        context: "Completing a Puzzle",
        en: "The sense of satisfaction when placing the final puzzle piece is wonderful.",
        ar: "الشُّعُورُ بِالإِنْجَازِ عِنْدَ وَضْعِ آخِرِ قِطْعَةِ بَازِل فِي مَكَانِهَا رَائِعٌ جِدّاً.",
      },
    ],
    exampleSentence:
      "They spent the rainy weekend putting together a challenging thousand-piece jigsaw puzzle.",
    exampleArabic:
      "قَضَوْا عُطْلَةَ نِهَايَةِ الأُسْبُوعِ المَاطِرَةَ فِي تَرْكِيبِ بَازِل أَلْفِ قِطْعَةٍ.",
  },
  rabbit: {
    id: "rabbit",
    arabic: "أَرْنَب",
    partOfSpeech: "noun",
    phonetic: "ˈræb.ɪt",
    pronunciationTip: "Short 'a' vowel /æ/ as in 'rab', followed by short /ɪt/.",
    collocations: [
      "pet rabbit",
      "hop like a rabbit",
      "rabbit hutch",
      "wild rabbit",
      "fluffy rabbit",
      "rabbit ears",
    ],
    phrasalVerbs: [
      {
        phrase: "hop away",
        meaning: "jump quickly to escape",
        arabic: "يَقْفِزُ مُبْتَعِداً",
        example: "The wild rabbit hopped away into the tall clover when it saw us.",
      },
    ],
    sentences: [
      {
        context: "Garden Visitor",
        en: "A cute brown rabbit nibbled quietly on crisp dandelion leaves in the vegetable garden.",
        ar: "قَضَمَ أَرْنَبٌ بُنِّيٌّ لَطِيفٌ أَوْرَاقَ الهِنْدَبَاءِ فِي حَدِيقَةِ الخُضْرَاوَاتِ بِهُدُوءٍ.",
      },
      {
        context: "Pet Care",
        en: "Clean the rabbit hutch and provide fresh timothy hay and clean water daily.",
        ar: "نَظِّفْ قَفَصَ الأَرْنَبِ وَوَفِّرْ لَهُ قَشَّ التِّيمُوثِي الطَّازَجَ وَالمَاءَ النَّقِيَّ يَوْمِيّاً.",
      },
      {
        context: "Speed & Agility",
        en: "The rabbit zigzagged swiftly through the meadow to outrun the barking puppy.",
        ar: "جَرَى الأَرْنَبُ بِسُرْعَةٍ وَتَمَوُّجٍ عَبْرَ المَرْجِ لِيَسْبِقَ الجَرْوَ النَّابِحَ.",
      },
    ],
    exampleSentence:
      "A cute brown rabbit nibbled quietly on crisp dandelion leaves in the vegetable garden.",
    exampleArabic:
      "قَضَمَ أَرْنَبٌ بُنِّيٌّ لَطِيفٌ أَوْرَاقَ الهِنْدَبَاءِ فِي حَدِيقَةِ الخُضْرَاوَاتِ بِهُدُوءٍ.",
  },
  rain: {
    id: "rain",
    arabic: "مَطَر (غَيْث)",
    partOfSpeech: "noun",
    phonetic: "reɪn",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'train' or 'pain'.",
    collocations: [
      "heavy rain",
      "gentle rain",
      "pouring rain",
      "sound of rain",
      "shelter from the rain",
      "forecast of rain",
    ],
    phrasalVerbs: [
      {
        phrase: "pour down",
        meaning: "rain heavily",
        arabic: "يَهْطُلُ بِغَزَارَة",
        example: "The rain poured down all night, filling the farm pond.",
      },
      {
        phrase: "clear up",
        meaning: "stop raining and become sunny",
        arabic: "يَصْفُو الجَوّ",
        example: "The skies cleared up after the brief afternoon rain shower.",
      },
    ],
    sentences: [
      {
        context: "Crops Nourishment",
        en: "The gentle overnight rain soaked deeply into the thirsty soil, reviving the young corn sprouts.",
        ar: "أَنْعَشَ المَطَرُ اللَّيْلِيُّ الهَادِئُ التُّرْبَةَ العَطْشَى وَأَحْيَا بَرَاعِمَ الذُّرَةِ الصَّغِيرَةِ.",
      },
      {
        context: "Cozy Indoors",
        en: "Listening to the rhythmic patter of rain against the barn metal roof is deeply calming.",
        ar: "الاِسْتِمَاعُ إِلَى صَوْتِ قَطَرَاتِ المَطَرِ عَلَى سَقْفِ الحَظِيرَةِ يَبْعَثُ عَلَى الرَّاحَةِ.",
      },
      {
        context: "Weather Planning",
        en: "Farmers harvest dry hay in a rush before the predicted weekend rain arrives.",
        ar: "يُسَارِعُ المُزَارِعُونَ لِجَنْيِ القَشِّ قَبْلَ وُصُولِ مَوْجَةِ الأَمْطَارِ المُتَوَقَّعَةِ.",
      },
    ],
    exampleSentence:
      "The gentle overnight rain soaked deeply into the thirsty soil, reviving the young corn sprouts.",
    exampleArabic:
      "أَنْعَشَ المَطَرُ اللَّيْلِيُّ الهَادِئُ التُّرْبَةَ العَطْشَى وَأَحْيَا بَرَاعِمَ الذُّرَةِ الصَّغِيرَةِ.",
  },
  rake: {
    id: "rake",
    arabic: "مِشْطُ حَدِيقَة (مِجْرَفَةُ أَوْرَاق)",
    partOfSpeech: "noun",
    phonetic: "reɪk",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'make' or 'cake'.",
    collocations: [
      "leaf rake",
      "garden rake",
      "rake leaves",
      "pile of leaves with a rake",
      "steel garden rake",
      "smooth the soil with a rake",
    ],
    phrasalVerbs: [
      {
        phrase: "rake up",
        meaning: "gather leaves or debris into piles",
        arabic: "يَجْمَعُ بِالمِشْط",
        example: "Rake up the fallen autumn leaves across the lawn into piles.",
      },
      {
        phrase: "smooth out",
        meaning: "level soil using a metal rake",
        arabic: "يُسَوِّي الأَرْض",
        example: "Smooth out the garden bed before sowing flower seeds.",
      },
    ],
    sentences: [
      {
        context: "Autumn Cleanup",
        en: "The children had fun raking up golden autumn leaves into a gigantic pile to jump in.",
        ar: "اسْتَمْتَعَ الأَطْفَالُ بِجَمْعِ أَوْرَاقِ الخَرِيفِ الذَّهَبِيَّةِ بِالمِشْطِ فِي كَوْمَةٍ كَبِيرَةٍ.",
      },
      {
        context: "Soil Leveling",
        en: "He used a heavy steel garden rake to break up soil clods and level the seedbed.",
        ar: "اسْتَخْدَمَ مِشْطَ حَدِيقَةٍ صُلْباً لِتَفْتِيتِ كُتَلِ التُّرْبَةِ وَتَسْوِيَةِ مَهْدِ البُذُورِ.",
      },
      {
        context: "Gravel Driveways",
        en: "Smooth the gravel driveway with a wide rake to eliminate ruts after heavy rain.",
        ar: "سَوِّ مَمَرَّ الحَصَى بِمِشْطٍ عَرِيضٍ لِإِزَالَةِ الأَخَادِيدِ بَعْدَ هُطُولِ المَطَرِ.",
      },
    ],
    exampleSentence:
      "The children had fun raking up golden autumn leaves into a gigantic pile to jump in.",
    exampleArabic:
      "اسْتَمْتَعَ الأَطْفَالُ بِجَمْعِ أَوْرَاقِ الخَرِيفِ الذَّهَبِيَّةِ بِالمِشْطِ فِي كَوْمَةٍ كَبِيرَةٍ.",
  },
  "reading-light": {
    id: "reading-light",
    arabic: "مِصْبَاحُ قِرَاءَة (كِشَّافُ القِرَاءَة)",
    partOfSpeech: "noun",
    phonetic: "ˈriː.dɪŋ ˌlaɪt",
    pronunciationTip: "Compound noun with primary stress on 'READING' (/ˈriː.dɪŋ/).",
    collocations: [
      "clip-on reading light",
      "turn on the reading light",
      "flexible reading light",
      "bedside reading light",
      "adjustable reading light",
      "dim the reading light",
    ],
    phrasalVerbs: [
      {
        phrase: "clip onto",
        meaning: "attach a clip-on light to a book or headboard",
        arabic: "يُثَبِّتُ بِالمِشْبَك",
        example: "She clipped the reading light onto her novel.",
      },
      {
        phrase: "switch on",
        meaning: "activate the reading light",
        arabic: "يُشْعِلُ الضَّوْء",
        example: "Switch on the reading light so you don't disturb your partner.",
      },
    ],
    sentences: [
      {
        context: "Night Reading",
        en: "She attached a small clip-on reading light to her book so she wouldn't wake her roommate.",
        ar: "ثَبَّتَتْ مِصْبَاحَ قِرَاءَةٍ صَغِيرَاً بِمِشْبَكٍ عَلَى كِتَابِهَا حَتَّى لا تُوقِظَ زَمِيلَتَهَا.",
      },
      {
        context: "Bedside Fixture",
        en: "The flexible reading light mounted above the headboard bends in any direction.",
        ar: "يَنْحَنِي مِصْبَاحُ القِرَاءَةِ المَرِنُ المُثَبَّتُ فَوْقَ ظَهْرِ السَّرِيرِ فِي أَيِّ اتِّجَاهٍ.",
      },
      {
        context: "Eye Care",
        en: "Warm non-glare reading lights help protect your eyes during late-night study.",
        ar: "تُسَاعِدُ إِضَاءَةُ القِرَاءَةِ الدَّافِئَةُ المَانِعَةُ لِلتَّوَهُّجِ فِي حِمَايَةِ عَيْنَيْكَ أَثْنَاءَ الدِّرَاسَةِ اللَّيْلِيَّةِ.",
      },
    ],
    exampleSentence:
      "She attached a small clip-on reading light to her book so she wouldn't wake her roommate.",
    exampleArabic:
      "ثَبَّتَتْ مِصْبَاحَ قِرَاءَةٍ صَغِيرَاً بِمِشْبَكٍ عَلَى كِتَابِهَا حَتَّى لا تُوقِظَ زَمِيلَتَهَا.",
  },
  refrigerator: {
    id: "refrigerator",
    arabic: "ثَلَّاجَة (بَرَّاد)",
    partOfSpeech: "noun",
    phonetic: "rɪˈfrɪdʒ.ə.reɪ.tər",
    pronunciationTip: "Primary stress on the second syllable 'FRIDGE' (/ˈfrɪdʒ/).",
    collocations: [
      "open the refrigerator",
      "keep in the refrigerator",
      "refrigerator door",
      "clean the refrigerator",
      "stock the refrigerator",
      "stainless steel refrigerator",
    ],
    phrasalVerbs: [
      {
        phrase: "put away",
        meaning: "place groceries inside the fridge",
        arabic: "يَحْفَظُ فِي الثَّلَّاجَة",
        example: "She put away the fresh vegetables into the refrigerator crisper.",
      },
      {
        phrase: "take out",
        meaning: "remove an item from the fridge",
        arabic: "يُخْرِجُ مِنَ الثَّلَّاجَة",
        example: "He took out a carton of milk from the refrigerator.",
      },
    ],
    sentences: [
      {
        context: "Food Storage",
        en: "Keep dairy products and perishable food inside the refrigerator.",
        ar: "احْفَظْ مُنْتَجَاتِ الأَلْبَانِ وَالأَطْعِمَةَ سَرِيعَةَ التَّلَفِ دَاخِلَ الثَّلَّاجَةِ.",
      },
      {
        context: "Cooking Prep",
        en: "She took out fresh butter and eggs from the refrigerator to bake a cake.",
        ar: "أَخْرَجَتِ الزُّبْدَةَ الطَّازَجَةَ وَالبَيْضَ مِنَ الثَّلَّاجَةِ لِخَبْزِ الكَعْكَةِ.",
      },
      {
        context: "Cleaning",
        en: "He wipes down the refrigerator shelves every weekend to keep them hygienic.",
        ar: "يَمْسَحُ أَرْفُفَ الثَّلَّاجَةِ كُلَّ عُطْلَةِ أُسْبُوعٍ لِلْحِفَاظِ عَلَى نَظَافَتِهَا.",
      },
    ],
    exampleSentence: "Keep dairy products and perishable food inside the refrigerator.",
    exampleArabic:
      "احْفَظْ مُنْتَجَاتِ الأَلْبَانِ وَالأَطْعِمَةَ سَرِيعَةَ التَّلَفِ دَاخِلَ الثَّلَّاجَةِ.",
  },
  "remote-control": {
    id: "remote-control",
    arabic: "جِهَازُ التَّحَكُّم عَنْ بُعْد (رِيمُوت)",
    partOfSpeech: "noun",
    phonetic: "rɪˈmoʊt kənˌtroʊl",
    pronunciationTip: "Stress on 'MOTE' in remote (/rɪˈmoʊt/) and 'TROL' in control (/kənˈtroʊl/).",
    collocations: [
      "TV remote control",
      "reach for the remote control",
      "batteries for the remote",
      "point the remote",
      "press the button on the remote",
      "find the remote control",
    ],
    phrasalVerbs: [
      {
        phrase: "switch over",
        meaning: "change channels using the remote",
        arabic: "يُغَيِّرُ القَنَاة",
        example: "He used the remote to switch over to the evening news.",
      },
      {
        phrase: "turn down",
        meaning: "lower the volume with remote",
        arabic: "يَخْفِضُ الصَّوْت",
        example: "Press the remote button to turn down the loud commercials.",
      },
    ],
    sentences: [
      {
        context: "Television Watching",
        en: "He picked up the remote control and turned on the evening news broadcast.",
        ar: "تَنَاوَلَ جِهَازَ التَّحَكُّمِ عَنْ بُعْدٍ وَشَغَّلَ نَشْرَةَ أَخْبَارِ المَسَاءِ.",
      },
      {
        context: "Household Search",
        en: "They searched under the sofa cushions to find the lost TV remote control.",
        ar: "بَحَثُوا تَحْتَ وِسَادَاتِ الأَرِيكَةِ لِلْعُثُورِ عَلَى رِيمُوتِ التِّلْفَازِ المَفْقُودِ.",
      },
      {
        context: "Maintenance",
        en: "Replace the AAA batteries in the remote control when the buttons stop responding.",
        ar: "اسْتَبْدِلْ بَطَّارِيَّاتِ جِهَازِ التَّحَكُّمِ عِنْدَمَا تَتَوَقَّفُ الأَزْرَارُ عَنِ الاِسْتِجَابَةِ.",
      },
    ],
    exampleSentence: "He picked up the remote control and turned on the evening news broadcast.",
    exampleArabic:
      "تَنَاوَلَ جِهَازَ التَّحَكُّمِ عَنْ بُعْدٍ وَشَغَّلَ نَشْرَةَ أَخْبَارِ المَسَاءِ.",
  },
  rice: {
    id: "rice",
    arabic: "أَرُزّ (رُزّ)",
    partOfSpeech: "noun",
    phonetic: "raɪs",
    pronunciationTip: "Long 'i' diphthong /aɪ/ as in 'nice' or 'price'.",
    collocations: [
      "cooked rice",
      "white rice",
      "brown rice",
      "basmati rice",
      "bowl of rice",
      "jasmine rice",
    ],
    phrasalVerbs: [
      {
        phrase: "boil up",
        meaning: "cook rice in boiling water",
        arabic: "يَسْلُقُ الأَرُزّ",
        example: "Boil up two cups of fragrant jasmine rice.",
      },
      {
        phrase: "stir in",
        meaning: "add spices or butter to cooked rice",
        arabic: "يُقَلِّبُ فِي الأَرُزّ",
        example: "Stir in a pinch of saffron and butter into the steamed rice.",
      },
    ],
    sentences: [
      {
        context: "Cooking Staple",
        en: "Rinse the basmati rice in cold water until the starch clears before cooking.",
        ar: "اغْسِلْ أَرُزَّ البَسْمَتِي بِالمَاءِ البَارِدِ حَتَّى يَصْفُوَ المَاءُ تَمَاماً قَبْلَ الطَّهْيِ.",
      },
      {
        context: "Main Dish",
        en: "Serve the spicy chicken curry over a generous bed of fluffy steamed white rice.",
        ar: "قَدِّمْ كَارِي الدَّجَاجِ الحَارَّ فَوْقَ طَبَقٍ وَفِيرٍ مِنَ الأَرُزِّ الأَبْيَضِ الهَشِّ.",
      },
      {
        context: "Fried Rice",
        en: "Day-old cold cooked rice is ideal for making restaurant-style vegetable fried rice.",
        ar: "يُعَدُّ الأَرُزُّ المَطْبُوخُ البَارِدُ مِثَالِيّاً لِإِعْدَادِ الأَرُزِّ المَقْلِيِّ بِالخُضَارِ.",
      },
    ],
    exampleSentence: "Rinse the basmati rice in cold water until the starch clears before cooking.",
    exampleArabic:
      "اغْسِلْ أَرُزَّ البَسْمَتِي بِالمَاءِ البَارِدِ حَتَّى يَصْفُوَ المَاءُ تَمَاماً قَبْلَ الطَّهْيِ.",
  },
  robe: {
    id: "robe",
    arabic: "رُوب حَمَّام / بُرْنُس",
    partOfSpeech: "noun",
    phonetic: "roʊb",
    pronunciationTip: "Long 'o' vowel /oʊ/ rhyming with 'globe' or 'probe'.",
    collocations: [
      "bathrobe",
      "put on a robe",
      "warm fleece robe",
      "tie the robe",
      "cotton robe",
      "wrap in a robe",
    ],
    phrasalVerbs: [
      {
        phrase: "wrap up in",
        meaning: "wrap oneself snugly in a robe",
        arabic: "يَلْتَفُّ فِي الرُّوب",
        example: "She wrapped up in a plush bathrobe after her shower.",
      },
      {
        phrase: "tie up",
        meaning: "fasten the belt of a robe",
        arabic: "يَرْبِطُ حِزَامَ البُرْنُس",
        example: "He tied up the robe belt around his waist.",
      },
    ],
    sentences: [
      {
        context: "Post-Shower",
        en: "She wrapped herself in a thick cotton bathrobe after taking a hot shower.",
        ar: "الْتَفَّتْ فِي بُرْنُسٍ قُطْنِيٍّ سَمِيكٍ بَعْدَ الاِسْتِحْمَامِ بِمَاءٍ سَاخِنٍ.",
      },
      {
        context: "Morning Relaxation",
        en: "He enjoyed his morning coffee on the balcony while wearing his cozy fleece robe.",
        ar: "اسْتَمْتَعَ بِقَهْوَتِهِ الصَّبَاحِيَّةِ فِي الشُّرْفَةِ وَهُوَ يَرْتَدِي رُوبَهُ الصُّوفِيَّ الدَّافِئَ.",
      },
      {
        context: "Luxury Travel",
        en: "The luxury hotel provided complimentary plush white robes for guests.",
        ar: "وَفَّرَ الفُنْدُقُ الفَاخِرُ أَرْوِبَةً بَيْضَاءَ قُطْنِيَّةً مَجَّانِيَّةً لِلنُّزَلاءِ.",
      },
    ],
    exampleSentence: "She wrapped herself in a thick cotton bathrobe after taking a hot shower.",
    exampleArabic:
      "الْتَفَّتْ فِي بُرْنُسٍ قُطْنِيٍّ سَمِيكٍ بَعْدَ الاِسْتِحْمَامِ بِمَاءٍ سَاخِنٍ.",
  },
  "rocking-chair": {
    id: "rocking-chair",
    arabic: "كُرْسِيٌّ هَزَّاز",
    partOfSpeech: "noun",
    phonetic: "ˈrɑː.kɪŋ ˌtʃɛər",
    pronunciationTip: "Compound noun: 'ROCKING' (/ˈrɑː.kɪŋ/) + 'CHAIR' (/tʃɛər/).",
    collocations: [
      "wooden rocking chair",
      "sit in a rocking chair",
      "creak of the rocking chair",
      "porch rocking chair",
      "nursery rocking chair",
      "gently rock in a chair",
    ],
    phrasalVerbs: [
      {
        phrase: "rock back and forth",
        meaning: "move rhythmically in a chair",
        arabic: "يَتَأَرْجَحُ ذَهَاباً وَإِيَاباً",
        example: "The grandmother rocked back and forth while knitting.",
      },
    ],
    sentences: [
      {
        context: "Peaceful Evening",
        en: "Grandfather sat on the porch in his wooden rocking chair, enjoying the sunset.",
        ar: "جَلَسَ الجَدُّ فِي الشُّرْفَةِ عَلَى كُرْسِيِّهِ الخَشَبِيِّ الهَزَّازِ مُسْتَمْتِعاً بِالغُرُوبِ.",
      },
      {
        context: "Nursery",
        en: "A comfortable upholstered rocking chair helps soothe babies to sleep.",
        ar: "يُسَاعِدُ الكُرْسِيُّ الهَزَّازُ المُبَطَّنُ المُرِيحُ فِي تَهْدِئَةِ الأَطْفَالِ لِلنَّوْمِ.",
      },
      {
        context: "Cozy Living",
        en: "The rhythmic rocking motion is deeply calming after a hectic, busy day.",
        ar: "تَمْنَحُ حَرَكَةُ التَّأَرْجُحِ الإِيقَاعِيَّةُ شُعُوراً عَمِيقاً بِالهُدُوءِ بَعْدَ يَوْمٍ حَافِلٍ.",
      },
    ],
    exampleSentence:
      "Grandfather sat on the porch in his wooden rocking chair, enjoying the sunset.",
    exampleArabic:
      "جَلَسَ الجَدُّ فِي الشُّرْفَةِ عَلَى كُرْسِيِّهِ الخَشَبِيِّ الهَزَّازِ مُسْتَمْتِعاً بِالغُرُوبِ.",
  },
  "rolling-pin": {
    id: "rolling-pin",
    arabic: "نَشَّابَة / شَوْبَك (مِدْلَاكُ العَجِين)",
    partOfSpeech: "noun",
    phonetic: "ˈroʊ.lɪŋ ˌpɪn",
    pronunciationTip: "Compound noun: 'ROLLING' (/ˈroʊ.lɪŋ/) + 'PIN' (/pɪn/).",
    collocations: [
      "wooden rolling pin",
      "roll out with a rolling pin",
      "marble rolling pin",
      "flour the rolling pin",
      "pastry rolling pin",
      "smooth rolling pin",
    ],
    phrasalVerbs: [
      {
        phrase: "roll out",
        meaning: "flatten dough with a rolling pin",
        arabic: "يَفْرِدُ العَجِينَ بِالنَّشَّابَة",
        example: "Roll out the pizza dough evenly to the edges of the pan.",
      },
    ],
    sentences: [
      {
        context: "Pie Crust",
        en: "She dusted the wooden rolling pin with flour before rolling out the pastry dough.",
        ar: "رَشَّتِ النَّشَّابَةَ الخَشَبِيَّةَ بِالطَّحِينِ قَبْلَ فَرْدِ عَجِينَةِ الفَطِيرَةِ.",
      },
      {
        context: "Pizza Making",
        en: "Roll out the bread dough from the center outwards until it is thin and round.",
        ar: "افْرِدْ عَجِينَةَ الخُبْزِ مِنَ المُنْتَصَفِ لِلْخَارِجِ حَتَّى تُصْبِحَ رَقِيقَةً وَدَائِرِيَّةً.",
      },
      {
        context: "Heavy Duty",
        en: "A heavy marble rolling pin stays cold and makes rolling butter-rich dough easier.",
        ar: "تَبْقَى النَّشَّابَةُ الرُّخَامِيَّةُ الثَّقِيلَةُ بَارِدَةً مِمَّا يُسَهِّلُ فَرْدَ العَجِينِ الغَنِيِّ بِالزُّبْدَةِ.",
      },
    ],
    exampleSentence:
      "She dusted the wooden rolling pin with flour before rolling out the pastry dough.",
    exampleArabic:
      "رَشَّتِ النَّشَّابَةَ الخَشَبِيَّةَ بِالطَّحِينِ قَبْلَ فَرْدِ عَجِينَةِ الفَطِيرَةِ.",
  },
  rooster: {
    id: "rooster",
    arabic: "دِيك",
    partOfSpeech: "noun",
    phonetic: "ˈruː.stər",
    pronunciationTip: "Long 'oo' vowel /uː/ as in 'rooster' or 'booster'.",
    collocations: [
      "crowing rooster",
      "rooster at dawn",
      "colorful rooster",
      "rooster comb",
      "rooster feathers",
      "wake to the rooster",
    ],
    phrasalVerbs: [
      {
        phrase: "strut around",
        meaning: "walk with a proud gait",
        arabic: "يَتَبَخْتَرُ",
        example: "The proud rooster strutted around the farmyard displaying its feathers.",
      },
    ],
    sentences: [
      {
        context: "Dawn Awakening",
        en: "The rooster perched on the fence and crowed loudly to greet the morning sunrise.",
        ar: "وَقَفَ الدِّيكُ عَلَى السِّيَاجِ وَصَاحَ بِصَوْتٍ عَالٍ تَرْحِيباً بِشُرُوقِ الصَّبَاحِ.",
      },
      {
        context: "Vibrant Colors",
        en: "With its bright red comb and iridescent green tail feathers, the rooster looked majestic.",
        ar: "بِعُرْفِهِ الأَحْمَرِ السَّاطِعِ وَرِيشِ ذَيْلِهِ الأَخْضَرِ اللّامِعِ، بَدَا الدِّيكُ مَهِيباً.",
      },
      {
        context: "Farm Guardian",
        en: "The rooster keeps a watchful eye over the hens and alerts them to approaching hawks.",
        ar: "يُرَاقِبُ الدِّيكُ الدَّجَاجَاتِ بِحَذَرٍ وَيُحَذِّرُهَا مِنْ أَيِّ طُيُورٍ جَارِحَةٍ تَقْتَرِبُ.",
      },
    ],
    exampleSentence:
      "The rooster perched on the fence and crowed loudly to greet the morning sunrise.",
    exampleArabic:
      "وَقَفَ الدِّيكُ عَلَى السِّيَاجِ وَصَاحَ بِصَوْتٍ عَالٍ تَرْحِيباً بِشُرُوقِ الصَّبَاحِ.",
  },
  rug: {
    id: "rug",
    arabic: "سَجَّادَةٌ صَغِيرَة (مَشَّايَة)",
    partOfSpeech: "noun",
    phonetic: "rʌɡ",
    pronunciationTip: "Short 'u' vowel sound /ʌ/ as in 'hug', 'mug', or 'cup'.",
    collocations: [
      "area rug",
      "soft rug",
      "bedside rug",
      "woven rug",
      "step on the rug",
      "wool rug",
    ],
    phrasalVerbs: [
      {
        phrase: "lay down",
        meaning: "place a rug flat on the floor",
        arabic: "يَفْرِشُ سَجَّادَة",
        example: "They laid down a soft wool rug beside the bed.",
      },
      {
        phrase: "roll up",
        meaning: "roll a rug for moving or cleaning",
        arabic: "يَطْوِي / يَلُفُّ السَّجَّادَة",
        example: "Roll up the rug before painting the bedroom walls.",
      },
    ],
    sentences: [
      {
        context: "Morning Comfort",
        en: "A soft fluffy rug keeps your bare feet warm when stepping out of bed.",
        ar: "تُحَافِظُ السَّجَّادَةُ الصَّغِيرَةُ النَّاعِمَةُ عَلَى دِفْءِ قَدَمَيْكَ عِنْدَ النُّزُولِ مِنَ السَّرِيرِ.",
      },
      {
        context: "Room Accents",
        en: "The colorful Persian rug adds character and warmth to the wooden floor.",
        ar: "تُضِيفُ السَّجَّادَةُ الفَارِسِيَّةُ المُلَوَّنَةُ طَابَعاً مُمَيَّزاً وَدِفْئاً عَلَى الأَرْضِيَّةِ الخَشَبِيَّةِ.",
      },
      {
        context: "Cleaning",
        en: "She shook the dust out of the bedside rug on the balcony.",
        ar: "نَفَضَتِ الغُبَارَ عَنْ سَجَّادَةِ جَانِبِ السَّرِيرِ فِي الشُّرْفَةِ.",
      },
    ],
    exampleSentence: "A soft fluffy rug keeps your bare feet warm when stepping out of bed.",
    exampleArabic:
      "تُحَافِظُ السَّجَّادَةُ الصَّغِيرَةُ النَّاعِمَةُ عَلَى دِفْءِ قَدَمَيْكَ عِنْدَ النُّزُولِ مِنَ السَّرِيرِ.",
  },
  salt: {
    id: "salt",
    arabic: "مِلْح",
    partOfSpeech: "noun",
    phonetic: "sɔːlt",
    pronunciationTip: "Contains the 'aw' sound /ɔː/ as in 'all' or 'ball'.",
    collocations: [
      "pinch of salt",
      "season with salt",
      "table salt",
      "sea salt",
      "kosher salt",
      "salt shaker",
    ],
    phrasalVerbs: [
      {
        phrase: "sprinkle on",
        meaning: "scatter salt lightly over food",
        arabic: "يَرُشُّ المِلْح",
        example: "Sprinkle a pinch of flaky sea salt over the grilled steak.",
      },
      {
        phrase: "season with",
        meaning: "enhance flavor with salt",
        arabic: "يُتَبِّلُ بِالمِلْح",
        example: "Season the soup with salt and freshly ground pepper.",
      },
    ],
    sentences: [
      {
        context: "Seasoning",
        en: "Add a pinch of sea salt to enhance the natural flavors of the tomato salad.",
        ar: "أَضِفْ رَشَّةً مِنْ مِلْحِ البَحْرِ لِإِبْرَازِ النَّكْهَاتِ الطَّبِيعِيَّةِ لِسَلَطَةِ الطَّمَاطِمِ.",
      },
      {
        context: "Pasta Water",
        en: "Always salt your pasta cooking water generously until it tastes like sea water.",
        ar: "مَلِّحْ مَاءَ سَلْقِ المَعْكَرُونَةِ بِسَخَاءٍ حَتَّى يُشْبِهَ طَعْمُهُ مَاءَ البَحْرِ.",
      },
      {
        context: "Table Shakers",
        en: "The ceramic salt and pepper shakers sit neatly in the middle of the dining table.",
        ar: "تَسْتَقِرُّ مَمْلَحَةُ المِلْحِ وَالفُلْفُلِ الخَزَفِيَّةُ بِأَنَاقَةٍ فِي مُنْتَصَفِ طَاوِلَةِ الطَّعَامِ.",
      },
    ],
    exampleSentence: "Add a pinch of sea salt to enhance the natural flavors of the tomato salad.",
    exampleArabic:
      "أَضِفْ رَشَّةً مِنْ مِلْحِ البَحْرِ لِإِبْرَازِ النَّكْهَاتِ الطَّبِيعِيَّةِ لِسَلَطَةِ الطَّمَاطِمِ.",
  },
  saucepan: {
    id: "saucepan",
    arabic: "قِدْرُ صَلْصَة (كَاسَرُولَة)",
    partOfSpeech: "noun",
    phonetic: "ˈsɔːs.pæn",
    pronunciationTip: "Stress on 'SAUCE' (/sɔːs/), ending in short /pæn/.",
    collocations: [
      "small saucepan",
      "simmer in a saucepan",
      "saucepan lid",
      "stainless steel saucepan",
      "heat soup in a saucepan",
      "saucepan handle",
    ],
    phrasalVerbs: [
      {
        phrase: "bring to a boil",
        meaning: "heat liquid in saucepan until boiling",
        arabic: "يَغْلِي",
        example: "Bring the tomato sauce to a gentle boil in the saucepan.",
      },
      {
        phrase: "stir constantly",
        meaning: "mix continuously in pan",
        arabic: "يُقَلِّبُ بِاسْتِمْرَار",
        example: "Stir the custard constantly with a whisk.",
      },
    ],
    sentences: [
      {
        context: "Sauce Making",
        en: "He melted dark chocolate and cream in a small saucepan over low heat.",
        ar: "أَذَابَ الشُّوكُولاتَةَ الدَّاكِنَةَ مَعَ الكْرِيمَةِ فِي قِدْرِ صَلْصَةٍ صَغِيرٍ عَلَى نَارٍ هَادِئَةٍ.",
      },
      {
        context: "Cooking Grains",
        en: "Cook the basmati rice in a heavy-bottomed saucepan with a tight-fitting lid.",
        ar: "اطْبُخْ أَرُزَّ البَسْمَتِي فِي كَاسَرُولَةٍ ثَقِيلَةِ القَاعِدَةِ مَعَ غِطَاءٍ مُحْكَمٍ.",
      },
      {
        context: "Kitchen Safety",
        en: "Turn the saucepan handle inward so it cannot be accidentally bumped.",
        ar: "وَجِّهْ مِقْبَضَ القِدْرِ لِلدَّاخِلِ حَتَّى لا يَتِمَّ الاِصْطِدَامُ بِهِ بِالخَطَأِ.",
      },
    ],
    exampleSentence: "He melted dark chocolate and cream in a small saucepan over low heat.",
    exampleArabic:
      "أَذَابَ الشُّوكُولاتَةَ الدَّاكِنَةَ مَعَ الكْرِيمَةِ فِي قِدْرِ صَلْصَةٍ صَغِيرٍ عَلَى نَارٍ هَادِئَةٍ.",
  },
  saucer: {
    id: "saucer",
    arabic: "صَحْنُ الفِنْجَان",
    partOfSpeech: "noun",
    phonetic: "ˈsɔː.sər",
    pronunciationTip: "First syllable has the 'aw' vowel /ɔː/ as in 'saw' or 'autumn'.",
    collocations: [
      "cup and saucer",
      "place on the saucer",
      "matching saucer",
      "porcelain saucer",
      "teacup saucer",
      "spill onto the saucer",
    ],
    phrasalVerbs: [
      {
        phrase: "set down on",
        meaning: "place a cup safely on its saucer",
        arabic: "يَضَعُ الفِنْجَانَ عَلَى صَحْنِهِ",
        example: "She set down her teacup gently on the matching saucer.",
      },
    ],
    sentences: [
      {
        context: "Formal Tea",
        en: "The porcelain teacup rested neatly atop its matching gold-trimmed saucer.",
        ar: "اسْتَقَرَّ فِنْجَانُ الشَّايِ الخَزَفِيُّ بِأَنَاقَةٍ فَوْقَ صَحْنِهِ المُطَرَّزِ بِالذَّهَبِ.",
      },
      {
        context: "Preventing Spills",
        en: "A small saucer catches tea drips and protects fine wooden tabletops.",
        ar: "يَمْنَعُ صَحْنُ الفِنْجَانِ الصَّغِيرُ قَطَرَاتِ الشَّايِ مِنْ تَلْوِيثِ الطَّاوِلَةِ الخَشَبِيَّةِ.",
      },
      {
        context: "Hospitality",
        en: "The waiter served the espresso with a sugar cube placed on the saucer rim.",
        ar: "قَدَّمَ النَّادِلُ الإِسْبْرِيسُو مَعَ مُكَعَّبِ سُكَّرٍ مَوْضُوعٍ عَلَى حَافَّةِ صَحْنِ الفِنْجَانِ.",
      },
    ],
    exampleSentence: "The porcelain teacup rested neatly atop its matching gold-trimmed saucer.",
    exampleArabic:
      "اسْتَقَرَّ فِنْجَانُ الشَّايِ الخَزَفِيُّ بِأَنَاقَةٍ فَوْقَ صَحْنِهِ المُطَرَّزِ بِالذَّهَبِ.",
  },
  scarecrow: {
    id: "scarecrow",
    arabic: "فَزَّاعَةُ طُيُور (خَيَالُ المَآتَة)",
    partOfSpeech: "noun",
    phonetic: "ˈskɛər.kroʊ",
    pronunciationTip: "Compound noun: 'SCARE' (/skɛər/) + 'CROW' (/kroʊ/).",
    collocations: [
      "straw scarecrow",
      "stand like a scarecrow",
      "scarecrow in the field",
      "old clothes on a scarecrow",
      "frighten birds with a scarecrow",
      "cornfield scarecrow",
    ],
    phrasalVerbs: [
      {
        phrase: "scare away",
        meaning: "frighten pests or birds away from crops",
        arabic: "يُخِيفُ الطُّيُورَ وَيَطْرُدُهَا",
        example: "The scarecrow helps scare away crows from the sweet corn.",
      },
    ],
    sentences: [
      {
        context: "Crop Protection",
        en: "A straw-stuffed scarecrow dressed in flannel shirts and an old hat guards the sweet corn patch.",
        ar: "تَحْرُسُ فَزَّاعَةٌ مَحْشُوَّةٌ بِالقَشِّ تَرْتَدِي قَمِيصاً صُوفِيّاً حَقْلَ الذُّرَةِ الحُلْوَةِ.",
      },
      {
        context: "Autumn Tradition",
        en: "Children built a smiling pumpkin-headed scarecrow to celebrate the autumn harvest festival.",
        ar: "صَنَعَ الأَطْفَالُ خَيَالَ مَآتَةٍ بِرَأْسِ يَقْطِينٍ بَاسِمٍ لِلاِحْتِفَالِ بِمَوْسِمِ الحَصَادِ.",
      },
      {
        context: "Field Landscape",
        en: "The lonely scarecrow stood motionless against the colorful orange and violet evening sunset.",
        ar: "وَقَفَتِ الفَزَّاعَةُ سَاكِنَةً فِي الحَقْلِ أَمَامَ أَلْوَانِ غُرُوبِ الشَّمْسِ البُرْتُقَالِيَّةِ السَّاحِرَةِ.",
      },
    ],
    exampleSentence:
      "A straw-stuffed scarecrow dressed in flannel shirts and an old hat guards the sweet corn patch.",
    exampleArabic:
      "تَحْرُسُ فَزَّاعَةٌ مَحْشُوَّةٌ بِالقَشِّ تَرْتَدِي قَمِيصاً صُوفِيّاً حَقْلَ الذُّرَةِ الحُلْوَةِ.",
  },
  shed: {
    id: "shed",
    arabic: "سَقِيفَة (كُوخُ أَدَوَات / مَخْزَنٌ خَشَبِيّ)",
    partOfSpeech: "noun",
    phonetic: "ʃɛd",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'bed' or 'red'.",
    collocations: [
      "tool shed",
      "garden shed",
      "wooden shed",
      "keep in the shed",
      "storage shed",
      "potting shed",
    ],
    phrasalVerbs: [
      {
        phrase: "put away in",
        meaning: "store garden tools in a shed",
        arabic: "يَحْفَظُ فِي السَّقِيفَة",
        example: "Put away the shovel and lawnmower inside the garden shed.",
      },
    ],
    sentences: [
      {
        context: "Tool Storage",
        en: "He keeps his lawnmower, garden hoses, and pruning shears locked in the wooden shed.",
        ar: "يَحْتَفِظُ بِمِكْنَسَةِ العُشْبِ وَخَرَاطِيمِ المِيَاهِ وَالمَقَصَّاتِ دَاخِلَ السَّقِيفَةِ الخَشَبِيَّةِ.",
      },
      {
        context: "Potting Plants",
        en: "The potting shed is equipped with wooden workbenches, flower pots, and rich soil.",
        ar: "تَمَّ تَجْهِيزُ كُوخِ الأَدَوَاتِ بِطَاوِلاتِ خَشَبٍ وَأَصَائِصَ لِتَشْتِيلِ الزُّهُورِ.",
      },
      {
        context: "Organization",
        en: "Hang shovels and rakes neatly on wall brackets inside the tool shed.",
        ar: "عَلِّقِ المَجَارِفَ وَالمَشَابِكَ بِنِظَامٍ عَلَى حَوَامِلِ الجِدَارِ دَاخِلَ مَخْزَنِ الأَدَوَاتِ.",
      },
    ],
    exampleSentence:
      "He keeps his lawnmower, garden hoses, and pruning shears locked in the wooden shed.",
    exampleArabic:
      "يَحْتَفِظُ بِمِكْنَسَةِ العُشْبِ وَخَرَاطِيمِ المِيَاهِ وَالمَقَصَّاتِ دَاخِلَ السَّقِيفَةِ الخَشَبِيَّةِ.",
  },
  sheep: {
    id: "sheep",
    arabic: "خَرُوف / غَنَم (شَاة)",
    partOfSpeech: "noun",
    phonetic: "ʃiːp",
    pronunciationTip: "Long 'ee' vowel /iː/. Plural is also 'sheep' (no 's').",
    collocations: [
      "flock of sheep",
      "shear the sheep",
      "wool from sheep",
      "sheep grazing",
      "sheepdog",
      "bleat of a sheep",
    ],
    phrasalVerbs: [
      {
        phrase: "round up",
        meaning: "gather sheep together using a dog",
        arabic: "يَجْمَعُ القَطِيع",
        example: "The border collie rounded up the stray sheep into the pen.",
      },
    ],
    sentences: [
      {
        context: "Wool Harvesting",
        en: "Every spring, the sheep are sheared to harvest thick, natural wool for blankets.",
        ar: "فِي كُلِّ رَبِيعٍ، يَتِمُّ جَزُّ صُوفِ الأَغْنَامِ لِجَنْيِ الصُّوفِ الطَّبِيعِيِّ لِلْبَطَّانِيَّاتِ.",
      },
      {
        context: "Hillside Grazing",
        en: "A large flock of white sheep wandered peacefully across the rolling green meadows.",
        ar: "تَجَوَّلَ قَطِيعٌ كَبِيرٌ مِنَ الأَغْنَامِ البَيْضَاءِ بِهُدُوءٍ فِي المُرُوجِ الخَضْرَاءِ.",
      },
      {
        context: "Herding Dogs",
        en: "The trained sheepdog sprinted across the pasture to herd the lambs safely.",
        ar: "رَكَضَ كَلْبُ الرِّعَايَةِ المُدَرَّبُ لِتَوْجِيهِ الحُمْلانِ إِلَى الحَظِيرَةِ بِأَمَانٍ.",
      },
    ],
    exampleSentence:
      "Every spring, the sheep are sheared to harvest thick, natural wool for blankets.",
    exampleArabic:
      "فِي كُلِّ رَبِيعٍ، يَتِمُّ جَزُّ صُوفِ الأَغْنَامِ لِجَنْيِ الصُّوفِ الطَّبِيعِيِّ لِلْبَطَّانِيَّاتِ.",
  },
  sheet: {
    id: "sheet",
    arabic: "شَرْشَف / مِلايَةُ السَّرِير",
    partOfSpeech: "noun",
    phonetic: "ʃiːt",
    pronunciationTip: "Long 'ee' sound (/iː/). Distinct from 'sit'.",
    collocations: [
      "clean sheets",
      "change the sheets",
      "fitted sheet",
      "bed sheet",
      "cotton sheets",
      "fold the sheets",
    ],
    phrasalVerbs: [
      {
        phrase: "tuck in",
        meaning: "tuck the edges of a sheet under the mattress",
        arabic: "يُدْخِلُ أَطْرَافَ الشَّرْشَف",
        example: "Tuck in the bed sheet tightly under the mattress corners.",
      },
      {
        phrase: "strip off",
        meaning: "remove sheets for washing",
        arabic: "يَنْزِعُ المِلايَاتِ لِلْغَسِيل",
        example: "She stripped off the bed sheets to put them in the laundry.",
      },
    ],
    sentences: [
      {
        context: "Hygiene",
        en: "It feels wonderful to sleep on freshly washed cotton sheets.",
        ar: "مِنَ الرَّائِعِ جِدّاً النَّوْمُ عَلَى مِلايَاتٍ قُطْنِيَّةٍ مَغْسُولَةٍ حَدِيثاً.",
      },
      {
        context: "Household Chores",
        en: "They change the bed sheets every Sunday morning.",
        ar: "يَقُومُونَ بِتَغْيِيرِ شَرَاشِفِ السَّرِيرِ كُلَّ صَبَاحِ أَحَدٍ.",
      },
      {
        context: "Bed Making",
        en: "The elastic corners of the fitted sheet keep it firmly in place.",
        ar: "تُحَافِظُ الزَّوَايَا المَطَّاطِيَّةُ لِلشَّرْشَفِ عَلَى ثَبَاتِهِ فِي مَكَانِهِ.",
      },
    ],
    exampleSentence: "It feels wonderful to sleep on freshly washed cotton sheets.",
    exampleArabic:
      "مِنَ الرَّائِعِ جِدّاً النَّوْمُ عَلَى مِلايَاتٍ قُطْنِيَّةٍ مَغْسُولَةٍ حَدِيثاً.",
  },
  shelf: {
    id: "shelf",
    arabic: "رَفّ",
    partOfSpeech: "noun",
    phonetic: "ʃɛlf",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'bed', ending in 'lf'. Plural is 'shelves'.",
    collocations: [
      "wooden shelf",
      "on the shelf",
      "floating shelf",
      "top shelf",
      "dust the shelf",
      "shelf bracket",
    ],
    phrasalVerbs: [
      {
        phrase: "put up",
        meaning: "mount a shelf on a wall",
        arabic: "يُرَكِّبُ رَفّاً",
        example: "He put up a floating oak shelf in the living room.",
      },
      {
        phrase: "take down from",
        meaning: "remove an item from a shelf",
        arabic: "يُنْزِلُ عَنِ الرَّفّ",
        example: "She took down the glass vase from the top shelf.",
      },
    ],
    sentences: [
      {
        context: "Display",
        en: "She arranged family photographs and potted succulents on the floating wall shelf.",
        ar: "رَتَّبَتِ الصُّوَرَ العَائِلِيَّةَ وَالنَّبَاتَاتِ عَلَى رَفِّ الحَائِطِ المُنْعَزِلِ.",
      },
      {
        context: "Storage",
        en: "Keep frequently used textbooks on the lower shelf within easy reach.",
        ar: "احْتَفِظْ بِالكُتُبِ الدِّرَاسِيَّةِ كَثِيرَةِ الاِسْتِخْدَامِ عَلَى الرَّفِّ السُّفْلِيِّ.",
      },
      {
        context: "Installation",
        en: "Use heavy wall anchors to secure the solid timber shelf to the wall.",
        ar: "اسْتَخْدِمْ بَرَاغِيَ جِدَارِيَّةً مَتِينَةً لِتَثْبِيتِ الرَّفِّ الخَشَبِيِّ بِإِحْكَامٍ.",
      },
    ],
    exampleSentence:
      "She arranged family photographs and potted succulents on the floating wall shelf.",
    exampleArabic:
      "رَتَّبَتِ الصُّوَرَ العَائِلِيَّةَ وَالنَّبَاتَاتِ عَلَى رَفِّ الحَائِطِ المُنْعَزِلِ.",
  },
  "shoe-rack": {
    id: "shoe-rack",
    arabic: "رَفُّ الأَحْذِيَة (جَزَّامَة)",
    partOfSpeech: "noun",
    phonetic: "ˈʃuː ˌræk",
    pronunciationTip: "Compound noun: 'SHOE' (/ʃuː/) + 'RACK' (/ræk/).",
    collocations: [
      "wooden shoe rack",
      "tier shoe rack",
      "pairs of shoes on the rack",
      "entryway shoe rack",
      "stackable shoe rack",
      "metal shoe rack",
    ],
    phrasalVerbs: [
      {
        phrase: "put away on",
        meaning: "store shoes on the rack",
        arabic: "يُرَتِّبُ عَلَى رَفِّ الأَحْذِيَة",
        example: "Put away your muddy sneakers on the bottom shelf of the shoe rack.",
      },
    ],
    sentences: [
      {
        context: "Entryway Tidiness",
        en: "Please place your outdoor footwear neatly on the three-tier shoe rack by the door.",
        ar: "يُرْجَى وَضْعُ أَحْذِيَتِكُمُ الخَارِجِيَّةِ بِنِظَامٍ عَلَى رَفِّ الأَحْذِيَةِ ذِي الطَّبَقَاتِ الثَّلاثِ.",
      },
      {
        context: "Home Etiquette",
        en: "Taking off outdoor shoes and using the shoe rack keeps the living room carpets spotless.",
        ar: "يُحَافِظُ خَلْعُ الأَحْذِيَةِ وَوَضْعُهَا فِي الرَّفِّ عَلَى نَظَافَةِ سَجَّادِ المَعِيشَةِ.",
      },
      {
        context: "Storage Capacity",
        en: "The compact wooden shoe rack holds up to twelve pairs of family shoes.",
        ar: "يَتَّسِعُ رَفُّ الأَحْذِيَةِ الخَشَبِيُّ المُرِيحُ لِـ 12 زَوْجاً مِنْ أَحْذِيَةِ العَائِلَةِ.",
      },
    ],
    exampleSentence:
      "Please place your outdoor footwear neatly on the three-tier shoe rack by the door.",
    exampleArabic:
      "يُرْجَى وَضْعُ أَحْذِيَتِكُمُ الخَارِجِيَّةِ بِنِظَامٍ عَلَى رَفِّ الأَحْذِيَةِ ذِي الطَّبَقَاتِ الثَّلاثِ.",
  },
  shovel: {
    id: "shovel",
    arabic: "مِجْرَفَة (كُورِيك)",
    partOfSpeech: "noun",
    phonetic: "ˈʃʌv.əl",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'shove' or 'love', followed by soft /əl/.",
    collocations: [
      "dig with a shovel",
      "snow shovel",
      "metal shovel",
      "shovel of dirt",
      "pointed shovel",
      "garden shovel",
    ],
    phrasalVerbs: [
      {
        phrase: "shovel up",
        meaning: "lift and scoop loose material",
        arabic: "يَجْرُفُ",
        example: "Shovel up the loose dirt and transfer it to the wheelbarrow.",
      },
      {
        phrase: "dig up",
        meaning: "excavate ground with a shovel",
        arabic: "يَحْفِرُ بِالمِجْرَفَة",
        example: "Dig up a deep trench for planting the new fruit trees.",
      },
    ],
    sentences: [
      {
        context: "Digging",
        en: "The gardener used a sturdy pointed shovel to dig deep planting holes for apple trees.",
        ar: "اسْتَخْدَمَ البُسْتَانِيُّ مِجْرَفَةً مَتِينَةً مُدَبَّبَةً لِحَفْرِ جُوَرِ غَرْسِ أَشْجَارِ التُّفَّاحِ.",
      },
      {
        context: "Winter Chores",
        en: "After the heavy winter snowfall, he shoveled a clear walking path to the barn.",
        ar: "بَعْدَ تَسَاقُطِ الثُّلُوجِ الشَّتْوِيَّةِ، جَرَفَ مَمَرّاً آمِناً لِلْمَشْيِ إِلَى الحَظِيرَةِ.",
      },
      {
        context: "Compost Handling",
        en: "She scooped dark aged compost with a square shovel to top-dress the garden beds.",
        ar: "غَرَفَتِ السَّمَادَ النَّاضِجَ بِمِجْرَفَةٍ مُرَبَّعَةٍ لِتَغْذِيَةِ تُرْبَةِ الحَدِيقَةِ.",
      },
    ],
    exampleSentence:
      "The gardener used a sturdy pointed shovel to dig deep planting holes for apple trees.",
    exampleArabic:
      "اسْتَخْدَمَ البُسْتَانِيُّ مِجْرَفَةً مَتِينَةً مُدَبَّبَةً لِحَفْرِ جُوَرِ غَرْسِ أَشْجَارِ التُّفَّاحِ.",
  },
  "side-table": {
    id: "side-table",
    arabic: "طَاوِلَةٌ جَانِبِيَّة (تَرَابِيزَة صَغِيرَة)",
    partOfSpeech: "noun",
    phonetic: "ˈsaɪd ˌteɪ.bəl",
    pronunciationTip: "Compound noun: 'SIDE' (/saɪd/) + 'TABLE' (/ˈteɪ.bəl/).",
    collocations: [
      "wooden side table",
      "lamp on the side table",
      "next to the sofa",
      "small side table",
      "marble side table",
      "side table with drawer",
    ],
    phrasalVerbs: [
      {
        phrase: "put down on",
        meaning: "place an item on the side table",
        arabic: "يَضَعُ عَلَى الطَّاوِلَةِ الجَانِبِيَّة",
        example: "He put down the TV remote control on the side table.",
      },
    ],
    sentences: [
      {
        context: "Living Room Accents",
        en: "A small marble-topped side table sits beside the armchair for resting drinks.",
        ar: "تَسْتَقِرُّ طَاوِلَةٌ جَانِبِيَّةٌ رُخَامِيَّةٌ صَغِيرَةٌ بِجَانِبِ الكُرْسِيِّ لِوَضْعِ المَشْرُوبَاتِ.",
      },
      {
        context: "Lighting Placement",
        en: "The decorative ceramic table lamp on the side table casts a gentle ambient glow.",
        ar: "يَنْشُرُ مِصْبَاحُ الطَّاوِلَةِ الخَزَفِيُّ عَلَى الطَّاوِلَةِ الجَانِبِيَّةِ إِضَاءَةً دَافِئَةً.",
      },
      {
        context: "Convenience",
        en: "Keep the remote control and your reading glasses within arm's reach on the side table.",
        ar: "احْتَفِظْ بِجِهَازِ التَّحَكُّمِ وَنَظَّارَةِ القِرَاءَةِ عَلَى الطَّاوِلَةِ الجَانِبِيَّةِ لِسُهُولَةِ تَنَاوُلِهَا.",
      },
    ],
    exampleSentence:
      "A small marble-topped side table sits beside the armchair for resting drinks.",
    exampleArabic:
      "تَسْتَقِرُّ طَاوِلَةٌ جَانِبِيَّةٌ رُخَامِيَّةٌ صَغِيرَةٌ بِجَانِبِ الكُرْسِيِّ لِوَضْعِ المَشْرُوبَاتِ.",
  },
  sideboard: {
    id: "sideboard",
    arabic: "بُوفَيْه (خِزَانَةُ أَدَوَاتِ المَائِدَة)",
    partOfSpeech: "noun",
    phonetic: "ˈsaɪd.bɔːrd",
    pronunciationTip: "Compound noun: 'SIDE' (/saɪd/) + 'BOARD' (/bɔːrd/).",
    collocations: [
      "wooden sideboard",
      "dining room sideboard",
      "buffet sideboard",
      "store in the sideboard",
      "mid-century sideboard",
      "oak sideboard",
    ],
    phrasalVerbs: [
      {
        phrase: "put away in",
        meaning: "store dinnerware in sideboard",
        arabic: "يَحْفَظُ فِي البُوفَيْه",
        example: "Put away the fine china plates inside the sideboard.",
      },
    ],
    sentences: [
      {
        context: "Fine Dining Storage",
        en: "She stores her best crystal glasses and holiday tablecloths inside the oak sideboard.",
        ar: "تَحْفَظُ أَفْضَلَ كُؤُوسِ الكِرِيسْتَالِ وَمَفَارِشِ المَائِدَةِ دَاخِلَ البُوفَيْهِ الخَشَبِيِّ.",
      },
      {
        context: "Holiday Buffet",
        en: "During dinner parties, the wide wooden sideboard serves as a hot buffet station.",
        ar: "خِلالَ حَفَلاتِ العَشَاءِ، يُسْتَخْدَمُ البُوفَيْهُ الخَشَبِيُّ العَرِيضُ كَمِنَصَّةِ بِيُوفِيه سَاخِنَةٍ.",
      },
      {
        context: "Decor Display",
        en: "A large framed landscape painting hangs above the elegant mid-century sideboard.",
        ar: "تُعَلَّقُ لَوْحَةٌ طَبِيعِيَّةٌ مُؤَطَّرَةٌ كَبِيرَةٌ فَوْقَ البُوفَيْهِ الأَنِيقِ.",
      },
    ],
    exampleSentence:
      "She stores her best crystal glasses and holiday tablecloths inside the oak sideboard.",
    exampleArabic:
      "تَحْفَظُ أَفْضَلَ كُؤُوسِ الكِرِيسْتَالِ وَمَفَارِشِ المَائِدَةِ دَاخِلَ البُوفَيْهِ الخَشَبِيِّ.",
  },
  silo: {
    id: "silo",
    arabic: "صَوْمَعَةُ غِلَال (صَوْمَعَة)",
    partOfSpeech: "noun",
    phonetic: "ˈsaɪ.loʊ",
    pronunciationTip: "Long 'i' diphthong /aɪ/ in 'SI' followed by long 'o' /loʊ/ (/ˈsaɪ.loʊ/).",
    collocations: [
      "grain silo",
      "tall silo",
      "concrete silo",
      "fill the silo",
      "metal silo",
      "silo tower",
    ],
    phrasalVerbs: [
      {
        phrase: "fill up with",
        meaning: "load grains into a silo",
        arabic: "يَمْلَأُ الصَّوْمَعَة",
        example: "The conveyor filled up the silo with freshly harvested golden corn.",
      },
    ],
    sentences: [
      {
        context: "Grain Storage",
        en: "The towering metal grain silo stores metric tons of harvested corn and wheat safely.",
        ar: "تَحْفَظُ صَوْمَعَةُ الغِلالِ المَعْدَنِيَّةُ الشَّاهِقَةُ أَطْنَاناً مِنَ الذُّرَةِ وَالقَمْحِ بِأَمَانٍ.",
      },
      {
        context: "Farm Landscape",
        en: "Silver cylindrical silos reflect the brilliant afternoon sun across the prairie.",
        ar: "تَعْكِسُ الصَّوَامِعُ الأُسْطُوَانِيَّةُ الفِضِّيَّةُ أَشِعَّةَ شَمْسِ الظَّهِيرَةِ عَلَى السُّهُولِ.",
      },
      {
        context: "Moisture Control",
        en: "Aeration fans inside the silo prevent grain spoilage and moisture buildup.",
        ar: "تَمْنَعُ مَرَاوِحُ التَّهْوِيَةِ دَاخِلَ الصَّوْمَعَةِ تَلَفَ الحُبُوبِ وَتَرَاكُمَ الرُّطُوبَةِ.",
      },
    ],
    exampleSentence:
      "The towering metal grain silo stores metric tons of harvested corn and wheat safely.",
    exampleArabic:
      "تَحْفَظُ صَوْمَعَةُ الغِلالِ المَعْدَنِيَّةُ الشَّاهِقَةُ أَطْنَاناً مِنَ الذُّرَةِ وَالقَمْحِ بِأَمَانٍ.",
  },
  slippers: {
    id: "slippers",
    arabic: "شَبْشَب / خُفّ مَنْزِلِيّ",
    partOfSpeech: "noun",
    phonetic: "ˈslɪp.ərz",
    pronunciationTip: "Short 'i' sound followed by a soft 'er' ending.",
    collocations: [
      "pair of slippers",
      "wear warm slippers",
      "slide into slippers",
      "comfortable slippers",
      "fuzzy slippers",
      "bedroom slippers",
    ],
    phrasalVerbs: [
      {
        phrase: "slip on",
        meaning: "put slippers on feet quickly",
        arabic: "يَلْبَسُ الخُفَّ بِسُرْعَة",
        example: "He slipped on his warm wool slippers as soon as he woke up.",
      },
      {
        phrase: "take off",
        meaning: "remove slippers",
        arabic: "يَخْلَعُ الخُفّ",
        example: "Take off your slippers before getting under the duvet.",
      },
    ],
    sentences: [
      {
        context: "Home Comfort",
        en: "She slid into her warm fleece slippers as soon as she walked through the door.",
        ar: "ارْتَدَتْ خُفَّهَا الصُّوفِيَّ الدَّافِئَ بِمُجَرَّدِ دُخُولِهَا مِنْ بَابِ المَنْزِلِ.",
      },
      {
        context: "Floor Protection",
        en: "Wearing soft-soled slippers prevents scratching delicate polished hardwood floors.",
        ar: "يَمْنَعُ ارْتِدَاءُ الخِفَافِ ذَاتِ النِّعَالِ النَّاعِمَةِ خَدْشَ الأَرْضِيَّاتِ الخَشَبِيَّةِ المَصْقُولَةِ.",
      },
      {
        context: "Morning Warmth",
        en: "Keep your slippers right next to the bed so your feet never touch the cold tiles.",
        ar: "احْتَفِظْ بِخُفَّيْكَ بِجِوَارِ السَّرِيرِ حَتَّى لا تَلْمَسَ قَدَمَاكَ البَلاطَ البَارِدَ.",
      },
    ],
    exampleSentence:
      "She slid into her warm fleece slippers as soon as she walked through the door.",
    exampleArabic:
      "ارْتَدَتْ خُفَّهَا الصُّوفِيَّ الدَّافِئَ بِمُجَرَّدِ دُخُولِهَا مِنْ بَابِ المَنْزِلِ.",
  },
  sofa: {
    id: "sofa",
    arabic: "أَرِيكَة (كَنَبَة)",
    partOfSpeech: "noun",
    phonetic: "ˈsoʊ.fə",
    pronunciationTip: "Two syllables with primary stress on 'SO' (/ˈsoʊ.fə/).",
    collocations: [
      "comfortable sofa",
      "leather sofa",
      "sit on the sofa",
      "sofa cushions",
      "three-seater sofa",
      "lounge on the sofa",
    ],
    phrasalVerbs: [
      {
        phrase: "sink into",
        meaning: "relax deeply into a soft sofa",
        arabic: "يَغُوصُ فِي الأَرِيكَة",
        example: "He sank into the plush velvet sofa after a long workday.",
      },
      {
        phrase: "lie down on",
        meaning: "recline on a sofa",
        arabic: "يَسْتَلْقِي عَلَى الأَرِيكَة",
        example: "She lay down on the sofa to take an afternoon nap.",
      },
    ],
    sentences: [
      {
        context: "Relaxing at Home",
        en: "The whole family gathered on the large sectional sofa to watch a film.",
        ar: "اجْتَمَعَتِ العَائِلَةُ بِأَكْمَلِهَا عَلَى الأَرِيكَةِ الكَبِيرَةِ لِمُشَاهَدَةِ فِيلْمٍ.",
      },
      {
        context: "Living Room Decor",
        en: "A sleek grey modern sofa anchors the center of the spacious living room.",
        ar: "تَتَوَسَّطُ أَرِيكَةٌ رَمَادِيَّةٌ عَصْرِيَّةٌ أَنِيقَةٌ مَرْكَزَ غُرْفَةِ المَعِيشَةِ الوَاسِعَةِ.",
      },
      {
        context: "Comfort",
        en: "Plump up the soft decorative cushions to keep the sofa looking inviting.",
        ar: "انْفُشِ الوِسَادَاتِ المَخْمَلِيَّةَ لِيَبْقَى مَظْهَرُ الأَرِيكَةِ مُرِيحاً وَجَذَّاباً.",
      },
    ],
    exampleSentence: "The whole family gathered on the large sectional sofa to watch a film.",
    exampleArabic:
      "اجْتَمَعَتِ العَائِلَةُ بِأَكْمَلِهَا عَلَى الأَرِيكَةِ الكَبِيرَةِ لِمُشَاهَدَةِ فِيلْمٍ.",
  },
  "sound-bar": {
    id: "sound-bar",
    arabic: "مُكَبِّرُ صَوْتٍ شَرِيطِيّ (سَاوَنْد بَار)",
    partOfSpeech: "noun",
    phonetic: "ˈsaʊnd.bɑːr",
    pronunciationTip: "Compound noun: 'SOUND' (/saʊnd/) + 'BAR' (/bɑːr/).",
    collocations: [
      "Bluetooth soundbar",
      "wireless subwoofer and soundbar",
      "connect the soundbar",
      "soundbar under the TV",
      "dialogue on the soundbar",
      "Dolby soundbar",
    ],
    phrasalVerbs: [
      {
        phrase: "pair with",
        meaning: "connect soundbar to TV or smartphone",
        arabic: "يَقْتَرِنُ بـ",
        example: "Pair the soundbar with your smart television via optical cable.",
      },
    ],
    sentences: [
      {
        context: "Audio Upgrade",
        en: "The sleek soundbar mounted directly below the television delivers crystal-clear dialogue.",
        ar: "يُقَدِّمُ السَّاوَنْد بَار الأَنِيقُ المُثَبَّتُ أَسْفَلَ التِّلْفَازِ صَوْتاً وَاضِحاً وَنَقِيّاً جِدّاً.",
      },
      {
        context: "Music Streaming",
        en: "Stream your favorite relaxing playlist from your smartphone to the wireless soundbar.",
        ar: "بُثَّ قَائِمَةَ مُوسِيقَاكَ المُفَضَّلَةَ مِنْ هَاتِفِكَ الذَّكِيِّ إِلَى السَّاوَنْد بَار اللّاسِلْكِيِّ.",
      },
      {
        context: "Cinema Experience",
        en: "The soundbar and its companion wireless subwoofer bring a true cinema experience home.",
        ar: "يَمْنَحُ السَّاوَنْد بَار مَعَ مُضَخِّمِ الصَّوْتِ اللّاسِلْكِيِّ تَجْرِبَةَ سِينِمَا مَنْزِلِيَّةً حَقِيقِيَّةً.",
      },
    ],
    exampleSentence:
      "The sleek soundbar mounted directly below the television delivers crystal-clear dialogue.",
    exampleArabic:
      "يُقَدِّمُ السَّاوَنْد بَار الأَنِيقُ المُثَبَّتُ أَسْفَلَ التِّلْفَازِ صَوْتاً وَاضِحاً وَنَقِيّاً جِدّاً.",
  },
  spatula: {
    id: "spatula",
    arabic: "مِلْعَقَةُ تَقْلِيب (سْبَاتْيُولا)",
    partOfSpeech: "noun",
    phonetic: "ˈspætʃ.ə.lə",
    pronunciationTip: "Three syllables: 'SPAT-chu-la' with primary stress on 'SPAT'.",
    collocations: [
      "silicone spatula",
      "metal spatula",
      "flip with a spatula",
      "scrape the bowl with a spatula",
      "heat-resistant spatula",
      "flexible spatula",
    ],
    phrasalVerbs: [
      {
        phrase: "scrape down",
        meaning: "clean the sides of a mixing bowl",
        arabic: "يَكْشِطُ جَوَانِبَ الوِعَاء",
        example: "Use the flexible spatula to scrape down the cake batter from the bowl.",
      },
      {
        phrase: "flip over",
        meaning: "turn food in a pan",
        arabic: "يَقْلِبُ",
        example: "Flip over the beef burger using a wide metal spatula.",
      },
    ],
    sentences: [
      {
        context: "Baking",
        en: "Use a flexible silicone spatula to scrape every bit of batter from the bowl.",
        ar: "اسْتَخْدِمْ مِلْعَقَةَ سْبَاتْيُولا مَرِنَةً لِكَشْطِ جَمِيعِ بَقَايَا العَجِينِ مِنَ الوِعَاءِ.",
      },
      {
        context: "Cooking Burgers",
        en: "He slid the wide spatula under the burger patty to flip it neatly.",
        ar: "مَرَّرَ السْبَاتْيُولا العَرِيضَةَ تَحْتَ قِطْعَةِ البُرْجَر لِقَلْبِهَا بِإِتْقَانٍ.",
      },
      {
        context: "Heat Safety",
        en: "Heat-resistant silicone spatulas will not melt when stirring hot sauces.",
        ar: "المَلاعِقُ السِّيلِيكُونِيَّةُ المُقَاوِمَةُ لِلْحَرَارَةِ لا تَذُوبُ عِنْدَ تَقْلِيبِ الصَّلْصَاتِ السَّاخِنَةِ.",
      },
    ],
    exampleSentence: "Use a flexible silicone spatula to scrape every bit of batter from the bowl.",
    exampleArabic:
      "اسْتَخْدِمْ مِلْعَقَةَ سْبَاتْيُولا مَرِنَةً لِكَشْطِ جَمِيعِ بَقَايَا العَجِينِ مِنَ الوِعَاءِ.",
  },
  speaker: {
    id: "speaker",
    arabic: "مُكَبِّرُ صَوْت (سَبِيكَر / سَمَّاعَة)",
    partOfSpeech: "noun",
    phonetic: "ˈspiː.kər",
    pronunciationTip: "Long 'ee' vowel /iː/ as in 'speak', followed by soft /kər/.",
    collocations: [
      "Bluetooth speaker",
      "wireless speaker",
      "turn up the speaker",
      "portable speaker",
      "connect to the speaker",
      "loud speaker",
    ],
    phrasalVerbs: [
      {
        phrase: "turn up",
        meaning: "increase audio volume",
        arabic: "يَرْفَعُ الصَّوْت",
        example: "Turn up the Bluetooth speaker so everyone can hear the music.",
      },
      {
        phrase: "turn down",
        meaning: "decrease audio volume",
        arabic: "يَخْفِضُ الصَّوْت",
        example: "Please turn down the speaker if the neighbors are sleeping.",
      },
      {
        phrase: "pair with",
        meaning: "connect via Bluetooth",
        arabic: "يَقْتَرِنُ بـ",
        example: "Pair your smartphone with the portable speaker in seconds.",
      },
    ],
    sentences: [
      {
        context: "Music & Leisure",
        en: "He connected his phone to the portable Bluetooth speaker to play music.",
        ar: "وَصَلَ هَاتِفَهُ بِمُكَبِّرِ الصَّوْتِ اللّاسِلْكِيِّ لِتَشْغِيلِ المُوسِيقَى.",
      },
      {
        context: "Home Audio",
        en: "The smart home speaker responds instantly to voice commands and questions.",
        ar: "يَسْتَجِيبُ مُكَبِّرُ الصَّوْتِ المَنْزِلِيُّ الذَّكِيُّ لِلأَوَامِرِ الصَّوْتِيَّةِ عَلَى الفَوْرِ.",
      },
      {
        context: "Sound Quality",
        en: "The stereo speakers deliver deep rich bass and crystal-clear vocals.",
        ar: "تُقَدِّمُ سَمَّاعَاتُ الاِسْتِرْيُو صَوْتاً عَمِيقاً وَنَقِيّاً بِأَعْلَى جَوْدَةٍ.",
      },
    ],
    exampleSentence: "He connected his phone to the portable Bluetooth speaker to play music.",
    exampleArabic: "وَصَلَ هَاتِفَهُ بِمُكَبِّرِ الصَّوْتِ اللّاسِلْكِيِّ لِتَشْغِيلِ المُوسِيقَى.",
  },
  spoon: {
    id: "spoon",
    arabic: "مِلْعَقَة",
    partOfSpeech: "noun",
    phonetic: "spuːn",
    pronunciationTip: "Long 'oo' sound /uː/ as in 'moon' or 'soon'.",
    collocations: [
      "tablespoon",
      "teaspoon",
      "wooden spoon",
      "soup spoon",
      "stir with a spoon",
      "silver spoon",
    ],
    phrasalVerbs: [
      {
        phrase: "spoon out",
        meaning: "serve food using a large spoon",
        arabic: "يَغْرِفُ بِالمِلْعَقَة",
        example: "She spooned out generous portions of rice for the guests.",
      },
      {
        phrase: "stir in",
        meaning: "mix in an ingredient with a spoon",
        arabic: "يُقَلِّبُ مُكَوِّناً",
        example: "Stir in a spoonful of honey into the herbal tea.",
      },
    ],
    sentences: [
      {
        context: "Dessert & Coffee",
        en: "He added a teaspoon of brown sugar and stirred his espresso with a small spoon.",
        ar: "أَضَافَ مِلْعَقَةَ شَايٍ مِنْ السُّكَّرِ البُنِّيِّ وَقَلَّبَ قَهْوَتَهُ بِمِلْعَقَةٍ صَغِيرَةٍ.",
      },
      {
        context: "Cooking Soup",
        en: "She tasted the broth with a wooden spoon to check the seasoning.",
        ar: "تَذَوَّقَتِ المَرَقَ بِمِلْعَقَةٍ خَشَبِيَّةٍ لِلتَّأَكُّدِ مِنْ ضَبْطِ البَهَارَاتِ.",
      },
      {
        context: "Table Manners",
        en: "Hold the soup spoon delicately and sip from the side of the bowl.",
        ar: "أَمْسِكْ مِلْعَقَةَ الشُّورْبَةِ بِأَنَاقَةٍ وَارْشُفْ مِنْ جَانِبِ المِلْعَقَةِ.",
      },
    ],
    exampleSentence:
      "He added a teaspoon of brown sugar and stirred his espresso with a small spoon.",
    exampleArabic:
      "أَضَافَ مِلْعَقَةَ شَايٍ مِنْ السُّكَّرِ البُنِّيِّ وَقَلَّبَ قَهْوَتَهُ بِمِلْعَقَةٍ صَغِيرَةٍ.",
  },
  stable: {
    id: "stable",
    arabic: "إِسْطَبْل (مَأْوَى الخُيُول)",
    partOfSpeech: "noun",
    phonetic: "ˈsteɪ.bəl",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'table', followed by soft /bəl/.",
    collocations: [
      "horse stable",
      "clean the stable",
      "stable stall",
      "wooden stable",
      "stable boy",
      "keep horses in a stable",
    ],
    phrasalVerbs: [
      {
        phrase: "muck out",
        meaning: "clean animal waste from a stable",
        arabic: "يُنَظِّفُ الإِسْطَبْل",
        example: "He spent the morning mucking out the horses' stable stalls.",
      },
    ],
    sentences: [
      {
        context: "Equine Care",
        en: "Each thoroughbred horse rests comfortably in a clean, straw-filled stable stall.",
        ar: "يَسْتَرِيحُ كُلُّ حِصَانٍ أَصِيلٍ فِي جَنَاحِهِ المَفْرُوشِ بِالقَشِّ النَّظِيفِ فِي الإِسْطَبْلِ.",
      },
      {
        context: "Daily Routine",
        en: "The groom opens the stable doors every morning to let the horses out to pasture.",
        ar: "يَفْتَحُ السَّائِسُ أَبْوَابَ الإِسْطَبْلِ كُلَّ صَبَاحٍ لِتَنْطَلِقَ الخُيُولُ إِلَى المَرْعَى.",
      },
      {
        context: "Facility Design",
        en: "The well-ventilated timber stable provides excellent protection during chilly winters.",
        ar: "يُوَفِّرُ الإِسْطَبْلُ الخَشَبِيُّ جَيِّدُ التَّهْوِيَةِ حِمَايَةً مُمْتَازَةً فِي لَيَالِي الشِّتَاءِ.",
      },
    ],
    exampleSentence:
      "Each thoroughbred horse rests comfortably in a clean, straw-filled stable stall.",
    exampleArabic:
      "يَسْتَرِيحُ كُلُّ حِصَانٍ أَصِيلٍ فِي جَنَاحِهِ المَفْرُوشِ بِالقَشِّ النَّظِيفِ فِي الإِسْطَبْلِ.",
  },
  steamer: {
    id: "steamer",
    arabic: "قِدْرُ البُخَار (حَلَّةُ بُخَار / مِبْخَرَة)",
    partOfSpeech: "noun",
    phonetic: "ˈstiː.mər",
    pronunciationTip: "Long 'ee' vowel /iː/ as in 'steam'.",
    collocations: [
      "bamboo steamer",
      "food steamer",
      "steam in a steamer",
      "vegetable steamer",
      "electric food steamer",
      "steamer basket",
    ],
    phrasalVerbs: [
      {
        phrase: "steam up",
        meaning: "cook food using hot steam",
        arabic: "يَطْبُخُ عَلَى البُخَار",
        example: "Steam up the dumplings in the bamboo basket for ten minutes.",
      },
    ],
    sentences: [
      {
        context: "Healthy Cooking",
        en: "Steaming broccoli and carrots in a bamboo steamer preserves their vital nutrients.",
        ar: "يُحَافِظُ طَهْيُ البُرُوكْلِي وَالجَزَرِ فِي قِدْرِ البُخَارِ عَلَى عَنَاصِرِهِمَا الغِذَائِيَّةِ.",
      },
      {
        context: "Dim Sum",
        en: "Stack three tiers of bamboo steamers to cook chicken dumplings simultaneously.",
        ar: "رَصَّ ثَلاثَ طَبَقَاتٍ مِنْ مَبَاخِرِ الخَيْزُرَانِ لِطَهْيِ زَلابِيَا الدَّجَاجِ فِي وَقْتٍ وَاحِدٍ.",
      },
      {
        context: "Fish Cooking",
        en: "Delicate white fish fillets steam to perfection in just eight minutes.",
        ar: "تَنْضَجُ شَرَائِحُ السَّمَكِ الأَبْيَضِ الرَّقِيقَةُ بِشَكْلٍ مِثَالِيٍّ عَلَى البُخَارِ فِي 8 دَقَائِقَ.",
      },
    ],
    exampleSentence:
      "Steaming broccoli and carrots in a bamboo steamer preserves their vital nutrients.",
    exampleArabic:
      "يُحَافِظُ طَهْيُ البُرُوكْلِي وَالجَزَرِ فِي قِدْرِ البُخَارِ عَلَى عَنَاصِرِهِمَا الغِذَائِيَّةِ.",
  },
  stool: {
    id: "stool",
    arabic: "كُرْسِيٌّ صَغِير (طَبْلِيَّة / مَقْعَدٌ بِلَا ظَهْر)",
    partOfSpeech: "noun",
    phonetic: "stuːl",
    pronunciationTip: "Long 'oo' sound as in 'cool' or 'school'.",
    collocations: [
      "wooden stool",
      "bar stool",
      "step stool",
      "sit on a stool",
      "sturdy stool",
      "kitchen stool",
    ],
    phrasalVerbs: [
      {
        phrase: "step up",
        meaning: "step onto a stool to reach something high",
        arabic: "يَصْعَدُ عَلَى",
        example: "She stepped up on the step stool to reach the top shelf.",
      },
      {
        phrase: "sit on",
        meaning: "take a seat upon a stool",
        arabic: "يَجْلِسُ عَلَى",
        example: "He sat on a wooden stool while playing the guitar.",
      },
    ],
    sentences: [
      {
        context: "Reaching High",
        en: "She used a sturdy step stool to change the ceiling light bulb.",
        ar: "اسْتَخْدَمَتْ مَقْعَداً خَشَبِيّاً مَتِيناً لِتَغْيِيرِ مِصْبَاحِ السَّقْفِ.",
      },
      {
        context: "Breakfast Area",
        en: "Three modern bar stools are placed around the kitchen counter.",
        ar: "تَمَّ وَضْعُ ثَلاثَةِ مَقَاعِدَ حَدِيثَةٍ حَوْلَ طَاوِلَةِ المَطْبَخِ.",
      },
      {
        context: "Practical Use",
        en: "A small stool sits beside the dressing table in the bedroom.",
        ar: "يَسْتَقِرُّ مَقْعَدٌ صَغِيرٌ بِجِوَارِ طَاوِلَةِ التَّسْرِيحِ فِي غُرْفَةِ النَّوْمِ.",
      },
    ],
    exampleSentence: "She used a sturdy step stool to change the ceiling light bulb.",
    exampleArabic: "اسْتَخْدَمَتْ مَقْعَداً خَشَبِيّاً مَتِيناً لِتَغْيِيرِ مِصْبَاحِ السَّقْفِ.",
  },
  stove: {
    id: "stove",
    arabic: "مَوْقِدُ غَاز / بُوتَاجَاز",
    partOfSpeech: "noun",
    phonetic: "stoʊv",
    pronunciationTip: "Long 'o' vowel /oʊ/ rhyming with 'cove' or 'drove'.",
    collocations: [
      "gas stove",
      "turn on the stove",
      "turn off the stove",
      "stove burner",
      "cook on the stove",
      "clean the stove",
    ],
    phrasalVerbs: [
      {
        phrase: "turn on",
        meaning: "ignite or start the stove burner",
        arabic: "يُشْعِلُ المَوْقِد",
        example: "Turn on the stove to medium heat to simmer the sauce.",
      },
      {
        phrase: "turn off",
        meaning: "extinguish the stove flame",
        arabic: "يُطْفِئُ المَوْقِد",
        example: "Always turn off the stove immediately after removing the pan.",
      },
      {
        phrase: "boil over",
        meaning: "liquid overflowing from pot on stove",
        arabic: "يَفُورُ عَلَى المَوْقِد",
        example: "Turn down the heat before the soup boils over.",
      },
    ],
    sentences: [
      {
        context: "Cooking",
        en: "He placed a heavy saucepan on the gas stove to boil some pasta.",
        ar: "وَضَعَ قِدْراً ثَقِيلاً عَلَى مَوْقِدِ الغَازِ لِسَلْقِ المَعْكَرُونَةِ.",
      },
      {
        context: "Kitchen Safety",
        en: "Double-check that all stove burners are completely turned off before leaving home.",
        ar: "تَأَكَّدْ تَمَاماً مِنْ إِطْفَاءِ جَمِيعِ شُعَلاتِ المَوْقِدِ قَبْلَ مُغَادَرَةِ المَنْزِلِ.",
      },
      {
        context: "Cleaning",
        en: "Wipe grease splatters from the glass stovetop while it is still warm.",
        ar: "امْسَحْ بُقَعَ الزَّيْتِ عَنْ سَطْحِ المَوْقِدِ الزُّجَاجِيِّ وَهُوَ لا يَزَالُ دَافِئاً.",
      },
    ],
    exampleSentence: "He placed a heavy saucepan on the gas stove to boil some pasta.",
    exampleArabic: "وَضَعَ قِدْراً ثَقِيلاً عَلَى مَوْقِدِ الغَازِ لِسَلْقِ المَعْكَرُونَةِ.",
  },
  straw: {
    id: "straw",
    arabic: "تِبْن (قَشُّ زِرَاعَة)",
    partOfSpeech: "noun",
    phonetic: "strɔː",
    pronunciationTip: "Broad 'aw' sound /strɔː/ as in 'draw' or 'law'.",
    collocations: [
      "straw bedding",
      "bale of straw",
      "straw hat",
      "golden straw",
      "spread straw",
      "drinking straw",
    ],
    phrasalVerbs: [
      {
        phrase: "spread out",
        meaning: "scatter straw across barn stalls",
        arabic: "يَفْرِشُ التِّبْنَ كَفِرَاش",
        example: "Spread out fresh golden straw for comfortable animal bedding.",
      },
    ],
    sentences: [
      {
        context: "Animal Bedding",
        en: "The farmer spread clean, dry wheat straw across the barn floor for cozy calf bedding.",
        ar: "فَرَشَ المُزَارِعُ تِبْنَ القَمْحِ الجَافَّ النَّظِيفَ عَلَى أَرْضِيَّةِ الحَظِيرَةِ لِتَدْفِئَةِ العُجُولِ.",
      },
      {
        context: "Garden Mulch",
        en: "Layer golden straw around strawberry plants to retain soil moisture and suppress weeds.",
        ar: "ضَعْ طَبَقَةً مِنْ قَشِّ الزِّرَاعَةِ حَوْلَ شُجَيْرَاتِ الفَرَاوِلَةِ لِحِفْظِ الرُّطُوبَةِ وَمَنْعِ الحَشَائِشِ.",
      },
      {
        context: "Sun Protection",
        en: "He wore a wide-brimmed woven straw hat to shield his neck from the blazing midday sun.",
        ar: "ارْتَدَى قُبَّعَةَ قَشٍّ عَرِيضَةَ الحَوَافِّ لِحِمَايَةِ عُنُقِهِ مِنْ أَشِعَّةِ الشَّمْسِ الحَارِقَةِ.",
      },
    ],
    exampleSentence:
      "The farmer spread clean, dry wheat straw across the barn floor for cozy calf bedding.",
    exampleArabic:
      "فَرَشَ المُزَارِعُ تِبْنَ القَمْحِ الجَافَّ النَّظِيفَ عَلَى أَرْضِيَّةِ الحَظِيرَةِ لِتَدْفِئَةِ العُجُولِ.",
  },
  "string-lights": {
    id: "string-lights",
    arabic: "حِبَالُ إِضَاءَة (فِرْعُ نُور / إِضَاءَةُ زِينَة)",
    partOfSpeech: "noun",
    phonetic: "ˈstrɪŋ ˌlaɪts",
    pronunciationTip: "Compound noun: 'STRING' (/strɪŋ/) + 'LIGHTS' (/laɪts/). Always plural.",
    collocations: [
      "fairy string lights",
      "hang string lights",
      "warm white string lights",
      "outdoor string lights",
      "plug in string lights",
      "twinkling string lights",
    ],
    phrasalVerbs: [
      {
        phrase: "hang up",
        meaning: "drape string lights along walls or patio",
        arabic: "يُعَلِّقُ فِرْعَ النُّور",
        example: "Hang up the twinkle string lights around the patio pergola.",
      },
    ],
    sentences: [
      {
        context: "Magical Ambiance",
        en: "Delicate fairy string lights draped across the bookshelf create a warm, magical evening glow.",
        ar: "تَمْنَحُ حِبَالُ الإِضَاءَةِ النَّاعِمَةُ المُعَلَّقَةُ عَلَى رَفِّ الكُتُبِ تَوَهُّجاً سَاحِراً فِي المَسَاءِ.",
      },
      {
        context: "Balcony Styling",
        en: "They strung warm white outdoor lights along the balcony railing for summer barbecues.",
        ar: "عَلَّقُوا حِبَالَ إِضَاءَةٍ دَافِئَةً عَلَى سِيَاجِ الشُّرْفَةِ لِحَفَلاتِ الشِّوَاءِ الصَّيْفِيَّةِ.",
      },
      {
        context: "Festive Decor",
        en: "Twinkling multicolored string lights decorated the living room during the holiday season.",
        ar: "زَيَّنَتْ فُرُوعُ النُّورِ المُلَوَّنَةُ المُتَلَأْلِئَةُ غُرْفَةَ المَعِيشَةِ خِلالَ مَوْسِمِ الأَعْيَادِ.",
      },
    ],
    exampleSentence:
      "Delicate fairy string lights draped across the bookshelf create a warm, magical evening glow.",
    exampleArabic:
      "تَمْنَحُ حِبَالُ الإِضَاءَةِ النَّاعِمَةُ المُعَلَّقَةُ عَلَى رَفِّ الكُتُبِ تَوَهُّجاً سَاحِراً فِي المَسَاءِ.",
  },
  sugar: {
    id: "sugar",
    arabic: "سُكَّر",
    partOfSpeech: "noun",
    phonetic: "ˈʃʊɡ.ər",
    pronunciationTip: "Begins with 'sh' sound (/ʃ/) followed by short /ʊ/ as in 'put'.",
    collocations: [
      "granulated sugar",
      "brown sugar",
      "spoonful of sugar",
      "powdered sugar",
      "cup of sugar",
      "sugar bowl",
    ],
    phrasalVerbs: [
      {
        phrase: "stir in",
        meaning: "dissolve sugar into hot beverage",
        arabic: "يُقَلِّبُ السُّكَّر",
        example: "Stir in a spoonful of sugar into your morning espresso.",
      },
      {
        phrase: "dust with",
        meaning: "sprinkle powdered sugar lightly",
        arabic: "يَرُشُّ بِالسُّكَّرِ البُودْرَة",
        example: "Dust the warm apple tart with powdered icing sugar.",
      },
    ],
    sentences: [
      {
        context: "Baking",
        en: "Beat the softened butter and granulated white sugar together until pale and fluffy.",
        ar: "اخْفِقِ الزُّبْدَةَ الطَّرِيَّةَ مَعَ السُّكَّرِ الأَبْيَضِ حَتَّى يُصْبِحَ المَزِيجُ هَشّاً وَفَاتِحَ اللَّوْنِ.",
      },
      {
        context: "Sweetening Coffee",
        en: "He added half a teaspoon of raw brown sugar to sweeten his black coffee.",
        ar: "أَضَافَ نِصْفَ مِلْعَقَةِ شَايٍ مِنْ السُّكَّرِ البُنِّيِّ لِتَحْلِيَةِ قَهْوَتِهِ السَّوْدَاءِ.",
      },
      {
        context: "Pantry Storage",
        en: "Keep white sugar stored in an airtight canister to prevent clumping and moisture.",
        ar: "احْفَظِ السُّكَّرَ الأَبْيَضَ فِي عُلْبَةٍ مُحْكَمَةِ الإِغْلاقِ لِمَنْعِ تَكَتُّلِهِ مِنَ الرُّطُوبَةِ.",
      },
    ],
    exampleSentence:
      "Beat the softened butter and granulated white sugar together until pale and fluffy.",
    exampleArabic:
      "اخْفِقِ الزُّبْدَةَ الطَّرِيَّةَ مَعَ السُّكَّرِ الأَبْيَضِ حَتَّى يُصْبِحَ المَزِيجُ هَشّاً وَفَاتِحَ اللَّوْنِ.",
  },
  sunrise: {
    id: "sunrise",
    arabic: "شُرُوقُ الشَّمْس",
    partOfSpeech: "noun",
    phonetic: "ˈsʌn.raɪz",
    pronunciationTip: "Compound noun: 'SUN' (/sʌn/) + 'RISE' (/raɪz/).",
    collocations: [
      "at sunrise",
      "watch the sunrise",
      "golden sunrise",
      "before sunrise",
      "beautiful sunrise",
      "sunrise over the fields",
    ],
    phrasalVerbs: [
      {
        phrase: "rise up",
        meaning: "ascend into the sky",
        arabic: "تَشْرُقُ وَتَرْتَفِع",
        example: "The golden sun rose up above the eastern mountain ridge.",
      },
    ],
    sentences: [
      {
        context: "Morning Beauty",
        en: "The golden sunrise painted the morning sky in vibrant streaks of amber and rose.",
        ar: "لَوَّنَ شُرُوقُ الشَّمْسِ الذَّهَبِيُّ سَمَاءَ الصَّبَاحِ بِخُطُوطٍ بَدِيعَةٍ مِنَ العَنْبَرِ وَالوَرْدِيِّ.",
      },
      {
        context: "Farm Schedule",
        en: "The farmer starts his daily tractor chores at sunrise to beat the intense midday heat.",
        ar: "يَبْدَأُ المُزَارِعُ أَعْمَالَ الجَرَّارِ عِنْدَ الشُّرُوقِ لِتَفَادِي حَرَارَةِ الظَّهِيرَةِ الشَّدِيدَةِ.",
      },
      {
        context: "Birdsong",
        en: "Robins and songbirds began their melodious chorus the moment the first rays of sunrise appeared.",
        ar: "بَدَأَتِ العَصَافِيرُ تَغْرِيدَهَا العَذْبَ مَعَ ظُهُورِ أَوَّلِ خُيُوطِ شُرُوقِ الشَّمْسِ.",
      },
    ],
    exampleSentence:
      "The golden sunrise painted the morning sky in vibrant streaks of amber and rose.",
    exampleArabic:
      "لَوَّنَ شُرُوقُ الشَّمْسِ الذَّهَبِيُّ سَمَاءَ الصَّبَاحِ بِخُطُوطٍ بَدِيعَةٍ مِنَ العَنْبَرِ وَالوَرْدِيِّ.",
  },
  sunset: {
    id: "sunset",
    arabic: "غُرُوبُ الشَّمْس (مَغْرِب)",
    partOfSpeech: "noun",
    phonetic: "ˈsʌn.sɛt",
    pronunciationTip: "Compound noun: 'SUN' (/sʌn/) + 'SET' (/sɛt/).",
    collocations: [
      "at sunset",
      "watch the sunset",
      "spectacular sunset",
      "sunset glow",
      "stunning sunset",
      "sunset over the horizon",
    ],
    phrasalVerbs: [
      {
        phrase: "go down",
        meaning: "descend below the horizon",
        arabic: "تَغْرُبُ الشَّمْس",
        example: "The fiery red sun went down behind the western hills.",
      },
    ],
    sentences: [
      {
        context: "Evening Splendor",
        en: "They sat on the farmhouse front porch watching the spectacular violet and orange sunset.",
        ar: "جَلَسُوا عَلَى شُرْفَةِ بَيْتِ المَزْرَعَةِ يُشَاهِدُونَ غُرُوبَ الشَّمْسِ البَنَفْسَجِيَّ السَّاحِرَ.",
      },
      {
        context: "End of Workday",
        en: "The farmhands locked the barn doors and headed home as sunset cast long shadows.",
        ar: "أَقْفَلَ عُمَّالُ المَزْرَعَةِ أَبْوَابَ الحَظِيرَةِ مَعَ حُلُولِ الغُرُوبِ وَامْتِدَادِ الظِّلالِ.",
      },
      {
        context: "Peaceful Ambiance",
        en: "The evening breeze cooled the sun-warmed earth immediately following sunset.",
        ar: "لَطَّفَ نَسِيمُ المَسَاءِ حَرَارَةَ الأَرْضِ بَعْدَ غُرُوبِ الشَّمْسِ مُبَاشَرَةً.",
      },
    ],
    exampleSentence:
      "They sat on the farmhouse front porch watching the spectacular violet and orange sunset.",
    exampleArabic:
      "جَلَسُوا عَلَى شُرْفَةِ بَيْتِ المَزْرَعَةِ يُشَاهِدُونَ غُرُوبَ الشَّمْسِ البَنَفْسَجِيَّ السَّاحِرَ.",
  },
  "table-lamp": {
    id: "table-lamp",
    arabic: "مِصْبَاحُ طَاوِلَة (أَبَاجُورَةُ تَرَابِيزَة)",
    partOfSpeech: "noun",
    phonetic: "ˈteɪ.bəl ˌlæmp",
    pronunciationTip: "Compound noun: 'TABLE' (/ˈteɪ.bəl/) + 'LAMP' (/læmp/).",
    collocations: [
      "ceramic table lamp",
      "brass table lamp",
      "turn off the table lamp",
      "bedside table lamp",
      "table lamp shade",
      "accent table lamp",
    ],
    phrasalVerbs: [
      {
        phrase: "switch on",
        meaning: "turn on table lamp",
        arabic: "يُضِيءُ أَبَاجُورَةَ الطَّاوِلَة",
        example: "Switch on the table lamp on the entryway console.",
      },
    ],
    sentences: [
      {
        context: "Living Room Accents",
        en: "A pair of matching ceramic table lamps on either side of the sofa adds symmetry.",
        ar: "يُضِيفُ زَوْجٌ مِنْ مَصَابِيحِ الطَّاوِلَةِ الخَزَفِيَّةِ المُتَطَابِقَةِ عَلَى جَانِبَيِ الأَرِيكَةِ تَنَاغُماً رَائِعاً.",
      },
      {
        context: "Warm Glow",
        en: "The textured linen lampshade diffuses the warm incandescent bulb into a soft glow.",
        ar: "يَكْسِرُ غِطَاءُ المِصْبَاحِ الكَتَّانِيُّ ضَوْءَ اللَّمْبَةِ لِيَنْشُرَ تَوَهُّجاً نَاعِماً مُرِيحاً.",
      },
      {
        context: "Bedside Reading",
        en: "She switched off the table lamp on her nightstand before going to sleep.",
        ar: "أَطْفَأَتْ مِصْبَاحَ الطَّاوِلَةِ المَوْجُودَ عَلَى كُمودِينَتِهَا قَبْلَ أَنْ تَخْلُدَ لِلنَّوْمِ.",
      },
    ],
    exampleSentence:
      "A pair of matching ceramic table lamps on either side of the sofa adds symmetry.",
    exampleArabic:
      "يُضِيفُ زَوْجٌ مِنْ مَصَابِيحِ الطَّاوِلَةِ الخَزَفِيَّةِ المُتَطَابِقَةِ عَلَى جَانِبَيِ الأَرِيكَةِ تَنَاغُماً رَائِعاً.",
  },
  tablecloth: {
    id: "tablecloth",
    arabic: "مَفْرَشُ طَاوِلَة",
    partOfSpeech: "noun",
    phonetic: "ˈteɪ.bəl.klɑːθ",
    pronunciationTip: "Compound noun: 'TABLE' (/ˈteɪ.bəl/) + 'CLOTH' (/klɑːθ/).",
    collocations: [
      "linen tablecloth",
      "white tablecloth",
      "spread the tablecloth",
      "spill on the tablecloth",
      "checkered tablecloth",
      "iron the tablecloth",
    ],
    phrasalVerbs: [
      {
        phrase: "spread out",
        meaning: "lay a tablecloth flat across a table",
        arabic: "يَفْرِشُ المَفْرَش",
        example: "Spread out the clean white linen tablecloth over the dining table.",
      },
    ],
    sentences: [
      {
        context: "Holiday Dinner",
        en: "She spread a crisp white linen tablecloth across the dining table for the celebratory meal.",
        ar: "فَرَشَتْ مَفْرَشَ طَاوِلَةٍ كَتَّانِيّاً أَبْيَضَ أَنِيقاً عَلَى سُفْرَةِ الطَّعَامِ لِلاِحْتِفَالِ.",
      },
      {
        context: "Casual Picnic",
        en: "A classic red-and-white checkered tablecloth gave the garden lunch a cheerful rustic vibe.",
        ar: "أَضْفَى مَفْرَشُ الطَّاوِلَةِ المُرَبَّعُ بِالأَحْمَرِ وَالأَبْيَضِ أَجْوَاءً رِيفِيَّةً بَهِيجَةً.",
      },
      {
        context: "Laundry Care",
        en: "Pre-treat any red wine or gravy stains before washing the fine cotton tablecloth.",
        ar: "عَالِجْ بُقَعَ العَصِيرِ أَوِ الصَّلْصَةِ قَبْلَ غَسْلِ مَفْرَشِ الطَّاوِلَةِ القُطْنِيِّ الفَاخِرِ.",
      },
    ],
    exampleSentence:
      "She spread a crisp white linen tablecloth across the dining table for the celebratory meal.",
    exampleArabic:
      "فَرَشَتْ مَفْرَشَ طَاوِلَةٍ كَتَّانِيّاً أَبْيَضَ أَنِيقاً عَلَى سُفْرَةِ الطَّعَامِ لِلاِحْتِفَالِ.",
  },
  tablet: {
    id: "tablet",
    arabic: "جِهَازٌ لَوْحِيّ (تَابْلِت)",
    partOfSpeech: "noun",
    phonetic: "ˈtæb.lɪt",
    pronunciationTip: "Short 'a' vowel /æ/ as in 'tab', followed by short /lɪt/.",
    collocations: [
      "touch-screen tablet",
      "read on a tablet",
      "charge the tablet",
      "tablet screen",
      "unlock the tablet",
      "portable tablet",
    ],
    phrasalVerbs: [
      {
        phrase: "swipe on",
        meaning: "navigate with touch gestures",
        arabic: "يَمْسَحُ بِالإِصْبَعِ عَلَى الشَّاشَة",
        example: "Swipe on the tablet screen to turn the e-book page.",
      },
      {
        phrase: "charge up",
        meaning: "recharge battery",
        arabic: "يَشْحَنُ",
        example: "Charge up the tablet before leaving for your road trip.",
      },
    ],
    sentences: [
      {
        context: "Digital Reading",
        en: "She prefers reading digital magazines on her lightweight touch-screen tablet.",
        ar: "تُفَضِّلُ قِرَاءَةَ المَجَلاَّتِ الرَّقْمِيَّةِ عَلَى جِهَازِهَا اللَّوْحِيِّ الخَفِيفِ.",
      },
      {
        context: "Entertainment",
        en: "The children watched an educational animated documentary on the tablet.",
        ar: "شَاهَدَ الأَطْفَالُ وَثَائِقِيّاً تَعْلِيمِيّاً كَرْتُونِيّاً عَلَى الجِهَازِ اللَّوْحِيِّ.",
      },
      {
        context: "Productivity",
        en: "He uses a stylus pen to sketch architectural drawings directly on his tablet.",
        ar: "يَسْتَخْدِمُ قَلَماً ذَكِيّاً لِرَسْمِ المُخَطَّطَاتِ الهَنْدَسِيَّةِ مُبَاشَرَةً عَلَى التَّابْلِت.",
      },
    ],
    exampleSentence:
      "She prefers reading digital magazines on her lightweight touch-screen tablet.",
    exampleArabic:
      "تُفَضِّلُ قِرَاءَةَ المَجَلاَّتِ الرَّقْمِيَّةِ عَلَى جِهَازِهَا اللَّوْحِيِّ الخَفِيفِ.",
  },
  tapestry: {
    id: "tapestry",
    arabic: "نَسِيجٌ جِدَارِيّ (سَجَّادُ حَائِط / تَابِسْتْرِي)",
    partOfSpeech: "noun",
    phonetic: "ˈtæp.ə.stri",
    pronunciationTip: "Three syllables: 'TAP-es-try' (/ˈtæp.ə.stri/).",
    collocations: [
      "woven tapestry",
      "hang a tapestry",
      "wall tapestry",
      "medieval tapestry",
      "colorful tapestry",
      "bohemian tapestry",
    ],
    phrasalVerbs: [
      {
        phrase: "hang up",
        meaning: "mount a decorative tapestry on a wall",
        arabic: "يُعَلِّقُ النَّسِيجَ الجِدَارِيّ",
        example: "They hung up a large woven bohemian tapestry above the bed.",
      },
    ],
    sentences: [
      {
        context: "Wall Decoration",
        en: "A magnificent handwoven wool tapestry depicting a forest landscape covers the living room wall.",
        ar: "يُغَطِّي نَسِيجٌ جِدَارِيٌّ صُوفِيٌّ يَدَوِيٌّ رَائِعٌ يُصَوِّرُ غَابَةً جِدَارَ غُرْفَةِ المَعِيشَةِ.",
      },
      {
        context: "Acoustic Warmth",
        en: "Hanging a heavy fabric tapestry softens sound echoes in large open-plan spaces.",
        ar: "يُسَاعِدُ تَعْلِيقُ سَجَّادِ الحَائِطِ القُمَاشِيِّ الثَّقِيلِ فِي تَقْلِيلِ صَدَى الصَّوْتِ فِي المَسَاحَاتِ المَفْتُوحَةِ.",
      },
      {
        context: "Historic Art",
        en: "The museum preserves medieval tapestries woven with intricate silk and gold threads.",
        ar: "يَحْفَظُ المَتْحَفُ مَنْسُوجَاتٍ جِدَارِيَّةً تَارِيخِيَّةً مَحْبُوكَةً بِخُيُوطِ الحَرِيرِ وَالذَّهَبِ.",
      },
    ],
    exampleSentence:
      "A magnificent handwoven wool tapestry depicting a forest landscape covers the living room wall.",
    exampleArabic:
      "يُغَطِّي نَسِيجٌ جِدَارِيٌّ صُوفِيٌّ يَدَوِيٌّ رَائِعٌ يُصَوِّرُ غَابَةً جِدَارَ غُرْفَةِ المَعِيشَةِ.",
  },
  "teddy-bear": {
    id: "teddy-bear",
    arabic: "دُبٌّ لُعْبَة (دُبٌّ قُمَاشِيّ)",
    partOfSpeech: "noun",
    phonetic: "ˈtɛd.i ˌbɛər",
    pronunciationTip: "Compound word: 'TEDDY' + 'BEAR' (rhymes with 'hair').",
    collocations: [
      "stuffed teddy bear",
      "plush teddy bear",
      "hold a teddy bear",
      "childhood teddy bear",
      "soft brown teddy bear",
      "sleep with a teddy bear",
    ],
    phrasalVerbs: [
      {
        phrase: "cuddle up with",
        meaning: "hold closely in bed",
        arabic: "يَحْتَضِنُ بِحَنَان",
        example: "The toddler cuddled up with her favorite teddy bear at bedtime.",
      },
      {
        phrase: "hold onto",
        meaning: "keep gripping firmly",
        arabic: "يَتَمَسَّكُ بِـ",
        example: "He held onto the teddy bear throughout the flight.",
      },
    ],
    sentences: [
      {
        context: "Childhood Comfort",
        en: "The little girl hugs her soft brown teddy bear whenever she feels nervous.",
        ar: "تَحْتَضِنُ الطِّفْلَةُ الصَّغِيرَةُ دُبَّهَا البُنِّيَّ النَّاعِمَ كُلَّمَا شَعَرَتْ بِالقَلَقِ.",
      },
      {
        context: "Nursery Decor",
        en: "A vintage stuffed teddy bear sits proudly on the top shelf of the nursery.",
        ar: "يَسْتَقِرُّ دُبٌّ قُمَاشِيٌّ أَنِيقٌ عَلَى الرَّفِّ العُلْوِيِّ فِي غُرْفَةِ الأَطْفَالِ.",
      },
      {
        context: "Gift Giving",
        en: "He bought a giant plush teddy bear as a birthday present for his niece.",
        ar: "اشْتَرَى دُبّاً قُمَاشِيّاً ضَخْماً كَهَدِيَّةِ عِيدِ مِيلادٍ لاِبْنَةِ أُخْتِهِ.",
      },
    ],
    exampleSentence: "The little girl hugs her soft brown teddy bear whenever she feels nervous.",
    exampleArabic:
      "تَحْتَضِنُ الطِّفْلَةُ الصَّغِيرَةُ دُبَّهَا البُنِّيَّ النَّاعِمَ كُلَّمَا شَعَرَتْ بِالقَلَقِ.",
  },
  television: {
    id: "television",
    arabic: "تِلْفَاز (تِلِفِزْيُون)",
    partOfSpeech: "noun",
    phonetic: "ˈtɛl.əˌvɪʒ.ən",
    pronunciationTip: "Four syllables with primary stress on 'TEL' (/ˈtɛl.əˌvɪʒ.ən/).",
    collocations: [
      "watch television",
      "turn on the television",
      "turn off the television",
      "smart television",
      "television screen",
      "flat-screen television",
    ],
    phrasalVerbs: [
      {
        phrase: "turn on",
        meaning: "power on television",
        arabic: "يُشَغِّلُ التِّلْفَاز",
        example: "Turn on the television to watch the evening news.",
      },
      {
        phrase: "turn off",
        meaning: "power down television",
        arabic: "يُطْفِئُ التِّلْفَاز",
        example: "Turn off the television when you leave the living room.",
      },
      {
        phrase: "switch over",
        meaning: "change channel",
        arabic: "يُغَيِّرُ القَنَاة",
        example: "Switch over to the educational nature channel.",
      },
    ],
    sentences: [
      {
        context: "Family Evening",
        en: "The family gathered in the living room to watch an exciting documentary on television.",
        ar: "اجْتَمَعَتِ العَائِلَةُ فِي غُرْفَةِ المَعِيشَةِ لِمُشَاهَدَةِ وَثَائِقِيٍّ مُثِيرٍ عَلَى التِّلْفَازِ.",
      },
      {
        context: "Modern Living",
        en: "The ultra-thin 4K smart television is mounted securely on the main feature wall.",
        ar: "تَمَّ تَثْبِيتُ التِّلْفَازِ الذَّكِيِّ فَاخِرِ الدِّقَّةِ بِإِحْكَامٍ عَلَى الجِدَارِ الرَّئِيسِيِّ.",
      },
      {
        context: "Screen Time",
        en: "Parents set reasonable television viewing limits for their school-aged children.",
        ar: "يَضَعُ الآبَاءُ حُدُوداً مُعْتَدِلَةً لِأَوْقَاتِ مُشَاهَدَةِ التِّلْفَازِ لِأَطْفَالِهِمْ.",
      },
    ],
    exampleSentence:
      "The family gathered in the living room to watch an exciting documentary on television.",
    exampleArabic:
      "اجْتَمَعَتِ العَائِلَةُ فِي غُرْفَةِ المَعِيشَةِ لِمُشَاهَدَةِ وَثَائِقِيٍّ مُثِيرٍ عَلَى التِّلْفَازِ.",
  },
  "throw-blanket": {
    id: "throw-blanket",
    arabic: "بَطَّانِيَّةٌ خَفِيفَة (شَالُ كَنَبَة / غِطَاءُ دِيكُور)",
    partOfSpeech: "noun",
    phonetic: "ˈθroʊ ˌblæŋ.kɪt",
    pronunciationTip: "Compound noun: 'THROW' (/θroʊ/) + 'BLANKET' (/ˈblæŋ.kɪt/).",
    collocations: [
      "soft throw blanket",
      "knit throw blanket",
      "drape a throw blanket",
      "fleece throw blanket",
      "plaid throw blanket",
      "throw blanket on the sofa",
    ],
    phrasalVerbs: [
      {
        phrase: "wrap up in",
        meaning: "bundle oneself in a light blanket",
        arabic: "يَلْتَفُّ فِي الشَّال",
        example: "Wrap up in the knit throw blanket while watching the movie.",
      },
    ],
    sentences: [
      {
        context: "Sofa Styling",
        en: "A soft mustard yellow throw blanket is casually draped over the armchair for warmth and texture.",
        ar: "شَالُ كَنَبَةٍ أَصْفَرُ نَاعِمٌ مُلْقَى بِأَنَاقَةٍ عَلَى الكُرْسِيِّ لِمَنْحِ الدِّفْءِ وَالأَنَاقَةِ.",
      },
      {
        context: "Cozy Evening",
        en: "She wrapped the chunky knit throw blanket around her shoulders on the breezy autumn evening.",
        ar: "الْتَفَّتْ فِي شَالِ الصُّوفِ السَّمِيكِ حَوْلَ كَتِفَيْهَا فِي أَمْسِيَةِ الخَرِيفِ البَارِدَةِ.",
      },
      {
        context: "Living Room Storage",
        en: "Roll up extra throw blankets and place them in a woven wicker basket next to the sofa.",
        ar: "اطْوِ بَطَّانِيَّاتِ الكَنَبِ الإِضَافِيَّةَ وَضَعْهَا فِي سَلَّةِ خَيْزُرَانٍ بِجِوَارِ الأَرِيكَةِ.",
      },
    ],
    exampleSentence:
      "A soft mustard yellow throw blanket is casually draped over the armchair for warmth and texture.",
    exampleArabic:
      "شَالُ كَنَبَةٍ أَصْفَرُ نَاعِمٌ مُلْقَى بِأَنَاقَةٍ عَلَى الكُرْسِيِّ لِمَنْحِ الدِّفْءِ وَالأَنَاقَةِ.",
  },
  "tissue-box": {
    id: "tissue-box",
    arabic: "عُلْبَةُ المَنَادِيل",
    partOfSpeech: "noun",
    phonetic: "ˈtɪʃ.uː ˌbɑːks",
    pronunciationTip: "Pronounce 'tissue' with /tɪʃuː/ and 'box' with short /bɑːks/.",
    collocations: [
      "box of tissues",
      "grab a tissue",
      "bedside tissue box",
      "soft facial tissues",
      "empty tissue box",
      "reach for a tissue",
    ],
    phrasalVerbs: [
      {
        phrase: "pull out",
        meaning: "extract a tissue from the box",
        arabic: "يَسْحَبُ مَنْدِيلاً مِنَ العُلْبَة",
        example: "She pulled out a soft tissue to dry her tears.",
      },
      {
        phrase: "throw away",
        meaning: "dispose of a used tissue",
        arabic: "يَرْمِي فِي القُمَامَة",
        example: "Always throw away used tissues into the wastebasket.",
      },
    ],
    sentences: [
      {
        context: "Cold & Allergies",
        en: "He kept a full tissue box on his desk because he had a bad cold.",
        ar: "احْتَفَظَ بِعُلْبَةِ مَنَادِيلَ مُمْتَلِئَةٍ عَلَى مَكْتَبِهِ بِسَبَبِ إِصَابَتِهِ بِزُكَامٍ شَدِيدٍ.",
      },
      {
        context: "Convenience",
        en: "There is a decorative tissue box placed conveniently on the bedside table.",
        ar: "تُوجَدُ عُلْبَةُ مَنَادِيلَ أَنِيقَةٌ مَوْضُوعَةٌ بِشَكْلٍ مُرِيحٍ عَلَى طَاوِلَةِ السَّرِيرِ.",
      },
      {
        context: "Household",
        en: "When the tissue box is empty, replace it with a new one from the pantry.",
        ar: "عِنْدَمَا تَفْرَغُ عُلْبَةُ المَنَادِيلِ، اسْتَبْدِلْهَا بِعُلْبَةٍ جَدِيدَةٍ مِنْ خِزَانَةِ المَؤُونَةِ.",
      },
    ],
    exampleSentence: "He kept a full tissue box on his desk because he had a bad cold.",
    exampleArabic:
      "احْتَفَظَ بِعُلْبَةِ مَنَادِيلَ مُمْتَلِئَةٍ عَلَى مَكْتَبِهِ بِسَبَبِ إِصَابَتِهِ بِزُكَامٍ شَدِيدٍ.",
  },
  toaster: {
    id: "toaster",
    arabic: "مُحَمِّصَةُ الخُبْز (تُوسْتَر)",
    partOfSpeech: "noun",
    phonetic: "ˈtoʊ.stər",
    pronunciationTip: "Long 'o' vowel /oʊ/ as in 'toast'.",
    collocations: [
      "pop up from the toaster",
      "slice of bread in the toaster",
      "toaster settings",
      "clean toaster crumbs",
      "two-slice toaster",
      "electric toaster",
    ],
    phrasalVerbs: [
      {
        phrase: "pop up",
        meaning: "toast ejecting automatically",
        arabic: "يَنْبَثِقُ الخُبْزُ المُحَمَّص",
        example: "The golden toast popped up with a cheerful click.",
      },
      {
        phrase: "put in",
        meaning: "insert bread slices",
        arabic: "يَضَعُ الخُبْز",
        example: "Put two slices of sourdough in the toaster.",
      },
    ],
    sentences: [
      {
        context: "Breakfast",
        en: "He popped two slices of whole wheat bread into the toaster for breakfast.",
        ar: "وَضَعَ شَرِيحَتَيْنِ مِنْ خُبْزِ القَمْحِ الكَامِلِ فِي مُحَمِّصَةِ الخُبْزِ لِلإِفْطَارِ.",
      },
      {
        context: "Kitchen Maintenance",
        en: "Remember to empty the crumb tray at the bottom of the toaster regularly.",
        ar: "تَذَكَّرْ إِفْرَاغَ دُرْجِ فُتَاتِ الخُبْزِ أَسْفَلَ المُحَمِّصَةِ بِانْتِظَامٍ.",
      },
      {
        context: "Cooking Preference",
        en: "Adjust the toaster browning dial to get lightly golden, crispy toast.",
        ar: "اضْبِطْ قُرْصَ التَّحْمِيصِ لِلْحُصُولِ عَلَى خُبْزٍ مُقَرْمَشٍ بِلَوْنٍ ذَهَبِيٍّ خَفِيفٍ.",
      },
    ],
    exampleSentence: "He popped two slices of whole wheat bread into the toaster for breakfast.",
    exampleArabic:
      "وَضَعَ شَرِيحَتَيْنِ مِنْ خُبْزِ القَمْحِ الكَامِلِ فِي مُحَمِّصَةِ الخُبْزِ لِلإِفْطَارِ.",
  },
  tongs: {
    id: "tongs",
    arabic: "مَاسِكُ طَعَام (مِلْقَاط)",
    partOfSpeech: "noun",
    phonetic: "tɑːŋz",
    pronunciationTip: "Contains the 'ng' sound (/ŋ/) followed by voiced 'z'. Always plural.",
    collocations: [
      "kitchen tongs",
      "salad tongs",
      "grill tongs",
      "grip with tongs",
      "silicone tongs",
      "stainless steel tongs",
    ],
    phrasalVerbs: [
      {
        phrase: "pick up with",
        meaning: "grab hot food using tongs",
        arabic: "يَلْتَقِطُ بِالمِلْقَاط",
        example: "Pick up the grilled sausages with long tongs.",
      },
      {
        phrase: "turn over",
        meaning: "flip hot items on a barbecue",
        arabic: "يَقْلِبُ عَلَى الشِّوَايَة",
        example: "Turn over the steaks on the grill using heavy metal tongs.",
      },
    ],
    sentences: [
      {
        context: "Barbecue & Grilling",
        en: "He used long metal tongs to turn over the sizzling steaks on the barbecue.",
        ar: "اسْتَخْدَمَ مَاسِكَ طَعَامٍ مَعْدَنِيّاً طَوِيلاً لِقَلْبِ شَرَائِحِ اللَّحْمِ عَلَى الشِّوَايَةِ.",
      },
      {
        context: "Salad Serving",
        en: "Serve the tossed garden salad using lightweight wooden or bamboo tongs.",
        ar: "قَدِّمْ سَلَطَةَ الخُضَارِ المُمَتَّعَةِ بِاسْتِخْدَامِ مَاسِكِ سَلَطَةٍ خَشَبِيٍّ خَفِيفٍ.",
      },
      {
        context: "Kitchen Safety",
        en: "Tongs give you a secure grip and keep your hands safe from hot grease.",
        ar: "يَمْنَحُكَ مَاسِكُ الطَّعَامِ إِمْسَاكاً آمِناً وَيَحْمِي يَدَيْكَ مِنْ طَرَطَشَةِ الزَّيْتِ.",
      },
    ],
    exampleSentence: "He used long metal tongs to turn over the sizzling steaks on the barbecue.",
    exampleArabic:
      "اسْتَخْدَمَ مَاسِكَ طَعَامٍ مَعْدَنِيّاً طَوِيلاً لِقَلْبِ شَرَائِحِ اللَّحْمِ عَلَى الشِّوَايَةِ.",
  },
  tractor: {
    id: "tractor",
    arabic: "جَرَّارٌ زِرَاعِيّ (تَرَاكْتُور)",
    partOfSpeech: "noun",
    phonetic: "ˈtræk.tər",
    pronunciationTip: "Short 'a' vowel /æ/ in first syllable (/ˈtræk.tər/).",
    collocations: [
      "drive a tractor",
      "farm tractor",
      "heavy tractor",
      "tractor engine",
      "pull with a tractor",
      "green tractor",
    ],
    phrasalVerbs: [
      {
        phrase: "plow up",
        meaning: "turn over soil using tractor attachments",
        arabic: "يَحْرُثُ بِالجَرَّار",
        example: "The farmer plowed up the field with his heavy diesel tractor.",
      },
    ],
    sentences: [
      {
        context: "Field Work",
        en: "The farmer drove the green diesel tractor across the vast field to plant wheat seeds.",
        ar: "قَادَ المُزَارِعُ الجَرَّارَ الزِّرَاعِيَّ الأَخْضَرَ عَبْرَ الحَقْلِ الوَاسِعِ لِبَذْرِ القَمْحِ.",
      },
      {
        context: "Hauling Hay",
        en: "A powerful tractor pulled a heavy flatbed trailer loaded with sixty hay bales.",
        ar: "سَحَبَ الجَرَّارُ القَوِيُّ مَقْطُورَةً ثَقِيلَةً مُحَمَّلَةً بِـ 60 بَالَةَ قَشٍّ.",
      },
      {
        context: "Maintenance",
        en: "Check the tractor's engine oil, tire pressures, and hydraulics before harvest season.",
        ar: "تَفَقَّدْ زَيْتَ مُحَرِّكِ الجَرَّارِ وَضَغْطَ الإِطَارَاتِ قَبْلَ بَدْءِ مَوْسِمِ الحَصَادِ.",
      },
    ],
    exampleSentence:
      "The farmer drove the green diesel tractor across the vast field to plant wheat seeds.",
    exampleArabic:
      "قَادَ المُزَارِعُ الجَرَّارَ الزِّرَاعِيَّ الأَخْضَرَ عَبْرَ الحَقْلِ الوَاسِعِ لِبَذْرِ القَمْحِ.",
  },
  trailer: {
    id: "trailer",
    arabic: "مَقْطُورَة (عَرَبَةُ نَقْل)",
    partOfSpeech: "noun",
    phonetic: "ˈtreɪ.lər",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'train', followed by /lər/.",
    collocations: [
      "tractor trailer",
      "load the trailer",
      "heavy trailer",
      "hay trailer",
      "livestock trailer",
      "flatbed trailer",
    ],
    phrasalVerbs: [
      {
        phrase: "hitch up",
        meaning: "connect a trailer to a tractor or truck",
        arabic: "يَصِلُ المَقْطُورَة",
        example: "He hitched up the flatbed trailer to haul the lumber.",
      },
      {
        phrase: "load onto",
        meaning: "put goods on trailer",
        arabic: "يُحَمِّلُ عَلَى المَقْطُورَة",
        example: "They loaded crates of fresh apples onto the farm trailer.",
      },
    ],
    sentences: [
      {
        context: "Harvest Transport",
        en: "Workers loaded crates of sweet crisp apples onto the tractor trailer in the orchard.",
        ar: "حَمَّلَ العُمَّالُ صَنَادِيقَ التُّفَّاحِ الطَّازَجِ عَلَى مَقْطُورَةِ الجَرَّارِ فِي البُسْتَانِ.",
      },
      {
        context: "Livestock Moving",
        en: "They used an enclosed aluminum livestock trailer to transport heifers safely to the show.",
        ar: "اسْتَخْدَمُوا مَقْطُورَةَ مَاشِيَةٍ مُقْفَلَةً لِنَقْلِ العُجُولِ بِأَمَانٍ لِلْمَعْرِضِ.",
      },
      {
        context: "Hay Hauling",
        en: "The flatbed trailer carried dozens of rectangular straw bales back to the storage barn.",
        ar: "نَقَلَتِ المَقْطُورَةُ المُنْبَسِطَةُ عَشَرَاتِ بَالاتِ القَشِّ إِلَى حَظِيرَةِ التَّخْزِينِ.",
      },
    ],
    exampleSentence:
      "Workers loaded crates of sweet crisp apples onto the tractor trailer in the orchard.",
    exampleArabic:
      "حَمَّلَ العُمَّالُ صَنَادِيقَ التُّفَّاحِ الطَّازَجِ عَلَى مَقْطُورَةِ الجَرَّارِ فِي البُسْتَانِ.",
  },
  turkey: {
    id: "turkey",
    arabic: "دِيكٌ رُومِيّ",
    partOfSpeech: "noun",
    phonetic: "ˈtɜːr.ki",
    pronunciationTip:
      "Stress on 'TUR' (/ˈtɜːr.ki/), identical in pronunciation to the country Turkey.",
    collocations: [
      "wild turkey",
      "gobble of a turkey",
      "roast turkey",
      "flock of turkeys",
      "turkey feathers",
      "turkey farm",
    ],
    phrasalVerbs: [
      {
        phrase: "gobble up",
        meaning: "eat greedily or make turkey sounds",
        arabic: "يَلْتَهِمُ بِسُرْعَة",
        example: "The hungry birds gobbled up all the scattered corn in minutes.",
      },
    ],
    sentences: [
      {
        context: "Farm Wildlife",
        en: "A flock of wild turkeys strutted through the woodland clearing near the orchard.",
        ar: "تَجَوَّلَ سِرْبٌ مِنَ الدُّيُوكِ الرُّومِيَّةِ البَرِّيَّةِ عَبْرَ الغَابَةِ قُرْبَ البُسْتَانِ.",
      },
      {
        context: "Distinctive Sound",
        en: "The big tom turkey puffed up his chest and made a loud gobbling sound.",
        ar: "نَفَخَ الدِّيكُ الرُّومِيُّ الكَبِيرُ صَدْرَهُ وَأَصْدَرَ صَوْتَ قَرْقَرَةٍ عَالِياً.",
      },
      {
        context: "Holiday Feast",
        en: "Roast turkey seasoned with rosemary and thyme was the centerpiece of the Thanksgiving feast.",
        ar: "كَانَ الدِّيكُ الرُّومِيُّ المَشْوِيُّ بِإِكْلِيلِ الجَبَلِ وَالزَّعْتَرِ طَبَقَ الاِحْتِفَالِ الرَّئِيسِيَّ.",
      },
    ],
    exampleSentence:
      "A flock of wild turkeys strutted through the woodland clearing near the orchard.",
    exampleArabic:
      "تَجَوَّلَ سِرْبٌ مِنَ الدُّيُوكِ الرُّومِيَّةِ البَرِّيَّةِ عَبْرَ الغَابَةِ قُرْبَ البُسْتَانِ.",
  },
  "tv-stand": {
    id: "tv-stand",
    arabic: "طَاوِلَةُ التِّلْفَاز (مَكْتَبَةُ التِّلْفَاز)",
    partOfSpeech: "noun",
    phonetic: "ˈtiː.viː ˌstænd",
    pronunciationTip: "Compound noun: 'T-V' (/ˈtiː.viː/) + 'STAND' (/stænd/).",
    collocations: [
      "wooden TV stand",
      "modern TV stand",
      "shelves in the TV stand",
      "cable management TV stand",
      "low TV stand",
      "media TV stand",
    ],
    phrasalVerbs: [
      {
        phrase: "set up on",
        meaning: "install equipment on the stand",
        arabic: "يُرَكِّبُ عَلَى طَاوِلَةِ التِّلْفَاز",
        example: "They set up the television and game console on the sturdy TV stand.",
      },
    ],
    sentences: [
      {
        context: "Media Center",
        en: "The low-profile wooden TV stand features built-in cabinets for game consoles.",
        ar: "تَتَمَيَّزُ طَاوِلَةُ التِّلْفَازِ الخَشَبِيَّةُ المُنْخَفِضَةُ بِخَزَائِنَ مُدْمَجَةٍ لِأَجْهِزَةِ الأَلْعَابِ.",
      },
      {
        context: "Organization",
        en: "Rear cable cutouts in the TV stand keep power cords organized and out of sight.",
        ar: "تُحَافِظُ فَتَحَاتُ الأَسْلاكِ الخَلْفِيَّةُ فِي طَاوِلَةِ التِّلْفَازِ عَلَى تَرْتِيبِ الكَابِلاتِ.",
      },
      {
        context: "Decor",
        en: "She placed a potted succulent and a decorative vase on the corner of the TV stand.",
        ar: "وَضَعَتْ نَبْتَةَ صَبَّارٍ صَغِيرَةً وَزَهْرِيَّةً أَنِيقَةً عَلَى زَاوِيَةِ طَاوِلَةِ التِّلْفَازِ.",
      },
    ],
    exampleSentence:
      "The low-profile wooden TV stand features built-in cabinets for game consoles.",
    exampleArabic:
      "تَتَمَيَّزُ طَاوِلَةُ التِّلْفَازِ الخَشَبِيَّةُ المُنْخَفِضَةُ بِخَزَائِنَ مُدْمَجَةٍ لِأَجْهِزَةِ الأَلْعَابِ.",
  },
  vase: {
    id: "vase",
    arabic: "زَهْرِيَّة (فَازَة)",
    partOfSpeech: "noun",
    phonetic: "veɪs",
    pronunciationTip:
      "In American English it rhymes with 'face' (/veɪs/), in British English /vɑːz/.",
    collocations: [
      "flower vase",
      "ceramic vase",
      "put flowers in a vase",
      "glass vase",
      "fill the vase with water",
      "crystal vase",
    ],
    phrasalVerbs: [
      {
        phrase: "fill up",
        meaning: "fill a vase with fresh water",
        arabic: "يَمْلَأُ بِالمَاءِ",
        example: "Fill up the glass vase with clean water before arranging the roses.",
      },
      {
        phrase: "set down",
        meaning: "place a vase on a table",
        arabic: "يَضَعُ الزَّهْرِيَّةَ عَلَى طَاوِلَة",
        example: "She set down the delicate ceramic vase on the dining table.",
      },
    ],
    sentences: [
      {
        context: "Floral Arrangement",
        en: "She arranged a bouquet of fresh yellow roses inside the tall glass vase.",
        ar: "رَتَّبَتْ بَاقَةً مِنْ زُهُورِ الجُورِيِّ الصَّفْرَاءِ دَاخِلَ زَهْرِيَّةٍ زُجَاجِيَّةٍ طَوِيلَةٍ.",
      },
      {
        context: "Home Centerpiece",
        en: "A beautiful handmade ceramic vase serves as the dining table centerpiece.",
        ar: "تُشَكِّلُ الزَّهْرِيَّةُ الخَزَفِيَّةُ اليَدَوِيَّةُ الجَمِيلَةُ قِطْعَةَ دِيكُورٍ رَئِيسِيَّةً عَلَى طَاوِلَةِ الطَّعَامِ.",
      },
      {
        context: "Care & Safety",
        en: "Be careful not to knock over the fragile crystal vase near the edge.",
        ar: "احْذَرْ مِنْ إِسْقَاطِ زَهْرِيَّةِ الكِرِيسْتَالِ الرَّقِيقَةِ القَرِيبَةِ مِنَ الحَافَّةِ.",
      },
    ],
    exampleSentence: "She arranged a bouquet of fresh yellow roses inside the tall glass vase.",
    exampleArabic:
      "رَتَّبَتْ بَاقَةً مِنْ زُهُورِ الجُورِيِّ الصَّفْرَاءِ دَاخِلَ زَهْرِيَّةٍ زُجَاجِيَّةٍ طَوِيلَةٍ.",
  },
  vinegar: {
    id: "vinegar",
    arabic: "خَلّ",
    partOfSpeech: "noun",
    phonetic: "ˈvɪn.ɪ.ɡər",
    pronunciationTip: "Short 'i' sound /ɪ/ as in 'win', followed by soft /ɪ.ɡər/.",
    collocations: [
      "balsamic vinegar",
      "apple cider vinegar",
      "white vinegar",
      "splash of vinegar",
      "olive oil and vinegar",
      "vinegar dressing",
    ],
    phrasalVerbs: [
      {
        phrase: "drizzle on",
        meaning: "pour vinegar lightly over food",
        arabic: "يَسْكُبُ قَلِيلاً مِنْ الخَلّ",
        example: "Drizzle aged balsamic vinegar over fresh strawberries and mozzarella.",
      },
    ],
    sentences: [
      {
        context: "Salad Dressing",
        en: "Whisk extra virgin olive oil with red wine vinegar, Dijon mustard, and salt.",
        ar: "اخْفِقْ زَيْتَ الزَّيْتُونِ البِكْرَ مَعَ خَلِّ العِنَبِ وَالخَرْدَلِ وَالمِلْحِ لِتَحْضِيرِ التَّتْبِيلَةِ.",
      },
      {
        context: "Cooking Technique",
        en: "Add a splash of white vinegar to the poaching water to help egg whites set cleanly.",
        ar: "أَضِفْ قَطَرَاتٍ مِنْ الخَلِّ الأَبْيَضِ لِمَاءِ سَلْقِ البَيْضِ لِمُسَاعَدَةِ البَيَاضِ عَلَى التَّمَاسُكِ.",
      },
      {
        context: "Natural Cleaning",
        en: "Diluted white vinegar is an eco-friendly cleaner that removes limescale easily.",
        ar: "يُعَدُّ الخَلُّ الأَبْيَضُ المُخَفَّفُ مُنَظِّفاً صَدِيقاً لِلْبِيئَةِ يُزِيلُ التَّرَسُّبَاتِ بِسُهُولَةٍ.",
      },
    ],
    exampleSentence: "Whisk extra virgin olive oil with red wine vinegar, Dijon mustard, and salt.",
    exampleArabic:
      "اخْفِقْ زَيْتَ الزَّيْتُونِ البِكْرَ مَعَ خَلِّ العِنَبِ وَالخَرْدَلِ وَالمِلْحِ لِتَحْضِيرِ التَّتْبِيلَةِ.",
  },
  "wall-clock": {
    id: "wall-clock",
    arabic: "سَاعَةُ حَائِط",
    partOfSpeech: "noun",
    phonetic: "ˈwɔːl ˌklɑːk",
    pronunciationTip: "Compound noun: 'WALL' (/wɔːl/) + 'CLOCK' (/klɑːk/).",
    collocations: [
      "large wall clock",
      "wooden wall clock",
      "hang a wall clock",
      "check the wall clock",
      "silent wall clock",
      "modern wall clock",
    ],
    phrasalVerbs: [
      {
        phrase: "hang up",
        meaning: "mount clock on wall",
        arabic: "يُعَلِّقُ السَّاعَةَ عَلَى الجِدَار",
        example: "Hang up the decorative wall clock above the fireplace mantel.",
      },
    ],
    sentences: [
      {
        context: "Living Room Focal Point",
        en: "A large vintage industrial wall clock hangs prominently above the fireplace mantel.",
        ar: "تُعَلَّقُ سَاعَةُ حَائِطٍ كَبِيرَةٌ كِلاسِيكِيَّةٌ بِشَكْلٍ بَارِزٍ فَوْقَ رَفِّ المِدْفَأَةِ.",
      },
      {
        context: "Quiet Operation",
        en: "She chose a silent quartz wall clock so the continuous ticking wouldn't distract her studying.",
        ar: "اخْتَارَتْ سَاعَةَ حَائِطٍ صَامِتَةً حَتَّى لا تُشَتِّتَ دَقَّاتُهَا تَرْكِيزَهَا فِي الدِّرَاسَةِ.",
      },
      {
        context: "Time Check",
        en: "He glanced quickly at the wall clock to see if dinner was ready.",
        ar: "أَلْقَى نَظْرَةً سَرِيعَةً عَلَى سَاعَةِ الحَائِطِ لِمَعْرِفَةِ مَا إِذَا كَانَ العَشَاءُ جَاهِزاً.",
      },
    ],
    exampleSentence:
      "A large vintage industrial wall clock hangs prominently above the fireplace mantel.",
    exampleArabic:
      "تُعَلَّقُ سَاعَةُ حَائِطٍ كَبِيرَةٌ كِلاسِيكِيَّةٌ بِشَكْلٍ بَارِزٍ فَوْقَ رَفِّ المِدْفَأَةِ.",
  },
  wardrobe: {
    id: "wardrobe",
    arabic: "خِزَانَةُ المَلابِس (دُولاب)",
    partOfSpeech: "noun",
    phonetic: "ˈwɔːr.droʊb",
    pronunciationTip: "First syllable rhymes with 'war', second syllable rhymes with 'robe'.",
    collocations: [
      "hang in the wardrobe",
      "spacious wardrobe",
      "fitted wardrobe",
      "open the wardrobe",
      "wooden wardrobe",
      "wardrobe doors",
    ],
    phrasalVerbs: [
      {
        phrase: "hang up",
        meaning: "place clothing on a hanger in a closet",
        arabic: "يُعَلِّقُ المَلابِسَ",
        example: "Hang up your heavy coat in the wardrobe.",
      },
      {
        phrase: "pick out",
        meaning: "choose an outfit",
        arabic: "يَخْتَارُ مَلابِسَ",
        example: "She opened the wardrobe to pick out a dress for the party.",
      },
    ],
    sentences: [
      {
        context: "Storage",
        en: "All winter jackets and suits are hung inside the wardrobe.",
        ar: "جَمِيعُ السُّتْرَاتِ الشَّتْوِيَّةِ وَالبِدَلِ مُعَلَّقَةٌ دَاخِلَ خِزَانَةِ المَلابِسِ.",
      },
      {
        context: "Space",
        en: "The bedroom features a large built-in wardrobe with sliding doors.",
        ar: "تَتَمَيَّزُ غُرْفَةُ النَّوْمِ بِخِزَانَةِ مَلابِسَ مُدْمَجَةٍ كَبِيرَةٍ ذَاتِ أَبْوَابٍ سَحَّابَةٍ.",
      },
      {
        context: "Routine",
        en: "He locked the wardrobe before leaving for his business trip.",
        ar: "أَقْفَلَ خِزَانَةَ المَلابِسِ قَبْلَ مُغَادَرَتِهِ فِي رِحْلَةِ العَمَلِ.",
      },
    ],
    exampleSentence: "All winter jackets and suits are hung inside the wardrobe.",
    exampleArabic:
      "جَمِيعُ السُّتْرَاتِ الشَّتْوِيَّةِ وَالبِدَلِ مُعَلَّقَةٌ دَاخِلَ خِزَانَةِ المَلابِسِ.",
  },
  wastebasket: {
    id: "wastebasket",
    arabic: "سَلَّةُ المُهْمَلات",
    partOfSpeech: "noun",
    phonetic: "ˈweɪstˌbæs.kɪt",
    pronunciationTip: "Compound word: 'WASTE' + 'BASKET'.",
    collocations: [
      "throw in the wastebasket",
      "empty the wastebasket",
      "bedroom wastebasket",
      "metal wastebasket",
      "lined wastebasket",
      "toss into the wastebasket",
    ],
    phrasalVerbs: [
      {
        phrase: "throw away",
        meaning: "discard trash into a bin",
        arabic: "يَتَخَلَّصُ مِنَ القُمَامَة",
        example: "Throw away that scrap paper into the wastebasket.",
      },
      {
        phrase: "empty out",
        meaning: "empty the contents of a bin",
        arabic: "يُفْرِغُ السَّلَّة",
        example: "He emptied out the office wastebasket at the end of the day.",
      },
    ],
    sentences: [
      {
        context: "Tidying Up",
        en: "He crumpled the draft paper and tossed it directly into the wastebasket.",
        ar: "كَرْمَشَ وَرَقَةَ المُسَوَّدَةِ وَأَلْقَاهَا مُبَاشَرَةً فِي سَلَّةِ المُهْمَلاتِ.",
      },
      {
        context: "Room Cleanliness",
        en: "Please empty the bedroom wastebasket before it overflows with trash.",
        ar: "يُرْجَى إِفْرَاغُ سَلَّةِ مُهْمَلاتِ غُرْفَةِ النَّوْمِ قَبْلَ أَنْ تَفِيضَ بِالقُمَامَةِ.",
      },
      {
        context: "Office Space",
        en: "A discreet stainless steel wastebasket sits tucked under the study desk.",
        ar: "تَسْتَقِرُّ سَلَّةُ مُهْمَلاتٍ صَغِيرَةٌ مِنْ سْتَانْلِسْ سْتِيل تَحْتَ مَكْتَبِ الدِّرَاسَةِ.",
      },
    ],
    exampleSentence: "He crumpled the draft paper and tossed it directly into the wastebasket.",
    exampleArabic:
      "كَرْمَشَ وَرَقَةَ المُسَوَّدَةِ وَأَلْقَاهَا مُبَاشَرَةً فِي سَلَّةِ المُهْمَلاتِ.",
  },
  "watering-can": {
    id: "watering-can",
    arabic: "رَشَّاشُ مَاء (كَنَكَةُ رَيّ / مِرَشَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈwɔː.tər.ɪŋ ˌkæn",
    pronunciationTip: "Compound noun: 'WATERING' (/ˈwɔː.tər.ɪŋ/) + 'CAN' (/kæn/).",
    collocations: [
      "fill the watering can",
      "gentle shower from watering can",
      "metal watering can",
      "garden watering can",
      "water flowers with a can",
      "long-spout watering can",
    ],
    phrasalVerbs: [
      {
        phrase: "water down",
        meaning: "give plants gentle moisture",
        arabic: "يَرْوِي بِالمِرَشَّة",
        example: "Water down the newly planted herb seedlings with a gentle rose spout.",
      },
    ],
    sentences: [
      {
        context: "Plant Care",
        en: "She used a vintage copper watering can to gently hydrate her potted geraniums.",
        ar: "اسْتَخْدَمَتْ مِرَشَّةَ مَاءٍ نُحَاسِيَّةً أَنِيقَةً لِرَيِّ زُهُورِ الجِيرَانْيُوم فِي الأَصَائِصِ.",
      },
      {
        context: "Gentle Watering",
        en: "The rose attachment on the watering can creates a soft sprinkle that won't harm young sprouts.",
        ar: "تَصْنَعُ فُوَّهَةُ المِرَشَّةِ رَذَاذاً لَطِيفاً لا يُؤْذِي البَرَاعِمَ الصَّغِيرَةَ.",
      },
      {
        context: "Indoor Plants",
        en: "A long-spout watering can reaches easily between dense foliage without spilling.",
        ar: "تَصِلُ مِرَشَّةُ المَاءِ ذَاتُ الفُوَّهَةِ الطَّوِيلَةِ بَيْنَ أَوْرَاقِ النَّبَاتَاتِ دُونَ انْسِكَابٍ.",
      },
    ],
    exampleSentence:
      "She used a vintage copper watering can to gently hydrate her potted geraniums.",
    exampleArabic:
      "اسْتَخْدَمَتْ مِرَشَّةَ مَاءٍ نُحَاسِيَّةً أَنِيقَةً لِرَيِّ زُهُورِ الجِيرَانْيُوم فِي الأَصَائِصِ.",
  },
  well: {
    id: "well",
    arabic: "بِئْرُ مَاء",
    partOfSpeech: "noun",
    phonetic: "wɛl",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'bell' or 'tell'.",
    collocations: [
      "water well",
      "draw water from a well",
      "deep well",
      "stone well",
      "bucket in the well",
      "drinking well",
    ],
    phrasalVerbs: [
      {
        phrase: "draw up",
        meaning: "pull up water using a bucket and rope",
        arabic: "يَسْحَبُ المَاءَ مِنَ البِئْر",
        example: "They drew up a bucket of icy cold water from the deep stone well.",
      },
    ],
    sentences: [
      {
        context: "Fresh Groundwater",
        en: "They lowered a wooden bucket into the deep stone well to draw cool drinking water.",
        ar: "أَنْزَلُوا دَلْواً خَشَبِيّاً فِي البِئْرِ الحَجَرِيِّ العَمِيقِ لِسَحْبِ مَاءِ الشُّرْبِ العَذْبِ.",
      },
      {
        context: "Rural Supply",
        en: "The farm relies on a modern borehole well for irrigating crops and watering livestock.",
        ar: "تَعْتَمِدُ المَزْرَعَةُ عَلَى بِئْرٍ ارْتِوَازِيٍّ حَدِيثٍ لِرَيِّ المَحَاصِيلِ وَسِقَايَةِ المَاشِيَةِ.",
      },
      {
        context: "Heritage Charm",
        en: "An old wishing well made of weathered fieldstones decorates the farmhouse lawn.",
        ar: "تُزَيِّنُ بِئْرٌ حَجَرِيَّةٌ أَثَرِيَّةٌ جَمِيلَةٌ حَدِيقَةَ بَيْتِ المَزْرَعَةِ الرِّيفِيِّ.",
      },
    ],
    exampleSentence:
      "They lowered a wooden bucket into the deep stone well to draw cool drinking water.",
    exampleArabic:
      "أَنْزَلُوا دَلْواً خَشَبِيّاً فِي البِئْرِ الحَجَرِيِّ العَمِيقِ لِسَحْبِ مَاءِ الشُّرْبِ العَذْبِ.",
  },
  wheelbarrow: {
    id: "wheelbarrow",
    arabic: "عَرَبَةُ يَد (بَرُوِيطَة)",
    partOfSpeech: "noun",
    phonetic: "ˈwiːlˌbær.oʊ",
    pronunciationTip: "Compound noun: 'WHEEL' (/wiːl/) + 'BARROW' (/ˈbær.oʊ/).",
    collocations: [
      "push a wheelbarrow",
      "wheelbarrow of soil",
      "heavy wheelbarrow",
      "garden wheelbarrow",
      "metal wheelbarrow",
      "load the wheelbarrow",
    ],
    phrasalVerbs: [
      {
        phrase: "wheel around",
        meaning: "push and transport items in a barrow",
        arabic: "يَنْقُلُ بِالعَرَبَة",
        example: "He wheeled around a load of mulch for the flower beds.",
      },
      {
        phrase: "tip out",
        meaning: "dump contents from wheelbarrow",
        arabic: "يَقْلِبُ / يُفْرِغُ الحُمُولَة",
        example: "Tip out the gravel near the garden pathway.",
      },
    ],
    sentences: [
      {
        context: "Gardening Chores",
        en: "He wheeled a barrow full of dark organic compost to enrich the raised garden beds.",
        ar: "دَفَعَ عَرَبَةَ يَدٍ مَلِيئَةً بِالسَّمَادِ العُضْوِيِّ لِتَغْذِيَةِ أَحْوَاضِ الزِّرَاعَةِ.",
      },
      {
        context: "Heavy Lifting",
        en: "The pneumatic rubber tire makes it easy to push heavy wheelbarrows across uneven ground.",
        ar: "يُسَهِّلُ الإِطَارُ المَطَّاطِيُّ دَفْعَ عَرَبَةِ اليَدِ الثَّقِيلَةِ عَبْرَ الأَرْضِ غَيْرِ المُسْتَوِيَةِ.",
      },
      {
        context: "Hauling Produce",
        en: "She loaded freshly picked orange pumpkins into the wheelbarrow for market transport.",
        ar: "حَمَّلَتْ ثِمَارَ اليَقْطِينِ البُرْتُقَالِيَّةِ المَقْطُوفَةِ فِي عَرَبَةِ اليَدِ لِنَقْلِهَا لِلسُّوقِ.",
      },
    ],
    exampleSentence:
      "He wheeled a barrow full of dark organic compost to enrich the raised garden beds.",
    exampleArabic:
      "دَفَعَ عَرَبَةَ يَدٍ مَلِيئَةً بِالسَّمَادِ العُضْوِيِّ لِتَغْذِيَةِ أَحْوَاضِ الزِّرَاعَةِ.",
  },
  whisk: {
    id: "whisk",
    arabic: "مِخْفَقَةُ بَيْض (مَضْرَبُ سِلْك)",
    partOfSpeech: "noun",
    phonetic: "wɪsk",
    pronunciationTip: "Short 'i' sound /ɪ/ as in 'risk' or 'dish'.",
    collocations: [
      "wire whisk",
      "balloon whisk",
      "beat with a whisk",
      "whisk eggs",
      "silicone whisk",
      "whisk the sauce",
    ],
    phrasalVerbs: [
      {
        phrase: "whip up",
        meaning: "beat rapidly to create foam or cream",
        arabic: "يَخْفِقُ لِيُكَوِّنَ رَغْوَة",
        example: "Whip up the egg whites until stiff peaks form.",
      },
      {
        phrase: "blend in",
        meaning: "mix smoothly without lumps",
        arabic: "يَمْزُجُ دُونَ تَكَتُّلات",
        example: "Whisk in the flour slowly to make a smooth gravy.",
      },
    ],
    sentences: [
      {
        context: "Whisking Eggs",
        en: "Whisk the three eggs and a splash of milk vigorously until frothy.",
        ar: "اخْفِقِ البَيْضَاتِ الثَّلاثَ مَعَ القَلِيلِ مِنَ الحَلِيبِ جَيِّداً حَتَّى تَتَكَوَّنَ رَغْوَةٌ.",
      },
      {
        context: "Sauce Making",
        en: "Use a wire whisk to combine melted butter and flour smoothly for a roux.",
        ar: "اسْتَخْدِمْ مَضْرَبَ السِّلْكِ لِمَزْجِ الزُّبْدَةِ المُذَابَةِ مَعَ الدَّقِيقِ لِتَحْضِيرِ الصَّلْصَةِ.",
      },
      {
        context: "Dessert Making",
        en: "A balloon whisk is ideal for whipping heavy cream into soft billowy peaks.",
        ar: "مِخْفَقَةُ السِّلْكِ البَالُونِيَّةُ مِثَالِيَّةٌ لِخَفْقِ الكْرِيمَةِ الثَّقِيلَةِ لِتُصْبِحَ هَشَّةً.",
      },
    ],
    exampleSentence: "Whisk the three eggs and a splash of milk vigorously until frothy.",
    exampleArabic:
      "اخْفِقِ البَيْضَاتِ الثَّلاثَ مَعَ القَلِيلِ مِنَ الحَلِيبِ جَيِّداً حَتَّى تَتَكَوَّنَ رَغْوَةٌ.",
  },
  "wi-fi-router": {
    id: "wi-fi-router",
    arabic: "جِهَازُ التَّوْجِيه (رَاوْتَر الوَاي فَاي)",
    partOfSpeech: "noun",
    phonetic: "ˈwaɪ.faɪ ˌraʊ.tər",
    pronunciationTip: "Compound noun: 'WI-FI' (/ˈwaɪ.faɪ/) + 'ROUTER' (/ˈraʊ.tər/ or /ˈruː.tər/).",
    collocations: [
      "high-speed Wi-Fi router",
      "reboot the router",
      "connect to the router",
      "dual-band router",
      "router signal",
      "flashing lights on the router",
    ],
    phrasalVerbs: [
      {
        phrase: "reboot",
        meaning: "restart router to fix connection",
        arabic: "يُعِيدُ التَّشْغِيل",
        example: "Unplug and reboot the Wi-Fi router if the internet slows down.",
      },
      {
        phrase: "hook up to",
        meaning: "connect ethernet cable",
        arabic: "يَصِلُ بِالشَّبَكَة",
        example: "Hook up the smart TV directly to the router with a LAN cable.",
      },
    ],
    sentences: [
      {
        context: "Home Internet",
        en: "The dual-band Wi-Fi router delivers strong wireless signals to every room in the house.",
        ar: "يُوَفِّرُ رَاوْتَرُ الوَاي فَاي مُزْدَوَجُ التَّرَدُّدِ إِشَارَاتٍ قَوِيَّةً لِكُلِّ غُرْفَةٍ فِي المَنْزِلِ.",
      },
      {
        context: "Troubleshooting",
        en: "He restarted the Wi-Fi router when the connection dropped during the video call.",
        ar: "أَعَادَ تَشْغِيلَ جِهَازِ الرَّاوْتَرِ عِنْدَمَا انْقَطَعَ الاِتِّصَالُ خِلالَ مُكَالَمَةِ الفِيدْيُو.",
      },
      {
        context: "Placement",
        en: "Place your Wi-Fi router in an elevated, central location to avoid signal blockages.",
        ar: "ضَعْ رَاوْتَرَ الوَاي فَاي فِي مَكَانٍ مُرْتَفِعٍ وَمَرْكَزِيٍّ لِتَفَادِي ضَعْفِ الإِشَارَةِ.",
      },
    ],
    exampleSentence:
      "The dual-band Wi-Fi router delivers strong wireless signals to every room in the house.",
    exampleArabic:
      "يُوَفِّرُ رَاوْتَرُ الوَاي فَاي مُزْدَوَجُ التَّرَدُّدِ إِشَارَاتٍ قَوِيَّةً لِكُلِّ غُرْفَةٍ فِي المَنْزِلِ.",
  },
  windmill: {
    id: "windmill",
    arabic: "طَاحُونَةُ هَوَاء",
    partOfSpeech: "noun",
    phonetic: "ˈwɪnd.mɪl",
    pronunciationTip: "Compound noun: 'WIND' (/wɪnd/) + 'MILL' (/mɪl/).",
    collocations: [
      "wooden windmill",
      "blades of a windmill",
      "pump water with a windmill",
      "historic windmill",
      "turn of the windmill",
      "traditional windmill",
    ],
    phrasalVerbs: [
      {
        phrase: "spin around",
        meaning: "rotate with the force of wind",
        arabic: "يَدُورُ مَعَ الرِّيَاح",
        example: "The large wooden windmill blades spun around in the brisk breeze.",
      },
    ],
    sentences: [
      {
        context: "Pumping Water",
        en: "The traditional prairie windmill pumps fresh underground water for the pasture cattle.",
        ar: "تَضُخُّ طَاحُونَةُ الهَوَاءِ التَّقْلِيدِيَّةُ المِيَاهَ الجَوْفِيَّةَ لِمَاشِيَةِ المَرْعَى.",
      },
      {
        context: "Historic Milling",
        en: "The historic stone windmill once ground grain into fine flour for local bakers.",
        ar: "كَانَتْ طَاحُونَةُ الهَوَاءِ الحَجَرِيَّةُ تَطْحَنُ الحُبُوبَ قَدِيماً إِلَى دَقِيقٍ نَاعِمٍ.",
      },
      {
        context: "Clean Energy",
        en: "Modern wind turbines generate clean renewable electricity across windy rural plains.",
        ar: "تُوَلِّدُ عَنَفَاتُ الرِّيَاحِ الحَدِيثَةُ طَاقَةً كَهْرَبَائِيَّةً نَظِيفَةً عَبْرَ السُّهُولِ الرِّيفِيَّةِ.",
      },
    ],
    exampleSentence:
      "The traditional prairie windmill pumps fresh underground water for the pasture cattle.",
    exampleArabic:
      "تَضُخُّ طَاحُونَةُ الهَوَاءِ التَّقْلِيدِيَّةُ المِيَاهَ الجَوْفِيَّةَ لِمَاشِيَةِ المَرْعَى.",
  },
  window: {
    id: "window",
    arabic: "نَافِذَة (شُبَّاك)",
    partOfSpeech: "noun",
    phonetic: "ˈwɪn.doʊ",
    pronunciationTip: "Stress on the first syllable 'WIN', followed by /doʊ/.",
    collocations: [
      "open the window",
      "close the window",
      "look out the window",
      "window pane",
      "bedroom window",
      "clean the window",
    ],
    phrasalVerbs: [
      {
        phrase: "look out",
        meaning: "gaze through a window",
        arabic: "يَنْظُرُ مِنَ النَّافِذَة",
        example: "She loved to look out the window and watch the falling rain.",
      },
      {
        phrase: "open up",
        meaning: "open wide for fresh air",
        arabic: "يَفْتَحُ لِلتَّهْوِيَة",
        example: "Open up the windows to air out the bedroom.",
      },
    ],
    sentences: [
      {
        context: "Ventilation",
        en: "Open the window slightly to let fresh morning air circulate.",
        ar: "افْتَحِ النَّافِذَةَ قَلِيلاً لِلسَّمَاحِ لِلهَوَاءِ الصَّبَاحِيِّ النَّقِيِّ بِالدُّخُولِ.",
      },
      {
        context: "View",
        en: "From his bedroom window, he could see the tall green trees in the park.",
        ar: "مِنْ نَافِذَةِ غُرْفَةِ نَوْمِهِ، كَانَ بِإِمْكَانِهِ رُؤْيَةُ الأَشْجَارِ الخَضْرَاءِ فِي الحَدِيقَةِ.",
      },
      {
        context: "Weather Safety",
        en: "Make sure all windows are tightly closed before the thunderstorm begins.",
        ar: "تَأَكَّدْ مِنْ إِغْلاقِ جَمِيعِ النَّوَافِذِ بِإِحْكَامٍ قَبْلَ بَدْءِ العَاصِفَةِ الرَّعْدِيَّةِ.",
      },
    ],
    exampleSentence: "Open the window slightly to let fresh morning air circulate.",
    exampleArabic:
      "افْتَحِ النَّافِذَةَ قَلِيلاً لِلسَّمَاحِ لِلهَوَاءِ الصَّبَاحِيِّ النَّقِيِّ بِالدُّخُولِ.",
  },
  wok: {
    id: "wok",
    arabic: "مِقْلَاةٌ صِينِيَّة (وُوك)",
    partOfSpeech: "noun",
    phonetic: "wɑːk",
    pronunciationTip: "Rhymes with 'talk' or 'walk' (/wɑːk/).",
    collocations: [
      "stir-fry in a wok",
      "carbon steel wok",
      "heat the wok",
      "toss noodles in a wok",
      "round-bottomed wok",
      "smoking hot wok",
    ],
    phrasalVerbs: [
      {
        phrase: "stir-fry",
        meaning: "cook vegetables quickly over high heat",
        arabic: "يُشَوِّحُ سَرِيعاً",
        example: "Stir-fry the sliced beef and broccoli in the smoking hot wok.",
      },
      {
        phrase: "toss up",
        meaning: "flip ingredients in the wok",
        arabic: "يَقْلِبُ فِي الوُوك",
        example: "The chef tossed up the egg noodles effortlessly.",
      },
    ],
    sentences: [
      {
        context: "Stir-Frying",
        en: "The chef tossed crispy vegetables and ginger over high heat in the large wok.",
        ar: "قَلَّبَ الطَّاهِي الخُضْرَاوَاتِ المُقَرْمَشَةَ وَالزَّنْجَبِيلَ عَلَى نَارٍ عَالِيَةٍ فِي الوُوكِ الكَبِيرِ.",
      },
      {
        context: "Cooking Technique",
        en: "A seasoned carbon steel wok imparts a wonderful smoky flavor to fried rice.",
        ar: "يَمْنَحُ الوُوكُ الفُولاذِيُّ المُمَتَّعُ نَكْهَةً دُخَانِيَّةً رَائِعَةً لِلأَرُزِّ المَقْلِيِّ.",
      },
      {
        context: "Asian Cuisine",
        en: "Heat peanut oil until shimmering before adding aromatics to the wok.",
        ar: "سَخِّنْ زَيْتَ الفُولِ السُّودَانِيِّ جَيِّداً قَبْلَ إِضَافَةِ المُنَكِّهَاتِ إِلَى المِقْلاةِ الصِّينِيَّةِ.",
      },
    ],
    exampleSentence:
      "The chef tossed crispy vegetables and ginger over high heat in the large wok.",
    exampleArabic:
      "قَلَّبَ الطَّاهِي الخُضْرَاوَاتِ المُقَرْمَشَةَ وَالزَّنْجَبِيلَ عَلَى نَارٍ عَالِيَةٍ فِي الوُوكِ الكَبِيرِ.",
  },
  wool: {
    id: "wool",
    arabic: "صُوف",
    partOfSpeech: "noun",
    phonetic: "wʊl",
    pronunciationTip: "Short 'oo' vowel /ʊ/ as in 'wood' or 'book'.",
    collocations: [
      "pure wool",
      "sheep's wool",
      "spin wool",
      "warm wool sweater",
      "wool blanket",
      "raw fleece wool",
    ],
    phrasalVerbs: [
      {
        phrase: "spin into",
        meaning: "twist raw wool fibers into yarn",
        arabic: "يَغْزِلُ الصُّوف",
        example: "The artisan spun raw washed wool into durable knitting yarn.",
      },
    ],
    sentences: [
      {
        context: "Natural Fiber",
        en: "Natural sheep's wool is water-resistant, breathable, and wonderfully warm in freezing weather.",
        ar: "يَتَمَيَّزُ صُوفُ الأَغْنَامِ الطَّبِيعِيُّ بِمُقَاوَمَتِهِ لِلْمَاءِ وَدِفْئِهِ الفَائِقِ فِي البَرْدِ.",
      },
      {
        context: "Crafts & Textiles",
        en: "She washed and carded the raw fleece wool before spinning it on an old wooden wheel.",
        ar: "غَسَلَتْ وَمَشَّطَتْ صُوفَ الفَرْوِ الخَامَ قَبْلَ غَزْلِهِ عَلَى مِغْزَلٍ خَشَبِيٍّ.",
      },
      {
        context: "Clothing",
        en: "Handmade socks and sweaters knitted from pure merino wool last for decades.",
        ar: "تَدُومُ الجَوَارِبُ وَالكَنْزَاتُ المَحْبُوكَةُ مِنْ صُوفِ المِيرِينُو النَّقِيِّ لِعُقُودٍ.",
      },
    ],
    exampleSentence:
      "Natural sheep's wool is water-resistant, breathable, and wonderfully warm in freezing weather.",
    exampleArabic:
      "يَتَمَيَّزُ صُوفُ الأَغْنَامِ الطَّبِيعِيُّ بِمُقَاوَمَتِهِ لِلْمَاءِ وَدِفْئِهِ الفَائِقِ فِي البَرْدِ.",
  },
  rose: {
    id: "rose",
    arabic: "وَرْدَة",
    partOfSpeech: "noun",
    phonetic: "roʊz",
    pronunciationTip: "Long 'o' diphthong /oʊ/ as in 'go', ending with a voiced 'z' sound.",
    collocations: [
      "red rose",
      "rose petal",
      "fragrant rose",
      "rose thorn",
      "bunch of roses",
      "wild rose",
    ],
    phrasalVerbs: [
      {
        phrase: "come up roses",
        meaning: "turn out successfully or favorably",
        arabic: "يَنْتَهِي عَلَى أَفْضَلِ حَال",
        example: "After months of hard work, everything is coming up roses.",
      },
    ],
    sentences: [
      {
        context: "Garden Blossom",
        en: "A crimson rose bloomed beautifully in the center of the garden bed.",
        ar: "تَفَتَّحَتْ وَرْدَةٌ قِرْمِزِيَّةٌ بِجَمَالٍ فِي وَسَطِ حَوْضِ الحَدِيقَةِ.",
      },
      {
        context: "Gift Giving",
        en: "He gave her a single red rose for her graduation anniversary.",
        ar: "أَهْدَاهَا وَرْدَةً حَمْرَاءَ وَاحِدَةً بِمُنَاسَبَةِ ذِكْرَى تَخَرُّجِهَا.",
      },
      {
        context: "Aromatics",
        en: "The sweet scent of the blooming rose filled the entire courtyard.",
        ar: "مَلَأَتِ الرَّائِحَةُ الزَّكِيَّةُ لِلْوَرْدَةِ المُتَفَتِّحَةِ الفِنَاءَ كُلَّهُ.",
      },
    ],
    exampleSentence: "She clipped a fresh rose to place inside the ceramic vase.",
    exampleArabic: "قَطَفَتْ وَرْدَةً نَضِرَةً لِتَضَعَهَا دَاخِلَ المَزْهَرِيَّةِ الخَزَفِيَّةِ.",
  },
  tulip: {
    id: "tulip",
    arabic: "زَهْرَةُ التُّولِيب (خُزَامَى)",
    partOfSpeech: "noun",
    phonetic: "ˈtuːlɪp",
    pronunciationTip: "First syllable has a long /uː/ sound: 'TOO-lip'.",
    collocations: [
      "tulip bulb",
      "yellow tulip",
      "tulip field",
      "spring tulip",
      "plant tulips",
      "cup of a tulip",
    ],
    phrasalVerbs: [
      {
        phrase: "spring up",
        meaning: "appear suddenly like spring flowers",
        arabic: "يَنْبُتُ فَجْأَةً",
        example: "Bright tulips spring up in early April across the lawn.",
      },
    ],
    sentences: [
      {
        context: "Spring Gardening",
        en: "Bright yellow tulips opened their cup-shaped petals under the morning sun.",
        ar: "فَتَحَتْ زُهُورُ التُّولِيبِ الصَّفْرَاءُ البَرَّاقَةُ بَتَلاتِهَا الكَأْسِيَّةَ تَحْتَ شَمْسِ الصَّبَاحِ.",
      },
      {
        context: "Planting Bulbs",
        en: "In autumn, we planted fifty tulip bulbs along the stone pathway.",
        ar: "فِي الخَرِيفِ، زَرَعْنَا خَمْسِينَ بَصَلَةَ تُولِيب عَلَى طُولِ المَمَرِّ الحَجَرِيِّ.",
      },
      {
        context: "Floral Display",
        en: "The colorful tulip bouquet made the dining table look cheerful.",
        ar: "جَعَلَتْ بَاقَةُ التُّولِيبِ المُلَوَّنَةُ طَاوِلَةَ الطَّعَامِ تَبْدُو مُبْهِجَةً.",
      },
    ],
    exampleSentence: "A vibrant red tulip stood tall against the green foliage.",
    exampleArabic:
      "وَقَفَتْ زَهْرَةُ تُولِيب حَمْرَاءُ زَاهِيَةٌ شَامِخَةً أَمَامَ الأَوْرَاقِ الخَضْرَاءِ.",
  },
  sunflower: {
    id: "sunflower",
    arabic: "عَبَّادُ الشَّمْس (دُوَّارُ الشَّمْس)",
    partOfSpeech: "noun",
    phonetic: "ˈsʌnˌflaʊər",
    pronunciationTip: "Compound noun with primary stress on 'SUN' (/ˈsʌnˌflaʊ.ər/).",
    collocations: [
      "sunflower seeds",
      "tall sunflower",
      "sunflower field",
      "sunflower oil",
      "golden sunflower",
      "giant sunflower",
    ],
    phrasalVerbs: [
      {
        phrase: "turn toward",
        meaning: "face in the direction of light",
        arabic: "يَتَّجِهُ نَحْوَ",
        example: "The sunflower turns toward the sun throughout the day.",
      },
    ],
    sentences: [
      {
        context: "Heliotropism",
        en: "The tall sunflower tracks the movement of the sun from dawn until dusk.",
        ar: "يَتَتَبَّعُ عَبَّادُ الشَّمْسِ الطَّوِيلُ حَرَكَةَ الشَّمْسِ مِنَ الفَجْرِ حَتَّى الغُرُوبِ.",
      },
      {
        context: "Harvesting",
        en: "We roasted edible sunflower seeds collected from the dried flower head.",
        ar: "حَمَّصْنَا بُذُورَ عَبَّادِ الشَّمْسِ المَأْكُولَةَ المَجْمُوعَةَ مِنْ قُرْصِ الزَّهْرَةِ المُجَفَّفِ.",
      },
      {
        context: "Landscape",
        en: "An immense field of blooming sunflowers painted the countryside golden.",
        ar: "لَوَّنَ حَقْلٌ هَائِلٌ مِنْ زُهُورِ عَبَّادِ الشَّمْسِ المُتَفَتِّحَةِ الرِّيفَ بِاللَّوْنِ الذَّهَبِيِّ.",
      },
    ],
    exampleSentence: "The giant sunflower reached over two meters high by late August.",
    exampleArabic:
      "وَصَلَ طُولُ زَهْرَةِ عَبَّادِ الشَّمْسِ العِمْلاقَةِ إِلَى أَكْثَرَ مِنْ مِتْرَيْنِ بِحُلُولِ أَوَاخِرِ أُغُسْطُسَ.",
  },
  daisy: {
    id: "daisy",
    arabic: "زَهْرَةُ اللُّؤْلُؤ (أُقْحُوَان)",
    partOfSpeech: "noun",
    phonetic: "ˈdeɪzi",
    pronunciationTip: "First syllable has a long 'a' sound /eɪ/ followed by a soft 'z'.",
    collocations: [
      "white daisy",
      "daisy chain",
      "fresh as a daisy",
      "wild daisy",
      "daisy petals",
      "field daisy",
    ],
    phrasalVerbs: [
      {
        phrase: "pick off",
        meaning: "remove petals one by one",
        arabic: "يَقْطِفُ البَتَلات",
        example: "Children playfully picked petals off the wild daisy.",
      },
    ],
    sentences: [
      {
        context: "Wildflower Meadow",
        en: "Small white daisies with cheerful yellow centers carpeted the grassy lawn.",
        ar: "فَرَشَتْ زُهُورُ اللُّؤْلُؤِ البَيْضَاءُ الصَّغِيرَةُ ذَاتُ المَرَاكِزِ الصَّفْرَاءِ العُشْبَ كَالسِّجَادِ.",
      },
      {
        context: "Crafting",
        en: "The children sat in the shade making a long daisy chain for their hair.",
        ar: "جَلَسَ الأَطْفَالُ فِي الظِّلِّ يَصْنَعُونَ طَوْقاً طَوِيلاً مِنْ زُهُورِ اللُّؤْلُؤِ لِشُعُورِهِمْ.",
      },
      {
        context: "Spring Awakening",
        en: "Dozens of fresh daisies opened as soon as the morning dew evaporated.",
        ar: "تَفَتَّحَتْ عَشَرَاتُ زُهُورِ الأُقْحُوَانِ النَّضِرَةِ بِمُجَرَّدِ تَبَخُّرِ نَدَى الصَّبَاحِ.",
      },
    ],
    exampleSentence: "She picked a delicate daisy to press inside her botanical notebook.",
    exampleArabic:
      "قَطَفَتْ زَهْرَةَ أُقْحُوَانٍ رَقِيقَةً لِتَجْفِيفِهَا دَاخِلَ دَفْتَرِهَا النَّبَاتِيِّ.",
  },
  lily: {
    id: "lily",
    arabic: "زَنْبَق",
    partOfSpeech: "noun",
    phonetic: "ˈlɪli",
    pronunciationTip: "Short 'i' in both syllables: /ˈlɪl.i/.",
    collocations: [
      "water lily",
      "white lily",
      "peace lily",
      "fragrant lily",
      "lily pad",
      "tiger lily",
    ],
    phrasalVerbs: [
      {
        phrase: "open up",
        meaning: "unfurl blossom petals",
        arabic: "يَتَفَتَّحُ",
        example: "The pure white lily opened up overnight in the pond.",
      },
    ],
    sentences: [
      {
        context: "Pond Vegetation",
        en: "A pristine white water lily floated gracefully on the surface of the pond.",
        ar: "طَفَتْ زَهْرَةُ زَنْبَقِ مَاءٍ بَيْضَاءُ نَقِيَّةٌ بِرَشَاقَةٍ عَلَى سَطْحِ البِرْكَةِ.",
      },
      {
        context: "Indoor Plant",
        en: "She placed a potted peace lily in the corner of the shaded living room.",
        ar: "وَضَعَتْ نَبْتَةَ زَنْبَقِ السَّلامِ فِي زَاوِيَةِ غُرْفَةِ المَعِيشَةِ الظَّلِيلَةِ.",
      },
      {
        context: "Perfume",
        en: "The sweet perfume of the Asiatic lily drifted through the open window.",
        ar: "فَاحَتِ الرَّائِحَةُ العَطِرَةُ لِزَهْرَةِ الزَّنْبَقِ عَبْرَ النَّافِذَةِ المَفْتُوحَةِ.",
      },
    ],
    exampleSentence: "The majestic lily displayed six long petals surrounding golden stamens.",
    exampleArabic:
      "أَظْهَرَتْ زَهْرَةُ الزَّنْبَقِ المَهِيبَةُ سِتَّ بَتَلاتٍ طَوِيلَةٍ تُحِيطُ بِالأَسْدِيَةِ الذَّهَبِيَّةِ.",
  },
  daffodil: {
    id: "daffodil",
    arabic: "نَرْجِس (نَرْجِسٌ بَرِّي)",
    partOfSpeech: "noun",
    phonetic: "ˈdæfədɪl",
    pronunciationTip: "Three syllables: 'DAF-o-dil' (/ˈdæf.ə.dɪl/).",
    collocations: [
      "yellow daffodil",
      "golden daffodil",
      "spring daffodil",
      "daffodil trumpet",
      "clump of daffodils",
      "plant daffodils",
    ],
    phrasalVerbs: [
      {
        phrase: "sprout up",
        meaning: "emerge from the soil",
        arabic: "يَنْبُتُ مِنَ الأَرْض",
        example: "Bright daffodils sprout up as the first sign of spring.",
      },
    ],
    sentences: [
      {
        context: "Early Spring",
        en: "Golden daffodils are the welcome heralds that signify winter is finally over.",
        ar: "تُعْتَبَرُ زُهُورُ النَّرْجِسِ الذَّهَبِيَّةُ البَشَائِرَ المُبْهِجَةَ الَّتِي تُؤَكِّدُ انْتِهَاءَ الشِّتَاءِ.",
      },
      {
        context: "Woodland Walk",
        en: "Thousands of wild daffodils danced gently in the cool mountain breeze.",
        ar: "رَقَصَتْ آلافُ زُهُورِ النَّرْجِسِ البَرِّيِّ بِلُطْفٍ فِي نَسِيمِ الجَبَلِ العَلِيلِ.",
      },
      {
        context: "Garden Border",
        en: "We lined the brick walkway with bright yellow daffodils and purple crocuses.",
        ar: "زَيَّنَّا المَمَرَّ الآجُرِّيَّ بِزُهُورِ النَّرْجِسِ الصَّفْرَاءِ الزَّاهِيَةِ.",
      },
    ],
    exampleSentence: "A sunny daffodil brightened up the flower bed after the spring rain.",
    exampleArabic:
      "أَضَاءَتْ زَهْرَةُ نَرْجِسٍ مُشْرِقَةٌ حَوْضَ الزُّهُورِ بَعْدَ مَطَرِ الرَّبِيعِ.",
  },
  violet: {
    id: "violet",
    arabic: "بَنَفْسَج",
    partOfSpeech: "noun",
    phonetic: "ˈvaɪələt",
    pronunciationTip: "Three syllables with long 'i': /ˈvaɪ.ə.lət/.",
    collocations: [
      "sweet violet",
      "African violet",
      "wild violet",
      "violet petals",
      "deep violet",
      "violet blossom",
    ],
    phrasalVerbs: [
      {
        phrase: "tuck away",
        meaning: "nestle in a hidden spot",
        arabic: "يَخْتَبِئُ فِي",
        example: "Tiny violets tuck away beneath the thick forest moss.",
      },
    ],
    sentences: [
      {
        context: "Shady Habitat",
        en: "Delicate wild violets grew abundantly in the moist shade beneath the hedge.",
        ar: "نَمَتْ زُهُورُ البَنَفْسَجِ البَرِّيِّ الرَّقِيقَةُ بِكَثْرَةٍ فِي الظِّلِّ الرَّطْبِ تَحْتَ السِّيَاجِ.",
      },
      {
        context: "Color & Scent",
        en: "The sweet scent of crushed violet leaves is used in fine natural perfumery.",
        ar: "تُسْتَخْدَمُ الرَّائِحَةُ الزَّكِيَّةُ لأَوْرَاقِ البَنَفْسَجِ فِي صِنَاعَةِ العُطُورِ الفَاخِرَةِ.",
      },
      {
        context: "Houseplant",
        en: "Her African violet bloomed with velvety purple flowers all winter long.",
        ar: "أَزْهَرَتْ نَبْتَةُ البَنَفْسَجِ الإِفْرِيقِيِّ لَدَيْهَا بِزُهُورٍ أُرْجُوَانِيَّةٍ طَوَالَ الشِّتَاءِ.",
      },
    ],
    exampleSentence: "She noticed a tiny purple violet hiding among the grass.",
    exampleArabic:
      "لاحَظَتْ زَهْرَةَ بَنَفْسَجٍ أُرْجُوَانِيَّةً صَغِيرَةً مُخْتَبِئَةً بَيْنَ العُشْبِ.",
  },
  orchid: {
    id: "orchid",
    arabic: "سَحْلَبِيَّة (أُورْكِيد)",
    partOfSpeech: "noun",
    phonetic: "ˈɔːrkɪd",
    pronunciationTip: "Initial 'ch' is pronounced as /k/: 'OR-kid' (/ˈɔːr.kɪd/).",
    collocations: [
      "tropical orchid",
      "white orchid",
      "wild orchid",
      "orchid flower",
      "potted orchid",
      "orchid bloom",
    ],
    phrasalVerbs: [
      {
        phrase: "thrive on",
        meaning: "grow vigorously in specific conditions",
        arabic: "يَنْمُو بِازْدِهَارٍ فِي",
        example: "The delicate orchid thrives on humid tropical air and indirect light.",
      },
    ],
    sentences: [
      {
        context: "Botanical Complexity",
        en: "The exotic orchid features an intricate petal structure designed for pollinators.",
        ar: "تَتَمَيَّزُ زَهْرَةُ الأُورْكِيدِ الغَرِيبَةُ بِهَيْكَلِ بَتَلاتٍ مُعَقَّدٍ مُهَيَّأٍ لِلْمُلَقِّحَاتِ.",
      },
      {
        context: "Indoor Care",
        en: "Misting the roots of the potted orchid weekly keeps its blooms vibrant.",
        ar: "رَشُّ جُذُورِ زَهْرَةِ الأُورْكِيدِ أُسْبُوعِيّاً يُحَافِظُ عَلَى نَضَارَةِ زُهُورِهَا.",
      },
      {
        context: "Exhibition",
        en: "Rare purple and white orchids were showcased at the international flower show.",
        ar: "عُرِضَتْ زُهُورُ أُورْكِيدٍ أُرْجُوَانِيَّةٌ وَبَيْضَاءُ نَادِرَةٌ فِي مَعْرِضِ الزُّهُورِ الدَّوْلِيِّ.",
      },
    ],
    exampleSentence: "He received a stunning pink orchid as a housewarming gift.",
    exampleArabic:
      "تَلَقَّى زَهْرَةَ أُورْكِيدٍ وَرْدِيَّةً رَائِعَةً كَهَدِيَّةِ مُبَارَكَةِ المَنْزِلِ.",
  },
  carnation: {
    id: "carnation",
    arabic: "قَرَنْفُل (زَهْرَةُ القَرَنْفُل)",
    partOfSpeech: "noun",
    phonetic: "kɑːrˈneɪʃən",
    pronunciationTip: "Stress on the second syllable: 'kar-NAY-shun' (/kɑːrˈneɪ.ʃən/).",
    collocations: [
      "red carnation",
      "pink carnation",
      "white carnation",
      "bunch of carnations",
      "carnation boutonniere",
      "spicy carnation",
    ],
    phrasalVerbs: [
      {
        phrase: "last for",
        meaning: "remain fresh over time",
        arabic: "يَبْقَى نَضِراً لِمُدَّة",
        example: "Cut carnations can last for up to three weeks in clean water.",
      },
    ],
    sentences: [
      {
        context: "Floristry",
        en: "Ruffled pink carnations added rich texture and sweet spice to the centerpiece.",
        ar: "أَضَافَتْ زُهُورُ القَرَنْفُلِ الوَرْدِيَّةُ المُمَوَّجَةُ قَوَاماً غَنِيّاً لِبَاقَةِ الطَّاوِلَةِ.",
      },
      {
        context: "Celebration",
        en: "He wore a crisp red carnation pinned to the lapel of his black tuxedo.",
        ar: "وَضَعَ زَهْرَةَ قَرَنْفُلٍ حَمْرَاءَ أَنِيقَةً مُثَبَّتَةً عَلَى طَيَّةِ سُتْرَتِهِ الرَّسْمِيَّةِ.",
      },
      {
        context: "Longevity",
        en: "Fresh carnations are prized by florists because their blooms stay vibrant for weeks.",
        ar: "يُقَدِّرُ بَائِعُو الزُّهُورِ القَرَنْفُلَ النَّضِرَ لأَنَّ زُهُورَهُ تَبْقَى زَاهِيَةً لِعِدَّةِ أَسَابِيعَ.",
      },
    ],
    exampleSentence: "A sweet clove-like scent rose from the freshly cut carnation.",
    exampleArabic:
      "فَاحَتْ رَائِحَةٌ زَكِيَّةٌ تُشْبِهُ القَرَنْفُلَ مِنَ الزَّهْرَةِ المَقْطُوفَةِ حَدِيثاً.",
  },
  lavender: {
    id: "lavender",
    arabic: "خُزَامَى (لافِنْدَر)",
    partOfSpeech: "noun",
    phonetic: "ˈlævəndər",
    pronunciationTip: "Stress on the first syllable: 'LAV-en-der' (/ˈlæv.ən.dər/).",
    collocations: [
      "lavender field",
      "lavender oil",
      "scent of lavender",
      "dried lavender",
      "purple lavender",
      "lavender bush",
    ],
    phrasalVerbs: [
      {
        phrase: "ward off",
        meaning: "repel insects naturally",
        arabic: "يَطْرُدُ الحَشَرَات",
        example: "Dried lavender sachets ward off moths in clothes wardrobes.",
      },
    ],
    sentences: [
      {
        context: "Aromatherapy",
        en: "The soothing aroma of purple lavender helps promote deep and restful sleep.",
        ar: "تُسَاعِدُ الرَّائِحَةُ المُرِيحَةُ لِلْخُزَامَى الأُرْجُوَانِيَّةِ عَلَى النَّوْمِ العَمِيقِ.",
      },
      {
        context: "Pollinators",
        en: "Dozens of honeybees buzzed excitedly over the blooming lavender bushes.",
        ar: "طَنَّتْ عَشَرَاتُ نَحْلاتِ العَسَلِ بِحَمَاسٍ فَوْقَ شُجَيْرَاتِ الخُزَامَى المُزْهِرَةِ.",
      },
      {
        context: "Landscaping",
        en: "We planted a fragrant row of English lavender along the sunny garden border.",
        ar: "زَرَعْنَا صَفّاً عَطِراً مِنَ الخُزَامَى عَلَى طُولِ حَافَّةِ الحَدِيقَةِ المُشْمِسَةِ.",
      },
    ],
    exampleSentence: "She tied a bundle of dried lavender with purple ribbon.",
    exampleArabic:
      "رَبَطَتْ حُزْمَةً مِنَ الخُزَامَى المُجَفَّفَةِ بِشَرِيطٍ أُرْجُوَانِيٍّ أَنِيقٍ.",
  },
  "oak-tree": {
    id: "oak-tree",
    arabic: "شَجَرَةُ البَلُّوط",
    partOfSpeech: "noun",
    phonetic: "oʊk triː",
    pronunciationTip: "Long 'o' in 'oak' (/oʊk/) followed by clear /triː/.",
    collocations: [
      "ancient oak tree",
      "oak tree branches",
      "acorns from an oak tree",
      "solid oak tree",
      "mighty oak tree",
      "shade of an oak tree",
    ],
    phrasalVerbs: [
      {
        phrase: "branch out",
        meaning: "extend limbs in all directions",
        arabic: "يَتَفَرَّعُ",
        example: "The massive oak tree branches out widely over the village green.",
      },
    ],
    sentences: [
      {
        context: "Woodland Landmark",
        en: "The ancient oak tree has stood at the center of the town park for three centuries.",
        ar: "وَقَفَتْ شَجَرَةُ البَلُّوطِ العَتِيقَةُ فِي وَسَطِ حَدِيقَةِ المَدِينَةِ مُنْذُ ثَلاثَةِ قُرُونٍ.",
      },
      {
        context: "Wildlife Support",
        en: "Squirrels eagerly gathered fallen acorns beneath the canopy of the sturdy oak tree.",
        ar: "جَمَعَتِ السَّنَاجِبُ بِشَغَفٍ ثِمَارَ البَلُّوطِ السَّاقِطَةَ تَحْتَ مِظَلَّةِ الشَّجَرَةِ القَوِيَّةِ.",
      },
      {
        context: "Timber & Strength",
        en: "Wood from the mature oak tree is prized for building durable heritage furniture.",
        ar: "يُعْتَبَرُ خَشَبُ شَجَرَةِ البَلُّوطِ البَالِغَةِ مَطْلُوباً لِصِنَاعَةِ الأَثَاثِ المَتِينِ.",
      },
    ],
    exampleSentence: "We enjoyed a peaceful family picnic in the shade of a majestic oak tree.",
    exampleArabic:
      "اسْتَمْتَعْنَا بِنُزْهَةٍ عَائِلِيَّةٍ هَادِئَةٍ فِي ظِلِّ شَجَرَةِ بَلُّوطٍ مَهِيبَةٍ.",
  },
  "pine-tree": {
    id: "pine-tree",
    arabic: "شَجَرَةُ الصَّنَوْبَر",
    partOfSpeech: "noun",
    phonetic: "paɪn triː",
    pronunciationTip: "Long 'i' diphthong /aɪ/ in 'pine' like 'fine' or 'line'.",
    collocations: [
      "tall pine tree",
      "pine tree needles",
      "pine tree cones",
      "evergreen pine tree",
      "scent of pine trees",
      "dense pine tree forest",
    ],
    phrasalVerbs: [
      {
        phrase: "stand tall",
        meaning: "remain upright and prominent",
        arabic: "يَصْمُدُ شَامِخاً",
        example: "Evergreen pine trees stand tall through harsh winter snowstorms.",
      },
    ],
    sentences: [
      {
        context: "Evergreen Forest",
        en: "The crisp morning air smelled of fresh resin from the towering pine tree grove.",
        ar: "فَاحَتْ فِي هَوَاءِ الصَّبَاحِ المُنْعِشِ رَائِحَةُ الصَّمْغِ النَّضِرِ مِنْ بُسْتَانِ الصَّنَوْبَرِ الشَّاهِقِ.",
      },
      {
        context: "Winter Scenery",
        en: "Heavy white snow settled softly upon the needle-covered boughs of the pine tree.",
        ar: "اسْتَقَرَّتِ الثُّلُوجُ البَيْضَاءُ بِلُطْفٍ فَوْقَ أَغْصَانِ شَجَرَةِ الصَّنَوْبَرِ المُغَطَّاةِ بِالإِبَرِ.",
      },
      {
        context: "Crafts & Cones",
        en: "Children collected dry cones fallen from the tall pine tree to make holiday decorations.",
        ar: "جَمَعَ الأَطْفَالُ المَخَارِيطَ الجَافَّةَ السَّاقِطَةَ مِنْ شَجَرَةِ الصَّنَوْبَرِ لِصُنْعِ الزِّينَةِ.",
      },
    ],
    exampleSentence: "A great horned owl perched silently atop the tall pine tree.",
    exampleArabic:
      "جَلَسَتْ بَوْمَةٌ قَرْنَاءُ كَبِيرَةٌ فِي صَمْتٍ أَعْلَى شَجَرَةِ الصَّنَوْبَرِ الطَّوِيلَةِ.",
  },
  "apple-tree": {
    id: "apple-tree",
    arabic: "شَجَرَةُ التُّفَّاح",
    partOfSpeech: "noun",
    phonetic: "ˈæpəl triː",
    pronunciationTip: "Short 'a' /æ/ in 'apple' followed by /triː/.",
    collocations: [
      "plant an apple tree",
      "apple tree blossom",
      "ripe apple tree",
      "apple tree orchard",
      "prune an apple tree",
      "harvest from an apple tree",
    ],
    phrasalVerbs: [
      {
        phrase: "bear fruit",
        meaning: "produce fruit naturally",
        arabic: "يُثْمِرُ",
        example: "The young apple tree began to bear sweet fruit in its third year.",
      },
    ],
    sentences: [
      {
        context: "Autumn Harvest",
        en: "Heavy branches of the apple tree bent low under the weight of crisp red fruit.",
        ar: "انْحَنَتْ أَغْصَانُ شَجَرَةِ التُّفَّاحِ الثَّقِيلَةُ تَحْتَ وَزْنِ الثِّمَارِ الحَمْرَاءِ المُقَرْمَشَةِ.",
      },
      {
        context: "Spring Blossoms",
        en: "In springtime, the apple tree is covered in delicate pink and white blossoms.",
        ar: "فِي فَصْلِ الرَّبِيعِ، تُغَطَّى شَجَرَةُ التُّفَّاحِ بِأَزْهَارٍ وَرْدِيَّةٍ وَبَيْضَاءَ رَقِيقَةٍ.",
      },
      {
        context: "Orchard Work",
        en: "We climbed the wooden ladder to pick the highest fruit from the mature apple tree.",
        ar: "صَعِدْنَا السُّلَّمَ الخَشَبِيَّ لِقَطْفِ أَعْلَى الثِّمَارِ مِنْ شَجَرَةِ التُّفَّاحِ البَالِغَةِ.",
      },
    ],
    exampleSentence: "Birds gathered in the apple tree to peck at the sweet fruit.",
    exampleArabic:
      "تَجَمَّعَتِ الطُّيُورُ فِي شَجَرَةِ التُّفَّاحِ لِنَقْرِ الثِّمَارِ الحُلْوَةِ.",
  },
  "cherry-tree": {
    id: "cherry-tree",
    arabic: "شَجَرَةُ الكَرَز",
    partOfSpeech: "noun",
    phonetic: "ˈtʃɛri triː",
    pronunciationTip: "Initial 'ch' /tʃ/ sound: 'CHAIR-ee tree' (/ˈtʃɛr.i triː/).",
    collocations: [
      "flowering cherry tree",
      "cherry tree blossom",
      "wild cherry tree",
      "Japanese cherry tree",
      "cherry tree fruit",
      "cherry tree grove",
    ],
    phrasalVerbs: [
      {
        phrase: "burst into",
        meaning: "flower suddenly in mass",
        arabic: "يَتَفَتَّحُ بِغَزَارَة",
        example: "The cherry tree bursts into pink blossoms every April.",
      },
    ],
    sentences: [
      {
        context: "Cherry Blossoms",
        en: "Tourists traveled from around the world to photograph the blooming cherry tree avenue.",
        ar: "سَافَرَ السُّيَّاحُ مِنْ جَمِيعِ أَنْحَاءِ العَالَمِ لِتَصْوِيرِ مَمَرِّ أَشْجَارِ الكَرَزِ المُزْهِرَةِ.",
      },
      {
        context: "Fruit Production",
        en: "Clusters of juicy dark cherries hung temptingly from every branch of the cherry tree.",
        ar: "تَدَلَّتْ عَنَاقِيدُ الكَرَزِ الدَّاكِنِ المَلِيءِ بِالعَصِيرِ مِنْ كُلِّ غُصْنٍ فِي شَجَرَةِ الكَرَزِ.",
      },
      {
        context: "Garden Accent",
        en: "The ornamental cherry tree makes a spectacular focal point in the front lawn.",
        ar: "تُشَكِّلُ شَجَرَةُ الكَرَزِ التَّزْيِينِيَّةُ نُقْطَةَ جَذْبٍ رَائِعَةً فِي الفِنَاءِ الأَمَامِيِّ.",
      },
    ],
    exampleSentence: "Pink flower petals fell like gentle snow beneath the blossoming cherry tree.",
    exampleArabic:
      "تَسَاقَطَتْ بَتَلاتُ الأَزْهَارِ الوَرْدِيَّةُ كَالثَّلْجِ الخَفِيفِ تَحْتَ شَجَرَةِ الكَرَزِ المُزْهِرَةِ.",
  },
  "palm-tree": {
    id: "palm-tree",
    arabic: "نَخْلَة (شَجَرَةُ النَّخِيل)",
    partOfSpeech: "noun",
    phonetic: "pɑːm triː",
    pronunciationTip: "The 'l' is silent in 'palm': /pɑːm triː/.",
    collocations: [
      "tall palm tree",
      "tropical palm tree",
      "palm tree fronds",
      "date palm tree",
      "coconut palm tree",
      "swaying palm tree",
    ],
    phrasalVerbs: [
      {
        phrase: "sway in",
        meaning: "bend gently with the wind",
        arabic: "يَتَمَايَلُ فِي",
        example: "Tall palm trees sway gracefully in the warm coastal wind.",
      },
    ],
    sentences: [
      {
        context: "Coastal Climate",
        en: "Towering palm trees with feathered fronds lined the sunny Mediterranean promenade.",
        ar: "اصْطَفَّتْ أَشْجَارُ النَّخِيلِ الشَّاهِقَةُ ذَاتُ السَّعَفِ عَلَى طُولِ الكُورْنِيشِ السَّاحِلِيِّ.",
      },
      {
        context: "Date Cultivation",
        en: "The date palm tree produces sweet amber fruit in large hanging clusters.",
        ar: "تُنْتِجُ نَخْلَةُ التَّمْرِ ثِمَاراً عَنْبَرِيَّةً حُلْوَةً فِي عَنَاقِيدَ كَبِيرَةٍ مُتَدَلِّيَةٍ.",
      },
      {
        context: "Desert Oasis",
        en: "A cluster of green palm trees signaled a refreshing freshwater spring in the desert.",
        ar: "أَشَارَتْ مَجْمُوعَةٌ مِنْ أَشْجَارِ النَّخِيلِ الخَضْرَاءِ إِلَى نَبْعِ مَاءٍ عَذْبٍ فِي الصَّحْرَاءِ.",
      },
    ],
    exampleSentence: "We rested under the cooling shade of a tall palm tree by the shore.",
    exampleArabic:
      "اسْتَرَحْنَا تَحْتَ الظِّلِّ المُنْعِشِ لِنَخْلَةٍ طَوِيلَةٍ عَلَى شَاطِئِ البَحْرِ.",
  },
  hedge: {
    id: "hedge",
    arabic: "سِيَاجٌ نَبَاتِيّ (سِيَاجُ شُجَيْرَات)",
    partOfSpeech: "noun",
    phonetic: "hɛdʒ",
    pronunciationTip: "Short 'e' /ɛ/ ending in soft 'j' sound /dʒ/.",
    collocations: [
      "trim the hedge",
      "boxwood hedge",
      "tall green hedge",
      "boundary hedge",
      "hedge shears",
      "plant a hedge",
    ],
    phrasalVerbs: [
      {
        phrase: "hedge in",
        meaning: "enclose with a boundary hedge",
        arabic: "يُحِيطُ بِسِيَاج",
        example: "The garden was neatly hedged in by dense evergreen bushes.",
      },
    ],
    sentences: [
      {
        context: "Garden Boundary",
        en: "A neatly trimmed boxwood hedge separated the flower garden from the driveway.",
        ar: "فَصَلَ سِيَاجٌ نَبَاتِيٌّ مُقَلَّمٌ بِعِنَايَةٍ حَدِيقَةَ الزُّهُورِ عَنْ مَمَرِّ السَّيَّارَاتِ.",
      },
      {
        context: "Privacy",
        en: "The tall evergreen hedge provides complete privacy and blocks road noise.",
        ar: "يُوَفِّرُ السِّيَاجُ النَّبَاتِيُّ الدَّائِمُ الخُضْرَةِ خُصُوصِيَّةً تَامَّةً وَيَحْجُبُ ضَوْضَاءَ الطَّرِيقِ.",
      },
      {
        context: "Maintenance",
        en: "He used sharp electric shears on Saturday morning to level the top of the hedge.",
        ar: "اسْتَخْدَمَ مِقَصّاً كَهْرَبَائِيّاً حَادّاً صَبَاحَ السَّبْتِ لِتَسْوِيَةِ قِمَّةِ السِّيَاجِ.",
      },
    ],
    exampleSentence: "Small songbirds nested safely inside the dense green hedge.",
    exampleArabic:
      "عَشَّشَتِ الطُّيُورُ المُغَرِّدَةُ الصَّغِيرَةُ بِأَمَانٍ دَاخِلَ السِّيَاجِ النَّبَاتِيِّ الكَثِيفِ.",
  },
  bush: {
    id: "bush",
    arabic: "شُجَيْرَة",
    partOfSpeech: "noun",
    phonetic: "bʊʃ",
    pronunciationTip: "Short 'oo' sound /ʊ/ as in 'push' or 'look'.",
    collocations: [
      "rose bush",
      "flowering bush",
      "dense bush",
      "berry bush",
      "prune a bush",
      "behind the bush",
    ],
    phrasalVerbs: [
      {
        phrase: "bush out",
        meaning: "grow thick and bushy",
        arabic: "يَزْدَادُ كَثَافَةً",
        example: "Pruning the top stems helps the young shrub bush out with thicker foliage.",
      },
    ],
    sentences: [
      {
        context: "Garden Shrubbery",
        en: "A fragrant blueberry bush produced sweet berries throughout the warm summer.",
        ar: "أَنْتَجَتْ شُجَيْرَةُ التُّوتِ العَطِرَةُ ثِمَاراً حُلْوَةً طَوَالَ فَصْلِ الصَّيْفِ الدَّافِئِ.",
      },
      {
        context: "Wildlife Cover",
        en: "A frightened rabbit quickly darted into the thick bush to escape danger.",
        ar: "انْدَفَعَ أَرْنَبٌ خَائِفٌ بِسُرْعَةٍ إِلَى دَاخِلِ الشُّجَيْرَةِ الكَثِيفَةِ هَرَباً مِنَ الخَطَرِ.",
      },
      {
        context: "Pruning",
        en: "She carefully pruned dead branches from the hydrangea bush before spring arrived.",
        ar: "قَلَّمَتْ بِعِنَايَةٍ الأَغْصَانَ المَيِّتَةَ مِنْ شُجَيْرَةِ الهَيْدِرَانْجِيَا قَبْلَ حُلُولِ الرَّبِيعِ.",
      },
    ],
    exampleSentence: "Bright red berries decorated the wild bush along the path.",
    exampleArabic:
      "زَيَّنَتِ الثِّمَارُ الحَمْرَاءُ الزَّاهِيَةُ الشُّجَيْرَةَ البَرِّيَّةَ عَلَى طُولِ المَمَرِّ.",
  },
  ivy: {
    id: "ivy",
    arabic: "لَبْلاَب (عَشَقَة / آيْفِي)",
    partOfSpeech: "noun",
    phonetic: "ˈaɪvi",
    pronunciationTip: "Two syllables with long 'i': 'EYE-vee' (/ˈaɪ.vi/).",
    collocations: [
      "climbing ivy",
      "English ivy",
      "poison ivy",
      "ivy leaves",
      "wall covered in ivy",
      "trailing ivy",
    ],
    phrasalVerbs: [
      {
        phrase: "creep up",
        meaning: "grow upwards clinging to surfaces",
        arabic: "يَتَسَلَّقُ عَلَى",
        example: "Evergreen ivy creeps up the old stone castle walls.",
      },
    ],
    sentences: [
      {
        context: "Architectural Greenery",
        en: "Glossy green English ivy climbed gracefully across the rustic red brick wall.",
        ar: "تَسَلَّقَ اللَّبْلاَبُ الإِنْجِلِيزِيُّ الأَخْضَرُ اللَّامِعُ بِرَشَاقَةٍ عَلَى الجِدَارِ الآجُرِّيِّ.",
      },
      {
        context: "Ground Cover",
        en: "The dense ivy acted as a durable ground cover in shaded areas where grass cannot grow.",
        ar: "عَمِلَ اللَّبْلاَبُ الكَثِيفُ كَغِطَاءٍ أَرْضِيٍّ فِي المَنَاطِقِ الظَّلِيلَةِ.",
      },
      {
        context: "Garden Accent",
        en: "She trained trailing ivy vines to drape elegantly over the wooden balcony railing.",
        ar: "دَرَّبَتْ عُرُوشَ اللَّبْلاَبِ لِتَتَدَلَّى بِأَنَاقَةٍ فَوْقَ حَاجِزِ الشُّرْفَةِ الخَشَبِيِّ.",
      },
    ],
    exampleSentence: "The ancient cottage was entirely cloaked in a thick layer of ivy.",
    exampleArabic:
      "كَانَ الكُوخُ القَدِيمُ مُغَطًّى بِالكـَامِلِ بِطَبَقَةٍ كَثِيفَةٍ مِنَ اللَّبْلاَبِ.",
  },
  vine: {
    id: "vine",
    arabic: "عَرِيشَة (نَبَاتٌ مُتَسَلِّق / كَرْمَة)",
    partOfSpeech: "noun",
    phonetic: "vaɪn",
    pronunciationTip: "Long 'i' diphthong /aɪ/ as in 'mine' or 'fine'.",
    collocations: [
      "grapevine",
      "climbing vine",
      "tomato vine",
      "flowering vine",
      "vine leaves",
      "tangled vine",
    ],
    phrasalVerbs: [
      {
        phrase: "wind around",
        meaning: "coil or twist around a support",
        arabic: "يَلْتَفُّ حَوْلَ",
        example: "The flexible vine winds around the wooden garden trellis.",
      },
    ],
    sentences: [
      {
        context: "Grape Cultivation",
        en: "Juicy purple grapes ripened in heavy clusters along the sunlit vineyard vine.",
        ar: "نَضِجَ العِنَبُ الأُرْجُوَانِيُّ فِي عَنَاقِيدَ ثَقِيلَةٍ عَلَى طُولِ كَرْمَةِ العِنَبِ.",
      },
      {
        context: "Trellis Decoration",
        en: "A flowering jasmine vine spread sweet fragrance across the outdoor patio.",
        ar: "نَشَرَتْ عَرِيشَةُ يَاسَمِينٍ مُزْهِرَةٌ رَائِحَةً زَكِيَّةً عَبْرَ فِنَاءِ المَنْزِلِ.",
      },
      {
        context: "Vegetable Garden",
        en: "We tied the heavy tomato vine to sturdy stakes to keep the fruit off the ground.",
        ar: "رَبَطْنَا عَرِيشَةَ الطَّمَاطِمِ الثَّقِيلَةَ بِأَوْتَادٍ قَوِيَّةٍ لِرَفْعِ الثِّمَارِ عَنِ الأَرْضِ.",
      },
    ],
    exampleSentence: "A strong woody vine twined tightly around the old garden gate.",
    exampleArabic:
      "الْتَفَّتْ عَرِيشَةٌ خَشَبِيَّةٌ قَوِيَّةٌ بِإِحْكَامٍ حَوْلَ بَوَّابَةِ الحَدِيقَةِ القَدِيمَةِ.",
  },
  fern: {
    id: "fern",
    arabic: "سَرَخْس",
    partOfSpeech: "noun",
    phonetic: "fɜːrn",
    pronunciationTip: "Vowel sound /ɜː/ as in 'bird' or 'learn'.",
    collocations: [
      "green fern",
      "fern fronds",
      "Boston fern",
      "woodland fern",
      "potted fern",
      "feathered fern",
    ],
    phrasalVerbs: [
      {
        phrase: "unfurl into",
        meaning: "unroll fiddlehead fronds into full leaves",
        arabic: "يَنْفَرِدُ إِلَى",
        example: "Young fern fiddleheads unfurl into delicate feathery fronds.",
      },
    ],
    sentences: [
      {
        context: "Shade Garden",
        en: "Lush green ferns flourished in the cool, damp corner beside the garden pond.",
        ar: "ازْدَهَرَتْ نَبَاتَاتُ السَّرَخْسِ الخَضْرَاءُ فِي الزَّاوِيَةِ الرَّطْبَةِ بِجَانِبِ بِرْكَةِ الحَدِيقَةِ.",
      },
      {
        context: "Houseplant Hanging",
        en: "A vibrant potted fern hung gracefully from the high ceiling of the sunroom.",
        ar: "عُلِّقَتْ نَبْتَةُ سَرَخْسٍ نَضِرَةٌ بِرَشَاقَةٍ مِنْ سَقْفِ غُرْفَةِ النَّبَاتَاتِ العَالِي.",
      },
      {
        context: "Forest Ecology",
        en: "Delicate feathery fronds of the wild fern captured morning droplets of mist.",
        ar: "الْتَقَطَتْ سَعَفَاتُ السَّرَخْسِ البَرِّيِّ الرَّقِيقَةُ قَطَرَاتِ ضَبَابِ الصَّبَاحِ.",
      },
    ],
    exampleSentence: "The delicate fronds of the fern uncurled as spring temperatures rose.",
    exampleArabic:
      "انْفَرَدَتْ سَعَفَاتُ السَّرَخْسِ الرَّقِيقَةُ مَعَ ارْتِفَاعِ دَرَجَاتِ حَرَارَةِ الرَّبِيعِ.",
  },
  hose: {
    id: "hose",
    arabic: "خُرْطُومُ المِيَاه",
    partOfSpeech: "noun",
    phonetic: "hoʊz",
    pronunciationTip: "Long 'o' diphthong /oʊ/ ending in voiced 'z'.",
    collocations: [
      "garden hose",
      "hose reel",
      "hose nozzle",
      "turn on the hose",
      "spray with a hose",
      "roll up the hose",
    ],
    phrasalVerbs: [
      {
        phrase: "hose down",
        meaning: "wash thoroughly with a stream of water",
        arabic: "يَغْسِلُ بِالخُرْطُوم",
        example: "He hosed down the dusty garden patio after planting.",
      },
    ],
    sentences: [
      {
        context: "Watering Routine",
        en: "She connected the long green garden hose to the outdoor tap to water the flowers.",
        ar: "وَصَلَتْ خُرْطُومَ الحَدِيقَةِ الأَخْضَرَ الطَّوِيلَ بِالصَّنْبُورِ الخَارِجِيِّ لِرَيِّ الزُّهُورِ.",
      },
      {
        context: "Car Washing",
        en: "We adjusted the brass nozzle on the hose to spray a wide mist over the lawn.",
        ar: "ضَبَطْنَا الفُوَّهَةَ النُّحَاسِيَّةَ فِي الخُرْطُومِ لِرَشِّ رَذَاذٍ وَاسِعٍ فَوْقَ العُشْبِ.",
      },
      {
        context: "Storage",
        en: "Neatly rewind the heavy rubber hose onto its reel after finishing in the garden.",
        ar: "لُفَّ خُرْطُومَ المَطَّاطِ الثَّقِيلَ بِتَرْتِيبٍ عَلَى البَكَرَةِ بَعْدَ الانْتِهَاءِ.",
      },
    ],
    exampleSentence: "Water flowed through the garden hose with strong pressure.",
    exampleArabic: "تَدَفَّقَتِ المِيَاهُ عَبْرَ خُرْطُومِ الحَدِيقَةِ بِضَغْطٍ قَوِيٍّ.",
  },
  "garden-gloves": {
    id: "garden-gloves",
    arabic: "قُفَّازَاتُ الحَدِيقَة",
    partOfSpeech: "noun",
    phonetic: "ˈɡɑːrdən ɡlʌvz",
    pronunciationTip: "Short 'u' sound /ʌ/ in 'gloves' (rhymes with 'loves').",
    collocations: [
      "pair of garden gloves",
      "leather garden gloves",
      "thick garden gloves",
      "wear garden gloves",
      "rubber garden gloves",
      "protective garden gloves",
    ],
    phrasalVerbs: [
      {
        phrase: "slip on",
        meaning: "put on quickly and easily",
        arabic: "يَرْتَدِي بِسُرْعَة",
        example: "Slip on your sturdy garden gloves before handling thorny rose bushes.",
      },
    ],
    sentences: [
      {
        context: "Safety & Protection",
        en: "Wearing heavy leather garden gloves protects your fingers from thorns and blisters.",
        ar: "يَحْمِي ارْتِدَاءُ قُفَّازَاتِ الحَدِيقَةِ الجِلْدِيَّةِ الثَّقِيلَةِ أَصَابِعَكَ مِنَ الأَشْوَاكِ وَالجُرُوحِ.",
      },
      {
        context: "Weeding",
        en: "She pulled tough weeds from the damp soil with rubber-coated garden gloves.",
        ar: "اقْتَلَعَتِ الأَعْشَابَ الضَّارَّةَ مِنَ التُّرْبَةِ الرَّطْبَةِ بِقُفَّازَاتِ حَدِيقَةٍ مَطَّاطِيَّةٍ.",
      },
      {
        context: "Grip",
        en: "The textured palms of the garden gloves provide an excellent non-slip grip on tools.",
        ar: "تُوَفِّرُ رَاحَةُ قُفَّازَاتِ الحَدِيقَةِ المَحْكُومَةُ قَبْضَةً مَانِعَةً لِلاِنْزِلاقِ عَلَى الأَدَوَاتِ.",
      },
    ],
    exampleSentence: "He left his muddy garden gloves drying on the wooden potting bench.",
    exampleArabic:
      "تَرَكَ قُفَّازَاتِ الحَدِيقَةِ المُلَطَّخَةَ بِالطِّينِ تَجِفُّ عَلَى طَاوِلَةِ الزِّرَاعَةِ الخَشَبِيَّةِ.",
  },
  pruner: {
    id: "pruner",
    arabic: "مِقَصُّ التَّقْلِيم (مِقَصُّ الشُّجَيْرَات)",
    partOfSpeech: "noun",
    phonetic: "ˈpruːnər",
    pronunciationTip: "Two syllables with long /uː/: 'PROON-er' (/ˈpruː.nər/).",
    collocations: [
      "hand pruner",
      "sharp pruner",
      "bypass pruner",
      "pruner blades",
      "use a pruner",
      "oil the pruner",
    ],
    phrasalVerbs: [
      {
        phrase: "cut back",
        meaning: "trim branches to encourage fresh growth",
        arabic: "يُقَلِّمُ الأَغْصَان",
        example: "Use a sharp pruner to cut back overgrown branches in late winter.",
      },
    ],
    sentences: [
      {
        context: "Rose Pruning",
        en: "He used a sharp handheld pruner to snip spent blossoms from the rose bush.",
        ar: "اسْتَخْدَمَ مِقَصَّ تَقْلِيمٍ يَدَوِيّاً حَادّاً لِقَصِّ الأَزْهَارِ الذَّابِلَةِ مِنْ شُجَيْرَةِ الوَرْدِ.",
      },
      {
        context: "Tool Maintenance",
        en: "Keep the blades of your garden pruner clean and sharp to ensure clean plant cuts.",
        ar: "حَافِظْ عَلَى شَفَرَاتِ مِقَصِّ التَّقْلِيمِ نَظِيفَةً وَحَادَّةً لِضَمَانِ قَطْعٍ نَظِيفٍ لِلنَّبَاتَاتِ.",
      },
      {
        context: "Shrub Shaping",
        en: "With a quick squeeze of the spring-loaded pruner, she shaped the shrub cleanly.",
        ar: "بِضَغْطَةٍ سَرِيعَةٍ عَلَى مِقَصِّ التَّقْلِيمِ المُرِنِّ، شَكَّلَتِ الشُّجَيْرَةَ بِإِتْقَانٍ.",
      },
    ],
    exampleSentence: "The spring in the pruner allowed smooth cutting through thick stems.",
    exampleArabic:
      "سَمَحَ زُنْبُرُكُ مِقَصِّ التَّقْلِيمِ بِالقَصِّ السَّلِسِ عَبْرَ السِّيقَانِ السَّمِيكَةِ.",
  },
  trowel: {
    id: "trowel",
    arabic: "مِجْرَفَةٌ يَدَوِيَّة (مِجْرَفَةُ الشَّتْل)",
    partOfSpeech: "noun",
    phonetic: "ˈtraʊəl",
    pronunciationTip: "Diphthong /aʊ/ as in 'cow' or 'now': 'TROW-ul'.",
    collocations: [
      "garden trowel",
      "hand trowel",
      "metal trowel",
      "dig with a trowel",
      "pointed trowel",
      "planting trowel",
    ],
    phrasalVerbs: [
      {
        phrase: "dig up",
        meaning: "excavate plants or bulbs carefully",
        arabic: "يَحْفِرُ لاسْتِخْرَاج",
        example: "She used a hand trowel to dig up the overwintered bulbs.",
      },
    ],
    sentences: [
      {
        context: "Potting & Transplanting",
        en: "He used a small stainless-steel trowel to scoop potting compost into containers.",
        ar: "اسْتَخْدَمَ مِجْرَفَةً يَدَوِيَّةً صَغِيرَةً لِغَرْفِ السَّمَادِ دَاخِلَ الأَصَائِصِ.",
      },
      {
        context: "Seedling Planting",
        en: "Dig small individual planting holes with the trowel for each tomato seedling.",
        ar: "احْفِرْ حُفَراً صَغِيرَةً بِالمِجْرَفَةِ اليَدَوِيَّةِ لِكُلِّ شَتْلَةِ طَمَاطِمَ.",
      },
      {
        context: "Tool Quality",
        en: "The ergonomically designed trowel made planting fifty bulbs effortless.",
        ar: "جَعَلَتِ المِجْرَفَةُ اليَدَوِيَّةُ ذَاتُ التَّصْمِيمِ المُرِيحِ غَرْسَ خَمْسِينَ بَصَلَةً أَمْراً سَهْلاً.",
      },
    ],
    exampleSentence: "She scooped up rich soil with her garden trowel.",
    exampleArabic: "غَرَفَتْ تُرْبَةً خِصْبَةً بِمِجْرَفَتِهَا اليَدَوِيَّةِ لِلْحَدِيقَةِ.",
  },
  "lawn-mower": {
    id: "lawn-mower",
    arabic: "جَزَّازَةُ العُشْب",
    partOfSpeech: "noun",
    phonetic: "ˈlɔːn ˌmoʊər",
    pronunciationTip: "Compound word: 'LAWN mow-er' (/ˈlɔːn ˌmoʊ.ər/).",
    collocations: [
      "electric lawn mower",
      "petrol lawn mower",
      "push the lawn mower",
      "start the lawn mower",
      "lawn mower blades",
      "ride-on lawn mower",
    ],
    phrasalVerbs: [
      {
        phrase: "mow down",
        meaning: "cut grass flat to uniform height",
        arabic: "يَجُزُّ العُشْب",
        example: "He started up the machine to mow down the overgrown weekend grass.",
      },
    ],
    sentences: [
      {
        context: "Lawn Care",
        en: "The buzzing lawn mower trimmed the overgrown green grass to a neat two inches.",
        ar: "قَصَّتْ جَزَّازَةُ العُشْبِ الطَّنَّانَةُ العُشْبَ الأَخْضَرَ الكَثِيفَ إِلَى طُولٍ أَنِيقٍ.",
      },
      {
        context: "Weekend Chore",
        en: "Saturday morning neighborhood sounds were filled with humming electric lawn mowers.",
        ar: "امْتَلَأَتْ أَصْوَاتُ صَبَاحِ السَّبْتِ فِي الحَيِّ بِطَنِينِ جَزَّازَاتِ العُشْبِ الكَهْرَبَائِيَّةِ.",
      },
      {
        context: "Safety Check",
        en: "Always clear stones and sticks from the yard before starting the powerful lawn mower.",
        ar: "أَبْعِدْ دَائِماً الحِجَارَةَ وَالعِصِيَّ عَنِ الفِنَاءِ قَبْلَ تَشْغِيلِ جَزَّازَةِ العُشْبِ.",
      },
    ],
    exampleSentence: "He pushed the rotary lawn mower in straight lines across the backyard.",
    exampleArabic:
      "دَفَعَ جَزَّازَةَ العُشْبِ الدَّوَّارَةَ فِي خُطُوطٍ مُسْتَقِيمَةٍ عَبْرَ الفِنَاءِ الخَلْفِيِّ.",
  },
  spade: {
    id: "spade",
    arabic: "مِجْرَفَة (مِجْرَفَةُ الحَفْرِ المُسَطَّحَة)",
    partOfSpeech: "noun",
    phonetic: "speɪd",
    pronunciationTip: "Long 'a' diphthong /eɪ/ as in 'made' or 'trade'.",
    collocations: [
      "garden spade",
      "sharp spade",
      "dig with a spade",
      "edge of a spade",
      "flat spade",
      "heavy spade",
    ],
    phrasalVerbs: [
      {
        phrase: "dig into",
        meaning: "press down into earth with effort",
        arabic: "يَغْرِسُ فِي التُّرْبَة",
        example: "He stepped on the spade to dig deep into the heavy clay soil.",
      },
    ],
    sentences: [
      {
        context: "Bed Edging",
        en: "She used the flat rectangular blade of the spade to slice crisp borders along the turf.",
        ar: "اسْتَخْدَمَتِ الشَّفْرَةَ المُسْتَطِيلَةَ لِلْمِجْرَفَةِ لِقَصِّ حَوَافَّ أَنِيقَةٍ لِلْعُشْبِ.",
      },
      {
        context: "Soil Turning",
        en: "Turn the hardened garden soil over with a sturdy steel spade before adding compost.",
        ar: "اقْلِبْ تُرْبَةَ الحَدِيقَةِ الصَّلْبَةَ بِمِجْرَفَةٍ فُولاَذِيَّةٍ مَتِينَةٍ قَبْلَ إِضَافَةِ السَّمَادِ.",
      },
      {
        context: "Tree Planting",
        en: "Dig a wide square hole with the spade when planting a new fruit tree.",
        ar: "احْفِرْ حُفْرَةً مُرَبَّعَةً وَاسِعَةً بِالمِجْرَفَةِ عِنْدَ زِرَاعَةِ شَجَرَةِ فَاكِهَةٍ جَدِيدَةٍ.",
      },
    ],
    exampleSentence: "He drove the sharp metal spade into the rich dark loam.",
    exampleArabic:
      "غَرَسَ المِجْرَفَةَ المَعْدِنِيَّةَ الحَادَّةَ فِي التُّرْبَةِ الطِّمْيِيَّةِ الخِصْبَةِ الدَّاكِنَةِ.",
  },
  sprinkler: {
    id: "sprinkler",
    arabic: "مِرَشَّةُ مِيَاه (رَشَّاشُ الحَدِيقَة)",
    partOfSpeech: "noun",
    phonetic: "ˈsprɪŋklər",
    pronunciationTip: "Two/three syllables: 'SPRING-kler' (/ˈsprɪŋ.klər/).",
    collocations: [
      "lawn sprinkler",
      "oscillating sprinkler",
      "turn on the sprinkler",
      "sprinkler system",
      "rotating sprinkler",
      "automatic sprinkler",
    ],
    phrasalVerbs: [
      {
        phrase: "spray over",
        meaning: "distribute water droplets across an area",
        arabic: "يَرُشُّ فَوْقَ",
        example: "The rotating sprinkler sprays water evenly over the entire front lawn.",
      },
    ],
    sentences: [
      {
        context: "Lawn Irrigation",
        en: "An oscillating lawn sprinkler swung back and forth, spraying cool droplets on the grass.",
        ar: "تَمَايَلَتْ مِرَشَّةُ العُشْبِ التَّرَدُّدِيَّةُ ذَهَاباً وَإِيَاباً رَاشَّةً قَطَرَاتِ مَاءٍ بَارِدَةٍ.",
      },
      {
        context: "Summer Fun",
        en: "Laughing children ran back and forth through the cool arcs of the garden sprinkler.",
        ar: "رَكَضَ الأَطْفَالُ الضَّاحِكُونَ عَبْرَ أَقْوَاسِ المَاءِ البَارِدَةِ لِمِرَشَّةِ الحَدِيقَةِ.",
      },
      {
        context: "Conservation",
        en: "Set the automatic sprinkler timer to run at dawn to minimize water evaporation.",
        ar: "اضْبِطْ مُؤَقِّتَ مِرَشَّةِ المِيَاهِ لِيَعْمَلَ عِنْدَ الفَجْرِ لِتَقْلِيلِ تَبَخُّرِ المَاءِ.",
      },
    ],
    exampleSentence: "The rotating sprinkler cast a faint rainbow in the morning sunshine.",
    exampleArabic:
      "رَسَمَتْ مِرَشَّةُ المِيَاهِ الدَّوَّارَةُ قَوْسَ قُزَحٍ بَاهِتاً فِي شَمْسِ الصَّبَاحِ.",
  },
  root: {
    id: "root",
    arabic: "جَذْر (جُذُور)",
    partOfSpeech: "noun",
    phonetic: "ruːt",
    pronunciationTip: "Long 'oo' sound /ruːt/ (rhymes with 'boot' or 'fruit').",
    collocations: [
      "deep root",
      "plant roots",
      "root system",
      "take root",
      "tree root",
      "healthy roots",
    ],
    phrasalVerbs: [
      {
        phrase: "take root",
        meaning: "establish firmly in the ground",
        arabic: "يَتَجَذَّرُ فِي التُّرْبَة",
        example: "The transplanted cuttings took root quickly in the moist soil.",
      },
    ],
    sentences: [
      {
        context: "Plant Anatomy",
        en: "Strong underground roots anchor the tall tree and absorb water and vital minerals.",
        ar: "تُثَبِّتُ الجُذُورُ القَوِيَّةُ تَحْتَ الأَرْضِ الشَّجَرَةَ العَالِيَةَ وَتَمْتَصُّ المَاءَ وَالمَعَادِنَ.",
      },
      {
        context: "Transplanting",
        en: "Gently loosen the compacted root ball before placing the shrub in its new hole.",
        ar: "فَكِّكْ كُرَةَ الجُذُورِ المُنْضَغِطَةَ بِلُطْفٍ قَبْلَ وَضْعِ الشُّجَيْرَةِ فِي حُفْرَتِهَا.",
      },
      {
        context: "Root Vegetables",
        en: "Carrots and radishes are nutritious edible roots that develop completely underground.",
        ar: "الجَزَرُ وَالفُجْلُ جُذُورٌ غِذَائِيَّةٌ صَالِحَةٌ لِلأَكْلِ تَنْمُو تَحْتَ الأَرْضِ.",
      },
    ],
    exampleSentence: "The thick oak root spread several meters beneath the footpath.",
    exampleArabic:
      "امْتَدَّ جَذْرُ البَلُّوطِ السَّمِيكُ عِدَّةَ أَمْتَارٍ تَحْتَ مَمَرِّ المُشَاةِ.",
  },
  stem: {
    id: "stem",
    arabic: "سَاق (سَاقُ النَّبَات)",
    partOfSpeech: "noun",
    phonetic: "stɛm",
    pronunciationTip: "Short 'e' /ɛ/ as in 'bed' or 'red'.",
    collocations: [
      "flower stem",
      "sturdy stem",
      "green stem",
      "cut the stem",
      "woody stem",
      "hollow stem",
    ],
    phrasalVerbs: [
      {
        phrase: "stem from",
        meaning: "(figurative) originate or arise from",
        arabic: "يَنْبُعُ مِنْ",
        example:
          "Her passion for botanicals stems from childhood visits to her grandmother's garden.",
      },
    ],
    sentences: [
      {
        context: "Plant Physiology",
        en: "The upright green stem transports moisture and nutrients from roots to leaves.",
        ar: "يَنْقُلُ السَّاقُ الأَخْضَرُ القَائِمُ الرُّطُوبَةَ وَالمَوَادَّ الغِذَائِيَّةَ مِنَ الجُذُورِ إِلَى الأَوْرَاقِ.",
      },
      {
        context: "Vase Preparation",
        en: "Trim flower stems diagonally under cool running water before arranging them.",
        ar: "قُصَّ سِيقَانَ الزُّهُورِ مَائِلاً تَحْتَ مَاءٍ جَارٍ بَارِدٍ قَبْلَ تَنْسِيقِهَا.",
      },
      {
        context: "Structural Support",
        en: "A bamboo cane was tied alongside the fragile tomato stem to prevent snapping.",
        ar: "رُبِطَتْ عَصَا خَيْزُرَانٍ بِجَانِبِ سَاقِ الطَّمَاطِمِ الرَّقِيقِ لِمَنْعِ انْكِسَارِهِ.",
      },
    ],
    exampleSentence: "The sunflower possessed a thick hairy stem that supported its giant blossom.",
    exampleArabic:
      "تَمَيَّزَتْ زَهْرَةُ عَبَّادِ الشَّمْسِ بِسَاقٍ سَمِيكَةٍ مُشَعِّرَةٍ دَعَمَتْ زَهْرَتَهَا العِمْلاقَةَ.",
  },
  leaf: {
    id: "leaf",
    arabic: "وَرَقَةُ شَجَر (وَرَقَةُ نَبَات)",
    partOfSpeech: "noun",
    phonetic: "liːf",
    pronunciationTip: "Long 'ee' sound /liːf/. Plural is 'leaves' (/liːvz/).",
    collocations: [
      "green leaf",
      "fallen leaf",
      "leaf vein",
      "broad leaf",
      "turn over a new leaf",
      "dry leaves",
    ],
    phrasalVerbs: [
      {
        phrase: "leaf through",
        meaning: "flip through pages quickly",
        arabic: "يَتَصَفَّحُ",
        example: "She leafed through the colorful gardening catalog looking for bulb ideas.",
      },
    ],
    sentences: [
      {
        context: "Photosynthesis",
        en: "Each broad green leaf captures radiant sunlight to convert into energy for the plant.",
        ar: "تَلْتَقِطُ كُلُّ وَرَقَةِ شَجَرٍ خَضْرَاءَ ضَوْءَ الشَّمْسِ لِتَحْوِيلِهِ إِلَى طَاقَةٍ لِلنَّبَاتِ.",
      },
      {
        context: "Autumn Colors",
        en: "Golden and scarlet leaves drifted slowly down from the maple trees in October.",
        ar: "تَسَاقَطَتْ أَوْرَاقُ الشَّجَرِ الذَّهَبِيَّةُ وَالقِرْمِزِيَّةُ بِبُطْءٍ مِنْ أَشْجَارِ القَيْقَبِ.",
      },
      {
        context: "Garden Care",
        en: "Rake fallen brown leaves into composting piles to enrich next year's garden beds.",
        ar: "اِجْمَعْ أَوْرَاقَ الشَّجَرِ البُنِّيَّةَ السَّاقِطَةَ فِي أَكْوَامِ التَّسْمِيدِ لِتَغْذِيَةِ الأَحْوَاضِ.",
      },
    ],
    exampleSentence: "A tiny dewdrop rested on the surface of the shiny green leaf.",
    exampleArabic:
      "اسْتَقَرَّتْ قَطْرَةُ نَدًى صَغِيرَةٌ عَلَى سَطْحِ وَرَقَةِ الشَّجَرِ الخَضْرَاءِ اللَّامِعَةِ.",
  },
  petal: {
    id: "petal",
    arabic: "بَتَلَة (تُوَيْجِيَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈpɛtəl",
    pronunciationTip: "Two syllables: 'PET-ul' (/ˈpɛt.əl/).",
    collocations: [
      "flower petal",
      "rose petal",
      "soft petal",
      "velvety petal",
      "fallen petals",
      "scatter petals",
    ],
    phrasalVerbs: [
      {
        phrase: "drop off",
        meaning: "fall naturally from the flower head",
        arabic: "يَتَسَاقَطُ",
        example: "Fragrant rose petals drop off as the bloom completes its cycle.",
      },
    ],
    sentences: [
      {
        context: "Floral Aesthetics",
        en: "The velvety rose petal felt exceptionally soft between her fingertips.",
        ar: "كَانَتْ بَتَلَةُ الوَرْدِ المَخْمَلِيَّةُ نَاعِمَةً لِلْغَايَةِ بَيْنَ أَطْرَافِ أَصَابِعِهَا.",
      },
      {
        context: "Wedding Decoration",
        en: "Bridesmaids scattered fragrant white petals along the church aisle.",
        ar: "نَثَرَتْ وَصِيفَاتُ العَرُوسِ بَتَلاتٍ بَيْضَاءَ عَطِرَةً عَلَى طُولِ مَمَرِّ الكَنِيسَةِ.",
      },
      {
        context: "Pollinator Attraction",
        en: "Brightly colored flower petals attract bees and butterflies to the central nectar.",
        ar: "تَجْذِبُ بَتَلاتُ الزَّهْرَةِ الزَّاهِيَةُ النَّحْلَ وَالفَرَاشَاتِ إِلَى الرَّحِيقِ فِي المَرْكَزِ.",
      },
    ],
    exampleSentence: "A single crimson petal floated gently across the surface of the birdbath.",
    exampleArabic:
      "طَفَتْ بَتَلَةٌ قِرْمِزِيَّةٌ وَاحِدَةٌ بِلُطْفٍ فَوْقَ سَطْحِ مَغْسَلِ الطُّيُورِ.",
  },
  branch: {
    id: "branch",
    arabic: "غُصْن (فَرْعُ شَجَرَة)",
    partOfSpeech: "noun",
    phonetic: "bræntʃ",
    pronunciationTip: "Short 'a' /æ/ followed by 'nch' /ntʃ/.",
    collocations: [
      "tree branch",
      "thick branch",
      "broken branch",
      "leafy branch",
      "bare branch",
      "heavy branch",
    ],
    phrasalVerbs: [
      {
        phrase: "branch off",
        meaning: "diverge or split from a main trunk",
        arabic: "يَتَفَرَّعُ عَنْ",
        example: "Smaller boughs branch off from the massive oak trunk.",
      },
    ],
    sentences: [
      {
        context: "Tree Structure",
        en: "A sturdy oak branch extended across the garden lawn, supporting a wooden rope swing.",
        ar: "امْتَدَّ غُصْنُ بَلُّوطٍ مَتِينٌ عَبْرَ عُشْبِ الحَدِيقَةِ مُعَلَّقاً فِيهِ أُرْجُوحَةُ حَبْلٍ خَشَبِيَّةٌ.",
      },
      {
        context: "Storm Damage",
        en: "Fierce gale-force winds snapped a heavy dead branch from the old pine tree.",
        ar: "كَسَرَتِ الرِّيَاحُ العَاتِيَةُ غُصْناً مَيِّتاً ثَقِيلاً مِنْ شَجَرَةِ الصَّنَوْبَرِ القَدِيمَةِ.",
      },
      {
        context: "Bird Perch",
        en: "A colorful robin perched on a leafy apple branch and began singing its morning melody.",
        ar: "حَطَّ طَائِرُ أَبُو الحِنَّاءِ عَلَى غُصْنِ تُفَّاحٍ مُوَرَّقٍ وَبَدَأَ يُغَنِّي أَلْحَانَ الصَّبَاحِ.",
      },
    ],
    exampleSentence: "Green leaves sprouted all along the slender cherry branch.",
    exampleArabic: "نَبَتَتْ أَوْرَاقٌ خَضْرَاءُ عَلَى طُولِ غُصْنِ الكَرَزِ الرَّشِيقِ.",
  },
  bark: {
    id: "bark",
    arabic: "لِحَاء (قِشْرَةُ الشَّجَرَة)",
    partOfSpeech: "noun",
    phonetic: "bɑːrk",
    pronunciationTip: "Open 'ah' sound /ɑː/ ending in 'rk'.",
    collocations: [
      "tree bark",
      "rough bark",
      "birch bark",
      "cork bark",
      "peeling bark",
      "smooth bark",
    ],
    phrasalVerbs: [
      {
        phrase: "peel off",
        meaning: "separate naturally from a trunk",
        arabic: "يَتَقَشَّرُ عَنْ",
        example: "Papery white bark peels off the silver birch tree each season.",
      },
    ],
    sentences: [
      {
        context: "Tree Anatomy",
        en: "Rugged outer tree bark shields the delicate inner wood from frost, insects, and disease.",
        ar: "يَحْمِي لِحَاءُ الشَّجَرِ الخَارِجِيُّ الخَشِنُ الخَشَبَ الدَّاخِلِيَّ الرَّقِيقَ مِنَ الصَّقِيعِ وَالحَشَرَاتِ.",
      },
      {
        context: "Texture & Feel",
        en: "The ancient pine tree had deeply furrowed, aromatic bark covered with patches of lichen.",
        ar: "تَمَيَّزَتْ شَجَرَةُ الصَّنَوْبَرِ العَتِيقَةُ بِلِحَاءٍ عَطِرٍ ذِي تَجَاعِيدَ عَمِيقَةٍ.",
      },
      {
        context: "Mulch Material",
        en: "Spreading shredded pine bark mulch across the flower bed retains valuable soil moisture.",
        ar: "يُحَافِظُ نَثْرُ لِحَاءِ الصَّنَوْبَرِ المَفْرُومِ عَلَى رُطُوبَةِ التُّرْبَةِ فِي حَوْضِ الزُّهُورِ.",
      },
    ],
    exampleSentence: "A curious beetle crawled upward along the grooved tree bark.",
    exampleArabic:
      "زَحَفَتْ خُنْفُسَاءُ فُضُولِيَّةٌ إِلَى الأَعْلَى عَلَى طُولِ لِحَاءِ الشَّجَرَةِ المُخَدَّدِ.",
  },
  bud: {
    id: "bud",
    arabic: "بُرْعُم (بُرْعُمُ زَهْرَة)",
    partOfSpeech: "noun",
    phonetic: "bʌd",
    pronunciationTip: "Short 'u' /ʌ/ as in 'cup' or 'mud'.",
    collocations: ["flower bud", "rose bud", "open bud", "in bud", "tight bud", "spring buds"],
    phrasalVerbs: [
      {
        phrase: "nip in the bud",
        meaning: "(idiom) stop something before it develops",
        arabic: "يَقْضِي عَلَى الشَّيْءِ فِي مَهْدِهِ",
        example: "We sprayed organic repellent to nip garden pests in the bud.",
      },
    ],
    sentences: [
      {
        context: "Spring Awakening",
        en: "Tightly closed rose buds began swelling and showing flashes of pink petal color.",
        ar: "بَدَأَتْ بَرَاعِمُ الوَرْدِ المُغْلَقَةُ تَنْتَفِخُ وَتُظْهِرُ لَمَحَاتٍ مِنْ لَوْنِ البَتَلاتِ الوَرْدِيِّ.",
      },
      {
        context: "Fruit Trees",
        en: "Early frost can damage tender flower buds on apple trees before they open.",
        ar: "يُمْكِنُ لِلصَّقِيعِ المُبَكِّرِ أَنْ يُتْلِفَ بَرَاعِمَ الأَزْهَارِ الرَّقِيقَةَ فِي أَشْجَارِ التُّفَّاحِ.",
      },
      {
        context: "Plant Vitality",
        en: "Healthy green buds appeared all along the pruned lilac branches in March.",
        ar: "ظَهَرَتْ بَرَاعِمُ خَضْرَاءُ نَضِرَةٌ عَلَى طُولِ أَغْصَانِ اللَّيْلاكِ فِي مَارِسَ.",
      },
    ],
    exampleSentence: "The delicate green bud opened into a splendid fragrant flower.",
    exampleArabic:
      "تَفَتَّحَ البُرْعُمُ الأَخْضَرُ الرَّقِيقُ لِيُصْبِحَ زَهْرَةً عَطِرَةً رَائِعَةً.",
  },
  seed: {
    id: "seed",
    arabic: "بَذْرَة (بُذُور)",
    partOfSpeech: "noun",
    phonetic: "siːd",
    pronunciationTip: "Long 'ee' sound /siːd/ as in 'feed' or 'need'.",
    collocations: [
      "plant a seed",
      "sow seeds",
      "flower seed",
      "bird seed",
      "sunflower seed",
      "seed packet",
    ],
    phrasalVerbs: [
      {
        phrase: "grow from seed",
        meaning: "cultivate plants starting from seeds",
        arabic: "يَزْرَعُ مِنَ البُذُور",
        example: "She successfully grew prize-winning heirloom tomatoes from seed.",
      },
    ],
    sentences: [
      {
        context: "Germination",
        en: "Plant the tiny vegetable seed half an inch deep in moist compost.",
        ar: "ازْرَعِ البَذْرَةَ الصَّغِيرَةَ لِلْخُضَارِ عَلَى عُمْقِ نِصْفِ بُوصَةٍ فِي سَمَادٍ رَطْبٍ.",
      },
      {
        context: "Bird Feeding",
        en: "He scattered mixed sunflower seeds into the wooden feeder for winter birds.",
        ar: "نَثَرَ بُذُورَ عَبَّادِ الشَّمْسِ المَخْلُوطَةَ فِي المِطْعَمِ الخَشَبِيِّ لِطُيُورِ الشِّتَاءِ.",
      },
      {
        context: "Plant Reproduction",
        en: "Dandelion seeds drift through the breeze carried by tiny fluffy parachutes.",
        ar: "تَنْجَرِفُ بُذُورُ الهِنْدَبَاءِ مَعَ النَّسِيمِ مَحْمُولَةً بِمِظَلاتٍ صَغِيرَةٍ رِيشِيَّةٍ.",
      },
    ],
    exampleSentence: "A single pumpkin seed grew into a massive spreading vine.",
    exampleArabic:
      "نَمَتْ بَذْرَةُ يَقْطِينٍ وَاحِدَةٌ لِتُصْبِحَ عَرِيشَةً عِمْلاقَةً مُمْتَدَّةً.",
  },
  thorn: {
    id: "thorn",
    arabic: "شَوْكَة (شَوْكُ النَّبَات)",
    partOfSpeech: "noun",
    phonetic: "θɔːrn",
    pronunciationTip: "Voiceless 'th' /θ/ followed by /ɔːrn/ (rhymes with 'born').",
    collocations: [
      "rose thorn",
      "sharp thorn",
      "prickly thorn",
      "covered in thorns",
      "thorn bush",
      "thorn in the side",
    ],
    phrasalVerbs: [
      {
        phrase: "prick with",
        meaning: "pierce lightly with a sharp point",
        arabic: "يَخِزُ بِـ",
        example: "She pricked her thumb on a sharp rose thorn while cutting flowers.",
      },
    ],
    sentences: [
      {
        context: "Plant Defense",
        en: "Sharp wooden thorns line the stems of wild blackberry bushes to deter herbivores.",
        ar: "تَصْطَفُّ أَشْوَاكٌ خَشَبِيَّةٌ حَادَّةٌ عَلَى سِيقَانِ التُّوتِ البَرِّيِّ لِرَدْعِ الحَيَوَانَاتِ.",
      },
      {
        context: "Gardening Caution",
        en: "Wear sturdy gloves to protect your hands from painful thorns when pruning roses.",
        ar: "ارْتَدِ قُفَّازَاتٍ مَتِينَةً لِحِمَايَةِ يَدَيْكَ مِنَ الأَشْوَاكِ المُؤْلِمَةِ عِنْدَ تَقْلِيمِ الوَرْدِ.",
      },
      {
        context: "Cactus Adaptations",
        en: "Desert cacti feature modified leaves that evolved into sharp protective thorns.",
        ar: "تَتَمَيَّزُ نَبَاتَاتُ الصَّبَّارِ بِأَوْرَاقٍ مُتَحَوِّرَةٍ تَطَوَّرَتْ إِلَى أَشْوَاكٍ حَادَّةٍ لِلْحِمَايَةِ.",
      },
    ],
    exampleSentence: "A sharp thorn caught on her sleeve as she brushed past the bush.",
    exampleArabic:
      "عَلِقَتْ شَوْكَةٌ حَادَّةٌ فِي كُمِّهَا عِنْدَمَا مَرَّتْ مُحَاذِيَةً الشُّجَيْرَةَ.",
  },
  berry: {
    id: "berry",
    arabic: "تُوت (ثَمَرَةُ عُلَّيْق / حَبَّةُ تُوت)",
    partOfSpeech: "noun",
    phonetic: "ˈbɛri",
    pronunciationTip: "Pronounced identically to 'bury': /ˈbɛr.i/.",
    collocations: [
      "red berry",
      "wild berry",
      "ripe berry",
      "sweet berry",
      "berry bush",
      "pick berries",
    ],
    phrasalVerbs: [
      {
        phrase: "pick off",
        meaning: "harvest ripe berries from branches",
        arabic: "يَقْطِفُ حَبَّاتِ التُّوت",
        example: "We happily picked ripe blueberries off the bushes in late July.",
      },
    ],
    sentences: [
      {
        context: "Summer Foraging",
        en: "Sweet ripe red berries grew wild along the sunny woodland trail.",
        ar: "نَمَتْ حَبَّاتُ تُوتٍ حَمْرَاءُ حُلْوَةٌ نَاضِجَةٌ بِشَكْلٍ بَرِّيٍّ عَلَى طُولِ مَسَارِ الغَابَةِ.",
      },
      {
        context: "Wildlife Nutrition",
        en: "Songbirds feasted eagerly on the crimson holly berries throughout the cold winter.",
        ar: "تَغَذَّتِ الطُّيُورُ المُغَرِّدَةُ بِشَغَفٍ عَلَى حَبَّاتِ التُّوتِ طَوَالَ الشِّتَاءِ البَارِدِ.",
      },
      {
        context: "Kitchen Preserves",
        en: "She boiled freshly harvested berries with sugar to make delicious homemade jam.",
        ar: "غَلَتْ حَبَّاتِ التُّوتِ المَقْطُوفَةِ طَازَجَةً مَعَ السُّكَّرِ لِصُنْعِ المُرَبَّى المَنْزِلِيِّ.",
      },
    ],
    exampleSentence: "He popped a plump ripe blackberry into his mouth.",
    exampleArabic: "وَضَعَ حَبَّةَ تُوتٍ أَسْوَدَ مُمْتَلِئَةً وَنَاضِجَةً فِي فَمِهِ.",
  },
  butterfly: {
    id: "butterfly",
    arabic: "فَرَاشَة",
    partOfSpeech: "noun",
    phonetic: "ˈbʌtərflaɪ",
    pronunciationTip: "Three syllables: 'BUT-er-fly' (/ˈbʌt.ər.flaɪ/).",
    collocations: [
      "monarch butterfly",
      "colorful butterfly",
      "butterfly wings",
      "caterpillar to butterfly",
      "butterfly garden",
      "fluttering butterfly",
    ],
    phrasalVerbs: [
      {
        phrase: "flutter by",
        meaning: "fly past lightly and gracefully",
        arabic: "يُرَفْرِفُ بِجَانِب",
        example: "A yellow swallowtail butterfly fluttered by the lavender bushes.",
      },
    ],
    sentences: [
      {
        context: "Pollination",
        en: "A magnificent monarch butterfly with orange and black wings rested on a zinnia.",
        ar: "حَطَّتْ فَرَاشَةٌ مَلَكِيَّةٌ رَائِعَةٌ ذَاتُ أَجْنِحَةٍ بُرْتُقَالِيَّةٍ وَسَوْدَاءَ عَلَى زَهْرَةٍ.",
      },
      {
        context: "Metamorphosis",
        en: "After weeks in its chrysalis, a beautiful winged butterfly emerged into the sunshine.",
        ar: "بَعْدَ أَسَابِيعَ فِي شَرْنَقَتِهَا، خَرَجَتْ فَرَاشَةٌ جَمِيلَةٌ مُجَنَّحَةٌ إِلَى ضَوْءِ الشَّمْسِ.",
      },
      {
        context: "Garden Habitat",
        en: "Planting nectar-rich wildflowers created a welcoming sanctuary for local butterflies.",
        ar: "أَدَّتْ زِرَاعَةُ الزُّهُورِ البَرِّيَّةِ الغَنِيَّةِ بِالرَّحِيقِ إِلَى إِنْشَاءِ مَلْجَأٍ لِلْفَرَاشَاتِ.",
      },
    ],
    exampleSentence: "The gentle butterfly fluttered gracefully between purple blossom clusters.",
    exampleArabic:
      "رَفْرَفَتِ الفَرَاشَةُ الرَّقِيقَةُ بِرَشَاقَةٍ بَيْنَ عَنَاقِيدِ الزُّهُورِ الأُرْجُوَانِيَّةِ.",
  },
  ladybug: {
    id: "ladybug",
    arabic: "دُعْسُوقَة (خُنْفُسَاءُ مَرْيَم)",
    partOfSpeech: "noun",
    phonetic: "ˈleɪdibʌɡ",
    pronunciationTip: "Compound word: 'LAY-dee-bug' (/ˈleɪ.di.bʌɡ/).",
    collocations: [
      "red ladybug",
      "spotted ladybug",
      "ladybug spots",
      "ladybug on a leaf",
      "beneficial ladybug",
      "release ladybugs",
    ],
    phrasalVerbs: [
      {
        phrase: "crawl across",
        meaning: "move slowly over a surface",
        arabic: "يَزْحَفُ عَبْرَ",
        example: "A bright red ladybug crawled across the green rose leaf.",
      },
    ],
    sentences: [
      {
        context: "Natural Pest Control",
        en: "Organic gardeners release beneficial ladybugs to naturally devour destructive aphids.",
        ar: "يُطْلِقُ مُزَارِعُو الحَدَائِقِ العُضْوِيَّةِ الدُّعْسُوقَاتِ لِافْتِرَاسِ حَشَرَاتِ المَنِّ.",
      },
      {
        context: "Observation",
        en: "The child smiled as a tiny red ladybug with seven black spots rested on her palm.",
        ar: "ابْتَسَمَتِ الطِّفْلَةُ عِنْدَمَا حَطَّتْ دُعْسُوقَةٌ حَمْرَاءُ صَغِيرَةٌ عَلَى رَاحَةِ يَدِهَا.",
      },
      {
        context: "Ecosystem Health",
        en: "Seeing abundant ladybugs in your garden indicates a balanced, pesticide-free habitat.",
        ar: "يَدُلُّ رُؤْيَةُ الدُّعْسُوقَاتِ بِكَثْرَةٍ فِي حَدِيقَتِكَ عَلَى بِيئَةٍ صِحِّيَّةٍ مُتَوَازِنَةٍ.",
      },
    ],
    exampleSentence: "A shiny spotted ladybug climbed to the tip of a grass blade.",
    exampleArabic: "تَسَلَّقَتْ دُعْسُوقَةٌ لَامِعَةٌ مُنَقَّطَةٌ إِلَى طَرَفِ نَصْلِ العُشْبِ.",
  },
  bee: {
    id: "bee",
    arabic: "نَحْلَة",
    partOfSpeech: "noun",
    phonetic: "biː",
    pronunciationTip: "Long 'ee' sound /biː/ (rhymes with 'see' or 'tree').",
    collocations: ["honey bee", "bumble bee", "busy bee", "bee hive", "bee sting", "queen bee"],
    phrasalVerbs: [
      {
        phrase: "buzz around",
        meaning: "fly quickly from flower to flower with a hum",
        arabic: "يَطُنُّ حَوْلَ",
        example: "Fuzzy bumblebees buzz around the apple blossoms all afternoon.",
      },
    ],
    sentences: [
      {
        context: "Pollination Vitality",
        en: "The industrious honey bee collects yellow pollen and sweet nectar to feed the colony.",
        ar: "تَجْمَعُ نَحْلَةُ العَسَلِ المُجْتَهِدَةُ حُبُوبَ اللِّقَاحِ الصَّفْرَاءَ وَالرَّحِيقَ لِتَغْذِيَةِ الخَلِيَّةِ.",
      },
      {
        context: "Honey Production",
        en: "Beekeepers harvest golden honey produced by thousands of dedicated worker bees.",
        ar: "يَجْنِي النَّحَّالُونَ العَسَلَ الذَّهَبِيَّ الَّذِي يُنْتِجُهُ آلافُ النَّحْلاتِ العَامِلاتِ.",
      },
      {
        context: "Biodiversity",
        en: "Without the vital pollinating work of the bee, many fruit crops would fail to grow.",
        ar: "بِدُونِ عَمَلِ التَّلْقِيحِ الحَيَوِيِّ لِلنَّحْلَةِ، لَنْ تَتَمَكَّنَ مَحَاصِيلُ الفَاكِهَةِ مِنَ النُّمُوِّ.",
      },
    ],
    exampleSentence: "A fuzzy bee dusted with yellow pollen flew into the blooming flower.",
    exampleArabic:
      "طَارَتْ نَحْلَةٌ زَغَبِيَّةٌ مُغَبَّرَةٌ بِحُبُوبِ اللِّقَاحِ الصَّفْرَاءِ إِلَى دَاخِلِ الزَّهْرَةِ.",
  },
  worm: {
    id: "worm",
    arabic: "دُودَة (دُودَةُ الأَرْض)",
    partOfSpeech: "noun",
    phonetic: "wɜːrm",
    pronunciationTip: "Vowel sound /ɜː/ as in 'bird' or 'word': /wɜːrm/.",
    collocations: [
      "earthworm",
      "garden worm",
      "compost worm",
      "worm castings",
      "wriggling worm",
      "feed on worms",
    ],
    phrasalVerbs: [
      {
        phrase: "burrow into",
        meaning: "tunnel into soil",
        arabic: "يَحْفِرُ نَفَقاً فِي التُّرْبَة",
        example: "The earthworm burrowed deep into the moist soil after the rain.",
      },
    ],
    sentences: [
      {
        context: "Soil Aeration",
        en: "A humble earthworm tunnels through dense earth, aerating the soil and improving drainage.",
        ar: "تَحْفِرُ دُودَةُ الأَرْضِ أَنْفَاقاً فِي التُّرْبَةِ لِتَهْوِيَتِهَا وَتَحْسِينِ تَصْرِيفِ المِيَاهِ.",
      },
      {
        context: "Composting",
        en: "Red wiggler worms break down kitchen vegetable scraps into rich organic compost.",
        ar: "تُحَلِّلُ دِيدَانُ التَّسْمِيدِ بَقَايَا الخُضَارِ المَنْزِلِيَّةِ إِلَى سَمَادٍ عُضْوِيٍّ غَنِيٍّ.",
      },
      {
        context: "Rainy Weather",
        en: "After the heavy spring downpour, pink worms crawled onto the wet garden path.",
        ar: "بَعْدَ هُطُولِ الأَمْطَارِ الرَّبِيعِيَّةِ الغَزِيرَةِ، زَحَفَتِ الدِّيدَانُ عَلَى المَمَرِّ الرَّطْبِ.",
      },
    ],
    exampleSentence: "The robin tilted its head and pulled a long worm from the soft lawn.",
    exampleArabic:
      "أَمَالَ طَائِرُ الحِنَّاءِ رَأْسَهُ وَسَحَبَ دُودَةً طَوِيلَةً مِنَ العُشْبِ الرَّطْبِ.",
  },
  snail: {
    id: "snail",
    arabic: "حَلَزُون (بَزَّاق)",
    partOfSpeech: "noun",
    phonetic: "sneɪl",
    pronunciationTip: "Long 'a' diphthong /eɪ/ as in 'tail' or 'rail'.",
    collocations: [
      "garden snail",
      "snail shell",
      "snail trail",
      "slow as a snail",
      "snail pace",
      "spiral snail",
    ],
    phrasalVerbs: [
      {
        phrase: "creep along",
        meaning: "move forward very slowly",
        arabic: "يَزْحَفُ بِبُطْء",
        example: "The garden snail creeps along the damp garden wall.",
      },
    ],
    sentences: [
      {
        context: "Slow Movement",
        en: "A garden snail moved at a leisurely pace, leaving a glistening silvery trail behind.",
        ar: "تَحَرَّكَ حَلَزُونُ الحَدِيقَةِ بِبُطْءٍ تَارِكاً خَلْفَهُ أَثَراً فِضِّيّاً لَامِعاً.",
      },
      {
        context: "Protective Shell",
        en: "When touched gently, the cautious snail retreated completely inside its spiral shell.",
        ar: "عِنْدَ لَمْسِهِ بِلُطْفٍ، تَرَاجَعَ الحَلَزُونُ الحَذِرُ تَمَاماً دَاخِلَ قَوْقَعَتِهِ اللَّوْلَبِيَّةِ.",
      },
      {
        context: "Garden Foraging",
        en: "Snails venture out on damp humid evenings to feed on succulent hosta leaves.",
        ar: "تَخْرُجُ الحَلَازِينُ فِي الأَمْسِيَاتِ الرَّطْبَةِ لِلتَّغَذِّي عَلَى أَوْرَاقِ النَّبَاتَاتِ الغَضَّةِ.",
      },
    ],
    exampleSentence: "A small brown snail climbed slowly up the wet fence post.",
    exampleArabic: "تَسَلَّقَ حَلَزُونٌ بُنِّيٌّ صَغِيرٌ بِبُطْءٍ عَمُودَ السِّيَاجِ الرَّطْبَ.",
  },
  ant: {
    id: "ant",
    arabic: "نَمْلَة",
    partOfSpeech: "noun",
    phonetic: "ænt",
    pronunciationTip: "Short 'a' /æ/ pronounced identically to 'aunt' in American English.",
    collocations: [
      "ant colony",
      "ant hill",
      "worker ant",
      "trail of ants",
      "ant queen",
      "busy ant",
    ],
    phrasalVerbs: [
      {
        phrase: "march in",
        meaning: "walk in an orderly line",
        arabic: "يَسِيرُ فِي صَفّ",
        example: "Hundreds of black ants march in a tidy line toward the fruit tree.",
      },
    ],
    sentences: [
      {
        context: "Teamwork & Strength",
        en: "A tiny worker ant carried a breadcrumb three times its own body weight.",
        ar: "حَمَلَتْ نَمْلَةٌ عَامِلَةٌ صَغِيرَةٌ فُتَاتَ خُبْزٍ يَفُوقُ وَزْنَ جِسْمِهَا بِثَلاثَةِ أَضْعَافٍ.",
      },
      {
        context: "Colony Living",
        en: "Thousands of industrious ants work together to construct complex underground chambers.",
        ar: "يَعْمَلُ آلافُ النَّمْلِ المُجْتَهِدِ مَعاً لِبِنَاءِ غُرَفٍ مُعَقَّدَةٍ تَحْتَ الأَرْضِ.",
      },
      {
        context: "Garden Activity",
        en: "We watched a trail of black ants marching across the stone patio tiles.",
        ar: "شَاهَدْنَا طَابُوراً مِنَ النَّمْلِ الأَسْوَدِ يَسِيرُ عَبْرَ بَلاطِ الفِنَاءِ الحَجَرِيِّ.",
      },
    ],
    exampleSentence: "A determined ant carried a pine needle back toward the colony hill.",
    exampleArabic:
      "حَمَلَتْ نَمْلَةٌ مُصَمِّمَةٌ إِبْرَةَ صَنَوْبَرٍ فِي طَرِيقِ عَوْدَتِهَا إِلَى تَلِّ المُسْتَعْمَرَةِ.",
  },
  caterpillar: {
    id: "caterpillar",
    arabic: "يَرَقَة (يَرَقَةُ الفَرَاشَة / إِسْرُوع)",
    partOfSpeech: "noun",
    phonetic: "ˈkætərˌpɪlər",
    pronunciationTip: "Four syllables: 'CAT-er-pil-er' (/ˈkæt.ərˌpɪl.ər/).",
    collocations: [
      "green caterpillar",
      "fuzzy caterpillar",
      "caterpillar cocoon",
      "hungry caterpillar",
      "striped caterpillar",
      "inchworm caterpillar",
    ],
    phrasalVerbs: [
      {
        phrase: "turn into",
        meaning: "transform through metamorphosis",
        arabic: "يَتَحَوَّلُ إِلَى",
        example: "The striped caterpillar will turn into a magnificent monarch butterfly.",
      },
    ],
    sentences: [
      {
        context: "Feeding Stage",
        en: "A plump green caterpillar munched greedily on a fresh cabbage leaf.",
        ar: "قَضَمَتْ يَرَقَةٌ خَضْرَاءُ مُمْتَلِئَةٌ بِشَرَاهَةٍ وَرَقَةَ مَلْفُوفٍ طَازَجَةً.",
      },
      {
        context: "Metamorphosis",
        en: "Before transforming, the caterpillar spun a protective silk cocoon around itself.",
        ar: "قَبْلَ التَّحَوُّلِ، غَزَلَتِ اليَرَقَةُ شَرْنَقَةً حَرِيرِيَّةً وَاقِيَةً حَوْلَ نَفْسِهَا.",
      },
      {
        context: "Camouflage",
        en: "The clever caterpillar blended perfectly into the twigs to hide from hungry birds.",
        ar: "انْدَمَجَتِ اليَرَقَةُ الذَّكِيَّةُ تَمَاماً مَعَ الأَغْصَانِ لِلاِخْتِبَاءِ مِنَ الطُّيُورِ الجَائِعَةِ.",
      },
    ],
    exampleSentence: "A brightly striped caterpillar crawled along the stem of the plant.",
    exampleArabic: "زَحَفَتْ يَرَقَةٌ مُخَطَّطَةٌ زَاهِيَةٌ عَلَى طُولِ سَاقِ النَّبَاتِ.",
  },
  spider: {
    id: "spider",
    arabic: "عَنْكَبُوت",
    partOfSpeech: "noun",
    phonetic: "ˈspaɪdər",
    pronunciationTip: "Two syllables with long 'i': 'SPY-der' (/ˈspaɪ.dər/).",
    collocations: [
      "spider web",
      "garden spider",
      "spider silk",
      "eight-legged spider",
      "spinning spider",
      "harmless spider",
    ],
    phrasalVerbs: [
      {
        phrase: "spin a web",
        meaning: "create a silken web structure",
        arabic: "يَنْسِجُ شَبَكَةً",
        example: "A garden spider spins an intricate web between two rose bushes.",
      },
    ],
    sentences: [
      {
        context: "Web Architecture",
        en: "A skilled garden spider spun a geometric circular web that glistened with morning dew.",
        ar: "نَسَجَ عَنْكَبُوتُ الحَدِيقَةِ المَاهِرُ شَبَكَةً دَائِرِيَّةً هَنْدَسِيَّةً تَلْمَعُ بِنَدَى الصَّبَاحِ.",
      },
      {
        context: "Pest Predator",
        en: "Spiders are beneficial garden predators that catch flies and mosquitoes in their webs.",
        ar: "تُعْتَبَرُ العَنَاكِبُ كَائِنَاتٍ مُفِيدَةً تَصْطَادُ الذُّبَابَ وَالبَعُوضَ فِي شِبَاكِهَا.",
      },
      {
        context: "Arachnid Biology",
        en: "The eight-legged spider waited patiently in the center of its silken snare.",
        ar: "انْتَظَرَ العَنْكَبُوتُ ذُو الأَرْجُلِ الثَّمَانِي بِصَبْرٍ فِي وَسَطِ شَبَكَتِهِ الحَرِيرِيَّةِ.",
      },
    ],
    exampleSentence: "The yellow garden spider sat motionless at the center of its web.",
    exampleArabic: "جَلَسَ عَنْكَبُوتُ الحَدِيقَةِ الأَصْفَرُ دُونَ حَرَاكٍ فِي وَسَطِ شَبَكَتِهِ.",
  },
  dragonfly: {
    id: "dragonfly",
    arabic: "يَعْسُوب (دَبُّورُ المَاءِ / رَعَّاش)",
    partOfSpeech: "noun",
    phonetic: "ˈdræɡənflaɪ",
    pronunciationTip: "Compound word: 'DRAG-on-fly' (/ˈdræɡ.ən.flaɪ/).",
    collocations: [
      "iridescent dragonfly",
      "dragonfly wings",
      "blue dragonfly",
      "dragonfly over water",
      "hovering dragonfly",
      "fast dragonfly",
    ],
    phrasalVerbs: [
      {
        phrase: "dart across",
        meaning: "fly quickly in sudden bursts",
        arabic: "يَنْدَفِعُ طَائِراً عَبْرَ",
        example: "The blue dragonfly darts across the calm pond to catch mosquitoes.",
      },
    ],
    sentences: [
      {
        context: "Aerial Mastery",
        en: "An iridescent blue dragonfly hovered effortlessly over the surface of the lily pond.",
        ar: "حَلَّقَ يَعْسُوبٌ أَزْرَقُ قَوْسِيُّ اللَّوْنِ بِسُهُولَةٍ فَوْقَ سَطْحِ بِرْكَةِ الزَّنْبَقِ.",
      },
      {
        context: "Wing Structure",
        en: "The four transparent wings of the dragonfly beat independently with remarkable agility.",
        ar: "تَخْفِقُ الأَجْنِحَةُ الأَرْبَعَةُ الشَّفَّافَةُ لِلْيَعْسُوبِ بِشَكْلٍ مُسْتَقِلٍّ وَبِرَشَاقَةٍ لافِتَةٍ.",
      },
      {
        context: "Predatory Benefit",
        en: "Dragonflies are skilled aerial hunters that consume hundreds of mosquitoes daily.",
        ar: "تُعْتَبَرُ اليَعَاسِيبُ صَيَّادَاتٍ جَوِّيَّةً بَارِعَةً تَلْتَهِمُ مِئَاتِ البَعُوضِ يَوْمِيّاً.",
      },
    ],
    exampleSentence: "A dazzling green dragonfly landed momentarily on a tall reed.",
    exampleArabic: "حَطَّ يَعْسُوبٌ أَخْضَرُ مُبْهِرٌ لِلَحْظَةٍ عَلَى قَصَبَةٍ طَوِيلَةٍ.",
  },
  grasshopper: {
    id: "grasshopper",
    arabic: "جَرَادَة (جُنْدُب)",
    partOfSpeech: "noun",
    phonetic: "ˈɡræsˌhɑːpər",
    pronunciationTip: "Compound: 'GRASS-hop-er' (/ˈɡræsˌhɑː.pər/).",
    collocations: [
      "green grasshopper",
      "jumping grasshopper",
      "chirping grasshopper",
      "meadow grasshopper",
      "hind legs of a grasshopper",
      "giant grasshopper",
    ],
    phrasalVerbs: [
      {
        phrase: "leap into",
        meaning: "jump high through the air",
        arabic: "يَقْفِزُ إِلَى",
        example: "The green grasshopper leaped into the tall summer meadow grass.",
      },
    ],
    sentences: [
      {
        context: "Leaping Ability",
        en: "Using its powerful muscular hind legs, the grasshopper vaulted over a meter high.",
        ar: "بِاسْتِخْدَامِ أَرْجُلِهِ الخَلْفِيَّةِ العَضَلِيَّةِ القَوِيَّةِ، قَفَزَ الجُنْدُبُ لأَكْثَرَ مِنْ مِتْرٍ.",
      },
      {
        context: "Chirping Sounds",
        en: "On warm August evenings, the rhythmic chirping of grasshoppers echoed across the field.",
        ar: "فِي أَمْسِيَاتِ أُغُسْطُسَ الدَّافِئَةِ، تَرَدَّدَ صَدَى صَرِيرِ الجَنَادِبِ عَبْرَ الحَقْلِ.",
      },
      {
        context: "Camouflage",
        en: "Its vivid lime-green coloration helped the grasshopper blend seamlessly into the lawn.",
        ar: "سَاعَدَ لَوْنُهُ الأَخْضَرُ اللَّيْمُونِيُّ الزَّاهِي الجُنْدُبَ عَلَى الانْدِمَاجِ فِي العُشْبِ.",
      },
    ],
    exampleSentence: "A startled grasshopper snapped its wings and jumped across the path.",
    exampleArabic: "فَزِعَ جُنْدُبٌ فَصَفَّقَ بِأَجْنِحَتِهِ وَقَفَزَ عَبْرَ المَمَرِّ.",
  },
  lawn: {
    id: "lawn",
    arabic: "مَرْج (مِسَاحَةُ عُشْبٍ خَضْرَاء)",
    partOfSpeech: "noun",
    phonetic: "lɔːn",
    pronunciationTip: "Open 'aw' vowel /lɔːn/ as in 'dawn' or 'yawn'.",
    collocations: [
      "green lawn",
      "mow the lawn",
      "front lawn",
      "manicured lawn",
      "water the lawn",
      "lawn grass",
    ],
    phrasalVerbs: [
      {
        phrase: "roll out",
        meaning: "lay down rolls of new turf",
        arabic: "يَفْرُشُ عُشْباً جَدِيداً",
        example: "Landscapers rolled out fresh green turf to create an instant lawn.",
      },
    ],
    sentences: [
      {
        context: "Residential Garden",
        en: "The lush manicured green lawn provided a soft play area for the children.",
        ar: "وَفَّرَ المَرْجُ الأَخْضَرُ المُنَسَّقُ بِعِنَايَةٍ مِسَاحَةَ لَعِبٍ نَاعِمَةً لِلأَطْفَالِ.",
      },
      {
        context: "Weekend Maintenance",
        en: "He spent Saturday morning mowing the front lawn and edging the flower beds.",
        ar: "قَضَى صَبَاحَ السَّبْتِ فِي جَزِّ مَرْجِ الفِنَاءِ الأَمَامِيِّ وَتَهْذِيبِ أَحْوَاضِ الزُّهُورِ.",
      },
      {
        context: "Drought Care",
        en: "Watering the lawn deeply once a week encourages roots to grow deep into the soil.",
        ar: "رَيُّ المَرْجِ بِعُمْقٍ مَرَّةً فِي الأُسْبُوعِ يُشَجِّعُ الجُذُورَ عَلَى التَّعَمُّقِ فِي التُّرْبَةِ.",
      },
    ],
    exampleSentence: "Morning dew sparkled like diamonds across the wide green lawn.",
    exampleArabic: "تَلأْلأَ نَدَى الصَّبَاحِ كَالمَاسِ عَبْرَ المَرْجِ الأَخْضَرِ الوَاسِعِ.",
  },
  "flower-bed": {
    id: "flower-bed",
    arabic: "حَوْضُ زُهُور (رَوْضَةُ أَزْهَار)",
    partOfSpeech: "noun",
    phonetic: "ˈflaʊər bɛd",
    pronunciationTip: "Two words: 'FLOW-er bed' (/ˈflaʊ.ər bɛd/).",
    collocations: [
      "plant a flower bed",
      "weed the flower bed",
      "blooming flower bed",
      "raised flower bed",
      "flower bed border",
      "perennial flower bed",
    ],
    phrasalVerbs: [
      {
        phrase: "dig up",
        meaning: "prepare soil by turning it over",
        arabic: "يَحْفِرُ لِلتَّجْهِيز",
        example: "We dug up the old flower bed to add rich compost and new bulbs.",
      },
    ],
    sentences: [
      {
        context: "Ornamental Gardening",
        en: "A vibrant flower bed filled with roses, lilies, and marigolds flanked the stone patio.",
        ar: "أَحَاطَ حَوْضُ زُهُورٍ زَاهٍ مَلِيءٌ بِالوَرْدِ وَالزَّنْبَقِ بِالفِنَاءِ الحَجَرِيِّ.",
      },
      {
        context: "Spring Preparation",
        en: "She cleared dry weeds and spread fresh organic mulch across the raised flower bed.",
        ar: "أَزَالَتِ الأَعْشَابَ الضَّارَّةَ وَفَرَشَتِ السَّمَادَ العُضْوِيَّ فِي حَوْضِ الزُّهُورِ.",
      },
      {
        context: "Color Arrangement",
        en: "Arranging tall perennials at the back of the flower bed creates beautiful visual depth.",
        ar: "تَرْتِيبُ النَّبَاتَاتِ الطَّوِيلَةِ فِي خَلْفِيَّةِ حَوْضِ الزُّهُورِ يُعْطِي عُمْقاً بَصَرِيّاً جَمِيلاً.",
      },
    ],
    exampleSentence: "Butterflies swarmed the colorful blossoms in the sunny flower bed.",
    exampleArabic:
      "تَجَمَّعَتِ الفَرَاشَاتُ حَوْلَ الأَزْهَارِ المُلَوَّنَةِ فِي حَوْضِ الزُّهُورِ المُشْمِسِ.",
  },
  path: {
    id: "path",
    arabic: "مَمَرّ (مَمْشَى الحَدِيقَة)",
    partOfSpeech: "noun",
    phonetic: "pæθ",
    pronunciationTip: "Short 'a' /æ/ (US) or broad /pɑːθ/ (UK), ending in soft 'th' /θ/.",
    collocations: [
      "garden path",
      "stone path",
      "gravel path",
      "follow the path",
      "winding path",
      "paved path",
    ],
    phrasalVerbs: [
      {
        phrase: "lead to",
        meaning: "direct the walker toward a destination",
        arabic: "يُؤَدِّي إِلَى",
        example: "A winding gravel path leads to the hidden garden gazebo.",
      },
    ],
    sentences: [
      {
        context: "Garden Walkway",
        en: "A charming stone path meandered gently between flowering borders to the shed.",
        ar: "تَعَرَّجَ مَمَرٌّ حَجَرِيٌّ جَمِيلٌ بِلُطْفٍ بَيْنَ حَوَافِّ الزُّهُورِ إِلَى الكُوخِ.",
      },
      {
        context: "Surfacing",
        en: "We laid fresh crushed white gravel along the garden path to suppress weeds.",
        ar: "وَضَعْنَا حَصًى أَبْيَضَ نَاعِماً عَلَى طُولِ مَمَرِّ الحَدِيقَةِ لِمَنْعِ الأَعْشَابِ.",
      },
      {
        context: "Evening Lighting",
        en: "Solar lanterns illuminated the winding path, guiding guests safely through the dusk.",
        ar: "أَضَاءَتِ الفَوَانِيسُ الشَّمْسِيَّةُ المَمَرَّ المُلْتَوِيَ مُرْشِدَةً الضُّيُوفَ فِي المَسَاءِ.",
      },
    ],
    exampleSentence: "She strolled slowly along the paved garden path admiring the blossoms.",
    exampleArabic:
      "تَمَشَّتْ بِبُطْءٍ عَلَى طُولِ مَمَرِّ الحَدِيقَةِ المَرْصُوفِ مُعْجَبَةً بِالأَزْهَارِ.",
  },
  gate: {
    id: "gate",
    arabic: "بَوَّابَة (بَوَّابَةُ الحَدِيقَة)",
    partOfSpeech: "noun",
    phonetic: "ɡeɪt",
    pronunciationTip: "Long 'a' diphthong /eɪ/ as in 'late' or 'rate'.",
    collocations: [
      "garden gate",
      "wooden gate",
      "iron gate",
      "open the gate",
      "latch the gate",
      "creaky gate",
    ],
    phrasalVerbs: [
      {
        phrase: "swing open",
        meaning: "open smoothly on hinges",
        arabic: "يَنْفَتِحُ بِمُرُونَة",
        example: "The ornate wrought-iron gate swung open smoothly into the courtyard.",
      },
    ],
    sentences: [
      {
        context: "Garden Entrance",
        en: "She pushed open the arched wooden gate and stepped into the fragrant flower garden.",
        ar: "دَفَعَتِ البَوَّابَةَ الخَشَبِيَّةَ المُنْحَنِيَةَ وَدَخَلَتْ إِلَى حَدِيقَةِ الزُّهُورِ العَطِرَةِ.",
      },
      {
        context: "Security & Latch",
        en: "Make sure to securely click the metal latch on the gate so the puppy stays inside.",
        ar: "تَأَكَّدْ مِنْ إِغْلاقِ مِزْلاجِ البَوَّابَةِ المَعْدِنِيِّ بِإِحْكَامٍ لِبَقَاءِ الجَرْوِ بِالدَّاخِلِ.",
      },
      {
        context: "Rustic Charm",
        en: "An antique iron gate with decorative floral scrollwork added vintage charm to the yard.",
        ar: "أَضَافَتْ بَوَّابَةٌ حَدِيدِيَّةٌ أَثَرِيَّةٌ ذَاتُ زَخَارِفَ نَبَاتِيَّةٍ سِحْراً كِلاسِيكِيّاً.",
      },
    ],
    exampleSentence: "The heavy wooden gate creaked softly as it opened into the courtyard.",
    exampleArabic:
      "صَرَّتِ البَوَّابَةُ الخَشَبِيَّةُ الثَّقِيلَةُ بِهُدُوءٍ عِنْدَمَا انْفَتَحَتْ عَلَى الفِنَاءِ.",
  },
  "bird-feeder": {
    id: "bird-feeder",
    arabic: "مِطْعَمُ الطُّيُور (مِعْلَفَةُ الطُّيُور)",
    partOfSpeech: "noun",
    phonetic: "ˈbɜːrd ˌfiːdər",
    pronunciationTip: "Compound: 'BIRD fee-der' (/ˈbɜːrd ˌfiː.dər/).",
    collocations: [
      "hanging bird feeder",
      "wooden bird feeder",
      "fill the bird feeder",
      "seed bird feeder",
      "suet bird feeder",
      "clean the bird feeder",
    ],
    phrasalVerbs: [
      {
        phrase: "flock to",
        meaning: "gather in large numbers around",
        arabic: "يَتَوَافَدُ إِلَى",
        example: "Wild finches and chickadees flock to the seed bird feeder every morning.",
      },
    ],
    sentences: [
      {
        context: "Attracting Avian Life",
        en: "A cedar bird feeder hanging from the oak tree drew colorful goldfinches and cardinals.",
        ar: "جَذَبَ مِطْعَمُ طُيُورٍ خَشَبِيٌّ مُعَلَّقٌ عَلَى شَجَرَةِ البَلُّوطِ طُيُوراً مُلَوَّنَةً.",
      },
      {
        context: "Winter Sustenance",
        en: "Keep the bird feeder generously stocked with sunflower seeds during freezing weather.",
        ar: "احْرِصْ عَلَى مَلْءِ مِطْعَمِ الطُّيُورِ بِبُذُورِ عَبَّادِ الشَّمْسِ خِلالَ البَرْدِ الشَّدِيدِ.",
      },
      {
        context: "Observation Window",
        en: "We placed the bird feeder outside the kitchen window to watch birds over breakfast.",
        ar: "وَضَعْنَا مِطْعَمَ الطُّيُورِ خَارِجَ نَافِذَةِ المَطْبَخِ لِمُشَاهَدَةِ الطُّيُورِ أَثْنَاءَ الفُطُورِ.",
      },
    ],
    exampleSentence: "Two blue jays squabbled over the perch on the wooden bird feeder.",
    exampleArabic:
      "تَنَازَعَ طَائِرَانِ زَرْقَاوَانِ عَلَى مَكَانِ الوُقُوفِ فِي مِطْعَمِ الطُّيُورِ الخَشَبِيِّ.",
  },
  "garden-shed": {
    id: "garden-shed",
    arabic: "كُوخُ الحَدِيقَة (مُسْتَوْدَعُ أَدَوَاتِ الحَدِيقَة)",
    partOfSpeech: "noun",
    phonetic: "ˈɡɑːrdən ʃɛd",
    pronunciationTip: "Two words: 'GAR-den shed' (/ˈɡɑːr.dən ʃɛd/).",
    collocations: [
      "wooden garden shed",
      "tools in the garden shed",
      "lock the garden shed",
      "backyard garden shed",
      "organize the garden shed",
      "potting garden shed",
    ],
    phrasalVerbs: [
      {
        phrase: "put away in",
        meaning: "store tools inside",
        arabic: "يَحْفَظُ فِي الكُوخ",
        example: "Put away the shovel and lawn mower inside the dry garden shed.",
      },
    ],
    sentences: [
      {
        context: "Tool Storage",
        en: "He neatly organized shovels, rakes, and pots inside the rustic timber garden shed.",
        ar: "رَتَّبَ المَجَارِفَ وَالمَذَارِيَ وَالأَصَائِصَ بِتَرْتِيبٍ دَاخِلَ كُوخِ الحَدِيقَةِ الخَشَبِيِّ.",
      },
      {
        context: "Potting Station",
        en: "The spacious garden shed contains a wooden workbench for mixing soils and potting seeds.",
        ar: "يَحْتَوِي كُوخُ الحَدِيقَةِ الوَاسِعُ عَلَى طَاوِلَةِ عَمَلٍ لِخَلْطِ التُّرْبَةِ وَالشَّتْلِ.",
      },
      {
        context: "Winter Protection",
        en: "Store all electric mowers and sensitive gardening equipment in the lockable garden shed.",
        ar: "احْفَظْ جَزَّازَاتِ العُشْبِ الكَهْرَبَائِيَّةَ فِي كُوخِ الحَدِيقَةِ القَابِلِ لِلْقَفْلِ.",
      },
    ],
    exampleSentence: "She hung her pruning shears on the wall rack inside the garden shed.",
    exampleArabic:
      "عَلَّقَتْ مِقَصَّاتِ التَّقْلِيمِ عَلَى حَامِلِ الجِدَارِ دَاخِلَ كُوخِ الحَدِيقَةِ.",
  },
  birdbath: {
    id: "birdbath",
    arabic: "مَغْسَلُ الطُّيُور (حَوْضُ اسْتِحْمَامِ الطُّيُور)",
    partOfSpeech: "noun",
    phonetic: "ˈbɜːrdbæθ",
    pronunciationTip: "Compound: 'BIRD-bath' (/ˈbɜːrd.bæθ/).",
    collocations: [
      "stone birdbath",
      "concrete birdbath",
      "clean the birdbath",
      "fresh water in the birdbath",
      "pedestal birdbath",
      "birdbath fountain",
    ],
    phrasalVerbs: [
      {
        phrase: "splash around",
        meaning: "bathe playfully in water",
        arabic: "يَسْتَحِمُّ بِمَرَحٍ فِي المَاءِ",
        example: "Small sparrows splash around happily in the shallow stone birdbath.",
      },
    ],
    sentences: [
      {
        context: "Water Feature",
        en: "A carved stone birdbath on a pedestal served as a central focal point on the lawn.",
        ar: "شَكَّلَ مَغْسَلُ الطُّيُورِ الحَجَرِيُّ المَنْحُوتُ نُقْطَةَ جَذْبٍ مَرْكَزِيَّةً عَلَى المَرْجِ.",
      },
      {
        context: "Avian Hydration",
        en: "In scorching summer heat, wild songbirds rely on the freshwater kept in the birdbath.",
        ar: "فِي حَرِّ الصَّيْفِ، تَعْتَمِدُ الطُّيُورُ عَلَى المِيَاهِ العَذْبَةِ فِي مَغْسَلِ الطُّيُورِ.",
      },
      {
        context: "Maintenance",
        en: "Scrub the concrete birdbath weekly and refill it with clean water to prevent algae.",
        ar: "اغْسِلْ مَغْسَلَ الطُّيُورِ أُسْبُوعِيّاً وَامْلَأْهُ بِمَاءٍ نَظِيفٍ لِمَنْعِ الطَّحَالِبِ.",
      },
    ],
    exampleSentence: "Two bright yellow finches drank thirstily from the shallow birdbath.",
    exampleArabic: "شَرِبَ طَائِرَانِ صَفْرَاوَانِ بِعَطَشٍ مِنْ مَغْسَلِ الطُّيُورِ الضَّحْلِ.",
  },
  "compost-bin": {
    id: "compost-bin",
    arabic: "صُنْدُوقُ السَّمَادِ العُضْوِيّ",
    partOfSpeech: "noun",
    phonetic: "ˈkɑːmpoʊst bɪn",
    pronunciationTip: "Two words: 'COM-post bin' (/ˈkɑːm.poʊst bɪn/).",
    collocations: [
      "wooden compost bin",
      "plastic compost bin",
      "add to the compost bin",
      "turn the compost bin",
      "kitchen compost bin",
      "outdoor compost bin",
    ],
    phrasalVerbs: [
      {
        phrase: "break down into",
        meaning: "decompose into nutrient-rich humus",
        arabic: "يَتَحَلَّلُ إِلَى",
        example: "Vegetable peelings break down into dark rich humus inside the compost bin.",
      },
    ],
    sentences: [
      {
        context: "Eco-Friendly Gardening",
        en: "She emptied kitchen vegetable scraps and dry leaves into the outdoor compost bin.",
        ar: "أَفْرَغَتْ بَقَايَا الخُضَارِ المَنْزِلِيَّةِ وَالأَوْرَاقَ الجَافَّةَ فِي صُنْدُوقِ السَّمَادِ العُضْوِيِّ.",
      },
      {
        context: "Aeration & Heat",
        en: "Turn the contents of the ventilated compost bin regularly to accelerate decomposition.",
        ar: "اقْلِبْ مُحْتَوَيَاتِ صُنْدُوقِ السَّمَادِ بِانْتِظَامٍ لِتَسْرِيعِ التَّحَلُّلِ.",
      },
      {
        context: "Organic Fertilizer",
        en: "After six months, the compost bin yielded nutrient-rich black soil for the garden.",
        ar: "بَعْدَ سِتَّةِ أَشْهُرٍ، أَنْتَجَ صُنْدُوقُ السَّمَادِ تُرْبَةً سَوْدَاءَ غَنِيَّةً بِالعَنَاصِرِ.",
      },
    ],
    exampleSentence: "He tipped grass clippings into the black plastic compost bin.",
    exampleArabic:
      "أَفْرَغَ قُصَاصَاتِ العُشْبِ دَاخِلَ صُنْدُوقِ السَّمَادِ العُضْوِيِّ البْلاسْتِيكِيِّ.",
  },
  "towel-rack": {
    id: "towel-rack",
    arabic: "حَامِلُ المَنَاشِف (عَلَّاقَةُ الفُوَط)",
    partOfSpeech: "noun",
    phonetic: "ˈtaʊəl ræk",
    pronunciationTip: "Pronounce 'towel' (/ˈtaʊ.əl/) followed by crisp 'rack' (/ræk/).",
    collocations: [
      "heated towel rack",
      "hang on the towel rack",
      "stainless steel towel rack",
      "wall-mounted towel rack",
      "double towel rack",
      "bathroom towel rack",
    ],
    phrasalVerbs: [
      {
        phrase: "hang up",
        meaning: "place a towel neatly over the rail",
        arabic: "يُعَلِّقُ الفُوطَة",
        example: "Hang up your damp bath sheet on the towel rack to air dry.",
      },
      {
        phrase: "take down",
        meaning: "remove a towel from the holder",
        arabic: "يُنْزِلُ الفُوطَة",
        example: "She took down a clean towel from the rack.",
      },
    ],
    sentences: [
      {
        context: "Bathroom Storage",
        en: "The heated towel rack keeps bath towels warm and dry after every shower.",
        ar: "يُحَافِظُ حَامِلُ المَنَاشِفِ المُدَفَّأُ عَلَى دِفْءِ وَجَفَافِ المَنَاشِفِ بَعْدَ كُلِّ اسْتِحْمَام.",
      },
      {
        context: "Tidiness",
        en: "Always hang your wet towel on the towel rack instead of leaving it on the floor.",
        ar: "عَلِّقْ مَنْشَفَتَكَ الرَّطْبَةَ دَائِمًا عَلَى حَامِلِ المَنَاشِفِ بَدَلًا مِنْ تَرْكِهَا عَلَى الأَرْض.",
      },
      {
        context: "Installation",
        en: "He installed a chrome towel rack right beside the glass shower door.",
        ar: "قَامَ بِتَرْكِيبِ حَامِلِ مَنَاشِفَ مَطْلِيٍّ بِالكُرُومِ بِجِوَارِ بَابِ الدُّشِّ الزُّجَاجِيِّ مُبَاشَرَةً.",
      },
    ],
    exampleSentence: "The heated towel rack keeps bath towels warm and dry after every shower.",
    exampleArabic:
      "يُحَافِظُ حَامِلُ المَنَاشِفِ المُدَفَّأُ عَلَى دِفْءِ وَجَفَافِ المَنَاشِفِ بَعْدَ كُلِّ اسْتِحْمَام.",
  },
  tiles: {
    id: "tiles",
    arabic: "بَلَاط (سِيرَامِيك الحَمَّام)",
    partOfSpeech: "noun",
    phonetic: "taɪlz",
    pronunciationTip: "Long 'i' diphthong /aɪ/ followed by dark 'l' and voiced 'z' sound.",
    collocations: [
      "ceramic tiles",
      "floor tiles",
      "wall tiles",
      "mosaic tiles",
      "scrub the tiles",
      "grout between tiles",
    ],
    phrasalVerbs: [
      {
        phrase: "wipe down",
        meaning: "clean tile surfaces with a cloth",
        arabic: "يَمْسَحُ البَلَاط",
        example: "Wipe down the shower tiles after bathing to prevent mildew.",
      },
      {
        phrase: "lay down",
        meaning: "install new tiles on floors or walls",
        arabic: "يُرَكِّبُ البَلَاط",
        example: "They laid down glossy white tiles in the newly renovated bathroom.",
      },
    ],
    sentences: [
      {
        context: "Bathroom Decor",
        en: "The glossy white ceramic tiles make the small bathroom feel bright and spacious.",
        ar: "يَجْعَلُ بَلَاطُ السِّيرَامِيكِ الأَبْيَضُ اللَّامِعُ الحَمَّامَ الصَّغِيرَ يَبْدُو مُشْرِقًا وَوَاسِعًا.",
      },
      {
        context: "Cleaning",
        en: "Use a soft brush and cleaner to remove soap scum from the shower tiles.",
        ar: "اسْتَخْدِمْ فُرْشَاةً نَاعِمَةً وَمُنَظِّفًا لِإِزَالَةِ بَقَايَا الصَّابُونِ عَنْ بَلَاطِ الدُّش.",
      },
      {
        context: "Safety",
        en: "Matte textured floor tiles provide better grip when walking with wet feet.",
        ar: "يُوَفِّرُ بَلَاطُ الأَرْضِيَّةِ غَيْرُ اللَّامِعِ تَمَاسُكًا أَفْضَلَ عِنْدَ المَشْيِ بِأَقْدَامٍ مُبَلَّلَة.",
      },
    ],
    exampleSentence:
      "The glossy white ceramic tiles make the small bathroom feel bright and spacious.",
    exampleArabic:
      "يَجْعَلُ بَلَاطُ السِّيرَامِيكِ الأَبْيَضُ اللَّامِعُ الحَمَّامَ الصَّغِيرَ يَبْدُو مُشْرِقًا وَوَاسِعًا.",
  },
  towel: {
    id: "towel",
    arabic: "مَنْشَفَة (فُوطَة)",
    partOfSpeech: "noun",
    phonetic: "ˈtaʊəl",
    pronunciationTip: "Two syllables: 'TOW' (/taʊ/) like 'now' + unstressed 'el' (/əl/).",
    collocations: [
      "clean towel",
      "damp towel",
      "fluffy towel",
      "dry with a towel",
      "cotton towel",
      "fold the towel",
    ],
    phrasalVerbs: [
      {
        phrase: "dry off",
        meaning: "remove moisture using a towel",
        arabic: "يُجَفِّفُ نَفْسَهُ",
        example: "Dry off thoroughly with a warm towel after getting out of the pool.",
      },
      {
        phrase: "hang up",
        meaning: "suspend a towel on a hook",
        arabic: "يُعَلِّقُ الفُوطَة",
        example: "Hang up your towel on the hook after washing your face.",
      },
    ],
    sentences: [
      {
        context: "Drying Off",
        en: "She wrapped a large fluffy cotton towel around her shoulders after the bath.",
        ar: "لَفَّتْ مَنْشَفَةً قُطْنِيَّةً كَبِيرَةً وَنَاعِمَةً حَوْلَ كَتِفَيْهَا بَعْدَ الاسْتِحْمَام.",
      },
      {
        context: "Hygiene",
        en: "Always provide guests with a fresh hand towel in the powder room.",
        ar: "وَفِّرْ دَائِمًا لِلضُّيُوفِ مَنْشَفَةَ يَدٍ نَظِيفَةً فِي حَمَّامِ الضُّيُوف.",
      },
      {
        context: "Laundry",
        en: "Wash your bath towel in hot water weekly to keep it fresh and odor-free.",
        ar: "اغْسِلْ مَنْشَفَةَ الحَمَّامِ بِالمَاءِ السَّاخِنِ أُسْبُوعِيًّا لِلْحِفَاظِ عَلَى نَظَافَتِهَا وَرَائِحَتِهَا.",
      },
    ],
    exampleSentence: "She wrapped a large fluffy cotton towel around her shoulders after the bath.",
    exampleArabic:
      "لَفَّتْ مَنْشَفَةً قُطْنِيَّةً كَبِيرَةً وَنَاعِمَةً حَوْلَ كَتِفَيْهَا بَعْدَ الاسْتِحْمَام.",
  },
  "cotton-balls": {
    id: "cotton-balls",
    arabic: "كُرَاتُ القُطْن",
    partOfSpeech: "noun",
    phonetic: "ˈkɑːtn bɔːlz",
    pronunciationTip:
      "Stress first syllable of 'cotton' (/ˈkɑːt.n/) + long 'aw' in 'balls' (/bɔːlz/).",
    collocations: [
      "sterile cotton balls",
      "bag of cotton balls",
      "apply with cotton balls",
      "cosmetic cotton balls",
      "soft cotton balls",
      "glass jar of cotton balls",
    ],
    phrasalVerbs: [
      {
        phrase: "wipe off",
        meaning: "remove makeup or ointment with cotton",
        arabic: "يَمْسَحُ بِالقُطْن",
        example: "Wipe off nail polish using cotton balls soaked in remover.",
      },
      {
        phrase: "dab on",
        meaning: "apply liquid gently with cotton",
        arabic: "يُرَبِّتُ بِالقُطْن",
        example: "Dab on antiseptic toner using a soft cotton ball.",
      },
    ],
    sentences: [
      {
        context: "Skincare",
        en: "She used soft cotton balls to gently remove her eye makeup and cleanse her face.",
        ar: "اسْتَخْدَمَتْ كُرَاتِ قُطْنٍ نَاعِمَةً لِإِزَالَةِ مَكْيَاجِ العَيْنَيْنِ بِلُطْفٍ وَتَنْظِيفِ وَجْهِهَا.",
      },
      {
        context: "First Aid",
        en: "Dab alcohol on the scrape with sterile cotton balls before applying a bandage.",
        ar: "ضَعِ الكُحُولَ عَلَى الخَدْشِ بِاسْتِخْدَامِ كُرَاتِ قُطْنٍ مُعَقَّمَةٍ قَبْلَ وَضْعِ الضِّمَادَة.",
      },
      {
        context: "Organization",
        en: "Store cosmetic cotton balls in a covered clear glass jar on the vanity.",
        ar: "احْفَظْ كُرَاتِ القُطْنِ التَّجْمِيلِيَّةِ فِي بَرْرَطَانٍ زُجَاجِيٍّ شَفَّافٍ مُغَطًّى عَلَى التَّسْرِيحَة.",
      },
    ],
    exampleSentence:
      "She used soft cotton balls to gently remove her eye makeup and cleanse her face.",
    exampleArabic:
      "اسْتَخْدَمَتْ كُرَاتِ قُطْنٍ نَاعِمَةً لِإِزَالَةِ مَكْيَاجِ العَيْنَيْنِ بِلُطْفٍ وَتَنْظِيفِ وَجْهِهَا.",
  },
  "nail-clipper": {
    id: "nail-clipper",
    arabic: "قَصَّاصَةُ الأَظَافِر (مَقَصُّ الأَظَافِر)",
    partOfSpeech: "noun",
    phonetic: "ˈneɪl ˌklɪpər",
    pronunciationTip:
      "'Nail' has long /eɪ/ sound, 'clipper' has short /ɪ/ and ends with unstressed /ər/.",
    collocations: [
      "stainless nail clipper",
      "toenail clipper",
      "trim with a nail clipper",
      "sharp nail clipper",
      "fingernail clipper",
      "pocket nail clipper",
    ],
    phrasalVerbs: [
      {
        phrase: "trim down",
        meaning: "shorten nails with clippers",
        arabic: "يُقَلِّمُ الأَظَافِر",
        example: "Trim down your fingernails straight across to prevent ingrown edges.",
      },
      {
        phrase: "clip off",
        meaning: "snip away excess nail length",
        arabic: "يَقُصُّ الظُّفْر",
        example: "Carefully clip off the rough broken edge of the thumbnail.",
      },
    ],
    sentences: [
      {
        context: "Personal Grooming",
        en: "Keep a sharp stainless steel nail clipper in your toiletry kit for neat fingernails.",
        ar: "احْتَفِظْ بِقَصَّاصَةِ أَظَافِرَ حَادَّةٍ مِنَ الفُولاذِ المُقَاوِمِ لِلصَّدَأِ فِي حَقِيبَةِ أَدَوَاتِ الزِّينَة.",
      },
      {
        context: "Hygiene",
        en: "Sanitize the nail clipper with rubbing alcohol before and after each trimming.",
        ar: "عَقِّمْ قَصَّاصَةَ الأَظَافِرِ بِالكُحُولِ قَبْلَ وَبَعْدَ كُلِّ تَقْلِيم.",
      },
      {
        context: "Routine",
        en: "He used the curved nail clipper to trim his fingernails smoothly after bathing.",
        ar: "اسْتَخْدَمَ قَصَّاصَةَ الأَظَافِرِ المُنْحَنِيَةَ لِتَقْلِيمِ أَظَافِرِهِ بِسَلاسَةٍ بَعْدَ الاسْتِحْمَام.",
      },
    ],
    exampleSentence:
      "Keep a sharp stainless steel nail clipper in your toiletry kit for neat fingernails.",
    exampleArabic:
      "احْتَفِظْ بِقَصَّاصَةِ أَظَافِرَ حَادَّةٍ مِنَ الفُولاذِ المُقَاوِمِ لِلصَّدَأِ فِي حَقِيبَةِ أَدَوَاتِ الزِّينَة.",
  },
  "hair-dryer": {
    id: "hair-dryer",
    arabic: "مُجَفِّفُ الشَّعْر (سِشْوَار)",
    partOfSpeech: "noun",
    phonetic: "ˈhɛər ˌdraɪər",
    pronunciationTip: "Compound noun: 'hair' (/hɛər/) + 'dryer' (/ˈdraɪ.ər/).",
    collocations: [
      "ionic hair dryer",
      "blow-dry with a hair dryer",
      "heat settings on hair dryer",
      "diffuser for hair dryer",
      "cordless hair dryer",
      "professional hair dryer",
    ],
    phrasalVerbs: [
      {
        phrase: "blow dry",
        meaning: "dry and style hair using hot air stream",
        arabic: "يُجَفِّفُ بِالسِّشْوَار",
        example: "She blew dry her hair with a round brush for extra volume.",
      },
      {
        phrase: "unplug",
        meaning: "disconnect electrical appliance from wall outlet",
        arabic: "يَفْصِلُ القَابِس",
        example: "Always unplug the hair dryer immediately after styling your hair.",
      },
    ],
    sentences: [
      {
        context: "Hairstyling",
        en: "Use a heat protectant spray before drying your hair with a high-power hair dryer.",
        ar: "اسْتَخْدِمْ رَذَاذَ حِمَايَةٍ مِنَ الحَرَارَةِ قَبْلَ تَجْفِيفِ شَعْرِكَ بِمُجَفِّفِ شَعْرٍ عَالِي القُوَّة.",
      },
      {
        context: "Bathroom Safety",
        en: "Never use an electrical hair dryer near a filled sink or running bathtub.",
        ar: "لَا تَسْتَخْدِمْ مُجَفِّفَ الشَّعْرِ الكَهْرَبَائِيَّ قُرْبَ حَوْضٍ مُمْتَلِئٍ أَوْ حَوْضِ اسْتِحْمَامٍ جَارٍ.",
      },
      {
        context: "Features",
        en: "The modern hair dryer features cool-shot buttons and multiple speed settings.",
        ar: "يَتَمَيَّزُ مُجَفِّفُ الشَّعْرِ الحَدِيثُ بِأَزْرَارِ هَوَاءِ بَارِدٍ وَإِعْدَادَاتِ سُرْعَةٍ مُتَعَدِّدَة.",
      },
    ],
    exampleSentence:
      "Use a heat protectant spray before drying your hair with a high-power hair dryer.",
    exampleArabic:
      "اسْتَخْدِمْ رَذَاذَ حِمَايَةٍ مِنَ الحَرَارَةِ قَبْلَ تَجْفِيفِ شَعْرِكَ بِمُجَفِّفِ شَعْرٍ عَالِي القُوَّة.",
  },
  "first-aid-kit": {
    id: "first-aid-kit",
    arabic: "حَقِيبَةُ الإِسْعَافَاتِ الأَوَّلِيَّة (صُنْدُوقُ الإِسْعَاف)",
    partOfSpeech: "noun",
    phonetic: "ˌfɜːrst ˈeɪd kɪt",
    pronunciationTip: "Three words: 'first' (/fɜːrst/) + 'aid' (/eɪd/) + 'kit' (/kɪt/).",
    collocations: [
      "home first-aid kit",
      "stocked first-aid kit",
      "emergency first-aid kit",
      "travel first-aid kit",
      "bandages in first-aid kit",
      "wall-mounted first-aid kit",
    ],
    phrasalVerbs: [
      {
        phrase: "stock up",
        meaning: "refill medical supplies and antiseptic",
        arabic: "يُعَبِّئُ المَخْزُونَ",
        example: "Stock up the first-aid kit with fresh sterile gauze and antibiotic ointment.",
      },
      {
        phrase: "reach for",
        meaning: "grab the medical box quickly",
        arabic: "يَتَنَاوَلُ الحَقِيبَة",
        example: "She reached for the first-aid kit after accidentally cutting her finger.",
      },
    ],
    sentences: [
      {
        context: "Home Safety",
        en: "Every home bathroom should have a fully stocked first-aid kit with bandages and antiseptic.",
        ar: "يَجِبُ أَنْ يَحْتَوِيَ كُلُّ حَمَّامٍ مَنْزِلِيٍّ عَلَى حَقِيبَةِ إِسْعَافَاتٍ أَوَّلِيَّةٍ مُمْتَلِئَةٍ بِالضِّمَادَاتِ وَالمُطَهِّرَات.",
      },
      {
        context: "Emergency Response",
        en: "He quickly grabbed adhesive strips and disinfectant from the red first-aid kit.",
        ar: "تَنَاوَلَ بِسُرْعَةٍ شَرَائِطَ لاصِقَةً وَمُطَهِّرًا مِنْ حَقِيبَةِ الإِسْعَافَاتِ الأَوَّلِيَّةِ الحَمْرَاء.",
      },
      {
        context: "Maintenance",
        en: "Check the expiration dates of medicines in your first-aid kit every six months.",
        ar: "افْحَصْ تَمَامَ صَلاحِيَةِ الأَدْوِيَةِ فِي صُنْدُوقِ الإِسْعَافَاتِ الأَوَّلِيَّةِ كُلَّ سِتَّةِ أَشْهُر.",
      },
    ],
    exampleSentence:
      "Every home bathroom should have a fully stocked first-aid kit with bandages and antiseptic.",
    exampleArabic:
      "يَجِبُ أَنْ يَحْتَوِيَ كُلُّ حَمَّامٍ مَنْزِلِيٍّ عَلَى حَقِيبَةِ إِسْعَافَاتٍ أَوَّلِيَّةٍ مُمْتَلِئَةٍ بِالضِّمَادَاتِ وَالمُطَهِّرَات.",
  },
  thermometer: {
    id: "thermometer",
    arabic: "مِقْيَاسُ الحَرَارَة (تِرْمُومِتْر)",
    partOfSpeech: "noun",
    phonetic: "θərˈmɑːmɪtər",
    pronunciationTip: "Stress the second syllable: ther-MOM-i-ter (/θərˈmɑː.mɪ.tər/).",
    collocations: [
      "digital thermometer",
      "forehead thermometer",
      "take temperature with thermometer",
      "infrared thermometer",
      "oral thermometer",
      "medical thermometer",
    ],
    phrasalVerbs: [
      {
        phrase: "read out",
        meaning: "display digital temperature measurement",
        arabic: "يَعْرِضُ القِرَاءَة",
        example: "The digital screen reads out the body temperature in under three seconds.",
      },
      {
        phrase: "wipe off",
        meaning: "clean the thermometer sensor with alcohol",
        arabic: "يُعَقِّمُ المِقْيَاس",
        example: "Always wipe off the thermometer probe with alcohol after each use.",
      },
    ],
    sentences: [
      {
        context: "Health Check",
        en: "The digital thermometer beeped to indicate a normal body temperature of 37 degrees.",
        ar: "أَصْدَرَ مِقْيَاسُ الحَرَارَةِ الرَّقْمِيُّ صَفِيرًا لِيُشِيرَ إِلَى دَرَجَةِ حَرَارَةِ جِسْمٍ طَبِيعِيَّةٍ تَبْلُغُ 37 دَرَجَة.",
      },
      {
        context: "Illness",
        en: "She placed the medical thermometer under her child's tongue to check for fever.",
        ar: "وَضَعَتْ مِقْيَاسَ الحَرَارَةِ الطِّبِّيَّ تَحْتَ لِسَانِ طِفْلِهَا لِلتَّحَقُّقِ مِنْ وُجُودِ حُمَّى.",
      },
      {
        context: "Storage",
        en: "Store the infrared thermometer in its protective case inside the medicine cabinet.",
        ar: "احْفَظْ مِقْيَاسَ الحَرَارَةِ بِالأَشِعَّةِ تَحْتَ الحَمْرَاءِ فِي عُلْبَتِهِ الوَاقِيَةِ دَاخِلَ خِزَانَةِ الأَدْوِيَة.",
      },
    ],
    exampleSentence:
      "The digital thermometer beeped to indicate a normal body temperature of 37 degrees.",
    exampleArabic:
      "أَصْدَرَ مِقْيَاسُ الحَرَارَةِ الرَّقْمِيُّ صَفِيرًا لِيُشِيرَ إِلَى دَرَجَةِ حَرَارَةِ جِسْمٍ طَبِيعِيَّةٍ تَبْلُغُ 37 دَرَجَة.",
  },
  "shower-head": {
    id: "shower-head",
    arabic: "رَأْسُ الدُّش (مِرَشَّةُ الاسْتِحْمَام)",
    partOfSpeech: "noun",
    phonetic: "ˈʃaʊər hɛd",
    pronunciationTip: "Compound noun: 'shower' (/ˈʃaʊ.ər/) + 'head' (/hɛd/).",
    collocations: [
      "rainfall shower head",
      "adjustable shower head",
      "handheld shower head",
      "high-pressure shower head",
      "clogged shower head",
      "chrome shower head",
    ],
    phrasalVerbs: [
      {
        phrase: "turn on",
        meaning: "start water flow through the nozzle",
        arabic: "يُشَغِّلُ الدُّش",
        example: "Turn on the shower head and adjust the temperature before stepping in.",
      },
      {
        phrase: "soak in",
        meaning: "submerge nozzle in vinegar to remove mineral buildup",
        arabic: "يَنْقَعُ لِإِزَالَةِ الكِلْس",
        example: "Soak the shower head in vinegar overnight to clear limescale deposits.",
      },
    ],
    sentences: [
      {
        context: "Bathroom Fixtures",
        en: "The modern rainfall shower head delivers a wide, soothing cascade of warm water.",
        ar: "يُوَفِّرُ رَأْسُ الدُّشِّ المَطَرِيُّ الحَدِيثُ تَدَفُّقًا وَاسِعًا وَمُرِيحًا مِنَ المَاءِ الدَّافِئ.",
      },
      {
        context: "Maintenance",
        en: "Descaling the shower head regularly restores strong and even water pressure.",
        ar: "إِزَالَةُ التَّرَسُّبَاتِ عَنْ رَأْسِ الدُّشِّ بِانْتِظَامٍ تُعِيدُ ضَغْطَ المَاءِ القَوِيَّ وَالمُتَجَانِس.",
      },
      {
        context: "Installation",
        en: "He replaced the old fixed nozzle with a flexible handheld shower head.",
        ar: "اسْتَبْدَلَ المِرَشَّةَ القَدِيمَةَ الثَّابِتَةَ بِرَأْسِ دُشٍّ يَدَوِيٍّ مَرِن.",
      },
    ],
    exampleSentence:
      "The modern rainfall shower head delivers a wide, soothing cascade of warm water.",
    exampleArabic:
      "يُوَفِّرُ رَأْسُ الدُّشِّ المَطَرِيُّ الحَدِيثُ تَدَفُّقًا وَاسِعًا وَمُرِيحًا مِنَ المَاءِ الدَّافِئ.",
  },
  "soap-dish": {
    id: "soap-dish",
    arabic: "صَحْنُ الصَّابُون (صَبَّانَة)",
    partOfSpeech: "noun",
    phonetic: "ˈsoʊp dɪʃ",
    pronunciationTip: "Long 'o' in 'soap' (/soʊp/) + short 'i' in 'dish' (/dɪʃ/).",
    collocations: [
      "ceramic soap dish",
      "draining soap dish",
      "bamboo soap dish",
      "suction soap dish",
      "place on the soap dish",
      "clean the soap dish",
    ],
    phrasalVerbs: [
      {
        phrase: "set down",
        meaning: "place soap bar in holder",
        arabic: "يَضَعُ الصَّابُونَة",
        example: "Set down the bar of soap on the slotted dish so it dries quickly.",
      },
      {
        phrase: "rinse off",
        meaning: "wash away soap residue",
        arabic: "يَشْطُفُ الصَّبَّانَة",
        example: "Rinse off the soapy buildup from the ceramic soap dish weekly.",
      },
    ],
    sentences: [
      {
        context: "Bathroom Countertop",
        en: "A slotted ceramic soap dish keeps the soap bar dry and prevents it from melting.",
        ar: "تُحَافِظُ صَبَّانَةُ السِّيرَامِيكِ ذَاتُ الثُّقُوبِ عَلَى جَفَافِ الصَّابُونِ وَتَمْنَعُ ذَوَبَانَهَا.",
      },
      {
        context: "Design",
        en: "She bought a bamboo soap dish that matches the natural wood theme of her bathroom.",
        ar: "اشْتَرَتْ صَبَّانَةً مِنْ خَشَبِ الخَيْزُرَانِ تُنَاسِبُ الطَّابَعَ الخَشَبِيَّ الطَّبِيعِيَّ لِحَمَّامِهَا.",
      },
      {
        context: "Hygiene",
        en: "Keep the soap dish clean by washing off any accumulated lather with warm water.",
        ar: "حَافِظْ عَلَى نَظَافَةِ صَحْنِ الصَّابُونِ بِغَسْلِ الرَّغْوَةِ المُتَرَاكِمَةِ بِالمَاءِ الدَّافِئ.",
      },
    ],
    exampleSentence:
      "A slotted ceramic soap dish keeps the soap bar dry and prevents it from melting.",
    exampleArabic:
      "تُحَافِظُ صَبَّانَةُ السِّيرَامِيكِ ذَاتُ الثُّقُوبِ عَلَى جَفَافِ الصَّابُونِ وَتَمْنَعُ ذَوَبَانَهَا.",
  },
  "shampoo-bottle": {
    id: "shampoo-bottle",
    arabic: "قَارُورَةُ الشَّامْبُو (عُلْبَةُ الشَّامْبُو)",
    partOfSpeech: "noun",
    phonetic: "ʃæmˈpuː ˌbɑːtl",
    pronunciationTip: "Stress second syllable of 'shampoo' (/ʃæmˈpuː/) + 'bottle' (/ˈbɑː.tl/).",
    collocations: [
      "pump shampoo bottle",
      "squeeze the shampoo bottle",
      "refillable shampoo bottle",
      "empty shampoo bottle",
      "plastic shampoo bottle",
      "large shampoo bottle",
    ],
    phrasalVerbs: [
      {
        phrase: "squeeze out",
        meaning: "press bottle to dispense liquid",
        arabic: "يَعْصِرُ الشَّامْبُو",
        example: "Squeeze out a coin-sized portion of shampoo onto your palm.",
      },
      {
        phrase: "fill up",
        meaning: "replenish a reusable container",
        arabic: "يَمْلَأُ القَارُورَة",
        example: "Fill up the dispenser bottle with eco-friendly shampoo refills.",
      },
    ],
    sentences: [
      {
        context: "Showering",
        en: "Press down on the pump dispenser of the shampoo bottle to get the right amount of lather.",
        ar: "اضْغَطْ عَلَى مِضَخَّةِ قَارُورَةِ الشَّامْبُو لِلْحُصُولِ عَلَى كَمِّيَّةِ الرَّغْوَةِ المُنَاسِبَة.",
      },
      {
        context: "Recycling",
        en: "Rinse the empty plastic shampoo bottle before placing it in the recycling bin.",
        ar: "اشْطُفْ قَارُورَةَ الشَّامْبُو البْلاسْتِيكِيَّةَ الفَارِغَةَ قَبْلَ وَضْعِهَا فِي سَلَّةِ إِعَادَةِ التَّدْوِير.",
      },
      {
        context: "Organization",
        en: "Store your shampoo bottle on the shower caddy so it doesn't clutter the tub rim.",
        ar: "ضَعْ قَارُورَةَ الشَّامْبُو عَلَى رَفِّ الدُّشِّ لِتَجَنُّبِ فَوْضَى حَافَّةِ حَوْضِ الاسْتِحْمَام.",
      },
    ],
    exampleSentence:
      "Press down on the pump dispenser of the shampoo bottle to get the right amount of lather.",
    exampleArabic:
      "اضْغَطْ عَلَى مِضَخَّةِ قَارُورَةِ الشَّامْبُو لِلْحُصُولِ عَلَى كَمِّيَّةِ الرَّغْوَةِ المُنَاسِبَة.",
  },
  "rubber-duck": {
    id: "rubber-duck",
    arabic: "بَطَّةُ اسْتِحْمَامٍ مَطَّاطِيَّة",
    partOfSpeech: "noun",
    phonetic: "ˈrʌbər dʌk",
    pronunciationTip: "Both words share the short /ʌ/ vowel: 'RUB-ber' + 'DUCK'.",
    collocations: [
      "yellow rubber duck",
      "floating rubber duck",
      "squeaky rubber duck",
      "bath rubber duck",
      "toy rubber duck",
      "classic rubber duck",
    ],
    phrasalVerbs: [
      {
        phrase: "float on",
        meaning: "stay atop the bathwater",
        arabic: "يَطْفُو عَلَى المَاء",
        example: "The bright yellow rubber duck floated happily on the warm soapy water.",
      },
      {
        phrase: "dry out",
        meaning: "allow toy to shed moisture",
        arabic: "يَجِفّ",
        example: "Squeeze all water out of the rubber duck so it dries out completely.",
      },
    ],
    sentences: [
      {
        context: "Bath Time",
        en: "The toddler loves splashing in the bubble bath with his bright yellow rubber duck.",
        ar: "يَعْشَقُ الطِّفْلُ اللَّعِبَ فِي حَمَّامِ الفَقَاقِيعِ مَعَ بَطَّتِهِ المَطَّاطِيَّةِ الصَّفْرَاءِ اللَّامِعَة.",
      },
      {
        context: "Toy Care",
        en: "Always drain water from inside the rubber duck to prevent mold from developing.",
        ar: "قُمْ دَائِمًا بِتَفْرِيغِ المَاءِ مِنْ دَاخِلِ البَطَّةِ المَطَّاطِيَّةِ لِمَنْعِ تَكَوُّنِ العَفَن.",
      },
      {
        context: "Bathroom Novelty",
        en: "A cheerful rubber duck sits on the bathtub ledge as a fun colorful decoration.",
        ar: "تَجْلِسُ بَطَّةٌ مَطَّاطِيَّةٌ مَرِحَةٌ عَلَى حَافَّةِ حَوْضِ الاسْتِحْمَامِ كَدِيكُورٍ جَمِيلٍ وَمُبْهِج.",
      },
    ],
    exampleSentence:
      "The toddler loves splashing in the bubble bath with his bright yellow rubber duck.",
    exampleArabic:
      "يَعْشَقُ الطِّفْلُ اللَّعِبَ فِي حَمَّامِ الفَقَاقِيعِ مَعَ بَطَّتِهِ المَطَّاطِيَّةِ الصَّفْرَاءِ اللَّامِعَة.",
  },
  "shower-gel": {
    id: "shower-gel",
    arabic: "سَائِلُ الاسْتِحْمَام (جِل الاسْتِحْمَام)",
    partOfSpeech: "noun",
    phonetic: "ˈʃaʊər dʒɛl",
    pronunciationTip: "'Shower' (/ˈʃaʊ.ər/) followed by 'gel' with soft 'j' sound (/dʒɛl/).",
    collocations: [
      "moisturizing shower gel",
      "fragrant shower gel",
      "lather with shower gel",
      "antibacterial shower gel",
      "exfoliating shower gel",
      "gentle shower gel",
    ],
    phrasalVerbs: [
      {
        phrase: "lather up",
        meaning: "produce rich suds with body wash",
        arabic: "يَصْنَعُ رَغْوَة",
        example: "Lather up with citrus shower gel on a mesh sponge for clean skin.",
      },
      {
        phrase: "rinse off",
        meaning: "wash soap away with clear water",
        arabic: "يَشْطُفُ الجِل",
        example: "Rinse off the refreshing shower gel thoroughly with warm water.",
      },
    ],
    sentences: [
      {
        context: "Daily Routine",
        en: "Pour a drop of scented shower gel onto a wet loofah to create a rich soothing foam.",
        ar: "اسْكُبْ قَطْرَةً مِنْ جِلِ الاسْتِحْمَامِ المُعَطَّرِ عَلَى لِيفَةٍ مُبَلَّلَةٍ لِتَكْوِينِ رَغْوَةٍ وَفِيرَةٍ وَمُرِيحَة.",
      },
      {
        context: "Skincare",
        en: "Choose a soap-free shower gel if you have sensitive or dry winter skin.",
        ar: "اخْتَرْ جِلَ اسْتِحْمَامٍ خَالِيًا مِنَ الصَّابُونِ إِذَا كَانَتْ بَشَرَتُكَ حَسَّاسَةً أَوْ جَافَّةً شِتَاءً.",
      },
      {
        context: "Aromatherapy",
        en: "Lavender shower gel helps relax your body and mind before going to sleep.",
        ar: "يُسَاعِدُ سَائِلُ الاسْتِحْمَامِ بِاللافَنْدَرِ عَلَى إِرْخَاءِ الجِسْمِ وَالعَقْلِ قَبْلَ النَّوْم.",
      },
    ],
    exampleSentence:
      "Pour a drop of scented shower gel onto a wet loofah to create a rich soothing foam.",
    exampleArabic:
      "اسْكُبْ قَطْرَةً مِنْ جِلِ الاسْتِحْمَامِ المُعَطَّرِ عَلَى لِيفَةٍ مُبَلَّلَةٍ لِتَكْوِينِ رَغْوَةٍ وَفِيرَةٍ وَمُرِيحَة.",
  },
  "face-cream": {
    id: "face-cream",
    arabic: "كَرِيمُ الوَجْه (مُرَطِّبُ البَشَرَة)",
    partOfSpeech: "noun",
    phonetic: "ˈfeɪs kriːm",
    pronunciationTip: "'Face' has long /eɪ/, 'cream' has long /iː/ sound.",
    collocations: [
      "hydrating face cream",
      "night face cream",
      "anti-aging face cream",
      "apply face cream",
      "jar of face cream",
      "gentle face cream",
    ],
    phrasalVerbs: [
      {
        phrase: "rub in",
        meaning: "massage lotion gently into skin",
        arabic: "يَدْهُنُ الكَرِيم",
        example: "Gently rub in the moisturizing face cream with upward circular strokes.",
      },
      {
        phrase: "soak in",
        meaning: "absorb into dermal layers",
        arabic: "تَمْتَصُّهُ البَشَرَة",
        example: "Allow the light face cream to soak in completely before applying makeup.",
      },
    ],
    sentences: [
      {
        context: "Daily Skincare",
        en: "Apply a nourishing face cream every morning and evening to keep skin smooth and hydrated.",
        ar: "ضَعِي كَرِيمَ وَجْهٍ مُغَذِّيًا كُلَّ صَبَاحٍ وَمَسَاءٍ لِلْحِفَاظِ عَلَى نُعُومَةِ البَشَرَةِ وَتَرْطِيبِهَا.",
      },
      {
        context: "Winter Routine",
        en: "Cold weather makes rich face cream essential to prevent dryness and peeling.",
        ar: "يَجْعَلُ الطَّقْسُ البَارِدُ كَرِيمَ الوَجْهِ الغَنِيَّ ضَرُورِيًّا لِمَنْعِ الجَفَافِ وَالتَّقَشُّر.",
      },
      {
        context: "Application",
        en: "Dab a pea-sized amount of face cream onto your forehead, cheeks, and chin.",
        ar: "ضَعْ كَمِّيَّةً بِحَجْمِ حَبَّةِ البَازِلَّاءِ مِنْ كَرِيمِ الوَجْهِ عَلَى جَبِينِكَ وَخَدَّيْكَ وَذَقْنِك.",
      },
    ],
    exampleSentence:
      "Apply a nourishing face cream every morning and evening to keep skin smooth and hydrated.",
    exampleArabic:
      "ضَعِي كَرِيمَ وَجْهٍ مُغَذِّيًا كُلَّ صَبَاحٍ وَمَسَاءٍ لِلْحِفَاظِ عَلَى نُعُومَةِ البَشَرَةِ وَتَرْطِيبِهَا.",
  },
  sunscreen: {
    id: "sunscreen",
    arabic: "وَاقِي الشَّمْس",
    partOfSpeech: "noun",
    phonetic: "ˈsʌnskriːn",
    pronunciationTip: "Compound word: 'sun' (/sʌn/) + 'screen' (/skriːn/).",
    collocations: [
      "broad-spectrum sunscreen",
      "SPF 50 sunscreen",
      "apply sunscreen",
      "water-resistant sunscreen",
      "mineral sunscreen",
      "reapply sunscreen",
    ],
    phrasalVerbs: [
      {
        phrase: "slather on",
        meaning: "apply generous layer of lotion",
        arabic: "يَدْهُنُ بِسَخَاء",
        example: "Slather on water-resistant sunscreen twenty minutes before going swimming.",
      },
      {
        phrase: "wash off",
        meaning: "remove protective lotion with cleanser",
        arabic: "يَغْسِلُ الوَاقِي",
        example: "Always wash off sunscreen at the end of the day with a gentle face cleanser.",
      },
    ],
    sentences: [
      {
        context: "Sun Protection",
        en: "Wearing broad-spectrum sunscreen daily protects your skin from harmful ultraviolet rays.",
        ar: "يَحْمِي وَضْعُ وَاقِي الشَّمْسِ وَاسِعِ النِّطَاقِ يَوْمِيًّا بَشَرَتَكَ مِنْ أَشِعَّةِ الشَّمْسِ فَوْقَ البَنَفْسَجِيَّةِ الضَّارَّة.",
      },
      {
        context: "Outdoor Activities",
        en: "Reapply SPF 50 sunscreen every two hours when spending the afternoon outdoors.",
        ar: "أَعِدْ وَضْعَ وَاقِي الشَّمْسِ بِعَامِلِ حِمَايَةٍ 50 كُلَّ سَاعَتَيْنِ عِنْدَ قَضَاءِ وَقْتٍ فِي الخَارِج.",
      },
      {
        context: "Application Tip",
        en: "Do not forget to apply sunscreen to your neck, ears, and the tops of your hands.",
        ar: "لَا تَنْسَ وَضْعَ وَاقِي الشَّمْسِ عَلَى رَقَبَتِكَ وَأُذُنَيْكَ وَظَهْرِ يَدَيْك.",
      },
    ],
    exampleSentence:
      "Wearing broad-spectrum sunscreen daily protects your skin from harmful ultraviolet rays.",
    exampleArabic:
      "يَحْمِي وَضْعُ وَاقِي الشَّمْسِ وَاسِعِ النِّطَاقِ يَوْمِيًّا بَشَرَتَكَ مِنْ أَشِعَّةِ الشَّمْسِ فَوْقَ البَنَفْسَجِيَّةِ الضَّارَّة.",
  },
  "lip-balm": {
    id: "lip-balm",
    arabic: "مُرَطِّبُ الشِّفَاه (زُبْدَةُ الشِّفَاه)",
    partOfSpeech: "noun",
    phonetic: "ˈlɪp bɑːm",
    pronunciationTip: "Silent 'l' in 'balm': pronounce as /bɑːm/ (rhymes with 'calm').",
    collocations: [
      "soothing lip balm",
      "beeswax lip balm",
      "apply lip balm",
      "chapped lips and lip balm",
      "tinted lip balm",
      "tube of lip balm",
    ],
    phrasalVerbs: [
      {
        phrase: "glide on",
        meaning: "apply smoothly over lips",
        arabic: "يَمُرُّ بِسَلاسَة",
        example: "The organic beeswax balm glides on easily to soothe chapped lips.",
      },
      {
        phrase: "lock in",
        meaning: "trap natural moisture within skin",
        arabic: "يَحْبِسُ الرُّطُوبَة",
        example: "Lip balm helps lock in essential moisture against harsh winter winds.",
      },
    ],
    sentences: [
      {
        context: "Daily Care",
        en: "Apply a soothing beeswax lip balm to protect your lips from dry cold winds.",
        ar: "ضَعْ مُرَطِّبَ شِفَاهٍ مُهَدِّئًا بِشَمْعِ العَسَلِ لِحِمَايَةِ شَفَتَيْكَ مِنْ رِيَاحِ الشِّتَاءِ الجَافَّة.",
      },
      {
        context: "Chapped Skin",
        en: "Her chapped lips felt immediate relief after swiping on hydrating lip balm.",
        ar: "شَعَرَتْ شَفَتَاهَا المُتَشَقِّقَتَانِ بِرَاحَةٍ فَوْرِيَّةٍ بَعْدَ وَضْعِ مُرَطِّبِ الشِّفَاه.",
      },
      {
        context: "Everyday Carry",
        en: "He always carries a small tube of moisturizing lip balm in his coat pocket.",
        ar: "يَحْمِلُ دَائِمًا أُنْبُوبًا صَغِيرًا مِنْ مُرَطِّبِ الشِّفَاهِ فِي جَيْبِ مِعْطَفِه.",
      },
    ],
    exampleSentence: "Apply a soothing beeswax lip balm to protect your lips from dry cold winds.",
    exampleArabic:
      "ضَعْ مُرَطِّبَ شِفَاهٍ مُهَدِّئًا بِشَمْعِ العَسَلِ لِحِمَايَةِ شَفَتَيْكَ مِنْ رِيَاحِ الشِّتَاءِ الجَافَّة.",
  },
  "hand-soap": {
    id: "hand-soap",
    arabic: "صَابُونُ اليَدَيْن",
    partOfSpeech: "noun",
    phonetic: "ˈhænd soʊp",
    pronunciationTip: "'Hand' (/hænd/) followed by 'soap' (/soʊp/) with long 'o'.",
    collocations: [
      "liquid hand soap",
      "foaming hand soap",
      "antibacterial hand soap",
      "wash with hand soap",
      "hand soap dispenser",
      "fragrant hand soap",
    ],
    phrasalVerbs: [
      {
        phrase: "wash up",
        meaning: "clean hands before eating",
        arabic: "يَغْسِلُ يَدَيْهِ",
        example: "Always wash up with warm water and antibacterial hand soap before meals.",
      },
      {
        phrase: "rinse off",
        meaning: "clean suds away from palms",
        arabic: "يَشْطُفُ الصَّابُون",
        example: "Scrub your hands for twenty seconds and rinse off all soap suds completely.",
      },
    ],
    sentences: [
      {
        context: "Hygiene Practice",
        en: "Washing your hands with liquid hand soap and water for twenty seconds eliminates germs.",
        ar: "يَقْضِي غَسْلُ اليَدَيْنِ بِصَابُونِ اليَدَيْنِ السَّائِلِ وَالمَاءِ لِمُدَّةِ عِشْرِينَ ثَانِيَةً عَلَى الجَرَاثِيم.",
      },
      {
        context: "Sink Area",
        en: "The ceramic pump bottle beside the sink is filled with lavender scented hand soap.",
        ar: "قَارُورَةُ المِضَخَّةِ الخَزَفِيَّةُ بِجِوَارِ الحَوْضِ مُمْتَلِئَةٌ بِصَابُونِ يَدَيْنِ بِرَائِحَةِ اللافَنْدَر.",
      },
      {
        context: "Gentle Formula",
        en: "Use moisturizing hand soap with aloe vera to keep your hands soft after frequent washing.",
        ar: "اسْتَخْدِمْ صَابُونَ يَدَيْنِ مُرَطِّبًا بِالصَّبَّارِ لِلْحِفَاظِ عَلَى نُعُومَةِ يَدَيْكَ مَعَ تَكْرَارِ الغَسِيل.",
      },
    ],
    exampleSentence:
      "Washing your hands with liquid hand soap and water for twenty seconds eliminates germs.",
    exampleArabic:
      "يَقْضِي غَسْلُ اليَدَيْنِ بِصَابُونِ اليَدَيْنِ السَّائِلِ وَالمَاءِ لِمُدَّةِ عِشْرِينَ ثَانِيَةً عَلَى الجَرَاثِيم.",
  },
  "body-wash": {
    id: "body-wash",
    arabic: "سَائِلُ غَسِيلِ الجِسْم (غَسُولُ الجِسْم)",
    partOfSpeech: "noun",
    phonetic: "ˈbɑːdi wɑːʃ",
    pronunciationTip: "Stress first syllable: 'BO-dy' (/ˈbɑː.di/) + 'WASH' (/wɑːʃ/).",
    collocations: [
      "creamy body wash",
      "exfoliating body wash",
      "lather with body wash",
      "fragrance-free body wash",
      "bottle of body wash",
      "refreshing body wash",
    ],
    phrasalVerbs: [
      {
        phrase: "lather up",
        meaning: "produce rich bubbles on skin",
        arabic: "يَصْنَعُ رَغْوَة",
        example: "Lather up with the rich body wash using a bath sponge.",
      },
      {
        phrase: "wash away",
        meaning: "cleanse dirt and sweat from skin",
        arabic: "يَغْسِلُ الأَوْسَاخ",
        example: "The refreshing eucalyptus body wash washes away sweat and fatigue.",
      },
    ],
    sentences: [
      {
        context: "Shower Routine",
        en: "She preferred using a creamy hydrating body wash over a traditional bar of soap.",
        ar: "فَضَّلَتِ اسْتِخْدَامَ غَسُولِ جِسْمٍ كَرِيمِيٍّ مُرَطِّبٍ عَلَى قِطْعَةِ الصَّابُونِ التَّقْلِيدِيَّة.",
      },
      {
        context: "Sensitive Skin",
        en: "Dermatologists recommend fragrance-free body wash for individuals with sensitive skin.",
        ar: "يُوصِي أَطِبَّاءُ الجِلْدِيَّةِ بِغَسُولِ جِسْمٍ خَالٍ مِنَ العُطُورِ لِأَصْحَابِ البَشَرَةِ الحَسَّاسَة.",
      },
      {
        context: "Aromatherapy",
        en: "A citrus and mint body wash invigorates your senses and wakes you up in the morning.",
        ar: "يُنْعِشُ غَسُولُ الجِسْمِ بِالحَمْضِيَّاتِ وَالنَّعْنَاعِ حَوَاسَّكَ وَيَمْنَحُكَ النَّشَاطَ صَبَاحًا.",
      },
    ],
    exampleSentence:
      "She preferred using a creamy hydrating body wash over a traditional bar of soap.",
    exampleArabic:
      "فَضَّلَتِ اسْتِخْدَامَ غَسُولِ جِسْمٍ كَرِيمِيٍّ مُرَطِّبٍ عَلَى قِطْعَةِ الصَّابُونِ التَّقْلِيدِيَّة.",
  },
  "dental-floss": {
    id: "dental-floss",
    arabic: "خَيْطُ الأَسْنَان (خَيْطُ التَّنْظِيف)",
    partOfSpeech: "noun",
    phonetic: "ˌdɛntl ˈflɔːs",
    pronunciationTip: "'Dental' (/ˈdɛn.tl/) + 'floss' with open 'aw' sound (/flɔːs/).",
    collocations: [
      "waxed dental floss",
      "mint-flavored dental floss",
      "floss with dental floss",
      "spool of dental floss",
      "daily dental floss",
      "interdental floss",
    ],
    phrasalVerbs: [
      {
        phrase: "clean out",
        meaning: "remove food trapped between teeth",
        arabic: "يُنَظِّفُ مَا بَيْنَ الأَسْنَان",
        example: "Use dental floss daily to clean out plaque and food particles.",
      },
      {
        phrase: "pull out",
        meaning: "dispense string from holder",
        arabic: "يَسْحَبُ الخَيْط",
        example: "Pull out eighteen inches of dental floss and wrap it around your fingers.",
      },
    ],
    sentences: [
      {
        context: "Oral Health",
        en: "Dentists recommend using waxed dental floss every evening to remove plaque between teeth.",
        ar: "يُوصِي أَطِبَّاءُ الأَسْنَانِ بِاسْتِخْدَامِ خَيْطِ الأَسْنَانِ المُشَمَّعِ كُلَّ مَسَاءٍ لِإِزَالَةِ التَّرَسُّبَاتِ بَيْنَ الأَسْنَان.",
      },
      {
        context: "Routine",
        en: "Flossing with mint-flavored dental floss leaves your mouth feeling extraordinarily fresh.",
        ar: "يَتْرُكُ تَنْظِيفُ الأَسْنَانِ بِخَيْطِ الأَسْنَانِ بِنَكْهَةِ النَّعْنَاعِ فَمَكَ مُنْتَعِشًا لِلْغَايَة.",
      },
      {
        context: "Storage",
        en: "Keep a small plastic dispenser of dental floss right next to your toothbrush cup.",
        ar: "ضَعْ عُلْبَةَ خَيْطِ الأَسْنَانِ البْلاسْتِيكِيَّةَ الصَّغِيرَةَ بِجَانِبِ كُوبِ فُرْشَاةِ الأَسْنَانِ مُبَاشَرَةً.",
      },
    ],
    exampleSentence:
      "Dentists recommend using waxed dental floss every evening to remove plaque between teeth.",
    exampleArabic:
      "يُوصِي أَطِبَّاءُ الأَسْنَانِ بِاسْتِخْدَامِ خَيْطِ الأَسْنَانِ المُشَمَّعِ كُلَّ مَسَاءٍ لِإِزَالَةِ التَّرَسُّبَاتِ بَيْنَ الأَسْنَان.",
  },
  "face-wash": {
    id: "face-wash",
    arabic: "غَسُولُ الوَجْه (مُنَظِّفُ الوَجْه)",
    partOfSpeech: "noun",
    phonetic: "ˈfeɪs wɑːʃ",
    pronunciationTip: "'Face' (/feɪs/) followed by 'wash' (/wɑːʃ/).",
    collocations: [
      "foaming face wash",
      "gentle face wash",
      "acne face wash",
      "cleansing face wash",
      "oil-free face wash",
      "daily face wash",
    ],
    phrasalVerbs: [
      {
        phrase: "lather up",
        meaning: "work gel into cleansing foam",
        arabic: "يُرَغِّي الغَسُول",
        example: "Lather up a dime-sized drop of face wash between wet palms.",
      },
      {
        phrase: "rinse away",
        meaning: "wash off impurities with water",
        arabic: "يَشْطُفُ الوَجْه",
        example: "Rinse away all traces of face wash with cool water to close your pores.",
      },
    ],
    sentences: [
      {
        context: "Daily Cleansing",
        en: "Wash your face with a gentle foaming face wash morning and night to remove dirt and oils.",
        ar: "اغْسِلْ وَجْهَكَ بِغَسُولِ وَجْهٍ رَغَوِيٍّ لَطِيفٍ صَبَاحًا وَمَسَاءً لِإِزَالَةِ الأَوْسَاخِ وَالزُّيُوت.",
      },
      {
        context: "Skincare",
        en: "An exfoliating face wash with salicylic acid helps keep pores clear and prevents breakouts.",
        ar: "يُسَاعِدُ غَسُولُ الوَجْهِ المُقَشِّرُ بِحَمْضِ السَّالِيسِيلِيكِ عَلَى إِبْقَاءِ المَسَامِّ نَظِيفَةً وَمَنْعِ البُثُور.",
      },
      {
        context: "Bathroom Routine",
        en: "She keeps her favorite tea tree face wash right on the shelf inside the shower.",
        ar: "تَحْتَفِظُ بِغَسُولِ الوَجْهِ المُفَضَّلِ لَدَيْهَا بِشَجَرَةِ الشَّايِ عَلَى الرَّفِّ دَاخِلَ الدُّش.",
      },
    ],
    exampleSentence:
      "Wash your face with a gentle foaming face wash morning and night to remove dirt and oils.",
    exampleArabic:
      "اغْسِلْ وَجْهَكَ بِغَسُولِ وَجْهٍ رَغَوِيٍّ لَطِيفٍ صَبَاحًا وَمَسَاءً لِإِزَالَةِ الأَوْسَاخِ وَالزُّيُوت.",
  },
  "hand-sanitizer": {
    id: "hand-sanitizer",
    arabic: "مُعَقِّمُ اليَدَيْن (مُطَهِّرُ اليَدَيْن)",
    partOfSpeech: "noun",
    phonetic: "ˈhænd ˌsænɪtaɪzər",
    pronunciationTip: "'Hand' (/hænd/) + 'SAN-i-ti-zer' (/ˈsæn.ɪ.taɪ.zər/).",
    collocations: [
      "alcohol hand sanitizer",
      "gel hand sanitizer",
      "pocket hand sanitizer",
      "apply hand sanitizer",
      "rub with hand sanitizer",
      "hand sanitizer dispenser",
    ],
    phrasalVerbs: [
      {
        phrase: "rub together",
        meaning: "spread disinfectant across palms",
        arabic: "يَفْرُكُ اليَدَيْن",
        example: "Rub hands together briskly until the alcohol sanitizer evaporates completely.",
      },
      {
        phrase: "wipe down",
        meaning: "sanitize surfaces or skin",
        arabic: "يُعَقِّمُ بِالمُطَهِّر",
        example: "Use hand sanitizer to disinfect your hands when soap and water are unavailable.",
      },
    ],
    sentences: [
      {
        context: "Public Hygiene",
        en: "Apply alcohol-based hand sanitizer to kill bacteria when soap and running water are unavailable.",
        ar: "ضَعْ مُعَقِّمَ اليَدَيْنِ القَائِمَ عَلَى الكُحُولِ لِلْقَضَاءِ عَلَى البَكْتِيرْيَا عِنْدَ عَدَمِ تَوَفُّرِ المَاءِ وَالصَّابُون.",
      },
      {
        context: "Travel",
        en: "He clipped a small travel-sized bottle of hand sanitizer to his backpack zipper.",
        ar: "عَلَّقَ قَارُورَةً صَغِيرَةً لِلسَّفَرِ مِنْ مُعَقِّمِ اليَدَيْنِ فِي سَحَّابِ حَقِيبَةِ ظَهْرِه.",
      },
      {
        context: "Effective Use",
        en: "Rub the hand sanitizer over all surfaces of both hands until they feel completely dry.",
        ar: "افْرُكْ مُعَقِّمَ اليَدَيْنِ عَلَى جَمِيعِ أَجْزَاءِ يَدَيْكَ حَتَّى تَجِفَّ تَمَامًا.",
      },
    ],
    exampleSentence:
      "Apply alcohol-based hand sanitizer to kill bacteria when soap and running water are unavailable.",
    exampleArabic:
      "ضَعْ مُعَقِّمَ اليَدَيْنِ القَائِمَ عَلَى الكُحُولِ لِلْقَضَاءِ عَلَى البَكْتِيرْيَا عِنْدَ عَدَمِ تَوَفُّرِ المَاءِ وَالصَّابُون.",
  },
  "wet-wipes": {
    id: "wet-wipes",
    arabic: "مَنَادِيلُ مُبَلَّلَة (مَنَادِيلُ مَرْطُوبَة)",
    partOfSpeech: "noun",
    phonetic: "ˈwɛt waɪps",
    pronunciationTip: "'Wet' (/wɛt/) + 'wipes' (/waɪps/) with long 'i' and plural 's'.",
    collocations: [
      "antibacterial wet wipes",
      "pack of wet wipes",
      "flushable wet wipes",
      "cleaning wet wipes",
      "baby wet wipes",
      "biodegradable wet wipes",
    ],
    phrasalVerbs: [
      {
        phrase: "pull out",
        meaning: "dispense a sheet from pack",
        arabic: "يَسْحَبُ مَنْدِيلًا",
        example: "Pull out a fresh sheet of wet wipes and seal the resealable flap tightly.",
      },
      {
        phrase: "wipe down",
        meaning: "clean hands or counter with moist towelette",
        arabic: "يَمْسَحُ بِالمَنَادِيل",
        example: "Wipe down the bathroom sink handle with an antibacterial wet wipe.",
      },
    ],
    sentences: [
      {
        context: "Quick Cleanups",
        en: "She used refreshing antibacterial wet wipes to quickly clean her hands on the go.",
        ar: "اسْتَخْدَمَتْ مَنَادِيلَ مُبَلَّلَةً مُضَادَّةً لِلْبَكْتِيرْيَا لِتَنْظِيفِ يَدَيْهَا بِسُرْعَةٍ أَثْنَاءَ التَّنَقُّل.",
      },
      {
        context: "Bathroom Storage",
        en: "Keep a pack of biodegradable wet wipes stored neatly in the bathroom vanity drawer.",
        ar: "احْتَفِظْ بِعَبْوَةِ مَنَادِيلَ مُبَلَّلَةٍ قَابِلَةٍ لِلتَّحَلُّلِ فِي دُرْجِ خِزَانَةِ الحَمَّام.",
      },
      {
        context: "Packaging",
        en: "Always close the moisture-lock lid of the wet wipes package to prevent them from drying out.",
        ar: "أَغْلِقْ دَائِمًا غِطَاءَ حِفْظِ الرُّطُوبَةِ لِعَبْوَةِ المَنَادِيلِ المُبَلَّلَةِ لِمَنْعِ جَفَافِهَا.",
      },
    ],
    exampleSentence:
      "She used refreshing antibacterial wet wipes to quickly clean her hands on the go.",
    exampleArabic:
      "اسْتَخْدَمَتْ مَنَادِيلَ مُبَلَّلَةً مُضَادَّةً لِلْبَكْتِيرْيَا لِتَنْظِيفِ يَدَيْهَا بِسُرْعَةٍ أَثْنَاءَ التَّنَقُّل.",
  },
  brush: {
    id: "brush",
    arabic: "فُرْشَاةُ تَنْظِيف (فُرْشَاة)",
    partOfSpeech: "noun",
    phonetic: "brʌʃ",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'cup', ending in 'sh' (/ʃ/).",
    collocations: [
      "toilet brush",
      "scrub brush",
      "stiff-bristle brush",
      "cleaning brush",
      "scrub with a brush",
      "brush holder",
    ],
    phrasalVerbs: [
      {
        phrase: "scrub down",
        meaning: "clean vigorously with stiff bristles",
        arabic: "يَحُكُّ بِالفُرْشَاة",
        example: "Scrub down the porcelain toilet bowl with the disinfectant brush.",
      },
      {
        phrase: "rinse out",
        meaning: "clean brush bristles under running water",
        arabic: "يَشْطُفُ الفُرْشَاة",
        example: "Rinse out the cleaning brush under hot water after scrubbing.",
      },
    ],
    sentences: [
      {
        context: "Bathroom Cleaning",
        en: "Use a long-handled stiff brush with disinfectant to scrub the toilet bowl thoroughly.",
        ar: "اسْتَخْدِمْ فُرْشَاةً قَاسِيَةً ذَاتَ مِقْبَضٍ طَوِيلٍ مَعَ المُطَهِّرِ لِفَرْكِ المِرْحَاضِ جَيِّدًا.",
      },
      {
        context: "Tile Maintenance",
        en: "A small detail brush is great for cleaning grime out of tile grout lines.",
        ar: "تُعَدُّ فُرْشَاةُ التَّنْظِيفِ الصَّغِيرَةُ مُمْتَازَةً لِإِزَالَةِ الأَوْسَاخِ مِنْ خُطُوطِ البَلَاط.",
      },
      {
        context: "Storage",
        en: "Place the toilet brush back into its ventilated stand to air dry hygienically.",
        ar: "ضَعْ فُرْشَاةَ المِرْحَاضِ فِي حَامِلِهَا جَيِّدِ التَّهْوِيَةِ لِتَجِفَّ بِطَرِيقَةٍ صِحِّيَّة.",
      },
    ],
    exampleSentence:
      "Use a long-handled stiff brush with disinfectant to scrub the toilet bowl thoroughly.",
    exampleArabic:
      "اسْتَخْدِمْ فُرْشَاةً قَاسِيَةً ذَاتَ مِقْبَضٍ طَوِيلٍ مَعَ المُطَهِّرِ لِفَرْكِ المِرْحَاضِ جَيِّدًا.",
  },
  gloves: {
    id: "gloves",
    arabic: "قُفَّازَاتُ تَنْظِيف (قُفَّازَات)",
    partOfSpeech: "noun",
    phonetic: "ɡlʌvz",
    pronunciationTip: "Short 'u' sound /ʌ/ followed by voiced /vz/ (rhymes with 'loves').",
    collocations: [
      "rubber gloves",
      "cleaning gloves",
      "pair of gloves",
      "protective gloves",
      "yellow latex gloves",
      "wear gloves",
    ],
    phrasalVerbs: [
      {
        phrase: "put on",
        meaning: "wear protective gloves on hands",
        arabic: "يَرْتَدِي القُفَّازَات",
        example: "Put on rubber gloves before handling strong bleach and bathroom cleaners.",
      },
      {
        phrase: "take off",
        meaning: "remove gloves after cleaning",
        arabic: "يَخْلَعُ القُفَّازَات",
        example: "Take off the gloves inside-out to avoid touching cleaning chemicals.",
      },
    ],
    sentences: [
      {
        context: "Safety During Cleaning",
        en: "Wear durable yellow rubber gloves to protect your hands from harsh bathroom cleaning chemicals.",
        ar: "ارْتَدِ قُفَّازَاتٍ مَطَّاطِيَّةً صَفْرَاءَ مَتِينَةً لِحِمَايَةِ يَدَيْكَ مِنْ مَوَادِّ التَّنْظِيفِ الكِيمْيَائِيَّةِ القَاسِيَة.",
      },
      {
        context: "Skin Protection",
        en: "Cleaning gloves prevent detergents from drying out your skin and fingernails.",
        ar: "تَمْنَعُ قُفَّازَاتُ التَّنْظِيفِ المُنَظِّفَاتِ مِنْ تَجْفِيفِ بَشَرَتِكَ وَأَظَافِرِك.",
      },
      {
        context: "Drying",
        en: "Hang the damp rubber gloves over the edge of the bucket to dry after use.",
        ar: "عَلِّقِ القُفَّازَاتِ المَطَّاطِيَّةَ الرَّطْبَةَ عَلَى حَافَّةِ الدَّلْوِ لِتَجِفَّ بَعْدَ الاسْتِخْدَام.",
      },
    ],
    exampleSentence:
      "Wear durable yellow rubber gloves to protect your hands from harsh bathroom cleaning chemicals.",
    exampleArabic:
      "ارْتَدِ قُفَّازَاتٍ مَطَّاطِيَّةً صَفْرَاءَ مَتِينَةً لِحِمَايَةِ يَدَيْكَ مِنْ مَوَادِّ التَّنْظِيفِ الكِيمْيَائِيَّةِ القَاسِيَة.",
  },
  "spray-bottle": {
    id: "spray-bottle",
    arabic: "بَخَّاخ (قَارُورَةُ رَش)",
    partOfSpeech: "noun",
    phonetic: "ˈspreɪ ˌbɑːtl",
    pronunciationTip: "'Spray' (/spreɪ/) + 'bottle' (/ˈbɑː.tl/).",
    collocations: [
      "cleaner spray bottle",
      "plastic spray bottle",
      "spray with a bottle",
      "adjustable spray bottle",
      "trigger spray bottle",
      "glass spray bottle",
    ],
    phrasalVerbs: [
      {
        phrase: "spray on",
        meaning: "mist disinfectant onto surface",
        arabic: "يَرُشُّ عَلَى",
        example: "Spray on glass cleaner from the bottle onto the foggy mirror.",
      },
      {
        phrase: "fill up",
        meaning: "pour cleaner liquid into container",
        arabic: "يَمْلَأُ البَخَّاخ",
        example: "Fill up the spray bottle with a mixture of vinegar and warm water.",
      },
    ],
    sentences: [
      {
        context: "Bathroom Cleaning",
        en: "Fill a trigger spray bottle with vinegar and water for a natural eco-friendly mirror cleaner.",
        ar: "امْلَأْ بَخَّاخًا بِمَزِيجِ الخَلِّ وَالمَاءِ لِلْحُصُولِ عَلَى مُنَظِّفِ مَرَايَا طَبِيعِيٍّ وَصَدِيقٍ لِلْبِيئَة.",
      },
      {
        context: "Disinfection",
        en: "She used the spray bottle to mist disinfectant evenly across the bathroom countertops.",
        ar: "اسْتَخْدَمَتِ البَخَّاخَ لِرَشِّ المُطَهِّرِ بِالتَّسَاوِي عَلَى أَسْطُحِ الحَمَّام.",
      },
      {
        context: "Nozzle Adjustment",
        en: "Turn the nozzle on the spray bottle from stream to fine mist for wide surface coverage.",
        ar: "قُمْ بِتَدْوِيرِ فُوَّهَةِ البَخَّاخِ مِنَ التَّدَفُّقِ إِلَى الرَّذَاذِ النَّاعِمِ لِتَغْطِيَةِ المِسَاحَاتِ الوَاسِعَة.",
      },
    ],
    exampleSentence:
      "Fill a trigger spray bottle with vinegar and water for a natural eco-friendly mirror cleaner.",
    exampleArabic:
      "امْلَأْ بَخَّاخًا بِمَزِيجِ الخَلِّ وَالمَاءِ لِلْحُصُولِ عَلَى مُنَظِّفِ مَرَايَا طَبِيعِيٍّ وَصَدِيقٍ لِلْبِيئَة.",
  },
  cloth: {
    id: "cloth",
    arabic: "قِمَاشَةُ تَنْظِيف (فُوطَةُ مَسْح)",
    partOfSpeech: "noun",
    phonetic: "klɔːθ",
    pronunciationTip: "Short open 'aw' sound /ɔː/ ending in soft unvoiced 'th' (/θ/).",
    collocations: [
      "microfiber cloth",
      "damp cloth",
      "cleaning cloth",
      "wipe with a cloth",
      "dusting cloth",
      "lint-free cloth",
    ],
    phrasalVerbs: [
      {
        phrase: "wipe down",
        meaning: "clean surfaces thoroughly with cloth",
        arabic: "يَمْسَحُ بِالقِمَاشَة",
        example: "Wipe down the chrome faucet and marble counter with a dry microfiber cloth.",
      },
      {
        phrase: "wring out",
        meaning: "squeeze excess water from wet rag",
        arabic: "يَعْصِرُ القِمَاشَة",
        example: "Wring out the wet cleaning cloth before polishing the mirrors.",
      },
    ],
    sentences: [
      {
        context: "Polishing Surfaces",
        en: "Use a dry microfiber cloth to buff chrome bathroom faucets to a brilliant shine.",
        ar: "اسْتَخْدِمْ قِمَاشَةَ مَايْكْرُوفَايْبِر جَافَّةً لِتَلْمِيعِ صَنَابِيرِ الحَمَّامِ المَطْلِيَّةِ بِالكُرُوم.",
      },
      {
        context: "Cleaning Routine",
        en: "Wipe down the bathroom counter every evening with a warm damp cloth.",
        ar: "امْسَحْ سَطْحَ خِزَانَةِ الحَمَّامِ كُلَّ مَسَاءٍ بِقِمَاشَةٍ رَطْبَةٍ وَدَافِئَة.",
      },
      {
        context: "Lint-Free Results",
        en: "A lint-free cleaning cloth leaves glass shower doors sparkling and streak-free.",
        ar: "تَتْرُكُ قِمَاشَةُ التَّنْظِيفِ الخَالِيَةُ مِنَ الوَبَرِ أَبْوَابَ الدُّشِّ الزُّجَاجِيَّةَ لاَمِعَةً دُونَ آثَار.",
      },
    ],
    exampleSentence:
      "Use a dry microfiber cloth to buff chrome bathroom faucets to a brilliant shine.",
    exampleArabic:
      "اسْتَخْدِمْ قِمَاشَةَ مَايْكْرُوفَايْبِر جَافَّةً لِتَلْمِيعِ صَنَابِيرِ الحَمَّامِ المَطْلِيَّةِ بِالكُرُوم.",
  },
  squeegee: {
    id: "squeegee",
    arabic: "مِمْسَحَةُ زُجَاجٍ مَطَّاطِيَّة (قَشَّاطَة)",
    partOfSpeech: "noun",
    phonetic: "ˈskwiːdʒiː",
    pronunciationTip: "Pronounce as 'SKWEE-jee' with long /iː/ sounds (/ˈskwiː.dʒiː/).",
    collocations: [
      "shower squeegee",
      "rubber squeegee",
      "wipe with a squeegee",
      "window squeegee",
      "stainless squeegee",
      "silicone squeegee",
    ],
    phrasalVerbs: [
      {
        phrase: "wipe down",
        meaning: "scrape water droplets off glass",
        arabic: "يَقْشُطُ المَاء",
        example: "Wipe down the shower glass using smooth top-to-bottom squeegee strokes.",
      },
      {
        phrase: "hang up",
        meaning: "store squeegee on shower hook",
        arabic: "يُعَلِّقُ القَشَّاطَة",
        example: "Hang up the squeegee on the suction hook inside the shower stall.",
      },
    ],
    sentences: [
      {
        context: "Shower Glass Care",
        en: "Use a rubber squeegee after showering to scrape water droplets off the glass doors.",
        ar: "اسْتَخْدِمْ مِمْسَحَةَ الزُّجَاجِ المَطَّاطِيَّةَ بَعْدَ الاسْتِحْمَامِ لِقَشْطِ قَطَرَاتِ المَاءِ عَنِ الأَبْوَابِ الزُّجَاجِيَّة.",
      },
      {
        context: "Preventing Limescale",
        en: "Regularly using a squeegee prevents hard water mineral spots from forming on bathroom tiles.",
        ar: "يَمْنَعُ اسْتِخْدَامُ المِمْسَحَةِ المَطَّاطِيَّةِ بِانْتِظَامٍ تَشَكُّلَ بُقَعِ الأَمْلاحِ المَعْدَنِيَّةِ عَلَى بَلَاطِ الحَمَّام.",
      },
      {
        context: "Design",
        en: "The stainless steel squeegee hangs conveniently from a suction cup on the shower wall.",
        ar: "تُعَلَّقُ المِمْسَحَةُ المَطَّاطِيَّةُ المَصْنُوعَةُ مِنَ الفُولاذِ المُقَاوِمِ لِلصَّدَأِ بِسُهُولَةٍ عَلَى جِدَارِ الدُّش.",
      },
    ],
    exampleSentence:
      "Use a rubber squeegee after showering to scrape water droplets off the glass doors.",
    exampleArabic:
      "اسْتَخْدِمْ مِمْسَحَةَ الزُّجَاجِ المَطَّاطِيَّةَ بَعْدَ الاسْتِحْمَامِ لِقَشْطِ قَطَرَاتِ المَاءِ عَنِ الأَبْوَابِ الزُّجَاجِيَّة.",
  },
  swing: {
    id: "swing",
    arabic: "أُرْجُوحَة",
    partOfSpeech: "noun",
    phonetic: "swɪŋ",
    pronunciationTip: "Single syllable with smooth /w/ blend: 'SWING' (/swɪŋ/).",
    collocations: [
      "swing set",
      "tire swing",
      "push on the swing",
      "high swing",
      "swing chains",
      "sit on the swing",
    ],
    phrasalVerbs: [
      {
        phrase: "swing by",
        meaning: "visit briefly",
        arabic: "يَمُرُّ سَرِيعًا",
        example: "We can swing by the local park after school.",
      },
      {
        phrase: "swing back",
        meaning: "move in return pendulum arc",
        arabic: "يَتَرَجَّحُ عَائِدًا",
        example: "The wooden swing swayed back and forth gently.",
      },
    ],
    sentences: [
      {
        context: "Playground Fun",
        en: "Children waited eagerly for their turn on the tall swing set.",
        ar: "انْتَظَرَ الأَطْفَالُ بِحَمَاسٍ دَوْرَهُمْ عَلَى مَجْمُوعَةِ الأَرَاجِيحِ العَالِيَةِ.",
      },
      {
        context: "Park Recreation",
        en: "Her father gave her a gentle push on the rubber tire swing.",
        ar: "دَفَعَهَا وَالِدُهَا دَفْعَةً لَطِيفَةً عَلَى أُرْجُوحَةِ الإِطَارِ المَطَّاطِيِّ.",
      },
      {
        context: "Motion",
        en: "Pumping her legs helped her soar higher into the fresh air.",
        ar: "سَاعَدَهَا تَحْرِيكُ سَاقَيْهَا عَلَى التَّحْلِيقِ أَعْلَى فِي الهَوَاءِ المُنْعِشِ.",
      },
    ],
    exampleSentence: "Children waited eagerly for their turn on the tall swing set.",
    exampleArabic:
      "انْتَظَرَ الأَطْفَالُ بِحَمَاسٍ دَوْرَهُمْ عَلَى مَجْمُوعَةِ الأَرَاجِيحِ العَالِيَةِ.",
  },
  slide: {
    id: "slide",
    arabic: "زُحْلَيْقَة (مُنْزَلَق)",
    partOfSpeech: "noun",
    phonetic: "slaɪd",
    pronunciationTip: "Long 'i' diphthong /aɪ/ ending in a soft /d/.",
    collocations: [
      "spiral slide",
      "water slide",
      "playground slide",
      "climb up the slide",
      "go down the slide",
      "steep slide",
    ],
    phrasalVerbs: [
      {
        phrase: "slide down",
        meaning: "descend smoothly on a chute",
        arabic: "يَتَزَحْلَقُ لِلأَسْفَل",
        example: "The children love to slide down the curved yellow chute.",
      },
      {
        phrase: "slide by",
        meaning: "pass effortlessly",
        arabic: "يَمُرُّ بِسَلاسَة",
        example: "Afternoons at the park always seem to slide by quickly.",
      },
    ],
    sentences: [
      {
        context: "Playground Fun",
        en: "She climbed the ladder and zipped down the colorful spiral slide.",
        ar: "صَعِدَتِ السُّلَّمَ وَانْزَلَقَتْ بِسُرْعَةٍ عَلَى الزُّحْلَيْقَةِ اللَّوْلَبِيَّةِ المُلَوَّنَةِ.",
      },
      {
        context: "Safety",
        en: "Wait until the bottom of the slide is clear before descending.",
        ar: "انْتَظِرْ حَتَّى يَفْرُغَ أَسْفَلُ المُنْزَلَقِ قَبْلَ النُّزُولِ.",
      },
      {
        context: "Park Design",
        en: "The playground features a double slide for racing friends.",
        ar: "يَحْتَوِي المَلْعَبُ عَلَى زُحْلَيْقَةٍ مُزْدَوَجَةٍ لِمُسَابَقَةِ الأَصْدِقَاءِ.",
      },
    ],
    exampleSentence: "She climbed the ladder and zipped down the colorful spiral slide.",
    exampleArabic:
      "صَعِدَتِ السُّلَّمَ وَانْزَلَقَتْ بِسُرْعَةٍ عَلَى الزُّحْلَيْقَةِ اللَّوْلَبِيَّةِ المُلَوَّنَةِ.",
  },
  seesaw: {
    id: "seesaw",
    arabic: "أُرْجُوحَةُ التَّوَازُن (سِيسُو)",
    partOfSpeech: "noun",
    phonetic: "ˈsiːsɔː",
    pronunciationTip: "Two distinct syllables: 'SEE-saw' (/ˈsiː.sɔː/).",
    collocations: [
      "wooden seesaw",
      "ride the seesaw",
      "seesaw motion",
      "seesaw partner",
      "spring seesaw",
      "balance on the seesaw",
    ],
    phrasalVerbs: [
      {
        phrase: "tilt up",
        meaning: "rise as the other side dips",
        arabic: "يَرْتَفِعُ لِلأَعْلَى",
        example: "He pushed off the ground to tilt his side of the board up.",
      },
    ],
    sentences: [
      {
        context: "Playground Dynamics",
        en: "Two friends giggled as they balanced each other on the wooden seesaw.",
        ar: "ضَحِكَ صَدِيقَانِ وَهُمَا يُحَقِّقَانِ التَّوَازُنَ عَلَى أُرْجُوحَةِ السِّيسُو الخَشَبِيَّةِ.",
      },
      {
        context: "Physics of Play",
        en: "Pushing your feet off the mulch launches the seesaw upward.",
        ar: "دَفْعُ قَدَمَيْكَ عَنِ الأَرْضِ يُطْلِقُ أُرْجُوحَةَ التَّوَازُنِ إِلَى الأَعْلَى.",
      },
      {
        context: "Equipment",
        en: "Modern playgrounds install seesaws with shock-absorbing springs.",
        ar: "تُثَبِّتُ المَلَاعِبُ الحَدِيثَةُ أَرَاجِيحَ تَبَادُلِيَّةً مُزَوَّدَةً بِزَنْبَرَكَاتٍ مَاصَّةٍ لِلصَّدَمَاتِ.",
      },
    ],
    exampleSentence: "Two friends giggled as they balanced each other on the wooden seesaw.",
    exampleArabic:
      "ضَحِكَ صَدِيقَانِ وَهُمَا يُحَقِّقَانِ التَّوَازُنَ عَلَى أُرْجُوحَةِ السِّيسُو الخَشَبِيَّةِ.",
  },
  "climbing-frame": {
    id: "climbing-frame",
    arabic: "هَيْكَلُ التَّسَلُّق (شَبَكَةُ التَّسَلُّق)",
    partOfSpeech: "noun",
    phonetic: "ˈklaɪmɪŋ freɪm",
    pronunciationTip: "Silent 'b' in 'climbing' (/ˈklaɪ.mɪŋ freɪm/).",
    collocations: [
      "wooden climbing frame",
      "jungle gym climbing frame",
      "rope climbing frame",
      "reach the top of the climbing frame",
      "climbing frame platform",
      "steel climbing frame",
    ],
    phrasalVerbs: [
      {
        phrase: "climb over",
        meaning: "cross over the top bars",
        arabic: "يَتَسَلَّقُ فَوْقَ",
        example: "He learned how to safely climb over the highest rung.",
      },
    ],
    sentences: [
      {
        context: "Physical Activity",
        en: "Children scrambled up the geometric dome of the climbing frame.",
        ar: "تَسَلَّقَ الأَطْفَالُ القُبَّةَ الهَنْدَسِيَّةَ لِهَيْكَلِ التَّسَلُّقِ.",
      },
      {
        context: "Park Play",
        en: "The wooden climbing frame features rope ladders and a viewing turret.",
        ar: "يَتَمَيَّزُ هَيْكَلُ التَّسَلُّقِ الخَشَبِيُّ بِسَلَالِمَ حَبْلِيَّةٍ وَبُرْجِ مُرَاقَبَةٍ.",
      },
      {
        context: "Skill Development",
        en: "Navigating the frame builds upper-body strength and spatial awareness.",
        ar: "يَبْنِي اجْتِيَازُ هَيْكَلِ التَّسَلُّقِ قُوَّةَ الجُزْءِ العُلْوِيِّ مِنَ الجِسْمِ وَالوَعْيَ المَكَانِيَّ.",
      },
    ],
    exampleSentence: "Children scrambled up the geometric dome of the climbing frame.",
    exampleArabic: "تَسَلَّقَ الأَطْفَالُ القُبَّةَ الهَنْدَسِيَّةَ لِهَيْكَلِ التَّسَلُّقِ.",
  },
  sandbox: {
    id: "sandbox",
    arabic: "صُنْدُوقُ الرِّمَال (حُفْرَةُ الرَّمْل)",
    partOfSpeech: "noun",
    phonetic: "ˈsændbɑːks",
    pronunciationTip: "Compound word with primary stress on 'SAND': /ˈsænd.bɑːks/.",
    collocations: [
      "build in the sandbox",
      "sandbox toys",
      "wooden sandbox",
      "bucket and spade in the sandbox",
      "covered sandbox",
      "play in the sandbox",
    ],
    phrasalVerbs: [
      {
        phrase: "dig out",
        meaning: "scoop sand to make a trench",
        arabic: "يَحْفِرُ فِي الرَّمْل",
        example: "The toddlers dug out deep trenches for their toy trucks.",
      },
    ],
    sentences: [
      {
        context: "Creative Play",
        en: "The toddlers molded towers and castles inside the shaded sandbox.",
        ar: "شَكَّلَ الأَطْفَالُ الصِّغَارُ أَبْرَاجًا وَقِلَاعًا دَاخِلَ صُنْدُوقِ الرِّمَالِ المُظَلَّلِ.",
      },
      {
        context: "Equipment",
        en: "Plastic buckets, shovels, and sifters were scattered across the sandbox.",
        ar: "تَنَاثَرَتِ الدِّلَاءُ البْلاسْتِيكِيَّةُ وَالمَجَارِفُ وَالمَنَاخِلُ عَبْرَ حُفْرَةِ الرَّمْلِ.",
      },
      {
        context: "Park Maintenance",
        en: "The park groundskeeper covered the sandbox to protect it from rain.",
        ar: "غَطَّى حَارِسُ الحَدِيقَةِ صُنْدُوقَ الرِّمَالِ لِحِمَايَتِهِ مِنَ المَطَرِ.",
      },
    ],
    exampleSentence: "The toddlers molded towers and castles inside the shaded sandbox.",
    exampleArabic:
      "شَكَّلَ الأَطْفَالُ الصِّغَارُ أَبْرَاجًا وَقِلَاعًا دَاخِلَ صُنْدُوقِ الرِّمَالِ المُظَلَّلِ.",
  },
  "monkey-bars": {
    id: "monkey-bars",
    arabic: "سُلَّمُ التَّسَلُّقِ الأُفُقِيّ (قُضْبَانُ التَّعَلُّق)",
    partOfSpeech: "noun",
    phonetic: "ˈmʌŋki bɑːrz",
    pronunciationTip: "Pronounce 'MON-key' followed by 'bars': /ˈmʌŋ.ki bɑːrz/.",
    collocations: [
      "swing across monkey bars",
      "reach the next rung of monkey bars",
      "steel monkey bars",
      "grip the monkey bars",
      "cross the monkey bars",
      "fall from monkey bars",
    ],
    phrasalVerbs: [
      {
        phrase: "hang on",
        meaning: "grip firmly with hands",
        arabic: "يَتَمَسَّكُ بِإِحْكَام",
        example: "Hang on tightly with both hands as you traverse each bar.",
      },
    ],
    sentences: [
      {
        context: "Gymnastics & Play",
        en: "He swung smoothly from rung to rung across the elevated monkey bars.",
        ar: "تَأَرْجَحَ بِسَلاسَةٍ مِنْ دَرَجَةٍ إِلَى أُخْرَى عَبْرَ قُضْبَانِ التَّعَلُّقِ المُرْتَفِعَةِ.",
      },
      {
        context: "Achievement",
        en: "She cheered proudly after conquering the entire length of monkey bars.",
        ar: "هَتَفَتْ بِفَخْرٍ بَعْدَ أَنِ اجْتَازَتْ كَامِلَ طُولِ سُلَّمِ التَّعَلُّقِ الأُفُقِيِّ.",
      },
      {
        context: "Safety Cushioning",
        en: "Thick rubber surfacing lies beneath the monkey bars to cushion landings.",
        ar: "تَمْتَدُّ أَرْضِيَّةٌ مَطَّاطِيَّةٌ سَمِيكَةٌ تَحْتَ قُضْبَانِ التَّعَلُّقِ لِامْتِصَاصِ الصَّدَمَاتِ عِنْدَ الهُبُوطِ.",
      },
    ],
    exampleSentence: "He swung smoothly from rung to rung across the elevated monkey bars.",
    exampleArabic:
      "تَأَرْجَحَ بِسَلاسَةٍ مِنْ دَرَجَةٍ إِلَى أُخْرَى عَبْرَ قُضْبَانِ التَّعَلُّقِ المُرْتَفِعَةِ.",
  },
  "merry-go-round": {
    id: "merry-go-round",
    arabic: "دَوَّارَةُ الأَلْعَاب (لُعْبَةُ الدَّوَرَان)",
    partOfSpeech: "noun",
    phonetic: "ˌmɛri ɡoʊ ˈraʊnd",
    pronunciationTip: "Hyphenated compound with primary stress on 'ROUND': /ˌmɛr.i.ɡoʊˈraʊnd/.",
    collocations: [
      "spin the merry-go-round",
      "ride the merry-go-round",
      "whirl on the merry-go-round",
      "playground merry-go-round",
      "jump onto the merry-go-round",
      "metal merry-go-round",
    ],
    phrasalVerbs: [
      {
        phrase: "spin around",
        meaning: "rotate rapidly in a circle",
        arabic: "يَدُورُ بِسُرْعَة",
        example: "The platform spun around smoothly as older kids ran beside it.",
      },
    ],
    sentences: [
      {
        context: "Playground Fun",
        en: "Laughter echoed as the children spun fast on the classic merry-go-round.",
        ar: "تَرَدَّدَتْ أَصْدَاءُ الضَّحَكَاتِ بَيْنَمَا دَارَ الأَطْفَالُ بِسُرْعَةٍ عَلَى دَوَّارَةِ الأَلْعَابِ الكْلاسِيكِيَّةِ.",
      },
      {
        context: "Teamwork",
        en: "Two kids pushed the outer handles while their friends enjoyed the whirling ride.",
        ar: "دَفَعَ طِفْلَانِ المَقَابِضَ الخَارِجِيَّةَ بَيْنَمَا اسْتَمْتَعَ أَصْدِقَاؤُهُمَا بِالدَّوَرَانِ السَّرِيعِ.",
      },
      {
        context: "Safety",
        en: "Hold onto the safety railings until the merry-go-round comes to a full stop.",
        ar: "تَمَسَّكْ بِحَوَاجِزِ الأَمَانِ حَتَّى تَتَوَقَّفَ لُعْبَةُ الدَّوَرَانِ تَمَامًا.",
      },
    ],
    exampleSentence: "Laughter echoed as the children spun fast on the classic merry-go-round.",
    exampleArabic:
      "تَرَدَّدَتْ أَصْدَاءُ الضَّحَكَاتِ بَيْنَمَا دَارَ الأَطْفَالُ بِسُرْعَةٍ عَلَى دَوَّارَةِ الأَلْعَابِ الكْلاسِيكِيَّةِ.",
  },
  "spring-rider": {
    id: "spring-rider",
    arabic: "لُعْبَةُ الزَّنْبَرَكِ الهَزَّازَة",
    partOfSpeech: "noun",
    phonetic: "ˈsprɪŋ ˌraɪdər",
    pronunciationTip: "Pronounce 'spring' (/sprɪŋ/) then 'rider' (/ˈraɪ.dər/).",
    collocations: [
      "horse spring rider",
      "bounce on the spring rider",
      "toddler spring rider",
      "durable spring rider",
      "rock on the spring rider",
      "duck spring rider",
    ],
    phrasalVerbs: [
      {
        phrase: "bounce back",
        meaning: "recoil on the heavy coil",
        arabic: "يَرْتَدُّ بِفِعْلِ الزَّنْبَرَك",
        example: "The coiled steel base bounced back smoothly with each push.",
      },
    ],
    sentences: [
      {
        context: "Toddler Area",
        en: "The toddler rocked happily on the colorful dolphin spring rider.",
        ar: "تَأَرْجَحَ الطِّفْلُ الصَّغِيرُ بِسَعَادَةٍ عَلَى لُعْبَةِ الدُّلْفِينِ الزَّنْبَرَكِيَّةِ الهَزَّازَةِ.",
      },
      {
        context: "Equipment",
        en: "Mounted on a heavy steel coil, the spring rider sways back and forth safely.",
        ar: "مُثَبَّتَةً عَلَى زَنْبَرَكٍ فُولاذِيٍّ قَوِيٍّ، تَتَمَايَلُ اللُّعْبَةُ الهَزَّازَةُ ذَهَابًا وَإِيَابًا بِأَمَانٍ.",
      },
      {
        context: "Park Variety",
        en: "The tot lot includes four spring riders shaped like animals and cars.",
        ar: "تَضُمُّ مِنْطَقَةُ الصِّغَارِ أَرْبَعَ لُعَبٍ زَنْبَرَكِيَّةٍ عَلَى أَشْكَالِ حَيَوَانَاتٍ وَسَيَّارَاتٍ.",
      },
    ],
    exampleSentence: "The toddler rocked happily on the colorful dolphin spring rider.",
    exampleArabic:
      "تَأَرْجَحَ الطِّفْلُ الصَّغِيرُ بِسَعَادَةٍ عَلَى لُعْبَةِ الدُّلْفِينِ الزَّنْبَرَكِيَّةِ الهَزَّازَةِ.",
  },
  tunnel: {
    id: "tunnel",
    arabic: "نَفَقُ اللَّعِب (أُنْبُوبُ التَّسَلُّل)",
    partOfSpeech: "noun",
    phonetic: "ˈtʌnl",
    pronunciationTip: "Short 'u' sound /ʌ/ with clear syllabic 'l': 'TUN-ul' (/ˈtʌn.əl/).",
    collocations: [
      "crawl through the tunnel",
      "plastic playground tunnel",
      "concrete play tunnel",
      "tunnel maze",
      "bright yellow tunnel",
      "hide in the tunnel",
    ],
    phrasalVerbs: [
      {
        phrase: "crawl through",
        meaning: "move on hands and knees through an opening",
        arabic: "يَزْحَفُ عَبْرَ",
        example: "Toddlers love to crawl through the bright red tube.",
      },
    ],
    sentences: [
      {
        context: "Active Play",
        en: "Children crawled on hands and knees through the vibrant crawl tunnel.",
        ar: "زَحَفَ الأَطْفَالُ عَلَى أَيْدِيهِمْ وَرُكَبِهِمْ عَبْرَ نَفَقِ اللَّعِبِ النَّابِضِ بِالحَيَاةِ.",
      },
      {
        context: "Hide and Seek",
        en: "Lucas hid inside the curved green play tunnel during the game.",
        ar: "اخْتَبَأَ لُوكَاس دَاخِلَ نَفَقِ اللَّعِبِ الأَخْضَرِ المُنْحَنِي أَثْنَاءَ اللُّعْبَةِ.",
      },
      {
        context: "Structure",
        en: "The reinforced plastic tunnel connects two elevated wooden towers.",
        ar: "يَرْبِطُ نَفَقُ اللَّعِبِ البْلاسْتِيكِيُّ المُقَوَّى بَيْنَ بُرْجَيْنِ خَشَبِيَّيْنِ مُرْتَفِعَيْنِ.",
      },
    ],
    exampleSentence: "Children crawled on hands and knees through the vibrant crawl tunnel.",
    exampleArabic:
      "زَحَفَ الأَطْفَالُ عَلَى أَيْدِيهِمْ وَرُكَبِهِمْ عَبْرَ نَفَقِ اللَّعِبِ النَّابِضِ بِالحَيَاةِ.",
  },
  "balance-beam": {
    id: "balance-beam",
    arabic: "عَارِضَةُ التَّوَازُن",
    partOfSpeech: "noun",
    phonetic: "ˈbæləns biːm",
    pronunciationTip: "Pronounce 'balance' (/ˈbæl.əns/) then long 'beam' (/biːm/).",
    collocations: [
      "walk along the balance beam",
      "wooden balance beam",
      "low balance beam",
      "gymnastics balance beam",
      "step onto the balance beam",
      "practice on the balance beam",
    ],
    phrasalVerbs: [
      {
        phrase: "walk along",
        meaning: "traverse from end to end",
        arabic: "يَمْشِي عَلَى طُولِ",
        example: "She held her arms out wide to walk along the narrow beam.",
      },
    ],
    sentences: [
      {
        context: "Balance & Coordination",
        en: "She stretched her arms out wide to steady herself along the balance beam.",
        ar: "مَدَّتْ ذِرَاعَيْهَا عَلَى اتِّسَاعِهِمَا لِتَحْفَظَ تَرَازُنَهَا عَلَى عَارِضَةِ التَّوَازُنِ.",
      },
      {
        context: "Park Obstacle Course",
        en: "The timber balance beam forms part of the park's fitness trail.",
        ar: "تُشَكِّلُ عَارِضَةُ التَّوَازُنِ الخَشَبِيَّةُ جُزْءًا مِنْ مَسَارِ اللِّيَاقَةِ البَدَنِيَّةِ بِالحَدِيقَةِ.",
      },
      {
        context: "Playground Safety",
        en: "The low wooden beam sits just a few inches above soft wood chips.",
        ar: "تَرْتَفِعُ العَارِضَةُ الخَشَبِيَّةُ المُنْخَفِضَةُ بضع بُوصَاتٍ فَقَطْ فَوْقَ رُقَاقَاتِ الخَشَبِ الطَّرِيَّةِ.",
      },
    ],
    exampleSentence: "She stretched her arms out wide to steady herself along the balance beam.",
    exampleArabic:
      "مَدَّتْ ذِرَاعَيْهَا عَلَى اتِّسَاعِهِمَا لِتَحْفَظَ تَرَازُنَهَا عَلَى عَارِضَةِ التَّوَازُنِ.",
  },
  ball: {
    id: "ball",
    arabic: "كُرَة",
    partOfSpeech: "noun",
    phonetic: "bɔːl",
    pronunciationTip: "Open 'aw' vowel sound: 'BAWL' (/bɔːl/).",
    collocations: [
      "soccer ball",
      "rubber ball",
      "kick the ball",
      "pass the ball",
      "bounce the ball",
      "catch the ball",
    ],
    phrasalVerbs: [
      {
        phrase: "bounce back",
        meaning: "rebound off a hard surface",
        arabic: "يَرْتَدُّ ثَانِيَةً",
        example: "The colorful ball bounced back from the gym wall.",
      },
    ],
    sentences: [
      {
        context: "Park Games",
        en: "The kids kicked the red rubber ball across the grassy lawn.",
        ar: "رَكَلَ الأَطْفَالُ الكُرَةَ المَطَّاطِيَّةَ الحَمْرَاءَ عَبْرَ الحَقْلِ العُشْبِيِّ.",
      },
      {
        context: "Team Sports",
        en: "Pass the ball quickly to your open teammate near the net.",
        ar: "مَرِّرِ الكُرَةَ بِسُرْعَةٍ إِلَى زَمِيلِكَ غَيْرِ المُرَاقَبِ قُرْبَ الشَّبَكَةِ.",
      },
      {
        context: "Catch Practice",
        en: "He caught the high bouncing ball with two steady hands.",
        ar: "الْتَقَطَ الكُرَةَ المُرْتَدَّةَ عَالِيًا بِيَدَيْنِ ثَابِتَتَيْنِ.",
      },
    ],
    exampleSentence: "The kids kicked the red rubber ball across the grassy lawn.",
    exampleArabic:
      "رَكَلَ الأَطْفَالُ الكُرَةَ المَطَّاطِيَّةَ الحَمْرَاءَ عَبْرَ الحَقْلِ العُشْبِيِّ.",
  },
  hoop: {
    id: "hoop",
    arabic: "طَوْقُ اللَّعِب (هُولاهُوب)",
    partOfSpeech: "noun",
    phonetic: "huːp",
    pronunciationTip: "Long /uː/ sound: 'HOOP' (/huːp/).",
    collocations: [
      "hula hoop",
      "plastic hoop",
      "spin the hoop",
      "twirl the hoop",
      "hoop contest",
      "jump through the hoop",
    ],
    phrasalVerbs: [
      {
        phrase: "spin around",
        meaning: "whirl on the hips",
        arabic: "يَدُورُ حَوْلَ الوَسَط",
        example: "She spun the bright plastic hoop around her waist.",
      },
    ],
    sentences: [
      {
        context: "Gymnastics & Play",
        en: "She skillfully twirled the glittery hula hoop around her hips.",
        ar: "دَوَّرَتْ طَوْقَ الهُولاهُوبِ اللَّامِعَ بِمَهَارَةٍ حَوْلَ خَصْرِهَا.",
      },
      {
        context: "Obstacle Course",
        en: "Kids jumped through colorful plastic hoops laid on the grass.",
        ar: "قَفَزَ الأَطْفَالُ عَبْرَ أَطْوَاقٍ بْلاسْتِيكِيَّةٍ مُلَوَّنَةٍ وُضِعَتْ عَلَى العُشْبِ.",
      },
      {
        context: "Coordination",
        en: "Keeping the lightweight hoop spinning requires rhythm and balance.",
        ar: "يَتَطَلَّبُ الحِفَاظُ عَلَى دَوَرَانِ الطَّوْقِ الخَفِيفِ إِيقَاعًا وَتَوَازُنًا.",
      },
    ],
    exampleSentence: "She skillfully twirled the glittery hula hoop around her hips.",
    exampleArabic: "دَوَّرَتْ طَوْقَ الهُولاهُوبِ اللَّامِعَ بِمَهَارَةٍ حَوْلَ خَصْرِهَا.",
  },
  bat: {
    id: "bat",
    arabic: "مِضْرَبُ البَيْسْبُول (مِضْرَب)",
    partOfSpeech: "noun",
    phonetic: "bæt",
    pronunciationTip: "Short flat 'a' sound /æ/ as in 'cat': 'BAT' (/bæt/).",
    collocations: [
      "baseball bat",
      "wooden bat",
      "aluminum bat",
      "swing the bat",
      "grip the bat",
      "hit with a bat",
    ],
    phrasalVerbs: [
      {
        phrase: "bat away",
        meaning: "deflect or strike off",
        arabic: "يَصُدُّ بِالمِضْرَب",
        example: "The batter batted away foul pitches to stay in the count.",
      },
    ],
    sentences: [
      {
        context: "Baseball Practice",
        en: "He stepped up to home plate and gripped the smooth wooden bat.",
        ar: "تَقَدَّمَ إِلَى قَاعِدَةِ البِدَايَةِ وَأَمْسَكَ المِضْرَبَ الخَشَبِيَّ النَّاعِمَ بِإِحْكَامٍ.",
      },
      {
        context: "Game Highlight",
        en: "A powerful swing of the metal bat sent the ball flying into the outfield.",
        ar: "أَرْسَلَتْ ضَرْبَةٌ قَوِيَّةٌ بِالمِضْرَبِ المَعْدَنِيِّ الكُرَةَ مُحَلِّقَةً فِي المَلْعَبِ الخَارِجِيِّ.",
      },
      {
        context: "Safety",
        en: "Always wear a helmet when holding a bat near the batting cage.",
        ar: "ارْتَدِ دَائِمًا خُوذَةً عِنْدَ حَمْلِ المِضْرَبِ قُرْبَ قَفَصِ التَّدْرِيبِ.",
      },
    ],
    exampleSentence: "He stepped up to home plate and gripped the smooth wooden bat.",
    exampleArabic:
      "تَقَدَّمَ إِلَى قَاعِدَةِ البِدَايَةِ وَأَمْسَكَ المِضْرَبَ الخَشَبِيَّ النَّاعِمَ بِإِحْكَامٍ.",
  },
  racket: {
    id: "racket",
    arabic: "مِضْرَبُ التِّنِس (مِضْرَبٌ شَبَكِيّ)",
    partOfSpeech: "noun",
    phonetic: "ˈrækɪt",
    pronunciationTip: "First syllable has /æ/, ends in short /ɪt/: 'RACK-it' (/ˈræk.ɪt/).",
    collocations: [
      "tennis racket",
      "badminton racket",
      "string the racket",
      "racket handle",
      "lightweight racket",
      "swing a racket",
    ],
    phrasalVerbs: [
      {
        phrase: "hit back",
        meaning: "return the ball across the court",
        arabic: "يَرُدُّ الكُرَةَ بِالمِضْرَب",
        example: "She hit the yellow ball back over the white net with her racket.",
      },
    ],
    sentences: [
      {
        context: "Tennis Practice",
        en: "She gripped the lightweight tennis racket and served an ace across the court.",
        ar: "أَمْسَكَتْ مِضْرَبَ التِّنِسِ الخَفِيفَ وَأَرْسَلَتْ إِرْسَالًا سَاحِقًا عَبْرَ المَلْعَبِ.",
      },
      {
        context: "Equipment",
        en: "The tightly strung mesh on the racket produces impressive topspin.",
        ar: "تُوَلِّدُ الشَّبَكَةُ المَشْدُودَةُ بِإِحْكَامٍ عَلَى المِضْرَبِ دَوَرَانًا أَمَامِيًّا رَائِعًا.",
      },
      {
        context: "Casual Sport",
        en: "They brought two badminton rackets and a shuttlecock to the park.",
        ar: "جَلَبُوا مِضْرَبَيْ رِيشَةٍ طَائِرَةٍ وَكُرَةَ رِيشَةٍ إِلَى الحَدِيقَةِ.",
      },
    ],
    exampleSentence:
      "She gripped the lightweight tennis racket and served an ace across the court.",
    exampleArabic:
      "أَمْسَكَتْ مِضْرَبَ التِّنِسِ الخَفِيفَ وَأَرْسَلَتْ إِرْسَالًا سَاحِقًا عَبْرَ المَلْعَبِ.",
  },
  net: {
    id: "net",
    arabic: "شَبَكَةُ المَلْعَب (شَبَكَة)",
    partOfSpeech: "noun",
    phonetic: "nɛt",
    pronunciationTip: "Short 'e' sound /ɛ/ ending in crisp 't': 'NET' (/nɛt/).",
    collocations: [
      "tennis net",
      "volleyball net",
      "soccer goal net",
      "over the net",
      "into the net",
      "climb the rope net",
    ],
    phrasalVerbs: [
      {
        phrase: "hit into",
        meaning: "strike the mesh barrier mistakenly",
        arabic: "يَضْرِبُ فِي الشَّبَكَة",
        example: "He accidentally hit the tennis ball right into the middle of the net.",
      },
    ],
    sentences: [
      {
        context: "Court Sports",
        en: "She served the yellow tennis ball perfectly over the center net.",
        ar: "أَرْسَلَتْ كُرَةَ التِّنِسِ الصَّفْرَاءَ بِمِثَالِيَّةٍ فَوْقَ الشَّبَكَةِ المَرْكَزِيَّةِ.",
      },
      {
        context: "Soccer Goals",
        en: "The striker's powerful shot rippled the white soccer goal net.",
        ar: "هَزَّتْ تَسْدِيدَةُ المُهَاجِمِ القَوِيَّةُ شَبَكَةَ مَرْمَى كُرَةِ القَدَمِ البَيْضَاءَ.",
      },
      {
        context: "Playground Net",
        en: "Children scrambled up the heavy cargo climbing net on the playground tower.",
        ar: "تَسَلَّقَ الأَطْفَالُ شَبَكَةَ التَّسَلُّقِ الحَبْلِيَّةَ الثَّقِيلَةَ عَلَى بُرْجِ المَلْعَبِ.",
      },
    ],
    exampleSentence: "She served the yellow tennis ball perfectly over the center net.",
    exampleArabic:
      "أَرْسَلَتْ كُرَةَ التِّنِسِ الصَّفْرَاءَ بِمِثَالِيَّةٍ فَوْقَ الشَّبَكَةِ المَرْكَزِيَّةِ.",
  },
  goal: {
    id: "goal",
    arabic: "مَرْمَى (شَبَكَةُ الهَدَف)",
    partOfSpeech: "noun",
    phonetic: "ɡoʊl",
    pronunciationTip: "Long 'o' sound /oʊ/ as in 'go': 'GOAL' (/ɡoʊl/).",
    collocations: [
      "soccer goal",
      "score a goal",
      "goal posts",
      "guard the goal",
      "shoot on goal",
      "empty goal",
    ],
    phrasalVerbs: [
      {
        phrase: "score in",
        meaning: "place the ball inside the target net",
        arabic: "يُسَجِّلُ فِي المَرْمَى",
        example: "The striker scored in the top right corner of the goal.",
      },
    ],
    sentences: [
      {
        context: "Soccer Match",
        en: "He fired a precision shot past the goalkeeper directly into the goal.",
        ar: "سَدَّدَ تَسْدِيدَةً دَقِيقَةً تَجَاوَزَتْ حَارِسَ المَرْمَى دَاخِلَ الشَّبَكَةِ مُبَاشَرَةً.",
      },
      {
        context: "Playground Field",
        en: "Two portable goal posts were set up on the open grass field.",
        ar: "تَمَّ نَصْبُ قَائِمَيْ مَرْمًى مُتَنَقِّلَيْنِ عَلَى المَلْعَبِ العُشْبِيِّ المَفْتُوحِ.",
      },
      {
        context: "Goalkeeping",
        en: "The goalkeeper stood ready between the white posts to defend the net.",
        ar: "وَقَفَ حَارِسُ المَرْمَى مُسْتَعِدًّا بَيْنَ القَائِمَيْنِ الأَبْيَضَيْنِ لِلدِّفَاعِ عَنِ الشَّبَكَةِ.",
      },
    ],
    exampleSentence: "He fired a precision shot past the goalkeeper directly into the goal.",
    exampleArabic:
      "سَدَّدَ تَسْدِيدَةً دَقِيقَةً تَجَاوَزَتْ حَارِسَ المَرْمَى دَاخِلَ الشَّبَكَةِ مُبَاشَرَةً.",
  },
  whistle: {
    id: "whistle",
    arabic: "صَفَّارَة",
    partOfSpeech: "noun",
    phonetic: "ˈwɪsl",
    pronunciationTip: "Silent 't': pronounce 'WHIS-ul' (/ˈwɪs.əl/).",
    collocations: [
      "blow the whistle",
      "referee whistle",
      "coach whistle",
      "silver whistle",
      "loud whistle",
      "shrill whistle",
    ],
    phrasalVerbs: [
      {
        phrase: "blow on",
        meaning: "exhale forcefully into mouthpiece",
        arabic: "يَنْفُخُ فِي الصَّفَّارَة",
        example: "The referee blew on his silver whistle to signal halftime.",
      },
    ],
    sentences: [
      {
        context: "Referee Signal",
        en: "The referee blew his sharp silver whistle to signal the start of the match.",
        ar: "نَفَخَ الحَكَمُ فِي صَفَّارَتِهِ الفِضِّيَّةِ الحَادَّةِ لِيُعْلِنَ بَدْءَ المُبَارَاةِ.",
      },
      {
        context: "Coach Guidance",
        en: "Coach wore a loud whistle around his neck on a red lanyard.",
        ar: "عَلَّقَ المُدَرِّبُ صَفَّارَةً عَالِيَةَ الصَّوْتِ حَوْلَ عُنُقِهِ بِشَرِيطٍ أَحْمَرَ.",
      },
      {
        context: "Playground Safety",
        en: "The playground monitor used a whistle to gather all the students together.",
        ar: "اسْتَخْدَمَ مُرَاقِبُ المَلْعَبِ صَفَّارَةً لِجَمْعِ جَمِيعِ التَّلَامِيذِ مَعًا.",
      },
    ],
    exampleSentence: "The referee blew his sharp silver whistle to signal the start of the match.",
    exampleArabic:
      "نَفَخَ الحَكَمُ فِي صَفَّارَتِهِ الفِضِّيَّةِ الحَادَّةِ لِيُعْلِنَ بَدْءَ المُبَارَاةِ.",
  },
  stopwatch: {
    id: "stopwatch",
    arabic: "سَاعَةُ إِيقَاف",
    partOfSpeech: "noun",
    phonetic: "ˈstɑːpwɑːtʃ",
    pronunciationTip: "Compound noun: 'STOP-watch' (/ˈstɑːp.wɑːtʃ/).",
    collocations: [
      "digital stopwatch",
      "press the stopwatch",
      "stopwatch timer",
      "handheld stopwatch",
      "check the stopwatch",
      "reset the stopwatch",
    ],
    phrasalVerbs: [
      {
        phrase: "time out",
        meaning: "record elapsed duration",
        arabic: "يَقِيسُ الوَقْتَ المُنْقَضِي",
        example: "The coach timed out the relay race using his digital timer.",
      },
    ],
    sentences: [
      {
        context: "Track & Sprinting",
        en: "The coach pressed the digital stopwatch as the sprinters crossed the finish line.",
        ar: "ضَغَطَ المُدَرِّبُ عَلَى سَاعَةِ الإِيقَافِ الرَّقْمِيَّةِ بَيْنَمَا اجْتَازَ العَدَّاؤُونَ خَطَّ النِّهَايَةِ.",
      },
      {
        context: "Accuracy",
        en: "A precision stopwatch measures elapsed time down to hundredths of a second.",
        ar: "تَقِيسُ سَاعَةُ الإِيقَافِ الدَّقِيقَةُ الوَقْتَ المُنْقَضِيَ بِأَجْزَاءِ المِئَةِ مِنَ الثَّانِيَةِ.",
      },
      {
        context: "Training",
        en: "He monitored his lap times on the handheld stopwatch during practice.",
        ar: "رَاقَبَ أَوْقَاتَ دَوْرَاتِهِ عَلَى سَاعَةِ الإِيقَافِ المَحْمُولَةِ أَثْنَاءَ التَّدْرِيبِ.",
      },
    ],
    exampleSentence:
      "The coach pressed the digital stopwatch as the sprinters crossed the finish line.",
    exampleArabic:
      "ضَغَطَ المُدَرِّبُ عَلَى سَاعَةِ الإِيقَافِ الرَّقْمِيَّةِ بَيْنَمَا اجْتَازَ العَدَّاؤُونَ خَطَّ النِّهَايَةِ.",
  },
  helmet: {
    id: "helmet",
    arabic: "خُوذَةُ حِمَايَة",
    partOfSpeech: "noun",
    phonetic: "ˈhɛlmɪt",
    pronunciationTip: "Two syllables: 'HEL-mit' (/ˈhɛl.mɪt/).",
    collocations: [
      "bicycle helmet",
      "safety helmet",
      "wear a helmet",
      "strap the helmet",
      "protective helmet",
      "skateboarding helmet",
    ],
    phrasalVerbs: [
      {
        phrase: "strap on",
        meaning: "fasten securely around the chin",
        arabic: "يَرْبِطُ الخُوذَةَ بِإِحْكَام",
        example: "Always strap on your protective headgear before riding your scooter.",
      },
    ],
    sentences: [
      {
        context: "Biking & Skating",
        en: "He strapped on his bright blue safety helmet before riding his bicycle.",
        ar: "رَبَطَ خُوذَةَ الأَمَانِ الزَّرْقَاءَ البَرَّاقَةَ قَبْلَ رُكُوبِ دَرَّاجَتِهِ الهَوَائِيَّةِ.",
      },
      {
        context: "Protection",
        en: "Wearing a certified helmet prevents serious head injuries during falls.",
        ar: "يَمْنَعُ ارْتِدَاءُ خُوذَةٍ مُعْتَمَدَةٍ إِصَابَاتِ الرَّأْسِ الخَطِيرَةَ أَثْنَاءَ السُّقُوطِ.",
      },
      {
        context: "Skatepark Rule",
        en: "The skatepark requires all skateboarders and rollerbladers to wear helmets.",
        ar: "تَشْتَرِطُ حَدِيقَةُ التَّزَلُّجِ عَلَى جَمِيعِ المُتَزَلِّجِينَ ارْتِدَاءَ الخُوَذِ.",
      },
    ],
    exampleSentence: "He strapped on his bright blue safety helmet before riding his bicycle.",
    exampleArabic:
      "رَبَطَ خُوذَةَ الأَمَانِ الزَّرْقَاءَ البَرَّاقَةَ قَبْلَ رُكُوبِ دَرَّاجَتِهِ الهَوَائِيَّةِ.",
  },
  "knee-pad": {
    id: "knee-pad",
    arabic: "وَاقِيَةُ الرُّكْبَة",
    partOfSpeech: "noun",
    phonetic: "ˈniː pæd",
    pronunciationTip: "Silent 'k': pronounce 'NEE-pad' (/ˈniː pæd/).",
    collocations: [
      "protective knee pads",
      "wear knee pads",
      "skating knee pads",
      "cushioned knee pad",
      "strap on knee pads",
      "durable knee pads",
    ],
    phrasalVerbs: [
      {
        phrase: "strap on",
        meaning: "fasten around the knees with velcro",
        arabic: "يَشُدُّ الوَاقِيَةَ عَلَى الرُّكْبَة",
        example: "He strapped on thick knee pads with velcro fasteners.",
      },
    ],
    sentences: [
      {
        context: "Skating Gear",
        en: "She fastened cushioned knee pads over her jeans before rollerblading.",
        ar: "ثَبَّتَتْ وَاقِيَاتِ الرُّكَبِ المُبَطَّنَةَ فَوْقَ بِنْطَالِهَا الجِينْزِ قَبْلَ التَّزَلُّجِ.",
      },
      {
        context: "Safety",
        en: "Durable plastic knee pads protect joints from scrapes on hard asphalt.",
        ar: "تَحْمِي وَاقِيَاتُ الرُّكْبَةِ البْلاسْتِيكِيَّةُ المَتِينَةُ المَفَاصِلَ مِنَ الخُدُوشِ عَلَى الأَسْفَلْتِ الصَّلْبِ.",
      },
      {
        context: "Beginner Training",
        en: "Beginner skaters should always wear elbow guards and knee pads.",
        ar: "يَنْبَغِي لِلْمُتَزَلِّجِينَ المُبْتَدِئِينَ ارْتِدَاءُ وَاقِيَاتِ الكُوعِ وَالرُّكْبَةِ دَائِمًا.",
      },
    ],
    exampleSentence: "She fastened cushioned knee pads over her jeans before rollerblading.",
    exampleArabic:
      "ثَبَّتَتْ وَاقِيَاتِ الرُّكَبِ المُبَطَّنَةَ فَوْقَ بِنْطَالِهَا الجِينْزِ قَبْلَ التَّزَلُّجِ.",
  },
  "rubber-mat": {
    id: "rubber-mat",
    arabic: "بِسَاطٌ مَطَّاطِيٌّ مَاصٌّ لِلصَّدَمَات",
    partOfSpeech: "noun",
    phonetic: "ˈrʌbər mæt",
    pronunciationTip: "Pronounce 'rubber' (/ˈrʌb.ər/) then flat 'mat' (/mæt/).",
    collocations: [
      "shock-absorbing rubber mat",
      "interlocking rubber mats",
      "playground rubber mat",
      "cushioned rubber mat",
      "fall onto rubber mat",
      "durable rubber mat",
    ],
    phrasalVerbs: [
      {
        phrase: "lay down",
        meaning: "install tiles across ground",
        arabic: "يَفْرِشُ البِسَاط",
        example: "Workers laid down colorful poured rubber flooring beneath the structures.",
      },
    ],
    sentences: [
      {
        context: "Safety Surfacing",
        en: "Shock-absorbing rubber mats under the monkey bars cushion sudden falls.",
        ar: "تَمْتَصُّ البُسُطُ المَطَّاطِيَّةُ المَاصَّةُ لِلصَّدَمَاتِ تَحْتَ قُضْبَانِ التَّعَلُّقِ السَّقَطَاتِ المُفَاجِئَةَ.",
      },
      {
        context: "Playground Design",
        en: "Interlocking colorful rubber mats create a safe and bright ground pattern.",
        ar: "تُشَكِّلُ البُسُطُ المَطَّاطِيَّةُ المُلَوَّنَةُ المُتَدَاخِلَةُ أَرْضِيَّةً آمِنَةً وَمُشْرِقَةً.",
      },
      {
        context: "Durability",
        en: "The textured rubber mat resists slipping even when wet from light rain.",
        ar: "يُقَاوِمُ البِسَاطُ المَطَّاطِيُّ المُنَقَّشُ الانْزِلَاقَ حَتَّى عِنْدَمَا يَبْتَلُّ بِمَطَرٍ خَفِيفٍ.",
      },
    ],
    exampleSentence: "Shock-absorbing rubber mats under the monkey bars cushion sudden falls.",
    exampleArabic:
      "تَمْتَصُّ البُسُطُ المَطَّاطِيَّةُ المَاصَّةُ لِلصَّدَمَاتِ تَحْتَ قُضْبَانِ التَّعَلُّقِ السَّقَطَاتِ المُفَاجِئَةَ.",
  },
  sand: {
    id: "sand",
    arabic: "رَمْل",
    partOfSpeech: "noun",
    phonetic: "sænd",
    pronunciationTip: "Short 'a' vowel /æ/ followed by 'nd': 'SAND' (/sænd/).",
    collocations: [
      "fine sand",
      "play in the sand",
      "golden sand",
      "wet sand",
      "sand castle",
      "grain of sand",
    ],
    phrasalVerbs: [
      {
        phrase: "sift through",
        meaning: "filter fine particles with fingers",
        arabic: "يُغَرْبِلُ الرَّمْل",
        example: "The warm sand sifted through his little fingers.",
      },
    ],
    sentences: [
      {
        context: "Sensory Play",
        en: "Children poured soft golden sand through plastic sifters into buckets.",
        ar: "سَكَبَ الأَطْفَالُ الرَّمْلَ الذَّهَبِيَّ النَّاعِمَ عَبْرَ مَنَاخِلَ بْلاسْتِيكِيَّةٍ دَاخِلَ الدِّلَاءِ.",
      },
      {
        context: "Castles",
        en: "Damp sand is perfect for building sturdy turrets and sculpted walls.",
        ar: "يُعَدُّ الرَّمْلُ الرَّطْبُ مِثَالِيًّا لِبِنَاءِ أَبْرَاجٍ قَوِيَّةٍ وَجُدْرَانٍ مَنْحُوتَةٍ.",
      },
      {
        context: "Safety Surfacing",
        en: "A thick layer of clean sand lines the playground pit for soft landings.",
        ar: "تُغَطِّي طَبَقَةٌ سَمِيكَةٌ مِنَ الرَّمْلِ النَّظِيفِ حُفْرَةَ المَلْعَبِ لِهُبُوطٍ لَيِّنٍ.",
      },
    ],
    exampleSentence: "Children poured soft golden sand through plastic sifters into buckets.",
    exampleArabic:
      "سَكَبَ الأَطْفَالُ الرَّمْلَ الذَّهَبِيَّ النَّاعِمَ عَبْرَ مَنَاخِلَ بْلاسْتِيكِيَّةٍ دَاخِلَ الدِّلَاءِ.",
  },
  gravel: {
    id: "gravel",
    arabic: "حَصًى (حِجَارَةٌ صَغِيرَة)",
    partOfSpeech: "noun",
    phonetic: "ˈɡrævl",
    pronunciationTip: "Short 'a' with /v/ and syllabic 'l': 'GRAV-ul' (/ˈɡræv.əl/).",
    collocations: [
      "gravel path",
      "loose gravel",
      "crushed gravel",
      "crunching gravel",
      "pea gravel",
      "walk on gravel",
    ],
    phrasalVerbs: [
      {
        phrase: "spread out",
        meaning: "distribute stones evenly along path",
        arabic: "يَفْرِشُ الحَصَى",
        example: "Park workers spread out fresh pea gravel along the walkway.",
      },
    ],
    sentences: [
      {
        context: "Park Pathways",
        en: "Their footsteps crunched softly on the winding gravel pathway.",
        ar: "أَحْدَثَتْ خَطَوَاتُهُمْ صَوْتَ قَرْقَعَةٍ خَفِيفَةٍ عَلَى مَمَرِّ الحَصَى المُلْتَفِّ.",
      },
      {
        context: "Drainage",
        en: "Layers of pea gravel provide excellent natural drainage around trees.",
        ar: "تُوَفِّرُ طَبَقَاتُ الحَصَى الصَّغِيرِ تَصْرِيفًا طَبِيعِيًّا مُمْتَازًا حَوْلَ الأَشْجَارِ.",
      },
      {
        context: "Perimeter",
        en: "The border of the playground is neatly lined with gray crushed gravel.",
        ar: "حُفَّتْ حُدُودُ المَلْعَبِ بِتَرْتِيبٍ بِحَصًى رَمَادِيٍّ مَسْحُوقٍ.",
      },
    ],
    exampleSentence: "Their footsteps crunched softly on the winding gravel pathway.",
    exampleArabic:
      "أَحْدَثَتْ خَطَوَاتُهُمْ صَوْتَ قَرْقَعَةٍ خَفِيفَةٍ عَلَى مَمَرِّ الحَصَى المُلْتَفِّ.",
  },
  grass: {
    id: "grass",
    arabic: "عُشْبٌ أَخْضَر",
    partOfSpeech: "noun",
    phonetic: "ɡræs",
    pronunciationTip: "Short 'a' sound /æ/ as in 'pass': 'GRASS' (/ɡræs/).",
    collocations: [
      "green grass",
      "freshly cut grass",
      "sit on the grass",
      "lawn of grass",
      "tall grass",
      "patch of grass",
    ],
    phrasalVerbs: [
      {
        phrase: "grow over",
        meaning: "cover soil with green blades",
        arabic: "يَكْسُو العُشْب",
        example: "Lush green turf grew over the open recreational meadow.",
      },
    ],
    sentences: [
      {
        context: "Park Meadow",
        en: "Families sat on colorful picnic blankets spread out over the green grass.",
        ar: "جَلَسَتِ العَائِلاتُ عَلَى بُسُطِ نُزْهَةٍ مُلَوَّنَةٍ فُرِشَتْ فَوْقَ العُشْبِ الأَخْضَرِ.",
      },
      {
        context: "Running Games",
        en: "Children kicked off their shoes to race barefoot across the soft grass.",
        ar: "خَلَعَ الأَطْفَالُ أَحْذِيَتَهُمْ لِيَتَسَابَقُوا حُفَاةً عَبْرَ العُشْبِ النَّاعِمِ.",
      },
      {
        context: "Fragrance",
        en: "The scent of freshly mown grass filled the warm afternoon air.",
        ar: "مَلَأَتْ رَائِحَةُ العُشْبِ المَقْصُوصِ حَدِيثًا هَوَاءَ بَعْدِ الظُّهْرِ الدَّافِئَ.",
      },
    ],
    exampleSentence: "Families sat on colorful picnic blankets spread out over the green grass.",
    exampleArabic:
      "جَلَسَتِ العَائِلاتُ عَلَى بُسُطِ نُزْهَةٍ مُلَوَّنَةٍ فُرِشَتْ فَوْقَ العُشْبِ الأَخْضَرِ.",
  },
  concrete: {
    id: "concrete",
    arabic: "خَرَسَانَة (إِسْمَنْتٌ صَلْب)",
    partOfSpeech: "noun",
    phonetic: "ˈkɑːnkriːt",
    pronunciationTip: "Primary stress on first syllable: 'KAHN-kreet' (/ˈkɑːn.kriːt/).",
    collocations: [
      "concrete pavement",
      "smooth concrete",
      "concrete court",
      "solid concrete",
      "walk on concrete",
      "concrete bench",
    ],
    phrasalVerbs: [
      {
        phrase: "pour out",
        meaning: "lay wet cement to set hard",
        arabic: "يَصُبُّ الخَرَسَانَة",
        example: "Contractors poured out smooth concrete for the new basketball court.",
      },
    ],
    sentences: [
      {
        context: "Playground Court",
        en: "The basketball court has a smooth, solid concrete surface with painted lines.",
        ar: "يَحْتَوِي مَلْعَبُ كُرَةِ السَّلَّةِ عَلَى أَرْضِيَّةٍ خَرَسَانِيَّةٍ صَلْبَةٍ وَنَاعِمَةٍ مَعَ خُطُوطٍ مَرْسُومَةٍ.",
      },
      {
        context: "Walkways",
        en: "Strollers and wheelchairs roll easily along the wide concrete walkway.",
        ar: "تَسِيرُ عَرَبَاتُ الأَطْفَالِ وَالكَرَاسِي المُتَحَرِّكَةُ بِسُهُولَةٍ عَلَى المَمَرِّ الخَرَسَانِيِّ العَرِيضِ.",
      },
      {
        context: "Durability",
        en: "Heavy reinforced concrete foundations anchor the playground swing sets.",
        ar: "تُثَبِّتُ قَوَاعِدُ الخَرَسَانَةِ المُسَلَّحَةِ الثَّقِيلَةُ مَجْمُوعَاتِ أَرَاجِيحِ المَلْعَبِ.",
      },
    ],
    exampleSentence:
      "The basketball court has a smooth, solid concrete surface with painted lines.",
    exampleArabic:
      "يَحْتَوِي مَلْعَبُ كُرَةِ السَّلَّةِ عَلَى أَرْضِيَّةٍ خَرَسَانِيَّةٍ صَلْبَةٍ وَنَاعِمَةٍ مَعَ خُطُوطٍ مَرْسُومَةٍ.",
  },
  "chalk-drawing": {
    id: "chalk-drawing",
    arabic: "رَسْمٌ بِالطَّبَاشِير",
    partOfSpeech: "noun",
    phonetic: "ˈtʃɔːk ˌdrɔːɪŋ",
    pronunciationTip: "Silent 'l' in 'chalk': 'CHAWK draw-ing' (/ˈtʃɔːk ˌdrɔː.ɪŋ/).",
    collocations: [
      "sidewalk chalk drawing",
      "colorful chalk drawing",
      "draw with chalk",
      "chalk drawing on pavement",
      "wipe away chalk drawing",
      "rainbow chalk drawing",
    ],
    phrasalVerbs: [
      {
        phrase: "draw out",
        meaning: "sketch designs onto pavement",
        arabic: "يَرْسُمُ بِالطَّبَاشِير",
        example: "She drew out a bright smiling sun with yellow sidewalk chalk.",
      },
    ],
    sentences: [
      {
        context: "Creative Play",
        en: "Children created vibrant chalk drawings of rainbows and animals on the pavement.",
        ar: "أَبْدَعَ الأَطْفَالُ رُسُومَاتٍ طَبَاشِيرِيَّةً زَاهِيَةً لِأَقْوَاسِ قُزَحَ وَحَيَوَانَاتٍ عَلَى الرَّصِيفِ.",
      },
      {
        context: "Sidewalk Art",
        en: "Her colorful chalk drawing of a hopscotch grid invited everyone to jump.",
        ar: "دَعَا رَسْمُهَا الطَّبَاشِيرِيُّ المُلَوَّنُ لِمُخَطَّطِ الحَجْلَةِ الجَمِيعَ لِلْقَفْزِ.",
      },
      {
        context: "Temporary Art",
        en: "A gentle afternoon rain shower washed away the bright sidewalk chalk drawings.",
        ar: "غَسَلَتْ زَخَّةُ مَطَرٍ خَفِيفَةٌ بَعْدَ الظُّهْرِ الرُّسُومَاتِ الطَّبَاشِيرِيَّةَ اللَّامِعَةَ عَنِ الرَّصِيفِ.",
      },
    ],
    exampleSentence:
      "Children created vibrant chalk drawings of rainbows and animals on the pavement.",
    exampleArabic:
      "أَبْدَعَ الأَطْفَالُ رُسُومَاتٍ طَبَاشِيرِيَّةً زَاهِيَةً لِأَقْوَاسِ قُزَحَ وَحَيَوَانَاتٍ عَلَى الرَّصِيفِ.",
  },
  hopscotch: {
    id: "hopscotch",
    arabic: "لُعْبَةُ الحَجْلَة (الحَجَلَة)",
    partOfSpeech: "noun",
    phonetic: "ˈhɑːpskɑːtʃ",
    pronunciationTip: "Compound word: 'HOP-skotch' (/ˈhɑːp.skɑːtʃ/).",
    collocations: [
      "play hopscotch",
      "hopscotch grid",
      "hopscotch squares",
      "hopscotch marker",
      "draw a hopscotch",
      "numbered hopscotch",
    ],
    phrasalVerbs: [
      {
        phrase: "hop through",
        meaning: "jump on one foot across numbered boxes",
        arabic: "يَحْجُلُ عَبْرَ المُرَبَّعَات",
        example: "She hopped through squares one to ten without losing balance.",
      },
    ],
    sentences: [
      {
        context: "Traditional Games",
        en: "She tossed a small pebble into square three and hopped through the hopscotch grid.",
        ar: "أَلْقَتْ حَصَاةً صَغِيرَةً فِي المُرَبَّعِ الثَّالِثِ وَحَجَلَتْ عَبْرَ مُخَطَّطِ لُعْبَةِ الحَجْلَةِ.",
      },
      {
        context: "Playground Court",
        en: "A permanent hopscotch court is painted in yellow and blue near the entrance.",
        ar: "رُسِمَ مَيْدَانُ حَجْلَةٍ دَائِمٌ بِاللَّوْنَيْنِ الأَصْفَرِ وَالأَزْرَقِ قُرْبَ المَدْخَلِ.",
      },
      {
        context: "Balance & Fun",
        en: "Playing hopscotch helps developing children master single-leg jumping balance.",
        ar: "يُسَاعِدُ لَعِبُ الحَجْلَةِ الأَطْفَالَ فِي مَرْحَلَةِ النُّمُوِّ عَلَى إِتْقَانِ تَوَازُنِ القَفْزِ بِسَاقٍ وَاحِدَةٍ.",
      },
    ],
    exampleSentence:
      "She tossed a small pebble into square three and hopped through the hopscotch grid.",
    exampleArabic:
      "أَلْقَتْ حَصَاةً صَغِيرَةً فِي المُرَبَّعِ الثَّالِثِ وَحَجَلَتْ عَبْرَ مُخَطَّطِ لُعْبَةِ الحَجْلَةِ.",
  },
  "painted-lines": {
    id: "painted-lines",
    arabic: "خُطُوطٌ مَرْسُومَةٌ عَلَى الأَرْض",
    partOfSpeech: "noun",
    phonetic: "ˈpeɪntɪd laɪnz",
    pronunciationTip: "Pronounce 'painted' (/ˈpeɪn.tɪd/) then 'lines' (/laɪnz/).",
    collocations: [
      "white painted lines",
      "court painted lines",
      "boundary painted lines",
      "follow the painted lines",
      "freshly painted lines",
      "yellow painted lines",
    ],
    phrasalVerbs: [
      {
        phrase: "mark out",
        meaning: "delimit court boundaries with paint",
        arabic: "يُحَدِّدُ بِالخُطُوط",
        example: "Workers marked out the boundaries of the basketball court with crisp paint.",
      },
    ],
    sentences: [
      {
        context: "Sports Boundaries",
        en: "Clear white painted lines demarcate the out-of-bounds area on the court.",
        ar: "تُحَدِّدُ خُطُوطٌ بَيْضَاءُ مَرْسُومَةٌ بِوُضُوحٍ مِنْطَقَةَ خَارِجِ المَلْعَبِ.",
      },
      {
        context: "Playground Games",
        en: "Children followed the colorful painted lines like an imaginary obstacle course.",
        ar: "تَتَبَّعَ الأَطْفَالُ الخُطُوطَ المُلَوَّنَةَ المَرْسُومَةَ كَمَسَارِ عَقَبَاتٍ تَخَيُّلِيٍّ.",
      },
      {
        context: "Maintenance",
        en: "The city repainted all faded boundary lines before the summer sports league.",
        ar: "أَعَادَتِ المَدِينَةُ طِلَاءَ جَمِيعِ خُطُوطِ الحُدُودِ البَاهِتَةِ قَبْلَ دَوْرِيِّ الرِّيَاضَةِ الصَّيْفِيِّ.",
      },
    ],
    exampleSentence: "Clear white painted lines demarcate the out-of-bounds area on the court.",
    exampleArabic:
      "تُحَدِّدُ خُطُوطٌ بَيْضَاءُ مَرْسُومَةٌ بِوُضُوحٍ مِنْطَقَةَ خَارِجِ المَلْعَبِ.",
  },
  puddle: {
    id: "puddle",
    arabic: "بِرْكَةُ مَاءٍ صَغِيرَة",
    partOfSpeech: "noun",
    phonetic: "ˈpʌdl",
    pronunciationTip: "Short 'u' sound /ʌ/: 'PUD-ul' (/ˈpʌd.əl/).",
    collocations: [
      "rain puddle",
      "splash in a puddle",
      "muddy puddle",
      "deep puddle",
      "jump over a puddle",
      "water puddle",
    ],
    phrasalVerbs: [
      {
        phrase: "splash in",
        meaning: "stamp feet in standing water",
        arabic: "يَخُوضُ فِي بِرْكَةِ المَاء",
        example: "Toddlers loved to splash in shallow puddles wearing yellow boots.",
      },
    ],
    sentences: [
      {
        context: "After the Rain",
        en: "Wearing yellow rain boots, the toddler jumped right into the muddy puddle.",
        ar: "مُرْتَدِيًا جَزْمَةَ مَطَرٍ صَفْرَاءَ، قَفَزَ الطِّفْلُ الصَّغِيرُ مُبَاشَرَةً فِي بِرْكَةِ المَاءِ الطِّينِيَّةِ.",
      },
      {
        context: "Reflection",
        en: "The calm water of the rain puddle reflected the blue sky above.",
        ar: "عَكَسَتِ المِيَاهُ الهَادِئَةُ لِبِرْكَةِ المَطَرِ السَّمَاءَ الزَّرْقَاءَ فِي الأَعْلَى.",
      },
      {
        context: "Playground Walk",
        en: "They carefully stepped around deep puddles forming along the dirt path.",
        ar: "خَطَوْا بِحَذَرٍ حَوْلَ البِرَكِ العَمِيقَةِ المُتَشَكِّلَةِ عَلَى طُولِ المَمَرِّ التُّرَابِيِّ.",
      },
    ],
    exampleSentence: "Wearing yellow rain boots, the toddler jumped right into the muddy puddle.",
    exampleArabic:
      "مُرْتَدِيًا جَزْمَةَ مَطَرٍ صَفْرَاءَ، قَفَزَ الطِّفْلُ الصَّغِيرُ مُبَاشَرَةً فِي بِرْكَةِ المَاءِ الطِّينِيَّةِ.",
  },
  child: {
    id: "child",
    arabic: "طِفْل",
    partOfSpeech: "noun",
    phonetic: "tʃaɪld",
    pronunciationTip: "Long 'i' diphthong /aɪ/ starting with 'ch' (/tʃ/): 'CHYLD' (/tʃaɪld/).",
    collocations: [
      "young child",
      "playful child",
      "child safety",
      "laughing child",
      "every child",
      "child development",
    ],
    phrasalVerbs: [
      {
        phrase: "grow up",
        meaning: "mature from childhood to adulthood",
        arabic: "يَكْبُرُ (يَنْشَأ)",
        example: "Children grow up so fast when playing outside every day.",
      },
    ],
    sentences: [
      {
        context: "Park Activity",
        en: "Every child in the neighborhood enjoys spending sunny afternoons at the park.",
        ar: "يَسْتَمْتِعُ كُلُّ طِفْلٍ فِي الحَيِّ بِقَضَاءِ أَمْسِيَاتِ الصَّيْفِ المُشْمِسَةِ فِي الحَدِيقَةِ.",
      },
      {
        context: "Imagination",
        en: "A creative child turned the wooden structure into an imaginary castle.",
        ar: "حَوَّلَ طِفْلٌ مُبْدِعٌ الهَيْكَلَ الخَشَبِيَّ إِلَى قَلْعَةٍ تَخَيُّلِيَّةٍ.",
      },
      {
        context: "Social Skills",
        en: "The playground helps every young child learn how to share and cooperate.",
        ar: "يُسَاعِدُ المَلْعَبُ كُلَّ طِفْلٍ صَغِيرٍ عَلَى تَعَلُّمِ المُشَارَكَةِ وَالتَّعَاوُنِ.",
      },
    ],
    exampleSentence:
      "Every child in the neighborhood enjoys spending sunny afternoons at the park.",
    exampleArabic:
      "يَسْتَمْتِعُ كُلُّ طِفْلٍ فِي الحَيِّ بِقَضَاءِ أَمْسِيَاتِ الصَّيْفِ المُشْمِسَةِ فِي الحَدِيقَةِ.",
  },
  friend: {
    id: "friend",
    arabic: "صَدِيق",
    partOfSpeech: "noun",
    phonetic: "frɛnd",
    pronunciationTip: "Short 'e' vowel /ɛ/: 'FREND' (/frɛnd/).",
    collocations: [
      "best friend",
      "close friend",
      "make a friend",
      "play with a friend",
      "childhood friend",
      "loyal friend",
    ],
    phrasalVerbs: [
      {
        phrase: "hang out",
        meaning: "spend casual time together",
        arabic: "يَقْضِي وَقْتًا مَعَ الأَصْدِقَاء",
        example: "Good friends love to hang out together by the swings.",
      },
    ],
    sentences: [
      {
        context: "Socializing",
        en: "She ran across the grass to greet her best friend by the swing set.",
        ar: "رَكَضَتْ عَبْرَ العُشْبِ لِتُحَيِّيَ صَدِيقَتَهَا المُفَضَّلَةَ عِنْدَ الأَرَاجِيحِ.",
      },
      {
        context: "Making Connections",
        en: "It is easy for kids to make a new friend while sharing toys in the sandbox.",
        ar: "مِنَ السَّهْلِ عَلَى الأَطْفَالِ تَكْوِينُ صَدِيقٍ جَدِيدٍ أَثْنَاءَ تَبَادُلِ اللُّعَبِ فِي صُنْدُوقِ الرَّمْلِ.",
      },
      {
        context: "Cooperation",
        en: "Two friends worked together to build the largest sandcastle in the pit.",
        ar: "تَعَاوَنَ صَدِيقَانِ لِبِنَاءِ أَكْبَرِ قَلْعَةٍ رَمْلِيَّةٍ فِي الحُفْرَةِ.",
      },
    ],
    exampleSentence: "She ran across the grass to greet her best friend by the swing set.",
    exampleArabic:
      "رَكَضَتْ عَبْرَ العُشْبِ لِتُحَيِّيَ صَدِيقَتَهَا المُفَضَّلَةَ عِنْدَ الأَرَاجِيحِ.",
  },
  parent: {
    id: "parent",
    arabic: "أَحَدُ الوَالِدَيْن (وَالِد / وَالِدَة)",
    partOfSpeech: "noun",
    phonetic: "ˈpɛrənt",
    pronunciationTip: "First syllable has /ɛr/: 'PAIR-unt' (/ˈpɛr.ənt/).",
    collocations: [
      "caring parent",
      "parent supervision",
      "sit on a bench as a parent",
      "proud parent",
      "parent and child",
      "supportive parent",
    ],
    phrasalVerbs: [
      {
        phrase: "look after",
        meaning: "supervise and care for a child",
        arabic: "يَرْعَى (يَنْتَبِهُ لِـ)",
        example: "Parents look after their young children on the climbing equipment.",
      },
    ],
    sentences: [
      {
        context: "Supervision",
        en: "A watchful parent kept an eye on her toddler from the park bench.",
        ar: "رَاقَبَتْ وَالِدَةٌ يَقِظَةٌ طِفْلَهَا الصَّغِيرَ مِنْ عَلَى مَقْعَدِ الحَدِيقَةِ.",
      },
      {
        context: "Encouragement",
        en: "The proud parent cheered as his son successfully reached the monkey bar platform.",
        ar: "هَتَفَ الوَالِدُ الفَخُورُ بَيْنَمَا وَصَلَ ابْنُهُ بِنَجَاحٍ إِلَى مِنَصَّةِ قُضْبَانِ التَّعَلُّقِ.",
      },
      {
        context: "Community",
        en: "Parents chatted and shared tips while their kids played safely nearby.",
        ar: "تَبَادَلَ الآبَاءُ الأَحَادِيثَ وَالنَّصَائِحَ بَيْنَمَا لَعِبَ أَطْفَالُهُمْ بِأَمَانٍ فِي الجِوَارِ.",
      },
    ],
    exampleSentence: "A watchful parent kept an eye on her toddler from the park bench.",
    exampleArabic:
      "رَاقَبَتْ وَالِدَةٌ يَقِظَةٌ طِفْلَهَا الصَّغِيرَ مِنْ عَلَى مَقْعَدِ الحَدِيقَةِ.",
  },
  teacher: {
    id: "teacher",
    arabic: "مُعَلِّم (مُعَلِّمَة)",
    partOfSpeech: "noun",
    phonetic: "ˈtiːtʃər",
    pronunciationTip: "Long 'e' sound /iː/: 'TEE-cher' (/ˈtiː.tʃər/).",
    collocations: [
      "school teacher",
      "preschool teacher",
      "teacher guidance",
      "listen to the teacher",
      "dedicated teacher",
      "physical education teacher",
    ],
    phrasalVerbs: [
      {
        phrase: "call out",
        meaning: "shout instructions to students",
        arabic: "يُنَادِي بِصَوْتٍ عَالٍ",
        example: "The teacher called out when recess time came to an end.",
      },
    ],
    sentences: [
      {
        context: "School Recess",
        en: "The preschool teacher organized a fun game of tag on the grassy field.",
        ar: "نَظَّمَتْ مُعَلِّمَةُ الرَّوْضَةِ لُعْبَةَ مُطَارَدَةٍ مُمْتِعَةً عَلَى المَلْعَبِ العُشْبِيِّ.",
      },
      {
        context: "Safety Guidance",
        en: "The teacher reminded students to wait their turn on the tall slide.",
        ar: "ذَكَّرَ المُعَلِّمُ التَّلَامِيذَ بِانْتِظَارِ دَوْرِهِمْ عَلَى الزُّحْلَيْقَةِ العَالِيَةِ.",
      },
      {
        context: "Field Trip",
        en: "Two teachers accompanied the class during their visit to the botanical park.",
        ar: "رَافَقَ مُعَلِّمَانِ الفَصْلَ خِلَالَ زِيَارَتِهِمْ لِلْحَدِيقَةِ النَّبَاتِيَّةِ.",
      },
    ],
    exampleSentence: "The preschool teacher organized a fun game of tag on the grassy field.",
    exampleArabic:
      "نَظَّمَتْ مُعَلِّمَةُ الرَّوْضَةِ لُعْبَةَ مُطَارَدَةٍ مُمْتِعَةً عَلَى المَلْعَبِ العُشْبِيِّ.",
  },
  baby: {
    id: "baby",
    arabic: "رَضِيع",
    partOfSpeech: "noun",
    phonetic: "ˈbeɪbi",
    pronunciationTip: "Long 'a' diphthong /eɪ/: 'BAY-bee' (/ˈbeɪ.bi/).",
    collocations: [
      "baby stroller",
      "sleeping baby",
      "cuddle a baby",
      "baby rattle",
      "infant baby",
      "baby blanket",
    ],
    phrasalVerbs: [
      {
        phrase: "wake up",
        meaning: "stir from sleep",
        arabic: "يَسْتَيْقِظ",
        example: "The little baby woke up and cooed at the flying birds.",
      },
    ],
    sentences: [
      {
        context: "Park Stroll",
        en: "The baby smiled warmly from her shaded stroller under the oak trees.",
        ar: "ابْتَسَمَتِ الرَّضِيعَةُ بِدِفْءٍ مِنْ عَرَبَتِهَا المُظَلَّلَةِ تَحْتَ أَشْجَارِ البَلُّوطِ.",
      },
      {
        context: "Infant Care",
        en: "A gentle mother rocked the sleeping baby in the fresh morning air.",
        ar: "هَزَّتْ أُمٌّ حَنُونٌ الرَّضِيعَ النَّائِمَ فِي هَوَاءِ الصَّبَاحِ المُنْعِشِ.",
      },
      {
        context: "Playground Observation",
        en: "The wide-eyed baby giggled at the colorful balloons floating past.",
        ar: "ضَحِكَ الرَّضِيعُ المَفْتُونُ عَلَى البَالُونَاتِ المُلَوَّنَةِ العَابِرَةِ.",
      },
    ],
    exampleSentence: "The baby smiled warmly from her shaded stroller under the oak trees.",
    exampleArabic:
      "ابْتَسَمَتِ الرَّضِيعَةُ بِدِفْءٍ مِنْ عَرَبَتِهَا المُظَلَّلَةِ تَحْتَ أَشْجَارِ البَلُّوطِ.",
  },
  toddler: {
    id: "toddler",
    arabic: "طِفْلٌ يَتَعَلَّمُ المَشْي (دَارِج)",
    partOfSpeech: "noun",
    phonetic: "ˈtɑːdlər",
    pronunciationTip: "Short 'o' sound /ɑː/: 'TAHD-ler' (/ˈtɑːd.lər/).",
    collocations: [
      "active toddler",
      "toddler playground",
      "toddler swing",
      "curious toddler",
      "toddler steps",
      "energetic toddler",
    ],
    phrasalVerbs: [
      {
        phrase: "toddle along",
        meaning: "walk with unsteady, charming steps",
        arabic: "يَدْرُجُ (يَمْشِي خَطْوًا مُتَمَايِلًا)",
        example: "The toddler toddled along the paved path toward the sandbox.",
      },
    ],
    sentences: [
      {
        context: "First Steps",
        en: "The eager toddler took unsteady steps across the soft rubber safety mat.",
        ar: "خَطَا الطِّفْلُ الدَّارِجُ خَطَوَاتٍ غَيْرَ ثَابِتَةٍ عَبْرَ البِسَاطِ المَطَّاطِيِّ لِلْأَمَانِ.",
      },
      {
        context: "Tot Lot Fun",
        en: "A cheerful toddler clapped his hands while bouncing on the spring duck rider.",
        ar: "صَفَّقَ طِفْلٌ صَغِيرٌ مَرِحٌ بِيَدَيْهِ بَيْنَمَا كَانَ يَتَأَرْجَحُ عَلَى لُعْبَةِ البَطَّةِ الزَّنْبَرَكِيَّةِ.",
      },
      {
        context: "Exploration",
        en: "Curious toddlers love scooping and pouring damp sand with plastic cups.",
        ar: "يُحِبُّ الأَطْفَالُ الدَّارِجُونَ الفُضُولِيُّونَ غَرْفَ الرَّمْلِ الرَّطْبِ وَسَكْبَهُ بِأَكْوَابٍ بْلاسْتِيكِيَّةٍ.",
      },
    ],
    exampleSentence: "The eager toddler took unsteady steps across the soft rubber safety mat.",
    exampleArabic:
      "خَطَا الطِّفْلُ الدَّارِجُ خَطَوَاتٍ غَيْرَ ثَابِتَةٍ عَبْرَ البِسَاطِ المَطَّاطِيِّ لِلْأَمَانِ.",
  },
  teenager: {
    id: "teenager",
    arabic: "مُرَاهِق",
    partOfSpeech: "noun",
    phonetic: "ˈtiːnˌeɪdʒər",
    pronunciationTip: "Primary stress on 'TEEN': /ˈtiːnˌeɪ.dʒər/.",
    collocations: [
      "teenager sports",
      "active teenager",
      "group of teenagers",
      "teenager skateboarder",
      "young teenager",
      "teenager volunteer",
    ],
    phrasalVerbs: [
      {
        phrase: "meet up",
        meaning: "gather with peers",
        arabic: "يَلْتَقِي بِـ",
        example: "Teenagers love to meet up at the park basketball court after class.",
      },
    ],
    sentences: [
      {
        context: "Sports & Recreation",
        en: "A group of energetic teenagers played a friendly game of pick-up basketball.",
        ar: "لَعِبَتْ مَجْمُوعَةٌ مِنَ المُرَاهِقِينَ النَّشِيطِينَ مُبَارَاةَ كُرَةِ سَلَّةٍ وِدِّيَّةً.",
      },
      {
        context: "Skatepark",
        en: "The teenager practiced kickflips and grinds on his wooden skateboard.",
        ar: "تَدَرَّبَ المُرَاهِقُ عَلَى حَرَكَاتِ التَّزَلُّجِ وَالقَفَزَاتِ عَلَى لَوْحِ التَّزَلُّجِ الخَشَبِيِّ.",
      },
      {
        context: "Mentorship",
        en: "Several responsible teenagers helped coach younger kids at the community sports day.",
        ar: "سَاعَدَ عَدَدٌ مِنَ المُرَاهِقِينَ المَسْؤُولِينَ فِي تَدْرِيبِ الصِّغَارِ فِي يَوْمِ الرِّيَاضَةِ المُجْتَمَعِيِّ.",
      },
    ],
    exampleSentence: "A group of energetic teenagers played a friendly game of pick-up basketball.",
    exampleArabic:
      "لَعِبَتْ مَجْمُوعَةٌ مِنَ المُرَاهِقِينَ النَّشِيطِينَ مُبَارَاةَ كُرَةِ سَلَّةٍ وِدِّيَّةً.",
  },
  guard: {
    id: "guard",
    arabic: "حَارِسُ أَمْن",
    partOfSpeech: "noun",
    phonetic: "ɡɑːrd",
    pronunciationTip: "Silent 'u': pronounce 'GARD' (/ɡɑːrd/).",
    collocations: [
      "park guard",
      "security guard",
      "guard post",
      "patrolling guard",
      "vigilant guard",
      "uniformed guard",
    ],
    phrasalVerbs: [
      {
        phrase: "look out",
        meaning: "watch carefully for potential hazards",
        arabic: "يَحْتَرِسُ (يُرَاقِب)",
        example: "The park guard looks out for everyone's safety near the lake.",
      },
    ],
    sentences: [
      {
        context: "Park Safety",
        en: "The friendly park guard patrolled the perimeter gate to ensure child safety.",
        ar: "دَارَ حَارِسُ الحَدِيقَةِ اللَّطِيفُ حَوْلَ بَوَّابَةِ السُّورِ لِضَمَانِ سَلامَةِ الأَطْفَالِ.",
      },
      {
        context: "Assistance",
        en: "A lost little boy approached the uniformed guard for help finding his mother.",
        ar: "تَوَجَّهَ طِفْلٌ صَغِيرٌ تَائِهٌ إِلَى الحَارِسِ الَّذِي يَرْتَدِي الزِّيَّ الرَّسْمِيَّ لِمُسَاعَدَتِهِ فِي العُثُورِ عَلَى أُمِّهِ.",
      },
      {
        context: "Gate Closing",
        en: "The guard locked the main gate at sunset when the park closed.",
        ar: "أَقْفَلَ الحَارِسُ البَوَّابَةَ الرَّئِيسِيَّةَ عِنْدَ الغُرُوبِ مَعَ إِغْلاقِ الحَدِيقَةِ.",
      },
    ],
    exampleSentence: "The friendly park guard patrolled the perimeter gate to ensure child safety.",
    exampleArabic:
      "دَارَ حَارِسُ الحَدِيقَةِ اللَّطِيفُ حَوْلَ بَوَّابَةِ السُّورِ لِضَمَانِ سَلامَةِ الأَطْفَالِ.",
  },
  coach: {
    id: "coach",
    arabic: "مُدَرِّبٌ رِيَاضِيّ",
    partOfSpeech: "noun",
    phonetic: "koʊtʃ",
    pronunciationTip: "Long 'o' sound /oʊ/: 'KOHCH' (/koʊtʃ/).",
    collocations: [
      "soccer coach",
      "head coach",
      "team coach",
      "coach instructions",
      "coach whistle",
      "supportive coach",
    ],
    phrasalVerbs: [
      {
        phrase: "call up",
        meaning: "summon players from the sideline",
        arabic: "يَسْتَدْعِي اللَّاعِبِينَ",
        example: "Coach called up the substitutes for the second half.",
      },
    ],
    sentences: [
      {
        context: "Sports Practice",
        en: "The soccer coach gathered the young players around to explain the passing drill.",
        ar: "جَمَعَ مُدَرِّبُ كُرَةِ القَدَمِ اللَّاعِبِينَ الصِّغَارَ لِيَشْرَحَ لَهُمْ تَمْرِينَ التَّمْرِيرِ.",
      },
      {
        context: "Encouragement",
        en: "Our coach always gives constructive advice and motivates the team to do their best.",
        ar: "يُقَدِّمُ مُدَرِّبُنَا دَائِمًا نَصَائِحَ بَنَّاءَةً وَيُحَفِّزُ الفَرِيقَ لِبَذْلِ قُصَارَى جُهْدِهِمْ.",
      },
      {
        context: "Game Strategy",
        en: "During halftime, the coach drew tactics on a magnetic whiteboard.",
        ar: "خِلَالَ اسْتِرَاحَةِ الشَّوْطَيْنِ، رَسَمَ المُدَرِّبُ الخُطَطَ عَلَى لَوْحٍ مَغْنَاطِيسِيٍّ أَبْيَضَ.",
      },
    ],
    exampleSentence:
      "The soccer coach gathered the young players around to explain the passing drill.",
    exampleArabic:
      "جَمَعَ مُدَرِّبُ كُرَةِ القَدَمِ اللَّاعِبِينَ الصِّغَارَ لِيَشْرَحَ لَهُمْ تَمْرِينَ التَّمْرِيرِ.",
  },
  volunteer: {
    id: "volunteer",
    arabic: "مُتَطَوِّع",
    partOfSpeech: "noun",
    phonetic: "ˌvɑːlənˈtɪr",
    pronunciationTip: "Stress on final syllable: 'vol-un-TEER' (/ˌvɑː.lənˈtɪr/).",
    collocations: [
      "park volunteer",
      "community volunteer",
      "volunteer work",
      "helpful volunteer",
      "youth volunteer",
      "volunteer team",
    ],
    phrasalVerbs: [
      {
        phrase: "help out",
        meaning: "assist willingly without pay",
        arabic: "يُقَدِّمُ المُسَاعَدَةَ تَطَوُّعًا",
        example: "Volunteers helped out by repainting the benches and planting flowers.",
      },
    ],
    sentences: [
      {
        context: "Community Service",
        en: "Dedicated volunteers spent Saturday morning planting flowers and cleaning playground mulch.",
        ar: "قَضَى المُتَطَوِّعُونَ المُخْلِصُونَ صَبَاحَ السَّبْتِ فِي زِرَاعَةِ الزُّهُورِ وَتَنْظِيفِ أَرْضِيَّةِ المَلْعَبِ.",
      },
      {
        context: "Event Organizing",
        en: "A cheerful volunteer handed out water bottles and snacks to young marathon runners.",
        ar: "وَزَّعَ مُتَطَوِّعٌ بَشُوشٌ زُجَاجَاتِ المِيَاهِ وَالوُجَبَاتِ الخَفِيفَةَ عَلَى عَدَّائِي المَارَاثُونِ الصِّغَارِ.",
      },
      {
        context: "Safety",
        en: "Parent volunteers took turns monitoring the crosswalk near the community park.",
        ar: "تَنَاوَبَ أَوْلِيَاءُ الأُمُورِ المُتَطَوِّعُونَ عَلَى مُرَاقَبَةِ مَمَرِّ المُشَاةِ قُرْبَ الحَدِيقَةِ العَامَّةِ.",
      },
    ],
    exampleSentence:
      "Dedicated volunteers spent Saturday morning planting flowers and cleaning playground mulch.",
    exampleArabic:
      "قَضَى المُتَطَوِّعُونَ المُخْلِصُونَ صَبَاحَ السَّبْتِ فِي زِرَاعَةِ الزُّهُورِ وَتَنْظِيفِ أَرْضِيَّةِ المَلْعَبِ.",
  },
  swinging: {
    id: "swinging",
    arabic: "التَّأَرْجُح",
    partOfSpeech: "noun",
    phonetic: "ˈswɪŋɪŋ",
    pronunciationTip: "Pronounce 'SWING-ing' (/ˈswɪŋ.ɪŋ/).",
    collocations: [
      "high swinging",
      "gentle swinging",
      "enjoy swinging",
      "swinging motion",
      "swinging back and forth",
      "outdoor swinging",
    ],
    phrasalVerbs: [
      {
        phrase: "swing out",
        meaning: "move outward at peak height",
        arabic: "يَتَرَجَّحُ لِلْخَارِج",
        example: "Her long hair flew back while swinging out toward the blue sky.",
      },
    ],
    sentences: [
      {
        context: "Play Activity",
        en: "Swinging high in the cool breeze gave the children a thrilling sense of flight.",
        ar: "مَنَحَ التَّأَرْجُحُ عَالِيًا فِي النَّسِيمِ العَلِيلِ الأَطْفَالَ شُعُورًا مُثِيرًا بِالطَّيَرَانِ.",
      },
      {
        context: "Sensory Balance",
        en: "Gentle swinging helps calm young toddlers and improves vestibular balance.",
        ar: "يُسَاعِدُ التَّأَرْجُحُ اللَّطِيفُ عَلَى تَهْدِئَةِ الأَطْفَالِ الصِّغَارِ وَيُحَسِّنُ التَّوَازُنَ الدِّهْلِيزِيَّ.",
      },
      {
        context: "Park Scene",
        en: "Rhythmic swinging creaked happily in the peaceful neighborhood park.",
        ar: "أَصْدَرَ التَّأَرْجُحُ الإِيقَاعِيُّ صَرِيرًا مُبْهِجًا فِي حَدِيقَةِ الحَيِّ الهَادِئَةِ.",
      },
    ],
    exampleSentence:
      "Swinging high in the cool breeze gave the children a thrilling sense of flight.",
    exampleArabic:
      "مَنَحَ التَّأَرْجُحُ عَالِيًا فِي النَّسِيمِ العَلِيلِ الأَطْفَالَ شُعُورًا مُثِيرًا بِالطَّيَرَانِ.",
  },
  sliding: {
    id: "sliding",
    arabic: "التَّزَحْلُق",
    partOfSpeech: "noun",
    phonetic: "ˈslaɪdɪŋ",
    pronunciationTip: "Long 'i' diphthong: 'SLY-ding' (/ˈslaɪ.dɪŋ/).",
    collocations: [
      "fast sliding",
      "smooth sliding",
      "sliding board",
      "sliding down",
      "sliding race",
      "fun sliding",
    ],
    phrasalVerbs: [
      {
        phrase: "slide into",
        meaning: "glide smoothly to a stop",
        arabic: "يَنْزَلِقُ إِلَى",
        example: "The excited kids slid into the soft pile of leaves.",
      },
    ],
    sentences: [
      {
        context: "Active Recreation",
        en: "Sliding down the curving chute brought wide grins to all the kids.",
        ar: "جَلَبَ التَّزَحْلُقُ إِلَى أَسْفَلِ المُنْزَلَقِ المُنْحَنِي ابْتِسَامَاتٍ عَرِيضَةً لِجَمِيعِ الأَطْفَالِ.",
      },
      {
        context: "Winter Fun",
        en: "Sliding on icy sledding hills is a favorite winter sport for families.",
        ar: "يُعَدُّ التَّزَحْلُقُ عَلَى تِلَالِ التَّزَلُّجِ الجَلِيدِيَّةِ رِيَاضَةً شَتْوِيَّةً مُفَضَّلَةً لِلْعَائِلاتِ.",
      },
      {
        context: "Physics of Play",
        en: "Smooth polished plastic enables fast, frictionless sliding.",
        ar: "يُتِيحُ البْلاسْتِيكُ المَصْقُولُ النَّاعِمُ تَزَحْلُقًا سَرِيعًا دُونَ احْتِكَاكٍ.",
      },
    ],
    exampleSentence: "Sliding down the curving chute brought wide grins to all the kids.",
    exampleArabic:
      "جَلَبَ التَّزَحْلُقُ إِلَى أَسْفَلِ المُنْزَلَقِ المُنْحَنِي ابْتِسَامَاتٍ عَرِيضَةً لِجَمِيعِ الأَطْفَالِ.",
  },
  climbing: {
    id: "climbing",
    arabic: "التَّسَلُّق",
    partOfSpeech: "noun",
    phonetic: "ˈklaɪmɪŋ",
    pronunciationTip: "Silent 'b': pronounce 'CLY-ming' (/ˈklaɪ.mɪŋ/).",
    collocations: [
      "rock climbing",
      "tree climbing",
      "rope climbing",
      "climbing wall",
      "climbing gear",
      "safe climbing",
    ],
    phrasalVerbs: [
      {
        phrase: "climb up",
        meaning: "ascend vertical steps or footholds",
        arabic: "يَتَسَلَّقُ صُعُودًا",
        example: "He climbed up the boulder wall using color-coded hand grips.",
      },
    ],
    sentences: [
      {
        context: "Physical Fitness",
        en: "Climbing the cargo rope net builds agility, balance, and hand grip strength.",
        ar: "يَبْنِي تَسَلُّقُ شَبَكَةِ الحِبَالِ المُرُونَةَ وَالتَّوَازُنَ وَقُوَّةَ قَبْضَةِ اليَدِ.",
      },
      {
        context: "Wall Climbing",
        en: "The playground includes a mini boulder wall designed for safe rock climbing.",
        ar: "يَشْمَلُ المَلْعَبُ جِدَارَ تَسَلُّقٍ مُصَغَّرًا مُصَمَّمًا لِتَسَلُّقِ الصُّخُورِ بِأَمَانٍ.",
      },
      {
        context: "Adventure",
        en: "Kids cheered as they mastered climbing to the summit of the tower.",
        ar: "هَتَفَ الأَطْفَالُ بَعْدَ أَنْ أَتْقَنُوا التَّسَلُّقَ إِلَى قِمَّةِ البُرْجِ.",
      },
    ],
    exampleSentence: "Climbing the cargo rope net builds agility, balance, and hand grip strength.",
    exampleArabic:
      "يَبْنِي تَسَلُّقُ شَبَكَةِ الحِبَالِ المُرُونَةَ وَالتَّوَازُنَ وَقُوَّةَ قَبْضَةِ اليَدِ.",
  },
  running: {
    id: "running",
    arabic: "الجَرْي (الرَّكْض)",
    partOfSpeech: "noun",
    phonetic: "ˈrʌnɪŋ",
    pronunciationTip: "Short 'u' sound /ʌ/: 'RUN-ing' (/ˈrʌn.ɪŋ/).",
    collocations: [
      "running shoes",
      "fast running",
      "running track",
      "running game",
      "endurance running",
      "sprint running",
    ],
    phrasalVerbs: [
      {
        phrase: "run around",
        meaning: "sprint playfully in circles",
        arabic: "يَرْكُضُ فِي الأَرْجَاءِ",
        example: "Children love to run around freely across the grassy meadow.",
      },
    ],
    sentences: [
      {
        context: "Cardio Exercise",
        en: "Running across the open grass field keeps the children energetic and healthy.",
        ar: "يُحَافِظُ الجَرْيُ عَبْرَ الحَقْلِ العُشْبِيِّ المَفْتُوحِ عَلَى نَشَاطِ الأَطْفَالِ وَصِحَّتِهِمْ.",
      },
      {
        context: "Footwear",
        en: "Proper cushioned athletic shoes protect ankles during sprint running.",
        ar: "تَحْمِي الأَحْذِيَةُ الرِّيَاضِيَّةُ المُبَطَّنَةُ المُنَاسِبَةُ الكَاحِلَيْنِ أَثْنَاءَ الرَّكْضِ السَّرِيعِ.",
      },
      {
        context: "Games",
        en: "A game of tag involves rapid turns, sudden stops, and swift running.",
        ar: "تَتَضَمَّنُ لُعْبَةُ المُطَارَدَةِ انْعِطَافَاتٍ سَرِيعَةً وَتَوَقُّفَاتٍ مُفَاجِئَةً وَجَرْيًا خَاطِفًا.",
      },
    ],
    exampleSentence:
      "Running across the open grass field keeps the children energetic and healthy.",
    exampleArabic:
      "يُحَافِظُ الجَرْيُ عَبْرَ الحَقْلِ العُشْبِيِّ المَفْتُوحِ عَلَى نَشَاطِ الأَطْفَالِ وَصِحَّتِهِمْ.",
  },
  jumping: {
    id: "jumping",
    arabic: "القَفْز",
    partOfSpeech: "noun",
    phonetic: "ˈdʒʌmpɪŋ",
    pronunciationTip: "Pronounce 'JUMP-ing' (/ˈdʒʌm.pɪŋ/).",
    collocations: [
      "jumping rope",
      "high jumping",
      "jumping jacks",
      "jumping into puddles",
      "jumping off the beam",
      "trampoline jumping",
    ],
    phrasalVerbs: [
      {
        phrase: "jump over",
        meaning: "leap across an obstacle",
        arabic: "يَقْفِزُ فَوْقَ",
        example: "He learned how to safely jump over small hurdles.",
      },
    ],
    sentences: [
      {
        context: "Play & Exercise",
        en: "Jumping rope to rhythmic rhymes is a classic recess game among schoolchildren.",
        ar: "يُعَدُّ نَطُّ الحَبْلِ مَعَ الأَنَاشِيدِ الإِيقَاعِيَّةِ لُعْبَةَ اسْتِرَاحَةٍ كْلاسِيكِيَّةً بَيْنَ تَلامِيذِ المَدَارِسِ.",
      },
      {
        context: "Coordination",
        en: "Landing on both feet softly ensures safe jumping from low platforms.",
        ar: "يَضْمَنُ الهُبُوطُ بِخِفَّةٍ عَلَى كِلْتَا القَدَمَيْنِ قَفْزًا آمِنًا مِنَ المِنَصَّاتِ المُنْخَفِضَةِ.",
      },
      {
        context: "Enthusiasm",
        en: "The excited kids were jumping with joy after scoring the winning goal.",
        ar: "كَانَ الأَطْفَالُ المُتَحَمِّسُونَ يَقْفِزُونَ مِنَ الفَرَحِ بَعْدَ تَسْجِيلِ هَدَفِ الفَوْزِ.",
      },
    ],
    exampleSentence:
      "Jumping rope to rhythmic rhymes is a classic recess game among schoolchildren.",
    exampleArabic:
      "يُعَدُّ نَطُّ الحَبْلِ مَعَ الأَنَاشِيدِ الإِيقَاعِيَّةِ لُعْبَةَ اسْتِرَاحَةٍ كْلاسِيكِيَّةً بَيْنَ تَلامِيذِ المَدَارِسِ.",
  },
  throwing: {
    id: "throwing",
    arabic: "الرَّمْي (القَذْف)",
    partOfSpeech: "noun",
    phonetic: "ˈθroʊɪŋ",
    pronunciationTip: "Voiceless 'th' /θ/ with 'ro-wing': 'THROH-ing' (/ˈθroʊ.ɪŋ/).",
    collocations: [
      "throwing a ball",
      "frisbee throwing",
      "accurate throwing",
      "throwing technique",
      "overhand throwing",
      "throwing motion",
    ],
    phrasalVerbs: [
      {
        phrase: "throw out",
        meaning: "launch an object to a teammate",
        arabic: "يَرْمِي نَحْوَ",
        example: "The catcher threw out the ball to second base.",
      },
    ],
    sentences: [
      {
        context: "Sports Skills",
        en: "Practicing overhand throwing improves upper-body coordination and pitch accuracy.",
        ar: "تُحَسِّنُ مُمَارَسَةُ الرَّمْيِ مِنْ فَوْقِ الكَتِفِ تَنَاسُقَ الجُزْءِ العُلْوِيِّ مِنَ الجِسْمِ وَدِقَّةَ التَّسْدِيدِ.",
      },
      {
        context: "Park Catch",
        en: "He enjoyed throwing a flying disc across the lawn for his dog to chase.",
        ar: "اسْتَمْتَعَ بِقَذْفِ القُرْصِ الطَّائِرِ عَبْرَ الحَقْلِ لِيَلْحَقَ بِهِ كَلْبُهُ.",
      },
      {
        context: "Team Games",
        en: "Quick throwing and accurate passing are essential skills in dodgeball.",
        ar: "يُعَدُّ الرَّمْيُ السَّرِيعُ وَالتَّمْرِيرُ الدَّقِيقُ مِنْ مَهَارَاتِ لُعْبَةِ كُرَةِ التَّفَادِي الأَسَاسِيَّةِ.",
      },
    ],
    exampleSentence:
      "Practicing overhand throwing improves upper-body coordination and pitch accuracy.",
    exampleArabic:
      "تُحَسِّنُ مُمَارَسَةُ الرَّمْيِ مِنْ فَوْقِ الكَتِفِ تَنَاسُقَ الجُزْءِ العُلْوِيِّ مِنَ الجِسْمِ وَدِقَّةَ التَّسْدِيدِ.",
  },
  catching: {
    id: "catching",
    arabic: "الإِمْسَاكُ بِالشَّيْء (اللَّقْف)",
    partOfSpeech: "noun",
    phonetic: "ˈkætʃɪŋ",
    pronunciationTip: "Short 'a' /æ/ ending in 'ing': 'KATCH-ing' (/ˈkætʃ.ɪŋ/).",
    collocations: [
      "catching a ball",
      "baseball catching",
      "two-handed catching",
      "catching glove",
      "practicing catching",
      "catching skills",
    ],
    phrasalVerbs: [
      {
        phrase: "catch up",
        meaning: "reach the same point as another",
        arabic: "يَلْحَقُ بِـ",
        example: "He ran quickly to catch up with his classmates.",
      },
    ],
    sentences: [
      {
        context: "Coordination",
        en: "Catching a high baseball requires keen hand-eye coordination and focus.",
        ar: "يَتَطَلَّبُ الْتِقَاطُ كُرَةِ البَيْسْبُولِ العَالِيَةِ تَنَاسُقًا دَقِيقًا بَيْنَ العَيْنِ وَاليَدِ وَتَرْكِيزًا.",
      },
      {
        context: "Playground Catch",
        en: "Father and daughter practiced catching the soft foam ball back and forth.",
        ar: "تَدَرَّبَ الأَبُ وَابْنَتُهُ عَلَى لَقْفِ الكُرَةِ الرَّغْوِيَّةِ الطَّرِيَّةِ ذَهَابًا وَإِيَابًا.",
      },
      {
        context: "Glove Technique",
        en: "Opening the leather mitt wide makes catching fly balls much easier.",
        ar: "فَتْحُ القُفَّازِ الجِلْدِيِّ عَلَى اتِّسَاعِهِ يَجْعَلُ الْتِقَاطَ الكُرَاتِ الطَّائِرَةِ أَسْهَلَ بِكَثِيرٍ.",
      },
    ],
    exampleSentence: "Catching a high baseball requires keen hand-eye coordination and focus.",
    exampleArabic:
      "يَتَطَلَّبُ الْتِقَاطُ كُرَةِ البَيْسْبُولِ العَالِيَةِ تَنَاسُقًا دَقِيقًا بَيْنَ العَيْنِ وَاليَدِ وَتَرْكِيزًا.",
  },
  kicking: {
    id: "kicking",
    arabic: "الرَّكْل",
    partOfSpeech: "noun",
    phonetic: "ˈkɪkɪŋ",
    pronunciationTip: "Short 'i' sound /ɪ/: 'KIK-ing' (/ˈkɪk.ɪŋ/).",
    collocations: [
      "kicking a soccer ball",
      "powerful kicking",
      "kicking technique",
      "kicking towards the goal",
      "penalty kicking",
      "high kicking",
    ],
    phrasalVerbs: [
      {
        phrase: "kick off",
        meaning: "start a match or activity",
        arabic: "يَبْدَأُ (يَرْكُلُ كُرَةَ البِدَايَة)",
        example: "The referee blew the whistle to kick off the tournament.",
      },
    ],
    sentences: [
      {
        context: "Soccer Practice",
        en: "Kicking with the inside of the foot provides maximum passing accuracy.",
        ar: "يَمْنَحُ الرَّكْلُ بِبَاطِنِ القَدَمِ أَقْصَى دَرَجَاتِ الدِّقَّةِ فِي التَّمْرِيرِ.",
      },
      {
        context: "Park Games",
        en: "The boys spent hours kicking the soccer ball back and forth between goalposts.",
        ar: "قَضَى الأَوْلادُ سَاعَاتٍ فِي رَكْلِ كُرَةِ القَدَمِ ذَهَابًا وَإِيَابًا بَيْنَ قَائِمَيِ المَرْمَى.",
      },
      {
        context: "Martial Arts & Sports",
        en: "Proper kicking form involves engaging your core muscles for balance.",
        ar: "تَتَضَمَّنُ هَيْئَةُ الرَّكْلِ الصَّحِيحَةُ إِشْرَاكَ عَضَلاتِ الجِذْعِ لِلْحِفَاظِ عَلَى التَّوَازُنِ.",
      },
    ],
    exampleSentence: "Kicking with the inside of the foot provides maximum passing accuracy.",
    exampleArabic:
      "يَمْنَحُ الرَّكْلُ بِبَاطِنِ القَدَمِ أَقْصَى دَرَجَاتِ الدِّقَّةِ فِي التَّمْرِيرِ.",
  },
  skipping: {
    id: "skipping",
    arabic: "الحَجْل (نَطُّ الحَبْل)",
    partOfSpeech: "noun",
    phonetic: "ˈskɪpɪŋ",
    pronunciationTip: "Short 'i' sound /ɪ/: 'SKIP-ing' (/ˈskɪp.ɪŋ/).",
    collocations: [
      "skipping rope",
      "skipping down the path",
      "cheerful skipping",
      "skipping rhythm",
      "skipping exercise",
      "skipping steps",
    ],
    phrasalVerbs: [
      {
        phrase: "skip along",
        meaning: "move forward with light bounding steps",
        arabic: "يَحْجُلُ فَرِحًا لِلأَمَام",
        example: "The little girl skipped along the path holding her mother's hand.",
      },
    ],
    sentences: [
      {
        context: "Playground Joy",
        en: "The happy girl went skipping down the park path toward the playground swings.",
        ar: "مَضَتِ الفَتَاةُ المَبْسُوطَةُ تَحْجُلُ فَرَحًا عَلَى مَمَرِّ الحَدِيقَةِ نَحْوَ أَرَاجِيحِ المَلْعَبِ.",
      },
      {
        context: "Cardio Training",
        en: "Skipping rope for ten minutes provides an intense full-body cardiovascular workout.",
        ar: "يُوَفِّرُ نَطُّ الحَبْلِ لِمُدَّةِ عَشْرِ دَقَائِقَ تَمْرِينًا قَلْبِيًّا مُكَثَّفًا لِكَامِلِ الجِسْمِ.",
      },
      {
        context: "Rhythm",
        en: "Two children chanted schoolyard songs while skipping together in sync.",
        ar: "أَنْشَدَ طِفْلَانِ أَغَانِيَ المَدْرَسَةِ بَيْنَمَا كَانَا يَقْفِزَانِ مَعًا بِتَنَاغُمٍ.",
      },
    ],
    exampleSentence:
      "The happy girl went skipping down the park path toward the playground swings.",
    exampleArabic:
      "مَضَتِ الفَتَاةُ المَبْسُوطَةُ تَحْجُلُ فَرَحًا عَلَى مَمَرِّ الحَدِيقَةِ نَحْوَ أَرَاجِيحِ المَلْعَبِ.",
  },
  hiding: {
    id: "hiding",
    arabic: "الاِخْتِبَاء",
    partOfSpeech: "noun",
    phonetic: "ˈhaɪdɪŋ",
    pronunciationTip: "Long 'i' diphthong /aɪ/: 'HY-ding' (/ˈhaɪ.dɪŋ/).",
    collocations: [
      "hide-and-seek hiding",
      "secret hiding spot",
      "hiding behind a tree",
      "expert hiding",
      "good at hiding",
      "hiding place",
    ],
    phrasalVerbs: [
      {
        phrase: "hide away",
        meaning: "remain concealed in a secluded spot",
        arabic: "يَتَوَارَى (يَخْتَبِئ)",
        example: "He hid away inside the wooden tunnel during hide-and-seek.",
      },
    ],
    sentences: [
      {
        context: "Childhood Games",
        en: "Hiding behind the broad oak trunk kept him safe during hide-and-seek.",
        ar: "حَافَظَ الاِخْتِبَاءُ خَلْفَ جِذْعِ البَلُّوطِ العَرِيضِ عَلَى أَمَانِهِ أَثْنَاءَ لُعْبَةِ الغُمَّيْضَةِ.",
      },
      {
        context: "Playground Maze",
        en: "The play tunnel provided an ideal hiding place from the seekers.",
        ar: "وَفَّرَ نَفَقُ اللَّعِبِ مَكَانَ اخْتِبَاءٍ مِثَالِيًّا عَنِ البَاحِثِينَ.",
      },
      {
        context: "Suspense",
        en: "She held her breath while hiding quietly beneath the climbing platform.",
        ar: "حَبَسَتْ أَنْفَاسَهَا وَهِيَ تَخْتَبِئُ بِهُدُوءٍ تَحْتَ مِنَصَّةِ التَّسَلُّقِ.",
      },
    ],
    exampleSentence: "Hiding behind the broad oak trunk kept him safe during hide-and-seek.",
    exampleArabic:
      "حَافَظَ الاِخْتِبَاءُ خَلْفَ جِذْعِ البَلُّوطِ العَرِيضِ عَلَى أَمَانِهِ أَثْنَاءَ لُعْبَةِ الغُمَّيْضَةِ.",
  },
  "water-fountain": {
    id: "water-fountain",
    arabic: "نَافُورَةُ شُرْبِ المَاء (مَشْرَبِيَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈwɔːtər ˌfaʊntn",
    pronunciationTip: "Pronounce 'water' (/ˈwɔː.tər/) then 'fountain' (/ˈfaʊn.tən/).",
    collocations: [
      "drinking water fountain",
      "press the water fountain",
      "cold water fountain",
      "outdoor water fountain",
      "water fountain spout",
      "refill at the water fountain",
    ],
    phrasalVerbs: [
      {
        phrase: "drink from",
        meaning: "sip stream directly from tap",
        arabic: "يَشْرَبُ مِنْ",
        example: "Thirsty athletes drank from the cool stainless steel fountain.",
      },
    ],
    sentences: [
      {
        context: "Hydration",
        en: "Thirsty kids lined up at the outdoor water fountain to take cool drinks.",
        ar: "اصْطَفَّ الأَطْفَالُ العِطَاشُ عِنْدَ نَافُورَةِ الشُّرْبِ الخَارِجِيَّةِ لِتَنَاوُلِ جَرْعَاتِ مَاءٍ بَارِدَةٍ.",
      },
      {
        context: "Refill Station",
        en: "She refilled her reusable sports bottle from the park water fountain.",
        ar: "أَعَادَتْ مَلْءَ قَارُورَتِهَا الرِّيَاضِيَّةِ مِنْ مَشْرَبِيَّةِ الحَدِيقَةِ.",
      },
      {
        context: "Hygiene & Design",
        en: "The stainless steel fountain features a lower basin accessible for toddlers.",
        ar: "تَتَمَيَّزُ نَافُورَةُ الفُولاذِ المُقَاوِمِ لِلصَّدَأِ بِحَوْضٍ سُفْلِيٍّ يُنَاسِبُ الأَطْفَالَ الصِّغَارَ.",
      },
    ],
    exampleSentence: "Thirsty kids lined up at the outdoor water fountain to take cool drinks.",
    exampleArabic:
      "اصْطَفَّ الأَطْفَالُ العِطَاشُ عِنْدَ نَافُورَةِ الشُّرْبِ الخَارِجِيَّةِ لِتَنَاوُلِ جَرْعَاتِ مَاءٍ بَارِدَةٍ.",
  },
  "shade-structure": {
    id: "shade-structure",
    arabic: "مِظَلَّةُ وِقَايَةٍ مِنَ الشَّمْس",
    partOfSpeech: "noun",
    phonetic: "ˈʃeɪd ˌstrʌktʃər",
    pronunciationTip: "Pronounce 'shade' (/ʃeɪd/) then 'structure' (/ˈstrʌk.tʃər/).",
    collocations: [
      "canopy shade structure",
      "protective shade structure",
      "rest under the shade structure",
      "fabric shade structure",
      "playground shade structure",
      "sun protection shade structure",
    ],
    phrasalVerbs: [
      {
        phrase: "cool off",
        meaning: "rest in the shadow away from direct heat",
        arabic: "يَسْتَرِيحُ فِي الظِّلّ",
        example: "Parents cooled off under the large fabric canopy on hot afternoons.",
      },
    ],
    sentences: [
      {
        context: "Sun Safety",
        en: "The large fabric shade structure shields children from harsh midday sunlight.",
        ar: "تَحْمِي مِظَلَّةُ القُمَاشِ الكَبِيرَةُ الأَطْفَالَ مِنْ أَشِعَّةِ الشَّمْسِ القَوِيَّةِ فِي مُنْتَصَفِ النَّهَارِ.",
      },
      {
        context: "Park Architecture",
        en: "Picnic tables were positioned underneath the modern steel shade structure.",
        ar: "وُضِعَتْ طَاوِلاتُ النُّزْهَةِ تَحْتَ مِظَلَّةِ الحِمَايَةِ الفُولاذِيَّةِ الحَدِيثَةِ.",
      },
      {
        context: "Comfort",
        en: "Resting under the canopy helps prevent overheating during summer play.",
        ar: "تُسَاعِدُ الاسْتِرَاحَةُ تَحْتَ المِظَلَّةِ فِي تَفَادِي ارْتِفَاعِ حَرَارَةِ الجِسْمِ خِلَالَ اللَّعِبِ الصَّيْفِيِّ.",
      },
    ],
    exampleSentence:
      "The large fabric shade structure shields children from harsh midday sunlight.",
    exampleArabic:
      "تَحْمِي مِظَلَّةُ القُمَاشِ الكَبِيرَةُ الأَطْفَالَ مِنْ أَشِعَّةِ الشَّمْسِ القَوِيَّةِ فِي مُنْتَصَفِ النَّهَارِ.",
  },
  sign: {
    id: "sign",
    arabic: "لَافِتَةُ إِرْشَادَات",
    partOfSpeech: "noun",
    phonetic: "saɪn",
    pronunciationTip: "Silent 'g': pronounce 'SYNE' (/saɪn/).",
    collocations: [
      "park rules sign",
      "safety sign",
      "read the sign",
      "metal sign",
      "posted sign",
      "welcome sign",
    ],
    phrasalVerbs: [
      {
        phrase: "point to",
        meaning: "indicate directions or guidelines",
        arabic: "يُشِيرُ إِلَى",
        example: "The wooden sign pointed toward the playground and restrooms.",
      },
    ],
    sentences: [
      {
        context: "Park Guidelines",
        en: "A clear metal sign near the gate displays playground opening hours and safety rules.",
        ar: "تَعْرِضُ لَافِتَةٌ مَعْدَنِيَّةٌ وَاضِحَةٌ قُرْبَ البَوَّابَةِ سَاعَاتِ فَتْحِ المَلْعَبِ وَقَوَاعِدَ الأَمَانِ.",
      },
      {
        context: "Directions",
        en: "The wooden trail sign directed visitors toward the scenic duck pond.",
        ar: "أَرْشَدَتْ لَافِتَةُ المَسَارِ الخَشَبِيَّةُ الزُّوَّارَ نَحْوَ بِرْكَةِ البَطِّ الخَلابَةِ.",
      },
      {
        context: "Caution",
        en: "A caution sign warned visitors that the playground surface was wet.",
        ar: "حَذَّرَتْ لَافِتَةُ تَنْبِيهٍ الزُّوَّارَ مِنْ أَنَّ أَرْضِيَّةَ المَلْعَبِ كَانَتْ مُبْتَلَّةً.",
      },
    ],
    exampleSentence:
      "A clear metal sign near the gate displays playground opening hours and safety rules.",
    exampleArabic:
      "تَعْرِضُ لَافِتَةٌ مَعْدَنِيَّةٌ وَاضِحَةٌ قُرْبَ البَوَّابَةِ سَاعَاتِ فَتْحِ المَلْعَبِ وَقَوَاعِدَ الأَمَانِ.",
  },
  bell: {
    id: "bell",
    arabic: "جَرَسُ المَلْعَب",
    partOfSpeech: "noun",
    phonetic: "bɛl",
    pronunciationTip: "Short 'e' sound /ɛ/: 'BELL' (/bɛl/).",
    collocations: [
      "ring the bell",
      "school bell",
      "brass bell",
      "chime of a bell",
      "recess bell",
      "loud bell",
    ],
    phrasalVerbs: [
      {
        phrase: "ring out",
        meaning: "sound clearly across the yard",
        arabic: "يَرُنُّ عَالِيًا",
        example: "The brass bell rang out loudly to signal the start of playtime.",
      },
    ],
    sentences: [
      {
        context: "Playground Clang",
        en: "Kids climbed the ship playhouse to proudly ring the shiny brass bell.",
        ar: "تَسَلَّقَ الأَطْفَالُ بَيْتَ السَّفِينَةِ لِيَقْرَعُوا بِفَخْرٍ الجَرَسَ النُّحَاسِيَّ اللَّامِعَ.",
      },
      {
        context: "School Recess",
        en: "The school bell chimed loudly, announcing that afternoon recess had begun.",
        ar: "دَقَّ جَرَسُ المَدْرَسَةِ بِصَوْتٍ عَالٍ مُعْلِنًا بَدْءَ اسْتِرَاحَةِ بَعْدِ الظُّهْرِ.",
      },
      {
        context: "Sound & Signal",
        en: "A clear bell chime echoed across the open playing fields.",
        ar: "تَرَدَّدَتْ رَنَّةُ الجَرَسِ الوَاضِحَةُ عَبْرَ مَلَاعِبِ اللَّعِبِ المَفْتُوحَةِ.",
      },
    ],
    exampleSentence: "Kids climbed the ship playhouse to proudly ring the shiny brass bell.",
    exampleArabic:
      "تَسَلَّقَ الأَطْفَالُ بَيْتَ السَّفِينَةِ لِيَقْرَعُوا بِفَخْرٍ الجَرَسَ النُّحَاسِيَّ اللَّامِعَ.",
  },
  flag: {
    id: "flag",
    arabic: "عَلَم (رَايَة)",
    partOfSpeech: "noun",
    phonetic: "flæɡ",
    pronunciationTip: "Short 'a' sound /æ/ as in 'bag': 'FLAG' (/flæɡ/).",
    collocations: [
      "waving flag",
      "flag pole",
      "raise the flag",
      "colorful flag",
      "national flag",
      "flapping flag",
    ],
    phrasalVerbs: [
      {
        phrase: "wave in",
        meaning: "flutter with moving air currents",
        arabic: "يُرَفْرِفُ فِي الهَوَاء",
        example: "The bright flag waved in the fresh autumn breeze.",
      },
    ],
    sentences: [
      {
        context: "Park Landmark",
        en: "A vibrant rainbow flag fluttered proudly atop the tall central flagpole.",
        ar: "رَفْرَفَ عَلَمُ قَوْسِ قُزَحَ الزَّاهِي بِفَخْرٍ فَوْقَ سَارِيَةِ الأَعْلامِ المَرْكَزِيَّةِ الطَّوِيلَةِ.",
      },
      {
        context: "Playground Castle",
        en: "A small triangular yellow flag crowned the highest roof of the play fort.",
        ar: "تَوَّجَتْ رَايَةٌ صَفْرَاءُ مُثَلَّثَةٌ صَغِيرَةٌ أَعْلَى سَقْفٍ فِي قَلْعَةِ اللَّعِبِ.",
      },
      {
        context: "Ceremony",
        en: "The scouts raised the national flag during the morning opening ceremony.",
        ar: "رَفَعَ الكَشَّافَةُ العَلَمَ الوَطَنِيَّ خِلَالَ مَرَاسِمِ الاِفْتِتَاحِ الصَّبَاحِيَّةِ.",
      },
    ],
    exampleSentence: "A vibrant rainbow flag fluttered proudly atop the tall central flagpole.",
    exampleArabic:
      "رَفْرَفَ عَلَمُ قَوْسِ قُزَحَ الزَّاهِي بِفَخْرٍ فَوْقَ سَارِيَةِ الأَعْلامِ المَرْكَزِيَّةِ الطَّوِيلَةِ.",
  },
  tissue: {
    id: "tissue",
    arabic: "مَنْدِيلٌ وَرَقِيّ (مَحَارِم)",
    partOfSpeech: "noun",
    phonetic: "ˈtɪʃuː",
    pronunciationTip: "Pronounce 'TISH-oo' (/ˈtɪʃ.uː/).",
    collocations: [
      "box of tissues",
      "facial tissue",
      "soft tissue",
      "pull a tissue",
      "disposable tissue",
      "pocket tissue",
    ],
    phrasalVerbs: [
      {
        phrase: "pull out",
        meaning: "dispense a single paper sheet",
        arabic: "يَسْحَبُ مَنْدِيلًا",
        example: "She pulled out a soft facial tissue from the box on the vanity.",
      },
    ],
    sentences: [
      {
        context: "Daily Hygiene",
        en: "She pulled a soft tissue from the decorative box on the bathroom vanity.",
        ar: "سَحَبَتْ مَنْدِيلًا وَرَقِيًّا نَاعِمًا مِنْ عُلْبَةِ المَحَارِمِ المُزَخْرَفَةِ عَلَى خِزَانَةِ الحَمَّامِ.",
      },
      {
        context: "Skincare",
        en: "Use a gentle facial tissue to blot excess moisture from your cheeks.",
        ar: "اسْتَخْدِمْ مَنْدِيلًا وَرَقِيًّا لَطِيفًا لِتَجْفِيفِ الرُّطُوبَةِ الزَّائِدَةِ عَنْ خَدَّيْكَ.",
      },
      {
        context: "Storage",
        en: "A wooden dispenser box keeps tissues neatly organized beside the mirror.",
        ar: "تَحْفَظُ عُلْبَةُ التَّوْزِيعِ الخَشَبِيَّةِ المَنَادِيلَ مُرَتَّبَةً بِجَانِبِ المِرْآةِ.",
      },
    ],
    exampleSentence: "She pulled a soft tissue from the decorative box on the bathroom vanity.",
    exampleArabic:
      "سَحَبَتْ مَنْدِيلًا وَرَقِيًّا نَاعِمًا مِنْ عُلْبَةِ المَحَارِمِ المُزَخْرَفَةِ عَلَى خِزَانَةِ الحَمَّامِ.",
  },
  "wash-hands": {
    id: "wash-hands",
    arabic: "غَسْلُ اليَدَيْن",
    partOfSpeech: "phrase",
    phonetic: "wɑːʃ hændz",
    pronunciationTip: "Pronounce 'WASH hands' (/wɑːʃ hændz/).",
    collocations: [
      "wash hands with soap",
      "wash hands before eating",
      "wash hands under warm water",
      "properly wash hands",
      "wash hands thoroughly",
      "remind to wash hands",
    ],
    phrasalVerbs: [
      {
        phrase: "wash off",
        meaning: "clean away grime with rich lather",
        arabic: "يَغْسِلُ وَيُنَظِّف",
        example: "Lather your palms for twenty seconds to wash off all germs.",
      },
    ],
    sentences: [
      {
        context: "Hygiene Routine",
        en: "Always wash hands with antibacterial soap and warm water after using the restroom.",
        ar: "اغْسِلْ يَدَيْكَ دَائِمًا بِالصَّابُونِ المُضَادِّ لِلْبَكْتِيرْيَا وَالمَاءِ الدَّافِئِ بَعْدَ اسْتِخْدَامِ المِرْحَاضِ.",
      },
      {
        context: "Health Guidelines",
        en: "Doctors recommend rubbing palms together for twenty seconds to thoroughly clean them.",
        ar: "يُوصِي الأَطِبَّاءُ بِفَرْكِ الكَفَّيْنِ مَعًا لِمُدَّةِ عِشْرِينَ ثَانِيَةً لِتَنْظِيفِهِمَا جَيِّدًا.",
      },
      {
        context: "Family Routine",
        en: "Parents teach children to lather between their fingers when at the sink.",
        ar: "يُعَلِّمُ الآبَاءُ الأَطْفَالَ إِرْغَاءَ الصَّابُونِ بَيْنَ أَصَابِعِهِمْ عِنْدَ حَوْضِ الغَسِيلِ.",
      },
    ],
    exampleSentence:
      "Always wash hands with antibacterial soap and warm water after using the restroom.",
    exampleArabic:
      "اغْسِلْ يَدَيْكَ دَائِمًا بِالصَّابُونِ المُضَادِّ لِلْبَكْتِيرْيَا وَالمَاءِ الدَّافِئِ بَعْدَ اسْتِخْدَامِ المِرْحَاضِ.",
  },
  "brush-teeth": {
    id: "brush-teeth",
    arabic: "تَنْظِيفُ الأَسْنَان (فَرْكُ الأَسْنَانِ بِالفُرْشَاة)",
    partOfSpeech: "phrase",
    phonetic: "brʌʃ tiːθ",
    pronunciationTip: "Pronounce 'BRUSH teeth' (/brʌʃ tiːθ/).",
    collocations: [
      "brush teeth twice daily",
      "brush teeth with fluoride toothpaste",
      "brush teeth after meals",
      "circular motions to brush teeth",
      "encourage kids to brush teeth",
      "gently brush teeth",
    ],
    phrasalVerbs: [
      {
        phrase: "brush away",
        meaning: "remove food particles with bristles",
        arabic: "يُزِيلُ بِالفُرْشَاة",
        example: "Brush away plaque carefully around every molar.",
      },
    ],
    sentences: [
      {
        context: "Dental Care",
        en: "Dentists advise everyone to brush teeth twice a day for two full minutes.",
        ar: "يَنْصَحُ أَطِبَّاءُ الأَسْنَانِ الجَمِيعَ بِتَنْظِيفِ أَسْنَانِهِمْ مَرَّتَيْنِ يَوْمِيًّا لِمُدَّةِ دَقِيقَتَيْنِ كَامِلَتَيْنِ.",
      },
      {
        context: "Morning Routine",
        en: "She squeezed mint paste onto the bristles before standing in front of the mirror.",
        ar: "وَضَعَتْ مَعْجُونَ النَّعْنَاعِ عَلَى الشُّعَيْرَاتِ قَبْلَ الوُقُوفِ أَمَامَ المِرْآةِ.",
      },
      {
        context: "Bedtime Habit",
        en: "Children make it a habit to clean their incisors before going to bed.",
        ar: "يَجْعَلُ الأَطْفَالُ مِنْ تَنْظِيفِ قَوَاطِعِهِمْ عَادَةً قَبْلَ الذَّهَابِ إِلَى النَّوْمِ.",
      },
    ],
    exampleSentence: "Dentists advise everyone to brush teeth twice a day for two full minutes.",
    exampleArabic:
      "يَنْصَحُ أَطِبَّاءُ الأَسْنَانِ الجَمِيعَ بِتَنْظِيفِ أَسْنَانِهِمْ مَرَّتَيْنِ يَوْمِيًّا لِمُدَّةِ دَقِيقَتَيْنِ كَامِلَتَيْنِ.",
  },
  "take-shower": {
    id: "take-shower",
    arabic: "الاسْتِحْمَام (أَخْذُ حَمَّامٍ سَرِيع)",
    partOfSpeech: "phrase",
    phonetic: "teɪk ˈʃaʊər",
    pronunciationTip: "Pronounce 'take SHOWER' (/teɪk ˈʃaʊ.ər/).",
    collocations: [
      "take a warm shower",
      "take a quick shower",
      "take a cold shower",
      "take a refreshing shower",
      "take a shower in the morning",
      "sing while taking a shower",
    ],
    phrasalVerbs: [
      {
        phrase: "freshen up",
        meaning: "bathe to feel invigorated",
        arabic: "يَنْتَعِشُ بِالاسْتِحْمَام",
        example: "Taking a quick shower helps you freshen up after exercising.",
      },
    ],
    sentences: [
      {
        context: "Morning Routine",
        en: "He stepped into the glass stall to take a warm shower before starting his workday.",
        ar: "دَخَلَ كَبِينَةَ الاسْتِحْمَامِ الزُّجَاجِيَّةَ لِيَأْخُذَ حَمَّامًا دَافِئًا قَبْلَ بَدْءِ يَوْمِ عَمَلِهِ.",
      },
      {
        context: "Post-Workout",
        en: "Taking a refreshing shower after the gym washes away sweat and soothes tired muscles.",
        ar: "يَغْسِلُ الاسْتِحْمَامُ المُنْعِشُ بَعْدَ التَّمْرِينِ العَرَقَ وَيُهَدِّئُ العَضَلاتِ المُتْعَبَةَ.",
      },
      {
        context: "Relaxation",
        en: "She enjoys taking a relaxing evening shower with lavender-scented body wash.",
        ar: "تَسْتَمْتِعُ بِأَخْذِ حَمَّامٍ مَسَائِيٍّ مُرِيحٍ بِسَائِلِ اسْتِحْمَامٍ بِرَائِحَةِ الخُزَامَى.",
      },
    ],
    exampleSentence:
      "He stepped into the glass stall to take a warm shower before starting his workday.",
    exampleArabic:
      "دَخَلَ كَبِينَةَ الاسْتِحْمَامِ الزُّجَاجِيَّةَ لِيَأْخُذَ حَمَّامًا دَافِئًا قَبْلَ بَدْءِ يَوْمِ عَمَلِهِ.",
  },
  "dry-off": {
    id: "dry-off",
    arabic: "التَّجْفِيف (تَنْشِيفُ الجِسْم)",
    partOfSpeech: "phrase",
    phonetic: "draɪ ɔːf",
    pronunciationTip: "Pronounce 'DRY off' (/draɪ ɔːf/).",
    collocations: [
      "dry off with a towel",
      "dry off quickly",
      "dry off after swimming",
      "pat skin to dry off",
      "help baby dry off",
      "dry off before dressing",
    ],
    phrasalVerbs: [
      {
        phrase: "dry off",
        meaning: "remove water from skin with absorbent fabric",
        arabic: "يُجَفِّفُ جِسْمَهُ",
        example: "Step onto the bath mat and dry off thoroughly with a fluffy towel.",
      },
    ],
    sentences: [
      {
        context: "Post-Bath Routine",
        en: "She stepped onto the soft mat to dry off with a large plush bath towel.",
        ar: "خَطَتْ عَلَى البِسَاطِ النَّاعِمِ لِتُجَفِّفَ جِسْمَهَا بِمِنْشَفَةِ حَمَّامٍ كَبِيرَةٍ وَفَاخِرَةٍ.",
      },
      {
        context: "Skincare Advice",
        en: "Gently pat your skin rather than rubbing aggressively when you dry off.",
        ar: "رَبِّتْ بِلُطْفٍ عَلَى بَشَرَتِكَ بَدَلًا مِنَ الفَرْكِ العَنِيفِ عِنْدَمَا تُجَفِّفُ جِسْمَكَ.",
      },
      {
        context: "Poolside",
        en: "The children wrapped themselves in cozy hooded robes to dry off after swimming.",
        ar: "الْتَفَّ الأَطْفَالُ فِي أَرْدِيَةِ حَمَّامٍ دَافِئَةٍ ذَاتِ قُبَّعَاتٍ لِلتَّجْفِيفِ بَعْدَ السِّبَاحَةِ.",
      },
    ],
    exampleSentence: "She stepped onto the soft mat to dry off with a large plush bath towel.",
    exampleArabic:
      "خَطَتْ عَلَى البِسَاطِ النَّاعِمِ لِتُجَفِّفَ جِسْمَهَا بِمِنْشَفَةِ حَمَّامٍ كَبِيرَةٍ وَفَاخِرَةٍ.",
  },
  flush: {
    id: "flush",
    arabic: "شَطْفُ المِرْحَاض (سَحْبُ السَّيْفُون)",
    partOfSpeech: "verb",
    phonetic: "flʌʃ",
    pronunciationTip: "Short 'u' sound /ʌ/ ending in 'sh' (/ʃ/): 'FLUSH' (/flʌʃ/).",
    collocations: [
      "flush the toilet",
      "dual flush button",
      "automatic flush",
      "press the lever to flush",
      "flush with water",
      "remember to flush",
    ],
    phrasalVerbs: [
      {
        phrase: "flush away",
        meaning: "cleanse ceramic bowl by discharging water",
        arabic: "يَشْطُفُ وَيُصَرِّف",
        example: "Push down the chrome handle to flush away waste instantly.",
      },
    ],
    sentences: [
      {
        context: "Restroom Etiquette",
        en: "Remember to flush the toilet after every use to maintain cleanliness.",
        ar: "تَذَكَّرْ شَطْفَ المِرْحَاضِ بَعْدَ كُلِّ اسْتِخْدَامٍ لِلْحِفَاظِ عَلَى النَّظَافَةِ.",
      },
      {
        context: "Water Conservation",
        en: "Modern dual-flush systems provide a half-flush option to conserve water.",
        ar: "تُوَفِّرُ أَنْظِمَةُ الشَّطْفِ المُزْدَوَجِ الحَدِيثَةُ خِيَارَ نِصْفِ شَطْفٍ لِتَوْفِيرِ المِيَاهِ.",
      },
      {
        context: "Plumbing Operation",
        en: "Pressing the chrome button releases a powerful swirling stream of clean water.",
        ar: "يُؤَدِّي الضَّغْطُ عَلَى الزِّرِّ المَطْلِيِّ بِالكُرُومِ إِلَى إِطْلاقِ تَدَفُّقٍ قَوِيٍّ لِلْمَاءِ النَّظِيفِ.",
      },
    ],
    exampleSentence: "Remember to flush the toilet after every use to maintain cleanliness.",
    exampleArabic:
      "تَذَكَّرْ شَطْفَ المِرْحَاضِ بَعْدَ كُلِّ اسْتِخْدَامٍ لِلْحِفَاظِ عَلَى النَّظَافَةِ.",
  },
  "comb-hair": {
    id: "comb-hair",
    arabic: "تَمْشِيطُ الشَّعْر",
    partOfSpeech: "phrase",
    phonetic: "koʊm hɛər",
    pronunciationTip: "Silent 'b' in 'comb': 'COHM hair' (/koʊm hɛər/).",
    collocations: [
      "comb hair gently",
      "comb wet hair",
      "comb hair with a wide-tooth comb",
      "part and comb hair",
      "comb hair in the mirror",
      "daily comb hair",
    ],
    phrasalVerbs: [
      {
        phrase: "comb through",
        meaning: "untangle strands carefully",
        arabic: "يُسَرِّحُ وَيُفَكِّكُ التَّشَابُك",
        example: "Comb through damp strands slowly from roots to ends.",
      },
    ],
    sentences: [
      {
        context: "Grooming Routine",
        en: "She stood before the lighted mirror to gently comb hair and remove tangles.",
        ar: "وَقَفَتْ أَمَامَ المِرْآةِ المُضَاءَةِ لِتُمَشِّطَ شَعْرَهَا بِلُطْفٍ وَتُزِيلَ التَّشَابُكَ.",
      },
      {
        context: "Hair Care Tip",
        en: "Using a wide-tooth wooden tool prevents breakage when you untangle wet locks.",
        ar: "يَمْنَعُ اسْتِخْدَامُ أَدَاةٍ خَشَبِيَّةٍ وَاسِعَةِ الأَسْنَانِ التَّقَصُّفَ عِنْدَ تَسْرِيحِ الخُصَلِ المُبْتَلَّةِ.",
      },
      {
        context: "Morning Preparation",
        en: "He parted his locks neatly on the left side during his morning styling.",
        ar: "فَرَقَ خُصَلَ شَعْرِهِ بِتَرْتِيبٍ عَلَى الجَانِبِ الأَيْسَرِ خِلَالَ تَهْيِئَتِهِ الصَّبَاحِيَّةِ.",
      },
    ],
    exampleSentence: "She stood before the lighted mirror to gently comb hair and remove tangles.",
    exampleArabic:
      "وَقَفَتْ أَمَامَ المِرْآةِ المُضَاءَةِ لِتُمَشِّطَ شَعْرَهَا بِلُطْفٍ وَتُزِيلَ التَّشَابُكَ.",
  },
  "apply-lotion": {
    id: "apply-lotion",
    arabic: "وَضْعُ المُرَطِّب (دَهْنُ الكَرِيمِ المُرَطِّب)",
    partOfSpeech: "phrase",
    phonetic: "əˈplaɪ ˈloʊʃən",
    pronunciationTip: "Pronounce 'uh-PLY LOH-shun' (/əˈplaɪ ˈloʊ.ʃən/).",
    collocations: [
      "apply lotion to dry skin",
      "smoothly apply lotion",
      "apply lotion after shower",
      "apply lotion to hands",
      "daily apply lotion",
      "massage and apply lotion",
    ],
    phrasalVerbs: [
      {
        phrase: "rub in",
        meaning: "massage cream until fully absorbed",
        arabic: "يَدْهُنُ حَتَّى يَمْتَصَّ الجِلْد",
        example: "Gently rub in moisturizing cream after patting your skin dry.",
      },
    ],
    sentences: [
      {
        context: "Skincare Habit",
        en: "It is best to apply lotion right after showering while skin is still slightly damp.",
        ar: "مِنَ الأَفْضَلِ وَضْعُ المُرَطِّبِ مُبَاشَرَةً بَعْدَ الاسْتِحْمَامِ حِينَ تَكُونُ البَشَرَةُ لَا تَزَالُ رَطْبَةً قَلِيلًا.",
      },
      {
        context: "Hand Care",
        en: "She pumped a coin-sized drop onto her palms and began to smooth it over dry hands.",
        ar: "ضَغَطَتْ قَطْرَةً بِحَجْمِ عُمْلَةٍ مَعْدَنِيَّةٍ عَلَى كَفَّيْهَا وَبَدَأَتْ بِدَهْنِهَا عَلَى يَدَيْهَا الجَافَّتَيْنِ.",
      },
      {
        context: "Winter Protection",
        en: "Regularly applying rich body moisturizer protects skin from cold weather chapping.",
        ar: "يَحْمِي وَضْعُ مُرَطِّبِ الجِسْمِ الغَنِيِّ بِانْتِظَامٍ البَشَرَةَ مِنَ التَّشَقُّقِ فِي الطَّقْسِ البَارِدِ.",
      },
    ],
    exampleSentence:
      "It is best to apply lotion right after showering while skin is still slightly damp.",
    exampleArabic:
      "مِنَ الأَفْضَلِ وَضْعُ المُرَطِّبِ مُبَاشَرَةً بَعْدَ الاسْتِحْمَامِ حِينَ تَكُونُ البَشَرَةُ لَا تَزَالُ رَطْبَةً قَلِيلًا.",
  },
  gargle: {
    id: "gargle",
    arabic: "الغَرْغَرَة",
    partOfSpeech: "verb",
    phonetic: "ˈɡɑːrɡl",
    pronunciationTip: "Pronounce 'GAR-gul' (/ˈɡɑːr.ɡəl/).",
    collocations: [
      "gargle with mouthwash",
      "gargle with warm salt water",
      "gargle for thirty seconds",
      "throat gargle",
      "spit after gargling",
      "daily gargle routine",
    ],
    phrasalVerbs: [
      {
        phrase: "spit out",
        meaning: "eject liquid after swishing in throat",
        arabic: "يَبْصُقُ المَحْلُول",
        example: "Gargle thoroughly for thirty seconds then spit out into the sink.",
      },
    ],
    sentences: [
      {
        context: "Oral Hygiene",
        en: "He took a small sip of mint rinse to gargle for thirty seconds after brushing.",
        ar: "تَنَاوَلَ رَشْفَةً صَغِيرَةً مِنْ غَسُولِ النَّعْنَاعِ لِيَتَغَرْغَرَ لِمُدَّةِ ثَلاثِينَ ثَانِيَةً بَعْدَ فَرْكِ الأَسْنَانِ.",
      },
      {
        context: "Sore Throat Care",
        en: "Doctors recommend you gargle with warm salt water to soothe an irritated throat.",
        ar: "يُوصِي الأَطِبَّاءُ بِالغَرْغَرَةِ بِمَاءٍ مَالِحٍ دَافِئٍ لِتَهْدِئَةِ الحَلْقِ المُلْتَهِبِ.",
      },
      {
        context: "Fresh Breath",
        en: "A quick antiseptic gargle in the morning kills germs and leaves breath feeling fresh.",
        ar: "تَقْضِي الغَرْغَرَةُ السَّرِيعَةُ بِالمُطَهِّرِ فِي الصَّبَاحِ عَلَى الجَرَاثِيمِ وَتَتْرُكُ النَّفَسَ مُنْعِشًا.",
      },
    ],
    exampleSentence:
      "He took a small sip of mint rinse to gargle for thirty seconds after brushing.",
    exampleArabic:
      "تَنَاوَلَ رَشْفَةً صَغِيرَةً مِنْ غَسُولِ النَّعْنَاعِ لِيَتَغَرْغَرَ لِمُدَّةِ ثَلاثِينَ ثَانِيَةً بَعْدَ فَرْكِ الأَسْنَانِ.",
  },
  pencil: {
    id: "pencil",
    arabic: "قَلَمُ رَصَاص",
    partOfSpeech: "noun",
    phonetic: "ˈpɛn.səl",
    pronunciationTip: "Pronounce 'PEN-sul' (/ˈpɛn.səl/).",
    collocations: [
      "lead pencil",
      "sharpen a pencil",
      "colored pencil",
      "pencil shavings",
      "graphite pencil",
      "mechanical pencil",
    ],
    phrasalVerbs: [
      {
        phrase: "pencil in",
        meaning: "schedule tentatively",
        arabic: "يُحَدِّدُ مَوْعِدًا مَبْدَئِيًّا",
        example: "Let's pencil in the study session for next Tuesday afternoon.",
      },
    ],
    sentences: [
      {
        context: "Writing Practice",
        en: "The student sharpened his yellow pencil before starting the math quiz.",
        ar: "بَرَى الطَّالِبُ قَلَمَ الرَّصَاصِ الأَصْفَرَ قَبْلَ بَدْءِ اخْتِبَارِ الرِّيَاضِيَّاتِ.",
      },
      {
        context: "Drawing Class",
        en: "Sketch the initial outline lightly with a soft graphite pencil.",
        ar: "ارْسُمِ المُخَطَّطَ الأَوَّلِيَّ بِخِفَّةٍ بِقَلَمِ رَصَاصٍ غَرَافِيتِيٍّ نَاعِمٍ.",
      },
      {
        context: "Desk Organization",
        en: "A cup on the teacher's desk held several freshly sharpened pencils.",
        ar: "كَانَ الكُوبُ عَلَى مَكْتَبِ المُعَلِّمِ يَحْتَوِي عَلَى عِدَّةِ أَقْلامِ رَصَاصٍ مَبْرِيَّةٍ حَدِيثًا.",
      },
    ],
    exampleSentence: "The student sharpened his yellow pencil before starting the math quiz.",
    exampleArabic:
      "بَرَى الطَّالِبُ قَلَمَ الرَّصَاصِ الأَصْفَرَ قَبْلَ بَدْءِ اخْتِبَارِ الرِّيَاضِيَّاتِ.",
  },
  pen: {
    id: "pen",
    arabic: "قَلَمُ حِبْر",
    partOfSpeech: "noun",
    phonetic: "pɛn",
    pronunciationTip: "Short 'e' sound /ɛ/: 'PEN' (/pɛn/).",
    collocations: [
      "ballpoint pen",
      "fountain pen",
      "gel pen",
      "blue ink pen",
      "click a pen",
      "smooth writing pen",
    ],
    phrasalVerbs: [
      {
        phrase: "pen down",
        meaning: "write down thoughts on paper",
        arabic: "يُدَوِّنُ كِتَابَةً",
        example: "Take a moment to pen down your main ideas before the essay.",
      },
    ],
    sentences: [
      {
        context: "Note Taking",
        en: "She used a smooth blue ballpoint pen to write down lecture notes.",
        ar: "اسْتَخْدَمَتْ قَلَمَ حِبْرٍ جَافٍّ أَزْرَقَ نَاعِمًا لِتَدْوِينِ مُلَاحَظَاتِ المُحَاضَرَةِ.",
      },
      {
        context: "Signing Documents",
        en: "The principal signed the official graduation certificate with a black pen.",
        ar: "وَقَّعَ المَدِيرُ شَهَادَةَ التَّخَرُّجِ الرَّسْمِيَّةَ بِقَلَمِ حِبْرٍ أَسْوَدَ.",
      },
      {
        context: "Creative Writing",
        en: "He prefers jotting journal entries with a classic fountain pen.",
        ar: "يُفَضِّلُ تَدْوِينَ مُذَكَّرَاتِهِ بِقَلَمِ حِبْرٍ سَائِلٍ كَلَاسِيكِيٍّ.",
      },
    ],
    exampleSentence: "She used a smooth blue ballpoint pen to write down lecture notes.",
    exampleArabic:
      "اسْتَخْدَمَتْ قَلَمَ حِبْرٍ جَافٍّ أَزْرَقَ نَاعِمًا لِتَدْوِينِ مُلَاحَظَاتِ المُحَاضَرَةِ.",
  },
  eraser: {
    id: "eraser",
    arabic: "مِمْحَاة",
    partOfSpeech: "noun",
    phonetic: "ɪˈreɪsər",
    pronunciationTip: "Pronounce 'ih-RAY-ser' (/ɪˈreɪ.sər/).",
    collocations: [
      "rubber eraser",
      "pencil eraser",
      "kneaded eraser",
      "eraser crumbs",
      "rub with an eraser",
      "white vinyl eraser",
    ],
    phrasalVerbs: [
      {
        phrase: "rub out",
        meaning: "erase marks from paper",
        arabic: "يَمْسَحُ الخَطَأ",
        example: "Carefully rub out the mistake without tearing the delicate paper.",
      },
    ],
    sentences: [
      {
        context: "Correcting Mistakes",
        en: "He used a soft rubber eraser to remove the incorrect calculation.",
        ar: "اسْتَخْدَمَ مِمْحَاةً مَطَّاطِيَّةً نَاعِمَةً لِمَسْحِ الحِسَابِ غَيْرِ الصَّحِيحِ.",
      },
      {
        context: "Art Class",
        en: "Artists use a kneaded eraser to lift highlights from charcoal sketches.",
        ar: "يَسْتَخْدِمُ الفَنَّانُونَ مِمْحَاةَ العَجِينِ لِإِبْرَازِ الإِضَاءَةِ فِي رُسُومِ الفَحْمِ.",
      },
      {
        context: "Classroom Supplies",
        en: "She brushed away the eraser shavings before submitting her test.",
        ar: "نَفَضَتْ فُتَاتَ المِمْحَاةِ قَبْلَ تَسْلِيمِ اخْتِبَارِهَا.",
      },
    ],
    exampleSentence: "He used a soft rubber eraser to remove the incorrect calculation.",
    exampleArabic:
      "اسْتَخْدَمَ مِمْحَاةً مَطَّاطِيَّةً نَاعِمَةً لِمَسْحِ الحِسَابِ غَيْرِ الصَّحِيحِ.",
  },
  ruler: {
    id: "ruler",
    arabic: "مِسْطَرَة",
    partOfSpeech: "noun",
    phonetic: "ˈruːlər",
    pronunciationTip: "Pronounce 'ROO-ler' (/ˈruː.lər/).",
    collocations: [
      "wooden ruler",
      "plastic ruler",
      "measure with a ruler",
      "centimeter ruler",
      "draw a line with a ruler",
      "transparent ruler",
    ],
    phrasalVerbs: [
      {
        phrase: "rule out",
        meaning: "draw a straight line across",
        arabic: "يُسَطِّرُ بِالمِسْطَرَة",
        example: "Rule out neat margins along the left edge of each notebook page.",
      },
    ],
    sentences: [
      {
        context: "Geometry Class",
        en: "She placed her clear plastic ruler on the page to draw a straight five-centimeter line.",
        ar: "وَضَعَتْ مِسْطَرَتَهَا البَلَاسْتِيكِيَّةَ الشَّفَّافَةَ عَلَى الصَّفْحَةِ لِرَسْمِ خَطٍّ مُسْتَقِيمٍ بِطُولِ خَمْسَةِ سَنْتِيمِتْرَاتٍ.",
      },
      {
        context: "Measuring Length",
        en: "Students used a wooden metric ruler to measure the dimensions of their desks.",
        ar: "اسْتَخْدَمَ الطُّلَّابُ مِسْطَرَةً خَشَبِيَّةً مِتْرِيَّةً لِقِيَاسِ أَبْعَادِ مَكَاتِبِهِمْ.",
      },
      {
        context: "Technical Drawing",
        en: "A metal ruler provides high precision when cutting cardboard models.",
        ar: "تُوَفِّرُ المِسْطَرَةُ المَعْدَنِيَّةُ دِقَّةً عَالِيَةً عِنْدَ قَطْعِ نَمَاذِجِ الوَرَقِ المُقَوَّى.",
      },
    ],
    exampleSentence:
      "She placed her clear plastic ruler on the page to draw a straight five-centimeter line.",
    exampleArabic:
      "وَضَعَتْ مِسْطَرَتَهَا البَلَاسْتِيكِيَّةَ الشَّفَّافَةَ عَلَى الصَّفْحَةِ لِرَسْمِ خَطٍّ مُسْتَقِيمٍ بِطُولِ خَمْسَةِ سَنْتِيمِتْرَاتٍ.",
  },
  marker: {
    id: "marker",
    arabic: "قَلَمُ تَخْطِيط (مَارْكَر)",
    partOfSpeech: "noun",
    phonetic: "ˈmɑːrkər",
    pronunciationTip: "Pronounce 'MAR-ker' (/ˈmɑːr.kər/).",
    collocations: [
      "dry-erase marker",
      "permanent marker",
      "colored markers",
      "thick marker tip",
      "marker cap",
      "washable marker",
    ],
    phrasalVerbs: [
      {
        phrase: "mark up",
        meaning: "highlight or annotate with a marker",
        arabic: "يُعَلِّمُ أَوْ يُظَلِّلُ بِالمَارْكَر",
        example: "The teacher marked up the poster with a bright red dry-erase marker.",
      },
    ],
    sentences: [
      {
        context: "Whiteboard Presentation",
        en: "The teacher used a black dry-erase marker to write equations on the board.",
        ar: "اسْتَخْدَمَ المُعَلِّمُ قَلَمَ تَخْطِيطٍ جَافًّا أَسْوَدَ لِكِتَابَةِ المُعَادَلَاتِ عَلَى اللَّوْحِ.",
      },
      {
        context: "Poster Project",
        en: "Kids colored their science fair poster with vibrant washable markers.",
        ar: "لَوَّنَ الأَطْفَالُ مُلْصَقَ مَعْرِضِ العُلُومِ بِأَقْلَامِ تَخْطِيطٍ زَاهِيَةٍ قَابِلَةٍ لِلْغَسِيلِ.",
      },
      {
        context: "Labeling Supplies",
        en: "Write your name on the binder spine with a permanent black marker.",
        ar: "اكْتُبِ اسْمَكَ عَلَى كَعْبِ المِلَفِّ بِقَلَمِ تَخْطِيطٍ أَسْوَدَ دَائِمٍ.",
      },
    ],
    exampleSentence: "The teacher used a black dry-erase marker to write equations on the board.",
    exampleArabic:
      "اسْتَخْدَمَ المُعَلِّمُ قَلَمَ تَخْطِيطٍ جَافًّا أَسْوَدَ لِكِتَابَةِ المُعَادَلَاتِ عَلَى اللَّوْحِ.",
  },
  crayon: {
    id: "crayon",
    arabic: "قَلَمُ تَلْوِينٍ شَمْعِيّ (أَلْوَانُ شَمْع)",
    partOfSpeech: "noun",
    phonetic: "ˈkreɪ.ɑːn",
    pronunciationTip: "Pronounce 'CRAY-on' (/ˈkreɪ.ɑːn/).",
    collocations: [
      "box of crayons",
      "wax crayon",
      "bright crayons",
      "broken crayon",
      "color with crayons",
      "crayon drawing",
    ],
    phrasalVerbs: [
      {
        phrase: "color in",
        meaning: "fill an outline with wax pigment",
        arabic: "يُلَوِّنُ بِالشَّمْع",
        example: "The kindergarteners loved to color in animal shapes with wax crayons.",
      },
    ],
    sentences: [
      {
        context: "Kindergarten Art",
        en: "The child selected a bright red crayon to color the drawing of an apple.",
        ar: "اخْتَارَ الطِّفْلُ قَلَمَ تَلْوِينٍ شَمْعِيًّا أَحْمَرَ زَاهِيًا لِتَلْوِينِ رَسْمَةِ التُّفَّاحَةِ.",
      },
      {
        context: "Coloring Book",
        en: "A 64-pack box of crayons includes every shade from sky blue to forest green.",
        ar: "تَتَضَمَّنُ عُلْبَةُ أَلْوَانِ الشَّمْعِ ذَاتُ الـ 64 لَوْنًا كُلَّ تَدَرُّجٍ مِنَ الأَزْرَقِ السَّمَاوِيِّ إِلَى الأَخْضَرِ الغَابِيِّ.",
      },
      {
        context: "Creative Play",
        en: "Children sorted their wax crayons by color into small plastic cups.",
        ar: "فَرَزَ الأَطْفَالُ أَقْلَامَ تَلْوِينِهِمُ الشَّمْعِيَّةَ حَسَبَ اللَّوْنِ فِي أَكْوَابٍ بَلَاسْتِيكِيَّةٍ صَغِيرَةٍ.",
      },
    ],
    exampleSentence: "The child selected a bright red crayon to color the drawing of an apple.",
    exampleArabic:
      "اخْتَارَ الطِّفْلُ قَلَمَ تَلْوِينٍ شَمْعِيًّا أَحْمَرَ زَاهِيًا لِتَلْوِينِ رَسْمَةِ التُّفَّاحَةِ.",
  },
  "colored-pencil": {
    id: "colored-pencil",
    arabic: "قَلَمُ تَلْوِينٍ خَشَبِيّ",
    partOfSpeech: "noun",
    phonetic: "ˈkʌlərd ˈpɛnsəl",
    pronunciationTip: "Pronounce 'KUL-erd PEN-sul' (/ˈkʌl.ərd ˈpɛn.səl/).",
    collocations: [
      "set of colored pencils",
      "blend colored pencils",
      "sharpen colored pencils",
      "soft core colored pencil",
      "shading with colored pencils",
    ],
    phrasalVerbs: [
      {
        phrase: "shade in",
        meaning: "fill with gradated pencil hues",
        arabic: "يُظَلِّلُ بِأَلْوَانِ الخَشَب",
        example:
          "Shade in the mountain background using three different shades of colored pencils.",
      },
    ],
    sentences: [
      {
        context: "Geography Map",
        en: "Students used a green colored pencil to shade the continents on their world map.",
        ar: "اسْتَخْدَمَ الطُّلَّابُ قَلَمَ تَلْوِينٍ خَشَبِيًّا أَخْضَرَ لِتَظْلِيلِ القَارَّاتِ عَلَى خَرِيطَةِ العَالَمِ الخَاصَّةِ بِهِمْ.",
      },
      {
        context: "Detailed Art",
        en: "Colored pencils allow artists to create fine details and smooth gradients.",
        ar: "تُتِيحُ أَقْلَامُ التَّلْوِينِ الخَشَبِيَّةُ لِلْفَنَّانِينَ إِنْشَاءَ تَفَاصِيلَ دَقِيقَةٍ وَتَدَرُّجَاتٍ لَوْنِيَّةٍ نَاعِمَةٍ.",
      },
      {
        context: "School Supplies",
        en: "He neatly arranged his 24-color pencil set inside a tin storage box.",
        ar: "رَتَّبَ طَقْمَ أَقْلَامِ التَّلْوِينِ الخَشَبِيَّةِ المُكَوَّنَ مِنْ 24 لَوْنًا بِعِنَايَةٍ دَاخِلَ صُنْدُوقٍ مَعْدَنِيٍّ.",
      },
    ],
    exampleSentence:
      "Students used a green colored pencil to shade the continents on their world map.",
    exampleArabic:
      "اسْتَخْدَمَ الطُّلَّابُ قَلَمَ تَلْوِينٍ خَشَبِيًّا أَخْضَرَ لِتَظْلِيلِ القَارَّاتِ عَلَى خَرِيطَةِ العَالَمِ الخَاصَّةِ بِهِمْ.",
  },
  highlighter: {
    id: "highlighter",
    arabic: "قَلَمُ تَمْيِيزٍ بَصَرِيّ (هَايْلَايْتَر)",
    partOfSpeech: "noun",
    phonetic: "ˈhaɪˌlaɪtər",
    pronunciationTip: "Pronounce 'HIGH-ly-ter' (/ˈhaɪˌlaɪ.tər/).",
    collocations: [
      "yellow highlighter",
      "fluorescent highlighter",
      "pastel highlighter",
      "highlight text",
      "chisel tip highlighter",
      "highlight important notes",
    ],
    phrasalVerbs: [
      {
        phrase: "stand out",
        meaning: "become prominent through bright coloring",
        arabic: "يَبْرُزُ بِمُسَاعَدَةِ التَّظْلِيل",
        example:
          "Using a neon highlighter makes key vocabulary terms stand out on the study guide.",
      },
    ],
    sentences: [
      {
        context: "Study Session",
        en: "She used a neon yellow highlighter to emphasize key vocabulary in her textbook.",
        ar: "اسْتَخْدَمَتْ قَلَمَ تَمْيِيزٍ نِيُونِيًّا أَصْفَرَ لِلتَّأْكِيدِ عَلَى المُفْرَدَاتِ الرَّئِيسِيَّةِ فِي كِتَابِهَا المَدْرَسِيِّ.",
      },
      {
        context: "Exam Preparation",
        en: "Highlighting major formulas helps you locate them quickly during review.",
        ar: "يُسَاعِدُ تَمْيِيزُ الصِّيَغِ الرَّئِيسِيَّةِ فِي العُثُورِ عَلَيْهَا بِسُرْعَةٍ خِلَالَ المُرَاجَعَةِ.",
      },
      {
        context: "Pastel Stationery",
        en: "Pastel highlighters provide soft, aesthetic colors that do not bleed through pages.",
        ar: "تُوَفِّرُ أَقْلَامُ التَّمْيِيزِ البَاسْتِيلِيَّةُ أَلْوَانًا نَاعِمَةً لَا تَنْفُذُ عَبْرَ الصَّفَحَاتِ.",
      },
    ],
    exampleSentence:
      "She used a neon yellow highlighter to emphasize key vocabulary in her textbook.",
    exampleArabic:
      "اسْتَخْدَمَتْ قَلَمَ تَمْيِيزٍ نِيُونِيًّا أَصْفَرَ لِلتَّأْكِيدِ عَلَى المُفْرَدَاتِ الرَّئِيسِيَّةِ فِي كِتَابِهَا المَدْرَسِيِّ.",
  },
  "pencil-sharpener": {
    id: "pencil-sharpener",
    arabic: "مِبْرَاة (بَرَّايَةُ أَقْلَام)",
    partOfSpeech: "noun",
    phonetic: "ˈpɛnsəl ˌʃɑːrpənər",
    pronunciationTip: "Pronounce 'PEN-sul SHAR-pen-er' (/ˈpɛn.səl ˌʃɑːr.pən.ər/).",
    collocations: [
      "electric pencil sharpener",
      "handheld sharpener",
      "dual-hole sharpener",
      "sharpener shavings container",
      "turn the sharpener",
    ],
    phrasalVerbs: [
      {
        phrase: "sharpen up",
        meaning: "make a dull tip pointed",
        arabic: "يَبْرِي حَتَّى يَشْحَذَ السِّنّ",
        example: "He walked up to the wall sharpener to sharpen up his dull pencil point.",
      },
    ],
    sentences: [
      {
        context: "Classroom Routine",
        en: "He twisted his dull pencil inside the handheld sharpener until the tip was fine.",
        ar: "أَدَارَ قَلَمَهُ غَيْرَ الحَادِّ دَاخِلَ المِبْرَاةِ اليَدَوِيَّةِ حَتَّى أَصْبَحَ سِنُّهُ دَقِيقًا.",
      },
      {
        context: "Electric Sharpener",
        en: "The electric pencil sharpener buzzes softly whenever a student inserts a lead pencil.",
        ar: "تُصْدِرُ المِبْرَاةُ الكَهْرَبَائِيَّةُ طَنِينًا خَفِيفًا كُلَّمَا أَدْخَلَ طَالِبٌ قَلَمَ رَصَاصٍ.",
      },
      {
        context: "Desk Maintenance",
        en: "Empty the sharpener shaving receptacle into the recycling bin when it fills.",
        ar: "أَفْرِغْ حَاوِيَةَ فُتَاتِ المِبْرَاةِ فِي سَلَّةِ التَّدْوِيرِ عِنْدَمَا تَمْتَلِئُ.",
      },
    ],
    exampleSentence:
      "He twisted his dull pencil inside the handheld sharpener until the tip was fine.",
    exampleArabic:
      "أَدَارَ قَلَمَهُ غَيْرَ الحَادِّ دَاخِلَ المِبْرَاةِ اليَدَوِيَّةِ حَتَّى أَصْبَحَ سِنُّهُ دَقِيقًا.",
  },
  "pencil-case": {
    id: "pencil-case",
    arabic: "مِقْلَمَة (حَقِيبَةُ أَقْلَام)",
    partOfSpeech: "noun",
    phonetic: "ˈpɛnsəl keɪs",
    pronunciationTip: "Pronounce 'PEN-sul kays' (/ˈpɛn.səl keɪs/).",
    collocations: [
      "zippered pencil case",
      "hardtop pencil case",
      "pack a pencil case",
      "pencil case compartments",
      "stationery pouch",
    ],
    phrasalVerbs: [
      {
        phrase: "pack away",
        meaning: "store stationery inside a case",
        arabic: "يَحْزِمُ الأَدَوَاتِ فِي المِقْلَمَة",
        example: "Pack away your pens and eraser inside your pencil case before the bell rings.",
      },
    ],
    sentences: [
      {
        context: "School Morning",
        en: "She unzipped her floral pencil case to retrieve a blue pen and a ruler.",
        ar: "فَتَحَتْ سَحَّابَ مِقْلَمَتِهَا المُزَهَّرَةِ لِإِخْرَاجِ قَلَمِ حِبْرٍ أَزْرَقَ وَمِسْطَرَةٍ.",
      },
      {
        context: "Desk Organization",
        en: "A multi-compartment pencil case keeps pens, erasers, and scissors neatly organized.",
        ar: "تُحَافِظُ المِقْلَمَةُ مُتَعَدِّدَةُ الأَقْسَامِ عَلَى تَرْتِيبِ الأَقْلَامِ وَالمَمَاحِي وَالمَقَصَّاتِ.",
      },
      {
        context: "Backpack Storage",
        en: "He tucked his compact zippered pouch into the front pocket of his backpack.",
        ar: "دَسَّ مِقْلَمَتَهُ المُدْمَجَةَ ذَاتَ السَّحَّابِ فِي الجَيْبِ الأَمَامِيِّ لِحَقِيبَةِ ظَهْرِهِ.",
      },
    ],
    exampleSentence: "She unzipped her floral pencil case to retrieve a blue pen and a ruler.",
    exampleArabic:
      "فَتَحَتْ سَحَّابَ مِقْلَمَتِهَا المُزَهَّرَةِ لِإِخْرَاجِ قَلَمِ حِبْرٍ أَزْرَقَ وَمِسْطَرَةٍ.",
  },
  notebook: {
    id: "notebook",
    arabic: "دَفْتَر (كُرَّاسَةُ مُلَاحَظَات)",
    partOfSpeech: "noun",
    phonetic: "ˈnoʊtbʊk",
    pronunciationTip: "Pronounce 'NOHT-book' (/ˈnoʊt.bʊk/).",
    collocations: [
      "spiral notebook",
      "lined notebook",
      "grid notebook",
      "open a notebook",
      "write in a notebook",
      "hardcover notebook",
    ],
    phrasalVerbs: [
      {
        phrase: "jot down",
        meaning: "write quickly on a notepad",
        arabic: "يُدَوِّنُ سَرِيعًا فِي الدَّفْتَر",
        example: "Jot down the homework assignment on the first page of your notebook.",
      },
    ],
    sentences: [
      {
        context: "Lecture Notes",
        en: "The student opened his spiral notebook and began recording today's science notes.",
        ar: "فَتَحَ الطَّالِبُ دَفْتَرَهُ السِّلْكِيَّ وَبَدَأَ فِي تَدْوِينِ مُلَاحَظَاتِ دَرْسِ العُلُومِ لِلْيَوْمِ.",
      },
      {
        context: "Subject Organization",
        en: "She assigns a different colored notebook to each school subject.",
        ar: "تُخَصِّصُ دَفْتَرًا بِلَوْنٍ مُخْتَلِفٍ لِكُلِّ مَادَّةٍ دِرَاسِيَّةٍ.",
      },
      {
        context: "Journaling",
        en: "A ruled paper notebook is perfect for drafting creative short essays.",
        ar: "يُعَدُّ الدَّفْتَرُ ذُو الصَّفَحَاتِ المُسَطَّرَةِ مِثَالِيًّا لِكِتَابَةِ مَقَالَاتٍ قَصِيرَةٍ إِبْدَاعِيَّةٍ.",
      },
    ],
    exampleSentence:
      "The student opened his spiral notebook and began recording today's science notes.",
    exampleArabic:
      "فَتَحَ الطَّالِبُ دَفْتَرَهُ السِّلْكِيَّ وَبَدَأَ فِي تَدْوِينِ مُلَاحَظَاتِ دَرْسِ العُلُومِ لِلْيَوْمِ.",
  },
  textbook: {
    id: "textbook",
    arabic: "كِتَابٌ مَدْرَسِيّ (مُقَرَّرٌ دِرَاسِيّ)",
    partOfSpeech: "noun",
    phonetic: "ˈtɛkstbʊk",
    pronunciationTip: "Pronounce 'TEXT-book' (/ˈtɛkst.bʊk/).",
    collocations: [
      "math textbook",
      "history textbook",
      "open the textbook",
      "textbook chapter",
      "cover a textbook",
      "textbook exercises",
    ],
    phrasalVerbs: [
      {
        phrase: "read through",
        meaning: "study chapters carefully",
        arabic: "يَقْرَأُ بِعِنَايَةٍ فِي الكِتَاب",
        example: "Read through chapter four in your biology textbook before class tomorrow.",
      },
    ],
    sentences: [
      {
        context: "Class Reading",
        en: "The teacher instructed everyone to open their history textbook to page forty-five.",
        ar: "طَلَبَ المُعَلِّمُ مِنَ الجَمِيعِ فَتْحَ كِتَابِ التَّارِيخِ المَدْرَسِيِّ عَلَى الصَّفْحَةِ الخَامِسَةِ وَالأَرْبَعِينَ.",
      },
      {
        context: "Study Review",
        en: "Diagrams at the end of each textbook chapter summarize complex concepts clearly.",
        ar: "تُلَخِّصُ الرُّسُومُ التَّوْضِيحِيَّةُ فِي نِهَايَةِ كُلِّ فَصْلٍ مِنَ الكِتَابِ المَدْرَسِيِّ المَفَاهِيمَ المُعَقَّدَةَ بِوُضُوحٍ.",
      },
      {
        context: "School Supplies",
        en: "Students stacked heavy hardcover textbooks inside their assigned metal lockers.",
        ar: "رَتَّبَ الطُّلَّابُ الكُتُبَ المَدْرَسِيَّةَ الثَّقِيلَةَ ذَاتَ الأَغْلِفَةِ المُقَوَّاةِ دَاخِلَ خَزَائِنِهِمُ المَعْدَنِيَّةِ المُخَصَّصَةِ.",
      },
    ],
    exampleSentence:
      "The teacher instructed everyone to open their history textbook to page forty-five.",
    exampleArabic:
      "طَلَبَ المُعَلِّمُ مِنَ الجَمِيعِ فَتْحَ كِتَابِ التَّارِيخِ المَدْرَسِيِّ عَلَى الصَّفْحَةِ الخَامِسَةِ وَالأَرْبَعِينَ.",
  },
  workbook: {
    id: "workbook",
    arabic: "كُرَّاسَةُ تَمَارِين (دَفْتَرُ الأَنْشِطَة)",
    partOfSpeech: "noun",
    phonetic: "ˈwɜːrkbʊk",
    pronunciationTip: "Pronounce 'WORK-book' (/ˈwɜːrk.bʊk/).",
    collocations: [
      "grammar workbook",
      "fill out a workbook",
      "practice workbook",
      "workbook exercises",
      "math workbook",
    ],
    phrasalVerbs: [
      {
        phrase: "fill in",
        meaning: "complete printed worksheet blanks",
        arabic: "يَمْلأُ الفَرَاغَاتِ فِي الكُرَّاسَة",
        example: "Fill in the missing words on page twelve of your English workbook.",
      },
    ],
    sentences: [
      {
        context: "Homework Practice",
        en: "For homework, complete exercises one through five in your grammar workbook.",
        ar: "لِأَدَاءِ الوَاجِبِ المَنْزِلِيِّ، أَكْمِلِ التَّمَارِينَ مِنْ وَاحِدٍ إِلَى خَمْسَةٍ فِي كُرَّاسَةِ تَمَارِينِ القَوَاعِدِ.",
      },
      {
        context: "Math Practice",
        en: "The math workbook provides sample equations with step-by-step solutions.",
        ar: "تُوَفِّرُ كُرَّاسَةُ تَمَارِينِ الرِّيَاضِيَّاتِ مُعَادَلَاتٍ نَمُوذَجِيَّةً مَعَ حُلُولٍ خَطْوَةً بِخَطْوَةٍ.",
      },
      {
        context: "Self-Study",
        en: "She checks her answers in the back of the workbook after finishing each quiz.",
        ar: "تُدَقِّقُ إِجَابَاتِهَا فِي نِهَايَةِ كُرَّاسَةِ التَّمَارِينِ بَعْدَ الاِنْتِهَاءِ مِنْ كُلِّ اخْتِبَارٍ قَصِيرٍ.",
      },
    ],
    exampleSentence: "For homework, complete exercises one through five in your grammar workbook.",
    exampleArabic:
      "لِأَدَاءِ الوَاجِبِ المَنْزِلِيِّ، أَكْمِلِ التَّمَارِينَ مِنْ وَاحِدٍ إِلَى خَمْسَةٍ فِي كُرَّاسَةِ تَمَارِينِ القَوَاعِدِ.",
  },
  folder: {
    id: "folder",
    arabic: "مِلَفّ (مُجَلَّدُ حِفْظِ الأَوْرَاق)",
    partOfSpeech: "noun",
    phonetic: "ˈfoʊldər",
    pronunciationTip: "Pronounce 'FOHL-der' (/ˈfoʊl.dər/).",
    collocations: [
      "pocket folder",
      "plastic folder",
      "organize in a folder",
      "file folder",
      "manila folder",
      "labeled folder",
    ],
    phrasalVerbs: [
      {
        phrase: "file away",
        meaning: "store documents inside a folder",
        arabic: "يَحْفَظُ فِي المِلَفّ",
        example: "File away your graded essays neatly inside the blue pocket folder.",
      },
    ],
    sentences: [
      {
        context: "Document Organization",
        en: "She slipped her graded math assignments into a labeled two-pocket folder.",
        ar: "أَدْخَلَتْ فُرُوضَ الرِّيَاضِيَّاتِ المُصَحَّحَةَ دَاخِلَ مِلَفٍّ ذِي جَيْبَيْنِ يَحْمِلُ عُنْوَانًا.",
      },
      {
        context: "Class Handouts",
        en: "Keep all syllabus handouts organized in a durable plastic folder.",
        ar: "احْفَظْ جَمِيعَ مَنْشُورَاتِ المَنْهَجِ مُرَتَّبَةً دَاخِلَ مِلَفٍّ بَلَاسْتِيكِيٍّ مَتِينٍ.",
      },
      {
        context: "Color Coding",
        en: "He bought green folders for science and yellow folders for geography.",
        ar: "اشْتَرَى مِلَفَّاتٍ خَضْرَاءَ لِمَادَّةِ العُلُومِ وَمِلَفَّاتٍ صَفْرَاءَ لِلْجُغْرَافْيَا.",
      },
    ],
    exampleSentence: "She slipped her graded math assignments into a labeled two-pocket folder.",
    exampleArabic:
      "أَدْخَلَتْ فُرُوضَ الرِّيَاضِيَّاتِ المُصَحَّحَةَ دَاخِلَ مِلَفٍّ ذِي جَيْبَيْنِ يَحْمِلُ عُنْوَانًا.",
  },
  binder: {
    id: "binder",
    arabic: "مِلَفٌّ حَلَقِيّ (بَايْنْدَر)",
    partOfSpeech: "noun",
    phonetic: "ˈbaɪndər",
    pronunciationTip: "Pronounce 'BYN-der' (/ˈbaɪn.dər/).",
    collocations: [
      "three-ring binder",
      "binder dividers",
      "loose-leaf binder",
      "zip-up binder",
      "open the binder rings",
    ],
    phrasalVerbs: [
      {
        phrase: "snap shut",
        meaning: "close binder rings firmly",
        arabic: "يُغْلِقُ حَلَقَاتِ المِلَفِّ بِإِحْكَام",
        example: "Press the metal levers so the binder rings snap shut securely.",
      },
    ],
    sentences: [
      {
        context: "School Binder",
        en: "He organized his loose-leaf notes inside a sturdy three-ring binder with tabs.",
        ar: "رَتَّبَ مُلَاحَظَاتِهِ غَيْرَ المُرْتَبِطَةِ دَاخِلَ مِلَفٍّ حَلَقِيٍّ مَتِينٍ ثُلَاثِيِّ الحَلَقَاتِ مَعَ فَهَارِسَ تَبْوِيبٍ.",
      },
      {
        context: "Subject Dividers",
        en: "Color-coded dividers separate each course section inside the large binder.",
        ar: "تَفْصِلُ الفَوَاصِلُ المُلَوَّنَةُ أَقْسَامَ كُلِّ مَادَّةٍ دِرَاسِيَّةٍ دَاخِلَ المِلَفِّ الحَلَقِيِّ الكَبِيرِ.",
      },
      {
        context: "Class Preparation",
        en: "She punched three holes in the worksheet before inserting it into her binder.",
        ar: "ثَقَبَتْ ثَلَاثَ فَتَحَاتٍ فِي وَرَقَةِ العَمَلِ قَبْلَ إِدْخَالِهَا فِي مِلَفِّهَا الحَلَقِيِّ.",
      },
    ],
    exampleSentence:
      "He organized his loose-leaf notes inside a sturdy three-ring binder with tabs.",
    exampleArabic:
      "رَتَّبَ مُلَاحَظَاتِهِ غَيْرَ المُرْتَبِطَةِ دَاخِلَ مِلَفٍّ حَلَقِيٍّ مَتِينٍ ثُلَاثِيِّ الحَلَقَاتِ مَعَ فَهَارِسَ تَبْوِيبٍ.",
  },
  "sheet-of-paper": {
    id: "sheet-of-paper",
    arabic: "وَرَقَة (فَرْخُ وَرَق)",
    partOfSpeech: "noun",
    phonetic: "ʃiːt əv ˈpeɪpər",
    pronunciationTip: "Long 'ee' sound /iː/: 'SHEET of PAY-per' (/ʃiːt əv ˈpeɪ.pər/).",
    collocations: [
      "blank sheet of paper",
      "lined sheet of paper",
      "tear a sheet of paper",
      "clean sheet of paper",
      "pass out sheets of paper",
    ],
    phrasalVerbs: [
      {
        phrase: "hand out",
        meaning: "distribute sheets to students",
        arabic: "يُوَزِّعُ الأَوْرَاق",
        example: "The teacher will hand out a blank sheet of paper to each student for the essay.",
      },
    ],
    sentences: [
      {
        context: "Pop Quiz",
        en: "The teacher told the class to take out a clean sheet of paper for a short spelling quiz.",
        ar: "طَلَبَ المُعَلِّمُ مِنَ الفَصْلِ إِخْرَاجَ وَرَقَةٍ نَظِيفَةٍ لِإِجْرَاءِ اخْتِبَارِ إِمْلَاءٍ قَصِيرٍ.",
      },
      {
        context: "Art Sketch",
        en: "She sketched a quick flower diagram on a blank sheet of paper.",
        ar: "رَسَمَتْ مُخَطَّطًا سَرِيعًا لِزَهْرَةٍ عَلَى وَرَقَةٍ بَيْضَاءَ فَارِغَةٍ.",
      },
      {
        context: "Printing",
        en: "Load fresh sheets of paper into the printer tray before starting the print job.",
        ar: "ضَعْ أَوْرَاقًا جَدِيدَةً فِي دُرْجِ الطَّابِعَةِ قَبْلَ بَدْءِ عَمَلِيَّةِ الطِّبَاعَةِ.",
      },
    ],
    exampleSentence:
      "The teacher told the class to take out a clean sheet of paper for a short spelling quiz.",
    exampleArabic:
      "طَلَبَ المُعَلِّمُ مِنَ الفَصْلِ إِخْرَاجَ وَرَقَةٍ نَظِيفَةٍ لِإِجْرَاءِ اخْتِبَارِ إِمْلَاءٍ قَصِيرٍ.",
  },
  "sticky-note": {
    id: "sticky-note",
    arabic: "وَرَقَةُ مُلَاحَظَاتٍ لَاصِقَة (سْتِيكِي نُوت)",
    partOfSpeech: "noun",
    phonetic: "ˈstɪki noʊt",
    pronunciationTip: "Pronounce 'STICK-ee noht' (/ˈstɪk.i noʊt/).",
    collocations: [
      "pad of sticky notes",
      "yellow sticky note",
      "post a sticky note",
      "colorful sticky notes",
      "leave a sticky note",
    ],
    phrasalVerbs: [
      {
        phrase: "stick on",
        meaning: "attach self-adhesive paper to a surface",
        arabic: "يُلْصِقُ المُلَاحَظَة",
        example: "Stick on a reminder note right at the top of your computer monitor.",
      },
    ],
    sentences: [
      {
        context: "Reminder",
        en: "She wrote a quick reminder on a yellow sticky note and pasted it on her desk.",
        ar: "كَتَبَتْ تَذْكِيرًا سَرِيعًا عَلَى وَرَقَةِ مُلَاحَظَاتٍ لَاصِقَةٍ صَفْرَاءَ وَأَلْصَقَتْهَا عَلَى مَكْتَبِهَا.",
      },
      {
        context: "Brainstorming",
        en: "Students posted colorful sticky notes on the whiteboard during group brainstorming.",
        ar: "أَلْصَقَ الطُّلَّابُ أَوْرَاقَ مُلَاحَظَاتٍ لَاصِقَةً مُلَوَّنَةً عَلَى اللَّوْحِ الأَبْيَضِ خِلَالَ العَصْفِ الذِّهْنِيِّ الجَمَاعِيِّ.",
      },
      {
        context: "Bookmarking",
        en: "Use miniature sticky notes to flag important formulas in your textbook.",
        ar: "اسْتَخْدِمْ أَوْرَاقَ مُلَاحَظَاتٍ لَاصِقَةً صَغِيرَةً لِتَمْيِيزِ المُعَادَلَاتِ الهَامَّةِ فِي كِتَابِكَ.",
      },
    ],
    exampleSentence:
      "She wrote a quick reminder on a yellow sticky note and pasted it on her desk.",
    exampleArabic:
      "كَتَبَتْ تَذْكِيرًا سَرِيعًا عَلَى وَرَقَةِ مُلَاحَظَاتٍ لَاصِقَةٍ صَفْرَاءَ وَأَلْصَقَتْهَا عَلَى مَكْتَبِهَا.",
  },
  "index-card": {
    id: "index-card",
    arabic: "بِطَاقَةُ فَهْرَسَة (بِطَاقَةُ اسْتِذْكَار)",
    partOfSpeech: "noun",
    phonetic: "ˈɪndɛks kɑːrd",
    pronunciationTip: "Pronounce 'IN-dex kard' (/ˈɪn.dɛks kɑːrd/).",
    collocations: [
      "flashcard on index card",
      "pack of index cards",
      "ruled index cards",
      "study with index cards",
      "flip an index card",
    ],
    phrasalVerbs: [
      {
        phrase: "flip through",
        meaning: "cycle rapidly through review cards",
        arabic: "يُقَلِّبُ بِطَاقَاتِ الفَهْرَسَة",
        example: "He flipped through a stack of index cards to memorize Spanish vocabulary.",
      },
    ],
    sentences: [
      {
        context: "Flashcard Study",
        en: "He wrote vocabulary definitions on index cards to test himself before the exam.",
        ar: "كَتَبَ تَعْرِيفَاتِ المُفْرَدَاتِ عَلَى بِطَاقَاتِ فَهْرَسَةٍ لِيَخْتَبِرَ نَفْسَهُ قَبْلَ الاِمْتِحَانِ.",
      },
      {
        context: "Speech Presentation",
        en: "The speaker held three small index cards with bulleted presentation notes.",
        ar: "حَمَلَ الخَطِيبُ ثَلَاثَ بِطَاقَاتِ فَهْرَسَةٍ صَغِيرَةٍ تَحْتَوِي عَلَى نِقَاطِ العَرْضِ التَّقْدِيمِيِّ.",
      },
      {
        context: "Library Catalog",
        en: "Vintage library catalogs used physical index cards to record book titles.",
        ar: "اسْتَخْدَمَتْ فَهَارِسُ المَكْتَبَاتِ التَّقْلِيدِيَّةُ بِطَاقَاتِ فَهْرَسَةٍ مَادِّيَّةٍ لِتَسْجِيلِ عَنَاوِينِ الكُتُبِ.",
      },
    ],
    exampleSentence:
      "He wrote vocabulary definitions on index cards to test himself before the exam.",
    exampleArabic:
      "كَتَبَ تَعْرِيفَاتِ المُفْرَدَاتِ عَلَى بِطَاقَاتِ فَهْرَسَةٍ لِيَخْتَبِرَ نَفْسَهُ قَبْلَ الاِمْتِحَانِ.",
  },
  dictionary: {
    id: "dictionary",
    arabic: "قَامُوس (مُعْجَم)",
    partOfSpeech: "noun",
    phonetic: "ˈdɪkʃəˌnɛri",
    pronunciationTip: "Pronounce 'DIK-shuh-nair-ee' (/ˈdɪk.ʃəˌnɛr.i/).",
    collocations: [
      "bilingual dictionary",
      "look up in a dictionary",
      "English dictionary",
      "unabridged dictionary",
      "pocket dictionary",
      "dictionary definition",
    ],
    phrasalVerbs: [
      {
        phrase: "look up",
        meaning: "search for word definition in reference book",
        arabic: "يَبْحَثُ عَنْ كَلِمَةٍ فِي القَامُوس",
        example: "If you encounter an unfamiliar term, look it up in the Oxford dictionary.",
      },
    ],
    sentences: [
      {
        context: "Vocabulary Lookup",
        en: "She opened the comprehensive English dictionary to verify the exact spelling of the word.",
        ar: "فَتَحَتِ القَامُوسَ الإِنْجِلِيزِيَّ الشَّامِلَ لِلتَّأَكُّدِ مِنَ التَّهْجِئَةِ الدَّقِيقَةِ لِلْكَلِمَةِ.",
      },
      {
        context: "Language Learning",
        en: "A bilingual Arabic-English dictionary bridges meanings with clear phonetic transcriptions.",
        ar: "يَرْبِطُ القَامُوسُ الثُّنَائِيُّ اللُّغَةِ عَرَبِيّ-إِنْجِلِيزِيّ المَعَانِيَ مَعَ رُمُوزٍ صَوْتِيَّةٍ وَاضِحَةٍ.",
      },
      {
        context: "Classroom Reference",
        en: "Hardcover dictionaries rest on the reference shelf for all students to consult.",
        ar: "تَسْتَقِرُّ المَعَاجِمُ ذَاتُ الأَغْلِفَةِ المُقَوَّاةِ عَلَى رَفِّ المَرَاجِعِ لِيَسْتَشِيرَهَا جَمِيعُ الطُّلَّابِ.",
      },
    ],
    exampleSentence:
      "She opened the comprehensive English dictionary to verify the exact spelling of the word.",
    exampleArabic:
      "فَتَحَتِ القَامُوسَ الإِنْجِلِيزِيَّ الشَّامِلَ لِلتَّأَكُّدِ مِنَ التَّهْجِئَةِ الدَّقِيقَةِ لِلْكَلِمَةِ.",
  },
  encyclopedia: {
    id: "encyclopedia",
    arabic: "مَوْسُوعَة (دَائِرَةُ مَعَارِف)",
    partOfSpeech: "noun",
    phonetic: "ɪnˌsaɪkləˈpiːdiə",
    pronunciationTip: "Pronounce 'en-sy-cluh-PEE-dee-uh' (/ɪnˌsaɪ.kləˈpiː.di.ə/).",
    collocations: [
      "volume of an encyclopedia",
      "consult an encyclopedia",
      "online encyclopedia",
      "illustrated encyclopedia",
      "historical encyclopedia",
    ],
    phrasalVerbs: [
      {
        phrase: "read up on",
        meaning: "research comprehensive information",
        arabic: "يَتَوَسَّعُ فِي القِرَاءَةِ عَنْ مَوْضُوع",
        example: "He decided to read up on solar systems in the illustrated encyclopedia.",
      },
    ],
    sentences: [
      {
        context: "Library Research",
        en: "He pulled volume 'M' of the encyclopedia from the shelf to research ancient mammals.",
        ar: "سَحَبَ المُجَلَّدَ 'M' مِنَ المَوْسُوعَةِ عَنِ الرَّفِّ لِلْبَحْثِ عَنِ الثَّدْيِيَّاتِ القَدِيمَةِ.",
      },
      {
        context: "General Knowledge",
        en: "The multi-volume encyclopedia covers thousands of topics from astronomy to zoology.",
        ar: "تُغَطِّي المَوْسُوعَةُ مُتَعَدِّدَةُ المُجَلَّدَاتِ آلَافَ المَوَاضِيعِ مِنَ الفَلَكِ إِلَى عِلْمِ الحَيَوَانِ.",
      },
      {
        context: "Classroom Resource",
        en: "Students frequently consult the science encyclopedia when preparing presentations.",
        ar: "يَسْتَشِيرُ الطُّلَّابُ مَوْسُوعَةَ العُلُومِ بِاسْتِمْرَارٍ عِنْدَ إِعْدَادِ العُرُوضِ التَّقْدِيمِيَّةِ.",
      },
    ],
    exampleSentence:
      "He pulled volume 'M' of the encyclopedia from the shelf to research ancient mammals.",
    exampleArabic:
      "سَحَبَ المُجَلَّدَ 'M' مِنَ المَوْسُوعَةِ عَنِ الرَّفِّ لِلْبَحْثِ عَنِ الثَّدْيِيَّاتِ القَدِيمَةِ.",
  },
  whiteboard: {
    id: "whiteboard",
    arabic: "لَوْحٌ أَبْيَض (سَبُّورَةٌ بَيْضَاء)",
    partOfSpeech: "noun",
    phonetic: "ˈwaɪtbɔːrd",
    pronunciationTip: "Pronounce 'WHITE-bord' (/ˈwaɪt.bɔːrd/).",
    collocations: [
      "magnetic whiteboard",
      "erase the whiteboard",
      "dry-erase whiteboard",
      "whiteboard marker",
      "write on the whiteboard",
    ],
    phrasalVerbs: [
      {
        phrase: "wipe clean",
        meaning: "remove all dry-erase marks",
        arabic: "يَمْسَحُ اللَّوْحَ نَظِيفًا",
        example: "The helper wiped clean the magnetic whiteboard at the end of the school day.",
      },
    ],
    sentences: [
      {
        context: "Math Class",
        en: "The teacher solved algebraic equations on the large magnetic whiteboard.",
        ar: "حَلَّ المُعَلِّمُ مُعَادَلَاتٍ جَبْرِيَّةً عَلَى اللَّوْحِ الأَبْيَضِ المَغْنَاطِيسِيِّ الكَبِيرِ.",
      },
      {
        context: "Classroom Activity",
        en: "A student volunteered to write the correct grammar answers on the board.",
        ar: "تَطَوَّعَ طَالِبٌ لِكِتَابَةِ إِجَابَاتِ القَوَاعِدِ الصَّحِيحَةِ عَلَى اللَّوْحِ.",
      },
      {
        context: "End of Lesson",
        en: "Use the felt eraser to wipe the whiteboard clean before the next class arrives.",
        ar: "اسْتَخْدِمِ المِمْحَاةَ القُمَاشِيَّةَ لِمَسْحِ اللَّوْحِ الأَبْيَضِ قَبْلَ وُصُولِ الفَصْلِ التَّالِي.",
      },
    ],
    exampleSentence: "The teacher solved algebraic equations on the large magnetic whiteboard.",
    exampleArabic:
      "حَلَّ المُعَلِّمُ مُعَادَلَاتٍ جَبْرِيَّةً عَلَى اللَّوْحِ الأَبْيَضِ المَغْنَاطِيسِيِّ الكَبِيرِ.",
  },
  projector: {
    id: "projector",
    arabic: "جِهَازُ عَرْضٍ ضَوْئِيّ (بْرُوجِكْتُور)",
    partOfSpeech: "noun",
    phonetic: "prəˈdʒɛktər",
    pronunciationTip: "Pronounce 'pruh-JEK-ter' (/prəˈdʒɛk.tər/).",
    collocations: [
      "digital projector",
      "ceiling-mounted projector",
      "turn on the projector",
      "HD projector",
      "projector screen",
      "connected projector",
    ],
    phrasalVerbs: [
      {
        phrase: "beam onto",
        meaning: "cast images using light",
        arabic: "يَعْرِضُ ضَوْئِيًّا عَلَى",
        example: "The digital projector beamed the interactive science slide deck onto the screen.",
      },
    ],
    sentences: [
      {
        context: "Visual Presentation",
        en: "The ceiling-mounted projector displayed educational slides clearly across the wide screen.",
        ar: "عَرَضَ جِهَازُ العَرْضِ الضَّوْئِيِّ المُثَبَّتُ فِي السَّقْفِ الشَّرَائِحَ التَّعْلِيمِيَّةَ بِوُضُوحٍ عَبْرَ الشَّاشَةِ العَرِيضَةِ.",
      },
      {
        context: "Document Display",
        en: "She connected her laptop to the projector to share her group research project.",
        ar: "رَبَطَتْ حَاسُوبَهَا المَحْمُولَ بِجِهَازِ العَرْضِ الضَّوْئِيِّ لِمُشَارَكَةِ مَشْرُوعِ بَحْثِ مَجْمُوعَتِهَا.",
      },
      {
        context: "Movie Day",
        en: "Dim the classroom lights when the projector is playing the documentary film.",
        ar: "اخْفِتْ أَضْوَاءَ الفَصْلِ عِنْدَمَا يَعْرِضُ البْرُوجِكْتُورُ الفِيلْمَ الوَثَائِقِيَّ.",
      },
    ],
    exampleSentence:
      "The ceiling-mounted projector displayed educational slides clearly across the wide screen.",
    exampleArabic:
      "عَرَضَ جِهَازُ العَرْضِ الضَّوْئِيِّ المُثَبَّتُ فِي السَّقْفِ الشَّرَائِحَ التَّعْلِيمِيَّةَ بِوُضُوحٍ عَبْرَ الشَّاشَةِ العَرِيضَةِ.",
  },
  screen: {
    id: "screen",
    arabic: "شَاشَةُ عَرْض",
    partOfSpeech: "noun",
    phonetic: "skriːn",
    pronunciationTip: "Long 'ee' sound /iː/: 'SKREEN' (/skriːn/).",
    collocations: [
      "pull-down screen",
      "projection screen",
      "large screen",
      "display screen",
      "retractable screen",
    ],
    phrasalVerbs: [
      {
        phrase: "pull down",
        meaning: "lower a retractable projection surface",
        arabic: "يُنْزِلُ شَاشَةَ العَرْض",
        example: "Pull down the white projection screen before turning on the slide machine.",
      },
    ],
    sentences: [
      {
        context: "Class Presentation",
        en: "The teacher pulled down the large white screen in front of the classroom chalkboard.",
        ar: "أَنْزَلَ المُعَلِّمُ شَاشَةَ العَرْضِ البَيْضَاءَ الكَبِيرَةَ أَمَامَ سَبُّورَةِ الفَصْلِ.",
      },
      {
        context: "High Definition",
        en: "The matte white screen reflects crisp video imagery without distracting glare.",
        ar: "تَعْكِسُ شَاشَةُ العَرْضِ المَطْفِيَّةُ البَيْضَاءُ صُوَرَ فِيدْيُو دَقِيقَةً دُونَ وَهَجٍ مُشَتِّتٍ.",
      },
      {
        context: "Retractable Mechanism",
        en: "A gentle tug on the handle retracts the fabric screen back into its metal housing.",
        ar: "تُؤَدِّي سَحْبَةٌ خَفِيفَةٌ لِلْمِقْبَضِ إِلَى إِعَادَةِ الشَّاشَةِ القُمَاشِيَّةِ إِلَى صُنْدُوقِهَا المَعْدَنِيِّ.",
      },
    ],
    exampleSentence:
      "The teacher pulled down the large white screen in front of the classroom chalkboard.",
    exampleArabic:
      "أَنْزَلَ المُعَلِّمُ شَاشَةَ العَرْضِ البَيْضَاءَ الكَبِيرَةَ أَمَامَ سَبُّورَةِ الفَصْلِ.",
  },
  globe: {
    id: "globe",
    arabic: "مُجَسَّمُ الكُرَةِ الأَرْضِيَّة",
    partOfSpeech: "noun",
    phonetic: "ɡloʊb",
    pronunciationTip: "Pronounce 'GLOHB' (/ɡloʊb/).",
    collocations: [
      "spinning globe",
      "world globe",
      "desk globe",
      "illuminated globe",
      "geographical globe",
      "spin the globe",
    ],
    phrasalVerbs: [
      {
        phrase: "point out",
        meaning: "indicate location on a spherical map",
        arabic: "يُشِيرُ إِلَى مَوْقِعٍ عَلَى المُجَسَّم",
        example: "Use your finger to point out the equator on the spinning world globe.",
      },
    ],
    sentences: [
      {
        context: "Geography Lesson",
        en: "The teacher spun the desktop globe to point out the Atlantic Ocean to the class.",
        ar: "أَدَارَ المُعَلِّمُ مُجَسَّمَ الكُرَةِ الأَرْضِيَّةِ المَكْتَبِيَّ لِيُشِيرَ إِلَى المُحِيطِ الأَطْلَسِيِّ لِلْفَصْلِ.",
      },
      {
        context: "Map Exploration",
        en: "A spherical globe accurately depicts continents without flat projection distortions.",
        ar: "يُصَوِّرُ مُجَسَّمُ الكُرَةِ الأَرْضِيَّةِ الكُرَوِيُّ القَارَّاتِ بِدِقَّةٍ دُونَ تَشَوُّهَاتِ الإِسْقَاطِ المُسَطَّحِ.",
      },
      {
        context: "Classroom Corner",
        en: "An illuminated vintage globe sits proudly on top of the library bookshelf.",
        ar: "يَسْتَقِرُّ مُجَسَّمُ الكُرَةِ الأَرْضِيَّةِ المُضَاءُ الكَلَاسِيكِيُّ بِفَخْرٍ فَوْقَ رَفِّ كُتُبِ المَكْتَبَةِ.",
      },
    ],
    exampleSentence:
      "The teacher spun the desktop globe to point out the Atlantic Ocean to the class.",
    exampleArabic:
      "أَدَارَ المُعَلِّمُ مُجَسَّمَ الكُرَةِ الأَرْضِيَّةِ المَكْتَبِيَّ لِيُشِيرَ إِلَى المُحِيطِ الأَطْلَسِيِّ لِلْفَصْلِ.",
  },
  locker: {
    id: "locker",
    arabic: "خِزَانَةٌ مَدْرَسِيَّة (لُوكَر)",
    partOfSpeech: "noun",
    phonetic: "ˈlɑːkər",
    pronunciationTip: "Pronounce 'LAH-ker' (/ˈlɑː.kər/).",
    collocations: [
      "school locker",
      "lock a locker",
      "locker combination",
      "hallway locker",
      "locker door",
      "store in a locker",
    ],
    phrasalVerbs: [
      {
        phrase: "lock up",
        meaning: "secure belongings with combination lock",
        arabic: "يُقْفِلُ الخِزَانَة",
        example: "Always lock up your backpack and heavy coat inside your assigned locker.",
      },
    ],
    sentences: [
      {
        context: "Hallway Routine",
        en: "Between class periods, he dialed his three-number combination to open his locker.",
        ar: "بَيْنَ الحِصَصِ الدِّرَاسِيَّةِ، أَدَارَ رَقْمَهُ السِّرِّيَّ الثُّلَاثِيَّ لِفَتْحِ خِزَانَتِهِ المَدْرَسِيَّةِ.",
      },
      {
        context: "Storage",
        en: "Students hang their winter coats and store gym gear inside tall blue metal lockers.",
        ar: "يُعَلِّقُ الطُّلَّابُ مَعَاطِفَهُمُ الشَّتَوِيَّةَ وَيَحْفَظُونَ مُعِدَّاتِ الرِّيَاضَةِ دَاخِلَ خَزَائِنَ مَعْدَنِيَّةٍ زَرْقَاءَ طَوِيلَةٍ.",
      },
      {
        context: "Personalizing",
        en: "She decorated the inside door of her hallway locker with magnetic photos.",
        ar: "زَيَّنَتِ البَابَ الدَّاخِلِيَّ لِخِزَانَتِهَا فِي الرِّدْهَةِ بِصُوَرٍ مَغْنَاطِيسِيَّةٍ.",
      },
    ],
    exampleSentence:
      "Between class periods, he dialed his three-number combination to open his locker.",
    exampleArabic:
      "بَيْنَ الحِصَصِ الدِّرَاسِيَّةِ، أَدَارَ رَقْمَهُ السِّرِّيَّ الثُّلَاثِيَّ لِفَتْحِ خِزَانَتِهِ المَدْرَسِيَّةِ.",
  },
  "bulletin-board": {
    id: "bulletin-board",
    arabic: "لَوْحَةُ إِعْلَانَات (لَوْحَةُ مَعْلُومَات)",
    partOfSpeech: "noun",
    phonetic: "ˈbʊlətɪn bɔːrd",
    pronunciationTip: "Pronounce 'BULL-uh-tin bord' (/ˈbʊl.ə.tɪn bɔːrd/).",
    collocations: [
      "cork bulletin board",
      "pin to a bulletin board",
      "classroom bulletin board",
      "announcements on the board",
      "colorful bulletin board",
    ],
    phrasalVerbs: [
      {
        phrase: "pin up",
        meaning: "attach announcements using push pins",
        arabic: "يُعَلِّقُ بِدَبَابِيسَ عَلَى اللَّوْحَة",
        example: "The teacher pinned up the weekly honor roll on the cork bulletin board.",
      },
    ],
    sentences: [
      {
        context: "School Announcements",
        en: "The teacher pinned student artwork and the weekly calendar on the cork bulletin board.",
        ar: "عَلَّقَ المُعَلِّمُ أَعْمَالَ الطُّلَّابِ الفَنِّيَّةَ وَالتَّقْوِيمَ الأُسْبُوعِيَّ عَلَى لَوْحَةِ الإِعْلَانَاتِ الفِلِّينِيَّةِ.",
      },
      {
        context: "Displaying Honors",
        en: "Important club meeting notices and field trip forms are posted on the main board.",
        ar: "تُنْشَرُ إِشْعَارَاتُ اجْتِمَاعَاتِ الأَنْشِطَةِ الهَامَّةِ وَنَمَاذِجُ الرِّحْلَاتِ عَلَى لَوْحَةِ المَعْلُومَاتِ الرَّئِيسِيَّةِ.",
      },
      {
        context: "Classroom Decor",
        en: "A decorative scalloped border frames the colorful classroom bulletin board.",
        ar: "يُحِيطُ إِطَارٌ مُزَخْرَفٌ مُتَمَوِّجٌ بِلَوْحَةِ إِعْلَانَاتِ الفَصْلِ المُلَوَّنَةِ.",
      },
    ],
    exampleSentence:
      "The teacher pinned student artwork and the weekly calendar on the cork bulletin board.",
    exampleArabic:
      "عَلَّقَ المُعَلِّمُ أَعْمَالَ الطُّلَّابِ الفَنِّيَّةَ وَالتَّقْوِيمَ الأُسْبُوعِيَّ عَلَى لَوْحَةِ الإِعْلَانَاتِ الفِلِّينِيَّةِ.",
  },
  scissors: {
    id: "scissors",
    arabic: "مِقَصّ",
    partOfSpeech: "noun",
    phonetic: "ˈsɪzərz",
    pronunciationTip: "Pronounce 'SIZ-erz' (/ˈsɪz.ərz/). Plural noun.",
    collocations: [
      "pair of scissors",
      "safety scissors",
      "sharp scissors",
      "cut with scissors",
      "craft scissors",
      "blunt-tip scissors",
    ],
    phrasalVerbs: [
      {
        phrase: "cut out",
        meaning: "remove a shape by cutting with blades",
        arabic: "يَقُصُّ الشَّكْل",
        example: "Use safety scissors to carefully cut out the paper star.",
      },
    ],
    sentences: [
      {
        context: "Craft Project",
        en: "She used a pair of blunt safety scissors to cut out paper shapes for her collage.",
        ar: "اسْتَخْدَمَتْ مِقَصًّا ذَا سِنٍّ غَيْرِ حَادَّةٍ لِلأَمَانِ لِقَصِّ أَشْكَالٍ وَرَقِيَّةٍ لِلَوْحَتِهَا التَّجْمِيعِيَّةِ.",
      },
      {
        context: "Classroom Safety",
        en: "Always walk carefully when carrying scissors, keeping the blades pointed downward.",
        ar: "امْشِ دَائِمًا بِحَذَرٍ عِنْدَ حَمْلِ المِقَصِّ، مَعَ تَوْجِيهِ الشَّفَرَاتِ إِلَى الأَسْفَلِ.",
      },
      {
        context: "Art Supplies",
        en: "Left-handed scissors make cutting comfortable for southpaw students.",
        ar: "يَجْعَلُ المِقَصُّ الخَاصُّ بِالعُسْرِ عَمَلِيَّةَ القَصِّ مُرِيحَةً لِلطُّلَّابِ الَّذِينَ يَسْتَخْدِمُونَ اليَدَ اليُسْرَى.",
      },
    ],
    exampleSentence:
      "She used a pair of blunt safety scissors to cut out paper shapes for her collage.",
    exampleArabic:
      "اسْتَخْدَمَتْ مِقَصًّا ذَا سِنٍّ غَيْرِ حَادَّةٍ لِلأَمَانِ لِقَصِّ أَشْكَالٍ وَرَقِيَّةٍ لِلَوْحَتِهَا التَّجْمِيعِيَّةِ.",
  },
  "glue-stick": {
    id: "glue-stick",
    arabic: "أُصْبُوعُ صَمْغ (غِرَاءٌ لَاصِق)",
    partOfSpeech: "noun",
    phonetic: "ɡluː stɪk",
    pronunciationTip: "Pronounce 'GLOO stik' (/ɡluː stɪk/).",
    collocations: [
      "washable glue stick",
      "purple glue stick",
      "apply glue stick",
      "twist up the glue stick",
      "glue stick cap",
    ],
    phrasalVerbs: [
      {
        phrase: "paste down",
        meaning: "affix paper firmly with adhesive",
        arabic: "يُلْصِقُ بِالصَّمْغ",
        example: "Rub the glue stick along the edges and paste down the cutout image.",
      },
    ],
    sentences: [
      {
        context: "Art Craft",
        en: "He twisted the base of the purple glue stick to paste the picture onto cardstock.",
        ar: "أَدَارَ قَاعِدَةَ أُصْبُوعِ الصَّمْغِ الأُرْجُوَانِيِّ لِلَصْقِ الصُّورَةِ عَلَى وَرَقٍ مُقَوًّى.",
      },
      {
        context: "Non-Toxic Supplies",
        en: "Washable, non-toxic glue sticks dry completely clear without wrinkling paper.",
        ar: "تَجِفُّ أَصَابِعُ الصَّمْغِ القَابِلَةُ لِلْغَسِيلِ وَغَيْرُ السَّامَّةِ بِشَكْلٍ شَفَّافٍ تَمَامًا دُونَ تَجْعِيدِ الوَرَقِ.",
      },
      {
        context: "Storage",
        en: "Remember to snap the cap back on your glue stick so the adhesive stays moist.",
        ar: "تَذَكَّرْ إِعَادَةَ الغِطَاءِ إِلَى أُصْبُوعِ الصَّمْغِ حَتَّى يَظَلَّ المَادَّةُ اللَّاصِقَةُ رَطْبَةً.",
      },
    ],
    exampleSentence:
      "He twisted the base of the purple glue stick to paste the picture onto cardstock.",
    exampleArabic:
      "أَدَارَ قَاعِدَةَ أُصْبُوعِ الصَّمْغِ الأُرْجُوَانِيِّ لِلَصْقِ الصُّورَةِ عَلَى وَرَقٍ مُقَوًّى.",
  },
  tape: {
    id: "tape",
    arabic: "شَرِيطٌ لَاصِق",
    partOfSpeech: "noun",
    phonetic: "teɪp",
    pronunciationTip: "Long 'a' sound /eɪ/: 'TAYP' (/teɪp/).",
    collocations: [
      "clear adhesive tape",
      "roll of tape",
      "masking tape",
      "dispenser for tape",
      "tape a poster",
    ],
    phrasalVerbs: [
      {
        phrase: "tape up",
        meaning: "affix to a wall or surface with tape",
        arabic: "يُثَبِّتُ بِالشَّرِيطِ اللَّاصِق",
        example: "He helped the teacher tape up the colorful classroom banner.",
      },
    ],
    sentences: [
      {
        context: "Classroom Decor",
        en: "She used clear adhesive tape to secure her solar system poster to the classroom wall.",
        ar: "اسْتَخْدَمَتْ شَرِيطًا لَاصِقًا شَفَّافًا لِتَثْبِيتِ مُلْصَقِ المَجْمُوعَةِ الشَّمْسِيَّةِ عَلَى جِدَارِ الفَصْلِ.",
      },
      {
        context: "Desk Accessory",
        en: "A weighted desktop tape dispenser makes tearing small strips easy with one hand.",
        ar: "تَجْعَلُ مُوَزِّعَةُ الشَّرِيطِ اللَّاصِقِ المَكْتَبِيَّةُ الثَّقِيلَةُ قَطْعَ القِطَعِ الصَّغِيرَةِ سَهْلًا بِيَدٍ وَاحِدَةٍ.",
      },
      {
        context: "Repairing Pages",
        en: "He mended the torn page of his reading book with transparent tape.",
        ar: "أَصْلَحَ الصَّفْحَةَ المُمَزَّقَةَ مِنْ كِتَابِ القِرَاءَةِ بِشَرِيطٍ لَاصِقٍ شَفَّافٍ.",
      },
    ],
    exampleSentence:
      "She used clear adhesive tape to secure her solar system poster to the classroom wall.",
    exampleArabic:
      "اسْتَخْدَمَتْ شَرِيطًا لَاصِقًا شَفَّافًا لِتَثْبِيتِ مُلْصَقِ المَجْمُوعَةِ الشَّمْسِيَّةِ عَلَى جِدَارِ الفَصْلِ.",
  },
  stapler: {
    id: "stapler",
    arabic: "دَبَّاسَة (دَبَّاسَةُ أَوْرَاق)",
    partOfSpeech: "noun",
    phonetic: "ˈsteɪplər",
    pronunciationTip: "Pronounce 'STAY-pler' (/ˈsteɪ.plər/).",
    collocations: [
      "desktop stapler",
      "box of staples",
      "stapler jam",
      "press the stapler",
      "staple papers together",
    ],
    phrasalVerbs: [
      {
        phrase: "staple together",
        meaning: "bind documents with metal clips",
        arabic: "يَدْبُسُ مَعًا",
        example: "Staple together the three pages of your research report.",
      },
    ],
    sentences: [
      {
        context: "Paper Organization",
        en: "The teacher pressed down on the desktop stapler to bind the multi-page exam.",
        ar: "ضَغَطَ المُعَلِّمُ عَلَى دَبَّاسَةِ المَكْتَبِ لِتَثْبِيتِ صَفَحَاتِ الاِمْتِحَانِ المُتَعَدِّدَةِ.",
      },
      {
        context: "Refilling Supplies",
        en: "She opened the metal hinge to reload a fresh row of wire staples.",
        ar: "فَتَحَتِ المِفْصَلَةَ المَعْدَنِيَّةَ لِإِعَادَةِ تَعْبِئَةِ صَفٍّ جَدِيدٍ مِنْ دَبَابِيسِ السِّلْكِ.",
      },
      {
        context: "Desk Setup",
        en: "A heavy-duty manual stapler sits beside the teacher's paper tray.",
        ar: "تَسْتَقِرُّ دَبَّاسَةٌ يَدَوِيَّةٌ شَدِيدَةُ التَّحَمُّلِ بِجَانِبِ دُرْجِ أَوْرَاقِ المُعَلِّمِ.",
      },
    ],
    exampleSentence: "The teacher pressed down on the desktop stapler to bind the multi-page exam.",
    exampleArabic:
      "ضَغَطَ المُعَلِّمُ عَلَى دَبَّاسَةِ المَكْتَبِ لِتَثْبِيتِ صَفَحَاتِ الاِمْتِحَانِ المُتَعَدِّدَةِ.",
  },
  "paper-clip": {
    id: "paper-clip",
    arabic: "مَشْبَكُ وَرَق",
    partOfSpeech: "noun",
    phonetic: "ˈpeɪpər klɪp",
    pronunciationTip: "Pronounce 'PAY-per klip' (/ˈpeɪ.pər klɪp/).",
    collocations: [
      "metal paper clip",
      "box of paper clips",
      "colorful paper clip",
      "slide a paper clip",
      "fasten with a paper clip",
    ],
    phrasalVerbs: [
      {
        phrase: "clip together",
        meaning: "hold sheets temporarily with a wire clamp",
        arabic: "يَشْبِكُ الأَوْرَاقَ مَعًا",
        example: "Clip together your essay and permission slip before turning them in.",
      },
    ],
    sentences: [
      {
        context: "Filing Homework",
        en: "He slid a silver wire paper clip onto the corner of his essay to keep the pages in order.",
        ar: "أَدْخَلَ مَشْبَكَ وَرَقٍ سِلْكِيًّا فِضِّيًّا عَلَى زَاوِيَةِ مَقَالِهِ لِلْحِفَاظِ عَلَى تَرْتِيبِ الصَّفَحَاتِ.",
      },
      {
        context: "Color Coding",
        en: "Plastic-coated colorful paper clips help sort reading worksheets by reading level.",
        ar: "تُسَاعِدُ مَشَابِكُ الوَرَقِ المُلَوَّنَةُ المُغَطَّاةُ بِالبَلَاسْتِيكِ فِي تَرْتِيبِ أَوْرَاقِ عَمَلِ القِرَاءَةِ.",
      },
      {
        context: "Desk Storage",
        en: "A magnetic dispenser holds all small metal paper clips ready on the desk.",
        ar: "تَحْفَظُ حَامِلَةٌ مَغْنَاطِيسِيَّةٌ جَمِيعَ مَشَابِكِ الوَرَقِ المَعْدَنِيَّةِ جَاهِزَةً عَلَى المَكْتَبِ.",
      },
    ],
    exampleSentence:
      "He slid a silver wire paper clip onto the corner of his essay to keep the pages in order.",
    exampleArabic:
      "أَدْخَلَ مَشْبَكَ وَرَقٍ سِلْكِيًّا فِضِّيًّا عَلَى زَاوِيَةِ مَقَالِهِ لِلْحِفَاظِ عَلَى تَرْتِيبِ الصَّفَحَاتِ.",
  },
  "rubber-band": {
    id: "rubber-band",
    arabic: "رِبَاطٌ مَطَّاطِيّ (مَطَّاط)",
    partOfSpeech: "noun",
    phonetic: "ˈrʌbər bænd",
    pronunciationTip: "Pronounce 'RUB-er band' (/ˈrʌb.ər bænd/).",
    collocations: [
      "elastic rubber band",
      "stretch a rubber band",
      "snap a rubber band",
      "bundle with rubber bands",
      "rubber band ball",
    ],
    phrasalVerbs: [
      {
        phrase: "bundle up",
        meaning: "group items tightly with an elastic loop",
        arabic: "يَحْزِمُ بِرِبَاطٍ مَطَّاطِيّ",
        example: "Bundle up your vocabulary flashcards with a rubber band.",
      },
    ],
    sentences: [
      {
        context: "Flashcard Bundle",
        en: "She wrapped a stretchy rubber band around her stack of study flashcards.",
        ar: "لَفَّتْ رِبَاطًا مَطَّاطِيًّا مَرِنًا حَوْلَ حُزْمَةِ بِطَاقَاتِ الاِسْتِذْكَارِ الخَاصَّةِ بِهَا.",
      },
      {
        context: "Desk Organization",
        en: "A large ball of colorful rubber bands sits in the teacher's supply drawer.",
        ar: "تَسْتَقِرُّ كُرَةٌ كَبِيرَةٌ مِنْ أَرْبِطَةِ المَطَّاطِ المُلَوَّنَةِ فِي دُرْجِ أَدَوَاتِ المُعَلِّمِ.",
      },
      {
        context: "Art Supplies",
        en: "Elastic bands secure rolled posters neatly for safe transport.",
        ar: "تُثَبِّتُ الأَرْبِطَةُ المَرِنَةُ المُلْصَقَاتِ المَلْفُوفَةَ بِإِحْكَامٍ لِنَقْلِهَا بِأَمَانٍ.",
      },
    ],
    exampleSentence: "She wrapped a stretchy rubber band around her stack of study flashcards.",
    exampleArabic:
      "لَفَّتْ رِبَاطًا مَطَّاطِيًّا مَرِنًا حَوْلَ حُزْمَةِ بِطَاقَاتِ الاِسْتِذْكَارِ الخَاصَّةِ بِهَا.",
  },
  thumbtack: {
    id: "thumbtack",
    arabic: "دَبُّوسُ لَوْحَة (دَبُّوسُ ضَغْط)",
    partOfSpeech: "noun",
    phonetic: "ˈθʌmtæk",
    pronunciationTip: "Pronounce 'THUM-tak' (/ˈθʌm.tæk/).",
    collocations: [
      "push thumbtack",
      "cork board thumbtacks",
      "colorful thumbtacks",
      "press with a thumbtack",
      "metal thumbtack",
    ],
    phrasalVerbs: [
      {
        phrase: "tack up",
        meaning: "affix notes to a cork surface",
        arabic: "يُثَبِّتُ بِدَبَابِيسِ الضَّغْط",
        example: "Tack up the science fair guidelines on the classroom corkboard.",
      },
    ],
    sentences: [
      {
        context: "Notice Board",
        en: "The teacher pressed a red thumbtack into the corkboard to hang the field trip schedule.",
        ar: "ضَغَطَ المُعَلِّمُ دَبُّوسَ لَوْحَةٍ أَحْمَرَ فِي اللَّوْحِ الفِلِّينِيِّ لِتَعْلِيقِ جَدْوَلِ الرِّحْلَةِ المَيْدَانِيَّةِ.",
      },
      {
        context: "Artwork Display",
        en: "Students used colorful plastic thumbtacks to display their landscape paintings.",
        ar: "اسْتَخْدَمَ الطُّلَّابُ دَبَابِيسَ ضَغْطٍ بَلَاسْتِيكِيَّةً مُلَوَّنَةً لِعَرْضِ لَوْحَاتِهِمُ الطَّبِيعِيَّةِ.",
      },
      {
        context: "Supply Organization",
        en: "Keep sharp thumbtacks stored safely inside a clear plastic container.",
        ar: "احْفَظْ دَبَابِيسَ الضَّغْطِ الحَادَّةَ بِأَمَانٍ دَاخِلَ حَاوِيَةٍ بَلَاسْتِيكِيَّةٍ شَفَّافَةٍ.",
      },
    ],
    exampleSentence:
      "The teacher pressed a red thumbtack into the corkboard to hang the field trip schedule.",
    exampleArabic:
      "ضَغَطَ المُعَلِّمُ دَبُّوسَ لَوْحَةٍ أَحْمَرَ فِي اللَّوْحِ الفِلِّينِيِّ لِتَعْلِيقِ جَدْوَلِ الرِّحْلَةِ المَيْدَانِيَّةِ.",
  },
  calculator: {
    id: "calculator",
    arabic: "آلَةٌ حَاسِبَة",
    partOfSpeech: "noun",
    phonetic: "ˈkælkjəˌleɪtər",
    pronunciationTip: "Pronounce 'KAL-kyuh-lay-ter' (/ˈkæl.kjəˌleɪ.tər/).",
    collocations: [
      "scientific calculator",
      "graphing calculator",
      "solar-powered calculator",
      "calculate with a calculator",
      "press buttons on a calculator",
    ],
    phrasalVerbs: [
      {
        phrase: "work out",
        meaning: "solve mathematical equations using an electronic device",
        arabic: "يَحْسِبُ بِالآلَةِ الحَاسِبَة",
        example: "He used his scientific calculator to work out the complex physics equation.",
      },
    ],
    sentences: [
      {
        context: "Math Class",
        en: "She typed numbers into her scientific calculator to solve the trigonometry problem.",
        ar: "كَتَبَتِ الأَرْقَامَ عَلَى آلَتِهَا الحَاسِبَةِ العِلْمِيَّةِ لِحَلِّ مَسْأَلَةِ حِسَابِ المُثَلَّثَاتِ.",
      },
      {
        context: "Solar Powered",
        en: "A solar-powered calculator operates reliably under standard classroom fluorescent lighting.",
        ar: "تَعْمَلُ الآلَةُ الحَاسِبَةُ الَّتِي تَعْمَلُ بِالطَّاقَةِ الشَّمْسِيَّةِ بِمَوْثُوقِيَّةٍ تَحْتَ إِضَاءَةِ الفَصْلِ الفَلُورِيَّةِ.",
      },
      {
        context: "Exam Rules",
        en: "Advanced graphing calculators are permitted only during the second half of the exam.",
        ar: "يُسْمَحُ بِالآلَاتِ الحَاسِبَةِ البَيَانِيَّةِ المُتَقَدِّمَةِ فَقَطْ خِلَالَ النِّصْفِ الثَّانِي مِنَ الاِمْتِحَانِ.",
      },
    ],
    exampleSentence:
      "She typed numbers into her scientific calculator to solve the trigonometry problem.",
    exampleArabic:
      "كَتَبَتِ الأَرْقَامَ عَلَى آلَتِهَا الحَاسِبَةِ العِلْمِيَّةِ لِحَلِّ مَسْأَلَةِ حِسَابِ المُثَلَّثَاتِ.",
  },
  compass: {
    id: "compass",
    arabic: "فِرْجَار (بِرْجَل)",
    partOfSpeech: "noun",
    phonetic: "ˈkʌmpəs",
    pronunciationTip: "Short 'u' sound /ʌ/: 'KUM-pus' (/ˈkʌm.pəs/).",
    collocations: [
      "drawing compass",
      "geometry compass",
      "draw a circle with a compass",
      "sharp metal compass point",
      "compass and straightedge",
    ],
    phrasalVerbs: [
      {
        phrase: "sweep around",
        meaning: "rotate drawing arm to form a circle",
        arabic: "يَدُورُ لِرَسْمِ دَائِرَة",
        example: "Anchor the point firmly and sweep the compass around to trace a perfect circle.",
      },
    ],
    sentences: [
      {
        context: "Geometry Drawing",
        en: "He inserted a pencil into the drawing compass to construct a perfect circle on grid paper.",
        ar: "أَدْخَلَ قَلَمَ رَصَاصٍ فِي الفِرْجَارِ لِرَسْمِ دَائِرَةٍ مِثَالِيَّةٍ عَلَى وَرَقٍ مُرَبَّعَاتٍ.",
      },
      {
        context: "Precision Tool",
        en: "A precision metal compass allows students to bisect angles with mathematical accuracy.",
        ar: "يُتِيحُ الفِرْجَارُ المَعْدَنِيُّ الدَّقِيقُ لِلطُّلَّابِ تَنْصِيفَ الزَّوَايَا بِدِقَّةٍ رِيَاضِيَّةٍ.",
      },
      {
        context: "Math Set",
        en: "The geometry set includes a compass, protractor, and set squares in a metal tin.",
        ar: "تَتَضَمَّنُ عُلْبَةُ الهَنْدَسَةِ فِرْجَارًا وَمِنْقَلَةً وَمُثَلَّثَاتٍ فِي عُلْبَةٍ مَعْدَنِيَّةٍ.",
      },
    ],
    exampleSentence:
      "He inserted a pencil into the drawing compass to construct a perfect circle on grid paper.",
    exampleArabic:
      "أَدْخَلَ قَلَمَ رَصَاصٍ فِي الفِرْجَارِ لِرَسْمِ دَائِرَةٍ مِثَالِيَّةٍ عَلَى وَرَقٍ مُرَبَّعَاتٍ.",
  },
  computer: {
    id: "computer",
    arabic: "حَاسُوب (كَمْبِيُوتَر)",
    partOfSpeech: "noun",
    phonetic: "kəmˈpjuːtər",
    pronunciationTip: "Pronounce 'kuhm-PYOO-ter' (/kəmˈpjuː.tər/).",
    collocations: [
      "desktop computer",
      "computer lab",
      "turn on the computer",
      "log into the computer",
      "personal computer",
      "computer monitor",
    ],
    phrasalVerbs: [
      {
        phrase: "log in",
        meaning: "access computer account with credentials",
        arabic: "يُسَجِّلُ الدُّخُولَ إِلَى الحَاسُوب",
        example: "Students enter their school ID to log in to the lab computer.",
      },
    ],
    sentences: [
      {
        context: "Computer Lab",
        en: "The class gathered in the computer lab to type their historical research papers.",
        ar: "تَجَمَّعَ الفَصْلُ فِي مُعَامِلِ الحَاسُوبِ لِطِبَاعَةِ أَوْرَاقِ أَبْحَاثِهِمُ التَّارِيخِيَّةِ.",
      },
      {
        context: "Classroom Tech",
        en: "A modern desktop computer at the teacher's station connects to the interactive display.",
        ar: "يَتَّصِلُ حَاسُوبٌ مَكْتَبِيٌّ حَدِيثٌ فِي مَوْضِعِ المُعَلِّمِ بِالشَّاشَةِ التَّفَاعُلِيَّةِ.",
      },
      {
        context: "Online Learning",
        en: "Students practice coding skills weekly on dedicated learning computers.",
        ar: "يَتَدَرَّبُ الطُّلَّابُ عَلَى مَهَارَاتِ البَرْمَجَةِ أُسْبُوعِيًّا عَلَى حَوَاسِيبَ تَعْلِيمِيَّةٍ مُخَصَّصَةٍ.",
      },
    ],
    exampleSentence:
      "The class gathered in the computer lab to type their historical research papers.",
    exampleArabic:
      "تَجَمَّعَ الفَصْلُ فِي مُعَامِلِ الحَاسُوبِ لِطِبَاعَةِ أَوْرَاقِ أَبْحَاثِهِمُ التَّارِيخِيَّةِ.",
  },
  keyboard: {
    id: "keyboard",
    arabic: "لَوْحَةُ مَفَاتِيح",
    partOfSpeech: "noun",
    phonetic: "ˈkiːbɔːrd",
    pronunciationTip: "Pronounce 'KEE-bord' (/ˈkiː.bɔːrd/).",
    collocations: [
      "type on a keyboard",
      "wireless keyboard",
      "mechanical keyboard",
      "keyboard keys",
      "ergonomic keyboard",
      "USB keyboard",
    ],
    phrasalVerbs: [
      {
        phrase: "type in",
        meaning: "enter characters using keys",
        arabic: "يُدْخِلُ بِالضَّغْطِ عَلَى المَفَاتِيح",
        example: "Type in your school username and password on the keyboard.",
      },
    ],
    sentences: [
      {
        context: "Typing Class",
        en: "Students learned touch typing technique by keeping their fingers on the home row of the keyboard.",
        ar: "تَعَلَّمَ الطُّلَّابُ تِقْنِيَّةَ الطِّبَاعَةِ اللَّمْسِيَّةِ بِإِبْقَاءِ أَصَابِعِهِمْ عَلَى صَفِّ الِارْتِكَازِ فِي لَوْحَةِ المَفَاتِيحِ.",
      },
      {
        context: "Computer Setup",
        en: "An ergonomic wireless keyboard prevents wrist strain during long writing sessions.",
        ar: "تَمْنَعُ لَوْحَةُ المَفَاتِيحِ اللَّاسِلْكِيَّةُ المُرِيحَةُ إِجْهَادَ المِعْصَمِ خِلَالَ جَلَسَاتِ الكِتَابَةِ الطَّوِيلَةِ.",
      },
      {
        context: "Hotkeys",
        en: "Pressing the spacebar on the keyboard pauses the educational video playback.",
        ar: "يُؤَدِّي الضَّغْطُ عَلَى شَرِيطِ المَسَافَةِ فِي لَوْحَةِ المَفَاتِيحِ إِلَى إِيقَافِ تَشْغِيلِ الفِيدْيُو التَّعْلِيمِيِّ مُؤَقَّتًا.",
      },
    ],
    exampleSentence:
      "Students learned touch typing technique by keeping their fingers on the home row of the keyboard.",
    exampleArabic:
      "تَعَلَّمَ الطُّلَّابُ تِقْنِيَّةَ الطِّبَاعَةِ اللَّمْسِيَّةِ بِإِبْقَاءِ أَصَابِعِهِمْ عَلَى صَفِّ الِارْتِكَازِ فِي لَوْحَةِ المَفَاتِيحِ.",
  },
  mouse: {
    id: "mouse",
    arabic: "فَأْرَةُ حَاسُوب (مَاوْس)",
    partOfSpeech: "noun",
    phonetic: "maʊs",
    pronunciationTip: "Pronounce 'MOWSS' (/maʊs/).",
    collocations: [
      "optical mouse",
      "click the mouse",
      "mouse pad",
      "wireless mouse",
      "scroll wheel on mouse",
      "double-click the mouse",
    ],
    phrasalVerbs: [
      {
        phrase: "scroll down",
        meaning: "navigate pages using mouse wheel",
        arabic: "يُمَرِّرُ لِلأَسْفَلِ بِالفَأْرَة",
        example: "Use the optical mouse to scroll down and submit your online quiz.",
      },
    ],
    sentences: [
      {
        context: "Computer Navigation",
        en: "She moved the optical mouse smoothly over the neoprene pad to click the submit button.",
        ar: "حَرَّكَتْ فَأْرَةَ الحَاسُوبِ الضَّوْئِيَّةَ بِسَلَاسَةٍ عَلَى لَوْحَةِ الفَأْرَةِ لِلنَّقْرِ عَلَى زِرِّ الإِرْسَالِ.",
      },
      {
        context: "Wireless Device",
        en: "A wireless computer mouse connects via Bluetooth for tangle-free desk space.",
        ar: "تَتَّصِلُ فَأْرَةُ الحَاسُوبِ اللَّاسِلْكِيَّةُ عَبْرَ البْلُوتُوثِ لِتَوْفِيرِ مِسَاحَةِ مَكْتَبٍ خَالِيَةٍ مِنَ الأَسْلَاكِ.",
      },
      {
        context: "Double Click",
        en: "Double-click the textbook folder icon with the left mouse button to open it.",
        ar: "انْقُرْ نَقْرًا مُزْدَوَجًا عَلَى أَيْقُونَةِ مِلَفِّ الكِتَابِ المَدْرَسِيِّ بِزِرِّ الفَأْرَةِ الأَيْسَرِ لِفَتْحِهِ.",
      },
    ],
    exampleSentence:
      "She moved the optical mouse smoothly over the neoprene pad to click the submit button.",
    exampleArabic:
      "حَرَّكَتْ فَأْرَةَ الحَاسُوبِ الضَّوْئِيَّةَ بِسَلَاسَةٍ عَلَى لَوْحَةِ الفَأْرَةِ لِلنَّقْرِ عَلَى زِرِّ الإِرْسَالِ.",
  },
  printer: {
    id: "printer",
    arabic: "طَابِعَة",
    partOfSpeech: "noun",
    phonetic: "ˈprɪntər",
    pronunciationTip: "Pronounce 'PRIN-ter' (/ˈprɪn.tər/).",
    collocations: [
      "laser printer",
      "color printer",
      "printer paper tray",
      "inkjet printer",
      "print from a printer",
      "wireless network printer",
    ],
    phrasalVerbs: [
      {
        phrase: "print out",
        meaning: "produce hard copies from computer files",
        arabic: "يَطْبَعُ وَرَقِيًّا",
        example:
          "The teacher will print out twenty copies of the study guide on the laser printer.",
      },
    ],
    sentences: [
      {
        context: "Class Handouts",
        en: "The teacher printed out thirty copies of the assignment on the high-speed laser printer.",
        ar: "طَبَعَ المُعَلِّمُ ثَلَاثِينَ نُسْخَةً مِنَ الفَرْضِ عَلَى طَابِعَةِ اللَّيْزَرِ سَرِيعَةِ الأَدَاءِ.",
      },
      {
        context: "Color Printing",
        en: "Students printed their colorful science diagrams on the shared library printer.",
        ar: "طَبَعَ الطُّلَّابُ مُخَطَّطَاتِهِمُ العِلْمِيَّةَ المُلَوَّنَةَ عَلَى طَابِعَةِ المَكْتَبَةِ المُشْتَرَكَةِ.",
      },
      {
        context: "Maintenance",
        en: "A blinking yellow light on the front panel indicates the printer needs more paper.",
        ar: "يُشِيرُ ضَوْءٌ أَصْفَرُ وَامِضٌ عَلَى اللَّوْحَةِ الأَمَامِيَّةِ إِلَى أَنَّ الطَّابِعَةَ بِحَاجَةٍ إِلَى مَزِيدٍ مِنَ الوَرَقِ.",
      },
    ],
    exampleSentence:
      "The teacher printed out thirty copies of the assignment on the high-speed laser printer.",
    exampleArabic:
      "طَبَعَ المُعَلِّمُ ثَلَاثِينَ نُسْخَةً مِنَ الفَرْضِ عَلَى طَابِعَةِ اللَّيْزَرِ سَرِيعَةِ الأَدَاءِ.",
  },
  "usb-drive": {
    id: "usb-drive",
    arabic: "ذَاكِرَةُ فَلَاش (فَلَاشَةُ يُو إِسْ بِي)",
    partOfSpeech: "noun",
    phonetic: "ˌjuː.ɛsˈbiː draɪv",
    pronunciationTip: "Pronounce 'U-S-B dryv' (/ˌjuː.ɛsˈbiː draɪv/).",
    collocations: [
      "flash drive",
      "insert a USB drive",
      "save to a USB drive",
      "thumb drive",
      "plug in a USB drive",
      "backup USB drive",
    ],
    phrasalVerbs: [
      {
        phrase: "back up",
        meaning: "save secondary copy of files onto external storage",
        arabic: "يَحْفَظُ نُسْخَةً احْتِيَاطِيَّة",
        example: "Always back up your presentation slides onto a portable USB drive.",
      },
    ],
    sentences: [
      {
        context: "Saving Projects",
        en: "He saved his digital presentation slides onto a portable USB drive to present in class.",
        ar: "حَفِظَ شَرَائِحَ عَرْضِهِ الرَّقْمِيِّ عَلَى ذَاكِرَةِ فَلَاشٍ مَحْمُولَةٍ لِعَرْضِهَا فِي الفَصْلِ.",
      },
      {
        context: "File Transfer",
        en: "Plug the compact flash drive into the side port of the classroom laptop.",
        ar: "صِلْ ذَاكِرَةَ الفَلَاشِ المُدْمَجَةَ فِي المَنْفَذِ الجَانِبِيِّ لِحَاسُوبِ الفَصْلِ المَحْمُولِ.",
      },
      {
        context: "Safe Ejection",
        en: "Eject the USB drive safely from the operating system before pulling it out.",
        ar: "أَفْصِلْ ذَاكِرَةَ الفَلَاشِ بِأَمَانٍ مِنْ نِظَامِ التَّشْغِيلِ قَبْلَ سَحْبِهَا.",
      },
    ],
    exampleSentence:
      "He saved his digital presentation slides onto a portable USB drive to present in class.",
    exampleArabic:
      "حَفِظَ شَرَائِحَ عَرْضِهِ الرَّقْمِيِّ عَلَى ذَاكِرَةِ فَلَاشٍ مَحْمُولَةٍ لِعَرْضِهَا فِي الفَصْلِ.",
  },
  "projector-remote": {
    id: "projector-remote",
    arabic: "جِهَازُ التَّحَكُّمِ عَنْ بُعْدٍ لِجِهَازِ العَرْض (رِيمُوتُ البْرُوجِكْتُور)",
    partOfSpeech: "noun",
    phonetic: "prəˈdʒɛktər rɪˈmoʊt",
    pronunciationTip: "Pronounce 'pruh-JEK-ter rih-MOHT' (/prəˈdʒɛk.tər rɪˈmoʊt/).",
    collocations: [
      "wireless projector remote",
      "press power on remote",
      "laser pointer on remote",
      "adjust volume with remote",
    ],
    phrasalVerbs: [
      {
        phrase: "switch on",
        meaning: "activate projector using remote control",
        arabic: "يُشَغِّلُ بِجِهَازِ التَّحَكُّم",
        example: "Use the wireless remote to switch on the overhead projector.",
      },
    ],
    sentences: [
      {
        context: "Presentation Control",
        en: "The teacher clicked the projector remote to advance to the next educational slide.",
        ar: "نَقَرَ المُعَلِّمُ عَلَى جِهَازِ التَّحَكُّمِ عَنْ بُعْدٍ لِجِهَازِ العَرْضِ لِلِانْتِقَالِ إِلَى الشَّرِيحَةِ التَّعْلِيمِيَّةِ التَّالِيَةِ.",
      },
      {
        context: "Built-in Laser",
        en: "A red laser pointer built into the handheld remote highlights diagrams on the screen.",
        ar: "يُبْرِزُ مُؤَشِّرُ اللَّيْزَرِ الأَحْمَرُ المُدْمَجُ فِي جِهَازِ التَّحَكُّمِ اليَدَوِيِّ الرُّسُومَ عَلَى الشَّاشَةِ.",
      },
      {
        context: "Desk Storage",
        en: "Keep the projector remote resting on the podium so it is always within reach.",
        ar: "ضَعْ رِيمُوتَ البْرُوجِكْتُورِ عَلَى المِنْبَرِ لِيَكُونَ دَائِمًا فِي مُتَنَاوَلِ اليَدِ.",
      },
    ],
    exampleSentence:
      "The teacher clicked the projector remote to advance to the next educational slide.",
    exampleArabic:
      "نَقَرَ المُعَلِّمُ عَلَى جِهَازِ التَّحَكُّمِ عَنْ بُعْدٍ لِجِهَازِ العَرْضِ لِلِانْتِقَالِ إِلَى الشَّرِيحَةِ التَّعْلِيمِيَّةِ التَّالِيَةِ.",
  },
  student: {
    id: "student",
    arabic: "طَالِب (تِلْمِيذ)",
    partOfSpeech: "noun",
    phonetic: "ˈstuːdənt",
    pronunciationTip: "Pronounce 'STOO-dent' (/ˈstuː.dənt/).",
    collocations: [
      "elementary student",
      "attentive student",
      "student body",
      "raise hand as a student",
      "hardworking student",
      "student desk",
    ],
    phrasalVerbs: [
      {
        phrase: "listen to",
        meaning: "pay attention to instruction",
        arabic: "يُنْصِتُ لِلْمُعَلِّم",
        example: "Every student listened attentively to the teacher's historical story.",
      },
    ],
    sentences: [
      {
        context: "Classroom Learning",
        en: "The enthusiastic student raised her hand to answer the teacher's question.",
        ar: "رَفَعَتِ الطَّالِبَةُ المُتَحَمِّسَةُ يَدَهَا لِلْإِجَابَةِ عَنْ سُؤَالِ المُعَلِّمِ.",
      },
      {
        context: "Group Work",
        en: "Students collaborated in pairs to complete their science experiment.",
        ar: "تَعَاوَنَ الطُّلَّابُ فِي أَزْوَاجٍ لِإِكْمَالِ تَجْرِبَتِهِمُ العِلْمِيَّةِ.",
      },
      {
        context: "Study Habits",
        en: "A dedicated student reviews lesson vocabulary every evening.",
        ar: "يُرَاجِعُ الطَّالِبُ المُجْتَهِدُ مُفْرَدَاتِ الدُّرُوسِ كُلَّ مَسَاءٍ.",
      },
    ],
    exampleSentence: "The enthusiastic student raised her hand to answer the teacher's question.",
    exampleArabic:
      "رَفَعَتِ الطَّالِبَةُ المُتَحَمِّسَةُ يَدَهَا لِلْإِجَابَةِ عَنْ سُؤَالِ المُعَلِّمِ.",
  },
  principal: {
    id: "principal",
    arabic: "مُدِيرُ المَدْرَسَة",
    partOfSpeech: "noun",
    phonetic: "ˈprɪnsəpəl",
    pronunciationTip: "Pronounce 'PRIN-suh-pul' (/ˈprɪn.sə.pəl/).",
    collocations: [
      "school principal",
      "principal's office",
      "meet with the principal",
      "vice principal",
      "morning address by principal",
    ],
    phrasalVerbs: [
      {
        phrase: "look after",
        meaning: "oversee welfare and discipline of school community",
        arabic: "يَرْعَى وَيُشْرِفُ عَلَى المَدْرَسَة",
        example: "The principal looks after the safety and academic progress of every student.",
      },
    ],
    sentences: [
      {
        context: "Morning Assembly",
        en: "The principal welcomed all new students warmly during the opening morning assembly.",
        ar: "رَحَّبَ مُدِيرُ المَدْرَسَةِ بِجَمِيعِ الطُّلَّابِ الجُدُدِ بِحَرَارَةٍ خِلَالَ طَابُورِ الصَّبَاحِ الاِفْتِتَاحِيِّ.",
      },
      {
        context: "Leadership",
        en: "She met with teachers to plan innovative STEM programs for the upcoming academic year.",
        ar: "اجْتَمَعَتْ مَعَ المُعَلِّمِينَ لِتَخْطِيطِ بَرَامِجَ تَعْلِيمِيَّةٍ مُبْتَكَرَةٍ لِلْعَامِ الدِّرَاسِيِّ القَادِمِ.",
      },
      {
        context: "School Tour",
        en: "The principal guided visiting parents through the newly renovated science wing.",
        ar: "أَرْشَدَ مُدِيرُ المَدْرَسَةِ أَوْلِيَاءَ الأُمُورِ الزَّائِرِينَ عَبْرَ جَنَاحِ العُلُومِ المُجَدَّدِ حَدِيثًا.",
      },
    ],
    exampleSentence:
      "The principal welcomed all new students warmly during the opening morning assembly.",
    exampleArabic:
      "رَحَّبَ مُدِيرُ المَدْرَسَةِ بِجَمِيعِ الطُّلَّابِ الجُدُدِ بِحَرَارَةٍ خِلَالَ طَابُورِ الصَّبَاحِ الاِفْتِتَاحِيِّ.",
  },
  librarian: {
    id: "librarian",
    arabic: "أَمِينُ المَكْتَبَة",
    partOfSpeech: "noun",
    phonetic: "laɪˈbrɛriən",
    pronunciationTip: "Pronounce 'ly-BRAIR-ee-un' (/laɪˈbrɛr.i.ən/).",
    collocations: [
      "school librarian",
      "ask the librarian",
      "librarian's desk",
      "head librarian",
      "check out with librarian",
    ],
    phrasalVerbs: [
      {
        phrase: "check out",
        meaning: "process book borrowing records",
        arabic: "يُعِيرُ كِتَابًا",
        example: "The librarian helped her check out two mystery novels for the weekend.",
      },
    ],
    sentences: [
      {
        context: "Library Guidance",
        en: "The librarian helped students locate historical encyclopedias for their research projects.",
        ar: "سَاعَدَ أَمِينُ المَكْتَبَةِ الطُّلَّابَ فِي العُثُورِ عَلَى المَوْسُوعَاتِ التَّارِيخِيَّةِ لِمَشَارِيعِ أَبْحَاثِهِمْ.",
      },
      {
        context: "Storytime",
        en: "Every Friday, the children gather on the reading rug while the librarian reads aloud.",
        ar: "كُلَّ جُمُعَةٍ، يَتَجَمَّعُ الأَطْفَالُ عَلَى بِسَاطِ القِرَاءَةِ بَيْنَمَا يَقْرَأُ أَمِينُ المَكْتَبَةِ بِصَوْتٍ عَالٍ.",
      },
      {
        context: "Book Catalog",
        en: "She scans barcodes and keeps library shelves organized according to the Dewey system.",
        ar: "تَمْسَحُ البَارْكُودَ ضَوْئِيًّا وَتُحَافِظُ عَلَى تَرْتِيبِ رُفُوفِ المَكْتَبَةِ وَفْقًا لِنِظَامِ دِيُوِي.",
      },
    ],
    exampleSentence:
      "The librarian helped students locate historical encyclopedias for their research projects.",
    exampleArabic:
      "سَاعَدَ أَمِينُ المَكْتَبَةِ الطُّلَّابَ فِي العُثُورِ عَلَى المَوْسُوعَاتِ التَّارِيخِيَّةِ لِمَشَارِيعِ أَبْحَاثِهِمْ.",
  },
  janitor: {
    id: "janitor",
    arabic: "عَامِلُ نَظَافَةٍ مَدْرَسِيّ (حَارِسُ مَبْنَى)",
    partOfSpeech: "noun",
    phonetic: "ˈdʒænɪtər",
    pronunciationTip: "Pronounce 'JAN-ih-ter' (/ˈdʒæn.ɪ.tər/).",
    collocations: [
      "school janitor",
      "janitor closet",
      "janitor mop and bucket",
      "friendly janitor",
      "janitor cleaning cart",
    ],
    phrasalVerbs: [
      {
        phrase: "clean up",
        meaning: "sanitize and tidy school halls",
        arabic: "يُنَظِّفُ وَيُرَتِّب",
        example: "The janitor cleaned up the spilled milk in the cafeteria quickly.",
      },
    ],
    sentences: [
      {
        context: "Hallway Cleaning",
        en: "The friendly janitor mopped the polished hallway floor until it was spotless and dry.",
        ar: "مَسَحَ عَامِلُ النَّظَافَةِ الوَدُودُ أَرْضِيَّةَ الرِّدْهَةِ المَصْقُولَةَ حَتَّى أَصْبَحَتْ نَظِيفَةً وَجَافَّةً تَمَامًا.",
      },
      {
        context: "School Maintenance",
        en: "He carries a ring of keys to unlock supply rooms and service facility closets.",
        ar: "يَحْمِلُ حَلْقَةَ مَفَاتِيحَ لِفَتْحِ غُرَفِ التَّخْزِينِ وَخَزَائِنِ الخَدَمَاتِ.",
      },
      {
        context: "Recycling",
        en: "Every afternoon, the janitor empties paper recycling bins from each classroom.",
        ar: "كُلَّ بَعْدَ ظُهْرٍ، يُفْرِغُ عَامِلُ النَّظَافَةِ حَاوِيَاتِ إِعَادَةِ تَدْوِيرِ الوَرَقِ مِنْ كُلِّ فَصْلٍ.",
      },
    ],
    exampleSentence:
      "The friendly janitor mopped the polished hallway floor until it was spotless and dry.",
    exampleArabic:
      "مَسَحَ عَامِلُ النَّظَافَةِ الوَدُودُ أَرْضِيَّةَ الرِّدْهَةِ المَصْقُولَةَ حَتَّى أَصْبَحَتْ نَظِيفَةً وَجَافَّةً تَمَامًا.",
  },
  "school-nurse": {
    id: "school-nurse",
    arabic: "مُمَرِّضَةُ المَدْرَسَة",
    partOfSpeech: "noun",
    phonetic: "skuːl nɜːrs",
    pronunciationTip: "Pronounce 'SKOOL nurs' (/skuːl nɜːrs/).",
    collocations: [
      "visit the school nurse",
      "school nurse office",
      "first aid by nurse",
      "caring school nurse",
      "temperature check by nurse",
    ],
    phrasalVerbs: [
      {
        phrase: "tend to",
        meaning: "provide medical care to injured student",
        arabic: "يَعْتَنِي بِـ / يُدَاوِي",
        example: "The school nurse tended to the scraped knee with antiseptic and a bandage.",
      },
    ],
    sentences: [
      {
        context: "First Aid Clinic",
        en: "The caring school nurse placed an adhesive bandage on the student's scraped elbow.",
        ar: "وَضَعَتْ مُمَرِّضَةُ المَدْرَسَةِ الحَنُونَةُ ضِمَادَةً لَاصِقَةً عَلَى مِرْفَقِ الطَّالِبِ المَخْدُوشِ.",
      },
      {
        context: "Health Check",
        en: "She checked the child's temperature with a digital thermometer in the quiet clinic.",
        ar: "قَاسَتْ دَرَجَةَ حَرَارَةِ الطِّفْلِ بِمِقْيَاسِ حَرَارَةٍ رَقْمِيٍّ فِي العِيَادَةِ الهَادِئَةِ.",
      },
      {
        context: "Medical Records",
        en: "The nurse maintains immunization records and allergy emergency kits for all classes.",
        ar: "تَحْفَظُ المُمَرِّضَةُ سِجِلَّاتِ التَّطْعِيمِ وَحَقَائِبَ طَوَارِئِ الحَسَاسِيَّةِ لِجَمِيعِ الفُصُولِ.",
      },
    ],
    exampleSentence:
      "The caring school nurse placed an adhesive bandage on the student's scraped elbow.",
    exampleArabic:
      "وَضَعَتْ مُمَرِّضَةُ المَدْرَسَةِ الحَنُونَةُ ضِمَادَةً لَاصِقَةً عَلَى مِرْفَقِ الطَّالِبِ المَخْدُوشِ.",
  },
  "substitute-teacher": {
    id: "substitute-teacher",
    arabic: "مُعَلِّمٌ بَدِيل (مُدَرِّسٌ مُنْتَدَب)",
    partOfSpeech: "noun",
    phonetic: "ˈsʌbstɪtuːt ˈtiːtʃər",
    pronunciationTip: "Pronounce 'SUB-stih-toot TEE-cher' (/ˈsʌb.stɪ.tuːt ˈtiː.tʃər/).",
    collocations: [
      "substitute teacher lesson plan",
      "welcome the substitute",
      "substitute in math class",
      "temporary substitute teacher",
    ],
    phrasalVerbs: [
      {
        phrase: "fill in for",
        meaning: "replace an absent instructor temporarily",
        arabic: "يَنُوبُ عَنْ مُعَلِّمٍ غَائِب",
        example: "Mr. Davis will fill in for our regular biology teacher today.",
      },
    ],
    sentences: [
      {
        context: "Temporary Teaching",
        en: "The substitute teacher introduced himself and followed the detailed lesson plan left on the desk.",
        ar: "قَدَّمَ المُعَلِّمُ البَدِيلُ نَفْسَهُ وَاتَّبَعَ خُطَّةَ الدَّرْسِ المُفَصَّلَةَ المَتْرُوكَةَ عَلَى المَكْتَبِ.",
      },
      {
        context: "Classroom Cooperation",
        en: "Students showed great respect and completed all worksheets for the substitute.",
        ar: "أَظْهَرَ الطُّلَّابُ احْتِرَامًا كَبِيرًا وَأَكْمَلُوا جَمِيعَ أَوْرَاقِ العَمَلِ لِلْمُعَلِّمِ البَدِيلِ.",
      },
      {
        context: "Morning Routine",
        en: "He took morning attendance by calling each student's name from the printed roster.",
        ar: "أَخَذَ غِيَابَ الصَّبَاحِ بِمُنَادَاةِ اسْمِ كُلِّ طَالِبٍ مِنَ القَائِمَةِ المَطْبُوعَةِ.",
      },
    ],
    exampleSentence:
      "The substitute teacher introduced himself and followed the detailed lesson plan left on the desk.",
    exampleArabic:
      "قَدَّمَ المُعَلِّمُ البَدِيلُ نَفْسَهُ وَاتَّبَعَ خُطَّةَ الدَّرْسِ المُفَصَّلَةَ المَتْرُوكَةَ عَلَى المَكْتَبِ.",
  },
  "teaching-assistant": {
    id: "teaching-assistant",
    arabic: "مُسَاعِدُ مُعَلِّم",
    partOfSpeech: "noun",
    phonetic: "ˈtiːtʃɪŋ əˈsɪstənt",
    pronunciationTip: "Pronounce 'TEE-ching uh-SIS-tunt' (/ˈtiː.tʃɪŋ əˈsɪs.tənt/).",
    collocations: [
      "classroom teaching assistant",
      "ask the teaching assistant",
      "support from assistant",
      "teaching assistant guidance",
    ],
    phrasalVerbs: [
      {
        phrase: "help out with",
        meaning: "provide instructional aid to individuals",
        arabic: "يُسَاعِدُ فِي التَّعْلِيم",
        example: "The teaching assistant helps out with reading groups during literacy hour.",
      },
    ],
    sentences: [
      {
        context: "Individual Support",
        en: "The teaching assistant knelt beside the student's desk to explain the math fraction problem.",
        ar: "جَثَا مُسَاعِدُ المُعَلِّمِ بِجَانِبِ مَكْتَبِ الطَّالِبِ لِشَرْحِ مَسْأَلَةِ الكُسُورِ فِي الرِّيَاضِيَّاتِ.",
      },
      {
        context: "Group Activities",
        en: "She prepared art supplies and guided small reading circles during morning centers.",
        ar: "أَعَدَّتْ أَدَوَاتِ الفَنِّ وَأَرْشَدَتْ مَجْمُوعَاتِ القِرَاءَةِ الصَّغِيرَةِ خِلَالَ أَنْشِطَةِ الصَّبَاحِ.",
      },
      {
        context: "Classroom Teamwork",
        en: "The teacher and teaching assistant work closely together to ensure every child thrives.",
        ar: "يَعْمَلُ المُعَلِّمُ وَمُسَاعِدُهُ بِتَعَاوُنٍ وَثِيقٍ لِضَمَانِ تَفَوُّقِ كُلِّ طِفْلٍ.",
      },
    ],
    exampleSentence:
      "The teaching assistant knelt beside the student's desk to explain the math fraction problem.",
    exampleArabic:
      "جَثَا مُسَاعِدُ المُعَلِّمِ بِجَانِبِ مَكْتَبِ الطَّالِبِ لِشَرْحِ مَسْأَلَةِ الكُسُورِ فِي الرِّيَاضِيَّاتِ.",
  },
  counselor: {
    id: "counselor",
    arabic: "مُرْشِدٌ طُلَّابِيّ (مُرْشِدٌ نَفْسِيّ)",
    partOfSpeech: "noun",
    phonetic: "ˈkaʊnsələr",
    pronunciationTip: "Pronounce 'KOWN-suh-ler' (/ˈkaʊn.sə.lər/).",
    collocations: [
      "school counselor",
      "guidance counselor",
      "meet with the counselor",
      "counselor's office",
      "college counselor",
    ],
    phrasalVerbs: [
      {
        phrase: "talk through",
        meaning: "discuss feelings and academic goals",
        arabic: "يُنَاقِشُ وَيَسْتَمِعُ لِلْمَشَاعِر",
        example: "The counselor helped him talk through his anxieties about the upcoming exam.",
      },
    ],
    sentences: [
      {
        context: "Guidance Session",
        en: "She met with the guidance counselor to choose elective courses for the next semester.",
        ar: "اجْتَمَعَتْ مَعَ المُرْشِدِ الطُّلَّابِيِّ لِاخْتِيَارِ المَوَادِّ الاِخْتِيَارِيَّةِ لِلْفَصْلِ الدِّرَاسِيِّ القَادِمِ.",
      },
      {
        context: "Emotional Support",
        en: "The counselor's office offers a calming, welcoming environment for students seeking advice.",
        ar: "يُوَفِّرُ مَكْتَبُ المُرْشِدِ بِيئَةً مُهَدِّئَةً وَمُرَحِّبَةً لِلطُّلَّابِ البَاحِثِينَ عَنِ النَّصِيحَةِ.",
      },
      {
        context: "Career Guidance",
        en: "High school counselors provide valuable advice about college applications and career paths.",
        ar: "يُقَدِّمُ مُرْشِدُو المَدَارِسِ الثَّانَوِيَّةِ نَصَائِحَ قَيِّمَةً حَوْلَ التَّقْدِيمِ لِلْجَامِعَاتِ وَالمَسَارَاتِ المِهْنِيَّةِ.",
      },
    ],
    exampleSentence:
      "She met with the guidance counselor to choose elective courses for the next semester.",
    exampleArabic:
      "اجْتَمَعَتْ مَعَ المُرْشِدِ الطُّلَّابِيِّ لِاخْتِيَارِ المَوَادِّ الاِخْتِيَارِيَّةِ لِلْفَصْلِ الدِّرَاسِيِّ القَادِمِ.",
  },
  "security-guard": {
    id: "security-guard",
    arabic: "حَارِسُ أَمْنٍ مَدْرَسِيّ",
    partOfSpeech: "noun",
    phonetic: "sɪˈkjʊrəti ɡɑːrd",
    pronunciationTip: "Pronounce 'sih-KYUR-ih-tee gard' (/sɪˈkjʊr.ə.ti ɡɑːrd/).",
    collocations: [
      "school security guard",
      "guard station at entrance",
      "patrol the campus",
      "sign in with the guard",
    ],
    phrasalVerbs: [
      {
        phrase: "watch over",
        meaning: "protect students and ensure campus safety",
        arabic: "يَحْرُسُ وَيَرْعَى الأَمْن",
        example: "Security guards watch over the entrance during morning drop-off.",
      },
    ],
    sentences: [
      {
        context: "Campus Safety",
        en: "The security guard greeted students warmly at the front gate as they entered the school.",
        ar: "حَيَّا حَارِسُ الأَمْنِ الطُّلَّابَ بِحَرَارَةٍ عِنْدَ البَوَّابَةِ الأَمَامِيَّةِ أَثْنَاءَ دُخُولِهِمْ إِلَى المَدْرَسَةِ.",
      },
      {
        context: "Visitor Management",
        en: "All campus visitors must sign in at the guard station and receive a guest badge.",
        ar: "يَجِبُ عَلَى جَمِيعِ زُوَّارِ الحَرَمِ المَدْرَسِيِّ التَّسْجِيلُ عِنْدَ نُقْطَةِ الحِرَاسَةِ وَاسْتِلَامُ شَارَةِ الزَّائِرِ.",
      },
      {
        context: "Patrolling",
        en: "Guards regularly patrol school grounds to ensure a secure learning environment.",
        ar: "يَقُومُ حُرَّاسُ الأَمْنِ بِدَوْرِيَّاتٍ مُنْتَظَمَةٍ فِي أَرْجَاءِ المَدْرَسَةِ لِضَمَانِ بِيئَةٍ تَعْلِيمِيَّةٍ آمِنَةٍ.",
      },
    ],
    exampleSentence:
      "The security guard greeted students warmly at the front gate as they entered the school.",
    exampleArabic:
      "حَيَّا حَارِسُ الأَمْنِ الطُّلَّابَ بِحَرَارَةٍ عِنْدَ البَوَّابَةِ الأَمَامِيَّةِ أَثْنَاءَ دُخُولِهِمْ إِلَى المَدْرَسَةِ.",
  },
  homework: {
    id: "homework",
    arabic: "وَاجِبٌ مَنْزِلِيّ (فَرْضٌ مَدْرَسِيّ)",
    partOfSpeech: "noun",
    phonetic: "ˈhoʊmwɜːrk",
    pronunciationTip: "Pronounce 'HOHM-wurk' (/ˈhoʊm.wɜːrk/). Uncountable noun.",
    collocations: [
      "do homework",
      "finish homework",
      "assign homework",
      "homework assignment",
      "math homework",
      "hand in homework",
    ],
    phrasalVerbs: [
      {
        phrase: "hand in",
        meaning: "submit completed school assignments",
        arabic: "يُسَلِّمُ الوَاجِب",
        example: "Make sure to hand in your completed history homework before the bell.",
      },
    ],
    sentences: [
      {
        context: "Evening Study",
        en: "He spent an hour at his desk completing his math and reading homework.",
        ar: "أَمْضَى سَاعَةً عَلَى مَكْتَبِهِ فِي إِكْمَالِ وَاجِبِ الرِّيَاضِيَّاتِ وَالقِرَاءَةِ المَنْزِلِيِّ.",
      },
      {
        context: "Teacher Assignment",
        en: "The teacher wrote tomorrow's science homework on the right side of the whiteboard.",
        ar: "كَتَبَ المُعَلِّمُ وَاجِبَ العُلُومِ لِلْغَدِ عَلَى الجَانِبِ الأَيْمَنِ مِنَ اللَّوْحِ الأَبْيَضِ.",
      },
      {
        context: "Study Habit",
        en: "Completing homework consistently reinforces the concepts learned in class.",
        ar: "يُعَزِّزُ إِكْمَالُ الوَاجِبَاتِ المَنْزِلِيَّةِ بِاسْتِمْرَارٍ المَفَاهِيمَ الَّتِي تَمَّ تَعَلُّمُهَا فِي الفَصْلِ.",
      },
    ],
    exampleSentence: "He spent an hour at his desk completing his math and reading homework.",
    exampleArabic:
      "أَمْضَى سَاعَةً عَلَى مَكْتَبِهِ فِي إِكْمَالِ وَاجِبِ الرِّيَاضِيَّاتِ وَالقِرَاءَةِ المَنْزِلِيِّ.",
  },
  test: {
    id: "test",
    arabic: "اخْتِبَار (امْتِحَان)",
    partOfSpeech: "noun",
    phonetic: "tɛst",
    pronunciationTip: "Short 'e' sound /ɛ/: 'TEST' (/tɛst/).",
    collocations: [
      "take a test",
      "pass a test",
      "math test",
      "study for a test",
      "standardized test",
      "pop test",
    ],
    phrasalVerbs: [
      {
        phrase: "pass with",
        meaning: "achieve a successful score",
        arabic: "يَنْجَحُ فِي الاِخْتِبَارِ بِـ",
        example: "She studied diligently and passed the midterm science test with an A.",
      },
    ],
    sentences: [
      {
        context: "Exam Room",
        en: "The classroom was completely silent while students worked on their science test.",
        ar: "كَانَ الفَصْلُ هَادِئًا تَمَامًا بَيْنَمَا كَانَ الطُّلَّابُ يَعْمَلُونَ عَلَى اخْتِبَارِ العُلُومِ.",
      },
      {
        context: "Preparation",
        en: "He reviewed his vocabulary flashcards every night to prepare for the spelling test.",
        ar: "رَاجَعَ بِطَاقَاتِ مُفْرَدَاتِهِ كُلَّ لَيْلَةٍ لِلِاسْتِعْدَادِ لِاخْتِبَارِ الإِمْلَاءِ.",
      },
      {
        context: "Grading",
        en: "The teacher handed back the graded tests with constructive feedback on each page.",
        ar: "أَعَادَ المُعَلِّمُ الاِخْتِبَارَاتِ المُصَحَّحَةَ مَعَ مُلَاحَظَاتٍ بَنَّاءَةٍ عَلَى كُلِّ صَفْحَةٍ.",
      },
    ],
    exampleSentence:
      "The classroom was completely silent while students worked on their science test.",
    exampleArabic:
      "كَانَ الفَصْلُ هَادِئًا تَمَامًا بَيْنَمَا كَانَ الطُّلَّابُ يَعْمَلُونَ عَلَى اخْتِبَارِ العُلُومِ.",
  },
  recess: {
    id: "recess",
    arabic: "فُسْحَة (اسْتِرَاحَةٌ مَدْرَسِيَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈriːsɛs",
    pronunciationTip: "Pronounce 'REE-ses' (/ˈriː.sɛs/).",
    collocations: [
      "afternoon recess",
      "play at recess",
      "recess bell",
      "outdoor recess",
      "recess games",
      "indoor recess",
    ],
    phrasalVerbs: [
      {
        phrase: "run out",
        meaning: "rush outside to the playground",
        arabic: "يَرْكُضُ لِلْخَارِجِ فِي الفُسْحَة",
        example: "The children ran out to the swings as soon as recess began.",
      },
    ],
    sentences: [
      {
        context: "School Break",
        en: "When the bell rang for recess, excited students rushed outside to play tag and swing.",
        ar: "عِنْدَمَا دَقَّ الجَرَسُ مُعْلِنًا الفُسْحَةَ، انْدَفَعَ الطُّلَّابُ المُتَحَمِّسُونَ إِلَى الخَارِجِ لِلَّعِبِ وَالتَّأَرْجُحِ.",
      },
      {
        context: "Physical Activity",
        en: "Outdoor recess provides valuable physical exercise and social play between academic lessons.",
        ar: "تُوَفِّرُ الفُسْحَةُ الخَارِجِيَّةُ تَمَارِينَ بَدَنِيَّةً قَيِّمَةً وَلَعِبًا اجْتِمَاعِيًّا بَيْنَ الدُّرُوسِ.",
      },
      {
        context: "Weather Contingency",
        en: "During rainy days, teachers organize board games inside the classroom for indoor recess.",
        ar: "خِلَالَ الأَيَّامِ المُمْطِرَةِ، يُنَظِّمُ المُعَلِّمُونَ أَلْعَابًا لَوْحِيَّةً دَاخِلَ الفَصْلِ لِلْفُسْحَةِ الدَّاخِلِيَّةِ.",
      },
    ],
    exampleSentence:
      "When the bell rang for recess, excited students rushed outside to play tag and swing.",
    exampleArabic:
      "عِنْدَمَا دَقَّ الجَرَسُ مُعْلِنًا الفُسْحَةَ، انْدَفَعَ الطُّلَّابُ المُتَحَمِّسُونَ إِلَى الخَارِجِ لِلَّعِبِ وَالتَّأَرْجُحِ.",
  },
  grade: {
    id: "grade",
    arabic: "دَرَجَة (عَلَامَةٌ تَقْيِيمِيَّة)",
    partOfSpeech: "noun",
    phonetic: "ɡreɪd",
    pronunciationTip: "Long 'a' sound /eɪ/: 'GRAYD' (/ɡreɪd/).",
    collocations: [
      "good grade",
      "letter grade",
      "improve a grade",
      "grade report",
      "top grade",
      "grade average",
    ],
    phrasalVerbs: [
      {
        phrase: "bring up",
        meaning: "improve an academic score",
        arabic: "يَرْفَعُ دَرَجَتَهُ الدِّرَاسِيَّة",
        example: "Extra tutoring helped her bring up her grade in algebra.",
      },
    ],
    sentences: [
      {
        context: "Academic Achievement",
        en: "She was thrilled to see an 'A' grade marked in red ink at the top of her essay.",
        ar: "كَانَتْ فِي غَايَةِ السَّعَادَةِ عِنْدَمَا رَأَتْ دَرَجَةَ 'A' مَكْتُوبَةً بِالحِبْرِ الأَحْمَرِ فِي أَعْلَى مَقَالِهَا.",
      },
      {
        context: "Report Card",
        en: "His quarterly report card showed excellent grades in science and geography.",
        ar: "أَظْهَرَتْ شَهَادَةُ تَقْيِيمِهِ الفَصْلِيَّةُ دَرَجَاتٍ مُمْتَازَةً فِي العُلُومِ وَالجُغْرَافْيَا.",
      },
      {
        context: "Evaluation",
        en: "Teachers grade assignments based on clarity, accuracy, and depth of analysis.",
        ar: "يُقَيِّمُ المُعَلِّمُونَ الفُرُوضَ بِنَاءً عَلَى الوُضُوحِ وَالدِّقَّةِ وَعُمْقِ التَّحْلِيلِ.",
      },
    ],
    exampleSentence:
      "She was thrilled to see an 'A' grade marked in red ink at the top of her essay.",
    exampleArabic:
      "كَانَتْ فِي غَايَةِ السَّعَادَةِ عِنْدَمَا رَأَتْ دَرَجَةَ 'A' مَكْتُوبَةً بِالحِبْرِ الأَحْمَرِ فِي أَعْلَى مَقَالِهَا.",
  },
  uniform: {
    id: "uniform",
    arabic: "زِيٌّ مَدْرَسِيّ (زِيٌّ مُوَحَّد)",
    partOfSpeech: "noun",
    phonetic: "ˈjuːnɪfɔːrm",
    pronunciationTip: "Pronounce 'YOO-nih-form' (/ˈjuː.nɪ.fɔːrm/).",
    collocations: [
      "school uniform",
      "wear a uniform",
      "neat uniform",
      "pressed uniform",
      "uniform polo shirt",
      "uniform skirt or trousers",
    ],
    phrasalVerbs: [
      {
        phrase: "put on",
        meaning: "dress in standardized clothing",
        arabic: "يَرْتَدِي الزِّيَّ المَدْرَسِيّ",
        example: "He put on his navy school uniform and tied his shoes before breakfast.",
      },
    ],
    sentences: [
      {
        context: "School Dress Code",
        en: "Students wore their navy blue school uniform consisting of a collared shirt and tailored trousers.",
        ar: "ارْتَدَى الطُّلَّابُ زِيَّهُمُ المَدْرَسِيَّ الكُحْلِيَّ المُكَوَّنَ مِنْ قَمِيصٍ ذِي يَاقَةٍ وَبِنْطَالٍ مُفَصَّلٍ.",
      },
      {
        context: "Neat Appearance",
        en: "She pressed her uniform blazer neatly each Sunday evening for the week ahead.",
        ar: "كَمَتْ سُتْرَةَ زِيِّهَا المَدْرَسِيِّ بِتَرْتِيبٍ كُلَّ مَسَاءِ أَحَدٍ لِلأُسْبُوعِ القَادِمِ.",
      },
      {
        context: "School Identity",
        en: "The embroidered school crest on the chest of the uniform promotes community pride.",
        ar: "يُعَزِّزُ شِعَارُ المَدْرَسَةِ المُطَرَّزُ عَلَى صَدْرِ الزِّيِّ المُوَحَّدِ الِاعْتِزَازَ بِالمُجْتَمَعِ المَدْرَسِيِّ.",
      },
    ],
    exampleSentence:
      "Students wore their navy blue school uniform consisting of a collared shirt and tailored trousers.",
    exampleArabic:
      "ارْتَدَى الطُّلَّابُ زِيَّهُمُ المَدْرَسِيَّ الكُحْلِيَّ المُكَوَّنَ مِنْ قَمِيصٍ ذِي يَاقَةٍ وَبِنْطَالٍ مُفَصَّلٍ.",
  },
  blackboard: {
    id: "blackboard",
    arabic: "سَبُّورَةٌ سَوْدَاء (لَوْحُ طَبَاشِير)",
    partOfSpeech: "noun",
    phonetic: "ˈblækbɔːrd",
    pronunciationTip: "Pronounce 'BLAK-bord' (/ˈblæk.bɔːrd/).",
    collocations: [
      "write with chalk on blackboard",
      "erase the blackboard",
      "chalk dust on blackboard",
      "vintage blackboard",
      "wooden frame blackboard",
    ],
    phrasalVerbs: [
      {
        phrase: "wipe down",
        meaning: "clean chalk residue with damp cloth",
        arabic: "يَمْسَحُ السَّبُّورَة",
        example: "Wipe down the slate blackboard with a damp sponge to remove chalk dust.",
      },
    ],
    sentences: [
      {
        context: "Chalkboard Writing",
        en: "The teacher used a piece of white chalk to write arithmetic problems on the blackboard.",
        ar: "اسْتَخْدَمَ المُعَلِّمُ قِطْعَةً مِنْ طَبَاشِيرَ أَبْيَضَ لِكِتَابَةِ مَسَائِلِ الحِسَابِ عَلَى السَّبُّورَةِ.",
      },
      {
        context: "Classic Classroom",
        en: "The classic dark green blackboard spans across the front wall of the heritage classroom.",
        ar: "تَمْتَدُّ السَّبُّورَةُ الكَلَاسِيكِيَّةُ الخَضْرَاءُ الدَّاكِنَةُ عَلَى طُولِ الجِدَارِ الأَمَامِيِّ لِلْفَصْلِ التُّرَاثِيِّ.",
      },
      {
        context: "Chalk Eraser",
        en: "He patted the felt chalk erasers together outside to clear the accumulated dust.",
        ar: "نَفَضَ مَمَاحِيَ الطَّبَاشِيرِ القُمَاشِيَّةَ مَعًا فِي الخَارِجِ لِلتَّخَلُّصِ مِنَ الغُبَارِ المُتَرَاكِمِ.",
      },
    ],
    exampleSentence:
      "The teacher used a piece of white chalk to write arithmetic problems on the blackboard.",
    exampleArabic:
      "اسْتَخْدَمَ المُعَلِّمُ قِطْعَةً مِنْ طَبَاشِيرَ أَبْيَضَ لِكِتَابَةِ مَسَائِلِ الحِسَابِ عَلَى السَّبُّورَةِ.",
  },
};

/**
 * Retrieve verified dictionary entry with comprehensive fallbacks.
 */
export function getLexiconEntry(wordId: string, fallbackLabel?: string): LexiconEntry {
  const normalized = wordId.toLowerCase().trim();
  if (LEXICON_DICTIONARY[normalized]) {
    return LEXICON_DICTIONARY[normalized];
  }

  // Also check without hyphens or underscores
  const cleanKey = normalized.replace(/[-_]/g, "");
  const foundKey = Object.keys(LEXICON_DICTIONARY).find(
    (k) => k.replace(/[-_]/g, "").toLowerCase() === cleanKey
  );
  if (foundKey) {
    return LEXICON_DICTIONARY[foundKey];
  }

  const label = fallbackLabel || wordId.replace(/[-_]/g, " ");
  return {
    id: wordId,
    arabic: label,
    partOfSpeech: "noun",
    collocations: [`use the ${label}`, `clean the ${label}`, `look at the ${label}`],
    sentences: [
      {
        context: "Everyday Usage",
        en: `The ${label} is used in daily life.`,
        ar: `يُسْتَخْدَمُ هَذَا العُنْصُرُ فِي الحَيَاةِ اليَوْمِيَّةِ.`,
      },
    ],
    exampleSentence: `The ${label} is used in daily life.`,
    exampleArabic: `يُسْتَخْدَمُ هَذَا العُنْصُرُ فِي الحَيَاةِ اليَوْمِيَّةِ.`,
  };
}
