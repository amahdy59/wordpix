import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ReactNode } from "react";
import { SKILL_EXERCISES, SKILL_EXERCISE_IDS } from "../exercises/registry";
import { LearnerProvider } from "../context/LearnerContext";
import { useProgress } from "../data/progress";

const appDir = resolve(__dirname, "..");
const read = (relativePath: string) => readFileSync(resolve(appDir, relativePath), "utf8");

describe("Skill exercise registry", () => {
  const appSource = read("router/RouterView.tsx");
  const typesSource = read("types.ts");

  it("covers every declared SkillExerciseId", () => {
    const declared = [...typesSource.matchAll(/^\s*\|\s*"([a-z-]+)";?$/gm)]
      .map((m) => m[1])
      .filter((id) => /^(listen|read|speak|write)-/.test(id));

    expect(declared.length).toBe(35);
    declared.forEach((id) => {
      expect(SKILL_EXERCISE_IDS, `${id} missing from registry`).toContain(id);
    });
  });

  it("registers exactly 35 screens with no extras", () => {
    expect(SKILL_EXERCISE_IDS).toHaveLength(35);
  });

  it("exposes every entry as a lazy component", () => {
    Object.entries(SKILL_EXERCISES).forEach(([id, component]) => {
      // React.lazy returns an object with $$typeof lazy, not a function.
      expect(component, `${id} is not a component`).toBeTruthy();
      expect(typeof component, `${id} should be a lazy object`).toBe("object");
    });
  });

  /**
   * App.tsx held a 45-case switch fed by 40 eager imports. The README described
   * "code-split routes" and the file wrapped everything in <Suspense> with a
   * LoadingFallback — but nothing was React.lazy, so the boundary and fallback
   * were dead code and the whole suite shipped in the initial bundle.
   */
  it("removed the giant switch from App.tsx", () => {
    expect(appSource).not.toContain('case "listen-word-match"');
    expect(appSource).not.toContain('case "write-timed-sprint"');
    expect(appSource).toContain("SKILL_EXERCISES[state.exerciseId]");
  });

  it("no longer eagerly imports the suites in App.tsx", () => {
    ["ListeningSuite", "ReadingSuite", "SpeakingSuite", "WritingSuite"].forEach((suite) => {
      expect(appSource, `${suite} still imported eagerly`).not.toMatch(
        new RegExp(`import \\{[\\s\\S]*?\\} from "\\./exercises/[a-z]+/${suite}"`)
      );
    });
  });

  it("keeps the Suspense boundary that now has something to suspend on", () => {
    expect(appSource).toContain("<Suspense");
    expect(appSource).toContain("LoadingFallback");
  });

  it("falls back rather than rendering nothing for an unknown id", () => {
    expect(appSource).toContain("if (!SkillExercise)");
  });
});

describe("useProgress referential stability", () => {
  const wrapper = ({ children }: { children: ReactNode }) => <LearnerProvider>{children}</LearnerProvider>;

  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * useProgress rebuilt legacyMasteryMap and the progress object on every
   * render, so `progress` was a new reference each time. Combined with the
   * unmemoised context value, every memo() downstream was defeated.
   */
  it("returns the same progress object across re-renders with unchanged state", () => {
    const { result, rerender } = renderHook(() => useProgress(), { wrapper });

    const first = result.current.progress;
    rerender();
    rerender();

    expect(result.current.progress).toBe(first);
  });

  it("keeps the derived mastery map stable too", () => {
    const { result, rerender } = renderHook(() => useProgress(), { wrapper });
    const first = result.current.progress.wordMastery;
    rerender();
    expect(result.current.progress.wordMastery).toBe(first);
  });

  it("keeps action callbacks stable", () => {
    const { result, rerender } = renderHook(() => useProgress(), { wrapper });
    const { recordSessionCompletion, setPreferences, resetToZero, addXP } = result.current;

    rerender();

    expect(result.current.recordSessionCompletion).toBe(recordSessionCompletion);
    expect(result.current.setPreferences).toBe(setPreferences);
    expect(result.current.resetToZero).toBe(resetToZero);
    expect(result.current.addXP).toBe(addXP);
  });

  it("produces a new object when the underlying state actually changes", () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    const before = result.current.progress;

    act(() => {
      result.current.setPreferences("B1", 20, "work");
    });

    expect(result.current.progress).not.toBe(before);
    expect(result.current.progress.englishLevel).toBe("B1");
    expect(result.current.progress.dailyGoalMinutes).toBe(20);
  });
});

describe("Context providers memoise their value", () => {
  it("LearnerContext does not pass a fresh object literal", () => {
    const source = read("context/LearnerContext.tsx");
    expect(source).toContain("useMemo<LearnerContextType>");
    expect(source).toContain("<LearnerContext.Provider value={value}>");
  });

  it("I18nContext does not pass a fresh object literal", () => {
    const source = read("context/I18nContext.tsx");
    expect(source).toContain("useMemo<I18nContextType>");
    expect(source).toContain("<I18nContext.Provider value={value}>");
  });
});
