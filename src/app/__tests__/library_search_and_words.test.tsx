import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi, beforeEach } from "vitest";
import { I18nProvider } from "../context/I18nContext";
import { LibraryScreen } from "../core/ExploreWorlds";

vi.mock("../data/progress", () => ({
  useProgress: () => ({
    progress: {
      wordMastery: {
        bed: 3,
        pillow: 3,
        blanket: 3,
      },
    },
  }),
}));

vi.mock("../shared/useAudio", () => ({
  useAudio: () => ({
    speak: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    isPlaying: false,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

it("renders modern command searchbar with shortcut hint and exposed level chips", () => {
  const dispatch = vi.fn();
  render(
    <I18nProvider>
      <LibraryScreen dispatch={dispatch} />
    </I18nProvider>
  );

  const searchbox = screen.getByRole("searchbox");
  expect(searchbox).toBeInTheDocument();

  // Level filter chips in collection navigation
  const stageGroup = screen.getByRole("radiogroup", { name: /Filter vocabulary collections/i });
  expect(stageGroup).toBeInTheDocument();
  expect(within(stageGroup).getByRole("radio", { name: /All/i })).toBeInTheDocument();
  expect(within(stageGroup).getByRole("radio", { name: /Pre-A1/i })).toBeInTheDocument();
  expect(within(stageGroup).getByRole("radio", { name: /A1 Foundations/i })).toBeInTheDocument();
});

it("displays popular topic discovery chips and allows quick search", () => {
  const dispatch = vi.fn();
  render(
    <I18nProvider>
      <LibraryScreen dispatch={dispatch} />
    </I18nProvider>
  );

  // Popular topics shown when search is empty
  const travelChip = screen.getByRole("button", { name: /Travel & Transit/ });
  expect(travelChip).toBeInTheDocument();

  fireEvent.click(travelChip);

  const searchbox = screen.getByRole("searchbox") as HTMLInputElement;
  expect(searchbox.value).toBe("airport");
});

it("surfaces matching direct vocabulary words when typing a word search", async () => {
  const dispatch = vi.fn();
  render(
    <I18nProvider>
      <LibraryScreen dispatch={dispatch} />
    </I18nProvider>
  );

  const searchbox = screen.getByRole("searchbox");
  fireEvent.change(searchbox, { target: { value: "passport" } });

  // Direct vocabulary hit for "passport"
  expect(await screen.findByText(/passport/i)).toBeInTheDocument();

  // Search scope tabs are displayed
  expect(screen.getByRole("tab", { name: /All/ })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /Words/ })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /Units/ })).toBeInTheDocument();
});

it("toggles all stages using expand all / collapse all", () => {
  const dispatch = vi.fn();
  render(
    <I18nProvider>
      <LibraryScreen dispatch={dispatch} />
    </I18nProvider>
  );

  const expandBtn = screen.getByRole("button", { name: /Expand all/ });
  expect(expandBtn).toBeInTheDocument();

  fireEvent.click(expandBtn);
  expect(screen.getByRole("button", { name: /Collapse all/ })).toBeInTheDocument();
});

it("allows clearing active search and filters", () => {
  const dispatch = vi.fn();
  render(
    <I18nProvider>
      <LibraryScreen dispatch={dispatch} />
    </I18nProvider>
  );

  const searchbox = screen.getByRole("searchbox") as HTMLInputElement;
  fireEvent.change(searchbox, { target: { value: "kitchen" } });
  expect(searchbox.value).toBe("kitchen");

  const clearBtn = screen.getByRole("button", { name: /Clear search/ });
  fireEvent.click(clearBtn);
  expect(searchbox.value).toBe("");
});
