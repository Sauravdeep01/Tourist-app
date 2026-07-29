import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Bilingual error summary rendered above the form heading. Accepts
 * either locally-validated errors ({field, en, zh}) or server errors already
 * normalized to the same shape via authValidation.js helpers.
 */
export default function ErrorSummary({ errors, lang, title }) {
  if (!errors || errors.length === 0) return null;

  const heading = title || (lang === 'zh' ? '请修正以下问题' : 'Please fix the following');

  return (
    <div
      role="alert"
      className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 animate-in fade-in slide-in-from-top-1 duration-300"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-700">{heading}</p>
          <ul className="mt-1.5 space-y-1 text-xs text-red-600 list-disc list-inside">
            {errors.map((e, idx) => (
              <li key={`${e.field}-${idx}`}>{lang === 'zh' ? e.zh : e.en}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
