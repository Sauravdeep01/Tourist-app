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
    ? 'border-[#D14343] shadow-[0_0_0_4px_rgba(209,67,67,0.15)]'
    : showSuccess
    ? 'border-[#2E8B57] shadow-[0_0_0_4px_rgba(46,139,87,0.15)]'
    : focused
    ? 'border-saffron-500 shadow-[0_0_0_4px_rgba(198,146,46,0.18)]'
    : 'border-[#D7DDE5] hover:border-[#B9C3CF] shadow-[inset_0_1px_3px_rgba(16,24,40,0.04)]';

  const iconColor = showError ? 'text-[#D14343]' : showSuccess ? 'text-[#2E8B57]' : 'text-maroon-700';
  const labelColor = showError ? 'text-[#D14343]' : showSuccess ? 'text-[#2E8B57]' : focused ? 'text-maroon-700' : 'text-[#4B4B4B]';

  const sideOffset = Icon ? 44 : 16;

  return (
    <div className="font-sans">
      <div className={`relative rounded-[14px] border-2 bg-[#F6F7F9] transition-all duration-300 ${stateColor}`} style={{ height: 58 }}>
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
          className="absolute inset-0 w-full h-full bg-transparent outline-none text-sm text-heading transition-[padding] duration-200 font-sans"
        />

        <label
          htmlFor={name}
          style={{ left: sideOffset }}
          className={`absolute pointer-events-none transition-all duration-200 ease-out ${labelColor} ${
            floated ? 'top-2.25 text-[10px] font-bold tracking-wide uppercase' : 'top-1/2 -translate-y-1/2 text-sm'
          }`}
        >
          {label}
          {required && <span className="text-maroon-700 ml-0.5">*</span>}
        </label>

        {(showError || showSuccess) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {showError ? <AlertCircle className="h-4 w-4 text-[#D14343]" /> : <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />}
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
            className="text-[11px] text-[#D14343] pl-1 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
