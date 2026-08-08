import { useEffect, useReducer, Suspense, useCallback } from "react";
import type { Screen, Action, OnboardStep, TabId } from "./types";
import type { RouteIntent } from "./router/useHashRouter";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { BEDROOM_VOCABULARY, BEDROOM_GROUPS } from "./data/lessons";
import { LearnerProvider } from "./context/LearnerContext";
import { I18nProvider, useI18n } from "./context/I18nContext";
import { useHashRouter, hashToScreen } from "./router/useHashRouter";

import { registerServiceWorker } from "../pwa";
import { startSystemThemeSync } from "./shared/themeStore";
import { useApplyAccessibilityPreferences } from "./shared/useAccessibilityPreferences";

// Synchronous core onboarding screens
import { SplashWelcome } from "./onboarding/SplashWelcome";
import { LanguageSelect } from "./onboarding/LanguageSelect";
import { ReadyCelebration } from "./onboarding/ReadyCelebration";

// Synchronous core tab views for instant (<1ms) tab switching
import { HomeDashboard } from "./core/HomeDashboard";
import { ExploreWorlds } from "./core/ExploreWorlds";
import { ReviewMasteryReview } from "./review/ReviewMasteryReview";
import { ProfileStats } from "./core/ProfileStats";
import { AppShell } from "./shared/AppShell";
import { SkillExerciseHub } from "./core/SkillExerciseHub";

// Synchronous core lesson & exercise components for instant zero-blank rendering
import { LessonWorldEntry } from "./lesson/LessonWorldEntry";
import { LessonSceneDiscovery } from "./lesson/LessonSceneDiscovery";
import { LessonCompleteResults } from "./lesson/LessonCompleteResults";

import { ExerciseListenRepeat } from "./exercises/ExerciseListenRepeat";
import { ExerciseRecallMatch } from "./exercises/ExerciseRecallMatch";
import { ExerciseContextFill } from "./exercises/ExerciseContextFill";
import { ExerciseSentenceBuilder } from "./exercises/ExerciseSentenceBuilder";
import { ExerciseQuickQuiz } from "./exercises/ExerciseQuickQuiz";

import { SKILL_EXERCISES } from "./exercises/registry";

// ── State machine ─────────────────────────────────────────────────────────────

const ONBOARD_STEPS: OnboardStep[] = ["splash", "language", "ready"];
const TABBED_IDS: ReadonlySet<string> = new Set(["home", "explore", "practice", "profile"]);

const STORAGE_KEY = "wordpix:learner-state:v4";

