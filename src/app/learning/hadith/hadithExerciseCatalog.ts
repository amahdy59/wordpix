import { z } from "zod";
import {
  FIGMA_HADITH_LESSONS,
  FIGMA_HADITH_VISUAL_VOCABULARY,
  getFigmaHadithLesson,
  type FigmaHadithLesson,
} from "./figmaHadithCatalog";

const choiceSchema = z.object({
  id: z.string(),
  type: z.literal("single-choice"),
  prompt: z.string(),
  options: z.array(z.object({ id: z.string(), label: z.string() })).min(2),
  answerId: z.string(),
  feedback: z.string(),
});

const sequenceSchema = z.object({
  id: z.string(),
  type: z.literal("sequence"),
  prompt: z.string(),
  items: z.array(z.object({ id: z.string(), label: z.string() })).min(2),
  answerOrder: z.array(z.string()).min(2),
  feedback: z.string(),
});

const imageChoiceSchema = z.object({
  id: z.string(),
  type: z.literal("image-choice"),
  prompt: z.string(),
  imageRef: z.string(),
  options: z.array(z.object({ id: z.string(), label: z.string() })).min(3),
  answerId: z.string(),
  feedback: z.string(),
});

const authoredExerciseSchema = z.discriminatedUnion("type", [choiceSchema, sequenceSchema]);
const exerciseSchema = z.discriminatedUnion("type", [
  choiceSchema,
  sequenceSchema,
  imageChoiceSchema,
]);
const authoredSetSchema = z.object({
  lessonId: z.string().regex(/^hadith-\d{2}$/),
  exercises: z.array(authoredExerciseSchema).min(3),
});
const setSchema = z.object({
  lessonId: z.string().regex(/^hadith-\d{2}$/),
  exercises: z.array(exerciseSchema).min(10),
});

export type HadithExercise = z.infer<typeof exerciseSchema>;
export type HadithExerciseSet = z.infer<typeof setSchema>;

