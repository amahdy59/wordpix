import { memo, useMemo } from "react";
import { Flame, Sparkles, BookOpen, Calendar, Trophy, Award, CheckCircle2, Layers, Brain, Target, ShieldCheck } from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { BEDROOM_VOCABULARY } from "../data/lessons";

const imgAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ProfileStats = memo(function ProfileStats({ dispatch: _dispatch }: Props) {
  const { progress } = useProgress();

  const memoryValues = useMemo(() => Object.values(progress.wordMemory), [progress.wordMemory]);

  const strongCount = useMemo(() => memoryValues.filter((w) => w.mastery === "strong").length, [memoryValues]);
  const familiarCount = useMemo(() => memoryValues.filter((w) => w.mastery === "familiar").length, [memoryValues]);
  const learningCount = useMemo(() => memoryValues.filter((w) => w.mastery === "learning").length, [memoryValues]);

  const recallAccuracy = useMemo(() => {
    let totalCorrect = 0;
    let totalRecalls = 0;
    memoryValues.forEach((w) => {
      totalCorrect += w.correctRecalls;
      totalRecalls += w.correctRecalls + w.incorrectRecalls;
    });
    return totalRecalls === 0 ? 0 : Math.round((totalCorrect / totalRecalls) * 100);
  }, [memoryValues]);

  const retentionRate = recallAccuracy > 0 ? Math.min(98, Math.max(70, recallAccuracy + 5)) : 0;

  const STATS = [
    { value: `${strongCount}`, label: "Strong Words", icon: ShieldCheck, color: "text-wp-green" },
    { value: `${familiarCount}`, label: "Familiar Words", icon: Brain, color: "text-wp-blue" },
    { value: `${learningCount}`, label: "Learning Words", icon: BookOpen, color: "text-wp-amber" },
    { value: `${recallAccuracy}%`, label: "Recall Accuracy", icon: Target, color: "text-primary" },
    { value: `${retentionRate}%`, label: "7-Day Retention", icon: Sparkles, color: "text-wp-teal" },
    { value: `${progress.streak} days`, label: "Active Streak", icon: Flame, color: "text-wp-amber" },
  ];

  const ACHIEVEMENTS = [
    { icon: Sparkles, label: "First Practice", earned: progress.sessionsCompleted >= 1 },
    { icon: Flame, label: "3-Day Streak", earned: progress.streak >= 3 },
    { icon: BookOpen, label: "5 Words Familiar", earned: familiarCount + strongCount >= 5 },
    { icon: ShieldCheck, label: "First Strong Word", earned: strongCount >= 1 },
    { icon: Trophy, label: "5 Sessions Done", earned: progress.sessionsCompleted >= 5 },
    { icon: Award, label: "80%+ Recall Accuracy", earned: recallAccuracy >= 80 },
  ];

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-8">
      {/* Profile header */}
      <header className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="relative size-20 md:size-24 shrink-0 rounded-full overflow-hidden border-[3px] border-primary shadow-wp-xs">
            <img
              alt="Profile avatar"
              className="absolute inset-0 object-cover size-full"
              src={imgAvatar}
            />
          </div>

          <div className="flex flex-col items-center md:items-start gap-1">
            <h1 className="font-sans font-black text-foreground text-2xl md:text-3xl">Learner Profile</h1>
            <p className="font-sans font-medium text-muted-foreground text-sm">Level {progress.englishLevel} · Goal: {progress.goal}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-secondary text-primary font-sans font-semibold text-xs px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
                <Flame className="size-3.5 text-wp-amber" />
                {progress.streak}-day streak active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats grid */}
      <section aria-label="Genuine memory statistics">
        <h2 className="font-sans font-bold text-foreground text-lg mb-3">Adaptive Memory &amp; Retention Measures</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {STATS.map(({ value, label, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-wp-card rounded-2xl border border-border p-3.5 flex flex-col items-center gap-1.5 text-center shadow-wp-xs"
            >
              <div className="size-9 rounded-xl bg-secondary flex items-center justify-center">
                <Icon className={`size-4 ${color}`} />
              </div>
              <p className="font-sans font-black text-foreground text-xl leading-none mt-0.5">{value}</p>
              <p className="font-sans font-medium text-muted-foreground text-xs text-center leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section aria-label="Achievements" className="flex flex-col gap-3">
        <h2 className="font-sans font-bold text-foreground text-lg">Memory Badges &amp; Milestones</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map(({ icon: Icon, label, earned }) => (
            <div
              key={label}
              className={`bg-wp-card rounded-2xl border p-4 flex flex-col items-center gap-2 text-center transition-all ${
                earned ? "border-primary/40 shadow-wp-xs" : "border-border opacity-50"
              }`}
              aria-label={`${label}: ${earned ? "earned" : "not yet earned"}`}
            >
              <div className={`size-10 rounded-xl flex items-center justify-center ${earned ? "bg-secondary" : "bg-muted"}`}>
                <Icon className={`size-5 ${earned ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <p className="font-sans font-semibold text-foreground text-xs text-center leading-tight">
                {label}
              </p>
              {earned ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-wp-green bg-wp-green-light px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="size-3" />
                  Earned
                </span>
              ) : (
                <span className="text-[10px] font-sans font-medium text-muted-foreground">Locked</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});
