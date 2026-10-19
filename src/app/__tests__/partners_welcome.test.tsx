import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PartnersWelcome } from "../onboarding/PartnersWelcome";
import { I18nProvider } from "../context/I18nContext";
import { LearnerProvider } from "../context/LearnerContext";

describe("PartnersWelcome slide", () => {
  const setup = () => {
    const dispatch = vi.fn();
    const result = render(
      <I18nProvider>
        <LearnerProvider>
          <PartnersWelcome dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );
    return { ...result, dispatch };
  };

  it("renders partner company names and headings", () => {
    setup();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Vodafone")).toBeInTheDocument();
    expect(screen.getByText("Microsoft")).toBeInTheDocument();
    expect(screen.getByText("Siemens")).toBeInTheDocument();
    expect(screen.getByText("e& (Etisalat)")).toBeInTheDocument();
    expect(screen.getByText("AstraZeneca")).toBeInTheDocument();
    expect(screen.getByText("HSBC")).toBeInTheDocument();
    expect(screen.getByText("Emirates")).toBeInTheDocument();
    expect(screen.getByText("Deloitte")).toBeInTheDocument();
  });

  it("filters company cards by sector when clicking filter chips", () => {
    setup();
    // Default displays all 8 companies
    expect(screen.getByText("Vodafone")).toBeInTheDocument();
    expect(screen.getByText("Microsoft")).toBeInTheDocument();

    // Click Telecom filter
    const telecomBtn = screen.getByRole("button", { name: /telecom/i });
    fireEvent.click(telecomBtn);

    expect(screen.getByText("Vodafone")).toBeInTheDocument();
    expect(screen.getByText("e& (Etisalat)")).toBeInTheDocument();
    expect(screen.queryByText("Microsoft")).not.toBeInTheDocument();
    expect(screen.queryByText("AstraZeneca")).not.toBeInTheDocument();

    // Click Healthcare filter
    const healthcareBtn = screen.getByRole("button", { name: /healthcare/i });
    fireEvent.click(healthcareBtn);

    expect(screen.getByText("AstraZeneca")).toBeInTheDocument();
    expect(screen.queryByText("Vodafone")).not.toBeInTheDocument();

    // Return to All Sectors
    const allBtn = screen.getByRole("button", { name: /all sectors/i });
    fireEvent.click(allBtn);

    expect(screen.getByText("Vodafone")).toBeInTheDocument();
    expect(screen.getByText("Microsoft")).toBeInTheDocument();
  });

  it("dispatches ONBOARD_NEXT when clicking continue", () => {
    const { dispatch } = setup();
    const continueBtn = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueBtn);
    expect(dispatch).toHaveBeenCalledWith({ type: "ONBOARD_NEXT" });
  });

  it("dispatches ONBOARD_BACK when clicking back", () => {
    const { dispatch } = setup();
    const backBtn = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backBtn);
    expect(dispatch).toHaveBeenCalledWith({ type: "ONBOARD_BACK" });
  });

  it("bypasses onboarding and navigates to home when clicking skip setup", () => {
    const { dispatch } = setup();
    const skipBtn = screen.getByRole("button", { name: /skip setup/i });
    fireEvent.click(skipBtn);
    expect(dispatch).toHaveBeenCalledWith({ type: "GO", to: "home" });
  });
});
