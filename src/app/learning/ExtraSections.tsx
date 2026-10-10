import { ReferenceTable } from "../shared/ReferenceTable";
import { useState } from "react";
import type { UnitLearningMaterials, RewriteExercise, MatchingExercise } from "./types";
import type { UnitStudyProgress } from "./study/types";
import { useI18n } from "../context/I18nContext";
import { QuizQuestionCard } from "../shared/QuizQuestionCard";
import { CurriculumQuizEngine } from "../shared/CurriculumQuizEngine";
import type { MultipleChoiceExercise } from "./types";

const CARD = "bg-card rounded-3xl border border-border p-5 sm:p-6 shadow-xs";

export function VocabularyDetailsSection({ materials }: { materials: UnitLearningMaterials }) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      {materials.registerLabels && materials.registerLabels.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">
              {t("learningMaterials.registerFormalityTitle")}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("learningMaterials.registerFormalityDesc")}
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
                <p className="text-sm sm:text-base text-muted-foreground mt-1 leading-relaxed">
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
            <h2 className="font-bold text-lg text-foreground">
              {t("learningMaterials.vocabMapTitle")}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("learningMaterials.vocabMapDesc")}
            </p>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {materials.visualVocabularyMap.map((cat, i) => (
              <div key={i} className="bg-background p-4 rounded-2xl border border-border">
                <h3 className="font-bold text-base sm:text-base text-foreground mb-2 flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span>{cat.category}</span>
                </h3>
                <ul className="space-y-1.5 text-sm sm:text-base">
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
  const { t } = useI18n();
  if (!materials.pronunciationGuide) return null;
  return (
    <section className={CARD}>
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 className="font-bold text-lg text-foreground">
          {t("learningMaterials.pronunciationGuideTitle")}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("learningMaterials.pronunciationGuideDesc")}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {materials.pronunciationGuide.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-background border border-border p-3.5 rounded-2xl"
          >
            <div>
              <p className="font-bold text-foreground text-base sm:text-base">{item.word}</p>
              <p className="text-sm text-muted-foreground">{item.stress}</p>
            </div>
            <span className="text-primary font-mono bg-secondary px-2.5 py-1 rounded-xl text-sm sm:text-base font-bold">
              {item.ipa}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PriorityTiersSection({ materials }: { materials: UnitLearningMaterials }) {
  const { t } = useI18n();
  if (!materials.priorityTiers) return null;
  const tiers = materials.priorityTiers;
  return (
    <section className={CARD}>
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 className="font-bold text-lg text-foreground">
          {t("learningMaterials.priorityTiersTitle")}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("learningMaterials.priorityTiersDesc")}
        </p>
      </div>
      <div className="space-y-3">
        <div className="border border-destructive/30 bg-destructive/5 p-4 rounded-2xl">
          <p className="font-bold text-destructive text-base">
            {t("learningMaterials.tierEssential")}
          </p>
          <p className="text-base mt-1 text-foreground leading-relaxed">
            {tiers.essential.join(", ")}
          </p>
        </div>
        <div className="border border-wp-amber/30 bg-wp-amber/5 p-4 rounded-2xl">
          <p className="font-bold text-wp-amber-foreground text-base">
            {t("learningMaterials.tierImportant")}
          </p>
          <p className="text-base mt-1 text-foreground leading-relaxed">
            {tiers.important.join(", ")}
          </p>
        </div>
        <div className="border border-wp-green/30 bg-wp-green/5 p-4 rounded-2xl">
          <p className="font-bold text-wp-green text-base">
            {t("learningMaterials.tierGoodToKnow")}
          </p>
          <p className="text-base mt-1 text-foreground leading-relaxed">
            {tiers.goodToKnow.join(", ")}
          </p>
        </div>
      </div>
    </section>
  );
}

export function CollocationsSection({ materials }: { materials: UnitLearningMaterials }) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      {materials.collocations && materials.collocations.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">
              {t("learningMaterials.commonCollocations")}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("learningMaterials.commonCollocationsDesc")}
            </p>
          </div>
          <ul className="space-y-4">
            {materials.collocations.map((item, i) => (
              <li key={i} className="p-4 rounded-2xl bg-background border border-border">
                <p className="font-bold text-primary text-base sm:text-lg">{item.phrase}</p>
                <p className="text-base text-foreground mt-1 font-medium">{item.variations}</p>
                <p className="text-sm sm:text-base text-muted-foreground italic mt-2 border-s-2 border-primary/30 ps-2.5">
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
            <h2 className="font-bold text-lg text-foreground">
              {t("learningMaterials.collocationsQuiz")}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("learningMaterials.collocationsQuizDesc")}
            </p>
          </div>
          <FocusedQuestions key={materials.unitId} questions={materials.collocationsQuiz} />
        </section>
      )}
    </div>
  );
}

export function SynonymsAntonymsSection({ materials }: { materials: UnitLearningMaterials }) {
  const { t } = useI18n();
  if (!materials.synonymsAntonyms) return null;
  return (
    <section className={CARD}>
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 className="font-bold text-lg text-foreground">
          {t("learningMaterials.synonymsAntonyms")}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("learningMaterials.synonymsAntonymsDesc")}
        </p>
      </div>
      <ReferenceTable
        caption={t("learningMaterials.synonymsAntonyms")}
        columns={[
          { key: "word", label: t("learningMaterials.colWord"), rowHeader: true },
          { key: "synonym", label: t("learningMaterials.colSynonym") },
          { key: "antonym", label: t("learningMaterials.colAntonym") },
        ]}
        rows={materials.synonymsAntonyms.map((item) => ({
          id: item.word,
          cells: {
            word: (
              <bdi lang="en" dir="ltr">
                {item.word}
              </bdi>
            ),
            synonym: (
              <bdi lang="en" dir="ltr">
                {item.synonym}
              </bdi>
            ),
            antonym: (
              <bdi lang="en" dir="ltr">
                {item.antonym}
              </bdi>
            ),
          },
        }))}
      />
    </section>
  );
}

