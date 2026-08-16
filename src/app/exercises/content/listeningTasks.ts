import { BEDROOM_VOCABULARY } from "../../data/lessons";
import type { ExerciseDefinition, ChoiceOption } from "../taskTypes";

const word = (id: string) => BEDROOM_VOCABULARY.find((w) => w.id === id)!;

/**
 * Builds a four-way choice between a word and three distractors, using each
 * word's non-naming description as the option text. That keeps the question
 * answerable by ear as well as by eye.
 */
function describeOptions(correctId: string, distractorIds: string[]): ChoiceOption[] {
  return [
    { id: correctId, label: word(correctId).description, correct: true },
    ...distractorIds.map((id) => ({ id, label: word(id).description })),
  ];
}

function labelOptions(correctId: string, distractorIds: string[]): ChoiceOption[] {
  return [
    { id: correctId, label: word(correctId).label, correct: true },
    ...distractorIds.map((id) => ({ id, label: word(id).label })),
  ];
}

const TOTAL = 9;

export const LISTENING_EXERCISES: Record<string, ExerciseDefinition> = {
  "listen-word-match": {
    id: "listen-word-match",
    title: "Word Match: Listening Definition",
    category: "listening",
    step: 1,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "pillow",
        kind: "choice",
        prompt: "Listen, then choose the definition that matches the word you heard.",
        audioText: word("pillow").label,
        options: describeOptions("pillow", ["wardrobe", "nightstand", "blanket"]),
        explanation: `"${word("pillow").label}" comes from Old English pyle. ${word("pillow").description}`,
      },
      {
        id: "wardrobe",
        kind: "choice",
        prompt: "Listen, then choose the definition that matches the word you heard.",
        audioText: word("wardrobe").label,
        options: describeOptions("wardrobe", ["dresser", "bookshelf", "chest-of-drawers"]),
        explanation: `A ${word("wardrobe").label.toLowerCase()} hangs clothes on a rail; a dresser and a chest of drawers both use drawers instead.`,
      },
      {
        id: "duvet",
        kind: "choice",
        prompt: "Listen, then choose the definition that matches the word you heard.",
        audioText: word("duvet").label,
        options: describeOptions("duvet", ["blanket", "sheet", "mattress"]),
        explanation: `A ${word("duvet").label.toLowerCase()} is filled and used alone; a blanket is woven, and a mattress is slept on.`,
      },
    ],
  },

  "listen-audio-scene-match": {
    id: "listen-audio-scene-match",
    title: "Audio Scene Match",
    category: "listening",
    step: 2,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "scene-1",
        kind: "choice",
        prompt: "Which room is being described?",
        audioText: "A soft place to sleep, a small table beside it, and a lamp for reading at night.",
        options: [
          { id: "bedroom", label: "The bedroom", correct: true },
          { id: "kitchen", label: "The kitchen" },
          { id: "library", label: "The library" },
          { id: "garden", label: "The garden" },
        ],
        explanation: "A place to sleep plus a bedside table and a reading lamp describes a bedroom.",
      },
      {
        id: "scene-2",
        kind: "choice",
        prompt: "Which object is being described?",
        audioText: word("mirror").description,
        options: labelOptions("mirror", ["window", "poster", "picture-frame"]),
        explanation: `Only a ${word("mirror").label.toLowerCase()} shows your reflection; a window shows what is outside.`,
      },
    ],
  },

  "listen-vocab-spotting": {
    id: "listen-vocab-spotting",
    title: "Vocabulary Spotting",
    category: "listening",
    step: 4,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "spot-1",
        kind: "multi",
        prompt: "Choose every bedroom word you heard in the sentence.",
        audioText:
          "She put the pillow on the bed, folded the blanket, and switched off the lamp on the nightstand.",
        options: [
          { id: "pillow", label: "Pillow", correct: true },
          { id: "blanket", label: "Blanket", correct: true },
          { id: "lamp", label: "Lamp", correct: true },
          { id: "nightstand", label: "Nightstand", correct: true },
          { id: "mirror", label: "Mirror" },
          { id: "wardrobe", label: "Wardrobe" },
        ],
        explanation:
          "The sentence names a pillow, a blanket, a lamp, and a nightstand. Mirror and wardrobe were not mentioned.",
      },
    ],
  },

  "listen-dialogue-roleplay": {
    id: "listen-dialogue-roleplay",
    title: "Dialogue Role-Play",
    category: "listening",
    step: 5,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "reply-1",
        kind: "choice",
        prompt: "The hotel receptionist asks what you need. Choose the most polite reply.",
        audioText: "Good evening. Is there anything you need for your room?",
        options: [
          { id: "polite", label: "Could I please have an extra pillow?", correct: true },
          { id: "blunt", label: "Give me a pillow." },
          { id: "vague", label: "Pillow." },
          { id: "wrong", label: "I am a pillow." },
        ],
        explanation:
          "\"Could I please have…\" is the standard polite request form. The others are grammatical but abrupt, incomplete, or nonsense.",
      },
    ],
  },

  "listen-selective-shadowing": {
    id: "listen-selective-shadowing",
    title: "Selective Shadowing",
    category: "listening",
    step: 6,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "stress-1",
        kind: "choice",
        prompt: "Which syllable carries the stress in the highlighted word?",
        audioText: "The bedroom features an impeccable wooden wardrobe.",
        options: [
          { id: "im", label: "im" },
          { id: "pec", label: "pec", correct: true },
          { id: "ca", label: "ca" },
          { id: "ble", label: "ble" },
        ],
        explanation: "im·PEC·ca·ble — the stress falls on the second syllable.",
      },
      {
        id: "shadow-1",
        kind: "practice",
        prompt: "Now say the whole sentence along with the model.",
        audioText: "The bedroom features an impeccable wooden wardrobe.",
        guidance: [
          "Match the rhythm before worrying about individual sounds.",
          "Keep the stress on PEC.",
          "Run the words together as one phrase, not four separate words.",
        ],
        explanation: "Shadowing builds rhythm. Repeat it a few times at natural speed.",
      },
    ],
  },

  "listen-warmup-review": {
    id: "listen-warmup-review",
    title: "Warm-up Refresher",
    category: "listening",
    step: 8,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "warm-1",
        kind: "entry",
        prompt: "Type the word you hear.",
        audioText: word("lamp").label,
        accept: [word("lamp").label],
        explanation: `${word("lamp").label}: ${word("lamp").description}`,
      },
      {
        id: "warm-2",
        kind: "entry",
        prompt: "Type the word you hear.",
        audioText: word("curtain").label,
        accept: [word("curtain").label, "curtains"],
        explanation: `${word("curtain").label}: ${word("curtain").description}`,
      },
    ],
  },

  "listen-podcast-comprehension": {
    id: "listen-podcast-comprehension",
    title: "Podcast Comprehension",
    category: "listening",
    step: 9,
    totalSteps: TOTAL,
    tasks: [
      {
        id: "topic-1",
        kind: "multi",
        prompt: "Which topics does the clip cover? Choose all that apply.",
        audioText:
          "Good sleep starts with the room itself. Keep it dark with heavy curtains, keep it cool, and keep screens out. A comfortable mattress matters more than an expensive one.",
        options: [
          { id: "darkness", label: "Blocking out light", correct: true },
          { id: "temperature", label: "Room temperature", correct: true },
          { id: "screens", label: "Avoiding screens", correct: true },
          { id: "mattress", label: "Choosing a mattress", correct: true },
          { id: "diet", label: "What to eat before bed" },
          { id: "exercise", label: "Morning exercise" },
        ],
        explanation:
          "The clip covers darkness, temperature, screens, and mattress comfort. Diet and exercise are never mentioned.",
      },
    ],
  },
};
