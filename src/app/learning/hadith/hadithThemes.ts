export const HADITH_THEMES = [
  { id: "foundations", start: 1, end: 6, titleKey: "hadith.themes.foundations" },
  { id: "guidance", start: 7, end: 12, titleKey: "hadith.themes.guidance" },
  { id: "character", start: 13, end: 18, titleKey: "hadith.themes.character" },
  { id: "faith", start: 19, end: 23, titleKey: "hadith.themes.faith" },
  { id: "justice", start: 24, end: 30, titleKey: "hadith.themes.justice" },
  { id: "community", start: 31, end: 36, titleKey: "hadith.themes.community" },
  { id: "growth", start: 37, end: 42, titleKey: "hadith.themes.growth" },
] as const;

export function getHadithTheme(number: number) {
  return HADITH_THEMES.find((theme) => number >= theme.start && number <= theme.end);
}
