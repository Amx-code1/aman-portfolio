
import React from 'react';
import './Grain.css';

export function Grain() {
  return (
    <div className="grain" aria-hidden="true">
      <svg className="grain__svg" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch">
            <animate
              attributeName="baseFrequency"
              dur="9s"
              values="0.9;0.72;0.9"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}
