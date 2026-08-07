import { memo, useState, useEffect, useRef } from "react";
import { WordImage } from "../shared/WordImage";
import { BEDROOM_VOCABULARY } from "../data/lessons";
import { Sparkles, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCompleteLevel: (level: "A1" | "A2" | "B1") => void;
}

const QUESTIONS = [
  {
    targetId: "pillow",
    prompt: "Which picture shows a 'pillow'?",
    level: "A1" as const,
  },
  {
    targetId: "nightstand",
    prompt: "Complete: 'I put my lamp on the _______.'",
    level: "A2" as const,
  },
  {
    targetId: "wardrobe",
    prompt: "Build: 'This is a wardrobe.'",
    level: "B1" as const,
  },
];

export const PlacementQuizModal = memo(function PlacementQuizModal({
  isOpen,
  onClose,
  onCompleteLevel,
}: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Auto-focus and handle Escape key
  useEffect(() => {
    if (!isOpen) return undefined;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentQ = QUESTIONS[stepIndex];
  const targetWord = BEDROOM_VOCABULARY.find((v) => v.id === currentQ.targetId) ?? BEDROOM_VOCABULARY[0];
  const options = BEDROOM_VOCABULARY.slice(0, 4);

  const handleSelectOption = (wordId: string) => {
    const isCorrect = wordId === targetWord.id;
    const newCorrect = isCorrect ? correctCount + 1 : correctCount;

    if (stepIndex + 1 < QUESTIONS.length) {
      setCorrectCount(newCorrect);
      setStepIndex((i) => i + 1);
    } else {
      // Determine level recommendation
      const assignedLevel: "A1" | "A2" | "B1" = newCorrect >= 3 ? "B1" : newCorrect >= 2 ? "A2" : "A1";
      onCompleteLevel(assignedLevel);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="placement-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-wp-card border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-5 relative">
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close level placement check"
          className="absolute top-4 right-4 size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
        >
          <X className="size-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="size-4 text-wp-amber" />
            <span>Adaptive Level Check ({stepIndex + 1}/3)</span>
          </div>
          <h2 id="placement-modal-title" className="font-sans font-black text-foreground text-2xl">
            Test Your Level
          </h2>
          <p className="font-sans text-muted-foreground text-xs mt-1">
            Answer 3 quick visual questions to auto-set your starting difficulty.
          </p>
        </div>

        {/* Question Prompt */}
        <div className="bg-muted p-4 rounded-2xl border border-border">
          <p className="font-sans font-bold text-foreground text-base text-center">
            {currentQ.prompt}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, idx) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectOption(opt.id)}
              className="bg-background border border-border rounded-2xl p-2 flex flex-col items-center gap-1.5 hover:border-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary transition-all min-h-[44px]"
            >
              <div className="h-24 w-full rounded-xl overflow-hidden bg-muted">
                <WordImage word={opt} width="200" height="150" className="size-full object-cover" altMode="assessment" optionIndex={idx} />
              </div>
              <span className="font-sans font-semibold text-xs text-foreground">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
