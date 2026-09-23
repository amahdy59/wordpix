import { useMemo, useState } from "react";
import { Check, Headphones, Image as ImageIcon } from "lucide-react";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import { useI18n } from "../../../i18n";
import { getHadithVisualVocabulary } from "./figmaHadithCatalog";

interface VocabularyItem {
  term: string;
  partOfSpeech?: string;
  definition?: string;
  example?: string;
  arabic?: string;
}

function isLikelyTerm(value: string) {
  return (
    value.length > 1 &&
    value.length < 50 &&
    !/[.!?]$/.test(value) &&
    !/^(e\.g\.|word|arabic|part of speech|definition)/i.test(value)
  );
}

function parseVocabulary(lines: readonly string[]): VocabularyItem[] {
  const header = lines.findIndex((line) => /^word$/i.test(line));
  if (header < 0) return [];
  const end = lines.findIndex(
    (line, index) =>
      index > header && /^useful language|^extra vocabulary|^scholar|^phrasal verbs/i.test(line)
  );
  const values = lines.slice(header + 4, end < 0 ? undefined : end);
  const items: VocabularyItem[] = [];
  for (let index = 0; index + 3 < values.length; index += 4) {
    const [term, partOfSpeech, definition, arabic] = values.slice(index, index + 4);
    if (!isLikelyTerm(term)) continue;
    const [meaning, example] = definition.split(/(?=e\.g\.,?)/i);
    items.push({
      term,
      partOfSpeech,
      definition: meaning.trim(),
      example: example?.trim(),
      arabic,
    });
  }
  return items;
}

function extractLanguage(lines: readonly string[], heading: RegExp) {
  const start = lines.findIndex((line) => heading.test(line));
  if (start < 0) return [];
  const end = lines.findIndex(
    (line, index) =>
      index > start &&
      /^(?:phrasal verbs|collocations|word family|synonym|common error|quick practice)/i.test(line)
  );
  return lines.slice(start + 1, end < 0 ? undefined : end).filter((line) => line.includes("—"));
}

export function HadithVocabularyStudy({ lines }: { lines: readonly string[] }) {
  const { t } = useI18n();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const vocabulary = useMemo(() => parseVocabulary(lines), [lines]);
  const visualItems = useMemo(
    () => getHadithVisualVocabulary(vocabulary.map((item) => item.term)),
    [vocabulary]
  );
  const phrasalVerbs = useMemo(() => extractLanguage(lines, /^phrasal verbs$/i), [lines]);
  const collocations = useMemo(() => extractLanguage(lines, /^collocations$/i), [lines]);

  return (
    <section
      className="mx-auto w-full max-w-5xl rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8"
      aria-labelledby="hadith-vocabulary-heading"
    >
      <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
        {t("hadith.vocabularyLabel")}
      </p>
      <h2 id="hadith-vocabulary-heading" className="mt-2 text-2xl font-black">
        {t("hadith.visualVocabularyTitle")}
      </h2>
      {vocabulary.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {vocabulary.map((item) => (
            <article key={item.term} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black">{item.term}</h3>
                  <p className="text-sm font-bold text-primary">{item.partOfSpeech}</p>
                </div>
                <p className="text-lg font-bold" lang="ar" dir="rtl">
                  {item.arabic}
                </p>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6">{item.definition}</p>
              {item.example && (
                <p className="mt-2 text-sm italic text-muted-foreground">{item.example}</p>
              )}
            </article>
          ))}
        </div>
      )}
      {visualItems.length > 0 && (
        <section className="mt-7" aria-labelledby="hadith-picture-check-heading">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-5 text-primary" aria-hidden />
            <h3 id="hadith-picture-check-heading" className="text-lg font-black">
              {t("hadith.pictureVocabularyCheck")}
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("hadith.pictureVocabularyDescription")}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {visualItems.map((item) => {
              const revealed = selectedImage === item.imageRef;
              return (
                <button
                  key={item.imageRef}
                  type="button"
                  onClick={() => setSelectedImage(item.imageRef)}
                  aria-pressed={revealed}
                  className="overflow-hidden rounded-2xl border-2 border-border bg-background text-start focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <img
                    src={resolveAssetUrl(`hadith/v1/images/${item.imageRef}.png`)}
                    alt=""
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                  <span className="flex min-h-11 items-center px-3 text-sm font-black">
                    {revealed ? (
                      <>
                        <Check className="me-1 size-4 text-primary" aria-hidden />
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
      )}
      {(phrasalVerbs.length > 0 || collocations.length > 0) && (
        <section className="mt-7 grid gap-4 sm:grid-cols-2" aria-label="Language extensions">
          {phrasalVerbs.length > 0 && (
            <article className="rounded-2xl border border-border p-4">
              <h3 className="text-lg font-black">{t("hadith.phrasalVerbs")}</h3>
              <ul className="mt-3 space-y-2">
                {phrasalVerbs.map((value) => (
                  <li key={value} className="text-sm font-semibold leading-6">
                    {value}
                  </li>
                ))}
              </ul>
            </article>
          )}
          {collocations.length > 0 && (
            <article className="rounded-2xl border border-border p-4">
              <h3 className="text-lg font-black">{t("hadith.collocationsAndIdioms")}</h3>
              <ul className="mt-3 space-y-2">
                {collocations.map((value) => (
                  <li key={value} className="text-sm font-semibold leading-6">
                    {value}
                  </li>
                ))}
              </ul>
            </article>
          )}
        </section>
      )}
      {!vocabulary.length && (
        <div className="mt-6 space-y-3">
          {lines.map((line) => (
            <p key={line} className="text-sm font-semibold leading-7">
              {line}
            </p>
          ))}
        </div>
      )}
      <p className="sr-only">
        <Headphones aria-hidden /> {t("hadith.vocabularyAudioCue")}
      </p>
    </section>
  );
}
