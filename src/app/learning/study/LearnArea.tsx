import { useState } from "react";
import type { StudyNode, UnitStudyProgress, StudyWordStatus } from "./types";
import type { UnitLearningMaterials } from "../types";
import { getWords } from "../../data/vocabulary";
import { VocabularyCard } from "./VocabularyCard";
import { CheckCircle2, RotateCcw, ThumbsUp, HelpCircle, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  node: StudyNode;
  materials: UnitLearningMaterials;
  progress?: UnitStudyProgress;
  onProgressUpdate: (update: React.SetStateAction<UnitStudyProgress>) => void;
  onNextActivity: () => void;
}

export function LearnArea({ node, materials, progress, onProgressUpdate, onNextActivity }: Props) {
  const words = getWords(node.wordIds || [], materials.unitId);
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.min(progress?.nodePositions?.[node.id] ?? 0, Math.max(words.length - 1, 0))
  );
  const [isRevealed, setIsRevealed] = useState(false);
  const [needsPracticeCount, setNeedsPracticeCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const wordMetaMap = Object.fromEntries((materials.wordMeta || []).map((m) => [m.word, m]));

  if (words.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No vocabulary found for this topic.
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const meta = wordMetaMap[currentWord.label.toLowerCase()] || wordMetaMap[currentWord.id];
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

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto w-full p-6 md:p-12 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
        <div className="size-20 rounded-3xl bg-wp-green-light/20 text-wp-green flex items-center justify-center mb-6 shadow-xs border border-wp-green/30">
          <CheckCircle2 className="size-10" aria-hidden />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-3">{node.title} Complete!</h2>
        <p className="text-muted-foreground text-base max-w-md mb-8 leading-relaxed">
          {needsPracticeCount > 0
            ? `You reviewed ${words.length} words. ${needsPracticeCount} ${
                needsPracticeCount === 1 ? "word was" : "words were"
              } added to your Review queue for spaced practice.`
            : `Fantastic! You recalled all ${words.length} words with confidence.`}
        </p>

        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
          <button
            onClick={handleRestart}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border rounded-2xl font-bold text-sm hover:bg-secondary transition-colors min-h-[48px]"
          >
            <RotateCcw className="size-4" aria-hidden />
            <span>Review Again</span>
          </button>
          <button
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
    <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 md:p-8 flex flex-col items-center">
      {/* Header & Progress */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-baseline gap-3 mb-3">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">
              {node.title}
            </h2>
            {node.description && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                {node.description}
              </p>
            )}
          </div>
          <span className="text-xs font-bold text-muted-foreground bg-secondary/80 px-3 py-1.5 rounded-full shrink-0">
            {currentIndex + 1} of {words.length}
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
            aria-label={`Topic progress: ${currentIndex + 1} of ${words.length} words`}
          />
        </div>
      </div>

      {/* Screen reader status announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        Word {currentIndex + 1} of {words.length}: {isRevealed ? currentWord.label : "Hidden"}
      </div>

      {/* Vocabulary Card with Recall Mode */}
      <div className="w-full">
        <VocabularyCard
          key={currentWord.id}
          word={currentWord}
          meta={meta}
          materials={materials}
          isRevealed={isRevealed}
          onReveal={() => setIsRevealed(true)}
        />
      </div>

      {/* Action Controls */}
      <div className="w-full mt-6">
        {!isRevealed ? (
          <div className="flex justify-between items-center gap-3">
            <button
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
              onClick={() => setIsRevealed(true)}
              className="px-7 py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] shadow-xs"
            >
              Reveal
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3.5 w-full">
            <button
              onClick={handleNeedsPractice}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl border border-wp-amber/40 bg-wp-amber/10 text-wp-amber font-bold text-sm hover:bg-wp-amber/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wp-amber min-h-[48px]"
            >
              <HelpCircle className="size-4" aria-hidden />
              <span>Needs Practice</span>
            </button>
            <button
              onClick={handleGotIt}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs min-h-[48px]"
            >
              <ThumbsUp className="size-4" aria-hidden />
              <span>Got It</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
