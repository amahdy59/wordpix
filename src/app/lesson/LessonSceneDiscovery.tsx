import { memo, useState, useEffect, useCallback, useRef } from "react";
import type { Action } from "../types";
import { useAudio } from "../shared/useAudio";
import { BEDROOM_VOCABULARY, BEDROOM_HOTSPOT_WORDS } from "../data/lessons";
import { SceneCanvas } from "./SceneCanvas";
import { VocabSidebar } from "./VocabSidebar";

interface Props {
  selectedWordId: string;
  dispatch: React.Dispatch<Action>;
}

export const LessonSceneDiscovery = memo(function LessonSceneDiscovery({ selectedWordId, dispatch }: Props) {
  const [activeId, setActiveId] = useState<string>(selectedWordId);
  const [isMobileBrowseOpen, setIsMobileBrowseOpen] = useState(false);
  const { speak, stop, isPlaying, isError } = useAudio({ lang: "en-US", rate: 0.8 });
  const mountedRef = useRef(false);

  const activeWord = BEDROOM_VOCABULARY.find((v) => v.id === activeId) ?? BEDROOM_VOCABULARY[0];

  // Auto-speak initial word on mount
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      const initialWord = BEDROOM_VOCABULARY.find((word) => word.id === selectedWordId);
      const t = setTimeout(() => speak(initialWord?.label ?? "Pillow"), 900);
      return () => clearTimeout(t);
    }
    return undefined;
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
    dispatch({ type: "LESSON_SELECT_WORD", wordId: activeId });
    dispatch({ type: "LESSON_NEXT" });
  }, [stop, dispatch, activeId]);

  const handleClose = useCallback(() => {
    stop();
    dispatch({ type: "GO", to: "lesson-entry" });
  }, [stop, dispatch]);

  return (
    <div className="bg-background flex flex-col md:flex-row h-svh md:overflow-hidden">
      {/* Accessible live region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${activeWord.label}` : `Selected: ${activeWord.label}`}
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
        onBrowseWords={() => setIsMobileBrowseOpen(true)}
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
        mobileOpen={isMobileBrowseOpen}
        onMobileClose={() => setIsMobileBrowseOpen(false)}
      />
    </div>
  );
});
