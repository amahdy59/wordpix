import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BilingualTextBlock, LanguageToggle } from "../shared/BilingualText";
import { ChoiceOptionGroup } from "../shared/ChoiceOptionGroup";
import { TaskChecklist } from "../shared/TaskChecklist";
import { QuizQuestionCard } from "../shared/QuizQuestionCard";
import { FilterChip } from "../shared/FilterChip";

function FilterHarness() {
  const [value, setValue] = useState("listening");
  return (
    <div role="radiogroup" aria-label="Practice skills">
      {["listening", "reading", "speaking"].map((id) => (
        <FilterChip
          key={id}
          label={id}
          selectionMode="single"
          selected={value === id}
          onToggle={() => setValue(id)}
        />
      ))}
    </div>
  );
}

function ChoiceHarness() {
  const [value, setValue] = useState<"a" | "b" | "c">("a");
  return (
    <ChoiceOptionGroup
      label="Choose an answer"
      options={[
        { value: "a", label: "First", accessibleLabel: "First answer" },
        { value: "b", label: "Second", accessibleLabel: "Second answer" },
        { value: "c", label: "Third", accessibleLabel: "Third answer" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

function ChecklistHarness() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  return (
    <TaskChecklist
      items={["Use a complete sentence", "Give one example"]}
      checked={checked}
      onToggle={(index) => {
        setChecked((current) => {
          const next = new Set(current);
          if (next.has(index)) next.delete(index);
          else next.add(index);
          return next;
        });
      }}
    />
  );
}

function LanguageHarness() {
  const [showArabic, setShowArabic] = useState(false);
  return (
    <div>
      <LanguageToggle
        showArabic={showArabic}
        onToggle={() => setShowArabic((current) => !current)}
        showLabel="Show Arabic"
        hideLabel="Show English only"
      />
      <BilingualTextBlock
        english="A thoughtful answer"
        arabic="إجابة مدروسة"
        showArabic={showArabic}
      />
    </div>
  );
}

describe("shared learning controls", () => {
  it("lets keyboard users select filter chips with arrows and a single Tab stop", async () => {
    const user = userEvent.setup();
    render(<FilterHarness />);
    const listening = screen.getByRole("radio", { name: "listening" });
    const reading = screen.getByRole("radio", { name: "reading" });
    const speaking = screen.getByRole("radio", { name: "speaking" });
    await user.tab();
    expect(listening).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(reading).toHaveFocus();
    expect(reading).toHaveAttribute("aria-checked", "true");
    expect(listening).toHaveAttribute("tabindex", "-1");
    await user.keyboard("{End}");
    expect(speaking).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(listening).toHaveFocus();
    await user.keyboard("{Home}");
    expect(listening).toHaveAttribute("aria-checked", "true");
  });
  it("supports APG radio navigation with wrapping, Home, and End", async () => {
    const user = userEvent.setup();
    render(<ChoiceHarness />);

    const first = screen.getByRole("radio", { name: "First answer" });
    const second = screen.getByRole("radio", { name: "Second answer" });
    const third = screen.getByRole("radio", { name: "Third answer" });

    first.focus();
    await user.keyboard("{ArrowLeft}");
    expect(third).toHaveFocus();
    expect(third).toHaveAttribute("aria-checked", "true");

    await user.keyboard("{Home}");
    expect(first).toHaveFocus();
    await user.keyboard("{End}");
    expect(third).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(first).toHaveFocus();

    await user.click(second);
    expect(second).toHaveAttribute("aria-checked", "true");
  });

  it("exposes checklist state with checkbox semantics", async () => {
    const user = userEvent.setup();
    render(<ChecklistHarness />);

    const item = screen.getByRole("checkbox", { name: "Use a complete sentence" });
    expect(item).toHaveAttribute("aria-checked", "false");
    await user.click(item);
    expect(item).toHaveAttribute("aria-checked", "true");
    await user.click(item);
    expect(item).toHaveAttribute("aria-checked", "false");
  });

  it("reveals Arabic with explicit language and direction metadata", async () => {
    const user = userEvent.setup();
    render(<LanguageHarness />);

    const toggle = screen.getByRole("button", { name: "Show Arabic" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText("إجابة مدروسة")).not.toBeInTheDocument();

    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Show English only" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByText("إجابة مدروسة")).toHaveAttribute("lang", "ar");
    expect(screen.getByText("إجابة مدروسة")).toHaveAttribute("dir", "rtl");
  });

  it("uses the shared quiz feedback pattern and locks a submitted answer", async () => {
    const user = userEvent.setup();
    render(
      <QuizQuestionCard
        id="shared-pattern"
        index={0}
        question="Which answer is correct?"
        correctValue="b"
        onChange={() => undefined}
        value="a"
        feedback="B is the supported answer."
        options={[
          { value: "a", label: "Answer A", accessibleLabel: "Answer A" },
          { value: "b", label: "Answer B", accessibleLabel: "Answer B" },
        ]}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent("Not yet");
    expect(screen.getByRole("status")).toHaveTextContent("B is the supported answer.");
    const option = screen.getByRole("radio", { name: "Answer B" });
    expect(option).toHaveAttribute("aria-disabled", "true");
    option.focus();
    expect(option).toHaveFocus();
    await user.click(option);
    await user.keyboard("{ArrowLeft}{Enter}");
    expect(option).toHaveAttribute("aria-checked", "false");
  });
});
