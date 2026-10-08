import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestionImage } from "../shared/QuestionImage";

describe("verified question image fallback", () => {
  it("tries a vector alternative with its own alt before reporting exhaustion", () => {
    const exhausted = vi.fn();
    render(
      <QuestionImage
        media={{
          imagePath: "/photo.webp",
          imageAlt: "Photographed folders on three trays",
          imageFallbacks: [
            { imagePath: "/scene.svg", imageAlt: "Illustrated folders on three trays" },
          ],
        }}
        onExhausted={exhausted}
      />
    );
    fireEvent.error(screen.getByAltText("Photographed folders on three trays"));
    expect(exhausted).not.toHaveBeenCalled();
    expect(screen.getByAltText("Illustrated folders on three trays").getAttribute("src")).toContain(
      "scene.svg"
    );
    fireEvent.error(screen.getByAltText("Illustrated folders on three trays"));
    expect(exhausted).toHaveBeenCalledOnce();
  });
  it("does not retry duplicate paths and allows a different question to load", () => {
    const exhausted = vi.fn();
    const { rerender } = render(
      <QuestionImage
        media={{
          imagePath: "/one.webp",
          imageAlt: "One book",
          imageFallbacks: [{ imagePath: "/one.webp", imageAlt: "Duplicate" }],
        }}
        onExhausted={exhausted}
      />
    );
    fireEvent.error(screen.getByAltText("One book"));
    expect(exhausted).toHaveBeenCalledOnce();
    rerender(
      <QuestionImage
        media={{ imagePath: "/two.webp", imageAlt: "Two bags" }}
        onExhausted={exhausted}
      />
    );
    expect(screen.getByAltText("Two bags")).toBeTruthy();
  });
});
