import { useI18n } from "../context/I18nContext";
import { HelpDisclosure } from "./HelpDisclosure";
import { memo, useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

export interface CurriculumTopicCardProps {
  /** Primary accessible name for the card trigger button */
  ariaLabel?: string;
  /** Topic or lesson number badge (e.g. "1", "Unit 01") */
  numberBadge?: ReactNode;
  /** Optional CEFR or secondary badge on the media cover (e.g. "B1", "B2") */
  levelBadge?: ReactNode;
  /** Whether the topic is mastered */
  isMastered?: boolean;
  /** Whether this is the currently recommended/active step */
  isCurrent?: boolean;
  /** Optional short eyebrow / category label above the title */
  eyebrow?: ReactNode;
  /** Main topic title */
  title: string;
  /** Image URL for the hero cover */
  imageSrc?: string;
  /** Alt text if image is informative; defaults to empty decorative string since card title labels the button */
  imageAlt?: string;
  /** Fallback icon when image is absent or fails to load */
  fallbackIcon?: ReactNode;
  /** Eager loading for above-the-fold cards */
  priority?: boolean;
  /** Pedagogical description, purpose, or outcome shown in the accessible tooltip */
  tooltipText?: string;
  /** Accessible label for the info tooltip trigger button */
  infoAriaLabel?: string;
  /** Compact status or duration text in the footer */
  statusText?: ReactNode;
  /** Icon paired with the status text */
  statusIcon?: ReactNode;
  /** Custom class for the status text color */
  statusClassName?: string;
  /** Action label on the trailing end of the footer (e.g. "Start") */
  actionLabel?: string;
  /** Optional extra footer or secondary action slot (rendered outside the primary button) */
  secondaryAction?: ReactNode;
  /** Callback when the topic card is activated */
  onClick: () => void;
  /** Optional className override for the outer article */
  className?: string;
}

/**
 * Unified, media-forward topic card used across WordPix curricula.
 * Prioritizes visual recognition (prominent image + clean title) while
 * housing secondary descriptions in deliberate click/tap help disclosures.
 */
export const CurriculumTopicCard = memo(function CurriculumTopicCard({
  ariaLabel,
  numberBadge,
  levelBadge,
  isMastered = false,
  isCurrent = false,
  eyebrow,
  title,
  imageSrc,
  imageAlt = "",
  fallbackIcon,
  priority = false,
  tooltipText,
  infoAriaLabel,
  statusText,
  statusIcon,
  statusClassName = "text-primary",
  actionLabel,
  secondaryAction,
  onClick,
  className = "",
}: CurriculumTopicCardProps) {
  const { t } = useI18n();
  const [imageError, setImageError] = useState(false);
  const hasTooltip = Boolean(tooltipText?.trim());
  const showImage = Boolean(imageSrc) && !imageError;

  return (
    <article
      className={`group relative flex h-full flex-col justify-between rounded-3xl border bg-card shadow-wp-xs transition-all ${
        isCurrent
          ? "border-primary/60 bg-primary/5 shadow-wp-sm"
          : "border-border hover:border-primary/50 hover:shadow-wp-sm"
      } ${className}`}
    >
      {/* Primary Card Trigger Button (never nests other interactive buttons) */}
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        aria-current={isCurrent ? "step" : undefined}
        className="flex min-h-11 min-w-11 flex-1 flex-col justify-between overflow-hidden rounded-3xl text-start focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:active:scale-[0.99]"
      >
        {/* Prominent Media Cover */}
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-border/50 bg-muted/40">
          {showImage ? (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <img
              src={imageSrc}
              alt={imageAlt}
              width={400}
              height={225}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              onError={() => setImageError(true)}
              className="size-full object-cover object-center transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
          ) : (
            <div
              className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-4 text-primary"
              aria-hidden="true"
            >
              {fallbackIcon ?? <BookOpen className="size-10 opacity-80" aria-hidden />}
            </div>
          )}

          {/* Top-Start Floating Badges */}
          <div className="absolute start-3 top-3 flex flex-wrap items-center gap-1.5 pe-12">
            {numberBadge !== undefined && numberBadge !== null && (
              <span
                className={`inline-flex min-h-7 min-w-7 items-center justify-center rounded-xl px-2.5 py-1 text-xs font-black shadow-wp-xs backdrop-blur-md ${
                  isMastered
                    ? "bg-wp-green text-wp-text-on-green"
                    : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "border border-border/60 bg-card/95 text-foreground"
                }`}
              >
                {isMastered ? (
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
                    <span>{numberBadge}</span>
                  </span>
                ) : (
                  numberBadge
                )}
              </span>
            )}

            {levelBadge && (
              <span className="inline-flex min-h-7 items-center justify-center rounded-xl bg-primary px-2.5 py-1 text-xs font-black text-primary-foreground shadow-wp-xs">
                {levelBadge}
              </span>
            )}
          </div>
        </div>

        {/* Clean Title-First Body */}
        <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
          <div className="flex flex-col gap-1">
            {eyebrow && (
              <span className="line-clamp-1 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                {eyebrow}
              </span>
            )}
            <h3 className="line-clamp-2 font-sans text-base font-black leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
              {title}
            </h3>
          </div>

          {/* Compact Status Footer */}
          {(statusText || actionLabel) && (
            <div className="mt-auto flex w-full items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs">
              {statusText ? (
                <span className={`inline-flex items-center gap-1.5 font-bold ${statusClassName}`}>
                  {statusIcon}
                  <span className="line-clamp-1">{statusText}</span>
                </span>
              ) : (
                <span />
              )}

              <span className="inline-flex shrink-0 items-center gap-1 font-bold text-primary transition-transform motion-safe:group-hover:translate-x-0.5 rtl:motion-safe:group-hover:-translate-x-0.5">
                {actionLabel && <span>{actionLabel}</span>}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Optional Secondary Action Area (outside primary button to prevent nested controls) */}
      {secondaryAction && (
        <div className="border-t border-border/60 px-4 py-3 sm:px-5">{secondaryAction}</div>
      )}

      {hasTooltip && (
        <HelpDisclosure
          variant="icon"
          label={infoAriaLabel || t("help.aboutTopic", { title })}
          className="absolute end-1.5 top-1.5 z-20"
        >
          {tooltipText}
        </HelpDisclosure>
      )}
    </article>
  );
});