export const HADITH_EXERCISE_SETS = z.array(authoredSetSchema).parse([
  {
    lessonId: "hadith-01",
    exercises: [
      {
        id: "intention-meaning",
        type: "single-choice",
        prompt: "Which word means your clear reason or plan for doing something?",
        options: [
          { id: "intention", label: "intention" },
          { id: "action", label: "action" },
          { id: "gain", label: "worldly gain" },
        ],
        answerId: "intention",
        feedback: "An intention is the purpose or plan behind an action.",
      },
      {
        id: "hadith-message",
        type: "single-choice",
        prompt: "What main message does the Hadith teach about an action?",
        options: [
          { id: "intention", label: "Its intention gives it its purpose." },
          { id: "reward", label: "It matters only when it brings a reward." },
          { id: "speed", label: "It should always be completed quickly." },
        ],
        answerId: "intention",
        feedback: "The Hadith connects each action with the intention behind it.",
      },
      {
        id: "purpose-language",
        type: "single-choice",
        prompt: "Choose the best completion: “I study English ___ understand the lesson.”",
        options: [
          { id: "to", label: "to" },
          { id: "because", label: "because" },
          { id: "although", label: "although" },
        ],
        answerId: "to",
        feedback: "Use “to” before a verb to express purpose.",
      },
    ],
  },
  {
    lessonId: "hadith-02",
    exercises: [
      {
        id: "questioner",
        type: "single-choice",
        prompt: "Who asked the questions in the conversation?",
        options: [
          { id: "jibril", label: "Jibril (Gabriel)" },
          { id: "umar", label: "Umar ibn al-Khattab" },
          { id: "narrator", label: "An unnamed student" },
        ],
        answerId: "jibril",
        feedback: "Jibril asked the questions to teach the listeners about their religion.",
      },
      {
        id: "inform-meaning",
        type: "single-choice",
        prompt: "What does “inform me about” mean in this lesson?",
        options: [
          { id: "explain", label: "Tell me and explain the topic" },
          { id: "repeat", label: "Repeat the final word" },
          { id: "disagree", label: "Disagree with the speaker" },
        ],
        answerId: "explain",
        feedback: "The phrase politely asks someone to explain a topic.",
      },
      {
        id: "conversation-order",
        type: "sequence",
        prompt: "Build the conversation sequence from beginning to end.",
        items: [
          { id: "arrival", label: "Arrival and scene" },
          { id: "islam", label: "Islam and its pillars" },
          { id: "iman", label: "Iman and core beliefs" },
          { id: "ihsan", label: "Ihsan" },
          { id: "hour", label: "The Hour and Jibril’s identity" },
        ],
        answerOrder: ["arrival", "islam", "iman", "ihsan", "hour"],
        feedback:
          "The questions move from the arrival scene through Islam, Iman, Ihsan, and the Hour.",
      },
    ],
  },
  {
    lessonId: "hadith-03",
    exercises: [
      {
        id: "fasting-description",
        type: "single-choice",
        prompt:
          "Which pillar involves refraining from food and drink from dawn to sunset in Ramadan?",
        options: [
          { id: "fasting", label: "Fasting during Ramadan" },
          { id: "zakat", label: "Paying zakat" },
          { id: "hajj", label: "Performing Hajj" },
        ],
        answerId: "fasting",
        feedback:
          "Fasting during Ramadan is described by refraining from food and drink during the day.",
      },
      {
        id: "passive-pattern",
        type: "single-choice",
        prompt: "Choose the passive form used in the lesson.",
        options: [
          { id: "built", label: "Islam was built on five things." },
          { id: "build", label: "Islam build five things." },
          { id: "building", label: "Islam is building on five things." },
        ],
        answerId: "built",
        feedback: "“Was built” is the passive form: be + past participle.",
      },
      {
        id: "pillar-order",
        type: "sequence",
        prompt: "Order the five pillars as presented in this lesson.",
        items: [
          { id: "shahada", label: "Testimony of faith" },
          { id: "prayer", label: "Establish prayer" },
          { id: "zakat", label: "Pay zakat" },
          { id: "fasting", label: "Fast during Ramadan" },
          { id: "hajj", label: "Perform Hajj" },
        ],
        answerOrder: ["shahada", "prayer", "zakat", "fasting", "hajj"],
        feedback: "The lesson presents testimony, prayer, zakat, fasting, and Hajj in that order.",
      },
    ],
  },
  {
    lessonId: "hadith-04",
    exercises: [
      {
        id: "narrator",
        type: "single-choice",
        prompt: "Who narrates Hadith 4 in the lesson?",
        options: [
          { id: "masood", label: "Abdullah ibn Masood" },
          { id: "aisha", label: "Aisha" },
          { id: "hurayrah", label: "Abu Hurayrah" },
        ],
        answerId: "masood",
        feedback: "The narration is reported by Abdullah ibn Masood.",
      },
      {
        id: "sustenance",
        type: "single-choice",
        prompt: "Which meaning best matches “sustenance”?",
        options: [
          { id: "provision", label: "Provision and resources that support life" },
          { id: "duration", label: "The duration of a person’s life" },
          { id: "sequence", label: "The order of events in a story" },
        ],
        answerId: "provision",
        feedback: "Sustenance means provision or resources that support life.",
      },
      {
        id: "development-order",
        type: "sequence",
        prompt: "Order the literal developmental stages described in the lesson.",
        items: [
          { id: "nutfah", label: "Nutfah" },
          { id: "alaqah", label: "Alaqah" },
          { id: "mudghah", label: "Mudghah" },
          { id: "angel", label: "The angel is sent" },
        ],
        answerOrder: ["nutfah", "alaqah", "mudghah", "angel"],
        feedback: "The source-based sequence is nutfah, alaqah, mudghah, then the angel is sent.",
      },
    ],
  },
  {
    lessonId: "hadith-05",
    exercises: [
      {
        id: "passive-result",
        type: "single-choice",
        prompt: "Complete the passive sentence: “An unprescribed religious act ___.”",
        options: [
          { id: "rejected", label: "is rejected" },
          { id: "reject", label: "is reject" },
          { id: "rejecting", label: "is rejecting" },
        ],
        answerId: "rejected",
        feedback: "The passive structure is be + past participle: “is rejected.”",
      },
      {
        id: "scope",
        type: "single-choice",
        prompt: "Which statement matches the lesson’s stated scope?",
        options: [
          { id: "worship", label: "It discusses additions within established religious practice." },
          { id: "technology", label: "It rejects every new technology or worldly tool." },
          { id: "ruling", label: "Learners should issue legal rulings themselves." },
        ],
        answerId: "worship",
        feedback:
          "The lesson distinguishes established religious practice from ordinary worldly tools.",
      },
      {
        id: "passive-order",
        type: "sequence",
        prompt: "Build the accurate passive result sentence.",
        items: [
          { id: "action", label: "The action" },
          { id: "is", label: "is" },
          { id: "rejected", label: "rejected" },
        ],
        answerOrder: ["action", "is", "rejected"],
        feedback: "The completed passive sentence is: “The action is rejected.”",
      },
    ],
  },
]);

