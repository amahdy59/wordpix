import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedbackModal } from "../shared/FeedbackModal";
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

describe("FeedbackModal accessibility", () => {
  it("exposes itself as a modal alert dialog with an accessible name", () => {
    mountAppRoot();
    render(<FeedbackModal isOpen isCorrect title="Correct!" onContinue={vi.fn()} />);

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Correct!");
  });

  it("moves focus into the dialog on open", async () => {
    const opener = mountAppRoot();
    opener.focus();
    expect(document.activeElement).toBe(opener);

    render(<FeedbackModal isOpen isCorrect onContinue={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /continue/i })).toHaveFocus();
    });
  });

  it("marks the rest of the app inert while open", async () => {
    mountAppRoot();
    const { unmount } = render(<FeedbackModal isOpen isCorrect onContinue={vi.fn()} />);

    await waitFor(() => {
      expect(document.getElementById("root")).toHaveAttribute("inert");
    });

    unmount();
    expect(document.getElementById("root")).not.toHaveAttribute("inert");
  });

  it("restores focus to the invoking element on close", async () => {
    const opener = mountAppRoot();
    opener.focus();

    const { unmount } = render(<FeedbackModal isOpen isCorrect onContinue={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /continue/i })).toHaveFocus();
    });

    unmount();
    expect(document.activeElement).toBe(opener);
  });

  it("traps Tab inside the dialog", async () => {
    const user = userEvent.setup();
    const opener = mountAppRoot();
    render(<FeedbackModal isOpen isCorrect onContinue={vi.fn()} />);

    const continueBtn = await screen.findByRole("button", { name: /continue/i });
    await waitFor(() => expect(continueBtn).toHaveFocus());

    // The dialog holds a single control, so Tab must cycle back to it rather
    // than escaping to the page behind.
    await user.tab();
    expect(document.activeElement).not.toBe(opener);
    expect(screen.getByRole("alertdialog").contains(document.activeElement)).toBe(true);
  });

  it("dismisses on Escape", async () => {
    const user = userEvent.setup();
    mountAppRoot();
    const onContinue = vi.fn();
    render(<FeedbackModal isOpen isCorrect onContinue={onContinue} />);

    await screen.findByRole("alertdialog");
    await user.keyboard("{Escape}");
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("routes Escape to Try Again when the answer was wrong", async () => {
    const user = userEvent.setup();
    mountAppRoot();
    const onTryAgain = vi.fn();
    render(<FeedbackModal isOpen isCorrect={false} onContinue={vi.fn()} onTryAgain={onTryAgain} />);

    await screen.findByRole("alertdialog");
    await user.keyboard("{Escape}");
    expect(onTryAgain).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when closed", () => {
    mountAppRoot();
    render(<FeedbackModal isOpen={false} isCorrect onContinue={vi.fn()} />);
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(document.getElementById("root")).not.toHaveAttribute("inert");
  });
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
});
