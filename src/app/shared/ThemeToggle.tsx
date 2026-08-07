import { memo, useSyncExternalStore } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  cycleTheme,
  getServerTheme,
  getTheme,
  resolveTheme,
  setTheme,
  subscribeToTheme,
  type ThemeMode,
} from "./themeStore";

export type { ThemeMode };

/**
 * Reads the shared theme store. Every consumer sees the same value, so
 * switching the theme in Settings immediately updates the toggle in Profile.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);
  return { theme, resolvedTheme: resolveTheme(theme), setTheme, toggleTheme: cycleTheme };
}

const THEME_LABEL: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Theme: ${THEME_LABEL[theme]}. Activate to change theme.`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-wp-card text-foreground hover:bg-muted text-xs font-sans font-bold transition-all min-h-[44px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {theme === "dark" ? (
        <Moon className="size-4 text-wp-teal" aria-hidden />
      ) : theme === "light" ? (
        <Sun className="size-4 text-wp-amber" aria-hidden />
      ) : (
        <Monitor className="size-4 text-primary" aria-hidden />
      )}
      <span>{THEME_LABEL[theme]}</span>
    </button>
  );
});
