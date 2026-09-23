export const HADITH_STAGE_IDS = [
  "overview",
  "warm-up",
  "read-listen",
  "vocabulary",
  "practice",
  "speak",
  "check-review",
] as const;

export type HadithStageId = (typeof HADITH_STAGE_IDS)[number];
