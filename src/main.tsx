import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { readLanguage } from "./i18n/language";
import "./styles.css";
import "./grim-delve.css";
import "./skydeck.css";

const splash = document.getElementById("cf-startup");
let storage: Storage | null = null;
try { storage = window.localStorage; } catch { /* optional storage */ }
const locale = readLanguage(storage, navigator.languages);
const stage = document.getElementById("cf-stage");
if (stage) stage.textContent = locale === "fr" ? "Chargement de CardForge…" : "Loading CardForge…";
function StartupApp() {
  React.useEffect(() => {
    const progress = document.getElementById("cf-progress") as HTMLProgressElement | null;
    const number = document.getElementById("cf-progress-number");
    if (progress) progress.value = 100;
    if (number) number.textContent = "100 %";
    splash?.classList.add("cf-startup--done");
    const timer = window.setTimeout(() => splash?.remove(), 320);
    return () => window.clearTimeout(timer);
  }, []);
  return <App />;
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode><StartupApp /></React.StrictMode>
);
