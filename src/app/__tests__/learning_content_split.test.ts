import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import ts from "typescript";
import { COURSE_UNITS as sourceUnits } from "../data/lessons";
import { COURSE_UNITS as summaries } from "../data/courseCatalog";
import { LEXICON_DICTIONARY, getLexiconEntry } from "../data/lexiconDictionary";
import { loadLexicon, lexiconShardFor } from "../data/lexiconLoader";
import { loadLessonStory } from "../data/lessonStoryLoader";

describe("split learning content", () => {
  it("preserves every catalogue field and media mapping except deferred passages", () => {
    const expected = Object.fromEntries(
      Object.entries(sourceUnits).map(([id, unit]) => [
        id,
        { ...unit, groups: unit.groups.map(({ story: _story, ...summary }) => summary) },
      ])
    );
    expect(summaries).toEqual(expected);
  });

  it("returns every original passage, byte for byte", async () => {
    for (const unit of Object.values(sourceUnits)) {
      for (const group of unit.groups) {
        expect(await loadLessonStory(group.id), group.id).toBe(group.story);
      }
    }
    expect(await loadLessonStory("daily-review")).toBeUndefined();
  });

  it("preserves all dictionary entries and separator aliases", async () => {
    // Check by shard, not by individual entry, to keep the parity audit inexpensive.
    const buckets = new Map<number, string[]>();
    for (const id of Object.keys(LEXICON_DICTIONARY)) {
      const shard = lexiconShardFor(id);
      buckets.set(shard, [...(buckets.get(shard) ?? []), id]);
    }
    for (const ids of buckets.values()) {
      const lexicon = await loadLexicon(ids);
      for (const id of ids) {
        expect(lexicon.getLexiconEntry(id), id).toEqual(getLexiconEntry(id));
        const alias = id.replace(/[-_]/g, "").toUpperCase();
        expect(lexicon.getLexiconEntry(alias), alias).toEqual(getLexiconEntry(alias));
      }
    }
  });

  it("preserves unit-specific senses, extended glosses and unknown-word fallback", async () => {
    for (const id of ["shower", "pipe", "crane", "custom-gadget-xyz"]) {
      const lexicon = await loadLexicon([id]);
      expect(lexicon.getLexiconEntry(id, "Custom item", "bathroom")).toEqual(
        getLexiconEntry(id, "Custom item", "bathroom")
      );
    }
  });

  it("keeps monolithic sources out of browser imports", () => {
    const root = resolve(__dirname, "../..");
    const offenders: string[] = [];
    function walk(directory: string) {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== "__tests__") walk(path);
          continue;
        }
        if (!/\.tsx?$/.test(path)) continue;
        const source = readFileSync(path, "utf8");
        const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
        function visit(node: ts.Node) {
          if (
            ts.isImportDeclaration(node) &&
            /\/(lessons|lexiconDictionary)$/.test((node.moduleSpecifier as ts.StringLiteral).text)
          ) {
            const clause = node.importClause;
            const typesOnly =
              clause?.isTypeOnly ||
              (clause?.namedBindings &&
                ts.isNamedImports(clause.namedBindings) &&
                clause.namedBindings.elements.every((item) => item.isTypeOnly));
            if (!typesOnly) offenders.push(path);
          }
          if (
            ts.isCallExpression(node) &&
            node.expression.kind === ts.SyntaxKind.ImportKeyword &&
            node.arguments.some(
              (arg) => ts.isStringLiteral(arg) && /\/(lessons|lexiconDictionary)$/.test(arg.text)
            )
          )
            offenders.push(path);
          ts.forEachChild(node, visit);
        }
        visit(file);
      }
    }
    walk(root);
    expect(offenders).toEqual([]);
  });
});
