import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import type { Action } from "../../types";
import { useI18n } from "../../../i18n";
import { useAudio } from "../../shared/useAudio";
import { useLearner } from "../../context/LearnerContext";
import { HADITH_STAGE_IDS, HADITH_LESSONS, getHadithLesson } from "./hadithCurriculum";
import { FIGMA_HADITH_LESSONS } from "./figmaHadithCatalog";
import { getHadithAudioAssets, getHadithRecordedSource } from "./hadithAudioManifest";
import { HadithPractice } from "./HadithPractice";
import { getHadithExerciseSet } from "./hadithExerciseCatalog";
import type { HadithConfidence } from "./hadithProgress";
import { getParsedHadithStages } from "./hadithLessonContent";
import { HadithStageStepper } from "./HadithStageStepper";
import { HadithReadListenStage } from "./stages/HadithReadListenStage";
import { HadithVocabularyStage } from "./stages/HadithVocabularyStage";
import { HadithReviewStage } from "./stages/HadithReviewStage";
import { HadithWarmupStage } from "./stages/HadithWarmupStage";
import { HadithOverviewSummary } from "./stages/HadithOverviewStage";
import { useLessonProgress } from "../../shared/useLessonProgress";

interface Props {
  dispatch: React.Dispatch<Action>;
  lessonId: string;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function HadithLessonScreen({ dispatch, lessonId }: Props) {
  const { t } = useI18n();
  const { state, recordHadithCheckpoint, recordHadithCompletion } = useLearner();

  // Normalize route IDs ("lesson-1" -> "hadith-01")
  const canonicalLessonId = /^lesson-(\d+)$/.test(lessonId)
    ? `hadith-${lessonId.slice("lesson-".length).padStart(2, "0")}`
    : lessonId;

  const lesson = getHadithLesson(canonicalLessonId) ?? FIGMA_HADITH_LESSONS[0];
  const savedProgress = state.hadithProgress[lesson.id];
  const { initialIndex } = useLessonProgress({
    stageIds: HADITH_STAGE_IDS,
    currentStage: savedProgress?.currentStage,
  });

  const [stageIndex, setStageIndex] = useState(initialIndex);
  const [confidence, setConfidence] = useState<HadithConfidence | null>(
    savedProgress?.confidence ?? null
  );
  const [confidenceError, setConfidenceError] = useState(false);
  const [practiceScore, setPracticeScore] = useState(savedProgress?.bestScorePercent ?? 0);

  const stage = HADITH_STAGE_IDS[stageIndex];
  const liveAnnouncement = `${t("hadith.stepOfTotal", { current: stageIndex + 1, total: HADITH_STAGE_IDS.length })}: ${t(
    `hadith.stageLabels.${stage}`
  )}`;
  const parsedStages = useMemo(() => getParsedHadithStages(lesson), [lesson]);
  const audioAssets = useMemo(() => getHadithAudioAssets(lesson.id), [lesson.id]);
  const exerciseSet = useMemo(() => getHadithExerciseSet(lesson.id), [lesson.id]);

  const normalAudio = useAudio({ lang: "en-US", rate: 0.9, preferLocal: true });
  const slowAudio = useAudio({ lang: "en-US", rate: 0.72, preferLocal: true });
  const [activeTrack, setActiveTrack] = useState<"ar" | "en" | "en-slow" | null>(null);

  const isPlaying = normalAudio.isPlaying || slowAudio.isPlaying;
  const isAudioError = normalAudio.isError || slowAudio.isError;

  const stageContainerRef = useRef<HTMLDivElement>(null);

  // Focus management: when stageIndex changes, shift focus to stage heading
  useEffect(() => {
    const heading = stageContainerRef.current?.querySelector<HTMLElement>("h2");
    if (heading) {
      heading.focus();
    }
  }, [stageIndex, stage, t]);

  const openLesson = (number: number) => {
    normalAudio.stop();
    slowAudio.stop();
    dispatch({
      type: "OPEN_HADITH_LESSON",
      lessonId: `hadith-${String(number).padStart(2, "0")}`,
    });
  };

  const handleStageSelect = (index: number) => {
    normalAudio.stop();
    slowAudio.stop();
    setActiveTrack(null);
    setConfidenceError(false);
    setStageIndex(index);
    recordHadithCheckpoint(lesson.id, index);
  };

  const goBack = () => {
    if (stageIndex > 0) {
      const prev = stageIndex - 1;
      normalAudio.stop();
      slowAudio.stop();
      setActiveTrack(null);
      setConfidenceError(false);
      setStageIndex(prev);
      recordHadithCheckpoint(lesson.id, prev);
      return;
    }
    if (lesson.number > 1) {
      openLesson(lesson.number - 1);
    } else {
      dispatch({ type: "GO", to: "hadith-curriculum" });
    }
  };

  const goNext = () => {
    if (stageIndex < HADITH_STAGE_IDS.length - 1) {
      const nextStage = stageIndex + 1;
      normalAudio.stop();
      slowAudio.stop();
      setActiveTrack(null);
      setConfidenceError(false);
      setStageIndex(nextStage);
      recordHadithCheckpoint(
        lesson.id,
        nextStage,
        stage,
        stage === "practice" && exerciseSet ? practiceScore : undefined
      );
      return;
    }

    // On final stage ("review"), confidence is required
    if (!confidence) {
      setConfidenceError(true);
      const section = document.getElementById("confidence-section");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      section?.focus();
      return;
    }

    recordHadithCompletion(lesson.id, practiceScore, confidence);
    if (lesson.number < HADITH_LESSONS.length) {
      openLesson(lesson.number + 1);
    } else {
      dispatch({ type: "GO", to: "hadith-curriculum" });
    }
  };

  const reset = () => {
    normalAudio.stop();
    slowAudio.stop();
    setActiveTrack(null);
    setStageIndex(0);
    setConfidence(null);
    setConfidenceError(false);
    setPracticeScore(0);
  };

  const playTrack = (track: "ar" | "en" | "en-slow") => {
    normalAudio.stop();
    slowAudio.stop();

    if (activeTrack === track && isPlaying) {
      setActiveTrack(null);
      return;
    }

    setActiveTrack(track);
    const recorded = getHadithRecordedSource(lesson.id);
    if (track === "ar") {
      void normalAudio.speak(lesson.source.arabic, "ar-SA", audioAssets?.arabic.objectKey, {
        synthesisOnly: recorded?.arabic !== lesson.source.arabic,
      });
    } else if (track === "en") {
      void normalAudio.speak(
        lesson.source.translation,
        "en-US",
        audioAssets?.translation.objectKey,
        { synthesisOnly: recorded?.translation !== lesson.source.translation }
      );
    } else {
      void slowAudio.speak(lesson.source.translation, "en-US", audioAssets?.translation.objectKey, {
        synthesisOnly: recorded?.translation !== lesson.source.translation,
      });
    }
  };

  const scrollToHadithText = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = document.getElementById("hadith-read-listen-section");
    const heading = document.getElementById("stage-readlisten-heading");
    section?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    heading?.focus();
  };

