import { memo, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "./IconButton";

export type PageHeaderVariant = "hero" | "plain";

export interface PageHeaderProps {
  title: ReactNode;
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
  subtitle,
  eyebrow,
  actions,
  onBack,
  backLabel = "Back",
  variant = "hero",
  headingLevel = "h1",
  className = "",
}: PageHeaderProps) {
  const HeadingTag = headingLevel;

  const containerStyles =
    variant === "hero"
      ? "rounded-3xl border border-primary/25 bg-wp-card p-5 sm:p-6 shadow-wp-sm grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center"
      : "flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2";

  return (
    <header className={`${containerStyles} ${className}`}>
      <div className="min-w-0 flex items-start gap-3 sm:gap-4">
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
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-primary">
              {eyebrow}
            </div>
          )}

          <HeadingTag className="font-sans text-2xl sm:text-3xl font-black leading-tight text-foreground tracking-tight">
            {title}
          </HeadingTag>

          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3 shrink-0 lg:justify-end">{actions}</div>
      )}
    </header>
  );
});
