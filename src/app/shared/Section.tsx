import { memo } from "react";

interface Props {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A semantic section wrapper that enforces vertical rhythm and accessible labelling.
 */
export const Section = memo(function Section({ id, title, children, className = "" }: Props) {
  return (
    <section aria-labelledby={id} className={`flex flex-col gap-3 ${className}`}>
      <h2 id={id} className="font-sans font-bold text-lg text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
});
