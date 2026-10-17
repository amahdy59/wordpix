import { memo, useEffect, useRef, useState } from "react";
import type { TabId, Action } from "../types";
import { SidebarNav } from "./SidebarNav";
import { BottomTabBar } from "./BottomTabBar";
import { MobileHeader } from "./MobileHeader";
import { NetworkStatusBanner } from "./NetworkStatusBanner";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";

interface Props {
  activeTab: TabId;
  dispatch: React.Dispatch<Action>;
  children: React.ReactNode;
}

/**
 * Responsive application shell for all main tabbed screens.
 *
 * Mobile/tablet (<1024px): Sticky header and safe-area-aware bottom navigation.
 * Desktop (1024px+): Fully labelled sidebar; no intermediate clipped icon rail.
 */
export const AppShell = memo(function AppShell({ activeTab, dispatch, children }: Props) {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const bottomNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = bottomNavRef.current;
    if (!element) return;
    const update = () =>
      document.documentElement.style.setProperty(
        "--wp-bottom-nav-height",
        `${element.getBoundingClientRect().height + 24}px`
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--wp-bottom-nav-height");
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const scrolled = e.currentTarget.scrollTop > 8;
    if (scrolled !== isScrolled) setIsScrolled(scrolled);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-dvh max-h-dvh w-full max-w-full overflow-hidden bg-background flex flex-col lg:flex-row relative">
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Left sidebar — visible on md+ only. Hugs the left edge natively. */}
      <SidebarNav
        activeTab={activeTab}
        dispatch={dispatch}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-dvh overflow-hidden relative">
        {/* Mobile Header - hidden on lg+ */}
        <MobileHeader dispatch={dispatch} isScrolled={isScrolled} />

        {/* Scrollable content area */}
        <main
          id="main-content"
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-y-contain pb-[var(--wp-bottom-nav-height,96px)] scroll-pb-[var(--wp-bottom-nav-height,96px)] lg:pb-8 lg:scroll-pb-6 pt-4 sm:pt-6 lg:pt-8 -webkit-overflow-scrolling-touch"
          tabIndex={-1}
        >
          {/* A single fluid canvas keeps every tab aligned while still using wide screens well. */}
          <div className="wp-container-shell wp-layout-gutter">
            <NetworkStatusBanner />
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom bar — hidden on lg+ */}
      <div
        ref={bottomNavRef}
        className="lg:hidden fixed bottom-0 inset-x-0 z-40"
        aria-hidden="false"
      >
        <BottomTabBar activeTab={activeTab} dispatch={dispatch} />
      </div>
    </div>
  );
});
