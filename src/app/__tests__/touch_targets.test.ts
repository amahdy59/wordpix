import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const appDir = resolve(__dirname, "..");

function collectTsx(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "__tests__") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectTsx(full, found);
    else if (entry.endsWith(".tsx")) found.push(full);
  }
  return found;
}

const stripComments = (s: string) =>
  s
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

/** Every `className` string literal / template in a file. */
function classNameStrings(source: string): string[] {
  const out: string[] = [];
  for (const m of source.matchAll(/className=\{?[`"']([\s\S]*?)[`"']\}?/g)) out.push(m[1]);
  for (const m of source.matchAll(/className=\{`([\s\S]*?)`\}/g)) out.push(m[1]);
  return out;
}

/**
 * A class string satisfies WCAG 2.5.5 if it declares a height of at least 44px
 * through any of the supported forms.
 */
function declaresAdequateHeight(cls: string): boolean {
  if (/\bmin-h-\[(4[4-9]|[5-9]\d|\d{3,})px\]/.test(cls)) return true;
  if (/\bh-\[(4[4-9]|[5-9]\d|\d{3,})px\]/.test(cls)) return true;
  // Tailwind size/height scale: 11 = 2.75rem = 44px.
  if (/\b(?:size|h)-(1[1-9]|[2-9]\d)\b/.test(cls)) return true;
  if (/\bwp-touch-target\b/.test(cls)) return true;
  // Full-height flex children inherit their track's height.
  if (/\b(?:h|min-h)-full\b/.test(cls)) return true;
  return false;
}

describe("Touch targets (WCAG 2.5.5)", () => {
  /**
   * A live browser sweep at 320/360/768/1440 found nine controls below 44px:
   * vocabulary topic chips at 24px, exercise word chips at 26–30px, the sidebar
   * settings and profile buttons at 40px, the scene view toggles at 40px, the
   * listen-speed buttons at 32px, and the recall replay controls at 27–40px.
   *
   * This guards the source so they cannot silently shrink again.
   */
  const files = collectTsx(appDir);

  it.each(files.map((f) => [relative(appDir, f), f]))("%s sizes its buttons", (_name, file) => {
    const source = stripComments(readFileSync(file, "utf8"));

    // Buttons whose className is a plain literal, checked directly. Template
    // literals with conditionals are checked on their static prefix.
    const offenders: string[] = [];
    const buttonBlocks = source.match(/<button[\s\S]*?>/g) ?? [];

    buttonBlocks.forEach((block) => {
      // Icon-only buttons inside a sized parent, and sr-only links, are exempt.
      if (/\bsr-only\b/.test(block)) return;
      const classes = classNameStrings(block).join(" ");
      if (!classes) return;
      if (declaresAdequateHeight(classes)) return;

      const label = (block.match(/aria-label=["'{`]([^"'}`]{0,40})/) || [])[1] ?? "";
      offenders.push(`${label || block.slice(0, 60).replace(/\s+/g, " ")}`);
    });

    expect(offenders, `buttons with no >=44px height:\n  ${offenders.join("\n  ")}`).toEqual([]);
  });
});

describe("Horizontal chip strips", () => {
  const globalsCss = readFileSync(resolve(appDir, "../styles/globals.css"), "utf8");

  /**
   * `.no-scrollbar` was applied in six places and defined nowhere, so it did
   * nothing. Same failure mode as the undeclared --wp-text-* scale.
   */
  it("defines the .no-scrollbar utility it applies", () => {
    expect(globalsCss).toContain(".no-scrollbar");
    expect(globalsCss).toContain("scrollbar-width: none");
    expect(globalsCss).toContain("::-webkit-scrollbar");
  });

  it("keeps an affordance that content continues off-screen", () => {
    // Hiding the scrollbar removes the only cue that the strip scrolls.
    expect(globalsCss).toMatch(/\.no-scrollbar\s*\{[\s\S]*?mask-image/);
  });

  it("flips the fade for right-to-left", () => {
    expect(globalsCss).toContain('[dir="rtl"] .no-scrollbar');
  });
});
