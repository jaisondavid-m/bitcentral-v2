import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./Layout/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { StudentContext } from "./context/StudentContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <StudentContext>
          <App />
        </StudentContext>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);