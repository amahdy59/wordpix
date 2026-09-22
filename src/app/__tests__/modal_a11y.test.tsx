import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement, ReactNode } from "react";
import { ExitConfirmModal } from "../shared/ExitConfirmModal";
import { SettingsModal } from "../core/SettingsModal";
import { WordInspectorModal } from "../shared/WordInspectorModal";
import { AuthModal } from "../../features/auth/AuthModal";
import { PlacementQuizModal } from "../onboarding/PlacementQuizModal";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import type { VocabularyItem } from "../data/lessons";

vi.mock("../../lib/supabase/client", () => ({
  supabase: { auth: { signInWithPassword: vi.fn(), signUp: vi.fn() } },
}));
vi.mock("../../lib/persistence/sync", () => ({ migrateGuestToAccount: vi.fn() }));

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

function Providers({ children }: { children: ReactNode }) {
  return (
    <LearnerProvider>
      <I18nProvider>{children}</I18nProvider>
    </LearnerProvider>
  );
}

const inspectorWord: VocabularyItem = {
  id: "blinds",
  label: "Blinds",
  phonetic: "blaɪndz",
  img: "/word-images/bedroom/blinds.webp",
  topic: "bedroom-1",
  description: "Horizontal slats across a window that tilt to control the daylight.",
};

interface ModalCase {
  name: string;
  expectedName: string;
  renderModal: (onClose: () => void) => ReactElement;
}

const modalCases: ModalCase[] = [
  {
    name: "SettingsModal",
    expectedName: "Settings & Accessibility",
    renderModal: (onClose) => <SettingsModal isOpen onClose={onClose} />,
  },
  {
    name: "WordInspectorModal",
    expectedName: "Blinds",
    renderModal: (onClose) => <WordInspectorModal word={inspectorWord} isOpen onClose={onClose} />,
  },
  {
    name: "AuthModal",
    expectedName: "Welcome Back",
    renderModal: (onClose) => <AuthModal onClose={onClose} />,
  },
  {
    name: "PlacementQuizModal",
    expectedName: "Test Your Level",
    renderModal: (onClose) => <PlacementQuizModal isOpen onClose={onClose} onComplete={vi.fn()} />,
  },
];

/**
 * Shared dialog contract across every modal: named, inert background, focus
 * trap, focus restore, and Escape dismissal. Same strength as the
 * ExitConfirmModal suite above; failures here are real defects, not
 * suite-specific expectations.
 */
describe.each(modalCases)("$name accessibility contract", ({ expectedName, renderModal }) => {
  it("is a named modal dialog", async () => {
    mountAppRoot();
    render(<Providers>{renderModal(vi.fn())}</Providers>);

    const dialog = await screen.findByRole("dialog", { name: expectedName });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName(expectedName);
  });

  it("marks the rest of the app inert while open", async () => {
    mountAppRoot();
    const { unmount } = render(<Providers>{renderModal(vi.fn())}</Providers>);

    await waitFor(() => {
      expect(document.getElementById("root")).toHaveAttribute("inert");
    });

    unmount();
    expect(document.getElementById("root")).not.toHaveAttribute("inert");
  });

  it("restores focus to the invoking element on close", async () => {
    const opener = mountAppRoot();
    opener.focus();

    const { unmount } = render(<Providers>{renderModal(vi.fn())}</Providers>);
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    unmount();
    expect(document.activeElement).toBe(opener);
  });

  it("traps Tab inside the dialog", async () => {
    const user = userEvent.setup();
    mountAppRoot();
    render(<Providers>{renderModal(vi.fn())}</Providers>);

    const dialog = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    for (let i = 0; i < 15; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("dismisses on Escape", async () => {
    const user = userEvent.setup();
    mountAppRoot();
    const onClose = vi.fn();
    render(<Providers>{renderModal(onClose)}</Providers>);

    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });
});
