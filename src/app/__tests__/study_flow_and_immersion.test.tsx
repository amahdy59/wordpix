import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LearnArea } from "../learning/study/LearnArea";
import { VocabularyCard } from "../learning/study/VocabularyCard";
import type { StudyNode, UnitStudyProgress } from "../learning/study/types";
import type { UnitLearningMaterials } from "../learning/types";
import type { VocabularyItem } from "../data/lessons";

const mockMaterials: UnitLearningMaterials = {
  unitId: "bedroom",
  wordMeta: [
    {
      word: "bed",
      partOfSpeech: "noun",
      frequency: 3,
      collocations: ["make the bed", "go to bed"],
    },
    {
      word: "pillow",
      partOfSpeech: "noun",
      frequency: 2,
      collocations: ["soft pillow", "rest on a pillow"],
    },
  ],
};

const mockNode: StudyNode = {
  id: "learn-essential",
  title: "Essential Bedroom Words",
  area: "learn",
  type: "vocabulary",
  wordIds: ["bedroom-bed", "bedroom-pillow"],
};

const mockProgress: UnitStudyProgress = {
  version: 1,
  unitId: "bedroom",
  completedNodeIds: [],
  nodePositions: { "learn-essential": 0 },
  wordStatus: {},
  reviewWordIds: [],
  updatedAt: new Date().toISOString(),
};

const mockWord: VocabularyItem = {
  id: "bedroom-bed",
  label: "bed",
  phonetic: "/bɛd/",
  img: "artwork/bedroom/bed.webp",
  topic: "bedroom",
  description: "A comfortable piece of furniture for sleeping.",
};

describe("Study Flow & Keyboard Navigation", () => {
  it("reveals flashcard on Space keydown and handles Got It shortcut", () => {
    const onProgressUpdate = vi.fn();
    const onNextActivity = vi.fn();

    render(
      <LearnArea
        node={mockNode}
        materials={mockMaterials}
        progress={mockProgress}
        onProgressUpdate={onProgressUpdate}
        onNextActivity={onNextActivity}
        immersionMode={false}
      />
    );

    // Initial state: hidden
    expect(screen.getByRole("button", { name: /Reveal/i })).toBeInTheDocument();

    // Trigger Space hotkey to reveal
    fireEvent.keyDown(window, { key: " " });

    // After reveal: action buttons appear
    expect(screen.getByRole("button", { name: /Got It/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Needs Practice/i })).toBeInTheDocument();

    // Trigger '2' hotkey for Got It
    fireEvent.keyDown(window, { key: "2" });
    expect(onProgressUpdate).toHaveBeenCalled();
  });

  it("handles Needs Practice shortcut and records review status", () => {
    const onProgressUpdate = vi.fn();
    const onNextActivity = vi.fn();

    render(
      <LearnArea
        node={mockNode}
        materials={mockMaterials}
        progress={mockProgress}
        onProgressUpdate={onProgressUpdate}
        onNextActivity={onNextActivity}
        immersionMode={false}
      />
    );

    // Click reveal button directly
    fireEvent.click(screen.getByRole("button", { name: /Reveal/i }));

    // Press '1' for Needs Practice
    fireEvent.keyDown(window, { key: "1" });
    expect(onProgressUpdate).toHaveBeenCalled();
  });
});

describe("Immersion Mode & Multisensory Audio", () => {
  it("renders meaning and collocations upon expanding details", async () => {
    const user = userEvent.setup();

    render(
      <VocabularyCard
        word={mockWord}
        meta={mockMaterials.wordMeta![0]}
        materials={mockMaterials}
        isRevealed={true}
        onReveal={vi.fn()}
        immersionMode={false}
      />
    );

    const toggleBtn = screen.getByRole("button", { name: /Show Meaning & Collocations/i });
    await user.click(toggleBtn);

    expect(screen.getByText("A comfortable piece of furniture for sleeping.")).toBeInTheDocument();
    expect(screen.getByText("make the bed")).toBeInTheDocument();
  });

  it("masks Arabic translation in Immersion mode until clicked", async () => {
    const user = userEvent.setup();

    render(
      <VocabularyCard
        word={mockWord}
        meta={mockMaterials.wordMeta![0]}
        materials={mockMaterials}
        isRevealed={true}
        onReveal={vi.fn()}
        immersionMode={true}
      />
    );

    const toggleBtn = screen.getByRole("button", { name: /Show Meaning & Collocations/i });
    await user.click(toggleBtn);

    const revealArabicBtn = screen.getByRole("button", { name: /Reveal Arabic Meaning/i });
    expect(revealArabicBtn).toBeInTheDocument();

    await user.click(revealArabicBtn);
    expect(screen.getByText("A comfortable piece of furniture for sleeping.")).toBeInTheDocument();
  });

  it("cycles speech playback speed when clicked", async () => {
    const user = userEvent.setup();

    render(
      <VocabularyCard
        word={mockWord}
        meta={mockMaterials.wordMeta![0]}
        materials={mockMaterials}
        isRevealed={true}
        onReveal={vi.fn()}
        immersionMode={false}
      />
    );

    const speedBtn = screen.getByRole("button", { name: /Speech playback speed:/i });
    expect(speedBtn).toHaveTextContent("1x");

    await user.click(speedBtn);
    expect(speedBtn).toHaveTextContent("1.2x");

    await user.click(speedBtn);
    expect(speedBtn).toHaveTextContent("0.8x");

    await user.click(speedBtn);
    expect(speedBtn).toHaveTextContent("1x");
  });
});
