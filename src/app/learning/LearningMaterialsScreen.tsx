import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Volume2, Eye, EyeOff } from "lucide-react";
import { useAudio } from "../shared/useAudio";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { BackButton } from "../shared/BackButton";
import { StudyShell } from "./study/StudyShell";
import { COURSE_UNITS, DEFAULT_UNIT_ID, type VocabularyItem } from "../data/lessons";
import { loadLearningMaterials } from "./registry";
import { BLANK_TOKEN, type PhraseKind, type UnitLearningMaterials } from "./types";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { InteractiveText } from "./study/InteractiveText";

interface Props {
  unitId?: string;
  area?: string;
  nodeId?: string;
  dispatch: React.Dispatch<Action>;
}

const PHRASE_KIND_LABEL: Record<PhraseKind, string> = {
  idiom: "idiom",
  "phrasal-verb": "phrasal verb",
  collocation: "collocation",
};

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

  // RouterView keys this screen by unit id, so a different unit remounts with fresh state.
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
      })
      .catch(() => {
        if (!cancelled) setStatus("empty");
      });
    return () => {
      cancelled = true;
    };
  }, [unit.id]);

  const handleBack = useCallback(() => {
    dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id });
  }, [dispatch, unit.id]);

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
            className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold min-h-[48px] shadow-sm hover:bg-primary/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh max-h-dvh bg-background flex flex-col overflow-hidden">
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
});

/* ---------------------------------------------------------------- sections */

