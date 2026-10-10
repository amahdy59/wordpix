/** Historical glyph exceptions cannot authorize new jobs under the current policy. */
export function imageTextPolicy(symbols, labels) {
  if (symbols !== undefined)
    throw new Error("Readable image symbols are prohibited; revise or hold the image brief.");
  if (labels !== undefined) {
    if (
      !Array.isArray(labels) ||
      !labels.length ||
      labels.length > 5 ||
      new Set(labels).size !== labels.length ||
      labels.some(
        (label) =>
          typeof label !== "string" || !label.trim() || label !== label.trim() || label.length > 80
      )
    )
      throw new Error("Explicit, unique reviewed image labels are required.");
    return `Use ONLY these exact readable labels: ${labels.map((label) => JSON.stringify(label)).join(", ")}. No other text, numbers, branding, logos or watermarks. Keep labels large, high contrast, correctly spelled and clear at phone size.`;
  }
  return "No readable text, numbers, mathematical glyphs, labels, logos or watermarks.";
}
export function allowsReviewedSymbols(visibleText, symbols) {
  return symbols === undefined && visibleText === "";
}
