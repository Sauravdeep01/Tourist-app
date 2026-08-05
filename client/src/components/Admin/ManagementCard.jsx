import React from 'react';
import { ArrowRight } from 'lucide-react';

// Reusable Management Card Component for Website Management Grid
export default function ManagementCard({
  icon: Icon,
  title,
  description,
  buttonText,
  gradientBg = 'from-maroon-700 to-maroon-900',
  iconColor = 'text-white',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="bg-white rounded-[20px] p-6 border border-card-border/80 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-full relative overflow-hidden outline-none focus:ring-2 focus:ring-saffron-500/50 hover:border-saffron-500/40"
    >
      {/* Decorative accent background on hover */}
      <div className="absolute inset-0 bg-linear-to-b from-ivory/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10">
        {/* Large colored icon inside circular background */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={`w-14 h-14 rounded-2xl bg-linear-to-br ${gradientBg} ${iconColor} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="h-7 w-7" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-600 bg-saffron-500/10 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Action
          </span>
        </div>

        {/* Bold Heading */}
        <h3 className="text-lg font-bold text-heading font-serif group-hover:text-maroon-700 transition-colors">
          {title}
        </h3>

        {/* Small Description */}
        <p className="text-xs text-body leading-relaxed mt-2 font-sans min-h-10">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-4">
        {/* Divider */}
        <div className="w-full h-px bg-card-border/80 my-4" />

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="w-full flex items-center justify-between bg-ivory hover:bg-maroon-700 text-maroon-700 hover:text-white font-bold text-xs px-4 py-3 rounded-xl border border-card-border hover:border-maroon-700 transition-all duration-300 shadow-xs cursor-pointer group/btn"
        >
          <span>{buttonText}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
