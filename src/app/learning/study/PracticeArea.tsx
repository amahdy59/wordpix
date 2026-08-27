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
import { CheckCircle2, XCircle } from "lucide-react";
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
  onCorrect,
}: {
  sentence: string;
  hint: React.ReactNode;
  onCorrect: () => void;
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
    if (correct) onCorrect();
  };

  const reset = () => {
    setAvailable(shuffle(words));
    setSelected([]);
    setHasAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="rounded-xl border border-border p-4 bg-card shadow-sm">
      <div className="mb-4">{hint}</div>
      <div className="min-h-[44px] flex flex-wrap gap-2 p-2 border-b-2 border-dashed border-border mb-4 bg-muted/30 rounded">
        {selected.map((w, i) => (
          <button
            key={i}
            onClick={() => !hasAnswered && handleDeselect(i)}
            disabled={hasAnswered}
            className="px-3 py-1.5 bg-background border border-border rounded-md shadow-sm font-medium hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
          >
            {w}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {available.map((w, i) => (
          <button
            key={i}
            onClick={() => !hasAnswered && handleSelect(i)}
            disabled={hasAnswered}
            className="px-3 py-1.5 bg-muted text-muted-foreground border border-transparent rounded-md font-medium hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
          >
            {w}
          </button>
        ))}
      </div>

      {hasAnswered ? (
        <div
          className={`p-4 rounded-xl flex items-center justify-between ${isCorrect ? "bg-wp-green-light/20 text-wp-green" : "bg-destructive/10 text-destructive"}`}
        >
          <div className="flex items-center gap-3">
            {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-bold">{isCorrect ? "Correct!" : "Incorrect"}</span>
          </div>
          {!isCorrect && (
            <button
              onClick={reset}
              className="px-4 py-2 bg-background border border-border rounded-full text-sm font-bold hover:bg-muted min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Try Again
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={checkAnswer}
          disabled={selected.length === 0}
          className="w-full py-2 bg-primary text-primary-foreground rounded-full font-bold disabled:opacity-50 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Check
        </button>
      )}
    </div>
  );
}

function MultipleChoiceQuiz({
  question,
  options,
  correctIndex,
  onCorrect,
}: {
  question: React.ReactNode;
  options: string[];
  correctIndex: number;
  onCorrect: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  const handlePick = (i: number) => {
    setPicked(i);
    if (i === correctIndex) {
      onCorrect();
    }
  };

  return (
    <div className="rounded-xl border border-border p-4 bg-card shadow-sm">
      <div className="mb-4 font-bold text-lg">{question}</div>
      <div className="space-y-3">
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
              className={`w-full text-start p-4 rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] ${
                state === "correct"
                  ? "border-wp-green bg-wp-green-light/20 text-wp-green font-bold"
                  : state === "wrong"
                    ? "border-destructive bg-destructive/10 text-destructive font-bold"
                    : "border-border hover:border-primary/50"
              }`}
            >
              <span className="flex items-center gap-2">
                {state === "correct" && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                {state === "wrong" && <XCircle className="w-5 h-5 shrink-0" />}
                {opt}
              </span>
            </button>
          );
        })}
      </div>
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

  const [finished, setFinished] = useState(false);

  const handleCorrect = (word: string) => {
    const matchedVocab = vocab.find(
      (v: VocabularyItem) => v.label.toLowerCase() === word.trim().toLowerCase()
    );
    if (matchedVocab) {
      let progress = loadStudyProgress(materials.unitId);
      progress = recordWordPractice(progress, matchedVocab.id, true);
      saveStudyProgress(progress);
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">No practice exercises available.</div>
    );
  }

  if (finished) {
    return (
      <div className="p-8 max-w-3xl mx-auto w-full text-center">
        <CheckCircle2 className="w-16 h-16 text-wp-green mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Practice Complete!</h2>
        <p className="text-muted-foreground">You have finished all exercises in this session.</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 relative">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b border-border mb-6 shadow-sm">
        <div className="max-w-3xl mx-auto flex justify-between items-center px-4 md:px-8">
          <h2 className="text-xl font-bold">Practice Session</h2>
          <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {items.length} Questions
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-8">
        {items.map((item, index) => {
          if (item.type === "blank") {
            const parts = item.data.sentence.split(BLANK_TOKEN);
            const questionNode = (
              <p>
                {parts.map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < parts.length - 1 && (
                      <span className="inline-block w-16 border-b-2 border-primary mx-1" />
                    )}
                  </span>
                ))}
              </p>
            );
            return (
              <div key={item.id}>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-2">
                  Question {index + 1}
                </p>
                <MultipleChoiceQuiz
                  question={questionNode}
                  options={item.options}
                  correctIndex={item.correctIndex}
                  onCorrect={() => handleCorrect(item.answerText)}
                />
              </div>
            );
          }

          if (item.type === "multipleChoice") {
            return (
              <div key={item.id}>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-2">
                  Question {index + 1}
                </p>
                <MultipleChoiceQuiz
                  question={item.data.question}
                  options={item.data.options}
                  correctIndex={item.data.correctIndex}
                  onCorrect={() => handleCorrect(item.answerText)}
                />
              </div>
            );
          }

          if (item.type === "rewrite") {
            const hint = (
              <>
                <p className="text-muted-foreground mb-2 text-sm font-bold uppercase">
                  Rewrite using &apos;{item.data.hintWord}&apos;
                </p>
                <p className="font-bold">{item.data.sentence}</p>
              </>
            );
            return (
              <div key={item.id}>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-2">
                  Question {index + 1}
                </p>
                <SentenceBuilder
                  sentence={item.answerText}
                  hint={hint}
                  onCorrect={() => handleCorrect(item.data.hintWord)}
                />
              </div>
            );
          }

          if (item.type === "errorCorrection") {
            const hint = (
              <>
                <p className="text-muted-foreground mb-2 text-sm font-bold uppercase">
                  Correct the mistake
                </p>
                <p className="font-bold text-destructive line-through decoration-2">
                  {item.data.wrong}
                </p>
              </>
            );
            return (
              <div key={item.id}>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-2">
                  Question {index + 1}
                </p>
                <SentenceBuilder
                  sentence={item.answerText}
                  hint={hint}
                  onCorrect={() => handleCorrect(item.answerText)}
                />
              </div>
            );
          }

          return null;
        })}

        <div className="pt-8 pb-12 text-center border-t border-border mt-12">
          <button
            onClick={() => setFinished(true)}
            className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full min-h-[44px] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Finish Practice Session
          </button>
        </div>
      </div>
    </div>
  );
}
