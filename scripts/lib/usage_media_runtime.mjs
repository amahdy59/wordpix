/** Preserve the legacy spread order: later reviewed manifests win by scene ID. */
export function compileUsageMedia(manifests, unitIds) {
  const units = Object.fromEntries(unitIds.map((id) => [id, {}]));
  for (const [sceneId, media] of Object.entries(Object.assign({}, ...manifests))) {
    const unitId = sceneId.match(/^(.*)-\d+-usage-scene-\d+$/)?.[1];
    if (!unitId || !Object.hasOwn(units, unitId))
      throw Error(`Unknown usage-media ownership: ${sceneId}`);
    units[unitId][sceneId] = media;
  }
  return units;
}