export function reducer(state: Screen, action: Action): Screen {
  if (action.type === "ONBOARD_NEXT") {
    if (state.id !== "onboarding") return state;
    const i = ONBOARD_STEPS.indexOf(state.step);
    // No DOM writes here: reducers must stay pure. React double-invokes them in
    // StrictMode and may replay them, so announcing from inside one produced
    // duplicate announcements. The announcement now happens in an effect.
    return i < ONBOARD_STEPS.length - 1
      ? { id: "onboarding", step: ONBOARD_STEPS[i + 1] }
      : { id: "home" };
  }
  if (action.type === "GO") {
    if (action.to === "lesson-entry") return { id: "lesson-entry" };
    if (action.to === "skill-hub") return { id: "skill-hub" };
    // Onboarding is the one screen that carries required state of its own;
    // `{ id: "onboarding" }` without a step renders nothing at all.
    if (action.to === "onboarding") return { id: "onboarding", step: "splash" };
    if (action.to === "lesson-complete") {
      if (state.id === "lesson") {
        return {
          id: "lesson-complete",
          sessionId: state.sessionId,
          groupId: state.groupId,
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
  if (action.type === "START_LESSON") {
    const group = BEDROOM_GROUPS.find((g) => g.id === action.groupId) ?? BEDROOM_GROUPS[0];
    const queue = action.wordQueue && action.wordQueue.length > 0 ? action.wordQueue : group.wordIds;
    const sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);

    return {
      id: "lesson",
      sessionId,
      groupId: group.id,
      wordQueue: queue,
      step: 0,
      attempts: [],
      startedAt: new Date().toISOString(),
    };
  }
  if (action.type === "LESSON_SELECT_WORD") {
    if (state.id !== "lesson" || state.step !== 0) return state;
    const newQueue = [action.wordId, ...state.wordQueue.filter((id) => id !== action.wordId)];
    return {
      ...state,
      wordQueue: newQueue,
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
        sessionId: state.sessionId,
        groupId: state.groupId,
        wordQueue: state.wordQueue,
        attempts: state.attempts,
      };
    }
    return { ...state, step: state.step + 1 };
  }
  if (action.type === "LESSON_PREVIOUS") {
    if (state.id !== "lesson") return state;
    if (state.step === 0) return { id: "lesson-entry" };
    return { ...state, step: state.step - 1 };
  }
  if (action.type === "LESSON_GOTO_STEP") {
    // Browser Back/Forward moving through the lesson's history entries. The
    // session, queue, and recorded attempts are preserved — only the step
    // moves, which is why the URL cannot simply be replayed as a whole Screen.
    if (state.id !== "lesson") return state;
    if (action.step < 0 || action.step > 5) return state;
    if (action.step === state.step) return state;
    return { ...state, step: action.step };
  }
  return state;
}

function ariaLiveAnnounce(msg: string) {
  const el = document.getElementById("a11y-live-region");
  if (el) el.textContent = msg;
}

/** Human-readable name of the current screen, for the live region. */
function describeScreen(screen: Screen, t: (key: string) => string): string {
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
      return "The Bedroom";
    case "skill-hub":
      return "Skill exercises";
    case "skill-exercise":
      return screen.exerciseId;
    default:
      return "";
  }
}

const EX_STEPS = ["scene", "listen", "recall", "fill", "builder", "quiz"] as const;
type ExStep = (typeof EX_STEPS)[number];

const LoadingFallback = () => {
  const { t } = useI18n();
  return (
    <div className="flex-1 flex items-center justify-center min-h-[300px] p-6 text-center" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <div
          className="size-10 rounded-full border-4 border-primary border-t-transparent motion-safe:animate-spin"
          aria-hidden
        />
        <p className="font-sans font-semibold text-muted-foreground text-sm">{t("app.loading")}</p>
      </div>
    </div>
  );
};

const SkipLink = () => {
  const { t } = useI18n();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-sans font-semibold text-sm z-50 motion-safe:transition-none"
    >
      {t("app.skipToContent")}
    </a>
  );
};

