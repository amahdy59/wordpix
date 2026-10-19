import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "../context/I18nContext";
import { ImageChoiceCard } from "../shared/ImageChoiceCard";
import type { VocabularyItem } from "../data/lessons";

const mockWord: VocabularyItem = {
  id: "blanket",
  label: "Blanket",
  phonetic: "ˈblæŋ.kɪt",
  arabicTranslation: "بطانية",
  description: "A warm bed cover",
  img: "bedroom/blanket.webp",
  topic: "bedroom",
};

describe("ImageChoiceCard", () => {
  it("renders image option and hides shortcut badge when shortcuts are inactive", () => {
    render(
      <I18nProvider>
        <ImageChoiceCard
          option={mockWord}
          index={0}
          totalOptions={4}
          isSelected={false}
          feedback={null}
          onClick={vi.fn()}
          showShortcut={false}
        />
      </I18nProvider>
    );

    const button = screen.getByRole("button", { name: /Option 1 of 4/i });
    expect(button).toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("displays shortcut badge when showShortcut is active", () => {
    render(
      <I18nProvider>
        <ImageChoiceCard
          option={mockWord}
          index={1}
          totalOptions={4}
          isSelected={false}
          feedback={null}
          onClick={vi.fn()}
          showShortcut={true}
        />
      </I18nProvider>
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("triggers onClick when clicked in interactive state", async () => {
    const handleClick = vi.fn();
    render(
      <I18nProvider>
        <ImageChoiceCard
          option={mockWord}
          index={0}
          totalOptions={4}
          isSelected={false}
          feedback={null}
          onClick={handleClick}
        />
      </I18nProvider>
    );

    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders high-contrast feedback overlay on correct selection", () => {
    render(
      <I18nProvider>
        <ImageChoiceCard
          option={mockWord}
          index={0}
          totalOptions={4}
          isSelected={true}
          feedback="correct"
          onClick={vi.fn()}
        />
      </I18nProvider>
    );

    expect(screen.getByText(/correct/i)).toBeInTheDocument();
  });

  it("renders high-contrast feedback overlay on incorrect selection", () => {
    render(
      <I18nProvider>
        <ImageChoiceCard
          option={mockWord}
          index={0}
          totalOptions={4}
          isSelected={true}
          feedback="incorrect"
          onClick={vi.fn()}
        />
      </I18nProvider>
    );

    expect(screen.getByText(/not quite/i)).toBeInTheDocument();
  });
});
