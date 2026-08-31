import type { StudyNode } from "./types";
import type { UnitLearningMaterials } from "../types";
import {
  PassageSection,
  PhrasesSection,
  DialogueSection,
  MistakesSection,
  CultureSection,
} from "../LearningMaterialsScreen";
import type { VocabularyItem } from "../../data/lessons";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Quote,
  AlertTriangle,
  Globe,
} from "lucide-react";

interface Props {
  node: StudyNode | undefined;
  materials: UnitLearningMaterials;
  onSelectNode: (nodeId: string) => void;
  allNodes: StudyNode[];
  unitId: string;
  onInspectWord: (word: VocabularyItem) => void;
}

const USE_GOALS: Record<string, { goal: string; icon: typeof BookOpen }> = {
  reading: {
    goal: "Read natural English in context and test your comprehension.",
    icon: BookOpen,
  },
  phrases: {
    goal: "Learn key conversational idioms, phrasal verbs, and daily collocations.",
    icon: Quote,
  },
  dialogue: {
    goal: "Follow a realistic dialogue and learn natural conversational flow.",
    icon: MessageSquare,
  },
  mistakes: {
    goal: "Learn to recognize and avoid common vocabulary and grammar mistakes.",
    icon: AlertTriangle,
  },
  culture: {
    goal: "Discover everyday cultural context and etiquette notes.",
    icon: Globe,
  },
};

export function UseItArea({
  node,
  materials,
  onSelectNode,
  allNodes,
  unitId,
  onInspectWord,
}: Props) {
  if (!node) {
    return (
      <div className="p-8 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-2">Use It</h2>
        <p className="text-muted-foreground mb-6">
          Apply your vocabulary across authentic reading, conversation, and usage scenarios.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {allNodes.map((n) => {
            const meta = USE_GOALS[n.type] || USE_GOALS.reading;
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                onClick={() => onSelectNode(n.id)}
                className="w-full text-start p-5 rounded-2xl border border-border bg-card hover:bg-secondary/40 transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-bold text-lg text-foreground">{n.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{meta.goal}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const currentIndex = allNodes.findIndex((n) => n.id === node.id);
  const prevNode = currentIndex > 0 ? allNodes[currentIndex - 1] : null;
  const nextNode = currentIndex < allNodes.length - 1 ? allNodes[currentIndex + 1] : null;
  const meta = USE_GOALS[node.type] || USE_GOALS.reading;
  const Icon = meta.icon;

  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-8 space-y-8">
      {/* Activity Header with Learning Goal */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <Icon className="size-6" aria-hidden />
          </span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Use in Context · {currentIndex + 1} of {allNodes.length}
            </span>
            <h2 className="text-2xl font-bold text-foreground">{node.title}</h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">{meta.goal}</p>
      </div>

      {/* Activity Content */}
      <div className="max-w-2xl">
        {node.type === "reading" && (
          <PassageSection materials={materials} unitId={unitId} onInspectWord={onInspectWord} />
        )}
        {node.type === "phrases" && (
          <div className="space-y-8">
            <PhrasesSection materials={materials} />
          </div>
        )}
        {node.type === "dialogue" && (
          <DialogueSection materials={materials} unitId={unitId} onInspectWord={onInspectWord} />
        )}
        {node.type === "mistakes" && <MistakesSection materials={materials} />}
        {node.type === "culture" && <CultureSection materials={materials} />}
      </div>

      {/* Previous / Next Activity Navigation Footer */}
      <div className="flex justify-between items-center pt-6 border-t border-border mt-12">
        {prevNode ? (
          <button
            onClick={() => onSelectNode(prevNode.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span>{prevNode.title}</span>
          </button>
        ) : (
          <div />
        )}

        {nextNode ? (
          <button
            onClick={() => onSelectNode(nextNode.id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm min-h-[44px]"
          >
            <span>{nextNode.title}</span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
