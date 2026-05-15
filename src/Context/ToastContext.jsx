import { createContext, useContext, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
//  CREATE CONTEXT
// ─────────────────────────────────────────────────────────────
const ToastContext = createContext();

// ─────────────────────────────────────────────────────────────
//  CUSTOM HOOK
//  Use anywhere: const { showToast } = useToast();
// ─────────────────────────────────────────────────────────────
export function useToast() {
  return useContext(ToastContext);
}

// ─────────────────────────────────────────────────────────────
//  TOAST PROVIDER
// ─────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {

  const [toasts, setToasts] = useState([]);

  // ── SHOW TOAST ───────────────────────────────────────────
  // type: "success" | "error" | "warning" | "info"
  // duration: how long toast stays (ms) — default 3000
  const showToast = useCallback(({ message, type = "success", duration = 3000 }) => {
    const id = Date.now() + Math.random(); // unique id

    // Add toast to list
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  // ── REMOVE TOAST ─────────────────────────────────────────
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── SHORTCUT FUNCTIONS ───────────────────────────────────
  const success = useCallback((message, duration) =>
    showToast({ message, type: "success", duration }), [showToast]);

  const error = useCallback((message, duration) =>
    showToast({ message, type: "error", duration }), [showToast]);

  const warning = useCallback((message, duration) =>
    showToast({ message, type: "warning", duration }), [showToast]);

  const info = useCallback((message, duration) =>
    showToast({ message, type: "info", duration }), [showToast]);

  return (
    <ToastContext.Provider value={{
      toasts,
      showToast,
      removeToast,
      success,
      error,
      warning,
      info,
    }}>
      {children}
    </ToastContext.Provider>
  );
}