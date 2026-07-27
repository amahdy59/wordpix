import { useState } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";

import imgAnimals from "@/imports/FlowOnboardingCoreNavigation-1/e934731cb8e0ac1e7ce19bafd775a2cd90468b6c.png";
import imgFood    from "@/imports/FlowOnboardingCoreNavigation-1/a45bee08c1ec0a9776cb1955d0c7c590b0b43239.png";
import imgSports  from "@/imports/FlowOnboardingCoreNavigation-1/594036e7d8d0809b0e9099479195e4060da62013.png";
import imgMusic   from "@/imports/FlowOnboardingCoreNavigation-1/2bf4d00c66ec695b9c91dfd82dc3e6d3feee47b0.png";
import imgScience from "@/imports/FlowOnboardingCoreNavigation-1/cfd53626b957357f28a327c9f44c1e6e1c48db46.png";
import imgTravel  from "@/imports/FlowOnboardingCoreNavigation-1/be163166fc4abc165fc0eb15d39db027f5bb6940.png";

interface Props {
  dispatch: React.Dispatch<Action>;
}

interface Topic {
  id: string;
  label: string;
  ar: string;
  img: string;
}

const TOPICS: Topic[] = [
  { id: "animals", label: "Animals", ar: "الحيوانات", img: imgAnimals },
  { id: "food",    label: "Food",    ar: "الطعام",    img: imgFood    },
  { id: "sports",  label: "Sports",  ar: "الرياضة",   img: imgSports  },
  { id: "music",   label: "Music",   ar: "الموسيقى",  img: imgMusic   },
  { id: "science", label: "Science", ar: "العلوم",    img: imgScience },
  { id: "travel",  label: "Travel",  ar: "السفر",     img: imgTravel  },
];

export function InterestSelect({ dispatch }: Props) {
  const [sel, setSel] = useState<Set<string>>(new Set(["animals", "food"]));

  const toggle = (id: string) =>
    setSel((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="bg-background content-stretch flex flex-col items-start justify-between min-h-full relative">
      <StatusBar />

      <main className="flex-1 overflow-y-auto w-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start px-[24px] py-[20px] relative w-full">
          <h1 className="font-sans font-bold leading-[30px] not-italic text-foreground text-[20px] text-center w-full">
            What do you like?
          </h1>
          <p
            className="font-arabic font-bold leading-normal not-italic text-primary text-[22px] text-center w-full"
            dir="auto"
            lang="ar"
          >
            ماذا تحب؟
          </p>

          {/* Multi-select topic grid */}
          <div
            role="group"
            aria-label="Select topics you enjoy"
            className="grid grid-cols-2 gap-[12px] w-full"
          >
            {TOPICS.map((t) => {
              const isActive = sel.has(t.id);
              return (
                <button
                  key={t.id}
                  aria-pressed={isActive}
                  onClick={() => toggle(t.id)}
                  className="bg-wp-card relative rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <div
                    aria-hidden
                    className={`absolute ${isActive ? "border-3 border-primary" : "border border-border"} border-solid inset-0 pointer-events-none rounded-2xl`}
                  />
                  {isActive && (
                    <div
                      aria-hidden
                      className="absolute top-[8px] right-[8px] size-[20px] bg-primary rounded-full flex items-center justify-center"
                    >
                      <svg fill="none" height="10" viewBox="0 0 10 10" width="10">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                  <div className="content-stretch flex flex-col gap-[8px] items-center p-[12px] relative size-full">
                    <div className="h-[64px] relative rounded-lg shrink-0 w-full">
                      <img
                        alt={t.label}
                        className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-lg size-full"
                        src={t.img}
                      />
                    </div>
                    <span
                      className={`font-sans font-semibold leading-[20px] not-italic text-[14px] ${isActive ? "text-primary" : "text-foreground"}`}
                    >
                      {t.label}
                    </span>
                    <span
                      className="font-arabic font-normal leading-normal text-muted-foreground text-[11px]"
                      dir="auto"
                      lang="ar"
                    >
                      {t.ar}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {sel.size > 0 && (
        <footer className="w-full">
          <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] pb-[40px] pt-[12px] relative size-full">
            <PrimaryButton label="Continue" onClick={() => dispatch({ type: "ONBOARD_NEXT" })} />
          </div>
        </footer>
      )}

      <HomeIndicator />
    </div>
  );
}
