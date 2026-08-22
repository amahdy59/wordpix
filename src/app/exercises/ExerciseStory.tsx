import React, { memo, useRef, useEffect, useMemo, useState } from "react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/lessons";
import { resolveGroup } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { useAudio } from "../shared/useAudio";
import { RICH_CONTEXT_SENTENCES } from "./exerciseContent";
import {
  BookOpen,
  ArrowRight,
  Volume2,
  Square,
  Sparkles,
  MessageSquare,
  Layers,
  Play,
  Info,
} from "lucide-react";
import { WordInspectorModal } from "../shared/WordInspectorModal";
import { getLexiconEntry } from "../data/lexiconDictionary";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

type ContextViewMode = "passage" | "visual-flow" | "dialogue";

export const ExerciseStory = memo(function ExerciseStory({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const group = resolveGroup(lessonId);
  const storyText = group.story || "No reading material available for this lesson yet. Stay tuned!";
  const [viewMode, setViewMode] = useState<ContextViewMode>("passage");
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [inspectedWord, setInspectedWord] = useState<VocabularyItem | null>(null);

  const { speak, stop, isPlaying } = useAudio();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  /**
   * Safely highlight vocabulary words without dangerouslySetInnerHTML.
   * Splits the plain text into segments and wraps matching words in <mark>.
   */
  const segments = useMemo(() => {
    if (!words || words.length === 0) return [storyText];
    const labels = words
      .map((w) => w?.label)
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);
    if (labels.length === 0) return [storyText];
    const escaped = labels.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = new RegExp(`(${escaped.join("|")})`, "gi");

    return storyText.split(pattern);
  }, [storyText, words]);

  const wordMap = useMemo(() => {
    const map = new Map<string, VocabularyItem>();
    (words || []).forEach((w) => {
      if (w?.label) map.set(w.label.toLowerCase(), w);
    });
    return map;
  }, [words]);

  const heroImage = words[0]?.img || "/images/core/hero-banner.webp";

  const handlePlayPassage = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(storyText);
    }
  };

  const handlePlayWord = (wordLabel: string, wordId?: string) => {
    if (wordId) setActiveWordId(wordId);
    speak(wordLabel);
    setTimeout(() => setActiveWordId(null), 1500);
  };

  // Generate a natural two-speaker dialogue using the group vocabulary
  const dialogueLines = useMemo(() => {
    const list = words.slice(0, 4);
    if (list.length < 2) return [];

    return [
      {
        speaker: "Alex",
        text: `Have you seen the new ${list[0]?.label.toLowerCase()} over there?`,
        highlight: list[0]?.label.toLowerCase(),
      },
      {
        speaker: "Sam",
        text: `Yes! It looks great next to the ${list[1]?.label.toLowerCase()}.`,
        highlight: list[1]?.label.toLowerCase(),
      },
      ...(list[2]
        ? [
            {
              speaker: "Alex",
              text: `We should also check the ${list[2]?.label.toLowerCase()} before we finish.`,
              highlight: list[2]?.label.toLowerCase(),
            },
          ]
        : []),
      ...(list[3]
        ? [
            {
              speaker: "Sam",
              text: `Good idea, let's put it near the ${list[3]?.label.toLowerCase()}.`,
              highlight: list[3]?.label.toLowerCase(),
            },
          ]
        : []),
    ];
  }, [words]);

  return (
    <ExerciseShell
      step={step}
      title="Reading & Context"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <BookOpen className="size-3" aria-hidden />
            <span>Multi-Context</span>
          </span>
        </>
      }
      footer={
        <button
          ref={btnRef}
          type="button"
          onClick={() => dispatch({ type: "LESSON_NEXT" })}
          className="flex items-center justify-center gap-2 w-full min-h-[56px] rounded-xl bg-primary text-primary-foreground font-sans font-bold text-base shadow-wp-xs hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Continue
          <ArrowRight className="size-5" aria-hidden />
        </button>
      }
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
        {/* Top Context Mode Switcher */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 bg-secondary/80 p-1.5 rounded-2xl border border-border">
          <button
            type="button"
            onClick={() => setViewMode("passage")}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 px-1.5 sm:px-3 min-h-[44px] min-w-0 rounded-xl font-sans font-bold text-xs sm:text-sm transition-all ${
              viewMode === "passage"
                ? "bg-wp-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="size-3.5 sm:size-4 shrink-0" aria-hidden />
            <span className="truncate">Story Passage</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("visual-flow")}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 px-1.5 sm:px-3 min-h-[44px] min-w-0 rounded-xl font-sans font-bold text-xs sm:text-sm transition-all ${
              viewMode === "visual-flow"
                ? "bg-wp-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-3.5 sm:size-4 shrink-0" aria-hidden />
            <span className="truncate">Visual Flow</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("dialogue")}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 px-1.5 sm:px-3 min-h-[44px] min-w-0 rounded-xl font-sans font-bold text-xs sm:text-sm transition-all ${
              viewMode === "dialogue"
                ? "bg-wp-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="size-3.5 sm:size-4 shrink-0" aria-hidden />
            <span className="truncate">Dialogue</span>
          </button>
        </div>

        {/* VIEW 1: STORY PASSAGE & FULL AUDIO */}
        {viewMode === "passage" && (
          <div className="flex flex-col gap-4">
            {/* Story Card with Scene Image Header & Audio Player */}
            <article
              className="bg-wp-card border border-border rounded-3xl overflow-hidden shadow-wp-xs flex flex-col"
              aria-label="Story passage"
            >
              {/* Scene Picture Banner */}
              <div className="relative h-40 sm:h-52 w-full overflow-hidden bg-muted">
                <img
                  src={heroImage}
                  alt={`${group.name} scene context`}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Banner Text & Audio Button */}
                <div className="absolute bottom-3 start-4 end-4 flex items-end justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-wp-amber flex items-center gap-1">
                      <Sparkles className="size-3" />
                      <span>{group.name} in Context</span>
                    </span>
                    <h2 className="font-sans font-black text-white text-lg sm:text-xl leading-tight drop-shadow-md">
                      {group.name}
                    </h2>
                  </div>

                  {/* Audio Read-Aloud Button */}
                  <button
                    type="button"
                    onClick={handlePlayPassage}
                    aria-label={isPlaying ? "Stop story audio" : "Listen to full story audio"}
                    className={`flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full font-sans font-bold text-xs sm:text-sm shadow-lg transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white ${
                      isPlaying
                        ? "bg-wp-rose text-white hover:bg-wp-rose/90 animate-pulse"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="size-4 fill-current" aria-hidden />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="size-4" aria-hidden />
                        <span>Listen Aloud</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Story Narrative Text */}
              <div className="p-5 sm:p-7">
                <p className="font-sans text-foreground text-base sm:text-lg leading-relaxed">
                  {segments.map((seg, i) => {
                    const matchedWord = wordMap.get(seg.toLowerCase());
                    if (matchedWord) {
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handlePlayWord(matchedWord.label, matchedWord.id)}
                          aria-label={`Pronounce ${matchedWord.label}`}
                          className={`cursor-pointer inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-bold not-italic transition-all mx-0.5 border ${
                            activeWordId === matchedWord.id
                              ? "bg-primary text-primary-foreground scale-105 border-primary"
                              : "bg-primary/10 text-primary hover:bg-primary/20 border-primary/30"
                          }`}
                        >
                          <mark className="bg-transparent text-inherit font-bold not-italic p-0 m-0">
                            {seg}
                          </mark>
                          <Volume2 className="size-3 opacity-60" aria-hidden />
                        </button>
                      );
                    }
                    return <React.Fragment key={i}>{seg}</React.Fragment>;
                  })}
                </p>
              </div>
            </article>

            {/* Interactive Vocabulary Chips with Audio */}
            <div className="bg-secondary/60 border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Volume2 className="size-3.5 text-primary" />
                  <span>Tap any word to hear pronunciation</span>
                </p>
                <span className="text-[11px] font-sans font-semibold text-muted-foreground">
                  {words.length} words
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {words.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handlePlayWord(w.label, w.id)}
                    aria-label={`Listen to ${w.label}`}
                    className={`flex items-center gap-1.5 font-sans font-semibold text-xs sm:text-sm px-3 py-1.5 min-h-[36px] rounded-full border transition-all ${
                      activeWordId === w.id
                        ? "bg-primary text-primary-foreground border-primary scale-105 shadow-sm"
                        : "bg-wp-card text-foreground hover:border-primary/50 border-border hover:bg-primary/5"
                    }`}
                  >
                    <span className="capitalize">{w.label.toLowerCase()}</span>
                    <Volume2 className="size-3.5 text-muted-foreground" aria-hidden />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: VISUAL FLOW & REAL-WORLD SENTENCE CARDS */}
        {viewMode === "visual-flow" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-sans font-bold text-foreground text-sm flex items-center gap-1.5">
                <Layers className="size-4 text-primary" />
                <span>Visual Real-World Contexts</span>
              </h3>
              <span className="text-xs text-muted-foreground font-sans">
                {words.length} visual examples
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {words.map((word) => {
                const rich = RICH_CONTEXT_SENTENCES[word.id];
                const entry = getLexiconEntry(word.id, word.label);
                return (
                  <div
                    key={word.id}
                    className="bg-wp-card border border-border rounded-2xl p-4 shadow-wp-xs flex flex-col gap-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setInspectedWord(word)}
                        aria-label={`Inspect ${word.label}`}
                        className="size-16 rounded-xl overflow-hidden shrink-0 border border-border bg-muted relative group cursor-pointer"
                      >
                        <img
                          src={word.img}
                          alt=""
                          className="size-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Info className="size-4 text-white drop-shadow" />
                        </div>
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-sans font-bold text-foreground text-base capitalize truncate">
                            {word.label.toLowerCase()}
                          </h4>
                          <span
                            className="text-[11px] font-arabic font-bold text-primary"
                            dir="rtl"
                          >
                            {entry.arabic}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-muted-foreground">{word.phonetic}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handlePlayWord(word.label, word.id)}
                          aria-label={`Pronounce ${word.label}`}
                          className="size-9 rounded-xl bg-secondary text-primary border border-primary/20 hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors"
                        >
                          <Volume2 className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setInspectedWord(word)}
                          aria-label={`Open details for ${word.label}`}
                          className="size-9 rounded-xl bg-wp-card text-muted-foreground border border-border hover:text-foreground flex items-center justify-center shrink-0 transition-colors"
                        >
                          <Info className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Collocations badges */}
                    {entry.collocations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {entry.collocations.slice(0, 2).map((col, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => speak(col)}
                            aria-label={`Listen to phrase: ${col}`}
                            className="text-[11px] font-sans font-medium bg-secondary text-foreground px-2 py-0.5 rounded-lg border border-border hover:border-primary/40 flex items-center gap-1"
                          >
                            <span>{col}</span>
                            <Volume2 className="size-2.5 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    )}

                    {(rich?.full || entry.exampleSentence) && (
                      <div className="flex flex-col gap-1 bg-muted/40 p-2.5 rounded-xl border border-border/50">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-sans text-xs text-foreground/90 leading-relaxed">
                            &ldquo;{rich?.full || entry.exampleSentence}&rdquo;
                          </p>
                          <button
                            type="button"
                            onClick={() => speak(rich?.full || entry.exampleSentence)}
                            aria-label="Listen to sentence"
                            className="size-7 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors"
                          >
                            <Volume2 className="size-3" />
                          </button>
                        </div>
                        {(entry.exampleArabic || entry.sentences[0]?.ar) && (
                          <p className="font-arabic text-[11px] text-muted-foreground" dir="rtl">
                            {entry.exampleArabic || entry.sentences[0]?.ar}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: REAL-LIFE CONVERSATIONAL DIALOGUE */}
        {viewMode === "dialogue" && (
          <div className="flex flex-col gap-4">
            <div className="bg-wp-card border border-border rounded-3xl p-5 sm:p-6 shadow-wp-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-4 text-primary" />
                  <h3 className="font-sans font-bold text-foreground text-sm">
                    Casual Conversation Practice
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fullDialogue = dialogueLines
                      .map((d) => `${d.speaker} says: ${d.text}`)
                      .join(". ");
                    speak(fullDialogue);
                  }}
                  className="flex items-center gap-1.5 text-xs font-sans font-bold text-primary bg-secondary px-3 py-1.5 rounded-xl border border-primary/20 hover:bg-primary/10"
                >
                  <Play className="size-3.5" />
                  <span>Play Dialogue</span>
                </button>
              </div>

              {/* Dialogue bubbles */}
              <div className="flex flex-col gap-3">
                {dialogueLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col gap-1 ${
                      line.speaker === "Alex" ? "items-start" : "items-end"
                    }`}
                  >
                    <span className="text-[11px] font-sans font-bold text-muted-foreground px-2">
                      {line.speaker}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed flex items-center gap-2.5 shadow-wp-xs ${
                        line.speaker === "Alex"
                          ? "bg-secondary text-foreground rounded-tl-sm border border-border"
                          : "bg-primary text-primary-foreground rounded-tr-sm"
                      }`}
                    >
                      <p className="flex-1">{line.text}</p>
                      <button
                        type="button"
                        onClick={() => speak(line.text)}
                        aria-label={`Play line by ${line.speaker}`}
                        className={`size-7 rounded-lg flex items-center justify-center shrink-0 transition-opacity hover:opacity-80 ${
                          line.speaker === "Alex"
                            ? "bg-wp-card text-primary border border-border"
                            : "bg-white/20 text-white"
                        }`}
                      >
                        <Volume2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Retention Active Production Prompt */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Sparkles className="size-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-sans font-bold text-foreground text-sm">
                  Active Recall Challenge
                </h4>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">
                  Try forming your own sentence using one of the words above before continuing!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <WordInspectorModal
        word={inspectedWord}
        isOpen={!!inspectedWord}
        onClose={() => setInspectedWord(null)}
      />
    </ExerciseShell>
  );
});
