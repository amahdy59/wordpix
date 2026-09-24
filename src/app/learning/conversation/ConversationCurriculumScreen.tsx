import { useState, useMemo, type Dispatch, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Search, CheckCircle2, Clock, BookOpen } from "lucide-react";
import type { Action } from "../../types";
import { useLearner } from "../../context/LearnerContext";
import { useI18n } from "../../context/I18nContext";
import { CONVERSATION_UNITS } from "./conversationCatalog";
import { CONVERSATION_STAGE_IDS, type CefrLevel, type ConversationUnit } from "./conversationTypes";
import { resolveAssetUrl } from "../../../utils/assetUrl";

interface Props {
  dispatch: Dispatch<Action>;
}

const CEFR_TABS: { id: "ALL" | CefrLevel; count: number }[] = [
  { id: "ALL", count: 40 },
  { id: "B1", count: 10 },
  { id: "B2", count: 10 },
  { id: "C1", count: 10 },
  { id: "C2", count: 10 },
];

export function ConversationCurriculumScreen({ dispatch }: Props) {
  const { state: learnerState } = useLearner();
  const { t } = useI18n();
  const [selectedLevel, setSelectedLevel] = useState<"ALL" | CefrLevel>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const progressState = learnerState.conversationProgress;

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

  // Stats
  const masteredCount = useMemo(() => {
    return Object.values(progressState).filter((p) => p.status === "mastered").length;
  }, [progressState]);

  const inProgressCount = useMemo(() => {
    return Object.values(progressState).filter(
      (p) => p.status === "in-progress" && p.completedStages.length > 0
    ).length;
  }, [progressState]);

  const completionPercent = Math.round((masteredCount / CONVERSATION_UNITS.length) * 100);

  // Active / resume unit
  const continueUnit = useMemo(() => {
    const active = CONVERSATION_UNITS.find((u) => {
      const p = progressState[u.id];
      return p && p.status === "in-progress";
    });
    if (active) return active;
    const firstUnmastered = CONVERSATION_UNITS.find(
      (u) => progressState[u.id]?.status !== "mastered"
    );
    return firstUnmastered ?? CONVERSATION_UNITS[0];
  }, [progressState]);

  // Filtered units
  const filteredUnits = useMemo(() => {
    let units = CONVERSATION_UNITS;
    if (selectedLevel !== "ALL") {
      units = units.filter((u) => u.level === selectedLevel);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      units = units.filter(
        (u) =>
          u.title.toLowerCase().includes(q) ||
          u.topic.toLowerCase().includes(q) ||
          u.speakingSkill.toLowerCase().includes(q) ||
          `unit ${u.unitNumber}`.includes(q)
      );
    }
    return units;
  }, [selectedLevel, searchQuery]);

  return (
    <main
      className="h-full min-h-0 overflow-y-auto bg-background pb-24 overscroll-y-contain"
      aria-labelledby="curriculum-main-title"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "explore" })}
          className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-xl px-3 font-bold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          <span>{t("conversation.backToExplore")}</span>
        </button>

        {/* Hero Header Card */}
        <header className="rounded-3xl border-2 border-primary/35 bg-gradient-to-br from-primary/15 via-card to-card p-6 sm:p-8 shadow-wp-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-primary/20 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-primary">
              {t("conversation.advancedPathway")}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {t("conversation.unitCountLabel")}
            </span>
          </div>

          <h1
            id="curriculum-main-title"
            className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-foreground"
          >
            {t("conversation.title")}
          </h1>
          <p className="mt-2 text-sm sm:text-base font-medium text-muted-foreground max-w-3xl leading-relaxed">
            {t("conversation.heroDescription")}
          </p>

          {/* Progress Overview Bar & Metrics */}
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                {t("conversation.totalUnits")}
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">40</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                {t("conversation.inProgress")}
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">{inProgressCount}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                {t("conversation.mastered")}
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">{masteredCount}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                {t("conversation.overallProgress")}
              </span>
              <p className="mt-1 text-2xl font-black text-primary">{completionPercent}%</p>
            </div>
          </div>

          {/* Continue Learning CTA */}
          {continueUnit && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/10 p-4 sm:p-5">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-primary">
                  {t("conversation.continueLabel")}
                </span>
                <span className="text-base sm:text-lg font-black text-foreground mt-0.5">
                  {t("conversation.unitTitle", {
                    number: continueUnit.unitNumber,
                    title: continueUnit.title,
                  })}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "OPEN_CONVERSATION_LESSON",
                    unitId: continueUnit.id,
                    stage:
                      CONVERSATION_STAGE_IDS[progressState[continueUnit.id]?.currentStage ?? 0],
                  })
                }
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-bold text-primary-foreground shadow-wp-xs hover:opacity-95 active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary shrink-0"
              >
                <span>{t("conversation.resumeLesson")}</span>
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </button>
            </div>
          )}
        </header>

        {/* Search Bar & CEFR Level Filter Tabs */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search
              className="absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="text"
              aria-label={t("conversation.searchLabel")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("conversation.searchPlaceholder")}
              className="w-full min-h-[48px] rounded-2xl border border-border bg-card ps-12 pe-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary"
            />
          </div>

          {/* Level Tabs */}
          <div
            role="tablist"
            aria-label={t("conversation.levelsLabel")}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
          >
            {CEFR_TABS.map((tab, tabIndex) => {
              const isSelected = selectedLevel === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelectedLevel(tab.id)}
                  onKeyDown={(event) => handleLevelKeyDown(event, tabIndex)}
                  className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-wp-xs"
                      : "bg-card border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{tab.id === "ALL" ? t("conversation.allLevels") : tab.id}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
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
        </div>

        {/* 40 Units Grid */}
        <section
          aria-label={t("conversation.unitsList")}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredUnits.map((unit: ConversationUnit) => {
            const p = progressState[unit.id];
            const isMastered = p?.status === "mastered";
            const isInProgress = p?.status === "in-progress" && p.completedStages.length > 0;
            const completedStageCount = p?.completedStages.length ?? 0;

            return (
              <button
                key={unit.id}
                type="button"
                aria-label={t("conversation.unitAccessibleName", {
                  number: String(unit.unitNumber).padStart(2, "0"),
                  title: unit.title,
                })}
                onClick={() =>
                  dispatch({
                    type: "OPEN_CONVERSATION_LESSON",
                    unitId: unit.id,
                    stage: p ? CONVERSATION_STAGE_IDS[p.currentStage] : undefined,
                  })
                }
                className="group flex min-h-[44px] flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card text-start transition-all hover:border-primary/50 hover:shadow-wp-sm active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <div>
                  {/* Hero scene cover */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {unit.heroImage ? (
                      <img
                        src={resolveAssetUrl(unit.heroImage)}
                        alt=""
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-primary/10 text-primary">
                        <BookOpen className="size-10" aria-hidden />
                      </div>
                    )}
                    <div className="absolute top-3 start-3 flex items-center gap-1.5">
                      <span className="rounded-lg bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-black text-foreground shadow-sm">
                        {t("conversation.unitNumber", {
                          number: String(unit.unitNumber).padStart(2, "0"),
                        })}
                      </span>
                      <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-black text-primary-foreground shadow-sm">
                        {unit.level}
                      </span>
                    </div>

                    {isMastered && (
                      <div className="absolute top-3 end-3 rounded-full bg-accent p-1 text-accent-foreground shadow-sm">
                        <CheckCircle2 className="size-4" aria-hidden />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      {unit.topic}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                      {unit.title}
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium line-clamp-2 mt-1">
                      {t("conversation.skill", { skill: unit.speakingSkill })}
                    </p>
                  </div>
                </div>

                {/* Footer status */}
                <div className="border-t border-border/60 bg-muted/20 px-5 py-3 flex items-center justify-between">
                  {isMastered ? (
                    <span className="text-xs font-bold text-accent flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" aria-hidden />
                      {t("conversation.mastered")}
                    </span>
                  ) : isInProgress ? (
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden />
                      {t("conversation.stagesProgress", { completed: completedStageCount })}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground">
                      {t("conversation.notStarted")}
                    </span>
                  )}

                  <span className="text-xs font-bold text-primary group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>{t("conversation.start")}</span>
                    <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
                  </span>
                </div>
              </button>
            );
          })}
        </section>
        {filteredUnits.length === 0 && (
          <p
            className="rounded-2xl border border-border bg-card p-6 text-center font-semibold text-muted-foreground"
            role="status"
          >
            {t("conversation.noResults")}
          </p>
        )}
      </div>
    </main>
  );
}
