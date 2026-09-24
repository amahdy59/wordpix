import type { ReactNode } from "react";
import { Globe2 } from "lucide-react";

interface LanguageToggleProps {
  showArabic: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
}

export function LanguageToggle({
  showArabic,
  onToggle,
  showLabel,
  hideLabel,
}: LanguageToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={showArabic}
      onClick={onToggle}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-black text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Globe2 className="size-4" aria-hidden />
      {showArabic ? hideLabel : showLabel}
    </button>
  );
}

interface BilingualTextBlockProps {
  english: ReactNode;
  arabic?: ReactNode;
  showArabic: boolean;
  className?: string;
  englishClassName?: string;
  arabicClassName?: string;
}

export function BilingualTextBlock({
  english,
  arabic,
  showArabic,
  className,
  englishClassName,
  arabicClassName,
}: BilingualTextBlockProps) {
  return (
    <span className={className}>
      <span className={`block ${englishClassName ?? ""}`} lang="en" dir="ltr">
        {english}
      </span>
      {showArabic && arabic && (
        <bdi
          dir="rtl"
          lang="ar"
          className={`mt-1 block font-arabic text-[1.15em] leading-relaxed ${arabicClassName ?? "text-muted-foreground"}`}
        >
          {arabic}
        </bdi>
      )}
    </span>
  );
}
