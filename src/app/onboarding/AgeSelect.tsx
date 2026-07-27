import { useState } from "react";
import type { Action } from "../types";
import { AGE_ITEMS } from "../constants";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export function AgeSelect({ dispatch }: Props) {
  const [sel, setSel] = useState(8);

  return (
    <div className="bg-background content-stretch flex flex-col items-start justify-between min-h-full relative">
      <StatusBar />

      <main className="flex-1 overflow-y-auto w-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start px-[24px] py-[20px] relative w-full">
          <h1 className="font-sans font-bold leading-[30px] not-italic text-foreground text-[20px] text-center w-full">
            How old are you?
          </h1>
          <p
            className="font-arabic font-bold leading-normal not-italic text-primary text-[22px] text-center w-full"
            dir="auto"
            lang="ar"
          >
            كم عمرك؟
          </p>

          <fieldset className="border-none p-0 m-0 w-full">
            <legend className="sr-only">Select your age</legend>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              {AGE_ITEMS.map(({ n, ar }) => {
                const isActive = sel === n;
                return (
                  <button
                    key={n}
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setSel(n)}
                    className={`${isActive ? "bg-secondary" : "bg-wp-card"} content-stretch flex flex-col gap-[4px] items-center justify-center p-[16px] relative rounded-3xl shrink-0 w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
                  >
                    <div
                      aria-hidden
                      className={`absolute ${isActive ? "border-3 border-primary" : "border border-border"} border-solid inset-0 pointer-events-none rounded-3xl`}
                    />
                    <span
                      className={`font-sans font-black leading-normal not-italic relative shrink-0 ${isActive ? "text-primary" : "text-foreground"} text-[28px]`}
                    >
                      {n}
                    </span>
                    <span
                      className="font-arabic font-medium leading-normal not-italic relative shrink-0 text-muted-foreground text-[11px]"
                      dir="auto"
                      lang="ar"
                    >
                      {ar}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </main>

      <footer className="w-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] pb-[40px] pt-[12px] relative size-full">
          <PrimaryButton label="Continue" onClick={() => dispatch({ type: "ONBOARD_NEXT" })} />
        </div>
      </footer>

      <HomeIndicator />
    </div>
  );
}
