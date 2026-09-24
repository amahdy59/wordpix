import { useMemo, useState } from "react";
import { Check, Image as ImageIcon, Volume2 } from "lucide-react";
import { resolveAssetUrl } from "../../../../utils/assetUrl";
import { useI18n } from "../../../../i18n";
import { useAudio } from "../../../shared/useAudio";
import { getHadithVisualVocabulary } from "../figmaHadithCatalog";

interface VocabularyItem {
  term: string;
  partOfSpeech: string;
  definition: string;
  example?: string;
  arabic: string;
}

interface LanguageItem {
  expression: string;
  explanation: string;
}

const PART_OF_SPEECH = /^(?:noun(?: phrase)?|verb|adjective|adverb|phrase|expression)$/i;
const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

function section(lines: readonly string[], start: RegExp, end: RegExp): string[] {
  const startIndex = lines.findIndex((line) => start.test(line));
  if (startIndex < 0) return [];
  const endIndex = lines.findIndex((line, index) => index > startIndex && end.test(line));
  return lines.slice(startIndex + 1, endIndex < 0 ? undefined : endIndex);
}

export function parseHadithVocabulary(lines: readonly string[]): VocabularyItem[] {
  const values = section(
    lines,
    /^word$/i,
    /^(?:useful language|extra vocabulary|scholarship note)/i
  ).slice(3);
  const items: VocabularyItem[] = [];
  let index = 0;
  while (index < values.length) {
    const [term, partOfSpeech, definition] = values
      .slice(index, index + 3)
      .map((value) => value?.trim());
    if (!term || !partOfSpeech || !definition || !PART_OF_SPEECH.test(partOfSpeech)) {
      index += 1;
      continue;
    }
    const hasExample = /^e\.g\.,?/i.test(values[index + 3] ?? "");
    const example = hasExample ? values[index + 3].replace(/^e\.g\.,?\s*/i, "").trim() : undefined;
    const arabic = values[index + (hasExample ? 4 : 3)]?.trim();
    if (!arabic) break;
    items.push({ term, partOfSpeech, definition, example, arabic });
    index += hasExample ? 5 : 4;
  }
  return items;
}

function alternating(lines: readonly string[]): LanguageItem[] {
  const items: LanguageItem[] = [];
  for (let index = 0; index + 1 < lines.length; index += 2) {
    if (lines[index].trim() && lines[index + 1]?.trim()) {
      items.push({ expression: lines[index].trim(), explanation: lines[index + 1].trim() });
    }
  }
  return items;
}

function dashItems(lines: readonly string[]): LanguageItem[] {
  return lines
    .filter((line) => line.includes("—"))
    .map((line) => {
      const [expression, ...rest] = line.split("—");
      return { expression: expression.trim(), explanation: rest.join("—").trim() };
    });
}

function valueAfter(lines: readonly string[], heading: RegExp) {
  const index = lines.findIndex((line) => heading.test(line));
  return index >= 0 ? lines[index + 1] : undefined;
}

