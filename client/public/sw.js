/* BIT Central Service Worker v1.0.0
 * PWABuilder-compatible production service worker
 * Features: Static pre-caching, Network-First navigation, Stale-While-Revalidate assets, offline support, update handling
 */

const CACHE_NAME = "bitcentral-v1.0.0";
const DYNAMIC_CACHE = "bitcentral-dynamic-v1.0.0";

// Core assets to pre-cache on installation
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/CardImgs/cropped_circle_image.png",
  "/CardImgs/Logo.png",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-180x180.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
  "/icons/icon-maskable-192x192.png",
  "/icons/icon-maskable-512x512.png"
];

// Offline HTML fallback snippet
const OFFLINE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline | BIT Central</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
    .card { background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 32px; max-width: 400px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    h1 { color: #3b82f6; margin-bottom: 12px; font-size: 24px; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    button { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
    button:active { transform: scale(0.96); }
  </style>
</head>
<body>
  <div class="card">
    <h1>You're Offline</h1>
    <p>Please check your internet connection. Some saved pages remain available offline.</p>
    <button onclick="window.location.reload()">Retry Connection</button>
  </div>
</body>
</html>
`;

// 1. Install Event: Pre-cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Pre-caching core assets");
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Pre-cache non-critical error:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up old caches & take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log("[SW] Deleting obsolete cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event Strategy: Network-First for HTML/Navigations, Stale-While-Revalidate for Assets
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Bypass non-GET requests, analytics, adsense, or chrome-extension URLs
  if (
    request.method !== "GET" ||
    url.protocol.startsWith("chrome-extension") ||
    url.hostname.includes("google-analytics") ||
    url.hostname.includes("googletagmanager") ||
    url.hostname.includes("googlesyndication")
  ) {
    return;
  }

  // A. Navigation / HTML requests: Network-First with Cache Fallback & Offline HTML
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const rootCached = await caches.match("/index.html");
          if (rootCached) return rootCached;
          return new Response(OFFLINE_HTML, {
            headers: { "Content-Type": "text/html" }
          });
        })
    );
    return;
  }

  // B. Static Assets (JS, CSS, Images, Fonts, Lotties): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Handle skipWaiting message from client for instant updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// 5. Handle Push Notifications (if integrated)
self.addEventListener("push", (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const options = {
      body: data.body || "New update available on BIT Central",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      vibrate: [100, 50, 100],
      data: { url: data.url || "/" }
    };
    event.waitUntil(self.registration.showNotification(data.title || "BIT Central", options));
  } catch (err) {
    console.error("[SW] Push notification error:", err);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
