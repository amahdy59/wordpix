import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LearnerAvatar } from "../shared/LearnerAvatar";
import { I18nProvider } from "../context/I18nContext";

/**
 * The regression: the home dashboard and the profile both pointed at
 * /images/core/learner-avatar.webp, which does not exist in public/, so both
 * rendered a broken image icon in their header. The path was root-absolute
 * too, so it would have 404ed under the configured base even if added.
 */
afterEach(() => localStorage.removeItem("wordpix:interface-lang"));
describe("LearnerAvatar", () => {
  it("renders the initial directly without requesting a missing portrait", () => {
    render(<LearnerAvatar name="Ahmed" />);
    const img = screen.getByRole("img", { name: /ahmed profile/i });
    expect(img.tagName).toBe("DIV");
    expect(img).toHaveTextContent("A");
    expect(document.querySelector("img")).toBeNull();
  });

  it("uses a complete Unicode initial and ignores surrounding whitespace", () => {
    render(<LearnerAvatar name="  𐐀lex  " />);
    expect(screen.getByRole("img", { name: /𐐀lex profile/ })).toHaveTextContent("𐐀");
  });

  it("keeps an accessible name when no learner name is known", () => {
    render(<LearnerAvatar />);
    expect(screen.getByRole("img", { name: /learner profile/i })).toHaveTextContent("L");
  });
  it("localizes the accessible name and default initial in Arabic", async () => {
    localStorage.setItem("wordpix:interface-lang", "ar");
    render(
      <I18nProvider>
        <LearnerAvatar name="  " />
      </I18nProvider>
    );
    expect(await screen.findByRole("img", { name: "الصورة الشخصية لـمتعلّم" })).toHaveTextContent(
      "م"
    );
  });
});
