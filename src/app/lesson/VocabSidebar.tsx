import { memo, useState } from "react";
import { AudioButton } from "../shared/AudioButton";
import { BEDROOM_TOPICS, type VocabItem } from "../data/lessons";

interface Props {
  vocabulary: VocabItem[];
  activeWord: VocabItem;
  activeId: string;
  isPlaying: boolean;
  isError: boolean;
  onSelectWord: (id: string) => void;
  onLearnWord: () => void;
}

export const VocabSidebar = memo(function VocabSidebar({
  vocabulary,
  activeWord,
  activeId,
  isPlaying,
  isError,
  onSelectWord,
  onLearnWord,
}: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const filteredVocabulary = selectedTopic === "all"
    ? vocabulary
    : vocabulary.filter((v) => v.topic === selectedTopic);

  return (
    <aside
      className="hidden md:flex flex-col w-80 lg:w-96 xl:w-[420px] bg-wp-card border-l border-border h-full overflow-hidden shrink-0"
      aria-label="Bedroom vocabulary list"
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
          <span className="font-sans font-semibold text-xs px-2.5 py-1 rounded-full bg-secondary text-primary">
            Level 1 · A1
          </span>
        </div>

        {/* Topic Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar" role="tablist" aria-label="Vocabulary Topics">
          <button
            type="button"
            role="tab"
            aria-selected={selectedTopic === "all"}
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
              role="tab"
              aria-selected={selectedTopic === topic.id}
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
        className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-1.5"
        role="list"
        aria-label="Vocabulary words"
      >
        {filteredVocabulary.map((word) => {
          const isActive = word.id === activeId;
          const isAudioPlaying = isPlaying && isActive;
          return (
            <button
              key={word.id}
              type="button"
              role="listitem"
              aria-selected={isActive}
              onClick={() => onSelectWord(word.id)}
              className={[
                "w-full text-left rounded-xl border p-3 flex items-center gap-3 cursor-pointer",
                "motion-safe:transition-all group focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary",
                isActive
                  ? "bg-secondary border-primary border-[2px] shadow-wp-xs"
                  : "bg-background border-border hover:border-primary/40 hover:bg-secondary/40",
              ].join(" ")}
            >
              {/* Thumbnail */}
              <div className="size-[56px] rounded-lg overflow-hidden shrink-0 border border-border bg-muted flex items-center justify-center">
                <img
                  src={word.img}
                  alt={word.label}
                  className="size-full object-cover"
                />
              </div>

              {/* Word information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={`font-sans font-bold text-base truncate ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {word.label}
                  </span>
                  {word.hotspot && (
                    <span
                      className="text-[10px] font-sans font-semibold text-wp-green bg-wp-green-light rounded-full px-1.5 py-0.5 shrink-0"
                      aria-label="Visible in scene"
                    >
                      in scene
                    </span>
                  )}
                </div>
                <p className="font-sans text-muted-foreground text-xs">
                  /{word.phonetic}/
                </p>
              </div>

              {/* Audio button */}
              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                <AudioButton
                  onPlay={() => onSelectWord(word.id)}
                  isPlaying={isAudioPlaying}
                  isError={isError}
                  label={`Play pronunciation of ${word.label}`}
                  size="sm"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active word detail card + CTA */}
      <div className="shrink-0 border-t border-border p-4 bg-secondary/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-12 rounded-xl overflow-hidden border border-border shrink-0 bg-muted">
            <img
              src={activeWord.img}
              alt={activeWord.label}
              className="size-full object-cover"
            />
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
