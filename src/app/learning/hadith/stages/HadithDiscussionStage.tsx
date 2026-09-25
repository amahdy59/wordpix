import { ChevronDown, Lightbulb, MessageCircle, MessagesSquare } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { ParsedReviewItem } from "../hadithLessonContent";

interface Props {
  lessonTitle: string;
  translation: string;
  reviewItems: readonly ParsedReviewItem[];
}

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function HadithDiscussionStage({ lessonTitle, translation, reviewItems }: Props) {
  const { t } = useI18n();
  const sourceExcerpt = `${translation.split(/(?<=[.!?])\s+/)[0] ?? translation}`;
  const questions = [
    ...reviewItems.slice(0, 2).map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
    {
      question: t("hadith.discussionApplyQuestion", { title: lessonTitle }),
      answer: t("hadith.discussionApplyAnswer", { title: lessonTitle }),
    },
    {
      question: t("hadith.discussionExplainQuestion"),
      answer: t("hadith.discussionExplainAnswer", { excerpt: sourceExcerpt }),
    },
  ].slice(0, 4);

  return (
    <section
      className="mx-auto w-full max-w-4xl space-y-5"
      aria-labelledby="stage-discussion-heading"
    >
      <header className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
        <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
          <MessagesSquare className="size-4" aria-hidden />
          {t("hadith.discussionLabel")}
        </p>
        <h2
          id="stage-discussion-heading"
          tabIndex={-1}
          className="mt-3 text-2xl font-black tracking-tight text-foreground outline-none sm:text-3xl"
        >
          {t("hadith.discussionTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-muted-foreground">
          {t("hadith.discussionDescription")}
        </p>
      </header>

      <ol className="grid gap-4">
        {questions.map((item, index) => (
          <li key={`${index}-${item.question}`}>
            <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-wp-xs">
              <div className="flex items-start gap-4 p-5 sm:p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-black text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <h3 className="font-black leading-6 text-foreground" lang="en" dir="ltr">
                      {item.question}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t("hadith.discussionPrompt")}
                  </p>
                </div>
              </div>

              <details className="group border-t border-border bg-muted/20">
                <summary
                  className={`flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 font-black text-primary hover:bg-primary/5 sm:px-6 ${focusRing}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Lightbulb className="size-4" aria-hidden />
                    {t("hadith.showSampleAnswer")}
                  </span>
                  <ChevronDown
                    className="size-5 transition-transform motion-reduce:transition-none group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="border-t border-border px-5 py-4 sm:px-6">
                  <p
                    className="text-sm font-semibold leading-7 text-foreground"
                    lang="en"
                    dir="ltr"
                  >
                    {item.answer}
                  </p>
                </div>
              </details>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
