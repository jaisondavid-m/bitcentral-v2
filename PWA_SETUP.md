# BIT Central - Progressive Web App (PWA) Setup & Architecture Guide

## Overview

BIT Central is transformed into a standards-compliant, production-ready Progressive Web App (PWA) that works seamlessly on desktop browsers, mobile devices, and as a Trusted Web Activity (TWA) on the Google Play Store.

---

## 1. Architecture & Core Files

| File | Purpose |
| :--- | :--- |
| `client/public/manifest.webmanifest` | Primary W3C Web App Manifest declaring app identity, display mode, icons, shortcuts, and screenshots. |
| `client/public/manifest.json` | Mirrored manifest file ensuring 100% backwards compatibility with legacy tooling and web crawlers. |
| `client/public/sw.js` | Production Service Worker with atomic cache versioning, Stale-While-Revalidate asset caching, and Network-First navigations. |
| `client/public/service-worker.js` | Service Worker bridge importing `/sw.js`. |
| `client/src/serviceWorkerRegistration.js` | Registration and automatic update management (hourly background checks + instant activation on new builds). |
| `client/src/components/common/NetworkStatusToast.jsx` | Dynamic connectivity monitor notifying users when offline and triggering automatic TanStack Query cache re-sync on reconnection. |
| `client/src/components/modals/PWAInstallModal.jsx` | Non-intrusive install prompt with standalone / TWA detection and OS-specific instructions. |
| `client/public/.well-known/assetlinks.json` | Digital Asset Links verification manifest for Google Play Trusted Web Activity (TWA). |

---

## 2. Icon & Asset Matrix

All icons are stored in `client/public/icons/` and generated from the official BIT Central branding:

* `icon-48x48.png` (Standard favicon / micro-viewport)
* `icon-72x72.png` (Android low-density)
* `icon-96x96.png` (Android medium-density & app shortcuts)
* `icon-128x128.png` (Chrome Web Store)
* `icon-144x144.png` (Windows tile / high-density)
* `icon-152x152.png` (iPad touch icon)
* `icon-180x180.png` (iPhone retina touch icon)
* `icon-192x192.png` (Standard Android home screen icon)
* `icon-384x384.png` (Android ultra-high-density)
* `icon-512x512.png` (Standard PWA splash screen & Google Play Store)
* `icon-maskable-192x192.png` (Android adaptive icon with safe-zone padding)
* `icon-maskable-512x512.png` (Android adaptive icon with safe-zone padding)
* `screenshot-wide.png` (1280 × 720 wide dashboard screenshot)
* `screenshot-narrow.png` (720 × 1280 mobile student portal screenshot)

---

## 3. Service Worker Caching Strategies

1. **Static Pre-caching (`CACHE_STATIC`):**
   * App shell: `/`, `/index.html`, `/manifest.webmanifest`, `/manifest.json`.
   * Brand assets and icon suite (48px through 512px).
2. **Navigations (HTML):**
   * **Network-First**: Always attempts to fetch the newest HTML page over the network.
   * If offline, falls back to the cached SPA shell (`/index.html`) or the embedded styled offline fallback page.
3. **Static Chunks & Media (`CACHE_DYNAMIC` / `CACHE_IMAGES`):**
   * **Stale-While-Revalidate**: Immediately serves cached version for ultra-fast render speeds, while updating the cache in the background.
4. **Security & Boundary Rules (NEVER CACHED):**
   * API endpoints (`/api/*`).
   * Authentication endpoints (`/auth/*`).
   * Admin routes (`/admin/*`).
   * Third-party gateways (Google Identity Services, Razorpay, Google Analytics, Google AdSense).
   * All non-`GET` requests (POST, PUT, DELETE, PATCH).

---

## 4. Local Development & Verification

### Running the Website Locally
```powershell
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in Google Chrome.

### Building for Production
```powershell
cd client
npm run build
```
This builds the production bundle and prerenders public routes into `client/dist/`.

### Testing PWA Locally with an HTTP Server
```powershell
cd client
npx serve dist -l 5000
```
Open `http://localhost:5000` in Chrome:
1. Open DevTools (`F12`) -> **Application** tab.
2. Check **Manifest**: Ensure name, icons, start_url, and screenshots display without warnings.
3. Check **Service Workers**: Confirm `/sw.js` is activated and running.
4. Test **Offline**: Check the "Offline" checkbox in DevTools -> Network, and refresh the page to observe offline shell preservation and `NetworkStatusToast`.

