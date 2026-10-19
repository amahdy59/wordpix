import { useSyncExternalStore } from "react";

type Preference = "character-shortcuts" | "diagnostics-consent";
const changed = "wordpix:device-preference";
export function readDevicePreference(name: Preference): boolean {
  try {
    return (
      localStorage.getItem(`wordpix:${name}`) === "true" ||
      (name === "character-shortcuts" && localStorage.getItem(`wordpix:${name}`) === null)
    );
  } catch {
    return name === "character-shortcuts";
  }
}
export function setDevicePreference(name: Preference, enabled: boolean) {
  try {
    localStorage.setItem(`wordpix:${name}`, String(enabled));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(changed));
}
function subscribe(listener: () => void) {
  window.addEventListener(changed, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(changed, listener);
    window.removeEventListener("storage", listener);
  };
}
export function useDevicePreference(name: Preference) {
  return useSyncExternalStore(
    subscribe,
    () => readDevicePreference(name),
    () => name === "character-shortcuts"
  );
}
export function isTextInput(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/** Returns true only when shortcuts are enabled in preferences and a fine pointer (keyboard/mouse) is present. */
export function useKeyboardShortcutsActive(): boolean {
  const enabled = useDevicePreference("character-shortcuts");
  const isFinePointer = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mq = window.matchMedia("(pointer: fine)");
      mq.addEventListener?.("change", onStoreChange);
      return () => mq.removeEventListener?.("change", onStoreChange);
    },
    () => typeof window !== "undefined" && Boolean(window.matchMedia?.("(pointer: fine)").matches),
    () => true
  );
  return enabled && isFinePointer;
}
