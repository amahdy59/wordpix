import { memo, useState } from "react";
import { Home, Compass, RotateCcw, UserCircle, BookOpen, Sliders } from "lucide-react";
import type { TabId, Action } from "../types";
import { ThemeToggle } from "./ThemeToggle";
import { SettingsModal } from "../core/SettingsModal";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home",     label: "Home Dashboard", icon: Home       },
  { id: "explore",  label: "Lessons & Worlds", icon: Compass  },
  { id: "practice", label: "Daily Review",   icon: RotateCcw  },
  { id: "profile",  label: "Learner Profile", icon: UserCircle },
];

interface Props {
  activeTab: TabId;
  dispatch: React.Dispatch<Action>;
}

export const SidebarNav = memo(function SidebarNav({ activeTab, dispatch }: Props) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <aside
      className="hidden md:flex flex-col items-center bg-wp-card border-e border-border
                 w-[80px] shrink-0 py-4 justify-between select-none z-30"
      aria-label="Sidebar navigation"
    >
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

      {/* Top Brand Logo */}
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "home" })}
          title="WordPix Home"
          aria-label="WordPix Home"
          className="size-11 rounded-2xl bg-primary flex items-center justify-center shadow-wp-xs
                     focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary
                     hover:opacity-90 transition-all"
        >
          <BookOpen className="size-5 text-primary-foreground" />
        </button>

        {/* Navigation Items */}
        <nav
          className="flex flex-col items-center gap-2 mt-4"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => dispatch({ type: "GO", to: id })}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                title={label}
                className={`
                  relative size-12 rounded-xl flex items-center justify-center
                  focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2
                  focus-visible:outline-primary transition-all group
                  ${isActive
                    ? "bg-secondary text-primary border border-primary/20 shadow-wp-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <Icon className="size-5 shrink-0" aria-hidden />

                {/* Tooltip on hover */}
                <span className="absolute start-full ms-3 px-2.5 py-1 bg-slate-900 text-white font-sans text-xs font-semibold rounded-lg shadow-wp-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings, Theme Toggle & Profile Shortcut */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          title="Settings & Accessibility"
          aria-label="Settings & Accessibility"
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <Sliders className="size-5" />
        </button>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "profile" })}
          title="Learner Profile"
          aria-label="Learner Profile"
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <UserCircle className="size-6" />
        </button>
      </div>
    </aside>
  );
});
