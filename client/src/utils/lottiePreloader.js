// Centralized preloader and cache for Lottie animations to ensure instant 0ms rendering

export const LOTTIE_FILES = {
  DOGGIE: "/lotties/cute-doggie.lottie",
  MESS: "/lotties/mess.lottie",
};

const lottieCache = new Map();
const fetchPromises = new Map();

/**
 * Preload a single lottie file by URL and cache its ArrayBuffer.
 */
export function preloadLottie(url) {
  if (lottieCache.has(url)) {
    return Promise.resolve(lottieCache.get(url));
  }
  if (fetchPromises.has(url)) {
    return fetchPromises.get(url);
  }

  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.arrayBuffer();
    })
    .then((buffer) => {
      lottieCache.set(url, buffer);
      fetchPromises.delete(url);
      return buffer;
    })
    .catch((err) => {
      console.warn(`Lottie pre-fetch failed for ${url}:`, err);
      fetchPromises.delete(url);
      return null;
    });

  fetchPromises.set(url, promise);
  return promise;
}

/**
 * Preload all registered Lottie files in parallel before page render.
 */
export function preloadAllLotties() {
  const urls = Object.values(LOTTIE_FILES);
  return Promise.allSettled(urls.map((url) => preloadLottie(url)));
}

/**
 * Get ArrayBuffer promise for a given lottie URL.
 */
export function getLottieBuffer(url) {
  if (lottieCache.has(url)) {
    return Promise.resolve(lottieCache.get(url));
  }
  return preloadLottie(url);
}

/**
 * Synchronously retrieve cached ArrayBuffer if already loaded.
 */
export function getLottieBufferSync(url) {
  return lottieCache.get(url) || null;
}

// Trigger pre-fetching of all lotties immediately on module load
preloadAllLotties();
