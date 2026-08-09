import { memo } from "react";
import type { TabId, Action } from "../types";
import { SidebarNav } from "./SidebarNav";
import { BottomTabBar } from "./BottomTabBar";
import { MobileHeader } from "./MobileHeader";

interface Props {
  activeTab: TabId;
  dispatch: React.Dispatch<Action>;
  children: React.ReactNode;
}

/**
 * Responsive application shell for all main tabbed screens.
 *
 * Mobile  (<768px): Sticky mobile header, bottom tab bar pinned at viewport bottom, safe-area aware.
 * Desktop (768px+): Adaptive sidebar on the left.
 */
export const AppShell = memo(function AppShell({ activeTab, dispatch, children }: Props) {
  return (
    <div className="min-h-svh bg-background flex flex-col lg:flex-row">
      {/* Centered container — caps layout width on ultra-wide screens */}
      <div className="min-h-svh flex w-full max-w-screen-2xl mx-auto relative">
        {/* Left sidebar — visible on md+ only */}
        <SidebarNav activeTab={activeTab} dispatch={dispatch} />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 h-svh relative">
          {/* Mobile Header - hidden on lg+ */}
          <MobileHeader dispatch={dispatch} />

          {/* Scrollable content area */}
          <main
            id="main-content"
            className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+96px)] lg:pb-6 pt-6 -webkit-overflow-scrolling-touch"
            tabIndex={-1}
          >
            <div className="mx-auto max-w-7xl w-full px-4 lg:px-8">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile bottom bar — hidden on lg+ */}
        <div
          className="lg:hidden fixed bottom-0 inset-x-0 z-40"
          aria-hidden="false"
        >
          <BottomTabBar activeTab={activeTab} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
});

