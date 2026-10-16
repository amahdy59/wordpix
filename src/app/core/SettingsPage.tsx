import { memo, useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Eye,
  Volume2,
  ShieldCheck,
  CloudDownload,
  Wifi,
  Sparkles,
  Sun,
  Moon,
  Search,
  X,
  Languages,
  CheckCircle2,
  Play,
  AlertTriangle,
  Layers,
} from "lucide-react";
import type { Action } from "../types";
import { useLearner } from "../context/LearnerContext";
import { useTheme } from "../shared/ThemeToggle";
import { useI18n, SUPPORTED_LANGS } from "../context/I18nContext";
import { useAccessibility, formatNumber } from "../shared/useAccessibilityPreferences";
import { useAudio } from "../shared/useAudio";
import { Button } from "../shared/Button";
import { PageContainer } from "../shared/PageContainer";
import { PageHeader } from "../shared/PageHeader";
import { Surface } from "../shared/Surface";
import { HelpDisclosure } from "../shared/HelpDisclosure";
import { COURSE_UNITS } from "../data/courseCatalog";
import { loadUnitVocabulary } from "../data/vocabulary";
import { loadLessonStory } from "../data/lessonStoryLoader";
import { loadLexicon } from "../data/lexiconLoader";

const SPEECH_RATES = [0.5, 0.75, 1] as const;

export type SettingCategory =
  "all" | "appearance" | "language" | "audio" | "learning" | "offline" | "data";

interface SettingItem {
  id: string;
  category: Exclude<SettingCategory, "all">;
  titleKey: string;
  descriptionKey: string;
  keywords: string[];
}

