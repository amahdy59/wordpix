import { lazy, Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import type { Screen, Action, TabId } from "../types";
import { resolveGroup, resolveUnitForLesson, DEFAULT_UNIT_ID } from "../data/lessons";
import { getWords } from "../data/vocabulary";
import type { VocabularyItem } from "../data/lessons";
import { UnitVocabularyGate } from "./UnitVocabularyGate";
import { useI18n } from "../context/I18nContext";
import { useLearner } from "../context/LearnerContext";
import { AppShell } from "../shared/AppShell";
import { TABBED_IDS } from "../store/reducer";

// Synchronous core onboarding screens
import { SplashWelcome } from "../onboarding/SplashWelcome";
import { LanguageSelect } from "../onboarding/LanguageSelect";
import { ReadyCelebration } from "../onboarding/ReadyCelebration";

// Synchronous core tab views (home is the default tab and stays eager)
import { HomeDashboard } from "../core/HomeDashboard";

// Non-default tabs are code-split so the initial bundle stays lean.
const LearningPath = lazy(() =>
  import("../core/LearningPath").then((m) => ({ default: m.LearningPath }))
);
const ExploreWorlds = lazy(() =>
  import("../core/ExploreWorlds").then((m) => ({ default: m.ExploreWorlds }))
);
const ProfileStats = lazy(() =>
  import("../core/ProfileStats").then((m) => ({ default: m.ProfileStats }))
);
const SkillExerciseHub = lazy(() =>
  import("../core/SkillExerciseHub").then((m) => ({ default: m.SkillExerciseHub }))
);

// Lazy-loaded lesson and exercise screens
const ReviewMasteryReview = lazy(() =>
  import("../review/ReviewMasteryReview").then((m) => ({ default: m.ReviewMasteryReview }))
);
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
const FigmaPronunciationLessonScreen = lazy(() =>
  import("../learning/foundations/FigmaPronunciationLessonScreen").then((m) => ({
    default: m.FigmaPronunciationLessonScreen,
  }))
);
const PronunciationCurriculumScreen = lazy(() =>
  import("../learning/foundations/PronunciationCurriculumScreen").then((m) => ({
    default: m.PronunciationCurriculumScreen,
  }))
);
const HadithLessonScreen = lazy(() =>
  import("../learning/hadith/HadithLessonScreen").then((m) => ({
    default: m.HadithLessonScreen,
  }))
);
const HadithCurriculumScreen = lazy(() =>
  import("../learning/hadith/HadithCurriculumScreen").then((m) => ({
    default: m.HadithCurriculumScreen,
  }))
);
const ConversationLessonScreen = lazy(() =>
  import("../learning/conversation/ConversationLessonScreen").then((m) => ({
    default: m.ConversationLessonScreen,
  }))
);
const ConversationCurriculumScreen = lazy(() =>
  import("../learning/conversation/ConversationCurriculumScreen").then((m) => ({
    default: m.ConversationCurriculumScreen,
  }))
);
const BusinessLessonScreen = lazy(() =>
  import("../learning/business/BusinessLessonScreen").then((m) => ({
    default: m.BusinessLessonScreen,
  }))
);
const BusinessCurriculumScreen = lazy(() =>
  import("../learning/business/BusinessCurriculumScreen").then((m) => ({
    default: m.BusinessCurriculumScreen,
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
import { getLessonSequence, type ExerciseStep } from "../lesson/lessonSequence";

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
    // Wrapped in a nav landmark: a skip link is navigation, and leaving it
    // bare left the one piece of page content that no landmark contained.
    <nav aria-label={t("app.skipToContent")}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-sans font-semibold text-sm z-50 motion-safe:transition-none"
      >
        {t("app.skipToContent")}
      </a>
    </nav>
  );
};

/**
 * In-context error panel with recovery actions. Replaces the old silent
 * redirect to the library: the learner is told what went wrong and can get
 * back to the learning path or home without losing their place.
 */
function RouteErrorPanel({
  title,
  description,
  dispatch,
}: {
  title: string;
  description: string;
  dispatch: React.Dispatch<Action>;
}) {
  const { t } = useI18n();
  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div
        role="alert"
        className="w-full max-w-md rounded-3xl border border-border bg-wp-card p-6 text-center shadow-wp-sm"
      >
        <h1 className="font-sans text-xl font-black text-foreground">{title}</h1>
        <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "explore" })}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-wp-md hover:opacity-90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("router.backToPath")}
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "home" })}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-2xl border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-muted/30 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("router.backToHome")}
          </button>
        </div>
      </div>
    </main>
  );
}

