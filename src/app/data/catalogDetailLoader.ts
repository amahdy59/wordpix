import { z } from "zod";
import { catalogDetailLoaders } from "./catalogDetailRegistry";
const schema = z.record(z.string(), z.string());

/** Only lesson descriptions are split; content IDs and media references stay canonical. */
export async function loadGroupDescriptions(unitId: string): Promise<Record<string, string>> {
  const loader = catalogDetailLoaders[unitId];
  if (!loader) throw new Error("Unknown curriculum unit");
  return schema.parse(await loader());
}
