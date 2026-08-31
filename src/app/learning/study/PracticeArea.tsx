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
import { CheckCircle2, XCircle, Check, ArrowRight } from "lucide-react";
import { loadStudyProgress, saveStudyProgress, recordWordPractice } from "./progress";

interface Props {
  materials: UnitLearningMaterials;
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

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
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
  onComplete: (correct: boolean) => void;
}) {
  const words = useMemo(() => sentence.split(" "), [sentence]);
  const [available, setAvailable] = useState<string[]>(() => shuffle(words));
  const [selected, setSelected] = useState<string[]>([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (idx: number) => {
    const w = available[idx];
    setAvailable(available.filter((_, i) => i !== idx));
    setSelected([...selected, w]);
  };

  const handleDeselect = (idx: number) => {
    const w = selected[idx];
    setSelected(selected.filter((_, i) => i !== idx));
    setAvailable([...available, w]);
  };

  const checkAnswer = () => {
    const answer = selected.join(" ");
    const correct = answer === sentence;
    setIsCorrect(correct);
    setHasAnswered(true);
    onComplete(correct);
  };

  const reset = () => {
    setAvailable(shuffle(words));
    setSelected([]);
    setHasAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="rounded-2xl border-2 border-border/50 p-5 bg-card shadow-sm">
      <div className="mb-5">{hint}</div>
      <div className="min-h-[56px] flex flex-wrap gap-2 p-3 border-b-2 border-dashed border-border mb-5 bg-muted/20 rounded-lg">
        {selected.map((w, i) => (
          <button
            key={i}
            onClick={() => !hasAnswered && handleDeselect(i)}
            disabled={hasAnswered}
            className="px-4 py-2 bg-background border-2 border-border rounded-lg shadow-sm font-bold text-base hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all active:scale-95 min-h-[44px]"
          >
            {w}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {available.map((w, i) => (
          <button
            key={i}
            onClick={() => !hasAnswered && handleSelect(i)}
            disabled={hasAnswered}
            className="px-4 py-2 bg-muted text-muted-foreground border-2 border-transparent rounded-lg font-bold text-base hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all active:scale-95 min-h-[44px]"
          >
            {w}
          </button>
        ))}
      </div>

      {hasAnswered ? (
        <div
          className={`p-4 rounded-xl flex items-center justify-between ${
            isCorrect
              ? "bg-wp-green-light/20 text-wp-green border-2 border-wp-green"
              : "bg-destructive/10 text-destructive border-2 border-destructive"
          }`}
        >
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 shrink-0" />
            )}
            <span className="font-bold text-lg">
              {isCorrect ? "Great job!" : "Not quite right"}
            </span>
          </div>
          {!isCorrect && (
            <button
              onClick={reset}
              className="px-5 py-2.5 bg-background border-2 border-current rounded-xl font-bold hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px]"
            >
              Try Again
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={checkAnswer}
          disabled={selected.length === 0}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-lg disabled:opacity-50 transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-sm min-h-[44px]"
        >
          Check Answer
        </button>
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
  onComplete: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  const handlePick = (i: number) => {
    setPicked(i);
    onComplete(i === correctIndex);
  };

  return (
    <div className="rounded-2xl border-2 border-border/50 p-5 bg-card shadow-sm">
      <div className="mb-6 font-bold text-xl text-foreground leading-relaxed">{question}</div>
      <div className="grid gap-3">
        {options.map((opt, i) => {
          const isCorrect = i === correctIndex;
          const isPicked = picked === i;
          const state = !answered ? "idle" : isCorrect ? "correct" : isPicked ? "wrong" : "idle";

          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => handlePick(i)}
              className={`w-full text-start p-4 rounded-xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-lg min-h-[44px] ${
                state === "correct"
                  ? "border-wp-green bg-wp-green-light/10 text-wp-green font-bold shadow-sm scale-[1.02]"
                  : state === "wrong"
                    ? "border-destructive bg-destructive/5 text-destructive font-bold"
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/30 font-medium active:scale-[0.98]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    state === "correct"
                      ? "border-wp-green bg-wp-green"
                      : state === "wrong"
                        ? "border-destructive bg-destructive"
                        : "border-muted-foreground/30"
                  }`}
                >
                  {state === "correct" && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </div>
                {opt}
              </div>
            </button>
          );
        })}
      </div>
      {answered && picked !== correctIndex && (
        <div className="mt-5 p-4 rounded-xl bg-destructive/10 border-2 border-destructive text-destructive font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 shrink-0" />
            <span>Incorrect</span>
          </div>
          <button
            onClick={() => setPicked(null)}
            className="px-4 py-2 border-2 border-current rounded-lg text-sm hover:opacity-80 transition-opacity min-h-[44px]"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export function PracticeArea({ materials }: Props) {
  const vocab = useMemo(() => loadedUnitVocabulary(materials.unitId), [materials.unitId]);

  const items = useMemo(() => {
    const list: PracticeItem[] = [];
    let idCounter = 0;

    materials.blankExercises?.forEach((e) => {
      const distractors = shuffle(
        vocab
          .map((v: VocabularyItem) => v.label)
          .filter((l: string) => l.toLowerCase() !== e.answer.toLowerCase())
      ).slice(0, 3);
      const options = shuffle([e.answer, ...distractors]) as string[];
      const correctIndex = options.indexOf(e.answer);
      list.push({
        id: `practice-${idCounter++}`,
        type: "blank",
        data: e,
        answerText: e.answer,
        options,
        correctIndex,
      });
    });

    materials.additionalExercises?.multipleChoice?.forEach((e) =>
      list.push({
        id: `practice-${idCounter++}`,
        type: "multipleChoice",
        data: e,
        answerText: e.options[e.correctIndex],
      })
    );

    materials.collocationsQuiz?.forEach((e) =>
      list.push({
        id: `practice-${idCounter++}`,
        type: "multipleChoice",
        data: e,
        answerText: e.options[e.correctIndex],
      })
    );

    materials.additionalExercises?.rewrite?.forEach((e) =>
      list.push({
        id: `practice-${idCounter++}`,
        type: "rewrite",
        data: e,
        answerText: e.answer,
      })
    );

    materials.errorCorrection?.forEach((e) =>
      list.push({
        id: `practice-${idCounter++}`,
        type: "errorCorrection",
        data: e,
        answerText: e.right,
      })
    );

    return shuffle(list);
  }, [materials, vocab]);

  // Track completed items (correctly answered)
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);

  const handleComplete = (itemId: string, word: string, isCorrect: boolean) => {
    if (isCorrect) {
      setCompletedItems((prev) => {
        const next = new Set(prev);
        next.add(itemId);
        return next;
      });

      const matchedVocab = vocab.find(
        (v: VocabularyItem) => v.label.toLowerCase() === word.trim().toLowerCase()
      );
      if (matchedVocab) {
        let progress = loadStudyProgress(materials.unitId);
        progress = recordWordPractice(progress, matchedVocab.id, true);
        saveStudyProgress(progress);
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">No practice exercises available.</div>
    );
  }

  if (finished) {
    return (
      <div className="p-8 max-w-3xl mx-auto w-full text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-wp-green-light/20 text-wp-green rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-foreground">Practice Complete!</h2>
        <p className="text-lg text-muted-foreground">
          Amazing job! You have finished all exercises in this session.
        </p>
      </div>
    );
  }

  const progressPercent = Math.round((completedItems.size / items.length) * 100);

  return (
    <div className="w-full pb-32 relative">
      {/* Sticky Header with Progress Bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md pt-4 pb-4 border-b border-border mb-8 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold tracking-tight">Practice Session</h2>
            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {completedItems.size} / {items.length}
            </span>
          </div>
          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            {/* Progress Bar Fill */}
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-12">
        {items.map((item, index) => {
          const isCompleted = completedItems.has(item.id);

          const renderQuestion = () => {
            if (item.type === "blank") {
              const parts = item.data.sentence.split(BLANK_TOKEN);
              const questionNode = (
                <p>
                  {parts.map((part, i) => (
                    <span key={i}>
                      {part}
                      {i < parts.length - 1 && (
                        <span className="inline-block w-16 border-b-2 border-primary mx-1 translate-y-[2px]" />
                      )}
                    </span>
                  ))}
                </p>
              );
              return (
                <MultipleChoiceQuiz
                  question={questionNode}
                  options={item.options}
                  correctIndex={item.correctIndex}
                  onComplete={(correct) => handleComplete(item.id, item.answerText, correct)}
                />
              );
            }

            if (item.type === "multipleChoice") {
              return (
                <MultipleChoiceQuiz
                  question={item.data.question}
                  options={item.data.options}
                  correctIndex={item.data.correctIndex}
                  onComplete={(correct) => handleComplete(item.id, item.answerText, correct)}
                />
              );
            }

            if (item.type === "rewrite") {
              const hint = (
                <div className="flex flex-col gap-1">
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">
                    Rewrite the sentence
                  </span>
                  <p className="text-muted-foreground">
                    Include the word{" "}
                    <span className="font-bold text-foreground">"{item.data.hintWord}"</span> in
                    your answer.
                  </p>
                  <p className="font-medium text-lg mt-2 text-foreground border-s-4 border-primary/30 ps-3">
                    {item.data.sentence}
                  </p>
                </div>
              );
              return (
                <SentenceBuilder
                  sentence={item.answerText}
                  hint={hint}
                  onComplete={(correct) => handleComplete(item.id, item.data.hintWord, correct)}
                />
              );
            }

            if (item.type === "errorCorrection") {
              const hint = (
                <div className="flex flex-col gap-1">
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">
                    Correct the mistake
                  </span>
                  <p className="font-medium text-lg mt-2 text-destructive border-s-4 border-destructive/30 ps-3 line-through decoration-2">
                    {item.data.wrong}
                  </p>
                </div>
              );
              return (
                <SentenceBuilder
                  sentence={item.answerText}
                  hint={hint}
                  onComplete={(correct) => handleComplete(item.id, item.answerText, correct)}
                />
              );
            }

            return null;
          };

          return (
            <div
              key={item.id}
              className={`transition-opacity duration-300 ${isCompleted ? "opacity-50 hover:opacity-100" : "opacity-100"}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-sm shrink-0">
                  {index + 1}
                </span>
                {isCompleted && (
                  <span className="text-xs font-bold uppercase tracking-wider text-wp-green flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>
              {renderQuestion()}
            </div>
          );
        })}

        <div className="pt-8 text-center border-t border-border mt-16">
          <button
            onClick={() => setFinished(true)}
            disabled={completedItems.size < items.length}
            className="w-full sm:w-auto px-12 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2 mx-auto"
          >
            Complete Session
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          {completedItems.size < items.length && (
            <p className="text-sm text-muted-foreground mt-3 font-medium">
              Complete {items.length - completedItems.size} more{" "}
              {items.length - completedItems.size === 1 ? "question" : "questions"} to finish.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
