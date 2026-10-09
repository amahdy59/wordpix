import { useState, useId, useRef, useEffect, type RefObject } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Volume2,
  Compass,
  Sparkles,
} from "lucide-react";
import { useI18n, type TranslationValues } from "../../i18n";
import { ChoiceOptionGroup, type ChoiceOption } from "./ChoiceOptionGroup";
import { playCorrectSound, playIncorrectSound } from "./useSound";
import { useAudio } from "./useAudio";
import { getCanDoScenarioForUnit, type CanDoTransferChallenge } from "../data/canDoScenarios";

// ─── Public Types ────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  stem: string;
  options?: readonly ChoiceOption<string>[];
  correctValue: string;
  /** Shown immediately after the learner answers. */
  explanation?: string;
  /** Optional image/media rendered above the options. */
  media?: React.ReactNode;
  /** 1-col or 2-col option grid. Defaults to "one". */
  optionColumns?: "one" | "two";
  /** Optional custom interactive body for special exercise types like sequence ordering. */
  customBody?: (props: {
    answered: boolean;
    currentAnswer?: string;
    onAnswer: (value: string) => void;
  }) => React.ReactNode;
}

export interface QuizResult {
  correct: number;
  total: number;
}

interface Props {
  questions: readonly QuizQuestion[];
  onComplete?: (result: QuizResult) => void;
  onAnswerChange?: (result: QuizResult) => void;
  className?: string;
  /**
   * How many questions to show per page on desktop (≥1024px).
   * On mobile, always shows 1 question at a time.
   * Defaults to 1 for focused single-question flow.
   */
  desktopPageSize?: number;
  /** Optional unit identifier or topic (e.g. "office", "hotel", "bathroom") to show a context-specific Can-Do challenge */
  unitId?: string;
  /** Optional explicit Can-Do scenario */
  canDoScenario?: CanDoTransferChallenge;
  /** Optional primary action rendered on the completion screen (e.g. "Continue to Discussion") */
  renderCompletionAction?: (result: QuizResult) => React.ReactNode;
}

// ─── Pill status type ────────────────────────────────────────────────────────

type PillStatus = "unanswered" | "correct" | "incorrect" | "active" | "active-page";

// ─── Pill colours ────────────────────────────────────────────────────────────

const PILL_STYLES: Record<PillStatus, string> = {
  active:
    "border-primary bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background",
  "active-page":
    "border-primary/60 bg-secondary text-primary ring-2 ring-primary/40 ring-offset-1 ring-offset-background",
  correct:
    "border-feedback-success-border bg-feedback-success-surface text-feedback-success-foreground",
  incorrect:
    "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground",
  unanswered: "border-border bg-muted text-muted-foreground hover:bg-muted/80",
};

// ─── Single Question Card ─────────────────────────────────────────────────────

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  total: number;
  currentAnswer: string | undefined;
  onAnswer: (value: string) => void;
  engineId: string;
  t: (key: string, values?: TranslationValues) => string;
  headingRef?: RefObject<HTMLHeadingElement>;
  /** Show "Question X of Y" counter label (mobile single-view mode). */
  showCounter?: boolean;
}

