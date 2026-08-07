import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type InterfaceLang = "en" | "ar";
export type LearningLang = "en";

export interface I18nContextType {
  interfaceLang: InterfaceLang;
  learningLang: LearningLang;
  dir: "ltr" | "rtl";
  setInterfaceLang: (lang: InterfaceLang) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<InterfaceLang, Record<string, string>> = {
  en: {
    "app.title": "WordPix",
    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.practice": "Practice",
    "nav.profile": "Profile",
    "dashboard.today": "TODAY",
    "dashboard.review": "REVIEW",
    "dashboard.your_learning": "YOUR LEARNING",
    "dashboard.this_week": "THIS WEEK",
    "btn.continue": "Continue",
    "btn.start_review": "Start Review",
    "offline.available": "Bedroom available offline",
  },
  ar: {
    "app.title": "ورد بكس",
    "nav.home": "الرئيسية",
    "nav.explore": "استكشف",
    "nav.practice": "مراجعة",
    "nav.profile": "الملف الشخصي",
    "dashboard.today": "اليوم",
    "dashboard.review": "المراجعة",
    "dashboard.your_learning": "تقدمك في التعلم",
    "dashboard.this_week": "هذا الأسبوع",
    "btn.continue": "متابعة",
    "btn.start_review": "بدء المراجعة",
    "offline.available": "غرفة النوم متاحة بدون اتصال",
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [interfaceLang, setInterfaceLangState] = useState<InterfaceLang>("en");
  const dir = interfaceLang === "ar" ? "rtl" : "ltr";

  const setInterfaceLang = useCallback((lang: InterfaceLang) => {
    setInterfaceLangState(lang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = interfaceLang;
    document.documentElement.dir = dir;
  }, [interfaceLang, dir]);

  const t = useCallback(
    (key: string): string => {
      return TRANSLATIONS[interfaceLang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
    },
    [interfaceLang]
  );

  return (
    <I18nContext.Provider
      value={{
        interfaceLang,
        learningLang: "en",
        dir,
        setInterfaceLang,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
