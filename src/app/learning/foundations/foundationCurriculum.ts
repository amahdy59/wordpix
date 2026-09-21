import { validateFoundationCurriculum } from "./foundationCurriculumSchema.ts";
import { PRONUNCIATION_LESSON_DRAFTS } from "./pronunciationCurriculum.ts";

export const FOUNDATION_CURRICULUM_SCHEMA_VERSION = 1 as const;

export type FoundationLessonId =
  | "same-or-different"
  | "count-words"
  | "clap-syllables"
  | "rhyme-recognition"
  | "same-beginning"
  | "first-sound"
  | "final-sound"
  | "blend-and-segment"
  | "sound-s"
  | "short-a"
  | "sound-t"
  | "sound-p"
  | "blend-satp"
  | "read-satp"
  | "spell-satp"
  | "satp-mastery"
  | "pronunciation-goals"
  | "meaningful-contrasts"
  | "clear-word-endings"
  | "consonant-sequences"
  | "word-stress"
  | "syllable-prominence"
  | "vowel-clarity"
  | "important-information"
  | "meaning-chunks"
  | "connected-speech"
  | "communication-repair"
  | "pronunciation-portfolio";

export type CurriculumReviewStatus = "approved" | "pilot" | "draft";
export type CurriculumCompletionMode = "score-threshold" | "qualitative-routing";

export interface FoundationModel {
  audio: string;
  explanation: string;
  image?: { src: string; alt: string };
  tiles?: readonly string[];
}

export interface FoundationQuestion {
  prompt: string;
  audio: string;
  responseMode?: "choice" | "rhythm" | "ordering";
  display?: string;
  imageReveal?: "always" | "after-answer";
  options: readonly {
    value: string;
    label: string;
    audio?: string;
    image?: { src: string; alt: string };
    mediaKind?: "photo" | "symbol";
  }[];
  answer: string;
  correctFeedback: string;
  support: readonly [string, string];
  visual?: "counters" | "beats" | "sound-chips" | "letter-tiles";
}

export interface FoundationLesson {
  id: FoundationLessonId;
  level: number;
  unitId: string;
  number: number;
  title: string;
  shortTitle: string;
  goal: string;
  instruction: string;
  audioOnly: boolean;
  prerequisites: readonly FoundationLessonId[];
  masteryThreshold: number;
  completionMode: CurriculumCompletionMode;
  reviewStatus: CurriculumReviewStatus;
  evidenceDimensions: readonly string[];
  nonGoals: readonly string[];
  models: readonly FoundationModel[];
  questions: readonly FoundationQuestion[];
}

export type FoundationLessonDraft = Omit<
  FoundationLesson,
  | "prerequisites"
  | "masteryThreshold"
  | "completionMode"
  | "reviewStatus"
  | "evidenceDimensions"
  | "nonGoals"
> &
  Partial<
    Pick<
      FoundationLesson,
      | "prerequisites"
      | "masteryThreshold"
      | "completionMode"
      | "reviewStatus"
      | "evidenceDimensions"
      | "nonGoals"
    >
  >;

export interface FoundationPictureWord {
  word: string;
  src: string;
}

const countOptions = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => ({
    value: String(index + from),
    label: String(index + from),
  }));
