import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BilingualTextBlock, LanguageToggle } from "../shared/BilingualText";
import { ChoiceOptionGroup } from "../shared/ChoiceOptionGroup";
import { TaskChecklist } from "../shared/TaskChecklist";

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
});
