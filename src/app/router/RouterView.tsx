import { lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Screen, Action, TabId } from "../types";
import { resolveGroup, resolveUnitForLesson, DEFAULT_UNIT_ID } from "../data/lessons";
import { getWords } from "../data/vocabulary";
import { UnitVocabularyGate } from "./UnitVocabularyGate";
import { useI18n } from "../context/I18nContext";
import { useLearner } from "../context/LearnerContext";
import { AppShell } from "../shared/AppShell";
import { TABBED_IDS } from "../store/reducer";

// Synchronous core onboarding screens
import { SplashWelcome } from "../onboarding/SplashWelcome";
import { LanguageSelect } from "../onboarding/LanguageSelect";
import { ReadyCelebration } from "../onboarding/ReadyCelebration";

// Synchronous core tab views
import { HomeDashboard } from "../core/HomeDashboard";
import { ExploreWorlds } from "../core/ExploreWorlds";
import { ReviewMasteryReview } from "../review/ReviewMasteryReview";
import { ProfileStats } from "../core/ProfileStats";
import { SkillExerciseHub } from "../core/SkillExerciseHub";

// Lazy-loaded lesson and exercise screens
const LessonWorldEntry = lazy(() =>
  import("../lesson/LessonWorldEntry").then((m) => ({ default: m.LessonWorldEntry }))
);
const LearnWordsScreen = lazy(() =>
  import("../lesson/LearnWordsScreen").then((m) => ({ default: m.LearnWordsScreen }))
);
const LessonCompleteResults = lazy(() =>
  import("../lesson/LessonCompleteResults").then((m) => ({ default: m.LessonCompleteResults }))
);
const LearningMaterialsScreen = lazy(() =>
  import("../learning/LearningMaterialsScreen").then((m) => ({
    default: m.LearningMaterialsScreen,
  }))
);

const ExerciseListenRepeat = lazy(() =>
  import("../exercises/ExerciseListenRepeat").then((m) => ({ default: m.ExerciseListenRepeat }))
);
const ExerciseRecallMatch = lazy(() =>
  import("../exercises/ExerciseRecallMatch").then((m) => ({ default: m.ExerciseRecallMatch }))
);
const ExerciseContextFill = lazy(() =>
  import("../exercises/ExerciseContextFill").then((m) => ({ default: m.ExerciseContextFill }))
);
const ExerciseSentenceBuilder = lazy(() =>
  import("../exercises/ExerciseSentenceBuilder").then((m) => ({
    default: m.ExerciseSentenceBuilder,
  }))
);
const ExerciseQuickQuiz = lazy(() =>
  import("../exercises/ExerciseQuickQuiz").then((m) => ({ default: m.ExerciseQuickQuiz }))
);
const ExerciseStory = lazy(() =>
  import("../exercises/ExerciseStory").then((m) => ({ default: m.ExerciseStory }))
);

import { SKILL_EXERCISES } from "../exercises/registry";

type ExStep = "listen" | "recall" | "fill" | "builder" | "quiz" | "story";

