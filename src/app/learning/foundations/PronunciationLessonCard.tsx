import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Info, Volume2 } from "lucide-react";
import { useI18n } from "../../../i18n";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import type { FigmaPronunciationLessonSource } from "./figmaPronunciationCatalog";
import {
  getPronunciationCardPresentation,
  pronunciationImagePath,
} from "./figmaPronunciationCatalog";
import type { PronunciationLessonProgress } from "./pronunciationProgress";

interface PronunciationLessonCardProps {
  lesson: FigmaPronunciationLessonSource;
  mastered: boolean;
  isDue: boolean;
  progress?: PronunciationLessonProgress;
  onStartLesson: (lessonNumber: number) => void;
  onOpenDetails: (lessonNumber: number) => void;
}

export function PronunciationLessonCard({
  lesson,
  mastered,
  isDue,
  progress,
  onStartLesson,
  onOpenDetails,
}: PronunciationLessonCardProps) {
  const { t } = useI18n();
  const [hasImageError, setHasImageError] = useState(false);

  const presentation = getPronunciationCardPresentation(lesson.number);
  const { cleanTitle, phoneticBadge, firstImage, secondImage, primaryWords, fallbackSymbols } =
    presentation;

  const showImages = !hasImageError && Boolean(firstImage && secondImage);

  return (
    <li className="group relative flex min-h-[96px] w-full items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-wp-xs transition-all hover:border-primary/50 hover:bg-primary/5 sm:p-3.5">
      {/* Primary Lesson Action Trigger */}
      <button
        type="button"
        onClick={() => onStartLesson(lesson.number)}
        className="flex min-w-0 flex-1 items-center gap-3 text-start rounded-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-3.5"
      >
        {/* Visual Media Anchor: Dual Image Split or Phonetic Typographic Tile */}
        <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/40 shadow-wp-xs sm:w-20">
          {showImages && firstImage && secondImage ? (
            <div className="grid size-full grid-cols-2 divide-x divide-border/60">
              <div className="relative size-full overflow-hidden bg-muted/20">
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <img
                  src={resolveAssetUrl(pronunciationImagePath(firstImage.imageRef))}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={() => setHasImageError(true)}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="relative size-full overflow-hidden bg-muted/20">
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <img
                  src={resolveAssetUrl(pronunciationImagePath(secondImage.imageRef))}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={() => setHasImageError(true)}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          ) : (
            /* Typographic / Phonetic Accent Fallback */
            <div className="flex size-full flex-col items-center justify-center bg-primary/10 p-1 text-center text-primary">
              <span className="font-mono text-xs font-black tracking-tight" dir="ltr">
                {fallbackSymbols || `/L${lesson.number}/`}
              </span>
            </div>
          )}

          {/* Floating Lesson Number / Mastered Badge */}
          <span
            className={`absolute start-1 top-1 flex size-6 items-center justify-center rounded-md text-xs font-black shadow-wp-xs backdrop-blur-sm ${
              mastered
                ? "bg-wp-green text-wp-text-on-green"
                : "border border-border/50 bg-card/90 text-foreground"
            }`}
          >
            {mastered ? <CheckCircle2 className="size-3.5" aria-hidden /> : lesson.number}
          </span>
        </div>

        {/* Center Content: Title, Phonetic Pill, Contrast Words, Status */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="truncate text-sm font-black text-foreground sm:text-base leading-snug"
              lang="en"
              dir="ltr"
            >
              {cleanTitle}
            </span>
            {phoneticBadge && (
              <span
                className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-bold text-primary"
                dir="ltr"
              >
                {phoneticBadge}
              </span>
            )}
          </div>

          {/* Minimal Pair Words or Contrast Tags */}
          {primaryWords.length >= 2 && (
            <div
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"
              dir="ltr"
            >
              <span className="rounded bg-muted/70 px-1.5 py-0.5 text-foreground">
                {primaryWords[0]}
              </span>
              <span className="text-muted-foreground/50">/</span>
              <span className="rounded bg-muted/70 px-1.5 py-0.5 text-foreground">
                {primaryWords[1]}
              </span>
            </div>
          )}

          {/* Status & Review indicator */}
          <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-primary">
            <Volume2 className="size-3.5 shrink-0" aria-hidden />
            {isDue ? (
              <>
                <Clock3 className="size-3.5 shrink-0" aria-hidden />
                <span>{t("pronunciation.dueReview")}</span>
              </>
            ) : progress?.status === "in-progress" ? (
              <span>
                {t("pronunciation.resumeStage", {
                  stage: (progress.currentStage ?? 0) + 1,
                })}
              </span>
            ) : mastered ? (
              <span>
                {t("pronunciation.masteredScore", {
                  score: progress?.bestScorePercent ?? 100,
                })}
              </span>
            ) : (
              <span className="font-medium text-muted-foreground">
                {t("pronunciation.lessonFormat")}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Trailing Controls: Pedagogical Info Modal Trigger + Arrow */}
      <div className="ms-2 flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(lesson.number);
          }}
          aria-label={t("pronunciation.viewLessonDetails", { lesson: lesson.number })}
          title={t("pronunciation.detailsTooltip")}
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Info className="size-4" aria-hidden />
        </button>

        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => onStartLesson(lesson.number)}
          className="hidden sm:flex size-8 items-center justify-center text-muted-foreground/60 transition-colors group-hover:text-primary"
        >
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </li>
  );
}
