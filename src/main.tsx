import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initErrorLogging } from "./lib/errorLogger";

// Initialize global error logging
initErrorLogging();

createRoot(document.getElementById("root")!).render(<App />);
