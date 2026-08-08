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

interface ThemeToggleProps {
  /**
   * Icon-only rendering for the 80px icon rail. With the label the control is
   * 92px wide, which overflowed the sidebar by 7px on each side.
   */
  compact?: boolean;
}

export const ThemeToggle = memo(function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const label = `Theme: ${THEME_LABEL[theme]}. Activate to change theme.`;

  const icon =
    theme === "dark" ? (
      <Moon className="size-4 text-wp-teal" aria-hidden />
    ) : theme === "light" ? (
      <Sun className="size-4 text-wp-amber" aria-hidden />
    ) : (
      <Monitor className="size-4 text-primary" aria-hidden />
    );

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={compact ? label : undefined}
      className={`flex items-center justify-center rounded-xl border border-border bg-wp-card text-foreground hover:bg-muted text-xs font-sans font-bold transition-all min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
        compact ? "size-11 shrink-0" : "gap-1.5 px-3 py-1.5"
      }`}
    >
      {icon}
      {!compact && <span>{THEME_LABEL[theme]}</span>}
    </button>
  );
});
