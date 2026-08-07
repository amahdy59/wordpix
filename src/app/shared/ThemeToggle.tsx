import { memo, useState, useEffect, useCallback } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "wordpix:theme";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || "system";
  });

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem(STORAGE_KEY, theme);

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) root.classList.add("dark");
      else root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "system" ? "dark" : prev === "dark" ? "light" : "system"));
  }, []);

  return { theme, setTheme: setThemeState, toggleTheme };
}

export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-wp-card text-foreground hover:bg-muted text-xs font-sans font-bold transition-all min-h-[40px]"
    >
      {theme === "dark" ? (
        <Moon className="size-4 text-wp-teal" />
      ) : theme === "light" ? (
        <Sun className="size-4 text-wp-amber" />
      ) : (
        <Monitor className="size-4 text-primary" />
      )}
      <span className="capitalize">{theme}</span>
    </button>
  );
});
