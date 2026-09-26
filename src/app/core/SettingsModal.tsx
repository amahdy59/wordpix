import { memo, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Sun,
  Moon,
  Volume2,
  Type,
  Sliders,
  ShieldCheck,
  Eye,
  Sparkles,
  CloudDownload,
  CheckCircle2,
  Wifi,
} from "lucide-react";
import { useLearner } from "../context/LearnerContext";
import { useTheme } from "../shared/ThemeToggle";
import { useI18n, SUPPORTED_LANGS } from "../context/I18nContext";
import { useAccessibility } from "../shared/useAccessibilityPreferences";
import { useAudio } from "../shared/useAudio";
import { useModalA11y } from "../shared/useModalA11y";
import { Button } from "../shared/Button";
import { IconButton } from "../shared/IconButton";
import { COURSE_UNITS } from "../data/lessons";
import { loadUnitVocabulary } from "../data/vocabulary";

/** Speech rates offered in Settings, slowest first. */
const SPEECH_RATES = [0.5, 0.75, 1] as const;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = memo(function SettingsModal({ isOpen, onClose }: Props) {
  const { state, setPreferences, resetToZero } = useLearner();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { t, interfaceLang, setInterfaceLang } = useI18n();
  const { speak } = useAudio();

  // These six were local useState that nothing read: the controls moved when
  // clicked and changed nothing, then discarded the value on close. They are
  // now the persisted accessibility slice, applied by real consumers.
  const { accessibility, setAccessibility } = useAccessibility();
  const {
    textSize,
    highContrast,
    speechRate,
    numeralSystem,
    includeSpeaking,
    includeListening,
    timedExercises,
    autoAdvance,
    spokenFeedback,
    reduceMotion,
  } = accessibility;
  const [confirmReset, setConfirmReset] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [preloadDone, setPreloadDone] = useState(false);
  const [preloadError, setPreloadError] = useState(false);

  // Trap Tab inside, close on Escape, mark the background inert, and restore
  // focus on close — the same contract every other modal keeps. The hook is
  // called before the early return below so hook order stays stable.
  const containerRef = useModalA11y({ isOpen, onDismiss: onClose });

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
        await Promise.all(batch.map((id) => loadUnitVocabulary(id)));
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

  if (!isOpen) return null;

  // Portalled to <body> so the #root inert background marking applies to the
  // whole app behind the dialog, matching the other modals.
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
        tabIndex={-1}
        className="bg-wp-card border-t sm:border border-border rounded-t-[28px] sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-0 sm:my-auto max-h-[92dvh] pb-[env(safe-area-inset-bottom)] sm:pb-0 outline-none"
      >
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Sliders className="size-5" />
            </div>
            <div>
              <h2
                id="settings-dialog-title"
                className="font-sans font-black text-foreground text-xl md:text-2xl leading-tight"
              >
                {t("settings.title")}
              </h2>
              <p className="font-sans text-xs text-muted-foreground mt-0.5">
                {t("settings.subtitle")}
              </p>
            </div>
          </div>

          <IconButton
            icon={<X className="size-5" />}
            aria-label={t("settings.closeLabel")}
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-full bg-wp-card"
          />
        </div>

        {/* Modal Body (Scrollable Settings Sections) */}
        <div className="p-5 md:p-6 overflow-y-auto flex flex-col gap-6">
          {/* SECTION 1: APPEARANCE & ACCESSIBLE THEMES */}
          <section className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Eye className="size-4 text-primary" />
              <span>{t("settings.appearanceHeading")}</span>
            </h3>

            <div className="bg-muted/30 rounded-2xl p-4 border border-border flex flex-col gap-4">
              {/* Light / Dark Mode Toggle */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    {t("settings.themeMode")}
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    {t("settings.themeModeHint")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={`${t("settings.themeLabel")}: ${theme}. ${t("settings.themeActivate")}`}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-wp-card border border-border hover:border-primary font-sans font-bold text-xs text-foreground flex items-center gap-2 shadow-xs transition-all shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {/* resolvedTheme, not theme: "system" is neither "dark" nor
                      "light", so the old ternary always claimed Light Mode. */}
                  {resolvedTheme === "dark" ? (
                    <Sun className="size-4 text-wp-amber" aria-hidden />
                  ) : (
                    <Moon className="size-4 text-wp-blue" aria-hidden />
                  )}
                  <span className="capitalize">{theme}</span>
                </button>
              </div>

              <hr className="border-border/60" />

              {/*
                Interface language. I18nProvider was mounted from the start but
                purely decorative: setInterfaceLang and t() had zero consumers,
                so there was no way to reach Arabic or RTL from the UI.
              */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    {t("settings.interfaceLanguage")}
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    {t("settings.interfaceLanguageHint")}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl shrink-0"
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
                      className={`px-3 py-1.5 min-h-[44px] rounded-lg text-xs font-sans font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
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

              <hr className="border-border/60" />

              {/* High Contrast Mode */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    {t("settings.highContrast")}
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    {t("settings.highContrastHint")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAccessibility({ highContrast: !highContrast })}
                  aria-pressed={highContrast}
                  className={`px-3 py-1.5 min-h-[44px] rounded-full font-sans font-bold text-xs transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    highContrast
                      ? "bg-wp-green text-wp-text-on-green border-wp-green"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {highContrast ? t("settings.enabledContrast") : t("settings.disabled")}
                </button>
              </div>

              <hr className="border-border/60" />

              {/* Reduce Motion */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    {t("settings.reduceMotion")}
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    {t("settings.reduceMotionHint")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAccessibility({ reduceMotion: !reduceMotion })}
                  aria-pressed={reduceMotion}
                  className={`px-3 py-1.5 min-h-[44px] rounded-full font-sans font-bold text-xs transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    reduceMotion
                      ? "bg-wp-green text-wp-text-on-green border-wp-green"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {reduceMotion ? t("settings.enabled") : t("settings.disabled")}
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 2: TYPOGRAPHY & NUMERALS */}
          <section className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Type className="size-4 text-wp-blue" />
              <span>{t("settings.typographyHeading")}</span>
            </h3>

            <div className="bg-muted/30 rounded-2xl p-4 border border-border flex flex-col gap-4">
              {/* Text Size Scaler */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    {t("settings.textSize")}
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    {t("settings.textSizeHint")}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  {(["standard", "large", "xlarge"] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setAccessibility({ textSize: sz })}
                      aria-pressed={textSize === sz}
                      className={`min-h-[44px] min-w-[44px] px-2.5 py-1 rounded-lg text-xs font-sans font-bold transition-all ${
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

              <hr className="border-border/60" />

              {/* Numeral System */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    {t("settings.numeralSystem")}
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    {t("settings.numeralSystemHint")}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAccessibility({ numeralSystem: "western" })}
                    aria-pressed={numeralSystem === "western"}
                    className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
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
                    className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      numeralSystem === "arabic"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {"١, ٢, ٣"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: AUDIO & ACCESSIBILITY CONTROLS */}
          <section className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Volume2 className="size-4 text-wp-amber" />
              <span>{t("settings.audioHeading")}</span>
            </h3>

            <div className="bg-muted/30 rounded-2xl p-4 border border-border flex flex-col gap-4">
              {/* Audio Speed */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    {t("settings.speechRate")}
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    {t("settings.speechRateHint")}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  {SPEECH_RATES.map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => setAccessibility({ speechRate: sp })}
                      aria-pressed={speechRate === sp}
                      className={`min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-lg text-xs font-sans font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
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

              <hr className="border-border/60" />

              {/* ElevenLabs HD Voice */}
              <div className="flex flex-col gap-3 bg-muted/40 p-4 rounded-2xl border border-border">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-wp-amber" aria-hidden />
                    <span className="font-sans font-bold text-foreground text-sm">
                      {t("settings.elevenLabsTitle")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => speak("Light switch.")}
                      aria-label={t("settings.testLightSwitchLabel")}
                      className="px-2.5 py-1 min-h-[44px] rounded-lg bg-secondary text-primary border border-primary/20 hover:bg-primary/10 font-sans font-bold text-xs flex items-center gap-1 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary cursor-pointer"
                    >
                      <Volume2 className="size-3" aria-hidden />
                      <span>{t("settings.testLightSwitch")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => speak("Vase.")}
                      aria-label={t("settings.testVaseLabel")}
                      className="px-2.5 py-1 min-h-[44px] rounded-lg bg-secondary text-primary border border-primary/20 hover:bg-primary/10 font-sans font-bold text-xs flex items-center gap-1 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary cursor-pointer"
                    >
                      <Volume2 className="size-3" aria-hidden />
                      <span>{t("settings.testVase")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => speak("Hello! Welcome to WordPix.")}
                      aria-label={t("settings.testSentenceLabel")}
                      className="px-2.5 py-1 min-h-[44px] rounded-lg bg-secondary text-primary border border-primary/20 hover:bg-primary/10 font-sans font-bold text-xs flex items-center gap-1 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary cursor-pointer"
                    >
                      <Volume2 className="size-3" aria-hidden />
                      <span>{t("settings.testSentence")}</span>
                    </button>
                  </div>
                </div>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                  {t("settings.audioEngineDesc")}
                </p>
              </div>

              <hr className="border-border/60" />

              {/* Inclusive Modalities (Enable/Disable Speaking & Listening for Quiet/Deaf environments) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">
                      {t("settings.speakingDrills")}
                    </span>
                    <p className="font-sans text-xs text-muted-foreground">
                      {t("settings.speakingDrillsHint")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAccessibility({ includeSpeaking: !includeSpeaking })}
                    aria-pressed={includeSpeaking}
                    className={`px-3 py-1.5 min-h-[44px] rounded-full font-sans font-bold text-xs transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      includeSpeaking
                        ? "bg-wp-green text-wp-text-on-green border-wp-green"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {includeSpeaking ? t("settings.enabled") : t("settings.disabled")}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">
                      {t("settings.timedExercises")}
                    </span>
                    <p className="font-sans text-xs text-muted-foreground">
                      {t("settings.timedExercisesHint")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAccessibility({ timedExercises: !timedExercises })}
                    aria-pressed={timedExercises}
                    className={`px-3 py-1.5 min-h-[44px] rounded-full font-sans font-bold text-xs transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      timedExercises
                        ? "bg-wp-green text-wp-text-on-green border-wp-green"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {timedExercises ? t("settings.enabled") : t("settings.disabled")}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">
                      {t("settings.autoAdvance")}
                    </span>
                    <p className="font-sans text-xs text-muted-foreground">
                      {t("settings.autoAdvanceHint")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAccessibility({ autoAdvance: !autoAdvance })}
                    aria-pressed={autoAdvance}
                    className={`px-3 py-1.5 min-h-[44px] rounded-full font-sans font-bold text-xs transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      autoAdvance
                        ? "bg-wp-green text-wp-text-on-green border-wp-green"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {autoAdvance ? t("settings.enabled") : t("settings.disabled")}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">
                      {t("settings.speakAnswers")}
                    </span>
                    <p className="font-sans text-xs text-muted-foreground">
                      {t("settings.speakAnswersHint")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAccessibility({ spokenFeedback: !spokenFeedback })}
                    aria-pressed={spokenFeedback}
                    className={`shrink-0 px-3 py-1.5 min-h-[44px] rounded-full font-sans font-bold text-xs transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      spokenFeedback
                        ? "bg-wp-green text-wp-text-on-green border-wp-green"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {spokenFeedback ? t("settings.enabled") : t("settings.disabled")}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">
                      {t("settings.listeningDrills")}
                    </span>
                    <p className="font-sans text-xs text-muted-foreground">
                      {t("settings.listeningDrillsHint")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAccessibility({ includeListening: !includeListening })}
                    aria-pressed={includeListening}
                    className={`px-3 py-1.5 min-h-[44px] rounded-full font-sans font-bold text-xs transition-all border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      includeListening
                        ? "bg-wp-green text-wp-text-on-green border-wp-green"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {includeListening ? t("settings.enabled") : t("settings.disabled")}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: LEARNING GOALS */}
          <section className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-wp-teal" />
              <span>{t("settings.goalsHeading")}</span>
            </h3>

            <div className="bg-muted/30 rounded-2xl p-4 border border-border flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    {t("settings.targetLevel")}
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    {t("settings.currentLevel", { level: state.preferences.englishLevel })}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  {(["A1", "A2", "B1"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPreferences({ englishLevel: lvl })}
                      className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
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
            </div>
          </section>

          {/* SECTION 5: OFFLINE READINESS & PRELOAD */}
          <section className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CloudDownload className="size-4 text-primary" />
              <span>{t("settings.offlineHeading")}</span>
            </h3>

            <div className="bg-muted/30 rounded-2xl p-4 border border-border flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm flex items-center gap-2">
                    <Wifi className="size-4 text-wp-teal" />
                    <span>
                      {t("vocabularyPreload.title", { count: Object.keys(COURSE_UNITS).length })}
                    </span>
                  </span>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">
                    {t("vocabularyPreload.description")}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isPreloading}
                  onClick={handlePreloadAll}
                  className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-sans font-bold text-xs shadow-xs hover:opacity-90 disabled:opacity-50 transition-all shrink-0 flex items-center justify-center gap-2 min-h-[44px]"
                >
                  {isPreloading ? (
                    <span>{t("settings.downloadingProgress", { progress: preloadProgress })}</span>
                  ) : preloadDone ? (
                    <>
                      <CheckCircle2 className="size-4 text-wp-green" />
                      <span>{t("vocabularyPreload.done")}</span>
                    </>
                  ) : (
                    <>
                      <CloudDownload className="size-4" />
                      <span>{t("settings.preloadUnits")}</span>
                    </>
                  )}
                </button>
              </div>

              {preloadError && <p role="alert">{t("vocabularyPreload.error")}</p>}
              {isPreloading && (
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-1">
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
            </div>
          </section>

          {/* SECTION 6: DATA MANAGEMENT */}
          <section className="flex flex-col gap-3 pt-2">
            <div className="bg-wp-rose/10 border border-wp-rose/20 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <span className="font-sans font-bold text-wp-rose text-sm">
                  {t("settings.resetHeading")}
                </span>
                <p className="font-sans text-xs text-muted-foreground">{t("settings.resetHint")}</p>
              </div>

              {confirmReset ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetToZero();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="px-3.5 py-2 min-h-[44px] rounded-xl bg-wp-rose text-wp-text-on-rose text-xs font-sans font-bold shadow-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-rose cursor-pointer"
                  >
                    {t("settings.confirmReset")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-3.5 py-2 min-h-[44px] rounded-xl bg-wp-card text-muted-foreground text-xs font-sans font-bold border border-border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                  >
                    {t("settings.cancel")}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="px-3.5 py-2 min-h-[44px] rounded-xl bg-wp-card text-wp-rose border border-wp-rose/30 font-sans font-bold text-xs hover:bg-wp-rose/20 transition-all shrink-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-rose cursor-pointer"
                >
                  {t("settings.resetData")}
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-5 border-t border-border bg-muted/40 flex items-center justify-end shrink-0">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto px-6"
          >
            {t("settings.done")}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
});
