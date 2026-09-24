import { conversationUnitSchema, type ConversationUnit, type CefrLevel } from "./conversationTypes";
import rawCatalog from "./conversationCatalog.json";

export const CONVERSATION_UNITS: readonly ConversationUnit[] = conversationUnitSchema
  .array()
  .parse(rawCatalog);

const unitsById = new Map<string, ConversationUnit>(
  CONVERSATION_UNITS.map((unit) => [unit.id, unit])
);

export function getConversationUnit(id: string): ConversationUnit | undefined {
  return unitsById.get(id);
}

export function getUnitsByCefr(level: CefrLevel): ConversationUnit[] {
  return CONVERSATION_UNITS.filter((unit) => unit.level === level);
}

export function getAdjacentUnits(id: string): {
  prev?: ConversationUnit;
  next?: ConversationUnit;
} {
  const index = CONVERSATION_UNITS.findIndex((u) => u.id === id);
  if (index === -1) return {};
  return {
    prev: index > 0 ? CONVERSATION_UNITS[index - 1] : undefined,
    next: index < CONVERSATION_UNITS.length - 1 ? CONVERSATION_UNITS[index + 1] : undefined,
  };
}
