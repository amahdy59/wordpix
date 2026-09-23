import { z } from "zod";
import { FIGMA_HADITH_LESSONS, getFigmaHadithLesson } from "./figmaHadithCatalog";
export { HADITH_STAGE_IDS, type HadithStageId } from "./hadithCurriculumStages";

const audioTrackSchema = z.object({
  id: z.string(),
  label: z.string(),
  text: z.string(),
  lang: z.enum(["ar", "en"]),
  rate: z.number().min(0.5).max(1.5).optional(),
});

const vocabularySchema = z.object({
  id: z.string(),
  term: z.string(),
  arabic: z.string(),
  partOfSpeech: z.string(),
  definition: z.string(),
  example: z.string(),
  phrase: z.string().optional(),
});

const practiceSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  options: z.array(z.string()).min(2),
  answer: z.string(),
  explanation: z.string(),
});

const hadithLessonSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  title: z.string(),
  titleAr: z.string(),
  estimatedMinutes: z.number().int().positive(),
  purpose: z.string(),
  outcomes: z.array(z.string()).min(1),
  source: z.object({
    arabic: z.string(),
    translation: z.string(),
    citation: z.string(),
  }),
  audio: z.array(audioTrackSchema).min(1),
  vocabulary: z.array(vocabularySchema).min(1),
  warmup: z.object({
    prompt: z.string(),
    options: z.array(z.string()).min(2),
    feedback: z.string(),
  }),
  practice: z.array(practiceSchema).min(1),
  speak: z.object({
    prompt: z.string(),
    model: z.string(),
    targetTerms: z.array(z.string()).min(1),
  }),
});

export type HadithLesson = z.infer<typeof hadithLessonSchema>;

/**
 * The canonical source block is intentionally stored once. Every later stage
 * references vocabulary and phrases from this object instead of copying the
 * Arabic text or translation into another stage.
 */
export const HADITH_01: HadithLesson = hadithLessonSchema.parse({
  id: "hadith-01",
  number: 1,
  title: "Actions and Intentions",
  titleAr: "الأعمال بالنيات",
  estimatedMinutes: 25,
  purpose:
    "Understand how an action and its reason are connected, then explain a personal purpose in clear English.",
  outcomes: [
    "Identify the main message about actions and intentions.",
    "Understand five core expressions from the Hadith.",
    "Use purpose connectors such as to, in order to, and because.",
    "Explain one everyday action and its sincere intention.",
  ],
  source: {
    arabic:
      "عن أمير المؤمنين أبي حفص عمر بن الخطاب رضي الله عنه قال: سمعت رسول الله صلى الله عليه وسلم يقول: إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى الله ورسوله فهجرته إلى الله ورسوله، ومن كانت هجرته لدنيا يصيبها أو امرأة ينكحها فهجرته إلى ما هاجر إليه.",
    translation:
      "On the authority of Amir al-Mu'minin, Abu Hafs Umar ibn al-Khattab (may Allah be pleased with him), who said: I heard the Messenger of Allah say: Actions are judged by intentions, and each person will have only what they intended. So whoever's migration was for Allah and His Messenger, then his migration was for Allah and His Messenger. But whoever's migration was for some worldly gain, or for a wife he might marry, his migration was for that for which he migrated.",
    citation: "Sahih al-Bukhari and Sahih Muslim · Hadith 1 · Nawawi's Forty Hadith",
  },
  audio: [
    {
      id: "arabic",
      label: "Arabic reading",
      text: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى",
      lang: "ar",
      rate: 0.82,
    },
    {
      id: "translation",
      label: "English translation",
      text: "Actions are judged by intentions, and each person will have only what they intended.",
      lang: "en",
      rate: 0.9,
    },
  ],
  warmup: {
    prompt: "You help a neighbour. Which sentence best explains the purpose?",
    options: [
      "I helped my neighbour because they needed support.",
      "I helped my neighbour to win a competition.",
      "I helped my neighbour, but I did not have a reason.",
    ],
    feedback: "Good. A purpose explains the reason behind an action.",
  },
  vocabulary: [
    {
      id: "action",
      term: "action",
      arabic: "الأعمال",
      partOfSpeech: "noun",
      definition: "A deliberate deed or behaviour that a person performs.",
      example: "Helping a neighbour is a kind action.",
    },
    {
      id: "intention",
      term: "intention",
      arabic: "النيات",
      partOfSpeech: "noun",
      definition: "Your reason or clear plan for doing something.",
      example: "My intention is to study.",
      phrase: "clear intention",
    },
    {
      id: "motive",
      term: "motive",
      arabic: "نية",
      partOfSpeech: "noun",
      definition: "The reason behind an action.",
      example: "Her motive was to help them.",
    },
    {
      id: "migrate",
      term: "migrate",
      arabic: "هجرة",
      partOfSpeech: "verb",
      definition: "To move to another place, often for safety, work, or faith.",
      example: "They migrated to a new city.",
      phrase: "migrate for safety",
    },
    {
      id: "worldly-gain",
      term: "worldly gain",
      arabic: "دنيا",
      partOfSpeech: "noun phrase",
      definition: "Money, status, or another material benefit.",
      example: "He did not act only for worldly gain.",
    },
  ],
  practice: [
    {
      id: "purpose-connector",
      prompt: "I study English ___ understand the lesson.",
      options: ["to", "because", "although"],
      answer: "to",
      explanation: "Use to before a verb to express purpose.",
    },
    {
      id: "reason-connector",
      prompt: "I helped my neighbour ___ they needed support.",
      options: ["because", "to", "in order"],
      answer: "because",
      explanation: "Use because before a clause that gives the reason.",
    },
    {
      id: "meaning-match",
      prompt: "Which meaning best matches worldly gain?",
      options: ["A material benefit", "A clear plan", "A place to migrate"],
      answer: "A material benefit",
      explanation: "Worldly gain means money, status, or another material benefit.",
    },
  ],
  speak: {
    prompt:
      "Describe one everyday action and explain its sincere intention in two or three sentences.",
    model: "I helped my neighbour because they needed support. My intention was to be useful.",
    targetTerms: ["action", "intention", "motive"],
  },
});

export const HADITH_LESSONS = FIGMA_HADITH_LESSONS;

export const getHadithLesson = getFigmaHadithLesson;
