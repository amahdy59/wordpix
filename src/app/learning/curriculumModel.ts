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
  const authoredLevel = materials?.passage?.level;
  const passageNote =
    authoredLevel && authoredLevel !== cefr
      ? ` The optional reading is labelled ${authoredLevel}.`
      : "";

  return {
    ...base,
    outcome: `${base.outcome}${passageNote}`,
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
