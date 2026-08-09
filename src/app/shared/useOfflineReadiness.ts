import { useEffect, useState } from "react";
import { getOfflineReadiness, type OfflineReadiness } from "../../pwa";
import { DEFAULT_UNIT_ID } from "../data/lessons";

/**
 * Live offline-readiness for a world, re-checked when the tab regains focus so
 * the badge reflects assets cached during the current session.
 */
export function useOfflineReadiness(unitId = DEFAULT_UNIT_ID): OfflineReadiness | null {
  const [readiness, setReadiness] = useState<OfflineReadiness | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = () => {
      getOfflineReadiness(unitId).then((result) => {
        if (!cancelled) setReadiness(result);
      });
    };

    check();
    window.addEventListener("focus", check);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", check);
    };
  }, [unitId]);

  return readiness;
}
