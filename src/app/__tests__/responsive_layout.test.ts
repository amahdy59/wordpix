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
    // The question card now uses a two-row layout: group/counter on top,
    // heading + phonetic below — so flex-col is correct, not flex-wrap.
    expect(source).toMatch(/flex flex-col gap-3/);
  });
});

describe("AppShell responsive components", () => {
  it("uses lg:flex-row to switch from mobile column to desktop row", () => {
    const source = stripComments(read("shared/AppShell.tsx"));
    expect(source).toMatch(/lg:flex-row/);
  });

  it("SidebarNav is hidden on mobile, visible on desktop, and sticky with full dvh height", () => {
    const source = stripComments(read("shared/SidebarNav.tsx"));
    expect(source).toMatch(/hidden\s+lg:flex/);
    expect(source).toMatch(/sticky/);
    expect(source).toMatch(/top-0/);
    expect(source).toMatch(/h-dvh/);
    expect(source).toMatch(/w-\[240px\]/);
    expect(source).not.toMatch(/w-\[80px\]/);
  });

  it("keeps five mobile destinations flexible at 320px", () => {
    const source = stripComments(read("shared/BottomTabBar.tsx"));
    expect(source).toMatch(/min-w-\[56px\]/);
    expect(source).toMatch(/flex-1/);
    expect(source).not.toMatch(/w-\[72px\]/);
  });

  it("MobileHeader is sticky at viewport top on mobile", () => {
    const source = stripComments(read("shared/MobileHeader.tsx"));
    expect(source).toMatch(/sticky/);
    expect(source).toMatch(/top-0/);
    expect(source).toMatch(/shrink-0/);
  });

  it("BottomTabBar is visible on mobile and hidden on desktop", () => {
    const source = stripComments(read("shared/BottomTabBar.tsx"));
    expect(source).toMatch(/lg:hidden/);
  });
});

describe("Card Grid Responsive Aspect Ratios", () => {
  it("ExerciseRecallMatch lets image choices expand across large viewports", () => {
    const source = stripComments(read("exercises/ExerciseRecallMatch.tsx"));
    expect(source).toMatch(/aspect-\[4\/3\]/);
    expect(source).toMatch(/sm:aspect-\[16\/10\]/);
    expect(source).toMatch(/lg:grid-cols-4/);
    expect(source).toContain("max-w-[2200px]");
    expect(source).toContain("object-cover");
    expect(source).not.toMatch(/max-h-\[260px\]/);
    expect(source).not.toMatch(/grid-rows-2/);
  });

  it("ExerciseQuickQuiz uses aspect-[4/3] to prevent image squashing", () => {
    const source = stripComments(read("exercises/ExerciseQuickQuiz.tsx"));
    expect(source).toMatch(/aspect-\[4\/3\]/);
    expect(source).not.toMatch(/grid-rows-2/);
  });
});

describe("Information architecture avoids nested shells", () => {
  it("lets RouterView own the single AppShell around Practice", () => {
    const hub = stripComments(read("core/SkillExerciseHub.tsx"));
    const router = stripComments(read("router/RouterView.tsx"));

    expect(hub).not.toContain("<AppShell");
    expect(router).toMatch(/state\.id === "practice"/);
    expect(router).toMatch(/<AppShell/);
  });

  it("does not vertically center media drills in unused viewport space", () => {
    const shell = stripComments(read("shared/ExerciseShell.tsx"));
    expect(shell).toMatch(/max-w-\[2200px\]/);
    expect(shell).not.toMatch(/max-w-\[2200px\][^\n]*my-auto/);
  });
});

describe("HomeDashboard 2-Column Responsive Desktop Grid", () => {
  const source = stripComments(read("core/HomeDashboard.tsx"));

  it("keeps the dashboard single-column beside the 1024px sidebar and splits at xl", () => {
    expect(source).toMatch(/grid\s+grid-cols-1\s+xl:grid-cols-12/);
    expect(source).toMatch(/xl:col-span-7/);
    expect(source).toMatch(/xl:col-span-5/);
  });
});

describe("ExploreWorlds 3-Column Responsive Grid", () => {
  const source = stripComments(read("core/ExploreWorlds.tsx"));

  it("supports 3-column layout on xl screens and responsive aspect ratio for banners", () => {
    expect(source).toMatch(/xl:grid-cols-3/);
    expect(source).toMatch(/aspect-\[16\/9\]/);
  });

  it("starts collections collapsed and suppresses empty progress bars", () => {
    expect(source).toMatch(/useState<Record<string, boolean>>\(\{\}\)/);
    expect(source).toMatch(/stats\.masteredWords > 0/);
    expect(source).toMatch(/wordsPracticedCount > 0/);
  });
});

describe("Learning path progressive disclosure", () => {
  const source = stripComments(read("core/LearningPath.tsx"));

  it("opens one pathway phase at a time", () => {
    expect(source).toMatch(/expandedPhase/);
    expect(source).toMatch(/aria-expanded=\{isExpanded\}/);
    expect(source).toMatch(/isExpanded &&/);
  });
});

describe("Responsive Bottom-Sheet Modal Behavior", () => {
  it("SettingsModal uses bottom-sheet styling on mobile and centered dialog on sm+", () => {
    const source = stripComments(read("core/SettingsModal.tsx"));
    expect(source).toMatch(/items-end\s+sm:items-center/);
    expect(source).toMatch(/rounded-t-\[28px\]\s+sm:rounded-3xl/);
  });

  // Word-details sheet/drawer geometry is measured in e2e/listen-repeat.spec.ts.

  it("keeps the lesson options sheet fixed to the viewport on touch devices", () => {
    const source = stripComments(read("lesson/LessonWorldEntry.tsx"));

    // A transformed card becomes the containing block for its fixed menu.
    // Sticky mobile hover then sized the sheet against the card, not the viewport.
    expect(source).not.toContain("hover:scale-[1.01]");
    expect(source).toMatch(/fixed\s+inset-x-4\s+bottom-6/);
  });
});

describe("Word Formation Responsive Stacked Cards", () => {
  const source = stripComments(read("learning/LearningMaterialsScreen.tsx"));

  it("provides mobile stacked cards alongside desktop semantic table", () => {
    expect(source).toMatch(/block\s+sm:hidden/);
    expect(source).toMatch(/hidden\s+sm:block/);
  });
});
