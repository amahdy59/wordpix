import { useMemo } from "react";
import type { UnitLearningMaterials } from "../types";
import { clearReviewWord } from "./progress";
import { loadedUnitVocabulary } from "../../data/vocabulary";
import { CheckCircle2, Trophy, RotateCcw, Sparkles } from "lucide-react";
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

  const weakWords = useMemo(() => {
    return progress.reviewWordIds.map((id) => vocab.find((v) => v.id === id)).filter(Boolean);
  }, [progress.reviewWordIds, vocab]);

  function handleClearWord(wordId: string) {
    onProgressUpdate(clearReviewWord(progress, wordId));
  }

  function handleClearAll() {
    onProgressUpdate({
      ...progress,
      reviewWordIds: [],
    });
  }

  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-8 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2 rounded-xl bg-primary/10 text-primary">
            <Trophy className="size-6" aria-hidden />
          </span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Spaced Repetition &amp; Mastery
            </span>
            <h2 className="text-2xl font-bold text-foreground">Review &amp; Assessment</h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          Strengthen long-term retention. Words you marked for review or missed in exercises appear
          here until you master them.
        </p>
      </div>

      {/* Weak Words Queue */}
      {weakWords.length > 0 ? (
        <section
          aria-labelledby="weak-words-heading"
          className="rounded-2xl border border-border p-6 bg-card shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3
                id="weak-words-heading"
                className="font-bold text-lg text-foreground flex items-center gap-2"
              >
                <RotateCcw className="size-5 text-wp-amber" aria-hidden />
                Due for Review ({weakWords.length})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review these terms with audio and mark them as learned once you can recall them
                reliably.
              </p>
            </div>
            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl border border-border hover:bg-secondary transition-colors self-start sm:self-auto min-h-[44px]"
            >
              Clear All
            </button>
          </div>

          <ul className="space-y-3">
            {weakWords.map((word) => (
              <li
                key={word!.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-xl bg-background hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {word!.img && (
                    <div className="size-14 rounded-xl bg-secondary/30 border border-border/50 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      <WordImage
                        word={word!}
                        className="size-full object-contain"
                        sizePreset="thumb"
                        altMode="decorative"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-base text-foreground truncate">{word!.label}</p>
                      <button
                        onClick={() => {
                          stop();
                          speak(word!.label);
                        }}
                        className="size-7 rounded-full bg-secondary text-primary inline-flex items-center justify-center hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
                        aria-label={`Listen to ${word!.label}`}
                      >
                        <Volume2 className="size-3.5" aria-hidden />
                      </button>
                    </div>
                    {word!.phonetic && (
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {word!.phonetic}
                      </p>
                    )}
                    {word!.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {word!.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-wp-amber/10 text-wp-amber border border-wp-amber/20">
                    Needs practice
                  </span>
                  <button
                    onClick={() => handleClearWord(word!.id)}
                    className="px-4 py-2 rounded-full border border-primary text-primary font-bold text-xs hover:bg-primary hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                  >
                    Mark as Learned
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section
          aria-labelledby="all-caught-up-heading"
          className="rounded-2xl border border-wp-green/30 bg-wp-green-light/10 p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start"
        >
          <div className="size-14 rounded-2xl bg-wp-green/20 text-wp-green flex items-center justify-center shrink-0">
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
      />
    </div>
  );
}
