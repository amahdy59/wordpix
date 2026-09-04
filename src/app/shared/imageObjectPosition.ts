import type { VocabularyItem } from "../data/lessons";

// Coordinates belong to each photograph, not a reused word id across different units.
const SUBJECT_FOCAL_POINTS: Record<string, { x: number; y: number }> = {
  "/word-images/construction-site/crane.avif": { x: 60, y: 20 },
  "/word-images/bedroom/bed.avif": { x: 50, y: 65 },
  "/word-images/bedroom/mirror.avif": { x: 50, y: 50 },
  "/word-images/bedroom/nightstand.avif": { x: 50, y: 65 },
  "/word-images/bathroom/bathtub.avif": { x: 50, y: 65 },
  "/word-images/bathroom/soap.avif": { x: 50, y: 70 },
  "/word-images/bathroom/toilet-paper.avif": { x: 50, y: 55 },
  "/word-images/bathroom/bath-mat.avif": { x: 50, y: 65 },
};
export function imageObjectPosition(word: VocabularyItem): string {
  const focal = word.imageFocalPoint ?? SUBJECT_FOCAL_POINTS[word.img] ?? { x: 50, y: 50 };
  return `${Math.max(0, Math.min(100, focal.x))}% ${Math.max(0, Math.min(100, focal.y))}%`;
}
