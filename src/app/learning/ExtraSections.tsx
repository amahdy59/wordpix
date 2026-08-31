import { useState } from "react";
import type { UnitLearningMaterials, RewriteExercise, MatchingExercise } from "./types";
import { CheckCircle2, XCircle } from "lucide-react";
import type { UnitStudyProgress } from "./study/types";

const CARD = "bg-card rounded-3xl border border-border p-5 sm:p-6 shadow-xs";

export function VocabularyDetailsSection({ materials }: { materials: UnitLearningMaterials }) {
  return (
    <div className="space-y-6">
      {materials.registerLabels && materials.registerLabels.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">Register &amp; Formality Labels</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Appropriate social contexts, degrees of formality, and speech tones.
            </p>
          </div>
          <ul className="space-y-3.5">
            {materials.registerLabels.map((item, i) => (
              <li key={i} className="p-3.5 rounded-2xl bg-background border border-border">
                <p className="font-bold text-foreground">
                  {item.word} —{" "}
                  <span className="text-primary">
                    {item.emoji} {item.register}
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {materials.visualVocabularyMap && materials.visualVocabularyMap.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">Visual Vocabulary Map</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Related words connected by topic and category.
            </p>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {materials.visualVocabularyMap.map((cat, i) => (
              <div key={i} className="bg-background p-4 rounded-2xl border border-border">
                <h3 className="font-bold text-sm sm:text-base text-foreground mb-2 flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span>{cat.category}</span>
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm">
                  {cat.items.map((item, j) => (
                    <li key={j} className="text-muted-foreground">
                      <span className="font-bold text-primary">{item.word}</span> →{" "}
                      <span className="text-foreground">{item.related.join(", ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function PronunciationSection({ materials }: { materials: UnitLearningMaterials }) {
  if (!materials.pronunciationGuide) return null;
  return (
    <section className={CARD}>
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 className="font-bold text-lg text-foreground">Pronunciation Guide</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Stress patterns and phonetic International Phonetic Alphabet (IPA) transcriptions.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {materials.pronunciationGuide.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-background border border-border p-3.5 rounded-2xl"
          >
            <div>
              <p className="font-bold text-foreground text-sm sm:text-base">{item.word}</p>
              <p className="text-xs text-muted-foreground">{item.stress}</p>
            </div>
            <span className="text-primary font-mono bg-primary/10 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold">
              {item.ipa}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PriorityTiersSection({ materials }: { materials: UnitLearningMaterials }) {
  if (!materials.priorityTiers) return null;
  const t = materials.priorityTiers;
  return (
    <section className={CARD}>
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 className="font-bold text-lg text-foreground">Vocabulary Priority Tiers</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Focus your effort on high-frequency core words first.
        </p>
      </div>
      <div className="space-y-3">
        <div className="border border-destructive/30 bg-destructive/5 p-4 rounded-2xl">
          <p className="font-bold text-destructive text-sm">🔴 Essential (Must Learn)</p>
          <p className="text-sm mt-1 text-foreground leading-relaxed">{t.essential.join(", ")}</p>
        </div>
        <div className="border border-wp-amber/30 bg-wp-amber/5 p-4 rounded-2xl">
          <p className="font-bold text-wp-amber text-sm">🟡 Important (Should Learn)</p>
          <p className="text-sm mt-1 text-foreground leading-relaxed">{t.important.join(", ")}</p>
        </div>
        <div className="border border-wp-green/30 bg-wp-green/5 p-4 rounded-2xl">
          <p className="font-bold text-wp-green text-sm">🟢 Good to Know (Nice to Have)</p>
          <p className="text-sm mt-1 text-foreground leading-relaxed">{t.goodToKnow.join(", ")}</p>
        </div>
      </div>
    </section>
  );
}

export function CollocationsSection({ materials }: { materials: UnitLearningMaterials }) {
  return (
    <div className="space-y-6">
      {materials.collocations && materials.collocations.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">Common Collocations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              High-frequency word combinations used in daily communication.
            </p>
          </div>
          <ul className="space-y-4">
            {materials.collocations.map((item, i) => (
              <li key={i} className="p-4 rounded-2xl bg-background border border-border">
                <p className="font-bold text-primary text-base sm:text-lg">{item.phrase}</p>
                <p className="text-sm text-foreground mt-1 font-medium">{item.variations}</p>
                <p className="text-xs sm:text-sm text-muted-foreground italic mt-2 border-s-2 border-primary/30 ps-2.5">
                  &ldquo;{item.example}&rdquo;
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {materials.collocationsQuiz && materials.collocationsQuiz.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">Collocations Quiz</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Test your knowledge of natural word pairings.
            </p>
          </div>
          <div className="space-y-4">
            {materials.collocationsQuiz.map((q, i) => (
              <MultipleChoice key={q.id} index={i} {...q} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function SynonymsAntonymsSection({ materials }: { materials: UnitLearningMaterials }) {
  if (!materials.synonymsAntonyms) return null;
  return (
    <section className={CARD}>
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 className="font-bold text-lg text-foreground">Synonyms &amp; Antonyms</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Expand your vocabulary range with closely related and opposite words.
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full text-start border-collapse min-w-[32rem]">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-start font-bold text-xs uppercase tracking-wider text-muted-foreground py-3 px-4">
                Word
              </th>
              <th className="text-start font-bold text-xs uppercase tracking-wider text-muted-foreground py-3 px-4">
                Synonym (S)
              </th>
              <th className="text-start font-bold text-xs uppercase tracking-wider text-muted-foreground py-3 px-4">
                Antonym (A)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {materials.synonymsAntonyms.map((item, i) => (
              <tr key={i} className="hover:bg-secondary/20 transition-colors">
                <td className="font-bold text-sm text-foreground py-3 px-4">{item.word}</td>
                <td className="text-sm text-wp-green font-medium py-3 px-4">{item.synonym}</td>
                <td className="text-sm text-destructive font-medium py-3 px-4">{item.antonym}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function AdditionalExercisesSection({ materials }: { materials: UnitLearningMaterials }) {
  if (!materials.additionalExercises) return null;
  const ex = materials.additionalExercises;
  return (
    <div className="space-y-6">
      {ex.matching && ex.matching.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">Matching</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Connect definitions to their correct vocabulary terms.
            </p>
          </div>
          <MatchingExerciseComponent exercises={ex.matching} />
        </section>
      )}

      {ex.multipleChoice && ex.multipleChoice.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">Multiple Choice</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose the best option for each question.
            </p>
          </div>
          <div className="space-y-4">
            {ex.multipleChoice.map((q, i) => (
              <MultipleChoice key={q.id} index={i} {...q} />
            ))}
          </div>
        </section>
      )}

      {ex.rewrite && ex.rewrite.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">Rewrite the Sentence</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rephrase sentences using key targeted vocabulary.
            </p>
          </div>
          <RewriteExerciseComponent exercises={ex.rewrite} />
        </section>
      )}
    </div>
  );
}

function RewriteExerciseComponent({ exercises }: { exercises: RewriteExercise[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const normalise = (val: string) =>
    val
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/gi, "");

  return (
    <div className="space-y-4">
      {exercises.map((ex, i) => {
        const val = answers[ex.id] ?? "";
        const isCorrect = normalise(val) === normalise(ex.answer);
        return (
          <div key={ex.id} className="p-4 rounded-2xl border border-border bg-background">
            <p className="text-sm text-foreground font-medium mb-2.5">
              {i + 1}. {ex.sentence} (Use:{" "}
              <span className="font-bold text-primary">"{ex.hintWord}"</span>)
            </p>
            <input
              type="text"
              value={val}
              onChange={(e) => {
                setAnswers((p) => ({ ...p, [ex.id]: e.target.value }));
                setChecked(false);
              }}
              aria-label={`Rewritten sentence for item ${i + 1}`}
              className={`w-full rounded-xl border px-3.5 py-2.5 bg-background text-foreground text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] ${
                checked
                  ? isCorrect
                    ? "border-wp-green bg-wp-green-light/10"
                    : "border-destructive bg-destructive/10"
                  : "border-border"
              }`}
              placeholder="Type your rewritten sentence…"
            />
            {checked && !isCorrect && (
              <p className="text-wp-green text-xs sm:text-sm font-bold mt-2">
                Correct: {ex.answer}
              </p>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => setChecked(true)}
        className="rounded-xl bg-primary text-primary-foreground font-bold px-5 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-primary/90 transition-colors min-h-[44px] shadow-xs"
      >
        Check Answers
      </button>
    </div>
  );
}

export function ErrorCorrectionSection({ materials }: { materials: UnitLearningMaterials }) {
  if (!materials.errorCorrection) return null;
  return (
    <section className={CARD}>
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 className="font-bold text-lg text-foreground">Find the Mistake</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Spot inaccuracies and understand standard natural phrasing.
        </p>
      </div>
      <ul className="space-y-3">
        {materials.errorCorrection.map((item, i) => (
          <li key={item.id} className="rounded-2xl border border-border p-4 bg-background">
            <p className="text-sm text-destructive line-through font-medium">
              {i + 1}. {item.wrong}
            </p>
            <p className="text-sm text-wp-green font-bold mt-1.5">✓ {item.right}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function WritingPromptsSection({ materials }: { materials: UnitLearningMaterials }) {
  if (!materials.writingPrompts) return null;
  return (
    <section className={CARD}>
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 className="font-bold text-lg text-foreground">Writing Prompts</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Practice open-ended communicative expression.
        </p>
      </div>
      <div className="space-y-4">
        {materials.writingPrompts.map((p) => (
          <div key={p.id} className="border border-border p-4 sm:p-5 rounded-2xl bg-background">
            <h3 className="font-bold text-primary text-base">{p.title}</h3>
            <p className="text-sm mt-2 text-foreground leading-relaxed">{p.prompt}</p>
            {p.suggestedVocabulary && (
              <p className="text-xs text-muted-foreground mt-3 bg-secondary/40 p-2.5 rounded-xl">
                <span className="font-bold text-foreground">Suggested words: </span>
                {p.suggestedVocabulary.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function SelfAssessmentSection({
  materials,
  progress,
  onProgressUpdate,
  completionNodeId,
}: {
  materials: UnitLearningMaterials;
  progress?: UnitStudyProgress;
  onProgressUpdate?: (p: UnitStudyProgress) => void;
  completionNodeId?: string;
}) {
  if (!materials.selfAssessment) return null;

  const handleScore = (itemId: string, score: number) => {
    if (!progress || !onProgressUpdate) return;
    const selfAssessment = {
      ...(progress.selfAssessment || {}),
      [itemId]: score,
    };
    const completedNodeIds =
      completionNodeId && Object.keys(selfAssessment).length >= materials.selfAssessment!.length
        ? Array.from(new Set([...progress.completedNodeIds, completionNodeId]))
        : progress.completedNodeIds;
    onProgressUpdate({
      ...progress,
      selfAssessment,
      completedNodeIds,
    });
  };

  const confidenceLabels = ["I recognise it", "I can use it", "I can explain it"];

  return (
    <section className={CARD} aria-labelledby="self-assessment-heading">
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 id="self-assessment-heading" className="font-bold text-lg sm:text-xl text-foreground">
          Self-Assessment &amp; Can-Do Checklist
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Rate your confidence: <span className="font-bold text-foreground">1</span> = Recognize ·{" "}
          <span className="font-bold text-foreground">2</span> = Can use ·{" "}
          <span className="font-bold text-foreground">3</span> = Can explain
        </p>
      </div>

      <div className="space-y-3.5">
        {materials.selfAssessment.map((item, i) => {
          const itemId = `sa-${i}`;
          const currentScore = progress?.selfAssessment?.[itemId];
          return (
            <div
              key={i}
              className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 rounded-2xl border border-border bg-background"
            >
              <div className="min-w-0 flex-1">
                <p className="font-bold text-base text-foreground">{item.wordPair}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.question}</p>
              </div>
              <div
                role="radiogroup"
                aria-label={`Confidence rating for ${item.wordPair}`}
                className="flex gap-2 shrink-0 items-center"
              >
                {[1, 2, 3].map((score) => {
                  const isSelected = currentScore === score;
                  return (
                    <label
                      key={score}
                      className={`relative flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl border text-xs font-bold transition-all focus-within:outline-none focus-within:ring-2 focus-within:ring-primary ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-primary/50 active:scale-95"
                      }`}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name={`confidence-${itemId}`}
                        value={score}
                        checked={isSelected}
                        aria-label={`${score} of 3: ${confidenceLabels[score - 1]}`}
                        onChange={() => handleScore(itemId, score)}
                      />
                      <span>{score}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function MultipleChoice({
  index,
  question,
  options,
  correctIndex,
  explanation,
}: {
  index: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <div className="rounded-2xl border border-border p-4 sm:p-5 bg-background">
      <p className="font-bold text-sm sm:text-base text-foreground mb-3">
        {index + 1}. {question}
      </p>
      <ul className="space-y-2">
        {options.map((option: string, i: number) => {
          const isCorrect = i === correctIndex;
          const isPicked = picked === i;
          const state = !answered ? "idle" : isCorrect ? "correct" : isPicked ? "wrong" : "idle";
          return (
            <li key={option}>
              <button
                type="button"
                disabled={answered}
                onClick={() => setPicked(i)}
                className={`w-full text-start rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] flex items-center justify-between ${
                  state === "correct"
                    ? "border-wp-green bg-wp-green-light/20 text-wp-green font-bold"
                    : state === "wrong"
                      ? "border-destructive bg-destructive/10 text-destructive font-bold"
                      : "border-border text-foreground hover:border-primary/50 hover:bg-secondary/40 disabled:opacity-70"
                }`}
              >
                <span className="inline-flex items-center gap-2.5">
                  {state === "correct" && <CheckCircle2 className="size-4 shrink-0" aria-hidden />}
                  {state === "wrong" && <XCircle className="size-4 shrink-0" aria-hidden />}
                  <span>{option}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {answered && explanation && (
        <div
          role="status"
          className="mt-3.5 pt-3 border-t border-border/60 text-xs sm:text-sm text-muted-foreground leading-relaxed"
        >
          <span className="font-bold text-foreground">Explanation: </span>
          {explanation}
        </div>
      )}
    </div>
  );
}

function MatchingExerciseComponent({ exercises }: { exercises: MatchingExercise[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const words = exercises.map((ex) => ex.word).sort();

  return (
    <div className="space-y-4">
      {exercises.map((ex, i) => {
        const selected = answers[ex.word] || "";
        const isCorrect = selected === ex.word;
        return (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-border rounded-2xl bg-background"
          >
            <div className="flex-1">
              <p className="text-sm text-foreground leading-relaxed">{ex.definition}</p>
            </div>
            <div className="sm:w-1/3 shrink-0">
              <select
                value={selected}
                onChange={(e) => {
                  setAnswers((p) => ({ ...p, [ex.word]: e.target.value }));
                  setChecked(false);
                }}
                aria-label={`Match word for definition ${i + 1}`}
                className={`w-full rounded-xl border px-3.5 py-2.5 bg-background text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] ${
                  checked
                    ? isCorrect
                      ? "border-wp-green bg-wp-green-light/20 text-wp-green font-bold"
                      : "border-destructive bg-destructive/10 text-destructive font-bold"
                    : "border-border text-foreground"
                }`}
              >
                <option value="" disabled>
                  Select a word…
                </option>
                {words.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => setChecked(true)}
        className="rounded-xl bg-primary text-primary-foreground font-bold px-5 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-primary/90 transition-colors min-h-[44px] shadow-xs"
      >
        Check Answers
      </button>
    </div>
  );
}
