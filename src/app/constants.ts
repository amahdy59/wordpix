// Design tokens and app-wide constants — single source of truth

export const COLORS = {
  rose: "#cc6363",
  roseBg: "#fdecec",
  blue: "#4a90ff",
  green: "#40a673",
  amber: "#ffd600",
  bg: "#f7f7f7",
  card: "#ffffff",
  textPrimary: "#171717",
  textSecondary: "#525252",
  border: "#e5e5e5",
  slate: "#94a3b8",
} as const;

export const ONBOARD_STEPS = [
  "splash",
  "language",
  "age",
  "interests",
  "ready",
] as const;

export const AGE_ITEMS: { n: number; ar: string }[] = [
  { n: 6, ar: "٦ سنوات" },
  { n: 7, ar: "٧ سنوات" },
  { n: 8, ar: "٨ سنوات" },
  { n: 9, ar: "٩ سنوات" },
  { n: 10, ar: "١٠ سنوات" },
  { n: 11, ar: "١١ سنة" },
  { n: 12, ar: "١٢ سنة" },
  { n: 14, ar: "١٤ سنة" },
  { n: 16, ar: "١٦ سنة" },
  { n: 18, ar: "١٨ سنة" },
  { n: 20, ar: "٢٠ سنة" },
  { n: 25, ar: "٢٥ سنة" },
  { n: 30, ar: "٣٠ سنة" },
  { n: 35, ar: "٣٥ سنة" },
  { n: 40, ar: "٤٠+ سنة" },
];

export const SCENE_HOTSPOTS: {
  id: string;
  label: string;
  ar: string;
  left: string;
  top: string;
}[] = [
  { id: "pillow", label: "Pillow", ar: "وسادة • wi-sa-dah", left: "47%", top: "54%" },
  { id: "lamp",   label: "Lamp",   ar: "مصباح • mis-baah", left: "13%", top: "38%" },
  { id: "bed",    label: "Bed",    ar: "سرير • sa-reer",   left: "28%", top: "64%" },
  { id: "wardrobe", label: "Wardrobe", ar: "خزانة • khi-za-na", left: "72%", top: "30%" },
];

export const SENTENCE_FIXED_WORDS = ["The", "lamp", "is"] as const;
export const SENTENCE_POOL_INITIAL = ["on", "the", "desk"] as const;

export const EXERCISE_STEPS = [
  "scene",
  "listen",
  "recall",
  "fill",
  "builder",
  "quiz",
] as const;

export type ExerciseStep = (typeof EXERCISE_STEPS)[number];
