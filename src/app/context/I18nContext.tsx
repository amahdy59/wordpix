import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import en from "../../i18n/en.json";
import ar from "../../i18n/ar.json";

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
 * inlined in this file, plus src/i18n/en.json and src/i18n/ar.json — and none
 * of the three were used, because t() and setInterfaceLang had zero consumers.
 * The JSON files are now the only copy store.
 */
const BUNDLES: Record<InterfaceLang, unknown> = { en, ar };

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
  const dir = interfaceLang === "ar" ? "rtl" : "ltr";

  const setInterfaceLang = useCallback((lang: InterfaceLang) => {
    setInterfaceLangState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Persistence is best-effort; the choice still applies this session.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = interfaceLang;
    document.documentElement.dir = dir;
  }, [interfaceLang, dir]);

  const t = useCallback(
    (key: string, values?: TranslationValues): string => {
      // Fall back through the active language, then English, then the key
      // itself — a visible key is a better bug report than an empty string.
      const template = lookup(BUNDLES[interfaceLang], key) ?? lookup(BUNDLES.en, key) ?? key;
      return interpolate(template, values);
    },
    [interfaceLang]
  );

  const value = useMemo<I18nContextType>(
    () => ({ interfaceLang, learningLang: "en", dir, setInterfaceLang, t }),
    [interfaceLang, dir, setInterfaceLang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
