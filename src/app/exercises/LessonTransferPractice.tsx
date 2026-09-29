import { useMemo, useState } from "react";
import { CheckCircle2, History, PenLine } from "lucide-react";
import type { LessonUsageData } from "../data/usageTypes";
import { parseSpacedReview } from "../data/lessonContext";
import { useI18n } from "../context/I18nContext";

interface Props {
  usage: LessonUsageData;
}

function usefulProductionTasks(usage: LessonUsageData) {
  const explicit = usage.exercises.filter(
    (exercise) =>
      /^Use it:/iu.test(exercise.prompt) ||
      ["sentence", "spoken", "extended-response"].includes(exercise.responseMode ?? "")
  );
  const source = explicit.length > 0 ? explicit : usage.exercises.slice(-2);
  return source.slice(0, 2);
}

export function LessonTransferPractice({ usage }: Props) {
  const { t } = useI18n();
  const tasks = useMemo(() => usefulProductionTasks(usage), [usage]);
  const reviewIntervals = useMemo(
    () => parseSpacedReview(usage.spacedReview),
    [usage.spacedReview]
  );
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [reviewResponse, setReviewResponse] = useState("");
  const [reviewChecked, setReviewChecked] = useState(false);

  return (
    <section className="space-y-4" aria-labelledby="lesson-transfer-heading">
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-wp-xs sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <PenLine className="size-5" aria-hidden />
          </span>
          <div>
            <h3
              id="lesson-transfer-heading"
              className="font-sans text-lg font-black text-foreground"
            >
              {t("story.transferPracticeTitle")}
            </h3>
            <p className="mt-1 font-sans text-sm leading-relaxed text-muted-foreground">
              {t("story.transferPracticeDescription")}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          {tasks.map((task, index) => (
            <div
              key={`${task.prompt}-${index}`}
              className="rounded-2xl border border-border bg-wp-card p-4"
            >
              <label
                htmlFor={`transfer-response-${index}`}
                className="block font-sans text-sm font-bold leading-relaxed text-foreground"
              >
                {task.prompt.replace(/^Use it:\s*/iu, "")}
              </label>
              <textarea
                id={`transfer-response-${index}`}
                value={responses[index] ?? ""}
                onChange={(event) =>
                  setResponses((current) => ({ ...current, [index]: event.target.value }))
                }
                rows={3}
                dir="ltr"
                lang="en"
                placeholder={t("story.transferResponsePlaceholder")}
                className="mt-3 w-full rounded-xl border-2 border-border bg-background p-3 font-sans text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              />
              <button
                type="button"
                disabled={!responses[index]?.trim()}
                onClick={() => setRevealed((current) => ({ ...current, [index]: true }))}
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 font-sans text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <CheckCircle2 className="size-4" aria-hidden />
                {t("story.compareResponse")}
              </button>
              {revealed[index] && (
                <div className="mt-3 rounded-xl border border-feedback-success/40 bg-feedback-success-surface p-3 text-sm text-feedback-success-foreground">
                  <span className="font-bold">{t("story.modelResponseLabel")}</span>{" "}
                  <span dir="ltr" lang="en">
                    {task.answer || t("story.openResponseGuidance")}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {reviewIntervals.length > 0 && (
        <div className="rounded-3xl border border-border bg-wp-card p-5 shadow-wp-xs sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
              <History className="size-5" aria-hidden />
            </span>
            <div>
              <h3 className="font-sans text-base font-black text-foreground">
                {t("story.contextualReviewTitle")}
              </h3>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                {t("story.contextualReviewDescription")}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {reviewIntervals.map((interval) => (
              <div
                key={`${interval.distance}-${interval.lessonId}`}
                className="rounded-2xl border border-border bg-secondary/40 p-3"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  {t("story.lessonsBack", { count: interval.distance })}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground" dir="ltr" lang="en">
                  {interval.words.join(" · ")}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm font-semibold text-foreground">
            {t("story.reviewTransferPrompt", { current: usage.targetWordsEnglish[0] })}
          </p>
          <label
            htmlFor="contextual-review-response"
            className="mt-4 block font-sans text-sm font-bold text-foreground"
          >
            {t("story.reviewResponseLabel")}
          </label>
          <textarea
            id="contextual-review-response"
            value={reviewResponse}
            onChange={(event) => {
              setReviewResponse(event.target.value);
              setReviewChecked(false);
            }}
            rows={3}
            dir="ltr"
            lang="en"
            placeholder={t("story.reviewResponsePlaceholder")}
            className="mt-2 w-full rounded-xl border-2 border-border bg-background p-3 font-sans text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          />
          <button
            type="button"
            disabled={!reviewResponse.trim()}
            onClick={() => setReviewChecked(true)}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 font-sans text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <CheckCircle2 className="size-4" aria-hidden />
            {t("story.checkTransferSentence")}
          </button>
          {reviewChecked && (
            <div
              role="status"
              className="mt-3 rounded-xl border border-feedback-success/40 bg-feedback-success-surface p-3 text-sm text-feedback-success-foreground"
            >
              <p className="font-bold">{t("story.transferChecklistTitle")}</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>{t("story.transferChecklistReviewed")}</li>
                <li>{t("story.transferChecklistCurrent")}</li>
                <li>{t("story.transferChecklistMeaning")}</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
