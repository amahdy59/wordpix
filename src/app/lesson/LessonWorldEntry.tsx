import { memo } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { BackButton } from "../shared/BackButton";

const imgBedroom = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const PROGRESS_ITEMS = [
  { label: "New Words",  ar: "كلمات جديدة", count: 4, remaining: "4 remaining", color: "var(--wp-brand)",  bgColor: "var(--wp-brand-light)" },
  { label: "Practice",   ar: "تدريب",        count: 4, remaining: "4 to review", color: "var(--wp-amber)",  bgColor: "#fffbdd" },
  { label: "Mastered",   ar: "متقن",         count: 4, remaining: "4 done",      color: "var(--wp-green)",  bgColor: "#e8f7f0" },
];

export const LessonWorldEntry = memo(function LessonWorldEntry({ dispatch }: Props) {
  return (
    <div className="bg-background content-stretch flex flex-col items-start justify-between min-h-full relative">
      <StatusBar />

      <header className="flex items-center gap-[12px] px-[20px] py-[12px] w-full">
        <BackButton onClick={() => dispatch({ type: "GO", to: "explore" })} />
        <h1 className="font-sans font-bold text-foreground text-[18px] flex-1">
          The Bedroom
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col gap-[16px] px-[20px] pb-[20px] w-full">
          {/* Hero image */}
          <div className="h-[220px] relative rounded-2xl w-full overflow-hidden">
            <img
              alt="The Bedroom world — learn vocabulary in this setting"
              className="absolute inset-0 object-cover size-full"
              src={imgBedroom}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" aria-hidden />
            <div className="absolute bottom-[12px] left-[16px]">
              <p
                className="font-arabic font-bold text-white text-[14px]"
                dir="auto"
                lang="ar"
              >
                غرفة النوم
              </p>
            </div>
          </div>

          {/* Progress items */}
          <section aria-label="Lesson progress" className="flex flex-col gap-[10px]">
            {PROGRESS_ITEMS.map(({ label, ar, count, remaining, color, bgColor }) => (
              <div
                key={label}
                className="bg-wp-card rounded-xl border border-border p-[14px] flex items-center gap-[12px]"
              >
                <div
                  className="rounded-lg size-[44px] flex items-center justify-center shrink-0 font-sans font-black text-[18px]"
                  style={{ background: bgColor, color }}
                  aria-hidden
                >
                  {count}
                </div>
                <div className="flex flex-col gap-[2px]">
                  <p className="font-sans font-semibold text-foreground text-[15px]">{label}</p>
                  <p
                    className="font-arabic text-primary text-[11px]"
                    dir="auto"
                    lang="ar"
                  >
                    {ar}
                  </p>
                  <p className="font-sans text-muted-foreground text-[12px]">{remaining}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      <footer className="w-full px-[20px] pb-[40px] pt-[12px]">
        <button
          onClick={() => dispatch({ type: "START_LESSON" })}
          className="bg-wp-blue rounded-xl py-[16px] w-full font-sans font-bold text-white text-[17px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wp-blue min-h-[56px]"
        >
          Start Lesson
        </button>
      </footer>

      <HomeIndicator />
    </div>
  );
});
