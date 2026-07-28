import { memo, useState, useEffect, useCallback, useRef } from "react";
import type { Action } from "../types";
import { useAudio } from "../shared/useAudio";
import { BEDROOM_VOCABULARY, BEDROOM_HOTSPOT_WORDS } from "../data/lessons";
import { SceneCanvas } from "./SceneCanvas";
import { VocabSidebar } from "./VocabSidebar";

interface Props {
  dispatch: React.Dispatch<Action>;
}

export const LessonSceneDiscovery = memo(function LessonSceneDiscovery({ dispatch }: Props) {
  const [activeId, setActiveId] = useState<string>("pillow");
  const { speak, stop, isPlaying, isError } = useAudio({ lang: "en-US", rate: 0.8 });
  const mountedRef = useRef(false);

  const activeWord = BEDROOM_VOCABULARY.find((v) => v.id === activeId) ?? BEDROOM_VOCABULARY[0];

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
      const word = BEDROOM_VOCABULARY.find((v) => v.id === id);
      if (!word) return;
      if (id === activeId) {
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
      {/* Accessible live region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${activeWord.label}` : `Selected: ${activeWord.label}, ${activeWord.ar}`}
      </div>

      {/* Interactive Scene Canvas */}
      <SceneCanvas
        activeWord={activeWord}
        hotspotWords={BEDROOM_HOTSPOT_WORDS}
        activeId={activeId}
        isPlaying={isPlaying}
        isError={isError}
        onSelectWord={handleSelectWord}
        onLearnWord={handleLearnWord}
        onClose={handleClose}
      />

      {/* Desktop Vocabulary Sidebar */}
      <VocabSidebar
        vocabulary={BEDROOM_VOCABULARY}
        activeWord={activeWord}
        activeId={activeId}
        isPlaying={isPlaying}
        isError={isError}
        onSelectWord={handleSelectWord}
        onLearnWord={handleLearnWord}
      />
    </div>
  );
});
