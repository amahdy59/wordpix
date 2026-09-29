import { useState, useMemo, type Dispatch, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Award,
  Tag,
  Hourglass,
} from "lucide-react";
import type { Action } from "../../types";
import { useI18n } from "../../../i18n";
import { useLearner } from "../../context/LearnerContext";
import { BUSINESS_UNITS } from "./businessCatalog";
import {
  BUSINESS_SECTION_MILESTONES,
  type BusinessCefrLevel,
  type BusinessUnitProgress,
} from "./businessTypes";
import { resolveAssetUrl } from "../../../utils/assetUrl";
import { Button, CurriculumTopicCard } from "../../shared";

interface Props {
  dispatch: Dispatch<Action>;
}

const EMPTY_BUSINESS_PROGRESS: Record<string, BusinessUnitProgress> = {};

const CEFR_TABS: { id: "ALL" | BusinessCefrLevel; label: string; count: number }[] = [
  { id: "ALL", label: "All Units", count: BUSINESS_UNITS.length },
  {
    id: "B1",
    label: "B1 Foundations",
    count: BUSINESS_UNITS.filter((u) => u.level === "B1").length,
  },
  {
    id: "B2",
    label: "B2 Collaboration",
    count: BUSINESS_UNITS.filter((u) => u.level === "B2").length,
  },
  {
    id: "C1",
    label: "C1 Leadership",
    count: BUSINESS_UNITS.filter((u) => u.level === "C1").length,
  },
  { id: "C2", label: "C2 Executive", count: BUSINESS_UNITS.filter((u) => u.level === "C2").length },
];

const DOMAIN_TAGS = [
  "All Topics",
  "#Meetings",
  "#Negotiation",
  "#Leadership",
  "#Crisis & Strategy",
  "#Sales & Pitching",
  "#Teamwork",
] as const;

