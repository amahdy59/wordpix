import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { PrimaryButton } from "../shared/PrimaryButton";

const imgMascotCelebration = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

interface Props {
  dispatch: React.Dispatch<Action>;
}

const CONFETTI_COLORS = [
  "var(--wp-amber)",
  "var(--wp-brand)",
  "var(--wp-blue, #4a90ff)",
  "var(--wp-green)",
  "var(--wp-amber)",
] as const;

export function ReadyCelebration({ dispatch }: Props) {
  return (
    <div className="bg-secondary content-stretch flex flex-col items-start justify-between min-h-full relative">
      <StatusBar />

      <main className="flex-1 flex flex-col items-center justify-center w-full px-[24px] gap-[24px]">
        <div aria-hidden className="relative rounded-full shrink-0 size-[180px]">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-full size-full"
            src={imgMascotCelebration}
          />
        </div>

        <div className="flex flex-col items-center gap-[8px]">
          <h1 className="font-sans font-black leading-normal text-primary text-[34px] text-center">
            {"You're all set!"}
          </h1>
          <p
            className="font-arabic font-bold leading-normal text-foreground text-[22px] text-center"
            dir="auto"
            lang="ar"
          >
            أنت جاهز تماماً!
          </p>
        </div>

        <p className="font-sans font-medium leading-normal text-muted-foreground text-[16px] text-center">
          {"Let's begin your English journey with pictures!"}
        </p>

        {/* Decorative confetti dots */}
        <div aria-hidden className="flex gap-[8px] items-center justify-center">
          {CONFETTI_COLORS.map((c, i) => (
            <div
              key={i}
              className="rounded-full shrink-0"
              style={{ background: c, width: i % 2 === 0 ? 10 : 14, height: i % 2 === 0 ? 10 : 14 }}
            />
          ))}
        </div>
      </main>

      <footer className="w-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] pb-[40px] relative size-full">
          <PrimaryButton label="Let's Begin!" onClick={() => dispatch({ type: "ONBOARD_NEXT" })} />
        </div>
      </footer>

      <HomeIndicator />
    </div>
  );
}
