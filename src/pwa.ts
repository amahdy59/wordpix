export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => console.log("PWA ServiceWorker registered successfully:", reg.scope))
        .catch((err) => console.error("PWA ServiceWorker registration failed:", err));
    });
  }
}

export function isOfflineAvailable(worldId: string = "bedroom"): boolean {
  // Flagship Bedroom world is 100% bundled and available offline
  return worldId === "bedroom";
}