const normalize = (value: string) =>
  value
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const excerpt = (value: string, fromEnd = false) => {
  const words = value.replace(/\s+/g, " ").trim().split(" ");
  const selected = fromEnd ? words.slice(-18) : words.slice(0, 18);
  return `${fromEnd && words.length > 18 ? "…" : ""}${selected.join(" ")}${!fromEnd && words.length > 18 ? "…" : ""}`;
};

function stageExcerpt(
  lesson: FigmaHadithLesson,
  stage: "read-listen" | "vocabulary" | "practice" | "speak" | "check-review"
) {
  const meaningful = lesson.stages[stage].text
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(
      (line) => line.length >= 24 && !/^(?:step|continue|submit|practice complete)/i.test(line)
    )
    .sort((a, b) => b.length - a.length);
  return excerpt(meaningful[0] ?? lesson.title);
}

function sourceChoice(
  lesson: FigmaHadithLesson,
  id: string,
  prompt: string,
  labelFor: (candidate: FigmaHadithLesson) => string,
  feedback: string
): HadithExercise {
  const lessonIndex = FIGMA_HADITH_LESSONS.findIndex((candidate) => candidate.id === lesson.id);
  const chosen: Array<{ id: string; label: string }> = [];
  const seen = new Set<string>();

  for (let offset = 0; offset < FIGMA_HADITH_LESSONS.length && chosen.length < 3; offset += 1) {
    const candidate = FIGMA_HADITH_LESSONS[(lessonIndex + offset) % FIGMA_HADITH_LESSONS.length];
    const label = labelFor(candidate);
    if (seen.has(label)) continue;
    seen.add(label);
    chosen.push({ id: candidate.id, label });
  }

  return {
    id,
    type: "single-choice",
    prompt,
    options: chosen,
    answerId: lesson.id,
    feedback,
  };
}

