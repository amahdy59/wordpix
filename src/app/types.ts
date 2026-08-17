// Shared TypeScript types for the WordPix app state machine

export type OnboardStep = "splash" | "language" | "ready";
export type TabId = "home" | "explore" | "practice" | "profile";

export type LearnerMode = "NEW_LESSON" | "SMART_REVIEW" | "SKILL_PRACTICE" | "UNIT_ASSESSMENT" | "PRE_LESSON_ASSESSMENT";
export type SkillCategory = "listening" | "reading" | "speaking" | "writing";

export type SkillExerciseId =
  // Listening (9)
  | "listen-word-match"
  | "listen-audio-scene-match"
  | "listen-dictation-sprint"
  | "listen-vocab-spotting"
  | "listen-dialogue-roleplay"
  | "listen-selective-shadowing"
  | "listen-results"
  | "listen-warmup-review"
  | "listen-podcast-comprehension"
  // Reading (9)
  | "read-visual-context"
  | "read-progressive-reveal"
  | "read-error-detection"
  | "read-comic-strip"
  | "read-infographic"
  | "read-category-sort"
  | "read-results"
  | "read-subtitle-correction"
  | "read-confidence-check"
  // Speaking (8)
  | "speak-echo-practice"
  | "speak-scenario-response"
  | "speak-photo-narration"
  | "speak-video-roleplay"
  | "speak-compare-contrast"
  | "speak-word-chain"
  | "speak-self-repair"
  | "speak-results"
  // Writing (9)
  | "write-caption-builder"
  | "write-sentence-assembly"
  | "write-photo-journal"
  | "write-video-summary"
  | "write-error-correction"
  | "write-paraphrase-challenge"
  | "write-image-story-chain"
  | "write-results"
  | "write-timed-sprint";

export interface AnswerAttempt {
  exerciseStep: number;
  wordId: string;
  correct: boolean;
  answeredAt: string;
}

export type Screen =
  | { id: "onboarding"; step: OnboardStep }
  | { id: "home" }
  | { id: "explore" }
  | { id: "practice" }
  | { id: "profile" }
  | { id: "lesson-entry"; unitId?: string }
  /** Self-paced word browsing for one group — no session, no scoring. */
  | { id: "learn-words"; lessonId: string }
  | { id: "skill-hub" }
  | { id: "skill-exercise"; exerciseId: SkillExerciseId }
  | {
      id: "lesson";
      mode: LearnerMode;
      sessionId: string;
      lessonId: string;
      unitId?: string;
      wordQueue: string[];
      step: number;
      attempts: AnswerAttempt[];
      startedAt: string;
    }
  | {
      id: "lesson-complete";
      mode: LearnerMode;
      sessionId: string;
      lessonId: string;
      unitId?: string;
      wordQueue: string[];
      attempts: AnswerAttempt[];
    };

/** Every destination GO can reach. Previously widened by an `as TabId` cast. */
export type GoTarget = TabId | "lesson-entry" | "lesson-complete" | "skill-hub" | "onboarding";

export type Action =
  | { type: "ONBOARD_NEXT" }
  | { type: "GO"; to: Exclude<GoTarget, "lesson-entry"> }
  | { type: "GO"; to: "lesson-entry"; unitId?: string }
  | { type: "OPEN_SKILL_EXERCISE"; exerciseId: SkillExerciseId }
  /** Enters self-paced word browsing for one group. */
  | { type: "GO_LEARN_WORDS"; lessonId: string }
  /**
   * `lessonId` is required, and deliberately so. It was optional, and three of
   * the four call sites omitted it — so the reducer fell back to the first
   * group and every lesson in the app collapsed onto the same five words.
   * Making it required turns that class of bug into a compile error.
   */
  | { type: "START_LESSON"; lessonId: string; mode?: LearnerMode; wordQueue?: string[]; unitId?: string }
  | { type: "LESSON_ATTEMPT"; wordId?: string; correct: boolean }
  | { type: "LESSON_NEXT" }
  | { type: "LESSON_PREVIOUS" }
  /** Jump to a specific 0-based step, used when the browser Back/Forward
      buttons move through the lesson's own history entries. */
  | { type: "LESSON_GOTO_STEP"; step: number };
