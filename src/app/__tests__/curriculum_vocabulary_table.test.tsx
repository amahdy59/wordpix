import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "../context/I18nContext";
import {
  CurriculumVocabularyTable,
  type VocabularyTableItem,
} from "../shared/CurriculumVocabularyTable";

const mockItems: VocabularyTableItem[] = [
  {
    id: "item-1",
    term: "role",
    termAr: "دور",
    type: "Noun",
    definition: "your function or position in an organisation",
    example: "What's your role in the project?",
    imageSrc: "/assets/role.jpg",
  },
  {
    id: "item-2",
    term: "work with clients",
    type: "Collocation",
    definition: "collaborate with customers to meet their needs",
    example: "I work with clients after they buy the software.",
  },
];

const mockSidebars = {
  wordFamily: "role (noun), role model (noun phrase)",
  meaningContrast: "role vs position: 'role' emphasizes responsibilities",
  commonError: "Avoid saying 'play a role of' — use 'play a role in'",
};

describe("CurriculumVocabularyTable", () => {
  it("renders table with the five target headers: Image, Word/Phrase, Definition, Example, Type", () => {
    render(
      <I18nProvider>
        <CurriculumVocabularyTable items={mockItems} />
      </I18nProvider>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Image")).toBeInTheDocument();
    expect(screen.getByText("Word/Phrase")).toBeInTheDocument();
    expect(screen.getByText("Definition")).toBeInTheDocument();
    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
  });

  it("renders all vocabulary rows with terms, definitions, examples, and badges", () => {
    render(
      <I18nProvider>
        <CurriculumVocabularyTable items={mockItems} />
      </I18nProvider>
    );

    expect(screen.getAllByText("role").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("your function or position in an organisation").length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("What's your role in the project?").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Noun").length).toBeGreaterThan(0);

    expect(screen.getAllByText("work with clients").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Collocation").length).toBeGreaterThan(0);
  });

  it("triggers audio playback when pronunciation button is clicked", async () => {
    const onPlayAudio = vi.fn();
    render(
      <I18nProvider>
        <CurriculumVocabularyTable items={mockItems} onPlayAudio={onPlayAudio} />
      </I18nProvider>
    );

    const audioBtns = screen.getAllByRole("button", { name: /play pronunciation for role/i });
    expect(audioBtns.length).toBeGreaterThan(0);
    await userEvent.click(audioBtns[0]);
    expect(onPlayAudio).toHaveBeenCalledWith("role");
  });

  it("displays Arabic text when showArabic is true", () => {
    render(
      <I18nProvider>
        <CurriculumVocabularyTable items={mockItems} showArabic={true} />
      </I18nProvider>
    );

    expect(screen.getAllByText("دور").length).toBeGreaterThan(0);
  });

  it("renders the 3 pedagogical sidebars when provided", () => {
    render(
      <I18nProvider>
        <CurriculumVocabularyTable items={mockItems} sidebars={mockSidebars} />
      </I18nProvider>
    );

    expect(screen.getByText("Word family")).toBeInTheDocument();
    expect(screen.getByText(mockSidebars.wordFamily)).toBeInTheDocument();

    expect(screen.getByText("Meaning contrast")).toBeInTheDocument();
    expect(screen.getByText(mockSidebars.meaningContrast)).toBeInTheDocument();

    expect(screen.getByText("Common error")).toBeInTheDocument();
    expect(screen.getByText(mockSidebars.commonError)).toBeInTheDocument();
  });
});
