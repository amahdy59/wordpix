// scripts/assemble_lexicon.js
const fs = require("fs");
const path = require("path");

const bedroom = require("./lexicon_bedroom.js");
const kitchen = require("./lexicon_kitchen.js");
const living = require("./lexicon_living.js");
const farm = require("./lexicon_farm.js");

const combined = {
  ...bedroom,
  ...kitchen,
  ...living,
  ...farm,
};

// Aliases and category variants mapping
const aliases = {
  shelf: {
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
  },
  cabinet: {
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
  },
};

Object.keys(aliases).forEach((key) => {
  if (!combined[key]) {
    combined[key] = aliases[key];
  }
});

// Verify all unique words
const uniqueWords = JSON.parse(fs.readFileSync("src/app/data/unique_words.json", "utf8"));
const missing = uniqueWords.filter((w) => !combined[w.id]);

console.log("Total vocabulary items required:", uniqueWords.length);
console.log("Total entries assembled in combined dataset:", Object.keys(combined).length);
console.log("Missing items count:", missing.length);

if (missing.length > 0) {
  console.log(
    "Missing items:",
    missing.map((m) => m.id)
  );
}

// Generate the TypeScript file content
let ts = `// Centralized Lexicon Dictionary for WordPix
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
  collocations: string[];
  phrasalVerbs?: LexiconPhrasalVerb[];
  sentences: LexiconSentence[];
  exampleSentence: string;
  exampleArabic: string;
}

export const LEXICON_DICTIONARY: Record<string, LexiconEntry> = {
`;

Object.keys(combined)
  .sort()
  .forEach((key) => {
    const item = combined[key];
    const entry = {
      id: key,
      arabic: item.arabic,
      partOfSpeech: item.partOfSpeech || "noun",
      phonetic: item.phonetic || "",
      pronunciationTip: item.pronunciationTip || "",
      collocations: item.collocations || [],
      phrasalVerbs: item.phrasalVerbs || [],
      sentences: item.sentences || [],
      exampleSentence:
        item.sentences && item.sentences[0] ? item.sentences[0].en : item.exampleSentence || "",
      exampleArabic:
        item.sentences && item.sentences[0] ? item.sentences[0].ar : item.exampleArabic || "",
    };

    ts += `  "${key}": ${JSON.stringify(entry, null, 4)},\n`;
  });

ts += `};

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
    k => k.replace(/[-_]/g, "").toLowerCase() === cleanKey
  );
  if (foundKey) {
    return LEXICON_DICTIONARY[foundKey];
  }

  const label = fallbackLabel || wordId.replace(/[-_]/g, " ");
  return {
    id: wordId,
    arabic: label,
    partOfSpeech: "noun",
    collocations: [\`use the \${label}\`, \`clean the \${label}\`, \`look at the \${label}\`],
    sentences: [
      {
        context: "Everyday Usage",
        en: \`The \${label} is used in daily life.\`,
        ar: \`يُسْتَخْدَمُ هَذَا العُنْصُرُ فِي الحَيَاةِ اليَوْمِيَّةِ.\`
      }
    ],
    exampleSentence: \`The \${label} is used in daily life.\`,
    exampleArabic: \`يُسْتَخْدَمُ هَذَا العُنْصُرُ فِي الحَيَاةِ اليَوْمِيَّةِ.\`
  };
}
`;

fs.writeFileSync("src/app/data/lexiconDictionary.ts", ts, "utf8");
console.log("Successfully wrote src/app/data/lexiconDictionary.ts");
