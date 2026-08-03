import React from 'react';


export default function FormField({
  id,
  label,
  icon: Icon,
  error,
  hint,
  className = '',
  ...inputProps
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-semibold text-body mb-1.5 font-sans">
        {label}
      </label>
      <div className="relative font-sans">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        )}
        <input
          id={id}
          className={`w-full rounded-2xl border bg-ivory py-2.5 text-sm text-heading placeholder:text-muted transition-colors focus:outline-none focus:ring-2 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-card-border focus:border-maroon-700 focus:ring-maroon-700/20'
          }`}
          {...inputProps}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-500 font-sans">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted font-sans">{hint}</p>
      ) : null}
    </div>
  );
}
