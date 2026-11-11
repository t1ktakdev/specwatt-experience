import React from "react";
import { createRoot } from "react-dom/client";
import "./fonts.css";
import App from "./App";
import "./style.css";
import "./secondary.css";
import "./tokens.css";
import "./v3.css";
import "./v4.css";
import "./v41.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