const choiceImages: Readonly<Record<string, string>> = {
  ant: "/word-images/garden/ant.avif",
  cap: "/word-images/accessories-jewelry/cap.avif",
  cat: "/word-images/pet-shop/cat.avif",
  cup: "/word-images/kitchen/cup.avif",
  dog: "/word-images/pet-shop/dog.avif",
  dish: "/word-images/casserole-dish.webp",
  duck: "/word-images/farm/duck.avif",
  fan: "/foundation-images/fan-photorealistic-v1.avif",
  fish: "/foundation-images/fish-photorealistic-v1.avif",
  hen: "/word-images/farm/hen.avif",
  log: "/word-images/forest/log.avif",
  bed: "/word-images/bedroom/bed.avif",
  map: "/word-images/camping-site/map.avif",
  moon: "/word-images/observatory/moon.avif",
  pan: "/word-images/kitchen/pan.avif",
  pat: "/word-images/hand-actions/pat.avif",
  pen: "/word-images/classroom/pen.avif",
  pig: "/word-images/farm/pig.avif",
  red: "/word-images/colors/red.avif",
  rock: "/word-images/camping-site/rock.avif",
  seal: "/word-images/arctic/seal.avif",
  sock: "/word-images/everyday-clothing/socks.avif",
  soup: "/word-images/restaurant/soup.avif",
  sun: "/foundation-images/sun-photorealistic-v1.avif",
  tap: "/word-images/hand-actions/tap.avif",
  ten: "/word-images/numbers-counting/ten.avif",
  tiger: "/word-images/zoo/tiger.avif",
  top: "/word-images/toys-games/top.avif",
  wig: "/word-images/costume-shop/wig.avif",
};
const nonPhotographicChoices = new Set(["luck", "sat"]);
const spokenOptions = (...words: string[]): FoundationQuestion["options"] =>
  words.map((word, index) => {
    const image = choiceImages[word];
    if (!image && !nonPhotographicChoices.has(word)) {
      throw new Error(`Foundation spoken choice "${word}" needs a relevant photo.`);
    }
    return {
      value: String(index + 1),
      label: word,
      audio: word,
      mediaKind: image ? ("photo" as const) : ("symbol" as const),
      ...(image ? { image: { src: image, alt: word } } : {}),
    };
  });
const symbolicOptions = (...sounds: string[]): FoundationQuestion["options"] =>
  sounds.map((sound, index) => ({
    value: String(index + 1),
    label: sound,
    audio: sound,
    mediaKind: "symbol",
  }));
const help = (detail: string): readonly [string, string] => [
  "Listen again. Take your time.",
  detail,
];
const basic = (
  prompt: string,
  audio: string,
  answer: string,
  options: FoundationQuestion["options"],
  feedback: string,
  detail: string,
  visual?: FoundationQuestion["visual"]
): FoundationQuestion => ({
  prompt,
  audio,
  answer,
  options,
  correctFeedback: feedback,
  support: help(detail),
  visual,
});

const sameDifferentQuestions = [
  ["map. map.", "same"],
  ["dog. log.", "different"],
  ["fan. fan.", "same"],
  ["sock. sun.", "different"],
  ["cat. cap.", "different"],
  ["pen. pen.", "same"],
  ["pen. pin.", "different"],
  ["fish. fan.", "different"],
  ["hat. hat.", "same"],
  ["cup. bus.", "different"],
  ["map. mat.", "different"],
  ["log. log.", "same"],
] as const;

const countQuestions = [
  ["Birds fly.", "2"],
  ["Sam can run.", "3"],
  ["The sun is hot.", "4"],
  ["Dogs play.", "2"],
  ["I see fish.", "3"],
  ["Dad has a cup.", "4"],
  ["A fish can swim.", "4"],
  ["We see the red bus.", "5"],
  ["The little dog can jump.", "5"],
] as const;

const syllableQuestions = [
  ["sun", "1"],
  ["window", "2"],
  ["ladybug", "3"],
  ["helicopter", "4"],
  ["fish", "1"],
  ["robot", "2"],
  ["telephone", "3"],
  ["baby", "2"],
  ["kangaroo", "3"],
  ["macaroni", "4"],
  ["butterfly", "3"],
  ["superhero", "4"],
] as const;

const rhymeQuestions = [
  ["dog", "log", "sun", "1"],
  ["pen", "cup", "hen", "2"],
  ["fish", "dish", "map", "1"],
  ["map", "cap", "dog", "1"],
  ["sock", "fan", "rock", "2"],
  ["bed", "red", "cup", "1"],
  ["pig", "wig", "map", "1"],
  ["duck", "fish", "luck", "2"],
] as const;

const beginningQuestions = [
  ["sun. sock. map.", "1"],
  ["fish. fan. dog.", "1"],
  ["map. moon. cat.", "1"],
  ["cat. sun. cup.", "2"],
  ["dog. fish. door.", "2"],
  ["fan. moon. fish.", "2"],
  ["seal. soup. map.", "1"],
  ["kite. fan. key.", "2"],
  ["mug. fish. mop.", "2"],
] as const;

