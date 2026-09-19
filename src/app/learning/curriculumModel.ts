import type { CourseUnit } from "../data/lessons";
import type { UnitLearningMaterials } from "./types";
export { FOUNDATION_SEQUENCE } from "../data/curriculumSequence";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type CurriculumArchetype = "place" | "concept" | "process" | "specialist";
export type CurriculumStage =
  | "meaning"
  | "sound"
  | "recall"
  | "function"
  | "interaction"
  | "integrated"
  | "review"
  | "reference";
export type SkillStrand =
  "listening" | "reading" | "spoken-interaction" | "spoken-production" | "writing" | "mediation";

export interface UnitCurriculumDesign {
  cefr: CefrLevel;
  gseRange: readonly [number, number];
  archetype: CurriculumArchetype;
  outcome: string;
  canDo: string[];
  languageFunctions: string[];
  grammarFocus: string[];
  pronunciationFocus: string;
  prerequisites: string[];
  finalTask: string;
}

type AuthoredFoundationDesign = Pick<
  UnitCurriculumDesign,
  "outcome" | "canDo" | "languageFunctions" | "grammarFocus" | "pronunciationFocus" | "finalTask"
>;

export const FOUNDATION_UNIT_DESIGNS: Record<string, AuthoredFoundationDesign> = {
  "numbers-counting": {
    outcome: "Count, ask about quantity, and understand simple prices and totals.",
    canDo: [
      "I can count everyday objects.",
      "I can ask and answer how many or how much.",
      "I can understand a simple total.",
    ],
    languageFunctions: ["counting", "asking quantity", "giving totals"],
    grammarFocus: ["singular and plural nouns", "how many/how much", "there is/are"],
    pronunciationFocus: "teen/ty contrasts and final consonants",
    finalTask: "Count a mixed set of objects and complete a simple buying exchange.",
  },
  colors: {
    outcome: "Identify, describe, and compare familiar objects by colour.",
    canDo: [
      "I can name common colours.",
      "I can describe an object's colour.",
      "I can clarify which object I mean.",
    ],
    languageFunctions: ["describing", "identifying", "clarifying"],
    grammarFocus: ["adjective position", "this/that", "is/are"],
    pronunciationFocus: "clear initial consonants and colour-word stress",
    finalTask: "Describe and identify objects in a short visual information-gap task.",
  },
  "prepositions-of-place": {
    outcome: "Locate people and objects using basic spatial language.",
    canDo: [
      "I can understand where an object is.",
      "I can ask where something is.",
      "I can give a short location answer.",
    ],
    languageFunctions: ["locating", "asking where", "clarifying"],
    grammarFocus: ["where questions", "there is/are", "in/on/under/next to"],
    pronunciationFocus: "sentence stress in short location phrases",
    finalTask: "Place objects from spoken directions and explain their locations.",
  },
  "daily-action-verbs": {
    outcome: "Understand and describe common actions happening in daily life.",
    canDo: [
      "I can identify common actions.",
      "I can say what I do each day.",
      "I can ask what someone is doing.",
    ],
    languageFunctions: ["describing actions", "asking about activity", "reporting routine"],
    grammarFocus: ["present simple", "present continuous", "do questions"],
    pronunciationFocus: "final consonants and -ing endings",
    finalTask: "Describe a short sequence of everyday actions from pictures.",
  },
  "days-months": {
    outcome: "Understand and communicate simple calendar dates and plans.",
    canDo: [
      "I can name days and months.",
      "I can ask and answer about a date.",
      "I can state when a simple event happens.",
    ],
    languageFunctions: ["dating", "scheduling", "asking when"],
    grammarFocus: ["on/in with dates", "when questions", "ordinal numbers"],
    pronunciationFocus: "word stress in months and ordinal endings",
    finalTask: "Arrange three events on a calendar and explain when they happen.",
  },
  "telling-time": {
    outcome: "Ask for, understand, and state clock times for familiar activities.",
    canDo: [
      "I can tell the time.",
      "I can ask what time something starts.",
      "I can connect a routine to a time.",
    ],
    languageFunctions: ["asking time", "scheduling", "confirming"],
    grammarFocus: ["what time questions", "at with time", "present simple schedules"],
    pronunciationFocus: "number clarity and contrastive stress",
    finalTask: "Build and explain a simple daily timetable.",
  },
  "basic-emotions": {
    outcome: "Recognise and express basic feelings with a simple reason.",
    canDo: [
      "I can name common feelings.",
      "I can ask how someone feels.",
      "I can give a short reason for a feeling.",
    ],
    languageFunctions: ["expressing feelings", "asking wellbeing", "giving reasons"],
    grammarFocus: ["be + adjective", "how questions", "because"],
    pronunciationFocus: "emotion-word stress and expressive intonation",
    finalTask: "Respond supportively to three short everyday feeling scenarios.",
  },
  family: {
    outcome: "Identify family relationships and introduce familiar people.",
    canDo: [
      "I can name close family members.",
      "I can say how people are related.",
      "I can introduce someone with one detail.",
    ],
    languageFunctions: ["introducing", "describing relationships", "asking about family"],
    grammarFocus: ["possessive adjectives", "have/has", "who questions"],
    pronunciationFocus: "possessive endings and family-word stress",
    finalTask: "Introduce a simple family tree and answer two questions about it.",
  },
  bedroom: {
    outcome: "Describe a bedroom and locate common personal items.",
    canDo: [
      "I can identify bedroom objects.",
      "I can say where an item is.",
      "I can ask for help finding something.",
    ],
    languageFunctions: ["identifying", "locating", "requesting help"],
    grammarFocus: ["there is/are", "place prepositions", "where questions"],
    pronunciationFocus: "word stress and clear final sounds",
    finalTask: "Describe a bedroom scene and help someone find two missing items.",
  },
  bathroom: {
    outcome: "Identify bathroom items and describe a simple hygiene routine.",
    canDo: [
      "I can identify common bathroom items.",
      "I can request an item politely.",
      "I can sequence a short hygiene routine.",
    ],
    languageFunctions: ["requesting", "sequencing", "describing routine"],
    grammarFocus: ["present simple", "imperatives", "first/then"],
    pronunciationFocus: "consonant clusters and sequence-marker stress",
    finalTask: "Explain and follow a short morning hygiene routine.",
  },
  kitchen: {
    outcome: "Locate kitchen items and follow a simple food-preparation instruction.",
    canDo: [
      "I can identify basic kitchen objects.",
      "I can ask where an item is.",
      "I can follow short preparation steps.",
    ],
    languageFunctions: ["locating", "requesting", "following instructions"],
    grammarFocus: ["imperatives", "some/any", "place prepositions"],
    pronunciationFocus: "instruction rhythm and final consonants",
    finalTask: "Find the needed tools and follow a three-step snack instruction.",
  },
  "living-room": {
    outcome: "Describe a living room and make a simple shared-space request.",
    canDo: [
      "I can identify common furniture.",
      "I can describe where things are.",
      "I can make and answer a polite request.",
    ],
    languageFunctions: ["describing", "locating", "requesting"],
    grammarFocus: ["there is/are", "can requests", "place prepositions"],
    pronunciationFocus: "polite request intonation",
    finalTask: "Describe a room arrangement and agree on where to put one new item.",
  },
  classroom: {
    outcome: "Understand common classroom instructions and ask for learning help.",
    canDo: [
      "I can identify classroom objects.",
      "I can follow a short instruction.",
      "I can ask for repetition or clarification.",
    ],
    languageFunctions: ["following instructions", "requesting clarification", "identifying"],
    grammarFocus: ["imperatives", "can/could requests", "this/these"],
    pronunciationFocus: "classroom instruction rhythm and polite intonation",
    finalTask:
      "Complete a classroom task by following directions and asking one clarification question.",
  },
  fruits: {
    outcome: "Identify fruits and express simple preferences and quantities.",
    canDo: [
      "I can name common fruits.",
      "I can say what I like or dislike.",
      "I can ask for a simple quantity.",
    ],
    languageFunctions: ["identifying", "expressing preference", "requesting quantity"],
    grammarFocus: ["like + noun", "some/any", "plural nouns"],
    pronunciationFocus: "plural endings and food-word stress",
    finalTask: "Choose fruit for a snack and explain the choice and quantity.",
  },
  vegetables: {
    outcome: "Identify vegetables and discuss a simple meal choice.",
    canDo: [
      "I can name common vegetables.",
      "I can state what a meal needs.",
      "I can ask whether an item is available.",
    ],
    languageFunctions: ["identifying", "planning", "checking availability"],
    grammarFocus: ["need/want", "some/any", "is there/are there"],
    pronunciationFocus: "syllable stress in longer food words",
    finalTask: "Select vegetables for a meal and check that each item is available.",
  },
  market: {
    outcome: "Buy familiar food items in a short market exchange.",
    canDo: [
      "I can ask for an item and quantity.",
      "I can understand a simple price.",
      "I can confirm or change my choice.",
    ],
    languageFunctions: ["requesting", "asking price", "confirming"],
    grammarFocus: ["I'd like", "how much/how many", "some/any"],
    pronunciationFocus: "polite request intonation and price clarity",
    finalTask: "Complete a market role-play with three items, quantities, and a total.",
  },
  "daily-routines": {
    outcome: "Describe and compare a simple daily routine in time order.",
    canDo: [
      "I can describe my routine.",
      "I can connect activities to times.",
      "I can ask about another person's routine.",
    ],
    languageFunctions: ["sequencing", "describing routine", "asking frequency"],
    grammarFocus: ["present simple", "frequency adverbs", "time expressions"],
    pronunciationFocus: "sentence stress and third-person -s",
    finalTask: "Arrange and present a realistic weekday routine, then ask a follow-up question.",
  },
  "giving-directions": {
    outcome: "Ask for and give short directions to a familiar destination.",
    canDo: [
      "I can ask how to reach a place.",
      "I can follow common direction phrases.",
      "I can give a short ordered route.",
    ],
    languageFunctions: ["asking directions", "instructing", "checking understanding"],
    grammarFocus: ["imperatives", "sequence markers", "place prepositions"],
    pronunciationFocus: "chunking, direction stress, and polite question intonation",
    finalTask: "Guide someone to a destination on a simple map and confirm arrival.",
  },
};

