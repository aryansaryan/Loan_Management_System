import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./app/App";

/**
 * App entry point.
 * Initializes the React root and renders the application.
 */
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* Enables extra runtime checks during development */}
    <App />
  </React.StrictMode>
);
