import { memo } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";
import { SecondaryButton } from "../shared/SecondaryButton";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const STARS = [true, true, false];

export const LessonCompleteResults = memo(function LessonCompleteResults({ dispatch }: Props) {
  return (
    <div className="bg-secondary content-stretch flex flex-col items-start justify-between min-h-full relative">
      <StatusBar />

      <main className="flex-1 flex flex-col items-center justify-center w-full px-[24px] gap-[20px]">
        {/* Trophy */}
        <div
          className="bg-wp-amber rounded-full size-[100px] flex items-center justify-center"
          aria-hidden
        >
          <span className="text-[50px]">🏆</span>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-[6px]">
          <h1 className="font-sans font-black text-primary text-[32px] text-center">
            Great Work!
          </h1>
          <p
            className="font-arabic font-bold text-foreground text-[20px] text-center"
            dir="auto"
            lang="ar"
          >
            عمل رائع!
          </p>
        </div>

        {/* Stars */}
        <div className="flex gap-[8px] items-center" aria-label="2 out of 3 stars">
          {STARS.map((filled, i) => (
            <span key={i} className="text-[36px]" aria-hidden>
              {filled ? "⭐" : "☆"}
            </span>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-[10px] w-full">
          {[
            { value: "4",   label: "New Words",  ar: "كلمات",   color: "var(--wp-brand)"  },
            { value: "85%", label: "Accuracy",   ar: "دقة",     color: "var(--wp-blue, #4a90ff)" },
            { value: "+40", label: "XP Earned",  ar: "نقاط",    color: "var(--wp-green)"  },
          ].map(({ value, label, ar, color }) => (
            <div key={label} className="bg-wp-card rounded-xl border border-border p-[12px] flex flex-col items-center gap-[2px]">
              <p className="font-sans font-black text-[20px]" style={{ color }}>{value}</p>
              <p className="font-sans font-medium text-muted-foreground text-[10px] text-center">{label}</p>
              <p
                className="font-arabic text-wp-slate text-[9px]"
                dir="auto"
                lang="ar"
              >
                {ar}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full px-[24px] pb-[40px] flex flex-col gap-[10px]">
        <PrimaryButton
          label="Continue to Next"
          onClick={() => dispatch({ type: "GO", to: "explore" })}
        />
        <SecondaryButton
          label="Practice Again"
          onClick={() => dispatch({ type: "START_LESSON" })}
        />
      </footer>

      <HomeIndicator />
    </div>
  );
});
