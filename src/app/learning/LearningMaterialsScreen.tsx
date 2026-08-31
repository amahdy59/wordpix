import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type * as React from "react";
import {
  BookOpen,
  MessageSquareQuote,
  MessagesSquare,
  AlertTriangle,
  Type,
  PencilLine,
  Globe,
  Table2,
  Layers,
  CheckCircle2,
  XCircle,
  Volume2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAudio } from "../shared/useAudio";
import { HomeIndicator } from "../shared/HomeIndicator";
import {
  VocabularyDetailsSection,
  PronunciationSection,
  PriorityTiersSection,
  CollocationsSection,
  SynonymsAntonymsSection,
  AdditionalExercisesSection,
  ErrorCorrectionSection,
  WritingPromptsSection,
  SelfAssessmentSection,
} from "./ExtraSections";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { BackButton } from "../shared/BackButton";
import { StudyShell } from "./study/StudyShell";
import { COURSE_UNITS, DEFAULT_UNIT_ID, type VocabularyItem } from "../data/lessons";
import { loadedUnitVocabulary } from "../data/vocabulary";
import { loadLearningMaterials } from "./registry";
import { BLANK_TOKEN, type PhraseKind, type UnitLearningMaterials } from "./types";
import { resolveAssetUrl } from "../../utils/assetUrl";

interface Props {
  unitId?: string;
  area?: string;
  nodeId?: string;
  dispatch: React.Dispatch<Action>;
}

type SectionId =
  | "words"
  | "passage"
  | "vocabulary-details"
  | "pronunciation"
  | "priority-tiers"
  | "collocations"
  | "synonyms-antonyms"
  | "phrases"
  | "word-formation"
  | "dialogue"
  | "culture"
  | "mistakes"
  | "practice"
  | "additional-exercises"
  | "error-correction"
  | "writing-prompts"
  | "self-assessment"
  | "reference";

const SECTION_META: Record<SectionId, { label: string; icon: React.ElementType }> = {
  words: { label: "Words", icon: Layers },
  passage: { label: "Reading", icon: BookOpen },
  "vocabulary-details": { label: "Vocabulary Details", icon: Layers },
  pronunciation: { label: "Pronunciation Guide", icon: Type },
  "priority-tiers": { label: "Priority Tiers", icon: AlertTriangle },
  collocations: { label: "Collocations", icon: MessageSquareQuote },
  "synonyms-antonyms": { label: "Synonyms & Antonyms", icon: PencilLine },
  phrases: { label: "Idioms & Phrasal Verbs", icon: MessageSquareQuote },
  "word-formation": { label: "Word Forms", icon: Type },
  dialogue: { label: "Dialogue", icon: MessagesSquare },
  culture: { label: "Culture & Usage", icon: Globe },
  mistakes: { label: "Common Mistakes", icon: AlertTriangle },
  practice: { label: "Practice", icon: PencilLine },
  "additional-exercises": { label: "Additional Exercises", icon: PencilLine },
  "error-correction": { label: "Error Correction", icon: AlertTriangle },
  "writing-prompts": { label: "Writing Prompts", icon: PencilLine },
  "self-assessment": { label: "Self-Assessment", icon: CheckCircle2 },
  reference: { label: "Reference", icon: Table2 },
};

const PHRASE_KIND_LABEL: Record<PhraseKind, string> = {
  idiom: "idiom",
  "phrasal-verb": "phrasal verb",
  collocation: "collocation",
};

