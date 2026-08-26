// Learning materials for "The Bathroom".
//
// Imported from Figma file gRlyhrMavAHXUAT5brWFWu:
//   node 44:272  — the unit frame (sub-topic grouping, word cards)
//   node 542:2   — the "Learning Materials" frame (the eight content blocks)
//
// Figma is the source of truth for this content. Edits belong in the design
// file and come back through the extractor, not here.

import type { UnitLearningMaterials } from "../types";

export const BATHROOM_LEARNING: UnitLearningMaterials = {
  unitId: "bathroom",

  registerLabels: [
    {
      word: "bathtub",
      register: "Neutral",
      emoji: "🟢",
      description:
        "Standard word. In British English, often shortened to 'bath'. 'I\\'ll have a bath' (UK) vs 'I\\'ll take a bath' (US).",
    },
    {
      word: "lavatory",
      register: "Formal",
      emoji: "🎩",
      description:
        "Very formal/old-fashioned for toilet. Used on aeroplanes ('lavatory occupied') and in upper-class British English.",
    },
    {
      word: "toilet",
      register: "Neutral (UK) / Direct (US)",
      emoji: "🟢",
      description:
        "In the UK, 'toilet' is the standard neutral word. In the US, 'restroom' or 'bathroom' is more polite in public.",
    },
    {
      word: "loo",
      register: "Informal (UK)",
      emoji: "💬",
      description:
        "British slang for toilet. Very common in casual speech: 'Where\\'s the loo?' Never used in formal writing.",
    },
    {
      word: "faucet / tap",
      register: "Neutral",
      emoji: "🟢",
      description: "Americans say 'faucet'; British say 'tap.' Both are neutral in their regions.",
    },
    {
      word: "shampoo",
      register: "Neutral",
      emoji: "🟢",
      description:
        "Used universally across all registers. Originally from Hindi 'chāmpo' (to press/massage).",
    },
    {
      word: "toiletries",
      register: "Neutral / Slightly formal",
      emoji: "🟢",
      description:
        "Collective term for bathroom products. Neutral in shops; slightly formal in speech — people usually name specific items.",
    },
  ],

  pronunciationGuide: [
    { word: "towel", ipa: "/ˈtaʊ.əl/", stress: "Stress on first syllable" },
    { word: "sink", ipa: "/sɪŋk/", stress: "Single syllable word" },
    { word: "shower", ipa: "/ˈʃaʊ.ər/", stress: "Stress on first syllable" },
    { word: "toothbrush", ipa: "/ˈtuːθ.brʌʃ/", stress: "Stress on first syllable" },
    { word: "soap", ipa: "/səʊp/", stress: "Single syllable word" },
    { word: "bathtub", ipa: "/ˈbɑːθ.tʌb/", stress: "Stress on first syllable" },
    { word: "tap", ipa: "/tæp/", stress: "Single syllable word" },
    { word: "razor", ipa: "/ˈreɪ.zər/", stress: "Stress on first syllable" },
    { word: "sponge", ipa: "/spʌndʒ/", stress: "Single syllable word" },
    { word: "mirror", ipa: "/ˈmɪr.ər/", stress: "Stress on first syllable" },
  ],

  priorityTiers: {
    essential: ["toilet", "sink", "shower", "bathtub", "mirror", "towel"],
    important: ["toothbrush", "soap", "faucet", "shampoo", "toilet paper", "mat"],
    goodToKnow: ["drain", "curtain", "cabinet", "plunger"],
  },

  visualVocabularyMap: [
    {
      category: "Washing & Bathing",
      emoji: "🚿",
      items: [
        { word: "bathtub", related: ["bath", "bubble bath", "bath mat"] },
        { word: "shower", related: ["showerhead", "shower curtain", "shower gel"] },
        { word: "soap", related: ["bar of soap", "liquid soap", "soap dish"] },
        { word: "shampoo", related: ["conditioner", "body wash", "lotion"] },
      ],
    },
    {
      category: "Dental Care",
      emoji: "🪥",
      items: [
        { word: "toothbrush", related: ["electric toothbrush", "bristles"] },
        { word: "toothpaste", related: ["fluoride", "mint flavour"] },
        { word: "floss", related: ["dental floss", "flossing"] },
        { word: "mouthwash", related: ["rinse", "gargle"] },
      ],
    },
    {
      category: "Fixtures & Fittings",
      emoji: "🚽",
      items: [
        { word: "toilet", related: ["seat", "lid", "flush", "bowl"] },
        { word: "sink", related: ["basin", "tap/faucet", "drain", "plug"] },
        { word: "mirror", related: ["cabinet", "vanity"] },
        { word: "towel rack", related: ["hook", "ring", "rail"] },
      ],
    },
    {
      category: "Products & Accessories",
      emoji: "🧴",
      items: [
        { word: "towel", related: ["bath towel", "hand towel", "face cloth"] },
        { word: "razor", related: ["blade", "shaving cream/foam"] },
        { word: "hairdryer", related: ["blow dryer", "diffuser"] },
        { word: "scale", related: ["bathroom scale", "weighing scale"] },
      ],
    },
  ],

  collocations: [
    {
      phrase: "take a shower",
      variations: "take a hot/cold/quick shower, take a long shower",
      example: "I always take a quick shower before breakfast.",
    },
    {
      phrase: "run a bath",
      variations: "run a warm/hot bath, run a bath for someone",
      example: "She ran a warm bath after a tiring day at work.",
    },
    {
      phrase: "brush your teeth",
      variations: "brush your teeth twice a day, brush your teeth thoroughly",
      example: "The dentist recommends brushing your teeth for two minutes.",
    },
    {
      phrase: "flush the toilet",
      variations: "flush the toilet after use, forget to flush the toilet",
      example: "Please remember to flush the toilet when you're finished.",
    },
    {
      phrase: "turn on the tap",
      variations: "turn on/off the tap, leave the tap running, dripping tap",
      example: "Don't leave the tap running while you brush your teeth.",
    },
    {
      phrase: "hang up a towel",
      variations: "hang up a wet/dry towel, hang a towel on the rack",
      example: "Please hang up your towel after using it.",
    },
    {
      phrase: "wash your hands",
      variations: "wash your hands with soap, wash your hands thoroughly",
      example: "Always wash your hands before eating a meal.",
    },
    {
      phrase: "look in the mirror",
      variations: "look in/at the mirror, check the mirror, bathroom mirror",
      example: "He looked in the mirror and noticed he needed a haircut.",
    },
    {
      phrase: "use the sink",
      variations: "use the bathroom/kitchen sink, block the sink, clean the sink",
      example: "The children used the sink to wash the paintbrushes.",
    },
    {
      phrase: "wipe the surface",
      variations: "wipe the surface clean/dry, wipe down a surface",
      example: "She wiped the bathroom surface with a damp cloth.",
    },
  ],

  synonymsAntonyms: [
    { word: "clean", synonym: "spotless", antonym: "dirty" },
    { word: "wet", synonym: "damp", antonym: "dry" },
    { word: "hot", synonym: "warm", antonym: "cold" },
    { word: "full", synonym: "filled", antonym: "empty" },
    { word: "soft", synonym: "gentle", antonym: "hard" },
    { word: "shiny", synonym: "bright", antonym: "dull" },
    { word: "fresh", synonym: "new", antonym: "stale" },
    { word: "quick", synonym: "fast", antonym: "slow" },
  ],

  additionalExercises: {
    matching: [
      { word: "toothbrush", definition: "a small tool with bristles used to clean your teeth" },
      { word: "towel", definition: "a piece of cloth used to dry your body" },
      { word: "mirror", definition: "a glass surface that reflects your image" },
      { word: "shower", definition: "a device that sprays water so you can wash your whole body" },
      { word: "soap", definition: "a substance used with water to clean your skin" },
    ],
    multipleChoice: [
      {
        id: "mc1",
        question: "You use a ______ to dry yourself after a shower.",
        options: ["towel", "mirror", "soap"],
        correctIndex: 0,
      },
      {
        id: "mc2",
        question: "We brush our teeth with a ______.",
        options: ["soap", "toothbrush", "towel"],
        correctIndex: 1,
      },
      {
        id: "mc3",
        question: "You look at your face in the ______.",
        options: ["mirror", "shower", "soap"],
        correctIndex: 0,
      },
      {
        id: "mc4",
        question: "Before you leave the bathroom, you should turn off the ______.",
        options: ["mirror", "shower", "towel"],
        correctIndex: 1,
      },
      {
        id: "mc5",
        question: "We wash our hands with water and ______.",
        options: ["soap", "mirror", "towel"],
        correctIndex: 0,
      },
    ],
    rewrite: [
      {
        id: "rw1",
        sentence: "I have a shower every morning. (USUALLY)",
        hintWord: "USUALLY",
        answer: "I usually have a shower every morning.",
      },
      {
        id: "rw2",
        sentence: "This towel is bigger than that one. (THAN)",
        hintWord: "THAN",
        answer: "This towel is bigger than that one.",
      },
      {
        id: "rw3",
        sentence: "Someone cleans the bathroom every day. (IS)",
        hintWord: "IS",
        answer: "The bathroom is cleaned every day.",
      },
      {
        id: "rw4",
        sentence: "I have used this toothbrush for two months. (FOR)",
        hintWord: "FOR",
        answer: "I have used this toothbrush for two months.",
      },
      {
        id: "rw5",
        sentence: "If it rains, we won't go swimming. (IF)",
        hintWord: "IF",
        answer: "If it rains, we will not go swimming.",
      },
    ],
  },

  collocationsQuiz: [
    {
      id: "cq1",
      question: "__________ a bath",
      options: ["make", "take", "do", "get"],
      correctIndex: 1,
      explanation: "'take a bath' (US) or 'have a bath' (UK).",
    },
    {
      id: "cq2",
      question: "__________ the toilet",
      options: ["pull", "push", "flush", "wash"],
      correctIndex: 2,
      explanation: "'flush the toilet' is the standard collocation.",
    },
    {
      id: "cq3",
      question: "__________ your teeth",
      options: ["clean", "wash", "brush", "scrub"],
      correctIndex: 2,
      explanation: "'brush your teeth' is the natural phrase.",
    },
    {
      id: "cq4",
      question: "__________ a shower",
      options: ["make", "take", "do", "give"],
      correctIndex: 1,
      explanation: "'take a shower' (US) or 'have a shower' (UK).",
    },
    {
      id: "cq5",
      question: "__________ the tap",
      options: ["open", "turn on", "start", "switch"],
      correctIndex: 1,
      explanation: "'turn on/off the tap' is standard.",
    },
    {
      id: "cq6",
      question: "__________ your hands",
      options: ["clean", "wash", "rinse", "all correct"],
      correctIndex: 3,
      explanation: "wash (with soap), rinse (with water), clean (general).",
    },
    {
      id: "cq7",
      question: "hot __________ water",
      options: ["flowing", "running", "moving", "going"],
      correctIndex: 1,
      explanation: "'hot running water' is the standard phrase.",
    },
  ],

  errorCorrection: [
    {
      id: "ec1",
      wrong: "I brushed my teeth with a comb this morning.",
      right: "I brushed my teeth with a toothbrush this morning.",
    },
    {
      id: "ec2",
      wrong: "She washed her hair with soap in the shower.",
      right: "She washed her hair with shampoo in the shower.",
    },
    {
      id: "ec3",
      wrong: "He dried his hands with a sponge after washing them.",
      right: "He dried his hands with a towel after washing them.",
    },
    {
      id: "ec4",
      wrong: "I took a shower in the kitchen sink this evening.",
      right: "I took a shower in the bathtub this evening.",
    },
    {
      id: "ec5",
      wrong: "There is a big mirror above the stove in the bathroom.",
      right: "There is a big mirror above the sink in the bathroom.",
    },
  ],

  writingPrompts: [
    {
      id: "wp1",
      type: "short",
      title: "Short Writing Task",
      prompt: "Describe your bathroom at home in 2-3 sentences. What items are in it?",
    },
    {
      id: "wp2",
      type: "paragraph",
      title: "Guided Paragraph",
      prompt:
        "Write a paragraph (5-7 sentences) about your daily bathroom routine in the morning. Explain what you do first, next, and last, and how long it takes.",
    },
    {
      id: "wp3",
      type: "creative",
      title: "Creative Challenge",
      prompt:
        "Imagine you are designing a bathroom for a treehouse. Describe what special items you would include and why.",
      suggestedVocabulary: [
        "sink",
        "mirror",
        "toothbrush",
        "towel",
        "shower",
        "bathtub",
        "soap",
        "toilet",
      ],
    },
  ],

  selfAssessment: [
    {
      wordPair: "bathtub / shower",
      question: "Can you describe the difference and say which you prefer?",
    },
    {
      wordPair: "toilet / sink",
      question: "Can you explain these to a plumber or hotel receptionist?",
    },
    {
      wordPair: "toothbrush / toothpaste",
      question: "Can you ask for these in a shop if you forgot yours while travelling?",
    },
    {
      wordPair: "towel",
      question: "Can you ask for different types? (bath towel, hand towel, face cloth)",
    },
    {
      wordPair: "soap / shampoo / conditioner",
      question: "Can you name all three and explain what each is for?",
    },
    { wordPair: "tap / faucet", question: "Can you use the right word for UK vs US English?" },
    {
      wordPair: "mirror / cabinet",
      question: "Can you describe your bathroom to a friend using these words?",
    },
    { wordPair: "drain / plug", question: "Can you explain a plumbing problem using these words?" },
  ],

  subtopics: [
    {
      id: "fixtures-fittings",
      title: "Fixtures & Fittings",
      wordIds: [
        "bathtub",
        "shower",
        "toilet",
        "sink",
        "faucet",
        "drain",
        "mirror",
        "towel-rack",
        "cabinet",
        "tiles",
      ],
    },
    {
      id: "toiletries",
      title: "Toiletries",
      wordIds: [
        "soap",
        "shampoo",
        "conditioner",
        "toothbrush",
        "toothpaste",
        "towel",
        "comb",
        "hairbrush",
        "lotion",
        "deodorant",
      ],
    },
    {
      id: "bathroom-supplies",
      title: "Bathroom Supplies",
      wordIds: [
        "toilet-paper",
        "cotton-balls",
        "cotton-swab",
        "razor",
        "nail-clipper",
        "hair-dryer",
        "scale",
        "laundry-basket",
        "first-aid-kit",
        "thermometer",
      ],
    },
    {
      id: "bath-shower",
      title: "Bath & Shower",
      wordIds: [
        "bath-mat",
        "shower-curtain",
        "shower-head",
        "bath-towel",
        "hand-towel",
        "washcloth",
        "soap-dish",
        "shampoo-bottle",
        "rubber-duck",
        "shower-gel",
      ],
    },
    {
      id: "personal-care",
      title: "Personal Care",
      wordIds: [
        "face-cream",
        "sunscreen",
        "lip-balm",
        "hand-soap",
        "body-wash",
        "mouthwash",
        "dental-floss",
        "face-wash",
        "hand-sanitizer",
        "wet-wipes",
      ],
    },
    {
      id: "cleaning-items",
      title: "Cleaning Items",
      wordIds: [
        "sponge",
        "brush",
        "bucket",
        "gloves",
        "spray-bottle",
        "cloth",
        "plunger",
        "squeegee",
        "tissue",
        "wash-hands",
        "brush-teeth",
        "take-shower",
        "dry-off",
        "flush",
        "comb-hair",
        "apply-lotion",
        "gargle",
      ],
    },
  ],

  passage: {
    title: "Reading Passage",
    level: "B1",
    text: "Every morning starts in the bathroom. You turn on the faucet at the sink to wash your hands with hand soap and warm water. Then you squeeze toothpaste onto your toothbrush and brush your teeth for two minutes. After that, you might gargle with mouthwash to keep your breath fresh. Next, it is time for a shower. You step into the bathtub, pull the shower curtain closed, and adjust the shower head. You use shower gel or body wash to clean your body, and shampoo followed by conditioner for your hair. When you are finished, you dry off with a bath towel and step onto the bath mat. In front of the mirror, you comb your hair with a comb or hairbrush. Many people apply lotion or face cream to keep their skin soft. Others use deodorant and sunscreen before getting dressed. The cabinet above the sink holds everyday items like dental floss, cotton swabs, a razor, and nail clippers. It is important to keep the bathroom clean. A sponge and spray bottle help wipe down the tiles and sink. The laundry basket collects used towels and washcloths, and the plunger stays beside the toilet — just in case.",
    questions: [
      {
        id: "bathroom-q1",
        question: "What do you use to brush your teeth?",
        options: [
          "A toothbrush and toothpaste",
          "Dental floss and mouthwash",
          "A washcloth and hand soap",
          "A comb and a hairbrush",
        ],
        correctIndex: 0,
        explanation:
          "The passage says you squeeze toothpaste onto your toothbrush and brush for two minutes. Mouthwash comes after, and floss cleans between teeth rather than brushing them.",
      },
      {
        id: "bathroom-q2",
        question: "What is the purpose of the shower curtain?",
        options: [
          "To dry your body when you step out",
          "To keep water inside while you shower",
          "To stop the mirror from fogging up",
          "To hold towels and washcloths",
        ],
        correctIndex: 1,
        explanation:
          "You pull the shower curtain closed before showering, which keeps the water in the bathtub. Drying off is what the bath towel is for.",
      },
      {
        id: "bathroom-q3",
        question: "Which three items are in the cabinet above the sink?",
        options: [
          "A bath mat, a laundry basket, and a plunger",
          "A shower head, tiles, and a bathtub",
          "Dental floss, cotton swabs, and a razor",
          "A hair dryer, a scale, and a rubber duck",
        ],
        correctIndex: 2,
        explanation:
          "The passage lists dental floss, cotton swabs, a razor, and nail clippers as the everyday items kept in the cabinet above the sink.",
      },
      {
        id: "bathroom-q4",
        question: "According to the passage, how do you keep the bathroom clean?",
        options: [
          "By wiping down the tiles and sink with a sponge and spray bottle",
          "By keeping the plunger beside the toilet",
          "By leaving the shower curtain open to dry",
          "By applying lotion and face cream every day",
        ],
        correctIndex: 0,
        explanation:
          "A sponge and spray bottle are what the passage names for wiping down the tiles and sink. The plunger is kept nearby just in case, not for cleaning.",
      },
      {
        id: "bathroom-q5",
        question: "What goes in the laundry basket?",
        options: [
          "Shampoo and conditioner bottles",
          "Cotton balls and cotton swabs",
          "The bath mat and the shower curtain",
          "Used towels and washcloths",
        ],
        correctIndex: 3,
        explanation: "The passage says the laundry basket collects used towels and washcloths.",
      },
    ],
  },

  phrases: [
    {
      id: "throw-in-the-towel",
      phrase: "throw in the towel",
      kind: "idiom",
      meaning: "To give up.",
      example: "After three failed attempts, she threw in the towel.",
    },
    {
      id: "clean-up-your-act",
      phrase: "clean up your act",
      kind: "idiom",
      meaning: "To improve your behavior.",
      example: "You need to clean up your act before the interview.",
    },
    {
      id: "come-clean",
      phrase: "come clean",
      kind: "phrasal-verb",
      meaning: "To admit the truth.",
      example: "He finally came clean about breaking the vase.",
    },
    {
      id: "wash-your-hands-of",
      phrase: "wash your hands of",
      kind: "idiom",
      meaning: "To refuse responsibility.",
      example: "She washed her hands of the whole project.",
    },
    {
      id: "down-the-drain",
      phrase: "down the drain",
      kind: "idiom",
      meaning: "Wasted.",
      example: "All that hard work went down the drain.",
    },
    {
      id: "scrub-up-well",
      phrase: "scrub up well",
      kind: "idiom",
      meaning: "To look attractive after cleaning up.",
      example: "He really scrubs up well for formal events.",
    },
    {
      id: "soak-in",
      phrase: "soak in",
      kind: "phrasal-verb",
      meaning: "To absorb or enjoy slowly.",
      example: "She loves to soak in a hot bath after work.",
    },
    {
      id: "freshen-up",
      phrase: "freshen up",
      kind: "phrasal-verb",
      meaning: "To wash and tidy yourself quickly.",
      example: "Let me freshen up before we go out.",
    },
    {
      id: "dry-off",
      phrase: "dry off",
      kind: "phrasal-verb",
      meaning: "To remove water from your body.",
      example: "Dry off with a towel before stepping out.",
    },
    {
      id: "wipe-down",
      phrase: "wipe down",
      kind: "phrasal-verb",
      meaning: "To clean a surface.",
      example: "Please wipe down the sink after you use it.",
    },
  ],

  dialogue: {
    title: "Getting Ready in the Morning",
    lines: [
      { speaker: "Mom", text: "Did you brush your teeth yet?" },
      {
        speaker: "Ali",
        text: "Yes, I used the toothbrush and toothpaste. And I even used mouthwash!",
      },
      { speaker: "Mom", text: "Good. Don't forget to comb your hair. The comb is in the cabinet." },
      { speaker: "Ali", text: "I know. Can I take a shower first? Where's the shower gel?" },
      {
        speaker: "Mom",
        text: "It's on the shelf in the bathtub, next to the shampoo. Use the bath mat when you step out.",
      },
      { speaker: "Ali", text: "OK. And can I use the hair dryer after?" },
      {
        speaker: "Mom",
        text: "Of course. Just dry off with a towel first. And put your dirty clothes in the laundry basket.",
      },
      { speaker: "Ali", text: "Got it. I'll be ready in ten minutes!" },
    ],
  },

  mistakes: [
    {
      id: "wash-vs-brush-teeth",
      wrong: "I wash my teeth every morning.",
      right: "I brush my teeth every morning.",
      note: "In English, we 'brush' teeth, not 'wash' them.",
    },
    {
      id: "bath-shower",
      wrong: "I want to take a bath shower.",
      right: "I want to take a shower. / I want to take a bath.",
      note: "A shower and a bath are different. Choose one.",
    },
    {
      id: "paste-of-teeth",
      wrong: "Give me the paste of teeth.",
      right: "Give me the toothpaste.",
      note: "'Toothpaste' is one compound word, not translated word by word.",
    },
    {
      id: "hairbrush-vs-hair-dryer",
      wrong: "She dried her hair with the hairbrush.",
      right: "She dried her hair with the hair dryer.",
      note: "A hairbrush is for brushing. A hair dryer is for drying.",
    },
    {
      id: "glass-vs-mirror",
      wrong: "I looked at me in the glass.",
      right: "I looked at myself in the mirror.",
      note: "Use 'mirror' (not 'glass') and 'myself' (reflexive pronoun).",
    },
    {
      id: "open-the-faucet",
      wrong: "Please open the faucet.",
      right: "Please turn on the faucet.",
      note: "We 'turn on' or 'turn off' a faucet, not 'open' or 'close' it.",
    },
  ],

  wordFormation: [
    { noun: "cleanliness", verb: "clean", adjective: "clean", adverb: "cleanly" },
    { noun: "wash", verb: "wash", adjective: "washable", adverb: null },
    { noun: "shower", verb: "shower", adjective: "showered", adverb: null },
    { noun: "brush", verb: "brush", adjective: "brushed", adverb: null },
    { noun: "towel", verb: "towel (off)", adjective: "toweled", adverb: null },
    { noun: "drain", verb: "drain", adjective: "drained", adverb: null },
    { noun: "soap", verb: "soap", adjective: "soapy", adverb: null },
    { noun: "moisture", verb: "moisturize", adjective: "moist", adverb: "moistly" },
    { noun: "comb", verb: "comb", adjective: "combed", adverb: null },
    { noun: "freshness", verb: "freshen", adjective: "fresh", adverb: "freshly" },
  ],

  blankExercises: [
    {
      id: "bathroom-b1",
      sentence: "I squeeze ____ onto my toothbrush every morning.",
      answer: "toothpaste",
    },
    {
      id: "bathroom-b2",
      sentence: "Don't forget to close the ____ curtain before you turn on the water.",
      answer: "shower",
    },
    {
      id: "bathroom-b3",
      sentence: "She dried her hair with the ____ after her shower.",
      answer: "hair dryer",
    },
    {
      id: "bathroom-b4",
      sentence: "Put the dirty towels in the ____ basket, please.",
      answer: "laundry",
    },
    {
      id: "bathroom-b5",
      sentence: "He stepped out of the bathtub onto the bath ____.",
      answer: "mat",
    },
    {
      id: "bathroom-b6",
      sentence: "Use ____ to clean between your teeth after brushing.",
      answer: "dental floss",
    },
    {
      id: "bathroom-b7",
      sentence: "The ____ above the sink shows your reflection.",
      answer: "mirror",
    },
    {
      id: "bathroom-b8",
      sentence: "Turn on the ____ to get hot or cold water from the sink.",
      answer: "faucet",
    },
    {
      id: "bathroom-b9",
      sentence: "She keeps her ____ and conditioner on the shelf in the shower.",
      answer: "shampoo",
    },
    {
      id: "bathroom-b10",
      sentence: "After your shower, ____ off with a clean towel.",
      answer: "dry",
    },
  ],

  culturalNotes: [
    {
      id: "bre-vs-ame",
      title: "British vs American Vocabulary",
      body: 'British: "tap" / American: "faucet". British: "bath" (verb) / American: "take a bath". British: "flannel" / American: "washcloth". British: "loo" or "toilet" / American: "bathroom" or "restroom".',
    },
    {
      id: "bathroom-restroom-toilet",
      title: "Bathroom vs Restroom vs Toilet",
      body: "In American English, 'bathroom' refers to the room at home. In public, people say 'restroom'. In British English, 'toilet' is the standard word. Asking for the 'toilet' in the US can sound too direct.",
    },
    {
      id: "compound-words",
      title: "Compound Words",
      body: "Many bathroom items are compound words: toothbrush, toothpaste, hairbrush, washcloth, bathtub, shower head. Learning them as units (not word-by-word) is essential.",
    },
    {
      id: "morning-routine-verbs",
      title: "Morning Routine Verbs",
      body: "English has specific verb + noun pairs: brush teeth (not wash), comb hair (not brush hair, unless using a hairbrush), take a shower (not make a shower), turn on the faucet (not open).",
    },
    {
      id: "formal-vs-informal",
      title: "Formal vs Informal",
      body: '"Wash up" (informal) = wash your hands and face. "Freshen up" (polite) = go to the bathroom to tidy yourself. "Use the facilities" (very formal) = go to the toilet.',
    },
  ],

  wordMeta: [
    {
      word: "towel",
      partOfSpeech: "n",
      frequency: 3,
      collocations: ["bath ~", "hand ~", "~ rack", "dry with a ~"],
    },
    {
      word: "shower",
      partOfSpeech: "n / v",
      frequency: 3,
      collocations: ["take a ~", "~ gel", "~ head", "hot ~"],
    },
    {
      word: "soap",
      partOfSpeech: "n",
      frequency: 3,
      collocations: ["bar of ~", "hand ~", "~ dish", "~ dispenser"],
    },
    {
      word: "faucet",
      partOfSpeech: "n",
      frequency: 2,
      collocations: ["turn on/off the ~", "hot water ~", "dripping ~"],
    },
    {
      word: "mirror",
      partOfSpeech: "n",
      frequency: 3,
      collocations: ["look in the ~", "bathroom ~", "side ~"],
    },
    {
      word: "shampoo",
      partOfSpeech: "n / v",
      frequency: 2,
      collocations: ["~ bottle", "~ and conditioner", "~ your hair"],
    },
    {
      word: "toothbrush",
      partOfSpeech: "n",
      frequency: 3,
      collocations: ["electric ~", "~ holder", "~ and toothpaste"],
    },
    {
      word: "drain",
      partOfSpeech: "n / v",
      frequency: 2,
      collocations: ["clogged ~", "~ the water", "down the ~"],
    },
    {
      word: "bathtub",
      partOfSpeech: "n",
      frequency: 2,
      collocations: ["fill the ~", "sit in the ~", "~ drain"],
    },
    {
      word: "razor",
      partOfSpeech: "n",
      frequency: 2,
      collocations: ["safety ~", "electric ~", "disposable ~", "~ blade"],
    },
  ],
};
