import { useState, useMemo, useEffect, useCallback } from "react";
import type { UnitLearningMaterials, BlankExercise, MultipleChoiceExercise } from "../types";
import { loadedUnitVocabulary } from "../../data/vocabulary";
import type { VocabularyItem } from "../../data/lessons";
import { BLANK_TOKEN } from "../types";
import {
  CheckCircle2,
  XCircle,
  Check,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Award,
  Sparkles,
} from "lucide-react";
import { recordWordPractice } from "./progress";
import type { UnitStudyProgress } from "./types";

interface Props {
  materials: UnitLearningMaterials;
  progress: UnitStudyProgress;
  onProgressUpdate: (p: UnitStudyProgress) => void;
  nodeId: string;
  onNextActivity: () => void;
}

type PracticeItem =
  | {
      id: string;
      type: "blank";
      data: BlankExercise;
      answerText: string;
      options: string[];
      correctIndex: number;
    }
  | {
      id: string;
      type: "multipleChoice";
      data: MultipleChoiceExercise;
      answerText: string;
    };

function stableShuffle<T>(array: T[], seed: number): T[] {
  const copy = [...array];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    const j = Math.floor(rnd * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const ROUND_SIZE = 8;
function MultipleChoiceQuiz({
  question,
  options,
  correctIndex,
  onComplete,
}: {
  question: React.ReactNode;
  options: string[];
  correctIndex: number;
  onComplete: (correct: boolean, isFirstTry: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [gaveUp, setGaveUp] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const answered = picked !== null || gaveUp;

  const handlePick = useCallback(
    (i: number) => {
      if (answered) return;
      setPicked(i);
      const correct = i === correctIndex;
      onComplete(correct, attempts === 0);
      setAttempts((a) => a + 1);
    },
    [answered, correctIndex, onComplete, attempts]
  );

  const handleDontKnow = () => {
    if (answered) return;
    setGaveUp(true);
    setPicked(null);
    onComplete(false, false);
    setAttempts((a) => a + 1);
  };

  // Keyboard shortcut listener (1-4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (answered) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= options.length) {
        handlePick(num - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answered, options.length, handlePick]);

  return (
    <div className="rounded-3xl border border-border p-6 sm:p-7 bg-card shadow-xs h-full flex flex-col justify-center animate-in fade-in duration-200">
      <div className="mb-6 font-extrabold text-lg sm:text-xl text-foreground leading-relaxed">
        {question}
      </div>
      <div className="grid gap-3">
        {options.map((opt, i) => {
          const isCorrect = i === correctIndex;
          const isPicked = picked === i;
          const showAnswer = isCorrect && (isPicked || gaveUp);
          const showWrong = isPicked && !isCorrect;

          const state = !answered ? "idle" : showAnswer ? "correct" : showWrong ? "wrong" : "idle";

          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => handlePick(i)}
              className={`w-full text-start p-4 rounded-2xl border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm sm:text-base min-h-[56px] ${
                state === "correct"
                  ? "border-wp-green bg-wp-green-light/10 text-wp-green font-bold shadow-xs"
                  : state === "wrong"
                    ? "border-destructive bg-destructive/5 text-destructive font-bold"
                    : "border-border hover:border-primary/50 hover:bg-secondary/40 font-medium active:scale-[0.99]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`size-6 rounded-full border flex items-center justify-center shrink-0 transition-colors text-xs font-bold ${
                    state === "correct"
                      ? "border-wp-green bg-wp-green text-white"
                      : state === "wrong"
                        ? "border-destructive bg-destructive text-white"
                        : "border-border text-muted-foreground bg-secondary/50"
                  }`}
                >
                  {state === "correct" ? (
                    <Check className="size-3.5" strokeWidth={3} />
                  ) : state === "wrong" ? (
                    <XCircle className="size-3.5" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="flex-1">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Screen reader status & action button */}
      {answered ? (
        <div role="status" aria-live="polite" className="mt-4">
          {picked === correctIndex ? (
            <p className="text-sm font-bold text-wp-green flex items-center gap-2 bg-wp-green-light/20 p-3 rounded-xl border border-wp-green/30">
              <CheckCircle2 className="size-5 shrink-0" aria-hidden /> Excellent! That is correct.
            </p>
          ) : (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive text-destructive font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <XCircle className="size-5 shrink-0" />
                <span>Correct answer: {options[correctIndex]}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPicked(null);
                  setGaveUp(false);
                }}
                className="px-3.5 py-1.5 border border-current rounded-xl text-xs hover:opacity-80 transition-opacity min-h-[44px] self-start sm:self-auto font-bold"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleDontKnow}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
          >
            <HelpCircle className="size-4" aria-hidden />
            <span>I don&apos;t know</span>
          </button>
        </div>
      )}
    </div>
  );
}

function RoundCheckpointCard({
  roundNumber,
  totalRounds,
  roundCorrect,
  roundTotal,
  onContinueNextRound,
  onFinishPractice,
  isFinalRound,
}: {
  roundNumber: number;
  totalRounds: number;
  roundCorrect: number;
  roundTotal: number;
  onContinueNextRound: () => void;
  onFinishPractice: () => void;
  isFinalRound: boolean;
}) {
  const percent = Math.round((roundCorrect / roundTotal) * 100);
  return (
    <div className="rounded-3xl border border-border p-6 sm:p-8 bg-card shadow-xs text-center animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center max-w-lg mx-auto w-full">
      <div className="size-16 rounded-2xl bg-wp-green-light/20 text-wp-green flex items-center justify-center mb-4 border border-wp-green/30 shadow-xs">
        <Sparkles className="size-8" aria-hidden />
      </div>
      <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
        Round {roundNumber} of {totalRounds} Complete
      </div>
      <h2 className="text-2xl font-extrabold text-foreground mb-2">
        {percent >= 80 ? "Round Mastered!" : "Round Checkpoint"}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        You answered{" "}
        <span className="font-bold text-foreground">
          {roundCorrect} of {roundTotal}
        </span>{" "}
        questions correctly in this round ({percent}%).
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        {!isFinalRound ? (
          <>
            <button
              type="button"
              onClick={onFinishPractice}
              className="px-5 py-3 border border-border text-foreground rounded-2xl font-bold text-sm hover:bg-secondary transition-colors min-h-[48px]"
            >
              Finish for Now
            </button>
            <button
              type="button"
              onClick={onContinueNextRound}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>Start Round {roundNumber + 1}</span>
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onFinishPractice}
            className="px-7 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>View Full Summary</span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

export function PracticeArea({
  materials,
  progress,
  onProgressUpdate,
  nodeId,
  onNextActivity,
}: Props) {
  const vocab = useMemo(() => loadedUnitVocabulary(materials.unitId), [materials.unitId]);
  const [attemptCount, setAttemptCount] = useState(0);

  // Deterministic items pool derived from materials
  const items = useMemo(() => {
    const list: PracticeItem[] = [];
    let idCounter = 0;

    materials.blankExercises?.forEach((e) => {
      const distractors = vocab
        .map((v: VocabularyItem) => v.label)
        .filter((l: string) => l.toLowerCase() !== e.answer.toLowerCase())
        .slice(0, 3);
      const options = [e.answer, ...distractors].sort();
      const correctIndex = options.indexOf(e.answer);
      list.push({
        id: `practice-b-${idCounter++}`,
        type: "blank",
        data: e,
        answerText: e.answer,
        options,
        correctIndex,
      });
    });

    materials.additionalExercises?.multipleChoice?.forEach((e) =>
      list.push({
        id: `practice-mc-${idCounter++}`,
        type: "multipleChoice",
        data: e,
        answerText: e.options[e.correctIndex],
      })
    );

    materials.collocationsQuiz?.forEach((e) =>
      list.push({
        id: `practice-col-${idCounter++}`,
        type: "multipleChoice",
        data: e,
        answerText: e.options[e.correctIndex],
      })
    );

    // Convert rewrite exercises to multiple choice
    const allRewrites = materials.additionalExercises?.rewrite ?? [];
    allRewrites.forEach((e, idx) => {
      const correct = e.answer;
      // Build distractors from other rewrite answers, then fill with the original sentence
      const otherAnswers = allRewrites.filter((_, i) => i !== idx).map((r) => r.answer);
      const distractors = [e.sentence.replace(/\s*\([A-Z]+\)\s*$/, ""), ...otherAnswers]
        .filter((d) => d !== correct)
        .slice(0, 3);
      // Pad distractors if needed
      while (distractors.length < 3) {
        distractors.push(`${correct.split(" ").reverse().join(" ")}`);
      }
      const options = stableShuffle([correct, ...distractors.slice(0, 3)], idx * 71 + 13);
      const correctIndex = options.indexOf(correct);
      list.push({
        id: `practice-rw-${idCounter++}`,
        type: "multipleChoice",
        data: {
          id: e.id,
          question: `Rewrite using "${e.hintWord}": "${e.sentence.replace(/\s*\([A-Z]+\)\s*$/, "")}"`,
          options,
          correctIndex,
          explanation: `The correct rewrite is: "${correct}"`,
        },
        answerText: correct,
      });
    });

    // Convert error correction exercises to multiple choice
    const allErrors = materials.errorCorrection ?? [];
    allErrors.forEach((e, idx) => {
      const correct = e.right;
      // Use the wrong version and other correct answers as distractors
      const otherCorrect = allErrors.filter((_, i) => i !== idx).map((ec) => ec.right);
      const distractors = [e.wrong, ...otherCorrect].filter((d) => d !== correct).slice(0, 3);
      while (distractors.length < 3) {
        distractors.push(e.wrong);
      }
      const options = stableShuffle([correct, ...distractors.slice(0, 3)], idx * 53 + 7);
      const correctIndex = options.indexOf(correct);
      list.push({
        id: `practice-ec-${idCounter++}`,
        type: "multipleChoice",
        data: {
          id: e.id,
          question: `Which sentence is correct?`,
          options,
          correctIndex,
          explanation: `The mistake was: "${e.wrong}"`,
        },
        answerText: correct,
      });
    });

    // Writing prompts are excluded — they're open-ended and not quizzable

    return stableShuffle(list, 42 + attemptCount * 7919);
  }, [materials, vocab, attemptCount]);

  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.min(progress.nodePositions?.[nodeId] ?? 0, Math.max(items.length - 1, 0))
  );
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
  const [isCurrentAnswered, setIsCurrentAnswered] = useState(false);
  const [reviewAddedWords, setReviewAddedWords] = useState<string[]>([]);
  const [showingCheckpoint, setShowingCheckpoint] = useState(false);
  const [finished, setFinished] = useState(false);

  // Round tracking (e.g. 8 questions per round)
  const totalRounds = Math.max(1, Math.ceil(items.length / ROUND_SIZE));
  const currentRound = Math.min(totalRounds, Math.floor(currentIndex / ROUND_SIZE) + 1);
  const indexInRound = (currentIndex % ROUND_SIZE) + 1;
  const currentRoundTotal = Math.min(ROUND_SIZE, items.length - (currentRound - 1) * ROUND_SIZE);

  const [roundCorrectCounts, setRoundCorrectCounts] = useState<Record<number, number>>({});

  const handleComplete = (
    _itemId: string,
    word: string,
    isCorrect: boolean,
    isFirstTry: boolean
  ) => {
    if (word) {
      const matchedVocab = vocab.find(
        (v: VocabularyItem) => v.label.toLowerCase() === word.trim().toLowerCase()
      );
      if (matchedVocab) {
        onProgressUpdate(recordWordPractice(progress, matchedVocab.id, isCorrect));
        if (!isCorrect && !reviewAddedWords.includes(matchedVocab.label)) {
          setReviewAddedWords((prev) => [...prev, matchedVocab.label]);
        }
      }
    }

    if (isCorrect && isFirstTry) {
      setFirstTryCorrectCount((c) => c + 1);
      setRoundCorrectCounts((prev) => ({
        ...prev,
        [currentRound]: (prev[currentRound] ?? 0) + 1,
      }));
    }

    setIsCurrentAnswered(true);
  };

  const handleFinishPractice = () => {
    onProgressUpdate({
      ...progress,
      completedNodeIds: progress.completedNodeIds.includes(nodeId)
        ? progress.completedNodeIds
        : [...progress.completedNodeIds, nodeId],
      nodePositions: { ...progress.nodePositions, [nodeId]: 0 },
    });
    setShowingCheckpoint(false);
    setFinished(true);
  };

  const handleNext = () => {
    const isEndOfRound = (currentIndex + 1) % ROUND_SIZE === 0;
    const isLastItem = currentIndex >= items.length - 1;

    if (isEndOfRound && !isLastItem) {
      setShowingCheckpoint(true);
      return;
    }

    if (!isLastItem) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      onProgressUpdate({
        ...progress,
        nodePositions: { ...progress.nodePositions, [nodeId]: nextIndex },
      });
      setIsCurrentAnswered(false);
    } else {
      handleFinishPractice();
    }
  };

  const handleContinueNextRound = () => {
    setShowingCheckpoint(false);
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    onProgressUpdate({
      ...progress,
      nodePositions: { ...progress.nodePositions, [nodeId]: nextIndex },
    });
    setIsCurrentAnswered(false);
  };

  const handleRestart = () => {
    setAttemptCount((c) => c + 1);
    setCurrentIndex(0);
    setFirstTryCorrectCount(0);
    setRoundCorrectCounts({});
    setIsCurrentAnswered(false);
    setReviewAddedWords([]);
    setShowingCheckpoint(false);
    setFinished(false);
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground flex-1 flex items-center justify-center">
        No practice exercises available.
      </div>
    );
  }

  if (finished) {
    const answeredCount = Math.max(1, currentIndex + (isCurrentAnswered ? 1 : 0));
    const scorePercent = Math.round((firstTryCorrectCount / answeredCount) * 100);
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-2xl mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="size-20 rounded-3xl bg-wp-green-light/20 text-wp-green flex items-center justify-center mb-6 shadow-xs border border-wp-green/30">
          <Award className="size-10" aria-hidden />
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-foreground">Practice Session Complete!</h1>
        <p className="text-muted-foreground text-base mb-6">
          You scored{" "}
          <span className="font-bold text-foreground">
            {firstTryCorrectCount} / {answeredCount}
          </span>{" "}
          ({scorePercent}%) on your first try.
        </p>

        {reviewAddedWords.length > 0 && (
          <div className="w-full bg-secondary/30 border border-border rounded-3xl p-5 mb-8 text-start">
            <h2 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
              <RotateCcw className="size-4 text-wp-amber" />
              Words queued for Review ({reviewAddedWords.length}):
            </h2>
            <div className="flex flex-wrap gap-2">
              {reviewAddedWords.map((w) => (
                <span
                  key={w}
                  className="px-3 py-1 bg-background border border-border rounded-full text-xs font-bold text-foreground"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
          <button
            onClick={handleRestart}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border text-foreground font-bold rounded-2xl hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs min-h-[48px]"
          >
            <RotateCcw className="size-4" aria-hidden />
            <span>Practice Again</span>
          </button>
          <button
            onClick={onNextActivity}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[48px] shadow-xs"
          >
            <span>
              {reviewAddedWords.length > 0 ? "Continue to Review" : "Continue to next activity"}
            </span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  if (showingCheckpoint) {
    return (
      <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <h1 className="sr-only">Round Checkpoint</h1>
        <RoundCheckpointCard
          roundNumber={currentRound}
          totalRounds={totalRounds}
          roundCorrect={roundCorrectCounts[currentRound] ?? 0}
          roundTotal={ROUND_SIZE}
          onContinueNextRound={handleContinueNextRound}
          onFinishPractice={handleFinishPractice}
          isFinalRound={currentRound >= totalRounds}
        />
      </div>
    );
  }

  const progressPercent = Math.round(
    ((currentIndex + (isCurrentAnswered ? 1 : 0)) / items.length) * 100
  );
  const item = items[currentIndex];

  const renderQuestion = () => {
    if (item.type === "blank") {
      const parts = item.data.sentence.split(BLANK_TOKEN);
      const questionNode = (
        <span>
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <span className="inline-block w-16 border-b-2 border-primary mx-1 translate-y-[2px]" />
              )}
            </span>
          ))}
        </span>
      );
      return (
        <MultipleChoiceQuiz
          key={item.id}
          question={questionNode}
          options={item.options}
          correctIndex={item.correctIndex}
          onComplete={(correct, isFirstTry) =>
            handleComplete(item.id, item.answerText, correct, isFirstTry)
          }
        />
      );
    }

    if (item.type === "multipleChoice") {
      return (
        <MultipleChoiceQuiz
          key={item.id}
          question={item.data.question}
          options={item.data.options}
          correctIndex={item.data.correctIndex}
          onComplete={(correct, isFirstTry) =>
            handleComplete(item.id, item.answerText, correct, isFirstTry)
          }
        />
      );
    }

    return null;
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 md:p-8 flex flex-col items-center">
      {/* Header & Progress */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-baseline gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-extrabold text-xs">
                Round {currentRound} of {totalRounds}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Question {indexInRound} of {currentRoundTotal}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground truncate mt-1">
              Practice Session
            </h1>
          </div>
          <span className="text-xs font-bold text-muted-foreground bg-secondary/80 px-3 py-1.5 rounded-full shrink-0">
            {currentIndex + 1} of {items.length}
          </span>
        </div>

        {/* Accessible Progress Bar */}
        <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Practice progress: ${currentIndex + 1} of ${items.length}`}
          />
        </div>
      </div>

      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        Round {currentRound} of {totalRounds}, Exercise {indexInRound} of {currentRoundTotal}
      </div>

      {/* Exercise Container */}
      <div className="w-full" key={item.id}>
        {renderQuestion()}
      </div>

      {/* Flow Action Bar - No fixed overlay */}
      {isCurrentAnswered && (
        <div className="w-full mt-6 flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:bg-primary/90 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs min-h-[48px]"
          >
            <span>
              {(currentIndex + 1) % ROUND_SIZE === 0 && currentIndex < items.length - 1
                ? "Round Checkpoint"
                : currentIndex < items.length - 1
                  ? "Next Exercise"
                  : "Finish Practice"}
            </span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
