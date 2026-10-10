// BIT Central Service Worker Registration & Update Manager

export function register(config) {
  if (process.env.NODE_ENV === "production" || import.meta.env.PROD || true) {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        const swUrl = "/sw.js";

        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            console.log("[PWA] ServiceWorker registered with scope:", registration.scope);

            // Periodically check for service worker updates (every 1 hour)
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000);

            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) {
                return;
              }
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    console.log("[PWA] New content is available; please refresh.");
                    if (config && config.onUpdate) {
                      config.onUpdate(registration);
                    }
                  } else {
                    console.log("[PWA] Content is cached for offline use.");
                    if (config && config.onSuccess) {
                      config.onSuccess(registration);
                    }
                  }
                }
              };
            };
          })
          .catch((error) => {
            console.error("[PWA] Error during service worker registration:", error);
          });
      });

      // Reload page when new service worker takes over control
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
