import { memo } from "react";

/** iOS home indicator pill — purely decorative, hidden from assistive tech. */
export const HomeIndicator = memo(function HomeIndicator() {
  return (
    <div aria-hidden className="md:hidden content-stretch flex h-[34px] items-center justify-center relative shrink-0 w-full">
      <div className="bg-foreground h-[5px] relative rounded-full shrink-0 w-[134px] opacity-20" />
    </div>
  );
});
