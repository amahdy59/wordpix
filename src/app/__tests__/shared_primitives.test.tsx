import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Button,
  IconButton,
  Surface,
  ActionCard,
  FilterChip,
  PageHeader,
  ProgressBar,
} from "../shared";

describe("Shared UI Primitives", () => {
  describe("Button", () => {
    it("renders children and handles clicks", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Start Lesson</Button>);

      const btn = screen.getByRole("button", { name: "Start Lesson" });
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveAttribute("type", "button");

      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("supports loading state and sets aria-busy", () => {
      const handleClick = vi.fn();
      render(
        <Button loading loadingText="Loading..." onClick={handleClick}>
          Submit
        </Button>
      );

      const btn = screen.getByRole("button", { name: "Loading..." });
      expect(btn).toHaveAttribute("aria-busy", "true");
      expect(btn).toBeDisabled();

      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("respects disabled prop", () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled Action
        </Button>
      );

      const btn = screen.getByRole("button", { name: "Disabled Action" });
      expect(btn).toBeDisabled();

      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("supports submit type in forms", () => {
      render(<Button type="submit">Submit Form</Button>);
      expect(screen.getByRole("button", { name: "Submit Form" })).toHaveAttribute("type", "submit");
    });
  });

  describe("IconButton", () => {
    it("renders with required aria-label", () => {
      const handleClick = vi.fn();
      render(
        <IconButton aria-label="Close dialog" onClick={handleClick}>
          <span data-testid="test-icon">X</span>
        </IconButton>
      );

      const btn = screen.getByRole("button", { name: "Close dialog" });
      expect(btn).toBeInTheDocument();
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();

      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("supports loading spinner state", () => {
      render(
        <IconButton aria-label="Sync data" loading>
          <span>Sync</span>
        </IconButton>
      );

      const btn = screen.getByRole("button", { name: "Sync data" });
      expect(btn).toHaveAttribute("aria-busy", "true");
      expect(btn).toBeDisabled();
    });
  });

  describe("Surface", () => {
    it("renders as different HTML elements", () => {
      const { container } = render(
        <Surface as="section" variant="panel" radius="2xl" padding="md">
          <p>Panel Content</p>
        </Surface>
      );

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveTextContent("Panel Content");
      expect(section?.className).toContain("bg-wp-panel");
    });
  });

  describe("ActionCard", () => {
    it("renders as a native button with title, description, and handles clicks", () => {
      const handleClick = vi.fn();
      render(
        <ActionCard
          title="Unit 1: Bedroom"
          description="Master 24 essential household objects."
          badge={<span>Beginner</span>}
          onClick={handleClick}
        />
      );

      const card = screen.getByRole("button", { name: /Unit 1: Bedroom/i });
      expect(card).toBeInTheDocument();
      expect(screen.getByText("Master 24 essential household objects.")).toBeInTheDocument();
      expect(screen.getByText("Beginner")).toBeInTheDocument();

      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("reflects selected state via aria-pressed", () => {
      render(<ActionCard title="Option A" selected onClick={vi.fn()} />);

      const card = screen.getByRole("button", { name: /Option A/i });
      expect(card).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("FilterChip", () => {
    it("renders toggle button with aria-pressed and handles onToggle", () => {
      const handleToggle = vi.fn();
      const { rerender } = render(
        <FilterChip label="A1 Foundations" selected={false} onToggle={handleToggle} count={12} />
      );

      const chip = screen.getByRole("button", { name: /A1 Foundations/i });
      expect(chip).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByText("12")).toBeInTheDocument();

      fireEvent.click(chip);
      expect(handleToggle).toHaveBeenCalledTimes(1);

      rerender(
        <FilterChip label="A1 Foundations" selected={true} onToggle={handleToggle} count={12} />
      );
      expect(chip).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("PageHeader", () => {
    it("renders heading, subtitle, eyebrow, and actions", () => {
      render(
        <PageHeader
          eyebrow="Curriculum overview"
          title="Guided Learning Path"
          subtitle="Follow the step-by-step route from A1 to C1."
          actions={
            <button type="button" className="min-h-[44px]">
              Action
            </button>
          }
        />
      );

      expect(
        screen.getByRole("heading", { level: 1, name: "Guided Learning Path" })
      ).toBeInTheDocument();
      expect(screen.getByText("Curriculum overview")).toBeInTheDocument();
      expect(screen.getByText("Follow the step-by-step route from A1 to C1.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    });

    it("triggers onBack when back button is rendered", () => {
      const handleBack = vi.fn();
      render(<PageHeader title="Lesson Details" onBack={handleBack} backLabel="Go back to path" />);

      const backBtn = screen.getByRole("button", { name: "Go back to path" });
      fireEvent.click(backBtn);
      expect(handleBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("ProgressBar enhancements", () => {
    it("renders with variant and size while preserving accessibility attributes", () => {
      render(
        <ProgressBar
          progressPercent={65}
          label="Progress"
          labelRight="65%"
          ariaLabel="Overall course completion"
          variant="success"
          size="lg"
        />
      );

      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuenow", "65");
      expect(bar).toHaveAttribute("aria-label", "Overall course completion");
      expect(bar.firstElementChild?.className).toContain("bg-wp-green");
    });
  });
});
