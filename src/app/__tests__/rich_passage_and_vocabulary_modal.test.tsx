import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { RichPassageText } from "../shared/RichPassageText";
import { VocabularyDetailModal } from "../shared/VocabularyDetailModal";
import { ReadingStage } from "../learning/conversation/stages/ReadingStage";
import { getConversationUnit } from "../learning/conversation/conversationCatalog";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../../i18n";

describe("RichPassageText component", () => {
  it("renders markdown bold without literal asterisks", () => {
    const { container } = render(
      <I18nProvider>
        <RichPassageText text="Facial recognition is a form of **biometric** identification." />
      </I18nProvider>
    );

    expect(container.textContent).not.toContain("**");
    const strong = container.querySelector("strong");
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toBe("biometric");
  });

  it("highlights vocabulary terms and handles flexible plural & hyphen matching", () => {
    const onTermClick = vi.fn();
    const vocabTerms = ["false positive", "demographic differential", "surveillance"];

    render(
      <I18nProvider>
        <RichPassageText
          text="NIST documented demographic differentials and false-positive errors under surveillance."
          vocabTerms={vocabTerms}
          onTermClick={onTermClick}
        />
      </I18nProvider>
    );

    // Should render buttons for terms
    const diffButton = screen.getByRole("button", { name: /demographic differential/i });
    expect(diffButton).toBeDefined();
    expect(diffButton.textContent).toBe("demographic differentials");

    const fpButton = screen.getByRole("button", { name: /false positive/i });
    expect(fpButton).toBeDefined();
    expect(fpButton.textContent).toBe("false-positive");

    // Clicking passes the canonical term
    fireEvent.click(diffButton);
    expect(onTermClick).toHaveBeenCalledWith("demographic differential");

    fireEvent.click(fpButton);
    expect(onTermClick).toHaveBeenCalledWith("false positive");
  });

  it("handles bold vocabulary terms simultaneously", () => {
    const onTermClick = vi.fn();
    const { container } = render(
      <I18nProvider>
        <RichPassageText
          text="This involves **proportionality** and consent."
          vocabTerms={["proportionality"]}
          onTermClick={onTermClick}
        />
      </I18nProvider>
    );

    expect(container.textContent).not.toContain("**");
    const btn = screen.getByRole("button", { name: /proportionality/i });
    expect(btn.classList.contains("font-black")).toBe(true);

    fireEvent.click(btn);
    expect(onTermClick).toHaveBeenCalledWith("proportionality");
  });
});

describe("VocabularyDetailModal component", () => {
  const mockItem = {
    id: "item-1",
    term: "biometric",
    termAr: "حيوي",
    type: "Adjective / noun",
    definition: "relating to measurable physical features",
    definitionAr: "متعلق بالميزات الحيوية",
    example: "A face scan is biometric data.",
  };

  it("renders accessible modal with definition, type, and example", () => {
    const onClose = vi.fn();
    render(
      <I18nProvider>
        <VocabularyDetailModal item={mockItem} isOpen={true} onClose={onClose} />
      </I18nProvider>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(screen.getByRole("heading", { name: "biometric" })).toBeDefined();
    expect(screen.getByText("Adjective / noun")).toBeDefined();
    expect(screen.getByText(/relating to measurable physical features/i)).toBeDefined();
    expect(screen.getByText(/"A face scan is biometric data."/i)).toBeDefined();

    // Close button triggers onClose
    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});

describe("ReadingStage integration", () => {
  it("renders Unit 22 In Short section with bold markdown and clickable target terms", () => {
    const unit22 = getConversationUnit("unit-22");
    expect(unit22).toBeDefined();
    if (!unit22) return;

    render(
      <I18nProvider>
        <LearnerProvider>
          <ReadingStage unit={unit22} onNext={vi.fn()} onPrev={vi.fn()} />
        </LearnerProvider>
      </I18nProvider>
    );

    // Target Terms label should be present
    expect(screen.getByText(/target terms:/i)).toBeDefined();

    // Clicking a term in the Target Terms pill row opens the word modal
    // (Note: "biometric" appears both in the summary and in the target pills!)
    const biometricButtons = screen.getAllByRole("button", { name: /learn about biometric/i });
    expect(biometricButtons.length).toBeGreaterThanOrEqual(2);
    fireEvent.click(biometricButtons[1]); // the pill

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(within(dialog).getByRole("heading", { name: "biometric" })).toBeDefined();

    // Close the dialog
    fireEvent.click(within(dialog).getByRole("button", { name: /^close$/i }));
  });

  it("clicking a highlighted word in the passage opens the modal", () => {
    const unit22 = getConversationUnit("unit-22");
    if (!unit22) return;

    render(
      <I18nProvider>
        <LearnerProvider>
          <ReadingStage unit={unit22} onNext={vi.fn()} onPrev={vi.fn()} />
        </LearnerProvider>
      </I18nProvider>
    );

    // Click on a term in the passage
    const passageButtons = screen.getAllByRole("button", { name: /learn about surveillance/i });
    expect(passageButtons.length).toBeGreaterThan(0);
    fireEvent.click(passageButtons[0]);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(within(dialog).getByRole("heading", { name: "surveillance" })).toBeDefined();
  });
});
