import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CircleHelp,
  Headphones,
  RotateCcw,
  Volume2,
} from "lucide-react";
import type { Action } from "../../types";
import { useI18n } from "../../../i18n";
import { useAudio } from "../../shared/useAudio";
import { useLearner } from "../../context/LearnerContext";
import {
  HADITH_STAGE_IDS,
  HADITH_01,
  HADITH_LESSONS,
  getHadithLesson,
  type HadithLesson,
  type HadithStageId,
} from "./hadithCurriculum";
import type { FigmaHadithLesson } from "./figmaHadithCatalog";
import { getHadithAudioAssets } from "./hadithAudioManifest";
import { HadithPractice } from "./HadithPractice";
import { getHadithExerciseSet } from "./hadithExerciseCatalog";
import type { HadithConfidence } from "./hadithProgress";

interface Props {
  dispatch: React.Dispatch<Action>;
  lessonId: string;
}

const stageLabels: Record<HadithStageId, string> = {
  overview: "Overview",
  "warm-up": "Warm-up",
  "read-listen": "Read & Listen",
  vocabulary: "Vocabulary",
  practice: "Practice",
  speak: "Speak",
  "check-review": "Check & Review",
};

export function HadithLessonScreen({ dispatch, lessonId }: Props) {
  const catalogLesson = getHadithLesson(lessonId) ?? HADITH_LESSONS[0];
  if (catalogLesson.id !== HADITH_01.id) {
    return <CatalogHadithLessonScreen dispatch={dispatch} lesson={catalogLesson} />;
  }

  const richLesson: HadithLesson = {
    ...HADITH_01,
    title: catalogLesson.title,
    source: catalogLesson.source,
  };
  return <RichHadithLessonScreen dispatch={dispatch} lesson={richLesson} />;
}

