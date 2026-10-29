import { ReferenceTable } from "../../../shared/ReferenceTable";
import { parseHadithVocabulary } from "../hadithVocabularyContent";
import learnerGlosses from "../hadithLearnerGlosses.json";
export { parseHadithVocabulary } from "../hadithVocabularyContent";
import { useMemo, useState } from "react";
import { resolveAssetUrl } from "../../../../utils/assetUrl";
import { useI18n } from "../../../../i18n";
import { useAudio } from "../../../shared/useAudio";
import { AudioButton } from "../../../shared/AudioButton";
import { getHadithVisualVocabulary, FIGMA_HADITH_LESSONS } from "../figmaHadithCatalog";
import { getCurriculumAudioKey, cleanCurriculumTerm } from "../../shared/curriculumAudioManifest";
import {
  CurriculumVocabularyTable,
  type VocabularyTableItem,
  type VocabularySidebars,
} from "../../../shared/CurriculumVocabularyTable";

interface LanguageItem {
  expression: string;
  explanation: string;
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

const HADITH_03_EXTRA_VOCABULARY: readonly LanguageItem[] = [
  { expression: "five", explanation: "The five foundational pillars upon which Islam is built." },
  {
    expression: "deity",
    explanation: "An object of worship; God (as in: 'no deity worthy of worship except Allah').",
  },
  {
    expression: "Messenger",
    explanation: "An apostle or emissary sent by God (referring to Prophet Muhammad ﷺ).",
  },
  {
    expression: "prayer",
    explanation: "The prescribed ritual worship (Salah) performed five times daily.",
  },
  { expression: "pilgrimage", explanation: "The sacred journey to Makkah (Hajj)." },
  { expression: "House", explanation: "The Sacred House (the Kaaba) in Makkah." },
  {
    expression: "fast",
    explanation: "Abstaining from food and drink from dawn until sunset (Sawm).",
  },
  {
    expression: "Ramadan",
    explanation: "The ninth month of the Islamic lunar calendar, designated for fasting.",
  },
  {
    expression: "testimony of faith",
    explanation: "The declaration (Shahada) confirming faith in Allah and His Messenger.",
  },
  {
    expression: "establish prayer",
    explanation: "To perform the ritual prayers regularly and properly at their prescribed times.",
  },
  {
    expression: "pay zakat",
    explanation: "To give the prescribed obligatory annual charity to those in need.",
  },
  {
    expression: "perform Hajj",
    explanation: "To undertake the pilgrimage to the Sacred House in Makkah if able.",
  },
  {
    expression: "fast Ramadan",
    explanation: "To observe the daytime fast throughout the month of Ramadan.",
  },
];

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

  const effectiveLines = useMemo(() => {
    if (lessonNumber === 18) {
      const h18 = FIGMA_HADITH_LESSONS.find((l) => l.number === 18);
      const rlText = h18?.stages["read-listen"]?.text ?? [];
      const pvIdx = rlText.findIndex((t) => /^phrasal verbs/i.test(t));
      if (pvIdx >= 0) {
        return [...lines, ...rlText.slice(pvIdx)];
      }
    }
    return lines;
  }, [lines, lessonNumber]);

