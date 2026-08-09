import { memo } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * A semantic container for main page content, ensuring consistent responsive
 * max-widths and margins across the application.
 */
export const PageContainer = memo(function PageContainer({ children, className = "" }: Props) {
  return (
    <div className={`flex flex-col gap-6 w-full max-w-6xl mx-auto ${className}`}>
      {children}
    </div>
  );
});
