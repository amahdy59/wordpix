import { memo, useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "wordpix:theme";

export const ThemeToggle = memo(function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
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

  const toggleNext = () => {
    const next: ThemeMode = theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleNext}
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
