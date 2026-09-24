export const HADITH_STAGE_IDS = [
  "read-listen",
  "vocabulary",
  "practice",
  "speak",
  "check-review",
] as const;

export const FIGMA_HADITH_STAGE_IDS = ["overview", "warm-up", ...HADITH_STAGE_IDS] as const;

export type HadithStageId = (typeof HADITH_STAGE_IDS)[number];
