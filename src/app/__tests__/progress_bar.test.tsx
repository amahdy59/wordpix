import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { LessonHeader } from "../shared/LessonHeader";

function renderHeader(current: number, total?: number) {
  render(
    <LessonHeader title="Test" current={current} total={total} onBack={vi.fn()} onClose={vi.fn()} />
  );
  return screen.getByRole("progressbar");
}

describe("LessonHeader progress bar", () => {
  it("reports 0 progress before the first step completes", () => {
    expect(renderHeader(0, 9)).toHaveAttribute("aria-valuenow", "0");
  });

  it("reports proportional progress mid-flow", () => {
    expect(renderHeader(1, 9)).toHaveAttribute("aria-valuenow", "11");
  });

  // The regression: suites passed step={9} total={9} into a prop documented as
  // 0-based, producing aria-valuenow=111 against aria-valuemax=100 and a bar
  // rendered 111% wide.
  it("reaches exactly 100 on the final step, never more", () => {
    const bar = renderHeader(9, 9);
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps values beyond the total", () => {
    expect(renderHeader(50, 9)).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps negative values", () => {
    expect(renderHeader(-3, 9)).toHaveAttribute("aria-valuenow", "0");
  });

  it("survives a zero total instead of dividing by zero", () => {
    expect(renderHeader(1, 0)).toHaveAttribute("aria-valuenow", "100");
  });

  it("announces position in words, not just a percentage", () => {
    expect(renderHeader(3, 9)).toHaveAttribute("aria-valuetext", "Step 3 of 9");
  });

  it("never renders a bar wider than its track", () => {
    renderHeader(9, 9);
    const fill = screen.getByRole("progressbar").firstElementChild as HTMLElement;
    const width = Number(fill.style.width.replace("%", ""));
    expect(width).toBeLessThanOrEqual(100);
  });
});

describe("LessonHeader call sites", () => {
  const suiteFiles = [
    "listening/ListeningSuite.tsx",
    "reading/ReadingSuite.tsx",
    "speaking/SpeakingSuite.tsx",
    "writing/WritingSuite.tsx",
  ];

  it.each(suiteFiles)("%s never passes a position above its total", (file) => {
    const source = readFileSync(resolve(__dirname, "../exercises", file), "utf8");
    const pairs = [...source.matchAll(/current=\{(\d+)\}\s+total=\{(\d+)\}/g)];

    // Most screens moved to the data-driven runner, so a suite may legitimately
    // have no literal call sites left. Any that remain must still be in range.
    pairs.forEach(([, current, total]) => {
      expect(Number(current)).toBeLessThanOrEqual(Number(total));
      expect(Number(current)).toBeGreaterThan(0);
    });
  });
});

describe("Exercise definitions declare a valid position", () => {
  it("keeps every step within its own total", async () => {
    const { EXERCISE_DEFINITIONS } = await import("../exercises/content");
    const entries = Object.values(EXERCISE_DEFINITIONS);

    expect(entries.length).toBeGreaterThan(0);
    entries.forEach((definition) => {
      expect(definition!.step, `${definition!.id} step is below 1`).toBeGreaterThan(0);
      expect(definition!.step, `${definition!.id} step exceeds its total`).toBeLessThanOrEqual(
        definition!.totalSteps
      );
    });
  }, 30000);

  it("gives every definition at least one task", async () => {
    const { EXERCISE_DEFINITIONS } = await import("../exercises/content");
    Object.values(EXERCISE_DEFINITIONS).forEach((definition) => {
      expect(definition!.tasks.length, `${definition!.id} has no tasks`).toBeGreaterThan(0);
    });
  }, 30000);
});
