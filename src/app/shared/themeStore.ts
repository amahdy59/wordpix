export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "wordpix:theme";

const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && (THEME_MODES as string[]).includes(value);
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : "system";
  } catch {
    // Safari private mode and blocked storage both throw on access.
    return "system";
  }
}

/**
 * Single source of truth for the theme.
 *
 * This was previously a plain hook holding its own useState, called
 * independently by ThemeToggle, ProfileStats, and SettingsModal — three
 * separate copies of the same state. Toggling in one left the other two
 * displaying a stale label.
 */
let currentTheme: ThemeMode = readStoredTheme();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeToTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getTheme(): ThemeMode {
  return currentTheme;
}

/** Server snapshot for useSyncExternalStore; the DOM is not involved. */
export function getServerTheme(): ThemeMode {
  return "system";
}

function prefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") return prefersDark() ? "dark" : "light";
  return mode;
}

export function applyThemeToDocument(mode: ThemeMode = currentTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolveTheme(mode) === "dark");
}

export function setTheme(mode: ThemeMode) {
  currentTheme = mode;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Persistence is best-effort; the in-memory theme still applies.
  }
  applyThemeToDocument(mode);
  emit();
}

export function cycleTheme() {
  setTheme(currentTheme === "system" ? "dark" : currentTheme === "dark" ? "light" : "system");
}

/**
 * Keeps "system" honest: without this the OS could flip to dark and the app
 * would stay light until the next reload.
 */
export function startSystemThemeSync(): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};

  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (currentTheme === "system") {
      applyThemeToDocument();
      emit();
    }
  };

  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