function QuestionCard({
  question,
  index,
  total,
  currentAnswer,
  onAnswer,
  engineId,
  t,
  headingRef,
  showCounter = true,
}: QuestionCardProps) {
  const answered = currentAnswer !== undefined;
  const isCorrect = currentAnswer === question.correctValue;
  const questionHeadingId = `${engineId}-q${question.id}`;
  const feedbackId = `${engineId}-feedback-${question.id}`;

  return (
    <article
      className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-wp-xs hover:border-primary/30 transition-all duration-200"
      aria-labelledby={questionHeadingId}
    >
      <div
        className={`p-4 sm:p-5 ${question.media ? "grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(12rem,30%)]" : ""}`}
      >
        <div className="min-w-0">
          {/* Counter label (single-question mode) */}
          {showCounter && (
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {t("quiz.questionOf", {
                current: index + 1,
                total,
              }) || `Question ${index + 1} of ${total}`}
            </p>
          )}

          {/* Question stem */}
          <h2
            ref={headingRef}
            id={questionHeadingId}
            tabIndex={-1}
            className="text-xl font-black leading-snug text-foreground focus-visible:outline-none sm:text-2xl"
          >
            {/* Question number badge in desktop multi-question mode */}
            {!showCounter && (
              <span className="me-2.5 inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-base font-black text-primary">
                {index + 1}
              </span>
            )}
            {question.stem}
          </h2>

          {/* Optional media */}

          {/* Options or Custom Body */}
          {question.customBody ? (
            <div className="mt-6">
              {question.customBody({
                answered,
                currentAnswer,
                onAnswer,
              })}
            </div>
          ) : question.options ? (
            <ChoiceOptionGroup
              className={`mt-6 grid gap-3.5 ${
                question.optionColumns === "two" || (!question.optionColumns && showCounter)
                  ? "sm:grid-cols-2"
                  : ""
              }`}
              label={question.stem}
              options={question.options}
              value={currentAnswer}
              onChange={onAnswer}
              disabled={answered}
              correctValue={question.correctValue}
              revealFeedback={answered}
            />
          ) : null}
        </div>
        {question.media && (
          <div className="order-first min-w-0 md:order-none">{question.media}</div>
        )}
      </div>

      {/* Feedback Panel */}
      {answered && (
        <div
          id={feedbackId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={`border-t px-6 py-5 transition-all duration-200 ${
            isCorrect
              ? "border-feedback-success-border bg-feedback-success-surface"
              : "border-feedback-error-border bg-feedback-error-surface"
          }`}
        >
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <CheckCircle2
                className="size-5 shrink-0 text-feedback-success-foreground"
                aria-hidden
              />
            ) : (
              <XCircle className="size-5 shrink-0 text-feedback-error-foreground" aria-hidden />
            )}
            <p
              className={`text-base sm:text-base font-bold leading-6 ${
                isCorrect ? "text-feedback-success-foreground" : "text-feedback-error-foreground"
              }`}
            >
              <span>
                {isCorrect
                  ? t("quiz.correctFeedback") || "Correct! Excellent work."
                  : t("quiz.incorrectFeedback") || "Incorrect. Review the explanation below."}
              </span>
            </p>
          </div>

          {question.explanation && (
            <p className="mt-3 text-base leading-relaxed text-foreground">{question.explanation}</p>
          )}
        </div>
      )}
    </article>
  );
}

// ─── Media query hook ─────────────────────────────────────────────────────────

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

// ─── Can-Do Action Challenge Card ──────────────────────────────────────────

