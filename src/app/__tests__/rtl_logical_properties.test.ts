import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const appDir = resolve(__dirname, "..");

function collectTsxFiles(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "__tests__") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectTsxFiles(full, found);
    else if (entry.endsWith(".tsx")) found.push(full);
  }
  return found;
}

const sourceFiles = collectTsxFiles(appDir);

/**
 * Physical direction utilities that do not mirror under dir="rtl".
 *
 * I18nContext sets document.documentElement.dir = "rtl" for Arabic, but the
 * codebase used 26 physical utilities and zero logical ones, so switching
 * direction mirrored text flow while leaving every badge, key hint, close
 * button, and skip link pinned to the wrong side.
 *
 * `-translate-x-*` is excluded: it is used for symmetric centring, which is
 * direction-independent.
 */
const PHYSICAL_UTILITIES = [
  { pattern: /(?<![\w-])(?:[a-z]+:)*(?:ml|mr)-[0-9.]/, name: "ml-/mr- (use ms-/me-)" },
  { pattern: /(?<![\w-])(?:[a-z]+:)*(?:pl|pr)-[0-9.]/, name: "pl-/pr- (use ps-/pe-)" },
  { pattern: /(?<![\w-])(?:[a-z]+:)*(?:left|right)-[0-9a-z.]/, name: "left-/right- (use start-/end-)" },
  { pattern: /(?<![\w-])(?:[a-z]+:)*text-(?:left|right)(?![\w-])/, name: "text-left/right (use text-start/end)" },
  { pattern: /(?<![\w-])(?:[a-z]+:)*border-[lr](?![\w-])/, name: "border-l/r (use border-s/e)" },
  { pattern: /(?<![\w-])(?:[a-z]+:)*rounded-[lr]-/, name: "rounded-l-/r- (use rounded-s-/e-)" },
];

describe("RTL: layout uses logical properties", () => {
  it.each(sourceFiles.map((f) => [relative(appDir, f), f]))("%s", (_name, file) => {
    const source = readFileSync(file, "utf8")
      .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");

    const offenders: string[] = [];
    source.split("\n").forEach((line, index) => {
      if (line.includes("translate-x")) return;
      PHYSICAL_UTILITIES.forEach(({ pattern, name }) => {
        if (pattern.test(line)) offenders.push(`line ${index + 1}: ${name}`);
      });
    });

    expect(offenders, offenders.join("\n")).toEqual([]);
  });
});

describe("RTL: direction is driven by the interface language", () => {
  const i18nSource = readFileSync(resolve(appDir, "context/I18nContext.tsx"), "utf8");

  it("sets the document direction from the selected language", () => {
    expect(i18nSource).toContain("document.documentElement.dir");
    expect(i18nSource).toMatch(/interfaceLang === "ar" \? "rtl" : "ltr"/);
  });

  it("sets the document language alongside direction", () => {
    expect(i18nSource).toContain("document.documentElement.lang");
  });
});
