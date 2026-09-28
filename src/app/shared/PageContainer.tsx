import { memo } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  size?: "reading" | "content" | "wide";
}

const sizeStyles = {
  reading: "wp-container-reading",
  content: "wp-container-content",
  wide: "wp-container-wide",
} as const;

/**
 * A semantic container for main page content, ensuring consistent responsive
 * max-widths and margins across the application.
 */
export const PageContainer = memo(function PageContainer({
  children,
  className = "",
  size = "content",
}: Props) {
  return (
    <div className={`flex flex-col gap-5 sm:gap-6 ${sizeStyles[size]} ${className}`}>
      {children}
    </div>
  );
});
