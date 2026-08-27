import type { CourseUnit } from "../../data/lessons";
import type { StudyNode, UnitStudyProgress, StudyArea } from "./types";
import type { Action } from "../../types";
import { PrimaryButton } from "../../shared/PrimaryButton";

interface Props {
  unit: CourseUnit;
  nodes: StudyNode[];
  progress: UnitStudyProgress;
  onContinue: () => void;
  onSelectArea: (area: StudyArea) => void;
  onSelectNode: (nodeId: string) => void;
  dispatch: React.Dispatch<Action>;
}

export function StudyHome({
  unit,
  nodes,
  progress,
  onContinue,
  onSelectArea,
  onSelectNode,
  dispatch,
}: Props) {
  const completedCount = progress.completedNodeIds.length;
  const totalCount = nodes.length;
  const percent = Math.round((completedCount / (totalCount || 1)) * 100);

  const getAreaNodes = (area: StudyArea) => nodes.filter((n) => n.area === area);

  function renderNodeList(area: StudyArea, showDescription = false) {
    return getAreaNodes(area).map((n) => (
      <button
        key={n.id}
        type="button"
        onClick={() => onSelectNode(n.id)}
        className="w-full text-start p-3 rounded-lg hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center group min-h-[44px]"
        aria-label={n.title}
      >
        <span className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 me-3 flex-shrink-0 flex items-center justify-center group-hover:border-primary">
          {progress.completedNodeIds.includes(n.id) && (
            <span className="w-3 h-3 bg-primary rounded-full" />
          )}
        </span>
        <span>
          <span className="font-medium block">{n.title}</span>
          {showDescription && n.description && (
            <span className="text-xs text-muted-foreground">{n.description}</span>
          )}
        </span>
      </button>
    ));
  }

  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-8 overflow-y-auto">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "lesson-entry", unitId: unit.id })}
          className="text-sm font-medium text-muted-foreground hover:text-foreground mb-4 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          {"\u2190"} {unit.name}
        </button>
        <h1 className="text-3xl font-bold mb-2">STUDY</h1>
        <h2 className="text-xl font-medium mb-4">{unit.name}</h2>
        <p className="text-muted-foreground mb-6">
          Learn the words and expressions you need for everyday situations.
        </p>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
          <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
        <div className="text-sm text-muted-foreground">{percent}% complete</div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-12 shadow-sm text-center">
        <h3 className="text-lg font-semibold mb-2">Continue learning</h3>
        <p className="text-muted-foreground mb-6">
          {progress.lastNodeId
            ? nodes.find((n) => n.id === progress.lastNodeId)?.title || "Your path"
            : "Essential Words"}
        </p>
        <div className="max-w-xs mx-auto">
          <PrimaryButton onClick={onContinue} label="Continue" />
        </div>
      </div>

      <div className="space-y-12">
        <h3 className="text-sm font-bold text-muted-foreground tracking-wider uppercase mb-6">
          Your Study Path
        </h3>

        {(["learn", "use", "practice", "reference"] as StudyArea[]).map((area) => (
          <section key={area}>
            <button
              type="button"
              onClick={() => onSelectArea(area)}
              className="text-xl font-semibold mb-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded block w-full text-start uppercase"
            >
              {area === "use" ? "USE IT" : area}
            </button>
            <div className="space-y-2">{renderNodeList(area, area === "learn")}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
