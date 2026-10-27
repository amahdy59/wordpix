import { describe, expect, it } from "vitest";
import { buildSentenceCompletion, getRichSentence } from "../exercises/exerciseContent";
import { sentenceCloze } from "../exercises/sentenceCloze";
import { loadUnitVocabulary } from "../data/vocabulary";
import { resolveSentenceMedia } from "../shared/SentenceQuestionSupport";
import { isGenericLearningExample } from "../content/learningExampleQuality";
import { loadLexicon } from "../data/lexiconLoader";

describe("concrete practice sentence repairs", () => {
  it("rejects teaching placeholders without rejecting real lesson events", () => {
    for (const example of [
      "This word is included in this lesson.",
      "The term appears in the lesson.",
      "The boots was used during the activity.",
      'The glossary uses the term "Ginger Ale" in an educational description.',
      "The word is brush teeth.",
    ]) {
      expect(isGenericLearningExample(example), example).toBe(true);
    }
    expect(isGenericLearningExample("The teacher starts the lesson at nine.")).toBe(false);
    expect(isGenericLearningExample("The course fee is included in the bill.")).toBe(false);
    expect(isGenericLearningExample("The written glossary uses the proton-transfer model.")).toBe(
      false
    );
  });

  it("assesses natural possessives and articles instead of forcing bare headings", () => {
    expect(sentenceCloze("I brush my teeth before breakfast.", "Brush Teeth")).toBe(
      "I _____ before breakfast."
    );
    expect(sentenceCloze("I leave the office at six.", "Leave Office")).toBe("I _____ at six.");
    expect(buildSentenceCompletion("I brush my teeth before breakfast.", "Brush Teeth")).toEqual({
      tokens: ["I", "brush", "my", "teeth", "before", "breakfast."],
      blankStart: 1,
      answer: ["brush", "my", "teeth"],
    });
    expect(sentenceCloze("I wash my hands before breakfast.", "Wash Face")).toBe(
      "I wash my hands before breakfast."
    );
    expect(
      sentenceCloze("I use a double boiler to melt the chocolate gently.", "Double Boil")
    ).toBe("I _____ to melt the chocolate gently.");
    expect(sentenceCloze("He goes bird-watching in the park.", "Bird Watching")).toBe(
      "He goes _____ in the park."
    );
    expect(sentenceCloze("A real sentence.", "")).toBe("A real sentence.");
  });

  it("assesses completed question templates without retaining ellipsis punctuation", () => {
    expect(sentenceCloze("Where can I find the rice?", "Where can I find...?")).toBe(
      "_____ the rice?"
    );
    expect(sentenceCloze("Do you have any fresh bread?", "Do you have...?")).toBe(
      "_____ any fresh bread?"
    );
  });

  it("uses real target-specific examples for former term fallbacks", async () => {
    for (const unit of ["daily-routines", "cooking-methods", "supermarket", "facial-expressions"]) {
      const words = await loadUnitVocabulary(unit);
      for (const word of words.filter((item) =>
        ["brush-teeth", "pack-bag", "fold", "where-can-i-find-", "raise-hand"].includes(item.id)
      )) {
        const sentence = getRichSentence(word).full;
        expect(sentence, word.id).not.toMatch(/^The word is /i);
        expect(sentenceCloze(sentence, word.label), word.id).not.toBe(sentence);
      }
    }
  });

  it("defaults unbound examples to male references while retaining female-specific meanings", async () => {
    const academic = await loadUnitVocabulary("academic-life");
    expect(academic.find((word) => word.id === "double-major")?.exampleUsage).toBe(
      "He chose a double major in mathematics and economics."
    );
    expect(academic.find((word) => word.id === "dean-s-list")?.exampleUsage).toBe(
      "His strong grades placed him on the dean's list."
    );
    const family = await loadUnitVocabulary("family");
    expect(family.find((word) => word.id === "mother")?.exampleUsage).toBe(
      "My mother called to ask about my new job."
    );
    expect(family.find((word) => word.id === "sister")?.description).toContain("female");
  });

  it("loads concrete examples in legacy units that have no bilingual loader", async () => {
    for (const unit of [
      "park",
      "playground",
      "camping-site",
      "computer-lab",
      "tv-studio",
      "hadith-niyyah",
    ]) {
      const examples = (await loadUnitVocabulary(unit)).filter((word) => word.exampleUsage);
      expect(examples.length, unit).toBeGreaterThan(0);
      for (const word of examples) {
        expect(getRichSentence(word).full, `${unit}/${word.id}`).not.toMatch(/^The word is /i);
      }
    }
  });

  it("keeps exact sentence media bound to its original wording", () => {
    const sentence = "She bought three apples.";
    expect(resolveSentenceMedia("three", sentence)?.imagePath).toBeTruthy();
    expect(resolveSentenceMedia("three", "He bought three apples.")).toBeUndefined();
  });

  it("keeps English and Arabic reference examples aligned in the lazy catalogue", async () => {
    const lexicon = await loadLexicon(["sink"]);
    const entry = lexicon.getLexiconEntry("sink");
    expect(entry.exampleSentence).toBe(
      "He stood at the bathroom sink to wash his face with warm water."
    );
    expect(entry.exampleArabic).toBe("وقف أمام حوض الحمام ليغسل وجهه بالماء الدافئ.");
    expect(entry.sentences[0]).toMatchObject({
      en: entry.exampleSentence,
      ar: entry.exampleArabic,
    });
  });

  it("retains valid illustrated practice alongside a richer vocabulary example", async () => {
    const word = (await loadUnitVocabulary("coffee-shop")).find((word) => word.id === "tamper")!;
    expect(word.exampleUsage).toBe("The barista presses the coffee grounds with a tamper.");
    const sentence = getRichSentence(word).full;
    expect(resolveSentenceMedia(word.id, sentence)?.imagePath).toBeTruthy();
  });
});