const firstQuestions = [
  ["sock", "sss", "fff", "1"],
  ["fan", "mmm", "fff", "2"],
  ["moon", "mmm", "sss", "1"],
  ["cat", "k", "d", "1"],
  ["fish", "fff", "mmm", "1"],
  ["dog", "k", "d", "2"],
  ["soap", "sss", "fff", "1"],
  ["duck", "mmm", "d", "2"],
] as const;

const finalQuestions = [
  ["jam", "mmm", "nnn", "1"],
  ["bus", "sss", "fff", "1"],
  ["leaf", "fff", "mmm", "1"],
  ["cat", "p", "t", "2"],
  ["gum", "mmm", "nnn", "1"],
  ["pen", "nnn", "sss", "1"],
  ["map", "t", "p", "2"],
  ["duck", "k", "t", "1"],
] as const;

const blendSegmentQuestions = [
  ["sss. aaa. t.", "sat", "fan", "1", "blend"],
  ["fan", "", "", "3", "count"],
  ["mmm. aaa. nnn.", "map", "man", "2", "blend"],
  ["sit", "", "", "3", "count"],
  ["fff. iii. nnn.", "fin", "fun", "1", "blend"],
  ["map", "", "", "3", "count"],
  ["aaa. mmm.", "am", "at", "1", "blend"],
  ["at", "", "", "2", "count"],
] as const;

const soundLesson = (
  id: "sound-s" | "short-a" | "sound-t" | "sound-p",
  number: number,
  lower: string,
  upper: string,
  sound: string,
  pairs: readonly (readonly [string, string])[]
): FoundationLessonDraft => ({
  id,
  level: 1,
  unitId: "1.1",
  number,
  title: id === "short-a" ? "Hear and Connect Short a" : `Hear and Connect ${lower}`,
  shortTitle: id === "short-a" ? "Short a" : `Sound ${lower}`,
  goal: `Hear ${sound} and connect it to ${lower} and ${upper}.`,
  instruction: `Listen for ${sound}, then connect the sound to the letter shape.`,
  audioOnly: false,
  models: [
    {
      audio: `Listen for ${sound}, as in ${pairs[0][0]}.`,
      explanation: `In today's words, ${lower} represents ${sound}.`,
      tiles: [lower, upper],
    },
  ],
  questions: [
    ...pairs.map(([yes, no]) =>
      basic(
        `Which spoken word contains ${sound}?`,
        `Listen for ${sound}, as in ${pairs[0][0]}.`,
        "1",
        spokenOptions(yes, no),
        `Yes. ${yes} contains ${sound}.`,
        `Listen again for ${sound}.`,
        "letter-tiles"
      )
    ),
    basic(
      `Which letter represents ${sound}?`,
      `Find the letter for ${sound}.`,
      lower,
      [
        { value: lower, label: lower },
        { value: lower === "a" ? "s" : "a", label: lower === "a" ? "s" : "a" },
      ],
      `Yes. ${lower} represents ${sound}.`,
      `Look at the ${lower} tile again.`,
      "letter-tiles"
    ),
    basic(
      `Which sound does ${upper} represent?`,
      `Look at capital ${upper}.`,
      sound,
      [
        { value: sound, label: sound },
        { value: "other", label: lower === "a" ? "sss" : "short a" },
      ],
      `Yes. ${upper} represents ${sound}.`,
      `Match ${upper} with lowercase ${lower}.`,
      "letter-tiles"
    ),
  ],
});