export function BusinessCurriculumScreen({ dispatch }: Props) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const [selectedLevel, setSelectedLevel] = useState<"ALL" | BusinessCefrLevel>("ALL");
  const [selectedTag, setSelectedTag] = useState<string>("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  const progressState = learnerState.businessProgress ?? EMPTY_BUSINESS_PROGRESS;

  // Stats
  const masteredCount = useMemo(() => {
    return Object.values(progressState).filter((p) => p.status === "mastered").length;
  }, [progressState]);

  const inProgressCount = useMemo(() => {
    return Object.values(progressState).filter(
      (p) => p.status === "in-progress" && p.completedStages.length > 0
    ).length;
  }, [progressState]);

  const completionPercent = Math.round((masteredCount / BUSINESS_UNITS.length) * 100);

  // Resume or start unit
  const continueUnit = useMemo(() => {
    const active = BUSINESS_UNITS.find((u) => {
      const p = progressState[u.id];
      return p && p.status === "in-progress";
    });
    if (active) return active;
    const firstUnmastered = BUSINESS_UNITS.find((u) => progressState[u.id]?.status !== "mastered");
    return firstUnmastered ?? BUSINESS_UNITS[0];
  }, [progressState]);

  // Filtered units
  const filteredUnits = useMemo(() => {
    let units = BUSINESS_UNITS;
    if (selectedLevel !== "ALL") {
      units = units.filter((u) => u.level === selectedLevel);
    }
    if (selectedTag !== "All Topics") {
      units = units.filter((u) => (u.tags || []).includes(selectedTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      units = units.filter(
        (u) =>
          u.title.toLowerCase().includes(q) ||
          u.essentialQuestion.toLowerCase().includes(q) ||
          u.speakingGoal.toLowerCase().includes(q) ||
          `unit ${u.unitNumber}`.includes(q) ||
          u.sectionTitle.toLowerCase().includes(q) ||
          (u.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return units;
  }, [selectedLevel, selectedTag, searchQuery]);

  const handleLevelKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + CEFR_TABS.length) % CEFR_TABS.length;
    setSelectedLevel(CEFR_TABS[nextIndex].id);
    const buttons =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div
      className="h-full min-h-0 overflow-y-auto bg-background pb-24 overscroll-y-contain"
      aria-labelledby="business-curriculum-title"
    >
      <div className="wp-container-content wp-layout-gutter flex flex-col gap-6 py-4 sm:py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "GO", to: "explore" })}
          className="w-fit"
          iconLeft={<ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />}
        >
          {t("business.backToExplore")}
        </Button>

        {/* Hero Section */}
        <header className="flex flex-col gap-4 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-10 shadow-wp-sm">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-black text-primary uppercase tracking-wider">
              <Briefcase className="size-3.5" aria-hidden />
              {t("business.heroBadge")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
              {t("business.heroLevelPill")}
            </span>
          </div>

          <div>
            <h1
              id="business-curriculum-title"
              className="text-2xl sm:text-4xl font-black text-foreground tracking-tight"
            >
              {t("business.title")}
            </h1>
            <p className="mt-2 text-base sm:text-lg font-medium text-muted-foreground leading-relaxed max-w-3xl">
              {t("business.heroSubtitle")}
            </p>
          </div>

          {/* Progress Overview Bar */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/80">
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 border border-border">
              <CheckCircle2 className="size-8 text-accent shrink-0" aria-hidden />
              <div>
                <p className="text-xl font-black text-foreground">
                  {t("business.masteredStats", {
                    mastered: masteredCount,
                    total: 40,
                    percent: completionPercent,
                  })}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {t("business.unitsMasteredLabel")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 border border-border">
              <Clock className="size-8 text-primary shrink-0" aria-hidden />
              <div>
                <p className="text-xl font-black text-foreground">{inProgressCount}</p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {t("business.inProgressBadge")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-card p-4 border border-border sm:col-span-1">
              <div className="flex items-center gap-3 min-w-0">
                {continueUnit.heroImageSrc && (
                  <div className="size-12 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-muted/40 relative">
                    <img
                      src={resolveAssetUrl(continueUnit.heroImageSrc)}
                      alt=""
                      aria-hidden="true"
                      className="size-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-muted-foreground uppercase">
                    {t("business.nextLessonLabel")}
                  </p>
                  <p className="text-sm font-black text-foreground truncate">
                    {t("business.unitColonTitle", {
                      number: continueUnit.unitNumber,
                      title: continueUnit.title,
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "OPEN_BUSINESS_LESSON",
                    unitId: continueUnit.id,
                  })
                }
                className="shrink-0 inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground shadow-wp-xs hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span>{t("business.continueCta")}</span>
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </button>
            </div>
          </div>
        </header>

        {/* Executive Milestone Credentials Section */}
        <section
          aria-labelledby="credentials-heading"
          className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-wp-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-primary" aria-hidden />
              <h2 id="credentials-heading" className="text-lg font-black text-foreground">
                {t("business.credentialsTitle")}
              </h2>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {t("business.credentialsSubtitle")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {BUSINESS_SECTION_MILESTONES.map((milestone) => {
              const sectionUnits = BUSINESS_UNITS.filter(
                (u) => u.sectionNumber === milestone.sectionNumber
              );
              const sectionMastered = sectionUnits.filter(
                (u) => progressState[u.id]?.status === "mastered"
              ).length;
              const isSectionCertified =
                sectionUnits.length > 0 && sectionMastered === sectionUnits.length;
              const isStarted = sectionMastered > 0;

              return (
                <div
                  key={milestone.sectionNumber}
                  className={`flex flex-col justify-between p-4 rounded-2xl border transition-all ${
                    isSectionCertified
                      ? "border-accent/40 bg-accent/5 shadow-wp-xs ring-1 ring-accent/30"
                      : isStarted
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-muted/20 opacity-80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl" role="img" aria-label={milestone.title}>
                      {milestone.badge}
                    </span>
                    {isSectionCertified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-black text-accent uppercase">
                        <CheckCircle2 className="size-3" aria-hidden />
                        {t("business.certifiedBadge")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        {t("business.sectionUnitsCount", {
                          mastered: sectionMastered,
                          total: sectionUnits.length,
                        })}
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-primary/15 px-1.5 py-0.2 text-[10px] font-black text-primary">
                        {milestone.level}
                      </span>
                      <h3 className="text-sm font-black text-foreground line-clamp-1">
                        {milestone.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground font-medium line-clamp-2">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Controls: Search and CEFR Level Filter */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* CEFR Level Tabs */}
            <div
              role="tablist"
              aria-label="Filter by CEFR Level"
              className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-1.5 shadow-wp-xs"
            >
              {CEFR_TABS.map((tab, idx) => {
                const isSelected = selectedLevel === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onKeyDown={(e) => handleLevelKeyDown(e, idx)}
                    onClick={() => setSelectedLevel(tab.id)}
                    className={`flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-wp-xs"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative min-w-[260px]">
              <Search
                className="absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search units, topics, or skills..."
                aria-label="Search Business English units"
                className="min-h-11 w-full rounded-2xl border border-border bg-card py-2.5 ps-10 pe-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-wp-xs"
              />
            </div>
          </div>

          {/* Domain / Competency Topic Filter Pills */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto py-1"
            role="toolbar"
            aria-label="Filter by Topic"
          >
            <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground me-1 shrink-0">
              <Tag className="size-3" aria-hidden />
              {t("business.topicsLabel")}
            </span>
            {DOMAIN_TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-foreground text-background shadow-wp-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Units Grid */}
        <section aria-label="Business English Units">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUnits.map((unit) => {
              const progress = progressState[unit.id];
              const isMastered = progress?.status === "mastered";
              const isInProgress =
                progress?.status === "in-progress" &&
                (progress.completedStages.length > 0 || progress.currentStage > 0);
              const tooltipText = [
                unit.essentialQuestion ? `“${unit.essentialQuestion}”` : "",
                unit.speakingGoal ? `${t("business.goalPrefix")}${unit.speakingGoal}` : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <CurriculumTopicCard
                  key={unit.id}
                  numberBadge={unit.unitNumber}
                  levelBadge={unit.level}
                  isMastered={isMastered}
                  eyebrow={unit.tags?.[0]}
                  title={unit.title}
                  imageSrc={unit.heroImageSrc ? resolveAssetUrl(unit.heroImageSrc) : undefined}
                  fallbackIcon={<Briefcase className="size-10" aria-hidden />}
                  priority={unit.unitNumber <= 3}
                  tooltipText={tooltipText}
                  statusIcon={
                    isMastered ? (
                      <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
                    ) : isInProgress ? (
                      <Clock className="size-3.5 shrink-0" aria-hidden />
                    ) : unit.estimatedMinutes ? (
                      <Hourglass className="size-3.5 shrink-0" aria-hidden />
                    ) : undefined
                  }
                  statusText={
                    isMastered
                      ? t("business.masteredBadge")
                      : isInProgress
                        ? t("business.stageFraction", {
                            current: progress.currentStage + 1,
                            total: 8,
                          })
                        : unit.estimatedMinutes
                          ? t("business.estimatedMinutes", { minutes: unit.estimatedMinutes })
                          : t("business.termsAndSteps", { count: unit.languageBank.length })
                  }
                  statusClassName={
                    isMastered
                      ? "text-accent"
                      : isInProgress
                        ? "text-primary"
                        : "text-muted-foreground font-semibold"
                  }
                  actionLabel={
                    isMastered
                      ? t("business.reviewUnitCta")
                      : isInProgress
                        ? t("business.resumeCta")
                        : t("business.startUnitCta")
                  }
                  onClick={() =>
                    dispatch({
                      type: "OPEN_BUSINESS_LESSON",
                      unitId: unit.id,
                    })
                  }
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
