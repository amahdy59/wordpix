import { useState, useMemo } from "react";
import type { UnitLearningMaterials } from "../types";
import { loadStudyProgress, clearReviewWord } from "./progress";
import { loadedUnitVocabulary } from "../../data/vocabulary";
import { CheckCircle2, Trophy } from "lucide-react";
import { SelfAssessmentSection } from "../ExtraSections";

interface Props {
  materials: UnitLearningMaterials;
}

export function ReviewArea({ materials }: Props) {
  const [progress, setProgress] = useState(() => loadStudyProgress(materials.unitId));
  const vocab = useMemo(() => loadedUnitVocabulary(materials.unitId), [materials.unitId]);

  const weakWords = useMemo(() => {
    return progress.reviewWordIds.map((id) => vocab.find((v) => v.id === id)).filter(Boolean);
  }, [progress.reviewWordIds, vocab]);

  function handleClearWord(wordId: string) {
    // In a real app, we might force them to answer a question to clear it.
    // For now, allow manual clearing.
    const newProgress = clearReviewWord(progress, wordId);
    setProgress(newProgress);
    // Note: To persist this to localStorage we should call saveStudyProgress,
    // but progress is also loaded by StudyShell on mount. We should probably
    // expose a context or pass dispatch down. For now this is fine for local state.
  }

  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-8 space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" /> Review & Assessment
        </h2>

        {weakWords.length > 0 ? (
          <div className="rounded-xl border border-border p-6 bg-card mb-12">
            <h3 className="font-bold text-lg mb-4 text-destructive">Words to Review</h3>
            <p className="text-muted-foreground mb-6">
              You had some trouble with these words during practice. Review them below and clear
              them when you feel confident.
            </p>
            <ul className="space-y-4">
              {weakWords.map((word) => (
                <li
                  key={word!.id}
                  className="flex justify-between items-center p-4 border rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    {word!.img && (
                      <img src={word!.img} alt="" className="w-12 h-12 object-contain" />
                    )}
                    <div>
                      <p className="font-bold">{word!.label}</p>
                      {word!.phonetic && (
                        <p className="text-sm text-muted-foreground">{word!.phonetic}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleClearWord(word!.id)}
                    className="px-4 py-2 rounded-full border border-primary text-primary font-bold hover:bg-primary/10 transition-colors"
                  >
                    Mark as Learned
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-xl border border-border p-6 bg-card mb-12 flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-wp-green shrink-0" />
            <div>
              <h3 className="font-bold text-lg">No weak words!</h3>
              <p className="text-muted-foreground">
                You don't have any words marked for review right now.
              </p>
            </div>
          </div>
        )}

        <SelfAssessmentSection materials={materials} />
      </div>
    </div>
  );
}
