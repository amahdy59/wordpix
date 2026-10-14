import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const stylesDir = resolve(__dirname, "../../styles");
const readStyle = (file: string) => readFileSync(resolve(stylesDir, file), "utf8");

describe("Typography System Integrity", () => {
  const themeCss = readStyle("theme.css");
  const globalsCss = readStyle("globals.css");
  const fontsCss = readStyle("fonts.css");

  it("self-hosts variable fonts via fontsource in fonts.css", () => {
    expect(fontsCss).toContain('@import "@fontsource-variable/inter"');
    expect(fontsCss).toContain('@import "@fontsource-variable/noto-sans-arabic"');
    expect(fontsCss).not.toContain("fonts.googleapis.com");
  });

  it("prioritizes self-hosted variable font families in theme.css", () => {
    expect(themeCss).toMatch(/--wp-font-base:\s*"Inter Variable"/);
    expect(themeCss).toMatch(/--wp-font-arabic:\s*"Noto Sans Arabic Variable"/);
  });

  it("enforces comfortable line-height and zero letter-spacing for Arabic typography", () => {
    expect(themeCss).toMatch(/--wp-line-height-arabic:\s*1\.65/);
    expect(themeCss).toMatch(/--wp-letter-spacing-arabic:\s*0px/);
    expect(globalsCss).toMatch(
      /\[dir="rtl"\][\s\S]*?letter-spacing:\s*var\(--wp-letter-spacing-arabic\)\s*!important/
    );
  });

  it("defines canonical semantic typography utilities in globals.css", () => {
    const requiredClasses = [
      ".wp-type-display",
      ".wp-type-h1",
      ".wp-type-h2",
      ".wp-type-h3",
      ".wp-type-body",
      ".wp-type-body-sm",
      ".wp-type-caption",
      ".wp-tabular-nums",
    ];

    for (const className of requiredClasses) {
      expect(globalsCss, `Missing utility class ${className}`).toContain(className);
    }
  });

  it("softens display typography to bold (700) instead of aggressive 900", () => {
    const displayMatch = globalsCss.match(/\.wp-type-display\s*\{([\s\S]*?)\}/);
    expect(displayMatch).not.toBeNull();
    expect(displayMatch![1]).toContain("font-weight: 700");
    expect(displayMatch![1]).not.toContain("font-weight: 900");
  });
});
