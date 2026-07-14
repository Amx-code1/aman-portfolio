
import React, { useId } from 'react';
import './MagicPortal.css';

export function MagicPortal() {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div className="portal" aria-hidden="true">
      <div className="portal__glow" />
      <svg className="portal__svg" viewBox="0 0 300 300">
        <defs>
          <linearGradient id={`${uid}-p`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="50%" stopColor="#9b5de5" />
            <stop offset="100%" stopColor="#ff5c8a" />
          </linearGradient>
        </defs>
        <circle
          className="portal__ring portal__ring--1"
          cx="150"
          cy="150"
          r="132"
          fill="none"
          stroke={`url(#${uid}-p)`}
          strokeWidth="1.5"
          strokeDasharray="6 10"
        />
        <circle
          className="portal__ring portal__ring--2"
          cx="150"
          cy="150"
          r="102"
          fill="none"
          stroke={`url(#${uid}-p)`}
          strokeWidth="1"
          strokeDasharray="2 8"
        />
        <circle
          className="portal__ring portal__ring--3"
          cx="150"
          cy="150"
          r="72"
          fill="none"
          stroke={`url(#${uid}-p)`}
          strokeWidth="2"
        />
        <circle
          className="portal__ring portal__ring--4"
          cx="150"
          cy="150"
          r="42"
          fill="none"
          stroke={`url(#${uid}-p)`}
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <g className="portal__runes">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x="148"
              y="18"
              width="4"
              height="10"
              fill={`url(#${uid}-p)`}
              transform={`rotate(${i * 30} 150 150)`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
