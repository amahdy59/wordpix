import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { getLexiconEntry } from "../data/lexiconDictionary";
import { getArabicSpeakerTip } from "../learning/foundations/figmaPronunciationCatalog";
import {
  CAN_DO_SCENARIOS,
  getCanDoScenarioForUnit,
  type CanDoTransferChallenge,
} from "../data/canDoScenarios";
import { VocabularyDetailModal } from "../shared/VocabularyDetailModal";
import {
  CurriculumQuizEngine,
  CanDoChallengeCard,
  type QuizQuestion,
} from "../shared/CurriculumQuizEngine";
import { I18nProvider } from "../../i18n";

describe("Phase 1 & 3: Inside Content Lexicon & Vocabulary Details", () => {
  it("provides enriched Arabic glosses, translations, collocations, register, and word family for key vocabulary", () => {
    const toilet = getLexiconEntry("toilet");
    expect(toilet).toBeDefined();
    expect(toilet.arabic).toBe("مِرْحَاض");
    expect(toilet.sentences[0]?.ar).toContain("المِرْحَاضِ");
    expect(toilet.collocations).toContain("flush the toilet");

    const decision = getLexiconEntry("decision");
    expect(decision).toBeDefined();
    expect(decision.arabic).toBe("قَرَار");
    expect(decision.register).toBe("formal");
    expect(decision.collocations).toContain("make a decision");
    expect(decision.wordFamily?.verb).toBe("decide");
    expect(decision.wordFamily?.adj).toBe("decisive");

    const recommendation = getLexiconEntry("recommendation");
    expect(recommendation).toBeDefined();
    expect(recommendation.register).toBe("formal");
    expect(recommendation.wordFamily?.verb).toBe("recommend");

    const appointment = getLexiconEntry("appointment");
    expect(appointment).toBeDefined();
    expect(appointment.collocations).toContain("book an appointment");
    expect(appointment.wordFamily?.verb).toBe("appoint");
  });

  it("renders register badge, collocations, and word family grid in VocabularyDetailModal", () => {
    const mockItem = {
      id: "test-decision",
      term: "decision",
      termAr: "قرار",
      type: "Noun",
      definition: "a conclusion or resolution reached after consideration",
      definitionAr: "خلاصة أو حكم يتم التوصل إليه بعد تفكير",
      example: "We need to make an informed decision by Friday.",
      exampleAr: "نحتاج إلى اتخاذ قرار مدروس بحلول يوم الجمعة.",
      register: "business" as const,
      collocations: ["make a decision", "reach a decision"],
      wordFamily: {
        noun: "decision",
        verb: "decide",
        adj: "decisive",
        adv: "decisively",
      },
    };

    render(
      <I18nProvider>
        <VocabularyDetailModal item={mockItem} isOpen={true} onClose={vi.fn()} />
      </I18nProvider>
    );

    // Modal dialog is open
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByRole("heading", { name: "decision" })).toBeDefined();

    // Register badge is rendered
    expect(screen.getByText("Business")).toBeDefined();

    // Dual-language example is rendered
    expect(screen.getByText(/"We need to make an informed decision by Friday."/i)).toBeDefined();
    expect(screen.getByText(/نحتاج إلى اتخاذ قرار مدروس بحلول يوم الجمعة/i)).toBeDefined();

    // Collocations chips are rendered
    expect(screen.getByText("make a decision")).toBeDefined();
    expect(screen.getByText("reach a decision")).toBeDefined();

    // Word family components are rendered
    expect(screen.getByText("decide")).toBeDefined();
    expect(screen.getByText("decisive")).toBeDefined();
    expect(screen.getByText("decisively")).toBeDefined();
  });
});