const LEVEL_TO_GSE: Record<CefrLevel, readonly [number, number]> = {
  A1: [22, 29],
  A2: [30, 42],
  B1: [43, 58],
  B2: [59, 75],
  C1: [76, 84],
};

const FOUNDATION_UNITS = new Set([
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
  "market",
  "fruits",
  "vegetables",
  "daily-routines",
  "giving-directions",
]);

const SPECIALIST_B2_UNITS = new Set([
  "law-firm",
  "courtroom-trial",
  "legal-documents",
  "rights-regulations",
  "stock-exchange",
  "research-study",
  "architecture-styles",
]);

const SPECIALIST_UNITS = new Set([
  "bank",
  "financial-services",
  "currency-payment",
  "stock-exchange",
  "law-firm",
  "courtroom-trial",
  "legal-documents",
  "rights-regulations",
  "academic-life",
  "research-study",
  "business-communication",
  "architecture-styles",
  "fashion-design",
  "startup-culture",
]);

const CONCEPT_UNITS = new Set([
  "numbers-counting",
  "colors",
  "shades-tones",
  "patterns-textures",
  "materials",
  "basic-emotions",
  "complex-feelings",
  "prepositions-of-place",
  "spatial-relations",
  "telling-time",
  "days-months",
  "seasons-weather",
  "measurements-units",
  "shapes-geometry",
]);

