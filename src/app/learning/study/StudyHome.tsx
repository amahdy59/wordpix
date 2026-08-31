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

  const continueNode = progress.lastNodeId
    ? nodes.find((n) => n.id === progress.lastNodeId)
    : nodes[0];

  const getAreaNodes = (area: StudyArea) => nodes.filter((n) => n.area === area);

  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-8 overflow-y-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id })}
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg py-1 px-2 -ms-2 min-h-[44px]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span>Back to {unit.name}</span>
        </button>
      </nav>

      {/* Unit Banner */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Unit Study Materials
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-1">{unit.name}</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
            Master the vocabulary, collocations, and natural expressions needed for everyday
            situations.
          </p>
        </div>

        {unit.heroImage && (
          <div className="rounded-2xl overflow-hidden bg-muted aspect-[2.2/1] relative border border-border/50 shadow-sm">
            <img
              src={resolveAssetUrl(unit.heroImage)}
              alt={`${unit.name} environment scene`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Progress Summary Card */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-foreground">Course Completion</span>
            <span className="text-primary">{percent}%</span>
          </div>

          {/* Accessible Progress Bar */}
          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${percent}%` }}
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Overall unit study progress: ${percent}%`}
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground pt-1">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-wp-green" />
              {completedCoreNodes.length} of {coreNodes.length} activities completed
            </span>
            {reviewDueCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-wp-amber font-bold">
                <Clock className="size-4" />
                {reviewDueCount} {reviewDueCount === 1 ? "word" : "words"} due for review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Continue Action */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-start">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Next Recommended Step
          </span>
          <h2 className="text-lg font-bold text-foreground mt-0.5">
            {continueNode ? continueNode.title : "Start Learning"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {continueNode?.estimatedMinutes
              ? `${continueNode.estimatedMinutes} min activity`
              : "Self-paced study"}
          </p>
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <PrimaryButton onClick={onContinue} label="Continue" />
        </div>
      </div>

      {/* Structured Study Path */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold text-muted-foreground tracking-wider uppercase">
          Your Study Path
        </h2>

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
                className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{meta.label}</h3>
                      <p className="text-xs text-muted-foreground">{meta.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    {completedCount} / {areaNodes.length}
                  </span>
                </div>

                <ul className="space-y-2 pt-2 border-t border-border/50">
                  {areaNodes.map((node) => {
                    const isDone = progress.completedNodeIds.includes(node.id);
                    return (
                      <li key={node.id}>
                        <button
                          type="button"
                          onClick={() => onSelectNode(node.id)}
                          className="w-full text-start p-3 rounded-xl hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-between group min-h-[44px] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`size-5 rounded-full border flex items-center justify-center shrink-0 ${
                                isDone
                                  ? "border-primary bg-primary text-primary-foreground"
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
                              <span className="font-medium text-sm text-foreground block truncate">
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
                            <span className="text-xs text-muted-foreground shrink-0 ms-2 font-medium">
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

      {/* Reference Section (Utility separated from progress) */}
      <div className="pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => onSelectArea("reference")}
          className="w-full text-start p-5 rounded-2xl border border-border/80 bg-gradient-to-r from-card to-secondary/30 hover:border-primary/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-4">
            <span className="p-3 rounded-xl bg-primary text-primary-foreground">
              <LibraryBig className="size-6" aria-hidden />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Language Toolkit
              </span>
              <h3 className="font-bold text-lg text-foreground">
                Reference &amp; Pronunciation Guide
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Browse full vocabulary tables, word families, and pronunciation IPA
              </p>
            </div>
          </div>
          <span className="text-sm font-bold text-primary px-3 py-1.5 rounded-full bg-primary/10 shrink-0 ms-3">
            Open &rarr;
          </span>
        </button>
      </div>
    </div>
  );
}
