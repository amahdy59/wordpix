import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(__dirname, "../../..");
const read = (file: string) => readFileSync(resolve(projectRoot, file), "utf8");

/** Extracts `'@name': path.resolve(__dirname, './x')` pairs from a vite config. */
function parseViteAliases(source: string): Record<string, string> {
  const block = source.slice(source.indexOf("alias: {"));
  const aliases: Record<string, string> = {};
  for (const match of block.matchAll(/["']([@\w/]+)["']:\s*path\.resolve\(__dirname,\s*["']([^"']+)["']\)/g)) {
    aliases[match[1]] = match[2].replace(/^\.\//, "");
  }
  return aliases;
}

const tsconfig = JSON.parse(read("tsconfig.json").replace(/\/\*[\s\S]*?\*\//g, ""));
const tsPaths: Record<string, string[]> = tsconfig.compilerOptions.paths;
const viteAliases = parseViteAliases(read("vite.config.ts"));
const vitestAliases = parseViteAliases(read("vitest.config.ts"));

describe("Path aliases", () => {
  /**
   * Three of the six original aliases — @shared, @types, @constants — pointed
   * at src/shared, src/types, and src/constants, none of which exist (the real
   * locations are src/app/shared, src/app/types.ts, src/app/constants.ts). Any
   * import through them would have failed to resolve.
   */
  it("all resolve to directories that exist", () => {
    Object.entries(tsPaths).forEach(([alias, [target]]) => {
      const dir = target.replace(/\/\*$/, "");
      expect(existsSync(resolve(projectRoot, dir)), `${alias} -> ${dir} does not exist`).toBe(true);
    });
  });

  it("are declared identically in tsconfig and vite", () => {
    const tsNames = Object.keys(tsPaths).map((k) => k.replace("/*", "")).sort();
    expect(Object.keys(viteAliases).sort()).toEqual(tsNames);
  });

  it("point at the same targets in tsconfig and vite", () => {
    Object.entries(tsPaths).forEach(([alias, [target]]) => {
      const name = alias.replace("/*", "");
      expect(viteAliases[name], `${name} target mismatch`).toBe(target.replace(/\/\*$/, ""));
    });
  });

  it("are mirrored in the vitest config so tests and build agree", () => {
    expect(vitestAliases).toEqual(viteAliases);
  });
});

describe("CI gates", () => {
  const workflow = read(".github/workflows/deploy.yml");
  const pkg = JSON.parse(read("package.json"));

  it("runs lint, typecheck, and tests before building", () => {
    const lintAt = workflow.indexOf("pnpm run lint");
    const typecheckAt = workflow.indexOf("pnpm run typecheck");
    const testAt = workflow.indexOf("pnpm test");
    const buildAt = workflow.indexOf("pnpm run build");

    [lintAt, typecheckAt, testAt, buildAt].forEach((index) => expect(index).toBeGreaterThan(-1));
    expect(lintAt).toBeLessThan(buildAt);
    expect(typecheckAt).toBeLessThan(buildAt);
    expect(testAt).toBeLessThan(buildAt);
  });

  it("exposes every gate as an npm script", () => {
    ["lint", "typecheck", "test", "build"].forEach((script) => {
      expect(pkg.scripts[script], `missing "${script}" script`).toBeTruthy();
    });
  });
});
