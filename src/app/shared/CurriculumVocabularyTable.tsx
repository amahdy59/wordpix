import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useI18n } from "../../i18n";
import { AudioButton } from "./AudioButton";

export interface VocabularyTableItem {
  id: string;
  term: string;
  termAr?: string;
  type: string;
  definition: string;
  definitionAr?: string;
  example: string;
  imageSrc?: string;
  fallbackLabel?: string;
}

export interface VocabularySidebars {
  wordFamily?: string;
  meaningContrast?: string;
  commonError?: string;
}

interface Props {
  items: readonly VocabularyTableItem[];
  sidebars?: VocabularySidebars;
  onPlayAudio?: (term: string) => void;
  activeAudioText?: string | null;
  isPlaying?: boolean;
  isAudioError?: boolean;
  showArabic?: boolean;
  caption?: string;
  className?: string;
}

export function CurriculumVocabularyTable({
  items,
  sidebars,
  onPlayAudio,
  activeAudioText,
  isPlaying = false,
  isAudioError = false,
  showArabic = false,
  caption,
  className = "",
}: Props) {
  const { t } = useI18n();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Desktop & Tablet Table (>= md: 768px) */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-border bg-card shadow-wp-xs">
        <table className="w-full border-collapse text-start">
          <caption className="sr-only">
            {caption || t("vocabulary.tableCaption") || "Vocabulary and Collocations Table"}
          </caption>
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th
                scope="col"
                className="w-28 py-3.5 ps-5 pe-3 text-start text-xs font-black uppercase tracking-wider text-primary"
              >
                {t("vocabulary.imageHeader") || "Image"}
              </th>
              <th
                scope="col"
                className="py-3.5 px-3 text-start text-xs font-black uppercase tracking-wider text-primary"
              >
                {t("vocabulary.wordHeader") || "Word/Phrase"}
              </th>
              <th
                scope="col"
                className="py-3.5 px-3 text-start text-xs font-black uppercase tracking-wider text-primary"
              >
                {t("vocabulary.definitionHeader") || "Definition"}
              </th>
              <th
                scope="col"
                className="py-3.5 px-3 text-start text-xs font-black uppercase tracking-wider text-primary"
              >
                {t("vocabulary.exampleHeader") || "Example"}
              </th>
              <th
                scope="col"
                className="w-32 py-3.5 ps-3 pe-5 text-end text-xs font-black uppercase tracking-wider text-primary"
              >
                {t("vocabulary.typeHeader") || "Type"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => {
              const hasImg = item.imageSrc && !imageErrors[item.id];
              const isItemPlaying = Boolean(
                isPlaying &&
                activeAudioText &&
                activeAudioText.toLowerCase() === item.term.toLowerCase()
              );
              const isItemError = Boolean(
                isAudioError &&
                activeAudioText &&
                activeAudioText.toLowerCase() === item.term.toLowerCase()
              );

              return (
                <tr key={item.id} className="transition-colors hover:bg-muted/20">
                  {/* Column 1: Image Thumbnail */}
                  <td className="py-4 ps-5 pe-3 align-middle">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
                      {hasImg ? (
                        <img
                          src={item.imageSrc}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          onError={() => handleImageError(item.id)}
                          className="size-full object-cover object-center"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-muted-foreground/50">
                          <ImageIcon className="size-5" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Column 2: Word/Phrase + Pronounce Button + Arabic Subtitle */}
                  <td className="py-4 px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-foreground" lang="en">
                        {item.term}
                      </span>
                      {onPlayAudio && (
                        <AudioButton
                          onPlay={() => onPlayAudio(item.term)}
                          isPlaying={isItemPlaying}
                          isError={isItemError}
                          label={t("vocabulary.playPronunciation", { term: item.term })}
                          size="sm"
                          className="rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                        />
                      )}
                    </div>
                    {showArabic && item.termAr && (
                      <span
                        dir="rtl"
                        lang="ar"
                        className="mt-0.5 block font-arabic text-sm font-bold text-primary"
                      >
                        {item.termAr}
                      </span>
                    )}
                  </td>

                  {/* Column 3: Definition */}
                  <td className="py-4 px-3 align-middle">
                    <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                      {item.definition}
                    </p>
                    {showArabic && item.definitionAr && (
                      <p
                        dir="rtl"
                        lang="ar"
                        className="mt-0.5 text-xs font-semibold font-arabic leading-relaxed text-muted-foreground/80"
                      >
                        {item.definitionAr}
                      </p>
                    )}
                  </td>

                  {/* Column 4: Example */}
                  <td className="py-4 px-3 align-middle">
                    <p
                      className="text-sm font-normal italic leading-relaxed text-foreground/90"
                      lang="en"
                    >
                      {item.example}
                    </p>
                  </td>

                  {/* Column 5: Type Badge */}
                  <td className="py-4 ps-3 pe-5 text-end align-middle">
                    <span className="inline-block rounded-lg bg-muted px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-wp-xs">
                      {item.type}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Adaptive Reflow Cards (< md: 768px) */}
      <div className="space-y-3.5 md:hidden">
        {items.map((item) => {
          const hasImg = item.imageSrc && !imageErrors[item.id];
          const isItemPlaying = Boolean(
            isPlaying &&
            activeAudioText &&
            activeAudioText.toLowerCase() === item.term.toLowerCase()
          );
          const isItemError = Boolean(
            isAudioError &&
            activeAudioText &&
            activeAudioText.toLowerCase() === item.term.toLowerCase()
          );

          return (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-wp-xs"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40">
                  {hasImg ? (
                    <img
                      src={item.imageSrc}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      onError={() => handleImageError(item.id)}
                      className="size-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground/50">
                      <ImageIcon className="size-5" aria-hidden="true" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-black text-foreground" lang="en">
                        {item.term}
                      </h3>
                      {onPlayAudio && (
                        <AudioButton
                          onPlay={() => onPlayAudio(item.term)}
                          isPlaying={isItemPlaying}
                          isError={isItemError}
                          label={t("vocabulary.playPronunciation", { term: item.term })}
                          size="sm"
                          className="rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                        />
                      )}
                    </div>
                    <span className="shrink-0 rounded-lg bg-muted px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {item.type}
                    </span>
                  </div>

                  {showArabic && item.termAr && (
                    <p
                      dir="rtl"
                      lang="ar"
                      className="mt-0.5 font-arabic text-xs font-bold text-primary"
                    >
                      {item.termAr}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">{t("vocabulary.meaningPrefix")}</span>
                  {item.definition}
                </p>
                {showArabic && item.definitionAr && (
                  <p
                    dir="rtl"
                    lang="ar"
                    className="mt-0.5 text-xs font-arabic text-muted-foreground/80 leading-relaxed"
                  >
                    {item.definitionAr}
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-muted/40 p-2.5 text-xs font-normal italic text-foreground/90">
                "{item.example}"
              </div>
            </article>
          );
        })}
      </div>

      {/* Pedagogical Sidebars: Word Family, Contrast, Common Error */}
      {sidebars && (sidebars.wordFamily || sidebars.meaningContrast || sidebars.commonError) && (
        <div className="grid gap-3.5 sm:grid-cols-3 pt-2">
          {sidebars.wordFamily && (
            <aside className="rounded-2xl border border-border bg-card p-4 shadow-wp-xs">
              <p className="text-xs font-black uppercase tracking-wider text-primary">
                {t("hadith.wordFamily") || "Word family"}
              </p>
              <p className="mt-2 text-sm font-bold text-foreground" lang="en">
                {sidebars.wordFamily}
              </p>
            </aside>
          )}

          {sidebars.meaningContrast && (
            <aside className="rounded-2xl border border-border bg-card p-4 shadow-wp-xs">
              <p className="text-xs font-black uppercase tracking-wider text-primary">
                {t("hadith.synonymContrast") || "Meaning contrast"}
              </p>
              <p className="mt-2 text-sm font-semibold text-muted-foreground" lang="en">
                {sidebars.meaningContrast}
              </p>
            </aside>
          )}

          {sidebars.commonError && (
            <aside className="rounded-2xl border border-feedback-warning-border bg-feedback-warning-surface p-4 shadow-wp-xs">
              <p className="text-xs font-black uppercase tracking-wider text-feedback-warning-foreground">
                {t("hadith.commonError") || "Common error"}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground" lang="en">
                {sidebars.commonError}
              </p>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