function AudioButton({ text, label }: { text: string; label?: string }) {
  const { t } = useI18n();
  const { speak, isPlaying, isError } = useAudio({ lang: "en-US", rate: 0.82, preferLocal: true });

  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-busy={isPlaying}
      aria-label={label ?? t("hadith.playVocabulary", { word: text }) ?? `Listen to ${text}`}
      className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary/5 px-3 text-xs font-black text-primary transition-all hover:bg-primary/10 active:scale-[0.98] ${focusRing}`}
    >
      <Volume2 className="size-4" aria-hidden />
      <span className="hidden sm:inline">
        {isPlaying
          ? t("hadith.playing") || "Playing…"
          : isError
            ? t("hadith.audioRetry") || "Retry"
            : t("hadith.listen") || "Listen"}
      </span>
    </button>
  );
}

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackLabel: string;
}

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions -- image error recovery needs an onError handler */
function ImageWithFallback({ src, alt, fallbackLabel }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="flex aspect-video sm:aspect-auto h-full min-h-36 w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-muted/80 p-4 text-center border-b sm:border-b-0 sm:border-s border-border">
        <div className="space-y-1.5">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ImageIcon className="size-5" aria-hidden />
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            {fallbackLabel}
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className="aspect-video sm:aspect-auto h-full w-full object-cover"
    />
  );
}
/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */

export function HadithVocabularyStage({ lines }: { lines: readonly string[] }) {
  const { t } = useI18n();
  const [revealedImages, setRevealedImages] = useState<Set<string>>(new Set());

  const toggleReveal = (imageRef: string) => {
    setRevealedImages((prev) => {
      const next = new Set(prev);
      if (next.has(imageRef)) next.delete(imageRef);
      else next.add(imageRef);
      return next;
    });
  };

  const vocabulary = useMemo(() => parseHadithVocabulary(lines), [lines]);
  const visuals = useMemo(
    () => getHadithVisualVocabulary(vocabulary.map((item) => item.term)),
    [vocabulary]
  );
  const useful = useMemo(
    () => alternating(section(lines, /^useful language/i, /^extra vocabulary/i)),
    [lines]
  );
  const extras = useMemo(
    () =>
      alternating(section(lines, /^extra vocabulary$/i, /^scholarship note$/i)).map((item) => ({
        ...item,
        explanation: item.explanation.replace(/^[-–]\s*/, ""),
      })),
    [lines]
  );
  const phrasal = useMemo(
    () => dashItems(section(lines, /^phrasal verbs$/i, /^collocations$/i)),
    [lines]
  );
  const collocations = useMemo(
    () => dashItems(section(lines, /^collocations$/i, /^word family$/i)),
    [lines]
  );

  const languageRows = [
    ...useful.map((item) => ({
      ...item,
      category: t("hadith.purposePatterns") || "Purpose Pattern",
    })),
    ...extras.map((item) => ({
      ...item,
      category: t("hadith.extraVocabulary") || "Extra Vocabulary",
    })),
    ...phrasal.map((item) => ({
      ...item,
      category: t("hadith.phrasalVerbs") || "Phrasal Verb",
    })),
    ...collocations.map((item) => ({
      ...item,
      category: t("hadith.collocationsAndIdioms") || "Collocation",
    })),
  ];

  return (
    <section
      className="mx-auto w-full max-w-6xl space-y-6"
      aria-labelledby="stage-vocabulary-heading"
    >
      {/* Header Banner */}
      <header className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-primary">
          {t("hadith.vocabularyLabel") || "Vocabulary Study"}
        </span>
        <h2
          id="stage-vocabulary-heading"
          tabIndex={-1}
          className="mt-2 text-2xl font-black tracking-tight text-foreground outline-none sm:text-3xl"
        >
          {t("hadith.visualVocabularyTitle") || "Core expressions, pictures, and use"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-muted-foreground">
          {t("hadith.vocabularyStudyInstructions") ||
            "Study the five core words first. Use the image, meaning, example, Arabic support, and pronunciation together; then review every expression in the complete language bank."}
        </p>
      </header>

      {/* Core Word Cards (2 columns) */}
      <div className="grid gap-4 lg:grid-cols-2">
        {vocabulary.map((item) => {
          const visual = visuals.find(
            (candidate) => candidate.label.toLowerCase() === item.term.toLowerCase()
          );
          const assetUrl = visual ? resolveAssetUrl(`hadith/v1/images/${visual.imageRef}.png`) : "";

          return (
            <article
              key={item.term}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-wp-sm transition-all hover:border-primary/40"
            >
              <div className="grid sm:grid-cols-[12rem_1fr]">
                <ImageWithFallback src={assetUrl} alt={item.term} fallbackLabel={item.term} />
                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-black text-foreground" lang="en" dir="ltr">
                          {item.term}
                        </h3>
                        <span className="mt-1 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-primary">
                          {item.partOfSpeech}
                        </span>
                      </div>
                      <AudioButton text={item.term} />
                    </div>

                    <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground">
                      {item.definition}
                    </p>

                    {item.example && (
                      <p
                        className="mt-2 rounded-xl bg-muted/60 p-3 text-xs font-medium italic text-muted-foreground"
                        lang="en"
                        dir="ltr"
                      >
                        “{item.example}”
                      </p>
                    )}
                  </div>

                  <p
                    className="mt-3 text-end font-serif text-lg font-bold text-primary"
                    lang="ar"
                    dir="rtl"
                  >
                    {item.arabic}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Complete Language Bank */}
      <section
        className="rounded-3xl border border-border bg-card p-5 shadow-wp-sm sm:p-7"
        aria-labelledby="language-bank-heading"
      >
        <h3 id="language-bank-heading" className="text-xl font-black text-foreground">
          {t("hadith.completeLanguageBank") || "Complete language bank"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("hadith.completeLanguageBankDescription") ||
            "Every purpose pattern, extra word, phrasal verb, and collocation from this lesson is grouped below."}
        </p>

        {/* Desktop Table View */}
        <div className="mt-5 hidden overflow-x-auto rounded-2xl border border-border md:block">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/70">
              <tr>
                <th className="p-4 text-start font-black text-foreground">
                  {t("hadith.category") || "Category"}
                </th>
                <th className="p-4 text-start font-black text-foreground">
                  {t("hadith.expression") || "Word or expression"}
                </th>
                <th className="p-4 text-start font-black text-foreground">
                  {t("hadith.meaningOrExample") || "Meaning or example"}
                </th>
                <th className="p-4 text-end">
                  <span className="sr-only">{t("hadith.audio") || "Audio"}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {languageRows.map((item) => (
                <tr
                  key={`${item.category}-${item.expression}`}
                  className="border-t border-border align-top transition-colors hover:bg-muted/30"
                >
                  <td className="p-4 text-xs font-black uppercase tracking-wide text-primary">
                    {item.category}
                  </td>
                  <td className="p-4 font-black text-foreground" lang="en" dir="ltr">
                    {item.expression}
                  </td>
                  <td
                    className="p-4 font-semibold leading-relaxed text-muted-foreground"
                    lang="en"
                    dir="ltr"
                  >
                    {item.explanation}
                  </td>
                  <td className="p-3 text-end">
                    <AudioButton text={item.expression.replace(/\+.*$/, "").trim()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Reflow Cards (Prevents horizontal table scroll) */}
        <div className="mt-4 space-y-3 md:hidden">
          {languageRows.map((item) => (
            <div
              key={`m-${item.category}-${item.expression}`}
              className="rounded-2xl border border-border bg-background p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                  {item.category}
                </span>
                <AudioButton text={item.expression.replace(/\+.*$/, "").trim()} />
              </div>
              <p className="mt-2 text-base font-black text-foreground" lang="en" dir="ltr">
                {item.expression}
              </p>
              <p
                className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground"
                lang="en"
                dir="ltr"
              >
                {item.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* 3 Pedagogical Sidebars: Word Family, Contrast, Common Error */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <aside className="rounded-2xl border border-border bg-muted/50 p-4 shadow-sm">
            <p className="text-xs font-black uppercase text-primary">
              {t("hadith.wordFamily") || "Word family"}
            </p>
            <p className="mt-2 text-sm font-bold text-foreground" lang="en" dir="ltr">
              {valueAfter(lines, /^word family$/i) || "N/A"}
            </p>
          </aside>

          <aside className="rounded-2xl border border-border bg-muted/50 p-4 shadow-sm">
            <p className="text-xs font-black uppercase text-primary">
              {t("hadith.synonymContrast") || "Meaning contrast"}
            </p>
            <p className="mt-2 text-sm font-semibold text-muted-foreground" lang="en" dir="ltr">
              {valueAfter(lines, /^synonym \/ contrast$/i) || "N/A"}
            </p>
          </aside>

          <aside className="rounded-2xl border border-feedback-warning-border bg-feedback-warning-surface p-4 shadow-sm">
            <p className="text-xs font-black uppercase text-feedback-warning-foreground">
              {t("hadith.commonError") || "Common error"}
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground" lang="en" dir="ltr">
              {valueAfter(lines, /^common error$/i) || "N/A"}
            </p>
          </aside>
        </div>
      </section>

      {/* Picture Vocabulary Check (Dual-Coding Testing Effect) */}
      {visuals.length > 0 && (
        <section
          className="rounded-3xl border border-border bg-card p-5 shadow-wp-sm sm:p-7"
          aria-labelledby="picture-check-heading"
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="size-5 text-primary" aria-hidden />
            <h3 id="picture-check-heading" className="text-xl font-black text-foreground">
              {t("hadith.pictureVocabularyCheck") || "Picture vocabulary check"}
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("hadith.pictureVocabularyDescription") ||
              "Choose a picture, name the word aloud, then reveal the answer to test your recall."}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {visuals.map((item) => {
              const isRevealed = revealedImages.has(item.imageRef);
              const assetUrl = resolveAssetUrl(`hadith/v1/images/${item.imageRef}.png`);

              return (
                <div
                  key={item.imageRef}
                  className="flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-background shadow-sm transition-all hover:border-primary/40"
                >
                  <div className="aspect-square w-full overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={assetUrl}
                      alt={isRevealed ? item.label : "Vocabulary image"}
                      fallbackLabel={item.label}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleReveal(item.imageRef)}
                    aria-pressed={isRevealed}
                    className={`flex min-h-12 w-full items-center justify-center gap-2 p-3 text-center text-xs font-black transition-colors ${focusRing} ${
                      isRevealed
                        ? "bg-primary/10 text-primary"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {isRevealed ? (
                      <>
                        <Check className="size-4 text-primary" aria-hidden />
                        <span>{item.label}</span>
                      </>
                    ) : (
                      <span>{t("hadith.revealWord") || "Reveal word"}</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
}