/** Which sections this unit actually has content for, in reading order. */
function availableSections(m: UnitLearningMaterials): SectionId[] {
  const present: [SectionId, boolean][] = [
    ["words", Boolean(m.subtopics?.length)],
    ["passage", Boolean(m.passage)],
    ["vocabulary-details", Boolean(m.registerLabels?.length || m.visualVocabularyMap?.length)],
    ["pronunciation", Boolean(m.pronunciationGuide?.length)],
    ["priority-tiers", Boolean(m.priorityTiers)],
    ["collocations", Boolean(m.collocations?.length || m.collocationsQuiz?.length)],
    ["synonyms-antonyms", Boolean(m.synonymsAntonyms?.length)],
    ["phrases", Boolean(m.phrases?.length)],
    ["word-formation", Boolean(m.wordFormation?.length)],
    ["dialogue", Boolean(m.dialogue?.lines.length)],
    ["culture", Boolean(m.culturalNotes?.length)],
    ["mistakes", Boolean(m.mistakes?.length)],
    ["practice", Boolean(m.blankExercises?.length)],
    ["additional-exercises", Boolean(m.additionalExercises)],
    ["error-correction", Boolean(m.errorCorrection?.length)],
    ["writing-prompts", Boolean(m.writingPrompts?.length)],
    ["self-assessment", Boolean(m.selfAssessment?.length)],
    ["reference", Boolean(m.wordMeta?.length)],
  ];
  return present.filter(([, ok]) => ok).map(([id]) => id);
}

const CARD = "bg-wp-card rounded-2xl border border-border p-5 shadow-sm";

/**
 * Study materials for one unit: the eight content blocks Figma carries beside
 * the word cards, plus the sub-topic grouping the cards are organised into.
 *
 * Deliberately outside the scored lesson state machine. This is reference and
 * self-paced practice — nothing here records attempts or advances progress.
 */
