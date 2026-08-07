import { useEffect, useReducer, lazy, Suspense } from "react";
import type { Screen, Action, OnboardStep, TabId } from "./types";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { BEDROOM_VOCABULARY } from "./data/lessons";

// Synchronous core onboarding screens
import { SplashWelcome } from "./onboarding/SplashWelcome";
import { LanguageSelect } from "./onboarding/LanguageSelect";
import { ReadyCelebration } from "./onboarding/ReadyCelebration";

// Synchronous core tab views
import { HomeDashboard } from "./core/HomeDashboard";
import { AppShell } from "./shared/AppShell";

// Lazy-loaded routes & heavy exercises (Code-splitting)
const ExploreWorlds = lazy(() => import("./core/ExploreWorlds").then((m) => ({ default: m.ExploreWorlds })));
const ProfileStats = lazy(() => import("./core/ProfileStats").then((m) => ({ default: m.ProfileStats })));
const ReviewMasteryReview = lazy(() => import("./review/ReviewMasteryReview").then((m) => ({ default: m.ReviewMasteryReview })));

const LessonWorldEntry = lazy(() => import("./lesson/LessonWorldEntry").then((m) => ({ default: m.LessonWorldEntry })));
const LessonSceneDiscovery = lazy(() => import("./lesson/LessonSceneDiscovery").then((m) => ({ default: m.LessonSceneDiscovery })));
const LessonCompleteResults = lazy(() => import("./lesson/LessonCompleteResults").then((m) => ({ default: m.LessonCompleteResults })));

const ExerciseListenRepeat = lazy(() => import("./exercises/ExerciseListenRepeat").then((m) => ({ default: m.ExerciseListenRepeat })));
const ExerciseRecallMatch = lazy(() => import("./exercises/ExerciseRecallMatch").then((m) => ({ default: m.ExerciseRecallMatch })));
const ExerciseContextFill = lazy(() => import("./exercises/ExerciseContextFill").then((m) => ({ default: m.ExerciseContextFill })));
const ExerciseSentenceBuilder = lazy(() => import("./exercises/ExerciseSentenceBuilder").then((m) => ({ default: m.ExerciseSentenceBuilder })));
const ExerciseQuickQuiz = lazy(() => import("./exercises/ExerciseQuickQuiz").then((m) => ({ default: m.ExerciseQuickQuiz })));

// ── State machine ─────────────────────────────────────────────────────────────

const ONBOARD_STEPS: OnboardStep[] = ["splash", "language", "ready"];
const TABBED_IDS: ReadonlySet<string> = new Set(["home", "explore", "practice", "profile"]);

const STORAGE_KEY = "wordpix:learner-state:v1";
const DEFAULT_WORD_ID = "pillow";

export function reducer(state: Screen, action: Action): Screen {
  if (action.type === "ONBOARD_NEXT") {
    if (state.id !== "onboarding") return state;
    const i = ONBOARD_STEPS.indexOf(state.step);
    return i < ONBOARD_STEPS.length - 1
      ? { id: "onboarding", step: ONBOARD_STEPS[i + 1] }
      : { id: "home" };
  }
  if (action.type === "GO") {
    if (action.to === "lesson-entry") return { id: "lesson-entry" };
    if (action.to === "lesson-complete") {
      if (state.id === "lesson") {
        return {
          id: "lesson-complete",
          selectedWordId: state.selectedWordId,
          attempts: state.attempts,
        };
      }
      return state;
    }
    return { id: action.to };
  }
  if (action.type === "START_LESSON") {
    return {
      id: "lesson",
      step: 0,
      selectedWordId: action.wordId ?? DEFAULT_WORD_ID,
      attempts: [],
      startedAt: new Date().toISOString(),
    };
  }
  if (action.type === "LESSON_SELECT_WORD") {
    if (state.id !== "lesson" || state.step !== 0) return state;
    return { ...state, selectedWordId: action.wordId };
  }
  if (action.type === "LESSON_ATTEMPT") {
    if (state.id !== "lesson") return state;
    return {
      ...state,
      attempts: [
        ...state.attempts,
        {
          exerciseStep: state.step,
          wordId: state.selectedWordId,
          correct: action.correct,
          answeredAt: new Date().toISOString(),
        },
      ],
    };
  }
  if (action.type === "LESSON_NEXT") {
    if (state.id !== "lesson") return state;
    return state.step >= 5
      ? {
          id: "lesson-complete",
          selectedWordId: state.selectedWordId,
          attempts: state.attempts,
        }
      : { ...state, step: state.step + 1 };
  }
  if (action.type === "LESSON_PREVIOUS") {
    if (state.id !== "lesson") return state;
    return { ...state, step: Math.max(0, state.step - 1) };
  }
  return state;
}

