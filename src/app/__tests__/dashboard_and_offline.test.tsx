import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomeDashboard } from "../core/HomeDashboard";
import { SettingsModal } from "../core/SettingsModal";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";

vi.mock("../data/vocabulary", () => ({
  loadUnitVocabulary: vi.fn().mockResolvedValue([]),
  getWords: vi.fn().mockReturnValue([]),
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LearnerProvider>
      <I18nProvider>{ui}</I18nProvider>
    </LearnerProvider>
  );
}

describe("HomeDashboard Gamification & Daily Goals", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ version: "1.0.0", notes: [] }),
      })
    );
  });

  it("renders daily vocabulary target and study guide shortcut", () => {
    const dispatch = vi.fn();
    renderWithProviders(<HomeDashboard dispatch={dispatch} />);

    expect(screen.getByText("Daily Vocabulary Target")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Study materials for/i })).toBeInTheDocument();
  });
});

describe("SettingsModal Offline Preloader", () => {
  it("renders offline readiness section and handles course preloading", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(<SettingsModal isOpen={true} onClose={onClose} />);

    expect(screen.getByText(/Offline Readiness & Storage/i)).toBeInTheDocument();
    expect(screen.getByText(/Preload Full Curriculum \(200 Units\)/i)).toBeInTheDocument();

    const preloadBtn = screen.getByRole("button", { name: /Preload All Units/i });
    expect(preloadBtn).toBeInTheDocument();

    // Trigger preload
    await user.click(preloadBtn);

    // Should complete and show Ready Offline badge
    await waitFor(
      () => {
        expect(screen.getByText(/Ready Offline!/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
