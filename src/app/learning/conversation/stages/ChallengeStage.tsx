import { useState } from "react";
import { Award, CheckSquare, Sparkles, ExternalLink, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { useI18n } from "../../../../i18n";
import { SpeechRecordCompare } from "../../../shared/SpeechRecordCompare";
import { TaskChecklist } from "../../../shared/TaskChecklist";

interface Props {
  unit: ConversationUnit;
  isMastered: boolean;
  prerequisitesComplete: boolean;
  initialResponse: string;
  onSaveResponse: (response: string) => void;
  onComplete: () => void;
  onPrev: () => void;
  onExit: () => void;
}

export function ChallengeStage({
  unit,
  isMastered,
  prerequisitesComplete,
  initialResponse,
  onSaveResponse,
  onComplete,
  onPrev,
  onExit,
}: Props) {
  const { t } = useI18n();
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [response, setResponse] = useState(initialResponse);
  const [justCompleted, setJustCompleted] = useState(false);

  const toggleTask = (idx: number) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleFinishUnit = () => {
    if (!canFinish) return;
    onSaveResponse(response);
    onComplete();
    setJustCompleted(true);
  };
  const allTasksComplete = unit.speakingChallenge.tasks.every((_, index) =>
    completedTasks.has(index)
  );
  const hasSubstantiveResponse = response.trim().length >= 20;
  const canFinish = prerequisitesComplete && allTasksComplete && hasSubstantiveResponse;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Stage Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <Award className="size-4" aria-hidden />
          {t("conversation.challengeStage")}
        </span>

        {isMastered && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-black text-accent">
            <CheckCircle2 className="size-4" aria-hidden />
            {t("conversation.unitMastered")}
          </span>
        )}
      </div>

      {/* Scenario Hero Card */}
      <section
        className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-wp-sm"
        aria-labelledby="challenge-heading"
      >
        <span className="text-xs font-black uppercase tracking-wider text-primary">
          {t("conversation.realWorldChallenge")}
        </span>
        <h1
          id="challenge-heading"
          className="mt-2 text-2xl sm:text-3xl font-black text-foreground tracking-tight"
        >
          {unit.speakingChallenge.title}
        </h1>
        <p className="mt-3 text-base sm:text-lg font-medium text-foreground leading-relaxed">
          {unit.speakingChallenge.scenario}
        </p>
      </section>

      <section
        className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-wp-xs"
        aria-labelledby="challenge-response-title"
      >
        <h2 id="challenge-response-title" className="text-base font-black text-foreground">
          {t("conversation.challengeResponse")}
        </h2>
        <p id="challenge-response-help" className="mt-1 text-sm font-medium text-muted-foreground">
          {t("conversation.challengeResponseHelp")}
        </p>
        <textarea
          value={response}
          onChange={(event) => setResponse(event.target.value.slice(0, 6000))}
          onBlur={() => onSaveResponse(response)}
          aria-describedby="challenge-response-help challenge-response-count"
          className="mt-4 min-h-40 w-full resize-y rounded-2xl border border-border bg-background p-4 text-base leading-relaxed text-foreground shadow-inner focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          placeholder={t("conversation.challengeResponsePlaceholder")}
        />
        <p id="challenge-response-count" className="mt-2 text-xs font-bold text-muted-foreground">
          {t("conversation.challengeResponseCount", { count: response.trim().length })}
        </p>
      </section>

      <SpeechRecordCompare
        target={unit.speakingChallenge.scenario}
        modelText={unit.speakingChallenge.usefulFrames.join(" ")}
        title={t("conversation.challengeSpeakingStudio")}
        description={t("conversation.challengeSpeakingHelp")}
        maxDurationSeconds={120}
      />

      {/* Task Checklist */}
      <section
        className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-wp-xs"
        aria-labelledby="tasks-title"
      >
        <div className="flex items-center gap-2">
          <CheckSquare className="size-5 text-primary" aria-hidden />
          <h2 id="tasks-title" className="text-base font-black text-foreground">
            {t("conversation.taskChecklist")}
          </h2>
        </div>

        <div className="mt-4">
          <TaskChecklist
            items={unit.speakingChallenge.tasks}
            checked={completedTasks}
            onToggle={toggleTask}
          />
        </div>
      </section>

      {/* Useful Frames Quick Reference */}
      <section
        className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-wp-xs"
        aria-labelledby="useful-frames-title"
      >
        <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-wide">
          <Sparkles className="size-4.5" aria-hidden />
          <h2 id="useful-frames-title">{t("conversation.usefulFrames")}</h2>
        </div>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {unit.speakingChallenge.usefulFrames.map((frame, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs sm:text-sm font-semibold text-foreground italic"
            >
              "{frame}"
            </div>
          ))}
        </div>
      </section>

      {/* Research Basis Citations */}
      {unit.researchBasis.length > 0 && (
        <section
          className="rounded-2xl border border-border/70 bg-muted/20 p-5 text-xs text-muted-foreground"
          aria-labelledby="research-basis-title"
        >
          <h3
            id="research-basis-title"
            className="font-bold uppercase tracking-wider text-foreground mb-2"
          >
            {t("conversation.researchBasis")}:
          </h3>
          <ul className="flex flex-col gap-1.5">
            {unit.researchBasis.map((citation, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span>• {citation.source}</span>
                {citation.url && citation.url !== "#" && (
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <span>{t("conversation.readSource")}</span>
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Celebration Banner if finished */}
      {(justCompleted || isMastered) && (
        <div className="rounded-3xl border-2 border-accent/50 bg-accent/10 p-6 text-center shadow-wp-md animate-in zoom-in-95">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-wp-sm">
            <CheckCircle2 className="size-8" aria-hidden />
          </div>
          <h3 className="mt-3 text-xl font-black text-foreground">
            {t("conversation.unitComplete")}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {t("conversation.completionMessage", { number: unit.unitNumber })}
          </p>
        </div>
      )}

      {/* Stage Navigation Footer */}
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 font-bold text-foreground hover:bg-muted active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          <span>{t("conversation.previous")}</span>
        </button>

        {!isMastered && !justCompleted ? (
          <button
            type="button"
            onClick={handleFinishUnit}
            disabled={!canFinish}
            aria-describedby="challenge-completion-requirements"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-black text-primary-foreground shadow-wp-md hover:opacity-95 active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="size-5" aria-hidden />
            <span>{t("conversation.completeUnit")}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onExit}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-black text-primary-foreground shadow-wp-md hover:opacity-95 active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>{t("conversation.backToUnits")}</span>
          </button>
        )}
      </div>
      {!isMastered && !justCompleted && (
        <p
          id="challenge-completion-requirements"
          className="text-center text-sm font-semibold text-muted-foreground"
          aria-live="polite"
        >
          {canFinish ? t("conversation.requirementsMet") : t("conversation.requirementsPending")}
        </p>
      )}
    </div>
  );
}
