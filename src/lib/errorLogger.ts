import { supabase } from "./supabase";

export type ErrorSeverity = "critical" | "error" | "warning" | "db" | "api" | "info";

interface ErrorLog {
  message: string;
  stack?: string;
  path: string;
  user_agent: string;
  severity: ErrorSeverity;
}

let lastErrorMessage = "";
let lastErrorTime = 0;
const THROTTLE_MS = 5000;

export const logError = async (
  message: string, 
  stack?: string, 
  severity: ErrorSeverity = "error",
  context?: string
) => {
  // Prevent spam: don't log if it's a minor UI error or network abort
  if (
    message.toLowerCase().includes("user aborted") || 
    message.toLowerCase().includes("resizeobserver") ||
    message.toLowerCase().includes("canceled") ||
    message.toLowerCase().includes("extension")
  ) {
    return;
  }

  // Deduplication / Throttling
  const now = Date.now();
  if (message === lastErrorMessage && now - lastErrorTime < THROTTLE_MS) {
    return;
  }
  
  lastErrorMessage = message;
  lastErrorTime = now;

  const log: ErrorLog = {
    message: context ? `[${context}] ${message}` : message,
    stack: stack,
    path: window.location.pathname,
    user_agent: navigator.userAgent,
    severity: severity,
  };

  try {
    const { error } = await supabase
      .from('error_logs')
      .insert([log]);
    
    if (error) {
      console.error("Failed to send error to Supabase:", error);
    }
  } catch (err) {
    console.error("Critical failure in error logger:", err);
  }
};

export const initErrorLogging = () => {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    logError(
      event.message || "Unknown Runtime Error",
      event.error?.stack,
      "critical",
      "Runtime"
    );
  });

  window.addEventListener("unhandledrejection", (event) => {
    const message = event.reason?.message || event.reason || "Unhandled Promise Rejection";
    const stack = event.reason?.stack;
    logError(message, stack, "critical", "Promise");
  });
};
