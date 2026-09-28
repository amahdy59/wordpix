import { useMemo, useState } from "react";
import { resolveAssetUrl } from "../../../../utils/assetUrl";
import { useI18n } from "../../../../i18n";
import { useAudio } from "../../../shared/useAudio";
import { AudioButton } from "../../../shared/AudioButton";
import { getHadithVisualVocabulary } from "../figmaHadithCatalog";
import { getCurriculumAudioKey, cleanCurriculumTerm } from "../../shared/curriculumAudioManifest";
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

const PART_OF_SPEECH =
  /^(?:noun(?: phrase)?|verb(?: phrase)?|adjective|adverb|phrase|expression|verbal noun|adverbial phrase|idiom)$/i;

function cleanTerm(raw: string): string {
  return raw
    .replace(/^\d+[.)]\s*/, "")
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/[\u0600-\u06FF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeVisualLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function section(lines: readonly string[], start: RegExp, end: RegExp): string[] {
  const startIndex = lines.findIndex((line) => start.test(line));
  if (startIndex < 0) return [];
  const endIndex = lines.findIndex((line, index) => index > startIndex && end.test(line));
  return lines.slice(startIndex + 1, endIndex < 0 ? undefined : endIndex);
}

export function parseHadithVocabulary(
  lines: readonly string[],
  lessonNumber?: number
): VocabularyItem[] {
  const items: VocabularyItem[] = [];

  // Strategy 1: Structured table
  const startIdx = lines.findIndex((l) =>
    /^(?:word|term|expression|word\s*\/\s*phrase)$/i.test(l.trim())
  );
  if (startIdx >= 0) {
    const endIdx = lines.findIndex(
      (l, i) =>
        i > startIdx &&
        /^(?:useful language|extra vocabulary|scholarship note|useful b1|grammar|phrasal verbs|complete language|submit)/i.test(
          l.trim()
        )
    );
    const values = lines.slice(startIdx + 1, endIdx < 0 ? undefined : endIdx);
    let headerSkip = 0;
    while (
      headerSkip < values.length &&
      /^(?:part of speech|definition|arabic|meaning|example|b1 context|arabic match|arabic source|arabic equivalent)/i.test(
        values[headerSkip]?.trim() ?? ""
      )
    ) {
      headerSkip++;
    }
    const dataValues = values.slice(headerSkip);
    let i = 0;
    while (i < dataValues.length) {
      const termRaw = dataValues[i]?.trim();
      if (
        !termRaw ||
        /^(?:submit|proceed|grammar|phrasal|collocation|word family|synonym)/i.test(termRaw)
      ) {
        break;
      }

      let pos = "expression";
      let def = "";
      let example = "";
      let arabic = "";

      let offset = 1;
      const next1 = dataValues[i + offset]?.trim();
      if (next1 && PART_OF_SPEECH.test(next1)) {
        pos = next1;
        offset++;
      }

      const next2 = dataValues[i + offset]?.trim();
      if (next2 && !PART_OF_SPEECH.test(next2) && !/[\u0600-\u06FF]/.test(next2)) {
        def = next2;
        offset++;
      }

      const next3 = dataValues[i + offset]?.trim();
      if (next3 && /^e\.g\./i.test(next3)) {
        example = next3.replace(/^e\.g\.,?\s*/i, "");
        offset++;
      }

      const next4 = dataValues[i + offset]?.trim();
      if (next4 && /[\u0600-\u06FF]/.test(next4)) {
        arabic = next4;
        offset++;
      }

      const cleaned = cleanTerm(termRaw);
      if (cleaned && def) {
        items.push({
          term: cleaned,
          partOfSpeech: pos,
          definition: def,
          example: example || undefined,
          arabic,
        });
      }
      i += Math.max(1, offset);
    }
  }

  // Strategy 2: Slash format e.g. "brought together / يُجْمَعُ خَلْقُهُ"
  if (items.length < 3) {
    let i = 0;
    while (i < lines.length && items.length < 5) {
      const line = lines[i]?.trim() ?? "";
      if (
        line.includes("/") &&
        /[\u0600-\u06FF]/.test(line) &&
        !/^(?:synonym|grammar)/i.test(line)
      ) {
        const parts = line.split("/").map((s) => s.trim());
        const en = cleanTerm(parts[0]);
        const ar = parts[1] || "";
        let pos = "expression";
        let def = "";

        const peek = lines[i + 1]?.trim() ?? "";
        if (PART_OF_SPEECH.test(peek)) {
          pos = peek;
          def = lines[i + 2]?.trim() ?? "";
          i += 3;
        } else if (peek && !peek.includes("/") && !/^useful|^extra|^scholarship/i.test(peek)) {
          def = peek;
          i += 2;
        } else {
          i++;
        }
        if (en && def) {
          items.push({ term: en, partOfSpeech: pos, definition: def, arabic: ar });
        }
        continue;
      }
      i++;
    }
  }

  // Strategy 3: Numbered format e.g. "1. Purity (الطهور)"
  if (items.length < 3) {
    let i = 0;
    while (i < lines.length && items.length < 5) {
      const line = lines[i]?.trim() ?? "";
      if (
        /^\d+[.)]\s+[A-Za-z]/.test(line) &&
        line.length < 60 &&
        !/^(?:step|stage|unit)/i.test(line)
      ) {
        const term = cleanTerm(line);
        const arMatch = line.match(/[\u0600-\u06FF\s\-–]+/);
        const arabic = arMatch ? arMatch[0].trim() : "";
        let def = lines[i + 1]?.trim() ?? "";
        let pos = "expression";
        if (PART_OF_SPEECH.test(def)) {
          pos = def;
          def = lines[i + 2]?.trim() ?? "";
          i += 3;
        } else {
          i += 2;
        }
        if (term && def) {
          items.push({ term, partOfSpeech: pos, definition: def, arabic });
        }
        continue;
      }
      i++;
    }
  }

  // Fallback to visuals if still < 3
  if (items.length < 3 && lessonNumber) {
    const chunkVisuals = getHadithVisualVocabulary([], lessonNumber);
    for (const v of chunkVisuals) {
      const baseLabel = cleanTerm(v.label.split("·")[0]);
      if (!items.some((it) => it.term.toLowerCase() === baseLabel.toLowerCase())) {
        items.push({
          term: baseLabel,
          partOfSpeech: "expression",
          definition: `Core vocabulary expression: "${baseLabel}"`,
          arabic: "",
        });
      }
    }
  }

  return items.slice(0, 5);
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

export function HadithVocabularyStage({
  lines,
  lessonNumber,
}: {
  lines: readonly string[];
  lessonNumber?: number;
}) {
  const { t } = useI18n();
  const [activeAudioText, setActiveAudioText] = useState<string | null>(null);
  const audio = useAudio({ lang: "en-US", rate: 0.82, preferLocal: true });

  const playAudio = (text: string) => {
    const cleaned = cleanCurriculumTerm(text);
    setActiveAudioText(text);
    audio.speak(cleaned, undefined, getCurriculumAudioKey(cleaned) ?? undefined);
  };

  const vocabulary = useMemo(
    () => parseHadithVocabulary(lines, lessonNumber),
    [lines, lessonNumber]
  );
  const visuals = useMemo(
    () =>
      getHadithVisualVocabulary(
        vocabulary.map((item) => item.term),
        lessonNumber
      ),
    [vocabulary, lessonNumber]
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
    return vocabulary.map((item, idx) => {
      const normItem = normalizeVisualLabel(item.term);
      const visual =
        visuals.find((candidate) => {
          const normCand = normalizeVisualLabel(candidate.label.split("·")[0]);
          return (
            normCand === normItem || normCand.includes(normItem) || normItem.includes(normCand)
          );
        }) ?? visuals[idx];
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
    <section className="wp-container-content space-y-6" aria-labelledby="stage-vocabulary-heading">
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
