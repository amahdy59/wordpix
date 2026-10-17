import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { I18nProvider } from "../context/I18nContext";
import { LibraryScreen } from "../core/ExploreWorlds";
import { COURSE_UNITS } from "../data/courseCatalog";

vi.mock("../data/progress", () => ({
  useProgress: () => ({ progress: { wordMastery: {} } }),
}));

it("opens a searched Library unit to lesson entry with returnTo library", () => {
  const dispatch = vi.fn();
  const unit = Object.values(COURSE_UNITS).find((item) => item.name === "The Office")!;
  render(
    <I18nProvider>
      <LibraryScreen dispatch={dispatch} />
    </I18nProvider>
  );
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "The Office" } });
  fireEvent.click(screen.getByRole("button", { name: /The Office.*Continue/ }));
  expect(dispatch).toHaveBeenCalledWith({
    type: "GO",
    to: "lesson-entry",
    unitId: unit.id,
    returnTo: "library",
  });
});

it("opens Study Materials directly from the Library card without entering its lesson", () => {
  const dispatch = vi.fn();
  const unit = Object.values(COURSE_UNITS).find((item) => item.name === "The Office")!;
  render(
    <I18nProvider>
      <LibraryScreen dispatch={dispatch} />
    </I18nProvider>
  );
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "The Office" } });
  fireEvent.click(screen.getByRole("button", { name: /Study materials: The Office/i }));
  expect(dispatch).toHaveBeenCalledWith({
    type: "GO",
    to: "learning-materials",
    unitId: unit.id,
    area: "learn",
    returnTo: "library",
  });
});
