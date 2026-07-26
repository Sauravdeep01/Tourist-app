import React from 'react';

/**
 * Labeled input with a leading icon and red-outline error state (FE-10).
 * `error` is the already-language-resolved message string, or falsy.
 */
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
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-neutral-400" />
        )}
        <input
          id={id}
          className={`w-full rounded-xl border bg-white py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 ${
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
              : 'border-neutral-200 focus:border-maroon-400 focus:ring-maroon-100'
          }`}
          {...inputProps}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-neutral-400">{hint}</p>
      ) : null}
    </div>
  );
}
