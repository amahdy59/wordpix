import { BEDROOM_VOCABULARY } from "../../data/lessons";
import type { ExerciseDefinition } from "../taskTypes";

const word = (id: string) => BEDROOM_VOCABULARY.find((w) => w.id === id)!;
const TOTAL = 9;

export const READING_EXERCISES: Record<string, ExerciseDefinition> = {
  "read-progressive-reveal": {
    id: "read-progressive-reveal",
    title: "Progressive Reveal Reading",
    category: "reading",
    step: 2,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "reveal-1",
        kind: "choice",
        prompt:
          "\"Elena stood in the sunlit bedroom, her hands smoothing the fresh blanket.\" What was she touching?",
        options: [
          { id: "blanket", label: "A woven cover for warmth", correct: true },
          { id: "curtain", label: "Fabric hanging across a window" },
          { id: "rug", label: "A loose covering on the floor" },
          { id: "poster", label: "A printed sheet on the wall" },
        ],
        explanation: "She was smoothing the blanket — a woven cover laid over the bed for warmth.",
      },
      {
        id: "reveal-2",
        kind: "choice",
        prompt:
          "\"Next to the bed sat a small nightstand with a glowing brass lamp.\" Where was the lamp?",
        options: [
          { id: "nightstand", label: "On the small table beside the bed", correct: true },
          { id: "ceiling", label: "Fixed to the ceiling" },
          { id: "floor", label: "Standing on the floor" },
          { id: "wardrobe", label: "Inside the wardrobe" },
        ],
        explanation: "The lamp sat on the nightstand, the small table next to the bed.",
      },
      {
        id: "reveal-3",
        kind: "entry",
        prompt:
          "\"She opened the tall ______ to hang her favourite winter coat.\" Which word fits?",
        accept: [word("wardrobe").label],
        explanation: `A ${word("wardrobe").label.toLowerCase()} is where clothes hang. ${word("wardrobe").description}`,
      },
    ],
  },

  "read-error-detection": {
    id: "read-error-detection",
    title: "Error Detection Proofreading",
    category: "reading",
    step: 3,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "agreement",
        kind: "choice",
        prompt: "Which word is wrong? \"The bedroom have two large windows and a soft carpet.\"",
        options: [
          { id: "have", label: "have", correct: true },
          { id: "bedroom", label: "bedroom" },
          { id: "windows", label: "windows" },
          { id: "carpet", label: "carpet" },
        ],
        explanation:
          "Subject–verb agreement: the singular noun \"bedroom\" takes \"has\", not \"have\".",
      },
      {
        id: "article",
        kind: "choice",
        prompt: "Which word is wrong? \"She put a pillows on the bed.\"",
        options: [
          { id: "pillows", label: "pillows", correct: true },
          { id: "put", label: "put" },
          { id: "bed", label: "bed" },
          { id: "she", label: "She" },
        ],
        explanation: "\"a\" is singular, so it must be followed by \"pillow\", not \"pillows\".",
      },
    ],
  },

  "read-comic-strip": {
    id: "read-comic-strip",
    title: "Comic Strip Sequencing",
    category: "reading",
    step: 4,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "sequence",
        kind: "order",
        prompt: "Put the panels in the order the story happens.",
        solution: [
          "She wakes up",
          "She opens the curtains",
          "She makes the bed",
          "She leaves the room",
        ],
        explanation:
          "Waking comes first, then light, then tidying, then leaving — each step depends on the one before it.",
      },
    ],
  },

  "read-infographic": {
    id: "read-infographic",
    title: "Infographic Reading",
    category: "reading",
    step: 5,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "chart-1",
        kind: "choice",
        prompt:
          "A survey found: mattress 45%, pillow 25%, curtains 20%, lamp 10%. Which affected sleep most?",
        options: [
          { id: "mattress", label: "The mattress", correct: true },
          { id: "pillow", label: "The pillow" },
          { id: "curtains", label: "The curtains" },
          { id: "lamp", label: "The lamp" },
        ],
        explanation: "45% is the largest share, so the mattress was reported as mattering most.",
      },
      {
        id: "chart-2",
        kind: "choice",
        prompt: "Using the same figures, how much larger is the mattress share than the lamp share?",
        options: [
          { id: "35", label: "35 percentage points", correct: true },
          { id: "10", label: "10 percentage points" },
          { id: "45", label: "45 percentage points" },
          { id: "55", label: "55 percentage points" },
        ],
        explanation: "45% minus 10% is 35 percentage points.",
      },
    ],
  },

  "read-category-sort": {
    id: "read-category-sort",
    title: "Category Sort",
    category: "reading",
    step: 6,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "sort-1",
        kind: "sort",
        prompt: "Put each word into the right group.",
        buckets: [
          { id: "furniture", label: "Furniture" },
          { id: "bedding", label: "Bedding" },
          { id: "electronics", label: "Electronics" },
        ],
        items: [
          { id: "wardrobe", label: word("wardrobe").label, bucketId: "furniture" },
          { id: "duvet", label: word("duvet").label, bucketId: "bedding" },
          { id: "laptop", label: word("laptop").label, bucketId: "electronics" },
          { id: "stool", label: word("stool").label, bucketId: "furniture" },
          { id: "pillowcase", label: word("pillowcase").label, bucketId: "bedding" },
        ],
        explanation:
          "Wardrobe and stool are furniture; duvet and pillowcase are bedding; a laptop is electronics.",
      },
    ],
  },

  "read-subtitle-correction": {
    id: "read-subtitle-correction",
    title: "Subtitle Correction",
    category: "reading",
    step: 8,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "sub-1",
        kind: "entry",
        prompt:
          "The subtitle reads \"He hanged his coat in the wardrope.\" Type the misspelled word correctly.",
        accept: ["wardrobe"],
        explanation: "\"Wardrope\" should be \"wardrobe\". (\"Hanged\" should also be \"hung\".)",
      },
      {
        id: "sub-2",
        kind: "choice",
        prompt: "Which correction fixes the verb in the same subtitle?",
        options: [
          { id: "hung", label: "hung", correct: true },
          { id: "hanging", label: "hanging" },
          { id: "hangs", label: "hangs" },
          { id: "hanged", label: "hanged is already correct" },
        ],
        explanation:
          "\"Hanged\" is only used for executions. For objects the past tense is \"hung\".",
      },
    ],
  },

  "read-confidence-check": {
    id: "read-confidence-check",
    title: "Confidence Check",
    category: "reading",
    step: 9,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "check-1",
        kind: "choice",
        prompt: "\"The beauty of the morning mist was ephemeral.\" What does ephemeral mean here?",
        options: [
          { id: "short", label: "Lasting only a very short time", correct: true },
          { id: "bright", label: "Extremely bright" },
          { id: "heavy", label: "Thick and heavy" },
          { id: "cold", label: "Very cold" },
        ],
        explanation:
          "Ephemeral means short-lived. The sentence's \"vanishing quickly\" is the clue.",
      },
    ],
  },
};
