import { BEDROOM_VOCABULARY } from "../../data/lessons";
import type { ExerciseDefinition } from "../taskTypes";

const word = (id: string) => BEDROOM_VOCABULARY.find((w) => w.id === id)!;

const SPEAKING_TOTAL = 8;
const WRITING_TOTAL = 9;

/**
 * Speaking drills.
 *
 * Only Echo Practice can be checked, because it compares a single spoken word
 * against the recogniser's transcript. Everything longer — narration, roleplay,
 * argumentation — is open-ended, and WordPix has no way to judge it. Those are
 * modelled as `practice` tasks so they give real guidance and say plainly that
 * nothing is marked, rather than inventing a score as this suite used to.
 */
export const SPEAKING_EXERCISES: Record<string, ExerciseDefinition> = {
  "speak-scenario-response": {
    id: "speak-scenario-response",
    title: "Scenario Response",
    category: "speaking",
    step: 2,
    totalSteps: SPEAKING_TOTAL,
    tasks: [
      {
        id: "polite-form",
        kind: "choice",
        prompt: "You need an extra pillow at a hotel. Which request is the most polite?",
        options: [
          { id: "could", label: "Could I please have an extra pillow?", correct: true },
          { id: "want", label: "I want another pillow." },
          { id: "give", label: "Give me a pillow." },
          { id: "need", label: "I need pillow now." },
        ],
        explanation:
          "\"Could I please have…\" softens a request. \"I want\" and \"Give me\" are direct to the point of rudeness, and the last drops the article.",
      },
      {
        id: "say-it",
        kind: "practice",
        prompt: "Now say your request aloud to the receptionist.",
        guidance: [
          "Open with \"Excuse me\" before the request.",
          "Use \"Could I please have…\".",
          "Name the item clearly: an extra pillow.",
        ],
        explanation: "Politeness in English is carried by the sentence frame more than by tone.",
      },
    ],
  },

  "speak-photo-narration": {
    id: "speak-photo-narration",
    title: "Photo Narration",
    category: "speaking",
    step: 3,
    totalSteps: SPEAKING_TOTAL,
    tasks: [
      {
        id: "narrate",
        kind: "practice",
        prompt: "Describe this picture out loud for about thirty seconds.",
        imageWordId: "bed",
        guidance: [
          "Start with the room as a whole, then move to individual objects.",
          "Name at least three things you can see.",
          "Say where each one is: on, under, next to, above.",
        ],
        explanation:
          "Describing position is what turns a list of nouns into a description. Prepositions do most of the work.",
      },
    ],
  },

  "speak-video-roleplay": {
    id: "speak-video-roleplay",
    title: "Video Roleplay",
    category: "speaking",
    step: 4,
    totalSteps: SPEAKING_TOTAL,
    tasks: [
      {
        id: "shop-choice",
        kind: "choice",
        prompt: "In a shop you want to buy a lamp. Which sentence would a shop assistant expect?",
        options: [
          { id: "like", label: "I would like to buy a lamp, please.", correct: true },
          { id: "am", label: "I am a lamp." },
          { id: "have", label: "You have lamp?" },
          { id: "buying", label: "Lamp buying me." },
        ],
        explanation: "\"I would like to buy…\" is the standard frame for a purchase.",
      },
      {
        id: "roleplay",
        kind: "practice",
        prompt: "Say your line aloud, then continue the conversation for two more turns.",
        guidance: [
          "Greet the assistant first.",
          "State what you want to buy.",
          "Ask one follow-up question, such as the price.",
        ],
        explanation: "Real exchanges are three or four turns; practising only the first turn is not enough.",
      },
    ],
  },

  "speak-compare-contrast": {
    id: "speak-compare-contrast",
    title: "Compare & Contrast",
    category: "speaking",
    step: 5,
    totalSteps: SPEAKING_TOTAL,
    tasks: [
      {
        id: "compare-form",
        kind: "choice",
        prompt: "Which sentence correctly compares two objects?",
        options: [
          { id: "than", label: "The wardrobe is taller than the nightstand.", correct: true },
          { id: "more", label: "The wardrobe is more tall than the nightstand." },
          { id: "as", label: "The wardrobe is tallest than the nightstand." },
          { id: "most", label: "The wardrobe is the most tall of the nightstand." },
        ],
        explanation:
          "Short adjectives take -er, not \"more\": taller, not \"more tall\". Superlatives need \"the … -est\" and at least three things.",
      },
      {
        id: "compare-speak",
        kind: "practice",
        prompt: "Compare the two pictures out loud.",
        imageWordId: "wardrobe",
        guidance: [
          "Use one comparative: bigger, softer, taller.",
          "Use one similarity: both, also, as well.",
          "Finish with which you would choose, and why.",
        ],
        explanation: "Comparison needs both a difference and a similarity to sound natural.",
      },
    ],
  },

  "speak-word-chain": {
    id: "speak-word-chain",
    title: "Word Chain",
    category: "speaking",
    step: 6,
    totalSteps: SPEAKING_TOTAL,
    tasks: [
      {
        id: "chain-1",
        kind: "entry",
        prompt:
          "Word chain: the next word must start with the last letter of \"pillow\". Type a bedroom word starting with W.",
        accept: [word("wardrobe").label, word("window").label],
        explanation: "\"Pillow\" ends in W, so wardrobe or window both continue the chain.",
      },
      {
        id: "chain-2",
        kind: "entry",
        prompt: "\"Wardrobe\" ends in E. Type a bedroom word starting with E… or with D, from \"bed\".",
        accept: ["desk", "duvet", "door", "dresser"],
        explanation:
          "Few bedroom words start with E, so the chain usually restarts from another word's final letter.",
      },
    ],
  },

  "speak-self-repair": {
    id: "speak-self-repair",
    title: "Self-Repair",
    category: "speaking",
    step: 7,
    totalSteps: SPEAKING_TOTAL,
    tasks: [
      {
        id: "repair-1",
        kind: "entry",
        prompt: "Fix this sentence: \"The woman is go to bed.\" Type the corrected verb form.",
        accept: ["going", "is going", "going to bed"],
        explanation: "The present continuous needs \"is\" plus the -ing form: \"is going\".",
      },
      {
        id: "repair-2",
        kind: "practice",
        prompt: "Say the corrected sentence aloud twice.",
        guidance: [
          "Say it once slowly, then once at normal speed.",
          "Notice the -ing ending; it is easy to drop.",
        ],
        explanation: "Saying a correction aloud is what moves it from recognised to usable.",
      },
    ],
  },
};

