import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FastForward,
  Headphones,
  MicOff,
  Volume2,
} from "lucide-react";
import type { Action } from "../../types";
import { Button } from "../../shared/Button";
import { CourseLessonNavigation } from "../../shared/CourseLessonNavigation";
import { HelpDisclosure } from "../../shared/HelpDisclosure";
import { useAudioRecoveryMessage } from "../../shared/AudioRecoveryStatus";
import { useAudio } from "../../shared/useAudio";
import { ADVANCE_DELAY_MS, useAutoAdvance } from "../../shared/useAutoAdvance";
import { useSpokenFeedback } from "../../shared/useSpokenFeedback";
import { useI18n } from "../../../i18n";
import { useLearner } from "../../context/LearnerContext";
import { PrivateRecordCompare } from "./PrivateRecordCompare";
import {
  FIGMA_PRONUNCIATION_LESSONS,
  getFigmaPronunciationActivityData,
  getPronunciationQuestion,
  getStressBeatPattern,
  pronunciationImagePath,
  type FigmaPronunciationImage,
} from "./figmaPronunciationCatalog";
import { hasReportedPronunciationAudioIssue } from "./pronunciationAudioQuality";
import { getPronunciationAudioClip } from "./pronunciationAudioManifest";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import {
  pronunciationEvidenceKey,
  pronunciationTargetId,
  pronunciationTrialCount,
  getPronunciationTargets,
  pronunciationContentRevision,
  resumablePronunciationSession,
} from "./pronunciationTargets";
import type { PronunciationSession, PronunciationTargetEvidence } from "./pronunciationProgress";

interface Props {
  lessonNumber: number;
  dispatch: React.Dispatch<Action>;
}
type Stage = 0 | 1 | 2 | 3 | 4;
const STAGES = ["preview", "listen", "meaning", "use", "transfer"] as const;

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";
const emptySession = (): PronunciationSession => ({
  version: 2,
  targetEvidence: {},
  trial: 0,
  attempts: 0,
  answer: null,
  unlockedStage: 0,
  outcomes: {},
});

function populateUnassessedSpeaking(
  current: Record<string, PronunciationTargetEvidence> | undefined,
  targets: readonly FigmaPronunciationImage[]
): Record<string, PronunciationTargetEvidence> {
  const updated = { ...current };
  const now = Date.now();
  const nextReview = new Date(now + 86400000).toISOString();
  const updatedIso = new Date(now).toISOString();
  for (const item of targets) {
    const tId = pronunciationTargetId(item.label);
    if (!updated[tId]?.speaking) {
      updated[tId] = {
        ...updated[tId],
        speaking: "unassessed",
        updatedAt: updatedIso,
        nextReviewAt: nextReview,
      };
    }
  }
  return updated;
}