type LessonScreen = Extract<Screen, { id: "lesson" }>;

function LessonRouteError({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  const { t } = useI18n();
  return (
    <RouteErrorPanel
      title={t("router.lessonWordsMissingTitle")}
      description={t("router.lessonWordsMissingDesc")}
      dispatch={dispatch}
    />
  );
}

function UnknownSkillExerciseError({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  const { t } = useI18n();
  return (
    <RouteErrorPanel
      title={t("router.exerciseMissingTitle")}
      description={t("router.exerciseMissingDesc")}
      dispatch={dispatch}
    />
  );
}

/** An empty list that keeps its identity, so a miss does not remount a drill. */
const NO_WORDS: VocabularyItem[] = [];

/**
 * One step of a lesson, and the words it drills.
 *
 * This is a component rather than a branch of `renderContent` because of one
 * line: the `useMemo` below. `getWords` builds a fresh array every call, and
 * calling it inline meant `words` arrived at each drill with a new identity on
 * every render of `RouterView` — which happens on every learner-state change,
 * including the XP and SRS writes that answering a question triggers.
 *
 * Downstream, every drill shuffles its options in a `useMemo` keyed on that
 * array. A new identity re-ran the shuffle, so the four picture cards
 * reordered underneath the learner at the moment they answered: the tick
 * landed on a card in a different place from the one they had touched, and the
 * next question's options had already moved before it was asked. Holding the
 * array still fixes that, and lets the memoised drills skip the re-render
 * entirely.
 *
 * Rendered inside `UnitVocabularyGate`, so the unit's words are in memory by
 * the time this runs and the lookup can stay synchronous.
 */
function LessonRoute({
  state,
  dispatch,
}: {
  state: LessonScreen;
  dispatch: React.Dispatch<Action>;
}) {
  const { state: learnerState } = useLearner();
  const isAssessment = state.mode === "UNIT_ASSESSMENT" || state.mode === "PRE_LESSON_ASSESSMENT";

  const exSequence = isAssessment
    ? (["quiz"] as const)
    : getLessonSequence(
        learnerState.preferences.englishLevel,
        learnerState.accessibility.includeListening
      );

  const { lessonId, wordQueue } = state;
  // Joined, not the array itself: `wordQueue` is rebuilt by the reducer on
  // every attempt, so depending on its identity would defeat the memo.
  const wordQueueKey = wordQueue.join("|");
  const activeGroupWords = useMemo(() => {
    // Resolve within the lesson's own unit. Word ids repeat across the
    // course — "mirror" belongs to fifteen units — so an unscoped lookup
    // can hand this drill another unit's photograph of the same thing.
    const lessonUnitId = resolveUnitForLesson(lessonId).id;
    const ids = wordQueueKey ? wordQueueKey.split("|") : [];
    const groupWords = getWords(ids, lessonUnitId);
    if (groupWords.length > 0) return groupWords;
    const fallback = getWords(resolveGroup(lessonId).wordIds, lessonUnitId);
    return fallback.length > 0 ? fallback : NO_WORDS;
  }, [lessonId, wordQueueKey]);

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

  if (activeGroupWords.length === 0) {
    return <LessonRouteError dispatch={dispatch} />;
  }

  const ex: ExerciseStep = exSequence[state.step];
  const drillProps = {
    words: activeGroupWords,
    step: state.step,
    lessonId: state.lessonId,
    dispatch,
  };

  if (ex === "listen") return <ExerciseListenRepeat {...drillProps} />;
  if (ex === "recall") return <ExerciseRecallMatch {...drillProps} />;
  if (ex === "fill") return <ExerciseContextFill {...drillProps} />;
  if (ex === "builder") return <ExerciseSentenceBuilder {...drillProps} />;
  if (ex === "quiz") return <ExerciseQuickQuiz {...drillProps} />;
  if (ex === "story") return <ExerciseStory {...drillProps} />;
  return null;
}

export interface RouterViewProps {
  state: Screen;
  dispatch: React.Dispatch<Action>;
}

export function RouterView({ state, dispatch }: RouterViewProps) {
  // The learner state that used to be read here moved into `LessonRoute`,
  // which is the only branch that wanted it. Reading it at this level meant
  // every XP or streak write re-rendered the whole route tree.
  function renderContent() {
    if (state.id === "onboarding") {
      if (state.step === "splash") return <SplashWelcome dispatch={dispatch} />;
      if (state.step === "language") return <LanguageSelect dispatch={dispatch} />;
      if (state.step === "ready") return <ReadyCelebration dispatch={dispatch} />;
    }
    if (state.id === "home") return <HomeDashboard dispatch={dispatch} />;
    if (state.id === "learn" || state.id === "explore") return <LearningPath dispatch={dispatch} />;
    if (state.id === "library") return <ExploreWorlds dispatch={dispatch} />;
    if (state.id === "practice") return <SkillExerciseHub dispatch={dispatch} />;
    if (state.id === "review") return <ReviewMasteryReview dispatch={dispatch} />;
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
    if (state.id === "pronunciation-curriculum")
      return <PronunciationCurriculumScreen dispatch={dispatch} />;
    if (state.id === "figma-pronunciation-lesson")
      return (
        <FigmaPronunciationLessonScreen lessonNumber={state.lessonNumber} dispatch={dispatch} />
      );
    if (state.id === "hadith-lesson")
      return <HadithLessonScreen lessonId={state.lessonId} dispatch={dispatch} />;
    if (state.id === "hadith-curriculum") return <HadithCurriculumScreen dispatch={dispatch} />;
    if (state.id === "conversation-lesson")
      return (
        <ConversationLessonScreen
          unitId={state.unitId}
          initialStage={state.stage}
          dispatch={dispatch}
        />
      );
    if (state.id === "conversation-curriculum")
      return <ConversationCurriculumScreen dispatch={dispatch} />;
    if (state.id === "business-lesson")
      return (
        <BusinessLessonScreen
          unitId={state.unitId}
          initialStage={state.stage}
          dispatch={dispatch}
        />
      );
    if (state.id === "business-curriculum") return <BusinessCurriculumScreen dispatch={dispatch} />;

    if (state.id === "skill-exercise") {
      const SkillExercise = SKILL_EXERCISES[state.exerciseId];
      if (!SkillExercise) return <UnknownSkillExerciseError dispatch={dispatch} />;
      return <SkillExercise dispatch={dispatch} />;
    }

    if (state.id === "lesson") return <LessonRoute state={state} dispatch={dispatch} />;
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

  const stateKey =
    state.id === "hadith-lesson"
      ? `${state.id}-${state.lessonId}`
      : state.id === "conversation-lesson"
        ? `${state.id}-${state.unitId}-${state.stage ?? "resume"}`
        : state.id === "business-lesson"
          ? `${state.id}-${state.unitId}-${state.stage ?? "resume"}`
          : state.id + ("step" in state ? `-${state.step}` : "");
  // Route transitions render immediately with a short enter motion only: the
  // previous AnimatePresence mode="wait" held every navigation for a full exit
  // animation first, which read as latency on every tab switch.
  const animatedContent = (
    <motion.div
      key={stateKey}
      initial={{ y: 10 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex-1 flex flex-col w-full min-h-full"
    >
      <Suspense fallback={<LoadingFallback />}>
        <UnitVocabularyGate screen={state} fallback={<LoadingFallback />}>
          {renderContent}
        </UnitVocabularyGate>
      </Suspense>
    </motion.div>
  );

  return (
    <>
      {state.id === "onboarding" && (
        <div className="min-h-dvh bg-secondary flex items-center justify-center p-0 md:p-8">
          <SkipLink />
          <main
            id="main-content"
            tabIndex={-1}
            className="min-h-dvh md:min-h-0 w-full max-w-5xl md:rounded-3xl md:overflow-hidden md:shadow-wp-md md:border md:border-border outline-none flex flex-col"
          >
            {animatedContent}
          </main>
        </div>
      )}

      {TABBED_IDS.has(state.id) && (
        <>
          <SkipLink />
          <AppShell
            activeTab={
              (state.id === "review"
                ? "practice"
                : state.id === "explore"
                  ? "learn"
                  : state.id) as TabId
            }
            dispatch={dispatch}
          >
            {animatedContent}
          </AppShell>
        </>
      )}

      {state.id === "learn-words" && (
        <div className="h-dvh max-h-dvh overflow-hidden bg-background flex flex-col">
          <SkipLink />
          <main
            id="main-content"
            tabIndex={-1}
            className="w-full flex-1 flex flex-col outline-none overflow-hidden"
          >
            {animatedContent}
          </main>
        </div>
      )}

      {state.id !== "onboarding" && !TABBED_IDS.has(state.id) && state.id !== "learn-words" && (
        <div className="h-dvh max-h-dvh overflow-hidden bg-background flex flex-col">
          <SkipLink />
          <main
            id="main-content"
            tabIndex={-1}
            className="w-full flex-1 flex flex-col outline-none overflow-hidden"
          >
            {animatedContent}
          </main>
        </div>
      )}
    </>
  );
}
