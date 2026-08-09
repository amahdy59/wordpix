import { useEffect, useState } from "react";
import { getOfflineReadiness, type OfflineReadiness } from "../../pwa";
import { DEFAULT_WORLD_ID } from "../data/lessons";

/**
 * Live offline-readiness for a world, re-checked when the tab regains focus so
 * the badge reflects assets cached during the current session.
 */
export function useOfflineReadiness(worldId = DEFAULT_WORLD_ID): OfflineReadiness | null {
  const [readiness, setReadiness] = useState<OfflineReadiness | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = () => {
      getOfflineReadiness(worldId).then((result) => {
        if (!cancelled) setReadiness(result);
      });
    };

    check();
    window.addEventListener("focus", check);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", check);
    };
  }, [worldId]);

  return readiness;
}
