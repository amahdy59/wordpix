import { useState, useRef, useEffect, useId, useLayoutEffect, KeyboardEvent } from "react";
import { ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel?: string;
  className?: string;
  placeholder?: string;
}

export function Select({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
  placeholder = "Select...",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [opensAbove, setOpensAbove] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const selectedOption = options.find((o) => o.value === value);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleDocumentClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [isOpen]);

  // Keep the popup inside the usable viewport. Selects commonly appear near the
  // bottom of scroll panels, where always opening downward makes the final
  // options visually present but impossible to click.
  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const updatePlacement = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const estimatedListHeight = Math.min(options.length * 44 + 8, 240);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpensAbove(spaceBelow < estimatedListHeight && spaceAbove > spaceBelow);
    };

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);
    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [isOpen, options.length]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      containerRef.current?.focus();
      return;
    }

    const currentIndex = options.findIndex((o) => o.value === value);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (currentIndex + 1) % options.length;
      onChange(options[next].value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = currentIndex - 1 < 0 ? options.length - 1 : currentIndex - 1;
      onChange(options[prev].value);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(false);
      containerRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 min-h-[44px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors bg-inherit border-inherit text-inherit font-inherit"
        style={{ minWidth: 0 }}
      >
        <span className="truncate block">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`size-4 opacity-70 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute end-0 z-50 w-full min-w-[200px] overflow-hidden rounded-2xl border border-border bg-wp-card shadow-wp-lg ${
              opensAbove ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              aria-activedescendant={value}
              className="max-h-[min(15rem,calc(100dvh-2rem))] overflow-y-auto overscroll-contain py-1"
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    id={option.value}
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onChange(option.value);
                        setIsOpen(false);
                      }
                    }}
                    className={`flex items-center justify-between gap-2 px-4 py-3 min-h-[44px] cursor-pointer text-sm font-semibold transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
