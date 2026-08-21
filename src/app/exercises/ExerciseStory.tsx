import React, { memo, useRef, useEffect, useMemo } from "react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/lessons";
import { resolveGroup } from "../data/lessons";
import { ExerciseShell } from "../shared/ExerciseShell";
import { BookOpen, ArrowRight } from "lucide-react";

interface Props {
  step: number;
  words: VocabularyItem[];
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

export const ExerciseStory = memo(function ExerciseStory({
  step,
  words,
  lessonId,
  dispatch,
}: Props) {
  const group = resolveGroup(lessonId);
  const storyText = group.story || "No reading material available for this lesson yet. Stay tuned!";

  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  /**
   * Safely highlight vocabulary words without dangerouslySetInnerHTML.
   * Splits the plain text into segments and wraps matching words in <mark>.
   */
  const segments = useMemo(() => {
    // Build a sorted-longest-first regex so multi-word labels match before
    // their individual tokens (e.g. "bed frame" before "bed").
    const labels = words.map((w) => w.label).sort((a, b) => b.length - a.length);
    const escaped = labels.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = new RegExp(`(${escaped.join("|")})`, "gi");

    return storyText.split(pattern);
  }, [storyText, words]);

  const wordSet = useMemo(() => new Set(words.map((w) => w.label.toLowerCase())), [words]);

  return (
    <ExerciseShell
      step={step}
      title="Reading Time"
      words={words}
      lessonId={lessonId}
      dispatch={dispatch}
      subtitle={
        <>
          <span className="uppercase tracking-wider">{group.name}</span>
          <span className="text-primary font-semibold bg-secondary border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <BookOpen className="size-3" aria-hidden />
            <span>Reading</span>
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
        {/* Header row */}
        <div className="flex items-center gap-3 px-1">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BookOpen className="size-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-sans font-black text-foreground text-lg leading-tight">
              {group.name} in Context
            </h2>
            <p className="font-sans text-muted-foreground text-xs">
              See how these words are used in a real sentence.
            </p>
          </div>
        </div>

        {/* Story card */}
        <article
          className="bg-wp-card border border-border rounded-3xl p-6 sm:p-8 shadow-wp-xs"
          aria-label="Story passage"
        >
          <p className="font-sans text-foreground text-lg sm:text-xl leading-relaxed">
            {segments.map((seg, i) =>
              wordSet.has(seg.toLowerCase()) ? (
                <mark
                  key={i}
                  className="bg-primary/10 text-primary font-bold rounded-sm px-0.5 not-italic"
                >
                  {seg}
                </mark>
              ) : (
                <React.Fragment key={i}>{seg}</React.Fragment>
              )
            )}
          </p>
        </article>

        {/* Vocabulary reference */}
        <div className="bg-secondary/60 border border-border rounded-2xl p-4">
          <p className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Words in this passage
          </p>
          <div className="flex flex-wrap gap-2">
            {words.map((w) => (
              <span
                key={w.id}
                className="font-sans font-semibold text-sm bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full"
              >
                {w.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ExerciseShell>
  );
});
