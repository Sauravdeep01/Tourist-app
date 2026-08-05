import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// Reusable Stats Card Component for Technical Admin Dashboard
export default function StatsCard({
  icon: Icon,
  title,
  value,
  description,
  iconBg = 'bg-saffron-500/10 text-saffron-600',
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
      className="bg-white rounded-2xl p-5 sm:p-6 border border-card-border/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col justify-between font-sans outline-none focus:ring-2 focus:ring-saffron-500/50"
    >
      {/* Decorative subtle background gradient on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-saffron-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Colored icon inside rounded background */}
          <div
            className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-xs ${iconBg}`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div className="text-muted group-hover:text-maroon-700 transition-colors p-1 rounded-lg group-hover:bg-ivory">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Title */}
        <p className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
          {title}
        </p>

        {/* Value */}
        <p className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight mt-1 font-serif">
          {value}
        </p>
      </div>

      {/* Small Description */}
      {description && (
        <p className="text-xs font-medium text-body/80 mt-3 pt-3 border-t border-card-border/60 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-saffron-500 inline-block shrink-0" />
          <span>{description}</span>
        </p>
      )}
    </div>
  );
}
