import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function PasswordField({ id, label, error, hint, showLabel, hideLabel, className = '', ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-semibold text-body mb-1.5 font-sans">
        {label}
      </label>
      <div className="relative font-sans">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={`w-full rounded-2xl border bg-ivory py-2.5 pl-10 pr-11 text-sm text-heading placeholder:text-muted transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-card-border focus:border-maroon-700 focus:ring-maroon-700/20'
          }`}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-maroon-700 transition-colors cursor-pointer"
          aria-label={visible ? hideLabel : showLabel}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-500 font-sans">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted font-sans">{hint}</p>
      ) : null}
    </div>
  );
}
