import { useLessonSession } from "./LessonSessionContext";
import { useI18n } from "../context/I18nContext";
import { memo } from "react";
import { Keyboard } from "lucide-react";
import { BackButton } from "./BackButton";
import { CloseButton } from "./CloseButton";
import { ProgressBar } from "./ProgressBar";

interface Props {
  className?: string;
  title: string;
  /**
   * Optional one-line subtitle rendered between the title row and progress bar.
   * Use for group name + question count so individual exercises don't need their own header row.
   */
  subtitle?: React.ReactNode;
  /**
   * 1-based position in the flow, e.g. 3 for "step 3 of 9".
   *
   * This was previously `step`, documented as a 0-based index but passed
   * 1-based by all 35 suite screens. The result was `step={9} total={9}` ->
   * aria-valuenow=111 against aria-valuemax=100, and every suite opening at
   * 22% instead of 11%. Renamed so the compiler forces each call site to be
   * re-read rather than silently inheriting the wrong convention.
   */
  current: number;
  /** Total number of steps in the flow (default 6) */
  total?: number;
  /** Noun announced for this progress value. */
  progressLabel?: string;
  /** Localized accessible name for the progress bar. Defaults to `{progressLabel} progress`. */
  progressAriaLabel?: string;
  /** Localized value text, e.g. `Step 3 of 9`. Defaults to `{progressLabel} {current} of {total}`. */
  progressAriaValueText?: string;
  onBack: () => void;
  onClose: () => void;
  /** Optional callback to open keyboard shortcuts cheatsheet modal */
  onOpenShortcuts?: () => void;
}

/**
 * Reusable header for all lesson/exercise screens.
 * Contains back arrow, centred title, ✕ close, and a progress bar.
 */
export const LessonHeader = memo(function LessonHeader({
  className = "wp-container-content",
  title,
  subtitle,
  current,
  total = 6,
  progressLabel = "Step",
  progressAriaLabel,
  progressAriaValueText,
  onBack,
  onClose,
  onOpenShortcuts,
}: Props) {
  const session = useLessonSession();
  const { t } = useI18n();
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const pct = Math.round((safeCurrent / safeTotal) * 100);

  return (
    // A `header`, not a `div`. The exercise screens do not go through AppShell,
    // so this row — the title, the back and close buttons, and the progress
    // bar — was the only content on the page outside any landmark, which axe
    // flags and which leaves a screen-reader user unable to jump to it.
    <header
      aria-label={t("ux.lessonNavigation")}
      className={`wp-lesson-header wp-layout-gutter flex flex-col gap-1.5 py-2 relative shrink-0 w-full ${className}`}
    >
      <div className="wp-lesson-title-row content-stretch flex items-center justify-between relative shrink-0 w-full gap-3">
        <div className="shrink-0">
          <BackButton onClick={onBack} aria-label={t("action.back")} />
        </div>
        <h1
          title={title}
          className="wp-type-page-title text-foreground text-center flex-1 min-w-0 break-words max-sm:text-sm max-sm:font-bold max-sm:truncate"
        >
          {title}
        </h1>
        <div className="shrink-0 flex items-center gap-1.5">
          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              aria-label={t("shortcuts.title")}
              title={`${t("shortcuts.title")} (?)`}
              className="hidden sm:inline-flex items-center justify-center size-11 min-h-[44px] min-w-[44px] rounded-full border border-border bg-wp-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            >
              <Keyboard className="size-5" aria-hidden="true" />
            </button>
          )}
          <CloseButton onClick={onClose} aria-label={t("listenRepeat.exit")} />
        </div>
      </div>

      {(session || subtitle) && (
        <div className="wp-lesson-meta flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-sans text-muted-foreground">
          {session && (
            <p className="shrink-0">
              {t("ux.sessionStep", { current: session.current, total: session.total })}
            </p>
          )}
          {subtitle && (
            <div className="wp-lesson-subtitle flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-1 font-semibold [&>span]:min-w-0 [&>span]:break-words">
              {subtitle}
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      <ProgressBar
        size="sm"
        progressPercent={pct}
        ariaLabel={progressAriaLabel ?? `${progressLabel} progress`}
        ariaValueText={progressAriaValueText ?? `${progressLabel} ${safeCurrent} of ${safeTotal}`}
      />
    </header>
  );
});
