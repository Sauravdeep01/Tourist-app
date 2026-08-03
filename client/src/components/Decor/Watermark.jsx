import React from 'react';

const MOTIFS = {
  lotus: (
    <g fill="currentColor">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse key={deg} cx="100" cy="55" rx="18" ry="45" transform={`rotate(${deg} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="14" />
    </g>
  ),
  dharma: (
    <g fill="none" stroke="currentColor" strokeWidth="5">
      <circle cx="100" cy="100" r="80" />
      <circle cx="100" cy="100" r="20" />
      <circle cx="100" cy="100" r="7" fill="currentColor" stroke="none" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x2 = 100 + 80 * Math.sin(rad);
        const y2 = 100 - 80 * Math.cos(rad);
        return <line key={deg} x1="100" y1="100" x2={x2} y2={y2} />;
      })}
    </g>
  ),
  temple: (
    <g fill="currentColor">
      <rect x="40" y="158" width="120" height="16" rx="2" />
      <rect x="55" y="138" width="90" height="16" rx="2" />
      <rect x="70" y="118" width="60" height="16" rx="2" />
      <path d="M74 118 Q100 66 126 118 Z" />
      <rect x="97" y="44" width="6" height="34" />
      <circle cx="100" cy="39" r="7" />
    </g>
  ),
  mountain: (
    <g fill="currentColor">
      <path d="M0 158 L38 96 L68 128 L108 66 L150 120 L180 88 L200 158 Z" opacity="0.55" />
      <path d="M0 176 L48 128 L88 160 L128 106 L168 148 L200 176 Z" />
    </g>
  ),
};

export default function Watermark({ variant = 'lotus', size = 420, className = '' }) {
  const motif = MOTIFS[variant] || MOTIFS.lotus;
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      aria-hidden="true"
      className={`absolute pointer-events-none select-none opacity-3 text-maroon-700 ${className}`}
    >
      {motif}
    </svg>
  );
}
