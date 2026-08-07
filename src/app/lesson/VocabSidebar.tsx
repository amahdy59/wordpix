import { memo, useState } from "react";
import { AudioButton } from "../shared/AudioButton";
import { WordImage } from "../shared/WordImage";
import { BEDROOM_TOPICS, type VocabItem } from "../data/lessons";
import { useProgress } from "../data/progress";
import { type MasteryLevel } from "../context/LearnerContext";
import { useAudio } from "../shared/useAudio";
import { X, CheckCircle2 } from "lucide-react";

interface Props {
  vocabulary: VocabItem[];
  /** Reserved for callers that pass the active word; the list renders from activeId. */
  activeWord?: VocabItem;
  activeId: string;
  isPlaying: boolean;
  isError: boolean;
  onSelectWord: (id: string) => void;
  onLearnWord: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const MASTERY_BADGES: Record<MasteryLevel, { label: string; bg: string; text: string } | null> = {
  0: null,
  1: { label: "Recognized", bg: "bg-wp-brand/10", text: "text-primary border-wp-brand/20" },
  2: { label: "Practiced", bg: "bg-wp-amber/10", text: "text-wp-amber border-wp-amber/20" },
  3: { label: "Mastered", bg: "bg-wp-teal/10", text: "text-wp-teal border-wp-teal/20" },
};

export const VocabSidebar = memo(function VocabSidebar({
  vocabulary,
  activeWord: _activeWord,
  activeId,
  isPlaying,
  isError,
  onSelectWord,
  onLearnWord,
  mobileOpen = false,
  onMobileClose,
}: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const { progress } = useProgress();
  const { speak } = useAudio();

  const filteredVocabulary = selectedTopic === "all"
    ? vocabulary
    : vocabulary.filter((v) => v.topic === selectedTopic);

  return (
    <aside
      className={`${mobileOpen ? "fixed inset-0 z-50 flex" : "hidden"} md:static md:flex flex-col min-h-0 max-h-svh w-full md:w-80 lg:w-96 xl:w-[420px] bg-wp-card border-s border-border h-full overflow-hidden overscroll-none shrink-0`}
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
                <X className="size-5" />
              </button>
            )}
          </div>
        </div>

        {/* Topic Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedTopic("all")}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold shrink-0 transition-all ${
              selectedTopic === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({vocabulary.length})
          </button>
          {BEDROOM_TOPICS.map((topic) => {
            const count = vocabulary.filter((v) => v.topic === topic.id).length;
            const isSelected = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic.id)}
                className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold shrink-0 transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {topic.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Vocabulary items list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {filteredVocabulary.map((word) => {
          const isSelected = word.id === activeId;
          const levelNum = progress.wordMastery[word.id] || 0;
          const badge = MASTERY_BADGES[levelNum as MasteryLevel];

          return (
            /*
              The row was a <div onClick>: not focusable, not keyboard-operable,
              and invisible to assistive tech as a control. It cannot simply
              become a <button> because it contains AudioButton, and nesting
              buttons is invalid HTML. So the row stays a container and the
              word-selection area becomes its own button, with the audio control
              as a sibling — two distinct actions, two distinct controls.
            */
            <div
              key={word.id}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                isSelected
                  ? "bg-secondary border-primary border-[2px] shadow-wp-xs"
                  : "bg-wp-card border-border hover:border-primary/40"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectWord(word.id)}
                aria-pressed={isSelected}
                aria-label={`Select ${word.label}`}
                className="flex items-center gap-3 flex-1 min-w-0 text-start min-h-[44px] rounded-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <div className="relative rounded-xl shrink-0 size-12 overflow-hidden border border-border bg-muted">
                  <WordImage word={word} width="48" height="48" className="size-full object-cover" />
                  {levelNum === 3 && (
                    <div className="absolute top-1 end-1 bg-wp-green text-wp-text-on-green p-0.5 rounded-full">
                      <CheckCircle2 className="size-3" aria-hidden />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans font-bold text-foreground text-sm">{word.label}</span>
                    {badge && (
                      <span className={`font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <span className="font-sans text-muted-foreground text-xs font-medium">/{word.phonetic}/</span>
                </div>
              </button>

              <AudioButton
                onPlay={() => speak(word.label)}
                label={word.label}
                size="sm"
                isPlaying={isSelected && isPlaying}
                isError={isSelected && isError}
              />
            </div>
          );
        })}
      </div>

      {/* Panel footer CTA */}
      <div className="p-4 border-t border-border shrink-0 bg-wp-card">
        <button
          type="button"
          onClick={onLearnWord}
          className="w-full bg-wp-blue hover:opacity-90 active:opacity-80 rounded-xl py-3.5 font-sans font-bold text-wp-text-on-blue text-sm min-h-[48px]
            focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
            shadow-wp-xs transition-all flex items-center justify-center gap-2"
        >
          <span>Start Group Practice →</span>
        </button>
      </div>
    </aside>
  );
});
