import { memo, useMemo, useState } from "react";
import { Flame, Sparkles, BookOpen, ShieldCheck, Target, Brain, Sliders, Moon, Sun, User as UserIcon, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { SettingsModal } from "./SettingsModal";
import { useTheme } from "../shared/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "../../features/auth/AuthModal";
import { staggerContainer, staggerItem } from "../shared/animations";

const imgAvatar = "/images/core/learner-avatar.webp";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ProfileStats = memo(function ProfileStats({ dispatch: _dispatch }: Props) {
  const { progress } = useProgress();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const dueCount = useMemo(() => {
    const now = Date.now();
    return memoryValues.filter((w) => !w.nextReviewAt || new Date(w.nextReviewAt).getTime() <= now)
      .length;
  }, [memoryValues]);

  const STATS = [
    { value: `${strongCount}`, label: "Strong Words", icon: ShieldCheck, color: "text-wp-green" },
    { value: `${familiarCount}`, label: "Familiar Words", icon: Brain, color: "text-wp-blue" },
    { value: `${learningCount}`, label: "Learning Words", icon: BookOpen, color: "text-wp-amber" },
    { value: `${recallAccuracy}%`, label: "Recall Accuracy", icon: Target, color: "text-primary" },
    { value: `${dueCount}`, label: "Due for Review", icon: Sparkles, color: "text-wp-teal" },
    { value: `${progress.streak} days`, label: "Active Streak", icon: Flame, color: "text-wp-amber" },
  ];

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 max-w-3xl mx-auto w-full p-5 md:p-8 pb-8"
    >
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Profile header with Settings Button */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div variants={staggerItem} className="flex flex-col md:flex-row items-center md:items-start gap-4">
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
        </motion.div>

        {/* Quick Settings & Theme Action Bar */}
        <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={toggleTheme}
            aria-label={`Theme: ${theme}. Activate to change theme.`}
            className="p-3 min-h-[44px] rounded-2xl bg-wp-card border border-border text-foreground hover:bg-muted transition-colors shadow-wp-xs flex items-center gap-2 font-sans font-bold text-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4 text-wp-amber" aria-hidden />
            ) : (
              <Moon className="size-4 text-wp-blue" aria-hidden />
            )}
            <span className="capitalize">{theme}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="p-3 min-h-[44px] rounded-2xl bg-wp-card border border-border text-foreground hover:bg-muted transition-colors shadow-wp-xs flex items-center gap-2 font-sans font-bold text-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Sliders className="size-4 text-muted-foreground" />
            <span>Settings</span>
          </motion.button>

          {user ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={signOut}
              className="px-4 min-h-[44px] rounded-2xl bg-primary/10 text-primary font-sans font-bold text-xs flex items-center gap-2 shadow-wp-xs hover:bg-primary/20 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <LogOut className="size-4" />
              <span className="hidden md:inline">{user.email}</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="px-4 min-h-[44px] rounded-2xl bg-primary text-primary-foreground font-sans font-bold text-xs flex items-center gap-2 shadow-wp-xs hover:opacity-90 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <UserIcon className="size-4" />
              <span>Sign In / Sync</span>
            </motion.button>
          )}
        </motion.div>
      </header>

      {/* Stats grid */}
      <motion.section variants={staggerItem} aria-label="Genuine memory statistics">
        <h2 className="font-sans font-bold text-foreground text-lg mb-3">Adaptive Memory &amp; Retention Measures</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {STATS.map(({ value, label, icon: Icon, color }) => (
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              key={label}
              className="bg-wp-card rounded-2xl border border-border p-3.5 flex flex-col items-center gap-1.5 text-center shadow-wp-xs transition-colors"
            >
              <div className="size-9 rounded-xl bg-secondary flex items-center justify-center">
                <Icon className={`size-4 ${color}`} />
              </div>
              <p className="font-sans font-black text-foreground text-xl leading-none mt-0.5">{value}</p>
              <p className="font-sans font-medium text-muted-foreground text-xs text-center leading-tight">{label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
});