const FOUNDATION_LESSON_DRAFTS: readonly FoundationLessonDraft[] = [
  {
    id: "same-or-different",
    level: 0,
    unitId: "0.1",
    number: 1,
    title: "Same or Different?",
    shortTitle: "Same or Different",
    audioOnly: true,
    goal: "Are the two words the same or different?",
    instruction: "Listen to both words from start to finish.",
    models: [
      {
        audio: "sun. sun.",
        explanation: "Those are the same word.",
        image: {
          src: "/foundation-images/sun-photorealistic-v1.avif",
          alt: "Bright sun in a clear blue sky",
        },
      },
      {
        audio: "cat. fish.",
        explanation: "Those are different words.",
        image: {
          src: "/word-images/pet-shop/cat.avif",
          alt: "Cat shown after the listening example",
        },
      },
    ],
    questions: sameDifferentQuestions.map(([audio, answer]) =>
      basic(
        "Same word or different words?",
        audio,
        answer,
        [
          { value: "same", label: "Same" },
          { value: "different", label: "Different" },
        ],
        answer === "same" ? "Yes. Those were the same word." : "Yes. Those were different words.",
        "Listen carefully to the beginning and ending of each word."
      )
    ),
  },
  {
    id: "count-words",
    level: 0,
    unitId: "0.1",
    number: 2,
    title: "Count the Words",
    shortTitle: "Count Words",
    audioOnly: true,
    goal: "How many words do you hear?",
    instruction: "Tap once in your mind for every word you hear.",
    models: [{ audio: "Cats sleep.", explanation: "Cats — sleep. Two words.", tiles: ["●", "●"] }],
    questions: countQuestions.map(([audio, answer]) =>
      basic(
        "How many words did you hear?",
        audio,
        answer,
        countOptions(2, 5),
        `Yes. You heard ${answer} words.`,
        "Tap once for each word while the sentence plays.",
        "counters"
      )
    ),
  },
  {
    id: "clap-syllables",
    level: 0,
    unitId: "0.1",
    number: 3,
    title: "Clap the Syllables",
    shortTitle: "Clap Syllables",
    audioOnly: true,
    goal: "How many beats are in the word?",
    instruction: "Clap or tap once for each beat in the word.",
    models: [
      {
        audio: "cat",
        explanation: "Cat has one beat.",
        image: { src: "/word-images/pet-shop/cat.avif", alt: "Cat" },
        tiles: ["👏"],
      },
      { audio: "rabbit", explanation: "Rab-bit has two beats.", tiles: ["👏", "👏"] },
    ],
    questions: syllableQuestions.map(([audio, answer]) =>
      basic(
        "How many beats did you hear?",
        audio,
        answer,
        countOptions(1, 4),
        `Yes. ${answer} ${answer === "1" ? "beat" : "beats"}.`,
        "Say the word slowly and clap each strong beat.",
        "beats"
      )
    ),
  },
  {
    id: "rhyme-recognition",
    level: 0,
    unitId: "0.2",
    number: 4,
    title: "Hear the Rhyme",
    shortTitle: "Rhyme",
    audioOnly: true,
    goal: "Which word has the same ending sound?",
    instruction: "Listen to the end of each word—not just the first sound.",
    models: [
      { audio: "cat. hat.", explanation: "Cat and hat rhyme. Their endings sound the same." },
      { audio: "cat. sun.", explanation: "Cat and sun do not rhyme." },
    ],
    questions: rhymeQuestions.map(([target, first, second, answer]) => ({
      ...basic(
        "Listen for the word with the same ending sound.",
        target,
        answer,
        spokenOptions(first, second),
        "Yes. The endings sound the same.",
        "Listen only to the ending chunk in each word."
      ),
      imageReveal: "always" as const,
    })),
  },
  {
    id: "same-beginning",
    level: 0,
    unitId: "0.3",
    number: 5,
    title: "Same Beginning Sound",
    shortTitle: "Same Beginning",
    audioOnly: true,
    goal: "Which two words start with the same sound?",
    instruction: "Listen closely to the very beginning of all three words.",
    models: [
      { audio: "sun. sock. map.", explanation: "Sun and sock begin with the same sss sound." },
    ],
    questions: beginningQuestions.map(([audio, answer]) =>
      basic(
        "Which pair starts the same?",
        audio,
        answer,
        [
          { value: "1", label: "Words 1 + 2" },
          { value: "2", label: "Words 1 + 3" },
          { value: "3", label: "Words 2 + 3" },
        ],
        "Yes. Those two words begin with the same sound.",
        "Stretch the first sound of each word, then compare them."
      )
    ),
  },
  {
    id: "first-sound",
    level: 0,
    unitId: "0.4",
    number: 6,
    title: "Find the First Sound",
    shortTitle: "First Sound",
    audioOnly: true,
    goal: "What is the first sound?",
    instruction: "Choose a recorded sound. Do not use letter names.",
    models: [
      { audio: "Sun starts with sss.", explanation: "The first sound stretches: sss." },
      { audio: "Map starts with mmm.", explanation: "The first sound is mmm." },
    ],
    questions: firstQuestions.map(([word, first, second, answer]) =>
      basic(
        "Which sound comes first?",
        word,
        answer,
        symbolicOptions(first, second),
        "Yes. You found the first sound.",
        "Focus on the instant the word begins.",
        "sound-chips"
      )
    ),
  },
  {
    id: "final-sound",
    level: 0,
    unitId: "0.4",
    number: 7,
    title: "Find the Final Sound",
    shortTitle: "Final Sound",
    audioOnly: true,
    goal: "What is the last sound?",
    instruction: "Wait until the word is completely finished before answering.",
    models: [
      { audio: "sun ends with nnn.", explanation: "The last sound is nnn." },
      { audio: "cup ends with p.", explanation: "The last sound is a quick p—not puh." },
    ],
    questions: finalQuestions.map(([word, first, second, answer]) =>
      basic(
        "Which sound comes last?",
        word,
        answer,
        symbolicOptions(first, second),
        "Yes. You found the final sound.",
        "Listen to the word's very last moment.",
        "sound-chips"
      )
    ),
  },
  {
    id: "blend-and-segment",
    level: 0,
    unitId: "0.5",
    number: 8,
    title: "Blend and Break Apart",
    shortTitle: "Blend & Segment",
    audioOnly: true,
    goal: "Join sounds. Then break the word apart.",
    instruction: "Use the sound chips: sweep to blend, tap to break apart.",
    models: [
      {
        audio: "mmm. aaa. p. map.",
        explanation: "Sweep the three sounds together to make map.",
        tiles: ["●", "●", "●"],
      },
      {
        audio: "sun. sss. uuu. nnn.",
        explanation: "Tap three chips to break sun apart.",
        tiles: ["●", "●", "●"],
      },
    ],
    questions: blendSegmentQuestions.map(([audio, first, second, answer, kind]) =>
      basic(
        kind === "blend" ? "Which word do the sounds make?" : "How many sounds do you hear?",
        audio,
        answer,
        kind === "blend" ? symbolicOptions(first, second) : countOptions(2, 3),
        kind === "blend" ? "Yes. You blended the sounds." : "Yes. You broke the word into sounds.",
        kind === "blend"
          ? "Sweep the sounds together with a smaller gap."
          : "Tap one chip for each sound.",
        "sound-chips"
      )
    ),
  },
  soundLesson("sound-s", 1, "s", "S", "sss", [
    ["sun", "map"],
    ["sock", "cat"],
    ["soup", "fish"],
    ["seal", "moon"],
  ]),
  soundLesson("short-a", 2, "a", "A", "short a", [
    ["ant", "sock"],
    ["cat", "sun"],
    ["map", "fish"],
    ["sat", "soup"],
  ]),
  soundLesson("sound-t", 3, "t", "T", "t", [
    ["top", "sun"],
    ["tap", "map"],
    ["ten", "pen"],
    ["tiger", "moon"],
  ]),
  soundLesson("sound-p", 4, "p", "P", "p", [
    ["pan", "fan"],
    ["pen", "ten"],
    ["pat", "cat"],
    ["pig", "fish"],
  ]),
  {
    id: "blend-satp",
    level: 1,
    unitId: "1.1",
    number: 5,
    title: "Blend with SATP",
    shortTitle: "Blend SATP",
    audioOnly: false,
    goal: "Join the sounds to read each word.",
    instruction: "Touch each letter, then blend without a long pause.",
    models: [
      {
        audio: "a. t. at.",
        explanation: "Point to a, point to t, then sweep: at.",
        tiles: ["a", "t"],
      },
      {
        audio: "s. a. t. sat.",
        explanation: "Stretch and sweep the sounds together: sat.",
        tiles: ["s", "a", "t"],
      },
    ],
    questions: ["pat", "tap", "sap", "at", "sat", "sap"].map((word) =>
      basic(
        "Blend the letters. Which word did you read?",
        word.split("").join(". "),
        word,
        [word, word === "pat" ? "tap" : "pat"].map((label) => ({ value: label, label })),
        `Yes. You blended ${word}.`,
        "Touch each letter from left to right, then sweep.",
        "letter-tiles"
      )
    ),
  },
  {
    id: "read-satp",
    level: 1,
    unitId: "1.1",
    number: 6,
    title: "Read SATP Words",
    shortTitle: "Read SATP",
    audioOnly: false,
    goal: "Blend and read SATP words.",
    instruction: "Pictures stay hidden until after you read the word.",
    models: [
      {
        audio: "a. t. at. s. a. t. sat.",
        explanation: "Read each sound, then blend continuously.",
        tiles: ["at", "sat"],
      },
    ],
    questions: ["sat", "at", "sap", "pat", "tap", "tap", "sap", "pat"].map((word) => ({
      ...basic(
        "Read this word, then choose what you read.",
        "Read the word on screen.",
        word,
        [word, word === "sat" ? "sap" : "sat"].map((label) => ({ value: label, label })),
        `Yes: ${word}. You read from left to right.`,
        "Say each sound, then sweep them together.",
        "letter-tiles"
      ),
      display: word,
    })),
  },
  {
    id: "spell-satp",
    level: 1,
    unitId: "1.1",
    number: 7,
    title: "Spell SATP Words",
    shortTitle: "Spell SATP",
    audioOnly: false,
    goal: "Build the word with letter tiles.",
    instruction: "Listen first. Choose the tiles in left-to-right order.",
    models: [
      { audio: "at", explanation: "I hear short a, t. I build a-t.", tiles: ["a", "t"] },
      {
        audio: "sat",
        explanation: "I hear sss, short a, t. I build s-a-t.",
        tiles: ["s", "a", "t"],
      },
    ],
    questions: ["pat", "tap", "sap", "sat", "at", "sap", "pat", "tap"].map((word) =>
      basic(
        "Which tiles spell the word you heard?",
        word,
        word,
        [word, word.split("").reverse().join("")].map((label) => ({
          value: label,
          label: label.split("").join("  "),
        })),
        `Yes. You built ${word}.`,
        "Tap one sound box, then choose its matching letter.",
        "letter-tiles"
      )
    ),
  },
  {
    id: "satp-mastery",
    level: 1,
    unitId: "1.1",
    number: 8,
    title: "SATP Review and Mastery",
    shortTitle: "SATP Mastery",
    audioOnly: false,
    goal: "Show what you know about s, a, t, and p.",
    instruction: "There is no timer. Listen or look carefully and take your time.",
    models: [
      {
        audio: "s. a. t. p.",
        explanation: "You will hear sounds, map letters, read, and spell.",
        tiles: ["s", "a", "t", "p"],
      },
    ],
    questions: [
      basic(
        "Which sound starts sap?",
        "sap",
        "1",
        symbolicOptions("sss", "p"),
        "Yes. Sap starts with sss.",
        "Listen to the start of sap."
      ),
      basic(
        "Which letter represents p?",
        "Find the letter for p.",
        "p",
        [
          { value: "t", label: "t" },
          { value: "p", label: "p" },
        ],
        "Yes. p represents the quick p sound.",
        "Feel the quick puff in p.",
        "letter-tiles"
      ),
      {
        ...basic(
          "Read the printed word.",
          "Read the word on screen.",
          "tap",
          [
            { value: "tap", label: "tap" },
            { value: "pat", label: "pat" },
          ],
          "Yes. You read tap.",
          "Track t-a-p from left to right.",
          "letter-tiles"
        ),
        display: "tap",
      },
      basic(
        "Which tiles spell the spoken word?",
        "pat",
        "pat",
        [
          { value: "tap", label: "t  a  p" },
          { value: "pat", label: "p  a  t" },
        ],
        "Yes. You spelled pat.",
        "Break pat into p, a, t.",
        "letter-tiles"
      ),
      basic(
        "Blend these sounds.",
        "sss. aaa. p.",
        "sap",
        [
          { value: "sap", label: "sap" },
          { value: "sat", label: "sat" },
        ],
        "Yes. The sounds blend to sap.",
        "Sweep the sounds with a smaller gap.",
        "letter-tiles"
      ),
    ],
  },
] as const;

