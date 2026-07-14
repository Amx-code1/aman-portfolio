
import React from 'react';
import './WorkPoster.css';

interface WorkPosterProps {
  theme: string;
  index: number;
}

function WorkPosterBase({ theme, index }: WorkPosterProps) {
  const variant = index % 4;
  const uid = `poster-${index}`;

  return (
    <svg
      className="poster"
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Abstract animated poster artwork"
    >
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id={`${uid}-r`} cx="0.5" cy="0.38" r="0.75">
          <stop offset="0%" stopColor={theme} stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="500" fill="#0c0c14" />
      <rect width="400" height="500" fill={`url(#${uid}-r)`} />

      {variant === 0 && (
        <g opacity="0.85">
          <circle cx="200" cy="230" r="140" fill="none" stroke={theme} strokeWidth="1.4" opacity="0.45" />
          <circle cx="200" cy="230" r="92" fill={`url(#${uid}-g)`} opacity="0.8" />
          <line x1="0" y1="130" x2="400" y2="130" stroke={theme} strokeWidth="1" opacity="0.3" />
          <line x1="0" y1="360" x2="400" y2="360" stroke={theme} strokeWidth="1" opacity="0.3" />
        </g>
      )}

      {variant === 1 && (
        <g opacity="0.9">
          <circle cx="260" cy="200" r="120" fill={`url(#${uid}-g)`} opacity="0.85" />
          <path d="M-40 420 L440 -20" stroke={theme} strokeWidth="1.2" opacity="0.35" />
          <path d="M-40 470 L440 30" stroke={theme} strokeWidth="1.2" opacity="0.25" />
          <rect x="40" y="320" width="120" height="120" fill="none" stroke={theme} strokeWidth="1.4" opacity="0.5" transform="rotate(18 100 380)" />
        </g>
      )}

      {variant === 2 && (
        <g opacity="0.9">
          <path d="M0 500 L200 120 L400 500 Z" fill={`url(#${uid}-g)`} opacity="0.8" />
          <path d="M60 500 L200 200 L340 500" fill="none" stroke={theme} strokeWidth="1.4" opacity="0.6" />
          <circle cx="200" cy="120" r="10" fill={theme} />
          <line x1="200" y1="0" x2="200" y2="500" stroke={theme} strokeWidth="1" opacity="0.25" />
        </g>
      )}

      {variant === 3 && (
        <g opacity="0.85">
          <circle cx="200" cy="250" r="150" fill="none" stroke={theme} strokeWidth="1" opacity="0.4" />
          <circle cx="200" cy="250" r="100" fill="none" stroke={theme} strokeWidth="1" opacity="0.5" />
          <circle cx="200" cy="250" r="54" fill={`url(#${uid}-g)`} opacity="0.85" />
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={60 + i * 35} cy={60 + (i % 3) * 30} r="2.4" fill={theme} opacity="0.7" />
          ))}
          <line x1="0" y1="430" x2="400" y2="430" stroke={theme} strokeWidth="1" opacity="0.3" />
        </g>
      )}
    </svg>
  );
}

export const WorkPoster = React.memo(WorkPosterBase);
