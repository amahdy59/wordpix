import { describe, expect, it } from "vitest";
import { groupDiscussionPrompts } from "../shared/discussionPrompts";

describe("discussion question grouping", () => {
  it("retains original content and IDs while attaching guidance to its question", () => {
    const prompts = Object.freeze([
      { id: "q1", prompt: "Why apologise?" },
      { id: "a1", prompt: "Answer → To acknowledge the problem." },
      { id: "r1", prompt: "Reason → It shows ownership." },
      { id: "e1", prompt: "Service example → Sorry for the delay." },
      { id: "q2", prompt: "How would you respond?" },
    ]);
    const groups = groupDiscussionPrompts(prompts);
    expect(groups.map(({ question }) => question.id)).toEqual(["q1", "q2"]);
    expect(groups[0].guidance).toEqual(prompts.slice(1, 4));
    expect(groups.flatMap(({ question, guidance }) => [question, ...guidance])).toEqual(prompts);
    expect(groups[0].question).toBe(prompts[0]);
  });

  it("preserves leading guidance and ordinary questions mentioning reasons", () => {
    const prompts = [
      { id: "a", prompt: "Answer: An introductory example." },
      { id: "q", prompt: "What reason would you give?" },
    ];
    expect(groupDiscussionPrompts(prompts).map(({ question }) => question.id)).toEqual(["a", "q"]);
    expect(groupDiscussionPrompts([])).toEqual([]);
  });
});
