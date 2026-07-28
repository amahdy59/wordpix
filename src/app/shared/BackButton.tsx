import { memo } from "react";
import { ChevronLeft } from "lucide-react";

interface Props {
  onClick: () => void;
  "aria-label"?: string;
}

export const BackButton = memo(function BackButton({ onClick, "aria-label": ariaLabel = "Go back" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex items-center justify-center size-10 rounded-lg bg-wp-card border border-border text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] min-w-[44px] motion-safe:transition-colors"
    >
      <ChevronLeft className="size-5" aria-hidden />
    </button>
  );
});
