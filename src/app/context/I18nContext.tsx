import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import en from "../../i18n/en.json";
// NOTE: the Arabic bundle is intentionally NOT statically imported. It
// arrives via dynamic import() on language switch (see getLocaleBundle), so
// the initial bundle ships the default/fallback locale only. Static JSON
// imports are inlined by Vite — importing both up front cost every first
// paint ~59 KB of Arabic copy most sessions never display.

export type InterfaceLang = "en" | "ar";
export type LearningLang = "en";

export type TranslationValues = Record<string, string | number>;

export interface I18nContextType {
  interfaceLang: InterfaceLang;
  learningLang: LearningLang;
  dir: "ltr" | "rtl";
  setInterfaceLang: (lang: InterfaceLang) => void;
  /** Look up a dotted key, e.g. t("nav.home"), with optional {placeholder} values. */
  t: (key: string, values?: TranslationValues) => string;
}

/**
 * Single source of truth for copy.
 *
 * Translations previously existed in three places at once: a TRANSLATIONS map
 * inlined in this file, plus src/i18n/en.json and src/i18n/ar.json. The JSON
 * files are now the only copy store: English ships synchronously (it is both
 * the default language and the lookup fallback), every other locale loads on
 * demand and is cached for the session, so both languages keep working
 * offline after their first load.
 */
type LazyLang = Exclude<InterfaceLang, "en">;

/** Session cache: one promise per locale, shared across remounts. */
const localeBundlePromises = new Map<LazyLang, Promise<unknown>>();

/** Loads a non-default locale bundle on demand. Never called for "en". */
function getLocaleBundle(lang: LazyLang): Promise<unknown> {
  const cached = localeBundlePromises.get(lang);
  if (cached) return cached;
  const pending = (async (): Promise<unknown> => {
    if (lang === "ar") {
      const mod = (await import("../../i18n/ar.json")) as { default?: unknown };
      return mod.default;
    }
    const _exhaustive: never = lang;
    throw new Error(`No lazy bundle for locale: ${String(_exhaustive)}`);
  })();
  localeBundlePromises.set(lang, pending);
  // A rejection must not poison the cache — the next switch retries.
  void pending.catch(() => {
    localeBundlePromises.delete(lang);
  });
  return pending;
}

const STORAGE_KEY = "wordpix:interface-lang";

export const SUPPORTED_LANGS: InterfaceLang[] = ["en", "ar"];

function isInterfaceLang(value: unknown): value is InterfaceLang {
  return typeof value === "string" && (SUPPORTED_LANGS as string[]).includes(value);
}

function readStoredLang(): InterfaceLang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isInterfaceLang(stored) ? stored : "en";
  } catch {
    return "en";
  }
}

/** Resolves "a.b.c" against a nested bundle. */
export function lookup(bundle: unknown, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((node, segment) => {
    if (node && typeof node === "object" && segment in node) {
      return (node as Record<string, unknown>)[segment];
    }
    return undefined;
  }, bundle);

  return typeof value === "string" ? value : undefined;
}

/** Replaces {name} placeholders. Missing values are left visible, not blanked. */
export function interpolate(template: string, values?: TranslationValues): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match
  );
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [interfaceLang, setInterfaceLangState] = useState<InterfaceLang>(readStoredLang);
  const [lazyBundles, setLazyBundles] = useState<Partial<Record<LazyLang, unknown>>>({});
  const dir = interfaceLang === "ar" ? "rtl" : "ltr";

  const setInterfaceLang = useCallback((lang: InterfaceLang) => {
    // Persist first so a reload mid-fetch still restores the choice.
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Persistence is best-effort; the choice still applies this session.
    }
    setInterfaceLangState(lang);
  }, []);

  // Fetch the non-default locale whenever it becomes active (switch or a
  // restored persisted choice). Until it resolves, t() serves the English
  // fallback — a fully functional UI, never an empty one. A failure clears
  // the cached promise so the next switch retries.
  useEffect(() => {
    if (interfaceLang === "en") return;
    let cancelled = false;
    void getLocaleBundle(interfaceLang).then(
      (bundle) => {
        if (cancelled) return;
        setLazyBundles((prev) =>
          prev[interfaceLang] !== undefined ? prev : { ...prev, [interfaceLang]: bundle }
        );
      },
      () => {
        // English fallback stands; the effect re-runs on the next switch.
      }
    );
    return () => {
      cancelled = true;
    };
  }, [interfaceLang]);

  useEffect(() => {
    document.documentElement.lang = interfaceLang;
    document.documentElement.dir = dir;
  }, [interfaceLang, dir]);

  const t = useCallback(
    (key: string, values?: TranslationValues): string => {
      // Fall back through the active language, then English, then the key
      // itself — a visible key is a better bug report than an empty string.
      const active = interfaceLang === "en" ? en : lazyBundles[interfaceLang];
      const template =
        (active !== undefined ? lookup(active, key) : undefined) ?? lookup(en, key) ?? key;
      return interpolate(template, values);
    },
    [interfaceLang, lazyBundles]
  );

  const value = useMemo<I18nContextType>(
    () => ({ interfaceLang, learningLang: "en", dir, setInterfaceLang, t }),
    [interfaceLang, dir, setInterfaceLang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

const defaultContext: I18nContextType = {
  interfaceLang: "en",
  learningLang: "en",
  dir: "ltr",
  setInterfaceLang: () => {},
  t: (key: string, values?: TranslationValues) => {
    const raw = lookup(en, key);
    if (!raw) return key;
    return interpolate(raw, values);
  },
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  return context ?? defaultContext;
}
