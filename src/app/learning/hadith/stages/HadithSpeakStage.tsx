import { useState } from "react";
import { Check, ChevronDown, Mic, Sparkles, Volume2 } from "lucide-react";
import { useI18n } from "../../../../i18n";
import { useAudio } from "../../../shared/useAudio";
import type { ParsedSpeakTask } from "../hadithLessonContent";

interface Props {
  speak: ParsedSpeakTask;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function HadithSpeakStage({ speak: speakData }: Props) {
  const { t } = useI18n();
  const [completedChecks, setCompletedChecks] = useState<Set<number>>(new Set());
  const { speak: playAudio, isPlaying } = useAudio({
    lang: "en-US",
    rate: 0.88,
    preferLocal: true,
  });

  const modelText =
    speakData.modelDialogue.join(" ") ||
    t("hadith.pilot.speak.model") ||
    "I helped my sibling with their studies. I did it because the homework was difficult. My intention was to help them understand.";

  const toggleCheck = (index: number) => {
    setCompletedChecks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6" aria-labelledby="stage-speak-heading">
      <header className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
            <Mic className="size-3.5" aria-hidden />
            {t("hadith.speakLabel") || "Transfer Task"}
          </span>
        </div>

        <h2
          id="stage-speak-heading"
          tabIndex={-1}
          className="mt-3 text-2xl font-black tracking-tight text-foreground outline-none sm:text-3xl"
        >
          {speakData.title ||
            t("hadith.pilot.speak.title") ||
            "Explain an action and its intention"}
        </h2>

        <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
          {speakData.description ||
            t("hadith.pilot.speak.description") ||
            "Choose a helpful everyday action. Speak for two or three sentences; your response is private and is not stored."}
        </p>

        {/* Sentence Frame Card */}
        {speakData.frames.length > 0 ? (
          <div className="mt-6 space-y-2 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-primary">
              {t("hadith.pilot.speak.frameLabel") || "Sentence Frame"}
            </p>
            {speakData.frames.map((frame, i) => (
              <p key={i} className="text-base font-black text-foreground" lang="en" dir="ltr">
                {frame}
              </p>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-primary">
              {t("hadith.pilot.speak.frameLabel") || "Sentence Frame"}
            </p>
            <p className="mt-2 text-lg font-black text-foreground" lang="en" dir="ltr">
              {t("hadith.pilot.speak.frame") ||
                "I [action]. I did it because [reason]. My intention was to [purpose]."}
            </p>
          </div>
        )}

        {/* Model Answer Drawer */}
        <details className="group mt-6 overflow-hidden rounded-2xl border border-border bg-background transition-colors open:bg-card">
          <summary
            className={`flex min-h-12 cursor-pointer list-none items-center justify-between p-4 font-black text-foreground transition-colors hover:bg-muted/50 ${focusRing}`}
          >
            <span>{t("hadith.showSampleAnswer") || "Show sample answer"}</span>
            <ChevronDown
              className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="border-t border-border p-5">
            <div className="rounded-xl bg-muted/60 p-4">
              <p
                className="text-sm font-medium leading-relaxed text-foreground"
                lang="en"
                dir="ltr"
              >
                {modelText}
              </p>
            </div>
            <button
              type="button"
              onClick={() => playAudio(modelText)}
              aria-busy={isPlaying}
              className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary px-4 text-sm font-black text-primary transition-all hover:bg-primary/10 active:scale-[0.98] ${focusRing}`}
            >
              <Volume2 className="size-4" aria-hidden />
              <span>
                {isPlaying
                  ? t("hadith.playing") || "Playing…"
                  : t("hadith.playModel") || "Play sample pronunciation"}
              </span>
            </button>
          </div>
        </details>
      </header>

      {/* Interactive Speaking Self-Check */}
      <section
        className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8"
        aria-labelledby="self-check-heading"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" aria-hidden />
          <h3 id="self-check-heading" className="text-xl font-black text-foreground">
            {t("hadith.pilot.speak.checkTitle") || "Self-check before continuing"}
          </h3>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {t("hadith.speakChecklistDescription")}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {speakData.checklist.map((item, index) => {
            const isChecked = completedChecks.has(index);
            return (
              <button
                key={index}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggleCheck(index)}
                className={`flex min-h-12 w-full items-center gap-3.5 rounded-2xl border-2 p-4 text-start text-sm font-bold transition-all active:scale-[0.99] ${focusRing} ${
                  isChecked
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/40"
                }`}
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                    isChecked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background"
                  }`}
                  aria-hidden
                >
                  {isChecked && <Check className="size-4 stroke-[3]" />}
                </span>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </section>
    </section>
  );
}
