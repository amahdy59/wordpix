import { memo, useEffect, useMemo, useState } from "react";
import type { VocabItem } from "../data/lessons";

export type ImageAltMode = "learning" | "assessment" | "decorative";

interface Props {
  word: VocabItem;
  className?: string;
  loading?: "eager" | "lazy";
  width?: number | string;
  height?: number | string;
  altMode?: ImageAltMode;
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
  
  // In assessment mode, hide text label inside fallback SVG to prevent answer leakage
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

export const WordImage = memo(function WordImage({
  word,
  className,
  loading = "lazy",
  width,
  height,
  altMode = "learning",
  optionIndex = 0,
  checked = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  const fallback = useMemo(() => getWordFallbackDataUrl(word, altMode), [word, altMode]);

  useEffect(() => setFailed(false), [word.id, word.img]);

  // Assessment-safe alt text resolution
  let altText = word.label;
  if (altMode === "decorative") {
    altText = "";
  } else if (altMode === "assessment") {
    const letter = OPTION_LABELS[optionIndex] ?? String(optionIndex + 1);
    altText = checked ? `Picture option ${letter}: ${word.label}` : `Picture option ${letter}`;
  }

  return (
    <img
      src={failed ? fallback : word.img}
      alt={altText}
      className={className}
      loading={loading}
      width={width}
      height={height}
      onError={() => setFailed(true)}
    />
  );
});