export function AdditionalExercisesSection({ materials }: { materials: UnitLearningMaterials }) {
  const { t } = useI18n();
  if (!materials.additionalExercises) return null;
  const ex = materials.additionalExercises;
  return (
    <div className="space-y-6">
      {ex.matching && ex.matching.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">{t("learningMaterials.matching")}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("learningMaterials.matchingDesc")}
            </p>
          </div>
          <MatchingExerciseComponent exercises={ex.matching} />
        </section>
      )}

      {ex.multipleChoice && ex.multipleChoice.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">
              {t("learningMaterials.multipleChoice")}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("learningMaterials.multipleChoiceDesc")}
            </p>
          </div>
          <FocusedQuestions key={materials.unitId} questions={ex.multipleChoice} />
        </section>
      )}

      {ex.rewrite && ex.rewrite.length > 0 && (
        <section className={CARD}>
          <div className="border-b border-border/60 pb-3 mb-4">
            <h2 className="font-bold text-lg text-foreground">
              {t("learningMaterials.rewriteSentence")}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("learningMaterials.rewriteSentenceDesc")}
            </p>
          </div>
          <RewriteExerciseComponent exercises={ex.rewrite} />
        </section>
      )}
    </div>
  );
}

function RewriteAnswer({
  answered,
  currentAnswer,
  onAnswer,
  answer,
  label,
}: {
  answered: boolean;
  currentAnswer?: string;
  onAnswer: (value: string) => void;
  answer: string;
  label: string;
}) {
  const { t } = useI18n();
  const [value, setValue] = useState(currentAnswer ?? "");
  const normalize = (text: string) =>
    text
      .normalize("NFKC")
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .replace(/\s+/gu, " ");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!answered && value.trim())
          onAnswer(normalize(value) === normalize(answer) ? answer : value);
      }}
      className="space-y-3"
    >
      <input
        type="text"
        value={value}
        disabled={answered}
        onChange={(event) => setValue(event.target.value)}
        aria-label={label}
        lang="en"
        dir="ltr"
        className="w-full min-h-[44px] rounded-xl border border-border px-3.5 py-2.5 bg-background text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
        placeholder={t("learningMaterials.rewritePlaceholder")}
      />
      <button
        type="submit"
        disabled={answered || !value.trim()}
        className="min-h-[44px] rounded-xl bg-primary text-primary-foreground font-bold px-5 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
      >
        {t("quiz.checkAnswer")}
      </button>
    </form>
  );
}