  const vocabulary = useMemo(
    () => parseHadithVocabulary(effectiveLines, lessonNumber),
    [effectiveLines, lessonNumber]
  );
  const visuals = useMemo(
    () =>
      getHadithVisualVocabulary(
        vocabulary.map((item) => item.term),
        lessonNumber
      ),
    [vocabulary, lessonNumber]
  );
  const useful = useMemo(() => {
    const raw = section(effectiveLines, /^useful language/i, /^extra vocabulary/i);
    const templateItems = raw
      .filter((line) => /^[•\-–]\s*"/i.test(line))
      .map((line) => {
        const cleaned = line
          .replace(/^[•\-–]\s*/, "")
          .replace(/^"|"$/g, "")
          .trim();
        const isQuestion = cleaned.includes("?");
        return {
          expression: cleaned,
          explanation: isQuestion
            ? "Question template: asking for a definition."
            : "Answer template: providing a simple definition.",
        };
      });
    if (templateItems.length > 0) return templateItems;
    return alternating(raw);
  }, [effectiveLines]);

  const extras = useMemo(() => {
    if (lessonNumber === 3) return [...HADITH_03_EXTRA_VOCABULARY];
    const raw = section(
      effectiveLines,
      /^extra vocabulary$/i,
      /^(?:scholarship note|scholarly distinction|phrasal verbs|collocations|word family|proceed)/i
    );
    const colonItems = raw
      .filter((line) => /^[•\-–]?\s*[^:]+:\s*.+/.test(line))
      .map((line) => {
        const cleaned = line.replace(/^[•\-–]\s*/, "");
        const colonIdx = cleaned.indexOf(":");
        return {
          expression: cleaned.slice(0, colonIdx).trim(),
          explanation: cleaned.slice(colonIdx + 1).trim(),
        };
      });
    if (colonItems.length > 0) return colonItems;
    return alternating(raw).map((item) => ({
      ...item,
      explanation: item.explanation.replace(/^[-–]\s*/, ""),
    }));
  }, [effectiveLines, lessonNumber]);

  const phrasal = useMemo(
    () => dashItems(section(effectiveLines, /^phrasal verbs$/i, /^collocations$/i)),
    [effectiveLines]
  );
  const collocations = useMemo(
    () => dashItems(section(effectiveLines, /^collocations$/i, /^word family$/i)),
    [effectiveLines]
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
      const normItem = normalizeVisualLabel(item.term);
      const visual = visuals.find((candidate) => {
        const normCand = normalizeVisualLabel(candidate.label.split("·")[0]);
        return normCand === normItem;
      });
      const assetUrl = visual ? resolveAssetUrl(`hadith/v1/images/${visual.imageRef}.png`) : "";
      return {
        id: item.term,
        term: item.term,
        termAr:
          (learnerGlosses as Record<string, Record<string, string>>)[
            `hadith-${String(lessonNumber).padStart(2, "0")}`
          ]?.[item.term] ?? item.arabic,
        type: item.partOfSpeech,
        definition: item.definition,
        example: item.example ?? "",
        imageSrc: assetUrl,
        fallbackLabel: item.term,
      };
    });
  }, [vocabulary, visuals, lessonNumber]);

  const hadithSidebars: VocabularySidebars = useMemo(
    () => ({
      wordFamily: valueAfter(effectiveLines, /^word family$/i),
      meaningContrast: valueAfter(effectiveLines, /^synonym \/ contrast$/i),
      commonError: valueAfter(effectiveLines, /^common error$/i),
    }),
    [effectiveLines]
  );

  return (
    <section
      className="wp-container-content space-y-3 sm:space-y-6"
      aria-labelledby="stage-vocabulary-heading"
    >
      {/* Header Banner */}
      <header>
        <h2
          id="stage-vocabulary-heading"
          tabIndex={-1}
          className="wp-type-stage-title text-lg font-bold text-foreground outline-none"
        >
          {t("hadith.visualVocabularyTitle") || "Core expressions, pictures, and use"}
        </h2>
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
        hideCaption={true}
        defaultView="table"
      />

      {/* Complete Language Bank */}
      <section
        className="rounded-2xl border border-border bg-card p-3 shadow-wp-xs sm:p-7"
        aria-labelledby="language-bank-heading"
      >
        <h3 id="language-bank-heading" className="text-xl font-black text-foreground">
          {t("hadith.completeLanguageBank") || "Complete language bank"}
        </h3>

        <div className="mt-3">
          <ReferenceTable
            caption={t("hadith.languageBankTableCaption")}
            columns={[
              { key: "expression", label: t("hadith.expression"), rowHeader: true },
              { key: "meaning", label: t("hadith.meaningOrExample") },
              { key: "audio", label: t("hadith.audio") },
            ]}
            rows={languageRows.map((item) => ({
              id: item.category + "-" + item.expression,
              cells: {
                expression: (
                  <bdi lang="en" dir="ltr">
                    {item.expression}
                  </bdi>
                ),
                meaning: (
                  <bdi lang="en" dir="ltr">
                    {item.explanation}
                  </bdi>
                ),
                audio: (
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
                    className="border-primary/40 bg-secondary text-primary hover:bg-secondary"
                  />
                ),
              },
            }))}
          />
        </div>
      </section>
    </section>
  );
}
