import { useState } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";

import imgFlagAr from "@/imports/FlowOnboardingCoreNavigation-1/016a21d5fc2f3bf5fbf545c3a030d6e5c8330443.png";
import imgFlagEn from "@/imports/FlowOnboardingCoreNavigation-1/58e9c68fd7f805180d881d60341adad27ff8a07b.png";

interface Props {
  dispatch: React.Dispatch<Action>;
}

type LangId = "ar" | "en";

const LANGUAGES: { id: LangId; label: string; sublabel: string; img: string }[] = [
  { id: "ar", label: "العربية", sublabel: "Arabic", img: imgFlagAr },
  { id: "en", label: "English", sublabel: "الإنجليزية", img: imgFlagEn },
];

export function LanguageSelect({ dispatch }: Props) {
  const [sel, setSel] = useState<LangId>("ar");

  return (
    <div className="bg-background content-stretch flex flex-col items-start justify-between min-h-full relative">
      <StatusBar />

      <main className="flex-1 w-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start px-[24px] py-[20px] relative size-full">
          <h1 className="font-sans font-bold leading-[30px] not-italic text-foreground text-[20px] text-center w-full">
            What language do you speak?
          </h1>
          <p
            className="font-arabic font-bold leading-normal not-italic text-primary text-[22px] text-center w-full"
            dir="auto"
            lang="ar"
          >
            ما هي لغتك الأم؟
          </p>

          <div
            role="radiogroup"
            aria-label="Select your native language"
            className="content-stretch flex gap-[16px] items-start justify-center relative shrink-0 w-full"
          >
            {LANGUAGES.map((lang) => {
              const isSelected = sel === lang.id;
              const isArabic = lang.id === "ar";
              return (
                <button
                  key={lang.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSel(lang.id)}
                  className="bg-wp-card flex-[1_0_0] min-w-px min-h-[44px] relative rounded-2xl
                    focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <div
                    aria-hidden
                    className={`absolute ${
                      isSelected ? "border-[3px] border-primary" : "border border-border"
                    } border-solid inset-0 pointer-events-none rounded-2xl`}
                  />
                  <div className="content-stretch flex flex-col gap-[12px] items-center p-[16px] relative size-full">
                    <div className="h-[60px] relative rounded-md shrink-0 w-[80px]">
                      <img
                        alt={isArabic ? "Arabic flag" : "English flag"}
                        className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-md size-full"
                        src={lang.img}
                      />
                    </div>
                    <p
                      className="font-sans font-semibold leading-[20px] text-foreground text-[14px] whitespace-nowrap"
                      dir={isArabic ? "rtl" : "ltr"}
                      lang={isArabic ? "ar" : "en"}
                    >
                      {lang.label}
                    </p>
                    <p
                      className="font-sans font-normal leading-normal text-muted-foreground text-[12px] whitespace-nowrap"
                      dir={isArabic ? "ltr" : "rtl"}
                    >
                      {lang.sublabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="w-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] pb-[40px] relative size-full">
          <PrimaryButton label="Continue" onClick={() => dispatch({ type: "ONBOARD_NEXT" })} />
        </div>
      </footer>

      <HomeIndicator />
    </div>
  );
}
