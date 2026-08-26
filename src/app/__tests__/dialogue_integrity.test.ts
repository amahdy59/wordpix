import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Guards the dialogue extraction, which has failed twice in two different ways
 * and was silent both times.
 *
 * First the parser paired lines by position, so a unit with a "Scene:" line
 * shifted every speaker/text pair by one and rendered bubbles reading
 * "Technician:" with nothing said — 923 lines across 91 units.
 *
 * Then, anchoring on the speaker label instead, the label pattern omitted
 * digits. Eight units name their speakers "Sibling 1" / "Flatmate 2", so every
 * one of their lines was dropped: the dialogue did not render wrong, it
 * disappeared. Nothing failed, because absence is indistinguishable from a
 * unit that simply has no dialogue.
 *
 * So the check is against the source of truth rather than against itself: if
 * Figma has a dialogue block for a unit, the generated module must have
 * dialogue.
 */

const ROOT = resolve(__dirname, "../../..");
const DUMP_DIR = join(ROOT, "figma-dump");
const UNITS_DIR = join(ROOT, "src/app/learning/units");

/** A dialogue block that carries at least one speaker line, in either form. */
function dumpHasDialogue(unitId: string): boolean {
  const path = join(DUMP_DIR, `${unitId}.json`);
  if (!existsSync(path)) return false;
  const dump = JSON.parse(readFileSync(path, "utf8"));
  const block = dump?.materials?.["mini-dialogue"];
  if (!block?.lines?.length) return false;
  // Skip the heading; a speaker label is "Name:" possibly containing digits.
  return block.lines
    .slice(1)
    .some((l: { text?: string }) => /^[A-Z][A-Za-z0-9 .'-]{0,18}:/.test((l.text ?? "").trim()));
}

const unitFiles = readdirSync(UNITS_DIR).filter((f) => f.endsWith(".ts") && f !== "index.ts");

describe("dialogue extraction", () => {
  it("keeps dialogue for every unit whose design file has some", () => {
    const dropped: string[] = [];
    for (const file of unitFiles) {
      const unitId = file.replace(/\.ts$/, "");
      if (!dumpHasDialogue(unitId)) continue;
      const source = readFileSync(join(UNITS_DIR, file), "utf8");
      if (!/\n\s+speaker: /.test(source)) dropped.push(unitId);
    }
    expect(dropped, `these units lost their dialogue in extraction`).toEqual([]);
  });

  /**
   * The corruption signature: `text` holding a bare speaker label. A bubble
   * that reads "Technician:" and nothing else is the visible symptom.
   */
  it("never stores a speaker label as the spoken line", () => {
    const offenders: string[] = [];
    for (const file of unitFiles) {
      const source = readFileSync(join(UNITS_DIR, file), "utf8");
      for (const match of source.matchAll(/\n\s+text: "((?:[^"\\]|\\.)*)"/g)) {
        if (/^[A-Z][A-Za-z0-9 .'-]{0,18}:$/.test(match[1].trim())) {
          offenders.push(`${file.replace(/\.ts$/, "")}: ${JSON.stringify(match[1])}`);
          break;
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  /** A stage direction belongs in `scene`, never in `speaker`. */
  it("never stores a stage direction as a speaker", () => {
    const offenders: string[] = [];
    for (const file of unitFiles) {
      const source = readFileSync(join(UNITS_DIR, file), "utf8");
      if (/\n\s+speaker: "Scene:/i.test(source)) offenders.push(file.replace(/\.ts$/, ""));
    }
    expect(offenders).toEqual([]);
  });

  /**
   * A ratchet on the total. Either failure above would also show up here as a
   * sudden drop, which catches shapes neither pattern anticipates.
   */
  it("holds the overall dialogue line count", () => {
    const total = unitFiles.reduce((sum, file) => {
      const source = readFileSync(join(UNITS_DIR, file), "utf8");
      return sum + (source.match(/\n\s+speaker: /g)?.length ?? 0);
    }, 0);
    expect(total).toBeGreaterThanOrEqual(1855);
  });
});
