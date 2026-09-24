import { useMemo, useState } from "react";
import { Check, Image as ImageIcon, Volume2 } from "lucide-react";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import { useI18n } from "../../../i18n";
import { useAudio } from "../../shared/useAudio";
import { getHadithVisualVocabulary } from "./figmaHadithCatalog";

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
  for (let index = 0; index + 1 < lines.length; index += 2)
    items.push({ expression: lines[index].trim(), explanation: lines[index + 1].trim() });
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

function AudioAction({ text }: { text: string }) {
  const { t } = useI18n();
  const { speak, isPlaying, isError } = useAudio({ lang: "en-US", rate: 0.82, preferLocal: true });
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-busy={isPlaying}
      aria-label={t("hadith.playVocabulary", { word: text })}
      className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary px-3 text-sm font-black text-primary hover:bg-primary/10 active:bg-primary/15 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Volume2 className="size-4" aria-hidden />
      <span className="hidden sm:inline">
        {isPlaying ? t("hadith.playing") : isError ? t("hadith.audioRetry") : t("hadith.listen")}
      </span>
    </button>
  );
}

export function HadithVocabularyStudy({ lines }: { lines: readonly string[] }) {
  const { t } = useI18n();
  const [revealedImage, setRevealedImage] = useState<string | null>(null);
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
    ...useful.map((item) => ({ ...item, category: t("hadith.purposePatterns") })),
    ...extras.map((item) => ({ ...item, category: t("hadith.extraVocabulary") })),
    ...phrasal.map((item) => ({ ...item, category: t("hadith.phrasalVerbs") })),
    ...collocations.map((item) => ({ ...item, category: t("hadith.collocationsAndIdioms") })),
  ];

  return (
    <section
      className="mx-auto w-full max-w-6xl space-y-6"
      aria-labelledby="hadith-vocabulary-heading"
    >
      <header className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
          {t("hadith.vocabularyLabel")}
        </p>
        <h2 id="hadith-vocabulary-heading" className="mt-2 text-2xl font-black sm:text-3xl">
          {t("hadith.visualVocabularyTitle")}
        </h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-muted-foreground">
          {t("hadith.vocabularyStudyInstructions")}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {vocabulary.map((item) => {
          const visual = visuals.find(
            (candidate) => candidate.label.toLowerCase() === item.term.toLowerCase()
          );
          return (
            <article
              key={item.term}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-wp-sm"
            >
              <div className="grid sm:grid-cols-[11rem_1fr]">
                {visual ? (
                  <img
                    src={resolveAssetUrl(`hadith/v1/images/${visual.imageRef}.png`)}
                    alt=""
                    className="aspect-[16/9] h-full w-full object-cover sm:aspect-auto"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex min-h-40 items-center justify-center bg-muted">
                    <ImageIcon className="size-8 text-muted-foreground" aria-hidden />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black" lang="en" dir="ltr">
                        {item.term}
                      </h3>
                      <p className="mt-1 text-xs font-black uppercase tracking-wide text-primary">
                        {item.partOfSpeech}
                      </p>
                    </div>
                    <AudioAction text={item.term} />
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-6">{item.definition}</p>
                  {item.example && (
                    <p
                      className="mt-2 rounded-xl bg-muted p-3 text-sm italic text-muted-foreground"
                      lang="en"
                      dir="ltr"
                    >
                      {item.example}
                    </p>
                  )}
                  <p className="mt-3 text-lg font-bold text-primary" lang="ar" dir="rtl">
                    {item.arabic}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section
        className="rounded-3xl border border-border bg-card p-5 shadow-wp-sm sm:p-7"
        aria-labelledby="language-bank-heading"
      >
        <h3 id="language-bank-heading" className="text-xl font-black">
          {t("hadith.completeLanguageBank")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("hadith.completeLanguageBankDescription")}
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[42rem] border-collapse text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-4 text-start font-black">{t("hadith.category")}</th>
                <th className="p-4 text-start font-black">{t("hadith.expression")}</th>
                <th className="p-4 text-start font-black">{t("hadith.meaningOrExample")}</th>
                <th className="p-4">
                  <span className="sr-only">{t("hadith.audio")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {languageRows.map((item) => (
                <tr
                  key={`${item.category}-${item.expression}`}
                  className="border-t border-border align-top"
                >
                  <td className="p-4 text-xs font-black uppercase tracking-wide text-primary">
                    {item.category}
                  </td>
                  <td className="p-4 font-black" lang="en" dir="ltr">
                    {item.expression}
                  </td>
                  <td
                    className="p-4 font-semibold leading-6 text-muted-foreground"
                    lang="en"
                    dir="ltr"
                  >
                    {item.explanation}
                  </td>
                  <td className="p-3">
                    <AudioAction text={item.expression.replace(/\+.*$/, "").trim()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <aside className="rounded-2xl bg-muted p-4">
            <p className="text-xs font-black uppercase text-primary">{t("hadith.wordFamily")}</p>
            <p className="mt-2 font-bold" lang="en" dir="ltr">
              {valueAfter(lines, /^word family$/i)}
            </p>
          </aside>
          <aside className="rounded-2xl bg-muted p-4">
            <p className="text-xs font-black uppercase text-primary">
              {t("hadith.synonymContrast")}
            </p>
            <p className="mt-2 text-sm font-semibold" lang="en" dir="ltr">
              {valueAfter(lines, /^synonym \/ contrast$/i)}
            </p>
          </aside>
          <aside className="rounded-2xl border border-feedback-warning-border bg-feedback-warning-surface p-4">
            <p className="text-xs font-black uppercase text-feedback-warning-foreground">
              {t("hadith.commonError")}
            </p>
            <p className="mt-2 text-sm font-semibold" lang="en" dir="ltr">
              {valueAfter(lines, /^common error$/i)}
            </p>
          </aside>
        </div>
      </section>

      <section
        className="rounded-3xl border border-border bg-card p-5 shadow-wp-sm sm:p-7"
        aria-labelledby="picture-check-heading"
      >
        <h3 id="picture-check-heading" className="flex items-center gap-2 text-xl font-black">
          <ImageIcon className="size-5 text-primary" aria-hidden />
          {t("hadith.pictureVocabularyCheck")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("hadith.pictureVocabularyDescription")}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {visuals.map((item) => {
            const revealed = revealedImage === item.imageRef;
            return (
              <button
                key={item.imageRef}
                type="button"
                onClick={() => setRevealedImage(item.imageRef)}
                aria-pressed={revealed}
                className="overflow-hidden rounded-2xl border-2 border-border bg-background text-start hover:border-primary active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <img
                  src={resolveAssetUrl(`hadith/v1/images/${item.imageRef}.png`)}
                  alt=""
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
                <span className="flex min-h-11 items-center gap-2 px-3 text-sm font-black">
                  {revealed ? (
                    <>
                      <Check className="size-4 text-primary" aria-hidden />
                      {item.label}
                    </>
                  ) : (
                    t("hadith.revealWord")
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </section>
  );
}
