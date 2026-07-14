
import React, { useId } from 'react';
import './CharacterSilhouette.css';

export function CharacterSilhouette({ className }: { className?: string }) {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');

  return (
    <svg
      className={`char-silhouette ${className ?? ''}`}
      viewBox="0 0 320 520"
      role="img"
      aria-label="Stylized anime character silhouette"
    >
      <defs>
        <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a18" />
          <stop offset="60%" stopColor="#14143a" />
          <stop offset="100%" stopColor="#1c1c44" />
        </linearGradient>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#9b5de5" />
          <stop offset="100%" stopColor="#ff5c8a" />
        </linearGradient>
      </defs>
      <g>
        {/* Wind-blown hair — right */}
        <path
          d="M188 52 C 224 56, 248 92, 250 152 C 252 206, 238 268, 222 308 C 234 256, 226 204, 208 162 C 200 120, 194 80, 188 52 Z"
          fill={`url(#${uid}-fill)`}
        />
        {/* Wind-blown hair — left */}
        <path
          d="M132 52 C 96 56, 74 94, 72 144 C 70 186, 84 226, 98 256 C 88 214, 98 174, 114 142 C 122 112, 126 80, 132 52 Z"
          fill={`url(#${uid}-fill)`}
        />
        {/* Cloak / body */}
        <path
          d="M160 92 C 132 92, 116 110, 110 140 C 96 200, 80 300, 62 432 C 58 462, 70 484, 98 486 L 222 486 C 250 484, 262 462, 258 432 C 240 300, 224 200, 210 140 C 204 110, 188 92, 160 92 Z"
          fill={`url(#${uid}-fill)`}
        />
        {/* Head */}
        <ellipse cx="160" cy="76" rx="29" ry="33" fill={`url(#${uid}-fill)`} />
        {/* Front fringe */}
        <path
          d="M131 60 C 140 44, 180 44, 189 60 C 180 54, 170 70, 166 84 C 158 70, 150 64, 142 72 C 138 64, 134 60, 131 60 Z"
          fill={`url(#${uid}-fill)`}
        />
        {/* Sword */}
        <rect x="196" y="150" width="5" height="300" rx="2.5" fill="#0a0a18" />
        <rect x="186" y="250" width="25" height="7" rx="3" fill="#0a0a18" />
        <rect x="194" y="257" width="9" height="42" rx="3" fill="#0a0a18" />
        {/* Rim light */}
        <path d="M110 140 C 96 200, 80 300, 62 432" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="2.5" opacity="0.9" />
        <path d="M132 52 C 96 56, 74 94, 72 144" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="2" opacity="0.6" />
        <path d="M131 60 C 140 44, 180 44, 189 60" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="1.6" opacity="0.7" />
      </g>
    </svg>
  );
}
