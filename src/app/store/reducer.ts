import type { Screen, Action, OnboardStep } from "../types";
import { COURSE_UNITS, DEFAULT_UNIT_ID, resolveGroup, resolveUnitForLesson } from "../data/lessons";

export const ONBOARD_STEPS: OnboardStep[] = ["splash", "language", "ready"];
export const TABBED_IDS: ReadonlySet<string> = new Set(["home", "explore", "practice", "profile"]);

export const STORAGE_KEY = "wordpix:learner-state:v4";

export function reducer(state: Screen, action: Action): Screen {
  if (action.type === "ONBOARD_NEXT") {
    if (state.id !== "onboarding") return state;
    const i = ONBOARD_STEPS.indexOf(state.step);
    return i < ONBOARD_STEPS.length - 1
      ? { id: "onboarding", step: ONBOARD_STEPS[i + 1] }
      : { id: "home" };
  }
  if (action.type === "GO") {
    if (action.to === "lesson-entry") return { id: "lesson-entry", unitId: action.unitId };
    if (action.to === "skill-hub") return { id: "skill-hub" };
    if (action.to === "onboarding") return { id: "onboarding", step: "splash" };
    if (action.to === "lesson-complete") {
      if (state.id === "lesson") {
        return {
          id: "lesson-complete",
          mode: state.mode,
          sessionId: state.sessionId,
          lessonId: state.lessonId,
          unitId: state.unitId,
          wordQueue: state.wordQueue,
          attempts: state.attempts,
        };
      }
      return state;
    }
    return { id: action.to };
  }
  if (action.type === "OPEN_SKILL_EXERCISE") {
    return { id: "skill-exercise", exerciseId: action.exerciseId };
  }
  if (action.type === "GO_LEARN_WORDS") {
    return { id: "learn-words", lessonId: action.lessonId };
  }
  if (action.type === "START_LESSON") {
    let queue =
      action.wordQueue && action.wordQueue.length > 0
        ? action.wordQueue
        : resolveGroup(action.lessonId).wordIds;

    const mode = action.mode || "NEW_LESSON";

    if (mode === "PRE_LESSON_ASSESSMENT") {
      // Generate a 20-word queue by duplicating and shuffling the base queue
      const shuffled = [];
      while (shuffled.length < 20) {
        const pool = [...queue].sort(() => Math.random() - 0.5);
        shuffled.push(...pool);
      }
      queue = shuffled.slice(0, 20);
    }

    const sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);

    return {
      id: "lesson",
      mode,
      sessionId,
      lessonId: action.lessonId,
      unitId: action.unitId,
      wordQueue: queue,
      step: 0,
      attempts: [],
      startedAt: new Date().toISOString(),
    };
  }
  if (action.type === "LESSON_ATTEMPT") {
    if (state.id !== "lesson") return state;
    const wordId = action.wordId || state.wordQueue[0] || "bed";
    return {
      ...state,
      attempts: [
        ...state.attempts,
        {
          exerciseStep: state.step,
          wordId,
          correct: action.correct,
          answeredAt: new Date().toISOString(),
        },
      ],
    };
  }
  if (action.type === "LESSON_NEXT") {
    if (state.id !== "lesson") return state;
    if (state.step >= 5) {
      return {
        id: "lesson-complete",
        mode: state.mode,
        sessionId: state.sessionId,
        lessonId: state.lessonId,
        unitId: state.unitId,
        wordQueue: state.wordQueue,
        attempts: state.attempts,
      };
    }
    return { ...state, step: state.step + 1 };
  }
  if (action.type === "LESSON_PREVIOUS") {
    if (state.id !== "lesson") return state;
    if (state.step === 0) {
      const unitId = state.unitId || resolveUnitForLesson(state.lessonId).id;
      return { id: "lesson-entry", unitId };
    }
    return { ...state, step: state.step - 1 };
  }
  if (action.type === "LESSON_GOTO_STEP") {
    if (state.id !== "lesson") return state;
    if (action.step < 0 || action.step > 4) return state;
    if (action.step === state.step) return state;
    return { ...state, step: action.step };
  }
  return state;
}

export function ariaLiveAnnounce(msg: string) {
  const el = document.getElementById("a11y-live-region");
  if (el) el.textContent = msg;
}

export function describeScreen(screen: Screen, t: (key: string) => string): string {
  switch (screen.id) {
    case "onboarding":
      return `${t("app.title")}: ${screen.step}`;
    case "home":
      return t("nav.home");
    case "explore":
      return t("nav.explore");
    case "practice":
      return t("nav.practice");
    case "profile":
      return t("nav.profile");
    case "lesson":
      return `Lesson step ${screen.step + 1} of 6`;
    case "lesson-complete":
      return "Session complete";
    case "lesson-entry":
      return COURSE_UNITS[screen.unitId ?? DEFAULT_UNIT_ID].name;
    case "skill-hub":
      return "Skill exercises";
    case "skill-exercise":
      return screen.exerciseId;
    default:
      return "";
  }
}