const CORE_FOUNDATION_LESSONS: readonly FoundationLesson[] = FOUNDATION_LESSON_DRAFTS.map(
  (lesson, index) => ({
    ...lesson,
    prerequisites: index === 0 ? [] : [FOUNDATION_LESSON_DRAFTS[index - 1].id],
    masteryThreshold: 80,
    completionMode: "score-threshold",
    reviewStatus: "approved",
    evidenceDimensions: ["listening", "decoding"],
    nonGoals: ["speed pressure", "accent conformity"],
  })
);

export const FOUNDATION_LESSONS: readonly FoundationLesson[] = [
  ...CORE_FOUNDATION_LESSONS,
  ...PRONUNCIATION_LESSON_DRAFTS.map((lesson) => ({
    ...lesson,
    prerequisites: lesson.prerequisites ?? [],
    masteryThreshold: 0,
    completionMode: "qualitative-routing" as const,
    reviewStatus: "pilot" as const,
    evidenceDimensions: lesson.evidenceDimensions ?? ["comprehensibility", "participation"],
    nonGoals: lesson.nonGoals ?? ["accent ranking", "diagnosis", "speed scoring"],
  })),
];

const picture = (word: string, path: string): FoundationPictureWord => ({
  word,
  src: `/word-images/${path}/${word}.avif`,
});

