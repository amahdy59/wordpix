import { memo, useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useLearner } from "../context/LearnerContext";
import { useI18n } from "../context/I18nContext";
import type { ThemePreference as ThemeMode } from "../context/LearnerContext";

export type { ThemeMode };

export function useTheme() {
  const { state, setPreferences } = useLearner();
  const theme = state.preferences.theme;
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(theme === "dark" ? "dark" : "light");

  useEffect(() => {
    if (theme !== "system") {
      setResolvedTheme(theme);
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setResolvedTheme(media.matches ? "dark" : "light");
    const listener = (e: MediaQueryListEvent) => setResolvedTheme(e.matches ? "dark" : "light");
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
    setPreferences({ theme: nextTheme });
  };

  return { theme, resolvedTheme, setTheme: (mode: ThemeMode) => setPreferences({ theme: mode }), toggleTheme };
}

interface ThemeToggleProps {
  /**
   * Icon-only rendering for the 80px icon rail. With the label the control is
   * 92px wide, which overflowed the sidebar by 7px on each side.
   * If "responsive", it is compact below lg, and expanded on lg+.
   */
  compact?: boolean | "responsive";
}

export const ThemeToggle = memo(function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  const themeLabel = t(`settings.theme.${theme}`);
  const label = `${t("settings.themeLabel")}: ${themeLabel}. ${t("settings.themeActivate")}`;

  const icon =
    theme === "dark" ? (
      <Moon className="size-4 text-wp-teal" aria-hidden />
    ) : theme === "light" ? (
      <Sun className="size-4 text-wp-amber" aria-hidden />
    ) : (
      <Monitor className="size-4 text-primary" aria-hidden />
    );

  const isCompact = compact === true;
  const isResponsive = compact === "responsive";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={isCompact ? label : undefined}
      className={`flex items-center justify-center rounded-xl border border-border bg-wp-card text-foreground hover:bg-muted text-xs font-sans font-bold transition-all min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
        isCompact 
          ? "size-11 shrink-0" 
          : isResponsive 
            ? "size-11 shrink-0 lg:w-full lg:h-auto lg:gap-3 lg:px-3 lg:py-3 lg:justify-start lg:border-transparent lg:bg-transparent"
            : "gap-1.5 px-3 py-1.5"
      }`}
    >
      <div className={isResponsive ? "shrink-0 flex items-center justify-center size-5" : ""}>
        {icon}
      </div>
      {!isCompact && (
        <span className={isResponsive ? "hidden lg:block ms-1 font-semibold text-sm text-muted-foreground group-hover:text-foreground transition-colors" : ""}>
          {themeLabel}
        </span>
      )}
    </button>
  );
});
