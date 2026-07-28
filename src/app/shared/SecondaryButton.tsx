import { memo } from "react";

interface Props {
  label: string;
  onClick?: () => void;
}

/** White bordered secondary button — meets 44 px minimum touch target. */
export const SecondaryButton = memo(function SecondaryButton({ label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-wp-card border border-border text-foreground content-stretch flex h-[52px] items-center justify-center relative rounded-xl shrink-0 w-full motion-safe:transition-all active:opacity-80 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary shadow-wp-xs hover:border-primary/40"
    >
      <span className="font-sans font-bold leading-[20px] text-[14px]">
        {label}
      </span>
    </button>
  );
});
