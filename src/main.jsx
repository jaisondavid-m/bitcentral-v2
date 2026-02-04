import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./Layout/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { StudentContext } from "./context/StudentContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <StudentContext>
        <App />
      </StudentContext>
    </BrowserRouter>
  </StrictMode>
);