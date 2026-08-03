import React from 'react';

// Small icon + heading + description used at the top of every step.
export default function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 mb-6 font-sans">
      <div className="h-10 w-10 shrink-0 rounded-2xl bg-maroon-700/10 border border-maroon-700/20 text-maroon-700 flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-serif font-bold text-heading leading-snug">{title}</h3>
        {description && <p className="text-xs text-body mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