/**
 * Writing drills.
 *
 * Sentence construction, error correction, and spelling can all be marked
 * exactly. Free writing cannot, so the journal and summary tasks are `practice`
 * and say so — the old versions showed a fixed ●●●○○ "Assessment Rubric" that
 * never changed regardless of what was typed.
 */
export const WRITING_EXERCISES: Record<string, ExerciseDefinition> = {
  "write-caption-builder": {
    id: "write-caption-builder",
    title: "Caption Builder",
    category: "writing",
    step: 1,
    totalSteps: WRITING_TOTAL,
    tasks: [
      {
        id: "caption-1",
        kind: "order",
        prompt: "Build a caption for this picture.",
        imageWordId: "bed",
        solution: ["The", "bed", "is", "soft", "and", "clean"],
        explanation: "English word order is subject, verb, then the adjectives joined by \"and\".",
      },
    ],
  },

  "write-sentence-assembly": {
    id: "write-sentence-assembly",
    title: "Sentence Assembly",
    category: "writing",
    step: 2,
    totalSteps: WRITING_TOTAL,
    timeLimitSeconds: 90,
    tasks: [
      {
        id: "assemble-1",
        kind: "order",
        prompt: "Arrange these words into a correct sentence.",
        solution: ["The", "lamp", "is", "on", "the", "nightstand"],
        explanation: "Subject, verb, then the prepositional phrase saying where.",
      },
      {
        id: "assemble-2",
        kind: "order",
        prompt: "Arrange these words into a correct sentence.",
        solution: ["She", "hung", "her", "coat", "in", "the", "wardrobe"],
        explanation: "Past tense \"hung\", then the object, then where it went.",
      },
    ],
  },

  "write-photo-journal": {
    id: "write-photo-journal",
    title: "Photo Journal",
    category: "writing",
    step: 3,
    totalSteps: WRITING_TOTAL,
    tasks: [
      {
        id: "journal",
        kind: "practice",
        freeText: true,
        prompt: "Write three sentences describing your own bedroom.",
        guidance: [
          "One object per sentence.",
          "Say where each object is.",
          "Use a different preposition each time: on, next to, under.",
        ],
        explanation:
          "Three short, correct sentences are worth more than one long one you are unsure of.",
      },
    ],
  },

  "write-video-summary": {
    id: "write-video-summary",
    title: "Video Summary",
    category: "writing",
    step: 4,
    totalSteps: WRITING_TOTAL,
    tasks: [
      {
        id: "summary-order",
        kind: "choice",
        prompt: "A summary should open with which of these?",
        options: [
          { id: "main", label: "The main idea, in one sentence", correct: true },
          { id: "detail", label: "The most interesting small detail" },
          { id: "opinion", label: "Your opinion of it" },
          { id: "quote", label: "A direct quotation" },
        ],
        explanation:
          "A summary states the main idea first, then supports it. Detail, opinion, and quotation all come later, if at all.",
      },
      {
        id: "summary-write",
        kind: "practice",
        freeText: true,
        prompt: "Summarise a short talk about bedroom design in two sentences.",
        guidance: ["Main idea first.", "One supporting point second.", "No opinion."],
        explanation: "Two sentences is usually enough for a short talk.",
      },
    ],
  },

  "write-error-correction": {
    id: "write-error-correction",
    title: "Error Correction",
    category: "writing",
    step: 5,
    totalSteps: WRITING_TOTAL,
    tasks: [
      {
        id: "was-were",
        kind: "entry",
        prompt: "Correct the verb: \"The students was studying furniture vocabulary.\"",
        accept: ["were", "were studying"],
        explanation: "\"Students\" is plural, so it takes \"were\".",
      },
      {
        id: "article",
        kind: "entry",
        prompt: "Correct the article: \"She bought a umbrella for the rain.\"",
        accept: ["an", "an umbrella"],
        explanation: "\"Umbrella\" starts with a vowel sound, so it takes \"an\".",
      },
    ],
  },

  "write-paraphrase-challenge": {
    id: "write-paraphrase-challenge",
    title: "Paraphrase Challenge",
    category: "writing",
    step: 6,
    totalSteps: WRITING_TOTAL,
    tasks: [
      {
        id: "para-1",
        kind: "entry",
        prompt:
          "Rewrite using one word: \"The athlete was very tired after the marathon.\" Type the word that replaces \"very tired\".",
        accept: ["exhausted"],
        explanation: "\"Exhausted\" carries \"very tired\" in a single word.",
      },
      {
        id: "para-2",
        kind: "choice",
        prompt: "Which sentence keeps the meaning but changes the structure?",
        options: [
          { id: "after", label: "After the marathon, the athlete was exhausted.", correct: true },
          { id: "same", label: "The athlete was very, very tired after the marathon." },
          { id: "diff", label: "The athlete ran a marathon." },
          { id: "wrong", label: "The marathon was exhausted by the athlete." },
        ],
        explanation:
          "Moving the time phrase to the front changes the structure while keeping the meaning. The others repeat, drop, or invert it.",
      },
    ],
  },

  "write-image-story-chain": {
    id: "write-image-story-chain",
    title: "Image Story Chain",
    category: "writing",
    step: 7,
    totalSteps: WRITING_TOTAL,
    tasks: [
      {
        id: "connector",
        kind: "choice",
        prompt: "\"She woke up early. ______ she opened the curtains.\" Which connector fits?",
        options: [
          { id: "then", label: "Then", correct: true },
          { id: "however", label: "However" },
          { id: "because", label: "Because" },
          { id: "although", label: "Although" },
        ],
        explanation:
          "\"Then\" marks the next event in a sequence. The others signal contrast or cause, which does not fit here.",
      },
      {
        id: "story",
        kind: "practice",
        freeText: true,
        prompt: "Continue the story for two more sentences.",
        guidance: [
          "Use a different connector in each sentence.",
          "Keep the same tense throughout.",
          "Name at least one bedroom object.",
        ],
        explanation: "Connectors are what make a sequence read as a story rather than a list.",
      },
    ],
  },
};
