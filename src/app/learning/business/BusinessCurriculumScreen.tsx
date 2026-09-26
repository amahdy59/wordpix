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
    <main
      className="h-full min-h-0 overflow-y-auto bg-background pb-24 overscroll-y-contain"
      aria-labelledby="business-curriculum-title"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "explore" })}
          className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-xl px-3 font-bold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          <span>{t("business.backToExplore")}</span>
        </button>

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
                className="w-full rounded-2xl border border-border bg-card py-2.5 ps-10 pe-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-wp-xs"
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
                  className={`inline-flex min-h-[36px] sm:min-h-[44px] items-center shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUnits.map((unit) => {
              const progress = progressState[unit.id];
              const isMastered = progress?.status === "mastered";
              const isInProgress =
                progress?.status === "in-progress" &&
                (progress.completedStages.length > 0 || progress.currentStage > 0);

              return (
                <article
                  key={unit.id}
                  className="flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card shadow-wp-xs hover:border-primary/40 hover:shadow-wp-sm transition-all"
                >
                  {unit.heroImageSrc && (
                    <div className="relative h-40 w-full overflow-hidden bg-muted/40 border-b border-border/60">
                      <img
                        src={resolveAssetUrl(unit.heroImageSrc)}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  <div className="flex flex-col justify-between flex-1 p-5 sm:p-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 font-black text-xs text-primary">
                            {unit.unitNumber}
                          </span>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-black uppercase text-foreground">
                            {unit.level}
                          </span>
                          {unit.estimatedMinutes && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-foreground">
                              <Hourglass className="size-3" aria-hidden />
                              {t("business.estimatedMinutes", { minutes: unit.estimatedMinutes })}
                            </span>
                          )}
                        </div>

                        {isMastered ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-black text-accent">
                            <CheckCircle2 className="size-3.5" aria-hidden />
                            {t("business.masteredBadge")}
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-black text-primary">
                            <Clock className="size-3.5" aria-hidden />
                            {t("business.stageFraction", {
                              current: progress.currentStage + 1,
                              total: 8,
                            })}
                          </span>
                        ) : null}
                      </div>

                      <h2 className="text-lg font-black text-foreground tracking-tight leading-snug">
                        {unit.title}
                      </h2>

                      <p className="text-sm font-semibold text-primary/90 italic">
                        {`“${unit.essentialQuestion}”`}
                      </p>

                      <p className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-2">
                        <span className="font-bold text-foreground">
                          {t("business.goalPrefix")}
                        </span>
                        {unit.speakingGoal}
                      </p>

                      {unit.tags && unit.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {unit.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-bold text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between pt-4 border-t border-border/80">
                      <span className="text-xs font-bold text-muted-foreground">
                        {t("business.termsAndSteps", { count: unit.languageBank.length })}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          dispatch({
                            type: "OPEN_BUSINESS_LESSON",
                            unitId: unit.id,
                          })
                        }
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground shadow-wp-xs hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <span>
                          {isMastered
                            ? t("business.reviewUnitCta")
                            : isInProgress
                              ? t("business.resumeCta")
                              : t("business.startUnitCta")}
                        </span>
                        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