describe("Phase 2: Arabic L1 Phonology Tips", () => {
  it("provides tailored Arabic speaker transfer tips across pronunciation catalog chapters", () => {
    const tip1 = getArabicSpeakerTip(1);
    expect(tip1).not.toBeNull();
    expect(tip1?.titleEn).toContain("/p/ vs");
    expect(tip1?.tipAr).toContain("ب");

    const tip2 = getArabicSpeakerTip(5);
    expect(tip2).not.toBeNull();
    expect(tip2?.titleEn).toContain("/v/ vs");
    expect(tip2?.tipAr).toContain("ف");

    const tip3 = getArabicSpeakerTip(9);
    expect(tip3).not.toBeNull();
    expect(tip3?.titleEn).toContain("Consonant Clusters");
    expect(tip3?.tipEn).toContain("school");

    const tip4 = getArabicSpeakerTip(17);
    expect(tip4).not.toBeNull();
    expect(tip4?.titleEn).toContain("Schwa");

    const tip5 = getArabicSpeakerTip(25);
    expect(tip5).not.toBeNull();
    expect(tip5?.titleEn).toContain("Final Consonant");

    const tip6 = getArabicSpeakerTip(33);
    expect(tip6).not.toBeNull();
    expect(tip6?.titleEn).toContain("Connected Speech");

    const tip7 = getArabicSpeakerTip(41);
    expect(tip7).not.toBeNull();
    expect(tip7?.titleEn).toContain("Word Stress");

    const tip8 = getArabicSpeakerTip(49);
    expect(tip8).not.toBeNull();
    expect(tip8?.titleEn).toContain("Sentence Rhythm");
  });

  it("handles non-existent lessons gracefully", () => {
    const tip99 = getArabicSpeakerTip(99);
    expect(tip99).toBeNull();
  });
});

describe("Phase 4: Action-Oriented CEFR Can-Do Scenarios", () => {
  it("retrieves topic-specific scenarios and falls back gracefully", () => {
    const restaurant = getCanDoScenarioForUnit("restaurant-dining");
    expect(restaurant.topic).toBe("Dining & Food");
    expect(restaurant.cefr).toBe("A2");
    expect(restaurant.keyPhrases.length).toBeGreaterThan(0);

    const hotel = getCanDoScenarioForUnit("hotel-stay");
    expect(hotel.topic).toBe("Hotel & Lodging");

    const bathroom = getCanDoScenarioForUnit("unit-bathroom-fixtures");
    expect(bathroom.topic).toBe("Home Fixtures");

    const general = getCanDoScenarioForUnit("unrecognized-topic-xyz");
    expect(general.id).toBe("general");
  });

  it("renders CanDoChallengeCard with all communicative components", () => {
    const scenario: CanDoTransferChallenge = CAN_DO_SCENARIOS.hotel;

    render(
      <I18nProvider>
        <CanDoChallengeCard challenge={scenario} />
      </I18nProvider>
    );

    // Topic and CEFR badge
    expect(screen.getByText("Hotel & Lodging")).toBeDefined();
    expect(screen.getByText("CEFR A2")).toBeDefined();

    // English & Arabic scenario context
    expect(screen.getByText(scenario.scenarioEn)).toBeDefined();
    expect(screen.getByText(scenario.scenarioAr)).toBeDefined();

    // English & Arabic task
    expect(screen.getByText(scenario.taskEn)).toBeDefined();
    expect(screen.getByText(scenario.taskAr)).toBeDefined();

    // Spoken model response
    expect(screen.getByText(`"${scenario.modelResponseEn}"`)).toBeDefined();
    expect(screen.getByText(scenario.modelResponseAr)).toBeDefined();

    // Key communicative phrases
    scenario.keyPhrases.forEach((phrase) => {
      expect(screen.getByText(phrase.en)).toBeDefined();
      expect(screen.getByText(phrase.ar)).toBeDefined();
    });
  });

  it("renders Can-Do Challenge upon completion in CurriculumQuizEngine when unitId is provided", () => {
    const mockQuestions: QuizQuestion[] = [
      {
        id: "q1",
        stem: "What do you say when there is no hot water?",
        correctValue: "opt-1",
        options: [
          {
            value: "opt-1",
            label: "There is no hot water in the shower.",
            accessibleLabel: "There is no hot water in the shower.",
          },
          {
            value: "opt-2",
            label: "I want an ice cream.",
            accessibleLabel: "I want an ice cream.",
          },
        ],
      },
    ];

    render(
      <I18nProvider>
        <CurriculumQuizEngine questions={mockQuestions} desktopPageSize={1} unitId="hotel" />
      </I18nProvider>
    );

    // Select the radio option
    const option = screen.getByRole("radio", {
      name: /There is no hot water in the shower/i,
    });
    fireEvent.click(option);

    // Click View Results
    const viewResultsBtn = screen.getByRole("button", { name: /view results/i });
    fireEvent.click(viewResultsBtn);

    // Completion screen should display the Hotel Can-Do Challenge
    expect(screen.getByText(/Hotel & Lodging/i)).toBeDefined();
    expect(screen.getByText(/CEFR A2/i)).toBeDefined();
    expect(
      screen.getByText(CAN_DO_SCENARIOS.hotel.modelResponseEn, { exact: false })
    ).toBeDefined();
  });
});
