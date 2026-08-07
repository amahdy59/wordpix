import { memo } from "react";
import { Flame, Sparkles, BookOpen, Calendar, Trophy, Award, CheckCircle2, Layers } from "lucide-react";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { BEDROOM_VOCABULARY } from "../data/lessons";

const imgAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ProfileStats = memo(function ProfileStats({ dispatch: _dispatch }: Props) {
  const { progress } = useProgress();

  const wordsLearnedCount = Object.keys(progress.wordMastery).length;
  const totalBedroomWords = BEDROOM_VOCABULARY.length;

  const STATS = [
    { value: `${progress.streak}`, label: "Day Streak", icon: Flame, color: "text-wp-amber" },
    { value: `${progress.xp}`, label: "XP Points", icon: Sparkles, color: "text-primary" },
    { value: `${wordsLearnedCount}`, label: "Words Practiced", icon: BookOpen, color: "text-wp-green" },
    { value: `${progress.sessionsCompleted}`, label: "Sessions Completed", icon: Layers, color: "text-wp-blue" },
    { value: `${progress.dailyGoalMinutes} min`, label: "Daily Goal", icon: Calendar, color: "text-wp-teal" },
    { value: `${progress.daysActive}`, label: "Days Active", icon: Calendar, color: "text-wp-slate" },
  ];

  const ACHIEVEMENTS = [
    { icon: Sparkles, label: "First Session", earned: progress.sessionsCompleted >= 1 },
    { icon: Flame, label: "3-Day Streak", earned: progress.streak >= 3 },
    { icon: BookOpen, label: "10 Words Learned", earned: wordsLearnedCount >= 10 },
    { icon: Trophy, label: "5 Sessions Completed", earned: progress.sessionsCompleted >= 5 },
    { icon: Award, label: "Bedroom Master", earned: wordsLearnedCount >= totalBedroomWords },
    { icon: Flame, label: "7-Day Streak", earned: progress.streak >= 7 },
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
            <p className="font-sans font-medium text-muted-foreground text-sm">Level {progress.englishLevel} Visual Explorer</p>
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
      <section aria-label="Learning statistics">
        <h2 className="font-sans font-bold text-foreground text-lg mb-3">Your Progress Statistics</h2>
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
        <h2 className="font-sans font-bold text-foreground text-lg">Badges &amp; Achievements</h2>
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
