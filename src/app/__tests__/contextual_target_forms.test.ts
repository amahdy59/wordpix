import { describe, expect, it } from "vitest";
import { auditContextualLesson } from "../data/contextualQuality";
import { unitUsageDataSchema } from "../data/usageTypes";
import raw from "../data/usage/spatial-relations.usage.json";

const base = unitUsageDataSchema.parse(raw)[0];
function sources(target: string, text: string) {
  return auditContextualLesson({
    ...base,
    targetWordsEnglish: [target],
    usage: { ...base.usage, scenes: [{ ...base.usage.scenes[0], scenario: text }] },
    reading: { ...base.reading, text: "" },
    exercises: [],
    contextExtensions: [],
  }).targetCoverage[0].sources;
}
describe("reviewed grammatical forms of locked target headings", () => {
  it.each([
    ["Brush Teeth", "He brushes his teeth before breakfast."],
    ["Taste", "She tastes soup before adding anything."],
    ["Get Out of Bed", "He gets out of bed at seven."],
    ["Wash Face", "She washes her face before breakfast."],
    ["Get Dressed", "He gets dressed after washing."],
    ["Eat Breakfast", "She eats breakfast at the kitchen table."],
    ["Leave Office", "He leaves the office at six."],
    ["Wash Dishes", "She washes the dishes after dinner."],
    ["Relax", "He relaxes at home."],
    ["Put On Pajamas", "He puts on pajamas before bedtime."],
    ["Go to Bed", "She goes to bed at ten."],
    ["Fall Asleep", "He falls asleep later."],
    ["Go Shopping", "She goes shopping on Saturday."],
  ])("recognizes %s in natural learner prose", (target, text) => {
    expect(sources(target, text)).toEqual(["scene"]);
  });
  it.each([
    ["Brush Teeth", "She brushes her hair."],
    ["Wash Face", "He washes his hands."],
    ["Leave Office", "He leaves the building."],
    ["Taste", "He expressed distaste."],
    ["Go to Bed", "She goes to school."],
  ])("keeps unrelated wording distinct from %s", (target, text) => {
    expect(sources(target, text)).toEqual([]);
  });
});
