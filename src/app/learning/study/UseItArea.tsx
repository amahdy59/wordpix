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
  onCompleteNode: (nodeId: string) => void;
  onNextActivity: () => void;
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
  onCompleteNode,
  onNextActivity,
}: Props) {
  if (!node) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
            Use in Context
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2">
            Apply in Everyday Situations
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">
            Explore authentic reading passages, spoken dialogues, idioms, common mistakes, and
            cultural insights.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {allNodes.map((n) => {
            const meta = USE_GOALS[n.type] || USE_GOALS.reading;
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                onClick={() => onSelectNode(n.id)}
                className="w-full text-start p-5 sm:p-6 rounded-3xl border border-border bg-card hover:bg-secondary/40 transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs group"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <span className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h2 className="font-bold text-lg text-foreground">{n.title}</h2>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {meta.goal}
                </p>
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
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8 space-y-8">
      {/* Activity Header with Learning Goal */}
      <div className="border-b border-border/70 pb-5">
        <div className="flex items-center gap-3.5 mb-2">
          <span className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0 shadow-2xs">
            <Icon className="size-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Use in Context · {currentIndex + 1} of {allNodes.length}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground truncate">
              {node.title}
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          {meta.goal}
        </p>
      </div>

      {/* Activity Content */}
      <div className="w-full">
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border/70 mt-12">
        {prevNode ? (
          <button
            onClick={() => onSelectNode(prevNode.id)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-border text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[48px]"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span>{prevNode.title}</span>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextNode ? (
          <button
            onClick={() => {
              onCompleteNode(node.id);
              onSelectNode(nextNode.id);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs min-h-[48px]"
          >
            <span>{nextNode.title}</span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        ) : (
          <button
            onClick={onNextActivity}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs min-h-[48px]"
          >
            <span>Continue to next activity</span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