const generatedPicture = (word: string): FoundationPictureWord => ({
  word,
  src: `/foundation-images/${word}-photorealistic-v1.avif`,
});

const pronunciationPicture = (word: string): FoundationPictureWord => ({
  word,
  src: `/word-images/pronunciation/${word}.webp`,
});

/**
 * Familiar-object previews for young learners. These are deliberately shown
 * before practice, not beside scored listening choices, so they teach
 * vocabulary without revealing an auditory answer.
 */
export const FOUNDATION_PICTURE_WORDS: Partial<
  Record<FoundationLessonId, readonly FoundationPictureWord[]>
> = {
  "same-or-different": [
    generatedPicture("sun"),
    picture("cat", "pet-shop"),
    generatedPicture("fish"),
    picture("dog", "pet-shop"),
  ],
  "count-words": [
    picture("cat", "pet-shop"),
    generatedPicture("bird"),
    picture("dog", "pet-shop"),
    generatedPicture("fish"),
    picture("bus", "gas-station"),
  ],
  "clap-syllables": [
    picture("cat", "pet-shop"),
    generatedPicture("rabbit"),
    picture("ladybug", "garden"),
    picture("helicopter", "arctic"),
    generatedPicture("robot"),
    picture("butterfly", "garden"),
  ],
  "rhyme-recognition": [
    picture("cat", "pet-shop"),
    generatedPicture("hat"),
    picture("dog", "pet-shop"),
    generatedPicture("fish"),
  ],
  "same-beginning": [
    generatedPicture("sun"),
    generatedPicture("fish"),
    picture("map", "camping-site"),
    picture("dog", "pet-shop"),
  ],
  "first-sound": [
    generatedPicture("sun"),
    generatedPicture("fish"),
    picture("cat", "pet-shop"),
    picture("dog", "pet-shop"),
  ],
  "final-sound": [
    generatedPicture("sun"),
    picture("cup", "kitchen"),
    picture("cat", "pet-shop"),
    picture("duck", "bird-sanctuary"),
  ],
  "blend-and-segment": [
    picture("map", "camping-site"),
    generatedPicture("sun"),
    generatedPicture("fan"),
  ],
  "sound-s": [generatedPicture("sun"), picture("soap", "bathroom")],
  "short-a": [
    picture("ant", "garden"),
    picture("apple", "fruits"),
    picture("cat", "pet-shop"),
    picture("map", "camping-site"),
  ],
  "sound-t": [picture("cat", "pet-shop"), picture("hat", "costume-shop")],
  "sound-p": [picture("pen", "classroom"), picture("cup", "kitchen")],
  "pronunciation-goals": [pronunciationPicture("teacher"), pronunciationPicture("show")],
  "meaningful-contrasts": [
    pronunciationPicture("cap"),
    pronunciationPicture("map"),
    pronunciationPicture("pig"),
    pronunciationPicture("big"),
  ],
  "clear-word-endings": [pronunciationPicture("dog"), pronunciationPicture("saw")],
  "consonant-sequences": [
    pronunciationPicture("blue"),
    pronunciationPicture("bread"),
    pronunciationPicture("green"),
    pronunciationPicture("milk"),
  ],
  "word-stress": [pronunciationPicture("teacher"), pronunciationPicture("store")],
  "syllable-prominence": [pronunciationPicture("teacher"), pronunciationPicture("rice")],
  "vowel-clarity": [
    pronunciationPicture("pin"),
    pronunciationPicture("pen"),
    pronunciationPicture("pat"),
    pronunciationPicture("tap"),
    pronunciationPicture("sap"),
  ],
  "important-information": [
    pronunciationPicture("blue"),
    pronunciationPicture("brown"),
    pronunciationPicture("green"),
  ],
  "meaning-chunks": [
    pronunciationPicture("park"),
    pronunciationPicture("house"),
    pronunciationPicture("store"),
  ],
  "connected-speech": [pronunciationPicture("small"), pronunciationPicture("big")],
  "communication-repair": [
    pronunciationPicture("key"),
    pronunciationPicture("map"),
    pronunciationPicture("show"),
  ],
  "pronunciation-portfolio": [pronunciationPicture("sun")],
};

