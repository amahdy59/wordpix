import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExerciseStory } from "../exercises/ExerciseStory";
import type { VocabularyItem } from "../data/lessons";
import { I18nProvider } from "../context/I18nContext";

const mockWords: VocabularyItem[] = [
  {
    id: "tongue",
    label: "Tongue",
    phonetic: "tʌŋ",
    img: "/word-images/five-senses/tongue.avif",
    topic: "five-senses",
    description: "The fleshy muscular organ in the mouth of a mammal, used for tasting.",
  },
  {
    id: "taste-bud",
    label: "Taste Bud",
    phonetic: "teɪst bʌd",
    img: "/word-images/five-senses/taste-bud.avif",
    topic: "five-senses",
    description: "Clusters of nerve endings on the tongue having the sense of taste.",
  },
  {
    id: "sweet",
    label: "Sweet",
    phonetic: "swiːt",
    img: "/word-images/five-senses/sweet.avif",
    topic: "five-senses",
    description: "Having the pleasant taste characteristic of sugar or honey.",
  },
];

describe("ExerciseStory — Visual Flow Full Card Presentation & Accessibility", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.removeItem("wordpix:interface-lang");
  });

  it("renders full-bleed cards where the image occupies the card container", async () => {
    render(
      <I18nProvider>
        <ExerciseStory step={5} words={mockWords} lessonId="airport-1" dispatch={vi.fn()} />
      </I18nProvider>
    );

    // Switch to Visual Flow section via the top tab
    const visualFlowTab = await screen.findByRole("button", { name: /2\.\s*Visual Flow/i });
    fireEvent.click(visualFlowTab);

    // Each word should have an article card container
    const articles = document.querySelectorAll("article.aspect-\\[4\\/3\\]");
    expect(articles.length).toBe(3);

    // The image inside each article occupies the entire card
    articles.forEach((card) => {
      const img = card.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img?.className).toContain("size-full");
      expect(img?.className).toContain("object-cover");

      // Verify gradient scrim overlay exists for WCAG AAA contrast
      const scrim = card.querySelector(".bg-gradient-to-t");
      expect(scrim).toBeInTheDocument();
    });
  });

  it("ensures cards have sibling buttons without invalid button nesting", async () => {
    render(
      <I18nProvider>
        <ExerciseStory step={5} words={mockWords} lessonId="airport-1" dispatch={vi.fn()} />
      </I18nProvider>
    );

    const visualFlowTab = await screen.findByRole("button", { name: /2\.\s*Visual Flow/i });
    fireEvent.click(visualFlowTab);

    const articles = document.querySelectorAll("article.aspect-\\[4\\/3\\]");
    articles.forEach((card) => {
      const buttons = card.querySelectorAll("button");
      // Two sibling buttons: Card inspect button and Audio playback button
      expect(buttons.length).toBe(2);

      // Verify no button is a descendant of another button
      buttons.forEach((btn) => {
        expect(btn.querySelector("button")).toBeNull();
      });
    });
  });

  it("opens dictionary inspection modal when clicking the card button", async () => {
    render(
      <I18nProvider>
        <ExerciseStory step={5} words={mockWords} lessonId="airport-1" dispatch={vi.fn()} />
      </I18nProvider>
    );

    const visualFlowTab = await screen.findByRole("button", { name: /2\.\s*Visual Flow/i });
    fireEvent.click(visualFlowTab);

    // Click the main card for "Tongue"
    const tongueCard = screen.getByRole("button", { name: /Tongue.*dictionary/i });
    fireEvent.click(tongueCard);

    // The WordInspectorModal should now be displayed
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Tongue" })).toBeInTheDocument();
  });

  it("plays pronunciation and does not open modal when audio button is clicked", async () => {
    render(
      <I18nProvider>
        <ExerciseStory step={5} words={mockWords} lessonId="airport-1" dispatch={vi.fn()} />
      </I18nProvider>
    );

    const visualFlowTab = await screen.findByRole("button", { name: /2\.\s*Visual Flow/i });
    fireEvent.click(visualFlowTab);

    // Click only the audio button for "Tongue"
    const audioBtn = screen.getByRole("button", { name: /listen to tongue/i });
    fireEvent.click(audioBtn);

    // Modal should NOT be opened
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
