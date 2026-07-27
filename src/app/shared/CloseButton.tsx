import { memo } from "react";
import { X } from "lucide-react";

interface Props {
  onClick: () => void;
  "aria-label"?: string;
}

export const CloseButton = memo(function CloseButton({ onClick, "aria-label": ariaLabel = "Close" }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex items-center justify-center size-10 rounded-lg bg-wp-card border border-border text-muted-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] min-w-[44px] motion-safe:transition-colors"
    >
      <X className="size-5" aria-hidden />
    </button>
  );
});
