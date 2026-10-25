import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/layouts/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import "@/utils/lottiePreloader.js";
import UnderConstructionPage from "@/components/common/UnderConstructionPage.jsx";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration.js";

const underConstrictionFlag =
  import.meta.env.under_constriction ?? import.meta.env.VITE_under_constriction ?? "";
const isUnderConstrictionEnabled = String(underConstrictionFlag).trim().toLowerCase() === "true";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data as fresh for 5 minutes (prevents repeat requests from 3,000 users)
      staleTime: 5 * 60 * 1000,
      // Keep inactive queries in memory for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Don't refetch whenever student switches browser tabs or apps
      refetchOnWindowFocus: false,
      // Re-sync on network reconnect
      refetchOnReconnect: "always",
      // Single retry to avoid cascading thundering herd on backend
      retry: 1,
    },
  },
});

// Handle stale asset preload errors when a new build is deployed
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  const reloaded = sessionStorage.getItem("vite_preload_reloaded");
  if (!reloaded) {
    sessionStorage.setItem("vite_preload_reloaded", "true");
    window.location.reload();
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isUnderConstrictionEnabled ? (
      <UnderConstructionPage />
    ) : (
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    )}
  </StrictMode>
);

// Register service worker for production-ready PWA functionality
if (isUnderConstrictionEnabled) {
  serviceWorkerRegistration.unregister();
} else {
  serviceWorkerRegistration.register();
}
