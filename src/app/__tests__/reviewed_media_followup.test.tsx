import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuestionImage } from "../shared/QuestionImage";
import { resolveSentenceMedia } from "../content/sentenceMedia";
import { applyReviewedMediaFollowup } from "../content/reviewedMediaFollowup";
import { loadUnitVocabulary } from "../data/vocabulary";
import approved from "../generated/reviewedMediaFollowup.json";
import supplied from "../generated/suppliedMedia.json";

vi.mock("../shared/ImageReportButton", () => ({ ImageReportButton: () => null }));

describe("approved image integration", () => {
  it("applies only the eight approved exact word/sentence/original contexts", async () => {
    await Promise.all(
      ["savanna", "volcano", "coral-reef", "camping-site", "supermarket"].map(loadUnitVocabulary)
    );
    expect(approved).toHaveLength(8);
    for (const review of approved) {
      const actual = resolveSentenceMedia(review.wordId, review.sentence);
      const latest = supplied.find(
        (row) => row.wordId === review.wordId && row.text === review.sentence
      );
      expect(actual?.imagePath).toBe(latest?.imagePath ?? review.imagePath);
      expect(actual?.imageAlt).toBe(latest?.imageAlt ?? review.imageAlt);
      const original = { imagePath: review.originalUrl, imageAlt: "Original description" };
      expect(
        applyReviewedMediaFollowup(review.wordId, review.sentence + " Changed.", original)
      ).toBe(original);
      expect(applyReviewedMediaFollowup("another-word", review.sentence, original)).toBe(original);
      const changed = { ...original, imagePath: "https://example.test/changed.webp" };
      expect(applyReviewedMediaFollowup(review.wordId, review.sentence, changed)).toBe(changed);
      if (!review.responsiveSources) expect(actual?.imageFallbacks).toBeUndefined();
    }
  });

  it("retries the retained original when a selected responsive image cannot load offline", () => {
    const media = {
      imagePath: "https://example.test/original.webp",
      imageAlt: "Reviewed scene",
      responsiveSources: [{ url: "https://example.test/small.webp", width: 480 }],
    };
    const onExhausted = vi.fn();
    render(<QuestionImage media={media} onExhausted={onExhausted} />);
    const image = screen.getByRole("img", { name: media.imageAlt });
    expect(image).toHaveAttribute("srcset", "https://example.test/small.webp 480w");
    fireEvent.error(image);
    expect(image).not.toHaveAttribute("srcset");
    expect(image).toHaveAttribute("src", media.imagePath);
    expect(onExhausted).not.toHaveBeenCalled();
    fireEvent.error(image);
    expect(onExhausted).toHaveBeenCalledOnce();
  });
});
