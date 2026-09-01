import { useMemo, useState } from "react";
import type { UnitLearningMaterials } from "../types";
import { clearReviewWord } from "./progress";
import { loadedUnitVocabulary } from "../../data/vocabulary";
import { CheckCircle2, Trophy, RotateCcw, Sparkles, Eye } from "lucide-react";
import { SelfAssessmentSection } from "../ExtraSections";
import { WordImage } from "../../shared/WordImage";
import type { UnitStudyProgress } from "./types";
import { useAudio } from "../../shared/useAudio";
import { Volume2 } from "lucide-react";

interface Props {
  materials: UnitLearningMaterials;
  progress: UnitStudyProgress;
  onProgressUpdate: (p: UnitStudyProgress) => void;
}

export function ReviewArea({ materials, progress, onProgressUpdate }: Props) {
  const vocab = useMemo(() => loadedUnitVocabulary(materials.unitId), [materials.unitId]);
  const { speak, stop } = useAudio({ lang: "en-US", rate: 0.9 });
  const [revealedWordIds, setRevealedWordIds] = useState<Set<string>>(new Set());

  const weakWords = useMemo(() => {
    return progress.reviewWordIds.map((id) => vocab.find((v) => v.id === id)).filter(Boolean);
  }, [progress.reviewWordIds, vocab]);

  function handleClearWord(wordId: string) {
    onProgressUpdate(clearReviewWord(progress, wordId));
  }

  function toggleReveal(wordId: string, revealed: boolean) {
    setRevealedWordIds((current) => {
      const next = new Set(current);
      if (revealed) next.add(wordId);
      else next.delete(wordId);
      return next;
    });
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3.5 mb-2">
          <span className="p-3 rounded-2xl bg-primary/10 text-primary shadow-2xs">
            <Trophy className="size-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Review Queue &amp; Confidence
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground truncate">
              Difficult Words &amp; Review
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          Strengthen vocabulary retention. Words you marked for practice or missed in exercises
          appear here for focused recall.
        </p>
      </div>

      {/* Weak Words Queue */}
      {weakWords.length > 0 ? (
        <section
          aria-labelledby="weak-words-heading"
          className="rounded-3xl border border-border p-6 sm:p-7 bg-card shadow-xs"
        >
          <div className="mb-6 border-b border-border/60 pb-3.5">
            <h3
              id="weak-words-heading"
              className="font-bold text-lg text-foreground flex items-center gap-2"
            >
              <RotateCcw className="size-5 text-wp-amber" aria-hidden />
              <span>Due for Review ({weakWords.length})</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Use the image as a prompt, recall the English word, then reveal the answer. Remove it
              only when you remembered it before revealing.
            </p>
          </div>

          <ul className="space-y-3.5">
            {weakWords.map((word) => {
              const revealed = revealedWordIds.has(word!.id);
              return (
                <li
                  key={word!.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border border-border rounded-2xl bg-background hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {word!.img && (
                      <div className="size-16 rounded-2xl bg-secondary/30 border border-border/50 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <WordImage
                          word={word!}
                          className="size-full object-contain"
                          sizePreset="thumb"
                          altMode="decorative"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      {revealed ? (
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-base sm:text-lg text-foreground truncate">
                            {word!.label}
                          </p>
                          <button
                            onClick={() => {
                              stop();
                              speak(word!.label);
                            }}
                            className="size-11 shrink-0 rounded-xl bg-secondary/80 text-primary inline-flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px]"
                            aria-label={`Listen to ${word!.label}`}
                          >
                            <Volume2 className="size-4" aria-hidden />
                          </button>
                        </div>
                      ) : (
                        <p className="font-bold text-sm sm:text-base text-foreground">
                          Recall the English word
                        </p>
                      )}
                      {revealed && word!.phonetic && (
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          {word!.phonetic}
                        </p>
                      )}
                      {revealed && word!.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-1">
                          {word!.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2.5 shrink-0 self-end sm:self-center">
                    {!revealed ? (
                      <button
                        onClick={() => toggleReveal(word!.id, true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] shadow-2xs"
                      >
                        <Eye className="size-4" aria-hidden />
                        <span>Reveal answer</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleReveal(word!.id, false)}
                          className="px-4 py-2.5 rounded-2xl border border-border text-foreground font-bold text-xs hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                        >
                          Keep practicing
                        </button>
                        <button
                          onClick={() => handleClearWord(word!.id)}
                          className="px-5 py-2.5 rounded-2xl bg-primary/10 border border-primary/30 text-primary font-bold text-xs hover:bg-primary hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                        >
                          I remembered it
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section
          aria-labelledby="all-caught-up-heading"
          className="rounded-3xl border border-wp-green/30 bg-wp-green-light/10 p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start"
        >
          <div className="size-16 rounded-2xl bg-wp-green/20 text-wp-green flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-8" aria-hidden />
          </div>
          <div>
            <h3
              id="all-caught-up-heading"
              className="font-bold text-lg text-foreground flex items-center gap-2 justify-center sm:justify-start"
            >
              <span>All caught up!</span>
              <Sparkles className="size-4 text-wp-amber" aria-hidden />
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              You don&apos;t have any difficult words queued for review. Any words you struggle with
              during Learn or Practice will automatically appear here.
            </p>
          </div>
        </section>
      )}

      {/* Self Assessment Section */}
      <SelfAssessmentSection
        materials={materials}
        progress={progress}
        onProgressUpdate={onProgressUpdate}
        completionNodeId="review-assessment"
      />
    </div>
  );
}