export function CanDoChallengeCard({
  challenge,
  className = "",
}: {
  challenge: CanDoTransferChallenge;
  className?: string;
}) {
  const { t } = useI18n();
  const audio = useAudio({ lang: "en-US", rate: 0.9, preferLocal: true });

  return (
    <section
      aria-labelledby="can-do-heading"
      className={`rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-7 text-start shadow-wp-xs space-y-5 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
            <Compass className="size-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              {t("wordDetails.canDoChallenge") || "Real-World Can-Do Challenge"}
            </span>
            <h3 id="can-do-heading" className="text-base font-bold text-foreground">
              {challenge.topic}
            </h3>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-black bg-primary text-primary-foreground">
          CEFR {challenge.cefr}
        </span>
      </div>

      {/* Scenario context */}
      <div className="space-y-1.5">
        <p className="text-base font-semibold text-foreground">{challenge.scenarioEn}</p>
        <p
          className="text-sm text-muted-foreground font-arabic leading-relaxed"
          dir="rtl"
          lang="ar"
        >
          {challenge.scenarioAr}
        </p>
      </div>

      {/* Action task */}
      <div className="rounded-2xl border border-border/80 bg-background/80 p-4 space-y-1.5">
        <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
          <Sparkles className="size-3.5" aria-hidden="true" />
          <span>{t("wordDetails.canDoTask") || "Your Action Task"}</span>
        </div>
        <p className="text-base font-medium text-foreground">{challenge.taskEn}</p>
        <p
          className="text-sm text-muted-foreground font-arabic leading-relaxed"
          dir="rtl"
          lang="ar"
        >
          {challenge.taskAr}
        </p>
      </div>

      {/* Model response with native audio */}
      <div className="rounded-2xl border border-primary/20 bg-secondary p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            {t("wordDetails.canDoModelResponse") || "Spoken Model Response"}
          </span>
          <button
            type="button"
            onClick={() => audio.speak(challenge.modelResponseEn)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
            aria-label={`${t("wordDetails.canDoListenModel") || "Listen to model answer"}: ${challenge.modelResponseEn}`}
          >
            <Volume2
              className={`size-4 ${audio.isPlaying ? "animate-pulse" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
        <p className="text-base sm:text-base font-semibold text-foreground italic">
          "{challenge.modelResponseEn}"
        </p>
        <p
          className="text-sm text-muted-foreground font-arabic leading-relaxed"
          dir="rtl"
          lang="ar"
        >
          {challenge.modelResponseAr}
        </p>
      </div>

      {/* Key communicative phrases */}
      {challenge.keyPhrases.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {t("wordDetails.canDoKeyPhrases") || "Key Communicative Phrases"}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {challenge.keyPhrases.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => audio.speak(phrase.en)}
                className="group flex flex-col p-2.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-secondary text-start transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={`Listen to phrase: ${phrase.en}`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {phrase.en}
                  </span>
                  <Volume2
                    className="size-3 text-muted-foreground group-hover:text-primary shrink-0"
                    aria-hidden="true"
                  />
                </div>
                <span
                  className="text-[11px] text-muted-foreground font-arabic mt-0.5"
                  dir="rtl"
                  lang="ar"
                >
                  {phrase.ar}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CurriculumQuizEngine({
  questions,
  onComplete,
  onAnswerChange,
  className = "",
  desktopPageSize = 1,
  unitId,
  canDoScenario,
  renderCompletionAction,
}: Props) {
  const { t } = useI18n();
  const isDesktop = useIsDesktop();

  // Mobile: single-question navigation index
  const [mobileIndex, setMobileIndex] = useState(0);
  // Desktop: current page (0-based)
  const [desktopPage, setDesktopPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const completionRef = useRef<HTMLHeadingElement>(null);
  const engineId = useId();

  // ── Derived state ────────────────────────────────────────────────────────

  const totalPages = Math.ceil(questions.length / desktopPageSize);
  const desktopPageStart = desktopPage * desktopPageSize;
  const desktopPageQuestions = questions.slice(
    desktopPageStart,
    desktopPageStart + desktopPageSize
  );
  const isLastDesktopPage = desktopPage === totalPages - 1;

  // Mobile derived
  const mobileQuestion = questions[mobileIndex];
  const isMobileLastQuestion = mobileIndex === questions.length - 1;
  const mobileCurrentAnswer = mobileQuestion ? answers[mobileQuestion.id] : undefined;
  const mobileAnswered = mobileCurrentAnswer !== undefined;

  // Desktop: are all questions on the current page answered?
  const desktopPageAllAnswered = desktopPageQuestions.every((q) => answers[q.id] !== undefined);

  // Focus management: move focus to question heading on navigation
  useEffect(() => {
    if (!completed) {
      headingRef.current?.focus();
    } else {
      completionRef.current?.focus();
    }
  }, [mobileIndex, desktopPage, completed]);

  const handleAnswer = (questionId: string, value: string) => {
    if (answers[questionId] !== undefined) return;
    const targetQ = questions.find((q) => q.id === questionId);
    if (targetQ) {
      if (value === targetQ.correctValue) {
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    }
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);
    if (onAnswerChange) {
      const correct = questions.reduce((acc, q) => {
        return nextAnswers[q.id] === q.correctValue ? acc + 1 : acc;
      }, 0);
      onAnswerChange({ correct, total: questions.length });
    }
  };

  const finishQuiz = (currentAnswers: Record<string, string>) => {
    const correct = questions.reduce((acc, q) => {
      return currentAnswers[q.id] === q.correctValue ? acc + 1 : acc;
    }, 0);
    setCompleted(true);
    onComplete?.({ correct, total: questions.length });
  };

  const handleMobileNext = () => {
    if (isMobileLastQuestion) {
      finishQuiz(answers);
    } else {
      setMobileIndex((i) => i + 1);
    }
  };

  const handleMobilePrev = () => {
    if (mobileIndex > 0) {
      setMobileIndex((i) => i - 1);
    }
  };

  const handleDesktopNextPage = () => {
    if (isLastDesktopPage) {
      finishQuiz(answers);
    } else {
      setDesktopPage((p) => p + 1);
    }
  };

  const handleDesktopPrevPage = () => {
    if (desktopPage > 0) {
      setDesktopPage((p) => p - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setMobileIndex(0);
    setDesktopPage(0);
    setCompleted(false);
  };

  // ── Completion Screen ─────────────────────────────────────────────────────

  if (completed) {
    const correct = questions.reduce(
      (acc, q) => (answers[q.id] === q.correctValue ? acc + 1 : acc),
      0
    );
    const total = questions.length;
    const pct = Math.round((correct / total) * 100);
    const activeChallenge = canDoScenario ?? (unitId ? getCanDoScenarioForUnit(unitId) : undefined);

    return (
      <div
        className={`max-w-3xl mx-auto w-full space-y-6 ${className}`}
        role="region"
        aria-label={t("quiz.completedTitle") || "Quiz Completed"}
      >
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-border/80 bg-card p-8 sm:p-10 text-center shadow-wp-xs">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-feedback-success-surface border border-feedback-success-border shadow-wp-xs">
            <Trophy className="size-10 text-feedback-success-foreground" aria-hidden />
          </div>
          <div>
            <h2
              ref={completionRef}
              tabIndex={-1}
              className="text-2xl sm:text-3xl font-black text-foreground focus-visible:outline-none"
            >
              {t("quiz.completedTitle") || "Quiz Completed!"}
            </h2>
            <p className="mt-1 text-base sm:text-base text-muted-foreground">
              {t("quiz.completedSubtitle") || "Great job completing this practice exercise."}
            </p>
          </div>

          {/* Score */}
          <div
            aria-label={`${t("quiz.score") || "Score"}: ${correct} out of ${total}`}
            className="flex flex-col items-center gap-1 my-1"
          >
            <span className="text-5xl sm:text-6xl font-black text-primary">{pct}%</span>
            <span className="text-base font-semibold text-muted-foreground">
              {t("quiz.scoreSummary", { correct, total })}
            </span>
          </div>

          {/* Per-question result pills */}
          <div className="flex flex-wrap justify-center gap-2" aria-label="Results summary">
            {questions.map((q, i) => {
              const ans = answers[q.id];
              const ok = ans === q.correctValue;
              return (
                <span
                  key={q.id}
                  className={`inline-flex size-9 items-center justify-center rounded-xl border-2 text-base font-black transition-colors ${
                    ok
                      ? "border-feedback-success-border bg-feedback-success-surface text-feedback-success-foreground"
                      : "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground"
                  }`}
                  aria-label={`Question ${i + 1}: ${ok ? "correct" : "incorrect"}`}
                >
                  {ok ? (
                    <CheckCircle2 className="size-4" aria-hidden />
                  ) : (
                    <XCircle className="size-4" aria-hidden />
                  )}
                </span>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-base font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <RotateCcw className="size-4" aria-hidden />
              <span>{t("quiz.restart") || "Restart Quiz"}</span>
            </button>
          </div>
        </div>

        {/* Can-Do Action Challenge */}
        {activeChallenge && <CanDoChallengeCard challenge={activeChallenge} />}

        {/* Optional Action passed by parent stage */}
        {renderCompletionAction && renderCompletionAction({ correct, total })}
      </div>
    );
  }

  // ── Progress Pills (shared between mobile and desktop layouts) ────────────

  const progressPills = (
    <ol
      aria-label={t("courseLesson.questionNavigation")}
      className="flex gap-2 overflow-x-auto p-1"
    >
      {questions.map((q, i) => {
        const isAnswered = answers[q.id] !== undefined;
        const isCorrectAnswer = isAnswered && answers[q.id] === q.correctValue;
        const isMobileActive = i === mobileIndex;
        const pageStart = desktopPage * desktopPageSize;
        const pageEnd = pageStart + desktopPageSize;
        const isDesktopActiveSingle = desktopPageSize === 1 && i === desktopPage;
        const isDesktopActivePage = desktopPageSize > 1 && i >= pageStart && i < pageEnd;

        const status: PillStatus = isAnswered
          ? isCorrectAnswer
            ? "correct"
            : "incorrect"
          : isMobileActive || isDesktopActiveSingle
            ? "active"
            : isDesktopActivePage
              ? "active-page"
              : "unanswered";

        return (
          <li key={q.id}>
            <button
              type="button"
              onClick={() => {
                const page = Math.floor(i / desktopPageSize);
                setDesktopPage(page);
                setMobileIndex(i);
              }}
              aria-label={t("quiz.questionPillLabel", { number: i + 1 }) || `Question ${i + 1}`}
              aria-current={isMobileActive || isDesktopActiveSingle ? "step" : undefined}
              className={`flex shrink-0 size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border-2 text-base font-black transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${PILL_STYLES[status]}`}
            >
              {status === "correct" ? (
                <CheckCircle2 className="size-4" aria-hidden />
              ) : status === "incorrect" ? (
                <XCircle className="size-4" aria-hidden />
              ) : (
                i + 1
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );

  // ── Mobile Layout (single question at a time) ─────────────────────────────

  const mobileLayout = (
    <div className={`flex flex-col gap-3 wp-container-content mx-auto w-full ${className}`}>
      <div className="wp-quiz-progress sticky top-[var(--wp-course-nav-height,4.5rem)] z-30 rounded-xl border border-border bg-background p-1">
        {progressPills}
      </div>

      {mobileQuestion && (
        <QuestionCard
          question={mobileQuestion}
          index={mobileIndex}
          total={questions.length}
          currentAnswer={mobileCurrentAnswer}
          onAnswer={(value) => handleAnswer(mobileQuestion.id, value)}
          engineId={engineId}
          t={t}
          headingRef={headingRef}
          showCounter
        />
      )}

      {/* Mobile Navigation */}
      <div className="flex items-center justify-between">
        {mobileIndex > 0 ? (
          <button
            type="button"
            onClick={handleMobilePrev}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-base font-bold text-foreground transition-all hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            <span>{t("quiz.previousQuestion") || "Previous Question"}</span>
          </button>
        ) : (
          <div />
        )}

        {mobileAnswered && (
          <button
            type="button"
            onClick={handleMobileNext}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-wp-sm transition-all hover:bg-primary motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>
              {isMobileLastQuestion
                ? t("quiz.viewResults") || "View Results"
                : t("quiz.nextQuestion") || "Next Question"}
            </span>
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );

  // ── Desktop Layout (desktopPageSize questions per page) ──────────────────

  const desktopLayout = (
    <div className={`flex flex-col gap-3 wp-container-content mx-auto w-full ${className}`}>
      {/* Progress pills + page indicator */}
      <div className="wp-quiz-progress sticky top-[var(--wp-course-nav-height,4.5rem)] z-30 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background p-1">
        {progressPills}
        <span className="shrink-0 text-sm font-bold text-muted-foreground">
          {desktopPageSize === 1
            ? t("quiz.questionOf", { current: desktopPage + 1, total: questions.length }) ||
              `Question ${desktopPage + 1} of ${questions.length}`
            : t("quiz.pageOf", { current: desktopPage + 1, total: totalPages }) ||
              `Page ${desktopPage + 1} of ${totalPages}`}
        </span>
      </div>

      {/* Multi-question grid */}
      <div
        className={`grid gap-4 ${
          desktopPageQuestions.length === 1
            ? "grid-cols-1 w-full"
            : desktopPageQuestions.length === 2
              ? "grid-cols-2"
              : "grid-cols-3"
        }`}
        aria-label={`Questions ${desktopPageStart + 1}–${Math.min(
          desktopPageStart + desktopPageSize,
          questions.length
        )} of ${questions.length}`}
      >
        {desktopPageQuestions.map((q, pageIdx) => {
          const globalIndex = desktopPageStart + pageIdx;
          return (
            <QuestionCard
              key={q.id}
              question={q}
              index={globalIndex}
              total={questions.length}
              currentAnswer={answers[q.id]}
              onAnswer={(value) => handleAnswer(q.id, value)}
              engineId={engineId}
              t={t}
              headingRef={pageIdx === 0 ? headingRef : undefined}
              showCounter={desktopPageSize === 1}
            />
          );
        })}
      </div>

      {/* Desktop Navigation */}
      <div className="flex items-center justify-between">
        {desktopPage > 0 ? (
          <button
            type="button"
            onClick={handleDesktopPrevPage}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-base font-bold text-foreground transition-all hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            <span>
              {desktopPageSize === 1
                ? t("quiz.previousQuestion") || "Previous Question"
                : t("quiz.previousPage") || "Previous"}
            </span>
          </button>
        ) : (
          <div />
        )}

        {desktopPageAllAnswered && (
          <button
            type="button"
            onClick={handleDesktopNextPage}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-wp-sm transition-all hover:bg-primary motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>
              {isLastDesktopPage
                ? t("quiz.viewResults") || "View Results"
                : desktopPageSize === 1
                  ? t("quiz.nextQuestion") || "Next Question"
                  : t("quiz.nextPage") || "Next Questions"}
            </span>
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );

  return isDesktop ? desktopLayout : mobileLayout;
}
