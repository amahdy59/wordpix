import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LearnerAvatar } from "../shared/LearnerAvatar";

/**
 * The regression: the home dashboard and the profile both pointed at
 * /images/core/learner-avatar.webp, which does not exist in public/, so both
 * rendered a broken image icon in their header. The path was root-absolute
 * too, so it would have 404ed under the configured base even if added.
 */
describe("LearnerAvatar", () => {
  it("resolves the portrait against the configured base", () => {
    render(<LearnerAvatar name="Ahmed" />);
    const img = screen.getByRole("img", { name: /ahmed profile/i });
    expect(img.getAttribute("src")).toMatch(/images\/core\/learner-avatar\.webp$/);
  });

  it("falls back to an initial rather than a broken image", () => {
    render(<LearnerAvatar name="Ahmed" />);
    fireEvent.error(screen.getByRole("img", { name: /ahmed profile/i }));

    // Still an accessible image role, now backed by text instead of a 404.
    const fallback = screen.getByRole("img", { name: /ahmed profile/i });
    expect(fallback.tagName).not.toBe("IMG");
    expect(fallback).toHaveTextContent("A");
  });

  it("keeps an accessible name when no learner name is known", () => {
    render(<LearnerAvatar />);
    fireEvent.error(screen.getByRole("img", { name: /learner profile/i }));
    expect(screen.getByRole("img", { name: /learner profile/i })).toHaveTextContent("L");
  });
});
