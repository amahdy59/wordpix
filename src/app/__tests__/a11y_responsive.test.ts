import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { contrastRatio, CONTRAST_THRESHOLD } from "../../utils/contrast";

/**
 * This file used to contain a single test — `expect(true).toBe(true)` — named
 * "verifies modal accessibility requirements (WCAG 2.2 AAA)". It asserted
 * nothing, and it was the project's entire automated accessibility coverage
 * while CI ran it as a release gate.
 *
 * It now reads the real theme tokens and the real components.
 */

const srcDir = resolve(__dirname, "../..");
const read = (relativePath: string) => readFileSync(resolve(srcDir, relativePath), "utf8");

const themeCss = read("styles/theme.css");

/** Pulls `--token: #RRGGBB;` declarations out of a single CSS block. */
function parseTokens(css: string, blockSelector: string): Record<string, string> {
  const blockStart = css.indexOf(blockSelector);
  if (blockStart === -1) throw new Error(`Missing CSS block: ${blockSelector}`);

  const open = css.indexOf("{", blockStart);
  const close = css.indexOf("\n}", open);
  const block = css.slice(open, close);

  const tokens: Record<string, string> = {};
  for (const match of block.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}

const lightTokens = parseTokens(themeCss, ":root {");
const darkTokens = parseTokens(themeCss, ".dark {");
// The dark block only overrides a subset; unlisted tokens inherit from :root.
const darkResolved = { ...lightTokens, ...darkTokens };

/**
 * Text colour pairings the UI actually renders, as
 * [description, foregroundToken, backgroundToken].
 */
const TEXT_PAIRS: [string, string, string][] = [
  ["body text on page background", "--wp-text", "--wp-surface"],
  ["body text on card", "--wp-text", "--wp-card"],
  ["secondary text on page background", "--wp-text-secondary", "--wp-surface"],
  ["secondary text on card", "--wp-text-secondary", "--wp-card"],
  ["brand text on card", "--wp-brand", "--wp-card"],
  ["brand text on brand-light chip", "--wp-brand", "--wp-brand-light"],
  ["success text on card", "--wp-green", "--wp-card"],
  ["error text on card", "--wp-rose", "--wp-card"],
  ["offline/teal text on card", "--wp-teal", "--wp-card"],
];

/** Every filled accent surface and the foreground it is paired with. */
const FILL_PAIRS: [string, string][] = [
  ["--wp-brand", "--wp-text-on-brand"],
  ["--wp-green", "--wp-text-on-green"],
  ["--wp-rose", "--wp-text-on-rose"],
  ["--wp-amber", "--wp-text-on-amber"],
  ["--wp-blue", "--wp-text-on-blue"],
];

describe.each([
  ["light", lightTokens],
  ["dark", darkResolved],
])("Colour contrast in %s mode (WCAG 2.2 AAA, 7:1)", (_mode, tokens) => {
  it.each(TEXT_PAIRS)("%s meets 7:1", (_label, fgToken, bgToken) => {
    const fg = tokens[fgToken];
    const bg = tokens[bgToken];
    expect(fg, `missing token ${fgToken}`).toBeTruthy();
    expect(bg, `missing token ${bgToken}`).toBeTruthy();

    const ratio = contrastRatio(fg, bg);
    expect(
      ratio,
      `${fgToken} (${fg}) on ${bgToken} (${bg}) = ${ratio.toFixed(2)}:1`
    ).toBeGreaterThanOrEqual(CONTRAST_THRESHOLD.AAA_NORMAL);
  });

  // Accents are mid-luminance, so "white on the accent" is not a safe default.
  // Each fill must declare a foreground that actually clears 7:1 against it.
  it.each(FILL_PAIRS)("%s declares a foreground (%s) that meets 7:1", (fillToken, fgToken) => {
    const fill = tokens[fillToken];
    const fg = tokens[fgToken];
    expect(fill, `missing token ${fillToken}`).toBeTruthy();
    expect(fg, `missing paired foreground ${fgToken}`).toBeTruthy();

    const ratio = contrastRatio(fg, fill);
    expect(
      ratio,
      `${fgToken} (${fg}) on ${fillToken} (${fill}) = ${ratio.toFixed(2)}:1`
    ).toBeGreaterThanOrEqual(CONTRAST_THRESHOLD.AAA_NORMAL);
  });
});

describe("Accent fills use their paired foreground token", () => {
  const componentSources = [
    "app/core/HomeDashboard.tsx",
    "app/lesson/LessonCompleteResults.tsx",
    "app/lesson/SceneCanvas.tsx",
  ];

  // Regression guard: these fills previously hardcoded text-white, which
  // measured 2.54:1 on emerald-500 and 1.92:1 on emerald-400.
  it.each(componentSources)("%s pairs no accent fill with a bare text-white", (path) => {
    const source = read(path);
    const offenders = source
      .split("\n")
      .filter((line) => /bg-wp-(green|rose|amber|blue|teal)(?!-)/.test(line) && /\btext-white\b/.test(line));
    expect(offenders).toEqual([]);
  });
});

describe("Touch targets (WCAG 2.5.5, 44x44 CSS px)", () => {
  const components: [string, string][] = [
    ["BackButton", "app/shared/BackButton.tsx"],
    ["CloseButton", "app/shared/CloseButton.tsx"],
    ["BottomTabBar", "app/shared/BottomTabBar.tsx"],
    ["PrimaryButton", "app/shared/PrimaryButton.tsx"],
    ["SecondaryButton", "app/shared/SecondaryButton.tsx"],
  ];

  it.each(components)("%s declares at least a 44px target", (_name, path) => {
    const source = read(path);
    const hasMinHeight = /min-h-\[(4[4-9]|[5-9]\d|\d{3,})px\]/.test(source);
    const hasFixedHeight = /\bh-\[(4[4-9]|[5-9]\d|\d{3,})px\]/.test(source);
    expect(hasMinHeight || hasFixedHeight).toBe(true);
  });
});

describe("Focus visibility (WCAG 2.4.7)", () => {
  it("defines a global focus-visible outline", () => {
    expect(themeCss).toContain("*:focus-visible");
    expect(themeCss).toMatch(/outline:\s*\d+px solid/);
  });

  it("does not suppress outlines without a focus-visible replacement", () => {
    const suppressions = themeCss.match(/outline:\s*none/g) ?? [];
    // The only permitted suppression is the :focus:not(:focus-visible) reset.
    expect(suppressions.length).toBeLessThanOrEqual(1);
    if (suppressions.length === 1) {
      expect(themeCss).toContain("*:focus:not(:focus-visible)");
    }
  });
});

describe("Skip link (WCAG 2.4.1)", () => {
  const appSource = read("app/App.tsx");

  it("renders a skip link targeting the main landmark", () => {
    expect(appSource).toContain('href="#main-content"');
    expect(appSource).toContain('id="main-content"');
  });

  it("keeps the skip link screen-reader-only until focused", () => {
    expect(appSource).toMatch(/sr-only\s+focus:not-sr-only/);
  });
});
