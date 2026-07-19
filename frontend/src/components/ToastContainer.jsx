import { useEffect } from 'react';
import './ToastContainer.css';

const AUTO_DISMISS_MS = 4000;

const TONE_ICON = {
  xp: '✨',
  bonus: '🌟',
  streak: '🔥',
  badge: '🏅',
};

/** A single toast that removes itself after AUTO_DISMISS_MS. */
function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <li className={`toast toast--${toast.tone}`}>
      <span className="toast__icon" aria-hidden="true">
        {TONE_ICON[toast.tone] ?? '✨'}
      </span>
      <span className="toast__message">{toast.message}</span>
      <button
        type="button"
        className="toast__dismiss tap-target"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </li>
  );
}

/**
 * Fixed-position toast stack for XP/streak/badge/perfect-day feedback
 * (spec US-5.1: "celebratory animations ... dismissible").
 * Uses aria-live="polite" so screen readers announce new toasts without
 * interrupting whatever the user is doing.
 *
 * @param {{ toasts: Array<{id:string, tone:string, message:string}>, onDismiss: (id:string)=>void }} props
 */
export default function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <ul className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </ul>
  );
}
