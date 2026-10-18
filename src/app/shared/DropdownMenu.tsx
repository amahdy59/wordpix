import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useId,
  createContext,
  useContext,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DropdownMenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  close: () => void;
  menuId: string;
  triggerId: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu subcomponents must be rendered inside <DropdownMenu>");
  }
  return context;
}

export interface DropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Accessible Dropdown Menu Root
 * Conforms to WCAG 2.2 AAA with keyboard navigation, click-outside dismissal,
 * Escape handling, and focus management.
 */
export function DropdownMenu({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  className = "",
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const rawId = useId();
  const triggerId = `wp-dropdown-trigger-${rawId.replace(/:/g, "")}`;
  const menuId = `wp-dropdown-menu-${rawId.replace(/:/g, "")}`;

  const setIsOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // Close on click outside (pointerdown for responsive touch/mouse handling)
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, close]);

  // Close on Escape and return focus to trigger
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  return (
    <DropdownMenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
        close,
        menuId,
        triggerId,
        triggerRef,
        menuRef,
      }}
    >
      <div ref={containerRef} className={`relative inline-block ${className}`}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps {
  children?: ReactNode;
  icon?: ReactNode;
  ariaLabel?: string;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export function DropdownMenuTrigger({
  children,
  icon,
  ariaLabel,
  title,
  className = "",
  disabled = false,
}: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen, triggerId, menuId, triggerRef, menuRef } = useDropdownMenuContext();

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(true);
      // Wait for next tick so menu is rendered, then focus first item
      requestAnimationFrame(() => {
        const firstItem = menuRef.current?.querySelector<HTMLButtonElement>(
          'button:not([disabled]):not([aria-disabled="true"])'
        );
        firstItem?.focus();
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      requestAnimationFrame(() => {
        const items = menuRef.current?.querySelectorAll<HTMLButtonElement>(
          'button:not([disabled]):not([aria-disabled="true"])'
        );
        if (items && items.length > 0) {
          items[items.length - 1].focus();
        }
      });
    }
  };

  return (
    <button
      ref={triggerRef}
      id={triggerId}
      type="button"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={isOpen ? menuId : undefined}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      disabled={disabled}
      onClick={() => setIsOpen(!isOpen)}
      onKeyDown={handleKeyDown}
      className={
        className ||
        "inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-wp-card px-3 py-2 text-sm font-bold text-foreground shadow-wp-xs transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {icon}
      {children}
    </button>
  );
}

export interface DropdownMenuContentProps {
  children: ReactNode;
  align?: "start" | "end" | "center";
  className?: string;
  sideOffset?: number;
}

export function DropdownMenuContent({
  children,
  align = "end",
  className = "",
  sideOffset = 8,
}: DropdownMenuContentProps) {
  const { isOpen, close, menuId, triggerId, menuRef, triggerRef } = useDropdownMenuContext();
  const [opensAbove, setOpensAbove] = useState(false);

  // Position detection to avoid viewport clipping
  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const updatePlacement = () => {
      const rect = menuRef.current?.getBoundingClientRect();
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      if (!rect || !triggerRect) return;

      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const estimatedHeight = rect.height || 260;

      setOpensAbove(spaceBelow < estimatedHeight && spaceAbove > spaceBelow);
    };

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);
    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [isOpen, triggerRef, menuRef]);

  // Arrow key navigation inside menu
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!menuRef.current) return;

    const items = Array.from(
      menuRef.current.querySelectorAll<HTMLButtonElement>(
        'button:not([disabled]):not([aria-disabled="true"])'
      )
    );

    if (items.length === 0) return;

    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % items.length;
      items[nextIndex]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevIndex = currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1;
      items[prevIndex]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    } else if (event.key === "Tab") {
      close();
    }
  };

  const alignmentClass =
    align === "start" ? "start-0" : align === "center" ? "start-1/2 -translate-x-1/2" : "end-0";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0, scale: 0.96, y: opensAbove ? 4 : -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: opensAbove ? 4 : -4 }}
          transition={{ duration: 0.12 }}
          style={{
            marginTop: opensAbove ? undefined : `${sideOffset}px`,
            marginBottom: opensAbove ? `${sideOffset}px` : undefined,
          }}
          className={`absolute z-50 max-h-[min(32rem,calc(100dvh-4rem))] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-wp-card p-1.5 shadow-wp-lg sm:shadow-wp-xl focus:outline-none ${alignmentClass} ${
            opensAbove ? "bottom-full" : "top-full"
          } ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface DropdownMenuItemProps {
  children: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
  variant?: "default" | "destructive";
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  closeOnClick?: boolean;
  role?: "menuitem" | "button";
  className?: string;
  ariaLabel?: string;
}

export function DropdownMenuItem({
  children,
  icon,
  description,
  trailing,
  variant = "default",
  disabled = false,
  onClick,
  closeOnClick = true,
  role = "button",
  className = "",
  ariaLabel,
}: DropdownMenuItemProps) {
  const { close } = useDropdownMenuContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(event);
    if (closeOnClick) {
      close();
    }
  };

  const isDestructive = variant === "destructive";

  return (
    <button
      type="button"
      role={role}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`group flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${
        isDestructive
          ? "text-wp-rose hover:bg-wp-rose-light/40 hover:text-wp-rose focus:bg-wp-rose-light/40"
          : "text-foreground hover:bg-muted hover:text-foreground focus:bg-muted"
      } ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <span
            className={`shrink-0 transition-colors ${
              isDestructive
                ? "text-wp-rose group-hover:text-wp-rose"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <span className="block truncate text-sm font-semibold sm:text-base">{children}</span>
          {description && (
            <span className="block truncate text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </button>
  );
}

export interface DropdownMenuToggleItemProps {
  label: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  stateText?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  role?: "button" | "menuitemcheckbox";
}

/**
 * Modern Dropdown Menu Toggle Item
 * Displays an icon, clean label, optional subtitle, and an accessible
 * animated toggle switch that shows state clearly in both English and Arabic.
 */
export function DropdownMenuToggleItem({
  label,
  icon,
  description,
  stateText,
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
  ariaLabel,
  role = "button",
}: DropdownMenuToggleItemProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (disabled) return;
    onCheckedChange(!checked);
  };

  return (
    <button
      type="button"
      role={role}
      aria-pressed={role === "button" ? checked : undefined}
      aria-checked={role === "menuitemcheckbox" ? checked : undefined}
      aria-label={ariaLabel}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={handleClick}
      className={`group flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start transition-colors hover:bg-muted focus:bg-muted focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <span
            className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <span className="block text-sm font-semibold text-foreground sm:text-base">{label}</span>
          {description && (
            <span className="block text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {stateText && (
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {stateText}
          </span>
        )}
        {/* Modern Toggle Switch Control */}
        <span
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
            checked ? "bg-primary" : "bg-muted-foreground/30"
          }`}
          aria-hidden="true"
        >
          <span
            className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
              checked ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0.5 rtl:-translate-x-0.5"
            }`}
          />
        </span>
      </div>
    </button>
  );
}

export function DropdownMenuSeparator({ className = "" }: { className?: string }) {
  return <div role="separator" className={`my-1.5 h-px bg-border/70 ${className}`} />;
}

export function DropdownMenuLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-3 pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground ${className}`}
    >
      {children}
    </div>
  );
}
