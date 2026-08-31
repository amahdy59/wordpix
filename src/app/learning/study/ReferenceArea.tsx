import type { UnitLearningMaterials } from "../types";
import { ReferenceSection, WordFormationSection } from "../LearningMaterialsScreen";
import {
  VocabularyDetailsSection,
  PronunciationSection,
  SynonymsAntonymsSection,
} from "../ExtraSections";
import { ChevronDown, LibraryBig } from "lucide-react";

interface Props {
  materials: UnitLearningMaterials;
}

export function ReferenceArea({ materials }: Props) {
  const sections = [
    {
      id: "vocabulary",
      title: "Vocabulary reference",
      description: "Words, frequency and common collocations",
      visible: Boolean(materials.wordMeta?.length),
      content: <ReferenceSection materials={materials} />,
      open: true,
    },
    {
      id: "details",
      title: "Vocabulary details",
      description: "Register, formality and visual relationships",
      visible: Boolean(materials.registerLabels?.length || materials.visualVocabularyMap?.length),
      content: <VocabularyDetailsSection materials={materials} />,
    },
    {
      id: "pronunciation",
      title: "Pronunciation guide",
      description: "Stress and IPA support",
      visible: Boolean(materials.pronunciationGuide?.length),
      content: <PronunciationSection materials={materials} />,
    },
    {
      id: "formation",
      title: "Word formation",
      description: "Related forms and word families",
      visible: Boolean(materials.wordFormation?.length),
      content: <WordFormationSection materials={materials} />,
    },
    {
      id: "synonyms",
      title: "Synonyms and antonyms",
      description: "Compare closely related meanings",
      visible: Boolean(materials.synonymsAntonyms?.length),
      content: <SynonymsAntonymsSection materials={materials} />,
    },
  ].filter((section) => section.visible);

  return (
    <div className="mx-auto w-full max-w-5xl p-4 pb-16 md:p-8 md:pb-20">
      <div className="mb-8 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm md:p-7">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <LibraryBig aria-hidden size={24} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              Language toolkit
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">Reference</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Browse the details you need without losing your place. Expand one section at a time,
              or keep several open while comparing language patterns.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <details
            key={section.id}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            open={section.open}
          >
            <summary className="min-h-[64px] cursor-pointer list-none px-4 py-3 hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring md:px-5 [&::-webkit-details-marker]:hidden">
              <h3 className="flex items-center gap-4">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{section.title}</span>
                  <span className="mt-0.5 block text-sm font-normal text-muted-foreground">
                    {section.description}
                  </span>
                </span>
                <ChevronDown
                  aria-hidden
                  className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  size={20}
                />
              </h3>
            </summary>
            <div className="border-t border-border bg-background/40 p-3 md:p-5 [&>section]:rounded-none [&>section]:border-0 [&>section]:bg-transparent [&>section]:p-0 [&>section]:shadow-none">
              {section.content}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
