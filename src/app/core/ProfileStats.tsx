import { memo } from "react";
import type { Action } from "../types";

const imgAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const STATS = [
  { value: "7",   label: "Day Streak",    ar: "أيام متتالية", emoji: "🔥" },
  { value: "240", label: "XP Points",     ar: "نقاط XP",      emoji: "⭐" },
  { value: "45",  label: "Words Learned", ar: "كلمة متعلمة",  emoji: "📚" },
  { value: "3",   label: "Worlds Done",   ar: "عوالم مكتملة",  emoji: "🌍" },
  { value: "92%", label: "Accuracy",      ar: "دقة الإجابات",  emoji: "🎯" },
  { value: "18",  label: "Days Active",   ar: "أيام نشطة",    emoji: "📅" },
];

const ACHIEVEMENTS = [
  { emoji: "🔥", label: "7-Day Streak",   ar: "سلسلة 7 أيام",  earned: true  },
  { emoji: "⭐", label: "First Lesson",   ar: "الدرس الأول",    earned: true  },
  { emoji: "🏆", label: "World Complete", ar: "عالم مكتمل",    earned: true  },
  { emoji: "📖", label: "50 Words",       ar: "50 كلمة",        earned: false },
  { emoji: "🌍", label: "Explorer",       ar: "مستكشف",         earned: false },
  { emoji: "💎", label: "30-Day Streak",  ar: "سلسلة 30 يوم",  earned: false },
];

export const ProfileStats = memo(function ProfileStats({ dispatch: _dispatch }: Props) {
  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 pb-8">
      {/* Profile header */}
      <header className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          {/* Avatar */}
          <div className="relative size-20 md:size-24 shrink-0 rounded-full overflow-hidden border-[3px] border-primary">
            <img
              alt="Profile avatar"
              className="absolute inset-0 object-cover size-full"
              src={imgAvatar}
            />
          </div>

          {/* Name + level */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <h1 className="font-sans font-black text-foreground text-2xl md:text-3xl">Ahmad</h1>
            <p className="font-sans font-medium text-muted-foreground text-sm">Level 3 Explorer</p>
            <p
              className="font-arabic font-medium text-primary text-sm"
              dir="auto"
              lang="ar"
            >
              مستكشف المستوى 3
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-secondary text-primary font-sans font-semibold text-xs px-3 py-1 rounded-full border border-primary/20">
                🔥 7-day streak
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats grid */}
      <section aria-label="Learning statistics">
        <h2 className="font-sans font-bold text-foreground text-lg mb-3">Statistics</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {STATS.map(({ value, label, ar, emoji }) => (
            <div
              key={label}
              className="bg-wp-card rounded-2xl border border-border p-3 flex flex-col items-center gap-1 text-center shadow-wp-xs"
            >
              <span className="text-xl leading-none" aria-hidden>{emoji}</span>
              <p className="font-sans font-black text-foreground text-xl leading-none mt-0.5">{value}</p>
              <p className="font-sans font-medium text-muted-foreground text-[10px] text-center leading-tight">{label}</p>
              <p
                className="font-arabic text-primary text-[10px]"
                dir="auto"
                lang="ar"
              >
                {ar}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section aria-label="Achievements" className="flex flex-col gap-3">
        <h2 className="font-sans font-bold text-foreground text-lg">Achievements</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map(({ emoji, label, ar, earned }) => (
            <div
              key={label}
              className={`bg-wp-card rounded-2xl border p-3 flex flex-col items-center gap-1 text-center ${
                earned ? "border-primary shadow-wp-xs" : "border-border opacity-50"
              }`}
              aria-label={`${label}: ${earned ? "earned" : "not yet earned"}`}
            >
              <span className={`text-2xl leading-none ${!earned ? "grayscale" : ""}`} aria-hidden>
                {emoji}
              </span>
              <p className="font-sans font-semibold text-foreground text-[10px] text-center leading-tight mt-0.5">
                {label}
              </p>
              <p
                className="font-arabic text-muted-foreground text-[9px] text-center"
                dir="auto"
                lang="ar"
              >
                {ar}
              </p>
              {earned && (
                <div
                  className="bg-accent rounded-full size-4 flex items-center justify-center mt-0.5"
                  aria-hidden
                >
                  <span className="font-sans font-black text-primary-foreground text-[8px]">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});
