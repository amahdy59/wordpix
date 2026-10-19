import { memo, useState } from "react";
import { Volume2, Layers } from "lucide-react";
import { Badge } from "../shared/Badge";
import { useAudio } from "../shared/useAudio";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { useI18n } from "../context/I18nContext";
import type { VocabularyItem } from "../data/lessons";

export interface LibraryWordCardProps {
  word: VocabularyItem;
  unitId: string;
  unitName: string;
  onInspect: (word: VocabularyItem, unitId: string) => void;
  onGoToUnit: (unitId: string) => void;
}

export const LibraryWordCard = memo(function LibraryWordCard({
  word,
  unitId,
  unitName,
  onInspect,
  onGoToUnit,
}: LibraryWordCardProps) {
  const { t } = useI18n();
  const { speak, isPlaying } = useAudio();
  const [imageError, setImageError] = useState(false);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(word.label || word.id);
  };

  const handleUnitClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGoToUnit(unitId);
  };

  const imageUrl = word.img ? resolveAssetUrl(word.img) : "";
  const displayLabel = word.label || word.id.replace(/-/g, " ");

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-wp-card p-3.5 text-start">
      <div className="flex items-start gap-3.5">
        {/* Thumbnail Image */}
        <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-muted/40">
          {!imageError && imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              aria-hidden="true"
              loading="lazy"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
              <span className="text-xl font-black uppercase">{displayLabel.charAt(0)}</span>
            </div>
          )}
          {word.cefr && (
            <div className="absolute start-1 top-1">
              <Badge
                variant="primary"
                size="sm"
                className="shadow-xs font-bold text-[10px] px-1.5 py-0.5"
              >
                {word.cefr}
              </Badge>
            </div>
          )}
        </div>

        {/* Word Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3>
                <button
                  type="button"
                  onClick={() => onInspect(word, unitId)}
                  aria-label={`${displayLabel}: ${t("explore.wordDetails")}`}
                  className="min-h-11 min-w-11 rounded-lg text-start font-sans text-base font-semibold text-foreground underline decoration-border underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {displayLabel}
                </button>
              </h3>
              {word.phonetic && (
                <p className="font-mono text-xs text-muted-foreground mt-0.5" dir="ltr">
                  {word.phonetic}
                </p>
              )}
            </div>

            {/* Audio Button */}
            <button
              type="button"
              onClick={handlePlayAudio}
              aria-label={t("explore.listenPronunciation") + `: ${displayLabel}`}
              className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl bg-secondary/80 text-primary hover:bg-secondary hover:scale-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer shadow-wp-xs"
            >
              <Volume2
                className={`size-4.5 transition-transform ${isPlaying ? "motion-safe:animate-pulse text-primary" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Arabic Meaning */}
          {word.arabicTranslation && (
            <p
              className="font-arabic text-sm font-semibold text-primary/95 mt-1 truncate"
              dir="rtl"
              lang="ar"
            >
              {word.arabicTranslation}
            </p>
          )}
        </div>
      </div>

      {/* Footer: Unit Association + Action */}
      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={handleUnitClick}
          aria-label={t("explore.inUnit", { unit: unitName })}
          className="flex min-h-[44px] items-center gap-1.5 truncate font-medium hover:text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary rounded-lg px-1 -ms-1 cursor-pointer"
        >
          <Layers className="size-3.5 shrink-0 text-primary/70" aria-hidden="true" />
          <span className="truncate">{unitName}</span>
        </button>
      </div>
    </article>
  );
});
