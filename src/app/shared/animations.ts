import type { Variants } from "framer-motion";

/**
 * Standard stagger container for lists/grids.
 * Applies a 0.05s stagger between children appearing.
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

/**
 * Standard child item that slides up and fades in.
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4
    }
  },
};
