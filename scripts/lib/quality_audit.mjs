/** Both dimensions must meet the project's 44 CSS pixel minimum. */
export const isUndersizedTarget = ({ width, height }) => width < 44 || height < 44;

/** Derive every statement from raw observations; never embed illustrative timings. */
export function summarizeMeasurements(observations) {
  const groups = new Map();
  for (const row of observations) {
    if (!Number.isFinite(row.readyMs) || row.readyMs <= 0)
      throw Error("A successful measurement requires a positive observed duration");
    const key = JSON.stringify([row.targetId, row.profile, row.visit]);
    const values = groups.get(key) ?? [];
    values.push(row.readyMs);
    groups.set(key, values);
  }
  return [...groups].map(([key, values]) => {
    const [targetId, profile, visit] = JSON.parse(key);
    values.sort((a, b) => a - b);
    const middle = Math.floor(values.length / 2);
    return {
      targetId,
      profile,
      visit,
      count: values.length,
      median: values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2,
      min: values[0],
      max: values.at(-1),
    };
  });
}
