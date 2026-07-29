import { memo, useEffect, useMemo, useState } from "react";
import type { VocabItem } from "../data/lessons";

interface Props {
  word: VocabItem;
  className?: string;
  loading?: "eager" | "lazy";
  width?: number | string;
  height?: number | string;
}

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

export function getWordFallbackDataUrl(word: VocabItem) {
  const [background, foreground] = TOPIC_COLORS[word.topic] ?? ["#f1f5f9", "#0f172a"];
  const label = escapeXml(word.label);
  const topic = escapeXml(word.topic.replace("-", " ").toUpperCase());
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${label}">
      <rect width="800" height="600" rx="48" fill="${background}"/>
      <circle cx="400" cy="220" r="112" fill="${foreground}" opacity=".12"/>
      <text x="400" y="255" text-anchor="middle" font-family="Arial, sans-serif" font-size="112" font-weight="800" fill="${foreground}">
        ${label.slice(0, 1).toUpperCase()}
      </text>
      <text x="400" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="800" fill="${foreground}">
        ${label}
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
}: Props) {
  const [failed, setFailed] = useState(false);
  const fallback = useMemo(() => getWordFallbackDataUrl(word), [word]);

  useEffect(() => setFailed(false), [word.id, word.img]);

  return (
    <img
      src={failed ? fallback : word.img}
      alt={word.label}
      className={className}
      loading={loading}
      width={width}
      height={height}
      onError={() => setFailed(true)}
    />
  );
});
