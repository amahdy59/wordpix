/** Short labels share space; sentences keep a comfortable reading measure.
 * rem-based tracks also reflow when the learner enlarges text.
 */
export function answerLayout(labels: readonly string[]): string {
  return labels.every((label) => label.length <= 18)
    ? "wp-answer-grid"
    : "wp-answer-grid wp-answer-grid-long";
}
