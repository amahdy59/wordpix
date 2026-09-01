// Learning materials for "The Human Body (Hands & Feet)".
//
// Structured module covering vocabulary for hands, fingers, palms, wrists, feet, soles, and toes.

import type { UnitLearningMaterials } from "../types";

export const HUMAN_BODY_HANDS_AND_FEET_LEARNING: UnitLearningMaterials = {
  unitId: "human-body-hands-and-feet",
  subtopics: [
    {
      id: "human-body-hands-and-feet-1",
      title: "Hand Anatomy & Fingers",
      wordIds: [
        "hand",
        "palm",
        "back-of-hand",
        "wrist",
        "knuckle",
        "finger",
        "thumb",
        "index-finger",
        "middle-finger",
        "ring-finger",
        "little-finger",
        "fingertip",
        "fingerprint",
        "nail",
        "cuticle",
      ],
    },
    {
      id: "human-body-hands-and-feet-2",
      title: "Grips, Gestures & Manual Actions",
      wordIds: [
        "joint",
        "phalanx",
        "webbing",
        "crease",
        "lifeline",
        "grip",
        "pinch",
        "grasp",
        "squeeze",
        "clench",
        "point",
        "snap",
        "wave",
        "clap",
        "fist",
      ],
    },
    {
      id: "human-body-hands-and-feet-3",
      title: "Foot Anatomy & Nail Care",
      wordIds: [
        "foot",
        "heel",
        "sole",
        "arch",
        "instep",
        "ankle",
        "toe",
        "ball",
        "bridge",
        "toenail",
        "manicure",
        "pedicure",
        "nail-polish",
        "nail-file",
        "lotion",
      ],
    },
    {
      id: "human-body-hands-and-feet-4",
      title: "Skin & Nail Treatments",
      wordIds: ["moisturizer", "exfoliant", "pumice-stone", "cuticle-oil", "hand-cream"],
    },
  ],
  passage: {
    title: "Dexterity and Balance: The Extremities",
    level: "B1",
    text: "Human hands and feet are evolutionary marvels of biomechanical engineering. Hands provide unmatched fine motor dexterity, while feet supply stability, shock absorption, and propulsion for bipedal movement.\n\nEach hand contains twenty-seven bones and numerous delicate muscles. The opposable thumb enables precision grips such as pinching small objects or grasping large tools. Sensitive fingertips contain dense concentrations of nerve endings and unique ridges forming individual fingerprints. At the base of each finger, knuckles and joints allow flexible movement, while cuticles protect the growing nail bed.\n\nFeet, by comparison, are built for resilient load-bearing. The foot's arch acts as a natural spring, distributing body weight from the heel across to the ball and toes during each stride. Proper care of hands and feet — including moisturizing lotions, nail trimming, and pedicures — prevents calluses, blisters, and dry skin while keeping the extremities healthy.",
    questions: [],
    openQuestions: [
      "How many bones are found in a human hand?",
      "Why is the opposable thumb important for tool use?",
      "What is the function of the arch in the human foot?",
      "Where are fingerprint ridges located?",
      "How do cuticles protect finger and toe nails?",
    ],
  },
  phrases: [
    {
      id: "hands-feet-give-a-hand",
      phrase: "give someone a hand",
      kind: "idiom",
      meaning: "to help or assist someone with a task",
      example: "Could you give me a hand carrying these heavy grocery bags?",
    },
    {
      id: "hands-feet-hands-down",
      phrase: "hands down",
      kind: "idiom",
      meaning: "easily and without any doubt",
      example: "This bakery makes the best sourdough bread in town, hands down.",
    },
    {
      id: "hands-feet-cold-feet",
      phrase: "get cold feet",
      kind: "idiom",
      meaning: "to suddenly become too nervous to complete an intended plan",
      example: "He was about to skydive but got cold feet right before the jump.",
    },
    {
      id: "hands-feet-rule-of-thumb",
      phrase: "rule of thumb",
      kind: "idiom",
      meaning: "a broadly accurate practical principle or guideline",
      example: "As a good rule of thumb, drink plenty of water when exercising.",
    },
    {
      id: "hands-feet-put-foot-down",
      phrase: "put your foot down",
      kind: "idiom",
      meaning: "to use authority firmly to stop something from happening",
      example: "The parents put their foot down when the kids asked to stay out late.",
    },
    {
      id: "hands-feet-cross-fingers",
      phrase: "keep your fingers crossed",
      kind: "idiom",
      meaning: "to hope for good luck or a favorable outcome",
      example: "I'm keeping my fingers crossed that you get the job offer.",
    },
  ],
  dialogue: {
    title: "At the Spa & Wellness Center",
    scene: "A customer discusses hand and foot care with a wellness specialist",
    lines: [
      {
        speaker: "Specialist",
        text: "Welcome! Would you like a classic manicure or our full hand and foot treatment today?",
      },
      {
        speaker: "Customer",
        text: "I'd like both. My palms and fingertips feel very dry from swimming, and my heels have calluses.",
      },
      {
        speaker: "Specialist",
        text: "We will start with a soothing soak, apply a gentle exfoliant, and use a pumice stone for your heels and soles.",
      },
      {
        speaker: "Customer",
        text: "That sounds wonderful. Please also shape my nails and apply cuticle oil.",
      },
      {
        speaker: "Specialist",
        text: "Certainly. We finish every treatment with a deeply hydrating hand cream and foot lotion.",
      },
      {
        speaker: "Customer",
        text: "My hands and feet already feel much more relaxed just thinking about it!",
      },
    ],
  },
  mistakes: [
    {
      id: "hands-feet-foot-plural",
      wrong: '"My foots are tired after walking all day."',
      right: '"My feet are tired after walking all day."',
      note: "The plural of 'foot' is the irregular noun 'feet'.",
    },
    {
      id: "hands-feet-handshake",
      wrong: '"He gave me a warm hand shake by his hand."',
      right: '"He shook my hand warmly." / "He gave me a firm handshake."',
      note: "'Handshake' is one word. Saying 'by his hand' is redundant.",
    },
    {
      id: "hands-feet-snap-fingers",
      wrong: '"She cracked her fingers to the rhythm of the song."',
      right: '"She snapped her fingers to the rhythm of the song."',
      note: "'Snap fingers' = making a clicking sound with thumb and middle finger. 'Crack knuckles/fingers' = popping joints.",
    },
  ],
  wordFormation: [
    {
      base: "hand",
      noun: "handful",
      verb: "handle",
      adjective: "handy",
      adverb: "handily",
    },
    {
      base: "foot",
      noun: "footwear",
      verb: "foot",
      adjective: "barefoot",
      adverb: "underfoot",
    },
  ],
  blankExercises: [
    {
      id: "b1",
      sentence:
        "The unique pattern of ridges on each ____ can be used for biometric identification.",
      answer: "fingerprint",
    },
    {
      id: "b2",
      sentence: "Applying nourishing ____ oil keeps your nail beds healthy and smooth.",
      answer: "cuticle-oil",
    },
    {
      id: "b3",
      sentence: "The opposable ____ allows humans to grip tools and write with precision.",
      answer: "thumb",
    },
  ],
  culturalNotes: [
    {
      id: "cn1",
      title: "Handshakes & Greetings",
      body: "A firm handshake accompanied by a smile and eye contact is the standard professional greeting across North America and Europe. In contrast, in many Asian cultures, a bow is customary, and in the Middle East, prolonged handshakes or placing a right hand over the heart denotes warmth.",
    },
    {
      id: "cn2",
      title: "Hand Dominance Etiquette",
      body: "In many traditional cultures across the Middle East, Africa, and South Asia, the right hand is used for eating, greeting, and passing objects, while the left hand is reserved for personal hygiene.",
    },
  ],
  wordMeta: [
    {
      word: "fingerprint",
      partOfSpeech: "noun",
      frequency: 3,
      collocations: ["unique fingerprint", "fingerprint scanner", "leave fingerprints"],
    },
    {
      word: "knuckle",
      partOfSpeech: "noun",
      frequency: 2,
      collocations: ["crack your knuckles", "scraped knuckles"],
    },
  ],
};
