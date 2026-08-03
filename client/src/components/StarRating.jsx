import React, { useState } from 'react';
import { Star } from 'lucide-react';

// Shared star rating widget — read-only display or interactive input, dark or light variant
export default function StarRating({
  value = 0,
  onChange,
  size = 'md',
  variant = 'dark',
}) {
  const [hovered, setHovered] = useState(0);
  const interactive = typeof onChange === 'function';
  const display = hovered || value;

  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  }[size] || 'h-5 w-5';

  const emptyColor = variant === 'dark' ? 'text-dark-border' : 'text-card-border';

  return (
    <div
      className={`flex items-center gap-0.5 ${interactive ? 'cursor-pointer' : ''}`}
      onMouseLeave={() => interactive && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          tabIndex={interactive ? 0 : -1}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`${sizeClasses} transition-colors ${
              star <= display ? 'text-saffron-500 fill-saffron-500' : emptyColor
            }`}
          />
        </button>
      ))}
    </div>
  );
}
