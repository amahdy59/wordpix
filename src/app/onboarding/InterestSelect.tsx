import { useState } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";

const imgAnimals = "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgFood    = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgSports  = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgMusic   = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgScience = "https://images.unsplash.com/photo-1507668077129-56e32842fceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const imgTravel  = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

interface Interest {
  id: string;
  label: string;
  ar: string;
  img: string;
}

const INTERESTS: Interest[] = [
  { id: "animals", label: "Animals & Nature", ar: "حيوانات وطبيعة", img: imgAnimals },
  { id: "food",    label: "Food & Cooking",   ar: "طعام وطبخ",      img: imgFood },
  { id: "sports",  label: "Sports & Fitness",  ar: "رياضة ولياقة",   img: imgSports },
  { id: "music",   label: "Music & Arts",     ar: "موسيقى وفنون",   img: imgMusic },
  { id: "science", label: "Science & Tech",   ar: "علوم وتكنولوجيا", img: imgScience },
  { id: "travel",  label: "Travel & Places",  ar: "سفر وأماكن",     img: imgTravel },
];

export function InterestSelect({ dispatch }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(["food", "travel"]));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-background content-stretch flex flex-col items-start justify-between min-h-full relative">
      <StatusBar />

      <main className="flex-1 overflow-y-auto w-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start px-[24px] py-[20px] relative w-full">
          <h1 className="font-sans font-bold leading-[30px] not-italic text-foreground text-[20px] text-center w-full">
            What topics interest you?
          </h1>
          <p
            className="font-arabic font-bold leading-normal not-italic text-primary text-[22px] text-center w-full"
            dir="auto"
            lang="ar"
          >
            ما هي الموضوعات التي تهمك؟
          </p>
          <p className="font-sans font-normal leading-normal not-italic text-muted-foreground text-[13px] text-center w-full">
            Select one or more to personalize your lessons
          </p>

          <div
            role="group"
            aria-label="Topics of interest"
            className="grid grid-cols-2 gap-[12px] w-full"
          >
            {INTERESTS.map(({ id, label, ar, img }) => {
              const isActive = selected.has(id);
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => toggle(id)}
                  className={`${
                    isActive ? "bg-secondary" : "bg-wp-card"
                  } content-stretch flex flex-col gap-[8px] items-center justify-center p-[12px] relative rounded-2xl shrink-0 w-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px]`}
                >
                  <div
                    aria-hidden
                    className={`absolute ${
                      isActive ? "border-[3px] border-primary" : "border border-border"
                    } border-solid inset-0 pointer-events-none rounded-2xl`}
                  />
                  <div className="h-[64px] relative rounded-xl shrink-0 w-full overflow-hidden">
                    <img
                      alt=""
                      className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-xl size-full"
                      src={img}
                    />
                  </div>
                  <span
                    className={`font-sans font-bold leading-tight ${
                      isActive ? "text-primary" : "text-foreground"
                    } text-[13px] text-center`}
                  >
                    {label}
                  </span>
                  <span
                    className="font-arabic font-medium leading-tight text-muted-foreground text-[11px] text-center"
                    dir="auto"
                    lang="ar"
                  >
                    {ar}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="w-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] pb-[40px] pt-[12px] relative size-full">
          <PrimaryButton
            label="Continue"
            disabled={selected.size === 0}
            onClick={() => dispatch({ type: "ONBOARD_NEXT" })}
          />
        </div>
      </footer>

      <HomeIndicator />
    </div>
  );
}
