import { useState, useMemo } from "react";
import { BookOpen, Search, CheckCircle, ArrowRight } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";
import { resolveAssetUrl } from "../../../../utils/assetUrl";
import { useAudio } from "../../../shared/useAudio";
import { useLearner } from "../../../context/LearnerContext";
import { CurriculumVocabularyTable } from "../../../shared/CurriculumVocabularyTable";
import type { VocabularyTableItem } from "../../../shared/CurriculumVocabularyTable";
import { getCurriculumAudioKey } from "../../shared/curriculumAudioManifest";

interface Props {
  unit: BusinessUnit;
  onNext: () => void;
}

export function BusinessVocabularyStage({ unit, onNext }: Props) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeAudioText, setActiveAudioText] = useState<string | null>(null);
  const listeningEnabled = learnerState.accessibility.includeListening;
  const audio = useAudio({ lang: "en-US", rate: 0.9, preferLocal: true });

  const handleSpeakTerm = (term: string) => {
    if (!listeningEnabled || !audio.isSupported) return;
    setActiveAudioText(term);
    audio.speak(term, undefined, getCurriculumAudioKey(term) ?? undefined);
  };

  // Extract unique types present in this unit
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    unit.languageBank.forEach((item) => types.add(item.type));
    return Array.from(types);
  }, [unit.languageBank]);

  // Filter items by type and search query
  const filteredItems = useMemo(() => {
    return unit.languageBank.filter((item) => {
      const matchesType =
        selectedType === "all" || item.type.toLowerCase() === selectedType.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.example.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [unit.languageBank, selectedType, searchQuery]);

  // Map BusinessVocabularyItem → unified VocabularyTableItem
  const tableItems: VocabularyTableItem[] = filteredItems.map((item) => ({
    id: item.id,
    term: item.term,
    type: item.type,
    definition: item.definition,
    example: item.example,
    imageSrc: resolveAssetUrl(item.imageSrc) || undefined,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full py-2">
      {/* Stage Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <BookOpen className="size-4" aria-hidden />
          {t("business.vocabStage.stageTag")}
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {t("business.vocabStage.targetTermsCount", { count: unit.languageBank.length })}
        </span>
      </div>

      {/* Intro & Controls Header */}
      <section
        className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm flex flex-col gap-5"
        aria-labelledby="vocab-stage-heading"
      >
        <div>
          <h1 id="vocab-stage-heading" className="text-xl sm:text-2xl font-black text-foreground">
            {t("business.vocabStage.heading")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-medium">
            {t("business.vocabStage.subtitle")}
          </p>
        </div>

        {/* Filter bar: Search input + Category Filter Chips */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-border/70">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms, definitions, or examples..."
              aria-label={t("business.vocabStage.searchAria")}
              className="w-full min-h-[44px] rounded-xl border border-border bg-background ps-9 pe-4 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-all"
            />
          </div>

          {/* Type Filter Pills */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none"
            role="group"
            aria-label="Filter by word type"
          >
            <button
              type="button"
              onClick={() => setSelectedType("all")}
              aria-pressed={selectedType === "all"}
              className={`inline-flex min-h-[44px] items-center px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                selectedType === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-wp-xs"
                  : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              {t("business.vocabStage.filterAll", { count: unit.languageBank.length })}
            </button>
            {availableTypes.map((type) => {
              const count = unit.languageBank.filter((i) => i.type === type).length;
              const isSelected = selectedType.toLowerCase() === type.toLowerCase();
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  aria-pressed={isSelected}
                  className={`inline-flex min-h-[44px] items-center px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-wp-xs"
                      : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {`${type} (${count})`}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results count for filtered view */}
      {(searchQuery || selectedType !== "all") && (
        <p
          className="text-xs font-bold text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          {t("business.vocabStage.showingCount", {
            shown: filteredItems.length,
            total: unit.languageBank.length,
          })}
        </p>
      )}

      {/* Unified Vocabulary Table */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center text-sm font-medium text-muted-foreground shadow-wp-xs">
          {t("business.vocabStage.emptyFilter")}
        </div>
      ) : (
        <CurriculumVocabularyTable
          items={tableItems}
          onPlayAudio={listeningEnabled && audio.isSupported ? handleSpeakTerm : undefined}
          activeAudioText={activeAudioText}
          isPlaying={audio.isPlaying}
          isAudioError={audio.isError}
        />
      )}

      {/* Completion & Next Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
          <CheckCircle className="size-4 text-primary" aria-hidden />
          <span>
            {t("business.vocabStage.catalogedFooter", { count: unit.languageBank.length })}
          </span>
        </p>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary w-full sm:w-auto"
        >
          <span>{t("business.vocabStage.continueToUsage")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
