import source from "./figmaPronunciationContent.json";

export type PronunciationItemRole = "teach" | "guided" | "independent" | "transfer";

export interface FigmaPronunciationImage {
  readonly label: string;
  readonly role: PronunciationItemRole;
  readonly context: boolean;
  readonly imageRef: string;
}

export interface FigmaPronunciationLessonSource {
  readonly number: number;
  readonly nodeId: string;
  readonly sourceName: string;
  readonly section: string;
  readonly text: readonly string[];
  readonly images: readonly FigmaPronunciationImage[];
}

export const FIGMA_PRONUNCIATION_SOURCE = {
  schemaVersion: source.schemaVersion,
  fileKey: source.source.fileKey,
  pageId: source.source.pageId,
  name: source.source.name,
  imageRefs: source.imageRefs,
  lessons: source.lessons as readonly FigmaPronunciationLessonSource[],
} as const;

export const FIGMA_PRONUNCIATION_LESSONS = FIGMA_PRONUNCIATION_SOURCE.lessons;

export type ConsolidatedLegacyPronunciationTopic =
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

/**
 * The revised eight-chapter pathway is the single pronunciation curriculum.
 * `legacyTopics` records where the useful teaching goals from the retired
 * Foundation Level 13 pilot now live, preventing them from being lost or
 * accidentally reintroduced as a second course.
 */
export const PRONUNCIATION_CHAPTERS = [
  {
    start: 1,
    end: 8,
    titleKey: "learn.pronunciationChapterContrast",
    descriptionKey: "pronunciation.chapterDescriptionContrast",
    legacyTopics: ["meaningful-contrasts"],
  },
  {
    start: 9,
    end: 16,
    titleKey: "learn.pronunciationChapterConsonants",
    descriptionKey: "pronunciation.chapterDescriptionConsonants",
    legacyTopics: ["consonant-sequences"],
  },
  {
    start: 17,
    end: 24,
    titleKey: "learn.pronunciationChapterVowels",
    descriptionKey: "pronunciation.chapterDescriptionVowels",
    legacyTopics: ["vowel-clarity"],
  },
  {
    start: 25,
    end: 32,
    titleKey: "learn.pronunciationChapterSyllables",
    descriptionKey: "pronunciation.chapterDescriptionSyllables",
    legacyTopics: ["clear-word-endings"],
  },
  {
    start: 33,
    end: 40,
    titleKey: "learn.pronunciationChapterConnected",
    descriptionKey: "pronunciation.chapterDescriptionConnected",
    legacyTopics: ["meaning-chunks", "connected-speech"],
  },
  {
    start: 41,
    end: 48,
    titleKey: "learn.pronunciationChapterStress",
    descriptionKey: "pronunciation.chapterDescriptionStress",
    legacyTopics: ["word-stress", "syllable-prominence"],
  },
  {
    start: 49,
    end: 58,
    titleKey: "learn.pronunciationChapterRhythm",
    descriptionKey: "pronunciation.chapterDescriptionRhythm",
    legacyTopics: ["important-information"],
  },
  {
    start: 59,
    end: 68,
    titleKey: "learn.pronunciationChapterTransfer",
    descriptionKey: "pronunciation.chapterDescriptionTransfer",
    legacyTopics: ["pronunciation-goals", "communication-repair", "pronunciation-portfolio"],
  },
] as const;

const consolidatedLegacyTopics = new Set<ConsolidatedLegacyPronunciationTopic>(
  PRONUNCIATION_CHAPTERS.flatMap((chapter) => chapter.legacyTopics)
);
if (consolidatedLegacyTopics.size !== 12) {
  throw new Error("Every legacy pronunciation topic must be consolidated exactly once.");
}

export function getPronunciationChapter(number: number) {
  return (
    PRONUNCIATION_CHAPTERS.find((chapter) => number >= chapter.start && number <= chapter.end) ??
    PRONUNCIATION_CHAPTERS[0]
  );
}

export function getFigmaPronunciationLesson(number: number): FigmaPronunciationLessonSource {
  const lesson = FIGMA_PRONUNCIATION_LESSONS.find((candidate) => candidate.number === number);
  if (!lesson) throw new Error(`Unknown Figma pronunciation lesson: ${number}`);
  return lesson;
}

export interface FigmaPronunciationActivityData {
  readonly title: string;
  readonly objective: string;
  readonly model: string;
  readonly items: readonly FigmaPronunciationImage[];
  readonly teachItems: readonly FigmaPronunciationImage[];
  readonly guidedItems: readonly FigmaPronunciationImage[];
  readonly independentItems: readonly FigmaPronunciationImage[];
  readonly transferItems: readonly FigmaPronunciationImage[];
  readonly contextItems: readonly FigmaPronunciationImage[];
  readonly teachWords: readonly string[];
  readonly transferWords: readonly string[];
  readonly contrastPairs: readonly (readonly [string, string])[];
  readonly focus: string;
  /** Model and transfer sentences provide a meaningful final retrieval review. */
  readonly reviewSentences: readonly string[];
  readonly recoveryCue?: string;
  /** Authored physical production guidance surfaced from the Figma curriculum. */
  readonly articulationCues: readonly string[];
}