function AppInner() {
  const { t } = useI18n();
  const [state, dispatch] = useReducer(
    reducer,
    { id: "onboarding", step: "splash" },
    (fallback): Screen => {
      if (typeof window !== "undefined" && window.location.hash) {
        const routeMatch = hashToScreen(window.location.hash);
        if (routeMatch) return routeMatch.screen;
      }
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return fallback;
        const parsed = JSON.parse(saved) as Screen;
        if (!parsed || typeof parsed !== "object" || typeof parsed.id !== "string") return fallback;
        return parsed;
      } catch {
        return fallback;
      }
    }
  );

  /**
   * Applies a URL change to the state machine.
   *
   * This used to be `dispatch({ type: "GO", to: newScreen.id as TabId })`,
   * which threw away the resolved screen's payload. Navigating to #/onboarding
   * produced `{ id: "onboarding" }` with no `step`, so renderContent fell
   * through every branch and rendered a blank page. The `as TabId` cast is what
   * let that compile.
   */
  const handleRoute = useCallback((intent: RouteIntent) => {
    if (intent.kind === "lesson-step") {
      dispatch({ type: "LESSON_GOTO_STEP", step: intent.step });
      return;
    }
    if (intent.kind === "lesson-complete") {
      dispatch({ type: "GO", to: "lesson-complete" });
      return;
    }

    const { screen } = intent;
    if (screen.id === "onboarding") {
      dispatch({ type: "GO", to: "onboarding" });
      return;
    }
    if (screen.id === "skill-exercise") {
      dispatch({ type: "OPEN_SKILL_EXERCISE", exerciseId: screen.exerciseId });
      return;
    }
    if (screen.id === "lesson") return; // Not reachable from a URL alone.
    dispatch({ type: "GO", to: screen.id });
  }, []);

  useHashRouter(state, handleRoute);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Keeps "system" theme honest when the OS switches while the app is open.
  useEffect(() => startSystemThemeSync(), []);

  // Applies text scaling and high-contrast mode to <html>.
  useApplyAccessibilityPreferences();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // Safari private mode and quota exhaustion both throw here. This was
      // previously unguarded inside an effect, so it took the app down.
      // LearnerContext already wrapped its own writes; this one did not.
      console.warn("Could not persist navigation state.", error);
    }
  }, [state]);

  // Announce navigation changes from an effect, not from the reducer.
  useEffect(() => {
    ariaLiveAnnounce(describeScreen(state, t));
  }, [state, t]);

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
    if (state.id === "skill-hub") return <SkillExerciseHub dispatch={dispatch} />;

    if (state.id === "skill-exercise") {
      const SkillExercise = SKILL_EXERCISES[state.exerciseId];
      // Unknown id (e.g. a stale persisted state) falls back rather than
      // rendering nothing.
      if (!SkillExercise) return <ExploreWorlds dispatch={dispatch} />;
      return <SkillExercise dispatch={dispatch} />;
    }

    if (state.id === "lesson") {
      const ex: ExStep = EX_STEPS[state.step] ?? "scene";
      const groupWords = state.wordQueue
        .map((id) => BEDROOM_VOCABULARY.find((item) => item.id === id))
        .filter(Boolean) as typeof BEDROOM_VOCABULARY;
      
      const activeGroupWords = groupWords.length > 0 ? groupWords : BEDROOM_VOCABULARY.slice(0, 5);

      if (ex === "scene") return <LessonSceneDiscovery selectedWordId={activeGroupWords[0].id} dispatch={dispatch} />;
      if (ex === "listen") return <ExerciseListenRepeat words={activeGroupWords} step={state.step} groupId={state.groupId} dispatch={dispatch} />;
      if (ex === "recall") return <ExerciseRecallMatch words={activeGroupWords} step={state.step} groupId={state.groupId} dispatch={dispatch} />;
      if (ex === "fill") return <ExerciseContextFill words={activeGroupWords} step={state.step} groupId={state.groupId} dispatch={dispatch} />;
      if (ex === "builder") return <ExerciseSentenceBuilder words={activeGroupWords} step={state.step} groupId={state.groupId} dispatch={dispatch} />;
      if (ex === "quiz") return <ExerciseQuickQuiz words={activeGroupWords} step={state.step} groupId={state.groupId} dispatch={dispatch} />;
    }
    if (state.id === "lesson-complete") {
      return <LessonCompleteResults sessionId={state.sessionId} groupId={state.groupId} attempts={state.attempts} wordQueue={state.wordQueue} dispatch={dispatch} />;
    }
    return null;
  }

  return (
    <ErrorBoundary>
      <div id="a11y-live-region" className="sr-only" aria-live="polite" aria-atomic="true" />
      <Suspense fallback={<LoadingFallback />}>
        {state.id === "onboarding" && (
          <div className="min-h-svh bg-secondary flex items-center justify-center p-0 md:p-8">
            <SkipLink />
            <div
              id="main-content"
              tabIndex={-1}
              className="min-h-svh md:min-h-0 w-full max-w-5xl md:rounded-3xl md:overflow-hidden md:shadow-wp-md md:border md:border-border outline-none"
            >
              {renderContent()}
            </div>
          </div>
        )}

        {TABBED_IDS.has(state.id) && (
          <>
            <SkipLink />
            <AppShell activeTab={state.id as TabId} dispatch={dispatch}>
              {renderContent()}
            </AppShell>
          </>
        )}

        {state.id === "lesson" && EX_STEPS[state.step] === "scene" && (
          <div className="min-h-svh bg-background">
            <SkipLink />
            <div id="main-content" tabIndex={-1} className="w-full min-h-svh flex flex-col outline-none">
              {renderContent()}
            </div>
          </div>
        )}

        {state.id !== "onboarding" &&
          !TABBED_IDS.has(state.id) &&
          !(state.id === "lesson" && EX_STEPS[state.step] === "scene") && (
            <div className="min-h-svh bg-background">
              <SkipLink />
              <div id="main-content" tabIndex={-1} className="w-full min-h-svh flex flex-col outline-none">
                {renderContent()}
              </div>
            </div>
          )}
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <LearnerProvider>
      <I18nProvider>
        <AppInner />
      </I18nProvider>
    </LearnerProvider>
  );
}
