
import React from 'react';
import './AnimatedLogo.css';

interface LogoProps {
  onClick?: (e: React.MouseEvent) => void;
}

export function AnimatedLogo({ onClick }: LogoProps) {
  return (
    <a
      className="logo"
      href="#top"
      onClick={onClick}
      aria-label="KAZE 風 — back to top"
      data-cursor="hover"
    >
      <span className="logo__mark" aria-hidden="true">
        <svg className="logo__svg" viewBox="0 0 48 48" role="img">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="52%" stopColor="#9b5de5" />
              <stop offset="100%" stopColor="#ff5c8a" />
            </linearGradient>
          </defs>
          <g
            className="logo__lines"
            fill="none"
            stroke="url(#logoGrad)"
            strokeWidth="2.6"
            strokeLinecap="round"
          >
            <path className="logo__line logo__line--1" d="M5 31 C 16 23, 30 23, 43 31" />
            <path className="logo__line logo__line--2" d="M9 22 C 18 16, 30 16, 39 22" />
            <path className="logo__line logo__line--3" d="M15 14 C 21 10, 27 10, 33 14" />
          </g>
          <circle className="logo__dot" cx="43" cy="31" r="2.8" fill="url(#logoGrad)" />
        </svg>
      </span>
      <span className="logo__word">
        <span className="logo__jp">風</span>
        <span className="logo__text">KAZE</span>
      </span>
    </a>
  );
}