export const FOUNDATION_LESSON_IDS = FOUNDATION_LESSONS.map((lesson) => lesson.id);
const lessonIds = new Set<string>(FOUNDATION_LESSON_IDS);
export function isFoundationLessonId(value: string): value is FoundationLessonId {
  return lessonIds.has(value);
}
export function getFoundationLesson(id: FoundationLessonId): FoundationLesson {
  return FOUNDATION_LESSONS.find((lesson) => lesson.id === id) ?? FOUNDATION_LESSONS[0];
}
export function getAdjacentFoundationLesson(
  id: FoundationLessonId,
  offset: -1 | 1
): FoundationLesson | null {
  const index = FOUNDATION_LESSONS.findIndex((lesson) => lesson.id === id);
  return FOUNDATION_LESSONS[index + offset] ?? null;
}

const units = [
  { id: "0.1", title: "Words and Beats", outcome: "Notice words and the beats inside them." },
  { id: "0.2", title: "Rhyme", outcome: "Hear when two words end with the same sound." },
  { id: "0.3", title: "Same Beginning", outcome: "Match words that begin with the same sound." },
  {
    id: "0.4",
    title: "First and Final Sounds",
    outcome: "Find the sound at the start and end of a word.",
  },
  {
    id: "0.5",
    title: "Blend and Segment",
    outcome: "Join sounds into words and break words into sounds.",
  },
] as const;
export const LEVEL_ZERO_UNITS = units.map((unit) => ({
  ...unit,
  lessons: FOUNDATION_LESSONS.filter((lesson) => lesson.level === 0 && lesson.unitId === unit.id),
}));
export const LEVEL_ONE_UNITS = [
  {
    id: "1.1",
    title: "SATP — First Letters",
    outcome: "Connect four sounds to letters, then blend, read, and spell short words.",
    lessons: FOUNDATION_LESSONS.filter((lesson) => lesson.level === 1),
  },
] as const;
export const LEVEL_THIRTEEN_UNITS = [
  {
    id: "13.1",
    title: "Advanced pronunciation and comprehensibility",
    outcome:
      "Build communication clarity, flexible listening, phrasing, and repair without ranking accents.",
    lessons: FOUNDATION_LESSONS.filter((lesson) => lesson.level === 13),
  },
] as const;

export const FOUNDATION_STAGES = [
  {
    id: "listening-foundations",
    level: 0,
    title: "Listening foundations",
    description:
      "Build the listening skills that make reading easier: words, beats, rhyme, and individual sounds.",
    units: LEVEL_ZERO_UNITS,
  },
  {
    id: "first-letters-and-words",
    level: 1,
    title: "First letters and words",
    description:
      "Connect speech sounds to print, then use the letters to read and spell the first short words.",
    units: LEVEL_ONE_UNITS,
  },
  {
    id: "pronunciation-and-comprehensibility",
    level: 13,
    title: "Pronunciation and comprehensibility",
    description:
      "An optional pilot track for clearer communication. Accent identity is respected, speaking is never required, and progress is not reduced to a speed or accent score.",
    units: LEVEL_THIRTEEN_UNITS,
  },
] as const;

validateFoundationCurriculum({
  schemaVersion: FOUNDATION_CURRICULUM_SCHEMA_VERSION,
  lessons: FOUNDATION_LESSONS,
  stages: FOUNDATION_STAGES,
});