export const LearningMaterialsScreen = memo(function LearningMaterialsScreen({
  unitId,
  area,
  nodeId,
  dispatch,
}: Props) {
  const unit = COURSE_UNITS[unitId ?? DEFAULT_UNIT_ID] ?? COURSE_UNITS[DEFAULT_UNIT_ID];
  const [materials, setMaterials] = useState<UnitLearningMaterials | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");
  const [section, setSection] = useState<SectionId>("passage");

  // No reset-on-change here: RouterView keys this screen by unit id, so a
  // different unit remounts with fresh "loading" state rather than needing an
  // effect to clear the previous unit's materials.
  useEffect(() => {
    let cancelled = false;
    loadLearningMaterials(unit.id)
      .then((loaded) => {
        if (cancelled) return;
        if (!loaded) {
          setStatus("empty");
          return;
        }
        setMaterials(loaded);
        setStatus("ready");
        const sections = availableSections(loaded);
        setSection(sections.includes("passage") ? "passage" : (sections[0] ?? "passage"));
      })
      .catch(() => {
        if (!cancelled) setStatus("empty");
      });
    return () => {
      cancelled = true;
    };
  }, [unit.id]);

  const sections = useMemo(() => (materials ? availableSections(materials) : []), [materials]);

  const handleBack = useCallback(() => {
    dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id });
  }, [dispatch, unit.id]);

  if (unit.id === "bathroom") {
    if (status === "loading") {
      return (
        <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-8 text-center">
          <StatusBar />
          <div
            className="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"
            aria-hidden
          />
          <p className="font-sans text-muted-foreground" role="status">
            Loading study materials…
          </p>
        </div>
      );
    }

    if (status === "empty" || !materials) {
      return (
        <div className="min-h-dvh bg-background flex flex-col">
          <StatusBar />
          <header className="px-4 py-3 border-b border-border flex items-center gap-3">
            <BackButton onClick={handleBack} aria-label={`Back to ${unit.name}`} />
            <div className="min-w-0">
              <h1 className="font-sans font-bold text-xl text-foreground">{unit.name}</h1>
            </div>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <p className="font-sans text-muted-foreground mb-4">
              No study materials available for this unit yet.
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold min-h-[44px]"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-dvh bg-background flex flex-col">
        <StatusBar />
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <StudyShell
            unitId={unit.id}
            unit={unit}
            materials={materials}
            initialArea={area}
            initialNodeId={nodeId}
            dispatch={dispatch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <StatusBar />
      <header className="px-4 pt-2 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <BackButton onClick={handleBack} aria-label={`Back to ${unit.name}`} />
          {/* min-w-0 so a long unit name wraps instead of pushing the header wide. */}
          <div className="min-w-0">
            <p className="font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Study Materials
            </p>
            <h1 className="font-sans font-bold text-xl text-foreground leading-tight">
              {unit.name}
            </h1>
          </div>
        </div>

        {sections.length > 0 && (
          <nav aria-label="Study sections" className="mt-3 -mx-4 px-4 overflow-x-auto">
            <ul className="flex gap-2 w-max">
              {sections.map((id) => {
                const { label, icon: Icon } = SECTION_META[id];
                const isActive = id === section;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setSection(id)}
                      aria-current={isActive ? "true" : undefined}
                      // These are the primary navigation of the study screen
                      // and sat at 34px tall, under the 44px touch minimum —
                      // on the one screen that is a horizontal scroller, where
                      // a mistimed tap scrolls instead of selecting.
                      className={`inline-flex items-center gap-2 rounded-full px-4 min-h-[44px] text-sm font-sans font-bold border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-wp-card text-muted-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className="size-4" aria-hidden />
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1 px-4 py-5 space-y-4 max-w-3xl w-full mx-auto">
        {status === "loading" && (
          <p role="status" className="font-sans text-muted-foreground">
            Loading study materials…
          </p>
        )}

        {status === "empty" && (
          <div className={CARD}>
            <p className="font-sans font-bold text-foreground">No study materials yet</p>
            <p className="font-sans text-sm text-muted-foreground mt-1">
              {unit.name} has not been imported from the design file yet. The word lessons are
              unaffected.
            </p>
          </div>
        )}

        {status === "ready" && materials && (
          <>
            {section === "words" && (
              <WordsSection materials={materials} unitVocabulary={loadedUnitVocabulary(unit.id)} />
            )}
            {section === "passage" && <PassageSection materials={materials} />}
            {section === "vocabulary-details" && <VocabularyDetailsSection materials={materials} />}
            {section === "pronunciation" && <PronunciationSection materials={materials} />}
            {section === "priority-tiers" && <PriorityTiersSection materials={materials} />}
            {section === "collocations" && <CollocationsSection materials={materials} />}
            {section === "synonyms-antonyms" && <SynonymsAntonymsSection materials={materials} />}
            {section === "phrases" && <PhrasesSection materials={materials} />}
            {section === "word-formation" && <WordFormationSection materials={materials} />}
            {section === "dialogue" && <DialogueSection materials={materials} />}
            {section === "culture" && <CultureSection materials={materials} />}
            {section === "mistakes" && <MistakesSection materials={materials} />}
            {section === "practice" && <PracticeSection materials={materials} />}
            {section === "additional-exercises" && (
              <AdditionalExercisesSection materials={materials} />
            )}
            {section === "error-correction" && <ErrorCorrectionSection materials={materials} />}
            {section === "writing-prompts" && <WritingPromptsSection materials={materials} />}
            {section === "self-assessment" && <SelfAssessmentSection materials={materials} />}
            {section === "reference" && <ReferenceSection materials={materials} />}
          </>
        )}
      </main>
      <HomeIndicator />
    </div>
  );
});

/* ---------------------------------------------------------------- sections */

function WordsSection({
  materials,
  unitVocabulary,
}: {
  materials: UnitLearningMaterials;
  unitVocabulary: VocabularyItem[];
}) {
  const byId = useMemo(() => new Map(unitVocabulary.map((w) => [w.id, w])), [unitVocabulary]);

  return (
    <>
      {materials.subtopics?.map((topic) => (
        <section key={topic.id} className={CARD} aria-labelledby={`subtopic-${topic.id}`}>
          <div className="flex items-baseline gap-2">
            <h2 id={`subtopic-${topic.id}`} className="font-sans font-bold text-lg text-foreground">
              {topic.title}
            </h2>
            <span className="font-sans text-xs text-muted-foreground">
              {topic.wordIds.length} items
            </span>
          </div>
          <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {topic.wordIds.map((id) => {
              const word = byId.get(id);
              if (!word) return null;
              return (
                <li
                  key={id}
                  className="rounded-xl border border-border overflow-hidden bg-background"
                >
                  <img
                    src={resolveAssetUrl(word.img)}
                    alt=""
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="p-2">
                    <p className="font-sans font-bold text-sm text-foreground truncate">
                      {word.label}
                    </p>
                    <p className="font-sans text-[11px] text-muted-foreground truncate">
                      {word.phonetic}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}

export function PassageSection({
  materials,
}: {
  materials: UnitLearningMaterials;
  unitId?: string;
  onInspectWord?: (word: VocabularyItem) => void;
}) {
  const passage = materials.passage;
  if (!passage) return null;
  return (
    <>
      <section className={CARD} aria-labelledby="passage-heading">
        <div className="flex items-center gap-2">
          <h2 id="passage-heading" className="font-sans font-bold text-lg text-foreground min-w-0">
            {passage.title}
          </h2>
          <span className="font-sans text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary text-primary border border-primary/20 shrink-0">
            {passage.level}
          </span>
        </div>
        <p className="mt-3 font-sans text-foreground leading-relaxed whitespace-pre-line">
          {passage.text}
        </p>
      </section>

      <section className={CARD} aria-labelledby="comprehension-heading">
        <h2 id="comprehension-heading" className="font-sans font-bold text-lg text-foreground">
          Comprehension Questions
        </h2>
        <div className="mt-3 space-y-4">
          {passage.questions.map((q, index) => (
            <MultipleChoice key={q.id} index={index} {...q} />
          ))}
        </div>

        {/*
          Questions the import could not turn into multiple choice honestly —
          ones asking for a reason, a method, or several items. Shown as
          prompts to think through against the passage rather than dropped, or
          worse, converted into a quiz that answers itself.
        */}
        {passage.openQuestions && passage.openQuestions.length > 0 && (
          <div className="mt-5 rounded-xl border border-border p-4 bg-background">
            <h3 className="font-sans font-bold text-foreground">Think about it</h3>
            <p className="font-sans text-sm text-muted-foreground mt-1">
              No multiple choice for these — answer them against the passage.
            </p>
            <ul className="mt-3 space-y-2 list-disc ps-5">
              {passage.openQuestions.map((question) => (
                <li key={question} className="font-sans text-foreground">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}

function MultipleChoice({
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
  explanation: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <div className="rounded-xl border border-border p-4">
      <p className="font-sans font-bold text-foreground">
        {index + 1}. {question}
      </p>
      <ul className="mt-3 space-y-2">
        {options.map((option, i) => {
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
                    ? "border-wp-green bg-wp-green-light/20 text-wp-green"
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
      {answered && (
        <p role="status" className="mt-3 font-sans text-sm text-muted-foreground">
          {explanation}
        </p>
      )}
    </div>
  );
}

export function PhrasesSection({ materials }: { materials: UnitLearningMaterials }) {
  const [filter, setFilter] = useState<"all" | PhraseKind>("all");
  const phrases = materials.phrases ?? [];
  const shown = filter === "all" ? phrases : phrases.filter((p) => p.kind === filter);

  const counts = {
    all: phrases.length,
    idiom: phrases.filter((p) => p.kind === "idiom").length,
    "phrasal-verb": phrases.filter((p) => p.kind === "phrasal-verb").length,
    collocation: phrases.filter((p) => p.kind === "collocation").length,
  };

  return (
    <section className={CARD} aria-labelledby="phrases-heading">
      <h2 id="phrases-heading" className="font-sans font-bold text-lg text-foreground">
        Idioms, Phrasal Verbs &amp; Key Phrases
      </h2>

      <div role="group" aria-label="Filter phrases" className="mt-3 flex gap-2 flex-wrap">
        {(["all", "idiom", "phrasal-verb", "collocation"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`rounded-full px-3 py-1 text-xs font-sans font-bold border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              filter === key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {key === "all" ? "All" : `${PHRASE_KIND_LABEL[key]}s`} ({counts[key]})
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {shown.map((phrase) => (
          <li key={phrase.id} className="rounded-xl border border-border p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-sans font-bold text-foreground">{phrase.phrase}</p>
              <span
                className="font-sans text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-secondary text-primary border border-primary/20"
                title={
                  phrase.kindInferred
                    ? "Kind inferred from the phrase, not tagged in the source"
                    : undefined
                }
              >
                {PHRASE_KIND_LABEL[phrase.kind]}
                {phrase.kindInferred && <span aria-hidden>*</span>}
                {phrase.kindInferred && <span className="sr-only"> (inferred)</span>}
              </span>
            </div>
            <p className="font-sans text-sm text-foreground mt-1">{phrase.meaning}</p>
            <p className="font-sans text-sm text-muted-foreground italic mt-1">
              &ldquo;{phrase.example}&rdquo;
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DialogueSection({
  materials,
}: {
  materials: UnitLearningMaterials;
  unitId?: string;
  onInspectWord?: (word: VocabularyItem) => void;
}) {
  const dialogue = materials.dialogue;
  const { speak, stop } = useAudio({ lang: "en-US", rate: 0.9 });
  if (!dialogue) return null;

  return (
    <section className={CARD} aria-labelledby="dialogue-heading">
      <h2 id="dialogue-heading" className="font-sans font-bold text-lg text-foreground">
        {dialogue.title && dialogue.title.toLowerCase() !== "mini dialogue"
          ? `Mini Dialogue — ${dialogue.title}`
          : "Mini Dialogue"}
      </h2>
      {dialogue.scene && (
        <p className="mt-1 font-sans text-sm text-muted-foreground italic">{dialogue.scene}</p>
      )}
      <ol className="mt-4 space-y-3">
        {dialogue.lines.map((line, i) => (
          <li
            key={`${line.speaker}-${i}`}
            className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border"
          >
            <span className="font-sans font-bold text-primary shrink-0 min-w-16 max-w-28 break-words text-sm pt-0.5">
              {line.speaker}:
            </span>
            {/*
              min-w-0 is what lets this wrap. A flex item defaults to
              min-width: auto, so a dialogue line would not go narrower than
              its own longest unbroken run of text — the row grew past the card
              and every line was clipped at the right edge of a phone screen,
              with no way to scroll to the rest of the sentence.
            */}
            <span className="font-sans text-foreground text-sm flex-1 min-w-0 break-words leading-relaxed">
              {line.text}
            </span>
            <button
              onClick={() => {
                stop();
                speak(line.text);
              }}
              className="size-8 shrink-0 rounded-full bg-secondary text-primary flex items-center justify-center hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Listen to ${line.speaker}'s line`}
            >
              <Volume2 className="size-4" aria-hidden />
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function MistakesSection({ materials }: { materials: UnitLearningMaterials }) {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className={CARD} aria-labelledby="mistakes-heading">
      <h2 id="mistakes-heading" className="font-sans font-bold text-lg text-foreground">
        Common Mistakes &amp; Corrections
      </h2>
      <p className="text-xs text-muted-foreground mt-1 mb-4">
        Try spot the mistake and correct it yourself before revealing the answer.
      </p>
      <ul className="space-y-3">
        {materials.mistakes?.map((mistake) => {
          const isRevealed = revealedIds.has(mistake.id);
          return (
            <li key={mistake.id} className="rounded-xl border border-border p-4 bg-background">
              <div className="flex justify-between items-start gap-2">
                <p className="font-sans text-sm text-destructive font-medium">
                  <span aria-hidden className="font-bold">
                    ✗{" "}
                  </span>
                  <span className="sr-only">Incorrect: </span>
                  {mistake.wrong}
                </p>
                <button
                  type="button"
                  onClick={() => toggleReveal(mistake.id)}
                  aria-expanded={isRevealed}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[36px]"
                >
                  {isRevealed ? (
                    <>
                      <EyeOff className="size-3.5" aria-hidden /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="size-3.5" aria-hidden /> Reveal
                    </>
                  )}
                </button>
              </div>

              {isRevealed && (
                <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5 animate-in fade-in duration-150">
                  <p className="font-sans text-sm text-wp-green font-medium">
                    <span aria-hidden className="font-bold">
                      ✓{" "}
                    </span>
                    <span className="sr-only">Correct: </span>
                    {mistake.right}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                    <span className="font-bold text-foreground">Explanation: </span>
                    {mistake.note}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const WORD_FORM_COLUMNS = [
  { key: "base", label: "Base Word" },
  { key: "noun", label: "Noun" },
  { key: "verb", label: "Verb" },
  { key: "adjective", label: "Adjective" },
  { key: "adverb", label: "Adverb" },
] as const;

export function WordFormationSection({ materials }: { materials: UnitLearningMaterials }) {
  const rows = materials.wordFormation ?? [];
  // Units differ in which columns they carry; showing a column that is empty
  // for every row is just a wall of em dashes.
  const columns = WORD_FORM_COLUMNS.filter(({ key }) => rows.some((row) => row[key] != null));

  return (
    <section className={CARD} aria-labelledby="word-formation-heading">
      <h2 id="word-formation-heading" className="font-sans font-bold text-lg text-foreground">
        Word Formation
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-start border-collapse min-w-[32rem]">
          <caption className="sr-only">Word forms for this unit&apos;s key words</caption>
          <thead>
            <tr className="border-b border-border">
              {columns.map(({ label }) => (
                <th
                  key={label}
                  scope="col"
                  className="text-start font-sans font-bold text-sm text-muted-foreground py-2 pe-3"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${row.base ?? row.noun}-${rowIndex}`} className="border-b border-border/50">
                {columns.map(({ key }) => (
                  <td key={key} className="font-sans text-sm text-foreground py-2 pe-3">
                    {row[key] ?? <span className="text-muted-foreground">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/**
 * Fill-in-the-blank practice.
 *
 * Not routed through `ExerciseContextFill`: that drill asks a learner to pick
 * an image for a sentence, and several answers here ("dry", "laundry") have no
 * picture to pick. Typed answers keep the exercise faithful to the design.
 */
function PracticeSection({ materials }: { materials: UnitLearningMaterials }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const items = materials.blankExercises ?? [];
  const normalise = (value: string) => value.trim().toLowerCase();
  const correctCount = items.filter(
    (item) => normalise(answers[item.id] ?? "") === normalise(item.answer)
  ).length;

  return (
    <section className={CARD} aria-labelledby="practice-heading">
      <h2 id="practice-heading" className="font-sans font-bold text-lg text-foreground">
        Fill in the Blanks
      </h2>
      <p className="font-sans text-sm text-muted-foreground mt-1">
        Complete each sentence with a word from this unit.
      </p>

      <ol className="mt-4 space-y-3">
        {items.map((item, index) => {
          const value = answers[item.id] ?? "";
          const isCorrect = normalise(value) === normalise(item.answer);
          const [before, after] = item.sentence.split(BLANK_TOKEN);
          return (
            <li key={item.id} className="font-sans text-foreground">
              <label className="flex flex-wrap items-center gap-1.5">
                <span>
                  {index + 1}. {before}
                </span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }));
                    setChecked(false);
                  }}
                  aria-label={`Answer for sentence ${index + 1}`}
                  className={`w-36 rounded-lg border px-2 py-1 bg-background text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    checked
                      ? isCorrect
                        ? "border-wp-green"
                        : "border-destructive"
                      : "border-border"
                  }`}
                />
                <span>{after}</span>
                {checked && !isCorrect && (
                  <span className="font-sans text-sm text-muted-foreground">→ {item.answer}</span>
                )}
              </label>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="rounded-xl bg-primary text-primary-foreground font-sans font-bold px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Check answers
        </button>
        {checked && (
          <p role="status" className="font-sans text-sm text-foreground">
            {correctCount} of {items.length} correct
          </p>
        )}
      </div>
    </section>
  );
}

export function CultureSection({ materials }: { materials: UnitLearningMaterials }) {
  return (
    <section className={CARD} aria-labelledby="culture-heading">
      <h2 id="culture-heading" className="font-sans font-bold text-lg text-foreground">
        Cultural &amp; Usage Notes
      </h2>
      <ul className="mt-3 space-y-3">
        {materials.culturalNotes?.map((note) => (
          <li key={note.id} className="rounded-xl border border-border p-3">
            <p className="font-sans font-bold text-foreground">{note.title}</p>
            <p className="font-sans text-sm text-muted-foreground mt-1">{note.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ReferenceSection({ materials }: { materials: UnitLearningMaterials }) {
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("all");
  const { speak, stop } = useAudio({ lang: "en-US", rate: 0.9 });

  const rawEntries = useMemo(() => materials.wordMeta ?? [], [materials.wordMeta]);
  const partsOfSpeech = useMemo(() => {
    const set = new Set(rawEntries.map((e) => e.partOfSpeech).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [rawEntries]);

  const filtered = useMemo(() => {
    return rawEntries.filter((entry) => {
      const matchSearch =
        !search.trim() ||
        entry.word.toLowerCase().includes(search.toLowerCase()) ||
        entry.collocations.some((c) => c.toLowerCase().includes(search.toLowerCase()));
      const matchPos = posFilter === "all" || entry.partOfSpeech === posFilter;
      return matchSearch && matchPos;
    });
  }, [rawEntries, search, posFilter]);

  return (
    <section className={CARD} aria-labelledby="reference-heading">
      <h2 id="reference-heading" className="font-sans font-bold text-lg text-foreground">
        Vocabulary Reference
      </h2>

      {/* Filter and Search Bar */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="vocab-ref-search" className="sr-only">
            Search vocabulary reference
          </label>
          <input
            id="vocab-ref-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search word or collocation…"
            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
          />
        </div>

        {partsOfSpeech.length > 2 && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="pos-filter"
              className="text-xs font-bold text-muted-foreground shrink-0"
            >
              Part of speech:
            </label>
            <select
              id="pos-filter"
              value={posFilter}
              onChange={(e) => setPosFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
            >
              {partsOfSpeech.map((pos) => (
                <option key={pos} value={pos}>
                  {pos === "all" ? "All parts of speech" : pos}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Frequency & Notation Legend */}
      <div className="mt-3 p-3 bg-secondary/30 rounded-xl border border-border/60 text-xs text-muted-foreground flex flex-wrap gap-x-6 gap-y-2">
        <div>
          <span className="font-bold text-foreground">Frequency: </span>
          <span className="text-wp-amber">★★★</span> Core / Most common ·{" "}
          <span className="text-wp-amber">★★</span> Frequent ·{" "}
          <span className="text-wp-amber">★</span> Topic-specific
        </div>
        <div>
          <span className="font-bold text-foreground">Notation: </span>
          <code className="px-1 bg-muted rounded font-mono">~</code> replaces the base word in
          phrases
        </div>
      </div>

      {/* Accessible Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse min-w-[34rem]">
          <caption className="sr-only">
            Vocabulary reference table with word, part of speech, frequency rating, and collocations
          </caption>
          <thead>
            <tr className="border-b border-border">
              {["Word", "Part of speech", "Frequency", "Key collocations"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="text-start font-sans font-bold text-sm text-muted-foreground py-2.5 pe-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  No vocabulary matches your search.
                </td>
              </tr>
            ) : (
              filtered.map((entry) => (
                <tr key={entry.word} className="border-b border-border/50 align-top">
                  <th
                    scope="row"
                    className="font-sans font-bold text-sm text-foreground py-3 pe-3 text-start"
                  >
                    <div className="flex items-center gap-2">
                      <span>{entry.word}</span>
                      <button
                        onClick={() => {
                          stop();
                          speak(entry.word);
                        }}
                        className="size-7 rounded-full bg-secondary text-primary inline-flex items-center justify-center hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={`Pronounce ${entry.word}`}
                      >
                        <Volume2 className="size-3.5" aria-hidden />
                      </button>
                    </div>
                  </th>
                  <td className="font-sans text-sm text-muted-foreground py-3 pe-3">
                    {entry.partOfSpeech}
                  </td>
                  <td className="font-sans text-sm py-3 pe-3">
                    <span aria-hidden className="text-wp-amber font-mono">
                      {"★".repeat(entry.frequency)}
                    </span>
                    <span className="sr-only">{entry.frequency} out of 3 frequency rating</span>
                  </td>
                  <td className="font-sans text-sm text-foreground py-3 pe-3">
                    {entry.collocations.join(", ")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
