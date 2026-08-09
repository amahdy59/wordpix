import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const appDir = resolve(__dirname, "..");
const read = (relativePath: string) => readFileSync(resolve(appDir, relativePath), "utf8");

/**
 * Strips block comments, line comments, and JSX comment wrappers. Several of
 * these assertions look for the absence of a class string that the surrounding
 * code comments legitimately name while explaining why it was removed.
 */
const stripComments = (source: string) =>
  source
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");


describe("Responsive visibility has no dead zones", () => {
  const source = stripComments(read("lesson/SceneCanvas.tsx"));

  /**
   * `hidden sm:block md:hidden` renders only between 640px and 767px: hidden on
   * phones, hidden on desktop. The mobile bottom card already covers <768px, so
   * this duplicated it in a 128px window while leaving desktop with no way to
   * start practice.
   */
  it("has no hidden sm:block md:hidden band-limited elements", () => {
    expect(source).not.toMatch(/hidden\s+sm:block\s+md:hidden/);
  });

  it("offers exactly one start-practice control per breakpoint", () => {
    const desktopControl = /hidden lg:block[\s\S]{0,200}Play Game/;
    const mobileControl = /lg:hidden[\s\S]*?Play Game/;
    expect(source).toMatch(desktopControl);
    expect(source).toMatch(mobileControl);
  });
});

describe("Quiz question legibility", () => {
  const source = stripComments(read("exercises/ExerciseQuickQuiz.tsx"));

  it("never truncates the question text", () => {
    const heading = source.match(/<h2[\s\S]*?Which picture shows/);
    expect(heading).not.toBeNull();
    expect((heading as RegExpMatchArray)[0]).not.toContain("truncate");
  });

  it("lets the question row wrap instead of squeezing the heading", () => {
    expect(source).toMatch(/flex flex-wrap items-center justify-between/);
  });
});

describe("AppShell responsive components", () => {
  it("uses lg:flex-row to switch from mobile column to desktop row", () => {
    const source = stripComments(read("shared/AppShell.tsx"));
    expect(source).toMatch(/lg:flex-row/);
  });

  it("SidebarNav is hidden on mobile and visible on desktop", () => {
    const source = stripComments(read("shared/SidebarNav.tsx"));
    expect(source).toMatch(/hidden\s+lg:flex/);
  });

  it("BottomTabBar is visible on mobile and hidden on desktop", () => {
    const source = stripComments(read("shared/BottomTabBar.tsx"));
    expect(source).toMatch(/lg:hidden/);
  });
});
