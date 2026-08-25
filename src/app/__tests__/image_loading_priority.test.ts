import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const appDir = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(appDir, p), "utf8");

/**
 * Every picture a learner is looking at must be fetched eagerly.
 *
 * `WordImage` defaults to `loading="lazy"`, which is right for the scrolling
 * word lists it was first written for and wrong for a drill, where the whole
 * screen is one question and every image on it is needed to answer. The
 * default was inherited everywhere: the exercise hero — the largest element on
 * screen and the LCP candidate — was lazily loaded, so the browser delayed
 * discovering the one image the learner was waiting for.
 *
 * The rule is the standard one. Above the fold is never lazy; only the LCP
 * candidate gets `fetchpriority="high"`, because marking everything high
 * prioritises nothing.
 */

interface Case {
  file: string;
  /** Marker identifying the WordImage call to inspect. */
  anchor: string;
  high: boolean;
}

const HEROES: Case[] = [
  { file: "exercises/ExerciseContextFill.tsx", anchor: "word={currentTargetWord}", high: true },
  { file: "exercises/ExerciseSentenceBuilder.tsx", anchor: "word={currentTargetWord}", high: true },
  { file: "exercises/ExerciseListenRepeat.tsx", anchor: "word={currentWord}", high: true },
  { file: "exercises/SkillExerciseRunner.tsx", anchor: "word={imageWord}", high: true },
  // Option grids: on screen and needed to answer, so eager — but four equal
  // tiles have no single LCP candidate, so priority stays default.
  { file: "exercises/ExerciseQuickQuiz.tsx", anchor: "word={option}", high: false },
  { file: "exercises/ExerciseRecallMatch.tsx", anchor: "word={card}", high: false },
];

/** The `<WordImage ... />` call containing `anchor`. */
function wordImageCall(source: string, anchor: string): string {
  const at = source.indexOf(anchor);
  expect(at, `anchor ${anchor} not found`).toBeGreaterThan(-1);
  const open = source.lastIndexOf("<WordImage", at);
  expect(open, `no <WordImage before ${anchor}`).toBeGreaterThan(-1);
  const close = source.indexOf("/>", at);
  return source.slice(open, close + 2);
}

describe("exercise imagery is fetched eagerly", () => {
  for (const { file, anchor, high } of HEROES) {
    it(`${file} loads its picture eagerly`, () => {
      const call = wordImageCall(read(file), anchor);
      expect(call).toContain('loading="eager"');
      expect(call).not.toContain('loading="lazy"');
    });

    it(`${file} ${high ? "prioritises" : "does not over-prioritise"} it`, () => {
      const call = wordImageCall(read(file), anchor);
      if (high) expect(call).toContain('fetchPriority="high"');
      else expect(call).not.toContain('fetchPriority="high"');
    });
  }

  it("leaves the scrolling word list lazy", () => {
    // VocabSidebar is a long list, most of it off screen: lazy is correct
    // there, and this guards against a blanket find-and-replace.
    const call = wordImageCall(read("lesson/VocabSidebar.tsx"), "word={word}");
    expect(call).not.toContain('loading="eager"');
  });

  it("still forwards the priority hint to the DOM", () => {
    // React 18 does not type the camelCase form, so WordImage spreads a
    // lowercase attribute by hand. If that ever regresses, every
    // fetchPriority above becomes a silent no-op.
    const source = read("shared/WordImage.tsx");
    expect(source).toMatch(/fetchpriority:\s*fetchPriority/);
  });
});
