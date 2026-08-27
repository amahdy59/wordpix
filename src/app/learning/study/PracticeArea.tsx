import { useState, useMemo, useRef, useEffect } from "react";
import type { UnitLearningMaterials } from "../types";
import { loadedUnitVocabulary } from "../../data/vocabulary";
import { BLANK_TOKEN } from "../types";
import { CheckCircle2, XCircle } from "lucide-react";
import { loadStudyProgress, saveStudyProgress, recordWordPractice } from "./progress";

interface Props {
  materials: UnitLearningMaterials;
}

interface BlankExerciseData {
  sentence: string;
  answer: string;
}
interface MultipleChoiceData {
  question: string;
  options: string[];
  correctIndex: number;
}
interface RewriteData {
  sentence: string;
  hintWord: string;
  answer: string;
}
interface ErrorCorrectionData {
  wrong: string;
  right: string;
}

type PracticeItem =
  | { type: "blank"; data: BlankExerciseData; answerText: string }
  | { type: "multipleChoice"; data: MultipleChoiceData; answerText: string }
  | { type: "rewrite"; data: RewriteData; answerText: string }
  | { type: "errorCorrection"; data: ErrorCorrectionData; answerText: string };

export function PracticeArea({ materials }: Props) {
  const items = useMemo(() => {
    const list: PracticeItem[] = [];
    materials.blankExercises?.forEach((e) =>
      list.push({
        type: "blank",
        data: e as BlankExerciseData,
        answerText: (e as BlankExerciseData).answer,
      })
    );
    materials.additionalExercises?.multipleChoice?.forEach((e) =>
      list.push({
        type: "multipleChoice",
        data: e as MultipleChoiceData,
        answerText: (e as MultipleChoiceData).options[(e as MultipleChoiceData).correctIndex],
      })
    );
    materials.collocationsQuiz?.forEach((e) =>
      list.push({
        type: "multipleChoice",
        data: e as MultipleChoiceData,
        answerText: (e as MultipleChoiceData).options[(e as MultipleChoiceData).correctIndex],
      })
    );
    materials.additionalExercises?.rewrite?.forEach((e) =>
      list.push({ type: "rewrite", data: e as RewriteData, answerText: (e as RewriteData).answer })
    );
    materials.errorCorrection?.forEach((e) =>
      list.push({
        type: "errorCorrection",
        data: e as ErrorCorrectionData,
        answerText: (e as ErrorCorrectionData).right,
      })
    );
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [materials]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const currentItem = items[currentIndex];
  const isFinished = currentIndex >= items.length;

  const vocab = useMemo(() => loadedUnitVocabulary(materials.unitId), [materials.unitId]);

  useEffect(() => {
    if (
      !isFinished &&
      currentItem &&
      (currentItem.type === "blank" ||
        currentItem.type === "rewrite" ||
        currentItem.type === "errorCorrection")
    ) {
      inputRef.current?.focus();
    }
  }, [currentIndex, isFinished, currentItem]);

  function handleCheck() {
    if (!currentItem) return;
    let correct = false;
    const normalize = (s: string) => s.trim().toLowerCase();

    if (
      currentItem.type === "blank" ||
      currentItem.type === "rewrite" ||
      currentItem.type === "errorCorrection"
    ) {
      correct = normalize(inputValue) === normalize(currentItem.answerText);
    } else if (currentItem.type === "multipleChoice") {
      correct = parseInt(inputValue, 10) === currentItem.data.correctIndex;
    }

    setIsCorrect(correct);
    setHasAnswered(true);

    let targetWord = currentItem.answerText;
    if (currentItem.type === "multipleChoice") {
      targetWord = currentItem.data.options[currentItem.data.correctIndex];
    } else if (currentItem.type === "rewrite") {
      targetWord = currentItem.data.hintWord;
    }

    const matchedVocab = vocab.find(
      (v) => v.label.toLowerCase() === targetWord.trim().toLowerCase()
    );
    if (matchedVocab) {
      let progress = loadStudyProgress(materials.unitId);
      progress = recordWordPractice(progress, matchedVocab.id, correct);
      saveStudyProgress(progress);
    }
  }

  function handleNext() {
    setInputValue("");
    setHasAnswered(false);
    setIsCorrect(false);
    setCurrentIndex((i) => i + 1);
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">No practice exercises available.</div>
    );
  }

  if (isFinished) {
    return (
      <div className="p-8 max-w-3xl mx-auto w-full text-center">
        <CheckCircle2 className="w-16 h-16 text-wp-green mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Practice Complete!</h2>
        <p className="text-muted-foreground">You have finished all exercises in this session.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-4 md:p-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Practice Session</h2>
        <span className="text-sm font-bold text-muted-foreground">
          {currentIndex + 1} / {items.length}
        </span>
      </div>

      <div className="rounded-xl border border-border p-6 bg-card shadow-sm mb-6">
        {currentItem.type === "blank" && (
          <div>
            <p className="text-muted-foreground mb-4">Fill in the blank:</p>
            <p className="font-bold text-lg mb-6 leading-loose">
              {currentItem.data.sentence
                .split(BLANK_TOKEN)
                .map((part: string, i: number, arr: string[]) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <input
                        ref={inputRef}
                        type="text"
                        aria-label="Fill in the blank"
                        className="mx-2 w-32 border-b-2 border-primary bg-transparent text-center outline-none focus:border-wp-green focus-visible:ring-2 focus-visible:ring-primary"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={hasAnswered}
                      />
                    )}
                  </span>
                ))}
            </p>
          </div>
        )}

        {currentItem.type === "multipleChoice" && (
          <div>
            <p className="text-muted-foreground mb-4">Choose the correct answer:</p>
            <p className="font-bold text-lg mb-6">{currentItem.data.question}</p>
            <div className="space-y-3" role="group" aria-label="Answer options">
              {currentItem.data.options.map((opt: string, i: number) => {
                const picked = inputValue === String(i);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => setInputValue(String(i))}
                    aria-pressed={picked}
                    className={`w-full text-start p-4 rounded-xl border ${picked ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentItem.type === "rewrite" && (
          <div>
            <p className="text-muted-foreground mb-4">
              Rewrite using &lsquo;{currentItem.data.hintWord}&rsquo;:
            </p>
            <p className="font-bold text-lg mb-6">{currentItem.data.sentence}</p>
            <input
              ref={inputRef}
              type="text"
              aria-label="Rewrite the sentence"
              className="w-full p-4 rounded-xl border border-border bg-transparent outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={hasAnswered}
              placeholder="Type your answer here..."
            />
          </div>
        )}

        {currentItem.type === "errorCorrection" && (
          <div>
            <p className="text-muted-foreground mb-4">Correct the mistake:</p>
            <p className="font-bold text-lg mb-6">{currentItem.data.wrong}</p>
            <input
              ref={inputRef}
              type="text"
              aria-label="Type the corrected sentence"
              className="w-full p-4 rounded-xl border border-border bg-transparent outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={hasAnswered}
              placeholder="Type the correct sentence..."
            />
          </div>
        )}
      </div>

      {hasAnswered ? (
        <div
          className={`p-4 rounded-xl flex items-center justify-between ${isCorrect ? "bg-wp-green-light/20 text-wp-green" : "bg-destructive/10 text-destructive"}`}
        >
          <div className="flex items-center gap-3">
            {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            <div>
              <p className="font-bold">{isCorrect ? "Correct!" : "Incorrect"}</p>
              {!isCorrect && (
                <p className="text-sm opacity-90 mt-1">Answer: {currentItem.answerText}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleNext}
            className={`px-6 py-2 min-h-[44px] rounded-full font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isCorrect ? "bg-wp-green hover:bg-wp-green/90 focus-visible:ring-wp-green" : "bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive"}`}
          >
            Next
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleCheck}
          disabled={!inputValue.trim()}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px]"
        >
          Check Answer
        </button>
      )}
    </div>
  );
}
