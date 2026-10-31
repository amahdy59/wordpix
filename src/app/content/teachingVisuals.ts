import circle from "./visuals/circle.svg?url";
import square from "./visuals/square.svg?url";
import triangle from "./visuals/triangle.svg?url";
import rectangle from "./visuals/rectangle.svg?url";
import oval from "./visuals/oval.svg?url";
import assistance from "./visuals/retail-assistance.svg?url";
import workflow from "./visuals/retail-workflow.svg?url";
import stock from "./visuals/stock-record.svg?url";

const drawings: Readonly<Record<string, string>> = {
  circle,
  square,
  triangle,
  rectangle,
  oval,
  "retail-assistance": assistance,
  "retail-workflow": workflow,
  "stock-record": stock,
};

/** Local teaching drawings are bundled by Vite; immutable R2 URLs pass through. */
export function resolveTeachingVisual(reference: string): string {
  return drawings[reference] ?? reference;
}
