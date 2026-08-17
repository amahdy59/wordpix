import React, { memo, useRef, useEffect } from "react";
import type { Action } from "../types";
import type { VocabularyItem } from "../data/lessons";
import { resolveGroup } from "../data/lessons";
import { PrimaryButton } from "../shared/PrimaryButton";
import { LessonHeader } from "../shared/LessonHeader";
import { BookOpen } from "lucide-react";

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

  const onNext = () => {
    dispatch({ type: "LESSON_NEXT" });
  };

  const onBack = () => {
    dispatch({ type: "LESSON_PREVIOUS" });
  };

  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (btnRef.current) {
      btnRef.current.focus();
    }
  }, []);

  // Highlight vocabulary words in the story
  const renderStory = () => {
    let html = storyText;
    words.forEach((word) => {
      // Create a regex to match the word case-insensitively, keeping punctuation intact
      const regex = new RegExp(`\\b(${word.label})\\b`, "gi");
      html = html.replace(regex, `<span class="font-bold text-[var(--color-primary-600)] bg-[var(--color-primary-50)] px-1 rounded-sm">$1</span>`);
    });
    return html;
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--color-surface)]">
      <LessonHeader 
        title="Reading Time" 
        current={step + 1}
        total={6}
        onBack={onBack}
        onClose={() => dispatch({ type: "GO", to: "lesson-entry" })} 
      />

      <main className="flex-1 overflow-y-auto flex flex-col p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
        <div className="bg-[var(--color-surface-raised)] rounded-3xl shadow-sm border border-[var(--color-border-subtle)] p-6 sm:p-10 w-full mb-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--color-border-subtle)]">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-100)] text-[var(--color-primary-600)] flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text-strong)]">{group.name} in Context</h2>
              <p className="text-[var(--color-text-subtle)] text-base mt-1">Read the story below to see how these words are used.</p>
            </div>
          </div>

          <div
            className="text-xl text-[var(--color-text-base)] leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: renderStory().replace(/\n/g, '<br/>') }}
            aria-live="polite"
          />
        </div>
      </main>

      <div className="p-4 sm:p-6 bg-[var(--color-surface)] border-t border-[var(--color-border-subtle)] shrink-0">
        <div className="max-w-3xl mx-auto flex justify-end">
          <PrimaryButton
            label="Continue"
            onClick={onNext}
          />
        </div>
      </div>
    </div>
  );
});
