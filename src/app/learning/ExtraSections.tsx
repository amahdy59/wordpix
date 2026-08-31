import { useState } from "react";
import type { UnitLearningMaterials, RewriteExercise, MatchingExercise } from "./types";
import { CheckCircle2, XCircle } from "lucide-react";
import type { UnitStudyProgress } from "./study/types";

const CARD = "bg-wp-card rounded-2xl border border-border p-5 shadow-sm";

export function VocabularyDetailsSection({ materials }: { materials: UnitLearningMaterials }) {
  return (
    <div className="space-y-4">
      {materials.registerLabels && materials.registerLabels.length > 0 && (
        <section className={CARD}>
          <h2 className="font-sans font-bold text-lg text-foreground mb-3">
            Register & Formality Labels
          </h2>
          <ul className="space-y-3">
            {materials.registerLabels.map((item, i) => (
              <li key={i} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <p className="font-sans font-bold text-foreground">
                  {item.word} — {item.emoji} {item.register}
                </p>
                <p className="font-sans text-sm text-muted-foreground mt-1">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {materials.visualVocabularyMap && materials.visualVocabularyMap.length > 0 && (
        <section className={CARD}>
          <h2 className="font-sans font-bold text-lg text-foreground mb-3">
            Visual Vocabulary Map
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {materials.visualVocabularyMap.map((cat, i) => (
              <div key={i} className="bg-secondary/20 p-3 rounded-xl border border-border">
                <h3 className="font-sans font-bold text-foreground mb-2">
                  {cat.emoji} {cat.category}
                </h3>
                <ul className="space-y-1">
                  {cat.items.map((item, j) => (
                    <li key={j} className="font-sans text-sm">
                      <span className="font-bold text-primary">{item.word}</span> →{" "}
                      <span className="text-muted-foreground">{item.related.join(", ")}</span>
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
      <h2 className="font-sans font-bold text-lg text-foreground mb-3">Pronunciation Guide</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {materials.pronunciationGuide.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-background border border-border p-3 rounded-xl"
          >
            <div>
              <p className="font-sans font-bold text-foreground">{item.word}</p>
              <p className="font-sans text-xs text-muted-foreground">{item.stress}</p>
            </div>
            <span className="font-sans text-primary font-mono bg-primary/10 px-2 py-1 rounded">
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
      <h2 className="font-sans font-bold text-lg text-foreground mb-3">
        Vocabulary Priority Tiers
      </h2>
      <div className="space-y-3">
        <div className="border border-destructive/30 bg-destructive/5 p-3 rounded-xl">
          <p className="font-sans font-bold text-destructive">🔴 Essential (Must Learn)</p>
          <p className="font-sans text-sm mt-1">{t.essential.join(", ")}</p>
        </div>
        <div className="border border-wp-amber/30 bg-wp-amber/5 p-3 rounded-xl">
          <p className="font-sans font-bold text-wp-amber">🟡 Important (Should Learn)</p>
          <p className="font-sans text-sm mt-1">{t.important.join(", ")}</p>
        </div>
        <div className="border border-wp-green/30 bg-wp-green/5 p-3 rounded-xl">
          <p className="font-sans font-bold text-wp-green">🟢 Good to Know (Nice to Have)</p>
          <p className="font-sans text-sm mt-1">{t.goodToKnow.join(", ")}</p>
        </div>
      </div>
    </section>
  );
}

export function CollocationsSection({ materials }: { materials: UnitLearningMaterials }) {
  return (
    <div className="space-y-4">
      {materials.collocations && materials.collocations.length > 0 && (
        <section className={CARD}>
          <h2 className="font-sans font-bold text-lg text-foreground mb-3">Common Collocations</h2>
          <ul className="space-y-4">
            {materials.collocations.map((item, i) => (
              <li key={i} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <p className="font-sans font-bold text-primary text-lg">{item.phrase}</p>
                <p className="font-sans text-sm text-foreground mt-1">{item.variations}</p>
                <p className="font-sans text-sm text-muted-foreground italic mt-2">
                  "{item.example}"
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {materials.collocationsQuiz && materials.collocationsQuiz.length > 0 && (
        <section className={CARD}>
          <h2 className="font-sans font-bold text-lg text-foreground mb-3">Collocations Quiz</h2>
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
      <h2 className="font-sans font-bold text-lg text-foreground mb-3">Synonyms & Antonyms</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse min-w-[32rem]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-start font-sans font-bold text-sm text-muted-foreground py-2 pe-3">
                Word
              </th>
              <th className="text-start font-sans font-bold text-sm text-muted-foreground py-2 pe-3">
                Synonym (S)
              </th>
              <th className="text-start font-sans font-bold text-sm text-muted-foreground py-2 pe-3">
                Antonym (A)
              </th>
            </tr>
          </thead>
          <tbody>
            {materials.synonymsAntonyms.map((item, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="font-sans font-bold text-sm text-foreground py-2 pe-3">
                  {item.word}
                </td>
                <td className="font-sans text-sm text-wp-green py-2 pe-3">{item.synonym}</td>
                <td className="font-sans text-sm text-destructive py-2 pe-3">{item.antonym}</td>
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
    <div className="space-y-4">
      {ex.matching && ex.matching.length > 0 && (
        <section className={CARD}>
          <h2 className="font-sans font-bold text-lg text-foreground mb-3">Matching</h2>
          <MatchingExerciseComponent exercises={ex.matching} />
        </section>
      )}

      {ex.multipleChoice && ex.multipleChoice.length > 0 && (
        <section className={CARD}>
          <h2 className="font-sans font-bold text-lg text-foreground mb-3">Multiple Choice</h2>
          <div className="space-y-4">
            {ex.multipleChoice.map((q, i) => (
              <MultipleChoice key={q.id} index={i} {...q} />
            ))}
          </div>
        </section>
      )}

      {ex.rewrite && ex.rewrite.length > 0 && (
        <section className={CARD}>
          <h2 className="font-sans font-bold text-lg text-foreground mb-3">Rewrite the Sentence</h2>
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
          <div key={ex.id} className="p-4 border border-border rounded-xl">
            <p className="font-sans text-sm text-muted-foreground mb-2">
              {i + 1}. {ex.sentence} (Use: <span className="font-bold">{ex.hintWord}</span>)
            </p>
            <input
              type="text"
              value={val}
              onChange={(e) => {
                setAnswers((p) => ({ ...p, [ex.id]: e.target.value }));
                setChecked(false);
              }}
              className={`w-full rounded-lg border px-3 py-2 bg-background text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary ${checked ? (isCorrect ? "border-wp-green" : "border-destructive") : "border-border"}`}
              placeholder="Type your rewritten sentence..."
            />
            {checked && !isCorrect && (
              <p className="text-wp-green text-sm mt-2">Correct: {ex.answer}</p>
            )}
          </div>
        );
      })}
      <button
        onClick={() => setChecked(true)}
        className="rounded-xl bg-primary text-primary-foreground font-sans font-bold px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
      <h2 className="font-sans font-bold text-lg text-foreground mb-3">Find the Mistake</h2>
      <ul className="space-y-3">
        {materials.errorCorrection.map((item, i) => (
          <li key={item.id} className="rounded-xl border border-border p-3">
            <p className="font-sans text-sm text-destructive line-through">
              {i + 1}. {item.wrong}
            </p>
            <p className="font-sans text-sm text-wp-green mt-1">✓ {item.right}</p>
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
      <h2 className="font-sans font-bold text-lg text-foreground mb-3">Writing Prompts</h2>
      <div className="space-y-4">
        {materials.writingPrompts.map((p) => (
          <div key={p.id} className="border border-border p-4 rounded-xl bg-secondary/10">
            <h3 className="font-sans font-bold text-primary">{p.title}</h3>
            <p className="font-sans text-sm mt-2 text-foreground">{p.prompt}</p>
            {p.suggestedVocabulary && (
              <p className="font-sans text-xs text-muted-foreground mt-3">
                Suggested words: {p.suggestedVocabulary.join(", ")}
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
}: {
  materials: UnitLearningMaterials;
  progress?: UnitStudyProgress;
  onProgressUpdate?: (p: UnitStudyProgress) => void;
}) {
  if (!materials.selfAssessment) return null;

  const handleScore = (itemId: string, score: number) => {
    if (!progress || !onProgressUpdate) return;
    onProgressUpdate({
      ...progress,
      selfAssessment: {
        ...(progress.selfAssessment || {}),
        [itemId]: score,
      },
    });
  };

  const confidenceLabels = ["I recognise it", "I can use it", "I can explain it"];

  return (
    <section className={CARD} aria-labelledby="self-assessment-heading">
      <h2 id="self-assessment-heading" className="font-sans font-bold text-lg text-foreground mb-1">
        Self-Assessment &amp; Can-Do Checklist
      </h2>
      <p className="font-sans text-xs text-muted-foreground mb-4">
        Rate your confidence: <span className="font-bold text-foreground">1</span> = Recognize ·{" "}
        <span className="font-bold text-foreground">2</span> = Can use ·{" "}
        <span className="font-bold text-foreground">3</span> = Can explain
      </p>
      <div className="space-y-3">
        {materials.selfAssessment.map((item, i) => {
          const itemId = `sa-${i}`;
          const currentScore = progress?.selfAssessment?.[itemId];
          return (
            <div
              key={i}
              className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 border border-border rounded-xl bg-background"
            >
              <div className="min-w-0 flex-1">
                <p className="font-sans font-bold text-base text-foreground">{item.wordPair}</p>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">{item.question}</p>
              </div>
              <div
                role="radiogroup"
                aria-label={`Confidence rating for ${item.wordPair}`}
                className="flex gap-2 shrink-0 items-center"
              >
                {[1, 2, 3].map((score) => {
                  const isSelected = currentScore === score;
                  return (
                    <button
                      key={score}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${score} of 3: ${confidenceLabels[score - 1]}`}
                      onClick={() => handleScore(itemId, score)}
                      className={`min-h-[44px] w-[44px] rounded-full border text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                          : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-primary/50 active:scale-95"
                      }`}
                    >
                      {score}
                    </button>
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
    <div className="rounded-xl border border-border p-4 bg-background">
      <p className="font-sans font-bold text-foreground">
        {index + 1}. {question}
      </p>
      <ul className="mt-3 space-y-2">
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
                className={`w-full text-start rounded-lg border px-3 py-2 font-sans text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  state === "correct"
                    ? "border-wp-green bg-wp-green/10 text-wp-green"
                    : state === "wrong"
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border text-foreground hover:border-primary/50 disabled:opacity-70"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {state === "correct" && <CheckCircle2 className="size-4 shrink-0" aria-hidden />}
                  {state === "wrong" && <XCircle className="size-4 shrink-0" aria-hidden />}
                  {option}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {answered && explanation && (
        <p role="status" className="mt-3 font-sans text-sm text-muted-foreground">
          {explanation}
        </p>
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
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-border rounded-xl bg-background"
          >
            <div className="flex-1">
              <p className="font-sans text-sm text-foreground">{ex.definition}</p>
            </div>
            <div className="sm:w-1/3 shrink-0">
              <select
                value={selected}
                onChange={(e) => {
                  setAnswers((p) => ({ ...p, [ex.word]: e.target.value }));
                  setChecked(false);
                }}
                className={`w-full rounded-lg border px-3 py-2 bg-background font-sans text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  checked
                    ? isCorrect
                      ? "border-wp-green bg-wp-green-light/20 text-wp-green"
                      : "border-destructive bg-destructive/10 text-destructive"
                    : "border-border text-foreground"
                }`}
              >
                <option value="" disabled>
                  Select a word...
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
        onClick={() => setChecked(true)}
        className="rounded-xl bg-primary text-primary-foreground font-sans font-bold px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Check Answers
      </button>
    </div>
  );
}
