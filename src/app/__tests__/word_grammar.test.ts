import { describe, expect, it } from "vitest";
import {
  articleFor,
  classifyLabel,
  contrastSentence,
  headWord,
  identifyParts,
  identifySentence,
  namePhrase,
} from "../content/wordGrammar";

describe("articleFor", () => {
  it("follows the sound, not the spelling", () => {
    // The rule this replaced was `/^[aeiou]/`, which got every one of these
    // wrong in one direction or the other.
    expect(articleFor("Hour Hand")).toBe("an");
    expect(articleFor("Honor Roll")).toBe("an");
    expect(articleFor("Uniform")).toBe("a");
    expect(articleFor("Ukulele")).toBe("a");
    expect(articleFor("Username")).toBe("a");
    expect(articleFor("Euro")).toBe("a");
    expect(articleFor("Onesie")).toBe("a");
    expect(articleFor("Umbrella")).toBe("an");
    expect(articleFor("Uncle")).toBe("an");
  });

  it("reads a spelled-out acronym by its first letter's name", () => {
    expect(articleFor("MRI scan")).toBe("an");
    expect(articleFor("SUV")).toBe("an");
    expect(articleFor("LED Strip")).toBe("an");
    expect(articleFor("HOA Fee")).toBe("an");
    expect(articleFor("USB Cable")).toBe("a");
    expect(articleFor("USB-C Hub")).toBe("a");
    expect(articleFor("DVD Player")).toBe("a");
    // Said as a word, so the letter rule must not apply.
    expect(articleFor("NASDAQ")).toBe("a");
  });

  it("follows how a leading numeral is read aloud", () => {
    expect(articleFor("8-Ball")).toBe("an");
    expect(articleFor("3D Printer")).toBe("a");
    expect(articleFor("401k")).toBe("a");
  });

  it("ignores diacritics", () => {
    expect(articleFor("Éclair")).toBe("an");
  });
});

describe("headWord", () => {
  it("takes the last word of an ordinary compound", () => {
    expect(headWord("Running Shoes")).toBe("shoes");
    expect(headWord("Olive Oil")).toBe("oil");
  });

  it("stops at a prepositional tail", () => {
    // Otherwise "Chest of Drawers" reads as a plural and becomes "These are
    // chest of drawers."
    expect(headWord("Chest of Drawers")).toBe("chest");
    expect(headWord("Clock with Time Zones")).toBe("clock");
  });
});

describe("classifyLabel", () => {
  it("recognises things that only come as a pair", () => {
    expect(classifyLabel("Pliers")).toBe("pair");
    expect(classifyLabel("Scissors")).toBe("pair");
    expect(classifyLabel("Running Shoes")).toBe("pair");
    expect(classifyLabel("Safety Goggles")).toBe("pair");
    // The `-is` spelling hides the plural, so the morphology rule cannot see it.
    expect(classifyLabel("Khakis")).toBe("pair");
    expect(classifyLabel("Skis")).toBe("pair");
  });

  it("keeps a singular label singular even in a pair topic", () => {
    // Every other label in `footwear` is a pair; this one is one shoe, and
    // "a pair of monk strap" would be ungrammatical.
    expect(classifyLabel("Monk Strap", "footwear")).toBe("count");
    expect(classifyLabel("Wedges", "footwear")).toBe("pair");
  });

  it("recognises plurals and leaves singular look-alikes alone", () => {
    expect(classifyLabel("Eggs")).toBe("plural");
    expect(classifyLabel("Peas")).toBe("plural");
    expect(classifyLabel("Lens")).toBe("count");
    expect(classifyLabel("Compass")).toBe("count");
    expect(classifyLabel("Octopus")).toBe("count");
    expect(classifyLabel("Oasis")).toBe("count");
    expect(classifyLabel("Bachelor's")).toBe("count");
    // A trailing capital S is a letter, not a plural.
    expect(classifyLabel("GPS")).toBe("count");
  });

  it("recognises uncountables", () => {
    expect(classifyLabel("Water")).toBe("mass");
    expect(classifyLabel("Olive Oil")).toBe("mass");
    expect(classifyLabel("Wood", "materials")).toBe("mass");
    expect(classifyLabel("Brightness")).toBe("mass");
  });

  it("scopes an ambiguous label by its topic", () => {
    // The same word is a pair of sandals in one unit and a stack of glass
    // plates in another.
    expect(classifyLabel("Slides", "footwear")).toBe("pair");
    expect(classifyLabel("Slides", "laboratory")).toBe("plural");
  });

  it("sends anything that is not a countable noun to the term frame", () => {
    expect(classifyLabel("Run", "movement-verbs")).toBe("term");
    expect(classifyLabel("Happy", "basic-emotions")).toBe("term");
    expect(classifyLabel("Under", "prepositions-of-place")).toBe("term");
    expect(classifyLabel("Crimson", "shades-tones")).toBe("term");
    // A gerund names an activity and takes no article, wherever it appears.
    expect(classifyLabel("Knitting", "creative-hobbies")).toBe("term");
    expect(classifyLabel("Swimming", "beach")).toBe("term");
    // …but the ordinary nouns that end the same way are not gerunds.
    expect(classifyLabel("Building", "giving-directions")).toBe("count");
    expect(classifyLabel("Earring", "accessories-jewelry")).toBe("count");
  });

  it("does not read a verb phrase as the plural noun it ends on", () => {
    expect(classifyLabel("Wash Dishes", "daily-routines")).toBe("term");
    expect(classifyLabel("Put On Pajamas", "daily-routines")).toBe("term");
    expect(classifyLabel("Blow Candles", "birthday-party")).toBe("term");
  });

  it("treats whole utterances and measure phrases as terms", () => {
    expect(classifyLabel("Is this on sale?", "supermarket")).toBe("term");
    expect(classifyLabel("I need a refund", "supermarket")).toBe("term");
    expect(classifyLabel("A Loaf Of", "market")).toBe("term");
  });

  it("names days and months rather than counting them", () => {
    expect(classifyLabel("Monday", "days-months")).toBe("proper");
  });
});

