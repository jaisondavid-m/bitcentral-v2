/**
 * BIT Central - Production Progressive Web App Service Worker
 * Version: 2.1.0
 * Architecture: App Shell + Stale-While-Revalidate Assets + Network-First Navigations
 * Security: Strictly bypasses all API, Auth, Admin, and Payment transactions.
 */

const VERSION = "bitcentral-v2.1.0";
const CACHE_STATIC = `${VERSION}-static`;
const CACHE_DYNAMIC = `${VERSION}-dynamic`;
const CACHE_IMAGES = `${VERSION}-images`;

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/manifest.json",
  "/icons/icon-48x48.png",
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
  "/icons/icon-maskable-512x512.png",
  "/icons/screenshot-wide.png",
  "/icons/screenshot-narrow.png",
  "/CardImgs/Logo.png",
  "/CardImgs/cropped_circle_image.png"
];

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Offline | BIT Central</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
    }
    .card {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 36px 28px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .icon-badge {
      width: 64px;
      height: 64px;
      background: rgba(37, 99, 235, 0.15);
      border: 1px solid rgba(37, 99, 235, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: #3b82f6;
      font-size: 28px;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 10px;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 26px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #2563eb;
      color: #ffffff;
      font-weight: 600;
      font-size: 15px;
      padding: 12px 28px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      width: 100%;
      transition: background 0.2s, transform 0.1s;
    }
    .btn:active {
      transform: scale(0.98);
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-badge">⚡</div>
    <h1>You are currently offline</h1>
    <p>BIT Central cannot reach the campus network right now. Cached academic papers and offline tools remain accessible.</p>
    <button class="btn" onclick="window.location.reload()">Check Connection & Retry</button>
  </div>
</body>
</html>`;

// 1. Install event: Pre-cache core shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Non-critical precache warning:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate event: Clean up old versions
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_STATIC, CACHE_DYNAMIC, CACHE_IMAGES];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
            console.log("[SW] Removing outdated cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch event: Strategic caching
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Security & Boundary Rules: Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  // Security Rule: NEVER cache authenticated backend APIs, admin panels, or auth flows
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/admin") ||
    url.port === "8080" ||
    url.port === "4000"
  ) {
    return;
  }

  // Security Rule: Bypass third-party payment, analytics, ads, and Google OAuth endpoints
  if (
    url.hostname.includes("razorpay") ||
    url.hostname.includes("accounts.google.com") ||
    url.hostname.includes("googletagmanager.com") ||
    url.hostname.includes("google-analytics.com") ||
    url.hostname.includes("pagead2.googlesyndication.com")
  ) {
    return;
  }

  // A. Navigation / HTML Requests: Network-First with Cache / Offline Fallback
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_DYNAMIC).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Attempt matched navigation cache
          const cached = await caches.match(request);
          if (cached) return cached;

          // Attempt App Shell (SPA index.html)
          const appShell = await caches.match("/index.html");
          if (appShell) return appShell;

          // Fallback to standalone offline HTML
          return new Response(OFFLINE_HTML, {
            headers: { "Content-Type": "text/html; charset=utf-8" }
          });
        })
    );
    return;
  }

  // B. Static Assets (Vite chunks in /assets/, fonts, images, icons): Stale-While-Revalidate
  const isStaticAsset =
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/CardImgs/") ||
    url.pathname.startsWith("/lotties/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".woff2");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              const targetCache = url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico)$/i)
                ? CACHE_IMAGES
                : CACHE_DYNAMIC;
              caches.open(targetCache).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // C. Default: Network with Cache Fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// 4. Client Message Event (Instant update trigger)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
