import { useState, useEffect, useRef } from "react";
import type { StudyNode, UnitStudyProgress, StudyWordStatus } from "./types";
import type { UnitLearningMaterials } from "../types";
import { getWords } from "../../data/vocabulary";
import { VocabularyCard } from "./VocabularyCard";
import { CheckCircle2, RotateCcw, ThumbsUp, HelpCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useAudio } from "../../shared/useAudio";

interface Props {
  node: StudyNode;
  materials: UnitLearningMaterials;
  progress?: UnitStudyProgress;
  onProgressUpdate: (update: React.SetStateAction<UnitStudyProgress>) => void;
  onNextActivity: () => void;
  immersionMode?: boolean;
}

export function LearnArea({
  node,
  materials,
  progress,
  onProgressUpdate,
  onNextActivity,
  immersionMode = false,
}: Props) {
  const words = getWords(node.wordIds || [], materials.unitId);
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.min(progress?.nodePositions?.[node.id] ?? 0, Math.max(words.length - 1, 0))
  );
  const [isRevealed, setIsRevealed] = useState(false);
  const [needsPracticeCount, setNeedsPracticeCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { speak, stop } = useAudio({ lang: "en-US", rate: 0.95 });

  const wordMetaMap = Object.fromEntries((materials.wordMeta || []).map((m) => [m.word, m]));

  const currentWord = words[currentIndex];
  const meta = currentWord
    ? wordMetaMap[currentWord.label.toLowerCase()] || wordMetaMap[currentWord.id]
    : undefined;
  const isLast = currentIndex === words.length - 1;

  const advanceCard = () => {
    if (!isLast) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      onProgressUpdate((current) => ({
        ...current,
        nodePositions: { ...current.nodePositions, [node.id]: next },
      }));
      setIsRevealed(false);
    } else {
      setIsComplete(true);
      onProgressUpdate((prev) => {
        if (!prev.completedNodeIds.includes(node.id)) {
          return {
            ...prev,
            completedNodeIds: [...prev.completedNodeIds, node.id],
            nodePositions: { ...prev.nodePositions, [node.id]: 0 },
          };
        }
        return prev;
      });
    }
  };

  const handleGotIt = () => {
    if (!currentWord) return;
    onProgressUpdate((prev) => {
      const status = prev.wordStatus[currentWord.id] || "new";
      const newStatus: StudyWordStatus = status === "comfortable" ? "comfortable" : "learning";
      return {
        ...prev,
        wordStatus: {
          ...prev.wordStatus,
          [currentWord.id]: newStatus,
        },
      };
    });
    advanceCard();
  };

  const handleNeedsPractice = () => {
    if (!currentWord) return;
    setNeedsPracticeCount((c) => c + 1);
    onProgressUpdate((prev) => {
      const reviewIds = prev.reviewWordIds.includes(currentWord.id)
        ? prev.reviewWordIds
        : [...prev.reviewWordIds, currentWord.id];

      const newStatus: StudyWordStatus = "review";
      return {
        ...prev,
        reviewWordIds: reviewIds,
        wordStatus: {
          ...prev.wordStatus,
          [currentWord.id]: newStatus,
        },
      };
    });
    advanceCard();
  };

  const handleReveal = () => {
    setIsRevealed(true);
    if (currentWord) {
      stop();
      speak(currentWord.label);
    }
  };

  const stateRef = useRef({
    isRevealed,
    isComplete,
    currentWord,
    currentIndex,
    handleGotIt,
    handleNeedsPractice,
  });
  useEffect(() => {
    stateRef.current = {
      isRevealed,
      isComplete,
      currentWord,
      currentIndex,
      handleGotIt,
      handleNeedsPractice,
    };
  });

  // Global flashcard keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const {
        isRevealed: revealed,
        isComplete: complete,
        currentWord: word,
        currentIndex: idx,
        handleGotIt: onGotIt,
        handleNeedsPractice: onNeedsPractice,
      } = stateRef.current;
      if (complete) return;

      if (!revealed) {
        if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
          e.preventDefault();
          setIsRevealed(true);
          if (word) {
            stop();
            speak(word.label);
          }
        } else if (e.key === "ArrowLeft" && idx > 0) {
          e.preventDefault();
          const prevIdx = idx - 1;
          setCurrentIndex(prevIdx);
          setIsRevealed(false);
          onProgressUpdate((curr) => ({
            ...curr,
            nodePositions: { ...curr.nodePositions, [node.id]: prevIdx },
          }));
        }
      } else {
        if (e.key === "1" || e.key === "ArrowLeft") {
          e.preventDefault();
          onNeedsPractice();
        } else if (e.key === "2" || e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onGotIt();
        } else if (e.key === "a" || e.key === "A" || e.key === "p" || e.key === "P") {
          e.preventDefault();
          if (word) {
            stop();
            speak(word.label);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [node.id, onProgressUpdate, speak, stop]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsRevealed(false);
    setIsComplete(false);
    setNeedsPracticeCount(0);
    onProgressUpdate((current) => ({
      ...current,
      nodePositions: { ...current.nodePositions, [node.id]: 0 },
    }));
  };

  if (words.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No vocabulary found for this topic.
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto w-full p-6 md:p-12 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
        <div className="size-20 rounded-3xl bg-wp-green-light/20 text-wp-green flex items-center justify-center mb-6 shadow-xs border border-wp-green/30">
          <CheckCircle2 className="size-10" aria-hidden />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground mb-3">{node.title} Complete!</h1>
        <p className="text-muted-foreground text-base max-w-md mb-8 leading-relaxed">
          {needsPracticeCount > 0
            ? `You reviewed ${words.length} words. ${needsPracticeCount} ${
                needsPracticeCount === 1 ? "word was" : "words were"
              } queued in your Review list for focused practice.`
            : `You reviewed all ${words.length} words in this set with confidence.`}
        </p>

        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border rounded-2xl font-bold text-sm hover:bg-secondary transition-colors min-h-[48px]"
          >
            <RotateCcw className="size-4" aria-hidden />
            <span>Review Again</span>
          </button>
          <button
            type="button"
            onClick={onNextActivity}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
          >
            <span>Continue to next activity</span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(
    ((currentIndex + (isRevealed ? 0.5 : 0)) / words.length) * 100
  );

  return (
    <div className="max-w-2xl mx-auto w-full h-full flex flex-col px-4 sm:px-6 md:px-8 py-3 sm:py-4">
      {/* Header & Progress — fixed height, never scrolls */}
      <div className="w-full shrink-0 mb-3">
        <div className="flex justify-between items-baseline gap-3 mb-2">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-extrabold text-foreground truncate">
              {node.title}
            </h1>
            {node.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{node.description}</p>
            )}
          </div>
          <span className="text-xs font-bold text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full shrink-0">
            {currentIndex + 1} of {words.length}
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
            aria-label={`Topic progress: ${currentIndex + 1} of ${words.length} words`}
          />
        </div>
      </div>

      {/* Screen reader status announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        Word {currentIndex + 1} of {words.length}: {isRevealed ? currentWord.label : "Hidden"}
      </div>

      {/* Vocabulary Card — fills remaining vertical space between header & buttons */}
      <div className="w-full flex-1 min-h-0">
        <VocabularyCard
          key={currentWord.id}
          word={currentWord}
          meta={meta}
          materials={materials}
          isRevealed={isRevealed}
          onReveal={handleReveal}
          immersionMode={immersionMode}
        />
      </div>

      {/* Action Controls — fixed at bottom, never scrolls */}
      <div className="w-full shrink-0 pt-3">
        {!isRevealed ? (
          <div className="flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (currentIndex > 0) {
                  const previous = currentIndex - 1;
                  setCurrentIndex(previous);
                  setIsRevealed(false);
                  onProgressUpdate((current) => ({
                    ...current,
                    nodePositions: { ...current.nodePositions, [node.id]: previous },
                  }));
                }
              }}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl min-h-[44px] hover:bg-secondary/60 transition-colors"
            >
              <ArrowLeft className="size-4" aria-hidden />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={handleReveal}
              className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] shadow-xs"
            >
              <span>Reveal</span>
              <kbd className="hidden sm:inline-flex ms-1 px-2 py-0.5 text-xs bg-primary-foreground/20 rounded font-mono font-normal">
                Space
              </kbd>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              type="button"
              onClick={handleNeedsPractice}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border border-wp-amber/40 bg-wp-amber/10 text-wp-amber font-bold text-sm hover:bg-wp-amber/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wp-amber min-h-[48px]"
            >
              <HelpCircle className="size-4" aria-hidden />
              <span>Needs Practice</span>
              <kbd className="hidden sm:inline-flex ms-1 px-2 py-0.5 text-xs bg-wp-amber/20 rounded font-mono font-normal">
                1
              </kbd>
            </button>
            <button
              type="button"
              onClick={handleGotIt}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs min-h-[48px]"
            >
              <ThumbsUp className="size-4" aria-hidden />
              <span>Got It</span>
              <kbd className="hidden sm:inline-flex ms-1 px-2 py-0.5 text-xs bg-primary-foreground/20 rounded font-mono font-normal">
                2
              </kbd>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
