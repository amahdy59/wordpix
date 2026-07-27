import { memo } from "react";

interface Props {
  label: string;
  onClick?: () => void;
}

/** White bordered secondary button — meets 44 px minimum touch target. */
export const SecondaryButton = memo(function SecondaryButton({ label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-wp-card border border-border text-foreground content-stretch flex h-[52px] items-center justify-center relative rounded-2xl shrink-0 w-full motion-safe:transition-opacity active:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="font-sans font-semibold leading-[20px] not-italic text-[14px]">
        {label}
      </span>
    </button>
  );
});
