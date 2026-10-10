import test from "node:test";
import assert from "node:assert/strict";
import { isVisualCandidate, imageGenerationPrompt } from "../lib/image_review_policy.mjs";
const good = {
  decision: "candidate",
  exactConceptMatch: true,
  confidence: 1,
  observedDescription: "A plain cream blouse on a wooden hanger.",
  readableTextOrLogo: false,
  visibleText: "",
  clutterOrAmbiguity: false,
  peopleCount: 0,
  womenCount: 0,
  humansNecessary: false,
};
test("uncertain identity, writing and incidental people cannot become candidates", () => {
  assert.equal(isVisualCandidate(good), true);
  for (const extra of [
    { confidence: 0.96 },
    { exactConceptMatch: false },
    { visibleText: "BLOUSE" },
    { readableTextOrLogo: true },
    { peopleCount: 1 },
    { womenCount: 1 },
    { peopleCount: -1 },
    { observedDescription: "" },
  ])
    assert.equal(isVisualCandidate({ ...good, ...extra }), false);
  assert.equal(isVisualCandidate([good]), false);
});
test("essential women need both semantic necessity and verified modest dress", () => {
  const mother = {
    ...good,
    peopleCount: 2,
    womenCount: 1,
    humansNecessary: true,
    femaleNecessary: true,
    modestWomen: true,
  };
  assert.equal(isVisualCandidate(mother), true);
  assert.equal(isVisualCandidate({ ...mother, femaleNecessary: false }), false);
  assert.equal(isVisualCandidate({ ...mother, modestWomen: false }), false);
});
test("generation requires a physical brief and explicit human plan without copying assessment text", () => {
  const item = {
    reviewedAnswer: "Blouse",
    visualBrief: "One cream blouse on a plain hanger.",
    humanMode: "none",
    reviewedQuestion: "Which target does Omar notice first?",
  };
  const prompt = imageGenerationPrompt(item);
  assert.match(prompt, /No people/);
  assert.ok(!prompt.includes(item.reviewedQuestion));
  assert.throws(() => imageGenerationPrompt({ ...item, humanMode: "hold" }), /required/);
  assert.throws(() => imageGenerationPrompt({ ...item, visualBrief: "" }), /required/);
});
test("numeric exceptions cannot permit readable text or numbers", () => {
  const symbols = ["2", "+", "3", "=", "5"];
  assert.equal(isVisualCandidate({ ...good, visibleText: "2 + 3 = 5" }), false);
  assert.equal(isVisualCandidate({ ...good, visibleText: "2 + 3 = 5" }, symbols), false);
  assert.equal(isVisualCandidate({ ...good, visibleText: "2 + 3 = 6" }, symbols), false);
  assert.equal(isVisualCandidate({ ...good, visibleText: "FIVE" }, symbols), false);
  assert.equal(
    isVisualCandidate({ ...good, visibleText: "2", readableTextOrLogo: true }, symbols),
    false
  );
  assert.throws(
    () =>
      imageGenerationPrompt({
        reviewedAnswer: "Two",
        visualBrief: "One card bearing the numeric target.",
        humanMode: "none",
        imageSymbols: ["2"],
      }),
    /symbols are prohibited/
  );
  assert.throws(
    () =>
      imageGenerationPrompt({
        reviewedAnswer: "Two",
        visualBrief: "One card.",
        humanMode: "none",
        imageSymbols: ["Dose"],
      }),
    /symbols are prohibited/
  );
});
