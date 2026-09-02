import { Sparkles } from "lucide-react";
import { ForwardIcon } from "./ForwardIcon";
import { useI18n } from "../../../context/I18nContext";
import { formatNumber } from "../../../shared/useAccessibilityPreferences";
import { useLearner } from "../../../context/LearnerContext";

interface Props {
  roundNumber: number;
  totalRounds: number;
  roundCorrect: number;
  roundTotal: number;
  onContinueNextRound: () => void;
  /** Pauses session — does NOT mark node complete */
  onPause: () => void;
  isFinalRound: boolean;
}

export function RoundCheckpointCard({
  roundNumber,
  totalRounds: _totalRounds,
  roundCorrect,
  roundTotal,
  onContinueNextRound,
  onPause,
  isFinalRound,
}: Props) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const { numeralSystem, reduceMotion } = learnerState.accessibility;

  const percent = Math.round((roundCorrect / Math.max(1, roundTotal)) * 100);
  const roundLabel = percent >= 80 ? t("practice.roundStrong") : t("practice.roundGood");

  return (
    <div
      className={`rounded-3xl border border-border p-6 sm:p-8 bg-card shadow-xs text-center ${
        reduceMotion ? "" : "animate-in fade-in zoom-in-95 duration-200"
      } flex flex-col items-center max-w-lg mx-auto w-full`}
      role="region"
      aria-labelledby="checkpoint-heading"
    >
      <div className="size-16 rounded-2xl bg-wp-green-light/20 text-wp-green flex items-center justify-center mb-4 border border-wp-green/30 shadow-xs">
        <Sparkles className="size-8" aria-hidden />
      </div>
      {/* Round counter — semantic eyebrow label (no uppercase in Arabic via CSS) */}
      <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1 [lang='ar']:[text-transform:none] [lang='ar']:[letter-spacing:normal]">
        {t("practice.roundComplete", { round: formatNumber(roundNumber, numeralSystem) })}
      </div>
      <h2 id="checkpoint-heading" className="text-2xl font-extrabold text-foreground mb-2">
        {roundLabel}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        {t("practice.roundScore", {
          correct: formatNumber(roundCorrect, numeralSystem),
          total: formatNumber(roundTotal, numeralSystem),
          percent: formatNumber(percent, numeralSystem),
        })}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        {!isFinalRound ? (
          <>
            {/* Pause — does NOT mark complete */}
            <button
              type="button"
              onClick={onPause}
              className="px-5 py-3 border border-border text-foreground rounded-2xl font-bold text-sm hover:bg-secondary transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t("practice.finishForNow")}
            </button>
            <button
              type="button"
              onClick={onContinueNextRound}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>
                {t("practice.startRound", { round: formatNumber(roundNumber + 1, numeralSystem) })}
              </span>
              <ForwardIcon className="size-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onContinueNextRound}
            className="px-7 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>{t("practice.viewSummary")}</span>
            <ForwardIcon className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