const LoadingFallback = () => {
  const { t } = useI18n();
  return (
    <div
      className="flex-1 flex items-center justify-center min-h-[300px] p-6 text-center"
      aria-live="polite"
    >
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

export const SkipLink = () => {
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

export interface RouterViewProps {
  state: Screen;
  dispatch: React.Dispatch<Action>;
}

export function RouterView({ state, dispatch }: RouterViewProps) {
  const { state: learnerState } = useLearner();

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
    if (state.id === "lesson-entry")
      return <LessonWorldEntry unitId={state.unitId ?? DEFAULT_UNIT_ID} dispatch={dispatch} />;
    if (state.id === "learn-words")
      return <LearnWordsScreen lessonId={state.lessonId} dispatch={dispatch} />;
    if (state.id === "learning-materials")
      return (
        <LearningMaterialsScreen
          key={state.unitId ?? DEFAULT_UNIT_ID}
          unitId={state.unitId ?? DEFAULT_UNIT_ID}
          area={state.area}
          nodeId={state.nodeId}
          dispatch={dispatch}
        />
      );
    if (state.id === "skill-hub") return <SkillExerciseHub dispatch={dispatch} />;

    if (state.id === "skill-exercise") {
      const SkillExercise = SKILL_EXERCISES[state.exerciseId];
      if (!SkillExercise) return <ExploreWorlds dispatch={dispatch} />;
      return <SkillExercise dispatch={dispatch} />;
    }

    if (state.id === "lesson") {
      const isBeginner =
        learnerState.preferences.englishLevel === "A1" ||
        learnerState.preferences.englishLevel === "A2";
      const isAssessment =
        state.mode === "UNIT_ASSESSMENT" || state.mode === "PRE_LESSON_ASSESSMENT";

      const exSequence = isAssessment
        ? (["quiz"] as const)
        : isBeginner
          ? (["listen", "recall", "fill", "quiz", "story"] as const)
          : (["listen", "recall", "fill", "builder", "quiz", "story"] as const);

      if (state.step >= exSequence.length) {
        return (
          <LessonCompleteResults
            sessionId={state.sessionId}
            lessonId={state.lessonId}
            unitId={state.unitId}
            mode={state.mode}
            attempts={state.attempts}
            wordQueue={state.wordQueue}
            dispatch={dispatch}
          />
        );
      }

      const ex: ExStep = exSequence[state.step];
      // Resolve within the lesson's own unit. Word ids repeat across the
      // course — "mirror" belongs to fifteen units — so an unscoped lookup
      // can hand this drill another unit's photograph of the same thing.
      const lessonUnitId = resolveUnitForLesson(state.lessonId).id;
      const groupWords = getWords(state.wordQueue, lessonUnitId);

      const activeGroupWords =
        groupWords.length > 0
          ? groupWords
          : getWords(resolveGroup(state.lessonId).wordIds, lessonUnitId);

      if (activeGroupWords.length === 0) return <ExploreWorlds dispatch={dispatch} />;

      if (ex === "listen")
        return (
          <ExerciseListenRepeat
            words={activeGroupWords}
            step={state.step}
            lessonId={state.lessonId}
            dispatch={dispatch}
          />
        );
      if (ex === "recall")
        return (
          <ExerciseRecallMatch
            words={activeGroupWords}
            step={state.step}
            lessonId={state.lessonId}
            dispatch={dispatch}
          />
        );
      if (ex === "fill")
        return (
          <ExerciseContextFill
            words={activeGroupWords}
            step={state.step}
            lessonId={state.lessonId}
            dispatch={dispatch}
          />
        );
      if (ex === "builder")
        return (
          <ExerciseSentenceBuilder
            words={activeGroupWords}
            step={state.step}
            lessonId={state.lessonId}
            dispatch={dispatch}
          />
        );
      if (ex === "quiz")
        return (
          <ExerciseQuickQuiz
            words={activeGroupWords}
            step={state.step}
            lessonId={state.lessonId}
            dispatch={dispatch}
          />
        );
      if (ex === "story")
        return (
          <ExerciseStory
            words={activeGroupWords}
            step={state.step}
            lessonId={state.lessonId}
            dispatch={dispatch}
          />
        );
    }
    if (state.id === "lesson-complete") {
      return (
        <LessonCompleteResults
          sessionId={state.sessionId}
          lessonId={state.lessonId}
          unitId={state.unitId}
          mode={state.mode}
          attempts={state.attempts}
          wordQueue={state.wordQueue}
          dispatch={dispatch}
        />
      );
    }
    return null;
  }

  const stateKey = state.id + ("step" in state ? `-${state.step}` : "");
  const animatedContent = (
    <AnimatePresence mode="wait">
      <motion.div
        key={stateKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex-1 flex flex-col w-full min-h-full"
      >
        <Suspense fallback={<LoadingFallback />}>
          <UnitVocabularyGate screen={state} fallback={<LoadingFallback />}>
            {renderContent}
          </UnitVocabularyGate>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <>
      {state.id === "onboarding" && (
        <div className="min-h-dvh bg-secondary flex items-center justify-center p-0 md:p-8">
          <SkipLink />
          <div
            id="main-content"
            tabIndex={-1}
            className="min-h-dvh md:min-h-0 w-full max-w-5xl md:rounded-3xl md:overflow-hidden md:shadow-wp-md md:border md:border-border outline-none flex flex-col"
          >
            {animatedContent}
          </div>
        </div>
      )}

      {TABBED_IDS.has(state.id) && (
        <>
          <SkipLink />
          <AppShell activeTab={state.id as TabId} dispatch={dispatch}>
            {animatedContent}
          </AppShell>
        </>
      )}

      {state.id === "learn-words" && (
        <div className="h-dvh max-h-dvh overflow-hidden bg-background flex flex-col">
          <SkipLink />
          <div
            id="main-content"
            tabIndex={-1}
            className="w-full flex-1 flex flex-col outline-none overflow-hidden"
          >
            {animatedContent}
          </div>
        </div>
      )}

      {state.id !== "onboarding" && !TABBED_IDS.has(state.id) && state.id !== "learn-words" && (
        <div className="h-dvh max-h-dvh overflow-hidden bg-background flex flex-col">
          <SkipLink />
          <div
            id="main-content"
            tabIndex={-1}
            className="w-full flex-1 flex flex-col outline-none overflow-hidden"
          >
            {animatedContent}
          </div>
        </div>
      )}
    </>
  );
}
