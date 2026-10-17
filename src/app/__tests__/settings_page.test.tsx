import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import { SettingsPage } from "../core/SettingsPage";

function renderSettingsPage(dispatch = vi.fn()) {
  return render(
    <LearnerProvider>
      <I18nProvider>
        <SettingsPage dispatch={dispatch} />
      </I18nProvider>
    </LearnerProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
  document.documentElement.style.fontSize = "";
});

describe("SettingsPage Component", () => {
  it("renders page header, search bar, and live appearance preview", () => {
    renderSettingsPage();

    expect(screen.getByRole("heading", { level: 1, name: /settings/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search settings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/live appearance preview/i)).toBeInTheDocument();
  });

  it("filters setting items dynamically when searching", async () => {
    const user = userEvent.setup();
    renderSettingsPage();

    const searchInput = screen.getByPlaceholderText(/search settings/i);

    // Initially high contrast and audio controls are visible
    expect(screen.getByText(/higher contrast/i)).toBeInTheDocument();
    expect(screen.queryByText(/pronunciation speech rate/i)).not.toBeInTheDocument();

    // Search for "contrast"
    await user.type(searchInput, "contrast");

    expect(screen.getByText(/higher contrast/i)).toBeInTheDocument();
    expect(screen.queryByText(/pronunciation speech rate/i)).not.toBeInTheDocument();

    // Clear search
    const clearButton = screen.getByLabelText(/clear search/i);
    await user.click(clearButton);

    expect(screen.queryByText(/pronunciation speech rate/i)).not.toBeInTheDocument();
  });

  it("filters setting items by category pills", async () => {
    const user = userEvent.setup();
    renderSettingsPage();

    // Click "Audio & Speech" category filter
    const audioCategoryBtn = screen.getByRole("button", { name: /audio & speech/i });
    await user.click(audioCategoryBtn);

    expect(screen.getByText(/pronunciation speech rate/i)).toBeInTheDocument();
    expect(screen.queryByText(/higher contrast/i)).not.toBeInTheDocument();
  });

  it("toggles high contrast mode and updates aria-pressed", async () => {
    const user = userEvent.setup();
    renderSettingsPage();

    const contrastToggle = screen.getByRole("button", { name: /higher contrast/i });
    expect(contrastToggle).toHaveAttribute("aria-pressed", "false");

    await user.click(contrastToggle);
    expect(contrastToggle).toHaveAttribute("aria-pressed", "true");
  });

  it("changes text size scaling through button group", async () => {
    const user = userEvent.setup();
    renderSettingsPage();

    const largeBtn = screen.getByRole("button", { name: "125%" });
    expect(largeBtn).toHaveAttribute("aria-pressed", "false");

    await user.click(largeBtn);
    expect(largeBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("switches numeral system between Western and Arabic-Indic", async () => {
    const user = userEvent.setup();
    renderSettingsPage();

    await user.click(screen.getByRole("button", { name: /language & numbers/i }));
    const arabicNumeralsBtn = screen.getByRole("button", { name: "١, ٢, ٣" });
    expect(arabicNumeralsBtn).toHaveAttribute("aria-pressed", "false");

    await user.click(arabicNumeralsBtn);
    expect(arabicNumeralsBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("provides safe two-step confirmation before resetting data", async () => {
    const user = userEvent.setup();
    renderSettingsPage();

    await user.click(screen.getByRole("button", { name: /data & privacy/i }));
    const resetDataBtn = screen.getByRole("button", { name: /reset data/i });
    await user.click(resetDataBtn);

    // Confirmation buttons appear
    expect(screen.getByRole("button", { name: /confirm reset/i })).toBeInTheDocument();
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    expect(cancelBtn).toBeInTheDocument();

    await user.click(cancelBtn);
    expect(screen.queryByRole("button", { name: /confirm reset/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset data/i })).toBeInTheDocument();
  });

  it("triggers back navigation to profile when back button is clicked", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    renderSettingsPage(dispatch);

    const backButton = screen.getByRole("button", { name: /close settings/i });
    await user.click(backButton);

    expect(dispatch).toHaveBeenCalledWith({ type: "GO", to: "profile" });
  });
});
