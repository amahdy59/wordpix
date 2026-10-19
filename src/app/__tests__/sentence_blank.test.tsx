import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { I18nProvider } from "../context/I18nContext";
import { ClozeText } from "../shared/SentenceBlank";

describe("sentence gap presentation", () => {
  it("keeps every gap and surrounding punctuation without rendering underscore lines", () => {
    const { container, rerender } = render(
      <I18nProvider>
        <ClozeText text="A ____ and an ________." />
      </I18nProvider>
    );
    expect(screen.getAllByText("missing word")).toHaveLength(2);
    expect(container.textContent).toBe("A missing word and an missing word.");
    rerender(
      <I18nProvider>
        <ClozeText text="An ____ model." answer="eye" />
      </I18nProvider>
    );
    expect(container.textContent).toBe("An eye model.");
    expect(screen.queryByText("missing word")).not.toBeInTheDocument();
  });

  it("leaves ordinary text, single underscores and brace content unchanged", () => {
    const { container } = render(
      <I18nProvider>
        <ClozeText text="Check user_id and {name}." />
      </I18nProvider>
    );
    expect(container.textContent).toBe("Check user_id and {name}.");
    expect(container.querySelector(".wp-question-blank")).toBeNull();
  });
});
