// Shared TypeScript types for the WordPix app state machine

export type OnboardStep = "splash" | "language" | "interests" | "ready";
export type TabId = "home" | "explore" | "practice" | "profile";

export type Screen =
  | { id: "onboarding"; step: OnboardStep }
  | { id: "home" }
  | { id: "explore" }
  | { id: "practice" }
  | { id: "profile" }
  | { id: "lesson-entry" }
  | { id: "lesson"; step: number }
  | { id: "lesson-complete" };

export type Action =
  | { type: "ONBOARD_NEXT" }
  | { type: "GO"; to: TabId | "lesson-entry" | "lesson-complete" }
  | { type: "START_LESSON" }
  | { type: "LESSON_NEXT" };