  return (
    <div
      className="wp-lesson-session min-h-dvh w-full overflow-y-auto bg-background"
      aria-labelledby="hadith-title"
    >
      <div className="wp-container-content wp-layout-gutter flex flex-col gap-4 py-3 sm:gap-6 sm:py-8">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: "GO", to: "hadith-curriculum" })}
            className={`inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-border bg-card px-3.5 font-bold text-foreground shadow-wp-xs transition-colors hover:bg-muted motion-safe:active:scale-[0.98] ${focusRing}`}
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            <span>{t("hadith.backToCurriculum") || "Back to curriculum"}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            {savedProgress && (
              <p
                className="sr-only sm:not-sr-only sm:inline-flex sm:items-center sm:gap-1.5 sm:rounded-full sm:bg-secondary sm:px-3 sm:py-1 sm:text-base sm:font-bold sm:text-primary"
                role="status"
              >
                <Check className="size-3.5" aria-hidden />
                <span>{t("hadith.progressRestored") || "Saved progress restored"}</span>
              </p>
            )}

            <p className="sr-only sm:not-sr-only sm:rounded-full sm:border sm:border-border sm:bg-card sm:px-3 sm:py-1 sm:text-base sm:font-bold sm:text-muted-foreground">
              {t("hadith.lessonProgress", {
                current: lesson.number,
                total: HADITH_LESSONS.length,
              }) || `Lesson ${lesson.number} of ${HADITH_LESSONS.length}`}
            </p>
          </div>
        </div>

        {/* Lesson Header & Stepper */}
        <header className="rounded-2xl border border-border bg-card p-3 shadow-wp-xs sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1 basis-72">
              <p className="text-base font-semibold uppercase text-primary">
                {t("hadith.badge", { number: lesson.number }) || `Hadith ${lesson.number} · B1`}
              </p>
              <h1
                id="hadith-title"
                lang="en"
                dir="ltr"
                className="mt-0.5 break-words text-lg font-bold leading-tight text-foreground sm:mt-1.5 sm:text-3xl"
              >
                {lesson.title}
              </h1>
            </div>

            <details className="group shrink-0">
              <summary
                aria-label={t("hadith.lessonDetails")}
                className={`inline-flex min-h-11 cursor-pointer list-none items-center rounded-xl border border-border bg-background px-2 py-2 text-base font-bold text-foreground transition-colors hover:bg-muted sm:px-3.5 ${focusRing}`}
              >
                <span aria-hidden className="sm:hidden">
                  {t("hadith.lessonDetailsShort")}
                </span>
                <span aria-hidden className="hidden sm:inline">
                  {t("hadith.lessonDetails")}
                </span>
              </summary>
              <div className="mt-3 w-full max-w-96">
                <HadithOverviewSummary overview={parsedStages.overview} />
                <button
                  type="button"
                  onClick={reset}
                  className={`mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-base font-bold text-foreground hover:bg-muted ${focusRing}`}
                >
                  <RotateCcw className="size-4" aria-hidden />
                  {t("hadith.resetLesson")}
                </button>
              </div>
            </details>
          </div>
        </header>

        <div className="wp-course-sticky sticky top-0 z-40 border-b border-border bg-background py-2">
          {/* Accessible responsive lesson stepper */}
          <HadithStageStepper
            currentStageIndex={stageIndex}
            completedStages={savedProgress?.completedStages}
            onSelectStage={handleStageSelect}
          />
        </div>

        {/* Stage Content Container */}
        <div
          ref={stageContainerRef}
          id="hadith-stage-panel"
          role="tabpanel"
          aria-labelledby={`hadith-tab-${stage}`}
          className="w-full"
        >
          {stage === "read-listen" && (
            <div className="space-y-6">
              <HadithWarmupStage
                warmup={parsedStages.warmup}
                onProceedToText={scrollToHadithText}
              />
              <HadithReadListenStage
                source={lesson.source}
                onPlayAudio={playTrack}
                isPlaying={isPlaying}
                activeTrack={activeTrack}
                isAudioError={isAudioError}
              />
            </div>
          )}

          {stage === "vocabulary" && (
            <HadithVocabularyStage
              lines={lesson.stages.vocabulary.text}
              lessonNumber={lesson.number}
            />
          )}

          {stage === "practice" && exerciseSet && (
            <HadithPractice exerciseSet={exerciseSet} onScoreChange={setPracticeScore} />
          )}

          {stage === "review" && (
            <HadithReviewStage
              reviewItems={parsedStages.review}
              speakTask={parsedStages.speak}
              lessonTitle={lesson.title}
              translation={lesson.source.translation}
              confidence={confidence}
              practiceScore={practiceScore}
              onSelectConfidence={(c) => {
                setConfidence(c);
                setConfidenceError(false);
              }}
              confidenceError={confidenceError}
            />
          )}
        </div>

        {/* Sticky Accessible Footer Navigation Bar */}
        <div className="wp-sticky-controls sticky bottom-0 z-30 mt-3 border-t border-border bg-background py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-stretch gap-2 sm:flex sm:items-center sm:justify-between">
            <div className="flex">
              <button
                type="button"
                onClick={goBack}
                className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-base font-bold text-foreground hover:bg-muted motion-safe:active:scale-[0.98] ${focusRing}`}
              >
                <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
                <span>{t("hadith.previous") || "Previous"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={goNext}
              className={`inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-base font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary motion-safe:active:scale-[0.98] ${focusRing}`}
            >
              <span>
                {stageIndex === HADITH_STAGE_IDS.length - 1
                  ? lesson.number < HADITH_LESSONS.length
                    ? t("hadith.nextLesson") || "Next Hadith lesson"
                    : t("hadith.finishLesson") || "Finish lesson"
                  : t("hadith.continue") || "Continue"}
              </span>
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </button>
          </div>
        </div>

        {/* Live Region for Screen Reader Stage Announcements */}
        <div className="sr-only" role="status" aria-live="polite">
          {liveAnnouncement}
        </div>
      </div>
    </div>
  );
}
