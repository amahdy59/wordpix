import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { useAudio } from "../shared/useAudio";
import { I18nProvider } from "../../i18n";
import { BusinessInputStage } from "../learning/business/stages/BusinessInputStage";
import { getBusinessUnit } from "../learning/business/businessCatalog";
import { getPassageVocabularyTerms, RichPassageText } from "../shared/RichPassageText";

vi.mock("../shared/assetUrls", () => ({
  assetUrl: (key: string) => `https://assets.example/${key}`,
  hasAssetHost: () => true,
  audioKey: async () => "audio/test.mp3",
  audioUrls: async () => ["https://assets.example/test.mp3"],
  AUDIO_PROFILE_V4: {},
}));
vi.mock("../shared/pronunciationOverrides", () => ({
  getPronunciationAssetSpec: (text: string) => ({ text, profile: {} }),
  hasPronunciationOverride: () => false,
}));
vi.mock("../../lib/persistence/db", () => ({
  getCachedAudio: async () => new Blob(["recorded audio"], { type: "audio/mpeg" }),
  saveCachedAudio: vi.fn(),
}));

class RecordedAudio {
  static instances: RecordedAudio[] = [];
  currentTime = 0;
  duration = 90;
  playbackRate = 1;
  volume = 1;
  paused = true;
  onplaying: (() => void) | null = null;
  ontimeupdate: (() => void) | null = null;
  onended: (() => void) | null = null;
  onwaiting: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor() {
    RecordedAudio.instances.push(this);
  }
  pause = vi.fn(() => {
    this.paused = true;
  });
  play = vi.fn(async () => {
    this.paused = false;
    this.onplaying?.();
  });
}
const key = (letter: string) => `audio/${letter.repeat(2)}/${letter.repeat(64)}.mp3`;
function stubMedia() {
  vi.stubGlobal("Audio", RecordedAudio);
  vi.stubGlobal("speechSynthesis", undefined);
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:reading-controls");
}
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  RecordedAudio.instances = [];
});

describe("recorded reading controls", () => {
  it("pauses and resumes the same take, seeks safely, and changes speed without losing position", async () => {
    stubMedia();
    const { result, rerender } = renderHook(({ rate }) => useAudio({ rate }), {
      initialProps: { rate: 0.85 },
    });
    act(() => result.current.speak("Reading.", "en-US", key("a")));
    await waitFor(() => expect(result.current.status).toBe("playing"));
    const media = RecordedAudio.instances[0];
    act(() => {
      media.currentTime = 23;
      media.ontimeupdate?.();
      result.current.pause();
    });
    expect(result.current.status).toBe("paused");
    expect(media.paused).toBe(true);
    act(() => result.current.resume());
    expect(media.currentTime).toBe(23);
    expect(media.paused).toBe(false);
    expect(RecordedAudio.instances).toHaveLength(1);
    rerender({ rate: 1 });
    expect(media.playbackRate).toBe(1);
    expect(media.currentTime).toBe(23);
    act(() => result.current.seek(40));
    expect(result.current.currentTime).toBe(40);
    act(() => result.current.seek(1000));
    expect(media.currentTime).toBe(90);
    act(() => result.current.seek(-1));
    expect(media.currentTime).toBe(0);
    act(() => media.onwaiting?.());
    expect(result.current.status).toBe("buffering");
    act(() => media.onplaying?.());
    expect(result.current.status).toBe("playing");
  });

  it("pauses narration for word pronunciation and resumes its original position without overlapping audio", async () => {
    stubMedia();
    const { result } = renderHook(() => ({ reading: useAudio(), word: useAudio() }));
    act(() => result.current.reading.speak("Passage.", "en-US", key("b")));
    await waitFor(() => expect(result.current.reading.status).toBe("playing"));
    const reading = RecordedAudio.instances[0];
    act(() => {
      reading.currentTime = 11;
      reading.ontimeupdate?.();
    });
    act(() => result.current.word.speak("Word.", "en-US", key("c")));
    await waitFor(() => expect(result.current.word.status).toBe("playing"));
    expect(reading.paused).toBe(true);
    expect(result.current.reading.status).toBe("paused");
    act(() => result.current.reading.resume());
    expect(RecordedAudio.instances[1].paused).toBe(true);
    expect(reading.paused).toBe(false);
    expect(reading.currentTime).toBe(11);
    expect(RecordedAudio.instances).toHaveLength(2);
  });

  it("does not start an older cached request after another hook takes ownership", async () => {
    stubMedia();
    const { result } = renderHook(() => ({ first: useAudio(), latest: useAudio() }));
    act(() => {
      result.current.first.speak("Older request.", "en-US", key("d"));
      result.current.latest.speak("Latest request.", "en-US", key("e"));
    });
    await waitFor(() => expect(result.current.latest.status).toBe("playing"));
    expect(result.current.first.status).toBe("idle");
    expect(RecordedAudio.instances).toHaveLength(1);
  });
});

describe("continuous reading and canonical vocabulary", () => {
  it("matches reviewed forms and whole phrases without matching substrings or inventing vocabulary", () => {
    expect(
      getPassageVocabularyTerms(
        "Stress testing and safety-stock protect a system. Contest is unrelated.",
        ["stress test", "safety stock", "test", "redundancy"]
      )
    ).toEqual(["stress test", "safety stock"]);
    render(
      <I18nProvider>
        <RichPassageText
          text="Stress testing"
          vocabTerms={["stress test"]}
          interactiveVocabulary={false}
        />
      </I18nProvider>
    );
    expect(screen.getByText("Stress testing").tagName).toBe("MARK");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("keeps context and narrative in one article, highlights vocabulary in both, and restores glossary focus", async () => {
    const authored = getBusinessUnit("unit-35")!;
    const unit = {
      ...authored,
      mainInput: { ...authored.mainInput, context: "The team holds safety stock." },
    };
    render(
      <I18nProvider>
        <BusinessInputStage unit={unit} onNext={vi.fn()} />
      </I18nProvider>
    );
    const article = screen.getByRole("article");
    expect(within(article).getByText("The team holds", { exact: false })).toBeVisible();
    expect(
      within(article)
        .getAllByText("safety stock", { exact: true })
        .some((node) => node.tagName === "MARK")
    ).toBe(true);
    expect(within(article).getByText("stress testing", { exact: false }).tagName).toBe("MARK");
    expect(screen.queryByRole("heading", { name: "Executive Transcript" })).not.toBeInTheDocument();
    const word = within(screen.getByRole("region", { name: "Words in this reading" })).getByRole(
      "button",
      { name: /learn about safety stock/i }
    );
    word.focus();
    fireEvent.click(word);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "safety stock" })).toBeVisible();
    expect(
      within(dialog).getByText(
        authored.languageBank.find((item) => item.term === "safety stock")!.definition
      )
    ).toBeVisible();
    fireEvent.click(within(dialog).getByRole("button", { name: /^close$/i }));
    await waitFor(() => expect(word).toHaveFocus());
  });
});
