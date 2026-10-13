import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { HelpDisclosure } from "../shared/HelpDisclosure";

describe("help disclosure", () => {
  it("does not remove a Safari pointer action when blur has no related target", () => {
    const action = vi.fn();
    render(
      <HelpDisclosure label="Options" variant="icon">
        <button type="button" onClick={action}>
          Change preference
        </button>
      </HelpDisclosure>
    );
    const summary = screen.getByLabelText("Options");
    const details = summary.closest("details")!;
    details.open = true;
    fireEvent.blur(summary, { relatedTarget: null });
    fireEvent.blur(summary, { relatedTarget: document.body });
    expect(details.open).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Change preference" }));
    expect(action).toHaveBeenCalledOnce();
  });
});
