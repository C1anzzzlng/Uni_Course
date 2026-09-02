import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Apply dark mode immediately before first render to prevent flash
const stored = localStorage.getItem("xlore-u-theme");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (stored === "dark" || (!stored && systemDark)) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
