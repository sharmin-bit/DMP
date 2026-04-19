import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ProjectProvider } from "./context/ProjectContext";
import { ToastProvider } from "./components/ToastProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProjectProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ProjectProvider>
  </React.StrictMode>
);