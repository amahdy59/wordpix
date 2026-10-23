import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UnitVocabularyGate } from "../router/UnitVocabularyGate";
import { I18nProvider } from "../context/I18nContext";
import { isUnitLoaded, loadUnitVocabulary } from "../data/vocabulary";

vi.mock("../data/vocabulary", () => ({
  isUnitLoaded: vi.fn(),
  loadUnitVocabulary: vi.fn(),
}));

describe("unit download recovery", () => {
  beforeEach(() => {
    vi.mocked(isUnitLoaded).mockReturnValue(false);
    vi.mocked(loadUnitVocabulary).mockRejectedValue(new Error("Offline"));
  });

  function renderGate(onBackToPath = vi.fn()) {
    const content = vi.fn(() => <p>Loaded lesson</p>);
    render(
      <I18nProvider>
        <UnitVocabularyGate
          screen={{ id: "lesson-entry", unitId: "numbers-counting" }}
          fallback={<p role="status">Loading lesson</p>}
          onBackToPath={onBackToPath}
        >
          {content}
        </UnitVocabularyGate>
      </I18nProvider>
    );
    return content;
  }

  it("offers a route back to Learn when content cannot load", async () => {
    const onBack = vi.fn();
    const content = renderGate(onBack);
    await screen.findByRole("alert");
    expect(content).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Back to learning path" }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("holds the lesson until a retry succeeds", async () => {
    const content = renderGate();
    await screen.findByRole("alert");
    vi.mocked(loadUnitVocabulary).mockImplementation(async () => {
      vi.mocked(isUnitLoaded).mockReturnValue(true);
      return [{}] as Awaited<ReturnType<typeof loadUnitVocabulary>>;
    });
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    await waitFor(() => expect(screen.getByText("Loaded lesson")).toBeInTheDocument());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(content).toHaveBeenCalled();
  });
});
