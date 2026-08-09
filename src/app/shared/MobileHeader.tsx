import { memo, useState } from "react";
import { BookOpen, Sliders } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SettingsModal } from "../core/SettingsModal";
import type { Action } from "../types";

interface Props {
  dispatch: React.Dispatch<Action>;
}

/**
 * A native-feeling mobile sticky header.
 * Provides access to the brand logo, Theme toggle, and Settings modal
 * (which are otherwise trapped in the desktop-only SidebarNav).
 */
export const MobileHeader = memo(function MobileHeader({ dispatch }: Props) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      
      <header
        className="lg:hidden sticky top-0 z-40 w-full flex items-center justify-between px-4 h-14 bg-background/85 backdrop-blur-xl border-b border-border pt-[env(safe-area-inset-top)] box-content"
        aria-label="Mobile top navigation"
      >
        {/* Brand / Home Shortcut */}
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "home" })}
          title="WordPix Home"
          aria-label="WordPix Home"
          className="flex items-center gap-2 group focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary rounded-lg"
        >
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center shadow-wp-xs group-hover:opacity-90 transition-all">
            <BookOpen className="size-4 text-primary-foreground" />
          </div>
          <span className="font-sans font-bold text-foreground tracking-tight text-lg">WordPix</span>
        </button>

        {/* Utilities */}
        <div className="flex items-center gap-1">
          <ThemeToggle compact />
          
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            title="Settings & Accessibility"
            aria-label="Settings & Accessibility"
            className="size-10 min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Sliders className="size-5" />
          </button>
        </div>
      </header>
    </>
  );
});
