import { memo, useState } from "react";
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

  const [elevenLabsKey, setElevenLabsKey] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("wordpix_elevenlabs_key") || "";
  });

  const handleSaveApiKey = (key: string) => {
    setElevenLabsKey(key);
    if (typeof window !== "undefined") {
      if (key.trim()) {
        localStorage.setItem("wordpix_elevenlabs_key", key.trim());
      } else {
        localStorage.removeItem("wordpix_elevenlabs_key");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-wp-card border-t sm:border border-border rounded-t-[28px] sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-0 sm:my-auto max-h-[92dvh] pb-[env(safe-area-inset-bottom)] sm:pb-0">
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
                Settings &amp; Accessibility
              </h2>
              <p className="font-sans text-xs text-muted-foreground mt-0.5">
                Manage theme modes, audio rates, text sizing, and learning accessibility.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="size-11 min-h-[44px] min-w-[44px] rounded-full border border-border bg-wp-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable Settings Sections) */}
        <div className="p-5 md:p-6 overflow-y-auto flex flex-col gap-6">
          {/* SECTION 1: APPEARANCE & ACCESSIBLE THEMES */}
          <section className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Eye className="size-4 text-primary" />
              <span>Appearance &amp; WCAG 2.2 AAA Contrast</span>
            </h3>

            <div className="bg-muted/30 rounded-2xl p-4 border border-border flex flex-col gap-4">
              {/* Light / Dark Mode Toggle */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">Theme Mode</span>
                  <p className="font-sans text-xs text-muted-foreground">
                    Cycle between Dark, Light, and following your system setting.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={`Theme: ${theme}. Activate to change theme.`}
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

              {/* Learner Expression (Child / Adult Mode) */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    Learner Mode (UI Expression)
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    Adjust density, typography, and illustration style based on age.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPreferences({ expression: "child" })}
                    aria-pressed={state.preferences.expression === "child"}
                    className={`px-3 py-1 rounded-lg text-xs font-sans font-bold ${
                      state.preferences.expression === "child"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Child
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferences({ expression: "adult" })}
                    aria-pressed={state.preferences.expression === "adult"}
                    className={`px-3 py-1 rounded-lg text-xs font-sans font-bold ${
                      state.preferences.expression === "adult"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Adult
                  </button>
                </div>
              </div>

              <hr className="border-border/60" />

              {/* High Contrast Mode */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    High Contrast Mode (AAA 7:1)
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    Boost contrast ratios to 7:1 for enhanced visual readability.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAccessibility({ highContrast: !highContrast })}
                  aria-pressed={highContrast}
                  className={`px-3 py-1.5 rounded-full font-sans font-bold text-xs transition-all border ${
                    highContrast
                      ? "bg-wp-green text-wp-text-on-green border-wp-green"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {highContrast ? "Enabled (7:1)" : "Disabled"}
                </button>
              </div>

              <hr className="border-border/60" />

              {/* Reduce Motion */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">Reduce Motion</span>
                  <p className="font-sans text-xs text-muted-foreground">
                    Minimize or disable animations across the app.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAccessibility({ reduceMotion: !reduceMotion })}
                  aria-pressed={reduceMotion}
                  className={`px-3 py-1.5 rounded-full font-sans font-bold text-xs transition-all border ${
                    reduceMotion
                      ? "bg-wp-green text-wp-text-on-green border-wp-green"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {reduceMotion ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 2: TYPOGRAPHY & NUMERALS */}
          <section className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Type className="size-4 text-wp-blue" />
              <span>Typography &amp; Bidi Numerals</span>
            </h3>

            <div className="bg-muted/30 rounded-2xl p-4 border border-border flex flex-col gap-4">
              {/* Text Size Scaler */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    Text Size Scaling
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    Resize text up to 150% without loss of function.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  {(["standard", "large", "xlarge"] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setAccessibility({ textSize: sz })}
                      aria-pressed={textSize === sz}
                      className={`px-2.5 py-1 rounded-lg text-xs font-sans font-bold transition-all ${
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
                    Numeral System
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    Switch between Western (1, 2, 3) and Arabic-Indic (١, ٢, ٣) numerals.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAccessibility({ numeralSystem: "western" })}
                    aria-pressed={numeralSystem === "western"}
                    className={`px-3 py-1 rounded-lg text-xs font-sans font-bold ${numeralSystem === "western" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                  >
                    1, 2, 3
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccessibility({ numeralSystem: "arabic" })}
                    aria-pressed={numeralSystem === "arabic"}
                    className={`px-3 py-1 rounded-lg text-xs font-sans font-bold ${numeralSystem === "arabic" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                  >
                    ١, ٢, ٣
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: AUDIO & ACCESSIBILITY CONTROLS */}
          <section className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Volume2 className="size-4 text-wp-amber" />
              <span>Audio Speech &amp; Inclusive Modalities</span>
            </h3>

            <div className="bg-muted/30 rounded-2xl p-4 border border-border flex flex-col gap-4">
              {/* Audio Speed */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    Pronunciation Speech Rate
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    Control audio playback speed for learning clarity.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  {SPEECH_RATES.map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => setAccessibility({ speechRate: sp })}
                      aria-pressed={speechRate === sp}
                      className={`px-2.5 py-1 rounded-lg text-xs font-sans font-bold transition-all ${
                        speechRate === sp
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {sp}x
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
                      ElevenLabs HD Voice &amp; TTS Engine
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => speak("Light switch.")}
                      aria-label="Test pronunciation of Light switch"
                      className="px-2.5 py-1 min-h-[36px] rounded-lg bg-secondary text-primary border border-primary/20 hover:bg-primary/10 font-sans font-bold text-xs flex items-center gap-1 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary cursor-pointer"
                    >
                      <Volume2 className="size-3" aria-hidden />
                      <span>Test &ldquo;Light switch&rdquo;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => speak("Vase.")}
                      aria-label="Test pronunciation of Vase"
                      className="px-2.5 py-1 min-h-[36px] rounded-lg bg-secondary text-primary border border-primary/20 hover:bg-primary/10 font-sans font-bold text-xs flex items-center gap-1 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary cursor-pointer"
                    >
                      <Volume2 className="size-3" aria-hidden />
                      <span>Test &ldquo;Vase&rdquo;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => speak("Hello! Welcome to WordPix.")}
                      aria-label="Test sentence voice"
                      className="px-2.5 py-1 min-h-[36px] rounded-lg bg-secondary text-primary border border-primary/20 hover:bg-primary/10 font-sans font-bold text-xs flex items-center gap-1 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary cursor-pointer"
                    >
                      <Volume2 className="size-3" aria-hidden />
                      <span>Test Sentence</span>
                    </button>
                  </div>
                </div>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                  Using <strong>Alice HD</strong> neural educator voice with offline IndexedDB
                  caching, backed by prioritized Edge/Chrome Natural TTS.
                </p>
                <div className="flex flex-col gap-1.5 mt-1">
                  <label
                    htmlFor="elevenlabs-key-input"
                    className="text-xs font-sans font-semibold text-foreground"
                  >
                    ElevenLabs API Key (Optional Override)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="elevenlabs-key-input"
                      type="password"
                      value={elevenLabsKey}
                      onChange={(e) => handleSaveApiKey(e.target.value)}
                      placeholder="sk_... (paste to enable cloud Alice voice)"
                      className="flex-1 bg-wp-card border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                    />
                    {elevenLabsKey ? (
                      <button
                        type="button"
                        onClick={() => handleSaveApiKey("")}
                        className="text-xs text-muted-foreground hover:text-wp-rose px-2 py-1 font-sans font-semibold"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <hr className="border-border/60" />

              {/* Inclusive Modalities (Enable/Disable Speaking & Listening for Quiet/Deaf environments) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">
                      Include Speaking Drills
                    </span>
                    <p className="font-sans text-xs text-muted-foreground">
                      Disable if practicing in quiet environments.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAccessibility({ includeSpeaking: !includeSpeaking })}
                    aria-pressed={includeSpeaking}
                    className={`px-3 py-1.5 rounded-full font-sans font-bold text-xs transition-all border ${
                      includeSpeaking
                        ? "bg-wp-green text-wp-text-on-green border-wp-green"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {includeSpeaking ? "Enabled" : "Disabled"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">
                      Timed Exercises
                    </span>
                    <p className="font-sans text-xs text-muted-foreground">
                      Turn off to remove every countdown. Timers can also be paused or extended
                      while running.
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
                    {timedExercises ? "On" : "Off"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">
                      Move On Automatically
                    </span>
                    <p className="font-sans text-xs text-muted-foreground">
                      Lessons advance a moment after each answer. Turn off to move on with a button
                      instead.
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
                    {autoAdvance ? "On" : "Off"}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">
                      Speak Answers Aloud
                    </span>
                    <p className="font-sans text-xs text-muted-foreground">
                      Says the word after each answer &mdash; &ldquo;Correct! This is a
                      faucet.&rdquo; / &ldquo;These are pliers.&rdquo; Turn off to keep the chime
                      only.
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
                    {spokenFeedback ? "On" : "Off"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">
                      Include Listening Drills
                    </span>
                    <p className="font-sans text-xs text-muted-foreground">
                      Disable if hard-of-hearing or without headphones.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAccessibility({ includeListening: !includeListening })}
                    aria-pressed={includeListening}
                    className={`px-3 py-1.5 rounded-full font-sans font-bold text-xs transition-all border ${
                      includeListening
                        ? "bg-wp-green text-wp-text-on-green border-wp-green"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {includeListening ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: LEARNING GOALS */}
          <section className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-wp-teal" />
              <span>Target Level &amp; Daily Goals</span>
            </h3>

            <div className="bg-muted/30 rounded-2xl p-4 border border-border flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">
                    Target English Level
                  </span>
                  <p className="font-sans text-xs text-muted-foreground">
                    Current level: {state.preferences.englishLevel}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  {(["A1", "A2", "B1"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPreferences({ englishLevel: lvl })}
                      className={`px-3 py-1 rounded-lg text-xs font-sans font-bold ${
                        state.preferences.englishLevel === lvl
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground"
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
              <span>Offline Readiness &amp; Storage</span>
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
                    <span>Downloading {preloadProgress}%…</span>
                  ) : preloadDone ? (
                    <>
                      <CheckCircle2 className="size-4 text-wp-green" />
                      <span>{t("vocabularyPreload.done")}</span>
                    </>
                  ) : (
                    <>
                      <CloudDownload className="size-4" />
                      <span>Preload All Units</span>
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
                  Reset Progress Data
                </span>
                <p className="font-sans text-xs text-muted-foreground">
                  Reset local memory progress and streak data back to zero.
                </p>
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
                    className="px-3 py-1.5 rounded-xl bg-wp-rose text-wp-text-on-rose text-xs font-sans font-bold shadow-xs"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 rounded-xl bg-wp-card text-muted-foreground text-xs font-sans font-bold border border-border"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="px-3 py-1.5 rounded-xl bg-wp-card text-wp-rose border border-wp-rose/30 font-sans font-bold text-xs hover:bg-wp-rose/20 transition-all shrink-0"
                >
                  Reset Data
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-5 border-t border-border bg-muted/40 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-sans font-bold text-sm shadow-sm transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
});
