import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import ts from "typescript";

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
  const baseClasses = cls.replace(/^["'`]/, "");
  if (/(?:^|\s)min-h-\[(4[4-9]|[5-9]\d|\d{3,})px\]/.test(baseClasses)) return true;
  if (/(?:^|\s)h-\[(4[4-9]|[5-9]\d|\d{3,})px\]/.test(baseClasses)) return true;
  // Tailwind size/height scale: 11 = 2.75rem = 44px.
  if (/(?:^|\s)(?:size|min-h|h)-(1[1-9]|[2-9]\d)\b/.test(baseClasses)) return true;
  if (/(?:^|\s)wp-touch-target\b/.test(baseClasses)) return true;
  // Full-height flex children inherit their track's height.
  if (/(?:^|\s)(?:h|min-h)-full\b/.test(baseClasses)) return true;
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

  it("does not explicitly size native buttons below 44px without a 44px minimum", () => {
    const offenders: string[] = [];

    files.forEach((file) => {
      const source = readFileSync(file, "utf8");
      const ast = ts.createSourceFile(
        file,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
      );

      const visit = (node: ts.Node) => {
        if (ts.isJsxOpeningElement(node) && node.tagName.getText(ast) === "button") {
          const classAttribute = node.attributes.properties.find(
            (attribute): attribute is ts.JsxAttribute =>
              ts.isJsxAttribute(attribute) && attribute.name.getText(ast) === "className"
          );
          const classSource = classAttribute?.initializer?.getText(ast) ?? "";
          const declaresMinimum = declaresAdequateHeight(classSource);
          const declaresUndersized =
            /\b(?:min-h|h)-\[(?:[1-3]?\d|4[0-3])px\]/.test(classSource) ||
            /\b(?:size|h)-(?:[1-9]|10)\b/.test(classSource);

          if (declaresUndersized && !declaresMinimum) {
            const { line } = ast.getLineAndCharacterOfPosition(node.getStart(ast));
            offenders.push(`${relative(appDir, file)}:${line + 1} ${classSource.slice(0, 100)}`);
          }
        }
        ts.forEachChild(node, visit);
      };

      visit(ast);
    });

    expect(offenders, `explicitly undersized buttons:\n  ${offenders.join("\n  ")}`).toEqual([]);
  });

  it("keeps every shared AudioButton size at least 44px", () => {
    const source = readFileSync(resolve(appDir, "shared/AudioButton.tsx"), "utf8");
    expect(source).toMatch(/sm:\s*["']size-11\b/);
    expect(source).toContain("min-h-[44px] min-w-[44px]");
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
