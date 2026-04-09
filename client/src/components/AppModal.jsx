import { useEffect, useRef } from "react";

export default function AppModal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const root = dialogRef.current;
    const focusable = root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="app-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="app-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={dialogRef}
      >
        <button
          className="app-modal-close"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          x
        </button>
        <h3 className="app-modal-title">{title}</h3>
        {children}
      </div>
    </div>
  );
}
