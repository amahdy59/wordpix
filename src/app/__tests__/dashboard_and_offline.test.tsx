import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomeDashboard } from "../core/HomeDashboard";
import { SettingsModal } from "../core/SettingsModal";
import { loadUnitVocabulary } from "../data/vocabulary";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";

vi.mock("../data/vocabulary", () => ({
  loadUnitVocabulary: vi.fn().mockResolvedValue([]),
  getWords: vi.fn().mockReturnValue([]),
}));

vi.mock("../shared/useAudio", () => ({ useAudio: () => ({ speak: vi.fn() }) }));

afterEach(() => vi.unstubAllGlobals());

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

  it("renders daily vocabulary target and study guide shortcut", async () => {
    localStorage.removeItem("wordpix_last_seen_version");
    const dispatch = vi.fn();
    renderWithProviders(<HomeDashboard dispatch={dispatch} />);

    await screen.findByRole("button", { name: "Dismiss release notes" });
    expect(screen.getByText("Daily Vocabulary Target")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Study materials for/i })).toBeInTheDocument();
  });
});

describe("SettingsModal Offline Preloader", () => {
  beforeEach(() => vi.mocked(loadUnitVocabulary).mockReset().mockResolvedValue([]));
  it("reports loading failure and allows retry without claiming offline readiness", async () => {
    vi.mocked(loadUnitVocabulary).mockRejectedValueOnce(new Error("offline"));
    const user = userEvent.setup();
    renderWithProviders(<SettingsModal isOpen onClose={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /Preload All Units/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("could not be loaded");
    expect(screen.queryByText(/Vocabulary loaded|Ready Offline!/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Preload All Units/i }));
    expect(await screen.findByText("Vocabulary loaded")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
  it("renders offline readiness section and handles course preloading", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(<SettingsModal isOpen={true} onClose={onClose} />);

    expect(screen.getByText(/Offline Readiness & Storage/i)).toBeInTheDocument();
    expect(screen.getByText(/Load vocabulary \(200 units\)/i)).toBeInTheDocument();

    const preloadBtn = screen.getByRole("button", { name: /Preload All Units/i });
    expect(preloadBtn).toBeInTheDocument();

    // Trigger preload
    await user.click(preloadBtn);

    // Completion describes vocabulary loading, not offline asset availability.
    await waitFor(
      () => {
        expect(screen.getByText(/Vocabulary loaded/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
