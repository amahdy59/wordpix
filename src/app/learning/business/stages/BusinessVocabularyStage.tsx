import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  BookOpenCheck,
  Volume2,
  LayoutGrid,
  TableProperties,
} from "lucide-react";
import type { BusinessUnit } from "../businessTypes";
import { resolveAssetUrl } from "../../../../utils/assetUrl";

interface Props {
  unit: BusinessUnit;
  onNext: () => void;
}

export function BusinessVocabularyStage({ unit, onNext }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "cards" | "table">("all");
  const [speakingTerm, setSpeakingTerm] = useState<string | null>(null);

  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    setSpeakingTerm(text);
    utterance.onend = () => setSpeakingTerm(null);
    utterance.onerror = () => setSpeakingTerm(null);
    window.speechSynthesis.speak(utterance);
  };

  // Divide into core concepts (first 6 items) and collocations (subsequent items)
  const coreConcepts = unit.languageBank.slice(0, 6);
  const collocations = unit.languageBank.slice(6);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <Sparkles className="size-4" aria-hidden />
          Stage 3 · Language Bank
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {unit.languageBank.length} Target Workplace Terms
        </span>
      </div>

      {/* Intro Card */}
      <section
        className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        aria-labelledby="vocab-stage-heading"
      >
        <div>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="size-5 text-primary" aria-hidden />
            <h1 id="vocab-stage-heading" className="text-xl sm:text-2xl font-black text-foreground">
              Core Vocabulary & Business Collocations
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground font-medium">
            Master high-impact terms, collocations, and idiomatic phrases used across global
            business.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div
          role="tablist"
          aria-label="Vocabulary display mode"
          className="flex items-center gap-1 rounded-2xl border border-border bg-muted/30 p-1 self-start sm:self-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
              activeTab === "all"
                ? "bg-card text-foreground shadow-wp-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>All ({unit.languageBank.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "cards"}
            onClick={() => setActiveTab("cards")}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
              activeTab === "cards"
                ? "bg-card text-foreground shadow-wp-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="size-3.5" aria-hidden />
            <span>Cards</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "table"}
            onClick={() => setActiveTab("table")}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
              activeTab === "table"
                ? "bg-card text-foreground shadow-wp-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TableProperties className="size-3.5" aria-hidden />
            <span>Table</span>
          </button>
        </div>
      </section>

      {/* Mode A: Visual Cards View */}
      {(activeTab === "all" || activeTab === "cards") && (
        <section aria-labelledby="core-concepts-heading" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2
              id="core-concepts-heading"
              className="text-base font-black text-foreground uppercase tracking-wide"
            >
              {activeTab === "all" ? "Core Conceptual Terms" : "Visual Flashcards"}
            </h2>
            <span className="text-xs font-bold text-muted-foreground">
              {activeTab === "all"
                ? `${coreConcepts.length} Visual Cards`
                : `${unit.languageBank.length} Cards`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(activeTab === "all" ? coreConcepts : unit.languageBank).map((item, idx) => {
              const imageUrl = resolveAssetUrl(item.imageSrc);
              return (
                <article
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-wp-xs hover:border-primary/40 hover:shadow-wp-sm transition-all"
                >
                  {/* Concept Illustration */}
                  <div className="relative h-44 w-full overflow-hidden bg-muted/40 border-b border-border/60">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        className="size-full object-cover object-center transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center font-black text-muted-foreground/30 text-2xl">
                        {idx + 1}
                      </div>
                    )}
                    <span className="absolute top-3 end-3 rounded-full bg-card/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-black text-primary border border-border/60 shadow-wp-xs">
                      {item.type}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-black text-foreground capitalize">
                          {item.term}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.term)}
                          aria-label={`Pronounce ${item.term}`}
                          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <Volume2
                            className={`size-4 ${speakingTerm === item.term ? "text-primary animate-pulse" : ""}`}
                            aria-hidden
                          />
                        </button>
                      </div>

                      <p className="mt-1 text-sm font-medium text-muted-foreground">
                        {item.definition}
                      </p>
                    </div>

                    <div className="rounded-xl bg-primary/5 p-2.5 border border-primary/10 text-xs sm:text-sm font-semibold text-primary/95 italic">
                      “{item.example}”
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Mode B: Collocations & Phrasal Verbs Table View */}
      {(activeTab === "all" || activeTab === "table") && (
        <section
          aria-labelledby="collocations-heading"
          className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-wp-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              id="collocations-heading"
              className="text-base font-black text-foreground uppercase tracking-wide"
            >
              {activeTab === "all"
                ? "Collocations & Workplace Phrasal Verbs"
                : "Complete Reference Table"}
            </h2>
            <span className="text-xs font-bold text-muted-foreground">
              {activeTab === "all"
                ? `${collocations.length} Expressions`
                : `${unit.languageBank.length} Expressions`}
            </span>
          </div>

          <div className="divide-y divide-border/80">
            {(activeTab === "all" ? collocations : unit.languageBank).map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => handleSpeak(item.term)}
                    aria-label={`Pronounce ${item.term}`}
                    className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <Volume2
                      className={`size-4 ${speakingTerm === item.term ? "text-primary animate-pulse" : ""}`}
                      aria-hidden
                    />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-foreground text-sm sm:text-base">
                        {item.term}
                      </span>
                      <span className="text-[10px] font-black uppercase rounded bg-muted px-1.5 py-0.2 text-muted-foreground">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                      {item.definition}
                    </p>
                  </div>
                </div>

                <div className="sm:max-w-xs text-xs sm:text-sm font-semibold italic text-primary/90 bg-primary/5 p-2 rounded-lg border border-primary/10">
                  “{item.example}”
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>Continue to Usage Focus</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
