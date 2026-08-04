import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from 'lenis/react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Reusable centered confirmation modal — used before destructive actions
// (and, more broadly, any "are you sure?" prompt like the Navbar logout flow).
//
// Rendered via a portal straight into <body>. Being called from deep inside
// the page (e.g. the fixed-position Navbar header) doesn't change how it's
// centered — a portal sidesteps any ancestor that could otherwise hijack
// `position: fixed` (a transform, filter, etc. on some parent), so the
// dialog always centers on the current viewport, not the scrolled document.
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  icon: Icon = AlertTriangle,
}) {
  const dialogRef = useRef(null);
  const cancelBtnRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const lenis = useLenis();

  // Lock the background page while the modal is open — no scrolling behind
  // it — and restore normal scrolling the instant it closes.
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lenis?.stop();

    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [open, lenis]);

  // Esc closes the dialog, Tab/Shift+Tab is trapped inside it, and focus
  // moves to the (safe) Cancel button on open and back to whatever
  // triggered it on close — standard modal a11y.
  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement;
    cancelBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel?.();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-90 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="bg-white border border-card-border rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 font-sans"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-red-500" />
          </div>
          <h3 id="confirm-dialog-title" className="text-base font-serif font-bold text-heading">
            {title}
          </h3>
        </div>

        <p id="confirm-dialog-message" className="text-sm text-body leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-card-border text-body text-xs font-semibold hover:bg-beige transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
