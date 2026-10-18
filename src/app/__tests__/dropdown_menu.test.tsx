import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuToggleItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../shared/DropdownMenu";

describe("DropdownMenu component", () => {
  it("renders trigger with accessible WAI-ARIA attributes", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger ariaLabel="Lesson options">Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={vi.fn()}>Action 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByRole("button", { name: "Lesson options" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens menu when trigger is clicked and updates aria-expanded", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger ariaLabel="Lesson options">Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={vi.fn()}>Action 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByRole("button", { name: "Lesson options" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action 1" })).toBeInTheDocument();
  });

  it("executes item action and closes menu on item click by default", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger ariaLabel="Lesson options">Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleAction}>Restart lesson</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByRole("button", { name: "Lesson options" });
    await user.click(trigger);

    const item = screen.getByRole("button", { name: "Restart lesson" });
    await user.click(item);

    expect(handleAction).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape key press and restores focus to trigger", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger ariaLabel="Lesson options">Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={vi.fn()}>Action</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByRole("button", { name: "Lesson options" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes on click outside", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button type="button">Outside element</button>
        <DropdownMenu>
          <DropdownMenuTrigger ariaLabel="Lesson options">Options</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={vi.fn()}>Action</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );

    const trigger = screen.getByRole("button", { name: "Lesson options" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Click outside
    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside element" }));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("supports toggle items with aria-pressed, state badge, and animated switch", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    const { rerender } = render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger ariaLabel="Lesson options">Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuToggleItem
            label="Auto-advance questions"
            stateText="Enabled"
            ariaLabel="Auto-advance: Enabled"
            checked={true}
            onCheckedChange={handleToggle}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const toggleButton = screen.getByRole("button", { name: "Auto-advance: Enabled" });
    expect(toggleButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Enabled")).toBeInTheDocument();

    await user.click(toggleButton);
    expect(handleToggle).toHaveBeenCalledWith(false);

    // Re-render with false
    rerender(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger ariaLabel="Lesson options">Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuToggleItem
            label="Auto-advance questions"
            stateText="Disabled"
            ariaLabel="Auto-advance: Disabled"
            checked={false}
            onCheckedChange={handleToggle}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const updatedToggle = screen.getByRole("button", { name: "Auto-advance: Disabled" });
    expect(updatedToggle).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  it("renders separators and labels with correct accessible roles", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger ariaLabel="Options">Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          <DropdownMenuItem onClick={vi.fn()}>Home</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Preferences</DropdownMenuLabel>
          <DropdownMenuItem onClick={vi.fn()}>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});
