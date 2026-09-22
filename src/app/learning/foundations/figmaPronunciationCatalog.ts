import source from "./figmaPronunciationContent.json";

export interface FigmaPronunciationLessonSource {
  readonly number: number;
  readonly nodeId: string;
  readonly sourceName: string;
  readonly section: string;
  readonly text: readonly string[];
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

export function getFigmaPronunciationLesson(number: number): FigmaPronunciationLessonSource {
  const lesson = FIGMA_PRONUNCIATION_LESSONS.find((candidate) => candidate.number === number);
  if (!lesson) throw new Error(`Unknown Figma pronunciation lesson: ${number}`);
  return lesson;
}

export interface FigmaPronunciationActivityData {
  readonly title: string;
  readonly objective: string;
  readonly model: string;
  readonly teachWords: readonly string[];
  readonly transferWords: readonly string[];
}

const wordsAfter = (lines: readonly string[], label: RegExp): string[] => {
  const line = lines.find((candidate) => label.test(candidate));
  if (!line) return [];
  return line
    .replace(/^.*?:\s*/, "")
    .split("|")
    .map((word) =>
      word
        .trim()
        .replace(/\s*\([^)]*\)/g, "")
        .replace(/[^a-z'-]/gi, "")
    )
    .filter((word) => /^[a-z][a-z'-]*$/i.test(word));
};

const wordsBeforeRoles = (lines: readonly string[], roles: RegExp): string[] =>
  lines.flatMap((line, index) => {
    if (!roles.test(line)) return [];
    const word = lines[index - 1]?.trim().replace(/[^a-z'-]/gi, "");
    return word && /^[a-z][a-z'-]*$/i.test(word) ? [word] : [];
  });

/** Turns the Figma specification into a consistent, playable lesson contract. */
export function getFigmaPronunciationActivityData(number: number): FigmaPronunciationActivityData {
  const lesson = getFigmaPronunciationLesson(number);
  const title =
    lesson.text
      .find((line) => line.startsWith(`Lesson ${number} —`))
      ?.replace(`Lesson ${number} —`, "")
      .trim() ?? `Pronunciation lesson ${number}`;
  const objective =
    lesson.text.find((line) => /^Objective:/i.test(line))?.replace(/^Objective:\s*/i, "") ??
    "Practise listening and communication clarity in context.";
  const teachWords = wordsAfter(lesson.text, /^Active Lexicon:/i);
  const roleWords = wordsBeforeRoles(
    lesson.text,
    /^(?:TEACH|GUIDED|INDEPENDENT|TRANSFER)(?:\s*•\s*CONTEXT)?$/i
  );
  const resolvedTeachWords = teachWords.length >= 2 ? teachWords : roleWords;
  const transferWords = wordsAfter(lesson.text, /^Fresh Word Transfer Targets:/i);
  const resolvedTransferWords = transferWords.length
    ? transferWords
    : wordsBeforeRoles(lesson.text, /^TRANSFER(?:\s*•\s*CONTEXT)?$/i);
  const model =
    lesson.text
      .find((line) => /^Model Delivery:/i.test(line))
      ?.replace(/^Model Delivery:\s*/i, "") ||
    lesson.text
      .find((line) => /^Model Audio.*:/i.test(line))
      ?.replace(/^Model Audio[^:]*:\s*/i, "") ||
    resolvedTeachWords[0] ||
    title;
  return {
    title,
    objective,
    model,
    teachWords: resolvedTeachWords,
    transferWords: resolvedTransferWords,
  };
}
