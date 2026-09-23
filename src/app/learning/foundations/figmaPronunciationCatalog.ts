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

export const PRONUNCIATION_CHAPTERS = [
  { start: 1, end: 8, titleKey: "learn.pronunciationChapterContrast" },
  { start: 9, end: 16, titleKey: "learn.pronunciationChapterConsonants" },
  { start: 17, end: 24, titleKey: "learn.pronunciationChapterVowels" },
  { start: 25, end: 32, titleKey: "learn.pronunciationChapterSyllables" },
  { start: 33, end: 40, titleKey: "learn.pronunciationChapterConnected" },
  { start: 41, end: 48, titleKey: "learn.pronunciationChapterStress" },
  { start: 49, end: 58, titleKey: "learn.pronunciationChapterRhythm" },
  { start: 59, end: 68, titleKey: "learn.pronunciationChapterTransfer" },
] as const;

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
  const inline = lines[index].replace(/^.*?:\s*/, "").trim();
  if (inline) return inline;
  const next = lines[index + 1]?.trim();
  return next && !/^[A-Z][A-Za-z &/-]+:$/.test(next) ? next : undefined;
};

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
  };
}

export function pronunciationImagePath(imageRef: string): string {
  return `pronunciation/v1/images/${imageRef}.png`;
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
