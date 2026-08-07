import { memo, useState } from "react";
import { X, Sun, Moon, Volume2, Type, Globe, Sliders, ShieldCheck, RefreshCw, Eye, Sparkles } from "lucide-react";
import { useLearner } from "../context/LearnerContext";
import { useTheme } from "../shared/ThemeToggle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = memo(function SettingsModal({ isOpen, onClose }: Props) {
  const { state, setPreferences, resetToZero } = useLearner();
  const { theme, toggleTheme } = useTheme();

  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<"standard" | "large" | "xlarge">("standard");
  const [audioSpeed, setAudioSpeed] = useState<"0.5" | "0.75" | "1.0">("0.75");
  const [numeralSystem, setNumeralSystem] = useState<"western" | "arabic">("western");
  const [enableSpeaking, setEnableSpeaking] = useState(true);
  const [enableListening, setEnableListening] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-wp-card border border-border rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Sliders className="size-5" />
            </div>
            <div>
              <h2 id="settings-dialog-title" className="font-sans font-black text-foreground text-xl md:text-2xl leading-tight">
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
            className="size-10 rounded-full border border-border bg-wp-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary"
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
                  <p className="font-sans text-xs text-muted-foreground">Switch between sleek Dark Mode and high-legibility Light Mode.</p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-4 py-2.5 rounded-xl bg-wp-card border border-border hover:border-primary font-sans font-bold text-xs text-foreground flex items-center gap-2 shadow-xs transition-all shrink-0"
                >
                  {theme === "dark" ? <Sun className="size-4 text-wp-amber" /> : <Moon className="size-4 text-wp-blue" />}
                  <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                </button>
              </div>

              <hr className="border-border/60" />

              {/* High Contrast Mode */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans font-bold text-foreground text-sm">High Contrast Mode (AAA 7:1)</span>
                  <p className="font-sans text-xs text-muted-foreground">Boost contrast ratios to 7:1 for enhanced visual readability.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHighContrast((v) => !v)}
                  className={`px-3 py-1.5 rounded-full font-sans font-bold text-xs transition-all border ${
                    highContrast ? "bg-wp-green text-wp-text-on-green border-wp-green" : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {highContrast ? "Enabled (7:1)" : "Disabled"}
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
                  <span className="font-sans font-bold text-foreground text-sm">Text Size Scaling</span>
                  <p className="font-sans text-xs text-muted-foreground">Resize text up to 150% without loss of function.</p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  {(["standard", "large", "xlarge"] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setTextSize(sz)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-sans font-bold transition-all ${
                        textSize === sz ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
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
                  <span className="font-sans font-bold text-foreground text-sm">Numeral System</span>
                  <p className="font-sans text-xs text-muted-foreground">Switch between Western (1, 2, 3) and Arabic-Indic (١, ٢, ٣) numerals.</p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setNumeralSystem("western")}
                    className={`px-3 py-1 rounded-lg text-xs font-sans font-bold ${numeralSystem === "western" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                  >
                    1, 2, 3
                  </button>
                  <button
                    type="button"
                    onClick={() => setNumeralSystem("arabic")}
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
                  <span className="font-sans font-bold text-foreground text-sm">Pronunciation Speech Rate</span>
                  <p className="font-sans text-xs text-muted-foreground">Control audio playback speed for learning clarity.</p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  {(["0.5", "0.75", "1.0"] as const).map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => setAudioSpeed(sp)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-sans font-bold transition-all ${
                        audioSpeed === sp ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-border/60" />

              {/* Inclusive Modalities (Enable/Disable Speaking & Listening for Quiet/Deaf environments) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">Include Speaking Drills</span>
                    <p className="font-sans text-xs text-muted-foreground">Disable if practicing in quiet environments.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableSpeaking((v) => !v)}
                    className={`px-3 py-1.5 rounded-full font-sans font-bold text-xs transition-all border ${
                      enableSpeaking ? "bg-wp-green text-wp-text-on-green border-wp-green" : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {enableSpeaking ? "Enabled" : "Disabled"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-sans font-bold text-foreground text-sm">Include Listening Drills</span>
                    <p className="font-sans text-xs text-muted-foreground">Disable if hard-of-hearing or without headphones.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableListening((v) => !v)}
                    className={`px-3 py-1.5 rounded-full font-sans font-bold text-xs transition-all border ${
                      enableListening ? "bg-wp-green text-wp-text-on-green border-wp-green" : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {enableListening ? "Enabled" : "Disabled"}
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
                  <span className="font-sans font-bold text-foreground text-sm">Target English Level</span>
                  <p className="font-sans text-xs text-muted-foreground">Current level: {state.preferences.englishLevel}</p>
                </div>
                <div className="flex items-center gap-1 bg-wp-card border border-border p-1 rounded-xl">
                  {(["A1", "A2", "B1"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPreferences(lvl, state.preferences.dailyGoalMinutes, state.preferences.goal)}
                      className={`px-3 py-1 rounded-lg text-xs font-sans font-bold ${
                        state.preferences.englishLevel === lvl ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: DATA MANAGEMENT */}
          <section className="flex flex-col gap-3 pt-2">
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <span className="font-sans font-bold text-rose-700 dark:text-rose-400 text-sm">Reset Progress Data</span>
                <p className="font-sans text-xs text-muted-foreground">Reset local memory progress and streak data back to zero.</p>
              </div>

              {confirmReset ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { resetToZero(); setConfirmReset(false); onClose(); }}
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
                  className="px-3 py-1.5 rounded-xl bg-wp-card text-rose-600 border border-rose-500/30 font-sans font-bold text-xs hover:bg-rose-500/20 transition-all shrink-0"
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
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-sans font-bold text-sm shadow-sm transition-all"
          >
            Save &amp; Close Settings
          </button>
        </div>
      </div>
    </div>
  );
});
