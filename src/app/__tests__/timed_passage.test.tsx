import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { getActiveTranscriptRange, TimedPassageText } from "../shared/TimedPassageText";

const spans = [
  { start: 0, end: 7, from: 1, to: 2 },
  { start: 7, end: 13, from: 3, to: 4 },
];
describe("provider-timed transcript highlighting", () => {
  it("leaves silence and gaps unhighlighted", () => {
    expect(getActiveTranscriptRange(spans, 0)).toBeUndefined();
    expect(getActiveTranscriptRange(spans, 2)).toBeUndefined();
    expect(getActiveTranscriptRange(spans, 3)).toEqual(spans[1]);
  });
  it("preserves text and highlights only the active sentence", () => {
    const { container, rerender } = render(
      <TimedPassageText text="Hello. World." spans={spans} time={1.5} />
    );
    expect(container.textContent).toBe("Hello. World.");
    expect(container.querySelector("mark")?.textContent).toBe("Hello. ");
    rerender(<TimedPassageText text="Hello. World." spans={spans} time={null} />);
    expect(container.querySelector("mark")).toBeNull();
  });
  it("keeps vocabulary actions usable inside the active sentence", () => {
    render(
      <TimedPassageText text="Hello. World." spans={spans} time={3.5} vocabTerms={["World"]} />
    );
    expect(screen.getByRole("button", { name: /World/ })).toBeInTheDocument();
  });
  it("preserves the focused vocabulary button as audio advances or stops", () => {
    const terms = ["World"];
    const { rerender } = render(
      <TimedPassageText text="Hello. World." spans={spans} time={1.5} vocabTerms={terms} />
    );
    const button = screen.getByRole("button", { name: /World/ });
    button.focus();
    rerender(<TimedPassageText text="Hello. World." spans={spans} time={3.5} vocabTerms={terms} />);
    expect(screen.getByRole("button", { name: /World/ })).toBe(button);
    expect(button).toHaveFocus();
    rerender(
      <TimedPassageText text="Hello. World." spans={spans} time={null} vocabTerms={terms} />
    );
    expect(button).toHaveFocus();
  });
});