const EX_STEPS = ["scene", "listen", "recall", "fill", "builder", "quiz"] as const;
type ExStep = (typeof EX_STEPS)[number];

// ── Loading Fallback Component ───────────────────────────────────────────────

const LoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[300px] p-6 text-center" aria-live="polite">
    <div className="flex flex-col items-center gap-3">
      <div className="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin" aria-hidden />
      <p className="font-sans font-semibold text-muted-foreground text-sm">Loading screen…</p>
    </div>
  </div>
);

const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-sans font-semibold text-sm z-50 motion-safe:transition-none"
  >
    Skip to content
  </a>
);

export default function App() {
  const [state, dispatch] = useReducer(
    reducer,
    { id: "onboarding", step: "splash" },
    (fallback): Screen => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return fallback;
        const parsed = JSON.parse(saved) as Screen;
        if (!parsed || typeof parsed !== "object" || typeof parsed.id !== "string") return fallback;
        if (
          parsed.id === "lesson" &&
          !BEDROOM_VOCABULARY.some((word) => word.id === parsed.selectedWordId)
        ) {
          return fallback;
        }
        return parsed;
      } catch {
        return fallback;
      }
    }
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function renderContent() {
    if (state.id === "onboarding") {
      if (state.step === "splash") return <SplashWelcome dispatch={dispatch} />;
      if (state.step === "language") return <LanguageSelect dispatch={dispatch} />;
      if (state.step === "ready") return <ReadyCelebration dispatch={dispatch} />;
    }
    if (state.id === "home") return <HomeDashboard dispatch={dispatch} />;
    if (state.id === "explore") return <ExploreWorlds dispatch={dispatch} />;
    if (state.id === "practice") return <ReviewMasteryReview dispatch={dispatch} />;
    if (state.id === "profile") return <ProfileStats dispatch={dispatch} />;
    if (state.id === "lesson-entry") return <LessonWorldEntry dispatch={dispatch} />;
    if (state.id === "lesson") {
      const ex: ExStep = EX_STEPS[state.step] ?? "scene";
      const word = BEDROOM_VOCABULARY.find((item) => item.id === state.selectedWordId) ?? BEDROOM_VOCABULARY[0];
      if (ex === "scene") return <LessonSceneDiscovery selectedWordId={word.id} dispatch={dispatch} />;
      if (ex === "listen") return <ExerciseListenRepeat word={word} step={state.step} dispatch={dispatch} />;
      if (ex === "recall") return <ExerciseRecallMatch word={word} step={state.step} dispatch={dispatch} />;
      if (ex === "fill") return <ExerciseContextFill word={word} step={state.step} dispatch={dispatch} />;
      if (ex === "builder") return <ExerciseSentenceBuilder word={word} step={state.step} dispatch={dispatch} />;
      if (ex === "quiz") return <ExerciseQuickQuiz word={word} step={state.step} dispatch={dispatch} />;
    }
    if (state.id === "lesson-complete") {
      return <LessonCompleteResults attempts={state.attempts} selectedWordId={state.selectedWordId} dispatch={dispatch} />;
    }
    return null;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        {/* Onboarding Layout */}
        {state.id === "onboarding" && (
          <div className="min-h-svh bg-secondary flex items-center justify-center p-0 md:p-8">
            <SkipLink />
            <div
              id="main-content"
              className="min-h-svh md:min-h-0 w-full md:max-w-[420px] md:rounded-3xl md:overflow-hidden md:shadow-wp-md"
            >
              {renderContent()}
            </div>
          </div>
        )}

        {/* Core Tabbed Layout */}
        {TABBED_IDS.has(state.id) && (
          <>
            <SkipLink />
            <AppShell activeTab={state.id as TabId} dispatch={dispatch}>
              {renderContent()}
            </AppShell>
          </>
        )}

        {/* Scene Discovery Layout */}
        {state.id === "lesson" && EX_STEPS[state.step] === "scene" && (
          <div className="min-h-svh bg-background">
            <SkipLink />
            <div id="main-content" className="w-full min-h-svh flex flex-col">
              {renderContent()}
            </div>
          </div>
        )}

        {/* Exercises & Lesson Complete Layout */}
        {state.id !== "onboarding" &&
          !TABBED_IDS.has(state.id) &&
          !(state.id === "lesson" && EX_STEPS[state.step] === "scene") && (
            <div className="min-h-svh bg-background">
              <SkipLink />
              <div id="main-content" className="w-full min-h-svh flex flex-col">
                {renderContent()}
              </div>
            </div>
          )}
      </Suspense>
    </ErrorBoundary>
  );
}
