import type { UnitLearningMaterials } from "../types";
import { ReferenceSection, WordFormationSection } from "../LearningMaterialsScreen";
import {
  VocabularyDetailsSection,
  PronunciationSection,
  SynonymsAntonymsSection,
} from "../ExtraSections";

interface Props {
  materials: UnitLearningMaterials;
}

export function ReferenceArea({ materials }: Props) {
  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-8 space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-6">Reference</h2>
        <p className="text-muted-foreground mb-8">Browse all words and language rules.</p>
      </div>

      <ReferenceSection materials={materials} />

      {materials.wordMeta && materials.wordMeta.length > 0 && (
        <VocabularyDetailsSection materials={materials} />
      )}

      {materials.pronunciationGuide && materials.pronunciationGuide.length > 0 && (
        <PronunciationSection materials={materials} />
      )}

      {materials.wordFormation && materials.wordFormation.length > 0 && (
        <WordFormationSection materials={materials} />
      )}

      {materials.synonymsAntonyms && materials.synonymsAntonyms.length > 0 && (
        <SynonymsAntonymsSection materials={materials} />
      )}
    </div>
  );
}
