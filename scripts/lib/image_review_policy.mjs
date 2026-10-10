import { imageTextPolicy, allowsReviewedSymbols } from "./reference_image_text.mjs";
export const visualAuditSchema = {
  type: "object",
  properties: {
    observedDescription: { type: "string", maxLength: 220 },
    exactConceptMatch: { type: "boolean" },
    identifyingEvidence: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    peopleCount: { type: "integer", minimum: 0 },
    womenCount: { type: "integer", minimum: 0 },
    humansNecessary: { type: "boolean" },
    femaleNecessary: { type: "boolean" },
    modestWomen: { type: "boolean" },
    visibleText: { type: "string" },
    readableTextOrLogo: { type: "boolean" },
    clutterOrAmbiguity: { type: "boolean" },
    decision: { type: "string", enum: ["candidate", "hold"] },
    reason: { type: "string" },
    replacementBrief: { type: "string" },
    humanMode: {
      type: "string",
      enum: ["none", "essential-male", "essential-hands", "essential-modest-woman", "hold"],
    },
  },
  required: [
    "observedDescription",
    "exactConceptMatch",
    "identifyingEvidence",
    "confidence",
    "peopleCount",
    "womenCount",
    "humansNecessary",
    "femaleNecessary",
    "modestWomen",
    "visibleText",
    "readableTextOrLogo",
    "clutterOrAmbiguity",
    "decision",
    "reason",
    "replacementBrief",
    "humanMode",
  ],
  additionalProperties: false,
};

/** A machine audit can nominate a candidate; it cannot grant visual approval. */
export function isVisualCandidate(audit, imageSymbols) {
  return (
    !!audit &&
    !Array.isArray(audit) &&
    audit.decision === "candidate" &&
    audit.exactConceptMatch === true &&
    audit.confidence >= 0.97 &&
    typeof audit.observedDescription === "string" &&
    audit.observedDescription.trim().length >= 20 &&
    audit.readableTextOrLogo === false &&
    allowsReviewedSymbols(audit.visibleText, imageSymbols) &&
    audit.clutterOrAmbiguity === false &&
    Number.isInteger(audit.peopleCount) &&
    audit.peopleCount >= 0 &&
    Number.isInteger(audit.womenCount) &&
    audit.womenCount >= 0 &&
    audit.womenCount <= audit.peopleCount &&
    (audit.peopleCount === 0 || audit.humansNecessary === true) &&
    (audit.womenCount === 0 || (audit.femaleNecessary === true && audit.modestWomen === true))
  );
}

export function visualAuditPrompt(concept, domain, imageSymbols) {
  return `Strict visual audit for adult English vocabulary learning. First describe ONLY the actual visible content, independently of the filename. Then compare it with the required concept '${concept}' in the domain '${domain}'. A related species, material, object or role is not an exact match. Hold visually indistinguishable concepts (resin chemistry, PETG versus PLA, hidden family relationships, similar citrus or berries) unless diagnostic visible evidence exists. Never approve by filename. Prefer human-free objects and scenes. Only a role, emotion, action, relationship, age or body-part concept justifies a person. Incidental people, hands, poster faces or bystanders fail. A woman is justified only by a specifically female or mother/family concept; require hijab covering hair and neck, loose opaque full-length clothing and long sleeves. Extra people fail. ${imageTextPolicy(imageSymbols)} Report all actual visible glyphs in visibleText; readableTextOrLogo is true for forbidden text or any logo, including numeric logos. No numeric or mathematical glyph exceptions are permitted. Captions describe what is visible, never invented scenario details or unobservable facts. Nominate 'candidate' only if unmistakable at phone size, no clutter, confidence at least .97 and every rule is satisfied. Otherwise 'hold'. Also provide a precise physical replacementBrief under 650 characters: only the actual target object/action, visible diagnostic features, simple neutral arrangement, no distractor objects. humanMode must be none unless a human is indispensable; essential-male uses the minimum modest male people, essential-hands only hands where enough, essential-modest-woman only an indispensable female concept with full coverage, hold for abstract or visually unidentifiable concepts. Never turn a human role into a labelled book or nameplate. Return exactly one JSON object adhering to the supplied schema.`;
}

export function imageGenerationPrompt(item) {
  if (
    !item.visualBrief?.trim() ||
    item.visualBrief.length > 900 ||
    !["none", "essential-male", "essential-hands", "essential-modest-woman"].includes(
      item.humanMode
    )
  )
    throw new Error("A specific physical brief and reviewed human plan are required.");
  const plan = {
    none: "No people, faces, bodies, hands, silhouettes or human images anywhere.",
    "essential-male":
      "Only the minimum essential modestly dressed male subject(s) specified in the composition. No women, bystanders, poster faces or incidental people.",
    "essential-hands":
      "Only essential cropped hands specified in the composition. No faces, bodies, women or bystanders.",
    "essential-modest-woman":
      "Only the indispensable woman specified in the composition, with hijab fully covering hair and neck, loose opaque full-length clothing and long sleeves covering wrists. Include only the other person essential to this relationship. No extra women, background people, portraits or televisions.",
  }[item.humanMode];
  const surfacePolicy = "Screens, tags and book covers must be blank.";
  return `Create exactly one clear educational photograph illustrating ${item.reviewedAnswer}. Physical composition: ${item.visualBrief} Human plan: ${plan} Show the unmistakable subject at realistic scale with important details fully visible at phone size. Simple coherent arrangement and clean background, no clutter. ${imageTextPolicy(item.imageSymbols)} No answer labels, captions, brands, badges, arrows or circles. ${surfacePolicy} Natural soft lighting, landscape 4:3. Return exactly one image only.`;
}
