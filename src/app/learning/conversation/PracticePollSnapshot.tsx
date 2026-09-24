import { BarChart3, CircleUserRound } from "lucide-react";
import { useI18n } from "../../../i18n";

interface PollOption {
  id: string;
  text: string;
}

interface Props {
  unitNumber: number;
  options: readonly PollOption[];
  selectedOptionId: string;
}

export interface PracticePollResult extends PollOption {
  percentage: number;
}

export function buildPracticePollResults(
  unitNumber: number,
  options: readonly PollOption[]
): PracticePollResult[] {
  if (options.length === 0) return [];

  const weights = options.map((_, index) => 24 + ((unitNumber * 17 + (index + 1) * 29) % 43));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const percentages = weights.map((weight) => Math.floor((weight / totalWeight) * 100));
  const assigned = percentages.reduce((sum, percentage) => sum + percentage, 0);

  percentages[unitNumber % options.length] += 100 - assigned;

  return options.map((option, index) => ({
    ...option,
    percentage: percentages[index],
  }));
}

export function PracticePollSnapshot({ unitNumber, options, selectedOptionId }: Props) {
  const { t } = useI18n();
  const results = buildPracticePollResults(unitNumber, options);
  const selected = results.find((result) => result.id === selectedOptionId);

  return (
    <aside
      className="mt-5 overflow-hidden rounded-3xl border border-border bg-muted/20"
      aria-labelledby="practice-poll-title"
      aria-live="polite"
    >
      <div className="border-b border-border bg-primary/5 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-wp-sm">
            <BarChart3 className="size-5" aria-hidden />
          </span>
          <div>
            <h3 id="practice-poll-title" className="font-black text-foreground">
              {t("conversation.practicePollTitle")}
            </h3>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-muted-foreground">
              {t("conversation.practicePollDisclosure")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <ul className="space-y-3">
          {results.map((result) => {
            const isSelected = result.id === selectedOptionId;
            return (
              <li
                key={result.id}
                className={`rounded-2xl border p-3.5 ${
                  isSelected ? "border-primary bg-primary/5 shadow-wp-xs" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="font-bold leading-snug text-foreground">
                    <span className="me-2 text-primary">{result.id}</span>
                    {result.text}
                  </span>
                  <span className="shrink-0 font-black text-foreground">{result.percentage}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={t("conversation.practicePollOptionResult", {
                    option: result.text,
                    percentage: result.percentage,
                  })}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={result.percentage}
                  className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className={`h-full rounded-full ${isSelected ? "bg-primary" : "bg-foreground/45"}`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
                {isSelected && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-primary">
                    <CircleUserRound className="size-4" aria-hidden />
                    {t("conversation.yourPosition")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        {selected && (
          <p className="rounded-2xl border border-border bg-card p-3.5 text-sm font-semibold leading-relaxed text-foreground">
            {t("conversation.practicePollReflection", { choice: selected.text })}
          </p>
        )}
      </div>
    </aside>
  );
}
