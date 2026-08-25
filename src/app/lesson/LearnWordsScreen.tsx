import { memo, useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { Action } from "../types";
import { useAudio } from "../shared/useAudio";
import { resolveGroup, resolveUnitForLesson } from "../data/lessons";
import { getWords } from "../data/vocabulary";
import { SceneCanvas } from "./SceneCanvas";
import { VocabSidebar } from "./VocabSidebar";

interface Props {
  lessonId: string;
  dispatch: React.Dispatch<Action>;
}

/**
 * Self-paced word browsing for a group — tap a word, hear it, read its
 * picture, move on whenever. No session, no attempts, no score: this is
 * deliberately outside the scored lesson state machine, which is what Game
 * Mode (the five auto-advancing drills) is for. A learner can enter this
 * screen, or Game Mode, independently from group selection.
 */
export const LearnWordsScreen = memo(function LearnWordsScreen({ lessonId, dispatch }: Props) {
  const group = useMemo(() => resolveGroup(lessonId), [lessonId]);
  const unitId = useMemo(() => resolveUnitForLesson(lessonId).id, [lessonId]);
  const words = useMemo(() => getWords(group.wordIds, unitId), [group.wordIds, unitId]);
  const topics = useMemo(() => resolveUnitForLesson(lessonId).topics, [lessonId]);

  const [activeId, setActiveId] = useState<string>(words[0].id);
  const [isMobileBrowseOpen, setIsMobileBrowseOpen] = useState(false);
  const { speak, stop, isPlaying, isError } = useAudio({ lang: "en-US", rate: 0.8 });
  const mountedRef = useRef(false);

  const activeWord = words.find((v) => v.id === activeId) ?? words[0];

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
        setTimeout(() => speak(word.label), 160);
      }
    },
    [activeId, isPlaying, speak, stop, words]
  );

  /**
   * Starts a fresh Game Mode session for this group, queued so the word the
   * learner was just looking at comes up first — the same intent the old
   * combined flow had (LESSON_SELECT_WORD reordering an in-progress lesson's
   * queue), just built once up front instead of via a second dispatch, since
   * Learn Mode no longer runs inside lesson state to reorder.
   */
  const handlePlayGame = useCallback(() => {
    stop();
    const wordQueue = [activeId, ...group.wordIds.filter((id) => id !== activeId)];
    dispatch({ type: "START_LESSON", lessonId, mode: "SKILL_PRACTICE", wordQueue });
  }, [stop, dispatch, activeId, group.wordIds, lessonId]);

  const handleClose = useCallback(() => {
    stop();
    dispatch({ type: "GO", to: "lesson-entry" });
  }, [stop, dispatch]);

  return (
    <div className="fixed inset-0 z-40 bg-background flex flex-col lg:flex-row overflow-hidden overscroll-none">
      {/* Accessible live region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPlaying ? `Now playing: ${activeWord.label}` : `Selected: ${activeWord.label}`}
      </div>

      <SceneCanvas
        activeWord={activeWord}
        groupName={group.name}
        activeId={activeId}
        isPlaying={isPlaying}
        isError={isError}
        onSelectWord={handleSelectWord}
        onPlayGame={handlePlayGame}
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
        onPlayGame={handlePlayGame}
        mobileOpen={isMobileBrowseOpen}
        onMobileClose={() => setIsMobileBrowseOpen(false)}
      />
    </div>
  );
});
