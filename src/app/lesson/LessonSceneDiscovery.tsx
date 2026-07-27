import { memo, useState, useEffect, useCallback, useRef } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { CloseButton } from "../shared/CloseButton";
import { AudioButton } from "../shared/AudioButton";
import { useAudio } from "../shared/useAudio";
import { BookOpen, Volume2 } from "lucide-react";

import imgScene from "@/imports/FlowLessonExercises/5a1564d371eaf16d42bd6410fe9570da379f3ec4.png";

interface Props {
  dispatch: React.Dispatch<Action>;
}

interface VocabWord {
  id: string;
  label: string;
  ar: string;
  phonetic: string;
  img: string;
  hotspot?: { x: string; y: string };
}

// Full bedroom lesson vocabulary — 7 words
const VOCABULARY: VocabWord[] = [
  {
    id: "pillow",
    label: "Pillow",
    ar: "وسادة",
    phonetic: "wi-sa-dah",
    img: "https://images.unsplash.com/photo-1623944436679-5412c658a358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    hotspot: { x: "44%", y: "66%" },
  },
  {
    id: "bed",
    label: "Bed",
    ar: "سرير",
    phonetic: "sa-reer",
    img: "https://images.unsplash.com/photo-1613940512699-fc9150817bb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    hotspot: { x: "28%", y: "58%" },
  },
  {
    id: "wardrobe",
    label: "Wardrobe",
    ar: "خزانة",
    phonetic: "khi-za-na",
    img: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    hotspot: { x: "72%", y: "36%" },
  },
  {
    id: "lamp",
    label: "Lamp",
    ar: "مصباح",
    phonetic: "mis-baah",
    img: "https://images.unsplash.com/photo-1776476269609-c41ae855bb8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    hotspot: { x: "72%", y: "62%" },
  },
  {
    id: "curtain",
    label: "Curtain",
    ar: "ستارة",
    phonetic: "si-ta-rah",
    img: "https://images.unsplash.com/photo-1528822855841-e8bf3134cdc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "blanket",
    label: "Blanket",
    ar: "بطانية",
    phonetic: "ba-ta-ni-yah",
    img: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "rug",
    label: "Rug",
    ar: "سجادة",
    phonetic: "saj-ja-dah",
    img: "https://images.unsplash.com/photo-1652634213812-f0deeb1de78e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
];

const HOTSPOT_WORDS = VOCABULARY.filter((v) => v.hotspot);

export const LessonSceneDiscovery = memo(function LessonSceneDiscovery({ dispatch }: Props) {
  const [activeId, setActiveId] = useState<string>("pillow");
  const { speak, stop, isPlaying, isError } = useAudio({ lang: "en-US", rate: 0.8 });
  const mountedRef = useRef(false);

  const activeWord = VOCABULARY.find((v) => v.id === activeId) ?? VOCABULARY[0];

  // Auto-speak initial word on mount
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      const t = setTimeout(() => speak("Pillow"), 900);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup audio on unmount
  useEffect(() => () => stop(), [stop]);

  const handleSelectWord = useCallback(
    (id: string) => {
      const word = VOCABULARY.find((v) => v.id === id);
      if (!word) return;
      if (id === activeId) {
        // Toggle audio for the already-active word
        if (isPlaying) stop();
        else speak(word.label);
      } else {
        stop();
        setActiveId(id);
        setTimeout(() => speak(word.label), 160);
      }
    },
    [activeId, isPlaying, speak, stop]
  );

  const handleLearnWord = useCallback(() => {
    stop();
    dispatch({ type: "LESSON_NEXT" });
  }, [stop, dispatch]);

  const handleClose = useCallback(() => {
    stop();
    dispatch({ type: "GO", to: "lesson-entry" });
  }, [stop, dispatch]);

  return (
    <div className="bg-background flex flex-col md:flex-row min-h-svh">
      {/* ── Live region ─────────────────────────────────────────────── */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${activeWord.label}` : `Selected: ${activeWord.label}, ${activeWord.ar}`}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          LEFT / SCENE COLUMN
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative flex-1 md:flex-[3] flex flex-col" style={{ minHeight: "55vmin" }}>
        {/* Status bar — mobile only */}
        <div className="md:hidden shrink-0">
          <StatusBar />
        </div>

        {/* Desktop header bar */}
        <div className="hidden md:flex items-center gap-3 px-5 py-4 bg-wp-card border-b border-border shrink-0">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center" aria-hidden>
            <BookOpen className="size-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-foreground text-base leading-none">Bedroom Lesson</h1>
            <p className="font-sans text-muted-foreground text-xs mt-0.5">Tap objects in the scene to explore</p>
          </div>
        </div>

        {/* Scene image — fills remaining space */}
        <div className="relative flex-1 overflow-hidden" style={{ minHeight: "240px" }}>
          <img
            alt="Interactive bedroom scene. Select highlighted spots to learn vocabulary words."
            className="absolute inset-0 object-cover size-full"
            src={imgScene}
          />

          {/* Hotspot overlays — only words that appear in the scene */}
          <div role="group" aria-label="Scene vocabulary hotspots">
            {HOTSPOT_WORDS.map((word) => {
              const isActive = word.id === activeId;
              return (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => handleSelectWord(word.id)}
                  aria-pressed={isActive}
                  aria-label={
                    isActive
                      ? `Currently selected: ${word.label} — ${word.ar}`
                      : `Explore: ${word.label} — ${word.ar}`
                  }
                  className={[
                    "absolute transform -translate-x-1/2 -translate-y-1/2",
                    "min-h-[44px] min-w-[44px] flex items-center justify-center",
                    "rounded-full focus-visible:outline focus-visible:outline-[3px]",
                    "focus-visible:outline-white focus-visible:outline-offset-2",
                    "motion-safe:transition-all",
                  ].join(" ")}
                  style={{ left: word.hotspot!.x, top: word.hotspot!.y }}
                >
                  {isActive ? (
                    <div className="bg-wp-amber/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-wp-sm">
                      <Volume2 className="size-3 text-foreground shrink-0" aria-hidden />
                      <span className="font-sans font-semibold text-foreground text-xs whitespace-nowrap">
                        {word.label}
                      </span>
                    </div>
                  ) : (
                    <div className="size-7 bg-wp-card/90 backdrop-blur-sm rounded-full border-2 border-primary shadow-wp-xs flex items-center justify-center motion-safe:animate-pulse">
                      <div className="size-2 bg-primary rounded-full" aria-hidden />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Close button — always top-right of scene, never overlapping content */}
          <div className="absolute top-3 right-3 z-20">
            <CloseButton onClick={handleClose} aria-label="Close lesson and return to lesson overview" />
          </div>
        </div>

        {/* Mobile bottom card */}
        <div className="md:hidden bg-wp-card rounded-t-[28px] px-5 pt-5 pb-2 flex flex-col gap-4 shadow-wp-md shrink-0">
          <div className="flex items-start gap-3">
            <img
              src={activeWord.img}
              alt={`${activeWord.label} — ${activeWord.ar}`}
              className="size-16 rounded-xl object-cover shrink-0 border border-border"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-black text-foreground text-2xl leading-none truncate">
                  {activeWord.label}
                </h2>
                <AudioButton
                  onPlay={() => handleSelectWord(activeId)}
                  isPlaying={isPlaying}
                  isError={isError}
                  label={`Listen to ${activeWord.label}`}
                  size="sm"
                />
              </div>
              <p
                className="font-arabic font-bold text-primary text-lg mt-1"
                dir="auto"
                lang="ar"
              >
                {activeWord.ar}
              </p>
              <p className="font-sans text-muted-foreground text-sm">
                {activeWord.phonetic}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLearnWord}
            className="w-full bg-wp-blue rounded-xl py-4 font-sans font-bold text-white text-base min-h-[52px]
              focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
              motion-safe:transition-opacity hover:opacity-90 active:opacity-80"
          >
            Learn Word →
          </button>
        </div>

        <div className="md:hidden shrink-0">
          <HomeIndicator />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT / VOCABULARY PANEL — desktop only
      ══════════════════════════════════════════════════════════════ */}
      <aside
        className="hidden md:flex flex-col w-80 lg:w-96 xl:w-[420px] bg-wp-card border-l border-border"
        aria-label="Bedroom vocabulary list"
      >
        {/* Panel header */}
        <div className="px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-sans font-bold text-foreground text-base">Bedroom Vocabulary</h2>
              <p className="font-sans text-muted-foreground text-xs mt-0.5">
                {VOCABULARY.length} words · Select to hear pronunciation
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {VOCABULARY.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === VOCABULARY.indexOf(activeWord)
                      ? "w-4 bg-primary"
                      : "w-1.5 bg-border"
                  }`}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable word list */}
        <div
          className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-1.5"
          role="list"
          aria-label="Vocabulary words"
        >
          {VOCABULARY.map((word) => {
            const isActive = word.id === activeId;
            const isAudioPlaying = isPlaying && isActive;
            return (
              <div
                key={word.id}
                role="listitem"
                className={[
                  "rounded-xl border p-3 flex items-center gap-3 cursor-pointer",
                  "motion-safe:transition-all group",
                  isActive
                    ? "bg-secondary border-primary border-[2px]"
                    : "bg-background border-border hover:border-primary/40 hover:bg-secondary/40",
                ].join(" ")}
                onClick={() => handleSelectWord(word.id)}
              >
                {/* Thumbnail */}
                <div className="size-[56px] rounded-lg overflow-hidden shrink-0 border border-border">
                  <img
                    src={word.img}
                    alt={word.label}
                    className="size-full object-cover"
                  />
                </div>

                {/* Word info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`font-sans font-bold text-base truncate ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {word.label}
                    </span>
                    {word.hotspot && (
                      <span
                        className="text-[10px] font-sans font-semibold text-wp-green bg-wp-green-light rounded-full px-1.5 py-0.5 shrink-0"
                        aria-label="Visible in scene"
                      >
                        in scene
                      </span>
                    )}
                  </div>
                  <p
                    className="font-arabic font-semibold text-primary text-sm leading-none"
                    dir="auto"
                    lang="ar"
                  >
                    {word.ar}
                  </p>
                  <p className="font-sans text-muted-foreground text-xs mt-0.5">
                    {word.phonetic}
                  </p>
                </div>

                {/* Per-word audio button — stop propagation so row onClick doesn't double-fire */}
                <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                  <AudioButton
                    onPlay={() => handleSelectWord(word.id)}
                    isPlaying={isAudioPlaying}
                    isError={isError}
                    label={`Play pronunciation of ${word.label}`}
                    size="sm"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Active word detail card + CTA */}
        <div className="shrink-0 border-t border-border p-4 bg-secondary/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-xl overflow-hidden border border-border shrink-0">
              <img
                src={activeWord.img}
                alt={activeWord.label}
                className="size-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-black text-foreground text-xl leading-none">{activeWord.label}</p>
              <p className="font-arabic font-bold text-primary text-base mt-0.5" dir="auto" lang="ar">
                {activeWord.ar}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLearnWord}
            className="w-full bg-wp-blue rounded-xl py-3.5 font-sans font-bold text-white text-base min-h-[52px]
              focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-wp-blue
              motion-safe:transition-opacity hover:opacity-90 active:opacity-80"
          >
            Learn &ldquo;{activeWord.label}&rdquo; →
          </button>
        </div>
      </aside>
    </div>
  );
});
