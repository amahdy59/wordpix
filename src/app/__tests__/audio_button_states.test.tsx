import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AudioButton } from "../shared/AudioButton";

describe("Audio control state and recovery", () => {
  it("keeps state styling separate from caller layout classes", () => {
    render(
      <AudioButton
        onPlay={vi.fn()}
        label="Listen to advice"
        className="rounded-lg bg-secondary text-primary"
      />
    );
    const button = screen.getByRole("button", { name: "Listen to advice" });
    expect(button).toHaveAttribute("data-audio-state", "idle");
    expect(button).toHaveClass("wp-audio-button", "rounded-lg");
    expect(button).not.toHaveAttribute("aria-pressed", "true");
  });

  it("announces playback, blocks duplicate loading requests and enables retry", () => {
    const onPlay = vi.fn();
    const { rerender } = render(<AudioButton onPlay={onPlay} isPlaying label="Listen to advice" />);
    let button = screen.getByRole("button", { name: /playing/ });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-audio-state", "active");
    rerender(<AudioButton onPlay={onPlay} isLoading label="Listen to advice" />);
    button = screen.getByRole("button", { name: /loading audio/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    fireEvent.click(button);
    expect(onPlay).not.toHaveBeenCalled();
    rerender(<AudioButton onPlay={onPlay} isError label="Listen to advice" />);
    button = screen.getByRole("button", { name: /retry audio/ });
    expect(button).toHaveAttribute("data-audio-state", "error");
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(onPlay).toHaveBeenCalledOnce();
  });
});
