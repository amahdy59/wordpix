import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  FIGMA_PRONUNCIATION_LESSONS,
  getPronunciationCardPresentation,
} from "../learning/foundations/figmaPronunciationCatalog";
import { PronunciationLessonCard } from "../learning/foundations/PronunciationLessonCard";
import { PronunciationLessonInfoModal } from "../learning/foundations/PronunciationLessonInfoModal";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../../i18n";

describe("Pronunciation Card Presentation & Dynamic Images", () => {
  it("extracts clean title, phonetic badge, and dual images for minimal pair lessons", () => {
    // Lesson 2 is "Sheep or Ship? (/iː/ vs /ɪ/)"
    const p2 = getPronunciationCardPresentation(2);
    expect(p2.cleanTitle).toBe("Sheep or Ship?");
    expect(p2.phoneticBadge).toBe("/iː/ vs /ɪ/");
    expect(p2.firstImage?.label.toLowerCase()).toBe("sheep");
    expect(p2.secondImage?.label.toLowerCase()).toBe("ship");
    expect(p2.primaryWords).toEqual(["sheep", "ship"]);
  });

  it("handles non-bracketed titles like Lesson 1", () => {
    const p1 = getPronunciationCardPresentation(1);
    expect(p1.cleanTitle).toBe("Same or Different?");
    expect(p1.firstImage).toBeDefined();
    expect(p1.secondImage).toBeDefined();
    expect(p1.primaryWords.length).toBeGreaterThanOrEqual(2);
  });

  it("provides valid presentations with dual images for all 68 lessons", () => {
    for (const lesson of FIGMA_PRONUNCIATION_LESSONS) {
      const p = getPronunciationCardPresentation(lesson.number);
      expect(p.cleanTitle.length).toBeGreaterThan(0);
      expect(p.firstImage).toBeDefined();
      expect(p.secondImage).toBeDefined();
      expect(p.primaryWords.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("PronunciationLessonCard Component", () => {
  const lesson2 = FIGMA_PRONUNCIATION_LESSONS.find((l) => l.number === 2)!;

  it("renders dual-split images, clean title, phonetic badge, and exemplar tags", () => {
    const onStartLesson = vi.fn();
    const onOpenDetails = vi.fn();

    render(
      <I18nProvider>
        <LearnerProvider>
          <PronunciationLessonCard
            lesson={lesson2}
            mastered={false}
            isDue={false}
            onStartLesson={onStartLesson}
            onOpenDetails={onOpenDetails}
          />
        </LearnerProvider>
      </I18nProvider>
    );

    // Verify clean title
    expect(screen.getByText("Sheep or Ship?")).toBeInTheDocument();
    // Verify phonetic badge
    expect(screen.getByText("/iː/ vs /ɪ/")).toBeInTheDocument();
    // Verify exemplar word pills
    expect(screen.getByText("sheep")).toBeInTheDocument();
    expect(screen.getByText("ship")).toBeInTheDocument();
    // Verify lesson number badge
    expect(screen.getByText("2")).toBeInTheDocument();

    // Clicking the main card triggers onStartLesson
    fireEvent.click(screen.getByRole("button", { name: /Sheep or Ship/i }));
    expect(onStartLesson).toHaveBeenCalledWith(2);
    expect(onOpenDetails).not.toHaveBeenCalled();
  });

  it("opens details modal when clicking the info button without starting lesson", () => {
    const onStartLesson = vi.fn();
    const onOpenDetails = vi.fn();

    render(
      <I18nProvider>
        <LearnerProvider>
          <PronunciationLessonCard
            lesson={lesson2}
            mastered={false}
            isDue={false}
            onStartLesson={onStartLesson}
            onOpenDetails={onOpenDetails}
          />
        </LearnerProvider>
      </I18nProvider>
    );

    const infoButton = screen.getByRole("button", {
      name: /details for lesson 2/i,
    });
    fireEvent.click(infoButton);
    expect(onOpenDetails).toHaveBeenCalledWith(2);
    expect(onStartLesson).not.toHaveBeenCalled();
  });

  it("falls back to typographic badge on image error", () => {
    const { container } = render(
      <I18nProvider>
        <LearnerProvider>
          <PronunciationLessonCard
            lesson={lesson2}
            mastered={false}
            isDue={false}
            onStartLesson={vi.fn()}
            onOpenDetails={vi.fn()}
          />
        </LearnerProvider>
      </I18nProvider>
    );

    const images = container.querySelectorAll("img");
    expect(images.length).toBe(2);

    // Trigger onError on the first image
    fireEvent.error(images[0]);

    // Typography fallback should now be active (rendered inside tile and as badge)
    expect(screen.getAllByText("/iː/ vs /ɪ/").length).toBe(2);
    expect(container.querySelectorAll("img").length).toBe(0);
  });
});

describe("PronunciationLessonInfoModal Component", () => {
  it("renders full pedagogical objective, articulation cues, and word contrasts", () => {
    const onClose = vi.fn();
    const onStartLesson = vi.fn();

    render(
      <I18nProvider>
        <PronunciationLessonInfoModal
          lessonNumber={2}
          onClose={onClose}
          onStartLesson={onStartLesson}
        />
      </I18nProvider>
    );

    // Dialog exists
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // Modal title
    expect(screen.getByText(/Sheep or Ship\?/i)).toBeInTheDocument();
    // Objective is preserved
    expect(
      screen.getByText(/Identify the intended word across several speakers/i)
    ).toBeInTheDocument();

    // Start lesson button
    const startBtn = screen.getByRole("button", { name: /Start Lesson 2/i });
    fireEvent.click(startBtn);
    expect(onStartLesson).toHaveBeenCalledWith(2);
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on Escape key press", () => {
    const onClose = vi.fn();
    render(
      <I18nProvider>
        <PronunciationLessonInfoModal lessonNumber={2} onClose={onClose} onStartLesson={vi.fn()} />
      </I18nProvider>
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
