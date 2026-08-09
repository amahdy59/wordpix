import { memo, useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { Action } from "../types";
import { useAudio } from "../shared/useAudio";
import { resolveGroup, resolveWorldForGroup, type VocabItem } from "../data/lessons";
import { SceneCanvas } from "./SceneCanvas";
import { VocabSidebar } from "./VocabSidebar";

interface Props {
  /** The lesson's word queue — the words this session actually teaches. */
  words: VocabItem[];
  groupId: string;
  dispatch: React.Dispatch<Action>;
}

export const LessonSceneDiscovery = memo(function LessonSceneDiscovery({ words, groupId, dispatch }: Props) {
  const [activeId, setActiveId] = useState<string>(words[0].id);
  const [isMobileBrowseOpen, setIsMobileBrowseOpen] = useState(false);
  const { speak, stop, isPlaying, isError } = useAudio({ lang: "en-US", rate: 0.8 });
  const mountedRef = useRef(false);

  const group = useMemo(
    () => resolveGroup(groupId, words.map((w) => w.id)),
    [groupId, words]
  );
  const topics = useMemo(() => resolveWorldForGroup(groupId).topics, [groupId]);
  const activeWord = words.find((v) => v.id === activeId) ?? words[0];

  // Only this group's words can be pinned on the room photo. Passing the whole
  // vocabulary's hotspots put pins for words the lesson does not teach.
  const hotspotWords = useMemo(() => words.filter((w) => w.hotspot), [words]);

  // Auto-speak the first word on mount
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      const t = setTimeout(() => speak(words[0].label), 900);
      return () => clearTimeout(t);
    }
    return undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup audio on unmount
  useEffect(() => () => stop(), [stop]);

  const handleSelectWord = useCallback(
    (id: string) => {
      const word = words.find((v) => v.id === id);
      if (!word) return;
      if (id === activeId) {
        if (isPlaying) stop();
        else speak(word.label);
      } else {
        stop();
        setActiveId(id);
        // Moves the chosen word to the front of the lesson's queue so the
        // drills that follow start with whatever the learner was looking at.
        dispatch({ type: "LESSON_SELECT_WORD", wordId: id });
        setTimeout(() => speak(word.label), 160);
      }
    },
    [activeId, isPlaying, speak, stop, words, dispatch]
  );

  /**
   * Moves on to the first drill.
   *
   * This used to dispatch START_LESSON with a queue it built itself —
   * `[activeId, ...BEDROOM_VOCABULARY.slice(0, 4)]` — and no group id. Because
   * the master vocabulary list begins with bed, nightstand, dresser and
   * wardrobe, every lesson in the app was silently rewritten to those four
   * words, whichever group the learner had chosen. The session is already
   * running with the right queue by the time this screen renders; all it has to
   * do is advance.
   */
  const handleLearnWord = useCallback(() => {
    stop();
    dispatch({ type: "LESSON_NEXT" });
  }, [stop, dispatch]);

  const handleClose = useCallback(() => {
    stop();
    dispatch({ type: "GO", to: "lesson-entry" });
  }, [stop, dispatch]);

  return (
    <div className="fixed inset-0 z-40 bg-background flex flex-col md:flex-row overflow-hidden overscroll-none">
      {/* Accessible live region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${activeWord.label}` : `Selected: ${activeWord.label}`}
      </div>

      {/* Interactive Scene Canvas */}
      <SceneCanvas
        activeWord={activeWord}
        hotspotWords={hotspotWords}
        groupName={group.name}
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
        vocabulary={words}
        groupName={group.name}
        topics={topics}
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
