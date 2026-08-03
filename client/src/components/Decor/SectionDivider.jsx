import React from 'react';


export function WaveDivider({ fill = '#FFFFFF', flip = false, className = '' }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className={`w-full h-10 sm:h-16 ${flip ? 'rotate-180' : ''}`}
      >
        <path
          d="M0,32 C240,90 480,0 720,28 C960,56 1200,10 1440,40 L1440,100 L0,100 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

function LotusMark({ className }) {
  return (
    <svg viewBox="0 0 48 32" className={className} fill="currentColor">
      <path d="M24 32 C24 20 16 14 8 16 C10 24 16 30 24 32 Z" />
      <path d="M24 32 C24 20 32 14 40 16 C38 24 32 30 24 32 Z" />
      <path d="M24 32 C22 18 14 10 6 10 C6 20 14 28 24 32 Z" opacity="0.65" />
      <path d="M24 32 C26 18 34 10 42 10 C42 20 34 28 24 32 Z" opacity="0.65" />
      <path d="M24 32 C24 16 24 4 24 4 C24 16 24 26 24 32 Z" opacity="0.9" />
    </svg>
  );
}

function DharmaMark({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="20" cy="20" r="15" />
      <circle cx="20" cy="20" r="4" fill="currentColor" stroke="none" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x2 = 20 + 15 * Math.sin(rad);
        const y2 = 20 - 15 * Math.cos(rad);
        return <line key={deg} x1="20" y1="20" x2={x2} y2={y2} />;
      })}
    </svg>
  );
}

// Thin Buddhist-inspired divider: a hairline flanking a small lotus or
// dharma-wheel motif. Used between content blocks where a full wave would
// be too heavy.
export function OrnamentDivider({ variant = 'lotus', tone = '#C6922E', className = '' }) {
  const Mark = variant === 'dharma' ? DharmaMark : LotusMark;
  return (
    <div
      className={`flex items-center justify-center gap-4 sm:gap-6 ${className}`}
      aria-hidden="true"
      style={{ color: tone }}
    >
      <span className="h-px w-12 sm:w-28 bg-current opacity-25" />
      <Mark className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
      <span className="h-px w-12 sm:w-28 bg-current opacity-25" />
    </div>
  );
}
