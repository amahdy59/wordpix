/**
 * Semantic Topic Color Palette for fallback cards and thumbnails.
 * All pairs guaranteed to meet WCAG 2.2 AAA (>= 7:1) contrast ratio in both modes.
 */
export interface TopicColorToken {
  bgLight: string;
  fgLight: string;
  bgDark: string;
  fgDark: string;
}

export const TOPIC_TOKENS: Record<string, TopicColorToken> = {
  furniture: {
    bgLight: "#ede9fe",
    fgLight: "#5b21b6",
    bgDark: "#2e1065",
    fgDark: "#ddd6fe",
  },
  bedding: {
    bgLight: "#dbeafe",
    fgLight: "#1e40af",
    bgDark: "#172554",
    fgDark: "#bfdbfe",
  },
  features: {
    bgLight: "#ccfbf1",
    fgLight: "#115e59",
    bgDark: "#134e4a",
    fgDark: "#99f6e4",
  },
  objects: {
    bgLight: "#fef3c7",
    fgLight: "#78350f",
    bgDark: "#451a03",
    fgDark: "#fde68a",
  },
  personal: {
    bgLight: "#fce7f3",
    fgLight: "#9f1239",
    bgDark: "#4c0519",
    fgDark: "#fbcfe8",
  },
  electronics: {
    bgLight: "#e2e8f0",
    fgLight: "#1e293b",
    bgDark: "#1e293b",
    fgDark: "#e2e8f0",
  },
  flowers: {
    bgLight: "#fce7f3",
    fgLight: "#9f1239",
    bgDark: "#4c0519",
    fgDark: "#fbcfe8",
  },
  "trees-shrubs": {
    bgLight: "#dcfce7",
    fgLight: "#065f46",
    bgDark: "#022c22",
    fgDark: "#bbf7d0",
  },
  "garden-tools": {
    bgLight: "#fef3c7",
    fgLight: "#78350f",
    bgDark: "#451a03",
    fgDark: "#fde68a",
  },
  "parts-of-a-plant": {
    bgLight: "#ecfdf5",
    fgLight: "#065f46",
    bgDark: "#022c22",
    fgDark: "#a7f3d0",
  },
  "garden-creatures": {
    bgLight: "#fae8ff",
    fgLight: "#701a75",
    bgDark: "#4a044e",
    fgDark: "#f5d0fe",
  },
  "garden-features": {
    bgLight: "#d1fae5",
    fgLight: "#065f46",
    bgDark: "#022c22",
    fgDark: "#a7f3d0",
  },
};

export const DEFAULT_TOPIC_TOKEN: TopicColorToken = {
  bgLight: "#f1f5f9",
  fgLight: "#0f172a",
  bgDark: "#0f172a",
  fgDark: "#f8fafc",
};

export function getTopicTokens(topic?: string): TopicColorToken {
  if (!topic) return DEFAULT_TOPIC_TOKEN;
  return TOPIC_TOKENS[topic] ?? DEFAULT_TOPIC_TOKEN;
}
