import { memo } from "react";
import type { TabId, Action } from "../types";
import { SidebarNav } from "./SidebarNav";
import { BottomTabBar } from "./BottomTabBar";

interface Props {
  activeTab: TabId;
  dispatch: React.Dispatch<Action>;
  children: React.ReactNode;
}

/**
 * Responsive application shell for all main tabbed screens.
 *
 * Mobile  (<768px): bottom tab bar pinned at viewport bottom.
 * Desktop (768px+): 72px icon-only sidebar on the left.
 */
export const AppShell = memo(function AppShell({ activeTab, dispatch, children }: Props) {
  return (
    <div className="min-h-svh flex bg-background">
      {/* Left sidebar — visible on md+ only */}
      <SidebarNav activeTab={activeTab} dispatch={dispatch} />

      {/* Scrollable content area */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto pb-[88px] md:pb-0"
        tabIndex={-1}
      >
        <div className="mx-auto max-w-6xl w-full">
          {children}
        </div>
      </main>

      {/* Mobile bottom bar — hidden on md+ */}
      <div
        className="md:hidden fixed bottom-0 inset-x-0 z-40"
        aria-hidden="false"
      >
        <BottomTabBar activeTab={activeTab} dispatch={dispatch} />
      </div>
    </div>
  );
});
