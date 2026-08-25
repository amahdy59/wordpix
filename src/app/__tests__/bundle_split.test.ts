import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Keeps the vocabulary split from quietly undoing itself.
 *
 * `lessons.ts` was 3.39 MB and was the entire main chunk: 3.34 MB minified,
 * downloaded and parsed in full by someone opening one unit out of 182. The
 * words now live one module per unit and arrive as their own chunk.
 *
 * What makes that fragile is how little it takes to reverse. A single module
 * that walks every unit at import time pulls all 182 chunks back into the
 * entry bundle, and nothing about the app looks broken when it happens — the
 * screens still work, the tests still pass, and the only symptom is a number
 * in a build log that nobody reads. These are the specific ways it can
 * regress, asserted where they are cheap to see.
 */

const appDir = resolve(__dirname, "..");
const srcDir = resolve(appDir, "..");

function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "__tests__" || entry === "node_modules") continue;
      sourceFiles(full, found);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      found.push(full);
    }
  }
  return found;
}

const shipped = sourceFiles(srcDir).map((path) => ({
  path: path.slice(srcDir.length + 1),
  text: readFileSync(path, "utf8"),
}));

describe("vocabulary stays out of the main bundle", () => {
  it("keeps the whole-catalogue loaders out of shipped code", () => {
    // `loadAllVocabulary` exists for integrity checks and tooling. Calling it
    // from anything that reaches a browser fetches all 182 unit chunks, which
    // is the split undone in one line.
    const offenders = shipped
      // The module that defines them is not a caller of them.
      .filter(({ path }) => path !== "app/data/vocabulary.ts")
      .filter(({ text }) => /loadAll(Unit)?Vocabulary/.test(text))
      .map(({ path }) => path);
    expect(offenders, "these are test-only helpers").toEqual([]);
  });

  it("does not rebuild an eager index over every unit", () => {
    // The original `ALL_VOCABULARY` / `VOCAB_BY_ID` pair was two lines at
    // module scope, and those two lines were what kept the catalogue in the
    // entry chunk. Re-adding either — anywhere — restores the problem.
    const lessons = readFileSync(join(appDir, "data", "lessons.ts"), "utf8");
    expect(lessons).not.toMatch(/export const ALL_VOCABULARY/);
    expect(lessons).not.toMatch(/export const VOCAB_BY_ID/);
    expect(lessons).not.toMatch(/world\.vocabulary/);
  });

  it("imports exactly one unit module eagerly", () => {
    // bedroom is DEFAULT_UNIT_ID: the placement quiz and splash both read it
    // before a learner has chosen anything, so deferring it would cost a round
    // trip and save nothing. Any *second* static import of a unit is a leak.
    const eager = shipped.flatMap(({ path, text }) =>
      // Static `import ... from` and `export ... from` both pull the module
      // into whatever chunk names it; only `import("...")` defers.
      [...text.matchAll(/^(?:import|export)[^;]*?from "[^"]*units\/([a-z0-9-]+)";/gm)].map((m) => ({
        path,
        unit: m[1],
      }))
    );
    expect([...new Set(eager.map((e) => e.unit))]).toEqual(["bedroom"]);
  });

  it("loads units only through the registry", () => {
    // A screen reaching for `data/units/<id>` directly would bypass the cache
    // and the id map that keeps `getWords` synchronous.
    const direct = shipped
      .filter(
        ({ path, text }) =>
          !path.startsWith("app/data/") && /import\("\.[^"]*data\/units\//.test(text)
      )
      .map(({ path }) => path);
    expect(direct).toEqual([]);
  });

  it("holds the catalogue itself to a sane size", () => {
    // A ratchet, not a target. `lessons.ts` carries the groups and the unit
    // metadata; if it drifts back toward a megabyte, the words have crept
    // home. It was 3.39 MB before the split and about 790 KB after.
    const bytes = statSync(join(appDir, "data", "lessons.ts")).size;
    expect(bytes).toBeLessThan(1_100_000);
  });
});

describe("a link to a unit opens that unit", () => {
  it("passes the unit id on when routing to a unit screen", () => {
    // `GO` has always accepted `unitId` for these two destinations, and the
    // route resolver has always produced it — but the handler in between
    // dispatched `{ type: "GO", to: screen.id }` and dropped it. Every shared
    // or bookmarked unit link therefore opened The Bedroom, the reducer's
    // fallback. Caught by driving the built app: #/learn/bathroom rendered
    // "The Bedroom".
    const app = readFileSync(join(appDir, "App.tsx"), "utf8");
    const branch = app.slice(app.indexOf('screen.id === "lesson-entry"'));
    expect(branch.slice(0, 300)).toMatch(/unitId: screen\.unitId/);
  });
});
