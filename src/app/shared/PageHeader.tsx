import { memo, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "./IconButton";

export type PageHeaderVariant = "hero" | "plain";

export interface PageHeaderProps {
  title: ReactNode;
  titleId?: string;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  variant?: PageHeaderVariant;
  headingLevel?: "h1" | "h2";
  className?: string;
}

/**
 * Standardized responsive page header for WordPix screens.
 * Renders consistent typography, eyebrow/badge, subtitle, and action slots.
 * Supports "hero" (card-banner with border) and "plain" (clean inline) variants.
 */
export const PageHeader = memo(function PageHeader({
  title,
  titleId,
  subtitle,
  eyebrow,
  actions,
  onBack,
  backLabel = "Back",
  variant = "plain",
  headingLevel = "h1",
  className = "",
}: PageHeaderProps) {
  const HeadingTag = headingLevel;

  const containerStyles =
    variant === "hero"
      ? "grid gap-2.5 sm:gap-3 border-b border-border pb-3 sm:pb-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
      : "grid gap-3 py-1 sm:gap-4 sm:py-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end";
  const headingStyles =
    headingLevel === "h1" ? "text-xl sm:text-2xl lg:text-3xl" : "text-base sm:text-lg lg:text-xl";

  return (
    <header className={`${containerStyles} ${className}`}>
      <div className="min-w-0 flex items-start gap-2.5 sm:gap-4">
        {onBack && (
          <div className="mt-1 shrink-0">
            <IconButton
              aria-label={backLabel}
              icon={<ArrowLeft className="size-5 rtl:rotate-180" aria-hidden="true" />}
              onClick={onBack}
              variant="outline"
              size="sm"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          {eyebrow && (
            <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-primary">
              {eyebrow}
            </div>
          )}

          <HeadingTag
            id={titleId}
            className={`font-sans ${headingStyles} font-bold leading-[1.3] text-foreground tracking-tight text-balance`}
          >
            {title}
          </HeadingTag>

          {subtitle && (
            <p className="mt-1 sm:mt-2 max-w-3xl text-sm sm:text-base font-medium leading-relaxed text-muted-foreground text-pretty">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2 sm:gap-3 lg:justify-end [&>*]:max-w-full">
          {actions}
        </div>
      )}
    </header>
  );
});