function pictureChoice(lesson: FigmaHadithLesson): HadithExercise {
  const vocabularyLines = new Set(lesson.stages.vocabulary.text.map(normalize));
  const lessonVisual = FIGMA_HADITH_VISUAL_VOCABULARY.find((item) => {
    const baseLabel = item.label.split("·")[0].trim();
    return vocabularyLines.has(normalize(item.label)) || vocabularyLines.has(normalize(baseLabel));
  });
  const fallbackIndex = ((lesson.number - 1) * 5) % FIGMA_HADITH_VISUAL_VOCABULARY.length;
  const target = lessonVisual ?? FIGMA_HADITH_VISUAL_VOCABULARY[fallbackIndex];
  const targetIndex = FIGMA_HADITH_VISUAL_VOCABULARY.indexOf(target);
  const options: Array<{ id: string; label: string }> = [];
  const seenLabels = new Set<string>();

  for (
    let offset = 0;
    offset < FIGMA_HADITH_VISUAL_VOCABULARY.length && options.length < 3;
    offset += 1
  ) {
    const candidate =
      FIGMA_HADITH_VISUAL_VOCABULARY[
        (targetIndex + offset * 17) % FIGMA_HADITH_VISUAL_VOCABULARY.length
      ];
    const label = candidate.label.split("·")[0].trim();
    if (seenLabels.has(normalize(label))) continue;
    seenLabels.add(normalize(label));
    options.push({ id: candidate.imageRef, label });
  }

  const answer = target.label.split("·")[0].trim();
  return {
    id: "picture-vocabulary",
    type: "image-choice",
    prompt: lessonVisual
      ? "Which word or expression from this lesson matches the picture?"
      : "Spaced vocabulary review: Which word or expression matches the picture?",
    imageRef: target.imageRef,
    options,
    answerId: target.imageRef,
    feedback: `The picture represents “${answer}.”`,
  };
}

function generatedExercises(lesson: FigmaHadithLesson): HadithExercise[] {
  return [
    pictureChoice(lesson),
    sourceChoice(
      lesson,
      "lesson-message",
      "Which main lesson did you just study?",
      (candidate) => candidate.title,
      `This lesson is “${lesson.title}.”`
    ),
    sourceChoice(
      lesson,
      "translation-opening",
      "Which opening comes from this lesson’s English translation?",
      (candidate) => excerpt(candidate.source.translation),
      "The matching words come directly from the translation in Read & Listen."
    ),
    sourceChoice(
      lesson,
      "translation-ending",
      "Which ending comes from this lesson’s English translation?",
      (candidate) => excerpt(candidate.source.translation, true),
      "The matching ending comes directly from the translation in Read & Listen."
    ),
    sourceChoice(
      lesson,
      "source-citation",
      "Which source citation belongs to this lesson?",
      (candidate) => candidate.source.citation,
      `The source line for this lesson is: ${lesson.source.citation}`
    ),
    sourceChoice(
      lesson,
      "vocabulary-evidence",
      "Which excerpt appears in this lesson’s vocabulary study?",
      (candidate) => stageExcerpt(candidate, "vocabulary"),
      "This wording is taken from the lesson’s vocabulary study."
    ),
    sourceChoice(
      lesson,
      "reading-evidence",
      "Which learning note belongs to this lesson’s Read & Listen section?",
      (candidate) => stageExcerpt(candidate, "read-listen"),
      "This note is part of the Read & Listen section you studied."
    ),
    sourceChoice(
      lesson,
      "practice-evidence",
      "Which language prompt belongs to this lesson?",
      (candidate) => stageExcerpt(candidate, "practice"),
      "This prompt comes from the lesson’s language practice."
    ),
    sourceChoice(
      lesson,
      "speaking-evidence",
      "Which speaking prompt belongs to this lesson?",
      (candidate) => stageExcerpt(candidate, "speak"),
      "This prompt prepares you to use the lesson language aloud."
    ),
    sourceChoice(
      lesson,
      "review-evidence",
      "Which review prompt belongs to this lesson?",
      (candidate) => stageExcerpt(candidate, "check-review"),
      "This prompt checks the lesson you have just studied."
    ),
  ];
}

export function getHadithExerciseSet(lessonId: string): HadithExerciseSet | undefined {
  const lesson = getFigmaHadithLesson(lessonId);
  if (!lesson) return undefined;

  const authored = HADITH_EXERCISE_SETS.find((set) => set.lessonId === lessonId);
  const exercises = authored
    ? [...authored.exercises, ...generatedExercises(lesson).slice(0, 7)]
    : generatedExercises(lesson);

  return setSchema.parse({ lessonId: lesson.id, exercises });
}
