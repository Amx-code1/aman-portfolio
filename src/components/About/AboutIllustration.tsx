
import React from 'react';
import './AboutIllustration.css';

type Variant = 'wind' | 'horizon' | 'core';

const HORIZON_STARS = [
  { x: 40, y: 46 },
  { x: 96, y: 70 },
  { x: 150, y: 38 },
  { x: 210, y: 84 },
  { x: 70, y: 110 },
  { x: 260, y: 54 },
];

export function AboutIllustration({
  variant = 'wind',
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const raw = React.useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');

  if (variant === 'wind') {
    return (
      <svg
        className={`about-ill about-ill--wind ${className ?? ''}`}
        viewBox="0 0 400 280"
        role="img"
        aria-label="Flowing wind and petals illustration"
      >
        <defs>
          <linearGradient id={`${uid}-w`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(0,240,255,0)" />
            <stop offset="50%" stopColor="rgba(0,240,255,0.9)" />
            <stop offset="100%" stopColor="rgba(155,93,229,0)" />
          </linearGradient>
        </defs>
        <g className="about-ill__lines" stroke={`url(#${uid}-w)`} fill="none">
          <path d="M-30 70 C 120 30, 260 110, 440 60" />
          <path d="M-30 140 C 120 100, 260 180, 440 130" />
          <path d="M-30 210 C 120 170, 260 250, 440 200" />
        </g>
        <g className="about-ill__ring" stroke="rgba(255,92,138,0.6)" fill="none">
          <circle cx="322" cy="78" r="42" />
        </g>
        <g className="about-ill__petal">
          <path d="M0 0 C 7 -5, 13 -1, 9 7 C 5 11, -2 7, 0 0 Z" fill="rgba(255,150,190,0.92)" />
        </g>
      </svg>
    );
  }

  if (variant === 'horizon') {
    return (
      <svg
        className={`about-ill about-ill--horizon ${className ?? ''}`}
        viewBox="0 0 400 280"
        role="img"
        aria-label="Moon, stars and mountain silhouette illustration"
      >
        <circle className="about-ill__sun" cx="300" cy="92" r="46" fill="rgba(255,224,170,0.9)" />
        <g className="about-ill__stars">
          {HORIZON_STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={i % 2 ? 1.6 : 2.2} fill="rgba(226,232,255,0.9)" />
          ))}
        </g>
        <g className="about-ill__mtn" fill="rgba(10,10,26,0.92)">
          <path d="M-20 280 L 80 150 L 160 280 Z" />
          <path d="M120 280 L 232 118 L 344 280 Z" />
          <path d="M286 280 L 362 168 L 440 280 Z" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      className={`about-ill about-ill--core ${className ?? ''}`}
      viewBox="0 0 400 280"
      role="img"
      aria-label="Pulsing energy core illustration"
    >
      <g className="about-ill__core-rings" stroke="rgba(0,240,255,0.55)" fill="none">
        <circle cx="200" cy="140" r="42" />
        <circle cx="200" cy="140" r="84" />
        <circle cx="200" cy="140" r="126" />
      </g>
      <circle className="about-ill__core-dot" cx="200" cy="140" r="14" fill="rgba(155,93,229,0.95)" />
    </svg>
  );
}
