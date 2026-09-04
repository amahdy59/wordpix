import { useState } from "react";
import { ArrowRight, BookOpen, Check, RotateCcw, Volume2 } from "lucide-react";
import type { StudyNode, UnitStudyProgress, StudyWordStatus } from "./types";
import type { UnitLearningMaterials } from "../types";
import { getWords } from "../../data/vocabulary";
import { WordImage } from "../../shared/WordImage";
import { useAudio } from "../../shared/useAudio";
import { getLexiconEntry, hasArabicGloss } from "../../data/lexiconDictionary";
import { WordInspectorModal } from "../../shared/WordInspectorModal";
import type { VocabularyItem } from "../../data/lessons";

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
  const [inspectedWord, setInspectedWord] = useState<VocabularyItem | null>(null);
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);
  const { speak, stop, isPlaying } = useAudio({
    lang: "en-US",
    rate: 0.95,
    onEnded: () => setPlayingWordId(null),
    onError: () => setPlayingWordId(null),
  });
  const studiedCount = words.filter(
    (word) =>
      progress?.wordStatus[word.id] === "learning" ||
      progress?.wordStatus[word.id] === "comfortable"
  ).length;

  const setWordStatus = (wordId: string, status: StudyWordStatus) =>
    onProgressUpdate((current) => ({
      ...current,
      wordStatus: { ...current.wordStatus, [wordId]: status },
      reviewWordIds:
        status === "review"
          ? [...new Set([...current.reviewWordIds, wordId])]
          : current.reviewWordIds.filter((id) => id !== wordId),
    }));
  const finish = () => {
    onProgressUpdate((current) => ({
      ...current,
      completedNodeIds: [...new Set([...current.completedNodeIds, node.id])],
      nodePositions: { ...current.nodePositions, [node.id]: 0 },
    }));
    onNextActivity();
  };
  if (!words.length)
    return (
      <p className="p-8 text-center text-muted-foreground">No vocabulary found for this topic.</p>
    );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-5">
      <header className="flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <BookOpen className="size-4" aria-hidden />
            Learn the whole set
          </p>
          <h1 className="text-2xl font-black text-foreground mt-1">{node.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse every word, hear its pronunciation, and choose what needs more practice.
          </p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-foreground">
          {studiedCount} of {words.length} marked learned
        </p>
      </header>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        aria-label={`${node.title} vocabulary`}
      >
        {words.map((word) => {
          const entry = getLexiconEntry(word.id, word.label);
          const status = progress?.wordStatus[word.id] || "new";
          const learned = status === "learning" || status === "comfortable";
          return (
            <article
              key={word.id}
              className="bg-wp-card rounded-2xl border border-border shadow-wp-xs overflow-hidden flex flex-col"
            >
              <WordImage word={word} className="w-full aspect-[16/9] object-cover" />
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-black text-foreground break-words">{word.label}</h2>
                    <p className="text-sm font-mono text-muted-foreground">
                      {entry.phonetic || word.phonetic}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      stop();
                      speak(word.label);
                    }}
                    aria-label={`Listen to ${word.label}`}
                    aria-pressed={isPlaying && playingWordId === word.id}
                    className="size-11 grid place-items-center rounded-xl bg-primary text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Volume2
                      className={`size-5 ${isPlaying && playingWordId === word.id ? "motion-safe:animate-pulse" : ""}`}
                      aria-hidden
                    />
                  </button>
                </div>
                {!immersionMode && hasArabicGloss(entry) && (
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic font-bold text-lg text-foreground text-start"
                  >
                    {entry.arabic}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-muted-foreground flex-1">
                  {word.description ||
                    entry.sentences?.[0]?.en ||
                    "Explore examples and word partners in details."}
                </p>
                <button
                  type="button"
                  onClick={() => setInspectedWord(word)}
                  className="min-h-11 text-start text-primary font-semibold rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Examples and word details
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    aria-pressed={learned}
                    onClick={() => setWordStatus(word.id, "learning")}
                    className={`min-h-11 rounded-xl border font-bold text-sm flex items-center justify-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${learned ? "bg-primary text-primary-foreground border-primary" : "bg-wp-card text-foreground border-border"}`}
                  >
                    <Check className="size-4" aria-hidden />
                    Learned
                  </button>
                  <button
                    type="button"
                    aria-pressed={status === "review"}
                    onClick={() => setWordStatus(word.id, "review")}
                    className={`min-h-11 rounded-xl border font-bold text-sm flex items-center justify-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${status === "review" ? "bg-wp-amber/15 text-foreground border-wp-amber" : "bg-wp-card text-foreground border-border"}`}
                  >
                    <RotateCcw className="size-4" aria-hidden />
                    Review
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <footer className="border border-border bg-background rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <p className="text-sm text-muted-foreground">
          You can return anytime. Only your Learned and Review choices update progress.
        </p>
        <button
          type="button"
          onClick={finish}
          className="min-h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2"
        >
          Continue to next activity
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </footer>
      <WordInspectorModal
        word={inspectedWord}
        bilingual={!immersionMode}
        isOpen={!!inspectedWord}
        onClose={() => setInspectedWord(null)}
      />
    </div>
  );
}
