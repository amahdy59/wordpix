import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useExerciseHotkeys } from "../shared/useExerciseHotkeys";

interface HarnessProps {
  onSelectIndex: (i: number) => void;
  onReplayAudio?: () => void;
  disabled?: boolean;
  withInput?: boolean;
}

function Harness({ onSelectIndex, onReplayAudio, disabled, withInput }: HarnessProps) {
  useExerciseHotkeys({ optionCount: 4, onSelectIndex, onReplayAudio, disabled });
  return (
    <div>
      <button type="button">Option A</button>
      {withInput && <input aria-label="Answer" />}
    </div>
  );
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("Exercise number-key shortcuts", () => {
  it("selects the matching option by number key", async () => {
    const user = userEvent.setup();
    const onSelectIndex = vi.fn();
    render(<Harness onSelectIndex={onSelectIndex} />);

    await user.keyboard("3");
    expect(onSelectIndex).toHaveBeenCalledWith(2);
  });

  it("ignores numbers beyond the option count", async () => {
    const user = userEvent.setup();
    const onSelectIndex = vi.fn();
    render(<Harness onSelectIndex={onSelectIndex} />);

    await user.keyboard("9");
    expect(onSelectIndex).not.toHaveBeenCalled();
  });

  it("ignores Ctrl/Cmd/Alt combinations so browser tab switching still works", async () => {
    const user = userEvent.setup();
    const onSelectIndex = vi.fn();
    render(<Harness onSelectIndex={onSelectIndex} />);

    await user.keyboard("{Control>}1{/Control}");
    await user.keyboard("{Meta>}2{/Meta}");
    await user.keyboard("{Alt>}3{/Alt}");
    expect(onSelectIndex).not.toHaveBeenCalled();
  });

  it("ignores number keys typed into a text field", async () => {
    const user = userEvent.setup();
    const onSelectIndex = vi.fn();
    render(<Harness onSelectIndex={onSelectIndex} withInput />);

    await user.click(screen.getByLabelText("Answer"));
    await user.keyboard("2");

    expect(onSelectIndex).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Answer")).toHaveValue("2");
  });

  it("stops listening while a modal owns the keyboard", async () => {
    const user = userEvent.setup();
    const onSelectIndex = vi.fn();
    render(<Harness onSelectIndex={onSelectIndex} disabled />);

    await user.keyboard("1");
    expect(onSelectIndex).not.toHaveBeenCalled();
  });

  it("detaches its listener on unmount", async () => {
    const user = userEvent.setup();
    const onSelectIndex = vi.fn();
    const { unmount } = render(<Harness onSelectIndex={onSelectIndex} />);

    unmount();
    await user.keyboard("1");
    expect(onSelectIndex).not.toHaveBeenCalled();
  });
});

describe("Replay-audio shortcut", () => {
  it("replays on R", async () => {
    const user = userEvent.setup();
    const onReplayAudio = vi.fn();
    render(<Harness onSelectIndex={vi.fn()} onReplayAudio={onReplayAudio} />);

    await user.keyboard("r");
    expect(onReplayAudio).toHaveBeenCalledTimes(1);
  });

  it("replays on Space when focus is on the page body", async () => {
    const user = userEvent.setup();
    const onReplayAudio = vi.fn();
    render(<Harness onSelectIndex={vi.fn()} onReplayAudio={onReplayAudio} />);

    await user.keyboard(" ");
    expect(onReplayAudio).toHaveBeenCalledTimes(1);
  });

  // The regression this guards: Space is the standard activation key for a
  // button. Claiming it globally meant tabbing to an option and pressing Space
  // replayed audio instead of choosing that option.
  it("leaves Space alone when a control is focused, so buttons still activate", async () => {
    const user = userEvent.setup();
    const onReplayAudio = vi.fn();
    const onClick = vi.fn();

    function FocusedButtonHarness() {
      useExerciseHotkeys({ optionCount: 4, onSelectIndex: vi.fn(), onReplayAudio });
      return (
        <button type="button" onClick={onClick}>
          Option A
        </button>
      );
    }
    render(<FocusedButtonHarness />);

    const button = screen.getByRole("button", { name: "Option A" });
    button.focus();
    await user.keyboard(" ");

    expect(onReplayAudio).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
