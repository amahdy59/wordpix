import { memo } from "react";

interface Props {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "blue" | "brand";
}

/** Full-width CTA button — 56 px tall, meets 44 px minimum touch target. */
export const PrimaryButton = memo(function PrimaryButton({ label, onClick, disabled, variant = "blue" }: Props) {
  const colorClass = variant === "brand"
    ? "bg-primary focus-visible:outline-primary"
    : "bg-wp-blue focus-visible:outline-wp-blue";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${colorClass} content-stretch flex h-[56px] items-center justify-center relative rounded-xl shrink-0 w-full motion-safe:transition-all active:opacity-90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-wp-xs`}
    >
      <span className="font-sans font-bold leading-[24px] text-[16px] text-white">
        {label}
      </span>
    </button>
  );
});