const PROCESS_UNITS = new Set([
  "cooking-methods",
  "daily-routines",
  "giving-directions",
  "first-aid-room",
  "driving-road-rules",
  "moving-settling-in",
  "winemaking",
]);

const LEVEL_OVERRIDES: Partial<Record<string, CefrLevel>> = {
  bank: "B1",
  "financial-services": "B1",
  "currency-payment": "A2",
  "business-communication": "B1",
  "academic-life": "B1",
  "university-campus": "A2",
  "research-study": "B2",
  "architecture-styles": "B2",
  "rights-regulations": "B2",
  "courtroom-trial": "B2",
  "legal-documents": "B2",
  "law-firm": "B2",
};

/**
 * A deliberate foundation sequence used for recommendations and prerequisites.
 * Explore remains a browsable catalogue; this sequence is the learning spine.
 */
function inferLevel(unitId: string): CefrLevel {
  const override = LEVEL_OVERRIDES[unitId];
  if (override) return override;
  if (FOUNDATION_UNITS.has(unitId)) return "A1";
  if (SPECIALIST_B2_UNITS.has(unitId)) return "B2";
  if (SPECIALIST_UNITS.has(unitId)) return "B1";
  return "A2";
}

function inferArchetype(unitId: string): CurriculumArchetype {
  if (SPECIALIST_UNITS.has(unitId)) return "specialist";
  if (CONCEPT_UNITS.has(unitId)) return "concept";
  if (PROCESS_UNITS.has(unitId)) return "process";
  return "place";
}

function grammarFor(level: CefrLevel, archetype: CurriculumArchetype): string[] {
  if (level === "A1") {
    return archetype === "place"
      ? ["this/that and there is/are", "present simple", "basic place prepositions"]
      : ["present simple", "basic questions", "and/but connections"];
  }
  if (level === "A2")
    return ["present and past reference", "quantity and comparison", "requests and instructions"];
  if (level === "B1")
    return [
      "connected past and present",
      "reasons and results",
      "modals for advice and obligation",
    ];
  return ["complex noun phrases", "condition and stance", "formal and informal register"];
}

