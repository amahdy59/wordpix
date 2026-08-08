import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { LearnerProvider, useLearner, DEFAULT_ACCESSIBILITY, TEXT_SIZE_SCALE } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import {
  formatNumber,
  useApplyAccessibilityPreferences,
} from "../shared/useAccessibilityPreferences";
import { SettingsModal } from "../core/SettingsModal";
import { countAvailableExercises, EXERCISES } from "../core/skillExerciseCatalog";

const wrapper = ({ children }: { children: ReactNode }) => (
  <LearnerProvider>
    <I18nProvider>{children}</I18nProvider>
  </LearnerProvider>
);

function renderSettings() {
  return render(
    <LearnerProvider>
      <I18nProvider>
        <SettingsModal isOpen onClose={vi.fn()} />
      </I18nProvider>
    </LearnerProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
  document.documentElement.style.fontSize = "";
});

/**
 * Every control covered here was a `useState` local to SettingsModal that
 * nothing read. The buttons moved when clicked, changed nothing, and threw the
 * value away when the modal closed.
 */
describe("Accessibility settings are persisted", () => {
  it("starts from documented defaults", () => {
    const { result } = renderHook(() => useLearner(), { wrapper });
    expect(result.current.state.accessibility).toEqual(DEFAULT_ACCESSIBILITY);
  });

  it("stores a change and survives a remount", () => {
    const first = renderHook(() => useLearner(), { wrapper });
    act(() => first.result.current.setAccessibility({ textSize: "xlarge" }));
    first.unmount();

    const second = renderHook(() => useLearner(), { wrapper });
    expect(second.result.current.state.accessibility.textSize).toBe("xlarge");
  });

  it("merges partial updates instead of replacing the slice", () => {
    const { result } = renderHook(() => useLearner(), { wrapper });
    act(() => result.current.setAccessibility({ highContrast: true }));
    act(() => result.current.setAccessibility({ speechRate: 0.5 }));

    expect(result.current.state.accessibility.highContrast).toBe(true);
    expect(result.current.state.accessibility.speechRate).toBe(0.5);
    expect(result.current.state.accessibility.numeralSystem).toBe("western");
  });

  it("keeps assistive settings when progress is reset", () => {
    const { result } = renderHook(() => useLearner(), { wrapper });
    act(() => result.current.setAccessibility({ textSize: "large", highContrast: true }));
    act(() => result.current.resetToZero());

    // Wiping someone's contrast setting because they reset a streak would be a
    // hostile surprise.
    expect(result.current.state.accessibility.textSize).toBe("large");
    expect(result.current.state.accessibility.highContrast).toBe(true);
    expect(result.current.state.learnerProgress.xp).toBe(0);
  });
});

describe("Text size actually scales the document", () => {
  function Harness() {
    useApplyAccessibilityPreferences();
    const { setAccessibility } = useLearner();
    return (
      <button type="button" onClick={() => setAccessibility({ textSize: "xlarge" })}>
        grow
      </button>
    );
  }

  it("sets the root font size from the chosen step", async () => {
    const user = userEvent.setup();
    render(<Harness />, { wrapper });

    expect(document.documentElement.style.fontSize).toBe("16px");

    await user.click(screen.getByRole("button", { name: "grow" }));

    expect(document.documentElement.style.fontSize).toBe(`${16 * TEXT_SIZE_SCALE.xlarge}px`);
    expect(document.documentElement.dataset.textSize).toBe("xlarge");
  });

  it("declares a scale for every step, ascending", () => {
    expect(TEXT_SIZE_SCALE.standard).toBe(1);
    expect(TEXT_SIZE_SCALE.large).toBeGreaterThan(TEXT_SIZE_SCALE.standard);
    expect(TEXT_SIZE_SCALE.xlarge).toBeGreaterThan(TEXT_SIZE_SCALE.large);
    // The control's own copy promises "up to 150%".
    expect(TEXT_SIZE_SCALE.xlarge).toBe(1.5);
  });
});

describe("High contrast toggles a real class", () => {
  function Harness() {
    useApplyAccessibilityPreferences();
    const { state, setAccessibility } = useLearner();
    return (
      <button
        type="button"
        onClick={() => setAccessibility({ highContrast: !state.accessibility.highContrast })}
      >
        toggle
      </button>
    );
  }

  it("adds and removes .high-contrast on the document element", async () => {
    const user = userEvent.setup();
    render(<Harness />, { wrapper });

    expect(document.documentElement).not.toHaveClass("high-contrast");
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(document.documentElement).toHaveClass("high-contrast");
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(document.documentElement).not.toHaveClass("high-contrast");
  });
});

describe("Numeral system", () => {
  it("leaves Western digits alone", () => {
    expect(formatNumber(1234, "western")).toBe("1234");
  });

  it("converts to Arabic-Indic digits", () => {
    expect(formatNumber(1234, "arabic")).toBe("١٢٣٤");
    expect(formatNumber(0, "arabic")).toBe("٠");
  });

  it("converts digits embedded in a string, leaving other characters intact", () => {
    expect(formatNumber("3 of 57", "arabic")).toBe("٣ of ٥٧");
  });
});

describe("Modality toggles filter the exercise catalogue", () => {
  it("offers everything by default", () => {
    expect(countAvailableExercises(true, true)).toBe(EXERCISES.length);
  });

  it("removes speaking drills when speaking is disabled", () => {
    const speakingCount = EXERCISES.filter((e) => e.category === "speaking").length;
    expect(countAvailableExercises(false, true)).toBe(EXERCISES.length - speakingCount);
  });

  it("removes listening drills when listening is disabled", () => {
    const listeningCount = EXERCISES.filter((e) => e.category === "listening").length;
    expect(countAvailableExercises(true, false)).toBe(EXERCISES.length - listeningCount);
  });

  it("removes both when both are disabled", () => {
    const remaining = EXERCISES.filter(
      (e) => e.category === "reading" || e.category === "writing"
    ).length;
    expect(countAvailableExercises(false, false)).toBe(remaining);
  });
});

describe("SettingsModal drives persisted state", () => {
  it("reflects a change immediately in the control's pressed state", async () => {
    const user = userEvent.setup();
    renderSettings();

    const large = screen.getByRole("button", { name: "125%" });
    expect(large).toHaveAttribute("aria-pressed", "false");

    await user.click(large);
    expect(large).toHaveAttribute("aria-pressed", "true");
  });

  it("exposes every accessibility control as a pressable toggle", () => {
    renderSettings();
    ["100%", "125%", "150%", "1, 2, 3", "١, ٢, ٣", "0.5x", "0.75x", "1x"].forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toHaveAttribute("aria-pressed");
    });
  });

  /**
   * The footer button said "Save & Close Settings", implying a pending commit
   * that never existed — nothing was ever saved. Changes apply immediately, so
   * the label should not promise otherwise.
   */
  it("does not promise a save step it never performed", () => {
    renderSettings();
    expect(screen.queryByRole("button", { name: /save/i })).toBeNull();
    expect(screen.getByRole("button", { name: "Done" })).toBeTruthy();
  });
});
