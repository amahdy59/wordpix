import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";

import imgMascot from "@/imports/FlowOnboardingCoreNavigation-1/ddef533e320d6bd56dd7f984308508eb3a9d2d4e.png";
import imgIllustration from "@/imports/FlowOnboardingCoreNavigation-1/5a83af8fd769c0a4d4fe19848405048f59c1677d.png";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export function SplashWelcome({ dispatch }: Props) {
  const advance = () => dispatch({ type: "ONBOARD_NEXT" });

  return (
    <div className="bg-secondary content-stretch flex flex-col items-start justify-between min-h-full overflow-clip relative">
      <StatusBar />

      <main className="flex-1 flex flex-col items-center w-full">
        <div className="content-stretch flex flex-col gap-[24px] items-center px-[24px] py-[40px] relative size-full">
          <h1 className="font-sans font-black leading-normal not-italic text-primary text-[48px] text-center">
            WordPix
          </h1>
          <p className="font-sans font-semibold leading-normal not-italic text-muted-foreground text-[18px] text-center">
            Learn English Through Pictures
          </p>

          {/* Mascot */}
          <div className="relative shrink-0 size-[180px]" aria-hidden>
            <img
              alt=""
              className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-full size-full"
              src={imgMascot}
            />
          </div>

          {/* Preview illustration */}
          <div className="h-[200px] relative rounded-3xl shrink-0 w-full">
            <img
              alt="Preview of WordPix lesson screens"
              className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-3xl size-full"
              src={imgIllustration}
            />
          </div>
        </div>
      </main>

      <footer className="w-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center pb-[40px] px-[24px] relative size-full">
          <button
            onClick={advance}
            dir="auto"
            lang="ar"
            className="font-arabic font-medium leading-normal not-italic text-primary text-[14px] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
          >
            ابدأ الآن
          </button>
          <PrimaryButton label="Get Started" onClick={advance} />
        </div>
      </footer>

      <HomeIndicator />
    </div>
  );
}
