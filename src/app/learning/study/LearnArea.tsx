import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Search, Volume2 } from "lucide-react";
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
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | StudyWordStatus>("all");
  const [announcement, setAnnouncement] = useState("");
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

  const visibleWords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return words.filter((word) => {
      const status = progress?.wordStatus[word.id] || "new";
      return (
        (filter === "all" || filter === status) &&
        (!normalizedQuery || word.label.toLocaleLowerCase().includes(normalizedQuery))
      );
    });
  }, [filter, progress?.wordStatus, query, words]);

  useEffect(() => () => stop(), [stop]);

  const setWordStatus = (word: VocabularyItem, status: StudyWordStatus) => {
    onProgressUpdate((current) => ({
      ...current,
      wordStatus: { ...current.wordStatus, [word.id]: status },
      reviewWordIds:
        status === "review"
          ? [...new Set([...current.reviewWordIds, word.id])]
          : current.reviewWordIds.filter((id) => id !== word.id),
    }));
    const label = status === "comfortable" ? "learned" : status;
    setAnnouncement(`${word.label} marked ${label}.`);
  };
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
          {studiedCount} of {words.length} in progress or learned
        </p>
      </header>
      <section
        aria-label="Filter vocabulary"
        className="grid gap-3 rounded-2xl border border-border bg-wp-card p-3 sm:grid-cols-[minmax(0,1fr)_12rem]"
      >
        <label className="relative block">
          <span className="sr-only">Search words</span>
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search words"
            className="min-h-11 w-full rounded-xl border border-border bg-background pe-3 ps-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </label>
        <label className="grid grid-cols-[auto_1fr] items-center gap-2 text-sm font-semibold text-foreground">
          <span>Show</span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as "all" | StudyWordStatus)}
            className="min-h-11 min-w-0 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <option value="all">All words</option>
            <option value="new">New</option>
            <option value="learning">Learning</option>
            <option value="comfortable">Learned</option>
            <option value="review">Review again</option>
          </select>
        </label>
      </section>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      <div
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        aria-label={`${node.title} vocabulary`}
      >
        {visibleWords.map((word) => {
          const entry = getLexiconEntry(word.id, word.label, materials.unitId);
          const status = progress?.wordStatus[word.id] || "new";
          const learned = status === "learning" || status === "comfortable";
          return (
            <article
              key={word.id}
              role="listitem"
              className="bg-wp-card rounded-2xl border border-border shadow-wp-xs overflow-hidden flex flex-col"
            >
              <WordImage
                word={word}
                altMode="decorative"
                className="w-full aspect-[3/2] max-h-56 object-cover"
              />
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
                      if (isPlaying && playingWordId === word.id) {
                        stop();
                        setPlayingWordId(null);
                        return;
                      }
                      stop();
                      setPlayingWordId(word.id);
                      speak(word.label);
                    }}
                    aria-label={`${isPlaying && playingWordId === word.id ? "Stop" : "Listen to"} ${word.label}`}
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
                  View examples
                </button>
                <label className="grid grid-cols-[auto_1fr] items-center gap-2 border-t border-border pt-3 text-sm font-semibold text-foreground">
                  <span>Status</span>
                  <select
                    value={status}
                    onChange={(event) => setWordStatus(word, event.target.value as StudyWordStatus)}
                    aria-label={`${word.label} learning status`}
                    className={`min-h-11 min-w-0 rounded-xl border px-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      learned
                        ? "border-primary bg-primary text-primary-foreground"
                        : status === "review"
                          ? "border-wp-amber bg-wp-amber/15 text-foreground"
                          : "border-border bg-background text-foreground"
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="learning">Learning</option>
                    <option value="comfortable">Learned</option>
                    <option value="review">Review again</option>
                  </select>
                </label>
              </div>
            </article>
          );
        })}
      </div>
      {visibleWords.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-semibold text-foreground">No words match these filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="mt-2 min-h-11 rounded-xl px-4 font-semibold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Clear filters
          </button>
        </div>
      )}
      <footer className="border border-border bg-background rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <p className="text-sm text-muted-foreground">
          You can return anytime. Your status choices save automatically.
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
        unitId={materials.unitId}
        bilingual={!immersionMode}
        isOpen={!!inspectedWord}
        onClose={() => setInspectedWord(null)}
      />
    </div>
  );
}
