import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nProvider } from "../../i18n";
import { UpdatePrompt } from "../shared/UpdatePrompt";

describe("update notice", () => {
  it("retains an update while learning, then presents it after leaving the activity", async () => {
    const { rerender } = render(
      <I18nProvider>
        <UpdatePrompt defer />
      </I18nProvider>
    );
    act(() => {
      window.dispatchEvent(
        new CustomEvent("wp-update-available", {
          detail: { notes: ["A useful update"], worker: null },
        })
      );
    });
    expect(screen.queryByRole("button", { name: "Update & Refresh" })).not.toBeInTheDocument();
    rerender(
      <I18nProvider>
        <UpdatePrompt />
      </I18nProvider>
    );
    expect(screen.getByRole("button", { name: "Update & Refresh" })).toBeVisible();
    expect(screen.getByText("A useful update").closest("details")).not.toHaveAttribute("open");
    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Update & Refresh" })).not.toBeInTheDocument()
    );
  });
});
