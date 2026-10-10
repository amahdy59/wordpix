/** Historical glyph exceptions cannot authorize new jobs under the current policy. */
export function imageTextPolicy(symbols) {
  if (symbols !== undefined)
    throw new Error("Readable image symbols are prohibited; revise or hold the image brief.");
  return "No readable text, numbers, mathematical glyphs, labels, logos or watermarks.";
}
export function allowsReviewedSymbols(visibleText, symbols) {
  return symbols === undefined && visibleText === "";
}
