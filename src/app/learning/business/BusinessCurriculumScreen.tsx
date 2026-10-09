import { HelpDisclosure } from "../../shared/HelpDisclosure";
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
import { Button, CurriculumHeroHeader, CurriculumTopicCard } from "../../shared";

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

        <CurriculumHeroHeader
          titleId="business-curriculum-title"
          title={t("business.title")}
          badge={t("business.heroLevelPill")}
          description={t("business.heroSubtitle")}
          metrics={[
            {
              label: t("business.unitsMasteredLabel"),
              value: `${masteredCount} / ${BUSINESS_UNITS.length}`,
            },
          ]}
          action={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold text-foreground">
                {t("business.unitColonTitle", {
                  number: continueUnit.unitNumber,
                  title: continueUnit.title,
                })}
              </p>
              <Button
                onClick={() => dispatch({ type: "OPEN_BUSINESS_LESSON", unitId: continueUnit.id })}
                iconLeft={<ArrowRight className="size-4 rtl:rotate-180" aria-hidden />}
              >
                {t("business.continueCta")}
              </Button>
            </div>
          }
        />

        {/* Controls: Search and CEFR Level Filter */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* CEFR Level Tabs */}
            <div
              role="tablist"
              aria-label={t("conversation.levelsLabel")}
              className="flex items-center gap-1.5 overflow-x-auto py-1.5"
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
                    className={`flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm sm:text-base font-bold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-wp-xs"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <span>{tab.id === "ALL" ? t("conversation.allLevels") : tab.id}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-sm font-black ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
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
                placeholder={t("business.searchPlaceholder")}
                aria-label={t("business.searchPlaceholder")}
                className="min-h-11 w-full rounded-2xl border border-border bg-card py-2.5 ps-10 pe-4 text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-wp-xs"
              />
            </div>
          </div>

          <HelpDisclosure
            label={
              selectedTag === "All Topics"
                ? t("help.topicFilters")
                : t("help.topicFiltersActive", { topic: selectedTag })
            }
          >
            {/* Domain / Competency Topic Filter Pills */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto py-1"
              role="group"
              aria-label={t("help.topicFilters")}
            >
              <span className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground me-1 shrink-0">
                <Tag className="size-3" aria-hidden />
                {t("business.topicsLabel")}
              </span>
              {DOMAIN_TAGS.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={t(`help.businessTopics.${DOMAIN_TAGS.indexOf(tag)}`)}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedTag(tag)}
                    className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-3.5 py-1.5 text-sm font-bold transition-all ${
                      isSelected
                        ? "bg-foreground text-background shadow-wp-xs"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {t(`help.businessTopics.${DOMAIN_TAGS.indexOf(tag)}`)}
                  </button>
                );
              })}
            </div>
          </HelpDisclosure>
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
                      ? "text-feedback-success-foreground"
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

        {/* Course Section Milestones */}
        <HelpDisclosure label={t("business.credentialsTitle")}>
          <section
            aria-labelledby="milestones-heading"
            className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-wp-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="size-5 text-primary" aria-hidden />
                <h2 id="milestones-heading" className="text-lg font-black text-foreground">
                  {t("business.credentialsTitle")}
                </h2>
              </div>
              <span className="text-sm font-bold text-muted-foreground">
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
                        ? "border-accent/40 bg-feedback-success-surface shadow-wp-xs ring-1 ring-accent/30"
                        : isStarted
                          ? "border-primary/40 bg-secondary"
                          : "border-border bg-muted/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-2xl" role="img" aria-label={milestone.title}>
                        {milestone.badge}
                      </span>
                      {isSectionCertified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-feedback-success-surface px-2 py-0.5 text-sm font-black text-feedback-success-foreground uppercase">
                          <CheckCircle2 className="size-3" aria-hidden />
                          {t("business.certifiedBadge")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-sm font-bold text-muted-foreground">
                          {t("business.sectionUnitsCount", {
                            mastered: sectionMastered,
                            total: sectionUnits.length,
                          })}
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-secondary px-1.5 py-0.2 text-sm font-black text-primary">
                          {milestone.level}
                        </span>
                        <h3 className="text-base font-black text-foreground line-clamp-1">
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground font-medium line-clamp-2">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </HelpDisclosure>
      </div>
    </div>
  );
}
