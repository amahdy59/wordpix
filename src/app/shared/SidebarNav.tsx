import { memo } from "react";
import { Home, Globe, RotateCcw, UserCircle } from "lucide-react";
import type { TabId, Action } from "../types";

interface NavItem {
  id: TabId;
  label: string;
  labelAr: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home",     label: "Home",     labelAr: "الرئيسية", icon: Home       },
  { id: "explore",  label: "Explore",  labelAr: "استكشف",   icon: Globe      },
  { id: "practice", label: "Practice", labelAr: "تدرّب",     icon: RotateCcw  },
  { id: "profile",  label: "Profile",  labelAr: "الملف",    icon: UserCircle },
];

interface Props {
  activeTab: TabId;
  dispatch: React.Dispatch<Action>;
}

/**
 * Desktop / tablet sidebar navigation.
 *
 * Tablet (md):  64px wide — icon only.
 * Desktop (lg): 220px wide — icon + label + Arabic subtitle.
 * Mobile:       hidden — BottomTabBar handles mobile navigation.
 */
export const SidebarNav = memo(function SidebarNav({ activeTab, dispatch }: Props) {
  return (
    <aside
      className="hidden md:flex flex-col bg-wp-card border-r border-border
                 w-16 lg:w-[220px] shrink-0"
      aria-label="Sidebar navigation"
    >
      {/* Brand header */}
      <div className="flex items-center gap-3 px-3 py-4 lg:px-5 lg:py-5 border-b border-border">
        {/* using <div> instead of a kit brand component: no kit logo/brand-mark component exists */}
        <div
          className="size-9 rounded-xl bg-primary flex items-center justify-center shrink-0"
          aria-hidden
        >
          <span className="font-sans font-black text-primary-foreground text-base leading-none">W</span>
        </div>
        <div className="hidden lg:flex flex-col leading-none gap-0.5">
          <span className="font-sans font-black text-foreground text-lg leading-none">WordPix</span>
          <span
            className="font-arabic text-primary text-xs"
            dir="auto"
            lang="ar"
          >
            تعلّم الإنجليزية
          </span>
        </div>
      </div>

      {/* Navigation items */}
      <nav
        className="flex-1 flex flex-col gap-1 p-2 lg:p-3"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(({ id, label, labelAr, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            /* using <button> instead of a kit NavButton: no sidebar navigation component exists in the kit */
            <button
              key={id}
              onClick={() => dispatch({ type: "GO", to: id })}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              title={label}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
                min-h-[44px] font-sans
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-primary
                motion-safe:transition-colors
                ${isActive
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <div className="hidden lg:flex flex-col items-start leading-none gap-0.5">
                <span className="font-semibold text-sm">{label}</span>
                <span
                  className="font-arabic text-[10px] opacity-70"
                  dir="auto"
                  lang="ar"
                >
                  {labelAr}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer brand mark */}
      <div className="border-t border-border p-3 lg:p-4">
        <div className="hidden lg:block">
          <p className="font-sans font-semibold text-muted-foreground text-xs">
            WordPix · v1.0
          </p>
        </div>
        {/* Tablet: small brand dot */}
        <div className="flex lg:hidden items-center justify-center">
          <div className="size-2 rounded-full bg-primary opacity-40" aria-hidden />
        </div>
      </div>
    </aside>
  );
});
