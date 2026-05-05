import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./Layout/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { StudentContext } from "./context/StudentContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <StudentContext>
            <App />
          </StudentContext>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);