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

interface Props {
  unit: CourseUnit;
  nodes: StudyNode[];
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
  progress,
  onContinue,
  onSelectArea,
  onSelectNode,
  dispatch,
}: Props) {
  const coreNodes = nodes.filter((n) => n.area !== "reference");
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
          <span>Back to {unit.name}</span>
        </button>
      </nav>

      {/* Unit Banner */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
            Unit Study Materials
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground mt-2 tracking-tight">
            {unit.name}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
            Master the vocabulary, natural collocations, contextual reading, and everyday
            expressions for {unit.name.toLowerCase()}.
          </p>
        </div>

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
            <span className="text-foreground">Activity Progress</span>
            <span className="text-primary font-mono text-base">{percent}%</span>
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
              {completedCoreNodes.length} of {coreNodes.length} activities completed
            </span>
            {reviewDueCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-wp-amber font-bold">
                <Clock className="size-4" />
                {reviewDueCount} {reviewDueCount === 1 ? "word" : "words"} in Review queue
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
            <span>Next Recommended Step</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            {continueNode ? continueNode.title : "Start Learning"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed">
            {continueNode?.description
              ? continueNode.description
              : continueNode?.estimatedMinutes
                ? `${continueNode.estimatedMinutes} min self-paced activity`
                : "Self-paced study module"}
          </p>
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <PrimaryButton onClick={onContinue} label="Continue" />
        </div>
      </div>

      {/* Structured Study Path */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold text-muted-foreground tracking-wider uppercase">
            Your Study Path
          </h2>
          <span className="text-xs font-bold text-muted-foreground">
            {completedCoreNodes.length} / {coreNodes.length} Done
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
                                  ? "border-wp-green bg-wp-green text-white"
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
                              {node.description && (
                                <span className="text-xs text-muted-foreground block truncate">
                                  {node.description}
                                </span>
                              )}
                            </div>
                          </div>
                          {node.estimatedMinutes && (
                            <span className="text-xs text-muted-foreground shrink-0 ms-3 font-medium bg-secondary/50 px-2.5 py-1 rounded-md">
                              {node.estimatedMinutes} min
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
                Language Toolkit
              </span>
              <h3 className="font-bold text-lg text-foreground mt-0.5 truncate">
                Reference &amp; Pronunciation Guide
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                Browse full vocabulary tables, word families, register, and pronunciation IPA
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary px-4 py-2 rounded-full bg-primary/10 shrink-0 ms-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors min-h-[44px]">
            <span>Open</span>
            <ArrowRight className="size-4" aria-hidden />
          </span>
        </button>
      </div>
    </div>
  );
}
