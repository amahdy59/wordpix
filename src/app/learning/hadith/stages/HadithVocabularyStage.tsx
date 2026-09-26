import { useMemo, useState } from "react";
import { resolveAssetUrl } from "../../../../utils/assetUrl";
import { useI18n } from "../../../../i18n";
import { useAudio } from "../../../shared/useAudio";
import { AudioButton } from "../../../shared/AudioButton";
import { getHadithVisualVocabulary } from "../figmaHadithCatalog";
import { getCurriculumAudioKey } from "../../shared/curriculumAudioManifest";
import {
  CurriculumVocabularyTable,
  type VocabularyTableItem,
  type VocabularySidebars,
} from "../../../shared/CurriculumVocabularyTable";

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

export function HadithVocabularyStage({ lines }: { lines: readonly string[] }) {
  const { t } = useI18n();
  const [activeAudioText, setActiveAudioText] = useState<string | null>(null);
  const audio = useAudio({ lang: "en-US", rate: 0.82, preferLocal: true });

  const playAudio = (text: string) => {
    setActiveAudioText(text);
    audio.speak(text, undefined, getCurriculumAudioKey(text) ?? undefined);
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

  const hadithTableItems: VocabularyTableItem[] = useMemo(() => {
    return vocabulary.map((item) => {
      const visual = visuals.find(
        (candidate) => candidate.label.toLowerCase() === item.term.toLowerCase()
      );
      const assetUrl = visual ? resolveAssetUrl(`hadith/v1/images/${visual.imageRef}.png`) : "";
      return {
        id: item.term,
        term: item.term,
        termAr: item.arabic,
        type: item.partOfSpeech,
        definition: item.definition,
        example: item.example ?? "",
        imageSrc: assetUrl,
        fallbackLabel: item.term,
      };
    });
  }, [vocabulary, visuals]);

  const hadithSidebars: VocabularySidebars = useMemo(
    () => ({
      wordFamily: valueAfter(lines, /^word family$/i),
      meaningContrast: valueAfter(lines, /^synonym \/ contrast$/i),
      commonError: valueAfter(lines, /^common error$/i),
    }),
    [lines]
  );

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

      {/* Core Universal Vocabulary Table & Gallery */}
      <CurriculumVocabularyTable
        items={hadithTableItems}
        sidebars={hadithSidebars}
        onPlayAudio={playAudio}
        activeAudioText={activeAudioText}
        isPlaying={audio.isPlaying}
        isAudioError={audio.isError}
        showArabic={true}
        allowViewToggle={true}
        defaultView="table"
      />

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
            <caption className="sr-only">{t("hadith.languageBankTableCaption")}</caption>
            <thead className="bg-muted/70">
              <tr>
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
                    <AudioButton
                      onPlay={() => playAudio(item.expression.replace(/\+.*$/, "").trim())}
                      isPlaying={
                        audio.isPlaying &&
                        activeAudioText === item.expression.replace(/\+.*$/, "").trim()
                      }
                      isError={
                        audio.isError &&
                        activeAudioText === item.expression.replace(/\+.*$/, "").trim()
                      }
                      label={
                        t("hadith.playVocabulary", { word: item.expression }) ||
                        `Listen to ${item.expression}`
                      }
                      size="sm"
                      className="border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
                    />
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
              <div className="flex items-start justify-end">
                <AudioButton
                  onPlay={() => playAudio(item.expression.replace(/\+.*$/, "").trim())}
                  isPlaying={
                    audio.isPlaying &&
                    activeAudioText === item.expression.replace(/\+.*$/, "").trim()
                  }
                  isError={
                    audio.isError && activeAudioText === item.expression.replace(/\+.*$/, "").trim()
                  }
                  label={
                    t("hadith.playVocabulary", { word: item.expression }) ||
                    `Listen to ${item.expression}`
                  }
                  size="sm"
                  className="border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
                />
              </div>
              <p className="mt-1 text-base font-black text-foreground" lang="en" dir="ltr">
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
      </section>
    </section>
  );
}
