import { useState } from "react";
import { createPortal } from "react-dom";
import { Image as ImageIcon, LayoutGrid, Maximize2, Table, X } from "lucide-react";
import { useI18n } from "../../i18n";
import { AudioButton } from "./AudioButton";
import { useModalA11y } from "./useModalA11y";

export interface VocabularyTableItem {
  id: string;
  term: string;
  termAr?: string;
  type?: string;
  definition: string;
  definitionAr?: string;
  example: string;
  exampleAr?: string;
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
  showType?: boolean;
  allowViewToggle?: boolean;
  defaultView?: "table" | "gallery";
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
  showType = false,
  allowViewToggle = true,
  defaultView = "table",
  caption,
  className = "",
}: Props) {
  const { t } = useI18n();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"table" | "gallery">(defaultView);
  const [activeModalItem, setActiveModalItem] = useState<VocabularyTableItem | null>(null);

  const modalContainerRef = useModalA11y({
    isOpen: Boolean(activeModalItem),
    onDismiss: () => setActiveModalItem(null),
  });

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const isTermPlaying = (term: string) =>
    Boolean(isPlaying && activeAudioText && activeAudioText.toLowerCase() === term.toLowerCase());

  const isTermError = (term: string) =>
    Boolean(
      isAudioError && activeAudioText && activeAudioText.toLowerCase() === term.toLowerCase()
    );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top View Toggle Toolbar */}
      {allowViewToggle && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold text-muted-foreground">
            {caption || t("vocabulary.tableCaption") || "Vocabulary and Collocations"}
          </p>

          <div
            className="inline-flex items-center gap-1 rounded-2xl border border-border bg-card p-1 shadow-wp-xs"
            role="group"
            aria-label={t("vocabulary.viewMode") || "View mode"}
          >
            <button
              type="button"
              onClick={() => setViewMode("table")}
              aria-pressed={viewMode === "table"}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground shadow-wp-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Table className="size-4" aria-hidden="true" />
              <span>{t("vocabulary.tableView") || "Table"}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("gallery")}
              aria-pressed={viewMode === "gallery"}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                viewMode === "gallery"
                  ? "bg-primary text-primary-foreground shadow-wp-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-4" aria-hidden="true" />
              <span>{t("vocabulary.galleryView") || "Gallery"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── MODE 1: TABLE VIEW ── */}
      {viewMode === "table" && (
        <>
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
                    className="w-36 py-4 ps-6 pe-3 text-start text-xs font-black uppercase tracking-wider text-primary"
                  >
                    {t("vocabulary.imageHeader") || "Image"}
                  </th>
                  <th
                    scope="col"
                    className="w-52 py-4 px-3 text-start text-xs font-black uppercase tracking-wider text-primary"
                  >
                    {t("vocabulary.wordHeader") || "Word/Phrase"}
                  </th>
                  <th
                    scope="col"
                    className="py-4 px-3 text-start text-xs font-black uppercase tracking-wider text-primary"
                  >
                    {t("vocabulary.definitionHeader") || "Definition"}
                  </th>
                  <th
                    scope="col"
                    className="py-4 ps-3 pe-6 text-start text-xs font-black uppercase tracking-wider text-primary"
                  >
                    {t("vocabulary.exampleHeader") || "Example"}
                  </th>
                  {showType && (
                    <th
                      scope="col"
                      className="w-32 py-4 ps-3 pe-6 text-end text-xs font-black uppercase tracking-wider text-primary"
                    >
                      {t("vocabulary.typeHeader") || "Type"}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {items.map((item, index) => {
                  const hasImg = item.imageSrc && !imageErrors[item.id];
                  const isItemPlaying = isTermPlaying(item.term);
                  const isItemError = isTermError(item.term);
                  const isEven = index % 2 === 0;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors hover:bg-primary/5 ${
                        isEven ? "bg-card" : "bg-muted/20"
                      }`}
                    >
                      {/* Column 1: Image Thumbnail + Enlarge Trigger */}
                      <td className="py-4 ps-6 pe-3 align-middle">
                        <div className="relative group/thumb h-20 w-28 shrink-0 overflow-hidden rounded-2xl border border-border/80 bg-muted/40 shadow-wp-xs">
                          {hasImg ? (
                            <img
                              src={item.imageSrc}
                              alt=""
                              aria-hidden="true"
                              loading="lazy"
                              onError={() => handleImageError(item.id)}
                              className="size-full object-cover object-center transition-transform duration-300 group-hover/thumb:scale-105"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-muted-foreground/50">
                              <ImageIcon className="size-6" aria-hidden="true" />
                            </div>
                          )}

                          {/* Enlarge Overlay Button */}
                          <button
                            type="button"
                            onClick={() => setActiveModalItem(item)}
                            aria-label={
                              t("vocabulary.enlargeImage", { term: item.term }) ||
                              `Enlarge image for ${item.term}`
                            }
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover/thumb:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
                          >
                            <span className="flex size-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm border border-white/20 shadow-wp-sm hover:scale-110 transition-transform">
                              <Maximize2 className="size-4" aria-hidden="true" />
                            </span>
                          </button>
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
                      <td className="py-4 ps-3 pe-6 align-middle">
                        <p
                          className="text-sm font-normal italic leading-relaxed text-foreground/90 rounded-xl bg-muted/40 p-2.5 border border-border/40"
                          lang="en"
                        >
                          "{item.example}"
                        </p>
                      </td>

                      {/* Optional Column 5: Type Badge */}
                      {showType && (
                        <td className="py-4 ps-3 pe-6 text-end align-middle">
                          <span className="inline-block rounded-lg bg-muted px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-wp-xs">
                            {item.type}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Adaptive Reflow Cards (< md: 768px) */}
          <div className="space-y-3.5 md:hidden">
            {items.map((item, index) => {
              const hasImg = item.imageSrc && !imageErrors[item.id];
              const isItemPlaying = isTermPlaying(item.term);
              const isItemError = isTermError(item.term);
              const isEven = index % 2 === 0;

              return (
                <article
                  key={item.id}
                  className={`flex flex-col gap-3 rounded-2xl border border-border p-4 shadow-wp-xs transition-colors ${
                    isEven ? "bg-card" : "bg-muted/15"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative group/thumb h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40">
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

                      <button
                        type="button"
                        onClick={() => setActiveModalItem(item)}
                        aria-label={
                          t("vocabulary.enlargeImage", { term: item.term }) ||
                          `Enlarge image for ${item.term}`
                        }
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/thumb:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
                      >
                        <span className="flex size-7 items-center justify-center rounded-full bg-black/70 text-white shadow-wp-xs">
                          <Maximize2 className="size-3.5" aria-hidden="true" />
                        </span>
                      </button>
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
                        {showType && item.type && (
                          <span className="shrink-0 rounded-lg bg-muted px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            {item.type}
                          </span>
                        )}
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
                      <span className="font-bold text-foreground">
                        {t("vocabulary.meaningPrefix") || "Meaning: "}
                      </span>
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

                  <div className="rounded-xl bg-muted/40 p-2.5 text-xs font-normal italic text-foreground/90 border border-border/40">
                    "{item.example}"
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* ── MODE 2: GALLERY VIEW ── */}
      {viewMode === "gallery" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const hasImg = item.imageSrc && !imageErrors[item.id];
            const isItemPlaying = isTermPlaying(item.term);
            const isItemError = isTermError(item.term);

            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-wp-xs transition-all hover:border-primary/40 hover:shadow-wp-sm"
              >
                {/* Gallery Image Header */}
                <div className="relative group/thumb h-48 w-full bg-muted/40 overflow-hidden shrink-0 border-b border-border/60">
                  {hasImg ? (
                    <img
                      src={item.imageSrc}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      onError={() => handleImageError(item.id)}
                      className="size-full object-cover object-center transition-transform duration-300 group-hover/thumb:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground/50">
                      <ImageIcon className="size-8" aria-hidden="true" />
                    </div>
                  )}

                  {/* Enlarge Overlay Button */}
                  <button
                    type="button"
                    onClick={() => setActiveModalItem(item)}
                    aria-label={
                      t("vocabulary.enlargeImage", { term: item.term }) ||
                      `Enlarge image for ${item.term}`
                    }
                    className="absolute top-3 end-3 flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm border border-white/20 shadow-wp-sm hover:scale-110 transition-transform cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <Maximize2 className="size-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-black text-foreground tracking-tight" lang="en">
                          {item.term}
                        </h3>
                        {item.type && (
                          <span className="mt-1 inline-block rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            {item.type}
                          </span>
                        )}
                        {showArabic && item.termAr && (
                          <p
                            dir="rtl"
                            lang="ar"
                            className="mt-1 font-arabic text-sm font-bold text-primary"
                          >
                            {item.termAr}
                          </p>
                        )}
                      </div>
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

                    <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">
                      {item.definition}
                    </p>
                    {showArabic && item.definitionAr && (
                      <p
                        dir="rtl"
                        lang="ar"
                        className="mt-1 text-xs font-semibold font-arabic leading-relaxed text-muted-foreground/80"
                      >
                        {item.definitionAr}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs italic text-foreground/90">
                    "{item.example}"
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Pedagogical Sidebars: Word Family, Contrast, Common Error ── */}
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

      {/* ── ACCESSIBLE IMAGE & MEANING MODAL ── */}
      {activeModalItem &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            {/* Backdrop Dismiss Area */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setActiveModalItem(null)}
              aria-hidden="true"
            />

            {/* Modal Dialog Card */}
            <div
              ref={modalContainerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="vocab-modal-term"
              tabIndex={-1}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-wp-lg z-10 flex flex-col max-h-[90dvh]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                aria-label={t("vocabulary.closeModal") || "Close dialog"}
                className="absolute top-4 end-4 z-20 flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white cursor-pointer"
              >
                <X className="size-5" aria-hidden="true" />
              </button>

              {/* Top Enlarged Image Banner */}
              <div className="relative h-64 sm:h-72 w-full bg-muted/60 overflow-hidden shrink-0">
                {activeModalItem.imageSrc && !imageErrors[activeModalItem.id] ? (
                  <img
                    src={activeModalItem.imageSrc}
                    alt=""
                    aria-hidden="true"
                    className="size-full object-cover object-center"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground/50">
                    <ImageIcon className="size-12" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-black/30" />

                <div className="absolute bottom-4 start-6 end-6 flex items-end justify-between gap-3">
                  <div>
                    {activeModalItem.type && (
                      <span className="inline-block rounded-md bg-primary/20 text-primary-foreground text-xs font-black uppercase tracking-wider px-2.5 py-0.5 mb-1.5 backdrop-blur-sm border border-primary/30">
                        {activeModalItem.type}
                      </span>
                    )}
                    <h2
                      id="vocab-modal-term"
                      className="text-2xl sm:text-3xl font-black text-foreground drop-shadow-sm"
                      lang="en"
                    >
                      {activeModalItem.term}
                    </h2>
                    {showArabic && activeModalItem.termAr && (
                      <p
                        dir="rtl"
                        lang="ar"
                        className="mt-0.5 font-arabic text-base font-bold text-primary"
                      >
                        {activeModalItem.termAr}
                      </p>
                    )}
                  </div>

                  {onPlayAudio && (
                    <AudioButton
                      onPlay={() => onPlayAudio(activeModalItem.term)}
                      isPlaying={isTermPlaying(activeModalItem.term)}
                      isError={isTermError(activeModalItem.term)}
                      label={t("vocabulary.playPronunciation", { term: activeModalItem.term })}
                      size="md"
                      className="rounded-2xl bg-primary text-primary-foreground shadow-wp-md hover:opacity-95"
                    />
                  )}
                </div>
              </div>

              {/* Meaning & Context Panel */}
              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-primary block mb-1">
                    {t("vocabulary.definitionHeader") || "Definition"}
                  </span>
                  <p className="text-base font-medium leading-relaxed text-foreground">
                    {activeModalItem.definition}
                  </p>
                  {showArabic && activeModalItem.definitionAr && (
                    <p
                      dir="rtl"
                      lang="ar"
                      className="mt-1 text-sm font-semibold font-arabic leading-relaxed text-muted-foreground/80"
                    >
                      {activeModalItem.definitionAr}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-border/80 bg-muted/40 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    {t("vocabulary.exampleInContext") || "Example in Context"}
                  </span>
                  <p
                    className="text-sm font-medium italic text-foreground leading-relaxed"
                    lang="en"
                  >
                    "{activeModalItem.example}"
                  </p>
                  {showArabic && activeModalItem.exampleAr && (
                    <p
                      dir="rtl"
                      lang="ar"
                      className="mt-1 text-xs font-arabic text-muted-foreground leading-relaxed"
                    >
                      "{activeModalItem.exampleAr}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
