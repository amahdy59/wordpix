import React, { memo, useRef, useEffect, useMemo, useState, useCallback } from "react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/lessons";
import { resolveGroup } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { playCorrectSound, playIncorrectSound } from "../shared/useSound";
import { useAudio } from "../shared/useAudio";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Square,
  Sparkles,
  MessageSquare,
  Layers,
  Play,
  Info,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Languages,
  Award,
  ChevronRight,
  Check,
} from "lucide-react";
import { WordInspectorModal } from "../shared/WordInspectorModal";
import { getOrGenerateStoryBundle } from "../data/storyTalesDictionary";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

export type ContextSection = "passage" | "visual-flow" | "dialogue" | "story-tales" | "story-quiz";

export const ExerciseStory = memo(function ExerciseStory({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const group = resolveGroup(lessonId);
  const storyText = group.story || "No reading material available for this lesson yet. Stay tuned!";
  const [activeSection, setActiveSection] = useState<ContextSection>("passage");
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [inspectedWord, setInspectedWord] = useState<VocabularyItem | null>(null);
  const [expandedTranslations, setExpandedTranslations] = useState<Record<number, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);

  const { speak, stop, isPlaying } = useAudio();
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Focus next button on section change
  useEffect(() => {
    nextBtnRef.current?.focus();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Retrieve or generate 3-passage story & comprehension quiz
  const storyBundle = useMemo(() => {
    return getOrGenerateStoryBundle(group.id, group.name, words);
  }, [group.id, group.name, words]);

  const wordMap = useMemo(() => {
    const map = new Map<string, VocabularyItem>();
    (words || []).forEach((w) => {
      if (w?.label) map.set(w.label.toLowerCase(), w);
    });
    return map;
  }, [words]);

  const heroImage = words[0]?.img || "./word-images/bed.webp";

  const handlePlayWord = (wordLabel: string, wordId?: string) => {
    if (wordId) setActiveWordId(wordId);
    speak(wordLabel);
    setTimeout(() => setActiveWordId(null), 1500);
  };

  /**
   * Helper to highlight vocabulary words with interactive audio buttons
   */
  const renderHighlightedText = (text: string) => {
    if (!words || words.length === 0) return text;
    const labels = words
      .map((w) => w?.label)
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);
    if (labels.length === 0) return text;
    const escaped = labels.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = new RegExp("(" + escaped.join("|") + ")", "gi");

    const segs = text.split(pattern);
    return segs.map((seg, i) => {
      const matchedWord = wordMap.get(seg.toLowerCase());
      if (matchedWord) {
        return (
          <button
            key={i}
            type="button"
            onClick={() => handlePlayWord(matchedWord.label, matchedWord.id)}
            aria-label={"Pronounce " + matchedWord.label}
            className={
              "cursor-pointer inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-bold not-italic transition-all mx-0.5 border " +
              (activeWordId === matchedWord.id
                ? "bg-primary text-primary-foreground scale-105 border-primary"
                : "bg-primary/10 text-primary hover:bg-primary/20 border-primary/30")
            }
          >
            <mark className="bg-transparent text-inherit font-bold not-italic p-0 m-0">{seg}</mark>
            <Volume2 className="size-3 opacity-60" aria-hidden />
          </button>
        );
      }
      return <React.Fragment key={i}>{seg}</React.Fragment>;
    });
  };

  // Generate a natural two-speaker dialogue using the group vocabulary
  const dialogueLines = useMemo(() => {
    const list = words.slice(0, 4);
    if (list.length < 2) return [];

    return [
      {
        speaker: "Alex",
        text: "Have you seen the new " + list[0]?.label.toLowerCase() + " over there?",
        highlight: list[0]?.label.toLowerCase(),
      },
      {
        speaker: "Sam",
        text: "Yes! It looks great next to the " + list[1]?.label.toLowerCase() + ".",
        highlight: list[1]?.label.toLowerCase(),
      },
      ...(list[2]
        ? [
            {
              speaker: "Alex",
              text:
                "We should also check the " + list[2]?.label.toLowerCase() + " before we finish.",
              highlight: list[2]?.label.toLowerCase(),
            },
          ]
        : []),
      ...(list[3]
        ? [
            {
              speaker: "Sam",
              text: "Good idea, let's put it near the " + list[3]?.label.toLowerCase() + ".",
              highlight: list[3]?.label.toLowerCase(),
            },
          ]
        : []),
    ];
  }, [words]);

  const toggleTranslation = (partIdx: number) => {
    setExpandedTranslations((prev) => ({
      ...prev,
      [partIdx]: !prev[partIdx],
    }));
  };

  const handleSelectQuizAnswer = useCallback(
    (questionId: string, optionIdx: number) => {
      setQuizAnswers((prev) => {
        // Prevent clicking again if already answered
        if (prev[questionId] !== undefined) return prev;

        const q = storyBundle.quiz.find((q) => q.id === questionId);
        if (q) {
          if (q.correctIndex === optionIdx) {
            playCorrectSound();
          } else {
            playIncorrectSound();
          }
          // Voice feedback to make application more interactive
          speak(q.explanation);
        }

        return {
          ...prev,
          [questionId]: optionIdx,
        };
      });
    },
    [storyBundle.quiz, speak]
  );

  // Keyboard number hotkeys (1, 2, 3, 4) for active quiz question
  useEffect(() => {
    if (activeSection !== "story-quiz") return;
    const activeQ = storyBundle.quiz[activeQuizIndex];
    if (!activeQ) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside inputs
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= activeQ.options.length) {
        e.preventDefault();
        handleSelectQuizAnswer(activeQ.id, num - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection, activeQuizIndex, storyBundle.quiz, handleSelectQuizAnswer]);

  const score = useMemo(() => {
    return storyBundle.quiz.reduce((acc, q) => {
      return quizAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
    }, 0);
  }, [storyBundle.quiz, quizAnswers]);

  const answeredCount = Object.keys(quizAnswers).length;
  const isQuizComplete = answeredCount === storyBundle.quiz.length;

  const footerContent = (
    <div className="w-full">
      {activeSection === "passage" && (
        <button
          ref={nextBtnRef}
          type="button"
          onClick={() => setActiveSection("visual-flow")}
          className="flex items-center justify-center gap-2 w-full min-h-[56px] rounded-2xl bg-primary text-primary-foreground font-sans font-bold text-base shadow-wp-xs hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        >
          <span>Next: Explore Visual Flow</span>
          <ArrowRight className="size-5" aria-hidden />
        </button>
      )}

      {activeSection === "visual-flow" && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveSection("passage")}
            className="flex items-center justify-center gap-1.5 px-4 min-h-[56px] rounded-2xl bg-secondary text-foreground border border-border font-sans font-bold text-sm hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span>Previous</span>
          </button>
          <button
            ref={nextBtnRef}
            type="button"
            onClick={() => setActiveSection("dialogue")}
            className="flex-1 flex items-center justify-center gap-2 min-h-[56px] rounded-2xl bg-primary text-primary-foreground font-sans font-bold text-base shadow-wp-xs hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            <span>Next: Conversational Dialogue</span>
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      )}

      {activeSection === "dialogue" && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveSection("visual-flow")}
            className="flex items-center justify-center gap-1.5 px-4 min-h-[56px] rounded-2xl bg-secondary text-foreground border border-border font-sans font-bold text-sm hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span>Previous</span>
          </button>
          <button
            ref={nextBtnRef}
            type="button"
            onClick={() => setActiveSection("story-tales")}
            className="flex-1 flex items-center justify-center gap-2 min-h-[56px] rounded-2xl bg-primary text-primary-foreground font-sans font-bold text-base shadow-wp-xs hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            <span>Next: 3-Part Extended Story</span>
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      )}

      {activeSection === "story-tales" && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveSection("dialogue")}
            className="flex items-center justify-center gap-1.5 px-4 min-h-[56px] rounded-2xl bg-secondary text-foreground border border-border font-sans font-bold text-sm hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span>Previous</span>
          </button>
          <button
            ref={nextBtnRef}
            type="button"
            onClick={() => {
              setActiveSection("story-quiz");
              setActiveQuizIndex(0);
            }}
            className="flex-1 flex items-center justify-center gap-2 min-h-[56px] rounded-2xl bg-primary text-primary-foreground font-sans font-bold text-base shadow-wp-xs hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            <span>Next: Take Story &amp; Vocabulary Quiz</span>
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      )}

      {activeSection === "story-quiz" && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveSection("story-tales")}
            className="flex items-center justify-center gap-1.5 px-4 min-h-[56px] rounded-2xl bg-secondary text-foreground border border-border font-sans font-bold text-sm hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span>Review Story</span>
          </button>
          <button
            ref={nextBtnRef}
            type="button"
            onClick={() => dispatch({ type: "LESSON_NEXT" })}
            className="flex-1 flex items-center justify-center gap-2 min-h-[56px] rounded-2xl bg-primary text-primary-foreground font-sans font-bold text-base shadow-wp-xs hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            <span>Complete Story Suite &amp; Continue</span>
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );

  const storyProgress = useMemo(() => {
    switch (activeSection) {
      case "passage":
        return { current: 1, total: 5 };
      case "visual-flow":
        return { current: 2, total: 5 };
      case "dialogue":
        return { current: 3, total: 5 };
      case "story-tales":
        return { current: 4, total: 5 };
      case "story-quiz": {
        const quizFrac = answeredCount / Math.max(1, storyBundle.quiz.length);
        return { current: Math.min(5, Math.round((4 + quizFrac) * 10) / 10), total: 5 };
      }
      default:
        return { current: 1, total: 5 };
    }
  }, [activeSection, answeredCount, storyBundle.quiz.length]);

  return (
    <ExerciseShell
      step={step}
      title="Context &amp; Story Suite"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      progress={storyProgress}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <BookOpen className="size-3" aria-hidden />
            <span>Mastery Suite</span>
          </span>
        </>
      }
      footer={footerContent}
    >
      <div
        ref={scrollContainerRef}
        className="w-full max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-4 pb-6"
      >
        {/* Top 5-Section Sequential Stepper Navigation */}
        <nav
          aria-label="Story and context sections"
          className="flex items-center gap-1 sm:gap-1.5 bg-secondary/90 p-1.5 rounded-2xl border border-border overflow-x-auto scrollbar-none"
        >
          <button
            type="button"
            onClick={() => setActiveSection("passage")}
            aria-current={activeSection === "passage" ? "step" : undefined}
            className={
              "flex-1 min-w-[90px] sm:min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 min-h-[44px] rounded-xl font-sans font-bold text-xs transition-all cursor-pointer " +
              (activeSection === "passage"
                ? "bg-wp-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <BookOpen className="size-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate">1. Scene</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("visual-flow")}
            aria-current={activeSection === "visual-flow" ? "step" : undefined}
            className={
              "flex-1 min-w-[95px] sm:min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 min-h-[44px] rounded-xl font-sans font-bold text-xs transition-all cursor-pointer " +
              (activeSection === "visual-flow"
                ? "bg-wp-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <Layers className="size-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate">2. Visual Flow</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("dialogue")}
            aria-current={activeSection === "dialogue" ? "step" : undefined}
            className={
              "flex-1 min-w-[85px] sm:min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 min-h-[44px] rounded-xl font-sans font-bold text-xs transition-all cursor-pointer " +
              (activeSection === "dialogue"
                ? "bg-wp-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <MessageSquare className="size-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate">3. Dialogue</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("story-tales")}
            aria-current={activeSection === "story-tales" ? "step" : undefined}
            className={
              "flex-1 min-w-[95px] sm:min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 min-h-[44px] rounded-xl font-sans font-bold text-xs transition-all cursor-pointer " +
              (activeSection === "story-tales"
                ? "bg-wp-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <Sparkles className="size-3.5 shrink-0 text-wp-amber" aria-hidden />
            <span className="truncate">4. 3-Part Story</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("story-quiz")}
            aria-current={activeSection === "story-quiz" ? "step" : undefined}
            className={
              "flex-1 min-w-[85px] sm:min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 min-h-[44px] rounded-xl font-sans font-bold text-xs transition-all cursor-pointer " +
              (activeSection === "story-quiz"
                ? "bg-wp-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <HelpCircle className="size-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate">5. Quiz</span>
          </button>
        </nav>

        {/* ── SECTION 1: SCENE OVERVIEW PASSAGE ───────────────────────────── */}
        {activeSection === "passage" && (
          <div className="flex flex-col gap-4">
            <article
              className="bg-wp-card border border-border rounded-3xl overflow-hidden shadow-wp-xs flex flex-col"
              aria-label="Story passage"
            >
              <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-muted">
                <img
                  src={heroImage}
                  alt={group.name + " scene context"}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

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

                  <button
                    type="button"
                    onClick={() => {
                      if (isPlaying) stop();
                      else speak(storyText);
                    }}
                    aria-label={isPlaying ? "Stop story audio" : "Listen to full story audio"}
                    className={
                      "flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full font-sans font-bold text-xs sm:text-sm shadow-lg transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white cursor-pointer " +
                      (isPlaying
                        ? "bg-wp-rose text-white hover:bg-wp-rose/90 motion-safe:animate-pulse"
                        : "bg-primary text-primary-foreground hover:opacity-90")
                    }
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

              <div className="p-5 sm:p-6 flex flex-col gap-3">
                <p className="font-sans text-foreground text-base sm:text-lg leading-relaxed">
                  {renderHighlightedText(storyText)}
                </p>
                <div className="flex items-center gap-2 text-xs font-sans font-medium text-muted-foreground pt-2 border-t border-border/60">
                  <Info className="size-3.5 text-primary shrink-0" />
                  <span>Tap any highlighted word to hear its accurate native pronunciation.</span>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* ── SECTION 2: VISUAL VOCABULARY FLOW ───────────────────────────── */}
        {activeSection === "visual-flow" && (
          <div className="flex flex-col gap-4">
            <div className="bg-wp-card border border-border rounded-3xl p-5 sm:p-6 shadow-wp-xs flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <h3 className="font-sans font-bold text-foreground text-sm">
                  Interactive Word Explorer ({words.length} items)
                </h3>
              </div>
              <p className="font-sans text-xs text-muted-foreground">
                Tap any card to view authentic Oxford/Cambridge dictionary insights, collocations,
                and real-world context sentences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {words.map((item) => {
                const isActive = activeWordId === item.id;
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    className={
                      "bg-wp-card border rounded-2xl p-3 flex flex-col items-center gap-2.5 shadow-wp-xs transition-all text-center hover:border-primary/50 cursor-pointer " +
                      (isActive
                        ? "border-primary ring-2 ring-primary/20 bg-secondary"
                        : "border-border")
                    }
                    onClick={() => setInspectedWord(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setInspectedWord(item);
                      }
                    }}
                  >
                    <div className="size-20 sm:size-24 rounded-xl overflow-hidden bg-muted shrink-0 border border-border relative">
                      <img src={item.img} alt={item.label} className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayWord(item.label, item.id);
                        }}
                        aria-label={"Listen to " + item.label}
                        className="absolute bottom-1.5 end-1.5 size-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-90"
                      >
                        <Volume2 className="size-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-sans font-bold text-foreground text-sm leading-tight">
                        {item.label}
                      </span>
                      {item.phonetic && (
                        <span className="font-mono text-[11px] text-muted-foreground">
                          /{item.phonetic}/
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SECTION 3: CASUAL CONVERSATION DIALOGUE ─────────────────────── */}
        {activeSection === "dialogue" && (
          <div className="flex flex-col gap-4">
            <div className="bg-wp-card border border-border rounded-3xl p-5 sm:p-6 shadow-wp-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-4 text-primary" />
                  <h3 className="font-sans font-bold text-foreground text-sm">
                    Casual Conversation Practice (Alex &amp; Sam)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fullDialogue = dialogueLines
                      .map((d) => d.speaker + " says: " + d.text)
                      .join(". ");
                    speak(fullDialogue);
                  }}
                  className="flex items-center gap-1.5 text-xs font-sans font-bold text-primary bg-secondary px-3 py-1.5 rounded-xl border border-primary/20 hover:bg-primary/10 cursor-pointer min-h-[36px]"
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
                    className={
                      "flex flex-col gap-1 " +
                      (line.speaker === "Alex" ? "items-start" : "items-end")
                    }
                  >
                    <span className="text-[11px] font-sans font-bold text-muted-foreground px-2">
                      {line.speaker}
                    </span>
                    <div
                      className={
                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed flex items-center gap-2.5 shadow-wp-xs " +
                        (line.speaker === "Alex"
                          ? "bg-secondary text-foreground rounded-tl-sm border border-border"
                          : "bg-primary text-primary-foreground rounded-tr-sm")
                      }
                    >
                      <p className="flex-1">{line.text}</p>
                      <button
                        type="button"
                        onClick={() => speak(line.text)}
                        aria-label={"Play line by " + line.speaker}
                        className={
                          "size-7 rounded-lg flex items-center justify-center shrink-0 transition-opacity hover:opacity-80 cursor-pointer " +
                          (line.speaker === "Alex"
                            ? "bg-wp-card text-primary border border-border"
                            : "bg-white/20 text-white")
                        }
                      >
                        <Volume2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Sparkles className="size-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-sans font-bold text-foreground text-sm">Active Spoken Drill</h4>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">
                  Try reading the dialogue aloud with Alex &amp; Sam to build natural English
                  fluency.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 4: 3-PASSAGE EXTENDED NARRATIVE STORY ──────────────── */}
        {activeSection === "story-tales" && (
          <div className="flex flex-col gap-4">
            {/* Story Header Banner */}
            <div className="bg-gradient-to-r from-primary/15 via-secondary to-primary/10 border border-primary/20 rounded-3xl p-5 sm:p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-8 rounded-xl bg-wp-amber/20 text-wp-amber flex items-center justify-center">
                    <Sparkles className="size-4" />
                  </span>
                  <div>
                    <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-primary">
                      Extended 3-Part Story
                    </span>
                    <h3 className="font-sans font-black text-foreground text-lg sm:text-xl">
                      {storyBundle.themeTitle}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const fullStoryAudio = storyBundle.passages
                      .map((p) => p.title + ". " + p.text)
                      .join(". ");
                    if (isPlaying) stop();
                    else speak(fullStoryAudio);
                  }}
                  className={
                    "flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full font-sans font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer " +
                    (isPlaying
                      ? "bg-wp-rose text-white motion-safe:animate-pulse"
                      : "bg-primary text-primary-foreground hover:opacity-90")
                  }
                >
                  {isPlaying ? (
                    <>
                      <Square className="size-4 fill-current" />
                      <span>Stop Story</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="size-4" />
                      <span>Play Full 3 Parts</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                Immerse yourself in this complete 3-chapter narrative designed to anchor all
                vocabulary words naturally into long-term memory.
              </p>
            </div>

            {/* 3 Sequential Story Passages */}
            <div className="flex flex-col gap-4">
              {storyBundle.passages.map((passage, idx) => (
                <article
                  key={idx}
                  className="bg-wp-card border border-border rounded-3xl p-5 sm:p-6 shadow-wp-xs flex flex-col gap-3 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-3 flex-wrap gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-sans font-bold text-primary">
                        {passage.title}
                      </span>
                      <span
                        className="text-[11px] font-arabic font-semibold text-muted-foreground"
                        dir="rtl"
                      >
                        {passage.titleArabic}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleTranslation(idx)}
                        aria-label="Toggle Arabic translation"
                        className={
                          "flex items-center gap-1 px-2.5 py-1 min-h-[36px] rounded-xl font-sans font-semibold text-xs border transition-colors cursor-pointer " +
                          (expandedTranslations[idx]
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-secondary text-muted-foreground border-border hover:text-foreground")
                        }
                      >
                        <Languages className="size-3.5" />
                        <span>{expandedTranslations[idx] ? "Hide Arabic" : "Arabic"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => speak(passage.title + ". " + passage.text)}
                        aria-label={"Listen to " + passage.title}
                        className="size-9 rounded-xl bg-secondary text-primary border border-primary/20 hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                      >
                        <Volume2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Story Text with Interactive Highlighted Chips */}
                  <p className="font-sans text-foreground text-sm sm:text-base leading-relaxed">
                    {renderHighlightedText(passage.text)}
                  </p>

                  {/* Optional Collapsible Arabic Translation */}
                  {expandedTranslations[idx] && (
                    <div
                      className="bg-secondary/60 border border-border rounded-2xl p-3.5 mt-1 animate-fadeIn"
                      dir="rtl"
                    >
                      <p className="font-arabic text-sm text-foreground/90 leading-relaxed">
                        {passage.textArabic}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION 5: STORY & VOCABULARY MCQ QUIZ (INTERACTIVE CARD STEPPER) ─ */}
        {activeSection === "story-quiz" && (
          <div className="flex flex-col gap-4">
            {/* Quiz Banner & Overall Progress */}
            <div className="bg-wp-card border border-border rounded-3xl p-5 sm:p-6 shadow-wp-xs flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <HelpCircle className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-sans font-black text-foreground text-base sm:text-lg">
                      Vocabulary &amp; Story Comprehension Quiz
                    </h3>
                    <p className="font-sans text-xs text-muted-foreground">
                      2 Vocabulary Mastery Questions + 1 Story Plot Question
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-secondary px-3.5 py-1.5 rounded-xl border border-border">
                  <Award className="size-4 text-wp-amber" />
                  <span className="font-sans font-bold text-xs text-foreground">
                    Score: {score} / {storyBundle.quiz.length}
                  </span>
                </div>
              </div>

              {/* Question Navigation Dots / Indicator */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                {storyBundle.quiz.map((q, qIndex) => {
                  const isAnswered = quizAnswers[q.id] !== undefined;
                  const isCurrent = activeQuizIndex === qIndex;
                  const isCorrect = isAnswered && quizAnswers[q.id] === q.correctIndex;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setActiveQuizIndex(qIndex)}
                      aria-label={`Jump to Question ${qIndex + 1}`}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer min-h-[36px] ${
                        isCurrent
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : isAnswered
                            ? isCorrect
                              ? "border-wp-emerald/40 bg-wp-emerald/10 text-wp-emerald"
                              : "border-wp-rose/40 bg-wp-rose/10 text-wp-rose"
                            : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>Q{qIndex + 1}</span>
                      {isAnswered && <Check className="size-3 stroke-[3]" aria-hidden />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Question Interactive Card */}
            {(() => {
              const currentQ = storyBundle.quiz[activeQuizIndex] || storyBundle.quiz[0];
              const selected = quizAnswers[currentQ.id];
              const isAnswered = selected !== undefined;
              const isCorrect = isAnswered && selected === currentQ.correctIndex;
              const isVocabQuestion = activeQuizIndex < 2;

              return (
                <div className="bg-wp-card border border-border rounded-3xl p-5 sm:p-6 shadow-wp-xs flex flex-col gap-4">
                  {/* Question Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-sans font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      Question {activeQuizIndex + 1} of {storyBundle.quiz.length}
                    </span>

                    <span className="text-xs font-sans font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border flex items-center gap-1">
                      {isVocabQuestion ? (
                        <>
                          <Sparkles className="size-3 text-wp-amber" />
                          <span>Vocabulary Focus</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="size-3 text-primary" />
                          <span>Story Comprehension</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="font-sans font-bold text-foreground text-base sm:text-lg leading-snug">
                    {currentQ.question}
                  </h4>

                  {/* 4 Multiple Choice Option Buttons */}
                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    {currentQ.options.map((opt, optIdx) => {
                      let btnStyle =
                        "bg-secondary/70 border-border text-foreground hover:bg-secondary hover:border-primary/50";
                      if (isAnswered) {
                        if (optIdx === currentQ.correctIndex) {
                          btnStyle =
                            "bg-wp-emerald/15 border-wp-emerald text-wp-emerald font-bold shadow-sm ring-1 ring-wp-emerald/30";
                        } else if (optIdx === selected) {
                          btnStyle =
                            "bg-wp-rose/15 border-wp-rose text-wp-rose font-bold ring-1 ring-wp-rose/30";
                        } else {
                          btnStyle =
                            "bg-secondary/30 border-border/40 text-muted-foreground opacity-50";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectQuizAnswer(currentQ.id, optIdx)}
                          className={`w-full text-start p-4 min-h-[52px] rounded-2xl border text-sm font-sans flex items-center justify-between gap-3 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="size-7 rounded-full bg-wp-card border border-border flex items-center justify-center font-mono text-xs font-bold shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-snug break-words">{opt}</span>
                          </div>
                          {isAnswered && optIdx === currentQ.correctIndex && (
                            <CheckCircle2 className="size-5 text-wp-emerald shrink-0" />
                          )}
                          {isAnswered &&
                            optIdx === selected &&
                            optIdx !== currentQ.correctIndex && (
                              <XCircle className="size-5 text-wp-rose shrink-0" />
                            )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Context Explanation Callout */}
                  {isAnswered && (
                    <div className="bg-secondary/60 border border-border rounded-2xl p-4 flex flex-col gap-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-foreground">
                          <Info className="size-4 text-primary" />
                          <span>{isCorrect ? "Well done!" : "Context Explanation:"}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => speak(currentQ.explanation)}
                          aria-label="Listen to explanation"
                          className="size-7 rounded-lg bg-wp-card border border-border flex items-center justify-center text-primary hover:bg-secondary cursor-pointer"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {currentQ.explanation}
                      </p>
                      {currentQ.explanationArabic && (
                        <p
                          className="font-arabic text-xs sm:text-sm text-muted-foreground/90 mt-1 pt-1.5 border-t border-border/40 leading-relaxed"
                          dir="rtl"
                        >
                          {currentQ.explanationArabic}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Stepper Navigation Buttons for Questions */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/60">
                    <button
                      type="button"
                      disabled={activeQuizIndex === 0}
                      onClick={() => setActiveQuizIndex((prev) => Math.max(0, prev - 1))}
                      className="px-4 py-2 min-h-[44px] rounded-xl font-sans font-bold text-xs bg-secondary text-foreground border border-border hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-3.5" />
                      <span>Previous Question</span>
                    </button>

                    {activeQuizIndex < storyBundle.quiz.length - 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveQuizIndex((prev) =>
                            Math.min(storyBundle.quiz.length - 1, prev + 1)
                          )
                        }
                        className="px-5 py-2 min-h-[44px] rounded-xl font-sans font-bold text-xs bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="size-4" />
                      </button>
                    ) : (
                      isQuizComplete && (
                        <span className="text-xs font-sans font-bold text-wp-emerald flex items-center gap-1">
                          <CheckCircle2 className="size-4" />
                          <span>All Questions Answered!</span>
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Quiz Results Card */}
            {isQuizComplete && (
              <div className="bg-wp-card border border-border rounded-3xl p-5 sm:p-6 shadow-wp-xs flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="size-12 rounded-2xl bg-wp-emerald/15 text-wp-emerald flex items-center justify-center">
                      <Award className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-foreground text-base sm:text-lg">
                        Story &amp; Vocabulary Quiz Complete!
                      </h4>
                      <p className="font-sans text-xs text-muted-foreground">
                        You scored {score} of {storyBundle.quiz.length} correct (
                        {Math.round((score / storyBundle.quiz.length) * 100)}%). Outstanding
                        retention!
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setQuizAnswers({});
                      setActiveQuizIndex(0);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl bg-secondary text-foreground border border-border font-sans font-semibold text-xs hover:bg-secondary/80 cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              </div>
            )}
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