function RewriteExerciseComponent({ exercises }: { exercises: RewriteExercise[] }) {
  const { t } = useI18n();
  return (
    <CurriculumQuizEngine
      questions={exercises.map((exercise) => ({
        id: exercise.id,
        stem:
          exercise.sentence +
          " " +
          t("learningMaterials.rewriteUseHint", { hint: exercise.hintWord }),
        correctValue: exercise.answer,
        explanation: exercise.answer,
        customBody: ({ answered, currentAnswer, onAnswer }) => (
          <RewriteAnswer
            key={exercise.id}
            answered={answered}
            currentAnswer={currentAnswer}
            onAnswer={onAnswer}
            answer={exercise.answer}
            label={t("learningMaterials.rewritePlaceholder")}
          />
        ),
      }))}
    />
  );
}

export function ErrorCorrectionSection({ materials }: { materials: UnitLearningMaterials }) {
  const { t } = useI18n();
  if (!materials.errorCorrection) return null;
  return (
    <section className={CARD}>
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 className="font-bold text-lg text-foreground">{t("learningMaterials.findMistake")}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("learningMaterials.findMistakeDesc")}
        </p>
      </div>
      <FocusedQuestions
        key={materials.unitId}
        questions={materials.errorCorrection.map((item) => ({
          id: item.id,
          question: t("learningMaterials.chooseCorrection", { sentence: item.wrong }),
          options: [item.wrong, item.right],
          correctIndex: 1,
          explanation: item.right,
        }))}
      />
    </section>
  );
}

export function WritingPromptsSection({ materials }: { materials: UnitLearningMaterials }) {
  const { t } = useI18n();
  if (!materials.writingPrompts) return null;
  return (
    <section className={CARD}>
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 className="font-bold text-lg text-foreground">
          {t("learningMaterials.writingPrompts")}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("learningMaterials.writingPromptsDesc")}
        </p>
      </div>
      <div className="space-y-4">
        {materials.writingPrompts.map((p) => (
          <div key={p.id} className="border border-border p-4 sm:p-5 rounded-2xl bg-background">
            <h3 className="font-bold text-primary text-base">{p.title}</h3>
            <p className="text-base mt-2 text-foreground leading-relaxed">{p.prompt}</p>
            {p.suggestedVocabulary && (
              <p className="text-sm text-muted-foreground mt-3 bg-secondary/40 p-2.5 rounded-xl">
                <span className="font-bold text-foreground">
                  {t("learningMaterials.suggestedWords")}{" "}
                </span>
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
  const { t } = useI18n();
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
          {t("learningMaterials.selfAssessment")}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("learningMaterials.selfAssessmentDesc")}
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
                <p className="text-sm text-muted-foreground mt-0.5">{item.question}</p>
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
                      className={`relative flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl border text-sm font-bold transition-all focus-within:outline-none focus-within:ring-2 focus-within:ring-primary ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-primary/50 motion-safe:active:scale-95"
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

function FocusedQuestions({ questions }: { questions: MultipleChoiceExercise[] }) {
  return (
    <CurriculumQuizEngine
      questions={questions.map((q) => ({
        id: q.id,
        stem: q.question,
        correctValue: String(q.correctIndex),
        explanation: q.explanation,
        options: q.options.map((label, index) => ({
          value: String(index),
          label,
          accessibleLabel: label,
        })),
      }))}
    />
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
  const { t } = useI18n();
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <QuizQuestionCard
      id={`extra-${index}-${question.slice(0, 24)}`}
      index={index}
      question={question}
      value={picked === null ? undefined : String(picked)}
      correctValue={String(correctIndex)}
      onChange={(value) => setPicked(Number(value))}
      feedback={
        explanation ? (
          <>
            <span className="font-black">{t("learningMaterials.explanation")} </span>
            {explanation}
          </>
        ) : undefined
      }
      options={options.map((option, optionIndex) => ({
        value: String(optionIndex),
        label: option,
        accessibleLabel: option,
      }))}
    />
  );
}

function MatchingExerciseComponent({ exercises }: { exercises: MatchingExercise[] }) {
  const words = [...new Set(exercises.map((exercise) => exercise.word))].sort();
  return (
    <CurriculumQuizEngine
      questions={exercises.map((exercise) => ({
        id: exercise.word,
        stem: exercise.definition,
        correctValue: exercise.word,
        options: words.map((word) => ({ value: word, label: word, accessibleLabel: word })),
      }))}
    />
  );
}
