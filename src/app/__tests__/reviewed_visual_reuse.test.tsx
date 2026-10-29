import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import applied from "../../../docs/media/applied-assignments.json";
import { resolveSentenceMedia } from "../content/sentenceMedia";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { QuestionImage } from "../shared/QuestionImage";

describe("authorized visual reuse", () => {
  it("keeps the batch restricted to twenty exact content identities", () => {
    expect(applied.assignments).toHaveLength(20);
    expect(new Set(applied.assignments.map((a) => `${a.wordId}\0${a.sentence}`)).size).toBe(20);
    expect(applied.r2Writes).toBe(0);
  });

  it.each(applied.assignments)("resolves the reviewed image for $wordId", (assignment) => {
    const media = resolveSentenceMedia(assignment.wordId, assignment.sentence);
    expect(media).toEqual({ imagePath: assignment.imagePath, imageAlt: assignment.imageAlt });
    expect(resolveAssetUrl(media!.imagePath)).toBe(assignment.imagePath);
    expect(assignment.imageSha256).toBe(assignment.remoteEvidence.sha256);
    expect(
      resolveSentenceMedia(`unreviewed-${assignment.wordId}`, assignment.sentence)
    ).toBeUndefined();
  });

  it("renders the reviewed image and description using the shared image component", () => {
    const assignment = applied.assignments.find((a) => a.wordId === "sleeping-bag")!;
    const media = resolveSentenceMedia(assignment.wordId, assignment.sentence)!;
    render(<QuestionImage media={media} onExhausted={() => undefined} />);
    const image = screen.getByRole("img", { name: assignment.imageAlt });
    expect(image).toHaveAttribute("src", assignment.imagePath);
  });
});
