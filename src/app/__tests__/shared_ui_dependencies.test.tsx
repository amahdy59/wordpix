import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../content/sentenceMedia", () => {
  throw new Error("Shared interface controls must not initialize the sentence-media registry.");
});

import { Button } from "../shared";

it("loads ordinary interface controls independently of sentence-media lookup", () => {
  render(<Button>Continue</Button>);
  expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
});
