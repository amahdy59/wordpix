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
  "interests",
  "ready",
] as const;

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
