import { memo, useEffect, useMemo, useState } from "react";
import type { VocabItem } from "../data/lessons";

export type ImageAltMode = "learning" | "assessment" | "decorative";
export type ImageSizePreset = "thumb" | "card" | "hero";

interface Props {
  word: VocabItem;
  className?: string;
  loading?: "eager" | "lazy";
  decoding?: "async" | "auto" | "sync";
  fetchPriority?: "high" | "low" | "auto";
  width?: number | string;
  height?: number | string;
  altMode?: ImageAltMode;
  sizePreset?: ImageSizePreset;
  optionIndex?: number;
  checked?: boolean;
}

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

const TOPIC_COLORS: Record<string, [string, string]> = {
  furniture: ["#ede9fe", "#5b21b6"],
  bedding: ["#dbeafe", "#1d4ed8"],
  features: ["#ccfbf1", "#0f766e"],
  objects: ["#fef3c7", "#92400e"],
  personal: ["#fce7f3", "#9d174d"],
  electronics: ["#e2e8f0", "#334155"],
};

function getResponsiveImageUrl(url: string, preset: ImageSizePreset = "card"): string {
  if (!url || !url.includes("unsplash.com")) return url;
  const targetWidth = preset === "thumb" ? 160 : preset === "hero" ? 800 : 400;
  // Replace existing w= parameter or append
  if (url.includes("w=")) {
    return url.replace(/w=\d+/, `w=${targetWidth}`);
  }
  return `${url}&w=${targetWidth}`;
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character];
  });
}

export function getWordFallbackDataUrl(word: VocabItem, altMode: ImageAltMode = "learning") {
  const [background, foreground] = TOPIC_COLORS[word.topic] ?? ["#f1f5f9", "#0f172a"];
  const label = escapeXml(word.label);
  const topic = escapeXml(word.topic.replace("-", " ").toUpperCase());
  
  const centerText = altMode === "assessment" ? "?" : label.slice(0, 1).toUpperCase();
  const bottomText = altMode === "assessment" ? "VISUAL OPTION" : label;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img">
      <rect width="800" height="600" rx="48" fill="${background}"/>
      <circle cx="400" cy="220" r="112" fill="${foreground}" opacity=".12"/>
      <text x="400" y="255" text-anchor="middle" font-family="Arial, sans-serif" font-size="112" font-weight="800" fill="${foreground}">
        ${centerText}
      </text>
      <text x="400" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="800" fill="${foreground}">
        ${bottomText}
      </text>
      <text x="400" y="465" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="5" fill="${foreground}" opacity=".7">
        ${topic}
      </text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/**
 * Alt text for a vocabulary image.
 *
 * "assessment" is the mode used by graded exercises. Two competing constraints
 * meet here:
 *
 *   1. The alt text must not contain the word, or a screen reader reads the
 *      answer aloud before the learner can attempt the question.
 *   2. It must still describe what the picture shows, or the question is
 *      unanswerable without sight — "Picture option A" is safe but useless,
 *      which is what this returned before descriptions existed.
 *
 * VocabItem.description satisfies both: it describes the object without naming
 * it, verified by lessons_content.test.ts. The label itself is revealed only
 * once the option has been chosen (`checked`), which is the teaching moment.
 */
export function getImageAltText(
  word: VocabItem,
  altMode: ImageAltMode,
  optionIndex = 0,
  checked = false
): string {
  if (altMode === "decorative") return "";
  if (altMode === "assessment") {
    const letter = OPTION_LABELS[optionIndex] ?? String(optionIndex + 1);
    if (checked) return `Picture option ${letter}: ${word.label}. ${word.description}`;
    return `Picture option ${letter}: ${word.description}`;
  }
  return word.label;
}

export const WordImage = memo(function WordImage({
  word,
  className,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  width,
  height,
  altMode = "learning",
  sizePreset = "card",
  optionIndex = 0,
  checked = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  const fallback = useMemo(() => getWordFallbackDataUrl(word, altMode), [word, altMode]);
  const optimizedUrl = useMemo(() => getResponsiveImageUrl(word.img, sizePreset), [word.img, sizePreset]);

  useEffect(() => setFailed(false), [word.id, word.img]);

  const altText = getImageAltText(word, altMode, optionIndex, checked);

  // React 18 does not type the camelCase form, and the component accepted this
  // prop while never forwarding it — every caller asking for a priority hint
  // was silently ignored.
  const priorityAttr = { fetchpriority: fetchPriority } as Record<string, string>;

  return (
    // onError is an image lifecycle event, not a user interaction; it drives
    // the SVG fallback when a remote photo fails to load.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      {...priorityAttr}
      src={failed ? fallback : optimizedUrl}
      alt={altText}
      className={className}
      loading={loading}
      decoding={decoding}
      width={width}
      height={height}
      onError={() => setFailed(true)}
    />
  );
});
