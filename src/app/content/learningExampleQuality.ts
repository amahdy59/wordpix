/** A learning example must use the target, rather than announce its inclusion. */
export function isGenericLearningExample(value: string): boolean {
  return /(?:\b(?:this\s+)?(?:word|term)\s+(?:(?:is|was)\s+)?(?:included|covered|taught|introduced|practi[cs]ed|appears?|belongs?)\b|\b(?:word|term)\b.{0,60}\b(?:this|the) lesson\b|\b(?:was|were) used during the activity\b|\bglossary uses the term\b|\bin an educational description\b|\bcan see, use, or\b|\buses or discusses\b|\beach word connected to\b|\blesson used .+ to describe\b|\bplaces .+ in one coherent situation\b|\bbelongs to a different part\b|\b(?:worker and customer|patient and medical team) deal with\b|^The word is\b)/iu.test(
    value
  );
}
