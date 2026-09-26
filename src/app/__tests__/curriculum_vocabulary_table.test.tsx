import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
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
  it("renders table with the 4 core headers by default: Image, Word/Phrase, Definition, Example (Type omitted)", () => {
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
    expect(screen.queryByRole("columnheader", { name: "Type" })).not.toBeInTheDocument();
  });

  it("renders Type header when showType is true", () => {
    render(
      <I18nProvider>
        <CurriculumVocabularyTable items={mockItems} showType={true} />
      </I18nProvider>
    );

    expect(screen.getByText("Type")).toBeInTheDocument();
  });

  it("renders all vocabulary rows with terms, definitions, and examples", () => {
    render(
      <I18nProvider>
        <CurriculumVocabularyTable items={mockItems} />
      </I18nProvider>
    );

    expect(screen.getAllByText("role").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("your function or position in an organisation").length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(`"What's your role in the project?"`).length).toBeGreaterThan(0);
    expect(screen.getAllByText("work with clients").length).toBeGreaterThan(0);
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

  it("opens the accessible Image & Meaning Modal when enlarge button is clicked and closes on close button", async () => {
    render(
      <I18nProvider>
        <CurriculumVocabularyTable items={mockItems} />
      </I18nProvider>
    );

    const enlargeBtns = screen.getAllByRole("button", { name: /enlarge image for role/i });
    expect(enlargeBtns.length).toBeGreaterThan(0);

    // Click to open modal
    await userEvent.click(enlargeBtns[0]);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");

    // Modal displays term, definition and example inside dialog
    expect(
      within(dialog).getByText("your function or position in an organisation")
    ).toBeInTheDocument();
    expect(within(dialog).getByRole("heading", { name: "role" })).toBeInTheDocument();

    // Close modal
    const closeBtn = within(dialog).getByRole("button", { name: /close dialog/i });
    await userEvent.click(closeBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("toggles between Table View and Gallery View", async () => {
    render(
      <I18nProvider>
        <CurriculumVocabularyTable items={mockItems} />
      </I18nProvider>
    );

    // Starts in Table View
    expect(screen.getByRole("table")).toBeInTheDocument();

    const galleryBtn = screen.getByRole("button", { name: /gallery/i });
    await userEvent.click(galleryBtn);

    // Table is hidden in Gallery View
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "role" })).toBeInTheDocument();

    // Switch back to Table View
    const tableBtn = screen.getByRole("button", { name: /table/i });
    await userEvent.click(tableBtn);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
