import { findLessonContextSentence } from "./lessonContext";
import type { LessonExercise, LessonUsageData, ResponseMode } from "./usageTypes";

interface ReferenceProfile {
  unitId: string;
  contextTag: string;
  setting: string;
  audience: string;
  register: "everyday" | "service" | "professional" | "academic";
  transferLead: (words: string) => string;
  prompts: (
    first: string,
    second: string,
    third: string
  ) => Array<{
    prompt: string;
    questionType: LessonExercise["questionType"];
    responseMode: ResponseMode;
  }>;
}

function promptsFor(
  setting: string,
  audience: string,
  first: string,
  second: string,
  third: string
): ReturnType<ReferenceProfile["prompts"]> {
  return [
    {
      prompt: `Why might ${audience} need to distinguish between ${first} and ${second} in ${setting}?`,
      questionType: "inference",
      responseMode: "short-answer",
    },
    {
      prompt: `Compare ${first} with ${second} in ${setting}. What different purpose does each serve?`,
      questionType: "comparison",
      responseMode: "extended-response",
    },
    {
      prompt: `Write two connected sentences for ${setting} using ${first} and ${second}. Make the relationship clear.`,
      questionType: "production",
      responseMode: "sentence",
    },
    {
      prompt: `Explain a choice to ${audience}. Use ${first} and ${second}, then give one reason.`,
      questionType: "production",
      responseMode: "spoken",
    },
    {
      prompt: `New situation: ${setting}. Use ${first}, ${second}, and ${third} to solve a small problem.`,
      questionType: "transfer",
      responseMode: "extended-response",
    },
  ];
}

const PROFILES: Record<string, ReferenceProfile> = {
  colors: {
    unitId: "colors",
    contextTag: "accessible-community-poster",
    setting: "an accessibility review for a community poster",
    audience: "a designer",
    register: "everyday",
    transferLead: (words) =>
      `A community group checks whether its poster is clear and easy to read. The designer compares ${words} before choosing the final palette.`,
    prompts: (first, second, third) => [
      {
        prompt: `The poster must be easy to read. Why might the designer choose ${first} instead of ${second}?`,
        questionType: "inference",
        responseMode: "short-answer",
      },
      {
        prompt: `Compare ${first} and ${second}. Which would you use for the heading, and why?`,
        questionType: "comparison",
        responseMode: "extended-response",
      },
      {
        prompt: `Write two short poster sentences using ${first} and ${second}.`,
        questionType: "production",
        responseMode: "sentence",
      },
      {
        prompt: `Tell a designer which color you prefer. Use ${first} and ${second}.`,
        questionType: "production",
        responseMode: "spoken",
      },
      {
        prompt: `A new poster needs three colors. Use ${first}, ${second}, and ${third} to describe your plan.`,
        questionType: "transfer",
        responseMode: "extended-response",
      },
    ],
  },
  farm: {
    unitId: "farm",
    contextTag: "restaurant-sourcing-visit",
    setting: "a restaurant team's visit to a local farm",
    audience: "a restaurant manager",
    register: "service",
    transferLead: (words) =>
      `A restaurant team visits a local farm to choose ingredients and understand how food is produced. The farmer discusses ${words} while the team plans its menu.`,
    prompts: (first, second, third) =>
      promptsFor(
        "a restaurant team's visit to a local farm",
        "a restaurant manager",
        first,
        second,
        third
      ),
  },
  "accessories-jewelry": {
    unitId: "accessories-jewelry",
    contextTag: "business-trip-packing",
    setting: "packing for a formal business trip",
    audience: "a colleague",
    register: "everyday",
    transferLead: (words) =>
      `Before a formal business trip, a traveler chooses practical accessories for meetings and the journey. They compare ${words} with each outfit and explain what they will pack.`,
    prompts: (first, second, third) =>
      promptsFor("packing for a formal business trip", "a colleague", first, second, third),
  },
  airport: {
    unitId: "airport",
    contextTag: "schedule-change-support",
    setting: "helping a first-time traveler after a flight change",
    audience: "the traveler",
    register: "service",
    transferLead: (words) =>
      `A first-time traveler needs help after the departure time changes. Airport staff use ${words} to explain the options and help the traveler decide what to do next.`,
    prompts: (first, second, third) =>
      promptsFor(
        "helping a first-time traveler after a flight change",
        "the traveler",
        first,
        second,
        third
      ),
  },
  "3d-printer-lab": {
    unitId: "3d-printer-lab",
    contextTag: "medical-prototype-review",
    setting: "a safety review for a medical prototype",
    audience: "the engineering team",
    register: "professional",
    transferLead: (words) =>
      `An engineering team reviews a medical prototype before approving another print. The team examines ${words} and explains how each one affects safety, accuracy, or production.`,
    prompts: (first, second, third) =>
      promptsFor(
        "a safety review for a medical prototype",
        "the engineering team",
        first,
        second,
        third
      ),
  },
  "architect-s-studio": {
    unitId: "architect-s-studio",
    contextTag: "public-library-consultation",
    setting: "a public consultation about a new library",
    audience: "local residents",
    register: "professional",
    transferLead: (words) =>
      `Residents review plans for a new public library with the architect. The discussion connects ${words} to accessibility, comfort, and the way people will use the building.`,
    prompts: (first, second, third) =>
      promptsFor(
        "a public consultation about a new library",
        "local residents",
        first,
        second,
        third
      ),
  },
};

function joinNatural(words: string[]): string {
  if (words.length <= 1) return words[0] ?? "the lesson language";
  if (words.length === 2) return `${words[0]} and ${words[1]}`;
  return `${words.slice(0, -1).join(", ")}, and ${words.at(-1)}`;
}

function modelSentence(lesson: LessonUsageData, label: string): string {
  return (
    findLessonContextSentence({ label }, lesson) ??
    `A clear response uses ${label} accurately in the new situation.`
  );
}

export function enrichReferenceLesson(lesson: LessonUsageData): LessonUsageData {
  const profile = PROFILES[lesson.unitId];
  if (!profile) return lesson;

  const [first, second = first, third = second] = lesson.targetWordsEnglish;
  const extensionTargets = lesson.usage.scenes.map((scene) => scene.targetWords);
  const contextExtensions = extensionTargets.map((targets, index) => ({
    contextTag: `${profile.contextTag}-${index + 1}`,
    setting: profile.setting,
    targetWords: targets,
    text: profile.transferLead(joinNatural(targets)),
    register: profile.register,
  }));
  const model = `${modelSentence(lesson, first)} ${modelSentence(lesson, second)}`;
  const editorialExercises: LessonExercise[] = profile
    .prompts(first, second, third)
    .map((exercise) => ({
      ...exercise,
      answer: model,
      contextTag: profile.contextTag,
    }));

  return {
    ...lesson,
    exercises: [...lesson.exercises, ...editorialExercises],
    contextExtensions,
  };
}

export function isReferenceUnit(unitId: string): boolean {
  return unitId in PROFILES;
}
