import { useEffect, useRef, useState } from "react";
import { COURSE_UNITS, LEARNING_PATH_UNIT_IDS } from "../data/courseCatalog";
import { loadUnitVocabulary } from "../data/vocabulary";
import { loadLexicon } from "../data/lexiconLoader";
import { loadLessonStory } from "../data/lessonStoryLoader";
import { useI18n } from "../context/I18nContext";
import { getOfflineReadiness } from "../../pwa";
import { OfflineImagePack } from "./OfflineImagePack";
import { IMAGE_PACKS_CHANGED } from "../media/offlineImagePacks";

import estimates from "../generated/offlineTextEstimates.json";

type Download = { status: "idle" | "loading" | "ready" | "error" | "cancelled"; progress: number };
const control =
  "min-h-11 min-w-11 rounded-xl border border-border px-4 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
export function OfflineUnitDownload() {
  const { t } = useI18n();
  const [unitId, setUnitId] = useState<string>(LEARNING_PATH_UNIT_IDS[0]);
  const [state, setState] = useState<Download>({ status: "idle", progress: 0 });
  const [storage, setStorage] = useState<number | null>(null);
  const [images, setImages] = useState<{ unitId: string; cached: number; total: number } | null>(
    null
  );
  const currentImages = images?.unitId === unitId ? images : null;
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current += 1;
    },
    []
  );
  useEffect(() => {
    let active = true;
    const refresh = () => {
      void getOfflineReadiness(unitId)
        .then((result) => {
          if (active) setImages({ unitId, ...result });
        })
        .catch(() => {
          if (active) setImages(null);
        });
      void navigator.storage
        ?.estimate?.()
        .then((result) => {
          if (active && result.quota !== undefined && result.usage !== undefined)
            setStorage(Math.max(0, result.quota - result.usage));
        })
        .catch(() => undefined);
    };
    refresh();
    window.addEventListener(IMAGE_PACKS_CHANGED, refresh);
    return () => {
      active = false;
      window.removeEventListener(IMAGE_PACKS_CHANGED, refresh);
    };
  }, [unitId, state.status]);
  const download = async () => {
    const run = ++generation.current;
    setState({ status: "loading", progress: 0 });
    try {
      if (!("caches" in window) || !navigator.serviceWorker?.controller)
        throw new Error("Offline caching is unavailable");
      const unit = COURSE_UNITS[unitId];
      const tasks = [
        () => loadUnitVocabulary(unitId),
        () =>
          Promise.all([
            import("../lesson/LessonWorldEntry"),
            import("../lesson/LearnWordsScreen"),
            import("../exercises/ExerciseStory"),
          ]),
        () => loadLexicon(unit.wordIds),
        ...unit.groups.map((group) => () => loadLessonStory(group.id)),
      ];
      for (let index = 0; index < tasks.length; index++) {
        if (generation.current !== run) return;
        await tasks[index]();
        if (generation.current !== run) return;
        setState({
          status: "loading",
          progress: Math.round(((index + 1) / (tasks.length + 1)) * 100),
        });
      }
      // Pin already requested app modules using their unchanged URLs. No media
      // is fetched, rewritten or presented as included in this text download.
      const cache = await caches.open("wordpix-downloads-v1");
      const requestedUrls = performance.getEntriesByType("resource").map((entry) => entry.name);
      const storedUrls = (
        await Promise.all(
          (await caches.keys())
            .filter((name) =>
              ["wordpix-cache-v2", "wordpix-runtime-v1", "wordpix-downloads-v1"].includes(name)
            )
            .map(async (name) =>
              (await (await caches.open(name)).keys()).map((request) => request.url)
            )
        )
      ).flat();
      const urls = [
        ...new Set(
          [...requestedUrls, ...storedUrls].filter((name) => {
            const url = new URL(name);
            return (
              url.origin === location.origin && /\/assets\/.*\.(js|css|woff2?)$/.test(url.pathname)
            );
          })
        ),
      ];
      for (const url of urls) {
        if (generation.current !== run) return;
        const response = (await caches.match(url)) ?? (await fetch(url));
        if (!response.ok) throw new Error("Text download incomplete");
        await cache.put(url, response.clone());
      }
      if (generation.current === run) setState({ status: "ready", progress: 100 });
    } catch {
      if (generation.current === run) setState({ status: "error", progress: 0 });
    }
  };
  return (
    <div
      className="space-y-4 rounded-2xl border border-border bg-card p-5"
      aria-busy={state.status === "loading"}
    >
      <label htmlFor="offline-unit" className="block text-base font-semibold">
        {t("reviewUpdate.offlineTitle")}
      </label>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {t("reviewUpdate.offlineDescription")}
      </p>
      <select
        id="offline-unit"
        value={unitId}
        disabled={state.status === "loading"}
        onChange={(event) => {
          setUnitId(event.target.value);
          setState({ status: "idle", progress: 0 });
        }}
        className={`${control} w-full bg-card`}
      >
        {LEARNING_PATH_UNIT_IDS.map((id) => (
          <option key={id} value={id}>
            {COURSE_UNITS[id].name}
          </option>
        ))}
      </select>
      <p className="text-sm text-muted-foreground">
        {t("reviewUpdate.offlineEstimate", {
          amount: Math.ceil(((estimates as Record<string, number>)[unitId] ?? 3000000) / 1048576),
        })}
        {storage !== null && (
          <> {t("reviewUpdate.storageAvailable", { amount: Math.floor(storage / 1048576) })}</>
        )}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={state.status === "loading"}
          className={`min-h-11 ${control} bg-primary text-primary-foreground disabled:opacity-60`}
          onClick={() => void download()}
        >
          {t(state.status === "error" ? "action.retry" : "reviewUpdate.downloadText")}
        </button>
        {state.status === "loading" && (
          <button
            type="button"
            className={control}
            onClick={() => {
              generation.current += 1;
              setState({ status: "cancelled", progress: 0 });
            }}
          >
            {t("action.cancel")}
          </button>
        )}
      </div>
      <p role="status" className="text-sm text-foreground">
        {t(`reviewUpdate.offline_${state.status}`, { progress: state.progress })}
      </p>
      <ul className="space-y-1 text-sm text-muted-foreground">
        <li>
          {t("reviewUpdate.offlineText", {
            state: t(
              state.status === "ready" ? "reviewUpdate.prepared" : "reviewUpdate.notConfirmed"
            ),
          })}
        </li>
        <li>
          {t("reviewUpdate.offlineImages", {
            cached: currentImages?.cached ?? 0,
            total: currentImages?.total ?? COURSE_UNITS[unitId].wordIds.length,
          })}
        </li>
        <li>{t("reviewUpdate.offlineAudio")}</li>
      </ul>
      <OfflineImagePack key={unitId} unitId={unitId} />
    </div>
  );
}
