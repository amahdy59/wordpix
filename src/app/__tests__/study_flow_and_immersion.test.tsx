import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  wordIds: ["bed", "pillow"],
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

const mockWord: VocabularyItem & { arabic: string } = {
  id: "bed",
  label: "bed",
  phonetic: "/bɛd/",
  img: "artwork/bedroom/bed.webp",
  topic: "bedroom",
  description: "A comfortable piece of furniture for sleeping.",
  arabic: "سرير",
};

describe("Study vocabulary grid", () => {
  it("shows the whole lesson and marks a word learned", async () => {
    const onProgressUpdate = vi.fn();
    render(
      <LearnArea
        node={mockNode}
        materials={mockMaterials}
        progress={mockProgress}
        onProgressUpdate={onProgressUpdate}
        onNextActivity={vi.fn()}
        immersionMode={false}
      />
    );
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Bed" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pillow" })).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole("button", { name: "Learned" })[0]);
    const update = onProgressUpdate.mock.calls[0][0];
    expect(update(mockProgress).wordStatus.bed).toBe("learning");
  });

  it("queues a selected word for review", async () => {
    const onProgressUpdate = vi.fn();
    render(
      <LearnArea
        node={mockNode}
        materials={mockMaterials}
        progress={mockProgress}
        onProgressUpdate={onProgressUpdate}
        onNextActivity={vi.fn()}
      />
    );
    await userEvent.click(screen.getAllByRole("button", { name: "Review" })[0]);
    const update = onProgressUpdate.mock.calls[0][0];
    expect(update(mockProgress).reviewWordIds).toContain("bed");
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
    expect(screen.getByText("سرير")).toBeInTheDocument();
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
    expect(speedBtn).toHaveTextContent("1.0x");

    await user.click(speedBtn);
    expect(speedBtn).toHaveTextContent("1.2x");

    await user.click(speedBtn);
    expect(speedBtn).toHaveTextContent("0.8x");

    await user.click(speedBtn);
    expect(speedBtn).toHaveTextContent("1.0x");
  });
});
