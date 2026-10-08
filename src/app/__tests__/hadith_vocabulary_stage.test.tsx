import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { I18nProvider } from "../context/I18nContext";
import {
  HadithVocabularyStage,
  parseHadithVocabulary,
} from "../learning/hadith/stages/HadithVocabularyStage";
import { getHadithLesson } from "../learning/hadith/hadithCurriculum";

describe("HadithVocabularyStage Complete Language Bank", () => {
  it("renders clean, accurate vocabulary for Hadith 3 without paired headers or gibberish", () => {
    const lesson = getHadithLesson("hadith-03")!;
    render(
      <I18nProvider>
        <HadithVocabularyStage lines={lesson.stages.vocabulary.text} lessonNumber={lesson.number} />
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { name: /Complete language bank/i })).toBeInTheDocument();

    // Check that Hadith 3 extra vocabulary words have accurate definitions
    expect(screen.getAllByText("five").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("The five foundational pillars upon which Islam is built.").length
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getAllByText("deity").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(
        "An object of worship; God (as in: 'no deity worthy of worship except Allah')."
      ).length
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getAllByText("build on").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("develop from an existing foundation.").length
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getAllByText("central practice").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("an important activity within a tradition.").length
    ).toBeGreaterThanOrEqual(1);

    // Assert that header noise is NOT in the table
    expect(screen.queryByText("Phrasal verbs & collocations", { selector: "td" })).toBeNull();
    expect(screen.queryByText("PHRASAL VERBS", { selector: "td" })).toBeNull();
    expect(screen.queryByText("COLLOCATIONS", { selector: "td" })).toBeNull();
    expect(screen.queryByText("WORD FAMILY", { selector: "td" })).toBeNull();
  });

  it("renders clean, un-corrupted bullet vocabulary and templates for Hadith 2", () => {
    const lesson = getHadithLesson("hadith-02")!;
    render(
      <I18nProvider>
        <HadithVocabularyStage lines={lesson.stages.vocabulary.text} lessonNumber={lesson.number} />
      </I18nProvider>
    );

    // Useful template patterns
    expect(screen.getAllByText("What does [word] mean?").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("Question template: asking for a definition.").length
    ).toBeGreaterThanOrEqual(1);

    // Bullet-colon extra vocabulary
    expect(screen.getAllByText("journey").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("traveling from one place to another.").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("astonished").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("very surprised or amazed.").length).toBeGreaterThanOrEqual(1);

    // Phrasal verbs & collocations
    expect(screen.getAllByText("ask about").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("open question").length).toBeGreaterThanOrEqual(1);

    // No leaked headers
    expect(screen.queryByText("SCHOLARLY DISTINCTION REQUIRED", { selector: "td" })).toBeNull();
  });

  it("renders phrasal verbs and collocations for Hadith 18 with restored stage text", () => {
    const lesson = getHadithLesson("hadith-18")!;
    render(
      <I18nProvider>
        <HadithVocabularyStage lines={lesson.stages.vocabulary.text} lessonNumber={lesson.number} />
      </I18nProvider>
    );

    expect(screen.getAllByText("make up for").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("do good after causing a problem.").length).toBeGreaterThanOrEqual(
      1
    );
    expect(screen.getAllByText("put right").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("positive action").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("honest apology").length).toBeGreaterThanOrEqual(1);

    // Sidebar should also be restored
    expect(screen.getAllByText("repair → repairable → repaired").length).toBeGreaterThanOrEqual(1);
  });

  it("renders 10 rows accurately for Hadith 1", () => {
    const lesson = getHadithLesson("hadith-01")!;
    render(
      <I18nProvider>
        <HadithVocabularyStage lines={lesson.stages.vocabulary.text} lessonNumber={lesson.number} />
      </I18nProvider>
    );

    expect(screen.getAllByText("intend to + verb").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('"I intend to travel tomorrow."').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("judge").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("to form an opinion or evaluate").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("carry out").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("clear intention").length).toBeGreaterThanOrEqual(1);
  });

  it("parses 5 core vocabulary items, phrasal verbs, collocations, and sidebars across all 42 lessons", () => {
    for (let number = 1; number <= 42; number++) {
      const lessonId = `hadith-${String(number).padStart(2, "0")}`;
      const lesson = getHadithLesson(lessonId);
      expect(lesson, `Hadith ${number} should exist`).toBeDefined();
      const lines = lesson!.stages.vocabulary.text;
      const vocab = parseHadithVocabulary(lines, number);
      expect(vocab, `Hadith ${number} must have exactly 5 core vocabulary items`).toHaveLength(5);
      for (const item of vocab) {
        expect(item.term, `Hadith ${number} item term`).toBeTruthy();
        expect(item.partOfSpeech, `Hadith ${number} item partOfSpeech`).toBeTruthy();
        expect(item.definition, `Hadith ${number} item definition`).toBeTruthy();
        expect(item.example, `Hadith ${number} item example`).toBeTruthy();
        expect(item.arabic, `Hadith ${number} item arabic`).toBeTruthy();
      }
    }
  });
});
