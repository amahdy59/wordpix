import type { CourseUnit } from "../../data/lessons";
import type { StudyNode, UnitStudyProgress, StudyArea } from "./types";
import type { Action } from "../../types";
import { PrimaryButton } from "../../shared/PrimaryButton";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import {
  BookOpen,
  Dumbbell,
  MessageCircleMore,
  Check,
  LibraryBig,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useI18n } from "../../../i18n";
import { getCurriculumStageLabel, type UnitCurriculumDesign } from "../curriculumModel";

interface Props {
  unit: CourseUnit;
  nodes: StudyNode[];
  curriculumDesign: UnitCurriculumDesign;
  progress: UnitStudyProgress;
  onContinue: () => void;
  onSelectArea: (area: StudyArea) => void;
  onSelectNode: (nodeId: string) => void;
  dispatch: React.Dispatch<Action>;
}

const AREA_META: Record<StudyArea, { label: string; description: string; icon: typeof BookOpen }> =
  {
    learn: { label: "Learn", description: "Build core topic vocabulary", icon: BookOpen },
    use: {
      label: "Use in Context",
      description: "Authentic reading, dialogue & expressions",
      icon: MessageCircleMore,
    },
    practice: {
      label: "Practice",
      description: "Test recall across varied exercises",
      icon: Dumbbell,
    },
    review: { label: "Review", description: "Spaced repetition & confidence check", icon: Check },
    reference: {
      label: "Reference Toolkit",
      description: "Lookup tables, pronunciation & grammar",
      icon: LibraryBig,
    },
  };

