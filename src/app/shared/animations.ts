import type { Variants } from "framer-motion";

/**
 * Standard stagger container for lists/grids.
 *
 * Keep the container fully opaque in every state. Fading a whole page blends
 * its foreground and background colours together during entry, which creates
 * transient WCAG contrast failures even when the resting tokens pass AAA.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

/**
 * Standard child item that slides up without changing colour contrast.
 */
export const staggerItem: Variants = {
  hidden: { y: 12 },
  visible: {
    y: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
};
