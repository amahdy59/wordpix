import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const stylesDir = resolve(__dirname, "../../styles");
const readStyle = (file: string) => readFileSync(resolve(stylesDir, file), "utf8");

const themeCss = readStyle("theme.css");
const globalsCss = readStyle("globals.css");
const allCss = `${themeCss}\n${globalsCss}`;

/** Custom properties declared anywhere in the stylesheet set. */
function declaredCustomProperties(css: string): Set<string> {
  const declared = new Set<string>();
  for (const match of css.matchAll(/^\s*(--[\w-]+)\s*:/gm)) {
    declared.add(match[1]);
  }
  return declared;
}

/** Custom properties consumed via var(). */
function referencedCustomProperties(css: string): Set<string> {
  const referenced = new Set<string>();
  for (const match of css.matchAll(/var\(\s*(--[\w-]+)/g)) {
    referenced.add(match[1]);
  }
  return referenced;
}

describe("Design token integrity", () => {
  /**
   * The regression this exists for: globals.css defined a full named type ladder
   * (.wp-text-xs ... .wp-type-display) on top of --wp-text-xs ... --wp-text-5xl,
   * and those nine variables were never declared anywhere. Every
   * `font-size: var(--wp-text-lg)` resolved invalid, so each element silently
   * inherited its size instead. Nothing failed loudly; the ladder just did
   * nothing.
   */
  it("declares every custom property it references", () => {
    const declared = declaredCustomProperties(allCss);
    const referenced = referencedCustomProperties(allCss);
    const undeclared = [...referenced].filter((name) => !declared.has(name)).sort();

    expect(undeclared, `var() references with no declaration: ${undeclared.join(", ")}`).toEqual([]);
  });

  it("declares the full type scale", () => {
    const declared = declaredCustomProperties(themeCss);
    ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"].forEach((step) => {
      expect(declared.has(`--wp-text-${step}`), `missing --wp-text-${step}`).toBe(true);
    });
  });

  it("keeps the type scale monotonically increasing", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"].map((step) => {
      const match = themeCss.match(new RegExp(`--wp-text-${step}:\\s*([\\d.]+)rem`));
      expect(match, `--wp-text-${step} is not declared in rem`).not.toBeNull();
      return Number((match as RegExpMatchArray)[1]);
    });

    sizes.forEach((size, i) => {
      if (i > 0) expect(size, `step ${i} is not larger than the one before`).toBeGreaterThan(sizes[i - 1]);
    });
  });

  it("declares every accent's paired foreground token", () => {
    const declared = declaredCustomProperties(themeCss);
    ["brand", "amber", "green", "rose", "blue"].forEach((accent) => {
      expect(declared.has(`--wp-${accent}`), `missing --wp-${accent}`).toBe(true);
      expect(declared.has(`--wp-text-on-${accent}`), `missing --wp-text-on-${accent}`).toBe(true);
    });
  });
});

describe("Reduced motion (WCAG 2.2.2, 2.3.3)", () => {
  it("ships a global prefers-reduced-motion backstop", () => {
    expect(globalsCss).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("neutralises animation and transition duration for everyone who opts out", () => {
    const block = globalsCss.slice(globalsCss.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(block).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
    expect(block).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
    expect(block).toMatch(/animation-iteration-count:\s*1\s*!important/);
  });

  it("replaces the shake with a non-motion signal rather than dropping the cue", () => {
    const block = globalsCss.slice(globalsCss.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(block).toContain(".animate-wp-shake");
    expect(block).toMatch(/outline:\s*2px solid/);
  });
});

describe("Components use tokens, not raw palette values", () => {
  const componentFiles = (function collect(dir: string, found: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
      if (entry === "__tests__") continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) collect(full, found);
      else if (entry.endsWith(".tsx")) found.push(full);
    }
    return found;
  })(resolve(__dirname, ".."));

  /**
   * Raw Tailwind palette utilities bypass the token layer, so those regions
   * never respond to the theme. The dark "cinema" panels behind scene canvases
   * and audio bars were hardcoded bg-slate-950/900 and stayed fixed in both
   * light and dark mode; accent tints used bg-amber-500/10 alongside the
   * --wp-amber they duplicated.
   */
  const FORBIDDEN = /\b(?:bg|text|border|fill|from|via|to)-(?:slate|amber|rose|teal|violet|emerald|indigo)-\d/;

  it.each(componentFiles.map((f) => [relative(resolve(__dirname, ".."), f), f]))(
    "%s uses only semantic colour tokens",
    (_name, file) => {
      const source = readFileSync(file, "utf8")
        .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");

      const offenders = source
        .split("\n")
        .map((line, i) => (FORBIDDEN.test(line) ? `line ${i + 1}` : null))
        .filter(Boolean);

      expect(offenders, offenders.join(", ")).toEqual([]);
    }
  );

  it("declares the immersive panel surface as a token with a paired foreground", () => {
    const declared = declaredCustomProperties(themeCss);
    ["--wp-panel", "--wp-panel-raised", "--wp-panel-border", "--wp-text-on-panel"].forEach((token) => {
      expect(declared.has(token), `missing ${token}`).toBe(true);
    });
  });
});

describe("Named type styles are actually used", () => {
  const componentSources = ["PrimaryButton.tsx", "SecondaryButton.tsx", "LessonHeader.tsx"].map((file) =>
    readFileSync(resolve(__dirname, "../shared", file), "utf8")
  );

  // A type ladder nothing imports is documentation, not a design system. These
  // three primitives are the adoption beachhead; the guard keeps them on it.
  it("shared primitives consume the named type styles", () => {
    componentSources.forEach((source) => {
      expect(source).toMatch(/wp-type-[a-z-]+/);
    });
  });

  it("every wp-type-* class used by a primitive is defined in globals.css", () => {
    componentSources.forEach((source) => {
      const used = source.match(/wp-type-[a-z-]+/g) ?? [];
      used.forEach((className) => {
        expect(globalsCss, `${className} is not defined`).toContain(`.${className} {`);
      });
    });
  });
});
