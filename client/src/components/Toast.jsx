import React, { useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

// Small floating auto-dismissing toast — fixed bottom-right, stacks above other UI.
export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onCloseRef.current(), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 z-[100] flex justify-center sm:justify-end pointer-events-none">
      <div
        role="status"
        className={`pointer-events-auto flex items-center gap-2.5 max-w-sm w-full sm:w-auto px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-200 ${
          isError
            ? 'bg-red-950/95 border-red-800 text-red-200'
            : 'bg-emerald-950/95 border-emerald-800 text-emerald-200'
        }`}
      >
        {isError ? (
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
        )}
        <span className="text-xs sm:text-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
