import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const appDir = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(appDir, p), "utf8");

/**
 * Three layout faults found by driving the built app in Chromium at 320, 390,
 * 820 and 1440 CSS px. Each one pushed a control off the screen edge without
 * the page scrolling sideways to reveal it, so nothing looked wrong — the
 * control was simply unreachable.
 *
 * They are asserted here as source rules because that is what a unit test can
 * see. The measurement that actually found them is a browser pass over every
 * route at every width.
 */

describe("mobile header fits the viewport", () => {
  const source = read("shared/MobileHeader.tsx");

  it("does not combine box-content with w-full and horizontal padding", () => {
    // box-sizing is not per-axis: `box-content` bought correct safe-area
    // height and cost 32px of width, making a 390px header 422px wide.
    const header = source.slice(source.indexOf("<header"), source.indexOf("</header>"));
    expect(header).not.toMatch(/\bbox-content\b/);
  });

  it("still reserves room for the safe-area inset", () => {
    // The inset must survive the fix — it moved into the height calculation
    // rather than being dropped.
    expect(source).toMatch(/h-\[calc\([^\]]*env\(safe-area-inset-top\)[^\]]*\)\]/);
    expect(source).toMatch(/pt-\[env\(safe-area-inset-top\)\]/);
  });

  it("gives the brand button a full-size touch target", () => {
    const button = source.slice(source.indexOf("WordPix Home"), source.indexOf("Utilities"));
    expect(button).toMatch(/min-h-\[44px\]/);
  });
});

describe("lesson rows shrink instead of overflowing", () => {
  const source = read("lesson/LessonWorldEntry.tsx");

  it("lets the lesson card shrink below its content width", () => {
    // `flex-1` alone keeps `min-width: auto`, so the card refused to go below
    // 277px and hung off the edge of a 320px screen.
    expect(source).toMatch(/flex-1 min-w-0 bg-wp-card/);
  });

  it("wraps the row of action buttons", () => {
    // Four 44px controls need 206px; a 320px screen offers about 172px.
    expect(source).toMatch(/flex flex-wrap items-center gap-2\.5 shrink-0/);
  });
});

describe("study section tabs are tappable", () => {
  const source = read("learning/LearningMaterialsScreen.tsx");

  it("sizes the section tabs to the 44px touch minimum", () => {
    // They sat at 34px, on the one screen that is a horizontal scroller —
    // where a mistimed tap scrolls the strip instead of selecting a section.
    const tabs = source.slice(source.indexOf("inline-flex items-center gap-2 rounded-full"));
    expect(tabs.slice(0, 200)).toMatch(/min-h-\[44px\]/);
  });
});
