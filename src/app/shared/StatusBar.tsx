import { memo } from "react";
import svgLesson from "@/imports/FlowLessonExercises/svg-2zwti0wuib";

/** iOS-style status bar — purely decorative, hidden from assistive tech. */
export const StatusBar = memo(function StatusBar() {
  return (
    <div aria-hidden className="md:hidden h-[44px] relative shrink-0 w-full">
      <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
        <span className="font-sans font-semibold leading-normal text-foreground text-[14px]">
          9:41
        </span>
        <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
          {/* Signal */}
          <svg fill="none" height="11" viewBox="0 0 17 11" width="17">
            <path clipRule="evenodd" d={svgLesson.p2d6ad970} fill="currentColor" fillRule="evenodd" className="text-foreground" />
          </svg>
          {/* Wi-Fi */}
          <svg fill="none" height="11" viewBox="0 0 15 11" width="15">
            <path clipRule="evenodd" d={svgLesson.p190a1500} fill="currentColor" fillRule="evenodd" className="text-foreground" />
          </svg>
          {/* Battery */}
          <svg fill="none" height="12" viewBox="0 0 25 12" width="25">
            <path d={svgLesson.pde03700} fill="currentColor" className="text-foreground" />
          </svg>
        </div>
      </div>
    </div>
  );
});
