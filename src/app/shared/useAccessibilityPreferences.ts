import { useEffect } from "react";
import { useLearner, TEXT_SIZE_SCALE, type NumeralSystem } from "../context/LearnerContext";

const BASE_ROOT_FONT_SIZE_PX = 16;

/** Arabic-Indic digits, indexed by their Western equivalent. */
const ARABIC_INDIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Renders a number in the learner's chosen numeral system.
 *
 * Exported separately from the hook so it can be unit-tested and used in
 * non-component code.
 */
export function formatNumber(value: number | string, system: NumeralSystem): string {
  const text = String(value);
  if (system !== "arabic") return text;
  return text.replace(/[0-9]/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)]);
}

/**
 * Applies accessibility preferences to the document.
 *
 * Text size scales the root font size, which is what makes the whole rem-based
 * layout grow with it — the control previously claimed "Resize text up to 150%
 * without loss of function" while doing nothing at all.
 */
export function useApplyAccessibilityPreferences() {
  const { state } = useLearner();
  const { textSize, highContrast } = state.accessibility;
  const { theme, expression } = state.preferences;

  useEffect(() => {
    const root = document.documentElement;
    const scale = TEXT_SIZE_SCALE[textSize] ?? 1;
    root.style.fontSize = `${BASE_ROOT_FONT_SIZE_PX * scale}px`;
    root.dataset.textSize = textSize;
    return () => {
      root.style.fontSize = "";
      delete root.dataset.textSize;
    };
  }, [textSize]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.dataset.learnerMode = expression;
  }, [expression]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" && mediaQuery.matches);
      document.documentElement.classList.toggle("dark", isDark);
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);
}

/** Convenience accessor for the accessibility slice. */
export function useAccessibility() {
  const { state, setAccessibility } = useLearner();
  return { accessibility: state.accessibility, setAccessibility };
}
