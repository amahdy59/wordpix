/**
 * Typed schema for WordPix curriculum usage, scenes, and contextual materials.
 * Generated from WordPix_Complete_Curriculum_Final_Revised.xlsx.
 */

export interface UsageCheck {
  question: string;
  options: string[];
  expectedAnswer: string;
}

export interface UsageSceneChunk {
  chunkNumber: number;
  targetWords: string[];
  scenario: string;
  check: UsageCheck;
  imageBrief: string;
}

export interface LessonUsageMetadata {
  goal: string;
  canDoStatement: string;
  textType: string;
  readingTarget: string;
  scenes: UsageSceneChunk[];
}

export interface LessonReading {
  title: string;
  text: string;
  imageBrief: string;
}

export interface LessonExercise {
  prompt: string;
  answer: string;
}

export interface LessonVideoPlan {
  title: string;
  idea: string;
  scriptStarter: string;
}

export interface LessonUsageData {
  lessonId: string;
  lessonName: string;
  unitId: string;
  unitName: string;
  unitOrder: number;
  lessonOrderInUnit: number;
  globalOrder: number;
  cefrStage: string;
  stageName: string;
  targetWordsEnglish: string[];
  targetWordsArabic: string[];
  usage: LessonUsageMetadata;
  reading: LessonReading;
  exercises: LessonExercise[];
  video: LessonVideoPlan;
  spacedReview: string;
}

export type UnitUsageData = LessonUsageData[];