function RichHadithLessonScreen({
  dispatch,
  lesson,
}: {
  dispatch: React.Dispatch<Action>;
  lesson: HadithLesson;
}) {
  const { t } = useI18n();
  const { state, recordHadithCheckpoint, recordHadithCompletion } = useLearner();
  const savedProgress = state.hadithProgress[lesson.id];
  const [stageIndex, setStageIndex] = useState(
    Math.min(HADITH_STAGE_IDS.length - 1, Math.max(0, savedProgress?.currentStage ?? 0))
  );
  const [warmupAnswer, setWarmupAnswer] = useState<string | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [confidence, setConfidence] = useState<HadithConfidence | null>(
    savedProgress?.confidence ?? null
  );
  const stage = HADITH_STAGE_IDS[stageIndex];
  const { speak, stop, isPlaying } = useAudio({ lang: "en-US", rate: 0.9, preferLocal: true });
  const practiceCorrect = useMemo(
    () => lesson.practice.filter((item) => practiceAnswers[item.id] === item.answer).length,
    [lesson.practice, practiceAnswers]
  );
  const audioAssets = getHadithAudioAssets(lesson.id);
  const practiceScore = Math.round((practiceCorrect / lesson.practice.length) * 100);

  const playTrack = (trackId: string) => {
    const isArabic = trackId === "arabic";
    stop();
    void speak(
      isArabic ? lesson.source.arabic : lesson.source.translation,
      isArabic ? "ar-SA" : "en-US",
      isArabic ? audioAssets?.arabic.objectKey : audioAssets?.translation.objectKey
    );
  };

  const goNext = () => {
    if (stageIndex < HADITH_STAGE_IDS.length - 1) {
      const nextStage = stageIndex + 1;
      setStageIndex(nextStage);
      recordHadithCheckpoint(
        lesson.id,
        nextStage,
        stage,
        stage === "practice" ? practiceScore : undefined
      );
      return;
    }
    if (!confidence) return;
    recordHadithCompletion(lesson.id, practiceScore, confidence);
    dispatch({ type: "GO", to: "hadith-curriculum" });
  };

  const reset = () => {
    stop();
    setStageIndex(0);
    setWarmupAnswer(null);
    setPracticeAnswers({});
    setConfidence(null);
  };

  return (
    <main
      className="min-h-dvh w-full overflow-y-auto bg-background pb-24"
      aria-labelledby="hadith-title"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 sm:p-8">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "hadith-curriculum" })}
          className="min-h-11 w-fit rounded-xl px-3 font-bold text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="me-2 inline size-4 rtl:rotate-180" aria-hidden />
          {t("hadith.backToCurriculum")}
        </button>

        <header className="rounded-3xl border border-border bg-card p-5 shadow-wp-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                {t("hadith.badge", { number: lesson.number })}
              </p>
              <h1 id="hadith-title" className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                {lesson.title}
              </h1>
              <p className="mt-2 text-sm font-semibold text-muted-foreground" lang="ar" dir="rtl">
                {lesson.titleAr}
              </p>
            </div>
            <p className="rounded-full bg-primary/10 px-3 py-2 text-sm font-black text-primary">
              {t("hadith.minutes", { count: lesson.estimatedMinutes })}
            </p>
          </div>
          <nav className="mt-6" aria-label={t("hadith.stageNavigation")}>
            <ol className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {HADITH_STAGE_IDS.map((id, index) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      setStageIndex(index);
                      recordHadithCheckpoint(lesson.id, index);
                    }}
                    aria-current={index === stageIndex ? "step" : undefined}
                    className={`min-h-11 w-full rounded-xl px-2 text-xs font-black focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${index === stageIndex ? "bg-primary text-primary-foreground" : index < stageIndex ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    <span className="sr-only">{index + 1}. </span>
                    {stageLabels[id]}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {stage === "overview" && (
          <section
            className="grid gap-5 lg:grid-cols-[1fr_1.2fr]"
            aria-labelledby="overview-heading"
          >
            <div className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                {t("hadith.lessonLabel")}
              </p>
              <h2 id="overview-heading" className="mt-3 text-3xl font-black sm:text-4xl">
                {lesson.title}
              </h2>
              <p className="mt-5 rounded-2xl bg-muted p-4 text-sm font-semibold leading-6">
                {lesson.purpose}
              </p>
              <button
                type="button"
                onClick={goNext}
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-black text-primary-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("hadith.beginLesson")}
                <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
              </button>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
              <h2 className="text-xl font-black">{t("hadith.learningOutcomes")}</h2>
              <ul className="mt-5 space-y-4">
                {lesson.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3 text-sm font-semibold leading-6">
                    <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {stage === "warm-up" && (
          <section
            className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8"
            aria-labelledby="warmup-heading"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              {t("hadith.warmupLabel")}
            </p>
            <h2 id="warmup-heading" className="mt-2 text-2xl font-black">
              {lesson.warmup.prompt}
            </h2>
            <div className="mt-6 grid gap-3">
              {lesson.warmup.options.map((option) => {
                const selected = warmupAnswer === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setWarmupAnswer(option)}
                    className={`min-h-14 rounded-2xl border-2 px-4 text-start font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${selected ? "border-primary bg-primary/10" : "border-border hover:border-primary"}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {warmupAnswer && (
              <p className="mt-5 rounded-2xl bg-muted p-4 text-sm font-semibold" role="status">
                {lesson.warmup.feedback}
              </p>
            )}
          </section>
        )}

        {stage === "read-listen" && (
          <section
            className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"
            aria-labelledby="read-listen-heading"
          >
            <article className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                    {t("hadith.canonicalLabel")}
                  </p>
                  <h2 id="read-listen-heading" className="mt-2 text-2xl font-black">
                    {t("hadith.completeText")}
                  </h2>
                </div>
                <BookOpen className="size-7 text-primary" aria-hidden />
              </div>
              <p
                className="mt-6 text-2xl font-bold leading-[2.1] text-foreground sm:text-3xl"
                lang="ar"
                dir="rtl"
              >
                {lesson.source.arabic}
              </p>
              <button
                type="button"
                onClick={() => playTrack("arabic")}
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-primary px-4 font-black text-primary-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Headphones className="size-5" aria-hidden />
                {isPlaying ? t("hadith.playing") : t("hadith.listenArabic")}
              </button>
              <div className="mt-7 border-t border-border pt-6">
                <p className="text-lg leading-8 text-foreground">{lesson.source.translation}</p>
                <button
                  type="button"
                  onClick={() => playTrack("translation")}
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl border border-primary px-4 font-black text-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Volume2 className="size-5" aria-hidden />
                  {t("hadith.listenTranslation")}
                </button>
              </div>
              <p className="mt-7 text-xs font-semibold italic text-muted-foreground">
                {lesson.source.citation}
              </p>
            </article>
            <aside
              className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8"
              aria-labelledby="listening-guide-heading"
            >
              <h2 id="listening-guide-heading" className="text-xl font-black">
                {t("hadith.listeningGuide")}
              </h2>
              <ol className="mt-5 space-y-5">
                {[
                  t("hadith.listenStepOne"),
                  t("hadith.listenStepTwo"),
                  t("hadith.listenStepThree"),
                ].map((stepText, index) => (
                  <li key={stepText} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold leading-6">{stepText}</span>
                  </li>
                ))}
              </ol>
            </aside>
          </section>
        )}

        {stage === "vocabulary" && (
          <section
            className="rounded-3xl border border-border bg-card p-5 shadow-wp-sm sm:p-8"
            aria-labelledby="vocabulary-heading"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              {t("hadith.vocabularyLabel")}
            </p>
            <h2 id="vocabulary-heading" className="mt-2 text-2xl font-black">
              {t("hadith.vocabularyTitle")}
            </h2>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[680px] text-start text-sm">
                <thead className="bg-muted text-xs font-black uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3">{t("hadith.word")}</th>
                    <th className="px-4 py-3">{t("hadith.partOfSpeech")}</th>
                    <th className="px-4 py-3">{t("hadith.definition")}</th>
                    <th className="px-4 py-3" lang="ar">
                      {t("hadith.arabic")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.vocabulary.map((item) => (
                    <tr key={item.id} className="border-t border-border">
                      <th className="px-4 py-4 text-start font-black">{item.term}</th>
                      <td className="px-4 py-4">{item.partOfSpeech}</td>
                      <td className="px-4 py-4">
                        <p>{item.definition}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.example}</p>
                      </td>
                      <td className="px-4 py-4 text-lg font-bold text-primary" lang="ar" dir="rtl">
                        {item.arabic}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {stage === "practice" && (
          <section
            className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8"
            aria-labelledby="practice-heading"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              {t("hadith.practiceLabel")}
            </p>
            <h2 id="practice-heading" className="mt-2 text-2xl font-black">
              {t("hadith.practiceTitle")}
            </h2>
            <div className="mt-6 space-y-7">
              {lesson.practice.map((item, index) => (
                <fieldset key={item.id} className="rounded-2xl border border-border p-4">
                  <legend className="px-2 text-sm font-black">
                    {index + 1}. {item.prompt}
                  </legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {item.options.map((option) => {
                      const selected = practiceAnswers[item.id] === option;
                      const correct = selected && option === item.answer;
                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            setPracticeAnswers((answers) => ({ ...answers, [item.id]: option }))
                          }
                          className={`min-h-12 rounded-xl border px-3 text-start text-sm font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${correct ? "border-feedback-success bg-feedback-success-surface" : selected ? "border-primary bg-primary/10" : "border-border hover:border-primary"}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {practiceAnswers[item.id] && (
                    <p className="mt-3 text-sm font-semibold text-muted-foreground" role="status">
                      {item.explanation}
                    </p>
                  )}
                </fieldset>
              ))}
            </div>
            <p className="mt-6 text-sm font-black text-primary" role="status">
              {t("hadith.practiceScore", {
                correct: practiceCorrect,
                total: lesson.practice.length,
              })}
            </p>
          </section>
        )}

        {stage === "speak" && (
          <section
            className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8"
            aria-labelledby="speak-heading"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              {t("hadith.speakLabel")}
            </p>
            <h2 id="speak-heading" className="mt-2 text-2xl font-black">
              {lesson.speak.prompt}
            </h2>
            <div className="mt-6 rounded-2xl bg-muted p-5">
              <p className="text-xs font-black uppercase tracking-wide text-primary">
                {t("hadith.modelLabel")}
              </p>
              <p className="mt-2 text-lg font-semibold leading-8">{lesson.speak.model}</p>
              <button
                type="button"
                onClick={() => void speak(lesson.speak.model)}
                className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-4 font-black text-primary-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Volume2 className="size-5" aria-hidden />
                {t("hadith.playModel")}
              </button>
            </div>
            <p className="mt-5 text-sm font-semibold text-muted-foreground">
              {t("hadith.speakingOptional")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {lesson.speak.targetTerms.map((term) => (
                <span
                  key={term}
                  className="rounded-full bg-primary/10 px-3 py-2 text-sm font-black text-primary"
                >
                  {term}
                </span>
              ))}
            </div>
          </section>
        )}

        {stage === "check-review" && (
          <section
            className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-6 text-center shadow-wp-sm sm:p-8"
            aria-labelledby="review-heading"
          >
            <Check className="mx-auto size-12 text-primary" aria-hidden />
            <h2 id="review-heading" className="mt-4 text-2xl font-black">
              {t("hadith.reviewTitle")}
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">
              {t("hadith.reviewDescription")}
            </p>
            <fieldset className="mt-6 rounded-2xl border border-border p-4 text-start">
              <legend className="px-2 text-xs font-black uppercase tracking-wide text-primary">
                {t("hadith.confidenceHeading")}
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {["again", "supported", "ready"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={confidence === value}
                    onClick={() => setConfidence(value as HadithConfidence)}
                    className={`min-h-12 rounded-xl border px-3 text-sm font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${confidence === value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                  >
                    {t(`hadith.confidence.${value}`)}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>
        )}

        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="min-h-12 rounded-xl px-4 font-bold text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <RotateCcw className="me-2 inline size-4" aria-hidden />
            {t("hadith.resetLesson")}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={stage === "check-review" && !confidence}
            aria-describedby={
              stage === "check-review" && !confidence
                ? "rich-hadith-confidence-required"
                : undefined
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-black text-primary-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {stageIndex === HADITH_STAGE_IDS.length - 1
              ? t("hadith.finishLesson")
              : t("hadith.continue")}
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
          </button>
        </div>
        {stage === "check-review" && !confidence && (
          <p
            id="rich-hadith-confidence-required"
            className="text-end text-sm font-semibold text-muted-foreground"
          >
            {t("hadith.chooseConfidence")}
          </p>
        )}
        <div className="sr-only" role="status" aria-live="polite">
          {isPlaying ? t("hadith.audioPlaying") : ""}
        </div>
        <div className="sr-only">
          <CircleHelp aria-hidden />
        </div>
      </div>
    </main>
  );
}

function CatalogHadithLessonScreen({
  dispatch,
  lesson,
}: {
  dispatch: React.Dispatch<Action>;
  lesson: FigmaHadithLesson;
}) {
  const { t } = useI18n();
  const { state, recordHadithCheckpoint, recordHadithCompletion } = useLearner();
  const savedProgress = state.hadithProgress[lesson.id];
  const [stageIndex, setStageIndex] = useState(
    Math.min(HADITH_STAGE_IDS.length - 1, Math.max(0, savedProgress?.currentStage ?? 0))
  );
  const [confidence, setConfidence] = useState<HadithConfidence | null>(
    savedProgress?.confidence ?? null
  );
  const [practiceScore, setPracticeScore] = useState(savedProgress?.bestScorePercent ?? 0);
  const stage = HADITH_STAGE_IDS[stageIndex];
  const stageContent = lesson.stages[stage].text;
  const audioAssets = getHadithAudioAssets(lesson.id);
  const exerciseSet = getHadithExerciseSet(lesson.id);
  const { speak, stop, isPlaying } = useAudio({ lang: "en-US", rate: 0.9, preferLocal: true });

  const openLesson = (number: number) => {
    stop();
    dispatch({
      type: "OPEN_HADITH_LESSON",
      lessonId: `hadith-${String(number).padStart(2, "0")}`,
    });
  };

  const goBack = () => {
    if (stageIndex > 0) {
      const previousStage = stageIndex - 1;
      setStageIndex(previousStage);
      recordHadithCheckpoint(lesson.id, previousStage);
      return;
    }
    if (lesson.number > 1) openLesson(lesson.number - 1);
    else dispatch({ type: "GO", to: "hadith-curriculum" });
  };

  const goNext = () => {
    if (stageIndex < HADITH_STAGE_IDS.length - 1) {
      const nextStage = stageIndex + 1;
      setStageIndex(nextStage);
      recordHadithCheckpoint(
        lesson.id,
        nextStage,
        stage,
        stage === "practice" && exerciseSet ? practiceScore : undefined
      );
      return;
    }
    if (!confidence) return;
    recordHadithCompletion(lesson.id, practiceScore, confidence);
    if (lesson.number < HADITH_LESSONS.length) openLesson(lesson.number + 1);
    else dispatch({ type: "GO", to: "hadith-curriculum" });
  };

  const playCanonicalText = (language: "ar" | "en") => {
    stop();
    void speak(
      language === "ar" ? lesson.source.arabic : lesson.source.translation,
      language === "ar" ? "ar-SA" : "en-US",
      language === "ar" ? audioAssets?.arabic.objectKey : audioAssets?.translation.objectKey
    );
  };

  return (
    <main
      className="min-h-dvh w-full overflow-y-auto bg-background pb-24"
      aria-labelledby="hadith-title"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 sm:p-8">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "hadith-curriculum" })}
          className="min-h-11 w-fit rounded-xl px-3 font-bold text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="me-2 inline size-4 rtl:rotate-180" aria-hidden />
          {t("hadith.backToCurriculum")}
        </button>

        <header className="rounded-3xl border border-border bg-card p-5 shadow-wp-sm sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            {t("hadith.badge", { number: lesson.number })}
          </p>
          <h1 id="hadith-title" className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-3 text-sm font-bold text-muted-foreground">
            {t("hadith.lessonProgress", { current: lesson.number, total: HADITH_LESSONS.length })}
          </p>
          {savedProgress && (
            <p className="mt-2 text-sm font-bold text-primary" role="status">
              <Check className="me-1 inline size-4" aria-hidden />
              {t("hadith.progressRestored")}
            </p>
          )}
          <nav className="mt-6" aria-label={t("hadith.stageNavigation")}>
            <ol className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {HADITH_STAGE_IDS.map((id, index) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      setStageIndex(index);
                      recordHadithCheckpoint(lesson.id, index);
                    }}
                    aria-current={index === stageIndex ? "step" : undefined}
                    className={`min-h-11 w-full rounded-xl px-2 text-xs font-black focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${index === stageIndex ? "bg-primary text-primary-foreground" : index < stageIndex ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    <span className="sr-only">{index + 1}. </span>
                    {stageLabels[id]}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {stage === "practice" && exerciseSet ? (
          <HadithPractice exerciseSet={exerciseSet} onScoreChange={setPracticeScore} />
        ) : stage === "read-listen" ? (
          <section
            className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"
            aria-labelledby="read-listen-heading"
          >
            <article className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                {t("hadith.canonicalLabel")}
              </p>
              <h2 id="read-listen-heading" className="mt-2 text-2xl font-black">
                {t("hadith.completeText")}
              </h2>
              <p className="mt-6 text-2xl font-bold leading-[2.1] sm:text-3xl" lang="ar" dir="rtl">
                {lesson.source.arabic}
              </p>
              <button
                type="button"
                onClick={() => playCanonicalText("ar")}
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-primary px-4 font-black text-primary-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Headphones className="size-5" aria-hidden />
                {isPlaying ? t("hadith.playing") : t("hadith.listenArabic")}
              </button>
              <div className="mt-7 border-t border-border pt-6">
                <p className="text-lg leading-8">{lesson.source.translation}</p>
                <button
                  type="button"
                  onClick={() => playCanonicalText("en")}
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl border border-primary px-4 font-black text-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Volume2 className="size-5" aria-hidden />
                  {t("hadith.listenTranslation")}
                </button>
              </div>
              <p className="mt-7 text-xs font-semibold italic text-muted-foreground">
                {lesson.source.citation}
              </p>
            </article>
            <StageContent
              heading={t("hadith.listeningGuide")}
              lines={stageContent}
              labelledBy="listening-support-heading"
              compact
            />
          </section>
        ) : (
          <StageContent
            heading={stageLabels[stage]}
            lines={stageContent}
            labelledBy="hadith-stage-heading"
          >
            {stage === "check-review" && (
              <fieldset className="mt-7 rounded-2xl border border-border p-4 text-start">
                <legend className="px-2 text-xs font-black uppercase tracking-wide text-primary">
                  {t("hadith.confidenceHeading")}
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {(["again", "supported", "ready"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={confidence === value}
                      onClick={() => setConfidence(value)}
                      className={`min-h-12 rounded-xl border px-3 text-sm font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${confidence === value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                    >
                      {t(`hadith.confidence.${value}`)}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </StageContent>
        )}

        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border px-5 font-black focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
            {t("hadith.previous")}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={stage === "check-review" && !confidence}
            aria-describedby={
              stage === "check-review" && !confidence ? "hadith-confidence-required" : undefined
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-black text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {stageIndex === HADITH_STAGE_IDS.length - 1
              ? lesson.number < HADITH_LESSONS.length
                ? t("hadith.nextLesson")
                : t("hadith.finishLesson")
              : t("hadith.continue")}
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
          </button>
        </div>
        {stage === "check-review" && !confidence && (
          <p
            id="hadith-confidence-required"
            className="text-end text-sm font-semibold text-muted-foreground"
          >
            {t("hadith.chooseConfidence")}
          </p>
        )}
        <div className="sr-only" role="status" aria-live="polite">
          {isPlaying ? t("hadith.audioPlaying") : ""}
        </div>
      </div>
    </main>
  );
}

function StageContent({
  heading,
  lines,
  labelledBy,
  compact = false,
  children,
}: {
  heading: string;
  lines: readonly string[];
  labelledBy: string;
  compact?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8 ${compact ? "" : "mx-auto w-full max-w-4xl"}`}
      aria-labelledby={labelledBy}
    >
      <h2 id={labelledBy} className="text-2xl font-black">
        {heading}
      </h2>
      <div className="mt-6 space-y-3">
        {lines.map((line, index) => {
          const isLabel = line.length < 90 && (line === line.toUpperCase() || /:$/.test(line));
          return (
            <p
              key={`${index}-${line}`}
              className={
                isLabel
                  ? "pt-3 text-xs font-black uppercase tracking-[0.14em] text-primary"
                  : "whitespace-pre-line text-sm font-semibold leading-7 text-foreground"
              }
            >
              {line}
            </p>
          );
        })}
      </div>
      {children}
    </section>
  );
}