const uniqueItems = (items: readonly FigmaPronunciationImage[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.label.toLocaleLowerCase("en-US");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const valueAfter = (lines: readonly string[], label: RegExp): string | undefined => {
  const index = lines.findIndex((candidate) => label.test(candidate));
  if (index < 0) return undefined;
  if (/:\s*\S/.test(lines[index])) {
    return lines[index].replace(/^.*?:\s*/, "").trim();
  }
  const next = lines[index + 1]?.trim();
  return next && !/^[A-Z][A-Za-z &/-]+:?$/.test(next)
    ? next.replace(/^[‘'“"]|[’'”"]$/g, "").trim()
    : undefined;
};

const sentencesAfter = (lines: readonly string[], label: RegExp): readonly string[] => {
  const value = valueAfter(lines, label);
  if (!value) return [];
  return value
    .split(/\s*\|\s*/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 3)
    .slice(0, 4);
};

const ARTICULATION_HEADING =
  /articulation|mouth architecture|tongue position|jaw elevation|lip rounding/i;
const ARTICULATION_LANGUAGE =
  /\b(?:lip|tongue|jaw|teeth|throat|vocal|voice|airflow|air stream|palate|alveolar|vibration|aspiration|syllable|stress|pitch)\b/i;

function getArticulationCues(lines: readonly string[]): readonly string[] {
  const headingIndex = lines.findIndex((line) => ARTICULATION_HEADING.test(line));
  const candidates = headingIndex >= 0 ? lines.slice(headingIndex + 1, headingIndex + 24) : lines;
  return candidates
    .map((line) => line.trim().replace(/^[‘'“"]|[’'”"]$/g, ""))
    .filter(
      (line) =>
        line.length >= 24 &&
        line.length <= 260 &&
        ARTICULATION_LANGUAGE.test(line) &&
        !/^(?:objective|image guidelines|accessibility|validation|feedback|production guidance)/i.test(
          line
        )
    )
    .slice(0, 3);
}

export function getFigmaPronunciationActivityData(number: number): FigmaPronunciationActivityData {
  const lesson = getFigmaPronunciationLesson(number);
  const title =
    lesson.text
      .find((line) => line.startsWith(`Lesson ${number} —`))
      ?.replace(`Lesson ${number} —`, "")
      .trim() ?? `Pronunciation lesson ${number}`;
  const objective =
    valueAfter(lesson.text, /^Objective:/i) ??
    "Practise listening and communication clarity in context.";
  const items = uniqueItems(lesson.images);
  const teachItems = items.filter((item) => item.role === "teach");
  const guidedItems = items.filter((item) => item.role === "guided");
  const independentItems = items.filter((item) => item.role === "independent");
  const transferItems = items.filter((item) => item.role === "transfer");
  const contextItems = items.filter((item) => item.context);
  const model =
    valueAfter(lesson.text, /^Model Delivery:/i) ??
    valueAfter(lesson.text, /^Target Line:/i) ??
    teachItems[0]?.label ??
    items[0]?.label ??
    title;
  const contrastLine = lesson.text.find((line) => line.includes("|") && /(?:\/|–|—)/.test(line));
  const contrastPairs = (contrastLine?.split("|") ?? [])
    .map((pair) =>
      pair
        .trim()
        .split(/\s*(?:\/|–|—)\s*/)
        .filter(Boolean)
    )
    .filter((pair): pair is [string, string] => pair.length === 2)
    .map(([first, second]) => [first, second] as const);
  const focus =
    valueAfter(lesson.text, /^(?:Linguistic Focus|Acoustic Cue|Contrast Focus|Focus):/i) ??
    objective;
  const reviewSentences = [
    ...sentencesAfter(lesson.text, /^Model Delivery:/i),
    ...sentencesAfter(lesson.text, /^Fresh Word Transfer Targets:/i),
  ];
  const recoveryCue = valueAfter(lesson.text, /^(?:Incorrect Feedback|Recovery Cue):?/i);
  const extractedArticulationCues = getArticulationCues(lesson.text);
  const articulationCues =
    extractedArticulationCues.length > 0
      ? extractedArticulationCues
      : [recoveryCue, focus].filter((cue): cue is string =>
          Boolean(cue && ARTICULATION_LANGUAGE.test(cue))
        );
  return {
    title,
    objective,
    model,
    items,
    teachItems,
    guidedItems,
    independentItems,
    transferItems,
    contextItems,
    teachWords: [...teachItems, ...guidedItems].map((item) => item.label),
    transferWords: transferItems.map((item) => item.label),
    contrastPairs,
    focus,
    reviewSentences,
    recoveryCue,
    articulationCues,
  };
}

/** Returns the authored minimal-pair partner for a word, when one exists. */
export function getPronunciationContrastPartner(
  activity: FigmaPronunciationActivityData,
  label: string
): string | undefined {
  const normalized = label.toLocaleLowerCase("en-US");
  const pair = activity.contrastPairs.find(([first, second]) =>
    [first, second].some((value) => value.toLocaleLowerCase("en-US") === normalized)
  );
  if (!pair) return undefined;
  return pair[0].toLocaleLowerCase("en-US") === normalized ? pair[1] : pair[0];
}

export function pronunciationImagePath(imageRef: string): string {
  return `pronunciation/v1/images/${imageRef}.png`;
}

/** Choose the complete answer set before shuffling so scaffolding cannot remove the answer. */
export function getPronunciationQuestion(
  number: number,
  stage: 1 | 2 | 3 | 4,
  trial: number,
  childMode: boolean = false
) {
  const activity = getFigmaPronunciationActivityData(number);
  const pool =
    stage === 4 && activity.transferItems.length
      ? activity.transferItems
      : [...activity.teachItems, ...activity.guidedItems, ...activity.independentItems];
  const target = pool[(number * 7 + (stage - 1) * 5 + trial * 3) % pool.length];
  if (!target) throw new Error(`Pronunciation lesson ${number} has no question targets`);
  const partner = getPronunciationContrastPartner(activity, target.label);
  const normalized = (label: string) => label.trim().toLocaleLowerCase("en-US");
  const partnerItem = activity.items.find(
    (item) => partner && normalized(item.label) === normalized(partner)
  );
  const candidates = uniqueItems([
    target,
    ...(partnerItem ? [partnerItem] : []),
    ...pool,
    ...activity.items,
  ]);
  const count = childMode || stage <= 2 ? 2 : 4;
  const choices = seededPronunciationShuffle(
    candidates.slice(0, count),
    number * 31 + stage * 17 + trial * 13
  );
  if (choices.length < 2) throw new Error(`Pronunciation lesson ${number} needs a distractor`);
  return { target, choices };
}

export function seededPronunciationShuffle<T>(values: readonly T[], seed: number): T[] {
  const output = [...values];
  let state = seed >>> 0;
  for (let index = output.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

/**
 * Returns rhythmic syllable beat indicators (e.g. "● ·" vs "· ●")
 * for multisyllabic stress contrasts in Chapter 6 (Lessons 41–48).
 */
export function getStressBeatPattern(lessonNumber: number, label: string): string | undefined {
  if (lessonNumber < 41 || lessonNumber > 48) return undefined;
  if (/[A-Z]{2,}/.test(label)) {
    return /^[A-Z]{2,}/.test(label) ? "● ·" : "· ●";
  }
  if (lessonNumber === 41) return "● ·";
  if (lessonNumber === 43) {
    const clean = label.trim().toLowerCase();
    if (clean.startsWith("about") || clean.startsWith("ago")) return "· ●";
    return "● ·";
  }
  return undefined;
}

export interface PronunciationCardPresentation {
  readonly cleanTitle: string;
  readonly phoneticBadge?: string;
  readonly firstImage?: FigmaPronunciationImage;
  readonly secondImage?: FigmaPronunciationImage;
  readonly primaryWords: readonly string[];
  readonly fallbackSymbols?: string;
}

export function getPronunciationCardPresentation(number: number): PronunciationCardPresentation {
  const lesson = getFigmaPronunciationLesson(number);
  const activity = getFigmaPronunciationActivityData(number);

  // Clean title & phonetic badge extraction
  const parenMatch = activity.title.match(/^(.*?)\s*\((.*?)\)$/);
  const cleanTitle = parenMatch ? parenMatch[1].trim() : activity.title;
  let phoneticBadge = parenMatch ? parenMatch[2].trim() : undefined;

  if (!phoneticBadge) {
    const focusMatch = activity.focus.match(/\/[^/]+\/(?:\s*(?:vs|–|—|\/)\s*\/[^/]+\/)?/);
    if (focusMatch) {
      phoneticBadge = focusMatch[0];
    }
  }

  // Find dual images (prioritizing the authored minimal pair)
  let firstImage: FigmaPronunciationImage | undefined;
  let secondImage: FigmaPronunciationImage | undefined;
  let primaryWords: string[] = [];

  if (activity.contrastPairs.length > 0) {
    const [w1, w2] = activity.contrastPairs[0];
    const img1 = activity.items.find((item) => item.label.toLowerCase() === w1.toLowerCase());
    const img2 = activity.items.find((item) => item.label.toLowerCase() === w2.toLowerCase());
    if (img1 && img2) {
      firstImage = img1;
      secondImage = img2;
      primaryWords = [w1, w2];
    }
  }

  // Fallback to first available images in the lesson
  if (!firstImage || !secondImage) {
    const available = activity.items.length >= 2 ? activity.items : lesson.images;
    if (available.length >= 2) {
      firstImage = available[0];
      secondImage = available[1];
      primaryWords = [firstImage.label, secondImage.label];
    } else if (available.length === 1) {
      firstImage = available[0];
      primaryWords = [firstImage.label];
    }
  }

  return {
    cleanTitle,
    phoneticBadge,
    firstImage,
    secondImage,
    primaryWords,
    fallbackSymbols: phoneticBadge ?? (activity.contrastPairs[0]?.join(" · ") || cleanTitle),
  };
}