export function StudyHome({
  unit,
  nodes,
  curriculumDesign,
  progress,
  onContinue,
  onSelectArea,
  onSelectNode,
  dispatch,
}: Props) {
  const { t } = useI18n();
  const coreNodes = nodes.filter((n) => n.area !== "reference" && n.isCore !== false);
  const completedCoreNodes = progress.completedNodeIds.filter((id) =>
    coreNodes.some((n) => n.id === id)
  );
  const percent = Math.round((completedCoreNodes.length / (coreNodes.length || 1)) * 100);
  const reviewDueCount = progress.reviewWordIds.length;

  // Prioritize the first incomplete core node, falling back to last active or first
  const continueNode =
    coreNodes.find((n) => !progress.completedNodeIds.includes(n.id)) ??
    (progress.lastNodeId ? nodes.find((n) => n.id === progress.lastNodeId) : null) ??
    nodes[0];

  const getAreaNodes = (area: StudyArea) => nodes.filter((n) => n.area === area);

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id })}
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl py-2 px-3 -ms-2 min-h-[44px] hover:bg-secondary/70 transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span>{t("study.backToUnit", { unit: unit.name })}</span>
        </button>
      </nav>

      {/* Unit Banner */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
            {t("study.unitStudyMaterials")}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground mt-2 tracking-tight">
            {unit.name}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
            {t("study.unitDescription", { unit: unit.name.toLowerCase() })}
          </p>
        </div>

        <section
          aria-labelledby="unit-outcome-heading"
          className="rounded-2xl sm:rounded-3xl border border-primary/30 bg-primary/5 p-4 sm:p-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">
              {curriculumDesign.reviewStatus === "authored"
                ? `CEFR ${curriculumDesign.cefr}`
                : t("study.suggestedLevel", { level: curriculumDesign.cefr })}
            </span>
            {curriculumDesign.reviewStatus === "authored" && (
              <span className="rounded-full border border-primary/30 bg-card px-3 py-1 text-xs font-bold text-foreground">
                GSE {curriculumDesign.gseRange[0]}–{curriculumDesign.gseRange[1]}
              </span>
            )}
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold capitalize text-muted-foreground">
              {t("study.pathwayType", { type: curriculumDesign.archetype })}
            </span>
          </div>
          {curriculumDesign.reviewStatus === "provisional" && (
            <p className="mt-3 text-sm text-muted-foreground">{t("study.provisionalUnit")}</p>
          )}
          <h2 id="unit-outcome-heading" className="mt-4 text-lg font-black text-foreground">
            {t("study.outcomeHeading")}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {curriculumDesign.outcome}
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Unit can-do goals">
            {curriculumDesign.canDo.map((goal) => (
              <li
                key={goal}
                className="flex items-start gap-2 text-sm leading-relaxed text-foreground"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-wp-green" aria-hidden />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-primary/20 pt-3 text-sm font-semibold text-foreground">
            <span className="text-primary">{t("study.finalMissionLabel")} </span>
            {curriculumDesign.finalTask}
          </p>
        </section>

        {unit.heroImage && (
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-muted h-36 sm:h-52 relative border border-border/60 shadow-xs">
            <img
              src={resolveAssetUrl(unit.heroImage)}
              alt={`${unit.name} environment scene`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Progress Summary Card */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border bg-card shadow-xs space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-foreground">{t("study.activityProgress")}</span>
            <span className="text-primary font-mono text-base">{`${percent}%`}</span>
          </div>

          {/* Accessible Progress Bar */}
          <div className="w-full h-2.5 sm:h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${percent}%` }}
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Activities completed: ${completedCoreNodes.length} of ${coreNodes.length}`}
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground pt-0.5">
            <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
              <CheckCircle2 className="size-4 text-wp-green" />
              {t("study.activitiesCompleted", {
                completed: completedCoreNodes.length,
                total: coreNodes.length,
              })}
            </span>
            {reviewDueCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-wp-amber font-bold">
                <Clock className="size-4" />
                {t("study.reviewQueueCount", {
                  count: reviewDueCount,
                  word: reviewDueCount === 1 ? t("study.word") : t("study.words"),
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Continue Action */}
      <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-border/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
        <div className="text-center sm:text-start flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Sparkles className="size-3.5" aria-hidden />
            <span>{t("study.nextStep")}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            {continueNode ? continueNode.title : t("study.startLearning")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed">
            {continueNode?.description
              ? continueNode.description
              : continueNode?.estimatedMinutes
                ? t("study.selfPacedActivity", { minutes: continueNode.estimatedMinutes })
                : t("study.selfPacedModule")}
          </p>
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <PrimaryButton onClick={onContinue} label={t("action.continue")} />
        </div>
      </div>

      {/* Structured Study Path */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold text-muted-foreground tracking-wider uppercase">
            {t("study.yourStudyPath")}
          </h2>
          <span className="text-xs font-bold text-muted-foreground">
            {t("study.doneCount", {
              completed: completedCoreNodes.length,
              total: coreNodes.length,
            })}
          </span>
        </div>

        <div className="space-y-4">
          {(["learn", "use", "practice", "review"] as StudyArea[]).map((area) => {
            const areaNodes = getAreaNodes(area);
            if (areaNodes.length === 0) return null;
            const meta = AREA_META[area];
            const Icon = meta.icon;
            const completedCount = areaNodes.filter((n) =>
              progress.completedNodeIds.includes(n.id)
            ).length;

            return (
              <section
                key={area}
                className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg text-foreground truncate">{meta.label}</h3>
                      <p className="text-xs text-muted-foreground truncate">{meta.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full shrink-0">
                    {completedCount} / {areaNodes.length}
                  </span>
                </div>

                <ul className="space-y-2 pt-3 border-t border-border/60">
                  {areaNodes.map((node) => {
                    const isDone = progress.completedNodeIds.includes(node.id);
                    return (
                      <li key={node.id}>
                        <button
                          type="button"
                          onClick={() => onSelectNode(node.id)}
                          className="w-full text-start p-3 sm:p-3.5 rounded-2xl hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-between group min-h-[48px] transition-colors border border-transparent hover:border-border/60"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span
                              className={`size-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                isDone
                                  ? "border-wp-green bg-wp-green text-wp-text-on-green"
                                  : "border-border group-hover:border-primary/50"
                              }`}
                            >
                              {isDone ? (
                                <Check className="size-3.5 stroke-[3]" />
                              ) : (
                                <span className="size-1.5 rounded-full bg-current opacity-40" />
                              )}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-sm text-foreground block truncate">
                                {node.title}
                              </span>
                              {node.stage && (
                                <span className="text-[11px] font-bold uppercase tracking-wide text-primary block mt-0.5">
                                  {getCurriculumStageLabel(node.stage)}
                                  {node.isCore === false ? " · Optional" : ""}
                                </span>
                              )}
                              {node.description && (
                                <span className="text-xs text-muted-foreground block truncate">
                                  {node.description}
                                </span>
                              )}
                            </div>
                          </div>
                          {node.estimatedMinutes && (
                            <span className="text-xs text-muted-foreground shrink-0 ms-3 font-medium bg-secondary/50 px-2.5 py-1 rounded-md">
                              {t("study.minutesShort", { minutes: node.estimatedMinutes })}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      {/* Reference Section (Toolkit) */}
      <div className="pt-4 border-t border-border/80">
        <button
          type="button"
          onClick={() => onSelectArea("reference")}
          className="w-full text-start p-5 sm:p-6 rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 hover:border-primary/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-between shadow-xs group"
        >
          <div className="flex items-center gap-4 min-w-0">
            <span className="p-3.5 rounded-2xl bg-primary text-primary-foreground shrink-0 shadow-xs">
              <LibraryBig className="size-6" aria-hidden />
            </span>
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                {t("study.languageToolkit")}
              </span>
              <h3 className="font-bold text-lg text-foreground mt-0.5 truncate">
                {t("study.referenceGuideTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                {t("study.referenceGuideDesc")}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary px-4 py-2 rounded-full bg-primary/10 shrink-0 ms-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors min-h-[44px]">
            <span>{t("study.open")}</span>
            <ArrowRight className="size-4" aria-hidden />
          </span>
        </button>
      </div>
    </div>
  );
}
