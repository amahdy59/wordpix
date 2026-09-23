import { z } from "zod";
import { FIGMA_HADITH_LESSONS, getFigmaHadithLesson } from "./figmaHadithCatalog";

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

const exerciseSchema = z.discriminatedUnion("type", [choiceSchema, sequenceSchema]);
const setSchema = z.object({
  lessonId: z.string().regex(/^hadith-\d{2}$/),
  exercises: z.array(exerciseSchema).min(3),
});

export type HadithExercise = z.infer<typeof exerciseSchema>;
export type HadithExerciseSet = z.infer<typeof setSchema>;

export const HADITH_EXERCISE_SETS: readonly HadithExerciseSet[] = z.array(setSchema).parse([
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

export function getHadithExerciseSet(lessonId: string): HadithExerciseSet | undefined {
  const authored = HADITH_EXERCISE_SETS.find((set) => set.lessonId === lessonId);
  if (authored) return authored;

  const lesson = getFigmaHadithLesson(lessonId);
  if (!lesson) return undefined;

  // Lessons without a bespoke exercise set still receive source-grounded
  // retrieval practice. Every correct answer is copied from the validated
  // Figma curriculum rather than inferred or generated as a religious claim.
  const lessonIndex = FIGMA_HADITH_LESSONS.findIndex((candidate) => candidate.id === lesson.id);
  const alternatives = [1, 2].map(
    (offset) => FIGMA_HADITH_LESSONS[(lessonIndex + offset) % FIGMA_HADITH_LESSONS.length]
  );
  const optionLessons = [lesson, ...alternatives];
  const excerpt = (value: string) => {
    const words = value.replace(/\s+/g, " ").trim().split(" ");
    return `${words.slice(0, 24).join(" ")}${words.length > 24 ? "…" : ""}`;
  };

  return setSchema.parse({
    lessonId: lesson.id,
    exercises: [
      {
        id: "lesson-message",
        type: "single-choice",
        prompt: "Which main lesson did you just study?",
        options: optionLessons.map((candidate) => ({
          id: candidate.id,
          label: candidate.title,
        })),
        answerId: lesson.id,
        feedback: `This lesson is “${lesson.title}.” Return to Read & Listen if you want to review the complete source block.`,
      },
      {
        id: "translation-evidence",
        type: "single-choice",
        prompt: "Which excerpt comes from this lesson’s English translation?",
        options: optionLessons.map((candidate) => ({
          id: candidate.id,
          label: excerpt(candidate.source.translation),
        })),
        answerId: lesson.id,
        feedback:
          "The matching excerpt comes directly from the translation shown once in Read & Listen.",
      },
      {
        id: "source-citation",
        type: "single-choice",
        prompt: "Which source citation belongs to this lesson?",
        options: optionLessons.map((candidate) => ({
          id: candidate.id,
          label: candidate.source.citation,
        })),
        answerId: lesson.id,
        feedback: `The source line for this lesson is: ${lesson.source.citation}`,
      },
    ],
  });
}
