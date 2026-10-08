import { describe, expect, it } from "vitest";
import summaries from "../generated/specialistLessonSummaries.json";
import { FIGMA_HADITH_LESSONS } from "../learning/hadith/figmaHadithCatalog";
import {
  FIGMA_PRONUNCIATION_LESSONS,
  getFigmaPronunciationActivityData,
} from "../learning/foundations/figmaPronunciationCatalog";
import { CONVERSATION_UNITS } from "../learning/conversation/conversationCatalog";
import { BUSINESS_UNITS } from "../learning/business/businessCatalog";

describe("lightweight specialist resume summaries", () => {
  it("keeps every stable lesson ID and title aligned with its canonical catalog", () => {
    expect(summaries.hadith.map(({ id, title }) => ({ id, title }))).toEqual(
      FIGMA_HADITH_LESSONS.map(({ id, title }) => ({ id, title }))
    );
    expect(summaries.conversation.map(({ id, title }) => ({ id, title }))).toEqual(
      CONVERSATION_UNITS.map(({ id, title }) => ({ id, title }))
    );
    expect(summaries.business.map(({ id, title }) => ({ id, title }))).toEqual(
      BUSINESS_UNITS.map(({ id, title }) => ({ id, title }))
    );
    expect(summaries.pronunciation).toEqual(
      FIGMA_PRONUNCIATION_LESSONS.map(({ number }) => ({
        id: `lesson-${String(number).padStart(2, "0")}`,
        number,
        title: getFigmaPronunciationActivityData(number).title,
      }))
    );
  });
});
