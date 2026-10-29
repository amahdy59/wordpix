// Learning materials for "The Human Body (Lower Body)".
//
// Structured module covering vocabulary for hips, thighs, knees, legs, calves, and ankles.

import type { UnitLearningMaterials } from "../types";

export const HUMAN_BODY_LOWER_BODY_LEARNING: UnitLearningMaterials = {
  unitId: "human-body-lower-body",
  subtopics: [
    {
      id: "human-body-lower-body-1",
      title: "Thighs, Hip Joints & Knees",
      wordIds: [
        "thigh",
        "quadricep",
        "hamstring",
        "hip-joint",
        "groin",
        "inner-thigh",
        "outer-thigh",
        "femur",
        "hip-flexor",
        "iliac-crest",
        "knee",
        "kneecap",
        "shin",
        "calf",
        "tibia",
      ],
    },
    {
      id: "human-body-lower-body-2",
      title: "Lower Leg Bones & Foot Joints",
      wordIds: [
        "fibula",
        "achilles-tendon",
        "popliteal",
        "meniscus",
        "ligament",
        "foot",
        "ankle",
        "heel",
        "sole",
        "arch",
        "instep",
        "ball-of-foot",
        "ankle-bone",
        "plantar",
        "metatarsal",
      ],
    },
    {
      id: "human-body-lower-body-3",
      title: "Toes, Nails & Basic Locomotion",
      wordIds: [
        "big-toe",
        "little-toe",
        "toenail",
        "toe-pad",
        "toe-joint",
        "bunion",
        "callus",
        "blister",
        "cuticle",
        "nail-bed",
        "walk",
        "run",
        "jump",
        "squat",
        "lunge",
      ],
    },
    {
      id: "human-body-lower-body-4",
      title: "Dynamic Lower Body Actions",
      wordIds: ["kick", "kneel", "crouch", "stride", "tiptoe"],
    },
  ],
  passage: {
    title: "Biomechanics of the Lower Body",
    level: "B1",
    text: "The lower body is engineered for locomotion, weight-bearing, and athletic power. At the core of this system is the femur, or thighbone — the longest and strongest bone in the human body. It joins the pelvis at the hip joint and extends down to the knee.\n\nThe knee joint is a complex hinge protected by the patella, commonly called the kneecap. Within the knee, cartilage rings called the meniscus absorb shocks during walking and jumping, while tough ligaments stabilize the joint. Below the knee, two bones form the lower leg: the sturdy tibia (shinbone) and the slender fibula.\n\nPowerful muscles drive our movements. The quadriceps on the front of the thigh straighten the leg, while the hamstrings on the back bend the knee. In the calf, muscles connect directly to the heel through the robust Achilles tendon. When we walk, run, or jump, forces pass through the ankle down into the arch and sole of the foot, propelling us forward.",
    questions: [],
    openQuestions: [
      "What is the longest and strongest bone in the human body?",
      "What is the function of the meniscus inside the knee?",
      "Which muscle group straightens the knee?",
      "Which tendon connects the calf muscle to the heel?",
      "What two bones make up the human lower leg?",
    ],
  },
  phrases: [
    {
      id: "lower-body-pull-leg",
      phrase: "pull someone's leg",
      kind: "idiom",
      meaning: "to tease or playfully fool someone with a joke",
      example: "Don't worry, he wasn't being serious — he was just pulling your leg.",
    },
    {
      id: "lower-body-on-last-legs",
      phrase: "on its last legs",
      kind: "idiom",
      meaning: "near the end of its useful life or completely worn out",
      example: "My old laptop is on its last legs; the battery dies after twenty minutes.",
    },
    {
      id: "lower-body-break-a-leg",
      phrase: "break a leg",
      kind: "idiom",
      meaning: "good luck (especially said to performers before a show)",
      example: "Break a leg tonight! You are going to give a fantastic performance.",
    },
    {
      id: "lower-body-stand-own-two-feet",
      phrase: "stand on your own two feet",
      kind: "idiom",
      meaning: "to be independent and capable of managing your own life",
      example: "After graduating from university, she wanted to stand on her own two feet.",
    },
    {
      id: "lower-body-shake-in-shoes",
      phrase: "shake in your shoes / boots",
      kind: "idiom",
      meaning: "to feel very nervous or frightened",
      example: "He was shaking in his shoes before giving the keynote speech.",
    },
  ],
  dialogue: {
    title: "Sports Injury Assessment",
    scene: "A physical therapist examines an athlete's knee and ankle after a soccer match",
    lines: [
      {
        speaker: "Therapist",
        text: "Where exactly did you feel the sharp pain when you landed from that jump?",
      },
      {
        speaker: "Athlete",
        text: "Along the outside of my knee and down into my calf and Achilles tendon.",
      },
      {
        speaker: "Therapist",
        text: "Let me test your knee joint. Tell me if this hurts when I gently rotate your lower leg.",
      },
      {
        speaker: "Athlete",
        text: "Ouch! Right around the kneecap and meniscus area.",
      },
      {
        speaker: "Therapist",
        text: "There is some mild inflammation in the ligament, but the tibia and fibula bones are stable. Let's check your ankle too.",
      },
      {
        speaker: "Athlete",
        text: "My ankle feels fine, but my quadriceps and hamstrings are quite tight.",
      },
      {
        speaker: "Therapist",
        text: "We will apply ice to reduce swelling, followed by gentle mobility exercises and calf stretches.",
      },
    ],
  },
  mistakes: [
    {
      id: "lower-body-on-foot",
      wrong: '"I went to the university by foot."',
      right: '"I went to the university on foot." / "I walked to the university."',
      note: "We say 'by car', 'by train', 'by bus', but 'on foot' is the correct preposition.",
    },
    {
      id: "lower-body-leg-plural",
      wrong: '"He hurt both his knees and leg."',
      right: '"He hurt both his knees and legs."',
      note: "Use the plural 'legs' when referring to both limbs.",
    },
    {
      id: "lower-body-fall-down",
      wrong: '"He fell on his kneecaps."',
      right: '"He fell on his knees."',
      note: "In conversational English, people say 'fell on their knees' rather than specifying 'kneecaps'.",
    },
  ],
  wordFormation: [
    {
      base: "knee",
      noun: "kneecap",
      verb: "kneel",
      adjective: "kneeling",
      adverb: null,
    },
    {
      base: "stride",
      noun: "stride",
      verb: "stride",
      adjective: "striding",
      adverb: null,
    },
  ],
  blankExercises: [
    {
      id: "b1",
      sentence: "The ____ is the largest bone in the human thigh.",
      answer: "femur",
    },
    {
      id: "b2",
      sentence: "The thick ____ tendon connects the calf muscles to the heel bone.",
      answer: "achilles-tendon",
    },
    {
      id: "b3",
      sentence: "Wearing supportive running shoes protects the ____ and sole of your foot.",
      answer: "arch",
    },
  ],
  culturalNotes: [
    {
      id: "cn1",
      title: "Footwear & Etiquette Indoors",
      body: "In many countries (including Japan, South Korea, Scandinavia, and parts of Canada and the Middle East), removing outdoor footwear before stepping into a home is a fundamental rule of cleanliness and hospitality.",
    },
    {
      id: "cn2",
      title: "Showing the Soles of Shoes",
      body: "In many Arab, Middle Eastern, and South Asian cultures, pointing the soles of your shoes or feet directly toward another person is regarded as disrespectful.",
    },
  ],
  wordMeta: [
    {
      word: "femur",
      partOfSpeech: "noun",
      frequency: 3,
      collocations: ["femur fracture", "strong femur", "head of the femur"],
    },
    {
      word: "meniscus",
      partOfSpeech: "noun",
      frequency: 2,
      collocations: ["torn meniscus", "lateral meniscus", "meniscus repair"],
    },
  ],
};
