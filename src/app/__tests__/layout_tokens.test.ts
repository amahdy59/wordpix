import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const srcDir = resolve(__dirname, "../..");
const read = (path: string) => readFileSync(resolve(srcDir, path), "utf8");

function collectTsx(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "__tests__") continue;
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) collectTsx(fullPath, found);
    else if (entry.endsWith(".tsx")) found.push(fullPath);
  }
  return found;
}

describe("Semantic responsive layout system", () => {
  const theme = read("styles/theme.css");
  const globals = read("styles/globals.css");

  it.each(["reading", "content", "wide", "shell", "immersive"])(
    "defines and consumes the %s layout measure",
    (measure) => {
      expect(theme).toContain(`--wp-layout-${measure}:`);
      expect(globals).toContain(`.wp-container-${measure}`);
      expect(globals).toContain(`max-width: var(--wp-layout-${measure})`);
    }
  );

  it("defines one fluid logical gutter", () => {
    expect(theme).toMatch(/--wp-layout-gutter-inline:\s*clamp\(/);
    expect(globals).toContain("padding-inline: var(--wp-layout-gutter-inline)");
  });

  it("keeps viewport-sized magic numbers out of application TSX", () => {
    const applicationSources = collectTsx(resolve(srcDir, "app"))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    expect(applicationSources).not.toMatch(/max-w-\[(1440|1536|1800)px\]/);
    expect(applicationSources).not.toMatch(/\bmax-w-(4xl|5xl|6xl|7xl)\b/);
  });
});

describe("Contrast-safe shared motion", () => {
  const animations = read("app/shared/animations.ts");

  it("does not fade text-bearing page containers through low-contrast states", () => {
    expect(animations).not.toMatch(/hidden:\s*\{[^}]*opacity:\s*0/);
    expect(animations).not.toMatch(/visible:\s*\{[^}]*opacity:/);
  });
});

describe("Phase 2 component consolidation", () => {
  it("exports the shared media, empty, and feedback primitives", () => {
    const sharedIndex = read("app/shared/index.ts");
    expect(sharedIndex).toContain('export { MediaFrame } from "./MediaFrame"');
    expect(sharedIndex).toContain('export { EmptyState } from "./EmptyState"');
    expect(sharedIndex).toContain('export { FeedbackPanel } from "./FeedbackPanel"');
  });

  it.each([
    "app/learning/conversation/ConversationCurriculumScreen.tsx",
    "app/learning/business/BusinessCurriculumScreen.tsx",
    "app/learning/hadith/HadithCurriculumScreen.tsx",
    "app/learning/foundations/PronunciationCurriculumScreen.tsx",
    "app/learning/study/StudyHome.tsx",
    "app/learning/study/LearnArea.tsx",
    "app/learning/study/PracticeArea.tsx",
    "app/learning/study/ReviewArea.tsx",
    "app/learning/study/ReferenceArea.tsx",
    "app/learning/study/UseItArea.tsx",
  ])("uses the semantic gutter in %s", (path) => {
    expect(read(path)).toContain("wp-layout-gutter");
  });
});
