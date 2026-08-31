import { useState, useMemo } from "react";
import type {
  UnitLearningMaterials,
  BlankExercise,
  MultipleChoiceExercise,
  RewriteExercise,
  ErrorCorrectionExercise,
} from "../types";
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
} from "lucide-react";
import { recordWordPractice } from "./progress";
import type { UnitStudyProgress } from "./types";

interface Props {
  materials: UnitLearningMaterials;
  progress: UnitStudyProgress;
  onProgressUpdate: (p: UnitStudyProgress) => void;
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
  | { id: string; type: "multipleChoice"; data: MultipleChoiceExercise; answerText: string }
  | { id: string; type: "rewrite"; data: RewriteExercise; answerText: string }
  | { id: string; type: "errorCorrection"; data: ErrorCorrectionExercise; answerText: string };

interface Token {
  id: string;
  text: string;
}

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

function SentenceBuilder({
  sentence,
  hint,
  onComplete,
}: {
  sentence: string;
  hint: React.ReactNode;
  onComplete: (correct: boolean, isFirstTry: boolean) => void;
}) {
  const targetWords = useMemo(() => sentence.trim().split(/\s+/), [sentence]);

  const initialTokens: Token[] = useMemo(() => {
    const raw = targetWords.map((word, idx) => ({ id: `token-${idx}-${word}`, text: word }));
    let shuffled = stableShuffle(raw, sentence.length * 31 + targetWords.length);
    // Ensure it doesn't accidentally start in the exact correct order if length > 1
    if (shuffled.length > 1 && shuffled.map((t) => t.text).join(" ") === sentence) {
      shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
    }
    return shuffled;
  }, [targetWords, sentence]);

  const [available, setAvailable] = useState<Token[]>(initialTokens);
  const [selected, setSelected] = useState<Token[]>([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSelect = (token: Token) => {
    setAvailable((prev) => prev.filter((t) => t.id !== token.id));
    setSelected((prev) => [...prev, token]);
  };

  const handleDeselect = (token: Token) => {
    setSelected((prev) => prev.filter((t) => t.id !== token.id));
    setAvailable((prev) => [...prev, token]);
  };

  const checkAnswer = () => {
    const answer = selected.map((t) => t.text).join(" ");
    const correct = answer === sentence;
    setIsCorrect(correct);
    setHasAnswered(true);
    setAttempts((a) => a + 1);
    onComplete(correct, attempts === 0);
  };

  const handleDontKnow = () => {
    setSelected(targetWords.map((word, idx) => ({ id: `sol-${idx}`, text: word })));
    setAvailable([]);
    setIsCorrect(false);
    setHasAnswered(true);
    setAttempts((a) => a + 1);
    onComplete(false, false);
  };

  const reset = () => {
    setAvailable(stableShuffle(initialTokens, attempts + 1));
    setSelected([]);
    setHasAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="rounded-2xl border border-border p-6 bg-card shadow-sm h-full flex flex-col justify-center">
      <div className="mb-6">{hint}</div>

      {/* Screen reader instruction */}
      <p className="sr-only">
        Select word tokens in order to build the sentence. Press a selected word to remove it.
      </p>

      {/* Answer Slot */}
      <div
        className="min-h-[64px] flex flex-wrap gap-2 p-4 border-2 border-dashed border-border mb-6 bg-secondary/20 rounded-xl items-center"
        aria-label="Your assembled sentence"
      >
        {selected.length === 0 ? (
          <span className="text-sm text-muted-foreground italic select-none">
            Tap words below to build the sentence…
          </span>
        ) : (
          selected.map((token) => (
            <button
              key={token.id}
              type="button"
              onClick={() => !hasAnswered && handleDeselect(token)}
              disabled={hasAnswered}
              className="px-4 py-2 bg-background border border-primary/40 rounded-xl shadow-sm font-bold text-sm text-primary hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all active:scale-95 min-h-[44px]"
            >
              {token.text}
            </button>
          ))
        )}
      </div>

      {/* Word Bank */}
      <div className="flex flex-wrap gap-2 mb-8" aria-label="Available word bank">
        {available.map((token) => (
          <button
            key={token.id}
            type="button"
            onClick={() => !hasAnswered && handleSelect(token)}
            disabled={hasAnswered}
            className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-xl font-bold text-sm hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all active:scale-95 min-h-[44px]"
          >
            {token.text}
          </button>
        ))}
      </div>

      {/* Feedback Announcement & Controls */}
      {hasAnswered ? (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-xl flex flex-col sm:flex-row items-center sm:justify-between gap-4 border ${
            isCorrect
              ? "bg-wp-green-light/20 text-wp-green border-wp-green"
              : "bg-destructive/10 text-destructive border-destructive"
          }`}
        >
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 shrink-0" />
            )}
            <span className="font-bold text-base">
              {isCorrect ? "Correct sentence!" : `Correct answer: "${sentence}"`}
            </span>
          </div>
          {!isCorrect && (
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 bg-background border border-current rounded-xl font-bold text-sm hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 min-h-[44px]"
            >
              Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleDontKnow}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-border text-muted-foreground hover:text-foreground rounded-xl font-bold text-sm hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
          >
            <HelpCircle className="size-4" aria-hidden />I don&apos;t know
          </button>
          <button
            type="button"
            onClick={checkAnswer}
            disabled={selected.length === 0}
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-base disabled:opacity-50 transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm min-h-[44px]"
          >
            Check Answer
          </button>
        </div>
      )}
    </div>
  );
}

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

  const handlePick = (i: number) => {
    setPicked(i);
    const correct = i === correctIndex;
    onComplete(correct, attempts === 0);
    setAttempts((a) => a + 1);
  };

  const handleDontKnow = () => {
    setGaveUp(true);
    setPicked(null);
    onComplete(false, false);
    setAttempts((a) => a + 1);
  };

  return (
    <div className="rounded-2xl border border-border p-6 bg-card shadow-sm h-full flex flex-col justify-center">
      <div className="mb-6 font-bold text-xl text-foreground leading-relaxed">{question}</div>
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
              className={`w-full text-start p-4 rounded-xl border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-base min-h-[52px] ${
                state === "correct"
                  ? "border-wp-green bg-wp-green-light/10 text-wp-green font-bold shadow-sm"
                  : state === "wrong"
                    ? "border-destructive bg-destructive/5 text-destructive font-bold"
                    : "border-border hover:border-primary/50 hover:bg-secondary/40 font-medium active:scale-[0.99]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`size-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    state === "correct"
                      ? "border-wp-green bg-wp-green text-white"
                      : state === "wrong"
                        ? "border-destructive bg-destructive text-white"
                        : "border-border"
                  }`}
                >
                  {state === "correct" && <Check className="size-3.5" strokeWidth={3} />}
                  {state === "wrong" && <XCircle className="size-3.5" />}
                </div>
                <span>{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Screen reader status & action button */}
      {answered ? (
        <div role="status" aria-live="polite" className="mt-4">
          {picked === correctIndex ? (
            <p className="text-sm font-bold text-wp-green flex items-center gap-1.5">
              <CheckCircle2 className="size-4" aria-hidden /> Excellent! That is correct.
            </p>
          ) : (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive text-destructive font-bold flex items-center justify-between gap-3 text-sm">
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
                className="px-3 py-1.5 border border-current rounded-lg text-xs hover:opacity-80 transition-opacity min-h-[36px]"
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
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
          >
            <HelpCircle className="size-3.5" aria-hidden />I don&apos;t know
          </button>
        </div>
      )}
    </div>
  );
}

export function PracticeArea({ materials, progress, onProgressUpdate }: Props) {
  const vocab = useMemo(() => loadedUnitVocabulary(materials.unitId), [materials.unitId]);

  // Deterministic seed derived from unit ID
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

    materials.additionalExercises?.rewrite?.forEach((e) =>
      list.push({
        id: `practice-rw-${idCounter++}`,
        type: "rewrite",
        data: e,
        answerText: e.answer,
      })
    );

    materials.errorCorrection?.forEach((e) =>
      list.push({
        id: `practice-ec-${idCounter++}`,
        type: "errorCorrection",
        data: e,
        answerText: e.right,
      })
    );

    return stableShuffle(list, 42);
  }, [materials, vocab]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
  const [isCurrentAnswered, setIsCurrentAnswered] = useState(false);
  const [reviewAddedWords, setReviewAddedWords] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const handleComplete = (
    _itemId: string,
    word: string,
    isCorrect: boolean,
    isFirstTry: boolean
  ) => {
    const matchedVocab = vocab.find(
      (v: VocabularyItem) => v.label.toLowerCase() === word.trim().toLowerCase()
    );
    if (matchedVocab) {
      onProgressUpdate(recordWordPractice(progress, matchedVocab.id, isCorrect));
      if (!isCorrect && !reviewAddedWords.includes(matchedVocab.label)) {
        setReviewAddedWords((prev) => [...prev, matchedVocab.label]);
      }
    }

    if (isCorrect && isFirstTry) {
      setFirstTryCorrectCount((c) => c + 1);
    }

    setIsCurrentAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsCurrentAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setFirstTryCorrectCount(0);
    setIsCurrentAnswered(false);
    setReviewAddedWords([]);
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
    const scorePercent = Math.round((firstTryCorrectCount / items.length) * 100);
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-2xl mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="size-20 rounded-full bg-wp-green-light/20 text-wp-green flex items-center justify-center mb-6 shadow-sm">
          <Award className="size-10" aria-hidden />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-foreground">Practice Session Complete!</h2>
        <p className="text-muted-foreground text-base mb-6">
          You scored{" "}
          <span className="font-bold text-foreground">
            {firstTryCorrectCount} / {items.length}
          </span>{" "}
          ({scorePercent}%) on your first try.
        </p>

        {reviewAddedWords.length > 0 && (
          <div className="w-full bg-secondary/30 border border-border rounded-2xl p-5 mb-8 text-start">
            <h3 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
              <RotateCcw className="size-4 text-wp-amber" />
              Words sent to your Review queue ({reviewAddedWords.length}):
            </h3>
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

        <div className="flex gap-4">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm min-h-[44px]"
          >
            <RotateCcw className="size-4" aria-hidden />
            Practice Again
          </button>
        </div>
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

    if (item.type === "rewrite") {
      const hint = (
        <div className="flex flex-col gap-2">
          <span className="text-primary font-bold text-xs uppercase tracking-wider">
            Rewrite the sentence
          </span>
          <p className="text-muted-foreground text-sm">
            Include the word{" "}
            <span className="font-bold text-foreground">"{item.data.hintWord}"</span> in your
            answer.
          </p>
          <p className="font-medium text-base mt-2 text-foreground border-s-4 border-primary/30 ps-3">
            {item.data.sentence}
          </p>
        </div>
      );
      return (
        <SentenceBuilder
          key={item.id}
          sentence={item.answerText}
          hint={hint}
          onComplete={(correct, isFirstTry) =>
            handleComplete(item.id, item.data.hintWord, correct, isFirstTry)
          }
        />
      );
    }

    if (item.type === "errorCorrection") {
      const hint = (
        <div className="flex flex-col gap-2">
          <span className="text-primary font-bold text-xs uppercase tracking-wider">
            Correct the mistake
          </span>
          <p className="font-medium text-base mt-2 text-destructive border-s-4 border-destructive/30 ps-3 line-through decoration-2">
            {item.data.wrong}
          </p>
        </div>
      );
      return (
        <SentenceBuilder
          key={item.id}
          sentence={item.answerText}
          hint={hint}
          onComplete={(correct, isFirstTry) =>
            handleComplete(item.id, item.answerText, correct, isFirstTry)
          }
        />
      );
    }

    return null;
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-4 md:p-8 flex flex-col items-center">
      {/* Header & Progress */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Practice Session</h2>
            <p className="text-sm text-muted-foreground">
              Test your recall across different question types
            </p>
          </div>
          <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            {currentIndex + 1} of {items.length}
          </span>
        </div>

        {/* Accessible Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
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
        Exercise {currentIndex + 1} of {items.length}
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-base hover:bg-primary/90 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm min-h-[44px]"
          >
            <span>{currentIndex < items.length - 1 ? "Next Exercise" : "Finish Practice"}</span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
