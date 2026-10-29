import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { I18nProvider } from "../../i18n";
import { BUSINESS_UNITS, getBusinessUnit } from "../learning/business/businessCatalog";
import { recallChoices } from "../learning/business/businessRecallChoices";
import { BusinessRecallStage } from "../learning/business/stages/BusinessRecallStage";

describe("guided Business recall", () => {
  it("handles a lesson without recall and restores checked answers on remount", () => {
    const onNext = vi.fn();
    const empty = render(
      <I18nProvider>
        <BusinessRecallStage unit={getBusinessUnit("unit-01")!} onNext={onNext} />
      </I18nProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /begin warm-up/i }));
    expect(onNext).toHaveBeenCalledOnce();
    empty.unmount();
    const unit = getBusinessUnit("unit-02")!;
    render(
      <I18nProvider>
        <BusinessRecallStage
          unit={unit}
          savedAnswers={{ "u02-recall-1": "role" }}
          onNext={onNext}
        />
      </I18nProvider>
    );
    expect(screen.getByRole("radio", { name: "role" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Answered 1 of 7")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /check answer/i })).not.toBeInTheDocument();
  });
  it("gives every recall question distinct choices with exactly one correct answer", () => {
    for (const unit of BUSINESS_UNITS) {
      for (const prompt of unit.recall?.prompts ?? []) {
        const options = recallChoices(prompt, unit);
        expect(options.length, prompt.id).toBeGreaterThanOrEqual(2);
        expect(options.length).toBeLessThanOrEqual(4);
        expect(new Set(options.map((option) => option.toLowerCase())).size).toBe(options.length);
        expect(
          options.filter((option) => option === (prompt.correctAnswer ?? prompt.targetWord))
        ).toHaveLength(1);
        expect(recallChoices(prompt, unit)).toEqual(options);
      }
    }
  });

  it("can skip, revisit, check an answer and continue without recording completion", () => {
    const unit = getBusinessUnit("unit-02")!;
    const onComplete = vi.fn();
    const onNext = vi.fn();
    const onSaveAnswer = vi.fn();
    render(
      <I18nProvider>
        <BusinessRecallStage
          unit={unit}
          onNext={onNext}
          onComplete={onComplete}
          onSaveAnswer={onSaveAnswer}
        />
      </I18nProvider>
    );
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getAllByRole("radiogroup")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: /answer later/i }));
    expect(screen.getByText("Question 2 of 7")).toBeInTheDocument();
    expect(onSaveAnswer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /previous question/i }));
    fireEvent.click(screen.getByRole("radio", { name: "role" }));
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/correct/i);
    expect(onSaveAnswer).toHaveBeenCalledWith("u02-recall-1", "role");
    fireEvent.click(screen.getByRole("button", { name: /next question/i }));
    fireEvent.click(screen.getByRole("button", { name: /previous question/i }));
    expect(screen.getByRole("radio", { name: "role" })).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByRole("button", { name: /begin lesson warm-up/i }));
    expect(onNext).toHaveBeenCalledOnce();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
