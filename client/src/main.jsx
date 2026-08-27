import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./Layout/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

const queryClient = new QueryClient();

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
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
