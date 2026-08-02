import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function FloatingInput({
  icon: Icon,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  name,
  maxLength,
  autoComplete,
  inputMode,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const floated = focused || hasValue;
  const showError = touched && !!error;
  const showSuccess = touched && !error && hasValue;

  const stateColor = showError
    ? 'border-red-400/70 focus-within:ring-2 focus-within:ring-red-400/30'
    : showSuccess
    ? 'border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-400/25'
    : 'border-slate-700 focus-within:border-saffron-400 focus-within:ring-2 focus-within:ring-saffron-400/25';

  const iconColor = showError ? 'text-red-400' : showSuccess ? 'text-emerald-400' : focused ? 'text-saffron-400' : 'text-slate-500';
  const labelColor = showError ? 'text-red-400' : showSuccess ? 'text-emerald-400' : focused ? 'text-saffron-400' : 'text-slate-400';

  const sideOffset = Icon ? 44 : 16;

  return (
    <div>
      <div className={`relative rounded-2xl border bg-white/3 transition-colors duration-300 ${stateColor}`} style={{ height: 58 }}>
        {Icon && <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${iconColor}`} />}

        <input
          id={name}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          aria-invalid={showError}
          aria-describedby={showError ? `${name}-error` : undefined}
          style={{
            paddingLeft: sideOffset,
            paddingRight: 40,
            paddingTop: floated ? 22 : 0,
            paddingBottom: floated ? 8 : 0,
          }}
          className="absolute inset-0 w-full h-full bg-transparent outline-none text-sm text-white transition-[padding] duration-200"
        />

        <label
          htmlFor={name}
          style={{ left: sideOffset }}
          className={`absolute pointer-events-none transition-all duration-200 ease-out ${labelColor} ${
            floated ? 'top-2.25 text-[10px] font-semibold tracking-wide uppercase' : 'top-1/2 -translate-y-1/2 text-sm'
          }`}
        >
          {label}
          {required && <span className="text-saffron-400 ml-0.5">*</span>}
        </label>

        {(showError || showSuccess) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {showError ? <AlertCircle className="h-4 w-4 text-red-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showError && (
          <motion.p
            id={`${name}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] text-red-400 pl-1 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
