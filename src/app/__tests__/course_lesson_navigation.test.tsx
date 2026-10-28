import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CourseLessonNavigation } from "../shared/CourseLessonNavigation";

describe("compact lesson navigation", () => {
  it("preserves locked sections and returns focus after selecting or dismissing", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = render(
      <CourseLessonNavigation
        stages={[
          { id: "read", label: "Read", group: 0, completed: true },
          { id: "practice", label: "Practice", group: 1 },
          { id: "review", label: "Review", group: 2, locked: true },
        ]}
        currentIndex={1}
        onSelect={onSelect}
      />
    );
    const summary = container.querySelector("summary")!;
    const details = container.querySelector("details")!;
    await user.click(summary);
    expect(details.open).toBe(true);
    expect(screen.getByRole("button", { name: /Review/ })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /Read/ }));
    expect(onSelect).toHaveBeenCalledExactlyOnceWith(0);
    expect(details.open).toBe(false);
    expect(summary).toHaveFocus();

    await user.click(summary);
    screen.getByRole("button", { name: /Practice/ }).focus();
    await user.keyboard("{Escape}");
    expect(details.open).toBe(false);
    expect(summary).toHaveFocus();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  });
});
