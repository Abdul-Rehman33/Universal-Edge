import { useState, useEffect } from "react";
import { useToast } from "../../Context/ToastContext.jsx";
import "./Toast.css";

// ─────────────────────────────────────────────────────────────
//  ICONS for each toast type
// ─────────────────────────────────────────────────────────────
const ICONS = {
  success: "✅",
  error:   "❌",
  warning: "⚠️",
  info:    "ℹ️",
};

// ─────────────────────────────────────────────────────────────
//  SINGLE TOAST ITEM
// ─────────────────────────────────────────────────────────────
function ToastItem({ toast }) {
  const { removeToast } = useToast();
  const [removing, setRemoving] = useState(false);

  // Handle close with animation
  const handleClose = () => {
    setRemoving(true);
    setTimeout(() => removeToast(toast.id), 280);
  };

  // Auto remove with animation before context removes it
  useEffect(() => {
    const timer = setTimeout(() => {
      setRemoving(true);
    }, toast.duration - 300);

    return () => clearTimeout(timer);
  }, [toast.duration]);

  return (
    <div
      className={`toast ${toast.type} ${removing ? "removing" : ""}`}
      onClick={handleClose}
      role="alert"
    >
      {/* Icon */}
      <div className="toast-icon">
        {ICONS[toast.type]}
      </div>

      {/* Text */}
      <div className="toast-text">
        <span className="toast-title">{toast.message}</span>
      </div>

      {/* Close button */}
      <button
        className="toast-close"
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5"
          strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Progress bar */}
      <div
        className="toast-progress"
        style={{ animationDuration: `${toast.duration}ms` }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  TOAST CONTAINER — renders all active toasts
//  Place this ONCE in App.jsx inside all providers
// ─────────────────────────────────────────────────────────────
export default function Toast() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}