const SETTING_ITEMS: SettingItem[] = [
  {
    id: "themeMode",
    category: "appearance",
    titleKey: "settings.themeMode",
    descriptionKey: "settings.themeModeHint",
    keywords: ["dark", "light", "system", "color", "theme", "mode", "appearance"],
  },
  {
    id: "highContrast",
    category: "appearance",
    titleKey: "settings.highContrast",
    descriptionKey: "settings.highContrastHint",
    keywords: ["contrast", "aaa", "7:1", "accessibility", "vision", "readability", "color"],
  },
  {
    id: "reduceMotion",
    category: "appearance",
    titleKey: "settings.reduceMotion",
    descriptionKey: "settings.reduceMotionHint",
    keywords: ["motion", "animation", "vestibular", "movement", "transitions"],
  },
  {
    id: "textSize",
    category: "appearance",
    titleKey: "settings.textSize",
    descriptionKey: "settings.textSizeHint",
    keywords: ["text", "font", "size", "scaling", "large", "zoom", "150%", "typography"],
  },
  {
    id: "interfaceLanguage",
    category: "language",
    titleKey: "settings.interfaceLanguage",
    descriptionKey: "settings.interfaceLanguageHint",
    keywords: ["language", "arabic", "english", "bilingual", "rtl", "العربية", "menu"],
  },
  {
    id: "numeralSystem",
    category: "language",
    titleKey: "settings.numeralSystem",
    descriptionKey: "settings.numeralSystemHint",
    keywords: ["numerals", "numbers", "digits", "arabic-indic", "western", "١", "1"],
  },
  {
    id: "speechRate",
    category: "audio",
    titleKey: "settings.speechRate",
    descriptionKey: "settings.speechRateHint",
    keywords: ["speed", "audio", "speech", "rate", "playback", "slow", "fast", "pronunciation"],
  },
  {
    id: "voiceEngine",
    category: "audio",
    titleKey: "settings.elevenLabsTitle",
    descriptionKey: "settings.audioEngineDesc",
    keywords: ["voice", "elevenlabs", "hd", "audio", "sample", "test", "tts"],
  },
  {
    id: "spokenFeedback",
    category: "audio",
    titleKey: "settings.speakAnswers",
    descriptionKey: "settings.speakAnswersHint",
    keywords: ["feedback", "spoken", "voice", "audio", "chime", "sound", "answers"],
  },
  {
    id: "targetLevel",
    category: "learning",
    titleKey: "settings.targetLevel",
    descriptionKey: "settings.goalsHeading",
    keywords: ["cefr", "level", "goal", "a1", "a2", "b1", "b2", "c1", "c2", "difficulty"],
  },
  {
    id: "speakingDrills",
    category: "learning",
    titleKey: "settings.speakingDrills",
    descriptionKey: "settings.speakingDrillsHint",
    keywords: ["speaking", "microphone", "drills", "voice", "recording", "quiet"],
  },
  {
    id: "pronunciationExercises",
    category: "learning",
    titleKey: "settings.pronunciationExercises",
    descriptionKey: "settings.pronunciationExercisesHint",
    keywords: ["pronunciation", "phonetics", "accent", "drills", "exercises"],
  },
  {
    id: "timedExercises",
    category: "learning",
    titleKey: "settings.timedExercises",
    descriptionKey: "settings.timedExercisesHint",
    keywords: ["time", "timer", "timed", "countdown", "no timing", "aaa 2.2.3", "pressure"],
  },
  {
    id: "autoAdvance",
    category: "learning",
    titleKey: "settings.autoAdvance",
    descriptionKey: "settings.autoAdvanceHint",
    keywords: ["auto", "advance", "next", "automatic", "pace", "speed"],
  },
  {
    id: "listeningDrills",
    category: "learning",
    titleKey: "settings.listeningDrills",
    descriptionKey: "settings.listeningDrillsHint",
    keywords: ["listening", "audio", "ear", "comprehension", "deaf", "hard of hearing"],
  },
  {
    id: "offlinePreload",
    category: "offline",
    titleKey: "vocabularyPreload.title",
    descriptionKey: "vocabularyPreload.description",
    keywords: ["offline", "download", "preload", "cache", "network", "storage", "airplane"],
  },
  {
    id: "dataManagement",
    category: "data",
    titleKey: "settings.resetHeading",
    descriptionKey: "settings.resetHint",
    keywords: ["reset", "clear", "data", "delete", "progress", "memory", "streak", "wipe"],
  },
];

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const SettingsPage = memo(function SettingsPage({ dispatch }: Props) {
  const { t, interfaceLang, setInterfaceLang } = useI18n();
  const { state, setPreferences, resetToZero } = useLearner();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { accessibility, setAccessibility } = useAccessibility();
  const { speak } = useAudio();

  const {
    textSize,
    highContrast,
    speechRate,
    numeralSystem,
    includeSpeaking,
    includeListening,
    includePronunciation,
    timedExercises,
    autoAdvance,
    spokenFeedback,
    reduceMotion,
  } = accessibility;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SettingCategory>("all");
  const [confirmReset, setConfirmReset] = useState(false);

  // Offline preloading states
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [preloadDone, setPreloadDone] = useState(false);
  const [preloadError, setPreloadError] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Press "/" to focus search box globally (WCAG 2.1.4 / keyboard navigation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target;
        if (
          target instanceof HTMLElement &&
          (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePreloadAll = async () => {
    if (isPreloading) return;
    setIsPreloading(true);
    setPreloadDone(false);
    setPreloadError(false);
    setPreloadProgress(0);

    const unitIds = Object.keys(COURSE_UNITS);
    const batchSize = 10;
    let completed = 0;

    try {
      for (let i = 0; i < unitIds.length; i += batchSize) {
        const batch = unitIds.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (id) => {
            await Promise.all([
              loadUnitVocabulary(id),
              loadLexicon(COURSE_UNITS[id].wordIds),
              ...COURSE_UNITS[id].groups.map((group) => loadLessonStory(group.id)),
            ]);
          })
        );
        completed += batch.length;
        setPreloadProgress(Math.round((completed / unitIds.length) * 100));
      }
      setPreloadDone(true);
    } catch {
      setPreloadError(true);
    } finally {
      setIsPreloading(false);
    }
  };

  // Filter settings by search query and category
  const filteredSettingIds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return SETTING_ITEMS.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (!query) return true;

      const title = t(item.titleKey, { count: Object.keys(COURSE_UNITS).length }).toLowerCase();
      const desc = t(item.descriptionKey).toLowerCase();
      const matchesText = title.includes(query) || desc.includes(query);
      const matchesKeyword = item.keywords.some((k) => k.toLowerCase().includes(query));

      return matchesText || matchesKeyword;
    }).map((item) => item.id);
  }, [searchQuery, selectedCategory, t]);

  const isVisible = useCallback(
    (id: string) => filteredSettingIds.includes(id),
    [filteredSettingIds]
  );

  const categories: { id: SettingCategory; labelKey: string; icon: typeof Eye }[] = useMemo(
    () => [
      { id: "all", labelKey: "settings.categoryAll", icon: Layers },
      { id: "appearance", labelKey: "settings.categoryAppearance", icon: Eye },
      { id: "language", labelKey: "settings.categoryLanguage", icon: Languages },
      { id: "audio", labelKey: "settings.categoryAudio", icon: Volume2 },
      { id: "learning", labelKey: "settings.categoryLearning", icon: Sparkles },
      { id: "offline", labelKey: "settings.categoryOffline", icon: CloudDownload },
      { id: "data", labelKey: "settings.categoryData", icon: AlertTriangle },
    ],
    []
  );

  const resultCount = filteredSettingIds.length;
  const resultMessage = t(
    resultCount === 1 ? "settings.resultsCount" : "settings.resultsCountPlural",
    {
      count: resultCount,
    }
  );

  const handleClose = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      dispatch({ type: "GO", to: "profile" });
    }
  }, [dispatch]);

  return (
    <PageContainer size="wide" className="pb-16 pt-2">
      {/* Page Header */}
      <PageHeader
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
        onBack={handleClose}
        backLabel={t("settings.closeLabel")}
        headingLevel="h1"
      />

      {/* Search and Filter Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <label htmlFor="settings-search-input" className="sr-only">
            {t("settings.searchLabel")}
          </label>
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-foreground">
            <Search className="size-5" aria-hidden="true" />
          </div>
          <input
            ref={searchInputRef}
            id="settings-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("settings.searchPlaceholder")}
            className="w-full min-h-[48px] ps-11 pe-24 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground/80 font-sans text-sm sm:text-base shadow-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
          />
          <div className="absolute inset-y-0 end-0 flex items-center pe-3 gap-1">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label={t("settings.searchClear")}
                className="size-11 min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <kbd
                className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-muted-foreground bg-muted/60 border border-border rounded-md select-none"
                title={t("settings.searchShortcutHint")}
              >
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Live Region for Screen Readers */}
        <div role="status" aria-live="polite" className="sr-only">
          {searchQuery ? resultMessage : ""}
        </div>

        {/* Category Filter Pills */}
        <nav
          aria-label={t("settings.categoryAll")}
          className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none"
        >
          {categories.map(({ id, labelKey, icon: Icon }) => {
            const isActive = selectedCategory === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(id)}
                aria-pressed={isActive}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-sans font-bold flex items-center gap-2 whitespace-nowrap transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span>{t(labelKey)}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Grid: Settings Sections + Interactive Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
        {/* Settings Column */}
        <div className="flex flex-col gap-6">
          {/* Empty State when no search matches */}
          {filteredSettingIds.length === 0 && (
            <Surface className="p-8 text-center flex flex-col items-center justify-center gap-3">
              <div className="size-12 rounded-2xl bg-secondary text-primary flex items-center justify-center">
                <Search className="size-6" aria-hidden="true" />
              </div>
              <h2 className="font-sans font-bold text-lg text-foreground">
                {t("settings.noResults", { query: searchQuery })}
              </h2>
              <p className="font-sans text-sm text-muted-foreground max-w-md">
                {t("settings.noResultsHint")}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-2"
              >
                {t("settings.resetSearch")}
              </Button>
            </Surface>
          )}

          {/* SECTION 1: APPEARANCE & ACCESSIBLE THEMES */}
          {(isVisible("themeMode") ||
            isVisible("highContrast") ||
            isVisible("reduceMotion") ||
            isVisible("textSize")) && (
            <section className="flex flex-col gap-3" aria-labelledby="heading-appearance">
              <h2
                id="heading-appearance"
                className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Eye className="size-4 text-primary" aria-hidden="true" />
                <span>{t("settings.appearanceHeading")}</span>
              </h2>

              <Surface className="p-5 flex flex-col gap-5 border border-border">
                {/* Theme Mode */}
                {isVisible("themeMode") && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.themeMode")}
                      </span>
                      <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t("settings.themeModeHint")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      aria-label={`${t("settings.themeLabel")}: ${theme}. ${t("settings.themeActivate")}`}
                      className="px-4 py-2.5 min-h-[44px] rounded-xl bg-card border border-border hover:border-primary font-sans font-bold text-xs sm:text-sm text-foreground flex items-center gap-2 shadow-xs transition-all shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                    >
                      {resolvedTheme === "dark" ? (
                        <Sun className="size-4 text-wp-amber-foreground" aria-hidden="true" />
                      ) : (
                        <Moon className="size-4 text-wp-blue-foreground" aria-hidden="true" />
                      )}
                      <span className="capitalize">{theme}</span>
                    </button>
                  </div>
                )}

                {isVisible("themeMode") && isVisible("highContrast") && (
                  <hr className="border-border/60" />
                )}

                {/* High Contrast Mode */}
                {isVisible("highContrast") && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.highContrast")}
                      </span>
                      <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t("settings.highContrastHint")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccessibility({ highContrast: !highContrast })}
                      aria-pressed={highContrast}
                      aria-label={t("settings.toggleLabel", {
                        setting: t("settings.highContrast"),
                        state: highContrast ? t("settings.enabled") : t("settings.disabled"),
                      })}
                      className={`px-4 py-2 min-h-[44px] rounded-full font-sans font-bold text-xs sm:text-sm transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                        highContrast
                          ? "bg-wp-green text-wp-text-on-green border-wp-green"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {highContrast ? t("settings.enabledContrast") : t("settings.disabled")}
                    </button>
                  </div>
                )}

                {isVisible("highContrast") && isVisible("reduceMotion") && (
                  <hr className="border-border/60" />
                )}

                {/* Reduce Motion */}
                {isVisible("reduceMotion") && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.reduceMotion")}
                      </span>
                      <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t("settings.reduceMotionHint")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccessibility({ reduceMotion: !reduceMotion })}
                      aria-pressed={reduceMotion}
                      aria-label={t("settings.toggleLabel", {
                        setting: t("settings.reduceMotion"),
                        state: reduceMotion ? t("settings.enabled") : t("settings.disabled"),
                      })}
                      className={`px-4 py-2 min-h-[44px] rounded-full font-sans font-bold text-xs sm:text-sm transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                        reduceMotion
                          ? "bg-wp-green text-wp-text-on-green border-wp-green"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {reduceMotion ? t("settings.enabled") : t("settings.disabled")}
                    </button>
                  </div>
                )}

                {isVisible("reduceMotion") && isVisible("textSize") && (
                  <hr className="border-border/60" />
                )}

                {/* Text Size Scaling */}
                {isVisible("textSize") && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.textSize")}
                      </span>
                      <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t("settings.textSizeHint")}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl"
                      role="group"
                      aria-label={t("settings.textSize")}
                    >
                      {(["standard", "large", "xlarge"] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setAccessibility({ textSize: sz })}
                          aria-pressed={textSize === sz}
                          className={`min-h-[44px] min-w-[44px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-sans font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                            textSize === sz
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {sz === "standard" ? "100%" : sz === "large" ? "125%" : "150%"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Surface>
            </section>
          )}

          {/* SECTION 2: LANGUAGE & NUMERALS */}
          {(isVisible("interfaceLanguage") || isVisible("numeralSystem")) && (
            <section className="flex flex-col gap-3" aria-labelledby="heading-language">
              <h2
                id="heading-language"
                className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Languages className="size-4 text-wp-blue-foreground" aria-hidden="true" />
                <span>{t("settings.typographyHeading")}</span>
              </h2>

              <Surface className="p-5 flex flex-col gap-5 border border-border">
                {/* Interface Language */}
                {isVisible("interfaceLanguage") && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.interfaceLanguage")}
                      </span>
                      <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t("settings.interfaceLanguageHint")}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl shrink-0"
                      role="group"
                      aria-label={t("settings.interfaceLanguage")}
                    >
                      {SUPPORTED_LANGS.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setInterfaceLang(lang)}
                          aria-pressed={interfaceLang === lang}
                          lang={lang}
                          className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-sans font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                            interfaceLang === lang
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {lang === "ar" ? t("settings.arabic") : t("settings.english")}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isVisible("interfaceLanguage") && isVisible("numeralSystem") && (
                  <hr className="border-border/60" />
                )}

                {/* Numeral System */}
                {isVisible("numeralSystem") && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.numeralSystem")}
                      </span>
                      <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t("settings.numeralSystemHint")}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl"
                      role="group"
                      aria-label={t("settings.numeralSystem")}
                    >
                      <button
                        type="button"
                        onClick={() => setAccessibility({ numeralSystem: "western" })}
                        aria-pressed={numeralSystem === "western"}
                        className={`min-h-[44px] min-w-[44px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-sans font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                          numeralSystem === "western"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {"1, 2, 3"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccessibility({ numeralSystem: "arabic" })}
                        aria-pressed={numeralSystem === "arabic"}
                        className={`min-h-[44px] min-w-[44px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-sans font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                          numeralSystem === "arabic"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {"١, ٢, ٣"}
                      </button>
                    </div>
                  </div>
                )}
              </Surface>
            </section>
          )}

          {/* SECTION 3: AUDIO & PRONUNCIATION */}
          {(isVisible("speechRate") || isVisible("voiceEngine") || isVisible("spokenFeedback")) && (
            <section className="flex flex-col gap-3" aria-labelledby="heading-audio">
              <h2
                id="heading-audio"
                className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <Volume2 className="size-4 text-wp-amber-foreground" aria-hidden="true" />
                <span>{t("settings.audioHeading")}</span>
              </h2>

              <Surface className="p-5 flex flex-col gap-5 border border-border">
                {/* Audio Speech Rate */}
                {isVisible("speechRate") && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.speechRate")}
                      </span>
                      <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t("settings.speechRateHint")}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl"
                      role="group"
                      aria-label={t("settings.speechRate")}
                    >
                      {SPEECH_RATES.map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => setAccessibility({ speechRate: sp })}
                          aria-pressed={speechRate === sp}
                          className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-sans font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                            speechRate === sp
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {`${sp}x`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isVisible("speechRate") && isVisible("spokenFeedback") && (
                  <hr className="border-border/60" />
                )}

                {/* Spoken Feedback Toggle */}
                {isVisible("spokenFeedback") && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.speakAnswers")}
                      </span>
                      <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t("settings.speakAnswersHint")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccessibility({ spokenFeedback: !spokenFeedback })}
                      aria-pressed={spokenFeedback}
                      aria-label={t("settings.toggleLabel", {
                        setting: t("settings.speakAnswers"),
                        state: spokenFeedback ? t("settings.enabled") : t("settings.disabled"),
                      })}
                      className={`px-4 py-2 min-h-[44px] rounded-full font-sans font-bold text-xs sm:text-sm transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                        spokenFeedback
                          ? "bg-wp-green text-wp-text-on-green border-wp-green"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {spokenFeedback ? t("settings.enabled") : t("settings.disabled")}
                    </button>
                  </div>
                )}

                {isVisible("voiceEngine") && (
                  <>
                    <hr className="border-border/60" />
                    {/* Voice Engine Preview */}
                    <div className="flex flex-col gap-3 bg-muted/40 p-4 rounded-2xl border border-border">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Sparkles
                            className="size-4 text-wp-amber-foreground shrink-0"
                            aria-hidden="true"
                          />
                          <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                            {t("settings.elevenLabsTitle")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => speak("Light switch.")}
                            aria-label={t("settings.testLightSwitchLabel")}
                            className="px-3 py-1.5 min-h-[44px] rounded-xl bg-card text-foreground border border-border hover:border-primary font-sans font-bold text-xs flex items-center gap-1.5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                          >
                            <Volume2 className="size-3.5 text-primary" aria-hidden="true" />
                            <span>{t("settings.testLightSwitch")}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => speak("Vase.")}
                            aria-label={t("settings.testVaseLabel")}
                            className="px-3 py-1.5 min-h-[44px] rounded-xl bg-card text-foreground border border-border hover:border-primary font-sans font-bold text-xs flex items-center gap-1.5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                          >
                            <Volume2 className="size-3.5 text-primary" aria-hidden="true" />
                            <span>{t("settings.testVase")}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => speak("Hello! Welcome to WordPix.")}
                            aria-label={t("settings.testSentenceLabel")}
                            className="px-3 py-1.5 min-h-[44px] rounded-xl bg-card text-foreground border border-border hover:border-primary font-sans font-bold text-xs flex items-center gap-1.5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                          >
                            <Play className="size-3.5 text-primary" aria-hidden="true" />
                            <span>{t("settings.testSentence")}</span>
                          </button>
                        </div>
                      </div>
                      <HelpDisclosure label={t("help.howItWorks")}>
                        <p>{t("settings.audioEngineDesc")}</p>
                      </HelpDisclosure>
                    </div>
                  </>
                )}
              </Surface>
            </section>
          )}

          {/* SECTION 4: LEARNING & DRILL MODALITIES */}
          {(isVisible("targetLevel") ||
            isVisible("speakingDrills") ||
            isVisible("pronunciationExercises") ||
            isVisible("timedExercises") ||
            isVisible("autoAdvance") ||
            isVisible("listeningDrills")) && (
            <section className="flex flex-col gap-3" aria-labelledby="heading-learning">
              <h2
                id="heading-learning"
                className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <ShieldCheck className="size-4 text-wp-teal" aria-hidden="true" />
                <span>{t("settings.goalsHeading")}</span>
              </h2>

              <Surface className="p-5 flex flex-col gap-5 border border-border">
                {/* Target Level */}
                {isVisible("targetLevel") && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.targetLevel")}
                      </span>
                      <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {t("settings.currentLevel", { level: state.preferences.englishLevel })}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl flex-wrap"
                      role="group"
                      aria-label={t("settings.targetLevel")}
                    >
                      {(["A1", "A2", "B1", "B2", "C1", "C2"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setPreferences({ englishLevel: lvl })}
                          aria-pressed={state.preferences.englishLevel === lvl}
                          className={`min-h-[44px] min-w-[44px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-sans font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                            state.preferences.englishLevel === lvl
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isVisible("targetLevel") && isVisible("speakingDrills") && (
                  <hr className="border-border/60" />
                )}

                {/* Speaking Drills */}
                {isVisible("speakingDrills") && (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.speakingDrills")}
                      </span>
                      <HelpDisclosure label={t("help.howItWorks")}>
                        <p>{t("settings.speakingDrillsHint")}</p>
                      </HelpDisclosure>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccessibility({ includeSpeaking: !includeSpeaking })}
                      aria-pressed={includeSpeaking}
                      aria-label={t("settings.toggleLabel", {
                        setting: t("settings.speakingDrills"),
                        state: includeSpeaking ? t("settings.enabled") : t("settings.disabled"),
                      })}
                      className={`px-4 py-2 min-h-[44px] rounded-full font-sans font-bold text-xs sm:text-sm transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                        includeSpeaking
                          ? "bg-wp-green text-wp-text-on-green border-wp-green"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {includeSpeaking ? t("settings.enabled") : t("settings.disabled")}
                    </button>
                  </div>
                )}

                {isVisible("speakingDrills") && isVisible("pronunciationExercises") && (
                  <hr className="border-border/60" />
                )}

                {/* Pronunciation Exercises */}
                {isVisible("pronunciationExercises") && (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.pronunciationExercises")}
                      </span>
                      <HelpDisclosure label={t("help.howItWorks")}>
                        <p>{t("settings.pronunciationExercisesHint")}</p>
                      </HelpDisclosure>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setAccessibility({ includePronunciation: !includePronunciation })
                      }
                      aria-pressed={includePronunciation}
                      aria-label={t("settings.toggleLabel", {
                        setting: t("settings.pronunciationExercises"),
                        state: includePronunciation
                          ? t("settings.enabled")
                          : t("settings.disabled"),
                      })}
                      className={`px-4 py-2 min-h-[44px] rounded-full font-sans font-bold text-xs sm:text-sm transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                        includePronunciation
                          ? "bg-wp-green text-wp-text-on-green border-wp-green"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {includePronunciation ? t("settings.enabled") : t("settings.disabled")}
                    </button>
                  </div>
                )}

                {isVisible("pronunciationExercises") && isVisible("timedExercises") && (
                  <hr className="border-border/60" />
                )}

                {/* Timed Exercises (WCAG 2.2.3 AAA) */}
                {isVisible("timedExercises") && (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.timedExercises")}
                      </span>
                      <HelpDisclosure label={t("help.howItWorks")}>
                        <p>{t("settings.timedExercisesHint")}</p>
                      </HelpDisclosure>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccessibility({ timedExercises: !timedExercises })}
                      aria-pressed={timedExercises}
                      aria-label={t("settings.toggleLabel", {
                        setting: t("settings.timedExercises"),
                        state: timedExercises ? t("settings.enabled") : t("settings.disabled"),
                      })}
                      className={`px-4 py-2 min-h-[44px] rounded-full font-sans font-bold text-xs sm:text-sm transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                        timedExercises
                          ? "bg-wp-green text-wp-text-on-green border-wp-green"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {timedExercises ? t("settings.enabled") : t("settings.disabled")}
                    </button>
                  </div>
                )}

                {isVisible("timedExercises") && isVisible("autoAdvance") && (
                  <hr className="border-border/60" />
                )}

                {/* Auto Advance (WCAG 2.2.1) */}
                {isVisible("autoAdvance") && (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.autoAdvance")}
                      </span>
                      <HelpDisclosure label={t("help.howItWorks")}>
                        <p>{t("settings.autoAdvanceHint")}</p>
                      </HelpDisclosure>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccessibility({ autoAdvance: !autoAdvance })}
                      aria-pressed={autoAdvance}
                      aria-label={t("settings.toggleLabel", {
                        setting: t("settings.autoAdvance"),
                        state: autoAdvance ? t("settings.enabled") : t("settings.disabled"),
                      })}
                      className={`px-4 py-2 min-h-[44px] rounded-full font-sans font-bold text-xs sm:text-sm transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                        autoAdvance
                          ? "bg-wp-green text-wp-text-on-green border-wp-green"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {autoAdvance ? t("settings.enabled") : t("settings.disabled")}
                    </button>
                  </div>
                )}

                {isVisible("autoAdvance") && isVisible("listeningDrills") && (
                  <hr className="border-border/60" />
                )}

                {/* Listening Drills */}
                {isVisible("listeningDrills") && (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="max-w-md">
                      <span className="font-sans font-bold text-foreground text-sm sm:text-base">
                        {t("settings.listeningDrills")}
                      </span>
                      <HelpDisclosure label={t("help.howItWorks")}>
                        <p>{t("settings.listeningDrillsHint")}</p>
                      </HelpDisclosure>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccessibility({ includeListening: !includeListening })}
                      aria-pressed={includeListening}
                      aria-label={t("settings.toggleLabel", {
                        setting: t("settings.listeningDrills"),
                        state: includeListening ? t("settings.enabled") : t("settings.disabled"),
                      })}
                      className={`px-4 py-2 min-h-[44px] rounded-full font-sans font-bold text-xs sm:text-sm transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                        includeListening
                          ? "bg-wp-green text-wp-text-on-green border-wp-green"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {includeListening ? t("settings.enabled") : t("settings.disabled")}
                    </button>
                  </div>
                )}
              </Surface>
            </section>
          )}

          {/* SECTION 5: OFFLINE PRELOAD */}
          {isVisible("offlinePreload") && (
            <section className="flex flex-col gap-3" aria-labelledby="heading-offline">
              <h2
                id="heading-offline"
                className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <CloudDownload className="size-4 text-primary" aria-hidden="true" />
                <span>{t("settings.offlineHeading")}</span>
              </h2>

              <Surface className="p-5 flex flex-col gap-4 border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="max-w-md">
                    <span className="font-sans font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
                      <Wifi className="size-4 text-wp-teal" aria-hidden="true" />
                      <span>
                        {t("vocabularyPreload.title", { count: Object.keys(COURSE_UNITS).length })}
                      </span>
                    </span>
                    <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1">
                      {t("vocabularyPreload.description")}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isPreloading}
                    onClick={handlePreloadAll}
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-sans font-bold text-xs sm:text-sm shadow-xs disabled:opacity-50 transition-all shrink-0 flex items-center justify-center gap-2 min-h-[44px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                  >
                    {isPreloading ? (
                      <span>
                        {t("settings.downloadingProgress", { progress: preloadProgress })}
                      </span>
                    ) : preloadDone ? (
                      <>
                        <CheckCircle2 className="size-4 text-wp-green" aria-hidden="true" />
                        <span>{t("vocabularyPreload.done")}</span>
                      </>
                    ) : (
                      <>
                        <CloudDownload className="size-4" aria-hidden="true" />
                        <span>{t("settings.preloadUnits")}</span>
                      </>
                    )}
                  </button>
                </div>

                {preloadError && (
                  <p role="alert" className="text-sm font-semibold text-wp-rose">
                    {t("vocabularyPreload.error")}
                  </p>
                )}

                {isPreloading && (
                  <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-primary transition-all duration-200 rounded-full"
                      style={{ width: `${preloadProgress}%` }}
                      role="progressbar"
                      aria-valuenow={preloadProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Offline curriculum download progress: ${preloadProgress}%`}
                    />
                  </div>
                )}
              </Surface>
            </section>
          )}

          {/* SECTION 6: DATA MANAGEMENT */}
          {isVisible("dataManagement") && (
            <section className="flex flex-col gap-3" aria-labelledby="heading-data">
              <h2
                id="heading-data"
                className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <AlertTriangle className="size-4 text-wp-rose" aria-hidden="true" />
                <span>{t("settings.categoryData")}</span>
              </h2>

              <div className="bg-wp-rose/10 border border-wp-rose/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="max-w-md">
                  <span className="font-sans font-bold text-wp-rose text-sm sm:text-base">
                    {t("settings.resetHeading")}
                  </span>
                  <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1">
                    {t("settings.resetHint", {
                      defaultValue:
                        "Permanently clears local study progress, review intervals, and streak on this device.",
                    })}
                  </p>
                </div>

                {confirmReset ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        resetToZero();
                        setConfirmReset(false);
                      }}
                      className="px-4 py-2 min-h-[44px] rounded-xl bg-wp-rose text-wp-text-on-rose text-xs sm:text-sm font-sans font-bold shadow-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-rose cursor-pointer"
                    >
                      {t("settings.confirmReset")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="px-4 py-2 min-h-[44px] rounded-xl bg-card text-muted-foreground text-xs sm:text-sm font-sans font-bold border border-border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                    >
                      {t("settings.cancel")}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="px-4 py-2 min-h-[44px] rounded-xl bg-card text-wp-rose border border-wp-rose/30 font-sans font-bold text-xs sm:text-sm hover:bg-wp-rose/20 transition-all shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-rose cursor-pointer"
                  >
                    {t("settings.resetData")}
                  </button>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Live Preview Sticky Sidebar Column */}
        <aside aria-label={t("settings.livePreviewTitle")} className="lg:sticky lg:top-6">
          <Surface className="p-5 border border-border flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                <span>{t("settings.livePreviewTitle")}</span>
              </span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-secondary text-primary">
                {textSize === "standard" ? "100%" : textSize === "large" ? "125%" : "150%"}
              </span>
            </div>

            <p className="font-sans text-xs text-muted-foreground">
              {t("settings.livePreviewDesc")}
            </p>

            {/* Simulated Word Learning Card */}
            <div className="rounded-2xl border border-border bg-background p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>{formatNumber("1 / 20", numeralSystem)}</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  {state.preferences.englishLevel}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-sans font-black text-foreground text-xl sm:text-2xl">
                    {t("settings.previewCardWord")}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {t("settings.previewCardPhonetic")}
                  </span>
                </div>
                <p className="font-sans text-sm font-semibold text-primary">
                  {t("settings.previewCardArabic")}
                </p>
              </div>

              <p className="font-sans text-xs sm:text-sm text-foreground/90 leading-relaxed border-t border-border/50 pt-2">
                {t("settings.livePreviewSentence")}
              </p>

              <button
                type="button"
                onClick={() => speak("Bed. The lamp is on the nightstand beside the bed.")}
                aria-label={`Test pronunciation at ${speechRate}x speed`}
                className="mt-1 w-full min-h-[44px] py-2 px-3 rounded-xl bg-secondary text-primary border border-primary/20 hover:bg-card font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
              >
                <Volume2 className="size-4" aria-hidden="true" />
                <span>{`Pronounce (${speechRate}x)`}</span>
              </button>
            </div>

            {/* Quick Status Pill Bar */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-sans font-semibold text-muted-foreground pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-muted border border-border">
                {resolvedTheme === "dark" ? t("settings.theme.dark") : t("settings.theme.light")}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-muted border border-border">
                {numeralSystem === "arabic" ? "١, ٢, ٣" : "1, 2, 3"}
              </span>
              {highContrast && (
                <span className="px-2.5 py-1 rounded-lg bg-wp-green/15 text-wp-green border border-wp-green/30">
                  {t("settings.enabledContrast")}
                </span>
              )}
              {reduceMotion && (
                <span className="px-2.5 py-1 rounded-lg bg-wp-blue/15 text-wp-blue border border-wp-blue/30">
                  {t("settings.reduceMotion")}
                </span>
              )}
              {!timedExercises && (
                <span className="px-2.5 py-1 rounded-lg bg-wp-amber/15 text-wp-amber-foreground border border-wp-amber/30">
                  {t("settings.timedExercises")}
                </span>
              )}
            </div>
          </Surface>
        </aside>
      </div>
    </PageContainer>
  );
});