function prerequisitesFor(unitId: string, archetype: CurriculumArchetype): string[] {
  const candidates =
    archetype === "place"
      ? ["numbers-counting", "prepositions-of-place", "daily-action-verbs"]
      : archetype === "process"
        ? ["numbers-counting", "daily-action-verbs", "telling-time"]
        : archetype === "specialist"
          ? ["numbers-counting", "money-currency", "communication-verbs"]
          : ["numbers-counting", "colors"];
  return candidates.filter((id) => id !== unitId);
}

export function getUnitCurriculumDesign(
  unit: Pick<CourseUnit, "id" | "name">,
  materials?: UnitLearningMaterials
): UnitCurriculumDesign {
  const cefr = inferLevel(unit.id);
  const archetype = inferArchetype(unit.id);
  const topic = unit.name.toLowerCase();

  const designs: Record<
    CurriculumArchetype,
    Omit<UnitCurriculumDesign, "cefr" | "gseRange" | "archetype" | "grammarFocus" | "prerequisites">
  > = {
    place: {
      outcome: `Use practical English to navigate ${topic} and complete a familiar task.`,
      canDo: [
        `I can identify the essential people, objects, and signs in ${topic}.`,
        "I can ask and answer a short question about location, need, or purpose.",
        "I can handle a predictable exchange or report a simple problem.",
      ],
      languageFunctions: ["identifying", "locating", "requesting", "problem reporting"],
      pronunciationFocus: "word stress, clear final sounds, and intelligible short chunks",
      finalTask: `Complete a short ${topic} scenario by understanding input and responding appropriately.`,
    },
    concept: {
      outcome: `Recognise, contrast, and use ${topic} language to describe real examples.`,
      canDo: [
        `I can distinguish the essential ${topic} concepts.`,
        "I can combine the new language with familiar words in a short description.",
        "I can understand and produce a simple comparison or classification.",
      ],
      languageFunctions: ["classifying", "describing", "comparing", "clarifying"],
      pronunciationFocus: "contrastive stress and clear production of easily confused forms",
      finalTask: `Classify or describe a new example using the unit's core language.`,
    },
    process: {
      outcome: `Understand and explain the main stages of ${topic}.`,
      canDo: [
        "I can identify the essential tools and actions.",
        "I can follow a short sequence of instructions.",
        "I can explain the sequence or respond when a familiar problem occurs.",
      ],
      languageFunctions: ["sequencing", "instructing", "checking", "troubleshooting"],
      pronunciationFocus: "sentence stress in instructions and sequence markers",
      finalTask: `Follow, order, and explain a practical ${topic} procedure.`,
    },
    specialist: {
      outcome: `Use the core language of ${topic} to understand information and make an informed response.`,
      canDo: [
        "I can understand the most useful public-facing terms in this domain.",
        "I can extract key information from a short conversation or text.",
        "I can explain a need, compare an option, or ask for clarification.",
      ],
      languageFunctions: ["explaining", "comparing options", "clarifying", "summarising"],
      pronunciationFocus: "multi-syllable word stress and appropriate formal phrasing",
      finalTask: `Interpret key information and respond to a realistic ${topic} scenario.`,
    },
  };

  const base = designs[archetype];
  const authoredFoundation = FOUNDATION_UNIT_DESIGNS[unit.id];
  const authoredLevel = materials?.passage?.level;
  const passageNote =
    authoredLevel && authoredLevel !== cefr
      ? ` The optional reading is labelled ${authoredLevel}.`
      : "";

  return {
    ...base,
    ...authoredFoundation,
    outcome: `${authoredFoundation?.outcome ?? base.outcome}${passageNote}`,
    cefr,
    gseRange: LEVEL_TO_GSE[cefr],
    archetype,
    grammarFocus: grammarFor(cefr, archetype),
    prerequisites: prerequisitesFor(unit.id, archetype),
  };
}

export function getCurriculumStageLabel(stage: CurriculumStage): string {
  const labels: Record<CurriculumStage, string> = {
    meaning: "Meaning & recognition",
    sound: "Listen & pronounce",
    recall: "Recall & retrieve",
    function: "Useful language",
    interaction: "Interact",
    integrated: "Read, listen & respond",
    review: "Checkpoint & review",
    reference: "Reference toolkit",
  };
  return labels[stage];
}
