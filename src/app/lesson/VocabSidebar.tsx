import { memo, useState } from "react";
import { AudioButton } from "../shared/AudioButton";
import { WordImage } from "../shared/WordImage";
import { BEDROOM_TOPICS, type VocabItem } from "../data/lessons";
import { X } from "lucide-react";

interface Props {
  vocabulary: VocabItem[];
  activeWord: VocabItem;
  activeId: string;
  isPlaying: boolean;
  isError: boolean;
  onSelectWord: (id: string) => void;
  onLearnWord: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const VocabSidebar = memo(function VocabSidebar({
  vocabulary,
  activeWord,
  activeId,
  isPlaying,
  isError,
  onSelectWord,
  onLearnWord,
  mobileOpen = false,
  onMobileClose,
}: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const filteredVocabulary = selectedTopic === "all"
    ? vocabulary
    : vocabulary.filter((v) => v.topic === selectedTopic);

  return (
    <aside
      className={`${mobileOpen ? "fixed inset-0 z-50 flex" : "hidden"} md:static md:flex flex-col min-h-0 max-h-svh w-full md:w-80 lg:w-96 xl:w-[420px] bg-wp-card border-l border-border h-full overflow-hidden overscroll-none shrink-0`}
      aria-label="Bedroom vocabulary list"
      aria-modal={mobileOpen || undefined}
      role={mobileOpen ? "dialog" : undefined}
    >
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-sans font-bold text-foreground text-base">The Bedroom Vocabulary</h2>
            <p className="font-sans text-muted-foreground text-xs mt-0.5">
              {filteredVocabulary.length} words · Select to view &amp; listen
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sans font-semibold text-xs px-2.5 py-1 rounded-full bg-secondary text-primary">
              Level 1 · A1
            </span>
            {mobileOpen && (
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Close vocabulary browser"
                className="md:hidden size-11 rounded-xl border border-border flex items-center justify-center"
              >
                <X className="size-5" aria-hidden />
              </button>
            )}
          </div>
        </div>

        {/* Topic Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar" aria-label="Filter vocabulary by topic">
          <button
            type="button"
            aria-pressed={selectedTopic === "all"}
            onClick={() => setSelectedTopic("all")}
            className={`px-3 py-1 rounded-full text-xs font-sans font-semibold shrink-0 transition-colors ${
              selectedTopic === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({vocabulary.length})
          </button>
          {BEDROOM_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              aria-pressed={selectedTopic === topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`px-3 py-1 rounded-full text-xs font-sans font-semibold shrink-0 transition-colors ${
                selectedTopic === topic.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable vocabulary word list — isolated scrolling */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-3 px-3 flex flex-col gap-1.5"
        role="list"
        aria-label="Vocabulary words"
      >
        {filteredVocabulary.map((word) => {
          const isActive = word.id === activeId;
          const isAudioPlaying = isPlaying && isActive;
          return (
            <div
              key={word.id}
              role="listitem"
              className={[
                "w-full rounded-xl border p-2 flex items-center gap-2",
                "motion-safe:transition-all group",
                isActive
                  ? "bg-secondary border-primary border-[2px] shadow-wp-xs"
                  : "bg-background border-border hover:border-primary/40 hover:bg-secondary/40",
              ].join(" ")}
            >
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelectWord(word.id)}
                className="flex flex-1 items-center gap-3 min-w-0 text-left rounded-lg focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary"
              >
                <div className="size-[56px] rounded-lg overflow-hidden shrink-0 border border-border bg-muted flex items-center justify-center">
                  <WordImage word={word} width="56" height="56" className="size-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`font-sans font-bold text-base truncate ${isActive ? "text-primary" : "text-foreground"}`}>{word.label}</span>
                    {word.hotspot && <span className="text-[10px] font-sans font-semibold text-wp-green bg-wp-green-light rounded-full px-1.5 py-0.5 shrink-0" aria-label="Visible in scene">in scene</span>}
                  </div>
                  <p className="font-sans text-muted-foreground text-xs">/{word.phonetic}/</p>
                </div>
              </button>
              <AudioButton
                onPlay={() => onSelectWord(word.id)}
                isPlaying={isAudioPlaying}
                isError={isError}
                label={`Play pronunciation of ${word.label}`}
                size="sm"
              />
            </div>
          );
        })}
      </div>

      {/* Active word detail card + CTA */}
      <div className="shrink-0 border-t border-border p-4 bg-secondary/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-12 rounded-xl overflow-hidden border border-border shrink-0 bg-muted">
            <WordImage word={activeWord} width="48" height="48" className="size-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans font-black text-foreground text-xl leading-none">{activeWord.label}</p>
            <p className="font-sans font-medium text-muted-foreground text-xs mt-1">/{activeWord.phonetic}/</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLearnWord}
          className="w-full bg-wp-blue rounded-xl py-3.5 font-sans font-bold text-white text-base min-h-[52px]
            focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
            motion-safe:transition-opacity hover:opacity-90 active:opacity-80 shadow-wp-xs"
        >
          Learn &ldquo;{activeWord.label}&rdquo; →
        </button>
      </div>
    </aside>
  );
});
