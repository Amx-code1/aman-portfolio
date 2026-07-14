
import React from 'react';
import './PaperPlane.css';

export function PaperPlane({ flying }: { flying: boolean }) {
  return (
    <div className={`plane ${flying ? 'is-flying' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="plane__svg">
        <defs>
          <linearGradient id="plane-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#9b5de5" />
          </linearGradient>
        </defs>
        <path d="M4 32 L60 8 L40 58 L32 40 Z" fill="url(#plane-grad)" />
        <path d="M32 40 L60 8 L40 58 Z" fill="rgba(255,255,255,0.28)" />
        <path d="M4 32 L32 40 L40 58 L60 8 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      </svg>
    </div>
  );
}