describe("identifySentence", () => {
  it("matches the number of the thing it names", () => {
    expect(identifySentence("Lamp")).toBe("This is a lamp.");
    expect(identifySentence("Pliers")).toBe("This is a pair of pliers.");
    expect(identifySentence("Eggs")).toBe("These are eggs.");
    expect(identifySentence("Water")).toBe("This is water.");
    expect(identifySentence("Monday", "days-months")).toBe("This is Monday.");
    expect(identifySentence("Run", "movement-verbs")).toBe("The word is “run”.");
  });

  it("keeps acronyms in capitals and lowercases everything else", () => {
    expect(identifySentence("Bath Towel")).toBe("This is a bath towel.");
    expect(identifySentence("USB Cable")).toBe("This is a USB cable.");
  });

  it("never leaves an article stranded in front of a plural", () => {
    // The whole class of bug this module exists to stop.
    for (const label of ["Pliers", "Scissors", "Jeans", "Sunglasses", "Eggs", "Water", "Rice"]) {
      expect(identifySentence(label)).not.toMatch(/\bis an? (pliers|scissors|jeans|sunglasses)\b/);
      expect(identifySentence(label)).not.toMatch(/^This is an? (eggs|water|rice)\b/);
    }
  });
});

describe("contrastSentence", () => {
  it("uses the far deictic so it reads apart from the answer", () => {
    expect(contrastSentence("Mirror")).toBe("That's a mirror.");
    expect(contrastSentence("Eggs")).toBe("Those are eggs.");
    expect(contrastSentence("Pliers")).toBe("That's a pair of pliers.");
  });
});

describe("identifyParts", () => {
  it("splits at the word so a screen can accent just that", () => {
    expect(identifyParts("Lamp")).toEqual({ before: "This is a ", word: "lamp", after: "." });
    expect(identifyParts("Pliers")).toEqual({
      before: "This is a pair of ",
      word: "pliers",
      after: ".",
    });
    expect(identifyParts("Eggs")).toEqual({ before: "These are ", word: "eggs", after: "." });
  });

  it("reassembles into exactly the sentence", () => {
    for (const [label, topic] of [
      ["Lamp", undefined],
      ["Pliers", undefined],
      ["Eggs", undefined],
      ["Water", undefined],
      ["Run", "movement-verbs"],
    ] as const) {
      const { before, word, after } = identifyParts(label, topic);
      expect(before + word + after).toBe(identifySentence(label, topic));
    }
  });
});

describe("namePhrase", () => {
  it("returns the bare phrase for embedding in other copy", () => {
    expect(namePhrase("Lamp")).toBe("a lamp");
    expect(namePhrase("Umbrella")).toBe("an umbrella");
    expect(namePhrase("Pliers")).toBe("a pair of pliers");
    expect(namePhrase("Water")).toBe("water");
  });
});
