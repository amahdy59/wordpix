import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { RichPassageText } from "../shared/RichPassageText";
import { BusinessInputStage } from "../learning/business/stages/BusinessInputStage";
import { HadithReadListenStage } from "../learning/hadith/stages/HadithReadListenStage";
import { getBusinessUnit } from "../learning/business/businessCatalog";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../../i18n";
import type { AudioController } from "../shared/useAudio";

vi.mock("../shared/assetUrls", () => ({
  assetUrl: (key: string) => `https://assets.example/${key}`,
  hasAssetHost: () => true,
  audioKey: async () => "audio/test.mp3",
  audioUrls: async () => ["https://assets.example/test.mp3"],
  AUDIO_PROFILE_V4: {},
}));
vi.mock("../shared/pronunciationOverrides", () => ({
  getPronunciationAssetSpec: (text: string) => ({ text, profile: {} }),
  hasPronunciationOverride: () => false,
}));
vi.mock("../../lib/persistence/db", () => ({
  getCachedAudio: async () => new Blob(["recorded audio"], { type: "audio/mpeg" }),
  saveCachedAudio: vi.fn(),
}));

describe("RichPassageText modern vocabulary highlighting and clickability", () => {
  it("renders modern inline highlight styling for clickable vocabulary buttons", () => {
    const onTermClick = vi.fn();
    render(
      <I18nProvider>
        <RichPassageText
          text="We need to hold safety stock for critical situations."
          vocabTerms={["safety stock"]}
          onTermClick={onTermClick}
        />
      </I18nProvider>
    );

    const button = screen.getByRole("button", { name: /learn about safety stock/i });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
    // Verify modern underline and background tint tokens
    expect(button.className).toContain("underline");
    expect(button.className).toContain("decoration-primary");
    expect(button.className).toContain("decoration-2");
    expect(button.className).toContain("underline-offset-4");
    expect(button.className).toContain("bg-primary/8");
    expect(button.className).toContain("cursor-pointer");
    expect(button.className).toContain("touch-manipulation");

    fireEvent.click(button);
    expect(onTermClick).toHaveBeenCalledWith("safety stock");
  });

  it("renders clean mark when non-interactive or when no onTermClick handler is given", () => {
    render(
      <I18nProvider>
        <RichPassageText
          text="We need to hold safety stock for critical situations."
          vocabTerms={["safety stock"]}
          interactiveVocabulary={false}
        />
      </I18nProvider>
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    const mark = screen.getByText("safety stock");
    expect(mark.tagName).toBe("MARK");
    expect(mark.className).toContain("underline");
    expect(mark.className).toContain("decoration-primary");
  });

  it("preserves active audio sentence highlight without background clash", () => {
    const onTermClick = vi.fn();
    render(
      <I18nProvider>
        <RichPassageText
          text="We need to hold safety stock."
          vocabTerms={["safety stock"]}
          onTermClick={onTermClick}
          highlightRange={{ start: 0, end: 30 }}
        />
      </I18nProvider>
    );

    const button = screen.getByRole("button", { name: /learn about safety stock/i });
    expect(button.className).toContain("bg-transparent");
    expect(button.className).toContain("decoration-primary");
    const audioMark = button.querySelector("mark");
    expect(audioMark).not.toBeNull();
    expect(audioMark?.className).toContain("bg-feedback-info-surface");
  });
});

describe("BusinessInputStage passage vocabulary modal integration", () => {
  it("clicking a highlighted word in business reading passage opens the word card modal", () => {
    const unit35 = getBusinessUnit("unit-35")!;
    expect(unit35).toBeDefined();

    render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessInputStage unit={unit35} onNext={vi.fn()} />
        </LearnerProvider>
      </I18nProvider>
    );

    const article = screen.getByRole("article");
    const safetyStockBtns = within(article).getAllByRole("button", {
      name: /learn about safety stock/i,
    });
    expect(safetyStockBtns.length).toBeGreaterThanOrEqual(1);

    // Click the word in the reading passage
    fireEvent.click(safetyStockBtns[0]);

    // Modal dialog is shown
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("heading", { name: "safety stock" })).toBeVisible();

    // Check that definition and example are displayed
    const vocabDef = unit35.languageBank.find((v) => v.term === "safety stock")!;
    expect(within(dialog).getByText(vocabDef.definition)).toBeVisible();
    expect(within(dialog).getByText(new RegExp(vocabDef.example, "i"))).toBeVisible();

    // Close modal
    fireEvent.click(within(dialog).getByRole("button", { name: /^close$/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("HadithReadListenStage translation passage vocabulary modal integration", () => {
  it("clicking a highlighted word in Hadith English translation opens the word card modal", async () => {
    const mockAudio: AudioController = {
      speak: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      stop: vi.fn(),
      seek: vi.fn(),
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      isError: false,
      isSupported: true,
      status: "idle",
      source: null,
      currentTime: 0,
      duration: 0,
    };

    const { HADITH_01 } = await import("../learning/hadith/hadithCurriculum");
    const { FIGMA_HADITH_LESSONS } = await import("../learning/hadith/figmaHadithCatalog");

    render(
      <I18nProvider>
        <LearnerProvider>
          <HadithReadListenStage
            lessonNumber={1}
            source={HADITH_01.source}
            onPlayAudio={vi.fn()}
            audio={mockAudio}
            activeTrack={null}
            playbackRate={1}
            onRateChange={vi.fn()}
            vocabularyLines={FIGMA_HADITH_LESSONS[0].stages.vocabulary.text}
          />
        </LearnerProvider>
      </I18nProvider>
    );

    // In Hadith 1 translation: "Actions are judged by intentions..."
    // "intention" is in the vocabulary, so it should be rendered as an interactive button
    const intentionButtons = screen.getAllByRole("button", {
      name: /learn about intention/i,
    });
    expect(intentionButtons.length).toBeGreaterThanOrEqual(1);

    // Click the passage word
    fireEvent.click(intentionButtons[0]);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("heading", { name: "intention" })).toBeVisible();
  });
});
