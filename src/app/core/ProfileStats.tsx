import { memo, useMemo, useState } from "react";
import {
  Flame,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Target,
  Brain,
  User as UserIcon,
  LogOut,
  Eye,
  Ear,
  MessageSquareText,
  PenLine,
  Mic,
  Route,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Action } from "../types";
import { useProgress } from "../data/progress";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "../../features/auth/AuthModal";
import { staggerContainer, staggerItem } from "../shared/animations";
import { LearnerAvatar } from "../shared/LearnerAvatar";
import { useI18n } from "../context/I18nContext";
import { Button, EmptyState, PageContainer, PageHeader, Surface } from "../shared";
import { summarizeSkillMastery, type MasteryDimension } from "../../features/gamification/sm2";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const ProfileStats = memo(function ProfileStats({ dispatch }: Props) {
  const { t } = useI18n();
  const { progress } = useProgress();
  const { user, signOut } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const memoryValues = useMemo(() => Object.values(progress.wordMemory), [progress.wordMemory]);

  const strongCount = useMemo(
    () => memoryValues.filter((w) => w.mastery === "strong").length,
    [memoryValues]
  );
  const familiarCount = useMemo(
    () => memoryValues.filter((w) => w.mastery === "familiar").length,
    [memoryValues]
  );
  const learningCount = useMemo(
    () => memoryValues.filter((w) => w.mastery === "learning").length,
    [memoryValues]
  );

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

  const skillSummaries = useMemo(() => summarizeSkillMastery(memoryValues), [memoryValues]);
  const skillMeta: Record<
    MasteryDimension,
    { label: string; description: string; icon: typeof Eye }
  > = {
    "visual-recognition": {
      label: t("profile.skillVisual"),
      description: t("profile.skillVisualDesc"),
      icon: Eye,
    },
    "listening-recognition": {
      label: t("profile.skillListening"),
      description: t("profile.skillListeningDesc"),
      icon: Ear,
    },
    "contextual-comprehension": {
      label: t("profile.skillContext"),
      description: t("profile.skillContextDesc"),
      icon: MessageSquareText,
    },
    "controlled-production": {
      label: t("profile.skillGuidedProduction"),
      description: t("profile.skillGuidedProductionDesc"),
      icon: PenLine,
    },
    "spoken-production": {
      label: t("profile.skillSpeaking"),
      description: t("profile.skillSpeakingDesc"),
      icon: Mic,
    },
    "independent-transfer": {
      label: t("profile.skillTransfer"),
      description: t("profile.skillTransferDesc"),
      icon: Route,
    },
  };

  const STATS = [
    {
      value: `${strongCount}`,
      label: t("profile.strongWords"),
      icon: ShieldCheck,
      color: "text-wp-green",
    },
    {
      value: `${familiarCount}`,
      label: t("profile.familiarWords"),
      icon: Brain,
      color: "text-wp-blue",
    },
    {
      value: `${learningCount}`,
      label: t("profile.learningWords"),
      icon: BookOpen,
      color: "text-wp-amber",
    },
    {
      value: `${recallAccuracy}%`,
      label: t("profile.recallAccuracy"),
      icon: Target,
      color: "text-primary",
    },
    {
      value: `${dueCount}`,
      label: t("profile.dueForReview"),
      icon: Sparkles,
      color: "text-wp-teal",
    },
    {
      value: t("profile.dayCount", { count: progress.streak }),
      label: t("profile.activeStreak"),
      icon: Flame,
      color: "text-wp-amber",
    },
  ];

  return (
    <PageContainer size="wide">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex w-full flex-col gap-6 pb-8"
      >
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

        <PageHeader
          variant="plain"
          title={t("profile.title")}
          subtitle={t("profile.levelGoal", {
            level: progress.englishLevel,
            goal: t(`profile.goals.${progress.goal}`),
          })}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] xl:items-stretch">
          {/* Profile identity and account actions */}
          <Surface
            as="header"
            variant="card"
            radius="xl"
            padding="md"
            className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between xl:flex-col xl:items-stretch"
          >
            <motion.div variants={staggerItem} className="flex flex-row items-center gap-4">
              <div className="relative size-12 md:size-24 shrink-0 rounded-full overflow-hidden border-[3px] border-primary shadow-wp-xs">
                <LearnerAvatar />
              </div>

              <div className="flex flex-col items-center md:items-start gap-1">
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-secondary text-primary font-sans font-semibold text-xs px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
                    <Flame className="size-3.5 text-wp-amber" />
                    {progress.streak > 0
                      ? t("profile.streakActive", { streak: progress.streak })
                      : t("profile.streakReady")}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Account actions; global appearance and accessibility live in the sidebar. */}
            <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-2.5">
              {user ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={signOut}
                  aria-label={t("profile.signOut")}
                  iconLeft={<LogOut className="size-4" aria-hidden />}
                >
                  <span>{t("profile.signOut")}</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  iconLeft={<UserIcon className="size-4" aria-hidden />}
                >
                  {t("profile.signInSync")}
                </Button>
              )}
            </motion.div>
          </Surface>

          {/* Stats grid */}
          <motion.section
            variants={staggerItem}
            aria-label={t("profile.statsAria")}
            className="flex min-w-0 flex-col"
          >
            <h2 className="mb-3 font-sans text-lg font-bold text-foreground">
              {t("profile.retentionMeasures")}
            </h2>
            {memoryValues.length === 0 ? (
              <EmptyState
                titleAs="p"
                title={t("profile.statsEmptyTitle")}
                description={t("profile.statsEmptyHint")}
                icon={<Brain className="size-6" aria-hidden />}
                className="min-h-48 flex-1"
                action={
                  <Button onClick={() => dispatch({ type: "GO", to: "practice" })}>
                    {t("dashboard.practiseSkill")}
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {STATS.map(({ value, label, icon: Icon, color }) => (
                  <Surface
                    key={label}
                    variant="card"
                    radius="lg"
                    padding="xs"
                    className="flex flex-col items-center gap-1.5 text-center"
                  >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-secondary">
                      <Icon className={`size-4 ${color}`} />
                    </div>
                    <p className="mt-0.5 font-sans text-xl font-black leading-none text-foreground">
                      {value}
                    </p>
                    <p className="text-center font-sans text-xs font-medium leading-tight text-muted-foreground">
                      {label}
                    </p>
                  </Surface>
                ))}
              </div>
            )}
          </motion.section>
        </div>

        <motion.section variants={staggerItem} aria-labelledby="skill-mastery-heading">
          <div className="mb-3">
            <h2 id="skill-mastery-heading" className="font-sans text-lg font-bold text-foreground">
              {t("profile.skillMasteryTitle")}
            </h2>
            <p className="mt-1 max-w-3xl font-sans text-sm leading-relaxed text-muted-foreground">
              {t("profile.skillMasteryDescription")}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {skillSummaries.map((summary) => {
              const meta = skillMeta[summary.dimension];
              const Icon = meta.icon;
              return (
                <Surface
                  key={summary.dimension}
                  variant="card"
                  radius="lg"
                  padding="sm"
                  className="flex min-w-0 flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-sans text-sm font-bold text-foreground">{meta.label}</h3>
                      <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                  {summary.attempts > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="font-semibold text-foreground">
                          {t("profile.skillEvidence", {
                            established: summary.establishedWords,
                            practiced: summary.practicedWords,
                          })}
                        </span>
                        <span className="font-black text-primary">
                          {t("profile.skillAccuracy", { percent: summary.accuracy })}
                        </span>
                      </div>
                      <progress
                        value={summary.accuracy}
                        max={100}
                        aria-label={t("profile.skillProgressAria", {
                          skill: meta.label,
                          percent: summary.accuracy,
                        })}
                        className="h-2 w-full overflow-hidden rounded-full accent-primary"
                      />
                    </div>
                  ) : (
                    <p className="rounded-xl border border-border bg-secondary/40 p-3 font-sans text-xs font-semibold text-muted-foreground">
                      {t("profile.skillNotPracticed")}
                    </p>
                  )}
                </Surface>
              );
            })}
          </div>
        </motion.section>
      </motion.div>
    </PageContainer>
  );
});
