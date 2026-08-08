import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExitConfirmModal } from "../shared/ExitConfirmModal";

/**
 * The dialogs portal into <body> and mark #root inert, so the harness needs a
 * real #root with a focusable element standing in for the page behind them.
 */
function mountAppRoot() {
  const root = document.createElement("div");
  root.id = "root";
  root.innerHTML = '<button id="opener">Open</button>';
  document.body.appendChild(root);
  return document.getElementById("opener") as HTMLButtonElement;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("ExitConfirmModal accessibility", () => {
  it("is a named modal dialog with a description", async () => {
    mountAppRoot();
    render(<ExitConfirmModal isOpen onCancel={vi.fn()} onConfirm={vi.fn()} />);

    const dialog = await screen.findByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Quit Lesson Session?");
    expect(dialog).toHaveAccessibleDescription(/will not be saved/i);
  });

  it("focuses the non-destructive action first", async () => {
    mountAppRoot();
    render(<ExitConfirmModal isOpen onCancel={vi.fn()} onConfirm={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /keep practicing/i })).toHaveFocus();
    });
  });

  it("marks the rest of the app inert while open", async () => {
    mountAppRoot();
    const { unmount } = render(<ExitConfirmModal isOpen onCancel={vi.fn()} onConfirm={vi.fn()} />);

    await waitFor(() => {
      expect(document.getElementById("root")).toHaveAttribute("inert");
    });

    unmount();
    expect(document.getElementById("root")).not.toHaveAttribute("inert");
  });

  it("restores focus to the invoking element on close", async () => {
    const opener = mountAppRoot();
    opener.focus();

    const { unmount } = render(<ExitConfirmModal isOpen onCancel={vi.fn()} onConfirm={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /keep practicing/i })).toHaveFocus();
    });

    unmount();
    expect(document.activeElement).toBe(opener);
  });

  it("traps Tab inside the dialog", async () => {
    const user = userEvent.setup();
    const opener = mountAppRoot();
    render(<ExitConfirmModal isOpen onCancel={vi.fn()} onConfirm={vi.fn()} />);

    const cancelBtn = await screen.findByRole("button", { name: /keep practicing/i });
    await waitFor(() => expect(cancelBtn).toHaveFocus());

    // Tabbing off the last control must cycle back to the first rather than
    // escaping to the page behind.
    await user.tab();
    expect(screen.getByRole("button", { name: /leave lesson/i })).toHaveFocus();

    await user.tab();
    expect(cancelBtn).toHaveFocus();
    expect(document.activeElement).not.toBe(opener);
    expect(screen.getByRole("alertdialog").contains(document.activeElement)).toBe(true);
  });

  it("cancels on Escape rather than confirming the destructive action", async () => {
    const user = userEvent.setup();
    mountAppRoot();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(<ExitConfirmModal isOpen onCancel={onCancel} onConfirm={onConfirm} />);

    await screen.findByRole("alertdialog");
    await user.keyboard("{Escape}");

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("renders nothing when closed", () => {
    mountAppRoot();
    render(<ExitConfirmModal isOpen={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(document.getElementById("root")).not.toHaveAttribute("inert");
  });
});
