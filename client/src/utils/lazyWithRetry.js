import { lazy } from "react";

/**
 * Enhanced lazy loading wrapper that automatically catches chunk loading failures
 * (e.g. after a new build deployment) and reloads the page once to retrieve fresh assets.
 */
export function lazyWithRetry(componentImport) {
  return lazy(async () => {
    const pageHasBeenReloaded = sessionStorage.getItem("page_reloaded_for_chunk_error");

    try {
      const res = await componentImport();
      sessionStorage.removeItem("page_reloaded_for_chunk_error");

      // Handle standard default export, named export fallback, or direct component
      if (res && res.default) {
        return res;
      }
      if (typeof res === "function" || (typeof res === "object" && res !== null)) {
        return { default: res.default || res };
      }

      throw new TypeError("Lazy component import resolved to undefined export");
    } catch (error) {
      const errorMsg = error?.message || "";
      const isChunkError =
        error?.name === "ChunkLoadError" ||
        errorMsg.includes("Failed to fetch dynamically imported module") ||
        errorMsg.includes("Expected a JavaScript-or-Wasm module script") ||
        errorMsg.includes("MIME type");

      if (isChunkError && !pageHasBeenReloaded) {
        console.warn("Chunk load error detected (new deployment). Auto-refreshing page...");
        sessionStorage.setItem("page_reloaded_for_chunk_error", "true");
        window.location.reload();
        return new Promise(() => {});
      }

      throw error;
    }
  });
}
