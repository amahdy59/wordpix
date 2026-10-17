import type { UnitLearningMaterials } from "../types";
import { ReferenceSection, WordFormationSection } from "../LearningMaterialsScreen";
import {
  VocabularyDetailsSection,
  PronunciationSection,
  SynonymsAntonymsSection,
} from "../ExtraSections";
import { LibraryBig } from "lucide-react";
import { useI18n } from "../../../i18n";

interface Props {
  materials: UnitLearningMaterials;
}

export function ReferenceArea({ materials }: Props) {
  const { t } = useI18n();
  const sections = [
    {
      id: "vocabulary",
      title: t("study.vocabRefSection"),
      description: t("study.vocabRefSectionDesc"),
      visible: Boolean(materials.wordMeta?.length),
      content: <ReferenceSection materials={materials} />,
      open: true,
    },
    {
      id: "details",
      title: t("study.vocabDetailsSection"),
      description: t("study.vocabDetailsSectionDesc"),
      visible: Boolean(materials.registerLabels?.length || materials.visualVocabularyMap?.length),
      content: <VocabularyDetailsSection materials={materials} />,
    },
    {
      id: "pronunciation",
      title: t("study.pronunciationSection"),
      description: t("study.pronunciationSectionDesc"),
      visible: Boolean(materials.pronunciationGuide?.length),
      content: <PronunciationSection materials={materials} />,
    },
    {
      id: "formation",
      title: t("study.formationSection"),
      description: t("study.formationSectionDesc"),
      visible: Boolean(materials.wordFormation?.length),
      content: <WordFormationSection materials={materials} />,
    },
    {
      id: "synonyms",
      title: t("study.synonymsSection"),
      description: t("study.synonymsSectionDesc"),
      visible: Boolean(materials.synonymsAntonyms?.length),
      content: <SynonymsAntonymsSection materials={materials} />,
    },
  ].filter((section) => section.visible);

  return (
    <div className="wp-container-content wp-layout-gutter py-4 pb-16 md:py-8 md:pb-20">
      <div className="mb-8 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm md:p-7">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <LibraryBig aria-hidden size={24} />
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
              {t("study.languageToolkit")}
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">
              {t("study.referenceTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-6 text-muted-foreground md:text-base">
              {t("study.referenceDesc")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={`ref-section-${section.id}`}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-4 sm:p-6"
          >
            <h3 id={`ref-section-${section.id}`} className="font-bold text-lg text-foreground mb-4">
              {section.title}
            </h3>
            <div>{section.content}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
