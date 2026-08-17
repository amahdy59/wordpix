import { memo } from "react";

interface Props {
  label: string;
  onClick?: () => void;
}
import { motion } from "framer-motion";

/** White bordered secondary button — meets 44 px minimum touch target. */
export const SecondaryButton = memo(function SecondaryButton({ label, onClick }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.96 }}
      className="bg-wp-card border border-border text-foreground content-stretch flex h-[52px] items-center justify-center relative rounded-xl shrink-0 w-full active:opacity-80 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary shadow-wp-xs hover:border-primary/40"
    >
      <span className="wp-type-body text-current font-bold">
        {label}
      </span>
    </motion.button>
  );
});
