import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import type { Action } from "../../types";
import { useI18n } from "../../../i18n";
import { useAudio } from "../../shared/useAudio";
import { useLearner } from "../../context/LearnerContext";
import { HADITH_STAGE_IDS, HADITH_LESSONS, getHadithLesson } from "./hadithCurriculum";
import { FIGMA_HADITH_LESSONS } from "./figmaHadithCatalog";
import { getHadithAudioAssets } from "./hadithAudioManifest";
import { HadithPractice } from "./HadithPractice";
import { getHadithExerciseSet } from "./hadithExerciseCatalog";
import type { HadithConfidence } from "./hadithProgress";
import { getParsedHadithStages } from "./hadithLessonContent";
import { HadithStageStepper } from "./HadithStageStepper";
import { HadithReadListenStage } from "./stages/HadithReadListenStage";
import { HadithVocabularyStage } from "./stages/HadithVocabularyStage";
import { HadithDiscussionStage } from "./stages/HadithDiscussionStage";
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
  const liveAnnouncement = `Step ${stageIndex + 1} of ${HADITH_STAGE_IDS.length}: ${t(
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

    // On final stage ("check-review"), confidence is required
    if (!confidence) {
      setConfidenceError(true);
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
  };

  const playTrack = (track: "ar" | "en" | "en-slow") => {
    normalAudio.stop();
    slowAudio.stop();

    if (activeTrack === track && isPlaying) {
      setActiveTrack(null);
      return;
    }

    setActiveTrack(track);
    if (track === "ar") {
      void normalAudio.speak(lesson.source.arabic, "ar-SA", audioAssets?.arabic.objectKey);
    } else if (track === "en") {
      void normalAudio.speak(
        lesson.source.translation,
        "en-US",
        audioAssets?.translation.objectKey
      );
    } else {
      void slowAudio.speak(lesson.source.translation, "en-US", audioAssets?.translation.objectKey);
    }
  };

  return (
    <main
      className="min-h-dvh w-full overflow-y-auto bg-background pb-24"
      aria-labelledby="hadith-title"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-8">
        {/* Top Back Action */}
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "hadith-curriculum" })}
          className={`inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-3 font-bold text-foreground hover:bg-muted active:scale-[0.98] ${focusRing}`}
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          <span>{t("hadith.backToCurriculum") || "Back to curriculum"}</span>
        </button>

        {/* Lesson Header & Stepper */}
        <header className="rounded-3xl border border-border bg-card p-5 shadow-wp-sm sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            {t("hadith.badge", { number: lesson.number }) || `Hadith ${lesson.number} · B1`}
          </p>
          <h1 id="hadith-title" className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-2 text-sm font-bold text-muted-foreground">
            {t("hadith.lessonProgress", { current: lesson.number, total: HADITH_LESSONS.length }) ||
              `Lesson ${lesson.number} of ${HADITH_LESSONS.length}`}
          </p>

          {savedProgress && (
            <p className="mt-2 text-sm font-bold text-primary" role="status">
              <Check className="me-1.5 inline size-4" aria-hidden />
              {t("hadith.progressRestored") || "Saved progress restored"}
            </p>
          )}

          <div className="mt-5">
            <HadithOverviewSummary overview={parsedStages.overview} />
          </div>

          {/* Accessible responsive lesson stepper */}
          <HadithStageStepper
            currentStageIndex={stageIndex}
            completedStages={savedProgress?.completedStages}
            onSelectStage={handleStageSelect}
          />
        </header>

        {/* Stage Content Container */}
        <div ref={stageContainerRef} className="w-full">
          {stage === "read-listen" && (
            <div className="space-y-6">
              <HadithWarmupStage warmup={parsedStages.warmup} />
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
            <HadithVocabularyStage lines={lesson.stages.vocabulary.text} />
          )}

          {stage === "practice" && exerciseSet && (
            <HadithPractice exerciseSet={exerciseSet} onScoreChange={setPracticeScore} />
          )}

          {stage === "speak" && (
            <HadithDiscussionStage
              lessonTitle={lesson.title}
              translation={lesson.source.translation}
              reviewItems={parsedStages.review}
            />
          )}

          {stage === "check-review" && (
            <HadithReviewStage
              reviewItems={parsedStages.review}
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

        {/* Footer Navigation Bar */}
        <div className="flex flex-col-reverse justify-between gap-3 pt-2 sm:flex-row">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goBack}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 font-black text-foreground hover:bg-muted active:scale-[0.98] ${focusRing}`}
            >
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
              <span>{t("hadith.previous") || "Previous"}</span>
            </button>

            <button
              type="button"
              onClick={reset}
              className={`inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl px-4 font-bold text-muted-foreground hover:bg-muted hover:text-foreground active:scale-[0.98] ${focusRing}`}
            >
              <RotateCcw className="size-4" aria-hidden />
              <span className="text-sm">{t("hadith.resetLesson") || "Reset"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={goNext}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-black text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] ${focusRing}`}
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

        {/* Live Region for Screen Reader Stage Announcements */}
        <div className="sr-only" role="status" aria-live="polite">
          {liveAnnouncement}
        </div>
      </div>
    </main>
  );
}
