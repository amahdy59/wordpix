import { useReducer } from "react";
import type { Screen, Action, OnboardStep, TabId } from "./types";

// Onboarding screens
import { SplashWelcome }        from "./onboarding/SplashWelcome";
import { LanguageSelect }       from "./onboarding/LanguageSelect";
import { AgeSelect }            from "./onboarding/AgeSelect";
import { InterestSelect }       from "./onboarding/InterestSelect";
import { ReadyCelebration }     from "./onboarding/ReadyCelebration";

// Core screens
import { HomeDashboard }        from "./core/HomeDashboard";
import { ExploreWorlds }        from "./core/ExploreWorlds";
import { ProfileStats }         from "./core/ProfileStats";

// Lesson screens
import { LessonWorldEntry }     from "./lesson/LessonWorldEntry";
import { LessonSceneDiscovery } from "./lesson/LessonSceneDiscovery";
import { LessonCompleteResults }from "./lesson/LessonCompleteResults";

// Exercise screens
import { ExerciseListenRepeat }   from "./exercises/ExerciseListenRepeat";
import { ExerciseRecallMatch }    from "./exercises/ExerciseRecallMatch";
import { ExerciseContextFill }    from "./exercises/ExerciseContextFill";
import { ExerciseSentenceBuilder }from "./exercises/ExerciseSentenceBuilder";
import { ExerciseQuickQuiz }      from "./exercises/ExerciseQuickQuiz";

// Review + shell
import { ReviewMasteryReview } from "./review/ReviewMasteryReview";
import { AppShell }            from "./shared/AppShell";

// ── State machine ─────────────────────────────────────────────────────────────

const ONBOARD_STEPS: OnboardStep[] = ["splash", "language", "age", "interests", "ready"];
const TABBED_IDS: ReadonlySet<string> = new Set(["home", "explore", "practice", "profile"]);

function reducer(state: Screen, action: Action): Screen {
  if (action.type === "ONBOARD_NEXT") {
    if (state.id !== "onboarding") return state;
    const i = ONBOARD_STEPS.indexOf(state.step);
    return i < ONBOARD_STEPS.length - 1
      ? { id: "onboarding", step: ONBOARD_STEPS[i + 1] }
      : { id: "home" };
  }
  if (action.type === "GO") {
    if (action.to === "lesson-entry")    return { id: "lesson-entry" };
    if (action.to === "lesson-complete") return { id: "lesson-complete" };
    return { id: action.to };
  }
  if (action.type === "START_LESSON") return { id: "lesson", step: 0 };
  if (action.type === "LESSON_NEXT") {
    if (state.id !== "lesson") return state;
    return state.step >= 5 ? { id: "lesson-complete" } : { id: "lesson", step: state.step + 1 };
  }
  return state;
}

const EX_STEPS = ["scene", "listen", "recall", "fill", "builder", "quiz"] as const;
type ExStep = (typeof EX_STEPS)[number];

// ── Root App ──────────────────────────────────────────────────────────────────

const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-sans font-semibold text-sm z-50 motion-safe:transition-none"
  >
    Skip to content
  </a>
);

export default function App() {
  const [state, dispatch] = useReducer(reducer, { id: "onboarding", step: "splash" });

  function renderContent() {
    if (state.id === "onboarding") {
      if (state.step === "splash")    return <SplashWelcome dispatch={dispatch} />;
      if (state.step === "language")  return <LanguageSelect dispatch={dispatch} />;
      if (state.step === "age")       return <AgeSelect dispatch={dispatch} />;
      if (state.step === "interests") return <InterestSelect dispatch={dispatch} />;
      if (state.step === "ready")     return <ReadyCelebration dispatch={dispatch} />;
    }
    if (state.id === "home")     return <HomeDashboard dispatch={dispatch} />;
    if (state.id === "explore")  return <ExploreWorlds dispatch={dispatch} />;
    if (state.id === "practice") return <ReviewMasteryReview dispatch={dispatch} />;
    if (state.id === "profile")  return <ProfileStats dispatch={dispatch} />;
    if (state.id === "lesson-entry") return <LessonWorldEntry dispatch={dispatch} />;
    if (state.id === "lesson") {
      const ex: ExStep = EX_STEPS[state.step] ?? "scene";
      if (ex === "scene")   return <LessonSceneDiscovery dispatch={dispatch} />;
      if (ex === "listen")  return <ExerciseListenRepeat  step={state.step} dispatch={dispatch} />;
      if (ex === "recall")  return <ExerciseRecallMatch   step={state.step} dispatch={dispatch} />;
      if (ex === "fill")    return <ExerciseContextFill   step={state.step} dispatch={dispatch} />;
      if (ex === "builder") return <ExerciseSentenceBuilder step={state.step} dispatch={dispatch} />;
      if (ex === "quiz")    return <ExerciseQuickQuiz     step={state.step} dispatch={dispatch} />;
    }
    if (state.id === "lesson-complete") return <LessonCompleteResults dispatch={dispatch} />;
    return null;
  }

  // ── Onboarding: full-screen on mobile, centered card on desktop ─────────────
  if (state.id === "onboarding") {
    return (
      <div className="min-h-svh bg-secondary flex items-center justify-center p-0 md:p-8">
        {/* MARKER-MAKE-KIT-INVOKED */}
        {/* MARKER-MAKE-KIT-DISCOVERY-READ */}
        {/* MARKER-MAKE-KIT-TOKENS-READ */}
        <SkipLink />
        <div
          id="main-content"
          className="min-h-svh md:min-h-0 w-full md:max-w-[420px] md:rounded-3xl md:overflow-hidden md:shadow-wp-md"
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  // ── Core tabs: AppShell with sidebar (desktop) + bottom bar (mobile) ────────
  if (TABBED_IDS.has(state.id)) {
    return (
      <>
        {/* MARKER-MAKE-KIT-INVOKED */}
        <SkipLink />
        <AppShell activeTab={state.id as TabId} dispatch={dispatch}>
          {renderContent()}
        </AppShell>
      </>
    );
  }

  // ── Scene discovery: full-viewport width for desktop split layout ───────────
  if (state.id === "lesson" && EX_STEPS[state.step] === "scene") {
    return (
      <div className="min-h-svh bg-background">
        {/* MARKER-MAKE-KIT-INVOKED */}
        <SkipLink />
        <div id="main-content" className="w-full min-h-svh flex flex-col">
          {renderContent()}
        </div>
      </div>
    );
  }

  // ── Lesson / exercise / complete: centered, width-capped ────────────────────
  return (
    <div className="min-h-svh bg-background">
      {/* MARKER-MAKE-KIT-INVOKED */}
      <SkipLink />
      <div id="main-content" className="w-full max-w-2xl mx-auto min-h-svh flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
}
