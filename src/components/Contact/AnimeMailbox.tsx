
import React, { useId } from 'react';
import './AnimeMailbox.css';

interface Props {
  state: 'idle' | 'sending' | 'sent';
}

export function AnimeMailbox({ state }: Props) {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  const cls = `mailbox mailbox--${state}`;

  return (
    <div className={cls} role="img" aria-label="Animated anime mailbox">
      <svg className="mailbox__svg" viewBox="0 0 220 270" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14143a" />
            <stop offset="100%" stopColor="#08081a" />
          </linearGradient>
          <linearGradient id={`${uid}-grad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="52%" stopColor="#9b5de5" />
            <stop offset="100%" stopColor="#ff5c8a" />
          </linearGradient>
          <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(0,240,255,0.55)" />
            <stop offset="100%" stopColor="rgba(0,240,255,0)" />
          </radialGradient>
        </defs>

        <circle className="mailbox__glow" cx="110" cy="120" r="95" fill={`url(#${uid}-glow)`} />

        {/* post */}
        <rect x="98" y="150" width="24" height="105" rx="6" fill={`url(#${uid}-body)`} />
        <rect x="66" y="248" width="88" height="16" rx="6" fill={`url(#${uid}-body)`} />

        {/* body */}
        <g className="mailbox__body">
          <rect
            x="38"
            y="66"
            width="144"
            height="104"
            rx="24"
            fill={`url(#${uid}-body)`}
            stroke={`url(#${uid}-grad)`}
            strokeWidth="2.5"
          />
          <rect x="64" y="98" width="92" height="13" rx="6" fill="#04040a" />
          <path
            d="M38 92 Q38 66 62 66 L158 66 Q182 66 182 92"
            fill="none"
            stroke={`url(#${uid}-grad)`}
            strokeWidth="2"
            opacity="0.7"
          />
          <circle className="mailbox__rune mailbox__rune--1" cx="110" cy="140" r="5" fill="#00f0ff" />

          <path
            className="mailbox__door"
            d="M52 116 L168 116 L168 150 Q168 160 158 160 L62 160 Q52 160 52 150 Z"
            fill="#0c0c20"
            stroke={`url(#${uid}-grad)`}
            strokeWidth="1.5"
          />

          <g className="mailbox__letter">
            <rect x="90" y="92" width="40" height="28" rx="3" fill="#f4f6ff" />
            <path d="M90 92 L110 110 L130 92" fill="none" stroke="#9b5de5" strokeWidth="2" />
          </g>
        </g>

        {/* flag */}
        <g className="mailbox__flag">
          <rect x="180" y="56" width="6" height="64" rx="3" fill="#9b5de5" />
          <path className="mailbox__flag-cloth" d="M186 60 L222 68 L186 82 Z" fill={`url(#${uid}-grad)`} />
        </g>
      </svg>
    </div>
  );
}
