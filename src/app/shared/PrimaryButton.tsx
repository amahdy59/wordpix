import { memo } from "react";

interface Props {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "blue" | "brand";
  /**
   * Defaults to "button". Pass "submit" inside a <form> so Enter in a text
   * field submits — a hardcoded type="button" silently breaks that.
   */
  type?: "button" | "submit";
}

/** Full-width CTA button — 56 px tall, meets 44 px minimum touch target. */
export const PrimaryButton = memo(function PrimaryButton({
  label,
  onClick,
  disabled,
  variant = "blue",
  type = "button",
}: Props) {
  // Each fill carries its own checked foreground. A bare text-white here
  // measured 2.72:1 against the dark-mode brand.
  const colorClass = variant === "brand"
    ? "bg-primary text-wp-text-on-brand focus-visible:outline-primary"
    : "bg-wp-blue text-wp-text-on-blue focus-visible:outline-wp-blue";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${colorClass} content-stretch flex h-[56px] items-center justify-center relative rounded-xl shrink-0 w-full motion-safe:transition-all active:opacity-90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-wp-xs`}
    >
      <span className="wp-type-body-emphasis text-current font-bold">
        {label}
      </span>
    </button>
  );
});
