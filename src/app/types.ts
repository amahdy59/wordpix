// Shared TypeScript types for the WordPix app state machine

export type OnboardStep = "splash" | "language" | "ready";
export type TabId = "home" | "explore" | "practice" | "profile";

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
  | { id: "lesson-entry" }
  | { id: "skill-hub" }
  | { id: "skill-exercise"; exerciseId: SkillExerciseId }
  | {
      id: "lesson";
      sessionId: string;
      groupId: string;
      wordQueue: string[];
      step: number;
      attempts: AnswerAttempt[];
      startedAt: string;
    }
  | {
      id: "lesson-complete";
      sessionId: string;
      groupId: string;
      wordQueue: string[];
      attempts: AnswerAttempt[];
    };

export type Action =
  | { type: "ONBOARD_NEXT" }
  | { type: "GO"; to: TabId | "lesson-entry" | "lesson-complete" | "skill-hub" }
  | { type: "OPEN_SKILL_EXERCISE"; exerciseId: SkillExerciseId }
  | { type: "START_LESSON"; groupId?: string; wordId?: string; wordQueue?: string[] }
  | { type: "LESSON_SELECT_WORD"; wordId: string }
  | { type: "LESSON_ATTEMPT"; wordId?: string; correct: boolean }
  | { type: "LESSON_NEXT" }
  | { type: "LESSON_PREVIOUS" };