export function WordsSection({
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
          <div className="flex items-baseline justify-between gap-2 border-b border-border/60 pb-3">
            <h2 id={`subtopic-${topic.id}`} className="font-bold text-lg text-foreground">
              {topic.title}
            </h2>
            <span className="text-xs font-bold text-muted-foreground bg-secondary/80 px-2.5 py-0.5 rounded-full">
              {topic.wordIds.length} items
            </span>
          </div>
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {topic.wordIds.map((id) => {
              const word = byId.get(id);
              if (!word) return null;
              return (
                <li
                  key={id}
                  className="rounded-2xl border border-border overflow-hidden bg-background hover:border-primary/40 transition-colors shadow-2xs"
                >
                  <img
                    src={resolveAssetUrl(word.img)}
                    alt=""
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover bg-muted"
                  />
                  <div className="p-3">
                    <p className="font-bold text-sm text-foreground truncate">{word.label}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
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
  unitId,
  onInspectWord,
}: {
  materials: UnitLearningMaterials;
  unitId?: string;
  onInspectWord?: (word: VocabularyItem) => void;
}) {
  const passage = materials.passage;
  if (!passage) return null;
  return (
    <div className="space-y-6">
      <section className={CARD} aria-labelledby="passage-heading">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3.5">
          <h2 id="passage-heading" className="font-bold text-xl text-foreground min-w-0">
            {passage.title}
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
            {passage.level}
          </span>
        </div>
        <div className="mt-4 text-foreground text-base sm:text-lg leading-relaxed whitespace-pre-line">
          {unitId && onInspectWord ? (
            <InteractiveText text={passage.text} unitId={unitId} onInspectWord={onInspectWord} />
          ) : (
            <p>{passage.text}</p>
          )}
        </div>
      </section>

      <section className={CARD} aria-labelledby="comprehension-heading">
        <h2 id="comprehension-heading" className="font-bold text-lg text-foreground mb-1">
          Comprehension Questions
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Test your understanding of the story above.
        </p>
        <div className="space-y-4">
          {passage.questions.map((q, index) => (
            <MultipleChoice key={q.id} index={index} {...q} />
          ))}
        </div>

        {passage.openQuestions && passage.openQuestions.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border/80 p-5 bg-secondary/20">
            <h3 className="font-bold text-base text-foreground">Think about it</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reflect on these questions against the passage to deepen your understanding:
            </p>
            <ul className="mt-3 space-y-2.5 list-disc ps-5 text-sm text-foreground leading-relaxed">
              {passage.openQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
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
    <div className="rounded-2xl border border-border p-4 sm:p-5 bg-background">
      <p className="font-bold text-sm sm:text-base text-foreground mb-3">
        {index + 1}. {question}
      </p>
      <ul className="space-y-2">
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
      {answered && (
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
      <div className="border-b border-border/60 pb-3">
        <h2 id="phrases-heading" className="font-bold text-lg sm:text-xl text-foreground">
          Idioms, Phrasal Verbs &amp; Key Phrases
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Essential figurative and conversational language for this topic.
        </p>
      </div>

      <div role="group" aria-label="Filter phrases" className="mt-4 flex gap-2 flex-wrap">
        {(["all", "idiom", "phrasal-verb", "collocation"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] ${
              filter === key
                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:bg-secondary/40"
            }`}
          >
            {key === "all" ? "All" : `${PHRASE_KIND_LABEL[key]}s`} ({counts[key]})
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-3.5">
        {shown.map((phrase) => (
          <li
            key={phrase.id}
            className="rounded-2xl border border-border p-4 bg-background hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-2.5 flex-wrap">
              <p className="font-bold text-base text-foreground">{phrase.phrase}</p>
              <span
                className="text-[11px] uppercase tracking-wide font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
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
            <p className="text-sm text-foreground mt-1.5 leading-relaxed">{phrase.meaning}</p>
            <p className="text-xs sm:text-sm text-muted-foreground italic mt-1.5 border-s-2 border-primary/30 ps-2.5">
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
  unitId,
  onInspectWord,
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
      <div className="border-b border-border/60 pb-3">
        <h2 id="dialogue-heading" className="font-bold text-lg sm:text-xl text-foreground">
          {dialogue.title && dialogue.title.toLowerCase() !== "mini dialogue"
            ? `Mini Dialogue — ${dialogue.title}`
            : "Mini Dialogue"}
        </h2>
        {dialogue.scene && (
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground italic">{dialogue.scene}</p>
        )}
      </div>

      <ol className="mt-5 space-y-3.5">
        {dialogue.lines.map((line, i) => (
          <li
            key={`${line.speaker}-${i}`}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-background border border-border hover:border-primary/40 transition-colors"
          >
            <span className="font-bold text-primary shrink-0 min-w-16 max-w-28 break-words text-xs sm:text-sm pt-1 bg-primary/10 px-2.5 py-1 rounded-lg text-center">
              {line.speaker}:
            </span>
            <span className="text-foreground text-sm sm:text-base flex-1 min-w-0 break-words leading-relaxed pt-0.5">
              {unitId && onInspectWord ? (
                <InteractiveText text={line.text} unitId={unitId} onInspectWord={onInspectWord} />
              ) : (
                line.text
              )}
            </span>
            <button
              onClick={() => {
                stop();
                speak(line.text);
              }}
              className="size-11 shrink-0 rounded-xl bg-secondary text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px]"
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
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 id="mistakes-heading" className="font-bold text-lg sm:text-xl text-foreground">
          Common Mistakes &amp; Corrections
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Try to spot the mistake and correct it yourself before revealing the answer.
        </p>
      </div>

      <ul className="space-y-3.5">
        {materials.mistakes?.map((mistake) => {
          const isRevealed = revealedIds.has(mistake.id);
          return (
            <li
              key={mistake.id}
              className="rounded-2xl border border-border p-4 sm:p-5 bg-background"
            >
              <div className="flex justify-between items-start gap-3">
                <p className="text-sm sm:text-base text-destructive font-medium leading-relaxed">
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
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-secondary text-foreground hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                >
                  {isRevealed ? (
                    <>
                      <EyeOff className="size-4" aria-hidden /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="size-4" aria-hidden /> Reveal
                    </>
                  )}
                </button>
              </div>

              {isRevealed && (
                <div className="mt-3.5 pt-3.5 border-t border-border/60 space-y-2 animate-in fade-in duration-150">
                  <p className="text-sm sm:text-base text-wp-green font-bold">
                    <span aria-hidden className="font-bold">
                      ✓{" "}
                    </span>
                    <span className="sr-only">Correct: </span>
                    {mistake.right}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
  const columns = WORD_FORM_COLUMNS.filter(({ key }) => rows.some((row) => row[key] != null));

  return (
    <section className={CARD} aria-labelledby="word-formation-heading">
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 id="word-formation-heading" className="font-bold text-lg sm:text-xl text-foreground">
          Word Formation &amp; Word Families
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          See how base words transform across parts of speech.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/80 bg-background">
        <table className="w-full text-start border-collapse min-w-[32rem]">
          <caption className="sr-only">Word forms for this unit&apos;s key words</caption>
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              {columns.map(({ label }) => (
                <th
                  key={label}
                  scope="col"
                  className="text-start font-bold text-xs uppercase tracking-wider text-muted-foreground py-3 px-4"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {rows.map((row, rowIndex) => (
              <tr
                key={`${row.base ?? row.noun}-${rowIndex}`}
                className="hover:bg-secondary/20 transition-colors"
              >
                {columns.map(({ key }) => (
                  <td key={key} className="text-sm text-foreground py-3 px-4 font-medium">
                    {row[key] ?? <span className="text-muted-foreground/60">—</span>}
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
 */
export function PracticeSection({ materials }: { materials: UnitLearningMaterials }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const items = materials.blankExercises ?? [];
  const normalise = (value: string) => value.trim().toLowerCase();
  const correctCount = items.filter(
    (item) => normalise(answers[item.id] ?? "") === normalise(item.answer)
  ).length;

  return (
    <section className={CARD} aria-labelledby="practice-heading">
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 id="practice-heading" className="font-bold text-lg sm:text-xl text-foreground">
          Fill in the Blanks
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Complete each sentence with a word from this unit.
        </p>
      </div>

      <ol className="space-y-3.5">
        {items.map((item, index) => {
          const value = answers[item.id] ?? "";
          const isCorrect = normalise(value) === normalise(item.answer);
          const [before, after] = item.sentence.split(BLANK_TOKEN);
          return (
            <li
              key={item.id}
              className="text-foreground p-3.5 rounded-2xl border border-border bg-background"
            >
              <label className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-medium">
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
                  className={`min-w-36 rounded-xl border px-3 py-1.5 bg-background text-foreground text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] transition-colors ${
                    checked
                      ? isCorrect
                        ? "border-wp-green bg-wp-green-light/20 text-wp-green"
                        : "border-destructive bg-destructive/10 text-destructive"
                      : "border-border hover:border-primary/50"
                  }`}
                />
                <span>{after}</span>
                {checked && !isCorrect && (
                  <span className="text-xs sm:text-sm text-muted-foreground font-bold ms-1">
                    → Correct: <span className="text-wp-green">{item.answer}</span>
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="rounded-xl bg-primary text-primary-foreground font-bold px-5 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-primary/90 transition-colors min-h-[44px] shadow-xs"
        >
          Check answers
        </button>
        {checked && (
          <p
            role="status"
            className="text-sm font-bold text-foreground bg-secondary/80 px-3.5 py-2 rounded-xl"
          >
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
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 id="culture-heading" className="font-bold text-lg sm:text-xl text-foreground">
          Cultural &amp; Usage Notes
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-world etiquette, social nuance, and situational context.
        </p>
      </div>
      <ul className="space-y-3.5">
        {materials.culturalNotes?.map((note) => (
          <li
            key={note.id}
            className="rounded-2xl border border-border p-4 sm:p-5 bg-background hover:border-primary/40 transition-colors"
          >
            <p className="font-bold text-base text-foreground">{note.title}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
              {note.body}
            </p>
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
      <div className="border-b border-border/60 pb-3 mb-4">
        <h2 id="reference-heading" className="font-bold text-lg sm:text-xl text-foreground">
          Vocabulary Reference
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Comprehensive dictionary lookup with frequency ratings, parts of speech, and collocations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
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
            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
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
              className="px-3.5 py-2 bg-background border border-border rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
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
      <div className="mt-3.5 p-3.5 bg-secondary/30 rounded-2xl border border-border/60 text-xs text-muted-foreground flex flex-wrap gap-x-6 gap-y-2">
        <div>
          <span className="font-bold text-foreground">Frequency: </span>
          <span className="text-wp-amber">★★★</span> Core ·{" "}
          <span className="text-wp-amber">★★</span> Frequent ·{" "}
          <span className="text-wp-amber">★</span> Topic-specific
        </div>
        <div>
          <span className="font-bold text-foreground">Notation: </span>
          <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-foreground font-bold">
            ~
          </code>{" "}
          replaces base word in phrases
        </div>
      </div>

      {/* Accessible Table */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border/80 bg-background">
        <table className="w-full border-collapse min-w-[34rem]">
          <caption className="sr-only">
            Vocabulary reference table with word, part of speech, frequency rating, and collocations
          </caption>
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              {["Word", "Part of speech", "Frequency", "Key collocations"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="text-start font-bold text-xs uppercase tracking-wider text-muted-foreground py-3 px-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  No vocabulary matches your search.
                </td>
              </tr>
            ) : (
              filtered.map((entry) => (
                <tr key={entry.word} className="hover:bg-secondary/20 transition-colors align-top">
                  <th
                    scope="row"
                    className="font-bold text-sm text-foreground py-3 px-4 text-start"
                  >
                    <div className="flex items-center gap-2">
                      <span>{entry.word}</span>
                      <button
                        onClick={() => {
                          stop();
                          speak(entry.word);
                        }}
                        className="size-11 shrink-0 rounded-xl bg-secondary/80 text-primary inline-flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px]"
                        aria-label={`Pronounce ${entry.word}`}
                      >
                        <Volume2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </th>
                  <td className="text-sm text-muted-foreground py-3 px-4">{entry.partOfSpeech}</td>
                  <td className="text-sm py-3 px-4">
                    <span aria-hidden className="text-wp-amber font-mono text-base">
                      {"★".repeat(entry.frequency)}
                    </span>
                    <span className="sr-only">{entry.frequency} out of 3 frequency rating</span>
                  </td>
                  <td className="text-sm text-foreground py-3 px-4 font-medium">
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
