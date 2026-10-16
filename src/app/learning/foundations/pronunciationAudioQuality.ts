/** Quality metadata only. Never changes the content-to-media mapping. */
const reportedIssues: ReadonlySet<string> = new Set([]);

export function hasReportedPronunciationAudioIssue(label: string): boolean {
  return reportedIssues.has(label.trim().toLocaleLowerCase("en-US"));
}