function WordImage({ item, className }: { item: FigmaPronunciationImage; className: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span
      className={`${className} flex items-center justify-center bg-muted text-foreground`}
      lang="en"
      dir="ltr"
    >
      {item.label}
    </span>
  ) : (
    <img
      src={resolveAssetUrl(pronunciationImagePath(item.imageRef))}
      alt=""
      aria-hidden
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function FigmaPronunciationLessonScreen({ lessonNumber, dispatch }: Props) {
  const { t } = useI18n();
  const { state, setAccessibility, recordPronunciationCheckpoint, recordPronunciationCompletion } =
    useLearner();
  const lessonId = `lesson-${String(lessonNumber).padStart(2, "0")}`;
  const progress = state.pronunciationProgress[lessonId];
  const activity = getFigmaPronunciationActivityData(lessonNumber);
  const savedSession = resumablePronunciationSession(
    lessonNumber,
    progress?.currentStage ?? 0,
    progress?.session
  );
  // Legacy checkpoints lack scored evidence: retain historical progress and start a fair new attempt.
  const [stage, setStage] = useState<Stage>(() =>
    savedSession ? (progress!.currentStage as Stage) : 0
  );
  const [session, setSession] = useState<PronunciationSession>(() => {
    return savedSession ?? emptySession();
  });
  const sessionRef = useRef(session);
  const finishedRef = useRef(false);
  const generationRef = useRef(0);
  const [completedScore, setCompletedScore] = useState<number | null>(null);
  const [slowPlayback, setSlowPlayback] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { speak, stop, isError, status } = useAudio({
    lang: "en-US",
    rate: slowPlayback ? 0.75 : 1,
    preferLocal: true,
    allowDeviceFallback: stage === 0,
  });
  const { speakFeedback, cancel: cancelSpokenFeedback } = useSpokenFeedback();
  const question =
    stage === 0
      ? null
      : getPronunciationQuestion(
          lessonNumber,
          stage,
          session.trial,
          false,
          session.currentTargetId
        );
  const target =
    question?.target ??
    activity.items.find((item) => item.label.toLowerCase() === activity.model.toLowerCase()) ??
    activity.items[0];
  const clipUnavailable =
    hasReportedPronunciationAudioIssue(target?.label ?? activity.model) ||
    !getPronunciationAudioClip(target?.label ?? activity.model);
  const audioUnavailable = clipUnavailable || isError || status === "unsupported";
  const recoveryMessage = useAudioRecoveryMessage(isError, status !== "unsupported");
  const targetId = pronunciationTargetId(target?.label ?? activity.model);
  const trials = pronunciationTrialCount(lessonNumber, stage);
  const speakingEvidence = session.targetEvidence?.[targetId]?.speaking;
  const speakingDone = speakingEvidence !== undefined;
  const passed = stage === 3 ? speakingDone : session.answer === target?.label;
  const canAdvance =
    stage === 0 ||
    (stage === 3
      ? speakingDone
      : passed || session.attempts >= 2 || session.answer === "__unavailable__");
  const questionId = pronunciationEvidenceKey(stage, target?.label ?? activity.model);
  const clip = getPronunciationAudioClip(target?.label ?? activity.model, stage === 4);
  const play = (text = target?.label ?? activity.model) => {
    if (!hasReportedPronunciationAudioIssue(text))
      speak(text, undefined, getPronunciationAudioClip(text, stage === 4)?.objectKey);
  };
  const save = (nextStage: Stage, nextSession: PronunciationSession) => {
    const saved: PronunciationSession = {
      ...nextSession,
      contentRevision: pronunciationContentRevision(lessonNumber),
      currentTargetId:
        nextStage > 0
          ? pronunciationTargetId(
              getPronunciationQuestion(
                lessonNumber,
                nextStage as 1 | 2 | 3 | 4,
                nextSession.trial,
                false,
                nextSession.currentTargetId
              ).target.label
            )
          : undefined,
    };
    sessionRef.current = saved;
    setSession(saved);
    setStage(nextStage);
    recordPronunciationCheckpoint(lessonId, nextStage, saved);
  };
  const advance = () => {
    if (finishedRef.current) return;
    if (!canAdvance) return;
    generationRef.current += 1;
    autoAdvance.cancel();
    stop();
    cancelSpokenFeedback();
    const current = sessionRef.current;
    const outcomes =
      stage > 0 &&
      stage !== 3 &&
      !audioUnavailable &&
      current.answer !== "__unavailable__" &&
      !(questionId in current.outcomes)
        ? { ...current.outcomes, [questionId]: false }
        : current.outcomes;
    if (stage === 4 && current.trial === trials - 1) {
      finishedRef.current = true;
      const score = Object.keys(outcomes).length
        ? Math.round(
            (100 * Object.values(outcomes).filter(Boolean).length) / Object.keys(outcomes).length
          )
        : 0;
      setCompletedScore(score);
      recordPronunciationCompletion(lessonId, score, stage);
      requestAnimationFrame(() => headingRef.current?.focus());
      return;
    }
    let nextStage = (stage === 0 || current.trial === trials - 1 ? stage + 1 : stage) as Stage;
    let nextEvidence = current.targetEvidence;
    if (nextStage === 3 && state.accessibility.includeSpeaking === false) {
      const stage3Targets = getPronunciationTargets(lessonNumber, false);
      nextEvidence = populateUnassessedSpeaking(current.targetEvidence, stage3Targets);
      nextStage = 4;
    }
    save(nextStage, {
      trial: nextStage === stage ? current.trial + 1 : 0,
      attempts: 0,
      answer: null,
      outcomes,
      version: 2,
      targetEvidence: nextEvidence,
      unlockedStage: Math.max(current.unlockedStage, nextStage),
    });
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  // Pronunciation drills default to automatic progression, defeatable via Lesson Options or pause control.
  const [drillAutoAdvance, setDrillAutoAdvance] = useState(true);
  const isAutoAdvance = state.accessibility.autoAdvance || drillAutoAdvance;

  const autoAdvance = useAutoAdvance({
    enabled: isAutoAdvance,
    onAdvance: advance,
  });
  const clearPending = () => {
    generationRef.current += 1;
    autoAdvance.cancel();
    stop();
    cancelSpokenFeedback();
  };
  const selectAnswer = (value: string) => {
    const current = sessionRef.current;
    if (audioUnavailable || stage === 3 || current.answer === target?.label || finishedRef.current)
      return;
    clearPending();
    const correct = value === target?.label;
    save(stage, {
      ...current,
      answer: value,
      attempts: correct ? current.attempts : current.attempts + 1,
      targetEvidence: {
        ...current.targetEvidence,
        [targetId]: {
          ...current.targetEvidence?.[targetId],
          listening: current.targetEvidence?.[targetId]?.listening === false ? false : correct,
          updatedAt: new Date().toISOString(),
          nextReviewAt: new Date(Date.now() + (correct ? 3 : 1) * 86400000).toISOString(),
        },
      },
      outcomes:
        questionId in current.outcomes
          ? current.outcomes
          : { ...current.outcomes, [questionId]: correct },
    });
    const generation = generationRef.current;
    speakFeedback(
      {
        correct,
        targetLabel: target?.label ?? activity.model,
        chosenLabel: correct ? null : value,
      },
      () => {
        if (correct && generation === generationRef.current)
          autoAdvance.schedule(ADVANCE_DELAY_MS.correct);
      }
    );
  };
  const recordSpeaking = (speaking: NonNullable<PronunciationTargetEvidence["speaking"]>) => {
    clearPending();
    const current = sessionRef.current;
    save(stage, {
      ...current,
      targetEvidence: {
        ...current.targetEvidence,
        [targetId]: {
          ...current.targetEvidence?.[targetId],
          speaking:
            current.targetEvidence?.[targetId]?.speaking === "assessed" ? "assessed" : speaking,
          updatedAt: new Date().toISOString(),
          nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
        },
      },
    });
  };
  const skipEntireSpeakingSection = () => {
    clearPending();
    const current = sessionRef.current;
    const stage3Targets = getPronunciationTargets(lessonNumber, false);
    const updatedTargetEvidence = populateUnassessedSpeaking(current.targetEvidence, stage3Targets);
    const nextStage: Stage = 4;
    save(nextStage, {
      ...current,
      trial: 0,
      attempts: 0,
      answer: null,
      currentTargetId: undefined,
      targetEvidence: updatedTargetEvidence,
      unlockedStage: Math.max(current.unlockedStage, nextStage),
    });
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const reset = () => {
    clearPending();
    finishedRef.current = false;
    setCompletedScore(null);
    save(0, emptySession());
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const go = (number: number) => {
    clearPending();
    dispatch({ type: "OPEN_FIGMA_PRONUNCIATION", lessonNumber: number });
  };
  const lessonIndex = FIGMA_PRONUNCIATION_LESSONS.findIndex(
    (lesson) => lesson.number === lessonNumber
  );
  const nextLesson = FIGMA_PRONUNCIATION_LESSONS[lessonIndex + 1];
  const previousLesson = FIGMA_PRONUNCIATION_LESSONS[lessonIndex - 1];
  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  useEffect(
    () => () => {
      generationRef.current += 1;
    },
    []
  );
  const shortcutRef = useRef({ selectAnswer, play, advance });
  useEffect(() => {
    shortcutRef.current = { selectAnswer, play, advance };
  });

  const lastAutoplayKeyRef = useRef<string>("");
  const isListeningStage = stage === 1 || stage === 2 || stage === 4;
  // Automatically play audio prompts on listening questions (Stage 1: Discrimination, Stage 2: Meaning, Stage 4: Transfer)
  useEffect(() => {
    if (completedScore !== null || finishedRef.current) return;
    if (!isListeningStage) return;
    if (session.answer !== null) return;
    if (audioUnavailable) return;
    if (state.accessibility.includeListening === false) return;
    if (state.accessibility.autoPlayAudio === false) return;

    const trialKey = `${stage}:${session.trial}:${target?.label ?? activity.model}`;
    if (lastAutoplayKeyRef.current === trialKey) return;
    lastAutoplayKeyRef.current = trialKey;

    const timer = setTimeout(() => {
      if (sessionRef.current.answer === null && !finishedRef.current) {
        shortcutRef.current.play();
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [
    stage,
    isListeningStage,
    session.trial,
    session.answer,
    target?.label,
    activity.model,
    completedScore,
    audioUnavailable,
    state.accessibility.includeListening,
    state.accessibility.autoPlayAudio,
  ]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        completedScore !== null ||
        (event.target instanceof HTMLElement &&
          event.target.closest(
            "button, a, input, textarea, select, summary, [contenteditable='true']"
          ))
      )
        return;
      const choice = stage === 3 ? undefined : question?.choices[Number(event.key) - 1];
      if (choice) {
        event.preventDefault();
        shortcutRef.current.selectAnswer(choice.label);
      }
      if (event.key === " " || event.key.toLowerCase() === "r") {
        event.preventDefault();
        shortcutRef.current.play();
      }
      if (event.key === "Enter") {
        event.preventDefault();
        shortcutRef.current.advance();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [question, completedScore, stage]);
  const instruction =
    stage === 0
      ? t("lessonShell.previewInstruction")
      : stage === 2
        ? t("pronunciation.choosePicture")
        : stage === 3
          ? t("pronunciationEnhancements.sayInstruction")
          : t("pronunciation.chooseHeard");
  const buttonClass = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-base font-bold text-foreground hover:bg-muted ${focusRing}`;
  if (state.accessibility.includePronunciation === false) {
    return (
      <div
        className="wp-lesson-session min-h-dvh w-full overflow-y-auto bg-background"
        aria-labelledby="pronunciation-disabled-title"
      >
        <div className="wp-container-reading wp-layout-gutter flex flex-col gap-6 py-6 sm:py-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: "GO", to: "learn" })}
            className="w-fit"
            iconLeft={<ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />}
          >
            {t("lessonShell.backToLearn")}
          </Button>

          <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-6 text-center shadow-wp-xs sm:p-12">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Headphones className="size-8" aria-hidden />
            </div>
            <h1
              id="pronunciation-disabled-title"
              className="mt-4 text-2xl font-black text-foreground sm:text-3xl"
            >
              {t("pronunciation.disabledTitle")}
            </h1>
            <p className="mt-2 max-w-md text-base text-muted-foreground">
              {t("pronunciation.disabledNotice")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => setAccessibility({ includePronunciation: true })}
              >
                {t("pronunciation.enableNow")}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => dispatch({ type: "GO", to: "learn" })}
              >
                {t("pronunciation.backToLearn")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="wp-lesson-session min-h-dvh w-full overflow-y-auto bg-background"
      aria-labelledby="pronunciation-title"
    >
      <div className="wp-container-reading wp-layout-gutter flex flex-col gap-4 py-4 sm:py-6">
        <div className="relative z-50 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            className={buttonClass}
            onClick={() => {
              clearPending();
              dispatch({ type: "GO", to: "pronunciation-curriculum" });
            }}
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            {t("ux.backToCourse")}
          </button>
          {completedScore === null && (
            <HelpDisclosure label={t("lessonShell.options")} variant="icon">
              <button type="button" className={buttonClass} onClick={reset}>
                {t("lessonShell.restart")}
              </button>
              {previousLesson && (
                <button
                  type="button"
                  className={buttonClass}
                  onClick={() => go(previousLesson.number)}
                >
                  {t("pronunciation.previousLesson")}
                </button>
              )}
              {nextLesson && (
                <button type="button" className={buttonClass} onClick={() => go(nextLesson.number)}>
                  {t("pronunciation.nextLesson")}
                </button>
              )}
              <button
                type="button"
                aria-pressed={isAutoAdvance}
                className={buttonClass}
                onClick={() => {
                  clearPending();
                  if (state.accessibility.autoAdvance) {
                    setAccessibility({ autoAdvance: false });
                  }
                  setDrillAutoAdvance(!isAutoAdvance);
                }}
              >
                {t(isAutoAdvance ? "lessonShell.autoOn" : "lessonShell.autoOff")}
              </button>
              {stage === 3 && (
                <button type="button" className={buttonClass} onClick={skipEntireSpeakingSection}>
                  <FastForward className="size-4 rtl:rotate-180 text-primary" aria-hidden />
                  {t("pronunciationEnhancements.skipSpeakingSection")}
                </button>
              )}
              <button
                type="button"
                aria-pressed={state.accessibility.includeSpeaking}
                className={buttonClass}
                onClick={() => {
                  clearPending();
                  const nextVal = !state.accessibility.includeSpeaking;
                  setAccessibility({ includeSpeaking: nextVal });
                  if (!nextVal && stage === 3) {
                    skipEntireSpeakingSection();
                  }
                }}
              >
                {t("pronunciationEnhancements.speakingToggle", {
                  state: state.accessibility.includeSpeaking
                    ? t("settings.enabled")
                    : t("settings.disabled"),
                })}
              </button>
              <button
                type="button"
                aria-pressed={state.accessibility.autoPlayAudio !== false}
                className={buttonClass}
                onClick={() => {
                  clearPending();
                  setAccessibility({
                    autoPlayAudio: !(state.accessibility.autoPlayAudio !== false),
                  });
                }}
              >
                {t("pronunciationEnhancements.autoPlayAudioToggle", {
                  state:
                    state.accessibility.autoPlayAudio !== false
                      ? t("settings.enabled")
                      : t("settings.disabled"),
                })}
              </button>
            </HelpDisclosure>
          )}
        </div>
        <header>
          <p className="text-sm font-semibold text-primary">
            {t("pronunciation.badge", {
              current: lessonIndex + 1,
              total: FIGMA_PRONUNCIATION_LESSONS.length,
            })}
          </p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            id="pronunciation-title"
            className={`mt-1 text-2xl font-bold text-foreground sm:text-3xl ${focusRing}`}
            lang="en"
            dir="ltr"
          >
            {activity.title}
          </h1>
        </header>
        {completedScore !== null ? (
          <section className="space-y-4" aria-label={t("pronunciation.completeBadge")}>
            <h2 className="text-xl font-bold">
              {t("lessonShell.recognitionResult", { score: completedScore })}
            </h2>
            <p className="text-base text-foreground">{t("lessonShell.speakingDisclaimer")}</p>
            <p>{t("pronunciationEnhancements.completionMessage")}</p>
            <p>
              {completedScore >= 80
                ? t("pronunciation.reviewInDays", { days: 3 })
                : t("pronunciation.reviewTomorrow")}
            </p>
            <p>
              {t("pronunciationEnhancements.speakingCoverage", {
                count: Object.values(session.targetEvidence ?? {}).filter(
                  (item) => item.speaking === "assessed"
                ).length,
                total:
                  getPronunciationTargets(lessonNumber, false).length +
                  getPronunciationTargets(lessonNumber, true).length,
              })}
            </p>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <p className="text-sm font-bold text-foreground">
                {t("pronunciationEnhancements.wordResults")}
              </p>
              <ul className="space-y-2">
                {activity.items.map((item) => {
                  const evidence = session.targetEvidence?.[pronunciationTargetId(item.label)];
                  return (
                    <li
                      key={pronunciationTargetId(item.label)}
                      className="flex flex-wrap justify-between gap-2 text-sm"
                    >
                      <bdi lang="en" dir="ltr">
                        {item.label}
                      </bdi>
                      <span className="text-muted-foreground">
                        {t(
                          evidence?.listening === true
                            ? "pronunciationEnhancements.listenChecked"
                            : "pronunciationEnhancements.listenPending"
                        )}{" "}
                        ·{" "}
                        {t(
                          `pronunciationEnhancements.evidence.${evidence?.speaking ?? "unassessed"}`
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={buttonClass} onClick={reset}>
                {t("pronunciation.reviewAgain")}
              </button>
              <button
                type="button"
                className={`inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-3 text-base font-bold text-primary-foreground hover:bg-primary ${focusRing}`}
                onClick={() =>
                  nextLesson
                    ? go(nextLesson.number)
                    : dispatch({ type: "GO", to: "pronunciation-curriculum" })
                }
              >
                {nextLesson ? t("pronunciation.nextLesson") : t("pronunciation.back")}
              </button>
            </div>
            {activity.reviewSentences.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <p className="text-sm font-bold text-foreground">
                  {t("pronunciation.usageReviewTitle")}
                </p>
                {activity.reviewSentences.map((sentence) => (
                  <div key={sentence}>
                    <button
                      type="button"
                      className={buttonClass}
                      lang="en"
                      dir="ltr"
                      onClick={() => play(sentence)}
                    >
                      {sentence}
                    </button>
                    <PrivateRecordCompare target={sentence} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <div className="relative z-40 border-b border-border bg-background py-1">
              <CourseLessonNavigation
                stages={STAGES.map((name, index) => ({
                  id: name,
                  label: t(`lessonShell.stages.${name}`),
                  group: ([0, 0, 1, 2, 3] as const)[index],
                  completed: index < session.unlockedStage,
                  locked: index > session.unlockedStage,
                }))}
                currentIndex={stage}
                onSelect={(index) => {
                  if (index === stage || index > session.unlockedStage) return;
                  clearPending();
                  save(index as Stage, {
                    ...sessionRef.current,
                    currentTargetId: undefined,
                    trial: 0,
                    attempts: 0,
                    answer: null,
                  });
                }}
              />
            </div>
            {progress?.status === "in-progress" && progress.session?.version !== 2 && (
              <p role="status" className="text-sm text-foreground">
                {t("lessonShell.legacyResume")}
              </p>
            )}
            <section className="space-y-3" aria-labelledby="pronunciation-instruction">
              <h2 id="pronunciation-instruction" className="text-lg font-bold text-foreground">
                {instruction}
              </h2>
              {stage > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p role="status" className="text-sm font-semibold text-muted-foreground">
                    {t("pronunciation.checkProgress", {
                      current: session.trial + 1,
                      total: trials,
                    })}
                  </p>
                  {stage === 3 && state.accessibility.includeSpeaking !== false && (
                    <button
                      type="button"
                      onClick={skipEntireSpeakingSection}
                      className={`min-h-11 ${buttonClass} text-sm`}
                    >
                      <FastForward className="size-4 rtl:rotate-180 text-primary" aria-hidden />
                      <span>{t("pronunciationEnhancements.skipSpeakingSection")}</span>
                    </button>
                  )}
                </div>
              )}
              {stage === 0 && (
                <p className="text-sm text-muted-foreground font-medium">
                  {t("pronunciationEnhancements.coverageGoal", {
                    count:
                      getPronunciationTargets(lessonNumber, false).length +
                      getPronunciationTargets(lessonNumber, true).length,
                  })}
                </p>
              )}
              {stage === 4 &&
                clip?.speaker ===
                  getPronunciationAudioClip(target?.label ?? activity.model)?.speaker && (
                  <p className="text-sm text-foreground">
                    {t("pronunciationEnhancements.sameSpeaker")}
                  </p>
                )}
              {stage !== 3 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={clipUnavailable || status === "unsupported"}
                    aria-busy={status === "loading"}
                    className={`min-h-11 ${buttonClass} border-primary text-primary`}
                    onClick={() =>
                      status === "playing"
                        ? stop()
                        : speak(target?.label ?? activity.model, undefined, clip?.objectKey)
                    }
                  >
                    <Volume2 className="size-5" aria-hidden />
                    {status === "playing"
                      ? t("lessonShell.stopAudio")
                      : isError && !clipUnavailable
                        ? t("readingPlayer.retry")
                        : t("pronunciation.play")}
                  </button>
                  <button
                    type="button"
                    className={buttonClass}
                    aria-pressed={slowPlayback}
                    onClick={() => setSlowPlayback(!slowPlayback)}
                  >
                    {t("lessonShell.playback", {
                      speed: t(
                        slowPlayback ? "pronunciation.slowSpeed" : "pronunciation.normalSpeed"
                      ),
                    })}
                  </button>
                </div>
              )}
              {stage !== 0 && stage !== 3 && audioUnavailable && (
                <div className="space-y-2 rounded-xl border border-border bg-muted p-4">
                  <p role="status">{t("pronunciationEnhancements.audioPending")}</p>
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={() => {
                      clearPending();
                      save(stage, { ...sessionRef.current, answer: "__unavailable__" });
                    }}
                  >
                    {t("pronunciationEnhancements.audioContinue")}
                  </button>
                </div>
              )}
              {recoveryMessage && (
                <p role="alert" className="text-base text-foreground">
                  {recoveryMessage}
                </p>
              )}
              {stage === 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {activity.items.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        aria-label={t("pronunciation.playWord", { word: item.label })}
                        disabled={hasReportedPronunciationAudioIssue(item.label)}
                        title={
                          hasReportedPronunciationAudioIssue(item.label)
                            ? t("pronunciationEnhancements.audioPending")
                            : undefined
                        }
                        onClick={() => play(item.label)}
                        className={`min-h-11 overflow-hidden rounded-xl border border-border bg-card ${focusRing}`}
                      >
                        <WordImage item={item} className="aspect-square w-full object-cover" />
                        <span
                          className="flex min-h-11 items-center justify-center px-2 py-2 font-bold"
                          lang="en"
                          dir="ltr"
                        >
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : stage === 3 ? (
                state.accessibility.includeSpeaking === false ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-6 text-center sm:p-10 space-y-4 shadow-wp-xs">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                      <MicOff className="size-7" aria-hidden />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {t("pronunciationEnhancements.speakingDisabledInSettings")}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                      <button
                        type="button"
                        className={`min-h-11 ${buttonClass} bg-primary text-primary-foreground hover:bg-primary/90`}
                        onClick={() => setAccessibility({ includeSpeaking: true })}
                      >
                        {t("settings.enabled")}
                      </button>
                      <button
                        type="button"
                        className={buttonClass}
                        onClick={skipEntireSpeakingSection}
                      >
                        {t("lessonShell.nextStep", {
                          name: t("lessonShell.stages.transfer"),
                        })}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Hero Prompt Card */}
                    <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-6 sm:p-8 text-center shadow-wp-xs">
                      {target && target.imageRef && (
                        <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border/80 bg-muted/20 shadow-wp-xs">
                          <WordImage item={target} className="aspect-[16/9] w-full object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-2">
                        <h3
                          className="text-3xl sm:text-4xl font-black tracking-tight text-foreground"
                          lang="en"
                          dir="ltr"
                        >
                          {target?.label}
                        </h3>
                        {getStressBeatPattern(lessonNumber, target?.label ?? "") && (
                          <span
                            className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary"
                            aria-label={t("pronunciation.rhythmBeatAria", {
                              beat: getStressBeatPattern(lessonNumber, target?.label ?? "")!,
                            })}
                          >
                            {getStressBeatPattern(lessonNumber, target?.label ?? "")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Recording Interface */}
                    <PrivateRecordCompare
                      key={questionId}
                      target={target?.label ?? activity.model}
                      defaultOpen
                      noDetails
                      onEvidence={recordSpeaking}
                    />

                    {/* Actions and status */}
                    {!speakingDone && (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <button
                          type="button"
                          className={buttonClass}
                          onClick={() => recordSpeaking("unassessed")}
                        >
                          {t("pronunciationEnhancements.skipSpeaking")}
                        </button>
                        <button
                          type="button"
                          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-base font-bold text-foreground hover:bg-muted ${focusRing}`}
                          onClick={skipEntireSpeakingSection}
                        >
                          <FastForward className="size-4 rtl:rotate-180 text-primary" aria-hidden />
                          <span>{t("pronunciationEnhancements.skipSpeakingSection")}</span>
                        </button>
                      </div>
                    )}
                    {speakingDone && (
                      <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                        <p role="status" className="text-sm font-bold text-foreground">
                          {t(`pronunciationEnhancements.evidence.${speakingEvidence}`)}
                        </p>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {question?.choices.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      tabIndex={0}
                      aria-pressed={session.answer === item.label}
                      aria-disabled={passed || audioUnavailable}
                      aria-label={t("pronunciation.choiceLabel", {
                        number: index + 1,
                        word: item.label,
                      })}
                      onClick={() => selectAnswer(item.label)}
                      className={`overflow-hidden rounded-2xl border-2 bg-card text-start font-bold ${focusRing} ${session.answer === item.label ? (passed ? "border-feedback-success bg-feedback-success-surface" : "border-feedback-error-border bg-feedback-error-surface") : "border-border hover:border-primary"}`}
                      dir="ltr"
                    >
                      {Boolean(item.imageRef) && (
                        <WordImage
                          item={item}
                          className="block aspect-[16/9] w-full object-cover"
                        />
                      )}
                      <span className="flex min-h-11 flex-wrap items-center justify-center gap-2 px-3 py-2">
                        {passed && session.answer === item.label && (
                          <Check className="size-5" aria-hidden />
                        )}
                        <span lang="en" dir="ltr" className="min-w-0 break-words">
                          {item.label}
                        </span>
                        {getStressBeatPattern(lessonNumber, item.label) && (
                          <span
                            aria-label={t("pronunciation.rhythmBeatAria", {
                              beat: getStressBeatPattern(lessonNumber, item.label)!,
                            })}
                          >
                            {getStressBeatPattern(lessonNumber, item.label)}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {stage !== 3 && session.answer && session.answer !== "__unavailable__" && (
                <div
                  role="status"
                  className="space-y-2 rounded-xl border border-border bg-muted p-4"
                >
                  <p className="font-bold">
                    {passed
                      ? t("pronunciation.correct")
                      : session.attempts >= 2
                        ? t("lessonShell.supportContinue")
                        : t("pronunciation.retry")}
                  </p>
                  {!passed && (
                    <p>
                      {t("pronunciation.confusionPair", {
                        heard: session.answer,
                        target: target?.label ?? activity.model,
                      })}
                    </p>
                  )}
                  {!passed && (
                    <p lang="en" dir="ltr">
                      {activity.recoveryCue ?? activity.articulationCues[0]}
                    </p>
                  )}
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={() => {
                      clearPending();
                      speakFeedback({
                        correct: passed,
                        targetLabel: target?.label ?? activity.model,
                        chosenLabel: passed ? null : session.answer,
                      });
                    }}
                  >
                    {t("pronunciation.replayFeedback")}
                  </button>
                </div>
              )}
            </section>
            <HelpDisclosure label={t("lessonShell.soundTips")}>
              <div className="space-y-3">
                {activity.focus && (
                  <p lang="en" dir="ltr" className="text-sm text-foreground">
                    {activity.focus}
                  </p>
                )}
                <ul className="space-y-2" lang="en" dir="ltr">
                  {activity.articulationCues.map((cue) => (
                    <li key={cue} className="space-y-1">
                      <p className="text-sm text-foreground">{cue}</p>
                      <button type="button" className={buttonClass} onClick={() => play(cue)}>
                        <Volume2 className="size-4" aria-hidden />
                        {t("pronunciation.listenToContrast")}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {activity.contrastPairs.map(([a, b]) => (
                    <div key={`${a}:${b}`} className="flex flex-wrap gap-1" lang="en" dir="ltr">
                      {[a, b].map((word, index) => (
                        <button
                          key={`${word}:${index}`}
                          type="button"
                          aria-label={t("pronunciation.playWord", { word })}
                          className={buttonClass}
                          onClick={() => play(word)}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                {activity.arabicSpeakerTip && (
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p lang="en" dir="ltr">
                      {activity.arabicSpeakerTip.tipEn}
                    </p>
                    <p lang="ar" dir="rtl">
                      {activity.arabicSpeakerTip.tipAr}
                    </p>
                  </div>
                )}
              </div>
            </HelpDisclosure>
            <HelpDisclosure label={t("lessonShell.aboutLesson")}>
              <div className="space-y-2">
                <p lang="en" dir="ltr" className="text-sm text-foreground">
                  {activity.objective}
                </p>
                {progress && (
                  <p className="text-sm text-muted-foreground">
                    {t("pronunciation.previousBest", { score: progress.bestScorePercent })}
                  </p>
                )}
              </div>
            </HelpDisclosure>
            <div className="wp-sticky-controls relative z-30 border-t border-border bg-background py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {canAdvance ? (
                <button
                  type="button"
                  onClick={advance}
                  className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-bold text-primary-foreground ${focusRing}`}
                >
                  {stage === 0
                    ? t("lessonShell.startListening")
                    : session.trial < trials - 1
                      ? t("lessonShell.nextQuestion")
                      : stage === 4
                        ? t("lessonShell.seeResults")
                        : t("lessonShell.nextStep", {
                            name: t(`lessonShell.stages.${STAGES[stage + 1]}`),
                          })}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </button>
              ) : (
                <p className="text-center text-base text-foreground">
                  {t(
                    stage === 3
                      ? "pronunciationEnhancements.sayInstruction"
                      : "pronunciation.answerPrompt"
                  )}
                </p>
              )}
              {autoAdvance.isPending && (
                <button
                  type="button"
                  className={`min-h-11 ${buttonClass} mt-2 w-full`}
                  onClick={() => {
                    clearPending();
                    setAccessibility({ autoAdvance: false });
                    setDrillAutoAdvance(false);
                  }}
                >
                  {t("lessonShell.pauseAdvance")}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
